import { notFound } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { buildFullMenuFromTemplate, TEMPLATES } from "@/lib/templates";
import { siteUrl } from "@/lib/utils";

export const metadata = { title: "お試し編集" };

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ templateId: t.id }));
}

export default async function TryEditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  if (!TEMPLATES.some((t) => t.id === templateId)) notFound();

  const data = buildFullMenuFromTemplate(templateId);

  return (
    <Editor
      userId="demo"
      demo
      initialMenu={data.menu}
      initialCategories={data.categories}
      initialItems={data.items}
      siteUrl={siteUrl()}
    />
  );
}
