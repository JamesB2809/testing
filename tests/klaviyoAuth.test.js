const test = require('node:test');
const assert = require('node:assert/strict');

const {
  loadKlaviyoConfig,
  createKlaviyoAuthorizeUrl,
  createKlaviyoTokenRequest
} = require('../src/klaviyoAuth');

const env = {
  KLAVIYO_CLIENT_ID: 'client-id',
  KLAVIYO_CLIENT_SECRET: 'client-secret',
  KLAVIYO_REDIRECT_URI: 'https://signalos.app/integrations/klaviyo/callback'
};

test('loadKlaviyoConfig throws for missing required vars', () => {
  assert.throws(() => loadKlaviyoConfig({}), /Missing required Klaviyo environment variables/);
});

test('createKlaviyoAuthorizeUrl builds OAuth URL with provided state and scopes', () => {
  const result = createKlaviyoAuthorizeUrl(
    { state: 'state-123', scopes: 'campaigns:read flows:read' },
    env
  );

  assert.equal(result.state, 'state-123');
  assert.ok(result.url.startsWith('https://www.klaviyo.com/oauth/authorize?'));
  assert.ok(result.url.includes('client_id=client-id'));
  assert.ok(result.url.includes(encodeURIComponent(env.KLAVIYO_REDIRECT_URI)));
  assert.ok(result.url.includes('scope=campaigns%3Aread+flows%3Aread'));
  assert.ok(result.url.includes('state=state-123'));
});

test('createKlaviyoTokenRequest builds token exchange request', () => {
  const request = createKlaviyoTokenRequest('code-abc', env);

  assert.equal(request.url, 'https://a.klaviyo.com/oauth/token');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'application/x-www-form-urlencoded');

  const expectedBasic = Buffer.from('client-id:client-secret').toString('base64');
  assert.equal(request.options.headers.Authorization, `Basic ${expectedBasic}`);
  assert.ok(request.options.body.includes('grant_type=authorization_code'));
  assert.ok(request.options.body.includes('code=code-abc'));
  assert.ok(request.options.body.includes(encodeURIComponent(env.KLAVIYO_REDIRECT_URI)));
});

test('createKlaviyoTokenRequest requires authorization code', () => {
  assert.throws(() => createKlaviyoTokenRequest('', env), /Authorization code is required/);
});
