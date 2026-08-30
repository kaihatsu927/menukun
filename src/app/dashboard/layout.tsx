import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";
import { signOut } from "@/app/auth/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("shop_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const isAnon = !!user.is_anonymous;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf9f7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Menuki
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-muted sm:inline">
              {isAnon ? "ゲスト（未登録）" : profile?.shop_name || profile?.email || user.email}
            </span>
            {isAnon ? (
              <Link
                href="/signup"
                className="rounded-full bg-ink px-3 py-1.5 text-white hover:bg-ink-soft"
              >
                アカウント登録
              </Link>
            ) : (
              <form action={signOut}>
                <button className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-stone-100">
                  ログアウト
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {isAnon && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-5xl px-5 py-2.5 text-sm text-amber-900">
            この端末だけにメニューが保存されています。
            <Link href="/signup" className="font-medium underline underline-offset-2">
              アカウント登録
            </Link>
            すると、別の端末からも編集でき、消える心配がなくなります（今のメニューはそのまま引き継がれます）。
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
