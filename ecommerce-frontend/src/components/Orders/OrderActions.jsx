import { getActionConfig } from "@/utils/orderUtils";

export default function OrderActions({ order }) {
  const { label, bgColor, textColor } = getActionConfig(order.status);

  const handleClick = () => {
    alert(`${label} ${order.id} — demo`);
  };

  return (
    <div className="px-4 py-3 flex items-center justify-end gap-3">
      <button
        className={`text-sm px-3 py-1 rounded-md font-medium cursor-pointer ${bgColor} ${textColor}`}
        onClick={handleClick}
      >
        {label}
      </button>
    </div>
  );
}
