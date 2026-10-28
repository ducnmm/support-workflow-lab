import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, unlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { SupportData } from '../src/domain.js';
import { SupportStore } from '../src/store.js';
import { checkOutputs } from '../scripts/check-outputs.js';
import { ROOT } from '../scripts/mcp-client.js';

function fixture() {
  const dir=mkdtempSync(join(tmpdir(),'support-coverage-test-'));
  const data=new SupportData(resolve(ROOT,'data'));
  const store=new SupportStore(data,dir,'test');
  for(const ticket of data.list()) {
    const ticket_id=ticket.ticket_id;
    store.assessment({ticket_id});
    store.draft({ticket_id,customer_text:'Your request needs review. Thank you for your patience.',internal_notes:'A person must verify the evidence before sending.',sources:['support-handbook-v2.md#response-times']});
    if(data.assess(ticket_id).route!=='Support') store.escalation({ticket_id,notes:'Review the evidence and take the required human action.'});
  }
  return {dir,data};
}

test('output checker accepts complete live coverage with required local escalations',()=>{
  const {dir}=fixture();
  try {
    const result=checkOutputs(dir,true);
    assert.equal(result.assessment_count,15);
    assert.equal(result.drafts,15);
    assert.equal(result.escalations,11);
    assert.equal(result.required_escalations,11);
  } finally { rmSync(dir,{recursive:true}); }
});

test('output checker rejects each missing required escalation, not just an incorrect total',()=>{
  const {dir,data}=fixture();
  try {
    for(const ticket of data.list().filter(t=>data.assess(t.ticket_id).route!=='Support')) {
      const file=join(dir,`${ticket.ticket_id}.escalation.json`), saved=readFileSync(file);
      unlinkSync(file);
      assert.throws(()=>checkOutputs(dir,true),new RegExp(`Missing required escalation ${ticket.ticket_id}`));
      writeFileSync(file,saved);
    }
  } finally { rmSync(dir,{recursive:true}); }
});

test('output checker rejects stale triage fields and wrong escalation targets',()=>{
  const {dir}=fixture();
  try {
    const assessment=join(dir,'T-5105.assessment.json'), original=readFileSync(assessment,'utf8');
    writeFileSync(assessment,JSON.stringify({...JSON.parse(original),priority:'P3',route:'Support'}));
    assert.throws(()=>checkOutputs(dir,true),/stale or incorrect (priority|route)/);
    writeFileSync(assessment,original);
    const escalation=join(dir,'T-5105.escalation.json');
    writeFileSync(escalation,JSON.stringify({...JSON.parse(readFileSync(escalation,'utf8')),target:'Support'}));
    assert.throws(()=>checkOutputs(dir,true),/incorrect target/);
  } finally { rmSync(dir,{recursive:true}); }
});
