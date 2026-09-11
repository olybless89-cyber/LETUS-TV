import { BulkSocialForm } from "@/components/admin/bulk-social-form";

export default function BulkSocialPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Bulk add social posts</h1>
      <p className="mt-1 text-sm text-paper/50">
        Paste as many real Instagram, TikTok, or Facebook post URLs as you have. Each one becomes a real embedded post.
      </p>
      <div className="mt-6">
        <BulkSocialForm />
      </div>
    </div>
  );
}
