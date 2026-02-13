const test = require('node:test');
const assert = require('node:assert/strict');
const { loadConfig } = require('../src/config');

test('loadConfig throws if required env vars are missing', () => {
  assert.throws(
    () => loadConfig({}),
    /Missing required environment variables: SUPABASE_URL, SUPABASE_ANON_KEY/
  );
});

test('loadConfig returns defaults and provided keys', () => {
  const config = loadConfig({
    SUPABASE_URL: 'https://demo.supabase.co',
    SUPABASE_ANON_KEY: 'anon',
    SUPABASE_SERVICE_ROLE_KEY: 'service'
  });

  assert.deepEqual(config, {
    supabaseUrl: 'https://demo.supabase.co',
    supabaseAnonKey: 'anon',
    supabaseServiceRoleKey: 'service',
    supabaseSchema: 'public'
  });
});
