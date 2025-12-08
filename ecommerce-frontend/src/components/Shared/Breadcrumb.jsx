import { Link } from "react-router-dom";

export function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="text-sm">
      <ol
        className="flex items-center 
                        space-x-2"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              {!isLast && item.to ? (
                <Link
                  to={item.to}
                  className="text-blue-600 
                                hover:underline 
                                truncate max-w-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-gray-500 
                                    truncate max-w-xs"
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
