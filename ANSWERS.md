# AI Enablement Engineer Challenge — Written Answers

This document contains my answers to Part 1, Part 3, and the Judgment Check. The Part 2 implementation, results, and run instructions are in [README.md](README.md), with a reviewer walkthrough in [TESTING.md](TESTING.md).

## Part 1 — Diagnose Adoption

### 1. Is this on track? What is the real story behind the 75%?

The figures show promising initial reach, but they do not yet demonstrate value. Around 150 of 200 employees use AI weekly. We do not know how often they use it, which tasks it supports, or whether their work improves as a result.

Before interpreting the finding that 20 people generate 60% of usage, I would check how usage is attributed. A tool or automated workflow may run under its creator's account while serving an entire team. We should distinguish direct individual use, automated tool activity, and the people benefiting from that activity. If the figure does represent individual usage, it suggests adoption is concentrated in a small group.

Email rewriting and document summarization can be useful, but their popularity does not establish that AI is integrated into core workflows. I would investigate whether employees lack awareness of other applications, suitable tools, access to relevant data, or confidence in the results.

The three departments that stopped using AI after week one warrant direct investigation. I would not assume they lack motivation: their initial experience may simply have failed to address their actual work.

I support making useful AI capabilities available across the company. However, 100% weekly usage is an adoption target, not proof of success. The goal of approximately $35,000 per month in "productive use" also needs a clear definition. Higher spending is justified only when the resulting value is demonstrated.

### 2. What would I measure to know whether AI is creating value?

I would measure outcomes for specific tasks and workflows against a baseline, including the time spent reviewing and correcting AI output.

| Area | Measures |
| --- | --- |
| Customer support | First-response time, resolution time, policy accuracy, ticket reopening rate, and customer satisfaction |
| Software development | Time from request to delivery, defects after release, rework, review time, and whether the output meets requirements |
| Employee experience | Repetitive workload, effort spent checking AI output, stress, and perceived usefulness |
| Cost | AI spending and the effort required to implement and maintain the workflow, compared with measured benefits |

Story points can provide context within a team with stable estimation practices, but I would not use them to compare productivity across individuals or teams.

Different teams need different measures, but they should answer the same four questions: **Is the work faster, is the output better, is the workload easier for employees, and are the benefits worth the cost?**

### 3. Where would I focus first, and why?

I would prioritize helping one team integrate AI into a specific workflow. I would begin by speaking with the three departments that stopped using it, observing their work, and selecting a workflow with a clear problem, measurable outcomes, and a team lead willing to participate.

The first step is to document the existing workflow: its inputs, outputs, completion criteria, and decisions requiring human judgment. For an engineering team, that might be:

**Clarify requirements → plan → break down tasks → approve the plan → implement → test → review → complete.**

I would package suitable instructions into a Claude Code skill. Each stage would have explicit criteria for progressing, and decisions requiring human approval would pause for review. Mandatory controls should also be supported by configuration or technical checks rather than relying solely on written instructions.

Initially, I would preserve the familiar workflow where practical to reduce the effort of adopting AI. AI could support documentation, coding, and testing, while the responsible person verifies the results.

Once the pilot demonstrates measurable benefits, I would refine the skill, improve the workflow, or add further automation. This creates a foundation for expanding from a useful application while helping employees understand and control how AI participates in their work.

## Part 3 — Coach & Consolidate

### 1. A team tried AI and went back to the old way

I would respond: “Can you show me a task you tried, what AI produced, and what you had to fix? If it added work, returning to the familiar process is understandable. Let's work through one useful task together and decide whether it earns a place in your workflow.”

I would observe a few examples with the lead and staff, checking for missing context, inaccessible data, incorrect output, review effort, or a poor task choice. Contradictory policies need an owner to resolve them; a better prompt cannot establish which policy is authoritative.

Together we would select one frequent, frustrating task and document its current steps, inputs, expected output, and human decisions. I would preserve the familiar workflow where practical and package suitable steps into a skill with a worked example, completion criteria, and explicit review gates. Mandatory approvals also need tool permissions and technical controls.

For Support: retrieve the ticket and transaction → check current policy → prepare a reply and escalation brief → have a person verify and send. This addresses retrieval and policy consistency while keeping financial and account actions with authorized staff.

I would agree a one-week pilot, onboarding time, and a named contact for help. Before starting, the lead and I would agree success criteria: less handling time including review, without increased policy errors. We would compare similar cases, track first-response time under comparable staffing/workload, and ask staff about effort. Provider settlement delays would be tracked separately. We would then expand, revise, or stop based on the evidence. The submitted prototype has not yet demonstrated staff productivity gains.

### 2. A team versus one stuck individual

For one person, I would pair on their latest failed task, identify the obstacle, and help them finish it. They would try the next task themselves, followed by a short check-in to see whether they can repeat the workflow.

A team also needs agreed responsibilities, access, policy, and review capacity. I would involve the lead and several staff, train them on their own work, appoint an owner and backup, and provide an issue-reporting route. Repeated individual difficulties would improve the shared skill or tool; the team should not depend on one power user.

### 3. One trusted, findable resource

I would use the existing internal knowledge hub as a searchable entry point, organized by jobs such as “investigate a delayed withdrawal.” Executable skills would live in version control and be linked from that hub. Workflows would cite official policies in their authoritative location rather than creating competing copies.

Chats and power users would supply candidates. Before promoting one, its author and domain owner would remove sensitive case details, reproduce it, and verify it against current policy. Each entry would include:

- Task, prerequisites, and a skill or steps with a worked example.
- Expected output, review criteria, limitations, and authoritative sources.
- Owner, backup, approver, version, and last-verified date.
- Status: draft, pilot, or approved, with the supporting evidence.

The Support plugin could seed this library as a tested prototype. Passing engineering checks is not production approval or evidence of time savings.

### 4. Keep it current

Staff could report a failed result from each entry. Policy, tool, or model changes would trigger revalidation; I would initially schedule monthly reviews for financial/account workflows and quarterly reviews for others. Overdue entries would be marked, and known incorrect workflows withdrawn until fixed.

Changes would receive versioned review, repeatable checks, and representative cases. For this plugin, the owner must update affected code and every relevant skill before release. Significant changes would get a brief staff walkthrough.

I would monitor failed searches, errors, repeat use, and usefulness. Low use would prompt investigation, since exception-handling guidance may be needed rarely. Duplicates would be merged, superseded entries archived with replacement links, and ownerless entries reassigned or removed from the recommended set.

## Judgment Check — One thing I would not do

I would not require employees to generate AI activity or spend simply to satisfy a dashboard, even if leadership pushed for it.

I support broad access and a larger AI budget when useful work justifies them. However, weekly logins, token counts, or money spent should not become individual performance quotas. A shared tool can benefit an entire team while its usage is attributed to one creator; another workflow may need AI only occasionally. Quotas would reward unnecessary activity and obscure whether work improved.

I would explain that trade-off to leadership and propose accountable workflow goals: less handling time including review, fewer policy mistakes, acceptable customer outcomes, lower repetitive workload, and a cost justified by those results. Activity data would help identify where coaching or access is needed. If a supported pilot does not improve the work, I would change or stop it and report that result honestly. Raising spend would follow demonstrated value and a credible expansion plan.
