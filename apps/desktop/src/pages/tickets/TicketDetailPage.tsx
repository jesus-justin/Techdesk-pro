import { useParams } from "react-router-dom";
import { useTicketMutations } from "../../hooks/useTickets";
import { StatusBadge, PriorityBadge } from "@techdesk-pro/ui";
import { TicketStatus } from "@techdesk-pro/constants";

export function TicketDetailPage() {
  const { id } = useParams();
  const { updateTicket } = useTicketMutations();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-3">
        <h2 className="text-xl font-semibold text-gray-900">Ticket {id}</h2>
        <p className="mt-2 text-sm text-gray-600">Ticket description and threaded comments appear here.</p>

        <div className="mt-6 rounded-lg bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-900">Comment Thread</p>
          <p className="mt-1 text-sm text-gray-500">No comments yet.</p>
          <div className="mt-3 flex gap-2">
            <input className="flex-1 rounded-lg border px-3 py-2" placeholder="Add a comment" />
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Post</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
        <p className="text-sm font-semibold text-gray-900">Metadata</p>
        <div className="mt-3 flex items-center gap-2">
          <StatusBadge status="OPEN" />
          <PriorityBadge priority="MEDIUM" />
        </div>

        <button
          className="mt-4 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
          onClick={() => void updateTicket.mutateAsync({ id: String(id), payload: { status: TicketStatus.IN_PROGRESS } })}
        >
          Move to IN_PROGRESS
        </button>

        <dl className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><dt>Assignee</dt><dd>Unassigned</dd></div>
          <div className="flex justify-between"><dt>Asset</dt><dd>None</dd></div>
          <div className="flex justify-between"><dt>Created</dt><dd>{new Date().toLocaleDateString()}</dd></div>
        </dl>
      </div>
    </div>
  );
}
