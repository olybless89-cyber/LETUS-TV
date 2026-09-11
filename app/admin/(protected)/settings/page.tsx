import { getSiteSettings } from "@/lib/server-data";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Site Settings</h1>
      <p className="mt-1 text-sm text-paper/50">Controls what shows across the whole site.</p>
      <div className="mt-6">
        <SiteSettingsForm
          initial={{
            siteName: s?.siteName ?? "Letus TV",
            tagline: s?.tagline ?? "",
            description: s?.description ?? "",
            contactEmail: s?.contactEmail ?? "",
            phone: s?.phone ?? "",
            address: s?.address ?? "",
            facebookUrl: s?.facebookUrl ?? "",
            instagramUrl: s?.instagramUrl ?? "",
            youtubeUrl: s?.youtubeUrl ?? "",
            tiktokUrl: s?.tiktokUrl ?? "",
            twitterUrl: s?.twitterUrl ?? "",
            conversationCtaEnabled: s?.conversationCtaEnabled ?? false,
            conversationCtaHeading: s?.conversationCtaHeading ?? "",
            conversationCtaText: s?.conversationCtaText ?? "",
            conversationCtaUrl: s?.conversationCtaUrl ?? "",
            conversationCtaButtonText: s?.conversationCtaButtonText ?? "",
            audioRoomsEnabled: s?.audioRoomsEnabled ?? false,
            audioRoomsHeading: s?.audioRoomsHeading ?? "",
            audioRoomsText: s?.audioRoomsText ?? "",
          }}
        />
      </div>
    </div>
  );
}
