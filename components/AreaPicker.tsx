"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/*
 * TOPの検索窓。静的書き出しのサイトなのでサーバ検索はせず、
 * 都道府県を選んだらそのエリアページへ移動するだけにしている。
 * ジョブメドレーのTOPと同じく「選ぶ→大きなボタンを押す」の2操作で終わらせる。
 */
export default function AreaPicker({ prefs }: { prefs: { slug: string; pref: string; total: number }[] }) {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const go = () => {
    if (slug) router.push(`/area/${slug}/`);
  };

  return (
    <div className="jm-card p-4 sm:p-5">
      <label htmlFor="pref" className="jm-h3">
        お住まいの地域から探す
      </label>
      <p className="jm-lead mt-1">都道府県を選ぶと、市区町村ごとの事業所数と「18時以降／土曜」の内訳が出ます。</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <select
          id="pref"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="min-h-[52px] rounded-[var(--r)] border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-[16px] leading-6 text-[var(--ink)]"
        >
          <option value="">都道府県を選ぶ</option>
          {prefs.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.pref}（{p.total.toLocaleString()}事業所）
            </option>
          ))}
        </select>
        <button type="button" onClick={go} disabled={!slug} className="jm-btn jm-btn-primary disabled:opacity-40">
          この地域で探す
        </button>
      </div>
    </div>
  );
}
