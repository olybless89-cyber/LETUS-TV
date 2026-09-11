import { notFound } from "next/navigation";
import { getAllCategories, getVideoByIdForAdmin } from "@/lib/server-data";
import { VideoForm } from "@/components/admin/video-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const [video, categories] = await Promise.all([
    getVideoByIdForAdmin(id),
    getAllCategories(),
  ]);

  if (!video) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Edit video</h1>
      <div className="mt-6">
        <VideoForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          initial={{
            id: video.id,
            title: video.title,
            slug: video.slug,
            description: video.description ?? "",
            thumbnailUrl: video.thumbnailUrl ?? "",
            videoUrl: video.videoUrl ?? "",
            videoType: video.videoType,
            categoryId: video.categoryId,
            status: video.status,
            isFeatured: video.isFeatured,
            duration: video.duration ?? "",
          }}
        />
      </div>
    </div>
  );
}
