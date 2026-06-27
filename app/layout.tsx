import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ClipboardList, Database, FileClock, Home, Settings } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "韓文學習資料庫",
  description: "整理韓文單字、文法、例句與抽考紀錄的 RWD Web App"
};

const navItems = [
  { href: "/", label: "首頁", icon: Home },
  { href: "/vocabulary", label: "單字庫", icon: Database },
  { href: "/grammar", label: "文法庫", icon: BookOpen },
  { href: "/quiz", label: "今日抽考", icon: ClipboardList },
  { href: "/records", label: "抽考紀錄", icon: FileClock },
  { href: "/admin", label: "Admin", icon: Settings }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white/92 px-4 py-4 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-mint text-xl font-black text-teal">
                한
              </span>
              <div>
                <p className="text-lg font-black text-ink">韓文學習資料庫</p>
                <p className="text-xs text-slate-500">Vocabulary, grammar, quiz records</p>
              </div>
            </Link>
            <nav className="grid grid-cols-3 gap-2 text-sm md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 font-semibold text-slate-600 transition hover:bg-mint hover:text-teal"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
