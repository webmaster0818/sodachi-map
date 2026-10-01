import { INDEX } from "@/lib/data";

// 出所の明示。全ページ共通で末尾に出す。
export default function SourceNote() {
  return (
    <p className="mt-10 rounded-lg bg-white p-4 text-xs leading-relaxed text-[var(--ink-soft)] ring-1 ring-[var(--line)]">
      出所：
      <a href={INDEX.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">{INDEX.source}</a>
      （{INDEX.surveyedAt}時点）。営利・非営利を問わず二次利用が認められているデータを、当サイトで集計・再構成しています。
      時間帯・定員・定休日は事業所が届け出た内容で、<strong>空欄のまま公表されている項目もあります</strong>。
      当サイトでは空欄を推定で埋めていません。開所時間や受け入れ状況は変わることがあるため、申し込み前に各事業所へ直接ご確認ください。
    </p>
  );
}
