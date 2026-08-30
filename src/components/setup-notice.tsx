export function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-12">
      <span className="text-lg font-semibold tracking-tight">Menuki</span>
      <h1 className="mt-4 text-2xl font-bold">あと少しで準備完了です</h1>
      <p className="mt-2 text-ink-soft">
        データベース（Supabase）の接続情報がまだ設定されていません。次の手順で設定してください。
      </p>

      <ol className="mt-6 space-y-4 text-sm leading-relaxed">
        <li className="rounded-xl border border-stone-200 bg-white p-4">
          <span className="font-semibold">1. Supabase でプロジェクトを作成</span>
          <br />
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-ink underline underline-offset-2"
          >
            supabase.com/dashboard
          </a>{" "}
          にアクセスし、無料プランで新しいプロジェクトを作成します。
        </li>
        <li className="rounded-xl border border-stone-200 bg-white p-4">
          <span className="font-semibold">2. データベースを準備</span>
          <br />
          Supabase の「SQL Editor」を開き、プロジェクト内の{" "}
          <code className="rounded bg-stone-100 px-1">supabase/schema.sql</code>{" "}
          の内容をすべて貼り付けて実行します。
        </li>
        <li className="rounded-xl border border-stone-200 bg-white p-4">
          <span className="font-semibold">3. 接続情報を設定</span>
          <br />
          Supabase の「Project Settings → API」から{" "}
          <code className="rounded bg-stone-100 px-1">Project URL</code> と{" "}
          <code className="rounded bg-stone-100 px-1">anon public</code> キーをコピーし、
          <br />
          ローカルでは <code className="rounded bg-stone-100 px-1">.env.local</code>、Vercel では
          「Settings → Environment Variables」に次の名前で登録します。
          <pre className="mt-2 overflow-x-auto rounded-lg bg-stone-900 p-3 text-xs text-stone-100">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=公開URL（例 https://your-app.vercel.app）`}
          </pre>
        </li>
      </ol>

      <p className="mt-6 text-sm text-stone-400">
        設定後、ページを再読み込み（Vercel の場合は再デプロイ）すると管理画面が使えるようになります。
        詳しい手順は <code className="rounded bg-stone-100 px-1">README.md</code> にも記載しています。
      </p>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 text-sm">
        <span className="font-semibold">設定前に画面を見てみたい方へ</span>
        <br />
        <a href="/try" className="text-ink underline underline-offset-2">
          登録なしで編集画面を試す
        </a>{" "}
        ・{" "}
        <a href="/m/demo" className="text-ink underline underline-offset-2">
          公開メニューのサンプル
        </a>
      </div>
    </main>
  );
}
