import { LoginForm } from "@/components/LoginForm";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <>
      <PageHeader title="登入" description="使用 Supabase Auth 登入後，資料會依 user_id 過濾。" />
      <LoginForm />
    </>
  );
}
