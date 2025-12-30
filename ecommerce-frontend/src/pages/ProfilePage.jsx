import { useEffect, useState } from "react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import ProfileTab from "@/components/Profile/ProfileTab";
import OrdersTab from "@/components/Orders/OrdersTab";
import LogoutTab from "@/components/LogoutTab";
import AddressesTab from "@/components/Addresses/AddressesTab";
import SecurityTab from "@/components/Security/SecurityTab";
import AdminChatTab from "@/components/AdminChat/AdminChatTab";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/contexts/useAuth";

const MAIN_TABS = [
  { key: "account", label: "Tài khoản của tôi", path: "/profile" },
  { key: "orders", label: "Đơn hàng của tôi", path: "/profile/orders" },
  { key: "admin-chat", label: "Chat với Admin", path: "/profile/admin-chat" },
  { key: "logout", label: "Đăng xuất", path: "/profile/logout" },
];

const ACCOUNT_SUBTABS = [
  { key: "profile", label: "Hồ sơ", path: "/profile" },
  { key: "addresses", label: "Địa chỉ", path: "/profile/addresses" },
  { key: "security", label: "Đổi mật khẩu", path: "/profile/security" },
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

  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const user = {
    name: auth.fullName,
    email: auth.email,
    phone: "0912345678",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  useEffect(() => {
    const path = location.pathname;

    if (path === "/profile") {
      setActiveMain("account");
      setActiveAccountSub("profile");
    } else if (path === "/profile/addresses") {
      setActiveMain("account");
      setActiveAccountSub("addresses");
    } else if (path === "/profile/security") {
      setActiveMain("account");
      setActiveAccountSub("security");
    } else if (path.startsWith("/profile/orders")) {
      setActiveMain("orders");
    } else if (path.startsWith("/profile/admin-chat")) {
      setActiveMain("admin-chat");
    } else if (path === "/profile/logout") {
      setActiveMain("logout");
    }
  }, [location.pathname]);

  const handleMainTabClick = (tab) => {
    if (tab.key === "logout") {
      navigate(tab.path);
      setActiveMain("logout");
    } else {
      navigate(tab.path);
    }
  };

  const handleAccountSubClick = (subTab) => {
    navigate(subTab.path);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleLogoutCancel = () => {
    navigate("/profile");
  };

  const renderSubTabs = (items, activeKey, onClick) => {
    return items.map((it) => (
      <button
        key={it.key}
        type="button"
        onClick={() => onClick(it)}
        className={`text-left block px-3 py-1 w-full text-md focus:outline-none ${
          activeKey === it.key ? "text-black font-medium" : "text-gray-400"
        }`}
      >
        {it.label}
      </button>
    ));
  };

  const renderContent = () => {
    const path = location.pathname;

    if (path.startsWith("/profile/orders")) {
      return <OrdersTab />;
    }

    if (path === "/profile/admin-chat") {
      return <AdminChatTab />;
    }

    if (path === "/profile/logout") {
      return (
        <LogoutTab
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      );
    }

    if (path === "/profile") {
      return <ProfileTab user={user} />;
    }
    if (path === "/profile/addresses") {
      return <AddressesTab />;
    }
    if (path === "/profile/security") {
      return <SecurityTab />;
    }

    return <ProfileTab user={user} />;
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
          to="/profile"
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
                      onClick={() => handleMainTabClick(t)}
                      className={`text-left px-3 py-2 w-full ${
                        t.key === "logout" ? "text-red-600" : "text-black"
                      } text-lg font-semibold cursor-pointer hover:bg-gray-50 rounded transition-colors ${
                        activeMain === t.key ? "bg-gray-50" : ""
                      }`}
                    >
                      {t.label}
                    </button>

                    {t.key === "account" && activeMain === "account" && (
                      <div className="mt-2 ml-3 flex flex-col gap-1">
                        {renderSubTabs(
                          ACCOUNT_SUBTABS,
                          activeAccountSub,
                          handleAccountSubClick
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Mobile tabs */}
            <div className="lg:hidden mt-4">
              <div className="flex gap-2 overflow-x-auto">
                {MAIN_TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleMainTabClick(t)}
                    className={`whitespace-nowrap px-3 py-2 cursor-pointer ${
                      t.key === "logout" ? "text-red-600" : "text-black"
                    } text-base font-semibold ${
                      activeMain === t.key ? "border-b-2 border-black" : ""
                    }`}
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
                      onClick={() => handleAccountSubClick(s)}
                      className={`whitespace-nowrap px-3 py-2 text-sm ${
                        activeAccountSub === s.key
                          ? "text-black font-medium border-b-2 border-blue-600"
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

          <section className="bg-white rounded-xl p-6 shadow-sm min-h-[320px]">
            {renderContent()}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
