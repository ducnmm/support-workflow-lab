import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SupportData } from '../src/domain.js';
import { ROOT } from './mcp-client.js';
const dir=resolve(process.argv[2] ?? resolve(ROOT,'outputs'));
const data=new SupportData(resolve(ROOT,'data'));
const read=(id:string,kind:string)=>{try{return JSON.parse(readFileSync(resolve(dir,`${id}.${kind}.json`),'utf8'));}catch{return null;}};
const quote=(text:string)=>text.split('\n').map(line=>'> '+line).join('\n');
const lines=['# Live model results — review queue','', '**These are draft records prepared in Claude Code. No customer reply was sent, no money moved, and no escalation delivered. A person must review and send or perform the required action.**','',`Assessment clock: ${data.asOf}. This is the supplied sample, not the complete support queue.`,'', '| Ticket | Category | Priority | Human owner | Draft saved | Escalation brief |','| --- | --- | --- | --- | --- | --- |'];
for(const t of data.list()) {
 const a=read(t.ticket_id,'assessment'),d=read(t.ticket_id,'draft'),e=read(t.ticket_id,'escalation');
 lines.push(`| ${t.ticket_id} | ${a?.category??'missing'} | ${a?.priority??'missing'} | ${a?.route??'missing'} | ${d?'yes':'no'} | ${e?'local brief only':'—'} |`);
}
for(const t of data.list()) {
 const a=read(t.ticket_id,'assessment'),d=read(t.ticket_id,'draft'),e=read(t.ticket_id,'escalation');
 lines.push('',`## ${t.ticket_id} — ${t.subject}`,'',`Priority: **${a?.priority??'missing'}**. Route: **${a?.route??'missing'}**. Status: **pending human review**.`,'', '### Customer reply draft','',d?quote(d.customer_text):'Not saved.','', '### Internal notes — do not send','',d?.internal_notes??a?.model_notes??'Not saved.','', '### Evidence and gaps','');
 if(a) { for(const reason of a.reasons) lines.push('- '+reason); for(const gap of a.missing_information) lines.push('- **Unknown:** '+gap); lines.push('', 'Sources: '+a.sources.map((s:string)=>'`'+s+'`').join(', ')); }
 if(e) lines.push('', '### Human escalation action','',e.requested_action,'','**Delivery:** local brief only; a person must deliver it.');
}
const drafts=readdirSync(dir).filter(f=>/^T-\d+\.draft\.json$/.test(f)).length;
lines.push('',`Coverage: ${drafts}/${data.list().length} customer reply drafts saved.`);
writeFileSync(resolve(dir,'LIVE-REVIEW.md'),lines.join('\n')+'\n');
console.log('Rendered live review queue with',drafts,'drafts.');
