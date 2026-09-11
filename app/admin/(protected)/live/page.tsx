import { getLiveStreamSettings } from "@/lib/server-data";
import { LiveForm } from "@/components/admin/live-form";

export default async function AdminLivePage() {
  const settings = await getLiveStreamSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">Live Settings</h1>
      <p className="mt-1 text-sm text-paper/50">Control what appears in the live section of the site.</p>
      <div className="mt-6">
        <LiveForm
          initial={{
            streamUrl: settings?.streamUrl ?? "",
            streamType: settings?.streamType ?? "YOUTUBE",
            title: settings?.title ?? "",
            description: settings?.description ?? "",
            thumbnailUrl: settings?.thumbnailUrl ?? "",
            isLive: settings?.isLive ?? false,
            isVisible: settings?.isVisible ?? true,
          }}
        />
      </div>
    </div>
  );
}
