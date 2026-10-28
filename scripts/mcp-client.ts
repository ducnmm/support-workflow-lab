import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
export async function connect(output: string, mode = 'deterministic-demo') {
  const client = new Client({name:'support-evaluation',version:'0.1.0'});
  await client.connect(new StdioClientTransport({command:process.execPath,args:[resolve(ROOT,'dist/src/server.js'),'--data-dir',resolve(ROOT,'data'),'--output-dir',output,'--mode',mode]}));
  return client;
}
export async function invoke(client: Client, name: string, args: Record<string,unknown>): Promise<any> {
  const result=await client.callTool({name,arguments:args});
  const block=result.content.find(x=>x.type==='text');
  if (!block || block.type!=='text') throw new Error('Missing tool result');
  const value=JSON.parse(block.text);
  if (result.isError) throw new Error(value.error);
  return value;
}
