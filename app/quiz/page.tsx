import { PageHeader } from "@/components/PageHeader";
import { QuizRunner } from "@/components/QuizRunner";
import { allChapters, mockGrammar, mockVocabulary } from "@/lib/mock-data";

export default function QuizPage() {
  return (
    <>
      <PageHeader
        title="今日抽考"
        description="章節可複選；熟悉度為 yes 的項目仍可被抽考。第一版使用字串比對，整句翻譯保留 AI 判分 placeholder。"
      />
      <QuizRunner vocabulary={mockVocabulary} grammar={mockGrammar} chapters={allChapters} />
    </>
  );
}
