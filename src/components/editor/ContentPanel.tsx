"use client";

import { useState } from "react";
import { useEditor } from "./context";
import { Section } from "./panels";
import { ImageUploader } from "./ImageUploader";
import { Button, Input, Textarea } from "@/components/ui";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ContentPanel() {
  const { menu, categories, items, addCategory } = useEditor();

  const uncategorized = items
    .filter((i) => !i.category_id || !categories.some((c) => c.id === i.category_id))
    .sort((a, b) => a.position - b.position);

  return (
    <Section
      title="メニュー内容"
      desc="カテゴリー（分類）と項目を編集します。カテゴリーを使わず項目だけでも大丈夫です。"
    >
      <div className="space-y-4">
        {categories.map((c, idx) => (
          <CategoryBlock key={c.id} categoryId={c.id} index={idx} total={categories.length} />
        ))}

        {uncategorized.length > 0 && (
          <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
            <p className="mb-2 px-1 text-sm font-medium text-ink-soft">
              {categories.length > 0 ? "カテゴリーなしの項目" : "項目"}
            </p>
            <div className="space-y-2">
              {uncategorized.map((i, k) => (
                <ItemRow key={i.id} item={i} index={k} total={uncategorized.length} />
              ))}
            </div>
            <AddItemButton categoryId={null} />
          </div>
        )}

        {categories.length === 0 && uncategorized.length === 0 && (
          <AddItemButton categoryId={null} />
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={addCategory}>
          ＋ カテゴリーを追加
        </Button>
      </div>
      <p className="text-xs text-stone-400">
        {menu.show_price ? "価格は公開ページに表示されます。" : "現在、価格は非表示に設定されています。"}
        「価格を表示する」は下の「価格の表示」で切り替えられます。
      </p>
      <PriceToggle />
    </Section>
  );
}

function PriceToggle() {
  const { menu, patchMenu } = useEditor();
  return (
    <label className="flex items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={menu.show_price}
        onChange={(e) => patchMenu({ show_price: e.target.checked })}
        className="h-4 w-4 rounded accent-ink"
      />
      価格を公開ページに表示する
    </label>
  );
}

function CategoryBlock({
  categoryId,
  index,
  total,
}: {
  categoryId: string;
  index: number;
  total: number;
}) {
  const { categories, items, patchCategory, removeCategory, moveCategory } = useEditor();
  const category = categories.find((c) => c.id === categoryId);
  const [confirming, setConfirming] = useState(false);
  if (!category) return null;

  const myItems = items
    .filter((i) => i.category_id === categoryId)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <Input
          defaultValue={category.name}
          onChange={(e) => patchCategory(categoryId, { name: e.target.value }, { debounce: true })}
          className="font-medium"
          placeholder="カテゴリー名"
        />
        <div className="flex shrink-0 items-center">
          <IconBtn label="上へ" disabled={index === 0} onClick={() => moveCategory(categoryId, -1)}>
            ↑
          </IconBtn>
          <IconBtn
            label="下へ"
            disabled={index === total - 1}
            onClick={() => moveCategory(categoryId, 1)}
          >
            ↓
          </IconBtn>
        </div>
      </div>

      <Input
        defaultValue={category.note ?? ""}
        onChange={(e) =>
          patchCategory(categoryId, { note: e.target.value || null }, { debounce: true })
        }
        className="mt-2 text-sm"
        placeholder="補足（例：11時〜14時限定）　なくてもOK"
      />

      <div className="mt-3 space-y-2">
        {myItems.map((i, k) => (
          <ItemRow key={i.id} item={i} index={k} total={myItems.length} />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <AddItemButton categoryId={categoryId} />
        {confirming ? (
          <span className="flex items-center gap-2 text-xs">
            <button className="text-red-600" onClick={() => removeCategory(categoryId)}>
              削除する
            </button>
            <button className="text-ink-soft" onClick={() => setConfirming(false)}>
              やめる
            </button>
          </span>
        ) : (
          <button
            className="text-xs text-stone-400 hover:text-red-600"
            onClick={() => setConfirming(true)}
          >
            カテゴリー削除
          </button>
        )}
      </div>
    </div>
  );
}

function AddItemButton({ categoryId }: { categoryId: string | null }) {
  const { addItem } = useEditor();
  return (
    <button
      type="button"
      onClick={() => addItem(categoryId)}
      className="mt-2 w-full rounded-lg border border-dashed border-stone-300 py-2 text-sm text-ink-soft hover:border-stone-400 hover:bg-stone-50"
    >
      ＋ 項目を追加
    </button>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft hover:bg-stone-100 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ItemRow({ item, index, total }: { item: MenuItem; index: number; total: number }) {
  const { menu, userId, patchItem, removeItem, moveItem } = useEditor();
  const [open, setOpen] = useState(false);
  const priceLabel = formatPrice(item.price, menu.currency, item.price_note);

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/50">
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone-200 text-xs text-stone-400">
            {item.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              "写真"
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">
              {item.name || "（名称未設定）"}
            </span>
            {(priceLabel || !item.is_available) && (
              <span className="block truncate text-xs text-stone-400">
                {!item.is_available && "非表示中 · "}
                {priceLabel}
              </span>
            )}
          </span>
          <span className="shrink-0 text-stone-400">{open ? "▲" : "▼"}</span>
        </button>
        <div className="flex shrink-0 items-center">
          <IconBtn label="上へ" disabled={index === 0} onClick={() => moveItem(item.id, -1)}>
            ↑
          </IconBtn>
          <IconBtn
            label="下へ"
            disabled={index === total - 1}
            onClick={() => moveItem(item.id, 1)}
          >
            ↓
          </IconBtn>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-stone-200 p-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">名前</span>
            <Input
              defaultValue={item.name}
              onChange={(e) => patchItem(item.id, { name: e.target.value }, { debounce: true })}
              placeholder="料理名・商品名"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-soft">価格（数字）</span>
              <Input
                type="number"
                inputMode="numeric"
                defaultValue={item.price ?? ""}
                onChange={(e) =>
                  patchItem(
                    item.id,
                    { price: e.target.value === "" ? null : Number(e.target.value) },
                    { debounce: true },
                  )
                }
                placeholder="800"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-soft">価格の補足</span>
              <Input
                defaultValue={item.price_note ?? ""}
                onChange={(e) =>
                  patchItem(item.id, { price_note: e.target.value || null }, { debounce: true })
                }
                placeholder="〜 / 税込 など"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">説明（なくてもOK）</span>
            <Textarea
              rows={2}
              defaultValue={item.description ?? ""}
              onChange={(e) =>
                patchItem(item.id, { description: e.target.value || null }, { debounce: true })
              }
              placeholder="ひとこと説明"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-soft">
              ラベル（「人気」「新着」など・なくてもOK）
            </span>
            <Input
              defaultValue={item.badge ?? ""}
              onChange={(e) =>
                patchItem(item.id, { badge: e.target.value || null }, { debounce: true })
              }
              placeholder="人気"
            />
          </label>

          <ImageUploader
            userId={userId}
            menuId={menu.id}
            value={item.image_url}
            onChange={(url) => patchItem(item.id, { image_url: url })}
            aspect="video"
            label="写真（なくてもきれいに表示されます）"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.is_available}
                onChange={(e) => patchItem(item.id, { is_available: e.target.checked })}
                className="h-4 w-4 rounded accent-ink"
              />
              公開ページに表示する
            </label>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-600 hover:underline"
            >
              項目を削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
