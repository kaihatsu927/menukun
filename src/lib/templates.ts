import { Category, FullMenu, MenuItem, MenuTheme } from "./types";

export interface TemplateItem {
  name: string;
  description?: string;
  price?: number;
  price_note?: string;
  badge?: string;
}

export interface TemplateCategory {
  name: string;
  note?: string;
  items: TemplateItem[];
}

export interface MenuTemplate {
  id: string;
  label: string;
  industry: string;
  summary: string;
  theme: MenuTheme;
  title: string;
  tagline: string;
  description?: string;
  show_price: boolean;
  categories: TemplateCategory[];
}

export const TEMPLATES: MenuTemplate[] = [
  {
    id: "restaurant",
    label: "レストラン / 定食",
    industry: "飲食",
    summary: "前菜からメインまで、写真を大きく見せる王道スタイル。",
    title: "お品書き",
    tagline: "旬の食材でつくる一皿",
    theme: { accent: "#b45309", mood: "warm", font: "mincho", layout: "card", radius: 14, bigHeadings: true },
    show_price: true,
    categories: [
      {
        name: "前菜",
        items: [
          { name: "本日の前菜盛り合わせ", description: "季節の野菜と魚介を少しずつ", price: 1200 },
          { name: "自家製パン", description: "バターとオリーブオイルを添えて", price: 400 },
        ],
      },
      {
        name: "メイン",
        items: [
          { name: "黒毛和牛のグリル", description: "赤ワインソース、季節の付け合わせ", price: 2800, badge: "人気" },
          { name: "鮮魚のポワレ", description: "その日仕入れた魚を香ばしく", price: 2200 },
        ],
      },
      {
        name: "デザート",
        items: [{ name: "季節のデザート", price: 700 }],
      },
    ],
  },
  {
    id: "cafe",
    label: "カフェ / ベーカリー",
    industry: "飲食",
    summary: "ドリンクとスイーツを軽やかに。やさしい印象のデザイン。",
    title: "MENU",
    tagline: "ゆっくり過ごすひととき",
    theme: { accent: "#0f766e", mood: "light", font: "maru", layout: "magazine", radius: 20, bigHeadings: true },
    show_price: true,
    categories: [
      {
        name: "コーヒー",
        items: [
          { name: "ドリップコーヒー", description: "その日のおすすめ豆で", price: 480 },
          { name: "カフェラテ", price: 520, badge: "定番" },
        ],
      },
      {
        name: "ティー",
        items: [{ name: "本日の紅茶", price: 500 }],
      },
      {
        name: "スイーツ",
        items: [
          { name: "自家製チーズケーキ", description: "濃厚だけど後味すっきり", price: 550 },
          { name: "焼き菓子の盛り合わせ", price: 480 },
        ],
      },
    ],
  },
  {
    id: "izakaya",
    label: "居酒屋 / バー",
    industry: "飲食",
    summary: "品数が多くても見やすい、コンパクトな一覧レイアウト。",
    title: "お品書き",
    tagline: "とりあえず、乾杯。",
    theme: { accent: "#be123c", mood: "dark", font: "sans", layout: "compact", radius: 10, bigHeadings: false },
    show_price: true,
    categories: [
      {
        name: "ドリンク",
        items: [
          { name: "生ビール", price: 550 },
          { name: "ハイボール", price: 450 },
          { name: "日本酒（一合）", price: 600, price_note: "〜" },
        ],
      },
      {
        name: "一品料理",
        items: [
          { name: "枝豆", price: 350 },
          { name: "だし巻き玉子", price: 480 },
          { name: "唐揚げ", price: 580, badge: "名物" },
        ],
      },
      {
        name: "〆",
        items: [{ name: "おにぎり", price: 250 }],
      },
    ],
  },
  {
    id: "retail",
    label: "物販 / セレクトショップ",
    industry: "商品",
    summary: "商品カタログとして。価格は任意で隠せます。",
    title: "商品ラインナップ",
    tagline: "毎日を少し豊かにする道具",
    theme: { accent: "#111827", mood: "mono", font: "sans", layout: "card", radius: 8, bigHeadings: true },
    show_price: true,
    categories: [
      {
        name: "キッチン",
        items: [
          { name: "真鍮のカトラリー", description: "使うほどに味が出る", price: 1800 },
          { name: "木のカッティングボード", price: 3200 },
        ],
      },
      {
        name: "ファブリック",
        items: [
          { name: "リネンのふきん", price: 900 },
          { name: "刺し子のコースター", price: 700, badge: "新着" },
        ],
      },
    ],
  },
  {
    id: "salon",
    label: "サロン / 美容 / 施術",
    industry: "サービス",
    summary: "メニューと所要時間・料金を並べるサービス業向け。",
    title: "メニュー & 料金",
    tagline: "あなたに合わせたケアを",
    theme: { accent: "#7c3aed", mood: "light", font: "mincho", layout: "list", radius: 18, bigHeadings: true },
    show_price: true,
    categories: [
      {
        name: "カット",
        items: [
          { name: "カット", description: "シャンプー・ブロー込み（約60分）", price: 4500 },
          { name: "前髪カット", description: "約15分", price: 800 },
        ],
      },
      {
        name: "カラー",
        items: [
          { name: "フルカラー", description: "約90分", price: 6500 },
          { name: "リタッチ", description: "約60分", price: 4800 },
        ],
      },
      {
        name: "トリートメント",
        items: [{ name: "集中トリートメント", description: "約20分", price: 2000, badge: "おすすめ" }],
      },
    ],
  },
  {
    id: "blank",
    label: "白紙から作る",
    industry: "汎用",
    summary: "カテゴリーも項目もゼロ。自由に組み立てたい方へ。",
    title: "メニュー",
    tagline: "",
    theme: { accent: "#b45309", mood: "light", font: "sans", layout: "card", radius: 16, bigHeadings: true },
    show_price: true,
    categories: [],
  },
];

export function getTemplate(id: string): MenuTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

/** テンプレートから、その場で編集できる完全なメニューデータを生成（お試しモード用） */
export function buildFullMenuFromTemplate(id: string, opts?: { slug?: string }): FullMenu {
  const tpl = getTemplate(id);
  const now = new Date().toISOString();
  const menuId = "demo-menu";
  const categories: Category[] = [];
  const items: MenuItem[] = [];

  tpl.categories.forEach((c, ci) => {
    const cid = `demo-cat-${ci}`;
    categories.push({
      id: cid,
      menu_id: menuId,
      name: c.name,
      note: c.note ?? null,
      position: ci,
      created_at: now,
    });
    c.items.forEach((it, ii) => {
      items.push({
        id: `demo-item-${ci}-${ii}`,
        menu_id: menuId,
        category_id: cid,
        name: it.name,
        description: it.description ?? null,
        price: it.price ?? null,
        price_note: it.price_note ?? null,
        image_url: null,
        badge: it.badge ?? null,
        is_available: true,
        position: ii,
        created_at: now,
      });
    });
  });

  return {
    menu: {
      id: menuId,
      owner_id: "demo",
      slug: opts?.slug ?? "demo-preview",
      title: tpl.title,
      tagline: tpl.tagline || null,
      description: null,
      cover_url: null,
      logo_url: null,
      template: tpl.id,
      theme: tpl.theme,
      currency: "JPY",
      show_price: tpl.show_price,
      is_published: false,
      created_at: now,
      updated_at: now,
    },
    categories,
    items,
  };
}
