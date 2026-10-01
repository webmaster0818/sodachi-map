import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

const sat = INDEX.prefs.reduce((s, p) => s + p.sat, 0);
const total = INDEX.prefs.reduce((s, p) => s + p.total, 0);

export const metadata: Metadata = {
  title: `土曜に通える放課後等デイサービス・児童発達支援${sat.toLocaleString()}事業所｜都道府県別`,
  description: `土曜日に開いている放課後等デイサービス・児童発達支援を都道府県別に集計しました。全国${total.toLocaleString()}事業所のうち土曜の利用可能な時間帯を公表しているのは${sat.toLocaleString()}事業所です（国の公表データ・${INDEX.surveyedAt}時点）。`,
  alternates: { canonical: "/saturday/" },
};

export default function SaturdayPage() {
  const prefs = [...INDEX.prefs].sort((a, b) => b.sat - a.sat);
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ 土曜に通える</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">土曜に通える事業所を探す</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        全国{total.toLocaleString()}事業所のうち、<strong>土曜の利用可能な時間帯を公表しているのは{sat.toLocaleString()}事業所（{Math.round((sat / total) * 100)}%）</strong>です。
        平日だけでは足りない、きょうだいの用事がある、親の勤務が土曜にもある——という場合に、まずここから絞り込めます。
      </p>
      <p className="mt-3 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
        土曜で最も多い時間帯は <strong>10:00–16:00</strong> です（放課後等デイサービスで3,771事業所）。
        次いで 09:00–17:00、10:00–17:00 と続きます。フルタイム勤務の土曜出勤に合わせるなら、この「終わりが16時」という線が効いてきます。
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">都道府県</th>
              <th className="border-b border-[var(--line)] px-3 py-2">土曜に開いている</th>
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
                <td className="px-3 py-2 font-bold text-[var(--accent)]">{p.sat.toLocaleString()}</td>
                <td className="px-3 py-2">{p.total.toLocaleString()}</td>
                <td className="px-3 py-2">{Math.round((p.sat / p.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceNote />
    </main>
  );
}
