import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = false;

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate("/account");
    } else {
      navigate("/login");
    }
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
            <Search className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer" />
            <Link to="/cart">
              <ShoppingCart className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer" />
            </Link>

            <button
              type="button"
              onClick={handleUserClick}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-7 h-7 text-gray-700 hover:text-black cursor-pointer" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </nav>
  );
}
