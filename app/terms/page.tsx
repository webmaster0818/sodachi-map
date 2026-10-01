import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";

export const metadata: Metadata = {
  title: "利用規約",
  description: "そだちマップの利用規約です。",
  alternates: { canonical: "/terms/" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ 利用規約</p>
      <h1 className="mt-2 text-2xl font-bold">利用規約</h1>

      <h2 className="mt-8 text-lg font-bold">1. 掲載情報について</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトが掲載する事業所情報は、
        <a href={INDEX.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">{INDEX.source}</a>
        （{INDEX.surveyedAt}時点）を出所としています。当サイトは掲載内容の正確性・最新性について保証するものではありません。
        実際の開所時間・受け入れ可否・費用は、各事業所または市区町村の窓口にご確認ください。
      </p>

      <h2 className="mt-6 text-lg font-bold">2. 当サイトが行わないこと</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトは事業所の紹介・あっせん・仲介は行いません。また、個別の事業所について優劣の評価を行うものではありません。
      </p>

      <h2 className="mt-6 text-lg font-bold">3. 免責</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトの情報を利用したことにより生じた損害について、当サイトは責任を負いかねます。
        利用の判断はご自身の責任で行ってください。
      </p>

      <h2 className="mt-6 text-lg font-bold">4. 外部リンク</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトから移動した先のサイトの内容については、当サイトは責任を負いません。
      </p>

      <h2 className="mt-6 text-lg font-bold">5. 広告について</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトは広告・アフィリエイトプログラムを利用する場合があります。該当する場合はその旨を表示します。
        広告の有無によって、掲載する事業所データの内容や並び順を変えることはありません。
      </p>

      <h2 className="mt-6 text-lg font-bold">6. 規約の変更</h2>
      <p className="mt-2 text-[var(--ink-soft)]">本規約は予告なく変更する場合があります。</p>
    </main>
  );
}
