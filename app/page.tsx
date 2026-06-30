import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { grammarCodeRules } from "@/lib/grammar-codes";
import { mockGrammar, mockSessions, mockSettings, mockVocabulary } from "@/lib/mock-data";

function learningDays(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  const diff = today.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

export default function HomePage() {
  const latestSession = mockSessions[0];
  const days = learningDays(mockSettings.learning_start_date);

  return (
    <>
      <PageHeader
        title="首頁"
        description="整理單字、文法與抽考紀錄。登入 Supabase 後會以 user_id 隔離每個帳號的資料。"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="總單字" value={mockVocabulary.length} />
        <StatCard label="總文法" value={mockGrammar.length} tone="slate" />
        <StatCard label="最近抽考" value={`${latestSession.score_correct}/${latestSession.score_total}`} tone="coral" />
        <StatCard label="學習計日器" value={`${days} 天`} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <p className="text-lg font-black text-ink">已學習韓文 {days} 天！</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            `learning_start_date` 會存放在 `user_settings`，首頁根據這個日期計算學習天數。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/quiz">
              今日抽考
            </Link>
            <Link className="btn-secondary" href="/import">
              匯入資料
            </Link>
          </div>
        </div>
        <div className="panel p-6">
          <p className="text-lg font-black text-ink">文法代號</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {grammarCodeRules.map((rule) => (
              <div key={rule.code} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <span className="font-black text-teal">{rule.code}</span>
                <span className="ml-2 text-slate-600">{rule.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
