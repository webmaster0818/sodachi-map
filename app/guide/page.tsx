import type { Metadata } from "next";
import Link from "next/link";
import { INDEX } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

export const metadata: Metadata = {
  title: "はじめての方へ｜受給者証の取り方と料金の上限、見学で確認すること",
  description:
    "放課後等デイサービス・児童発達支援をはじめて利用する方向けに、受給者証の申請の流れ、利用者負担の上限月額（0円／4,600円／37,200円）、就学前の無償化の対象期間、見学で確認したいことを整理しました。出典つき。",
  alternates: { canonical: "/guide/" },
};

const steps = [
  { t: "① 市区町村の窓口に相談する", d: "障害福祉課・子ども家庭課など、自治体によって窓口名が違います。「障害児通所支援を使いたい」と伝えれば案内されます。診断がなくても相談できる自治体があります。" },
  { t: "② 利用計画案をつくる", d: "相談支援事業所に依頼して「障害児支援利用計画案」を作ってもらうか、保護者自身が作る（セルフプラン）かを選びます。どちらでも申請できます。" },
  { t: "③ 申請・調査", d: "申請書と計画案を提出し、子どもの状況について聞き取りがあります。医師の意見書などを求められる場合があります。" },
  { t: "④ 受給者証が交付される", d: "支給量（月に何日使えるか）と、利用者負担の上限月額が記載されます。交付までの期間は自治体によって差があります。" },
  { t: "⑤ 事業所と契約して利用開始", d: "受給者証を事業所に提示して契約します。見学・体験は受給者証の交付前でも受け付けている事業所が多くあります。" },
];

const faqs = [
  {
    q: "受給者証がなくても見学できますか？",
    a: "多くの事業所が、受給者証の交付前でも見学・体験を受け付けています。申請と並行して見学を進めると、交付後すぐに契約できます。ただし対応は事業所によって違うため、電話で確認してください。",
  },
  {
    q: "放課後等デイサービスも無償化の対象ですか？",
    a: "いいえ。無償化（就学前障害児の発達支援の無償化）の対象は児童発達支援・医療型児童発達支援・居宅訪問型児童発達支援・保育所等訪問支援・福祉型／医療型障害児入所施設で、放課後等デイサービスは含まれていません。放課後等デイサービスは所得に応じた上限月額が適用されます。",
  },
  {
    q: "複数の事業所を併用できますか？",
    a: "受給者証に記載された支給量（月の利用日数）の範囲内であれば、複数の事業所を組み合わせて使えます。曜日によって別の事業所に通う形が取れるため、「平日は近い事業所、土曜は遠いが開いている事業所」という組み方もできます。上限月額は世帯ごとに管理され、複数事業所を使っても上限を超えて払うことはありません。",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ はじめての方へ</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">はじめての方へ</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        放課後等デイサービス・児童発達支援は、どちらも<strong>受給者証（通所受給者証）</strong>があれば使えます。
        ここでは申請の流れ、かかるお金、見学で確認したいことを、公的な情報に基づいて整理しました。
      </p>

      <h2 className="mt-10 text-xl font-bold">受給者証をとるまでの流れ</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((s) => (
          <li key={s.t} className="rounded-xl border border-[var(--line)] bg-white p-4">
            <p className="font-bold">{s.t}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-[var(--ink-soft)]">
        ※ 窓口の名称・必要書類・交付までの期間は自治体ごとに違います。お住まいの市区町村の公式サイトで必ずご確認ください。
      </p>

      <h2 id="cost" className="mt-10 text-xl font-bold">かかるお金（上限月額）</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        利用料は原則1割負担ですが、<strong>世帯の所得に応じて月額の上限</strong>が決まっています。
        上限に達したあとは、同じ月に何回使っても追加の利用料はかかりません。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">区分</th>
              <th className="border-b border-[var(--line)] px-3 py-2">世帯の状況</th>
              <th className="border-b border-[var(--line)] px-3 py-2">上限月額</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">生活保護</th><td className="px-3 py-2">生活保護受給世帯</td><td className="px-3 py-2 font-bold">0円</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">低所得</th><td className="px-3 py-2">市区町村民税非課税世帯</td><td className="px-3 py-2 font-bold">0円</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">一般1</th><td className="px-3 py-2">市区町村民税課税世帯（所得割28万円未満）</td><td className="px-3 py-2 font-bold">4,600円</td></tr>
            <tr className="border-b border-[var(--line)]"><th className="px-3 py-2 text-left">一般2</th><td className="px-3 py-2">上記以外</td><td className="px-3 py-2 font-bold">37,200円</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--ink-soft)]">
        出典：
        <a href="https://www.fukushi.metro.tokyo.lg.jp/shougai/shogai/futan" target="_blank" rel="noopener noreferrer" className="link">東京都福祉局「障害福祉サービス及び障害児支援の利用者負担」</a>
        （障害児通所支援の区分）。
        <strong>おやつ代・教材費・行事費などの実費</strong>は上限月額とは別に事業所ごとにかかります。金額は事業所によって違うため、見学時に必ず確認してください。
      </p>

      <h2 className="mt-10 text-xl font-bold">就学前の無償化</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        <strong>児童発達支援</strong>などは、<strong>満3歳になって初めての4月1日から3年間</strong>、利用者負担が無償になります（2019年10月1日開始）。
        対象は児童発達支援・医療型児童発達支援・居宅訪問型児童発達支援・保育所等訪問支援・福祉型／医療型障害児入所施設で、
        <strong>放課後等デイサービスは対象外</strong>です。幼稚園・保育所等と併用する場合も、両方が無償化の対象になります。
        食費などの実費は引き続き負担が必要です。
      </p>
      <p className="mt-2 text-xs text-[var(--ink-soft)]">
        出典：
        <a href="https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/fbea17f8-33d0-4a70-8ea6-84f3402bad73/f9e036e2/20230929_policies_kokoseido_mushouka-new_01.pdf" target="_blank" rel="noopener noreferrer" className="link">こども家庭庁「幼児教育・保育の無償化」</a>
      </p>

      <h2 className="mt-10 text-xl font-bold">見学で確認したいこと</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        公表データで分かるのは「開いている時間」「定員」までです。ここから先は見学でしか分かりません。
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>・<strong>何時まで預かってもらえるか</strong>（公表時間と実際の受け入れが違うことがあります）</li>
        <li>・<strong>送迎の範囲</strong>（自宅・学校まで来てもらえるか、どのエリアまでか）</li>
        <li>・<strong>その曜日に空きがあるか</strong>（曜日ごとに埋まり方が違います）</li>
        <li>・<strong>実費としていくらかかるか</strong>（おやつ代・教材費・行事費）</li>
        <li>・<strong>その日の過ごし方</strong>（個別支援が中心か、集団活動が中心か）</li>
        <li>・<strong>職員の人数と顔ぶれ</strong>（定員に対して何人で見ているか）</li>
      </ul>
      <p className="mt-4 rounded-xl bg-[var(--accent-soft)] p-4 text-sm leading-relaxed">
        <strong>当サイトでは、事業所の良し悪しの評価や口コミは掲載していません。</strong>
        公表データにない情報を当サイトが作ることはせず、実際に見て判断していただくための「候補の絞り込み」までを担当しています。
      </p>

      <h2 className="mt-10 text-xl font-bold">よくある質問</h2>
      <div className="mt-3 space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="rounded-lg border border-[var(--line)] bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">{f.q}</summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--ink-soft)]">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-sm">
        <Link href="/area/" className="link">→ エリアから事業所を探す</Link>
        {" ／ "}
        <Link href="/service/jidou-hattatsu/" className="link">→ 児童発達支援とは</Link>
        {" ／ "}
        <Link href="/service/houkago-day/" className="link">→ 放課後等デイサービスとは</Link>
      </p>
      <SourceNote />
    </main>
  );
}
