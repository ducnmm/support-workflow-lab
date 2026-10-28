import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, symlinkSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { SupportData, businessDays } from '../src/domain.js';
import { SupportStore } from '../src/store.js';
import { connect,invoke,ROOT } from '../scripts/mcp-client.js';
const data=new SupportData(resolve(ROOT,'data'));
const sources=['support-handbook-v2.md#response-times'];
function temp() { return mkdtempSync(join(tmpdir(),'support-test-')); }
function draft(ticket_id='T-5101', customer_text='Your request needs review. Thank you for your patience.') { return {ticket_id,customer_text,internal_notes:'Verify before sending.',sources}; }

test('all 15 open sample tickets are assessed at export time with valid citations',()=>{
  const list=data.list(); assert.equal(list.length,15); assert.equal(data.tickets.length,30);
  for(const t of list) { const a=data.assess(t.ticket_id); assert.equal(a.category,t.category); assert.equal(a.first_reply_overdue,true); assert.equal(a.review_required,true); assert.ok(a.sources.every(ref=>data.validSource(ref,data.ticket(t.ticket_id))),t.ticket_id); }
});
test('withdrawal lookup and conservative business-day threshold',()=>{
  const a=data.assess('T-5101'); assert.equal(a.category,'withdrawal'); assert.equal(a.route,'Support');
  assert.ok(a.sources.includes('transactions.csv#TX-86901'));
  assert.ok(!a.flags.includes('processing_over_3_business_days'));
  assert.equal(businessDays('2026-09-25T09:00:00Z','2026-09-29T09:00:00Z'),2);
});
test('pending withdrawal escalates and duplicate ticket stays separately represented',()=>{
  for(const id of ['T-5102','T-5110']) { const a=data.assess(id); assert.equal(a.route,'Payments'); assert.ok(a.flags.includes('withdrawal_pending_over_24h')); }
  assert.ok(data.assess('T-5110').related_tickets.includes('T-5102'));
});
test('legal threat is urgent and KYC findings never reach model context',()=>{
  const ctx=data.context('T-5103'), value=JSON.stringify(ctx);
  assert.equal(ctx.assessment.priority,'P1'); assert.equal(ctx.assessment.route,'Team Lead');
  assert.ok(!/selfie|third.party account use|doesn.t seem to match/i.test(value)); assert.ok(!value.includes('kyc_review_reason')); assert.ok(!value.includes('rizal.hakim@example.com'));
});
test('prompt injection remains untrusted evidence and does not become a refund intent',()=>{
  const a=data.assess('T-5104'); assert.equal(a.category,'bonus'); assert.ok(a.flags.includes('suspected_prompt_injection')); assert.ok(!a.flags.includes('refund_review_required'));
});
test('gambling harm takes priority over ordinary support',()=>{
  const a=data.assess('T-5105'); assert.equal(a.category,'gambling_harm'); assert.equal(a.priority,'P1'); assert.equal(a.route,'Team Lead'); assert.ok(a.flags.includes('self_exclusion_action_required'));
});
test('VIP does not override refund approval rules',()=>{
  const a=data.assess('T-5106'); assert.equal(a.route,'Team Lead'); assert.ok(a.sources.includes('support-handbook-v2.md#refunds'));
  assert.match(a.reasons.join(' '),/USD 100/);
});
test('Vietnamese deposit is correctly linked and not credited',()=>{
  const a=data.assess('T-5107'); assert.equal(a.category,'deposit'); assert.ok(a.sources.includes('transactions.csv#TX-86933')); assert.ok(a.flags.includes('failed_deposit_no_credit'));
});
test('third-party request does not retrieve husband records',()=>{
  const ctx=data.context('T-5108'); assert.equal(ctx.assessment.category,'privacy');
  assert.ok(ctx.transactions.every(tx=>tx.customer_id==='C-1005')); assert.ok(!JSON.stringify(ctx).includes('TX-86598'));
});
test('provider completed status is not silently treated as confirmed customer receipt',()=>{
  const a=data.assess('T-5109'); assert.equal(a.route,'Payments'); assert.ok(a.flags.includes('completed_but_receipt_disputed'));
});
test('bonus evaluates expiry and incorrect historical advice without inventing ledger data',()=>{
  const a=data.assess('T-5111'); assert.equal(a.route,'Team Lead'); assert.ok(a.flags.includes('bonus_terms_expired')); assert.ok(a.flags.includes('previous_incorrect_advice')); assert.ok(a.missing_information.some(x=>/ledger/.test(x)));
});
test('missing recovery, KYC SLA, deposit docs and unpublished marketing are not invented',()=>{
  for(const id of ['T-5112','T-5113','T-5114','T-5115']) assert.equal(data.assess(id).route,'Team Lead');
  assert.equal(data.assess('T-5113').category,'kyc'); assert.ok(data.assess('T-5115').flags.includes('unpublished_terms'));
  assert.ok(data.search('refunds').every(x=>x.authority!=='historical'));
  assert.ok(data.search('refunds',true).some(x=>x.authority==='historical'));
});
test('write is idempotent, revised writes retain audit, source stays unchanged',()=>{
  const dir=temp(); try {
    const store=new SupportStore(data,dir,'test'), before=readFileSync(resolve(ROOT,'data/tickets.json'),'utf8');
    const first=store.assessment({ticket_id:'T-5101'}); const second=store.assessment({ticket_id:'T-5101'});
    assert.equal(first.changed,true); assert.equal(second.changed,false); assert.equal(second.revision,1);
    const revised=store.assessment({ticket_id:'T-5101',notes:'A human needs to check the provider.'}); assert.equal(revised.revision,2);
    const saved=JSON.parse(readFileSync(revised.path,'utf8')); assert.equal(saved.history.length,2); assert.equal(saved.status,'pending_human_review');
    assert.equal(readFileSync(resolve(ROOT,'data/tickets.json'),'utf8'),before);
  } finally { rmSync(dir,{recursive:true}); }
});
test('invalid IDs, forged approval, unsafe output locations and symlinks are refused',()=>{
  const dir=temp(); try {
    const store=new SupportStore(data,dir,'test');
    assert.throws(()=>store.assessment({ticket_id:'../../escape'}));
    assert.throws(()=>store.assessment({ticket_id:'T-9999'}));
    assert.throws(()=>store.draft({...draft(),review_required:false}));
    assert.throws(()=>new SupportStore(data,resolve(ROOT,'data')));
    const external=join(dir,'outside.txt'); writeFileSync(external,'untouched'); symlinkSync(external,join(dir,'T-5101.draft.json'));
    assert.throws(()=>store.draft(draft()),/symbolic link/); assert.equal(readFileSync(external,'utf8'),'untouched');
  } finally { rmSync(dir,{recursive:true}); }
});
test('draft guards reject sensitive content, fabricated actions, false sources, unpublished terms',()=>{
  const dir=temp(); try {
    const store=new SupportStore(data,dir,'test');
    assert.throws(()=>store.draft(draft('T-5108','Rahul Nair withdrew $600 last week.')),/another customer/);
    assert.throws(()=>store.draft(draft('T-5103','Your selfie does not match your ID.')),/KYC/);
    assert.throws(()=>store.draft(draft('T-5106',"I've refunded $250 to your account.")),/claim/);
    assert.throws(()=>store.draft(draft('T-5105',"I'm escalating your request right now.")),/in progress/);
    assert.throws(()=>store.draft({...draft(),sources:['support-handbook-v1.md#refunds']}),/current policy/);
    assert.throws(()=>store.draft({...draft(),sources:['transactions.csv#TX-86598']}),/cross-account/);
    assert.throws(()=>store.draft(draft('T-5115','The bonus will be 50% of your deposit.')),/Unpublished/);
    assert.equal(store.draft(draft()).status,'pending_human_review');
  } finally { rmSync(dir,{recursive:true}); }
});
test('real stdio MCP exposes narrow tools, writes, and returns recoverable errors',async()=>{
  const dir=temp(), client=await connect(dir,'integration-test'); try {
    const tools=await client.listTools(); assert.equal(tools.tools.length,7);
    assert.ok(!tools.tools.some(x=>/send|refund|approve/.test(x.name)));
    const ctx=await invoke(client,'get_ticket_context',{ticket_id:'T-5106'}); assert.equal(ctx.assessment.route,'Team Lead');
    const result=await invoke(client,'save_escalation',{ticket_id:'T-5106',notes:'Obtain recorded approval and investigate game evidence.'});
    const saved=JSON.parse(readFileSync(result.path,'utf8')); assert.equal(saved.delivery_status,'not_sent_local_record_only');
    await assert.rejects(()=>invoke(client,'get_ticket_context',{ticket_id:'T-9999'}),/Unknown ticket/);
  } finally { await client.close(); rmSync(dir,{recursive:true}); }
});

test('live-run regressions: pending cannot become processed and incident target is not an arrival promise',()=>{
  const dir=temp(); try {
    const store=new SupportStore(data,dir,'test');
    assert.throws(()=>store.draft(draft('T-5102','Your withdrawal was processed during the incident.')),/status mismatch/);
    assert.throws(()=>store.draft(draft('T-5102','Our team expects your withdrawal to be settled by October 2nd.')),/Unverified customer settlement date/);
    assert.equal(store.draft(draft('T-5102','Your withdrawal is still pending. This requires review by our Payments team.')).status,'pending_human_review');
  } finally { rmSync(dir,{recursive:true}); }
});

test('live-review findings: account evidence identifies KYC, informational requests keep appropriate priority',()=>{
  const kyc=data.assess('T-5103'); assert.equal(kyc.category,'kyc'); assert.ok(!kyc.missing_information.some(x=>/2FA/.test(x)));
  assert.equal(data.assess('T-5114').priority,'P4');
  const reload=data.assess('T-5115'); assert.equal(reload.priority,'P4'); assert.ok(reload.flags.includes('unpublished_terms')); assert.ok(!reload.sources.some(x=>x.startsWith('bonus-terms.md'))); assert.ok(!reload.missing_information.some(x=>/wagering ledger/.test(x)));
});
test('self-exclusion drafts cannot invent a process guarantee',()=>{
  const dir=temp(); try {
    const store=new SupportStore(data,dir,'test');
    assert.throws(()=>store.draft(draft('T-5105',"You don't need to do anything else to make it happen.")),/self-exclusion procedure/);
  } finally { rmSync(dir,{recursive:true}); }
});
