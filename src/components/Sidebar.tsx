import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale, useSetLocale } from "../context/LanguageContext";
import { version } from "../../version.json";

type SidebarProps = {
  children: React.ReactNode;
  currentPath: string;
  onNavigate?: (path: string) => void;
};

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  nameAr?: string;
  badge?: string;
}

interface NavCategory {
  name: string;
  nameAr?: string;
  items: NavItem[];
}

export default function Sidebar({
  children,
  currentPath,
  onNavigate,
}: SidebarProps) {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [currentPath]);

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
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
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
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          ),
        },
        {
          name: "Ramadan Schedule",
          nameAr: "جدول رمضان",
          path: "/ramadan-schedule",
          badge: "NEW",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ),
        },
        {
          name: "Schedule Planner",
          nameAr: "مخطط الجدول",
          path: "/schedule-planner",
          badge: "NEW",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008Z" />
            </svg>
          ),
        },
        {
          name: "Attendance Tracker",
          nameAr: "متابعة الحضور",
          path: "/attendance-calculator",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
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
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
            </svg>
          ),
        },
        {
          name: "Grade Calculator",
          nameAr: "حاسبة الدرجات",
          path: "/grade-calculator",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
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
          badge: "NEW",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          ),
        },
        {
          name: "User Guide",
          nameAr: "دليل المستخدم",
          path: "/guide",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
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
          name: "About",
          nameAr: "حول التطبيق",
          path: "/about",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          ),
        },
        {
          name: "Privacy",
          nameAr: "الخصوصية",
          path: "/privacy",
          icon: (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          ),
        },
      ],
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isOpen]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const handleNavigation = useCallback(
    (path: string) => {
      onNavigate?.(path);
      if (isMobile) close();
      navigate(path);
    },
    [isMobile, close, navigate, onNavigate],
  );

  const handleLanguageChange = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      isDragging.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      currentX.current = e.touches[0].clientX;
      const diff = currentX.current - startX.current;
      const threshold = 40;
      if (locale === "ar" ? diff > threshold : diff < -threshold) {
        isDragging.current = true;
      }
    };
    const onTouchEnd = () => {
      if (isDragging.current) close();
      isDragging.current = false;
    };
    const el = sidebarRef.current;
    if (!el) return;
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, isOpen, locale, close]);

  const isRTL = locale === "ar";
  const sidebarW = "w-[244px]";

  const activePageName = (() => {
    for (const cat of navCategories) {
      for (const item of cat.items) {
        if (currentPath === item.path) return isRTL && item.nameAr ? item.nameAr : item.name;
      }
    }
    return isRTL ? "أدوات UDST" : "UDST Tools";
  })();

  return (
    <div className={`flex h-screen w-screen overflow-hidden text-white ${isRTL ? "rtl" : "ltr"}`}>
      {/* Mobile top bar */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 right-0 z-40 flex items-center h-12 px-3 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-700/40"
        >
          <button
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 active:bg-zinc-700/50 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="flex-1 text-sm font-medium text-white truncate mx-2 text-start">
            {activePageName}
          </span>
          <button
            onClick={handleLanguageChange}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 active:bg-zinc-700/50 transition-colors"
          >
            <span className="text-xs font-semibold">{locale === "ar" ? "EN" : "ع"}</span>
          </button>
        </div>
      )}

      {/* Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          ${isMobile
            ? `fixed inset-y-0 ${isRTL ? "right-0" : "left-0"} z-50 ${sidebarW} transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isOpen
                  ? "translate-x-0"
                  : isRTL
                    ? "translate-x-full"
                    : "-translate-x-full"
              }`
            : `relative ${sidebarW} shrink-0`
          }
          flex flex-col bg-zinc-900/95 backdrop-blur-xl
          ${isMobile ? "" : "border-e border-zinc-700/40"}
        `}
      >
        {/* Sidebar header */}
        <div className="shrink-0 flex items-center gap-3 px-4 h-14 border-b border-zinc-700/30">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25">
            <span className="text-xs font-bold text-blue-400">UT</span>
          </div>
          <span className="text-sm font-semibold text-white flex-1 truncate">
            {isRTL ? "أدوات UDST" : "UDST Tools"}
          </span>
          {isMobile && (
            <button
              onClick={close}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 active:bg-zinc-700/50 transition-colors"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-2.5 py-3">
          <div className="space-y-5">
            {navCategories.map((category) => (
              <div key={category.name}>
                <div className="mb-1.5 text-start">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-2">
                    {isRTL ? category.nameAr : category.name}
                  </span>
                </div>
                <ul className="space-y-0.5">
                  {category.items.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <li key={item.path}>
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`group w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-150 min-h-[40px] text-start ${
                            isActive
                              ? "bg-blue-500/[0.08] text-white"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 active:bg-white/[0.06]"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 [&>svg]:w-3.5 [&>svg]:h-3.5 ${
                              isActive
                                ? "bg-blue-500/15 text-blue-400"
                                : "bg-zinc-700/40 text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate text-xs font-medium">
                            {isRTL && item.nameAr ? item.nameAr : item.name}
                          </span>
                          {item.badge && (
                            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/20">
                              {isRTL ? "جديد" : item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-zinc-700/30 px-2.5 py-3 space-y-1.5">
          <button
            onClick={handleLanguageChange}
            className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 transition-colors min-h-[40px] text-start"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-700/40 text-zinc-500 [&>svg]:w-3.5 [&>svg]:h-3.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
              </svg>
            </span>
            {locale === "ar" ? "English" : "العربية"}
          </button>
          <p className="text-[10px] text-zinc-600 px-2.5 text-start">v{version}</p>
        </div>
      </aside>

      {/* Main */}
      <div
        ref={contentRef}
        className={`flex-1 h-full overflow-auto text-start ${isMobile ? "pt-12" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
