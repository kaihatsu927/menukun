"use client";

import { useState } from "react";
import { useEditor } from "./context";
import { ImageUploader } from "./ImageUploader";
import { Button, Field, Input, Textarea } from "@/components/ui";
import {
  ACCENT_PRESETS,
  FONT_OPTIONS,
  LAYOUT_OPTIONS,
  MOOD_OPTIONS,
} from "@/lib/theme";
import { regenerateSlug, deleteMenu, setPublished } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

export function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-ink-soft">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/* ============ 基本情報 ============ */
export function BasicPanel() {
  const { menu, userId, patchMenu } = useEditor();
  return (
    <Section title="基本情報" desc="お店の名前や紹介文を入れます。空欄の項目は公開ページに表示されません。">
      <Field label="タイトル（お店の名前・メニュー名）">
        <Input
          defaultValue={menu.title}
          onChange={(e) => patchMenu({ title: e.target.value }, { debounce: true })}
          placeholder="〇〇食堂"
        />
      </Field>
      <Field label="ひとことキャッチ" hint="なくてもOK">
        <Input
          defaultValue={menu.tagline ?? ""}
          onChange={(e) =>
            patchMenu({ tagline: e.target.value || null }, { debounce: true })
          }
          placeholder="旬の食材でつくる一皿"
        />
      </Field>
      <Field label="紹介文・お知らせ" hint="改行できます。なくてもOK">
        <Textarea
          rows={3}
          defaultValue={menu.description ?? ""}
          onChange={(e) =>
            patchMenu({ description: e.target.value || null }, { debounce: true })
          }
          placeholder="営業時間やこだわりなど"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploader
          userId={userId}
          menuId={menu.id}
          value={menu.cover_url}
          onChange={(url) => patchMenu({ cover_url: url })}
          aspect="wide"
          label="カバー画像（上部の大きな写真）"
        />
        <ImageUploader
          userId={userId}
          menuId={menu.id}
          value={menu.logo_url}
          onChange={(url) => patchMenu({ logo_url: url })}
          aspect="square"
          label="ロゴ（丸く表示されます）"
        />
      </div>
    </Section>
  );
}

/* ============ デザイン ============ */
function OptionRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm transition-colors",
              value === o.value
                ? "border-ink bg-ink text-white"
                : "border-stone-300 bg-white text-ink-soft hover:border-stone-400",
            )}
          >
            {o.label}
            {o.hint && (
              <span
                className={cn(
                  "ml-1 text-xs",
                  value === o.value ? "text-white/70" : "text-stone-400",
                )}
              >
                {o.hint}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DesignPanel() {
  const { theme, patchTheme } = useEditor();
  return (
    <Section title="デザイン" desc="お店の雰囲気に合わせて見た目を調整できます。変更はすぐプレビューに反映されます。">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">アクセントカラー</span>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => patchTheme({ accent: c })}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                theme.accent.toLowerCase() === c.toLowerCase()
                  ? "border-ink"
                  : "border-transparent",
              )}
              style={{ background: c }}
            />
          ))}
          <label className="ml-1 inline-flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="color"
              value={theme.accent}
              onChange={(e) => patchTheme({ accent: e.target.value })}
              className="h-8 w-10 cursor-pointer rounded border border-stone-300 bg-white"
            />
            自由に選ぶ
          </label>
        </div>
      </div>

      <OptionRow
        label="背景の雰囲気"
        value={theme.mood}
        options={MOOD_OPTIONS}
        onChange={(v) => patchTheme({ mood: v })}
      />
      <OptionRow
        label="フォント"
        value={theme.font}
        options={FONT_OPTIONS}
        onChange={(v) => patchTheme({ font: v })}
      />
      <OptionRow
        label="レイアウト"
        value={theme.layout}
        options={LAYOUT_OPTIONS}
        onChange={(v) => patchTheme({ layout: v })}
      />

      <Field label={`角丸の強さ（${theme.radius}px）`}>
        <input
          type="range"
          min={0}
          max={24}
          value={theme.radius}
          onChange={(e) => patchTheme({ radius: Number(e.target.value) })}
          className="w-full accent-ink"
        />
      </Field>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={theme.bigHeadings}
          onChange={(e) => patchTheme({ bigHeadings: e.target.checked })}
          className="h-4 w-4 rounded accent-ink"
        />
        カテゴリー見出しを大きく表示する
      </label>
    </Section>
  );
}

/* ============ 公開設定 ============ */
export function PublishPanel({ siteUrl }: { siteUrl: string }) {
  const { menu, patchMenu, demo } = useEditor();
  const [slug, setSlug] = useState(menu.slug);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const url = `${siteUrl}/m/${slug}`;
  const embed = `<iframe src="${url}" style="width:100%;height:900px;border:0" loading="lazy"></iframe>`;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  if (demo) {
    return (
      <Section title="公開設定" desc="本番モードではここで公開/非公開の切り替えと、お店のサイトに貼るURL・埋め込みタグを取得できます。">
        <div className="rounded-xl bg-stone-50 p-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">お試しモードでは公開はできません。</p>
          <p className="mt-1">
            アカウントを登録すると、作ったメニューに専用URL（例：
            <code className="rounded bg-white px-1">
              {siteUrl}/m/7k2m9x4p
            </code>
            ）が発行され、そのままお店のサイトに掲載できます。
          </p>
          <a
            href="/signup"
            className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-xs font-medium text-white"
          >
            無料でアカウント登録
          </a>
        </div>
      </Section>
    );
  }

  return (
    <Section title="公開設定" desc="公開するとURLが有効になり、誰でもメニューを見られます。">
      <label className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
        <span className="text-sm font-medium">
          {menu.is_published ? "公開中" : "下書き（非公開）"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={menu.is_published}
          onClick={() => {
            const next = !menu.is_published;
            patchMenu({ is_published: next });
            setPublished(menu.id, next);
          }}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            menu.is_published ? "bg-emerald-500" : "bg-stone-300",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
              menu.is_published ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </label>

      <Field label="公開URL">
        <div className="flex gap-2">
          <Input readOnly value={url} className="font-mono text-xs" />
          <Button type="button" variant="secondary" onClick={() => copy(url)}>
            {copied ? "コピー済" : "コピー"}
          </Button>
        </div>
      </Field>

      <Field label="お店のサイトに埋め込むタグ" hint="HTMLに貼り付けるとページ内にメニューを表示できます">
        <div className="flex gap-2">
          <Textarea readOnly rows={2} value={embed} className="font-mono text-xs" />
          <Button type="button" variant="secondary" onClick={() => copy(embed)}>
            コピー
          </Button>
        </div>
      </Field>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-ink underline underline-offset-2"
        >
          公開ページを開く ↗
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const s = await regenerateSlug(menu.id);
              setSlug(s);
              patchMenu({ slug: s });
            } finally {
              setBusy(false);
            }
          }}
          className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          URLを作り直す
        </button>
      </div>

      <div className="mt-2 border-t border-stone-100 pt-4">
        {confirming ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-700">本当に削除しますか？元に戻せません。</span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => deleteMenu(menu.id)}
            >
              削除する
            </Button>
            <button
              type="button"
              className="text-sm text-ink-soft"
              onClick={() => setConfirming(false)}
            >
              やめる
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-sm text-red-600 hover:underline"
          >
            このメニューを削除
          </button>
        )}
      </div>
    </Section>
  );
}
