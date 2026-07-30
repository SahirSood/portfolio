import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Eye,
  Github,
  Globe2,
  Lock,
  MapPin,
  MonitorPlay,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "sahirStatsDashboardKey";
const RANGE_OPTIONS = [1, 7, 30, 90];

export default function StatsDashboard() {
  const [accessKey, setAccessKey] = useState(() => readStoredKey());
  const [draftKey, setDraftKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Private Stats | Sahir Sood";
    const previous = ensureRobotsMeta().getAttribute("content");
    ensureRobotsMeta().setAttribute("content", "noindex,nofollow");
    return () => ensureRobotsMeta().setAttribute("content", previous || "index,follow");
  }, []);

  const fetchStats = useCallback(async () => {
    if (!accessKey) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/private-stats/summary?days=${days}&limit=25`, {
        cache: "no-store",
        headers: {
          "x-stats-dashboard-key": accessKey,
        },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 401) {
          clearStoredKey();
          setAccessKey("");
        }
        throw new Error(payload?.error || `Stats request failed with ${response.status}`);
      }
      setStats(payload);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Stats request failed");
    } finally {
      setLoading(false);
    }
  }, [accessKey, days]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totals = stats?.totals || {};
  const sourceWarnings = useMemo(() => {
    if (!stats?.sources) return [];
    return Object.entries(stats.sources)
      .filter(([, source]) => !source.ok)
      .map(([name, source]) => `${titleCase(name)}: ${source.error}`);
  }, [stats]);

  const submit = (event) => {
    event.preventDefault();
    const nextKey = draftKey.trim();
    if (!nextKey) return;
    if (remember) writeStoredKey(nextKey);
    setAccessKey(nextKey);
    setDraftKey("");
  };

  if (!accessKey) {
    return (
      <main className="min-h-screen bg-[#f7f8fb] text-neutral-950">
        <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-10">
          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-neutral-950 text-white">
                <Lock size={18} />
              </span>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Private stats</h1>
                <p className="text-sm text-neutral-500">sahirsood.com/stats</p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Dashboard key</span>
                <input
                  value={draftKey}
                  onChange={(event) => setDraftKey(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-md border border-neutral-300 bg-white px-3 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <input
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                  className="size-4 accent-blue-600"
                />
                Remember on this device
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ShieldCheck size={18} />
                Unlock
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-neutral-950">
      <section className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600">Private</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Portfolio stats</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {stats?.generated_at ? `Updated ${formatDateTime(stats.generated_at)}` : "Waiting for data"}
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <SegmentedControl value={days} onChange={setDays} />
            <IconButton label="Refresh" onClick={fetchStats} disabled={loading}>
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            </IconButton>
            <button
              type="button"
              onClick={() => {
                clearStoredKey();
                setAccessKey("");
                setStats(null);
              }}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700"
            >
              Lock
            </button>
          </div>
        </header>

        {error ? <Banner tone="error" message={error} /> : null}
        {sourceWarnings.map((warning) => (
          <Banner key={warning} tone="warn" message={warning} />
        ))}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Eye} label="Portfolio" value={totals.portfolio_views} sub="views" />
          <MetricCard icon={Globe2} label="Market site" value={totals.market_views} sub="views" />
          <MetricCard icon={MonitorPlay} label="Demo" value={totals.demo_clicks} sub="clicks" />
          <MetricCard icon={Github} label="GitHub" value={totals.github_clicks} sub="clicks" />
        </section>

        <section className="mt-3 grid gap-3 sm:grid-cols-3">
          <CompactStat label="Unique visitors" value={totals.unique_visitors} />
          <CompactStat label="Unique sessions" value={totals.unique_sessions} />
          <CompactStat label="Total events" value={totals.total_events} />
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Surfaces" icon={BarChart3}>
            <div className="space-y-3">
              {safeArray(stats?.surfaces).map((surface) => (
                <SurfaceRow key={surface.id} surface={surface} max={maxSurfaceCount(stats?.surfaces)} />
              ))}
              {!stats && <SkeletonRows />}
            </div>
          </Panel>

          <Panel title="Top locations" icon={MapPin}>
            <TwoColumnList
              leftTitle="Countries"
              rightTitle="Cities"
              leftItems={safeArray(stats?.top_countries).map((item) => ({
                label: item.country_code,
                count: item.count,
              }))}
              rightItems={safeArray(stats?.top_cities).map((item) => ({
                label: [item.city, item.region, item.country_code].filter(Boolean).join(", "),
                count: item.count,
              }))}
            />
          </Panel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title="Top sources" icon={Globe2}>
            <RankedList
              items={safeArray(stats?.top_sources).map((item) => ({
                label: item.source,
                count: item.count,
              }))}
            />
          </Panel>

          <Panel title="Outbound targets" icon={Github}>
            <RankedList
              items={safeArray(stats?.top_outbound_targets).map((item) => ({
                label: item.target_domain,
                count: item.count,
              }))}
            />
          </Panel>
        </section>

        <Panel title="Recent activity" icon={Eye} className="mt-4">
          <div className="divide-y divide-neutral-100">
            {safeArray(stats?.recent_events).slice(0, 16).map((event) => (
              <RecentEvent key={event.id} event={event} />
            ))}
            {safeArray(stats?.recent_events).length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No activity in this range.</p>
            ) : null}
          </div>
        </Panel>
      </section>
    </main>
  );
}

function MetricCard({ icon, label, value, sub }) {
  const Icon = icon;
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{formatNumber(value)}</p>
          <p className="mt-1 text-xs uppercase text-neutral-400">{sub}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-blue-50 text-blue-700">
          <Icon size={20} />
        </span>
      </div>
    </article>
  );
}

function CompactStat({ label, value }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{formatNumber(value)}</p>
    </article>
  );
}

function Panel({ title, icon, className = "", children }) {
  const Icon = icon;
  return (
    <section className={classNames("rounded-lg border border-neutral-200 bg-white p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={17} className="text-blue-700" />
        <h2 className="text-sm font-semibold uppercase text-neutral-700">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SurfaceRow({ surface, max }) {
  const pct = max ? Math.max(4, Math.round((surface.count / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-neutral-800">{surface.label}</span>
        <span className="font-mono text-neutral-600">{formatNumber(surface.count)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-neutral-100">
        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-neutral-500">
        <span>{surface.metric_name}</span>
        <span>{formatNumber(surface.unique_visitors)} visitors</span>
      </div>
    </div>
  );
}

function TwoColumnList({ leftTitle, rightTitle, leftItems, rightItems }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-neutral-500">{leftTitle}</h3>
        <RankedList items={leftItems} />
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase text-neutral-500">{rightTitle}</h3>
        <RankedList items={rightItems} />
      </div>
    </div>
  );
}

function RankedList({ items }) {
  const rows = safeArray(items).filter((item) => item.label);
  if (!rows.length) return <p className="py-4 text-sm text-neutral-500">No data yet.</p>;
  const max = Math.max(...rows.map((item) => Number(item.count) || 0), 1);
  return (
    <div className="space-y-2">
      {rows.slice(0, 8).map((item) => {
        const pct = Math.max(5, Math.round(((Number(item.count) || 0) / max) * 100));
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-neutral-700">{item.label}</span>
              <span className="font-mono text-neutral-500">{formatNumber(item.count)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-neutral-100">
              <div className="h-1.5 rounded-full bg-neutral-800" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentEvent({ event }) {
  const location = [event.geo?.city, event.geo?.region, event.geo?.country_code].filter(Boolean).join(", ");
  return (
    <article className="grid gap-1 py-3 text-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
      <time className="text-xs text-neutral-500">{formatDateTime(event.timestamp)}</time>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-800">
          {titleCase(event.site)} {event.event_type === "outbound_click" ? "click" : "view"}
        </p>
        <p className="truncate text-xs text-neutral-500">
          {[event.source, event.path, event.target_domain].filter(Boolean).join(" / ")}
        </p>
      </div>
      <p className="truncate text-xs text-neutral-500 sm:max-w-[220px]">{location || "Unknown location"}</p>
    </article>
  );
}

function SegmentedControl({ value, onChange }) {
  return (
    <div className="flex rounded-md border border-neutral-300 bg-white p-1">
      {RANGE_OPTIONS.map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => onChange(days)}
          className={classNames(
            "min-w-12 rounded px-3 py-1.5 text-sm font-medium transition",
            value === days ? "bg-neutral-950 text-white" : "text-neutral-600 hover:bg-neutral-100",
          )}
        >
          {days}d
        </button>
      ))}
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-10 place-items-center rounded-md border border-neutral-300 bg-white text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function Banner({ tone, message }) {
  return (
    <div
      className={classNames(
        "mt-4 rounded-md border px-4 py-3 text-sm",
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      {message}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse">
          <div className="h-4 w-28 rounded bg-neutral-200" />
          <div className="mt-2 h-2 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

function maxSurfaceCount(surfaces) {
  return Math.max(...safeArray(surfaces).map((surface) => Number(surface.count) || 0), 1);
}

function readStoredKey() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function writeStoredKey(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return false;
  }
  return true;
}

function clearStoredKey() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return false;
  }
  return true;
}

function ensureRobotsMeta() {
  let meta = document.querySelector('meta[name="robots"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    document.head.appendChild(meta);
  }
  return meta;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}
