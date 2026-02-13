const { loadConfig } = require('./config');

function buildRedirect(baseUrl, nextPath = '/dashboard') {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = nextPath.startsWith('/') ? nextPath : `/${nextPath}`;
  return `${normalizedBase}${normalizedPath}`;
}

function createMagicLinkPayload(email, options = {}, env = process.env) {
  if (!email || !email.includes('@')) {
    throw new Error('Valid email is required for magic link sign-in.');
  }

  const config = loadConfig(env);
  const redirectTo = buildRedirect(options.siteUrl || 'http://localhost:4173', options.nextPath || '/dashboard');

  return {
    url: `${config.supabaseUrl}/auth/v1/otp`,
    options: {
      method: 'POST',
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        create_user: true,
        data: {
          role: options.role || 'contributor'
        },
        options: {
          email_redirect_to: redirectTo
        }
      })
    }
  };
}

function createGoogleOAuthUrl(options = {}, env = process.env) {
  const config = loadConfig(env);
  const redirectTo = buildRedirect(options.siteUrl || 'http://localhost:4173', options.nextPath || '/dashboard');
  const query = new URLSearchParams({
    provider: 'google',
    redirect_to: redirectTo
  }).toString();

  return `${config.supabaseUrl}/auth/v1/authorize?${query}`;
}

module.exports = {
  createMagicLinkPayload,
  createGoogleOAuthUrl,
  buildRedirect
};
