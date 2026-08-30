import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { resolveTheme } from "@/lib/theme";
import { MiniPreview } from "@/components/mini-preview";

export const metadata = { title: "さわって試す" };

export default function TryIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/" className="text-sm text-ink-soft hover:text-ink">
        ← トップへ戻る
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">さわって試す</h1>
      <p className="mt-1 text-sm text-ink-soft">
        アカウント登録なしで編集画面を体験できます。テンプレートを選んでください。
        <span className="text-stone-400">（操作は自由にできますが保存はされません）</span>
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Link
            key={t.id}
            href={`/try/${t.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-colors hover:border-ink"
          >
            <div className="border-b border-stone-100 bg-stone-50 p-3">
              <MiniPreview theme={resolveTheme(t.theme)} label={t.title} />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <span
                className="inline-block w-fit rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ background: `${t.theme.accent}1a`, color: t.theme.accent }}
              >
                {t.industry}
              </span>
              <h2 className="mt-2 font-semibold">{t.label}</h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{t.summary}</p>
              <span className="mt-3 text-sm font-medium text-ink group-hover:underline">
                これで試す →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
