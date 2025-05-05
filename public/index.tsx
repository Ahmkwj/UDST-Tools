import * as React from "react";
import { useLocale } from "../src/context/LanguageContext";

const Home: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-blue-900/5 blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-blue-900/5 blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 max-w-4xl w-full text-center px-4 md:px-6 py-6 md:py-12 space-y-6 md:space-y-8 ${
          isRTL ? "rtl" : ""
        }`}
      >
        {/* Title */}
        <div className="space-y-4 animate-fade-in pt-4 md:pt-0">
          <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              UT
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
            </h1>
            <div className="h-1 w-12 md:w-20 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 mt-3"></div>
            <p className="text-sm md:text-base lg:text-lg text-zinc-300 mt-3 max-w-2xl mx-auto px-4">
              {locale === "ar"
                ? "مجموعة شاملة من الأدوات الأكاديمية لمساعدتك في رحلتك التعليمية"
                : "A comprehensive suite of academic tools to assist you in your educational journey"}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 max-w-3xl mx-auto">
          <a
            href="/gpa-calculator"
            className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 hover:transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
                />
              </svg>
            </div>
            <h2 className="font-medium text-sm sm:text-base text-white mb-0.5 sm:mb-1">
              {locale === "ar" ? "حاسبة المعدل" : "GPA Calculator"}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400">
              {locale === "ar"
                ? "احسب وتوقع معدلك التراكمي"
                : "Calculate and predict your GPA"}
            </p>
          </a>

          <a
            href="/grade-calculator"
            className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 hover:transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
            <h2 className="font-medium text-sm sm:text-base text-white mb-0.5 sm:mb-1">
              {locale === "ar" ? "حاسبة الدرجات" : "Grade Calculator"}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400">
              {locale === "ar"
                ? "احسب درجاتك النهائية بدقة"
                : "Calculate your final grades accurately"}
            </p>
          </a>

          <a
            href="/attendance-calculator"
            className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 hover:transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </div>
            <h2 className="font-medium text-sm sm:text-base text-white mb-0.5 sm:mb-1">
              {locale === "ar" ? "حاسبة الحضور" : "Attendance"}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400">
              {locale === "ar"
                ? "تتبع وخطط لحضورك بفعالية"
                : "Track and plan your attendance effectively"}
            </p>
          </a>

          <a
            href="/schedule-planner"
            className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 hover:transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="font-medium text-sm sm:text-base text-white mb-0.5 sm:mb-1">
              {locale === "ar" ? "مخطط الجدول" : "Schedule Planner"}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400">
              {locale === "ar"
                ? "خطط جدولك واكتشف التعارضات"
                : "Plan schedule and detect conflicts"}
            </p>
          </a>

          <a
            href="/calendar"
            className="p-3 sm:p-4 rounded-xl backdrop-blur-sm bg-zinc-900/70 ring-1 ring-zinc-800/50 hover:ring-blue-500/50 hover:transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <h2 className="font-medium text-sm sm:text-base text-white mb-0.5 sm:mb-1">
              {locale === "ar" ? "التقويم الأكاديمي" : "Calendar"}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400">
              {locale === "ar"
                ? "تتبع المواعيد المهمة"
                : "Track important academic dates"}
            </p>
          </a>
        </div>

        {/* Guide Button */}
        <div className="pt-2">
          <a
            href="/guide"
            className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group transform hover:scale-105 text-xs sm:text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 ltr:mr-2 rtl:ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            {locale === "ar" ? "دليل الاستخدام" : "User Guide"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 ltr:ml-2 rtl:mr-2 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>

        {/* Disclaimer */}
        <div>
          <p className="text-[10px] sm:text-xs text-zinc-400 max-w-lg mx-auto px-4">
            {locale === "ar"
              ? "مشروع طلابي مستقل، غير مرتبط بجامعة الدوحة للعلوم والتكنولوجيا"
              : "An independent student project, not affiliated with UDST"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
