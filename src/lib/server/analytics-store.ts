/** In-memory store until PostgreSQL on Timeweb. For admin dashboard later. */

interface SessionRecord {
  sessionId: string;
  lastSeen: number;
  firstSeen: number;
  userAgent?: string;
}

interface PageViewRecord {
  sessionId: string;
  path: string;
  at: number;
  referrer?: string | null;
  url?: string | null;
  referrerHost?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

const sessions = new Map<string, SessionRecord>();
const pageViews: PageViewRecord[] = [];
const ONLINE_MS = 5 * 60 * 1000;

export function touchSession(sessionId: string, userAgent?: string) {
  const now = Date.now();
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.lastSeen = now;
  } else {
    sessions.set(sessionId, {
      sessionId,
      lastSeen: now,
      firstSeen: now,
      userAgent,
    });
  }
}

export function recordPageView(
  sessionId: string,
  path: string,
  referrer?: string | null,
  url?: string | null,
) {
  touchSession(sessionId);
  const parsed = parseTraffic(url, referrer);
  pageViews.push({
    sessionId,
    path,
    at: Date.now(),
    referrer,
    url,
    referrerHost: parsed.referrerHost,
    utmSource: parsed.utmSource,
    utmMedium: parsed.utmMedium,
    utmCampaign: parsed.utmCampaign,
  });
  if (pageViews.length > 50_000) pageViews.splice(0, 10_000);
}

export function getAnalyticsSnapshot() {
  const now = Date.now();
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayStartTs = dayStart.getTime();

  const online = [...sessions.values()].filter(
    (s) => now - s.lastSeen < ONLINE_MS,
  ).length;

  const todaySessions = new Set<string>();
  const todayViews = pageViews.filter((pv) => {
    if (pv.at >= dayStartTs) {
      todaySessions.add(pv.sessionId);
      return true;
    }
    return false;
  });

  const pathCounts = new Map<string, number>();
  const refHostCounts = new Map<string, number>();
  const utmSourceCounts = new Map<string, number>();
  const utmCampaignCounts = new Map<string, number>();
  const hourlyPageViews = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
  }));

  for (const pv of todayViews) {
    pathCounts.set(pv.path, (pathCounts.get(pv.path) ?? 0) + 1);
    const hour = new Date(pv.at).getHours();
    hourlyPageViews[hour].count += 1;
    const host = pv.referrerHost ?? "direct";
    refHostCounts.set(host, (refHostCounts.get(host) ?? 0) + 1);
    if (pv.utmSource) {
      utmSourceCounts.set(
        pv.utmSource,
        (utmSourceCounts.get(pv.utmSource) ?? 0) + 1,
      );
    }
    if (pv.utmCampaign) {
      utmCampaignCounts.set(
        pv.utmCampaign,
        (utmCampaignCounts.get(pv.utmCampaign) ?? 0) + 1,
      );
    }
  }
  const topPages = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const visits = [...todaySessions]
    .map((sessionId) => sessions.get(sessionId))
    .filter((s): s is SessionRecord => Boolean(s))
    .map((s) => {
      const durationSec = Math.max(
        0,
        Math.floor((Math.min(s.lastSeen, now) - Math.max(s.firstSeen, dayStartTs)) / 1000),
      );
      return {
        sessionId: s.sessionId,
        firstSeenAt: s.firstSeen,
        lastSeenAt: s.lastSeen,
        durationSec,
      };
    });

  const avgDurationSec = visits.length
    ? Math.round(visits.reduce((sum, v) => sum + v.durationSec, 0) / visits.length)
    : 0;

  const recentVisits = visits
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .slice(0, 20);

  return {
    onlineNow: online,
    todayUnique: todaySessions.size,
    todayPageViews: todayViews.length,
    avgDurationSec,
    hourlyPageViews,
    recentVisits,
    topPages,
    topReferrers: topN(refHostCounts, 10),
    topUtmSources: topN(utmSourceCounts, 10),
    topUtmCampaigns: topN(utmCampaignCounts, 10),
  };
}

function topN(map: Map<string, number>, n: number) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value, count]) => ({ value, count }));
}

function parseTraffic(url?: string | null, referrer?: string | null): {
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  const referrerHost = safeHost(referrer);
  const u = safeUrl(url);
  const utmSource = u?.searchParams.get("utm_source") || null;
  const utmMedium = u?.searchParams.get("utm_medium") || null;
  const utmCampaign = u?.searchParams.get("utm_campaign") || null;
  return { referrerHost, utmSource, utmMedium, utmCampaign };
}

function safeUrl(value?: string | null): URL | null {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function safeHost(value?: string | null): string | null {
  const u = safeUrl(value);
  if (!u) return null;
  return u.hostname || null;
}
