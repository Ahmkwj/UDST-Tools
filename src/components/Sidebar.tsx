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
      name: "Home",
      nameAr: "الرئيسية",
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
      ],
    },
    {
      name: "Academic",
      nameAr: "الأكاديمية",
      items: [
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
          name: "Ramadan Schedule",
          nameAr: "جدول رمضان",
          path: "/ramadan-schedule",
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
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ),
        },
        {
          name: "Schedule Planner",
          nameAr: "مخطط الجدول",
          path: "/schedule-planner",
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Calculators",
      nameAr: "الحاسبات",
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
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Financial",
      nameAr: "المالية",
      items: [
        {
          name: "Fees Manager",
          nameAr: "إدارة الرسوم",
          path: "/fees-manager",
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
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      name: "Resources",
      nameAr: "الموارد",
      items: [
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
      ],
    },
    {
      name: "About",
      nameAr: "حول",
      items: [
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
          nameAr: "حول التطبيق",
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
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Only allow sidebar to be closed on mobile
      if (!isMobileView) {
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

  const sidebarWidth = "w-[232px]";

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden text-white ${
        locale === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Mobile header */}
      {isMobile && (
        <div
          className={`fixed top-0 left-0 right-0 z-20 flex items-center h-12 gap-2 px-3 bg-zinc-800/50 backdrop-blur-xl border-b border-zinc-600/40 ${locale === "ar" ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-600/40 transition-colors duration-150"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          <span className="text-sm font-medium text-white">
            {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
          </span>
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-20 transition-opacity duration-200 ${
            isOpen ? "opacity-100 bg-black/50 backdrop-blur-[2px]" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed inset-y-0 ${locale === "ar" ? "right-0" : "left-0"} z-30 ${sidebarWidth} ${
                isOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"
              }`
            : `relative ${sidebarWidth}`
        } flex flex-col shrink-0 transition-[transform] duration-300 ease-out ${
          isMobile ? "mt-12" : ""
        } bg-zinc-800/50 backdrop-blur-xl border-zinc-600/40 ${
          locale === "ar" ? "border-l" : "border-r"
        }`}
      >
        {!isMobile && (
          <div className="w-full px-4 pt-4 pb-3 text-start border-b border-zinc-600/25">
            <h2 className="text-sm font-semibold tracking-tight text-white">
              {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
            </h2>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-2 py-3">
          <div className="space-y-6">
            {navCategories.map((category) => (
              <div key={category.name}>
                {isOpen && (
                  <div className="mb-2 text-start">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 px-2">
                      {locale === "ar" ? category.nameAr : category.name}
                    </span>
                  </div>
                )}
                <ul className="space-y-0.5">
                  {category.items.map((item) => {
                    const isActive =
                      currentPath === `/${locale}${item.path}` ||
                      (item.path === "/" && currentPath === `/${locale}`);
                    return (
                      <li key={item.path}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(item.path);
                          }}
                          className={`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-150 ${
                            isActive
                              ? "bg-blue-500/15 text-blue-300"
                              : "text-zinc-400 hover:bg-zinc-600/40 hover:text-zinc-200"
                          }`}
                          title={locale === "ar" ? item.nameAr : item.name}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 [&>svg]:w-3.5 [&>svg]:h-3.5 ${
                              isActive ? "bg-blue-500/20 text-blue-400" : "bg-zinc-600/40 text-zinc-500 group-hover:bg-zinc-500/40 group-hover:text-zinc-300"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate text-xs font-medium">
                            {locale === "ar" && item.nameAr ? item.nameAr : item.name}
                          </span>
                          {(item.path === "/fees-manager" || item.path === "/schedule-planner") && (
                            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300">
                              {locale === "ar" ? "جديد" : "NEW"}
                            </span>
                          )}
                          {item.comingSoon && (
                            <span className="shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded-lg bg-zinc-700/50 border border-zinc-600/40 text-zinc-400">
                              {locale === "ar" ? "قريبًا" : "Soon"}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {isOpen && (
              <div className="pt-4 mt-2 border-t border-zinc-600/25 space-y-3">
                <div className="mb-2 text-start">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 px-2">
                    {locale === "ar" ? "اللغة" : "Language"}
                  </span>
                </div>
                <LanguageSwitcher />
                <p className="text-[10px] text-zinc-500 text-center">v{version}</p>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 h-full overflow-auto ${
          locale === "ar" ? "text-right" : "text-left"
        } ${isMobile ? "pt-12" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
