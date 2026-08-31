import { ThemeFont } from "@/lib/types";
import { googleFontHref } from "@/lib/theme";

/**
 * テーマのフォントが Google Fonts のとき、その stylesheet を読み込む。
 * Next.js は rel="stylesheet" の <link> を <head> にまとめて重複排除する。
 * 公開ページと編集プレビューの両方で使う。
 */
export function FontLoader({ font }: { font: ThemeFont }) {
  const href = googleFontHref(font);
  if (!href) return null;
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* React 19 が <head> にまとめ、重複を除去する */}
      <link rel="stylesheet" href={href} precedence="menu-font" />
    </>
  );
}
