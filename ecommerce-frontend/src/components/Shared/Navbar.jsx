import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import DesktopMenu from "@/components/Shared/DesktopMenu";
import MobileMenu from "@/components/Shared/MobileMenu";
import useCart from "@/contexts/useCart";
import useAuth from "@/contexts/useAuth";
import useChat from "@/contexts/useChat";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const { auth } = useAuth();
  const isLoggedIn = auth.isAuthenticated;
  const { totalItems } = useCart();

  const { unreadCount } = useChat();

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchOpen && !event.target.closest(".search-container")) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatUnreadCount = (count) => {
    if (count === 0) return null;
    if (count > 10) return "10+";
    return count;
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo + Menu Button */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-700 hover:text-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <Link to="/" className="text-2xl font-bold text-blue-900">
              Smart Shop
            </Link>
          </div>

          {/* Middle: Desktop Menu */}
          <DesktopMenu />

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div
              className={`search-container overflow-hidden transition-all duration-300 ease-in-out ${
                searchOpen ? "w-48 md:w-64 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Search Icon */}
            <Search
              className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer flex-shrink-0"
              onClick={handleSearchToggle}
            />

            {/* Shopping Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* User Icon with Chat Notification */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleUserClick}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors relative"
              >
                <User className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer" />

                {/* Badge thông báo tin nhắn chưa đọc */}
                {isLoggedIn && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {formatUnreadCount(unreadCount)}
                  </span>
                )}
              </button>

              {isLoggedIn && auth.fullName && (
                <div
                  className="absolute 
                              left-1/2 
                              -translate-x-1/2 
                              mt-4
                              max-w-xs 
                              whitespace-normal
                              text-center  
                              bg-white 
                              border 
                              border-gray-200 
                              shadow-md 
                              rounded-md 
                              px-4 py-2 
                              text-sm 
                              text-gray-700
                              opacity-0 
                              group-hover:opacity-100 
                              transition"
                >
                  <div className="whitespace-nowrap">Xin chào,</div>
                  <div className="font-semibold break-words">
                    {auth.fullName}
                  </div>

                  {/* Hiển thị thông báo tin nhắn trong tooltip */}
                  {unreadCount > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-center gap-1 text-red-500">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        {unreadCount} tin nhắn mới
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </nav>
  );
}
