import { ImportTool } from "@/components/ImportTool";
import { PageHeader } from "@/components/PageHeader";
import { mockGrammar, mockVocabulary } from "@/lib/mock-data";

export default function ImportPage() {
  return (
    <>
      <PageHeader
        title="匯入資料"
        description="貼上文字、上傳 .txt/.md/.json，先預覽並標示可能重複資料，使用者確認後才寫入。"
      />
      <ImportTool vocabulary={mockVocabulary} grammar={mockGrammar} />
    </>
  );
}
