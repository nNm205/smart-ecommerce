import { Link, NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { menuData } from "@/data/menuData";

export default function DesktopMenu() {
  return (
    <div className="hidden md:flex space-x-8 items-center relative">
      {menuData.map((item, index) =>
        item.dropdown === "mega" ? (
          <div key={index} className="group relative">
            <Link
              to={item.path || "#"}
              className="relative flex items-center
                           text-black font-semibold text-[16px]
                           hover:text-blue-800 transition
                           after:content-[''] after:absolute
                           after:left-0 after:-bottom-1
                           after:w-0 after:h-[2px]
                           after:bg-blue-800 hover:after:w-full
                           after:transition-all
                           after:duration-300 cursor-pointer"
            >
              {item.title}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Link>
            <div
              className="fixed left-1/2 -translate-x-1/2 top-[64px]
                           invisible opacity-0 group-hover:visible
                           group-hover:opacity-100 w-screen max-w-7xl
                           bg-white border-t border-gray-200
                           py-6 px-12 flex justify-center gap-16
                           transition-all duration-300 z-40
                           shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                           rounded-b-lg"
            >
              {item.columns.map((col, colIndex) => (
                <div key={colIndex}>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">
                    <Link to={col.path}>{col.title}</Link>
                  </h4>
                  {col.links.length > 0 && (
                    <ul className="space-y-2 text-[15px] text-gray-700">
                      {col.links.map((link, linkIndex) => (
                        <li
                          key={linkIndex}
                          className="hover:text-orange-500 cursor-pointer transition"
                        >
                          <Link to={link.path}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : item.dropdown === "simple" ? (
          <div key={index} className="group relative">
            <Link
              to={item.path}
              className="relative flex items-center text-black 
                         font-semibold text-[16px] 
                         hover:text-blue-800 transition
                         after:content-[''] after:absolute 
                         after:left-0 after:-bottom-1 
                         after:w-0 after:h-[2px] after:bg-blue-800
                         hover:after:w-full after:transition-all 
                         after:duration-300 cursor-pointer"
            >
              {item.title}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Link>
            <div
              className="absolute left-0 top-11
              invisible opacity-0 group-hover:visible 
              group-hover:opacity-100 bg-white border 
              border-gray-200 rounded-b-lg w-56
              py-2 transition-all duration-200 ease-out
              shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-40"
            >
              <ul className="py-2 text-gray-700">
                {item.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Link
            key={index}
            to={item.path}
            className="relative flex items-center text-black 
                       font-semibold text-[16px] 
                       hover:text-blue-800 transition
                       after:content-[''] after:absolute 
                       after:left-0 after:-bottom-1 
                       after:w-0 after:h-[2px] after:bg-blue-800
                       hover:after:w-full after:transition-all 
                       after:duration-300 cursor-pointer"
          >
            {item.title}
          </Link>
        )
      )}
    </div>
  );
}
