"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { signIn, signUp, type AuthState } from "@/app/auth/actions";
import { Button, Field, Input } from "@/components/ui";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "送信中…" : label}
    </Button>
  );
}

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthState, FormData>(action, null);
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input type="hidden" name="next" value={next} />

      {mode === "signup" && (
        <Field label="お店の名前" hint="あとから変更できます">
          <Input name="shopName" placeholder="〇〇食堂" autoComplete="organization" />
        </Field>
      )}

      <Field label="メールアドレス">
        <Input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </Field>

      <Field label="パスワード" hint={mode === "signup" ? "6文字以上" : undefined}>
        <Input
          name="password"
          type="password"
          required
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="••••••••"
        />
      </Field>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      {state?.message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.message}
        </p>
      )}

      <SubmitButton label={mode === "signin" ? "ログイン" : "登録する"} />
    </form>
  );
}
