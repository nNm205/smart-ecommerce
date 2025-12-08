export default function CartTableHeader() {
  return (
    <div className="hidden md:grid grid-cols-5 gap-4 md:gap-6 px-4 sm:px-6 py-3 border-b text-sm font-semibold text-gray-600 bg-gray-50 rounded-t-xl">
      <div className="col-span-2">Sản phẩm</div>
      <div className="text-center">Đơn giá</div>
      <div className="text-center">Số lượng</div>
      <div className="text-center">Tổng</div>
    </div>
  );
}
