import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SupportData } from '../src/domain.js';
import { DraftInput, SupportStore } from '../src/store.js';
import { fileURLToPath } from 'node:url';
import { ROOT } from './mcp-client.js';

export function checkOutputs(directory: string, requireDrafts = false) {
  const data = new SupportData(resolve(ROOT, 'data'));
  const dir = resolve(directory);
  assert.ok(existsSync(dir), `Missing output directory ${dir}`);
  const expected = data.list().map(ticket => ticket.ticket_id);
  const validator = new SupportStore(data, dir, 'validation-only');
  const records = readdirSync(dir).filter(file => file.endsWith('.json'))
    .map(file => ({ file, record: JSON.parse(readFileSync(resolve(dir, file), 'utf8')) }))
    .filter(({ record }) => record.ticket_id);
  const saved = new Set(records.map(({ file }) => file));
  let drafts = 0, escalations = 0;

  for (const { file, record } of records) {
    assert.ok(expected.includes(record.ticket_id), `Unexpected ticket ${file}`);
    const kind = /\.(assessment|draft|escalation)\.json$/.exec(file)?.[1];
    assert.ok(kind, `Unknown ticket record type ${file}`);
    assert.equal(file, `${record.ticket_id}.${kind}.json`, `Ticket/file mismatch in ${file}`);
    assert.equal(record.status, 'pending_human_review', file);
    assert.equal(record.review_required, true, file);
    assert.equal(record.as_of, data.asOf, file);
    assert.equal(record.dataset_sha256, data.fingerprint, file);
    assert.ok(Array.isArray(record.history) && record.history.length >= 1, file);
    assert.equal(record.history.at(-1).revision, record.revision, file);
    assert.ok(Array.isArray(record.sources) && record.sources.length > 0, `Missing sources in ${file}`);
    assert.ok(record.sources.every((ref: string) => data.validSource(ref, data.ticket(record.ticket_id))), `Invalid source in ${file}`);

    const baseline = data.assess(record.ticket_id);
    if (kind === 'assessment') {
      for (const [key, value] of Object.entries(baseline)) {
        assert.deepEqual(record[key], value, `${file}: stale or incorrect ${key}`);
      }
    } else if (kind === 'draft') {
      validator.validateDraft(DraftInput.parse({ ticket_id: record.ticket_id, customer_text: record.customer_text, internal_notes: record.internal_notes, sources: record.sources }));
      drafts++;
    } else {
      assert.equal(record.target, baseline.route, `${file}: incorrect target`);
      assert.equal(record.priority, baseline.priority, `${file}: incorrect priority`);
      assert.deepEqual(record.reasons, baseline.reasons, `${file}: stale reasons`);
      assert.deepEqual(record.sources, baseline.sources, `${file}: stale sources`);
      assert.ok(typeof record.requested_action === 'string' && record.requested_action.trim().length > 0, `${file}: missing requested action`);
      assert.equal(record.delivery_status, 'not_sent_local_record_only', file);
      escalations++;
    }
  }

  const requiredEscalations = expected.filter(id => data.assess(id).route !== 'Support');
  for (const id of expected) {
    assert.ok(saved.has(`${id}.assessment.json`), `Missing assessment ${id}`);
    if (requireDrafts) assert.ok(saved.has(`${id}.draft.json`), `Missing draft ${id}`);
  }
  for (const id of requiredEscalations) {
    assert.ok(saved.has(`${id}.escalation.json`), `Missing required escalation ${id}`);
  }
  return { assessment_count: expected.length, drafts, escalations, required_escalations: requiredEscalations.length,
    directory: dir, automated_structure_checks: 'passed', semantic_review: 'Still requires a person; structure checks do not prove correctness.' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(checkOutputs(process.argv[2] ?? resolve(ROOT, 'outputs'), process.argv.includes('--require-drafts')), null, 2));
}
