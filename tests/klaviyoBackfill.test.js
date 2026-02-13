const test = require('node:test');
const assert = require('node:assert/strict');

const {
  DEFAULT_BACKFILL_MONTHS,
  buildBackfillWindow,
  createHistoricalBackfillPlan
} = require('../src/klaviyoBackfill');

const env = {
  KLAVIYO_CLIENT_ID: 'client-id',
  KLAVIYO_CLIENT_SECRET: 'secret',
  KLAVIYO_REDIRECT_URI: 'https://signalos.app/integrations/klaviyo/callback'
};

test('buildBackfillWindow defaults to 12 months', () => {
  const now = new Date('2026-02-12T00:00:00.000Z');
  const window = buildBackfillWindow(now);

  assert.equal(DEFAULT_BACKFILL_MONTHS, 12);
  assert.equal(window.startDate, '2025-02-12');
  assert.equal(window.endDate, '2026-02-12');
});

test('createHistoricalBackfillPlan requires access token', () => {
  assert.throws(() => createHistoricalBackfillPlan('', {}, env), /Access token is required/);
});

test('createHistoricalBackfillPlan builds requests for all required entities', () => {
  const jobs = createHistoricalBackfillPlan(
    'token-123',
    {
      now: new Date('2026-02-12T00:00:00.000Z'),
      pageSize: 75
    },
    env
  );

  assert.equal(jobs.length, 5);
  assert.deepEqual(jobs.map((job) => job.entityType), ['campaign', 'flow_message', 'segment', 'template', 'variant']);

  const campaignRequest = jobs[0].request;
  assert.ok(campaignRequest.url.includes('/campaigns?'));
  assert.ok(campaignRequest.url.includes('page_size=75'));
  assert.ok(campaignRequest.url.includes('filter%5Bgreater-or-equal%5D=2025-02-12'));
  assert.ok(campaignRequest.url.includes('filter%5Bless-or-equal%5D=2026-02-12'));

  const segmentRequest = jobs[2].request;
  assert.ok(segmentRequest.url.includes('/segments?page_size=75'));
  assert.equal(segmentRequest.url.includes('filter%5Bgreater-or-equal%5D='), false);
});
