import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Editor } from "@/components/editor/Editor";
import { siteUrl } from "@/lib/utils";
import { Category, Menu, MenuItem } from "@/lib/types";

export const metadata = { title: "メニューを編集" };

export default async function EditorPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: menu } = await supabase.from("menus").select("*").eq("id", menuId).maybeSingle();
  if (!menu) notFound();
  if ((menu as Menu).owner_id !== user.id) redirect("/dashboard");

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("categories").select("*").eq("menu_id", menuId).order("position"),
    supabase.from("menu_items").select("*").eq("menu_id", menuId).order("position"),
  ]);

  return (
    <Editor
      userId={user.id}
      initialMenu={menu as Menu}
      initialCategories={(categories ?? []) as Category[]}
      initialItems={(items ?? []) as MenuItem[]}
      siteUrl={siteUrl()}
    />
  );
}
