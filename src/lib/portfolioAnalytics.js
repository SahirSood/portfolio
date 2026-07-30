const ANALYTICS_ENDPOINT =
  import.meta.env.VITE_PORTFOLIO_ANALYTICS_ENDPOINT || "/portfolio-analytics/event";
const ANALYTICS_ENABLED =
  (import.meta.env.VITE_PORTFOLIO_ANALYTICS_ENABLED || "true").toLowerCase() !== "false";
const SESSION_KEY = "portfolioAnalyticsSessionId";
const VISIT_STARTED_KEY = "portfolioAnalyticsVisitStarted";
const LAST_PATH_KEY = "portfolioAnalyticsLastPath";

let initialized = false;
let outboundListenerAttached = false;

export function initPortfolioAnalytics() {
  if (typeof window === "undefined" || initialized) {
    return false;
  }
  if (isPrivateStatsPath(window.location.pathname)) {
    return false;
  }

  attachOutboundClickTracking();
  initialized = true;
  return true;
}

export function trackPortfolioPageView(path) {
  const normalizedPath = path || `${window.location.pathname}${window.location.search}` || "/";
  const visitStarted = getSessionFlag(VISIT_STARTED_KEY);
  const lastPath = getSessionValue(LAST_PATH_KEY);
  if (visitStarted && lastPath === normalizedPath) {
    return;
  }

  setSessionValue(LAST_PATH_KEY, normalizedPath);
  if (!visitStarted) {
    setSessionValue(VISIT_STARTED_KEY, "true");
    recordPortfolioEvent("pageview", {
      path: normalizedPath,
      metadata: { action: "visit_start" },
    });
    return;
  }

  recordPortfolioEvent("route_view", {
    path: normalizedPath,
    metadata: { action: "route_view" },
  });
}

function attachOutboundClickTracking() {
  if (outboundListenerAttached || typeof document === "undefined") {
    return;
  }

  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;

      const target = new URL(anchor.href, window.location.href);
      if (target.origin === window.location.origin) return;

      recordPortfolioEvent("outbound_click", {
        path: `${window.location.pathname}${window.location.search}`,
        target_url: target.href,
      });
    },
    { capture: true },
  );

  outboundListenerAttached = true;
}

function recordPortfolioEvent(eventType, overrides = {}) {
  if (!ANALYTICS_ENABLED || typeof window === "undefined") {
    return;
  }
  if (isPrivateStatsPath(window.location.pathname)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const pathAttribution = attributionFromPath(window.location.pathname);
  const payload = {
    event_type: eventType,
    path: overrides.path || `${window.location.pathname}${window.location.search}` || "/",
    url: window.location.href,
    title: document.title,
    referrer: document.referrer || null,
    utm_source: params.get("utm_source") || pathAttribution.utm_source,
    utm_medium: params.get("utm_medium") || pathAttribution.utm_medium,
    utm_campaign: params.get("utm_campaign") || pathAttribution.utm_campaign,
    target_url: overrides.target_url || null,
    session_id: getSessionId(),
    metadata: {
      site: "portfolio",
      profile: params.get("profile"),
      ...(overrides.metadata || {}),
    },
  };
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, new Blob([body], { type: "text/plain" }));
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function attributionFromPath(pathname) {
  const normalized = String(pathname || "").replace(/\/+$/, "");
  if (
    normalized === "/about/linkedin" ||
    normalized === "/linkedin" ||
    normalized === "/linkedin-portfolio" ||
    normalized === "/linkedin-portfolio.html" ||
    normalized === "/featured-portfolio"
  ) {
    return {
      utm_source: "linkedin",
      utm_medium: "profile",
      utm_campaign: "portfolio_profile",
    };
  }
  return {};
}

function getSessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const next =
      window.crypto?.randomUUID?.() ||
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return null;
  }
}

function getSessionFlag(key) {
  return getSessionValue(key) === "true";
}

function getSessionValue(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setSessionValue(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    return false;
  }
  return true;
}

function isPrivateStatsPath(pathname) {
  return String(pathname || "").replace(/\/+$/, "") === "/stats";
}
