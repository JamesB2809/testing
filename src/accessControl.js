const ROLES = Object.freeze({
  OWNER: 'owner',
  MANAGER: 'manager',
  CONTRIBUTOR: 'contributor'
});

const ROUTE_POLICIES = Object.freeze({
  '/agency-overview': [ROLES.OWNER, ROLES.MANAGER],
  '/experiments': [ROLES.OWNER, ROLES.MANAGER, ROLES.CONTRIBUTOR],
  '/clients/:clientId': [ROLES.OWNER, ROLES.MANAGER, ROLES.CONTRIBUTOR],
  '/settings': [ROLES.OWNER]
});

function normalizeRole(role) {
  return String(role || '').trim().toLowerCase();
}

function isKnownRole(role) {
  return Object.values(ROLES).includes(normalizeRole(role));
}

function hasWorkspaceAccess(user, workspaceId) {
  const role = normalizeRole(user?.role);
  if (!isKnownRole(role) || !workspaceId) return false;
  if (role === ROLES.OWNER) return true;

  const workspaceMemberships = user?.workspaceMemberships || [];
  return workspaceMemberships.includes(workspaceId);
}

function hasClientAccess(user, clientId) {
  const role = normalizeRole(user?.role);
  if (!isKnownRole(role) || !clientId) return false;
  if (role === ROLES.OWNER || role === ROLES.MANAGER) return true;

  const clientMemberships = user?.clientMemberships || [];
  return clientMemberships.includes(clientId);
}

function canAccessRoute({ user, route, params = {} }) {
  const role = normalizeRole(user?.role);
  if (!isKnownRole(role)) {
    return { allowed: false, reason: 'unknown_role' };
  }

  const allowedRoles = ROUTE_POLICIES[route];
  if (!allowedRoles) {
    return { allowed: false, reason: 'unknown_route' };
  }
  if (!allowedRoles.includes(role)) {
    return { allowed: false, reason: 'role_not_allowed' };
  }

  const workspaceId = params.workspaceId || user?.activeWorkspaceId;
  if (!hasWorkspaceAccess(user, workspaceId)) {
    return { allowed: false, reason: 'workspace_access_denied' };
  }

  if (route === '/clients/:clientId' && !hasClientAccess(user, params.clientId)) {
    return { allowed: false, reason: 'client_access_denied' };
  }

  return { allowed: true, reason: 'ok' };
}

module.exports = {
  ROLES,
  ROUTE_POLICIES,
  normalizeRole,
  isKnownRole,
  hasWorkspaceAccess,
  hasClientAccess,
  canAccessRoute
};
