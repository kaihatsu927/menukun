import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "アカウント登録" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ anon?: string }>;
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const { anon } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const converting = !!user?.is_anonymous;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold tracking-tight">
          Menuki
        </Link>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h1 className="text-lg font-bold">
            {converting ? "アカウントを登録" : "アカウントを作成"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {converting
              ? "作成中のメニューはそのまま引き継がれます。別の端末からも編集できるようになります。"
              : "メールアドレスとパスワードだけで始められます。"}
          </p>

          {anon === "unavailable" && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              「登録せずに作る」は現在利用できません。アカウントを作成してご利用ください。
            </p>
          )}

          <Suspense>
            <AuthForm mode="signup" converting={converting} />
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
