import { DEFAULT_THEME, MenuTheme, ThemeMood } from "./types";

export const ACCENT_PRESETS = [
  "#b45309", // テラコッタ
  "#9a3412", // 焦げ茶オレンジ
  "#166534", // 深緑
  "#0f766e", // ティール
  "#1d4ed8", // ブルー
  "#7c3aed", // パープル
  "#be123c", // ルビー
  "#111827", // モノトーン
];

export const FONT_OPTIONS: { value: MenuTheme["font"]; label: string }[] = [
  { value: "sans", label: "ゴシック（標準）" },
  { value: "mincho", label: "明朝（上品）" },
  { value: "maru", label: "丸ゴシック（やさしい）" },
];

export const LAYOUT_OPTIONS: { value: MenuTheme["layout"]; label: string; hint: string }[] = [
  { value: "card", label: "カード", hint: "写真を大きく見せる" },
  { value: "magazine", label: "マガジン", hint: "写真と文章を横並び" },
  { value: "list", label: "リスト", hint: "文字中心でたっぷり掲載" },
  { value: "compact", label: "コンパクト", hint: "一覧性を重視" },
];

export const MOOD_OPTIONS: { value: ThemeMood; label: string }[] = [
  { value: "light", label: "ライト" },
  { value: "warm", label: "ウォーム" },
  { value: "mono", label: "モノクロ" },
  { value: "dark", label: "ダーク" },
];

const MOOD_TOKENS: Record<
  ThemeMood,
  { bg: string; surface: string; text: string; sub: string; border: string; hairline: string }
> = {
  light: {
    bg: "#faf9f7",
    surface: "#ffffff",
    text: "#1c1917",
    sub: "#6b7280",
    border: "#ececec",
    hairline: "#f0eeea",
  },
  warm: {
    bg: "#f7f1e8",
    surface: "#fffdf9",
    text: "#3a2c1c",
    sub: "#8a7355",
    border: "#e9ddc9",
    hairline: "#efe6d5",
  },
  mono: {
    bg: "#f4f4f5",
    surface: "#ffffff",
    text: "#18181b",
    sub: "#71717a",
    border: "#e4e4e7",
    hairline: "#eeeeef",
  },
  dark: {
    bg: "#141312",
    surface: "#1f1d1b",
    text: "#f5f3f0",
    sub: "#a8a29e",
    border: "#332f2c",
    hairline: "#2a2724",
  },
};

const FONT_STACK: Record<MenuTheme["font"], string> = {
  sans: 'var(--font-sans), system-ui, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
  mincho: '"Hiragino Mincho ProN", "Yu Mincho", YuMincho, "Noto Serif JP", serif',
  maru: '"Hiragino Maru Gothic ProN", "Zen Maru Gothic", "Yu Gothic", sans-serif',
};

export function resolveTheme(partial?: Partial<MenuTheme> | null): MenuTheme {
  return { ...DEFAULT_THEME, ...(partial ?? {}) };
}

/** テーマを CSS カスタムプロパティに変換（公開ページで使用） */
export function themeToCssVars(theme: MenuTheme): Record<string, string> {
  const t = MOOD_TOKENS[theme.mood];
  return {
    "--m-accent": theme.accent,
    "--m-accent-contrast": pickContrast(theme.accent),
    "--m-bg": t.bg,
    "--m-surface": t.surface,
    "--m-text": t.text,
    "--m-sub": t.sub,
    "--m-border": t.border,
    "--m-hairline": t.hairline,
    "--m-radius": `${theme.radius}px`,
    "--m-font": FONT_STACK[theme.font],
  };
}

function pickContrast(hex: string): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return "#ffffff";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#1c1917" : "#ffffff";
}

/** 価格表示のフォーマット */
export function formatPrice(
  price: number | null,
  currency: string,
  note?: string | null,
): string | null {
  if (price == null && !note) return null;
  if (price == null) return note ?? null;
  const formatted =
    currency === "JPY"
      ? `¥${Math.round(price).toLocaleString("ja-JP")}`
      : `${price.toLocaleString("ja-JP")} ${currency}`;
  return note ? `${formatted} ${note}` : formatted;
}
