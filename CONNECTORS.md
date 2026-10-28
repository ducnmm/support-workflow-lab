# Connectors

Adapted from Anthropic's customer-support plugin. Modified for the 99Tech challenge.

The upstream `~~category` placeholders still describe logical data sources. In this build they map to one local MCP server, `support-local`, not to external services.

| Category | Local source | Tools |
| --- | --- | --- |
| `~~support platform` | `tickets.json`, local assessment/draft/escalation records | `list_tickets`, `get_ticket_context`, `save_ticket_assessment`, `save_response_draft`, `save_escalation` |
| `~~CRM` | Ticket-linked, redacted `customers.csv` and `transactions.csv` | `get_ticket_context` |
| `~~knowledge base` | Current handbook, Bonus Terms; write-only KB drafts | `search_knowledge`, `save_kb_draft` |
| `~~chat` | Redacted Slack export, context only | `search_knowledge` |
| `~~cloud storage` | Finance incident notes and unpublished marketing plans with authority labels | `search_knowledge` |
| `~~email` | Ticket messages/history only | `get_ticket_context` |
| `~~project tracker` | Local escalation briefs; not delivered to a real team | `save_escalation` |

Read [operating rules](references/OPERATING-RULES.md) before using any skill. There are no live email, Slack, Intercom, CRM, refund, publishing, or self-exclusion connections.
