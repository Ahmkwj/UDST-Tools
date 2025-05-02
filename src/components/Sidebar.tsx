import { useState, useEffect } from "react";

type SidebarProps = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-30 w-[280px] ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `relative ${isOpen ? "w-64" : "w-20"}`
        } bg-zinc-900 border-r border-zinc-800/50 transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-lg`}
      >
        <div
          className={`flex items-center justify-between ${
            isOpen ? "px-4 py-3" : "p-3"
          } border-b border-zinc-800/50`}
        >
          {(!isMobile && isOpen) || (isMobile && isOpen) ? (
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              UDST Tools
            </h3>
          ) : !isMobile ? (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <span className="text-white font-bold text-sm">UT</span>
              </div>
            </div>
          ) : null}

          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        <nav
          className={`flex-1 overflow-y-auto py-5 ${isOpen ? "px-3" : "px-2"}`}
        >
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className={`flex items-center ${
                  isOpen ? "space-x-3" : "justify-center"
                } p-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md group relative`}
                title="Dashboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                {isOpen && <span className="text-white">Dashboard</span>}
                {/* Tooltip for collapsed state */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    Dashboard
                  </div>
                )}
              </a>
            </li>
          </ul>
        </nav>

        <div
          className={`${
            isOpen ? "p-4" : "p-2"
          } text-center text-xs text-zinc-500 border-t border-zinc-800/50`}
        >
          {isOpen ? (
            <p>UDST Tools v1.0</p>
          ) : (
            <p className="text-[10px]">v1.0</p>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 left-4 z-40 p-2 rounded-lg bg-zinc-900/90 backdrop-blur-sm text-white shadow-lg border border-zinc-800/50 transition-transform duration-300 ${
            isOpen ? "translate-x-[280px]" : "translate-x-0"
          }`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      )}

      {/* Main content */}
      <div className="flex-1 h-full overflow-auto">{children}</div>
    </div>
  );
}
