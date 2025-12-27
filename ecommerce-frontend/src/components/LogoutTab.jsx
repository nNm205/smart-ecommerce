export default function LogoutTab({ onConfirm, onCancel }) {
  return (
    <div className="w-full flex items-center justify-center min-h-[300px]">
      <div className="bg-white p-6 w-full text-center">
        <p className="text-gray-600 text-lg mb-6">
          Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 
                       text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            Không
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md 
                       bg-red-600 text-white 
                       hover:bg-red-700 transition cursor-pointer"
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
}
