import { getAllContactMessagesForAdmin } from "@/lib/server-data";
import { MessageRowActions } from "@/components/admin/message-row-actions";

export default async function AdminMessagesPage() {
  const messages = await getAllContactMessagesForAdmin();
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paper">Messages</h1>
        <p className="mt-1 text-sm text-paper/50">
          Contact form submissions from the site.{unreadCount > 0 ? ` ${unreadCount} unread.` : ""}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`border p-4 ${m.isRead ? "border-white/10 bg-white/[0.02]" : "border-blue-bright/40 bg-blue-bright/5"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-sm font-bold text-paper">
                    {m.name} <span className="font-normal text-paper/50">&lt;{m.email}&gt;</span>
                  </p>
                  {m.subject && <p className="mt-0.5 text-sm text-paper/70">{m.subject}</p>}
                </div>
                <span className="shrink-0 text-xs text-paper/40">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-paper/80">{m.message}</p>
              <div className="mt-3">
                <MessageRowActions id={m.id} isRead={m.isRead} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
