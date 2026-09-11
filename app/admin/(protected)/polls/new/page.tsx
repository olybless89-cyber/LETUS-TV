import { NewPollForm } from "@/components/admin/new-poll-form";

export default function NewPollPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-paper">New poll</h1>
      <p className="mt-1 text-sm text-paper/50">Ask visitors a question with a few choices.</p>
      <div className="mt-6">
        <NewPollForm />
      </div>
    </div>
  );
}
