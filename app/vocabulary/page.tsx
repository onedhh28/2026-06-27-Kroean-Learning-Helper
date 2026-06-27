import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { VocabularyList } from "@/components/VocabularyList";
import { allChapters, mockVocabulary } from "@/lib/mock-data";

export default function VocabularyPage() {
  return (
    <>
      <PageHeader
        title="單字庫"
        description="前台提供查看、搜尋、來源篩選與匯入入口；正式編輯與刪除集中在 /admin。課本來源以章節-小節格式顯示。"
      />
      <div className="mb-4 flex justify-end">
        <Link href="/import" className="btn-primary">
          匯入單字資料
        </Link>
      </div>
      <VocabularyList items={mockVocabulary} chapters={allChapters} />
    </>
  );
}
