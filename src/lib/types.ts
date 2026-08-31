export type ThemeLayout = "card" | "list" | "compact" | "magazine";
export type ThemeFont = "sans" | "mincho" | "maru" | "serif" | "mincho-old" | "hand";
export type ThemeMood = "light" | "warm" | "dark" | "mono" | "sand" | "noir";
export type ThemeImageFit = "contain" | "cover";
export type ThemeHeading = "plain" | "underline" | "serif";
export type ThemeCard = "outline" | "shadow" | "flat";

export interface MenuTheme {
  /** アクセントカラー（ボタンや見出しの色） */
  accent: string;
  /** 背景の雰囲気 */
  mood: ThemeMood;
  /** フォント */
  font: ThemeFont;
  /** 項目の並べ方 */
  layout: ThemeLayout;
  /** 角丸の強さ 0–24(px) */
  radius: number;
  /** カテゴリー見出しを大きく見せる */
  bigHeadings: boolean;
  /** 写真の見せ方：contain=全体を見せる / cover=切り取って迫力重視 */
  imageFit: ThemeImageFit;
  /** カテゴリー見出しの飾り */
  heading: ThemeHeading;
  /** カードの質感 */
  card: ThemeCard;
  /** 余白を広めにとる */
  airy: boolean;
}

export const DEFAULT_THEME: MenuTheme = {
  accent: "#b45309",
  mood: "light",
  font: "sans",
  layout: "card",
  radius: 16,
  bigHeadings: true,
  imageFit: "contain",
  heading: "underline",
  card: "outline",
  airy: false,
};

export interface Profile {
  id: string;
  email: string | null;
  shop_name: string | null;
  created_at: string;
}

export interface Menu {
  id: string;
  owner_id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  cover_url: string | null;
  logo_url: string | null;
  template: string;
  theme: Partial<MenuTheme> | null;
  currency: string;
  show_price: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  menu_id: string;
  name: string;
  note: string | null;
  position: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  image_url: string | null;
  badge: string | null;
  is_available: boolean;
  position: number;
  created_at: string;
}

export interface FullMenu {
  menu: Menu;
  categories: Category[];
  items: MenuItem[];
}
