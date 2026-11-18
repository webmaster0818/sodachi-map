"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/*
 * TOPのエリアマップ（2026-11-18 施主指示「トップページはエリアマップを作成して絞れる形に」）。
 *
 * 地図は47都道府県を同じ大きさのマスで並べた「タイル地図」。
 * 形の正確な地図は細かい県（東京・大阪・香川など）がスマホで押せない大きさになるため、
 * どの県も同じ大きさで押せる並べ方にしている（位置関係はおおよそ実際どおり）。
 *
 * 操作：地図のマスか地方名のボタンを押す → その地方の都道府県だけに絞り込んで一覧を出す
 *       → 都道府県名を押すとエリアページへ。最初は全国（全地方）を表示する。
 * 一覧は全地方ぶんを HTML に出しておき、絞り込みは表示の切り替えだけで行う
 * （JavaScript が動かなくても全都道府県へのリンクが残る）。
 */

type Pref = { slug: string; pref: string; total: number; sat: number; late18: number };

const REGIONS: { key: string; name: string; slugs: string[] }[] = [
  { key: "hokkaido", name: "北海道", slugs: ["hokkaido"] },
  { key: "tohoku", name: "東北", slugs: ["aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"] },
  { key: "kanto", name: "関東", slugs: ["ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa"] },
  { key: "chubu", name: "中部・北陸", slugs: ["niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu", "shizuoka", "aichi"] },
  { key: "kinki", name: "近畿", slugs: ["mie", "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"] },
  { key: "chugoku", name: "中国", slugs: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"] },
  { key: "shikoku", name: "四国", slugs: ["tokushima", "kagawa", "ehime", "kochi"] },
  { key: "kyushu", name: "九州・沖縄", slugs: ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"] },
];

/** マスの位置 [列, 行, 幅, 高さ]（13列×13行） */
const TILE: Record<string, [number, number, number?, number?]> = {
  hokkaido: [11, 0, 2, 2],
  aomori: [12, 2], akita: [11, 3], iwate: [12, 3], yamagata: [11, 4], miyagi: [12, 4], fukushima: [12, 5],
  ishikawa: [8, 4], toyama: [9, 4], niigata: [10, 4],
  fukui: [7, 5], gifu: [8, 5], nagano: [9, 5], gunma: [10, 5], tochigi: [11, 5],
  shimane: [3, 6], tottori: [4, 6], hyogo: [5, 6], kyoto: [6, 6], shiga: [7, 6], aichi: [8, 6], yamanashi: [9, 6], saitama: [10, 6], ibaraki: [11, 6],
  yamaguchi: [2, 7], hiroshima: [3, 7], okayama: [4, 7], osaka: [6, 7], nara: [7, 7], mie: [8, 7], shizuoka: [9, 7], tokyo: [10, 7], chiba: [11, 7],
  saga: [0, 8], fukuoka: [1, 8], oita: [2, 8], wakayama: [7, 8], kanagawa: [10, 8],
  nagasaki: [0, 9], kumamoto: [1, 9], miyazaki: [2, 9], ehime: [4, 9], kagawa: [5, 9],
  kagoshima: [1, 10], kochi: [4, 10], tokushima: [5, 10],
  okinawa: [0, 12],
};

const regionOf = new Map(REGIONS.flatMap((r) => r.slugs.map((s) => [s, r.key] as const)));
const short = (name: string) => (name === "北海道" ? "北海道" : name.replace(/[都府県]$/, ""));

export default function AreaMap({ prefs }: { prefs: Pref[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const byslug = new Map(prefs.map((p) => [p.slug, p]));

  const pick = (region: string | null, pref: string | null = null) => {
    setSel(region);
    setHot(pref);
    // スマホでは一覧が地図の下にあるため、一覧の頭が画面外なら見える位置まで送る
    const el = listRef.current;
    if (el && window.matchMedia("(max-width: 767px)").matches) {
      const top = el.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.6) el.scrollIntoView({ block: "start" });
    }
  };

  const shown = sel ? REGIONS.filter((r) => r.key === sel) : REGIONS;

  return (
    <div className="sm-map">
      {/* 地方ボタン */}
      <div className="sm-map-chips" role="group" aria-label="地方で絞り込む">
        <button type="button" className="sm-map-chip" aria-pressed={sel === null} onClick={() => pick(null)}>
          全国
        </button>
        {REGIONS.map((r) => (
          <button key={r.key} type="button" className="sm-map-chip" aria-pressed={sel === r.key} onClick={() => pick(r.key)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="sm-map-body">
        {/* タイル地図 */}
        <div className="sm-map-grid" aria-label="都道府県の地図（押すとその地方に絞り込みます）">
          {REGIONS.flatMap((r) =>
            r.slugs.map((s) => {
              const p = byslug.get(s);
              const t = TILE[s];
              if (!p || !t) return null;
              const [c, row, w = 1, h = 1] = t;
              const on = sel === r.key;
              const dim = sel !== null && !on;
              return (
                <button
                  key={s}
                  type="button"
                  className={`sm-map-tile sm-r-${r.key}${w > 1 ? " is-big" : short(p.pref).length >= 3 ? " is-long" : ""}${on ? " is-on" : ""}${dim ? " is-dim" : ""}${hot === s ? " is-hot" : ""}`}
                  style={{ gridColumn: `${c + 1} / span ${w}`, gridRow: `${row + 1} / span ${h}` }}
                  onClick={() => pick(regionOf.get(s) ?? null, s)}
                  aria-label={`${p.pref}（${r.name}）で絞り込む`}
                  aria-pressed={on}
                >
                  {short(p.pref).length >= 3 && w === 1 ? (
                    <>
                      <span className="sm-map-l">{short(p.pref)}</span>
                      <span className="sm-map-s" aria-hidden="true">{short(p.pref).slice(0, 2)}</span>
                    </>
                  ) : (
                    short(p.pref)
                  )}
                </button>
              );
            }),
          )}
        </div>

        {/* 絞り込んだ一覧 */}
        <div ref={listRef} className="sm-map-list" aria-live="polite">
          <p className="sm-map-list-head">
            {sel ? `${REGIONS.find((r) => r.key === sel)?.name}の都道府県` : "全国の都道府県"}
            <span className="jm-count ml-2">事業所数／土曜に開所／18時以降まで</span>
          </p>
          {REGIONS.map((r) => {
            const visible = shown.includes(r);
            const rp = r.slugs.map((s) => byslug.get(s)).filter((p): p is Pref => !!p);
            const sum = rp.reduce((a, p) => a + p.total, 0);
            return (
              <div key={r.key} hidden={!visible} className="sm-map-group">
                {!sel && (
                  <p className="sm-map-group-name">
                    {r.name}
                    <span className="jm-count ml-1">（{sum.toLocaleString()}事業所）</span>
                  </p>
                )}
                <ul className={sel ? "sm-map-rows is-big" : "sm-map-rows"}>
                  {rp.map((p) => (
                    <li key={p.slug} className={hot === p.slug ? "is-hot" : undefined}>
                      <Link href={`/area/${p.slug}/`} className="sm-map-row">
                        <span className="sm-map-row-name">{p.pref}</span>
                        <span className="jm-count tabular-nums">
                          {p.total.toLocaleString()}／土{p.sat.toLocaleString()}／18時{p.late18.toLocaleString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
