const test = require('node:test');
const assert = require('node:assert/strict');
const { createAuditLogEntry } = require('../src/auditLog');

const env = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon',
  SUPABASE_SERVICE_ROLE_KEY: 'service'
};

test('createAuditLogEntry builds service-role insert request', () => {
  const request = createAuditLogEntry(
    {
      workspaceId: 'ws_1',
      actorUserId: 'user_1',
      entityType: 'classification',
      entityId: 'class_1',
      action: 'update',
      beforeState: { value: 'old' },
      afterState: { value: 'new' }
    },
    env
  );

  assert.equal(request.url, 'https://example.supabase.co/rest/v1/audit_logs');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.apikey, 'service');
  assert.equal(request.options.headers.Prefer, 'return=representation');

  const body = JSON.parse(request.options.body);
  assert.equal(body.workspace_id, 'ws_1');
  assert.equal(body.actor_user_id, 'user_1');
  assert.equal(body.entity_type, 'classification');
  assert.equal(body.action, 'update');
});

test('createAuditLogEntry validates required fields', () => {
  assert.throws(
    () => createAuditLogEntry({ workspaceId: 'ws_1' }, env),
    /Missing audit log field/
  );
});
