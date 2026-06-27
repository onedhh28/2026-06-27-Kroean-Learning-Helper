import Link from "next/link";
import { GrammarList } from "@/components/GrammarList";
import { PageHeader } from "@/components/PageHeader";
import { allChapters, mockGrammar } from "@/lib/mock-data";

export default function GrammarPage() {
  return (
    <>
      <PageHeader
        title="文法庫"
        description="前台提供查看、搜尋與來源篩選；正式編輯與刪除集中在 /admin。課本來源以章節-小節格式顯示。"
      />
      <div className="mb-4 flex justify-end">
        <Link href="/import" className="btn-primary">
          匯入文法資料
        </Link>
      </div>
      <GrammarList items={mockGrammar} chapters={allChapters} />
    </>
  );
}
