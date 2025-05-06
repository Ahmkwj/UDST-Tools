import { useLocale } from "../../context/LanguageContext";
import LocalizedLink from "../LocalizedLink";

export default function Footer() {
  const locale = useLocale();

  const links = {
    tools: [
      { href: "/gpa-calculator", en: "GPA Calculator", ar: "حاسبة المعدل" },
      {
        href: "/grade-calculator",
        en: "Grade Calculator",
        ar: "حاسبة الدرجات",
      },
      {
        href: "/attendance-calculator",
        en: "Attendance Tracker",
        ar: "متابعة الحضور",
      },
      { href: "/schedule-planner", en: "Schedule Planner", ar: "مخطط الجدول" },
    ],
    resources: [
      { href: "/calendar", en: "Academic Calendar", ar: "التقويم الأكاديمي" },
      { href: "/links", en: "UDST Links", ar: "روابط UDST" },
      { href: "/guide", en: "User Guide", ar: "دليل المستخدم" },
      { href: "/feedback", en: "Feedback", ar: "الملاحظات" },
    ],
    info: [
      { href: "/about", en: "About", ar: "حول" },
      { href: "/privacy", en: "Privacy", ar: "الخصوصية" },
    ],
  };

  return (
    <footer className="relative z-10 w-full bg-gradient-to-b from-transparent to-zinc-900/50">
      {/* Main footer content */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  UT
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white">
                {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
              </h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {locale === "ar"
                ? "مجموعة شاملة من الأدوات الأكاديمية المصممة لتحسين تجربتك التعليمية"
                : "A comprehensive suite of academic tools designed to enhance your educational journey"}
            </p>
          </div>

          {/* Tools links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {locale === "ar" ? "الأدوات" : "Tools"}
            </h3>
            <ul className="space-y-2">
              {links.tools.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {locale === "ar" ? link.ar : link.en}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {locale === "ar" ? "المصادر" : "Resources"}
            </h3>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {locale === "ar" ? link.ar : link.en}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {locale === "ar" ? "تواصل معنا" : "Contact"}
            </h3>
            <div className="space-y-4">
              <a
                href="https://t.me/ahmkwj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all duration-200 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="flex-shrink-0 group-hover:scale-110 transition-transform"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
                </svg>
                <span className="text-sm">
                  {locale === "ar" ? "تواصل معي" : "Contact me"}
                </span>
              </a>

              <div className="flex flex-col space-y-2">
                {links.info.map((link) => (
                  <LocalizedLink
                    key={link.href}
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {locale === "ar" ? link.ar : link.en}
                  </LocalizedLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-500">
                {locale === "ar"
                  ? "صًنع بكل 💙 بواسطة أحمد"
                  : "Made with 💙 by Ahmed"}
              </p>
            </div>
            <p className="text-xs text-zinc-600">
              {locale === "ar"
                ? "مشروع مستقل، غير مرتبط بجامعة الدوحة للعلوم والتكنولوجيا"
                : "An independent project, not affiliated with UDST"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
