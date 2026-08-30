"use client";

import { createContext, useContext, useCallback, useMemo, useState, useTransition } from "react";
import { Category, Menu, MenuItem, MenuTheme } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { useDebouncedCallback } from "@/lib/use-debounced";
import * as actions from "@/app/dashboard/actions";

type SaveState = "idle" | "saving" | "saved" | "error";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `local-${Math.random().toString(36).slice(2)}`;
}

interface EditorCtx {
  userId: string;
  demo: boolean;
  menu: Menu;
  categories: Category[];
  items: MenuItem[];
  theme: MenuTheme;
  saveState: SaveState;

  patchMenu: (patch: Partial<Menu>, opts?: { debounce?: boolean }) => void;
  patchTheme: (patch: Partial<MenuTheme>) => void;

  addCategory: () => void;
  patchCategory: (id: string, patch: Partial<Category>, opts?: { debounce?: boolean }) => void;
  removeCategory: (id: string) => void;
  moveCategory: (id: string, dir: -1 | 1) => void;

  addItem: (categoryId: string | null) => void;
  patchItem: (id: string, patch: Partial<MenuItem>, opts?: { debounce?: boolean }) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, dir: -1 | 1) => void;
}

const Ctx = createContext<EditorCtx | null>(null);

export function useEditor() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useEditor must be used within EditorProvider");
  return v;
}

export function EditorProvider({
  userId,
  demo = false,
  initialMenu,
  initialCategories,
  initialItems,
  children,
}: {
  userId: string;
  demo?: boolean;
  initialMenu: Menu;
  initialCategories: Category[];
  initialItems: MenuItem[];
  children: React.ReactNode;
}) {
  const [menu, setMenu] = useState(initialMenu);
  const [categories, setCategories] = useState(
    [...initialCategories].sort((a, b) => a.position - b.position),
  );
  const [items, setItems] = useState([...initialItems].sort((a, b) => a.position - b.position));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [, startTransition] = useTransition();

  const theme = useMemo(() => resolveTheme(menu.theme), [menu.theme]);

  // 本番: サーバーアクションを実行。お試しモード: 保存表示だけ出して実行しない。
  const run = useCallback(
    (task: () => Promise<unknown>) => {
      setSaveState("saving");
      if (demo) {
        setTimeout(() => setSaveState("saved"), 200);
        setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 1600);
        return;
      }
      startTransition(async () => {
        try {
          await task();
          setSaveState("saved");
          setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 1500);
        } catch (e) {
          console.error(e);
          setSaveState("error");
        }
      });
    },
    [demo],
  );

  /* ---- menu ---- */
  const saveMenuNow = useCallback(
    (patch: Partial<Menu>) => run(() => actions.updateMenu(menu.id, patch as never)),
    [menu.id, run],
  );
  const saveMenuDebounced = useDebouncedCallback(saveMenuNow, 700);

  const patchMenu = useCallback(
    (patch: Partial<Menu>, opts?: { debounce?: boolean }) => {
      setMenu((m) => ({ ...m, ...patch }));
      if (opts?.debounce) {
        setSaveState("saving");
        saveMenuDebounced(patch);
      } else {
        saveMenuNow(patch);
      }
    },
    [saveMenuDebounced, saveMenuNow],
  );

  const patchTheme = useCallback(
    (patch: Partial<MenuTheme>) => {
      const next = { ...theme, ...patch };
      setMenu((m) => ({ ...m, theme: next }));
      run(() => actions.updateMenu(menu.id, { theme: next }));
    },
    [theme, menu.id, run],
  );

  /* ---- categories ---- */
  const addCategory = useCallback(() => {
    if (demo) {
      setCategories((cs) => [
        ...cs,
        {
          id: uid(),
          menu_id: menu.id,
          name: "新しいカテゴリー",
          note: null,
          position: cs.length,
          created_at: new Date().toISOString(),
        },
      ]);
      run(async () => {});
      return;
    }
    run(async () => {
      const created = await actions.addCategory(menu.id);
      setCategories((c) => [...c, created]);
    });
  }, [demo, menu.id, run]);

  const saveCatNow = useCallback(
    (id: string, patch: Partial<Category>) =>
      run(() => actions.updateCategory(id, menu.id, patch as never)),
    [menu.id, run],
  );
  const saveCatDebounced = useDebouncedCallback(
    (id: string, patch: Partial<Category>) => saveCatNow(id, patch),
    700,
  );

  const patchCategory = useCallback(
    (id: string, patch: Partial<Category>, opts?: { debounce?: boolean }) => {
      setCategories((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
      if (opts?.debounce) {
        setSaveState("saving");
        saveCatDebounced(id, patch);
      } else {
        saveCatNow(id, patch);
      }
    },
    [saveCatDebounced, saveCatNow],
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCategories((cs) => cs.filter((c) => c.id !== id));
      setItems((is) => is.map((i) => (i.category_id === id ? { ...i, category_id: null } : i)));
      run(() => actions.deleteCategory(id, menu.id));
    },
    [menu.id, run],
  );

  const moveCategory = useCallback(
    (id: string, dir: -1 | 1) => {
      const idx = categories.findIndex((c) => c.id === id);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= categories.length) return;
      const next = [...categories];
      [next[idx], next[j]] = [next[j], next[idx]];
      const ordered = next.map((c, i) => ({ ...c, position: i }));
      setCategories(ordered);
      run(() => actions.reorderCategories(menu.id, ordered.map((c) => c.id)));
    },
    [categories, menu.id, run],
  );

  /* ---- items ---- */
  const addItem = useCallback(
    (categoryId: string | null) => {
      if (demo) {
        setItems((is) => [
          ...is,
          {
            id: uid(),
            menu_id: menu.id,
            category_id: categoryId,
            name: "新しい項目",
            description: null,
            price: null,
            price_note: null,
            image_url: null,
            badge: null,
            is_available: true,
            position: is.filter((i) => i.category_id === categoryId).length,
            created_at: new Date().toISOString(),
          },
        ]);
        run(async () => {});
        return;
      }
      run(async () => {
        const created = await actions.addItem(menu.id, categoryId);
        setItems((is) => [...is, created]);
      });
    },
    [demo, menu.id, run],
  );

  const saveItemNow = useCallback(
    (id: string, patch: Partial<MenuItem>) =>
      run(() => actions.updateItem(id, menu.id, patch as never)),
    [menu.id, run],
  );
  const saveItemDebounced = useDebouncedCallback(
    (id: string, patch: Partial<MenuItem>) => saveItemNow(id, patch),
    700,
  );

  const patchItem = useCallback(
    (id: string, patch: Partial<MenuItem>, opts?: { debounce?: boolean }) => {
      setItems((is) => is.map((i) => (i.id === id ? { ...i, ...patch } : i)));
      if (opts?.debounce) {
        setSaveState("saving");
        saveItemDebounced(id, patch);
      } else {
        saveItemNow(id, patch);
      }
    },
    [saveItemDebounced, saveItemNow],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((is) => is.filter((i) => i.id !== id));
      run(() => actions.deleteItem(id, menu.id));
    },
    [menu.id, run],
  );

  const moveItem = useCallback(
    (id: string, dir: -1 | 1) => {
      const target = items.find((i) => i.id === id);
      if (!target) return;
      const siblings = items
        .filter((i) => i.category_id === target.category_id)
        .sort((a, b) => a.position - b.position);
      const idx = siblings.findIndex((i) => i.id === id);
      const j = idx + dir;
      if (j < 0 || j >= siblings.length) return;
      [siblings[idx], siblings[j]] = [siblings[j], siblings[idx]];
      const orderedSiblings = siblings.map((i, k) => ({ ...i, position: k }));
      const byId = new Map(orderedSiblings.map((i) => [i.id, i]));
      setItems(items.map((i) => byId.get(i.id) ?? i));
      run(() => actions.reorderItems(menu.id, orderedSiblings.map((s) => s.id)));
    },
    [items, menu.id, run],
  );

  const value: EditorCtx = {
    userId,
    demo,
    menu,
    categories,
    items,
    theme,
    saveState,
    patchMenu,
    patchTheme,
    addCategory,
    patchCategory,
    removeCategory,
    moveCategory,
    addItem,
    patchItem,
    removeItem,
    moveItem,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
