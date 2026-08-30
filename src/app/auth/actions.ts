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

/** 登録せずにすぐ使い始める（匿名ユーザーを作成） */
export async function startAnonymous(formData?: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const next = String(formData?.get("next") ?? "/dashboard/new") || "/dashboard/new";

  // すでにログイン済み（匿名含む）ならそのまま進む
  if (!user) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.error("[startAnonymous]", error.status, error.code, error.message);
      redirect("/signup?anon=unavailable");
    }
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard/new");
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
  const {
    data: { user: current },
  } = await supabase.auth.getUser();

  // すでに匿名で使っている場合は「昇格」（メニューを引き継いだままアカウント化）
  if (current?.is_anonymous) {
    const { error } = await supabase.auth.updateUser({ email, password });
    if (error) {
      console.error("[convert]", error.status, error.code, error.message);
      if (error.code === "email_exists" || error.status === 422) {
        return {
          error:
            "このメールアドレスは既に使われています。別のアドレスをお使いいただくか、一度ログインしてください。",
        };
      }
      return { error: "アカウント登録に失敗しました。メールアドレスをご確認ください。" };
    }
    await supabase
      .from("profiles")
      .update({ email, shop_name: shopName || null })
      .eq("id", current.id);

    revalidatePath("/", "layout");
    redirect("/dashboard?welcome=1");
  }

  // 通常の新規登録
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { shop_name: shopName } },
  });

  if (error) {
    console.error("[signUp]", error.status, error.code, error.message);
    return { error: "登録できませんでした。すでに登録済みのメールアドレスの可能性があります。" };
  }

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
