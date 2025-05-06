import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
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
  hideIfAuthenticated?: boolean; // New property to conditionally hide items when authenticated
}

interface NavCategory {
  name: string;
  nameAr?: string; // Arabic name for category
  items: NavItem[];
}

// Define which pages should be accessible without authentication
const UNRESTRICTED_PATHS = [
  "/",
  "/calendar",
  "/links",
  "/about",
  "/guide",
  "/privacy",
];

export default function Sidebar({
  children,
  currentPath,
  onNavigate,
}: SidebarProps) {
  const locale = useLocale();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
              />
            </svg>
          ),
        },
        {
          name: "Study Time Calculator",
          nameAr: "حاسبة وقت الدراسة",
          path: "/study-time-calculator",
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
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
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
      name: "Schedule",
      nameAr: "الجدول الدراسي",
      items: [
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
      ],
    },
    {
      name: "Account",
      nameAr: "الحساب",
      items: [
        {
          name: "Log In",
          nameAr: "تسجيل الدخول",
          path: "/login",
          hideIfAuthenticated: true,
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          ),
        },
        {
          name: "Sign Up",
          nameAr: "إنشاء حساب",
          path: "/signup",
          hideIfAuthenticated: true,
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
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
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

  // Function to check if a menu item should be shown based on auth state
  const shouldShowMenuItem = (path: string) => {
    // If user is logged in, show all items
    if (user) return true;

    // If user is not logged in, only show unrestricted paths
    return UNRESTRICTED_PATHS.includes(path);
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
            : "relative w-64"
        } bg-zinc-900 border-r border-zinc-800/50 transition-all duration-300 ease-in-out flex flex-col shrink-0 shadow-lg ${
          isMobile ? "mt-16" : ""
        }`}
      >
        {/* Desktop header */}
        {!isMobile && (
          <div
            className={`flex items-center justify-between px-4 py-3 border-b border-zinc-800/50`}
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
            </h3>
          </div>
        )}

        {/* User Profile Box - Only show if logged in */}
        {user && (
          <div className="px-4 py-4 border-b border-zinc-800/50">
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 hover:from-zinc-800 hover:to-zinc-800/50 border border-zinc-700/50 text-white transition-all duration-200 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-semibold shadow-lg shadow-blue-500/20">
                  {user.user_metadata?.name
                    ? user.user_metadata.name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="truncate font-medium text-sm text-white group-hover:text-white transition-colors">
                    {user.user_metadata?.name || user.email}
                  </div>
                  <div className="text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">
                    {user.email}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className={`w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-all duration-200 ${
                    profileDropdownOpen ? "transform rotate-180" : ""
                  }`}
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl shadow-black/20 border border-zinc-700/50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 mr-3"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    {locale === "ar" ? "الملف الشخصي" : "Profile"}
                  </a>
                  <div className="h-px bg-zinc-700/50 my-1"></div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      signOut();
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 mr-3"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                    {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className={`flex-1 overflow-y-auto py-5 px-3`}>
          {navCategories.map((category, index) => {
            // Check if category has any visible items
            const visibleItems = category.items.filter((item) => {
              // Skip items that should be hidden based on auth state
              if (
                (item.hideIfAuthenticated && user) ||
                (item.path === "/profile" && !user)
              ) {
                return false;
              }

              // Check if the item should be shown based on authentication status
              return shouldShowMenuItem(item.path);
            });

            // Skip the category if it has no visible items
            if (visibleItems.length === 0) return null;

            return (
              <div key={category.name} className={index !== 0 ? "mt-6" : ""}>
                {isOpen && (
                  <h4 className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {locale === "ar" ? category.nameAr : category.name}
                  </h4>
                )}
                <ul className="space-y-1">
                  {visibleItems.map((item) => (
                    <li key={item.path}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(item.path);
                        }}
                        className={`flex items-center p-2 rounded-lg ${
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
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

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

        {/* Login/Signup buttons for non-authenticated users */}
        {!user && isOpen && (
          <div className="p-4 border-t border-zinc-800/50">
            <div className="space-y-2.5">
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
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
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                {locale === "ar" ? "تسجيل الدخول" : "Log In"}
              </button>
              <button
                onClick={() => handleNavigation("/signup")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 hover:from-zinc-800 hover:to-zinc-800/50 text-zinc-300 hover:text-white font-medium border border-zinc-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
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
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
                {locale === "ar" ? "إنشاء حساب" : "Sign Up"}
              </button>
            </div>
          </div>
        )}

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
