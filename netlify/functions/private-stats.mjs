import { getStore } from "@netlify/blobs";

const STORE_NAME = "portfolio-analytics";
const MAX_RECENT_EVENTS = 100;
const DEFAULT_MARKET_API_URL = "https://market-sim-api.onrender.com";

export default async function privateStats(request) {
  const method = requestMethod(request);
  if (method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  const url = new URL(requestUrl(request));
  const route = url.pathname.replace(/^\/private-stats\/?/, "") || "summary";
  if (method !== "GET" || route !== "summary") {
    return jsonResponse({ error: "Private stats route not found" }, 404);
  }

  if (!isAuthorized(request)) {
    return jsonResponse({ error: "Stats dashboard key required" }, 401);
  }

  const days = clampInteger(url.searchParams.get("days"), 1, 365, 30);
  const limit = clampInteger(url.searchParams.get("limit"), 1, MAX_RECENT_EVENTS, 20);
  const [portfolioResult, marketResult] = await Promise.all([
    readPortfolioSummary(days, limit),
    readMarketSummary(days, limit),
  ]);

  return jsonResponse(combineSummaries({ days, limit, portfolioResult, marketResult }));
}

export const config = {
  path: "/private-stats/*",
  method: ["GET", "OPTIONS"],
};

function isAuthorized(request) {
  const expected = process.env.STATS_DASHBOARD_KEY || process.env.PORTFOLIO_ANALYTICS_KEY || "";
  const supplied =
    header(request, "x-stats-dashboard-key") ||
    bearerToken(header(request, "authorization")) ||
    "";
  return Boolean(expected) && supplied === expected;
}

async function readPortfolioSummary(days, limit) {
  try {
    const since = Date.now() - days * 24 * 60 * 60 * 1000;
    const events = (await readPortfolioEvents(days)).filter((event) => Date.parse(event.timestamp) >= since);
    return {
      ok: true,
      data: portfolioSummary(events, days, limit),
    };
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error),
      data: emptySummary("portfolio", days),
    };
  }
}

async function readMarketSummary(days, limit) {
  const apiKey = process.env.MARKET_SIM_API_KEY || process.env.ARENA_API_KEY || "";
  const baseUrl = String(process.env.MARKET_SIM_API_URL || DEFAULT_MARKET_API_URL).replace(/\/+$/, "");
  if (!apiKey) {
    return {
      ok: false,
      error: "MARKET_SIM_API_KEY is not configured",
      data: emptySummary("market", days),
    };
  }

  try {
    const response = await fetch(`${baseUrl}/analytics/summary?days=${days}&limit=${limit}`, {
      headers: {
        "X-API-Key": apiKey,
        "X-Actor": "portfolio-private-stats",
      },
    });
    if (!response.ok) {
      throw new Error(`Market analytics returned ${response.status}`);
    }
    return {
      ok: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      ok: false,
      error: errorMessage(error),
      data: emptySummary("market", days),
    };
  }
}

function combineSummaries({ days, limit, portfolioResult, marketResult }) {
  const portfolio = portfolioResult.data || emptySummary("portfolio", days);
  const market = marketResult.data || emptySummary("market", days);
  const marketSurfaces = market.tracked_surfaces || {};

  const surfaces = [
    surfaceFromSummary("portfolio", "Portfolio", portfolio, "views"),
    surfaceFromSummary("market-site", "Market site", marketSurfaces.site || market, "views"),
    surfaceFromSummary("demo", "Demo", marketSurfaces.demo || {}, "clicks"),
    surfaceFromSummary("github", "GitHub", marketSurfaces.github || {}, "clicks"),
  ];

  const recentEvents = [
    ...normalizeEvents(portfolio.recent_events || [], "portfolio"),
    ...normalizeEvents(market.recent_events || [], "market"),
  ]
    .sort((a, b) => Date.parse(b.timestamp || 0) - Date.parse(a.timestamp || 0))
    .slice(0, limit);

  return {
    ok: portfolioResult.ok || marketResult.ok,
    generated_at: new Date().toISOString(),
    window_days: days,
    sources: {
      portfolio: {
        ok: portfolioResult.ok,
        error: portfolioResult.error || null,
      },
      market: {
        ok: marketResult.ok,
        error: marketResult.error || null,
      },
    },
    totals: {
      total_events: number(portfolio.total_events) + number(market.total_events),
      pageviews: number(portfolio.pageviews) + number(market.pageviews),
      outbound_clicks: number(portfolio.outbound_clicks) + number(market.outbound_clicks),
      unique_sessions: number(portfolio.unique_sessions) + number(market.unique_sessions),
      unique_visitors: number(portfolio.unique_visitors) + number(market.unique_visitors),
      portfolio_views: number(portfolio.pageviews),
      market_views: number((marketSurfaces.site || market).views ?? market.pageviews),
      demo_clicks: number(marketSurfaces.demo?.clicks),
      github_clicks: number(marketSurfaces.github?.clicks),
    },
    surfaces,
    top_sources: mergePairs(
      [portfolio.top_sources || [], market.top_sources || []],
      "source",
      limit,
    ),
    top_countries: mergePairs(
      [portfolio.top_countries || [], market.top_countries || []],
      "country_code",
      limit,
    ),
    top_cities: mergeCities([portfolio.top_cities || [], market.top_cities || []], limit),
    top_outbound_targets: mergePairs(
      [portfolio.top_outbound_targets || [], market.top_outbound_targets || []],
      "target_domain",
      limit,
    ),
    recent_events: recentEvents,
    raw: {
      portfolio,
      market,
    },
  };
}

function surfaceFromSummary(id, label, summary, metricName) {
  const primary = number(summary?.[metricName]);
  const fallback = metricName === "views" ? number(summary?.pageviews) : number(summary?.outbound_clicks);
  return {
    id,
    label,
    metric_name: metricName,
    count: primary || fallback,
    events: number(summary?.events) || primary || fallback,
    unique_sessions: number(summary?.unique_sessions),
    unique_visitors: number(summary?.unique_visitors),
    top_sources: summary?.top_sources || [],
    top_countries: summary?.top_countries || [],
    top_cities: summary?.top_cities || [],
  };
}

function portfolioSummary(events, days, limit) {
  return {
    site: "portfolio",
    window_days: days,
    total_events: events.length,
    pageviews: countWhere(events, (event) => event.event_type === "pageview"),
    outbound_clicks: countWhere(events, (event) => event.event_type === "outbound_click"),
    unique_sessions: uniqueCount(events, "session_id"),
    unique_visitors: uniqueCount(events, "visitor_hash"),
    by_day: topPairs(events, (event) => String(event.timestamp || "").slice(0, 10), days, "date"),
    top_sources: topPairs(
      events.filter((event) => event.event_type === "pageview"),
      (event) => event.source,
      limit,
      "source",
    ),
    top_paths: topPairs(
      events.filter((event) => event.event_type === "pageview"),
      (event) => event.path,
      limit,
      "path",
    ),
    top_countries: topPairs(
      events.filter((event) => event.event_type === "pageview"),
      (event) => event.geo?.country_code,
      limit,
      "country_code",
    ),
    top_cities: topGeo(events, limit),
    top_outbound_targets: topPairs(
      events.filter((event) => event.event_type === "outbound_click"),
      (event) => event.target_domain,
      limit,
      "target_domain",
    ),
    recent_events: events
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, limit),
  };
}

async function readPortfolioEvents(days) {
  const store = getStore(STORE_NAME);
  const events = [];
  for (const prefix of datePrefixes(days)) {
    const { blobs } = await store.list({ prefix });
    for (const blob of blobs) {
      const entry = await store.get(blob.key, { type: "json", consistency: "strong" });
      if (entry) {
        events.push(entry);
      }
    }
  }
  return events;
}

function normalizeEvents(events, site) {
  return events.map((event) => ({
    id: `${site}:${event.id}`,
    site,
    timestamp: event.timestamp,
    event_type: event.event_type,
    path: event.path,
    source: event.source || event.utm_source || event.referrer_domain || "direct",
    target_domain: event.target_domain,
    geo: event.geo || {},
  }));
}

function mergePairs(groups, keyName, limit) {
  const counts = new Map();
  for (const group of groups) {
    for (const item of group) {
      const key = item?.[keyName] || "unknown";
      counts.set(key, (counts.get(key) || 0) + number(item?.count));
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ [keyName]: key, count }));
}

function mergeCities(groups, limit) {
  const counts = new Map();
  for (const group of groups) {
    for (const item of group) {
      const key = [item?.city || "unknown", item?.region || "", item?.country_code || ""].join("|");
      counts.set(key, (counts.get(key) || 0) + number(item?.count));
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [city, region, country_code] = key.split("|");
      return { city, region: region || null, country_code: country_code || null, count };
    });
}

function emptySummary(site, days) {
  return {
    site,
    window_days: days,
    total_events: 0,
    pageviews: 0,
    outbound_clicks: 0,
    unique_sessions: 0,
    unique_visitors: 0,
    top_sources: [],
    top_countries: [],
    top_cities: [],
    top_outbound_targets: [],
    recent_events: [],
    tracked_surfaces: {},
  };
}

function datePrefixes(days) {
  const prefixes = [];
  const seen = new Set();
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(Date.now() - offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const prefix = `events/${date}/`;
    if (!seen.has(prefix)) {
      seen.add(prefix);
      prefixes.push(prefix);
    }
  }
  return prefixes;
}

function topPairs(events, keyFn, limit, keyName) {
  const counts = new Map();
  for (const event of events) {
    const key = keyFn(event) || "unknown";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ [keyName]: key, count }));
}

function topGeo(events, limit) {
  const counts = new Map();
  for (const event of events.filter((item) => item.event_type === "pageview")) {
    const geo = event.geo || {};
    if (!geo.city) continue;
    const key = [geo.city, geo.region || "", geo.country_code || ""].join("|");
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => {
      const [city, region, country_code] = key.split("|");
      return { city, region: region || null, country_code: country_code || null, count };
    });
}

function uniqueCount(events, key) {
  return new Set(events.map((event) => event[key]).filter(Boolean)).size;
}

function countWhere(events, predicate) {
  return events.filter(predicate).length;
}

function requestMethod(request) {
  return String(request.method || request.httpMethod || "GET").toUpperCase();
}

function requestUrl(request) {
  if (request.url) return request.url;
  const rawPath = request.rawUrl || request.path || "/private-stats/summary";
  return rawPath.startsWith("http") ? rawPath : `https://sahirsood.com${rawPath}`;
}

function header(request, name) {
  if (typeof request.headers?.get === "function") {
    return request.headers.get(name);
  }
  const headers = request.headers || {};
  const target = name.toLowerCase();
  const found = Object.keys(headers).find((key) => key.toLowerCase() === target);
  return found ? headers[found] : null;
}

function bearerToken(value) {
  const match = String(value || "").match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function jsonResponse(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Access-Control-Allow-Headers": "content-type,authorization,x-stats-dashboard-key",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
