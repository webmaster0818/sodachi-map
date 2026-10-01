import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sodachi-map.com"),
  title: {
    default: "そだちマップ｜放課後等デイサービス・児童発達支援を「通える条件」で探す",
    template: "%s｜そだちマップ",
  },
  description:
    "全国42,013事業所の放課後等デイサービス・児童発達支援を、平日の終わり時刻・土曜の開所・定員といった公表データで比べられます。出所は障害福祉サービス等情報公表システム（2026年3月末時点）。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {/* 広告・アフィリエイトを掲載する場合に備えた包括表記(全サイト共通ルール) */}
        <div className="bg-[var(--accent-soft)] px-4 py-1.5 text-center text-[11px] text-[var(--ink-soft)]">
          本サイトはプロモーションを含む場合があります。掲載している事業所情報は公的な公表データに基づく実データです。
        </div>

        <header className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              そだち<span className="text-[var(--accent)]">マップ</span>
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm text-[var(--ink-soft)]">
              <Link href="/area/">エリアから探す</Link>
              <Link href="/saturday/">土曜に通える</Link>
              <Link href="/late/">18時以降まで</Link>
              <Link href="/guide/">はじめての方へ</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-[var(--line)] bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-[var(--ink-soft)]">
            <p className="font-bold text-[var(--ink)]">そだちマップ</p>
            <p className="mt-2 leading-relaxed">
              放課後等デイサービス・児童発達支援を、「通える条件」から探せるサイトです。
              掲載している事業所情報は
              <a href="https://www.wam.go.jp/content/wamnet/pcpub/top/sfkopendata/" target="_blank" rel="noopener noreferrer" className="link">
                障害福祉サービス等情報公表システム（WAM NET）のオープンデータ
              </a>
              から作成しています。当サイトによる推計値や、事業所の優劣の評価は掲載していません。
            </p>
            <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/area/">エリアから探す</Link>
              <Link href="/saturday/">土曜に通える事業所</Link>
              <Link href="/late/">18時以降まで開いている事業所</Link>
              <Link href="/service/houkago-day/">放課後等デイサービスとは</Link>
              <Link href="/service/jidou-hattatsu/">児童発達支援とは</Link>
              <Link href="/guide/">はじめての方へ</Link>
              <Link href="/about/">サイトについて</Link>
              <Link href="/terms/">利用規約</Link>
              <Link href="/privacy/">プライバシーポリシー</Link>
            </nav>
            <p className="mt-6 text-xs">© そだちマップ</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
