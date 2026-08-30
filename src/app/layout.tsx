import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Menuki（メニュキ）｜お店のメニュー表をかんたん作成",
    template: "%s ｜ Menuki",
  },
  description:
    "写真・メニュー名・説明を入れるだけ。テンプレートを選んでアレンジすれば、HTMLの知識がなくてもおしゃれなメニュー表サイトが作れます。公開URLをお店のサイトに貼るだけ。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf9f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
