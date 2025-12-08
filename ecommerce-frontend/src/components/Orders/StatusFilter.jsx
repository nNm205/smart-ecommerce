const STATUS_LIST = [
  { key: "All", label: "Tất cả đơn hàng" },
  { key: "Processing", label: "Chờ xử lý" },
  { key: "AwaitingPickup", label: "Chờ lấy hàng" },
  { key: "Shipping", label: "Đang giao" },
  { key: "Delivered", label: "Đã giao" },
  { key: "Unrated", label: "Chưa đánh giá" },
  { key: "Rated", label: "Đã đánh giá" },
  { key: "Canceled", label: "Đã hủy" },
  { key: "Returned", label: "Trả lại" },
];

export default function StatusFilter({ filter, setFilter }) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap justify-center gap-2">
        {STATUS_LIST.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`px-3 py-1 text-base font-semibold cursor-pointer ${
              filter === s.key
                ? "text-black border-b-2 border-black"
                : "bg-white text-gray-500"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
