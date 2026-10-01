import Link from "next/link";
import { INDEX } from "@/lib/data";

/*
 * TOP。設計の軸は「近くにどこがあるか」ではなく「うちの都合で通えるか」。
 * 競合(放デイマッチ・障害者ドットコム・LITALICO発達ナビ)は
 * 送迎・療育内容・空き状況では絞り込めるが、
 * 「平日の終わり時刻」「土曜に開いているか」では絞り込めない。
 * そこを最初の導線に置く。数値はすべて公表データからの機械集計。
 */

const total = INDEX.counts.houday + INDEX.counts.jihatsu;
// 平日の終了時刻がCSVから読めた放デイ事業所だけを母数にする(欠測を分母に入れない)
const sat = INDEX.prefs.reduce((s, p) => s + p.sat, 0);
const late = INDEX.prefs.reduce((s, p) => s + p.late18, 0);

const REGIONS: { name: string; slugs: string[] }[] = [
  { name: "北海道・東北", slugs: ["hokkaido", "aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"] },
  { name: "関東", slugs: ["ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa"] },
  { name: "中部・北陸", slugs: ["niigata", "toyama", "ishikawa", "fukui", "yamanashi", "nagano", "gifu", "shizuoka", "aichi"] },
  { name: "近畿", slugs: ["mie", "shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"] },
  { name: "中国・四国", slugs: ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi", "tokushima", "kagawa", "ehime", "kochi"] },
  { name: "九州・沖縄", slugs: ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"] },
];

export default function Home() {
  const byslug = new Map(INDEX.prefs.map((p) => [p.slug, p]));
  return (
    <main>
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">
            放課後等デイサービス・児童発達支援を
            <br className="hidden sm:block" />
            <span className="text-[var(--accent)]">「うちの都合で通えるか」</span>から探す
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--ink-soft)]">
            全国<strong>{total.toLocaleString()}事業所</strong>を、
            <strong>平日の終わり時刻</strong>・<strong>土曜に開いているか</strong>・<strong>定員</strong>で比べられます。
            数値は国の公表データ（障害福祉サービス等情報公表システム・{INDEX.surveyedAt}時点）をそのまま集計したもので、
            当サイトの推計や評価は入っていません。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link href="/late/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
              <p className="text-xs text-[var(--ink-soft)]">共働きで迎えが間に合わない</p>
              <p className="mt-1 font-bold">18時以降まで開いている</p>
              <p className="mt-2 text-2xl font-bold text-[var(--accent)]">{late.toLocaleString()}<span className="ml-1 text-sm font-normal">事業所</span></p>
            </Link>
            <Link href="/saturday/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
              <p className="text-xs text-[var(--ink-soft)]">平日だけでは足りない</p>
              <p className="mt-1 font-bold">土曜に開いている</p>
              <p className="mt-2 text-2xl font-bold text-[var(--accent)]">{sat.toLocaleString()}<span className="ml-1 text-sm font-normal">事業所</span></p>
            </Link>
            <Link href="/area/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
              <p className="text-xs text-[var(--ink-soft)]">引っ越し先でも探したい</p>
              <p className="mt-1 font-bold">市区町村から探す</p>
              <p className="mt-2 text-2xl font-bold text-[var(--accent)]">{INDEX.prefs.reduce((s, p) => s + p.cities, 0).toLocaleString()}<span className="ml-1 text-sm font-normal">市区町村</span></p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-bold">公表データで分かったこと</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          放課後等デイサービス{INDEX.counts.houday.toLocaleString()}事業所のうち、平日の利用可能な時間帯が公表されている
          20,641事業所を集計した結果です。
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { n: "97%", t: "17時以降まで開いている", d: "「17時まで」で困るケースは少数。ここでは差がつきません。" },
            { n: "38%", t: "18時以降まで開いている", d: "18時を境に、選べる事業所は一気に3分の1近くまで減ります。" },
            { n: "7%", t: "19時以降まで開いている", d: "フルタイム勤務で19時お迎えとなると、選択肢はごく限られます。" },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-[var(--line)] bg-white p-5">
              <p className="text-3xl font-bold text-[var(--accent)]">{x.n}</p>
              <p className="mt-1 font-bold">{x.t}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">{x.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
          <strong>「近くにあるか」より先に効くのは、終わりの時刻です。</strong>
          同じ市内に20事業所あっても、18時以降まで開いているのはそのうち数件、ということが起こります。
          当サイトでは、市区町村ごとにこの内訳を先に出しています。
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-xl font-bold">エリアから探す</h2>
        <div className="mt-5 space-y-7">
          {REGIONS.map((r) => (
            <div key={r.name}>
              <h3 className="border-l-4 border-[var(--accent)] pl-3 font-bold">{r.name}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {r.slugs.map((s) => {
                  const p = byslug.get(s);
                  if (!p) return null;
                  return (
                    <Link key={s} href={`/area/${s}/`} className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm hover:border-[var(--accent)]">
                      <span className="font-bold">{p.pref}</span>
                      <span className="ml-2 text-xs text-[var(--ink-soft)]">
                        {p.total.toLocaleString()}事業所／土曜{p.sat.toLocaleString()}／18時以降{p.late18.toLocaleString()}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-xl font-bold">はじめて探す方へ</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/service/jidou-hattatsu/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
            <p className="font-bold">児童発達支援とは（就学前）</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">全国{INDEX.counts.jihatsu.toLocaleString()}事業所。対象年齢・利用の流れ・放課後等デイとの違い。</p>
          </Link>
          <Link href="/service/houkago-day/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
            <p className="font-bold">放課後等デイサービスとは（就学後）</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">全国{INDEX.counts.houday.toLocaleString()}事業所。開所時間の実態と、見学で確認したいこと。</p>
          </Link>
          <Link href="/guide/" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
            <p className="font-bold">受給者証をとる手順</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">申請先・必要なもの・かかる期間を整理しています。</p>
          </Link>
          <Link href="/guide/#cost" className="rounded-xl border border-[var(--line)] bg-white p-5 hover:border-[var(--accent)]">
            <p className="font-bold">料金（月額の上限が決まっています）</p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">世帯の所得に応じた月額上限の仕組み。</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
