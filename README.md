# Support Workflow Lab

A personal research prototype exploring how AI can help with support work that depends on scattered records and changing policies. It combines local MCP tools with reusable Claude Code skills to retrieve evidence, prepare response drafts, and record the next human action.

The case study uses a fictional support export. Customer messages remain drafts for a person to review and send.

## Research focus

The prototype explores three questions:

- Can one workflow bring the relevant ticket, transaction, and current policy together?
- Can it distinguish verified facts from missing information and conflicting historical advice?
- Can it record useful next steps without giving a model authority to move money, change accounts, or contact customers?

The workflow is: **retrieve evidence → check policy → assess → draft → human review**. Explicit rules handle known routing and approval requirements; the model helps investigate and explain the evidence. Classification remains heuristic.

## Run locally

Requirements: Node.js 22+, npm, and an externally authenticated/configured Claude Code installation for interactive use. The MCP server itself requires no API key and makes no network requests.

```bash
npm ci
npm test
npm run demo
node dist/scripts/check-outputs.js outputs/offline
```

The demo starts a real stdio MCP server through the official client SDK. It writes 15 assessments and 11 local escalation briefs without calling a model or generating customer replies.

For the interactive workflow:

```bash
bash scripts/claude-session.sh
```

Enter `/mcp` to check the connection, then follow [TESTING.md](TESTING.md) for the namespaced skill commands, client configuration, and expected ticket outcomes. If `claude` is not on PATH, set `CLAUDE_BIN` to its executable path.

## What was checked

- 30 automated tests, including stdio MCP integration and previously unseen input variants.
- Protection requests mixed with family, payment, or bonus questions.
- Payment-method inquiries from customers with unrelated failed-deposit history.
- Required escalation coverage, source references, stored routing fields, and limited draft guards.
- A recorded model-assisted queue run in Claude Code with DeepSeek Flash. Execution using a Claude model remains unverified.

The saved results contain 15 assessments, 15 reply drafts, 11 local escalation briefs, and two knowledge-article drafts. See [the review queue](outputs/LIVE-REVIEW.md) and [verification record](VERIFICATION.md) for evidence, later corrections, and limitations. No measured staff productivity gain is claimed.

```bash
node dist/scripts/check-outputs.js outputs --require-drafts
node dist/scripts/render-results.js outputs
```

Regenerate the review document after changing JSON records. Passing checks do not establish that every sentence is correct.

## Boundaries

The sample has 30 tickets, including 15 open tickets, evaluated at 29 September 2026, 09:00 UTC. Missing provider timing, wagering history, recovery procedures, and unpublished terms are recorded as gaps.

All writes are local and remain pending human review. No tool sends a message, delivers an escalation, issues a refund, changes an account, closes a real ticket, or publishes an article. The restricted tool configuration is not an OS sandbox; privacy and injection checks are incomplete.

## Further reading

- [Case-study notes on adoption, coaching, and shared knowledge](ANSWERS.md)
- [Testing walkthrough](TESTING.md)
- [Source attribution and modifications](ATTRIBUTION.md)
- [License](LICENSE)

The skill workflows are adapted from an upstream customer-support plugin; attribution and original reference material are preserved in the project. The local data adapter, storage, business checks, and tests implement this prototype.
