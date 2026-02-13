const REQUIRED_KEYS = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];

function loadConfig(env = process.env) {
  const missing = REQUIRED_KEYS.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
    supabaseSchema: env.SUPABASE_SCHEMA || 'public'
  };
}

module.exports = { loadConfig, REQUIRED_KEYS };
