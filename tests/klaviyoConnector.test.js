const test = require('node:test');
const assert = require('node:assert/strict');

const {
  KLAVIYO_REVISION,
  createKlaviyoApiHeaders,
  createCampaignsRequest,
  createFlowMessagesRequest,
  createSegmentsRequest,
  createTemplatesRequest,
  createVariantsRequest,
  normalizeKlaviyoListResponse
} = require('../src/klaviyoConnector');

const env = {
  KLAVIYO_CLIENT_ID: 'client-id',
  KLAVIYO_CLIENT_SECRET: 'secret',
  KLAVIYO_REDIRECT_URI: 'https://signalos.app/integrations/klaviyo/callback'
};

test('createKlaviyoApiHeaders requires access token', () => {
  assert.throws(() => createKlaviyoApiHeaders(''), /Klaviyo access token is required/);
});

test('campaign connector request includes revision, auth and query params', () => {
  const request = createCampaignsRequest('token-1', { page_size: 50, filter: 'equals(status,"Sent")' }, env);

  assert.ok(request.url.startsWith('https://a.klaviyo.com/api/campaigns?'));
  assert.ok(request.url.includes('page_size=50'));
  assert.ok(request.url.includes('filter=equals%28status%2C%22Sent%22%29'));
  assert.equal(request.options.headers.Authorization, 'Bearer token-1');
  assert.equal(request.options.headers.Revision, KLAVIYO_REVISION);
});

test('flow, segment, template and variant requests map to expected endpoints', () => {
  const flowReq = createFlowMessagesRequest('token', {}, env);
  const segmentReq = createSegmentsRequest('token', {}, env);
  const templateReq = createTemplatesRequest('token', {}, env);
  const variantReq = createVariantsRequest('token', {}, env);

  assert.ok(flowReq.url.includes('/flow-messages'));
  assert.ok(segmentReq.url.includes('/segments'));
  assert.ok(templateReq.url.includes('/templates'));
  assert.ok(variantReq.url.includes('/campaign-message-variations'));
});

test('normalizeKlaviyoListResponse normalizes entity metadata safely', () => {
  const records = normalizeKlaviyoListResponse(
    {
      data: [
        {
          id: 'abc123',
          attributes: { name: 'Campaign A' },
          relationships: { campaign: { data: { id: 'parent_1' } } }
        }
      ]
    },
    'campaign'
  );

  assert.equal(records.length, 1);
  assert.equal(records[0].entityType, 'campaign');
  assert.equal(records[0].id, 'abc123');
  assert.equal(records[0].attributes.name, 'Campaign A');
  assert.equal(typeof records[0].fetchedAt, 'string');
});

test('normalizeKlaviyoListResponse tolerates malformed payloads', () => {
  const records = normalizeKlaviyoListResponse(null, 'campaign');
  assert.deepEqual(records, []);
});
