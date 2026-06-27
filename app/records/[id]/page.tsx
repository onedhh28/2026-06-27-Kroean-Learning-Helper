import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { mockAnswers, mockSessions } from "@/lib/mock-data";

export default function RecordDetailPage({ params }: { params: { id: string } }) {
  const session = mockSessions.find((item) => item.id === params.id) || mockSessions[0];
  const answers = mockAnswers.filter((item) => item.quiz_session_id === session.id);

  return (
    <>
      <PageHeader title="完整試卷" description="顯示題型、題目、我的答案、正確答案、錯誤原因與 AI 判定結果欄位。" />
      <section className="panel mb-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{session.date}</p>
            <p className="mt-1 text-3xl font-black text-ink">
              {session.score_correct}/{session.score_total}
            </p>
          </div>
          <p className="rounded-lg bg-mint px-3 py-2 text-sm font-semibold text-teal">{session.selected_chapters.join(", ") || "全部"}</p>
        </div>
      </section>
      <div className="grid gap-3">
        {answers.map((answer, index) => (
          <article key={answer.id} className="panel p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-teal">第 {index + 1} 題 · {answer.question_type}</p>
                <h2 className="mt-2 text-xl font-black text-ink">{answer.question_text}</h2>
              </div>
              <span className={`rounded-lg px-3 py-1 text-sm font-black ${answer.is_correct ? "bg-mint text-teal" : "bg-red-50 text-coral"}`}>
                {answer.is_correct ? "答對" : "答錯"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="我的答案" value={answer.user_answer} />
              <Info label="正確答案 / 參考答案" value={answer.correct_answer} />
              <Info label="錯誤原因" value={answer.error_reason || "尚無"} />
              <Info label="AI 判定結果" value={answer.ai_judgement || "第二階段實作"} />
            </div>
          </article>
        ))}
      </div>
      <Link className="btn-secondary mt-5" href="/records">
        返回紀錄列表
      </Link>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-sm">
      <p className="font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-ink">{value}</p>
    </div>
  );
}
