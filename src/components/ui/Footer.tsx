import { useLocale } from "../../context/LanguageContext";
import LocalizedLink from "../LocalizedLink";

export default function Footer() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const columns = [
    {
      headingEn: "Tools",
      headingAr: "الأدوات",
      links: [
        { href: "/gpa-calculator", en: "GPA Calculator", ar: "حاسبة المعدل" },
        { href: "/grade-calculator", en: "Grade Calculator", ar: "حاسبة الدرجات" },
        { href: "/attendance-calculator", en: "Attendance Tracker", ar: "متابعة الحضور" },
        { href: "/fees-manager", en: "Fees Manager", ar: "إدارة الرسوم" },
      ],
    },
    {
      headingEn: "Academic",
      headingAr: "الأكاديمية",
      links: [
        { href: "/calendar", en: "Academic Calendar", ar: "التقويم الأكاديمي" },
        { href: "/ramadan-schedule", en: "Ramadan Schedule", ar: "جدول رمضان" },
        { href: "/schedule-planner", en: "Schedule Planner", ar: "مخطط الجدول" },
        { href: "/links", en: "UDST Links", ar: "روابط UDST" },
      ],
    },
    {
      headingEn: "Help",
      headingAr: "مساعدة",
      links: [
        { href: "/guide", en: "User Guide", ar: "دليل المستخدم" },
        { href: "/about", en: "About", ar: "حول" },
        { href: "/privacy", en: "Privacy", ar: "الخصوصية" },
      ],
    },
  ];

  return (
    <footer className="relative z-10 w-full border-t border-zinc-700/40 bg-zinc-900/60">
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-400">UT</span>
              </div>
              <span className="text-sm font-semibold text-white">
                {isRTL ? "أدوات UDST" : "UDST Tools"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
              {isRTL
                ? "أدوات أكاديمية مجانية مصممة لطلاب UDST."
                : "Free academic tools built for UDST students."}
            </p>
            <a
              href="https://t.me/ahmkwj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="shrink-0"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
              </svg>
              {isRTL ? "تواصل" : "Contact"}
            </a>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.headingEn}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                {isRTL ? col.headingAr : col.headingEn}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <LocalizedLink
                      href={link.href}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {isRTL ? link.ar : link.en}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-5 border-t border-zinc-700/30 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-[11px] text-zinc-600">
            {isRTL ? "تم بواسطة أحمد :)" : "Created by Ahmed :)"}
          </p>
          <p className="text-[11px] text-zinc-600">
            {isRTL
              ? "مشروع مستقل، غير مرتبط بـ UDST"
              : "Independent project, not affiliated with UDST"}
          </p>
          <a
            href="https://github.com/ahmkwj/udst-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="shrink-0"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            <span>
              {isRTL
                ? "مشروع مفتوح المصدر على GitHub، لا تتردد بالمساهمة"
                : "Open-source on GitHub — feel free to contribute"}
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
