import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-blue-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo + Mô tả */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Smart Shop</h2>
          <p className="text-sm leading-relaxed">
            Smart Shop mang đến cho bạn những sản phẩm thời trang hiện đại, chất
            lượng cao, và trải nghiệm mua sắm tuyệt vời nhất.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh*/}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Danh mục</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <div className="hover:text-white">Sản phẩm</div>
            </li>
            <li>
              <div className="hover:text-white">Hàng mới</div>
            </li>
            <li>
              <div className="hover:text-white">Áo nam</div>
            </li>
            <li>
              <div className="hover:text-white">Quần nam</div>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <div className="hover:text-white">
                Chính sách đổi hàng và bảo hành
              </div>
            </li>
            <li>
              <div className="hover:text-white">Chính sách Membership</div>
            </li>
            <li>
              <div className="hover:text-white">
                Chính sách ưu đãi sinh nhật
              </div>
            </li>
            <li>
              <div className="hover:text-white">Chính sách bảo mật</div>
            </li>
            <li>
              <div className="hover:text-white">Chính sách giao hàng</div>
            </li>
          </ul>
        </div>

        {/* Cột 4: */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} />
              <span>support@smartshop.vn</span>
            </li>
          </ul>
          <div className="flex gap-3 mt-4">
            <Facebook size={20} />
            <Instagram size={20} />
            <Twitter size={20} />
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="text-center py-4">
        <span className="text-white">© Bản quyền thuộc về</span>{" "}
        <span className="text-blue-500">SMART SHOP</span>
      </div>
    </footer>
  );
}

export default Footer;
