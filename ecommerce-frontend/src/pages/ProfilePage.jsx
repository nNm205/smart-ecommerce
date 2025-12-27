import { useState } from "react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ProfileTab from "@/components/Profile/ProfileTab";
import OrdersTab from "@/components/Orders/OrdersTab";
import LogoutTab from "@/components/LogoutTab";
import AddressesTab from "@/components/Addresses/AddressesTab";
import SecurityTab from "@/components/Security/SecurityTab";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "@/contexts/useAuth";
import { useNavigate } from "react-router-dom";

const MAIN_TABS = [
  { key: "account", label: "Tài khoản của tôi" },
  { key: "orders", label: "Đơn hàng của tôi" },
  { key: "logout", label: "Đăng xuất" },
];

const ACCOUNT_SUBTABS = [
  { key: "profile", label: "Hồ sơ" },
  { key: "addresses", label: "Địa chỉ" },
  { key: "security", label: "Đổi mật khẩu" },
];

const ORDERS_SUBTABS = [
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

export default function ProfilePage() {
  const [activeMain, setActiveMain] = useState("account");
  const [activeAccountSub, setActiveAccountSub] = useState("profile");
  const [activeOrdersSub, setActiveOrdersSub] = useState("All");
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const user = {
    name: auth.fullName,
    email: auth.email,
    phone: "0912345678",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const toggleMain = (key) => {
    setActiveMain(key);
  };

  const handleOrdersSubClick = (orderKey) => {
    setActiveMain("orders");
    setActiveOrdersSub(orderKey);
  };

  const renderSubTabs = (items, activeKey, onClick) => {
    return items.map((it) => (
      <button
        key={it.key}
        type="button"
        onClick={() => onClick(it.key)}
        className={`text-left block px-3 py-1 w-full text-md focus:outline-none ${
          activeKey === it.key ? "text-black font-medium" : "text-gray-400"
        }`}
      >
        {it.label}
      </button>
    ));
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 h-[50px] flex items-center px-6 lg:px-16 border-b border-gray-200">
        <Link
          to="/"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Trang chủ
        </Link>
        <ChevronRight size={14} className="mx-1" />
        <Link
          to="/account"
          className="hover:text-blue-700 transition-colors duration-200"
        >
          Tài khoản của tôi
        </Link>
      </div>

      <main className="w-full mx-auto mt-5 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="rounded-xl">
            {/* Desktop tabs */}
            <div className="hidden lg:block">
              <nav className="flex flex-col gap-2">
                {MAIN_TABS.map((t) => (
                  <div key={t.key}>
                    <button
                      type="button"
                      onClick={() => toggleMain(t.key)}
                      className={`text-left px-3 py-2 w-full ${
                        t.key === "logout" ? "text-red-600" : "text-black"
                      } text-lg font-semibold cursor-pointer`}
                    >
                      {t.label}
                    </button>

                    {t.key === "account" && activeMain === "account" && (
                      <div className="mt-2 ml-3 flex flex-col gap-1">
                        {renderSubTabs(
                          ACCOUNT_SUBTABS,
                          activeAccountSub,
                          setActiveAccountSub
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Mobile tabs */}
            <div className="lg:hidden mt-4">
              <div className="flex gap-2">
                {MAIN_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => toggleMain(t.key)}
                    className={`whitespace-nowrap px-3 py-2 cursor-pointer ${
                      t.key === "logout" ? "text-red-600" : "text-black"
                    } text-base font-semibold`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeMain === "account" && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {ACCOUNT_SUBTABS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setActiveAccountSub(s.key)}
                      className={`whitespace-nowrap px-3 py-2 text-sm ${
                        activeAccountSub === s.key
                          ? "text-black font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <section className="bg-white rounded-xl p-6 shadow-sm min-h-[320px]">
            {activeMain === "orders" && (
              <OrdersTab
                status={activeOrdersSub}
                onStatusChange={handleOrdersSubClick}
              />
            )}
            {activeMain === "account" && (
              <div>
                {activeAccountSub === "profile" && <ProfileTab user={user} />}
                {activeAccountSub === "addresses" && <AddressesTab />}
                {activeAccountSub === "security" && <SecurityTab />}
              </div>
            )}
            {activeMain === "logout" && (
              <LogoutTab
                onConfirm={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
                onCancel={() => {
                  setActiveMain("account");
                  setActiveAccountSub("profile");
                }}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
