# tasks.md — SignalOS v1 Execution Checklist

## Phase 0 — Foundation
- [x] Initialize baseline app scaffold with linting and test framework.
- [x] Configure Supabase project and environment variable handling.
- [x] Create baseline CI pipeline (lint + tests).
- [x] Add app shell layout and route scaffolding.
- [x] Create `progress.txt` with initial project state.

## Phase 1 — Auth & Access
- [x] Implement Supabase auth (magic link + Google OAuth).
- [x] Define roles: Owner, Manager, Contributor.
- [x] Implement workspace/client RBAC and route guards.
- [x] Add tests for auth flows and role-protected routes.
- [x] Update `progress.txt`.

## Phase 2 — Core Data Schema
- [x] Create DB migrations for core entities (clients, campaigns, flows, variants, metrics, etc.).
- [x] Add indexes for performance-critical queries.
- [x] Implement `audit_log` table + write hooks for manual edits.
- [x] Add schema tests (migration integrity + constraints).
- [x] Update `progress.txt`.

## Phase 3 — Klaviyo Integration
- [x] Implement Klaviyo OAuth/API credential flow.
- [x] Build connector service for campaigns/flows/segments/templates/variants.
- [x] Implement 12-month historical backfill job.
- [ ] Implement hourly incremental sync.
- [ ] Implement daily reconciliation sync.
- [ ] Implement manual “Sync now” endpoint + UI trigger.
- [ ] Add idempotency and retry strategy.
- [ ] Write integration tests for sync and dedupe behavior.
- [ ] Update `progress.txt`.

## Phase 4 — Asset Processing (Image-Sliced Emails)
- [ ] Parse email assets and store references.
- [ ] Implement OCR pipeline for image assets.
- [ ] Persist OCR outputs and extraction metadata.
- [ ] Build classification service (objective/offer/cta/etc.) with confidence scores.
- [ ] Add “Needs Review” state for low-confidence classifications.
- [ ] Build quick-confirm UI (objective, offer type, primary CTA).
- [ ] Add tests for OCR/classification decision paths.
- [ ] Update `progress.txt`.

## Phase 5 — Metrics & Insight Layer
- [ ] Normalize key metrics (revenue, OR, CTR, RPM, etc.) for campaigns and flows.
- [ ] Build aggregation queries for client scorecards.
- [ ] Build “What’s Working” logic (revenue-weighted lift).
- [ ] Build “What’s Not Working” logic (decline/fatigue/underperformance flags).
- [ ] Build recommendation ranking logic (impact × confidence × recency).
- [ ] Add unit tests for insight calculations and ranking.
- [ ] Update `progress.txt`.

## Phase 6 — Dashboard UI
- [ ] Build agency overview page.
- [ ] Build per-client dashboard page with filters.
- [ ] Build working/not-working/next-actions modules.
- [ ] Build drill-down tables for campaigns/flows/variants.
- [ ] Build sync/data-health panel.
- [ ] Add UI tests for core navigation and rendering.
- [ ] Update `progress.txt`.

## Phase 7 — Experiments & Learning Ops
- [ ] Build experiments history view (A/B test log).
- [ ] Surface variable tested + winner + confidence.
- [ ] Add replication tracking status.
- [ ] Add tests for experiment parsing and display logic.
- [ ] Update `progress.txt`.

## Phase 8 — Reporting & Distribution
- [ ] Implement PDF report generation endpoint.
- [ ] Build report templates (client + agency).
- [ ] Implement weekly Slack summary scheduler (Monday 8:00 GMT).
- [ ] Add delivery logs and failure retries.
- [ ] Add tests for report payloads and Slack message generation.
- [ ] Update `progress.txt`.

## Phase 9 — Polish, QA, Release
- [ ] Run end-to-end QA scenarios for primary user journeys.
- [ ] Optimize slow queries and cache heavy dashboard reads if needed.
- [ ] Validate accessibility basics and responsive desktop layouts.
- [ ] Write operator runbook (sync issues, data quality, user onboarding).
- [ ] Prepare pilot onboarding for Client A/B/C.
- [ ] Final regression test pass.
- [ ] Update `progress.txt` with release candidate state.
