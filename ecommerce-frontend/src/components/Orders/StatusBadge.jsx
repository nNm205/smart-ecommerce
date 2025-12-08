import { getStatusBadgeClass } from "@/utils/orderUtils";

export default function StatusBadge({ status }) {
  return (
    <div className="absolute top-3 right-3">
      <div
        className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(status)}`}
      >
        {status}
      </div>
    </div>
  );
}
