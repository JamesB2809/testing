const { loadConfig } = require('./config');

function createSupabaseHeaders(config, authType = 'anon') {
  const apiKey = authType === 'service_role' && config.supabaseServiceRoleKey
    ? config.supabaseServiceRoleKey
    : config.supabaseAnonKey;

  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
}

function createSupabaseRestRequest(path, options = {}, env = process.env) {
  const config = loadConfig(env);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return {
    url: `${config.supabaseUrl}/rest/v1${normalizedPath}`,
    options: {
      method: options.method || 'GET',
      headers: {
        ...createSupabaseHeaders(config, options.authType),
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    }
  };
}

module.exports = { createSupabaseRestRequest, createSupabaseHeaders };
