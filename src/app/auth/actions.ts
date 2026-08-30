"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

function readCreds(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCreds(formData);
  const next = String(formData.get("next") ?? "/dashboard") || "/dashboard";

  if (!email || !password) return { error: "メールアドレスとパスワードを入力してください。" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "ログインできませんでした。メールアドレスとパスワードをご確認ください。" };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCreds(formData);
  const shopName = String(formData.get("shopName") ?? "").trim();

  if (!email || !password) return { error: "メールアドレスとパスワードを入力してください。" };
  if (password.length < 6) return { error: "パスワードは6文字以上にしてください。" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { shop_name: shopName } },
  });

  if (error) {
    return { error: "登録できませんでした。すでに登録済みのメールアドレスの可能性があります。" };
  }

  // メール確認が不要な設定なら、そのままセッションが発行される
  if (data.session) {
    if (shopName) {
      await supabase.from("profiles").update({ shop_name: shopName }).eq("id", data.user!.id);
    }
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    message:
      "確認メールを送信しました。メール内のリンクを開くと登録が完了し、ログインできるようになります。",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
