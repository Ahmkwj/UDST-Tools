import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { version } from "../../version.json";

type SidebarProps = {
  children: React.ReactNode;
  currentPath: string;
  onNavigate?: (path: string) => void; // Make onNavigate optional
};

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  nameAr?: string; // Arabic name for menu items
  comingSoon?: boolean;
}

interface NavCategory {
  name: string;
  nameAr?: string; // Arabic name for category
  items: NavItem[];
}

export default function Sidebar({
  children,
  currentPath,
  onNavigate,
}: SidebarProps) {
  const locale = useLocale();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Navigation categories
  const navCategories: NavCategory[] = [
    {
      name: "Overview",
      nameAr: "نظرة عامة",
      items: [
        {
          name: "Dashboard",
          nameAr: "لوحة التحكم",
          path: "/",
          icon: (
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
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
              />
            </svg>
          ),
        },
        {
          name: "Academic Calendar",
          nameAr: "التقويم الأكاديمي",
          path: "/calendar",
          icon: (
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          ),
        },
        {
          name: "UDST Links",
          nameAr: "روابط UDST",
          path: "/links",
          icon: (
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
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Academic Tools",
      nameAr: "الأدوات الأكاديمية",
      items: [
        {
          name: "GPA Calculator",
          nameAr: "حاسبة المعدل",
          path: "/gpa-calculator",
          icon: (
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
                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
              />
            </svg>
          ),
        },
        {
          name: "Grade Calculator",
          nameAr: "حاسبة الدرجات",
          path: "/grade-calculator",
          icon: (
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
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-13.5 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97Z"
              />
            </svg>
          ),
        },
        {
          name: "Attendance Tracker",
          nameAr: "متابعة الحضور",
          path: "/attendance-calculator",
          icon: (
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Schedule",
      nameAr: "الجدول الدراسي",
      items: [
        {
          name: "Schedule Maker",
          nameAr: "منشئ الجدول",
          path: "/schedule-maker",
          comingSoon: true,
          icon: (
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Help & Support",
      nameAr: "المساعدة والدعم",
      items: [
        {
          name: "User Guide",
          nameAr: "دليل المستخدم",
          path: "/guide",
          icon: (
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
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          ),
        },
        {
          name: "Feedback",
          nameAr: "الملاحظات",
          path: "/feedback",
          icon: (
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
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
              />
            </svg>
          ),
        },
        {
          name: "About",
          nameAr: "حول",
          path: "/about",
          icon: (
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
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          ),
        },
        {
          name: "Privacy",
          nameAr: "الخصوصية",
          path: "/privacy",
          icon: (
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
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

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

  const handleNavigation = (path: string) => {
    // Ensure path has locale prefix
    const localizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;

    if (onNavigate) {
      onNavigate(localizedPath);
    }

    if (isMobile) {
      setIsOpen(false);
    }

    // Use navigate directly for better routing control
    navigate(localizedPath);
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden bg-black text-white ${
        locale === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Mobile header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800/50 z-20 flex items-center px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-white"
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
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mx-4">
            {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
          </h3>
        </div>
      )}

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
            ? `fixed inset-y-0 ${
                locale === "ar" ? "right-0" : "left-0"
              } z-30 w-[280px] ${
                isOpen
                  ? "translate-x-0"
                  : locale === "ar"
                  ? "translate-x-full"
                  : "-translate-x-full"
              }`
            : `relative ${isOpen ? "w-64" : "w-20"}`
        } bg-zinc-900 border-r border-zinc-800/50 transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-lg ${
          isMobile ? "mt-16" : ""
        }`}
      >
        {/* Desktop header */}
        {!isMobile && (
          <div
            className={`flex items-center justify-between ${
              isOpen ? "px-4 py-3" : "p-3"
            } border-b border-zinc-800/50`}
          >
            {isOpen ? (
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
              </h3>
            ) : (
              <div className="w-full flex justify-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <span className="text-white font-bold text-sm">UT</span>
                </div>
              </div>
            )}

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
          </div>
        )}

        <nav
          className={`flex-1 overflow-y-auto py-5 ${isOpen ? "px-3" : "px-2"}`}
        >
          {navCategories.map((category, index) => (
            <div key={category.name} className={index !== 0 ? "mt-6" : ""}>
              {isOpen && (
                <h4 className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {locale === "ar" ? category.nameAr : category.name}
                </h4>
              )}
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.path}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(item.path);
                      }}
                      className={`flex items-center ${
                        isOpen ? "space-x-3" : "justify-center"
                      } p-2 rounded-lg ${
                        currentPath === `/${locale}${item.path}` ||
                        (item.path === "/" && currentPath === `/${locale}`)
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      } transition-colors group relative`}
                      title={locale === "ar" ? item.nameAr : item.name}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="w-5 h-5 flex-shrink-0">
                            {item.icon}
                          </div>
                          <span className="ltr:ml-3 rtl:mr-3">
                            {locale === "ar" && item.nameAr
                              ? item.nameAr
                              : item.name}
                          </span>
                        </div>
                        {item.comingSoon && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-700/50 text-zinc-300 border border-zinc-600/50">
                            {locale === "ar" ? "قريبًا" : "Soon"}
                          </span>
                        )}
                      </div>

                      {/* Tooltip for collapsed state */}
                      {!isOpen && !isMobile && (
                        <div
                          className={`absolute ${
                            locale === "ar"
                              ? "right-full mr-2"
                              : "left-full ml-2"
                          } px-2 py-1 bg-zinc-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all`}
                        >
                          {locale === "ar" ? item.nameAr : item.name}
                        </div>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Language Switcher */}
          {isOpen && (
            <div className="mt-6 px-2">
              <div className="h-px bg-zinc-800/50 mb-4"></div>
              <h4 className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {locale === "ar" ? "اللغة" : "Language"}
              </h4>
              <LanguageSwitcher />
            </div>
          )}
        </nav>

        <div
          className={`${
            isOpen ? "p-4" : "p-2"
          } text-center text-xs text-zinc-500 border-t border-zinc-800/50`}
        >
          {isOpen ? (
            <p>
              {locale === "ar"
                ? `أدوات UDST الإصدار ${version}`
                : `UDST Tools v${version}`}
            </p>
          ) : (
            <p className="text-[10px]">v{version}</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 h-full overflow-auto ${
          locale === "ar" ? "text-right" : "text-left"
        } ${isMobile ? "pt-16" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
