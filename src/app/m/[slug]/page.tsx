import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuView } from "@/components/menu-view/MenuView";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { resolveTheme, themeToCssVars } from "@/lib/theme";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { FullMenu, Category, MenuItem } from "@/lib/types";

export const revalidate = 30;

function buildDemo(): FullMenu {
  const tpl = getTemplate("cafe");
  const now = new Date().toISOString();
  const categories: Category[] = [];
  const items: MenuItem[] = [];
  tpl.categories.forEach((c, ci) => {
    const cid = `demo-cat-${ci}`;
    categories.push({
      id: cid,
      menu_id: "demo",
      name: c.name,
      note: c.note ?? null,
      position: ci,
      created_at: now,
    });
    c.items.forEach((it, ii) => {
      items.push({
        id: `demo-item-${ci}-${ii}`,
        menu_id: "demo",
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
      id: "demo",
      owner_id: "demo",
      slug: "demo",
      title: tpl.title,
      tagline: tpl.tagline || null,
      description:
        "これはサンプル表示です。実際にはお店ごとに写真・文章・色を自由に設定できます。",
      cover_url: null,
      logo_url: null,
      template: tpl.id,
      theme: tpl.theme,
      currency: "JPY",
      show_price: true,
      is_published: true,
      created_at: now,
      updated_at: now,
    },
    categories,
    items,
  };
}

async function loadMenu(slug: string): Promise<FullMenu | null> {
  if (slug === "demo") return buildDemo();
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  const { data: menu } = await supabase
    .from("menus")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!menu) return null;

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").eq("menu_id", menu.id),
    supabase.from("menu_items").select("*").eq("menu_id", menu.id),
  ]);

  return {
    menu,
    categories: (categories ?? []) as Category[],
    items: (items ?? []) as MenuItem[],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadMenu(slug);
  if (!data) return { title: "メニューが見つかりません" };
  return {
    title: data.menu.title,
    description: data.menu.tagline ?? data.menu.description ?? undefined,
    openGraph: {
      title: data.menu.title,
      description: data.menu.tagline ?? undefined,
      images: data.menu.cover_url ? [data.menu.cover_url] : undefined,
    },
    robots: slug === "demo" ? { index: false } : undefined,
  };
}

export function generateStaticParams() {
  return TEMPLATES.length ? [{ slug: "demo" }] : [];
}

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadMenu(slug);
  if (!data) notFound();

  const theme = resolveTheme(data.menu.theme);

  return (
    <div
      className="min-h-screen bg-[var(--m-bg)]"
      style={themeToCssVars(theme) as React.CSSProperties}
    >
      <MenuView data={data} theme={theme} />
    </div>
  );
}
