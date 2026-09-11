import Link from "next/link";
import { getAllPollsForAdmin } from "@/lib/server-data";
import { PollRowActions } from "@/components/admin/poll-row-actions";

export default async function AdminPollsPage() {
  const polls = await getAllPollsForAdmin();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-paper">Polls</h1>
          <p className="mt-1 text-sm text-paper/50">Only one poll can be active on the homepage at a time.</p>
        </div>
        <Link href="/admin/polls/new" className="bg-blue px-4 py-2.5 font-display text-sm font-bold text-paper">
          + New poll
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No polls yet.</p>
          <Link href="/admin/polls/new" className="mt-3 inline-block font-display text-sm font-bold text-blue-bright hover:underline">
            Create your first one
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const total = poll.options.reduce((sum, o) => sum + o.votes, 0);
            return (
              <div key={poll.id} className="border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ${
                        poll.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-paper/50"
                      }`}
                    >
                      {poll.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <h3 className="mt-2 font-display text-base font-bold text-paper">{poll.question}</h3>
                  </div>
                  <PollRowActions id={poll.id} isActive={poll.isActive} />
                </div>

                <div className="mt-4 space-y-2">
                  {poll.options.map((opt) => {
                    const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
                    return (
                      <div key={opt.id}>
                        <div className="flex justify-between text-xs text-paper/70">
                          <span>{opt.label}</span>
                          <span>{opt.votes} ({pct}%)</span>
                        </div>
                        <div className="mt-1 h-2 w-full bg-white/10">
                          <div className="h-2 bg-blue-bright" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-paper/40">{total} total vote{total === 1 ? "" : "s"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
