import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-medium text-ink-muted">404</p>
      <h1 className="mt-2 text-2xl font-bold">ページが見つかりません</h1>
      <p className="mt-2 text-ink-soft">
        メニューが非公開になっているか、URLが間違っている可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
      >
        トップへ戻る
      </Link>
    </main>
  );
}
