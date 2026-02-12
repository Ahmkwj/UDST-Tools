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
    <footer className="relative z-10 w-full border-t border-zinc-600/40 bg-zinc-800/30">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-zinc-600/40 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-400">UT</span>
              </div>
              <h2 className="text-sm font-semibold text-white">
                {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {locale === "ar" ? "أدوات أكاديمية لتحسين تجربتك الدراسية" : "Academic tools to support your studies"}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 border-b border-zinc-600/25 pb-2 w-fit">
              {locale === "ar" ? "الأدوات" : "Tools"}
            </h3>
            <ul className="space-y-2">
              {links.tools.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {locale === "ar" ? link.ar : link.en}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 border-b border-zinc-600/25 pb-2 w-fit">
              {locale === "ar" ? "الموارد" : "Resources"}
            </h3>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {locale === "ar" ? link.ar : link.en}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 border-b border-zinc-600/25 pb-2 w-fit">
              {locale === "ar" ? "تواصل" : "Contact"}
            </h3>
            <div className="space-y-3">
              <a
                href="https://t.me/ahmkwj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-700/50 border border-zinc-600/40 hover:bg-zinc-600/40 text-zinc-300 hover:text-white transition-all duration-200 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="flex-shrink-0"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
                </svg>
                {locale === "ar" ? "تواصل معي" : "Contact me"}
              </a>
              <ul className="space-y-2">
                {links.info.map((link) => (
                  <li key={link.href}>
                    <LocalizedLink
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {locale === "ar" ? link.ar : link.en}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-600/25 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            {locale === "ar" ? "بواسطة أحمد" : "By Ahmed"}
          </p>
          <p className="text-xs text-zinc-500">
            {locale === "ar" ? "مشروع مستقل، غير مرتبط بـ UDST" : "Independent project, not affiliated with UDST"}
          </p>
        </div>
      </div>
    </footer>
  );
}
