const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCoreSchemaMigration, REQUIRED_TABLES, REQUIRED_INDEXES } = require('../src/schemaValidator');

const MIGRATION_PATH = 'db/migrations/0001_core_schema.sql';

test('core schema migration includes required tables and indexes', () => {
  const result = validateCoreSchemaMigration(MIGRATION_PATH);

  assert.equal(result.valid, true);
  assert.deepEqual(result.missingTables, []);
  assert.deepEqual(result.missingIndexes, []);

  for (const table of REQUIRED_TABLES) {
    assert.equal(result.missingTables.includes(table), false);
  }

  for (const idx of REQUIRED_INDEXES) {
    assert.equal(result.missingIndexes.includes(idx), false);
  }
});

test('core schema migration includes critical constraints and audit fields', () => {
  const result = validateCoreSchemaMigration(MIGRATION_PATH);
  assert.equal(result.hasClientWorkspaceFk, true);
  assert.equal(result.hasMetricsUniq, true);
  assert.equal(result.hasAuditJsonb, true);
});
