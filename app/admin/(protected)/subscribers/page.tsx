import { getAllSubscribersForAdmin } from "@/lib/server-data";
import { SubscriberRowActions } from "@/components/admin/subscriber-row-actions";

export default async function AdminSubscribersPage() {
  const subscribers = await getAllSubscribersForAdmin();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-paper">Subscribers</h1>
        <p className="mt-1 text-sm text-paper/50">
          {subscribers.length} email{subscribers.length === 1 ? "" : "s"} collected from the homepage newsletter form.
        </p>
        <p className="mt-2 text-xs text-gold">
          These are only stored here — no emails are sent to them yet. Ask about setting up real newsletter sending if you want that.
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="border border-dashed border-white/15 p-10 text-center">
          <p className="text-paper/60">No subscribers yet.</p>
        </div>
      ) : (
        <div className="border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-paper/50">
                <th className="px-4 py-3 font-display font-semibold">Email</th>
                <th className="px-4 py-3 font-display font-semibold">Joined</th>
                <th className="px-4 py-3 font-display font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-paper">{s.email}</td>
                  <td className="px-4 py-3 text-paper/60">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right"><SubscriberRowActions id={s.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
