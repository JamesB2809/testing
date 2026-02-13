const { readFileSync } = require('node:fs');

const REQUIRED_TABLES = [
  'workspaces',
  'clients',
  'client_memberships',
  'campaigns',
  'flow_messages',
  'variants',
  'segments',
  'templates',
  'metrics_daily',
  'audit_logs'
];

const REQUIRED_INDEXES = [
  'idx_clients_workspace_id',
  'idx_campaigns_client_id_send_at',
  'idx_flow_messages_client_status',
  'idx_variants_parent_lookup',
  'idx_metrics_daily_client_entity_date',
  'idx_audit_logs_workspace_entity'
];

function validateCoreSchemaMigration(filePath) {
  const sql = readFileSync(filePath, 'utf8');

  const missingTables = REQUIRED_TABLES.filter((table) => !sql.includes(`CREATE TABLE IF NOT EXISTS ${table}`));
  const missingIndexes = REQUIRED_INDEXES.filter((idx) => !sql.includes(`CREATE INDEX IF NOT EXISTS ${idx}`));

  const hasClientWorkspaceFk = sql.includes('workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE');
  const hasMetricsUniq = sql.includes('UNIQUE (client_id, entity_type, entity_id, metric_date)');
  const hasAuditJsonb = sql.includes('before_state JSONB') && sql.includes('after_state JSONB');

  return {
    valid:
      missingTables.length === 0 &&
      missingIndexes.length === 0 &&
      hasClientWorkspaceFk &&
      hasMetricsUniq &&
      hasAuditJsonb,
    missingTables,
    missingIndexes,
    hasClientWorkspaceFk,
    hasMetricsUniq,
    hasAuditJsonb
  };
}

module.exports = {
  REQUIRED_TABLES,
  REQUIRED_INDEXES,
  validateCoreSchemaMigration
};
