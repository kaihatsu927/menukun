"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EditorProvider, useEditor } from "./context";
import { BasicPanel, DesignPanel, PublishPanel } from "./panels";
import { ContentPanel } from "./ContentPanel";
import { MenuView } from "@/components/menu-view/MenuView";
import { Category, Menu, MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Editor(props: {
  userId: string;
  demo?: boolean;
  initialMenu: Menu;
  initialCategories: Category[];
  initialItems: MenuItem[];
  siteUrl: string;
}) {
  return (
    <EditorProvider
      userId={props.userId}
      demo={props.demo}
      initialMenu={props.initialMenu}
      initialCategories={props.initialCategories}
      initialItems={props.initialItems}
    >
      <EditorShell siteUrl={props.siteUrl} />
    </EditorProvider>
  );
}

function SaveBadge() {
  const { saveState, demo } = useEditor();
  const map = {
    idle: { t: demo ? "お試しモード" : "自動保存", c: "text-stone-400" },
    saving: { t: demo ? "反映中…" : "保存中…", c: "text-stone-500" },
    saved: { t: demo ? "プレビュー更新" : "保存しました", c: "text-emerald-600" },
    error: { t: "保存に失敗しました", c: "text-red-600" },
  } as const;
  const s = map[saveState];
  return <span className={cn("text-xs", s.c)}>{s.t}</span>;
}

function Preview() {
  const { menu, categories, items, theme } = useEditor();
  const data = useMemo(
    () => ({ menu, categories, items }),
    [menu, categories, items],
  );
  return (
    <div className="h-full overflow-y-auto scrollbar-thin" style={{ background: "var(--m-bg)" }}>
      <MenuView data={data} theme={theme} preview />
    </div>
  );
}

function EditorShell({ siteUrl }: { siteUrl: string }) {
  const { menu, demo } = useEditor();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen">
      {demo && (
        <div className="bg-ink px-4 py-2 text-center text-xs text-white">
          お試しモードです。操作は自由にできますが保存されません。
          <Link href="/signup" className="ml-2 underline underline-offset-2">
            アカウント登録して本番で使う
          </Link>
        </div>
      )}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#faf9f7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={demo ? "/" : "/dashboard"}
              className="shrink-0 text-sm text-ink-soft hover:text-ink"
            >
              ← {demo ? "トップ" : "一覧"}
            </Link>
            <span className="truncate text-sm font-semibold">{menu.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <SaveBadge />
            {!demo && (
              <>
                <span
                  className={cn(
                    "hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline",
                    menu.is_published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-200 text-stone-600",
                  )}
                >
                  {menu.is_published ? "公開中" : "下書き"}
                </span>
                <a
                  href={`${siteUrl}/m/${menu.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden text-sm font-medium text-ink underline underline-offset-2 sm:inline"
                >
                  公開ページ ↗
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-5 pb-24 lg:pb-6">
          <BasicPanel />
          <DesignPanel />
          <ContentPanel />
          <PublishPanel siteUrl={siteUrl} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <p className="mb-2 text-xs font-medium text-ink-muted">プレビュー</p>
            <div className="h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <Preview />
            </div>
          </div>
        </aside>
      </div>

      {/* モバイル用プレビュー */}
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white shadow-lg lg:hidden"
      >
        プレビューを見る
      </button>
      {showPreview && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <span className="text-sm font-semibold">プレビュー</span>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="rounded-full px-3 py-1.5 text-sm text-ink-soft hover:bg-stone-100"
            >
              閉じる
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}
