const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ROLES,
  isKnownRole,
  hasWorkspaceAccess,
  hasClientAccess,
  canAccessRoute
} = require('../src/accessControl');

const baseUser = {
  activeWorkspaceId: 'ws_1',
  workspaceMemberships: ['ws_1'],
  clientMemberships: ['client_1']
};

test('role definitions are recognized', () => {
  assert.equal(isKnownRole(ROLES.OWNER), true);
  assert.equal(isKnownRole('manager'), true);
  assert.equal(isKnownRole('nope'), false);
});

test('owner has workspace and client access everywhere', () => {
  const owner = { ...baseUser, role: ROLES.OWNER };
  assert.equal(hasWorkspaceAccess(owner, 'any'), true);
  assert.equal(hasClientAccess(owner, 'any-client'), true);
});

test('contributor workspace and client membership are enforced', () => {
  const contributor = { ...baseUser, role: ROLES.CONTRIBUTOR };
  assert.equal(hasWorkspaceAccess(contributor, 'ws_1'), true);
  assert.equal(hasWorkspaceAccess(contributor, 'ws_2'), false);
  assert.equal(hasClientAccess(contributor, 'client_1'), true);
  assert.equal(hasClientAccess(contributor, 'client_2'), false);
});

test('route guards enforce role and membership restrictions', () => {
  const contributor = { ...baseUser, role: ROLES.CONTRIBUTOR };
  const deniedOverview = canAccessRoute({ user: contributor, route: '/agency-overview' });
  assert.deepEqual(deniedOverview, { allowed: false, reason: 'role_not_allowed' });

  const deniedClient = canAccessRoute({
    user: contributor,
    route: '/clients/:clientId',
    params: { clientId: 'client_2' }
  });
  assert.deepEqual(deniedClient, { allowed: false, reason: 'client_access_denied' });

  const allowedClient = canAccessRoute({
    user: contributor,
    route: '/clients/:clientId',
    params: { clientId: 'client_1' }
  });
  assert.deepEqual(allowedClient, { allowed: true, reason: 'ok' });
});

test('unknown routes and roles are denied', () => {
  const unknownRole = canAccessRoute({ user: { role: 'ghost' }, route: '/settings' });
  assert.deepEqual(unknownRole, { allowed: false, reason: 'unknown_role' });

  const unknownRoute = canAccessRoute({ user: { ...baseUser, role: ROLES.OWNER }, route: '/missing' });
  assert.deepEqual(unknownRoute, { allowed: false, reason: 'unknown_route' });
});
