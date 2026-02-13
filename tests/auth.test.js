const test = require('node:test');
const assert = require('node:assert/strict');
const { createMagicLinkPayload, createGoogleOAuthUrl, buildRedirect } = require('../src/auth');

const env = {
  SUPABASE_URL: 'https://demo.supabase.co',
  SUPABASE_ANON_KEY: 'anon-key'
};

test('buildRedirect normalizes slashes', () => {
  assert.equal(buildRedirect('https://app.signalos.io/', 'clients'), 'https://app.signalos.io/clients');
  assert.equal(buildRedirect('https://app.signalos.io', '/dashboard'), 'https://app.signalos.io/dashboard');
});

test('createMagicLinkPayload builds request body and headers', () => {
  const payload = createMagicLinkPayload('ops@signalos.io', {
    role: 'manager',
    siteUrl: 'https://app.signalos.io',
    nextPath: '/auth/callback'
  }, env);

  assert.equal(payload.url, 'https://demo.supabase.co/auth/v1/otp');
  assert.equal(payload.options.method, 'POST');
  assert.equal(payload.options.headers.apikey, 'anon-key');

  const body = JSON.parse(payload.options.body);
  assert.equal(body.email, 'ops@signalos.io');
  assert.equal(body.data.role, 'manager');
  assert.equal(body.options.email_redirect_to, 'https://app.signalos.io/auth/callback');
});

test('createMagicLinkPayload throws for invalid email', () => {
  assert.throws(() => createMagicLinkPayload('invalid', {}, env), /Valid email is required/);
});

test('createGoogleOAuthUrl includes provider and redirect', () => {
  const oauthUrl = createGoogleOAuthUrl({
    siteUrl: 'https://app.signalos.io',
    nextPath: '/auth/callback'
  }, env);

  assert.match(oauthUrl, /^https:\/\/demo\.supabase\.co\/auth\/v1\/authorize\?/);
  assert.match(oauthUrl, /provider=google/);
  assert.match(oauthUrl, /redirect_to=https%3A%2F%2Fapp\.signalos\.io%2Fauth%2Fcallback/);
});
