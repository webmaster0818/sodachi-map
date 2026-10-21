import type { Metadata } from "next";
import Link from "next/link";
import { INDEX, loadPref, prefBySlug, cityList } from "@/lib/data";
import SourceNote from "@/components/SourceNote";

export function generateStaticParams() {
  return INDEX.prefs.map((p) => ({ pref: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string }> }): Promise<Metadata> {
  const { pref } = await params;
  const p = prefBySlug(pref);
  if (!p) return {};
  return {
    title: `${p.pref}の放課後等デイサービス・児童発達支援${p.total.toLocaleString()}事業所｜土曜${p.sat.toLocaleString()}・18時以降${p.late18.toLocaleString()}`,
    description: `${p.pref}の放課後等デイサービス${p.houday.toLocaleString()}事業所・児童発達支援${p.jihatsu.toLocaleString()}事業所を市区町村別に整理。土曜に開いているのは${p.sat.toLocaleString()}、平日18時以降まで開いているのは${p.late18.toLocaleString()}事業所です（国の公表データ・${INDEX.surveyedAt}時点）。`,
    alternates: { canonical: `/area/${p.slug}/` },
  };
}

export default async function PrefPage({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params;
  const p = prefBySlug(pref);
  if (!p) return null;
  const items = loadPref(pref);
  const cities = cityList(items);
  const satPct = Math.round((p.sat / p.total) * 100);
  const latePct = Math.round((p.late18 / p.total) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs text-[var(--ink-soft)]">
        <Link href="/" className="link">ホーム</Link> ／ <Link href="/area/" className="link">エリア</Link> ／ {p.pref}
      </p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{p.pref}の放課後等デイサービス・児童発達支援</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
        {p.pref}には<strong>{p.total.toLocaleString()}事業所</strong>（放課後等デイサービス{p.houday.toLocaleString()}・児童発達支援{p.jihatsu.toLocaleString()}）があります。
        このうち<strong>土曜に開いているのは{p.sat.toLocaleString()}事業所（{satPct}%）</strong>、
        <strong>平日18時以降まで開いているのは{p.late18.toLocaleString()}事業所（{latePct}%）</strong>です。
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">事業所数</p>
          <p className="text-2xl font-bold">{p.total.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">土曜に開いている</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{p.sat.toLocaleString()}<span className="ml-1 text-sm font-normal">（{satPct}%）</span></p>
        </div>
        <div className="rounded-xl border border-[var(--line-strong)] bg-white p-4">
          <p className="text-xs text-[var(--ink-soft)]">18時以降まで開いている</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{p.late18.toLocaleString()}<span className="ml-1 text-sm font-normal">（{latePct}%）</span></p>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">市区町村から探す</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
        市区町村をクリックすると、その地域の事業所一覧（平日・土曜の時間帯、定休日、定員）が出ます。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--accent-soft)] text-left">
              <th className="border-b border-[var(--line)] px-3 py-2">市区町村</th>
              <th className="border-b border-[var(--line)] px-3 py-2">合計</th>
              <th className="border-b border-[var(--line)] px-3 py-2">土曜</th>
              <th className="border-b border-[var(--line)] px-3 py-2">18時以降</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.city} className="border-b border-[var(--line)]">
                <th className="px-3 py-2 text-left font-bold">
                  <Link href={`/area/${p.slug}/${encodeURIComponent(c.city)}/`} className="link">{c.city}</Link>
                </th>
                <td className="px-3 py-2">{c.total}</td>
                <td className="px-3 py-2">{c.sat}</td>
                <td className="px-3 py-2 font-bold text-[var(--accent)]">{c.late18}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm">
        <Link href="/saturday/" className="link">→ 土曜に通える事業所を全国で見る</Link>
        {" ／ "}
        <Link href="/late/" className="link">→ 18時以降まで開いている事業所を全国で見る</Link>
      </p>
      <SourceNote />
    </main>
  );
}
