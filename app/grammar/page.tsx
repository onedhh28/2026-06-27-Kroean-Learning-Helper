import Link from "next/link";
import { GrammarList } from "@/components/GrammarList";
import { PageHeader } from "@/components/PageHeader";
import { allChapters, mockGrammar } from "@/lib/mock-data";

export default function GrammarPage() {
  const sources = Array.from(new Set(mockGrammar.map((item) => item.source).filter(Boolean))) as string[];

  return (
    <>
      <PageHeader
        title="文法庫"
        description="前台提供查看、搜尋、章節與來源篩選；正式編輯與刪除集中在 /admin。"
      />
      <div className="mb-4 flex justify-end">
        <Link href="/import" className="btn-primary">
          匯入文法資料
        </Link>
      </div>
      <GrammarList items={mockGrammar} chapters={allChapters} sources={sources} />
    </>
  );
}
