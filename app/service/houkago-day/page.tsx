import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

export const metadata: Metadata = {
  title: `放課後等デイサービスとは｜全国${INDEX.counts.houday.toLocaleString()}事業所の開所時間を実データで見る`,
  description: `放課後等デイサービスの対象・利用の流れ・料金を整理し、全国${INDEX.counts.houday.toLocaleString()}事業所の開所時間を公表データから集計しました。18時以降まで開いているのは38%、土曜に開いているのは62%です（国の公表データ・${INDEX.surveyedAt}時点）。`,
  alternates: { canonical: "/service/houkago-day/" },
};

export default function Page() {
  const late = INDEX.prefs.reduce((s, p) => s + p.late18, 0);
  const sat = INDEX.prefs.reduce((s, p) => s + p.sat, 0);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ 放課後等デイサービスとは</p>
      <div className="mt-3 flex items-center gap-4">
        <span className="sm-icon sm-icon-lg"><img src="/img/ic-houkago.webp" alt="" width={112} height={112} /></span>
        <h1 className="text-2xl font-bold sm:text-3xl">放課後等デイサービスとは</h1>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        放課後等デイサービスは、<strong>就学している障害のある子ども（原則6〜18歳）</strong>が、
        放課後や学校の長期休みに通う福祉サービスです。児童福祉法に基づく給付の対象で、受給者証があれば所得に応じた負担で利用できます。
        全国に<strong>{INDEX.counts.houday.toLocaleString()}事業所</strong>あります（{INDEX.surveyedAt}時点）。
      </p>

      <h2 className="mt-10 text-xl font-bold">開所時間の実態（公表データ集計）</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        「何時まで開いているか」は事業所選びで最初に効く条件ですが、まとまった数字はあまり出回っていません。
        公表データから集計すると、次のようになります（平日の利用可能な時間帯を公表していた20,641事業所が母数）。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">平日の終わり</th>
              <th className="border-b border-[var(--line)] px-3 py-2">事業所数</th>
              <th className="border-b border-[var(--line)] px-3 py-2">割合</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">17時以降まで</th><td className="px-3 py-2">19,957</td><td className="px-3 py-2">97%</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">17時30分以降まで</th><td className="px-3 py-2">14,164</td><td className="px-3 py-2">69%</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left font-bold">18時以降まで</th><td className="px-3 py-2 font-bold">7,835</td><td className="px-3 py-2 font-bold">38%</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">19時以降まで</th><td className="px-3 py-2">1,363</td><td className="px-3 py-2">7%</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
        <strong>17時までで困る家庭はほとんどありません。差がつくのは18時です。</strong>
        17時以降までは97%が開いているのに対し、18時以降となると38%まで落ちます。
        「近所に何件あるか」ではなく「そのうち18時以降まで開いているのは何件か」を先に見たほうが、現実的な候補が早く見つかります。
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        土曜については、放課後等デイサービス・児童発達支援を合わせて<strong>{sat.toLocaleString()}事業所</strong>が時間帯を公表しています。
        最も多い時間帯は10:00–16:00です。
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/late/" className="sm-mini-btn">18時以降まで開いている事業所（{late.toLocaleString()}）</Link>
        <Link href="/saturday/" className="sm-mini-btn">土曜に開いている事業所（{sat.toLocaleString()}）</Link>
      </div>

      <h2 className="mt-10 text-xl font-bold">児童発達支援との違い</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2"></th>
              <th className="border-b border-[var(--line)] px-3 py-2">児童発達支援</th>
              <th className="border-b border-[var(--line)] px-3 py-2">放課後等デイサービス</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">対象</th><td className="px-3 py-2">就学前</td><td className="px-3 py-2">就学後（原則6〜18歳）</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">通う時間帯</th><td className="px-3 py-2">日中が中心</td><td className="px-3 py-2">放課後・休校日</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">事業所数</th><td className="px-3 py-2">{INDEX.counts.jihatsu.toLocaleString()}</td><td className="px-3 py-2">{INDEX.counts.houday.toLocaleString()}</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">無償化</th><td className="px-3 py-2">対象（満3歳の次の4月から3年間）</td><td className="px-3 py-2 font-bold">対象外</td></tr>
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm">
        <Link href="/guide/" className="link">→ 受給者証の取り方と料金の上限</Link>
        {" ／ "}
        <Link href="/area/" className="link">→ エリアから探す</Link>
      </p>
      <SourceNote />
    </main>
  );
}
