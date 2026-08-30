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

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf9f7]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Menuki
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-muted sm:inline">
              {profile?.shop_name || profile?.email || user.email}
            </span>
            <form action={signOut}>
              <button className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-stone-100">
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
