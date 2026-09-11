import { getAllCategories } from "@/lib/server-data";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Write an article</h1>
      <div className="mt-6">
        <ArticleForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
