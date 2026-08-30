"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import { randomSlug } from "@/lib/utils";
import { Category, MenuItem, MenuTheme } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function assertOwnsMenu(menuId: string) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("menus").select("id, slug, owner_id").eq("id", menuId).single();
  if (!data || data.owner_id !== user.id) redirect("/dashboard");
  return { supabase, user, menu: data };
}

function refresh(slug?: string) {
  revalidatePath("/dashboard");
  if (slug) revalidatePath(`/m/${slug}`);
}

/* ============ メニュー ============ */

export async function createMenu(formData: FormData) {
  const { supabase, user } = await requireUser();
  const templateId = String(formData.get("templateId") ?? "restaurant");
  const tpl = getTemplate(templateId);

  let slug = randomSlug();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: clash } = await supabase.from("menus").select("id").eq("slug", slug).maybeSingle();
    if (!clash) break;
    slug = randomSlug();
  }

  const { data: menu, error } = await supabase
    .from("menus")
    .insert({
      owner_id: user.id,
      slug,
      title: tpl.title,
      tagline: tpl.tagline || null,
      template: tpl.id,
      theme: tpl.theme,
      show_price: tpl.show_price,
    })
    .select()
    .single();

  if (error || !menu) throw new Error("メニューを作成できませんでした");

  for (let ci = 0; ci < tpl.categories.length; ci++) {
    const c = tpl.categories[ci];
    const { data: cat } = await supabase
      .from("categories")
      .insert({ menu_id: menu.id, name: c.name, note: c.note ?? null, position: ci })
      .select()
      .single();

    if (cat && c.items.length) {
      await supabase.from("menu_items").insert(
        c.items.map((it, ii) => ({
          menu_id: menu.id,
          category_id: cat.id,
          name: it.name,
          description: it.description ?? null,
          price: it.price ?? null,
          price_note: it.price_note ?? null,
          badge: it.badge ?? null,
          position: ii,
        })),
      );
    }
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/${menu.id}`);
}

export async function updateMenu(
  menuId: string,
  patch: Partial<{
    title: string;
    tagline: string | null;
    description: string | null;
    cover_url: string | null;
    logo_url: string | null;
    currency: string;
    show_price: boolean;
    theme: Partial<MenuTheme>;
  }>,
) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const { error } = await supabase.from("menus").update(patch).eq("id", menuId);
  if (error) throw new Error(error.message);
  refresh(menu.slug);
}

export async function setPublished(menuId: string, publish: boolean) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const { error } = await supabase
    .from("menus")
    .update({ is_published: publish })
    .eq("id", menuId);
  if (error) throw new Error(error.message);
  refresh(menu.slug);
}

export async function regenerateSlug(menuId: string) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  let slug = randomSlug();
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: clash } = await supabase.from("menus").select("id").eq("slug", slug).maybeSingle();
    if (!clash) break;
    slug = randomSlug();
  }
  const { error } = await supabase.from("menus").update({ slug }).eq("id", menuId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath(`/m/${menu.slug}`);
  return slug;
}

export async function deleteMenu(menuId: string) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  await supabase.from("menus").delete().eq("id", menuId);
  revalidatePath("/dashboard");
  revalidatePath(`/m/${menu.slug}`);
  redirect("/dashboard");
}

/* ============ カテゴリー ============ */

export async function addCategory(menuId: string) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const { data: max } = await supabase
    .from("categories")
    .select("position")
    .eq("menu_id", menuId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("categories")
    .insert({ menu_id: menuId, name: "新しいカテゴリー", position: (max?.position ?? -1) + 1 })
    .select()
    .single();
  if (error) throw new Error(error.message);
  refresh(menu.slug);
  return data as Category;
}

export async function updateCategory(
  categoryId: string,
  menuId: string,
  patch: Partial<{ name: string; note: string | null }>,
) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const { error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", categoryId)
    .eq("menu_id", menuId);
  if (error) throw new Error(error.message);
  refresh(menu.slug);
}

export async function deleteCategory(categoryId: string, menuId: string) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  await supabase.from("categories").delete().eq("id", categoryId).eq("menu_id", menuId);
  refresh(menu.slug);
}

export async function reorderCategories(menuId: string, orderedIds: string[]) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  await Promise.all(
    orderedIds.map((id, idx) =>
      supabase.from("categories").update({ position: idx }).eq("id", id).eq("menu_id", menuId),
    ),
  );
  refresh(menu.slug);
}

/* ============ 項目 ============ */

export async function addItem(menuId: string, categoryId: string | null) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const query = supabase.from("menu_items").select("position").eq("menu_id", menuId);
  const { data: max } = await (categoryId
    ? query.eq("category_id", categoryId)
    : query.is("category_id", null)
  )
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      menu_id: menuId,
      category_id: categoryId,
      name: "新しい項目",
      position: (max?.position ?? -1) + 1,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  refresh(menu.slug);
  return data as MenuItem;
}

export async function updateItem(
  itemId: string,
  menuId: string,
  patch: Partial<{
    name: string;
    description: string | null;
    price: number | null;
    price_note: string | null;
    image_url: string | null;
    badge: string | null;
    is_available: boolean;
    category_id: string | null;
  }>,
) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  const { error } = await supabase
    .from("menu_items")
    .update(patch)
    .eq("id", itemId)
    .eq("menu_id", menuId);
  if (error) throw new Error(error.message);
  refresh(menu.slug);
}

export async function deleteItem(itemId: string, menuId: string) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  await supabase.from("menu_items").delete().eq("id", itemId).eq("menu_id", menuId);
  refresh(menu.slug);
}

export async function reorderItems(menuId: string, orderedIds: string[]) {
  const { supabase, menu } = await assertOwnsMenu(menuId);
  await Promise.all(
    orderedIds.map((id, idx) =>
      supabase.from("menu_items").update({ position: idx }).eq("id", id).eq("menu_id", menuId),
    ),
  );
  refresh(menu.slug);
}
