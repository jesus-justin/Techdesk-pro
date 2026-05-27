import { useParams } from "react-router-dom";
import { StatusBadge } from "@techdesk-pro/ui";

export function AssetDetailPage() {
  const { id } = useParams();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-xl bg-white p-4 shadow-sm lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900">Asset {id}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div><span className="font-medium text-gray-800">Model:</span> Latitude 5540</div>
          <div><span className="font-medium text-gray-800">Serial:</span> TD-0001</div>
          <div><span className="font-medium text-gray-800">Manufacturer:</span> Dell</div>
          <div><span className="font-medium text-gray-800">Purchase Date:</span> 2025-01-21</div>
        </div>
        <div className="mt-3">
          <StatusBadge status="AVAILABLE" />
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <button className="mb-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
          Assign Asset
        </button>
        <h3 className="text-sm font-semibold text-gray-900">Assignment History</h3>
        <div className="mt-2 space-y-2 text-sm text-gray-600">
          <div className="rounded-lg bg-gray-50 p-3">Juan dela Cruz - 2026-04-12 to present</div>
          <div className="rounded-lg bg-gray-50 p-3">Ana Gomez - 2026-01-09 to 2026-03-22</div>
        </div>
      </div>
    </div>
  );
}
