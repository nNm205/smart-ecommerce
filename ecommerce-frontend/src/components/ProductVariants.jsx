function ProductVariants({ sizes, colors, selected, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-medium">Màu sắc:</h3>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              className={`px-3 py-1 border rounded-full ${
                selected.color === c ? "border-black" : "border-gray-300"
              }`}
              onClick={() => onChange({ ...selected, color: c })}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium">Kích thước:</h3>
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              className={`px-3 py-1 border rounded ${
                selected.size === s ? "border-black" : "border-gray-300"
              }`}
              onClick={() => onChange({ ...selected, size: s })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductVariants;
