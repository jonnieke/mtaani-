import * as googleTrends from 'google-trends-api';
import cron from 'node-cron';
import { ensureFirebase } from './firebase';

interface TrendItem {
  id: string;
  topic: string;
  searchVolume: string;
  description?: string;
}

const COLLECTION = 'trending_topics';

export async function fetchTrendingFootballTopics(): Promise<TrendItem[]> {
  try {
    const now = new Date();
    const geosEnv = process.env.TREND_GEOS || 'GB,ES,IT,DE,FR,US,BR,NG,KE,ZA,IN,SA';
    const geos = geosEnv.split(',').map((g) => g.trim()).filter(Boolean);

    const results = await Promise.allSettled(
      geos.map((geo) => googleTrends.dailyTrends({ trendDate: now, geo }))
    );

    const footballRegex = /\b(football|soccer|premier league|epl|la\s?liga|laliga|serie\s?a|bundesliga|ligue\s?1|champions league|ucl|europa league|conference league|afcon|caf|fifa|uefa|world cup|copa del rey|fa cup|carabao|super cup|messi|ronaldo|mbappe|haaland|salah|arsenal|chelsea|liverpool|man\s?city|man\s?united|barca|barcelona|real\s?madrid|atletico|psg|bayern|dortmund|juventus|inter|milan|napoli|roma|marseille|ajax|benfica)\b/i;

    const trafficToNumber = (t: string | undefined): number => {
      if (!t) return 0;
      // Examples: "200K+", "1M+", "50,000+"
      const cleaned = t.replace(/[,\s+]/g, '').toUpperCase();
      const m = cleaned.match(/([0-9]*\.?[0-9]+)(K|M)?/);
      if (!m) return 0;
      const num = parseFloat(m[1]);
      const unit = m[2];
      if (unit === 'M') return Math.round(num * 1_000_000);
      if (unit === 'K') return Math.round(num * 1_000);
      return Math.round(num);
    };

    const topicMap = new Map<string, { item: TrendItem; score: number }>();

    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      try {
        const parsed = JSON.parse(r.value);
        const days = parsed.default?.trendingSearchesDays || [];
        for (const day of days) {
          const list = day?.trendingSearches || [];
          for (const s of list) {
            const topic = (s.title?.query || '').trim();
            if (!topic) continue;
            if (!footballRegex.test(topic)) continue;
            const vol = trafficToNumber(s.formattedTraffic);
            const key = topic.toLowerCase();
            const existing = topicMap.get(key);
            const item: TrendItem = {
              id: key,
              topic,
              searchVolume: s.formattedTraffic || '',
              description: 'Trending on Google',
            };
            const score = vol;
            if (!existing || score > existing.score) {
              topicMap.set(key, { item, score });
            }
          }
        }
      } catch {}
    }

    const merged = Array.from(topicMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((v, idx) => ({ ...v.item, id: String(idx + 1) }));

    return merged;
  } catch (err) {
    return [];
  }
}

export async function getCachedTrendingTopics(): Promise<TrendItem[]> {
  if (process.env.USE_FIRESTORE !== 'true') {
    return fetchTrendingFootballTopics();
  }
  const db = ensureFirebase();
  const doc = await db.collection(COLLECTION).doc('latest').get();
  if (!doc.exists) return fetchTrendingFootballTopics();
  const data = doc.data() as any;
  return (data?.items as TrendItem[]) || [];
}

export async function refreshAndCacheTrendingTopics(): Promise<TrendItem[]> {
  const items = await fetchTrendingFootballTopics();
  if (process.env.USE_FIRESTORE === 'true') {
    const db = ensureFirebase();
    await db.collection(COLLECTION).doc('latest').set({
      items,
      refreshedAt: new Date().toISOString(),
    });
  }
  return items;
}

export function scheduleTrendingRefresh() {
  // 6:00 and 17:00 EAT (UTC+3) => use cron in UTC: 03:00 and 14:00 UTC
  cron.schedule('0 3,14 * * *', async () => {
    try {
      await refreshAndCacheTrendingTopics();
    } catch {}
  }, { timezone: 'UTC' });
}


