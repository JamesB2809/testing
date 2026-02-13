const { createSupabaseRestRequest } = require('./supabaseClient');

function createAuditLogEntry(payload, env = process.env) {
  const required = ['workspaceId', 'actorUserId', 'entityType', 'entityId', 'action'];
  for (const key of required) {
    if (!payload?.[key]) {
      throw new Error(`Missing audit log field: ${key}`);
    }
  }

  return createSupabaseRestRequest(
    '/audit_logs',
    {
      method: 'POST',
      authType: 'service_role',
      headers: { Prefer: 'return=representation' },
      body: {
        workspace_id: payload.workspaceId,
        actor_user_id: payload.actorUserId,
        entity_type: payload.entityType,
        entity_id: payload.entityId,
        action: payload.action,
        before_state: payload.beforeState || null,
        after_state: payload.afterState || null
      }
    },
    env
  );
}

module.exports = {
  createAuditLogEntry
};
