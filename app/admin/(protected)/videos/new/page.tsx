import { getAllCategories } from "@/lib/server-data";
import { VideoForm } from "@/components/admin/video-form";

export default async function NewVideoPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Add a video</h1>
      <p className="mt-1 text-sm text-paper/50">From YouTube, Instagram, TikTok, Facebook, or anywhere else.</p>
      <div className="mt-6">
        <VideoForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
