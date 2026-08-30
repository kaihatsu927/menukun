"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";
import { useEditor } from "./context";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  menuId: string;
  value: string | null;
  onChange: (url: string | null) => void;
  aspect?: "video" | "square" | "wide";
  label?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_MB = 15;

export function ImageUploader({
  userId,
  menuId,
  value,
  onChange,
  aspect = "video",
  label = "画像",
}: Props) {
  const { demo } = useEditor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ratio =
    aspect === "square"
      ? "aspect-square max-w-[220px]"
      : aspect === "wide"
        ? "aspect-[16/7] max-w-[520px]"
        : "aspect-[4/3] max-w-[360px]";

  async function handleFile(file: File) {
    setError(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("JPEG / PNG / WebP / GIF を選んでください。");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`ファイルサイズは ${MAX_MB}MB までです。`);
      return;
    }
    setBusy(true);
    try {
      // 縮小・再圧縮（ストレージ節約。失敗しても元ファイルで続行）
      const image = await compressImage(file);

      // お試しモード: アップロードせずブラウザ内でプレビュー表示のみ
      if (demo) {
        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(image);
        });
        onChange(dataUrl);
        return;
      }
      const supabase = createClient();
      const ext =
        image.type === "image/jpeg"
          ? "jpg"
          : image.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${menuId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("menu-images")
        .upload(path, image, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.type,
        });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      console.error(e);
      setError("アップロードに失敗しました。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-stone-300 bg-stone-50",
          ratio,
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-sm text-stone-400 hover:bg-stone-100"
          >
            <span className="text-2xl">＋</span>
            <span>画像を追加</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm">
            アップロード中…
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-ink underline underline-offset-2 hover:text-ink-soft"
          disabled={busy}
        >
          {value ? "画像を変更" : "ファイルを選ぶ"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-red-600 hover:underline"
            disabled={busy}
          >
            削除
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
