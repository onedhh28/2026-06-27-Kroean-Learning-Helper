import { AdminPanel } from "@/components/AdminPanel";
import { PageHeader } from "@/components/PageHeader";
import { mockGrammar, mockVocabulary } from "@/lib/mock-data";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="後台管理"
        description="單字與文法的正式編輯、刪除集中在這裡；刪除前會二次確認。接 Supabase 後需限制只有目前登入 user_id 的資料可操作。"
      />
      <AdminPanel vocabulary={mockVocabulary} grammar={mockGrammar} />
    </>
  );
}
