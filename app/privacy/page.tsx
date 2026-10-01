import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "そだちマップのプライバシーポリシーです。",
  alternates: { canonical: "/privacy/" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed">
      <p className="text-xs text-[var(--ink-soft)]"><Link href="/" className="link">ホーム</Link> ／ プライバシーポリシー</p>
      <h1 className="mt-2 text-2xl font-bold">プライバシーポリシー</h1>

      <h2 className="mt-8 text-lg font-bold">取得する情報</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトは、利用状況の把握のためアクセス解析ツールを利用する場合があります。
        これらはCookieを使用して匿名のトラフィックデータを収集するもので、個人を特定する情報は含みません。
        Cookieはブラウザの設定で無効にできます。
      </p>

      <h2 className="mt-6 text-lg font-bold">広告について</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトは第三者配信の広告サービスを利用する場合があります。広告配信事業者はCookieを使用して、
        利用者の過去のアクセス情報に基づいた広告を表示することがあります。
      </p>

      <h2 className="mt-6 text-lg font-bold">事業所情報の取り扱い</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        当サイトが掲載する事業所の名称・所在地・電話番号等は、国が公表しているオープンデータに含まれる事業者の情報です。
        利用者個人の情報を収集・掲載することはありません。
      </p>

      <h2 className="mt-6 text-lg font-bold">お問い合わせ</h2>
      <p className="mt-2 text-[var(--ink-soft)]">
        掲載情報に関するご連絡は、サイト内のお問い合わせ手段をご利用ください。
      </p>
    </main>
  );
}
