const ANALYTICS_ENDPOINT =
  import.meta.env.VITE_PORTFOLIO_ANALYTICS_ENDPOINT || "/portfolio-analytics/event";
const ANALYTICS_ENABLED =
  (import.meta.env.VITE_PORTFOLIO_ANALYTICS_ENABLED || "true").toLowerCase() !== "false";
const SESSION_KEY = "portfolioAnalyticsSessionId";

let initialized = false;
let outboundListenerAttached = false;

export function initPortfolioAnalytics() {
  if (typeof window === "undefined" || initialized) {
    return false;
  }

  attachOutboundClickTracking();
  initialized = true;
  return true;
}

export function trackPortfolioPageView(path) {
  recordPortfolioEvent("pageview", { path });
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
    normalized === "/linkedin-portfolio.html"
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
