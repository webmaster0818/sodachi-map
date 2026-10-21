import Link from "next/link";
import { INDEX, loadPref, cityList } from "@/lib/data";
import AreaPicker from "@/components/AreaPicker";

/*
 * TOP（2026-10-08 ジョブメドレー型に作り直し）。
 *
 * 設計の軸は変えていない。「近くにどこがあるか」ではなく「うちの都合で通えるか」。
 * 競合(放デイマッチ・障害者ドットコム・LITALICO発達ナビ)は
 * 送迎・療育内容・空き状況では絞り込めるが、
 * 「平日の終わり時刻」「土曜に開いているか」では絞り込めない。そこを先頭に置く。
 *
 * 見せ方は job-medley.com の実測に合わせた:
 *   TOPを「件数つきリンクの索引」として作り、影を使わず罫線だけで区切る。
 *   数値はすべて公表データからの機械集計で、推計も評価も入れない。
 */

const total = INDEX.counts.houday + INDEX.counts.jihatsu;
const sat = INDEX.prefs.reduce((s, p) => s + p.sat, 0);
const late = INDEX.prefs.reduce((s, p) => s + p.late18, 0);
const cities = INDEX.prefs.reduce((s, p) => s + p.cities, 0);

const REGIONS: { name: string; slugs: string[] }[] = [
  { name: "北海道・東北", slugs: ["hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"] },
  { name: "関東", slugs: ["ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa"] },
  { name: "中部・北陸", slugs: ["niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu", "shizuoka", "aichi"] },
  { name: "近畿", slugs: ["mie", "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"] },
  { name: "中国・四国", slugs: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi", "tokushima", "kagawa", "ehime", "kochi"] },
  { name: "九州・沖縄", slugs: ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"] },
];

/** 事業所数の多い市区町村。ビルド時に全県から集計する */
function topCities(n: number) {
  const out: { pref: string; prefSlug: string; city: string; total: number; late18: number }[] = [];
  for (const p of INDEX.prefs) {
    for (const c of cityList(loadPref(p.slug))) {
      out.push({ pref: p.pref, prefSlug: p.slug, city: c.city, total: c.total, late18: c.late18 });
    }
  }
  return out.sort((a, b) => b.total - a.total).slice(0, n);
}

export default function Home() {
  const byslug = new Map(INDEX.prefs.map((p) => [p.slug, p]));
  const popular = topCities(36);

  return (
    <main>
      {/* ===== ヒーロー(スマホはファーストビューいっぱい・2026-10-21) ===== */}
      <section className="sm-hero">
        <picture className="sm-hero-media">
          <source media="(min-width: 768px)" srcSet="/img/hero-pc.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/img/hero-pc.jpg" />
          <source srcSet="/img/hero-sp.webp" type="image/webp" />
          <img src="/img/hero-sp.jpg" alt="夕方の住宅街を、手をつないで事業所へ向かう親子の後ろ姿(当サイトで作成したイメージ画像)" fetchPriority="high" />
        </picture>
        <div className="jm-wrap sm-hero-inner">
          <div className="md:max-w-[520px]">
            <p className="text-[12px] font-bold tracking-[.12em] text-white/85">放課後等デイサービス・児童発達支援</p>
            <h1 className="mt-2">
              「うちの都合で
              <br className="md:hidden" />
              通えるか」から、
              <br />
              預け先を探す。
            </h1>
            <p className="sm-hero-lead mt-3">
              全国{total.toLocaleString()}事業所を、平日の終わり時刻・土曜の開所・定員で比べられます。数値は国の公表データ（{INDEX.surveyedAt}時点）をそのまま集計しています。
            </p>
          </div>
          <div className="md:max-w-[520px] md:w-full">
            <div className="sm-hero-stats">
              <div className="sm-hero-stat"><b>{late.toLocaleString()}</b><span>18時以降まで開所</span></div>
              <div className="sm-hero-stat"><b>{sat.toLocaleString()}</b><span>土曜に開所</span></div>
              <div className="sm-hero-stat"><b>{cities.toLocaleString()}</b><span>市区町村</span></div>
            </div>
            <div className="mt-3 text-[var(--ink)]">
              <AreaPicker prefs={INDEX.prefs.map((p) => ({ slug: p.slug, pref: p.pref, total: p.total }))} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 条件から探す ===== */}
      <section className="jm-sec border-b border-[var(--line)] bg-[var(--bg-2)]">
        <div className="jm-wrap">
          <h2 className="jm-h2">通える条件から探す</h2>
          <p className="jm-lead mt-2">競合サイトはエリアから探す作りが中心です。当サイトは、共働きの家庭が実際に困る「終わりの時刻」と「土曜」から探せます。</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link href="/late/" className="sm-choice sm-choice-lg">
              <span className="sm-icon sm-icon-lg"><img src="/img/ic-late.webp" alt="" width={112} height={112} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">18時以降まで開いている</span>
                <span className="sm-choice-sub">共働きで迎えが間に合わない方に。全国{late.toLocaleString()}事業所</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/saturday/" className="sm-choice sm-choice-lg">
              <span className="sm-icon sm-icon-lg"><img src="/img/ic-saturday.webp" alt="" width={112} height={112} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">土曜に開いている</span>
                <span className="sm-choice-sub">平日だけでは足りない方に。全国{sat.toLocaleString()}事業所</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/area/" className="sm-choice sm-choice-lg">
              <span className="sm-icon sm-icon-lg"><img src="/img/ic-area.webp" alt="" width={112} height={112} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">市区町村から探す</span>
                <span className="sm-choice-sub">引っ越し先でも探せます。{cities.toLocaleString()}市区町村</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== サービスから探す ===== */}
      <section className="jm-sec border-b border-[var(--line)]">
        <div className="jm-wrap">
          <h2 className="jm-h2">サービスから探す</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href="/service/houkago-day/" className="sm-choice sm-choice-lg">
              <span className="sm-icon sm-icon-lg"><img src="/img/ic-houkago.webp" alt="" width={112} height={112} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">放課後等デイサービス<span className="jm-count ml-1">（{INDEX.counts.houday.toLocaleString()}事業所）</span></span>
                <span className="sm-choice-sub">就学後。放課後と長期休みの預け先。開所時間の実態と、見学で確認したいこと。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/service/jidou-hattatsu/" className="sm-choice sm-choice-lg">
              <span className="sm-icon sm-icon-lg"><img src="/img/ic-jihatsu.webp" alt="" width={112} height={112} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">児童発達支援<span className="jm-count ml-1">（{INDEX.counts.jihatsu.toLocaleString()}事業所）</span></span>
                <span className="sm-choice-sub">就学前の療育。対象年齢・利用の流れ・放課後等デイとの違い。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 都道府県から探す（件数つきの索引） ===== */}
      <section className="jm-sec">
        <div className="jm-wrap">
          <h2 className="jm-h2">都道府県から探す</h2>
          <p className="jm-lead mt-2">
            かっこ内は「事業所数／土曜に開いている数／18時以降まで開いている数」です。
          </p>
          <div className="mt-5 space-y-7">
            {REGIONS.map((r) => (
              <div key={r.name}>
                <h3 className="jm-h3">{r.name}</h3>
                <div className="mt-1 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
                  {r.slugs.map((s) => {
                    const p = byslug.get(s);
                    if (!p) return null;
                    return (
                      <div
                        key={s}
                        className="flex min-h-[44px] items-center justify-between gap-3 border-b border-[var(--line)] py-1.5"
                      >
                        <Link href={`/area/${s}/`} className="jm-link">
                          {p.pref}
                        </Link>
                        <span className="jm-count tabular-nums">
                          {p.total.toLocaleString()}／土{p.sat.toLocaleString()}／18時{p.late18.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 人気の市区町村 ===== */}
      <section className="jm-sec border-t border-[var(--line)] bg-[var(--bg-2)]">
        <div className="jm-wrap">
          <h2 className="jm-h2">事業所の多い市区町村から探す</h2>
          <p className="jm-lead mt-2">かっこ内は「事業所数／そのうち18時以降まで開いている数」です。</p>
          <div className="mt-4 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((c) => (
              <div
                key={`${c.prefSlug}-${c.city}`}
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-[var(--line)] py-1.5"
              >
                <Link href={`/area/${c.prefSlug}/${encodeURIComponent(c.city)}/`} className="jm-link">
                  {c.pref}
                  <span className="font-normal text-[var(--ink-3)]">／</span>
                  {c.city}
                </Link>
                <span className="jm-count tabular-nums">
                  {c.total.toLocaleString()}／18時{c.late18.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4">
            <Link href="/area/" className="jm-link">すべての市区町村（{cities.toLocaleString()}）を見る</Link>
          </p>
        </div>
      </section>

      {/* ===== 公表データで分かったこと ===== */}
      <section className="jm-sec border-t border-[var(--line)]">
        <div className="jm-wrap">
          <div className="sm-sec-head">
            <span className="sm-icon"><img src="/img/ic-data.webp" alt="" width={80} height={80} /></span>
            <h2 className="jm-h2">公表データで分かったこと</h2>
          </div>
          <p className="jm-lead mt-2">
            放課後等デイサービス{INDEX.counts.houday.toLocaleString()}事業所のうち、平日の利用可能な時間帯が公表されている
            20,641事業所を集計した結果です。
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { n: "97%", t: "17時以降まで開いている", d: "「17時まで」で困るケースは少数。ここでは差がつきません。" },
              { n: "38%", t: "18時以降まで開いている", d: "18時を境に、選べる事業所は一気に3分の1近くまで減ります。" },
              { n: "7%", t: "19時以降まで開いている", d: "フルタイム勤務で19時お迎えとなると、選択肢はごく限られます。" },
            ].map((x) => (
              <div key={x.t} className="jm-card p-5">
                <p className="jm-stat">{x.n}</p>
                <p className="mt-1 text-[14px] font-bold leading-[21px]">{x.t}</p>
                <p className="jm-lead mt-1.5">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="jm-card mt-3 bg-[var(--brand-wash)] p-4 text-[13px] leading-[22px]">
            <strong>「近くにあるか」より先に効くのは、終わりの時刻です。</strong>
            同じ市内に20事業所あっても、18時以降まで開いているのはそのうち数件、ということが起こります。
            当サイトでは、市区町村ごとにこの内訳を先に出しています。
          </div>
        </div>
      </section>

      {/* ===== はじめて探す方へ ===== */}
      <section className="jm-sec border-t border-[var(--line)] bg-[var(--bg-2)]">
        <div className="jm-wrap">
          <h2 className="jm-h2">はじめて探す方へ</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href="/service/jidou-hattatsu/" className="sm-choice">
              <span className="sm-icon"><img src="/img/ic-jihatsu.webp" alt="" width={80} height={80} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">児童発達支援とは（就学前）</span>
                <span className="sm-choice-sub">全国{INDEX.counts.jihatsu.toLocaleString()}事業所。対象年齢・利用の流れ・放課後等デイとの違い。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/service/houkago-day/" className="sm-choice">
              <span className="sm-icon"><img src="/img/ic-houkago.webp" alt="" width={80} height={80} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">放課後等デイサービスとは（就学後）</span>
                <span className="sm-choice-sub">全国{INDEX.counts.houday.toLocaleString()}事業所。開所時間の実態と、見学で確認したいこと。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/guide/" className="sm-choice">
              <span className="sm-icon"><img src="/img/ic-guide.webp" alt="" width={80} height={80} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">受給者証をとる手順</span>
                <span className="sm-choice-sub">申請先・必要なもの・かかる期間を整理しています。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
            <Link href="/guide/#cost" className="sm-choice">
              <span className="sm-icon"><img src="/img/ic-cost.webp" alt="" width={80} height={80} /></span>
              <span className="sm-choice-body">
                <span className="sm-choice-title">料金（月額の上限が決まっています）</span>
                <span className="sm-choice-sub">世帯の所得に応じた月額上限の仕組み。</span>
              </span>
              <span className="sm-choice-arrow" aria-hidden="true" />
            </Link>
          </div>

          <p className="jm-src mt-6">
            出所：
            <a href={INDEX.sourceUrl} target="_blank" rel="noopener noreferrer">{INDEX.source}</a>
            （{INDEX.surveyedAt}時点）。当サイトは公表されている値をそのまま集計しており、推計値・独自の評価・口コミは掲載していません。
          </p>
        </div>
      </section>
    </main>
  );
}
