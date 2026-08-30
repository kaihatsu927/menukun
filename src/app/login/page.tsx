import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";

export const metadata = { title: "ログイン" };

export default function LoginPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold tracking-tight">
          Menuki
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h1 className="text-lg font-bold">ログイン</h1>
          <p className="mt-1 text-sm text-ink-soft">管理画面にサインインします。</p>
          <Suspense>
            <AuthForm mode="signin" />
          </Suspense>
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">
          アカウントをお持ちでない場合は{" "}
          <Link href="/signup" className="font-medium text-ink underline underline-offset-2">
            新規登録
          </Link>
        </p>
      </div>
    </main>
  );
}
