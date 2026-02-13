const test = require('node:test');
const assert = require('node:assert/strict');
const { createSupabaseRestRequest } = require('../src/supabaseClient');

test('createSupabaseRestRequest builds GET request with anon key', () => {
  const env = {
    SUPABASE_URL: 'https://demo.supabase.co',
    SUPABASE_ANON_KEY: 'anon-key'
  };

  const req = createSupabaseRestRequest('/clients?select=*', {}, env);

  assert.equal(req.url, 'https://demo.supabase.co/rest/v1/clients?select=*');
  assert.equal(req.options.method, 'GET');
  assert.equal(req.options.headers.apikey, 'anon-key');
  assert.equal(req.options.headers.Authorization, 'Bearer anon-key');
});

test('createSupabaseRestRequest uses service role when requested', () => {
  const env = {
    SUPABASE_URL: 'https://demo.supabase.co',
    SUPABASE_ANON_KEY: 'anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'service-key'
  };

  const req = createSupabaseRestRequest('sync_jobs', {
    method: 'POST',
    authType: 'service_role',
    body: { status: 'queued' }
  }, env);

  assert.equal(req.options.method, 'POST');
  assert.equal(req.options.headers.apikey, 'service-key');
  assert.equal(req.options.body, JSON.stringify({ status: 'queued' }));
});
