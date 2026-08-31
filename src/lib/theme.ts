import {
  DEFAULT_THEME,
  MenuTheme,
  ThemeCard,
  ThemeFont,
  ThemeHeading,
  ThemeImageFit,
  ThemeMood,
} from "./types";

export const ACCENT_PRESETS = [
  "#b45309", // テラコッタ
  "#9a3412", // 焦げ茶オレンジ
  "#166534", // 深緑
  "#0f766e", // ティール
  "#1d4ed8", // ブルー
  "#7c3aed", // パープル
  "#be123c", // ルビー
  "#db2777", // ピンク
  "#111827", // モノトーン
];

export const FONT_OPTIONS: { value: ThemeFont; label: string }[] = [
  { value: "sans", label: "ゴシック" },
  { value: "maru", label: "丸ゴシック" },
  { value: "mincho", label: "明朝" },
  { value: "mincho-old", label: "明朝（クラシック）" },
  { value: "serif", label: "セリフ明朝" },
  { value: "hand", label: "手書き風" },
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
  { value: "sand", label: "サンド" },
  { value: "mono", label: "モノクロ" },
  { value: "dark", label: "ダーク" },
  { value: "noir", label: "ノワール" },
];

export const IMAGE_FIT_OPTIONS: { value: ThemeImageFit; label: string; hint: string }[] = [
  { value: "contain", label: "全体を見せる", hint: "どんな写真も切れない" },
  { value: "cover", label: "切り取る", hint: "枠いっぱいで迫力" },
];

export const HEADING_OPTIONS: { value: ThemeHeading; label: string }[] = [
  { value: "underline", label: "下線つき" },
  { value: "plain", label: "シンプル" },
  { value: "serif", label: "中央・明朝風" },
];

export const CARD_OPTIONS: { value: ThemeCard; label: string }[] = [
  { value: "outline", label: "枠線" },
  { value: "shadow", label: "影（浮き上がる）" },
  { value: "flat", label: "フラット" },
];

/** ワンクリックで見た目を一括設定するスタイルプリセット */
export const STYLE_PRESETS: {
  id: string;
  label: string;
  hint: string;
  theme: Partial<MenuTheme>;
}[] = [
  {
    id: "standard",
    label: "スタンダード",
    hint: "清潔感・万能",
    theme: {
      accent: "#b45309",
      mood: "light",
      font: "sans",
      layout: "card",
      heading: "underline",
      card: "outline",
      radius: 16,
      airy: false,
      imageFit: "contain",
      bigHeadings: true,
    },
  },
  {
    id: "modern",
    label: "モダン",
    hint: "余白広め・シャープ",
    theme: {
      accent: "#111827",
      mood: "mono",
      font: "sans",
      layout: "magazine",
      heading: "plain",
      card: "flat",
      radius: 4,
      airy: true,
      imageFit: "cover",
      bigHeadings: true,
    },
  },
  {
    id: "classic",
    label: "クラシック",
    hint: "上品な明朝・レストラン",
    theme: {
      accent: "#7c2d12",
      mood: "warm",
      font: "mincho-old",
      layout: "list",
      heading: "serif",
      card: "flat",
      radius: 2,
      airy: true,
      imageFit: "contain",
      bigHeadings: false,
    },
  },
  {
    id: "natural",
    label: "ナチュラル",
    hint: "やわらかい・カフェ",
    theme: {
      accent: "#4d7c0f",
      mood: "sand",
      font: "maru",
      layout: "card",
      heading: "plain",
      card: "shadow",
      radius: 22,
      airy: false,
      imageFit: "contain",
      bigHeadings: true,
    },
  },
  {
    id: "chic",
    label: "シック",
    hint: "暗色・バー / ディナー",
    theme: {
      accent: "#b91c1c",
      mood: "noir",
      font: "serif",
      layout: "list",
      heading: "serif",
      card: "flat",
      radius: 4,
      airy: true,
      imageFit: "contain",
      bigHeadings: false,
    },
  },
  {
    id: "pop",
    label: "ポップ",
    hint: "明るい・元気",
    theme: {
      accent: "#db2777",
      mood: "light",
      font: "hand",
      layout: "card",
      heading: "underline",
      card: "shadow",
      radius: 20,
      airy: false,
      imageFit: "contain",
      bigHeadings: true,
    },
  },
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
  sand: {
    bg: "#f4efe4",
    surface: "#fffdf7",
    text: "#33291b",
    sub: "#8b7a5f",
    border: "#e5dac2",
    hairline: "#ece2cd",
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
  noir: {
    bg: "#14100e",
    surface: "#1e1a17",
    text: "#f3ede4",
    sub: "#a99f90",
    border: "#332c25",
    hairline: "#28221d",
  },
};

const FONT_STACK: Record<ThemeFont, string> = {
  sans: 'var(--font-sans), system-ui, "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
  maru: '"Zen Maru Gothic", "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif',
  mincho: '"Hiragino Mincho ProN", "Yu Mincho", YuMincho, "Zen Old Mincho", serif',
  "mincho-old": '"Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif',
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif',
  hand: '"Klee One", "Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif',
};

/** Google Fonts で読み込む必要があるフォントの family パラメータ（system フォントは null） */
export const FONT_GOOGLE: Partial<Record<ThemeFont, string>> = {
  maru: "Zen+Maru+Gothic:wght@500;700",
  "mincho-old": "Shippori+Mincho:wght@500;700;800",
  serif: "Noto+Serif+JP:wght@400;600;700",
  hand: "Klee+One:wght@400;600",
};

export function googleFontHref(font: ThemeFont): string | null {
  const fam = FONT_GOOGLE[font];
  return fam ? `https://fonts.googleapis.com/css2?family=${fam}&display=swap` : null;
}

export function resolveTheme(partial?: Partial<MenuTheme> | null): MenuTheme {
  return { ...DEFAULT_THEME, ...(partial ?? {}) };
}

/** テーマを CSS カスタムプロパティに変換（公開ページで使用） */
export function themeToCssVars(theme: MenuTheme): Record<string, string> {
  const t = MOOD_TOKENS[theme.mood] ?? MOOD_TOKENS.light;
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
    "--m-font": FONT_STACK[theme.font] ?? FONT_STACK.sans,
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
