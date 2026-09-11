import { SocialPostForm } from "@/components/admin/social-post-form";

export default function NewSocialPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Add a social post</h1>
      <p className="mt-1 text-sm text-paper/50">Paste a real post URL — it renders as an actual live embed on the site.</p>
      <div className="mt-6">
        <SocialPostForm />
      </div>
    </div>
  );
}
