import fs from "node:fs";
import path from "node:path";

// 障害福祉サービス等情報公表システム(WAM NET)のオープンデータを読む層。
// CSVに書かれている値だけを扱い、欠けている項目は欠けたまま返す(推測で埋めない)。

export type Facility = {
  id: string;
  svc: "houday" | "jihatsu";
  name: string;
  corp: string;
  city: string;
  addr: string;
  tel: string;
  url: string;
  lat: string;
  lng: string;
  /** 利用可能な時間帯(平日) */
  wd: string;
  sat: string;
  sun: string;
  hol: string;
  /** 定休日 */
  off: string;
  memo: string;
  cap: number | null;
  /** 平日の終了時刻(時・小数)。CSVから読めた場合のみ */
  end: number | null;
  start: number | null;
};

export type PrefStat = {
  pref: string; slug: string; total: number; houday: number; jihatsu: number;
  sat: number; late18: number; cities: number;
};

export type Index = {
  surveyedAt: string;
  source: string;
  sourceUrl: string;
  counts: { houday: number; jihatsu: number };
  prefs: PrefStat[];
};

const DIR = path.join(process.cwd(), "data");

export const INDEX: Index = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf-8"));

const cache = new Map<string, Facility[]>();

export function loadPref(slug: string): Facility[] {
  if (cache.has(slug)) return cache.get(slug)!;
  const p = path.join(DIR, `pref-${slug}.json`);
  if (!fs.existsSync(p)) return [];
  const items: Facility[] = JSON.parse(fs.readFileSync(p, "utf-8")).items;
  cache.set(slug, items);
  return items;
}

export function prefBySlug(slug: string) {
  return INDEX.prefs.find((p) => p.slug === slug) || null;
}

export const SVC_LABEL: Record<Facility["svc"], string> = {
  houday: "放課後等デイサービス",
  jihatsu: "児童発達支援",
};

/** 市区町村スラッグ。日本語をそのままURLに使う(他サイトと同じ方式) */
export function citySlug(city: string) {
  return city;
}

export function cityList(items: Facility[]) {
  const m = new Map<string, Facility[]>();
  for (const f of items) {
    if (!f.city) continue;
    if (!m.has(f.city)) m.set(f.city, []);
    m.get(f.city)!.push(f);
  }
  return [...m.entries()]
    .map(([city, list]) => ({
      city,
      total: list.length,
      houday: list.filter((f) => f.svc === "houday").length,
      jihatsu: list.filter((f) => f.svc === "jihatsu").length,
      sat: list.filter((f) => f.sat).length,
      late18: list.filter((f) => f.end !== null && f.end >= 18).length,
      list,
    }))
    .sort((a, b) => b.total - a.total);
}

export function fmtHour(h: number | null) {
  if (h === null) return "—";
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${String(mm).padStart(2, "0")}`;
}

/** 市区町村の位置（事業所の緯度経度の中央値）。緯度経度が1件も無ければ null */
function cityCenter(list: Facility[]): [number, number] | null {
  const la = list.map((f) => parseFloat(f.lat)).filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  const ln = list.map((f) => parseFloat(f.lng)).filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!la.length || !ln.length) return null;
  return [la[Math.floor(la.length / 2)], ln[Math.floor(ln.length / 2)]];
}

/**
 * 同じ都道府県の中で、地理的に近い市区町村を n 件返す。
 * 位置は公表データの事業所の緯度経度の中央値で決める（当サイトの推計ではなく、近さの並べ替えにだけ使う）。
 * 以前は「事業所の多い順の上位12件」を出していたため、小さな市町村には一覧からしかリンクが無かった（2026-11-21）。
 */
function nearestRaw(prefSlug: string, city: string, n: number) {
  const all = cityList(loadPref(prefSlug));
  const me = all.find((x) => x.city === city);
  const c0 = me ? cityCenter(me.list) : null;
  const rest = all.filter((x) => x.city !== city);
  if (!c0) return rest.slice(0, n);
  const k = Math.cos((c0[0] * Math.PI) / 180);
  return rest
    .map((x) => {
      const c = cityCenter(x.list);
      const d = c ? Math.hypot(c[0] - c0[0], (c[1] - c0[1]) * k) : Infinity;
      return { x, d };
    })
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((v) => v.x);
}

export function nearestCities(prefSlug: string, city: string, n = 12) {
  const near = nearestRaw(prefSlug, city, n);
  // 離島など、どの市区町村から見ても上位 n 件に入らない所が孤立しないよう、
  // 「相手の近隣一覧に自分が入っている」市区町村も足す（リンクを双方向にする）。
  const have = new Set(near.map((x) => x.city));
  const back = cityList(loadPref(prefSlug)).filter(
    (y) => y.city !== city && !have.has(y.city) && nearestRaw(prefSlug, y.city, n).some((z) => z.city === city),
  );
  return [...near, ...back];
}
