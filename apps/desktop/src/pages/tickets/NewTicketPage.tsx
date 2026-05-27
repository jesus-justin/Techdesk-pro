import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createTicketSchema, type CreateTicketInput } from "@techdesk-pro/validators";
import { TicketPriority } from "@techdesk-pro/constants";
import { useTicketMutations } from "../../hooks/useTickets";

export function NewTicketPage() {
  const navigate = useNavigate();
  const { createTicket } = useTicketMutations();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TicketPriority.MEDIUM
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await createTicket.mutateAsync(values);
    navigate("/tickets");
  });

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">New Ticket</h2>

      <form className="mt-4 space-y-4" onSubmit={(event) => void onSubmit(event)}>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => <input className="w-full rounded-lg border px-3 py-2" {...field} />}
          />
          {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => <textarea className="min-h-[140px] w-full rounded-lg border px-3 py-2" {...field} />}
          />
          {errors.description ? <p className="mt-1 text-xs text-red-500">{errors.description.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Priority</label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <select className="w-full rounded-lg border px-3 py-2" {...field}>
                <option value={TicketPriority.LOW}>LOW</option>
                <option value={TicketPriority.MEDIUM}>MEDIUM</option>
                <option value={TicketPriority.HIGH}>HIGH</option>
                <option value={TicketPriority.CRITICAL}>CRITICAL</option>
              </select>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
