import { createHash, randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "portfolio-analytics";
const ALLOWED_EVENT_TYPES = new Set(["pageview", "route_view", "outbound_click"]);
const MAX_RECENT_EVENTS = 100;

export default async function portfolioAnalytics(request, context) {
  const url = new URL(requestUrl(request));
  const route = url.pathname.replace(/^\/portfolio-analytics\/?/, "") || "event";
  const method = requestMethod(request);

  if (method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (method === "POST" && route === "event") {
    return recordEvent(request, context);
  }

  if (method === "GET" && route === "summary") {
    return getSummary(request);
  }

  return jsonResponse({ error: "Portfolio analytics route not found" }, 404);
}

export const config = {
  path: "/portfolio-analytics/*",
  method: ["GET", "POST", "OPTIONS"],
};

async function recordEvent(request, context) {
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    return jsonResponse({ error: "Invalid analytics payload" }, 400);
  }

  const timestamp = new Date();
  const attribution = attributionFromPayload(payload);
  const event = {
    id: randomUUID(),
    timestamp: timestamp.toISOString(),
    event_type: cleanEventType(payload.event_type),
    path: clean(payload.path, 512) || "/",
    url: clean(payload.url, 4096),
    title: clean(payload.title, 256),
    referrer: clean(payload.referrer, 4096),
    referrer_domain: domain(payload.referrer),
    source: attribution.source,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    target_url: clean(payload.target_url, 4096),
    target_domain: domain(payload.target_url),
    session_id: clean(payload.session_id, 128),
    visitor_hash: hashVisitor(clientIp(request)),
    user_agent: clean(header(request, "user-agent"), 512),
    geo: normalizeGeo(context?.geo),
    metadata: jsonSafe(payload.metadata || {}),
  };

  const store = getStore(STORE_NAME);
  const key = eventKey(timestamp, event.id);
  await store.setJSON(key, event, {
    metadata: {
      event_type: event.event_type,
      source: event.source,
      path: event.path,
      country: event.geo.country_code || event.geo.country || "",
    },
    onlyIfNew: true,
  });

  return jsonResponse({ ok: true, event_id: event.id });
}

async function getSummary(request) {
  const auth = header(request, "x-portfolio-analytics-key") || "";
  const expected = process.env.PORTFOLIO_ANALYTICS_KEY || "";
  if (!expected || auth !== expected) {
    return jsonResponse({ error: "Portfolio analytics key required" }, 401);
  }

  const url = new URL(request.url);
  const days = clampInteger(url.searchParams.get("days"), 1, 365, 30);
  const limit = clampInteger(url.searchParams.get("limit"), 1, MAX_RECENT_EVENTS, 20);
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const events = normalizeDuplicatePageviews(
    (await readEvents(days)).filter((event) => Date.parse(event.timestamp) >= since),
  );
  const visitEvents = events.filter((event) => event.event_type === "pageview");
  const routeEvents = events.filter((event) => isRouteEvent(event));

  return jsonResponse({
    site: "portfolio",
    window_days: days,
    total_events: events.length,
    pageviews: visitEvents.length,
    route_views: countWhere(events, (event) => event.event_type === "route_view"),
    outbound_clicks: countWhere(events, (event) => event.event_type === "outbound_click"),
    unique_sessions: uniqueCount(events, "session_id"),
    unique_visitors: uniqueCount(events, "visitor_hash"),
    by_day: topPairs(visitEvents, (event) => event.timestamp.slice(0, 10), days, "date"),
    top_sources: topPairs(
      visitEvents,
      (event) => event.source,
      limit,
      "source",
    ),
    top_paths: topPairs(
      routeEvents,
      (event) => event.path,
      limit,
      "path",
    ),
    top_countries: topPairs(
      visitEvents,
      (event) => event.geo?.country_code,
      limit,
      "country_code",
    ),
    top_cities: topGeo(visitEvents, limit),
    top_outbound_targets: topPairs(
      events.filter((event) => event.event_type === "outbound_click"),
      (event) => event.target_domain,
      limit,
      "target_domain",
    ),
    visits: visitSummaries(events, limit),
    recent_events: events
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, limit),
  });
}

async function readEvents(days) {
  const store = getStore(STORE_NAME);
  const events = [];
  const prefixes = datePrefixes(days);

  for (const prefix of prefixes) {
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

function eventKey(timestamp, id) {
  return `events/${timestamp.toISOString().slice(0, 10)}/${timestamp.toISOString()}-${id}.json`;
}

function cleanEventType(value) {
  const eventType = clean(value, 32) || "pageview";
  return ALLOWED_EVENT_TYPES.has(eventType) ? eventType : "pageview";
}

function attributionFromPayload(payload) {
  const pathAttribution = attributionFromPath(payload.path);
  const utmSource = clean(payload.utm_source, 128) || pathAttribution.utm_source;
  const utmMedium = clean(payload.utm_medium, 128) || pathAttribution.utm_medium;
  const utmCampaign = clean(payload.utm_campaign, 128) || pathAttribution.utm_campaign;
  return {
    source: utmSource || domain(payload.referrer) || "direct",
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
  };
}

function attributionFromPath(pathname) {
  const path = String(pathname || "").split("?")[0].replace(/\/+$/, "");
  if (
    path === "/about/linkedin" ||
    path === "/linkedin" ||
    path === "/linkedin-portfolio" ||
    path === "/linkedin-portfolio.html" ||
    path === "/featured-portfolio"
  ) {
    return {
      utm_source: "linkedin",
      utm_medium: "profile",
      utm_campaign: "portfolio_profile",
    };
  }
  return {};
}

function clientIp(request) {
  const forwarded = header(request, "x-forwarded-for");
  if (forwarded) return forwarded.split(",", 1)[0].trim();
  return header(request, "x-nf-client-connection-ip") || header(request, "client-ip") || "";
}

async function readJsonBody(request) {
  if (typeof request.json === "function") {
    return request.json();
  }
  if (typeof request.text === "function") {
    return JSON.parse(await request.text());
  }
  if (typeof request.body === "string") {
    const body = request.isBase64Encoded
      ? Buffer.from(request.body, "base64").toString("utf8")
      : request.body;
    return JSON.parse(body);
  }
  throw new Error("Unsupported request body");
}

function requestMethod(request) {
  return String(request.method || request.httpMethod || "GET").toUpperCase();
}

function requestUrl(request) {
  if (request.url) return request.url;
  const rawPath = request.rawUrl || request.path || "/portfolio-analytics/event";
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

function hashVisitor(ipAddress) {
  if (!ipAddress) return null;
  const salt = process.env.PORTFOLIO_ANALYTICS_SALT || process.env.PORTFOLIO_ANALYTICS_KEY || "portfolio";
  return createHash("sha256").update(`${salt}:${ipAddress}`).digest("hex");
}

function normalizeGeo(geo = {}) {
  const country = objectOrEmpty(geo.country);
  const subdivision = objectOrEmpty(geo.subdivision);
  const city = objectOrEmpty(geo.city);
  return {
    country: clean(country.name || geo.country, 128),
    country_code: clean(country.code || geo.countryCode, 8),
    region: clean(subdivision.name || subdivision.code || geo.region, 128),
    city: clean(city.name || geo.city, 128),
    timezone: clean(geo.timezone, 64),
    latitude: numberOrNull(geo.latitude),
    longitude: numberOrNull(geo.longitude),
    source: Object.keys(geo || {}).length ? "netlify" : null,
  };
}

function objectOrEmpty(value) {
  return value && typeof value === "object" ? value : {};
}

function domain(value) {
  if (!value) return null;
  try {
    return clean(new URL(value).hostname.toLowerCase(), 255);
  } catch {
    return null;
  }
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
  for (const event of events) {
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

function normalizeDuplicatePageviews(events) {
  const seen = new Set();
  return [...events]
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    .map((event) => {
      if (event.event_type !== "pageview") return event;
      const key = visitKey(event);
      if (!key) return event;
      if (!seen.has(key)) {
        seen.add(key);
        return event;
      }
      return {
        ...event,
        event_type: "route_view",
        metadata: {
          ...(event.metadata || {}),
          normalized_from: "pageview",
        },
      };
    });
}

function visitSummaries(events, limit) {
  const visits = groupedVisits(events);
  return visits
    .sort((a, b) => Date.parse(b.started_at) - Date.parse(a.started_at))
    .slice(0, limit)
    .map((visit) => ({
      id: visit.id,
      site: "portfolio",
      started_at: visit.started_at,
      last_seen_at: visit.last_seen_at,
      source: visit.source,
      entry_path: visit.entry_path,
      action_count: visit.events.length,
      route_count: visit.events.filter(isRouteEvent).length,
      outbound_count: visit.events.filter((event) => event.event_type === "outbound_click").length,
      geo: visit.geo,
      events: visit.events.map((event) => ({
        id: event.id,
        timestamp: event.timestamp,
        event_type: event.event_type,
        path: event.path,
        source: event.source,
        target_domain: event.target_domain,
        target_url: event.target_url,
      })),
    }));
}

function groupedVisits(events) {
  const visits = new Map();
  for (const event of [...events].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))) {
    const key = visitKey(event) || `event:${event.id}`;
    if (!visits.has(key)) {
      visits.set(key, {
        id: key,
        started_at: event.timestamp,
        last_seen_at: event.timestamp,
        source: event.source || "direct",
        entry_path: event.path || "/",
        geo: event.geo || {},
        events: [],
      });
    }
    const visit = visits.get(key);
    visit.last_seen_at = event.timestamp;
    if (event.event_type === "pageview") {
      visit.started_at = event.timestamp;
      visit.source = event.source || visit.source;
      visit.entry_path = event.path || visit.entry_path;
      visit.geo = event.geo || visit.geo;
    }
    visit.events.push(event);
  }
  return [...visits.values()];
}

function visitKey(event) {
  if (event.session_id) return `session:${event.session_id}`;
  if (event.visitor_hash) return `visitor:${event.visitor_hash}:${String(event.timestamp || "").slice(0, 10)}`;
  return null;
}

function isRouteEvent(event) {
  return event.event_type === "pageview" || event.event_type === "route_view";
}

function uniqueCount(events, key) {
  return new Set(events.map((event) => event[key]).filter(Boolean)).size;
}

function countWhere(events, predicate) {
  return events.filter(predicate).length;
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function clean(value, maxLength) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text.slice(0, maxLength) : null;
}

function numberOrNull(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function jsonSafe(value) {
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [String(key), jsonSafe(item)]));
  }
  if (["string", "number", "boolean"].includes(typeof value) || value === null) return value;
  return String(value);
}

function jsonResponse(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Access-Control-Allow-Headers": "content-type,x-portfolio-analytics-key",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
