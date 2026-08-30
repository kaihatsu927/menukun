import Link from "next/link";
import { LinkButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";
import { TEMPLATES } from "@/lib/templates";

export default async function LandingPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <span className="text-lg font-semibold tracking-tight">Menuki</span>
        <nav className="flex items-center gap-2">
          {user ? (
            <LinkButton href="/dashboard" size="sm">
              管理画面へ
            </LinkButton>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" size="sm">
                ログイン
              </LinkButton>
              <LinkButton href="/signup" size="sm">
                無料ではじめる
              </LinkButton>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-5 pb-16 pt-14 text-center sm:pt-20">
        <p className="mb-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-ink-muted">
          飲食・物販・サービス、どんな業種でも
        </p>
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          お店のメニュー表を、
          <br />
          写真を入れるだけでサイトに。
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-ink-soft">
          テンプレートを選んで、写真・名前・説明を入れるだけ。HTMLの知識はいりません。
          できあがったメニューは公開URLをお店のサイトに貼るだけで表示できます。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href={user ? "/dashboard" : "/signup"}>
            {user ? "メニューを作る" : "無料でメニューを作る"}
          </LinkButton>
          <LinkButton href="/try" variant="secondary">
            登録なしでさわって試す
          </LinkButton>
        </div>
        <p className="mt-3 text-xs text-stone-400">
          完成イメージは{" "}
          <Link href="/m/demo" className="underline underline-offset-2 hover:text-ink">
            サンプルメニュー
          </Link>{" "}
          から
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "テンプレートから選ぶ",
              d: "レストラン、カフェ、居酒屋、物販、サロン。業種に合った雛形が最初から入っています。",
            },
            {
              t: "自由にアレンジ",
              d: "色・フォント・レイアウト・角丸を切り替えるだけ。お店の雰囲気に合わせられます。",
            },
            {
              t: "URLを貼るだけで公開",
              d: "発行されたURLをお店のサイトやSNSに貼るだけ。更新すればすぐ反映されます。",
            },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        <h2 className="mb-5 text-center text-sm font-medium text-ink-muted">
          用意されているテンプレート
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.filter((t) => t.id !== "blank").map((t) => (
            <div key={t.id} className="rounded-2xl border border-stone-200 bg-white p-5">
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: `${t.theme.accent}1a`, color: t.theme.accent }}
              >
                {t.industry}
              </span>
              <h3 className="mt-3 font-semibold">{t.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-400">
        <p>
          Menuki ·{" "}
          <Link href="/login" className="hover:text-ink">
            ログイン
          </Link>
        </p>
      </footer>
    </main>
  );
}
