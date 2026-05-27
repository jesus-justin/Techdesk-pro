import { EmptyState } from "@techdesk-pro/ui";

export interface DataColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => JSX.Element | string | number;
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  isLoading,
  pagination,
  onRowClick
}: {
  columns: DataColumn<T>[];
  data: T[];
  isLoading?: boolean;
  pagination?: { page: number; totalPages: number; onPageChange: (page: number) => void };
  onRowClick?: (row: T) => void;
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-10 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title="No data" subtitle="There are no records to display." />;
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th key={String(column.accessor)} className="px-2 py-3 font-semibold text-gray-700">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id ?? rowIdx}
              className="border-b last:border-none hover:bg-gray-50"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={String(column.accessor)} className="px-2 py-3 text-gray-700">
                  {column.render ? column.render(row) : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="rounded-md border px-3 py-1 text-sm"
            onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="rounded-md border px-3 py-1 text-sm"
            onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
