import { notFound } from "next/navigation";
import { getSocialPostByIdForAdmin } from "@/lib/server-data";
import { SocialPostForm } from "@/components/admin/social-post-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditSocialPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getSocialPostByIdForAdmin(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Edit social post</h1>
      <div className="mt-6">
        <SocialPostForm
          initial={{
            id: post.id,
            platform: post.platform,
            url: post.url,
            caption: post.caption ?? "",
            isActive: post.isActive,
            order: post.order,
          }}
        />
      </div>
    </div>
  );
}
