export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

/** 公開URL用のランダムなスラッグ（例: 7k2m9x4p） */
export function randomSlug(length = 8): string {
  let out = "";
  const bytes =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(length))
      : Array.from({ length }, () => Math.floor(Math.random() * 256));
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  // ホスティング側が自動でセットする値をフォールバックに使う
  if (process.env.URL) return process.env.URL.replace(/\/$/, ""); // Netlify
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // Vercel
  return "http://localhost:3000";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
