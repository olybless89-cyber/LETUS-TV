type Settings = {
  conversationCtaEnabled: boolean;
  conversationCtaHeading: string | null;
  conversationCtaText: string | null;
  conversationCtaUrl: string | null;
  conversationCtaButtonText: string | null;
  audioRoomsEnabled: boolean;
  audioRoomsHeading: string | null;
  audioRoomsText: string | null;
} | null;

export function JoinConversationCard({ settings }: { settings: Settings }) {
  if (!settings?.conversationCtaEnabled || !settings.conversationCtaUrl) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-bright/40 via-blue-deep/70 to-live/30" />
      <div className="absolute inset-0 backdrop-blur-md" />
      <div className="relative flex flex-col justify-between text-paper">
        <div>
          <span className="font-display text-xs font-bold tracking-wide text-gold">COMMUNITY</span>
          <h3 className="mt-2 font-display text-xl font-bold">
            {settings.conversationCtaHeading || "Join the conversation"}
          </h3>
          {settings.conversationCtaText && (
            <p className="mt-2 text-sm text-paper/80">{settings.conversationCtaText}</p>
          )}
        </div>
        <a
          href={settings.conversationCtaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block self-start rounded-full bg-paper px-6 py-2.5 text-center font-display text-sm font-bold text-blue-deep transition-transform hover:scale-105"
        >
          {settings.conversationCtaButtonText || "Join the conversation"}
        </a>
      </div>
    </div>
  );
}

export function AudioRoomsCard({ settings }: { settings: Settings }) {
  if (!settings?.audioRoomsEnabled) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-ink/80 to-blue-deep/60" />
      <div className="absolute inset-0 backdrop-blur-md" />
      <div className="relative flex flex-col justify-between text-paper">
        <div>
          <span className="font-display text-xs font-bold tracking-wide text-gold">COMING SOON</span>
          <h3 className="mt-2 font-display text-xl font-bold">
            {settings.audioRoomsHeading || "Audio Rooms are coming"}
          </h3>
          <p className="mt-2 text-sm text-paper/80">
            {settings.audioRoomsText || "Live conversations. Real voices. Hosted by people you follow."}
          </p>
        </div>
        <span className="mt-5 inline-block self-start rounded-full bg-white/15 px-6 py-2.5 text-center font-display text-sm font-bold text-paper/70">
          Get ready
        </span>
      </div>
    </div>
  );
}
