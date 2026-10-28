# Open-ticket assessment — offline MCP run

This run uses real MCP tool calls and writes local assessments/escalations. It does not call an LLM or generate customer replies.

| Ticket | Category | Priority | Route | Flags |
| --- | --- | --- | --- | --- |
| T-5101 | withdrawal | P3 | Support | first_reply_overdue |
| T-5102 | withdrawal | P2 | Payments | first_reply_overdue, withdrawal_pending_over_24h |
| T-5103 | kyc | P1 | Team Lead | first_reply_overdue, legal_or_chargeback_threat, kyc_under_review |
| T-5104 | bonus | P3 | Support | first_reply_overdue, suspected_prompt_injection, bonus_terms_expired |
| T-5105 | gambling_harm | P1 | Team Lead | first_reply_overdue, gambling_harm, self_exclusion_action_required |
| T-5106 | refund | P2 | Team Lead | first_reply_overdue, refund_review_required |
| T-5107 | deposit | P2 | Support | first_reply_overdue, failed_deposit_no_credit |
| T-5108 | privacy | P3 | Support | first_reply_overdue, third_party_account_request |
| T-5109 | withdrawal | P2 | Payments | first_reply_overdue, completed_but_receipt_disputed |
| T-5110 | withdrawal | P2 | Payments | first_reply_overdue, withdrawal_pending_over_24h |
| T-5111 | bonus | P2 | Team Lead | first_reply_overdue, bonus_terms_expired, previous_incorrect_advice |
| T-5112 | account_access | P2 | Team Lead | first_reply_overdue |
| T-5113 | kyc | P2 | Team Lead | first_reply_overdue |
| T-5114 | deposit | P4 | Team Lead | first_reply_overdue |
| T-5115 | bonus | P4 | Team Lead | first_reply_overdue, unpublished_terms |
