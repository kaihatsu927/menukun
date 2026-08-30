"use client";

/**
 * アップロード前に画像を縮小・再圧縮する（ブラウザ内で完結）。
 * メニュー写真は幅 1400px / JPEG 品質 0.8 で十分きれいに見え、
 * ファイルサイズは元の 1/10〜1/20 になる（ストレージ節約）。
 */

const MAX_DIMENSION = 1400;
const QUALITY = 0.8;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // EXIF の回転情報を反映して読み込む
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    /* オプション未対応ブラウザ */
  }
  try {
    return await createImageBitmap(file);
  } catch {
    /* createImageBitmap 自体が使えない */
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

export async function compressImage(file: File): Promise<File> {
  // GIF はアニメーションを壊さないためそのまま
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;

  try {
    const source = await loadBitmap(file);
    const srcW = "width" in source ? source.width : (source as HTMLImageElement).naturalWidth;
    const srcH = "height" in source ? source.height : (source as HTMLImageElement).naturalHeight;
    if (!srcW || !srcH) return file;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
    const w = Math.round(srcW * scale);
    const h = Math.round(srcH * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(source as CanvasImageSource, 0, 0, w, h);
    if ("close" in source) source.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob || blob.size >= file.size) return file; // 小さくならなければ元を使う

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file; // 失敗時は元ファイルをそのまま
  }
}
