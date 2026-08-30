import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 公開ページ用の Supabase クライアント。
 * ログインセッション（Cookie）を一切使わないため、
 * ISR で静的にキャッシュできる公開メニューページで使用する。
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
