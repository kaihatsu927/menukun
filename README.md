# Menuki（メニュキ）

お店が **かんたんにメニュー表サイトを作れる** Web アプリです。
HTML の知識がなくても、テンプレートを選んで写真・名前・説明・価格を入れるだけ。
できあがったメニューは **公開 URL** が発行され、そのままお店のサイトや SNS に貼れます。

- 👤 **お客さん**：発行された URL を開いてメニューを見るだけ（ログイン不要）
- 🔑 **管理者**：アカウントを作り、自分専用のメニューを何個でも作成・編集・公開
- 🎨 業種別テンプレート（レストラン / カフェ / 居酒屋 / 物販 / サロン / 白紙）
- 🎛️ 色・フォント・レイアウト・角丸をお店ごとに調整
- 🈳 説明や価格、カテゴリーを **使わなくても崩れない**デザイン（空欄は表示されません）
- 📱 スマホ・タッチパネルでの閲覧に最適化

技術構成：**Next.js 15（App Router）** + **Supabase**（データベース・ログイン・画像保存）。**Netlify**（無料枠でも商用可）にデプロイします。Vercel でも動きますが、Vercel の無料 Hobby プランは非商用限定です。

---

## 使うために必要なもの（すべて無料枠でOK）

1. [Supabase](https://supabase.com) のアカウント（データ・ログイン・画像の保存先）
2. [Netlify](https://netlify.com) のアカウント（アプリの公開先）
3. [GitHub](https://github.com) のアカウント（コードの置き場所。Netlify と連携します）

---

## セットアップ手順

### 1. Supabase プロジェクトを作る

1. [supabase.com/dashboard](https://supabase.com/dashboard) で「New project」を作成
2. データベースのパスワードは任意（メモしておく）
3. リージョンは「Northeast Asia (Tokyo)」がおすすめ

### 2. データベースを準備する

1. Supabase の左メニュー **SQL Editor** を開く
2. このリポジトリの [`supabase/schema.sql`](supabase/schema.sql) の中身を **すべてコピーして貼り付け**
3. **Run** を押す（テーブル・セキュリティ設定・画像保存用バケットがまとめて作成されます）

> 2 回目以降に実行してもエラーにならないように作ってあります。

### 3. （推奨）メール確認を省略する

管理者がすぐログインできるようにするための設定です。

- Supabase → **Authentication → Sign In / Providers → Email**
- **「Confirm email」を OFF** にして保存

（ON のままでも動作しますが、登録時に確認メールのリンクを開く必要があります）

### 4. 接続情報を控える

Supabase → **Project Settings → API** で以下をコピー：

| 名前 | 場所 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 「Project URL」 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 「Project API keys」の **anon public** |

### 5. ローカルで動かす（任意）

```bash
npm install
cp .env.local.example .env.local   # 中身を編集して上の2つ + SITE_URL を設定
npm run dev
```

http://localhost:3000 を開く。

> **まず画面をさわってみたいだけなら**、環境変数の設定前でも `npm run dev` 後に
> **http://localhost:3000/try** を開くと、ログインなしで編集画面をひと通り操作できます
> （「お試しモード」。保存はされません）。

### 6. Netlify にデプロイする

1. このプロジェクトを GitHub のリポジトリに push
2. [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** → **GitHub** → このリポジトリを選択
3. **Project name** を決める（例 `menukun` → URL が `menukun.netlify.app` に）
4. **Environment variables** に次の 3 つを追加：

   ```
   NEXT_PUBLIC_SUPABASE_URL       = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = sb_publishable_...
   NEXT_PUBLIC_SITE_URL           = https://（あなたのNetlifyドメイン）
   ```

5. **Deploy** を押す（ビルド設定は `netlify.toml` にあるので変更不要）
6. デプロイ後、**プロジェクト構成 → Visitor access → 「公共（Public）」** を選んで保存
   （Netlify の新規サイトは初期状態が「プライベート」で、一般公開されません）

### 7. （任意）Supabase 側に本番 URL を登録

Supabase → **Authentication → URL Configuration**

- **Site URL**：`https://（あなたのNetlifyドメイン）`
- **Redirect URLs** に追加：`https://（あなたのNetlifyドメイン）/**`

> メール確認・パスワード再設定・OAuth を使う場合のみ必要です。メール＋パスワード / 匿名ログインだけなら未設定でも動きます。

---

## 使い方

### 管理者

1. `/signup` でアカウント作成 → `/dashboard`
2. 「＋ 新しく作る」→ 業種に近いテンプレートを選ぶ
3. 「基本情報」「デザイン」「メニュー内容」を編集（変更は自動保存され、右側にプレビュー表示）
4. 「公開設定」で **公開** に切り替え
5. 表示される **公開 URL** をコピーしてお店のサイトに掲載
   - `<iframe>` 埋め込みタグも用意しています

### お客さん

公開 URL（例：`https://your-app.netlify.app/m/7k2m9x4p`）を開くだけ。ログイン不要。

---

## 「空欄でも崩れない」設計について

- **説明なし** → その行を表示しません（空白スペースも作りません）
- **写真なし** → 品名の頭文字を使った上品なプレースホルダーを表示
- **カテゴリーを1つも作らない** → 見出しなしで項目を並べます
- **価格を使わない** →「価格を表示する」を OFF にすれば価格欄ごと消えます
- **キャッチ・カバー画像・ロゴなし** → その要素は最初から無かったように表示されます

---

## よくある質問

**Q. 管理者ごとにメニューは分かれますか？**
はい。データベースの行レベルセキュリティ（RLS）で、各管理者は自分のメニューだけ編集できます。公開中のメニューだけが URL で閲覧可能になります。

**Q. 画像はどこに保存されますか？**
Supabase Storage の `menu-images` バケット（公開読み取り）。アップロードは各管理者の自分のフォルダのみ許可されます。アップロード前にブラウザ内で幅 1400px / JPEG 品質 0.8 に自動圧縮され、ストレージ消費を抑えます（`src/lib/image.ts`）。

**Q. 独自ドメインは使えますか？**
Netlify のプロジェクト構成 → ドメイン管理でカスタムドメインを追加し、`NEXT_PUBLIC_SITE_URL` を更新して再デプロイしてください。

---

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm start` | ビルド結果を起動 |
| `npm run lint` | Lint |

## ディレクトリ構成

```
src/
  app/
    page.tsx                 ランディング
    login, signup            管理者ログイン / 登録
    auth/                    認証アクション・コールバック
    dashboard/               管理画面（一覧・新規作成・エディタ）
      actions.ts             メニュー/カテゴリー/項目のサーバーアクション
      [menuId]/page.tsx      エディタ
    m/[slug]/page.tsx        公開メニューページ（お客さん用）
  components/
    editor/                  エディタ UI（context, panels, ContentPanel, ImageUploader）
    menu-view/MenuView.tsx   公開メニューの描画（プレビューと共用）
  lib/
    templates.ts             業種別テンプレート
    theme.ts                 テーマ（色・フォント・レイアウト）
    supabase/                Supabase クライアント（browser / server / middleware）
supabase/schema.sql          データベース定義（Supabase の SQL Editor で実行）
```
