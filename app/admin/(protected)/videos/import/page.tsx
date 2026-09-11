import { YouTubeImportPanel } from "@/components/admin/youtube-import-panel";

export default function ImportVideosPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-bold text-paper">Import from YouTube</h1>
      <p className="mt-1 text-sm text-paper/50">
        Pulls your channel&apos;s real videos. Each one gets a suggested category based on its title — check it before importing.
      </p>
      <div className="mt-6">
        <YouTubeImportPanel />
      </div>
    </div>
  );
}
