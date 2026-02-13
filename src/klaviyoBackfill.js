const {
  createCampaignsRequest,
  createFlowMessagesRequest,
  createSegmentsRequest,
  createTemplatesRequest,
  createVariantsRequest
} = require('./klaviyoConnector');

const DEFAULT_BACKFILL_MONTHS = 12;

function toIsoDate(value) {
  return value.toISOString().slice(0, 10);
}

function monthsAgo(date, months) {
  const d = new Date(date.getTime());
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

function buildBackfillWindow(now = new Date(), months = DEFAULT_BACKFILL_MONTHS) {
  const end = new Date(now.getTime());
  const start = monthsAgo(end, months);
  return {
    start,
    end,
    startDate: toIsoDate(start),
    endDate: toIsoDate(end)
  };
}

function createHistoricalBackfillPlan(accessToken, options = {}, env = process.env) {
  if (!accessToken) {
    throw new Error('Access token is required for Klaviyo backfill planning.');
  }

  const pageSize = options.pageSize || 100;
  const window = buildBackfillWindow(options.now || new Date(), options.months || DEFAULT_BACKFILL_MONTHS);

  const query = {
    page_size: pageSize,
    'filter[greater-or-equal]': window.startDate,
    'filter[less-or-equal]': window.endDate
  };

  return [
    {
      entityType: 'campaign',
      request: createCampaignsRequest(accessToken, query, env)
    },
    {
      entityType: 'flow_message',
      request: createFlowMessagesRequest(accessToken, query, env)
    },
    {
      entityType: 'segment',
      request: createSegmentsRequest(accessToken, { page_size: pageSize }, env)
    },
    {
      entityType: 'template',
      request: createTemplatesRequest(accessToken, { page_size: pageSize }, env)
    },
    {
      entityType: 'variant',
      request: createVariantsRequest(accessToken, query, env)
    }
  ];
}

module.exports = {
  DEFAULT_BACKFILL_MONTHS,
  buildBackfillWindow,
  createHistoricalBackfillPlan
};
