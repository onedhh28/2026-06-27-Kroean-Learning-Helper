import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { mockSessions } from "@/lib/mock-data";

export default function RecordsPage() {
  return (
    <>
      <PageHeader title="抽考紀錄" description="列表只顯示日期、分數與抽考範圍；點進去後顯示完整試卷。" />
      <div className="grid gap-3">
        {mockSessions.map((session) => (
          <Link key={session.id} href={`/records/${session.id}`} className="panel p-4 transition hover:border-teal">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">{session.date}</p>
                <p className="mt-1 text-2xl font-black text-ink">
                  {session.score_correct}/{session.score_total}
                </p>
              </div>
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
                {session.selected_chapters.join(", ") || "全部"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
