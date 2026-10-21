import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

export const metadata: Metadata = {
  title: `児童発達支援とは｜全国${INDEX.counts.jihatsu.toLocaleString()}事業所と、無償化の対象期間`,
  description: `児童発達支援（就学前）の対象・利用の流れ・無償化の条件を整理し、全国${INDEX.counts.jihatsu.toLocaleString()}事業所の開所時間を公表データから集計しました。満3歳になって初めての4月1日から3年間は利用者負担が無償になります（こども家庭庁）。`,
  alternates: { canonical: "/service/jidou-hattatsu/" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ 児童発達支援とは</p>
      <div className="mt-3 flex items-center gap-4">
        <span className="sm-icon sm-icon-lg"><img src="/img/ic-jihatsu.webp" alt="" width={112} height={112} /></span>
        <h1 className="text-2xl font-bold sm:text-3xl">児童発達支援とは</h1>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        児童発達支援は、<strong>就学前の障害のある子ども</strong>が通い、日常生活の動作や集団生活への適応について支援を受けるサービスです。
        児童福祉法に基づく給付の対象で、全国に<strong>{INDEX.counts.jihatsu.toLocaleString()}事業所</strong>あります（{INDEX.surveyedAt}時点）。
        幼稚園・保育所と<strong>併用できます</strong>。
      </p>

      <h2 className="mt-10 text-xl font-bold">無償化の対象期間</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        児童発達支援は、<strong>満3歳になって初めての4月1日から3年間</strong>、利用者負担が無償になります（2019年10月1日開始）。
        幼稚園・保育所等と併用する場合も、両方が無償化の対象です。食費などの実費は引き続き負担が必要です。
      </p>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        出典：
        <a href="https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/fbea17f8-33d0-4a70-8ea6-84f3402bad73/f9e036e2/20230929_policies_kokoseido_mushouka-new_01.pdf" target="_blank" rel="noopener noreferrer" className="link">こども家庭庁「幼児教育・保育の無償化」</a>
      </p>
      <p className="mt-3 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
        <strong>0〜2歳のあいだは無償化の対象外です。</strong>この時期は所得に応じた上限月額（0円／4,600円／37,200円）が適用されます。
        「3歳になったら無料」ではなく「満3歳になって<strong>初めての4月1日</strong>から」である点に注意してください。
      </p>

      <h2 className="mt-10 text-xl font-bold">開所時間の実態（公表データ集計）</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        児童発達支援は日中が中心のため、放課後等デイサービスとは時間帯の分布が違います。
        平日で最も多いのは<strong>10:00–17:00</strong>、次いで09:00–17:00、10:00–18:00です。
        土曜の時間帯を公表しているのは9,292事業所（全体の55%）で、最も多いのは10:00–16:00でした。
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        保育所と併用する場合、<strong>「保育所を何時に抜けて、何時に戻るか」</strong>が現実的な課題になります。
        事業所の開所時間を先に見ておくと、併用の組み立てが具体的になります。
      </p>

      <h2 className="mt-10 text-xl font-bold">放課後等デイサービスとの違い</h2>
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
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">事業所数</th><td className="px-3 py-2">{INDEX.counts.jihatsu.toLocaleString()}</td><td className="px-3 py-2">{INDEX.counts.houday.toLocaleString()}</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">無償化</th><td className="px-3 py-2 font-bold">対象</td><td className="px-3 py-2">対象外</td></tr>
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
