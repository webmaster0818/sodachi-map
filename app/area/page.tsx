import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

export const metadata: Metadata = {
  title: "エリアから探す｜全国47都道府県の放課後等デイサービス・児童発達支援",
  description:
    "都道府県・市区町村から放課後等デイサービスと児童発達支援を探せます。エリアごとに「土曜に開いている事業所数」「18時以降まで開いている事業所数」を公表データから集計して表示しています。",
  alternates: { canonical: "/area/" },
};

export default function AreaIndex() {
  const prefs = [...INDEX.prefs].sort((a, b) => b.total - a.total);
  const total = INDEX.prefs.reduce((s, p) => s + p.total, 0);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ エリアから探す</p>
      <div className="mt-3 flex items-center gap-4">
        <span className="sm-icon sm-icon-lg"><img src="/img/ic-area.webp" alt="" width={112} height={112} /></span>
        <h1 className="text-2xl font-bold sm:text-3xl">エリアから探す</h1>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        全国<strong>{total.toLocaleString()}事業所</strong>（放課後等デイサービス・児童発達支援）を都道府県別に整理しました。
        「<strong>土曜</strong>」「<strong>18時以降</strong>」の列は、公表データの利用可能な時間帯から機械的に数えた実数です。
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">都道府県</th>
              <th className="border-b border-[var(--line)] px-3 py-2">合計</th>
              <th className="border-b border-[var(--line)] px-3 py-2">放課後等デイ</th>
              <th className="border-b border-[var(--line)] px-3 py-2">児童発達支援</th>
              <th className="border-b border-[var(--line)] px-3 py-2">土曜</th>
              <th className="border-b border-[var(--line)] px-3 py-2">18時以降</th>
            </tr>
          </thead>
          <tbody>
            {prefs.map((p) => (
              <tr key={p.slug} className="border-b border-[var(--line)]">
                <th className="px-3 py-2 text-left font-bold">
                  <Link href={`/area/${p.slug}/`} className="link">{p.pref}</Link>
                  <span className="ml-2 text-xs font-normal text-[var(--ink-soft)]">{p.cities}市区町村</span>
                </th>
                <td className="px-3 py-2">{p.total.toLocaleString()}</td>
                <td className="px-3 py-2">{p.houday.toLocaleString()}</td>
                <td className="px-3 py-2">{p.jihatsu.toLocaleString()}</td>
                <td className="px-3 py-2">{p.sat.toLocaleString()}</td>
                <td className="px-3 py-2 font-bold text-[var(--accent)]">{p.late18.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceNote />
    </main>
  );
}
