# Verification record

Checked on 28 October 2026. The assessment clock remains **29 September 2026, 09:00 UTC**, matching the export.

## Result

The plugin was run in **Claude Code 2.1.312** with **DeepSeek Flash** (`deepseek-flash[1m]`) through DeepSeek's Anthropic-compatible API. This is a real Claude Code client run using a DeepSeek model, not an Anthropic Claude model run.

**Unverified requirement:** no Anthropic Claude-model run has been completed. If the assessment requires that model, rather than accepting the demonstrated client/provider configuration, that part still needs verification with suitable credentials.

The full queue run completed successfully in 68 client turns. It saved:

- **15/15 open-ticket assessments**.
- **15/15 customer reply drafts**.
- **11 local escalation briefs**.
- **2 knowledge article drafts**.

No customer messages were sent, no refunds issued, no account actions applied, no articles published, and no escalation delivered to a real team. All records remain pending human review.

## Completed checks

- TypeScript compilation passed.
- **30 tests passed**, including actual stdio MCP integration, unseen ticket/input variants, required-escalation coverage, and regressions found during review.
- Claude Code `plugin validate <directory> --strict`: **Validation passed**. Optional directory-publication advice concerns an icon and marketplace install instructions; this is a local plugin loaded with `--plugin-dir`.
- Claude Code `--plugin-dir <directory> mcp list`: plugin-scoped `support-local` server **Connected**.
- Deterministic offline MCP demo: **15 assessments and 11 escalation briefs**. These results remain separate under `outputs/offline/`.
- Final live-output check: **15 assessments, 15 drafts and all 11 required escalation briefs**, with stored baseline fields, escalation targets, source references, review status, dataset provenance, revision metadata and the implemented draft guards checked.
- Source export files were compared with the original clone and remained unchanged.
- Identical writes do not add revisions; changed content retains a hash-linked revision history in each record.
- Dependency audit reported zero vulnerabilities after updating csv-parse to 7.0.3.
- Credential-pattern scan of deliverable source/results passed. Authentication files and installed runtimes are outside the repository and source archive.

## Live runs and traces

Condensed traces exclude model chain-of-thought and credentials:

| Run | Result | Trace |
| --- | --- | --- |
| Full DeepSeek queue | Success; 68 turns | `outputs/evaluation/deepseek-queue.json` |
| Policy/review corrections | Success; 34 turns | `outputs/evaluation/deepseek-review-fixes.json` |
| Final focused corrections | Success; 15 turns | `outputs/evaluation/deepseek-final-review.json` |
| Codex assistant editorial review | Three drafts revised through MCP; not human approval | `outputs/evaluation/codex-review.json` |
| Post-review rule correction | T-5114 assessment and local brief refreshed through MCP; no model run or human approval | `outputs/evaluation/post-review-fixes.json` |

The first full run had two rejected KB writes because it included non-policy sources. The model corrected its requests; both article drafts were then saved. A later focused run also encountered a draft validation error and corrected it. Tool success alone was not accepted as proof that the text was correct.

## Post-review corrections

- Gambling-harm signals now take precedence over family/payment/bonus mentions and enforce urgent Team Lead handling independently of ordinary routing.
- Payment-method questions are evaluated before failed-deposit history. Mixed questions retain incident urgency; an explicit unknown transaction reference cannot fall back to a different failed deposit.
- The checker now fails for any missing required escalation, stale assessment fields, or incorrect escalation target. Regression checks remove each of the 11 required briefs in turn and verify rejection.
- Adapted customer templates describe required human action instead of claiming delivery, fixes, or escalation. Unsupported generic follow-up schedules were removed; all five skills contain the updated operating rules.
- T-5114's assessment and brief were updated through the official MCP client with `authoring_mode: codex-review`; the offline queue and consolidated review document were regenerated. Existing customer reply drafts were retained.

These changes were checked locally after the recorded DeepSeek runs. They do not represent a new full model run. All output records remain pending human review.

## Findings corrected during review

- An early model draft promoted an incident-level Finance expectation to a customer settlement promise and described a pending withdrawal as processed. Added explicit checks for those errors and more actionable validation messages.
- Added a guard against claiming a local-only escalation or account action is already in progress.
- Corrected T-5103's heuristic category using the account's KYC status rather than assuming an account-recovery issue.
- Corrected informational priority for T-5114 and T-5115. Reload inquiries no longer inherit welcome-bonus wagering/expiry rules.
- Corrected T-5101's internal calculation advice: a processing start before 27 September does not automatically exceed three business days. The actual start and provider calendar are needed.
- Removed unsupported self-exclusion process guarantees and retained urgent human handling without pretending the exclusion is active.
- Corrected draft/KB statements that inferred the correctness of an entire account balance from a single failed deposit.
- Distinguished information missing from this export from information that may exist in the company's real systems.
- Replaced a misleading mostly-blackjack calculation with a clearly hypothetical all-blackjack worked example.
- Final Codex assistant review removed a remaining in-progress escalation claim and tightened wording in three drafts. These edits have separate provenance and do not represent human approval.

## Data scope

The export explicitly labels its records as fictional. Model testing used that authorized context with email, phone and KYC findings withheld by MCP. Credentials and local authentication settings are outside the deliverable.

## Reproduce

```bash
npm ci
npm test
npm run demo
node dist/scripts/check-outputs.js outputs/offline
```

With Claude Code authenticated/configured externally:

```bash
bash scripts/claude-session.sh
```

Run the prompt in `references/QUEUE-PROMPT.txt`, then:

```bash
node dist/scripts/check-outputs.js outputs --require-drafts
node dist/scripts/render-results.js outputs
```

Read `outputs/LIVE-REVIEW.md` for the current review queue.

## Limits

Passing checks do not establish exhaustive injection resistance, general multilingual recognition, exact provider calendars, correctness of arbitrary natural-language replies or production readiness. The category/routing code remains a transparent heuristic; all customer text and operational actions require human review. A timed staff pilot is still needed before claiming faster responses or financial savings.
