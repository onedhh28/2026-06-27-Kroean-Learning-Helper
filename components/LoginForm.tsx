"use client";

import { useState } from "react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  async function signIn() {
    if (!supabase) {
      setMessage("尚未設定 Supabase 環境變數。請先填入 .env.local。");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    setMessage(error ? error.message : "登入連結已寄出，請檢查信箱。");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("已登出。");
  }

  return (
    <section className="panel mx-auto max-w-xl p-6">
      <h2 className="text-xl font-black text-ink">Supabase Auth</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        MVP 使用 Email Magic Link。所有資料表都透過 RLS 以 `auth.uid() = user_id` 隔離。
      </p>
      {!hasSupabaseConfig ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-coral">目前未設定 Supabase，頁面會使用 mock 資料。</p>
      ) : null}
      <label className="label mt-5 block">Email</label>
      <input className="field mt-2 w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-primary" onClick={signIn}>
          寄送登入連結
        </button>
        <button className="btn-secondary" onClick={signOut}>
          登出
        </button>
      </div>
      {message ? <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
