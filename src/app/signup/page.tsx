import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";

export const metadata = { title: "新規登録" };

export default function SignupPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold tracking-tight">
          Menuki
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h1 className="text-lg font-bold">アカウントを作成</h1>
          <p className="mt-1 text-sm text-ink-soft">
            メールアドレスとパスワードだけで始められます。
          </p>
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          すでにアカウントをお持ちの場合は{" "}
          <Link href="/login" className="font-medium text-ink underline underline-offset-2">
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
