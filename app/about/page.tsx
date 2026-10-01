import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";

export const metadata: Metadata = {
  title: "サイトについて｜掲載データの出所と、載せないと決めていること",
  description: "そだちマップの掲載方針。データの出所（障害福祉サービス等情報公表システムのオープンデータ）、集計方法、当サイトが載せないと決めていること（推計値・独自評価・空き状況）を明示しています。",
  alternates: { canonical: "/about/" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ サイトについて</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">サイトについて</h1>

      <h2 className="mt-8 text-xl font-bold">何をするサイトか</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        放課後等デイサービス・児童発達支援を、<strong>「うちの都合で通えるか」</strong>という条件から絞り込めるようにするサイトです。
        近さだけでは決められない——平日の終わりが何時か、土曜に開いているか——という部分を、公的なデータで比べられるようにしています。
      </p>

      <h2 className="mt-8 text-xl font-bold">データの出所</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        掲載している事業所情報は、
        <a href={INDEX.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">{INDEX.source}</a>
        （{INDEX.surveyedAt}時点）から作成しています。これは事業者が法令に基づいて届け出た内容を国が公表しているもので、
        営利・非営利を問わず二次利用が認められています。当サイトでは、そのデータを集計・再構成して掲載しています。
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        収録しているのは<strong>放課後等デイサービス{INDEX.counts.houday.toLocaleString()}事業所</strong>と
        <strong>児童発達支援{INDEX.counts.jihatsu.toLocaleString()}事業所</strong>、合計{(INDEX.counts.houday + INDEX.counts.jihatsu).toLocaleString()}事業所です。
      </p>

      <h2 className="mt-8 text-xl font-bold">載せないと決めていること</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>・<strong>推計値</strong>。公表データで空欄の項目は、空欄のまま出します。埋めません。</li>
        <li>・<strong>当サイトによる事業所の評価・ランキング</strong>。良し悪しを点数にして並べることはしません。</li>
        <li>・<strong>口コミ</strong>。投稿を要約・再構成して載せることはしません。</li>
        <li>・<strong>空き状況</strong>。公表データに含まれないため扱いません。推測で「空きあり」と書くことはしません。</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        障害のある子どもの預け先という性質上、<strong>間違った情報が家庭の判断を直接狂わせます。</strong>
        そのため当サイトは「確認できたことだけを、出所つきで出す」という方針をとっています。
      </p>

      <h2 className="mt-8 text-xl font-bold">数値の集計方法</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        <li>・「18時以降まで開いている」＝ 公表されている平日の利用可能な時間帯の<strong>終了時刻が18:00以降</strong>の事業所。時間帯が未公表の事業所は数に入れていません。</li>
        <li>・「土曜に開いている」＝ 土曜の利用可能な時間帯が公表されている事業所。</li>
        <li>・割合の分母は、都道府県・市区町村ページでは<strong>その地域の全事業所数</strong>、開所時間の分布表では<strong>平日の時間帯を公表していた事業所数</strong>です。各ページに明記しています。</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold">更新について</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        元データは年2回（3月末時点・9月末時点）公表されます。当サイトは公表に合わせて更新します。
        開所時間や受け入れ状況は年度途中でも変わるため、申し込み前に各事業所へ直接ご確認ください。
      </p>

      <h2 className="mt-8 text-xl font-bold">掲載情報の訂正について</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        掲載内容に誤りがある場合、元データ（国の公表システム）の修正が反映されるのを待つ形になります。
        事業所の方で内容を修正されたい場合は、指定権者（都道府県・市区町村）への届出をご確認ください。
      </p>
    </main>
  );
}
