const { loadKlaviyoConfig } = require('./klaviyoAuth');

const KLAVIYO_REVISION = '2024-10-15';

function createKlaviyoApiHeaders(accessToken) {
  if (!accessToken) {
    throw new Error('Klaviyo access token is required.');
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    Revision: KLAVIYO_REVISION
  };
}

function createKlaviyoApiRequest(path, accessToken, options = {}, env = process.env) {
  const config = loadKlaviyoConfig(env);
  const apiBaseUrl = env.KLAVIYO_API_BASE_URL || 'https://a.klaviyo.com/api';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const url = new URL(`${apiBaseUrl}${normalizedPath}`);
  const params = options.params || {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return {
    url: url.toString(),
    options: {
      method: options.method || 'GET',
      headers: {
        ...createKlaviyoApiHeaders(accessToken),
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    },
    metadata: {
      clientId: config.clientId,
      revision: KLAVIYO_REVISION
    }
  };
}

function createCampaignsRequest(accessToken, query = {}, env = process.env) {
  return createKlaviyoApiRequest('/campaigns', accessToken, { params: query }, env);
}

function createFlowMessagesRequest(accessToken, query = {}, env = process.env) {
  return createKlaviyoApiRequest('/flow-messages', accessToken, { params: query }, env);
}

function createSegmentsRequest(accessToken, query = {}, env = process.env) {
  return createKlaviyoApiRequest('/segments', accessToken, { params: query }, env);
}

function createTemplatesRequest(accessToken, query = {}, env = process.env) {
  return createKlaviyoApiRequest('/templates', accessToken, { params: query }, env);
}

function createVariantsRequest(accessToken, query = {}, env = process.env) {
  return createKlaviyoApiRequest('/campaign-message-variations', accessToken, { params: query }, env);
}

function normalizeKlaviyoListResponse(responseBody, entityType) {
  const data = Array.isArray(responseBody?.data) ? responseBody.data : [];

  return data.map((item) => ({
    entityType,
    id: item.id,
    externalId: item.id,
    attributes: item.attributes || {},
    relationships: item.relationships || {},
    fetchedAt: new Date().toISOString()
  }));
}

module.exports = {
  KLAVIYO_REVISION,
  createKlaviyoApiHeaders,
  createKlaviyoApiRequest,
  createCampaignsRequest,
  createFlowMessagesRequest,
  createSegmentsRequest,
  createTemplatesRequest,
  createVariantsRequest,
  normalizeKlaviyoListResponse
};
