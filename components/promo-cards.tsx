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
    <div className="flex flex-col justify-between bg-blue-deep p-6 text-paper">
      <div>
        <span className="font-display text-xs font-bold tracking-wide text-gold">COMMUNITY</span>
        <h3 className="mt-2 font-display text-xl font-bold">
          {settings.conversationCtaHeading || "Join the conversation"}
        </h3>
        {settings.conversationCtaText && (
          <p className="mt-2 text-sm text-paper/70">{settings.conversationCtaText}</p>
        )}
      </div>
      <a
        href={settings.conversationCtaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block bg-live px-5 py-2.5 text-center font-display text-sm font-bold text-paper"
      >
        {settings.conversationCtaButtonText || "Join the conversation"}
      </a>
    </div>
  );
}

export function AudioRoomsCard({ settings }: { settings: Settings }) {
  if (!settings?.audioRoomsEnabled) return null;

  return (
    <div className="flex flex-col justify-between border border-line bg-ink p-6 text-paper">
      <div>
        <span className="font-display text-xs font-bold tracking-wide text-gold">COMING SOON</span>
        <h3 className="mt-2 font-display text-xl font-bold">
          {settings.audioRoomsHeading || "Audio Rooms are coming"}
        </h3>
        <p className="mt-2 text-sm text-paper/70">
          {settings.audioRoomsText || "Live conversations. Real voices. Hosted by people you follow."}
        </p>
      </div>
      <span className="mt-5 inline-block bg-white/10 px-5 py-2.5 text-center font-display text-sm font-bold text-paper/60">
        Get ready
      </span>
    </div>
  );
}
