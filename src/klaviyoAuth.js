const crypto = require('node:crypto');

function loadKlaviyoConfig(env = process.env) {
  const required = ['KLAVIYO_CLIENT_ID', 'KLAVIYO_CLIENT_SECRET', 'KLAVIYO_REDIRECT_URI'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Missing required Klaviyo environment variables: ${missing.join(', ')}`);
  }

  return {
    clientId: env.KLAVIYO_CLIENT_ID,
    clientSecret: env.KLAVIYO_CLIENT_SECRET,
    redirectUri: env.KLAVIYO_REDIRECT_URI,
    tokenUrl: env.KLAVIYO_TOKEN_URL || 'https://a.klaviyo.com/oauth/token',
    authorizeUrl: env.KLAVIYO_AUTHORIZE_URL || 'https://www.klaviyo.com/oauth/authorize',
    defaultScopes: (env.KLAVIYO_SCOPES || 'campaigns:read flows:read templates:read lists:read profiles:read metrics:read').trim()
  };
}

function generateOAuthState(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function createKlaviyoAuthorizeUrl(options = {}, env = process.env) {
  const config = loadKlaviyoConfig(env);
  const state = options.state || generateOAuthState();
  const scopes = options.scopes || config.defaultScopes;

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: scopes,
    state
  });

  return {
    state,
    url: `${config.authorizeUrl}?${query.toString()}`
  };
}

function createKlaviyoTokenRequest(code, env = process.env) {
  if (!code) {
    throw new Error('Authorization code is required to request Klaviyo tokens.');
  }

  const config = loadKlaviyoConfig(env);

  return {
    url: config.tokenUrl,
    options: {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      }).toString()
    }
  };
}

module.exports = {
  loadKlaviyoConfig,
  generateOAuthState,
  createKlaviyoAuthorizeUrl,
  createKlaviyoTokenRequest
};
