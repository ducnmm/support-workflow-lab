import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { connect,invoke,ROOT } from './mcp-client.js';
import type { Assessment } from '../src/domain.js';
const output=resolve(ROOT,'outputs/offline');
const client=await connect(output);
const rows: Assessment[]=[];
try {
  const {tickets}=await invoke(client,'list_tickets',{status:'open'});
  for (const t of tickets) {
    const ctx=await invoke(client,'get_ticket_context',{ticket_id:t.ticket_id});
    const a=ctx.assessment as Assessment;
    await invoke(client,'save_ticket_assessment',{ticket_id:t.ticket_id,notes:'Reproducible deterministic MCP run. No LLM was used for this output.'});
    if (a.route!=='Support') await invoke(client,'save_escalation',{ticket_id:t.ticket_id,notes:`Human action needed: ${a.reasons.join(' ')}`});
    rows.push(a);
  }
  writeFileSync(resolve(output,'queue.json'),JSON.stringify({authoring_mode:'deterministic-demo',as_of:'2026-09-29T09:00:00Z',sample_only:true,tickets:rows},null,2)+'\n');
  const lines=['# Open-ticket assessment — offline MCP run','', 'This run uses real MCP tool calls and writes local assessments/escalations. It does not call an LLM or generate customer replies.','', '| Ticket | Category | Priority | Route | Flags |','| --- | --- | --- | --- | --- |',...rows.map(a=>`| ${a.ticket_id} | ${a.category} | ${a.priority} | ${a.route} | ${a.flags.join(', ')} |`)];
  writeFileSync(resolve(output,'SUMMARY.md'),lines.join('\n')+'\n');
  console.log(`Processed ${rows.length} open tickets via MCP. Output: ${output}`);
} finally { await client.close(); }
