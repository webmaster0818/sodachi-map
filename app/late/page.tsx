import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

const late = INDEX.prefs.reduce((s, p) => s + p.late18, 0);
const total = INDEX.prefs.reduce((s, p) => s + p.total, 0);

export const metadata: Metadata = {
  title: `18時以降まで開いている放課後等デイサービス・児童発達支援${late.toLocaleString()}事業所｜都道府県別`,
  description: `平日18時以降まで開いている放課後等デイサービス・児童発達支援を都道府県別に集計しました。放課後等デイサービスで平日の時間帯を公表している20,641事業所のうち、18時以降まで開いているのは38%です（国の公表データ・${INDEX.surveyedAt}時点）。`,
  alternates: { canonical: "/late/" },
};

export default function LatePage() {
  const prefs = [...INDEX.prefs].sort((a, b) => b.late18 - a.late18);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ 18時以降まで</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">18時以降まで開いている事業所を探す</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        共働き家庭でいちばん最初に効いてくる条件が、<strong>「何時まで預かってもらえるか」</strong>です。
        全国で<strong>{late.toLocaleString()}事業所</strong>が、平日18時以降まで開いていると公表しています。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { n: "97%", t: "17時以降まで", d: "ほとんどの事業所が該当します。ここでは差がつきません。" },
          { n: "38%", t: "18時以降まで", d: "18時を境に、選べる事業所が一気に減ります。" },
          { n: "7%", t: "19時以降まで", d: "19時お迎えが必要なら、選択肢はごく限られます。" },
        ].map((x) => (
          <div key={x.t} className="rounded-xl border border-[var(--line)] bg-white p-5">
            <p className="text-3xl font-bold text-[var(--accent)]">{x.n}</p>
            <p className="mt-1 font-bold">{x.t}</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">{x.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">
        ※ 放課後等デイサービスのうち、平日の利用可能な時間帯を公表していた20,641事業所を母数とした割合です。
      </p>

      <h2 className="mt-10 text-xl font-bold">都道府県別</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">都道府県</th>
              <th className="border-b border-[var(--line)] px-3 py-2">18時以降まで</th>
              <th className="border-b border-[var(--line)] px-3 py-2">全事業所</th>
              <th className="border-b border-[var(--line)] px-3 py-2">割合</th>
            </tr>
          </thead>
          <tbody>
            {prefs.map((p) => (
              <tr key={p.slug} className="border-b border-[var(--line)]">
                <th className="px-3 py-2 text-left font-bold">
                  <Link href={`/area/${p.slug}/`} className="link">{p.pref}</Link>
                </th>
                <td className="px-3 py-2 font-bold text-[var(--accent)]">{p.late18.toLocaleString()}</td>
                <td className="px-3 py-2">{p.total.toLocaleString()}</td>
                <td className="px-3 py-2">{Math.round((p.late18 / p.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
        割合が低い県は「遅い時間の事業所が少ない」という意味のほか、「時間帯を公表していない事業所が多い」可能性もあります。
        当サイトでは<strong>公表がない事業所を18時以降に数えていません</strong>ので、気になる事業所には直接ご確認ください。
      </p>
      <SourceNote />
    </main>
  );
}
