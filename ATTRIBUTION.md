# Attribution and modifications

This plugin is adapted from Anthropic's `knowledge-work-plugins/customer-support`, version 1.3.0, commit `2574e29377c7173d0cecffef29a6ecbd7f8ccb5d`.

Source: https://github.com/anthropics/knowledge-work-plugins/tree/2574e29377c7173d0cecffef29a6ecbd7f8ccb5d/customer-support

The five skill names, their workflow structure, and substantial instructional text are retained under the accompanying Apache-2.0 LICENSE. This is an independent challenge adaptation, not an official Anthropic product.

Modified files carry notices. Main changes:

- Map all logical connector categories to a local-file MCP server.
- Replace SaaS category/routing examples and generic SLA expectations with 99Tech policy.
- Require grounded drafts and local-only escalations with human review.
- Remove web-search and analogy-based fallback for missing internal policy.
- Limit KB creation to current-policy-backed drafts; resolved tickets can contain mistakes.

Original code in `src/`, `scripts/`, and `tests/` implements the local data adapter, policy checks, persistence and evaluation. Upstream README and connector documentation are preserved in `references/UPSTREAM-*` for comparison.

The challenge export under `data/` is supplied by the assessment, with fictional records according to its README. It is separate from the Anthropic plugin license; retain the assessment's terms when sharing it. API credentials, installed runtimes and local authentication settings are excluded from this repository.
