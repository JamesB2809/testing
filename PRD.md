# PRD.md — SignalOS (v1)

## 1) Purpose
SignalOS is an internal analytics and learning platform for an email marketing agency running Klaviyo campaigns and flows across multiple clients.

Core promise:
1. Show what’s working.
2. Show what’s not working.
3. Recommend what to do next.

## 2) Users
- Owner
- Strategist
- Account Manager
- Copywriter

## 3) Primary Daily Jobs To Be Done
- In less than five minutes, understand client performance state.
- Identify top drivers of revenue and underperformance.
- Get ranked next actions/tests and talking points for client communication.

## 4) Scope (v1)

### In Scope
- Multi-client workspace (internal only)
- Klaviyo integration:
  - Campaigns
  - Flows
  - A/B variants
  - Segments
  - Templates
- Historical backfill (last 12 months)
- Scheduled sync:
  - Hourly incremental
  - Daily reconciliation
  - Manual “Sync now”
- Image-sliced email handling:
  - OCR extraction in v1
  - AI classification with confidence score
  - “Needs Review” for low-confidence records
- Dashboard:
  - Per-client view
  - Agency rollup
  - What’s working / not working / next actions
- Reporting:
  - In-app
  - PDF export
  - Weekly Slack summary (Monday 8:00 GMT)
- Test intelligence:
  - Track A/B outcomes
  - Confidence tagging
  - Ranked recommended next tests
- Lightweight internal onboarding checklist

### Out of Scope (v1)
- External client portal
- Multi-ESP support (Klaviyo-only)
- Advanced attribution modeling beyond available Klaviyo metrics
- Dark mode
- Mobile-first UX

## 5) Non-Functional Requirements
- Dashboard load target: less than 2.5 seconds for typical client dataset
- Filter interactions: less than 800 ms perceived response
- Idempotent sync jobs with retry logic
- Role-based access controls
- Daily database backups
- CSV export availability
- Audit logging for manual classification edits

## 6) UX Principles
- Hybrid dashboard: executive clarity + drill-down capability
- Subtle motion only
- Neutral professional design
- Fast, low-friction workflows
- Side drawers for quick edits, full pages for deep analysis

## 7) Information Architecture

### Key Areas
1. Agency Overview
2. Client Dashboard
3. Experiments / Tests
4. Recommendations Queue
5. Reports (PDF + Slack history)
6. Data Health / Sync Status
7. Settings (Users, Integrations, Taxonomy)

## 8) Data Model (v1, high-level)
- users
- workspaces (agency)
- clients
- client_memberships
- klaviyo_connections
- campaigns
- flow_messages
- variants
- segments
- templates
- email_assets
- ocr_extractions
- classifications
- metrics_daily
- recommendations
- reports
- sync_jobs
- audit_logs

## 9) Taxonomy (v1)
- Objective: promo / launch / nurture / winback / newsletter
- Offer Type: discount / bundle / gift / scarcity / new arrival / educational
- CTA Type: shop_now / learn_more / claim_offer / urgency
- Creative Type: image_sliced / text_only / mixed
- Test Variable: subject / headline / image / offer / layout / cta

## 10) Recommendation Engine (v1 logic)
Recommendations are ranked by:
- Estimated impact (revenue-weighted opportunity)
- Confidence score (sample size + consistency + data quality)
- Recency relevance
- Similar-segment precedent

Output format:
- Action title
- Why this matters
- Expected upside band
- Confidence label
- “How to execute” short guidance

## 11) OCR & Classification Rules
- Run OCR for image-sliced emails.
- Extract candidate headline/offer/CTA text.
- Classify objective/offer/cta/creative/test-variable.
- If confidence is below threshold:
  - mark record as Needs Review
  - allow save
  - prompt user quick confirm (3 fields max)

## 12) Reporting
- In-app scorecards
- One-click PDF export (client-level and agency-level)
- Slack weekly summary each Monday 8:00 GMT:
  - wins
  - risks
  - top 3 next actions

## 13) Security & Access
- Auth: Magic link + Google OAuth
- Roles: Owner, Manager, Contributor
- Internal-only deployment
- Row-level security enforced per workspace/client

## 14) Success Metrics (first 90 days)
- Time-to-insight per client review reduced by 60%
- Weekly recommendation adoption rate above 50%
- Percentage of campaigns/flow messages with complete classification above 90%
- User weekly active rate (core team) above 80%

## 15) Acceptance Criteria (v1 release)
1. User can connect Klaviyo and complete 12-month backfill.
2. Scheduled sync runs hourly and daily with visible status.
3. Dashboard shows working/not-working/next-actions per client.
4. OCR/classification pipeline runs on image-sliced emails.
5. Low-confidence records are clearly flagged “Needs Review.”
6. User can export PDF report without manual data assembly.
7. Slack summary posts automatically Monday 8:00 GMT.
8. Agency rollup view is available across all clients.
