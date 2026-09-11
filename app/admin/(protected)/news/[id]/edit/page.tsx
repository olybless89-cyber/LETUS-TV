import { notFound } from "next/navigation";
import { getAllCategories, getArticleByIdForAdmin } from "@/lib/server-data";
import { ArticleForm } from "@/components/admin/article-form";

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>\s*<p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/?p>/g, "")
    .trim();
}

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleByIdForAdmin(id),
    getAllCategories(),
  ]);

  if (!article) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Edit article</h1>
      <div className="mt-6">
        <ArticleForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          initial={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? "",
            body: htmlToPlainText(article.body),
            featuredImage: article.featuredImage ?? "",
            categoryId: article.categoryId,
            status: article.status,
            isFeatured: article.isFeatured,
            isBreaking: article.isBreaking,
          }}
        />
      </div>
    </div>
  );
}
