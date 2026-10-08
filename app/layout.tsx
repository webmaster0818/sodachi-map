import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { INDEX } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://sodachi-map.com"),
  title: {
    default: "そだちマップ｜放課後等デイサービス・児童発達支援を「通える条件」で探す",
    template: "%s｜そだちマップ",
  },
  description:
    "全国42,013事業所の放課後等デイサービス・児童発達支援を、平日の終わり時刻・土曜の開所・定員といった公表データで比べられます。出所は障害福祉サービス等情報公表システム（2026年3月末時点）。",
};

const total = INDEX.counts.houday + INDEX.counts.jihatsu;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        {/* 広告・アフィリエイトを掲載する場合に備えた包括表記(全サイト共通ルール) */}
        <div className="bg-[var(--bg-2)] border-b border-[var(--line)] px-4 py-1.5 text-center text-[10px] leading-[15px] text-[var(--ink-3)]">
          本サイトはプロモーションを含む場合があります。掲載している事業所情報は公的な公表データに基づく実データです。
        </div>

        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="jm-wrap flex min-h-[60px] items-center justify-between gap-4">
            <Link href="/" className="shrink-0 leading-tight">
              <span className="block text-[17px] font-bold tracking-tight">
                そだち<span className="text-[var(--brand)]">マップ</span>
              </span>
              <span className="block text-[10px] leading-[15px] text-[var(--ink-3)]">
                放課後等デイ・児童発達支援 {total.toLocaleString()}事業所
              </span>
            </Link>
            <nav className="hidden flex-wrap items-center gap-x-5 gap-y-1 md:flex">
              <Link href="/area/" className="jm-link">エリアから探す</Link>
              <Link href="/late/" className="jm-link">18時以降まで</Link>
              <Link href="/saturday/" className="jm-link">土曜に通える</Link>
              <Link href="/guide/" className="jm-link">はじめての方へ</Link>
            </nav>
            <Link href="/area/" className="jm-btn jm-btn-primary !min-h-[40px] !px-4 !text-[13px] md:!min-h-[44px] md:!px-5 md:!text-sm">
              地域から探す
            </Link>
          </div>
          {/* スマホはナビを2段目に出す（押せる高さを確保する） */}
          <div className="border-t border-[var(--line)] md:hidden">
            <div className="jm-wrap flex items-center gap-x-4 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden">
              <Link href="/area/" className="jm-link whitespace-nowrap">エリア</Link>
              <Link href="/late/" className="jm-link whitespace-nowrap">18時以降まで</Link>
              <Link href="/saturday/" className="jm-link whitespace-nowrap">土曜に通える</Link>
              <Link href="/service/houkago-day/" className="jm-link whitespace-nowrap">放課後等デイとは</Link>
              <Link href="/service/jidou-hattatsu/" className="jm-link whitespace-nowrap">児童発達支援とは</Link>
              <Link href="/guide/" className="jm-link whitespace-nowrap">はじめての方へ</Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="mt-10 border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="jm-wrap py-10">
            <p className="text-[15px] font-bold">そだちマップ</p>
            <p className="mt-2 max-w-3xl text-[12px] leading-[20px] text-[var(--ink-3)]">
              放課後等デイサービス・児童発達支援を、「通える条件」から探せるサイトです。
              掲載している事業所情報は
              <a href="https://www.wam.go.jp/content/wamnet/pcpub/top/sfkopendata/" target="_blank" rel="noopener noreferrer" className="link">
                障害福祉サービス等情報公表システム（WAM NET）のオープンデータ
              </a>
              から作成しています。当サイトによる推計値や、事業所の優劣の評価は掲載していません。
            </p>

            <div className="mt-7 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="jm-h3">探す</p>
                <div className="jm-linklist mt-1">
                  <div><Link href="/area/" className="jm-link">エリアから探す</Link></div>
                  <div><Link href="/late/" className="jm-link">18時以降まで開いている事業所</Link></div>
                  <div><Link href="/saturday/" className="jm-link">土曜に開いている事業所</Link></div>
                </div>
              </div>
              <div>
                <p className="jm-h3">知る</p>
                <div className="jm-linklist mt-1">
                  <div><Link href="/service/houkago-day/" className="jm-link">放課後等デイサービスとは</Link></div>
                  <div><Link href="/service/jidou-hattatsu/" className="jm-link">児童発達支援とは</Link></div>
                  <div><Link href="/guide/" className="jm-link">はじめての方へ（受給者証・料金）</Link></div>
                </div>
              </div>
              <div>
                <p className="jm-h3">サイト情報</p>
                <div className="jm-linklist mt-1">
                  <div><Link href="/about/" className="jm-link">サイトについて</Link></div>
                  <div><Link href="/terms/" className="jm-link">利用規約</Link></div>
                  <div><Link href="/privacy/" className="jm-link">プライバシーポリシー</Link></div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-[10px] leading-[15px] text-[var(--ink-3)]">© そだちマップ</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
