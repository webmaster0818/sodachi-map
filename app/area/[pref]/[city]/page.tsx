import type { Metadata } from "next";
import Link from "next/link";
import { INDEX, loadPref, prefBySlug, cityList } from "@/lib/data";
import FacilityList from "@/components/FacilityList";
import SourceNote from "@/components/SourceNote";

// 市区町村ページ。保護者が実際に動ける単位がここなので、
// 「合計◯件」より先に「土曜」「18時以降」の内訳を出す。

export function generateStaticParams() {
  const out: { pref: string; city: string }[] = [];
  for (const p of INDEX.prefs) {
    for (const c of cityList(loadPref(p.slug))) {
      out.push({ pref: p.slug, city: c.city });
    }
  }
  return out;
}

function resolve(prefSlug: string, cityParam: string) {
  const p = prefBySlug(prefSlug);
  if (!p) return null;
  let city = cityParam;
  try { city = decodeURIComponent(cityParam); } catch { /* 既にデコード済み */ }
  const c = cityList(loadPref(prefSlug)).find((x) => x.city === city);
  return c ? { p, c } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string; city: string }> }): Promise<Metadata> {
  const { pref, city } = await params;
  const r = resolve(pref, city);
  if (!r) return {};
  const { p, c } = r;
  return {
    title: `${c.city}の放課後等デイサービス・児童発達支援${c.total}事業所｜土曜${c.sat}・18時以降${c.late18}`,
    description: `${p.pref}${c.city}の放課後等デイサービス${c.houday}事業所・児童発達支援${c.jihatsu}事業所を一覧にしました。平日・土曜の利用可能な時間帯、定休日、定員つき。土曜に開いているのは${c.sat}事業所、18時以降まで開いているのは${c.late18}事業所です（国の公表データ・${INDEX.surveyedAt}時点）。`,
    alternates: { canonical: `/area/${p.slug}/${encodeURIComponent(c.city)}/` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ pref: string; city: string }> }) {
  const { pref, city } = await params;
  const r = resolve(pref, city);
  if (!r) return null;
  const { p, c } = r;
  const late = c.list.filter((f) => f.end !== null && f.end >= 18);
  const sat = c.list.filter((f) => f.sat);
  const others = cityList(loadPref(pref)).filter((x) => x.city !== c.city).slice(0, 12);

  const faqs = [
    {
      q: `${c.city}で18時以降まで開いている事業所はどれくらいありますか？`,
      a: c.late18 > 0
        ? `${c.total}事業所のうち${c.late18}事業所です（${INDEX.surveyedAt}時点の公表データ）。平日の利用可能な時間帯が公表されていない事業所はこの数に含めていないため、実際はもう少し多い可能性があります。`
        : `公表データの範囲では、平日18時以降まで開いていると確認できる事業所はありませんでした（${INDEX.surveyedAt}時点）。時間帯を公表していない事業所もあるため、直接問い合わせると受け入れ可能な場合があります。`,
    },
    {
      q: "掲載されている時間帯は当サイトが調べたものですか？",
      a: "いいえ。事業所が国の制度（障害福祉サービス等情報公表制度）に基づいて届け出た内容を、そのまま転記しています。当サイトによる推計や、独自の評価は入れていません。",
    },
    {
      q: "空き状況は分かりますか？",
      a: "公表データに空き状況は含まれていないため、当サイトでは扱っていません。推測で「空きあり」と表示することはしません。空き状況は各事業所か、お住まいの市区町村の相談支援専門員にご確認ください。",
    },
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <p className="text-xs text-[var(--ink-soft)]">
        <Link href="/" className="link">ホーム</Link> ／ <Link href="/area/" className="link">エリア</Link> ／{" "}
        <Link href={`/area/${p.slug}/`} className="link">{p.pref}</Link> ／ {c.city}
      </p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{c.city}の放課後等デイサービス・児童発達支援</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        {p.pref}{c.city}には<strong>{c.total}事業所</strong>（放課後等デイサービス{c.houday}・児童発達支援{c.jihatsu}）があります。
        平日・土曜の利用可能な時間帯、定休日、定員を公表データから一覧にしました。
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">事業所数</p>
          <p className="text-2xl font-bold">{c.total}</p>
        </div>
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">土曜に開いている</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{c.sat}</p>
        </div>
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">18時以降まで開いている</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{c.late18}</p>
        </div>
      </div>

      {c.late18 > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold">18時以降まで開いている事業所（{c.late18}件）</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            お迎えの時間が遅くなる場合、ここが実際に選べる候補になります。
          </p>
          <FacilityList items={late} />
        </>
      )}

      {c.sat > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold">土曜に開いている事業所（{c.sat}件）</h2>
          <FacilityList items={sat} />
        </>
      )}

      <h2 className="mt-10 text-xl font-bold">{c.city}の全事業所（{c.total}件）</h2>
      <FacilityList items={c.list} />

      <h2 className="mt-10 text-xl font-bold">よくある質問</h2>
      <div className="mt-3 space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="rounded-lg border border-[var(--line-strong)] bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">{f.q}</summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--ink-soft)]">{f.a}</p>
          </details>
        ))}
      </div>

      {others.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-bold">{p.pref}の近隣の市区町村</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            送迎の範囲内であれば、隣の市区町村も候補になります。
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {others.map((x) => (
              <Link key={x.city} href={`/area/${p.slug}/${encodeURIComponent(x.city)}/`} className="sm-mini-btn">
                {x.city}<span className="ml-1 text-xs text-[var(--ink-soft)]">{x.total}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <SourceNote />
    </main>
  );
}
