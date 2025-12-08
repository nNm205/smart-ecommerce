import { Plus, Minus } from "lucide-react";

export default function QuantityControl({
  quantity,
  stock,
  onDecrease,
  onIncrease,
  onChange,
}) {
  return (
    <div className="inline-flex items-center border rounded-lg overflow-hidden">
      <button
        onClick={onDecrease}
        className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={quantity <= 1}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        min={1}
        max={stock}
        value={quantity}
        onChange={onChange}
        className="w-12 text-center border-x outline-none text-sm py-1"
      />
      <button
        onClick={onIncrease}
        className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={quantity >= stock}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
