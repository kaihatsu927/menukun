import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LinkButton } from "@/components/ui";
import { getTemplate } from "@/lib/templates";
import { formatDate } from "@/lib/utils";
import { Menu } from "@/lib/types";

export const metadata = { title: "メニュー一覧" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .order("updated_at", { ascending: false });

  const list = (menus ?? []) as Menu[];

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">メニュー</h1>
          <p className="mt-1 text-sm text-ink-soft">
            作成したメニュー表の一覧です。公開すると URL でお店のサイトに載せられます。
          </p>
        </div>
        <LinkButton href="/dashboard/new">＋ 新しく作る</LinkButton>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-ink-soft">まだメニューがありません。</p>
          <LinkButton href="/dashboard/new" className="mt-4">
            テンプレートから作る
          </LinkButton>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {list.map((m) => {
            const tpl = getTemplate(m.template);
            const accent = m.theme?.accent ?? tpl.theme.accent;
            return (
              <li key={m.id}>
                <Link
                  href={`/dashboard/${m.id}`}
                  className="block rounded-2xl border border-stone-200 bg-white p-5 transition-colors hover:border-stone-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold">{m.title}</h2>
                      {m.tagline && (
                        <p className="mt-0.5 truncate text-sm text-ink-soft">{m.tagline}</p>
                      )}
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={
                        m.is_published
                          ? { background: `${accent}1a`, color: accent }
                          : { background: "#f5f5f4", color: "#78716c" }
                      }
                    >
                      {m.is_published ? "公開中" : "下書き"}
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-stone-400">
                    {tpl.label} · 更新 {formatDate(m.updated_at)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
