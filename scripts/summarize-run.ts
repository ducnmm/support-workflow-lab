import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
const [inputArg,outputArg,providerArg = 'unspecified'] = process.argv.slice(2);
if (!inputArg || !outputArg) throw new Error('Usage: node dist/scripts/summarize-run.js <Claude stream-json log> <summary.json>');
const pending=new Map<string,{tool:string;ticket_id?:string}>();
const events:Record<string,unknown>[]=[];
let final:Record<string,unknown>|undefined;
let model:string|undefined;
for(const line of readFileSync(resolve(inputArg),'utf8').split('\n')) {
  if(!line.trim()) continue;
  let d:any; try {d=JSON.parse(line);} catch {continue;}
  if(d.type==='system' && d.subtype==='init') model=d.model;
  if(d.type==='assistant') for(const b of d.message?.content ?? []) {
    if(b.type==='tool_use') pending.set(b.id,{tool:b.name,ticket_id:b.input?.ticket_id});
  }
  if(d.type==='user') for(const b of d.message?.content ?? []) {
    if(b.type!=='tool_result') continue;
    const tool=pending.get(b.tool_use_id); if(!tool) continue;
    let text=typeof b.content==='string' ? b.content : b.content?.filter((x:any)=>x.type==='text').map((x:any)=>x.text).join('\n');
    let value:any; try {value=JSON.parse(text);} catch {value={};}
    events.push({...tool,status:b.is_error ? 'error' : 'ok',...(value.error ? {error:value.error} : {}),...(value.path ? {saved_record:basename(value.path),revision:value.revision,changed:value.changed} : {})});
    pending.delete(b.tool_use_id);
  }
  if(d.type==='result') final={subtype:d.subtype,is_error:d.is_error,num_turns:d.num_turns,duration_ms:d.duration_ms};
}
const output=resolve(outputArg); mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify({model,client:'Claude Code 2.1.312',provider:providerArg,authoring_mode:'live-model-client-test',final,events,unanswered_tool_calls:[...pending.values()]},null,2)+'\n');
console.log(`Saved ${events.length} tool outcomes without chain-of-thought or credential content: ${output}`);
