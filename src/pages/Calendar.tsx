import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { academicCalendarData } from "../data/academicCalendar";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

const EVENT_STYLES: Record<string, { dot: string; bg: string; border: string; text: string; label: { en: string; ar: string } }> = {
  holiday:      { dot: "bg-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: { en: "Holiday", ar: "عطلة" } },
  exam:         { dot: "bg-red-500",     bg: "bg-red-500/10",     border: "border-red-500/20",     text: "text-red-400",     label: { en: "Exam", ar: "اختبار" } },
  registration: { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400",    label: { en: "Registration", ar: "تسجيل" } },
  deadline:     { dot: "bg-amber-500",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   label: { en: "Deadline", ar: "موعد نهائي" } },
  academic:     { dot: "bg-zinc-400",    bg: "bg-zinc-500/10",    border: "border-zinc-500/20",    text: "text-zinc-400",    label: { en: "Academic", ar: "أكاديمي" } },
};

function getStyle(type?: string) {
  return EVENT_STYLES[type || "academic"] || EVENT_STYLES.academic;
}

function formatDate(date: string | string[], locale: string) {
  const loc = locale === "ar" ? "ar-QA" : "en-US";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (Array.isArray(date)) {
    const s = new Date(date[0]);
    const e = new Date(date[1]);
    return `${s.toLocaleDateString(loc, opts)} - ${e.toLocaleDateString(loc, opts)}`;
  }
  const d = new Date(date);
  return d.toLocaleDateString(loc, { ...opts, year: "numeric" });
}

function isUpcoming(date: string | string[]) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = Array.isArray(date) ? new Date(date[1]) : new Date(date);
  return d >= now;
}

export default function Calendar() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [selectedYear, setSelectedYear] = useLocalStorage("cal-selectedYear", academicCalendarData[0].id);
  const [selectedSemester, setSelectedSemester] = useLocalStorage("cal-selectedSemester", academicCalendarData[0].semesters[0].id);

  const currentYear = academicCalendarData.find((y) => y.id === selectedYear);
  const currentSemester = currentYear?.semesters.find((s) => s.id === selectedSemester);
  const events = currentSemester?.events || [];

  const eventCounts = events.reduce<Record<string, number>>((acc, e) => {
    const t = e.type || "academic";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const upcomingIdx = events.findIndex((e) => isUpcoming(e.date));

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Academic Calendar", ar: "التقويم الأكاديمي" }}
            description={{
              en: "Important dates and events for each academic semester.",
              ar: "التواريخ والأحداث المهمة لكل فصل دراسي.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ FILTERS + STATS ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Filters -- 3 cols */}
              <Card
                title={isRTL ? "اختيار الفصل" : "Select Semester"}
                className={`${cardClass} lg:col-span-3`}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "اختر السنة الأكاديمية والفصل لعرض الأحداث."
                    : "Choose an academic year and semester to view events."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                      {isRTL ? "السنة الأكاديمية" : "Academic Year"}
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        const yr = academicCalendarData.find((y) => y.id === e.target.value);
                        if (yr) setSelectedSemester(yr.semesters[0].id);
                      }}
                      className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                      {academicCalendarData.map((yr) => (
                        <option key={yr.id} value={yr.id}>
                          {isRTL ? yr.nameAr : yr.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                      {isRTL ? "الفصل الدراسي" : "Semester"}
                    </label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    >
                      {currentYear?.semesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {isRTL ? sem.nameAr : sem.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* semester pill tabs */}
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-zinc-700/40">
                  {currentYear?.semesters.map((sem) => {
                    const active = sem.id === selectedSemester;
                    return (
                      <button
                        key={sem.id}
                        type="button"
                        onClick={() => setSelectedSemester(sem.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          active
                            ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
                            : "bg-zinc-700/20 border-zinc-600/30 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500/40"
                        }`}
                      >
                        {isRTL ? sem.nameAr : sem.nameEn}
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Stats -- 2 cols */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="text-center mb-5">
                  <p className="text-4xl font-bold text-blue-400 tabular-nums">
                    {events.length}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">
                    {isRTL ? "حدث" : "Events"}
                  </p>
                </div>

                <div className="space-y-2">
                  {Object.entries(EVENT_STYLES).map(([type, style]) => {
                    const count = eventCounts[type] || 0;
                    if (count === 0) return null;
                    return (
                      <div key={type} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                          <span className="text-xs text-zinc-400">
                            {isRTL ? style.label.ar : style.label.en}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-zinc-300 tabular-nums">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* ════════ EVENTS TIMELINE ════════ */}
            <Card
              title={
                currentSemester
                  ? isRTL ? currentSemester.nameAr : currentSemester.nameEn
                  : isRTL ? "الأحداث" : "Events"
              }
              className={cardClass}
            >
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-700/30 border border-zinc-600/30 flex items-center justify-center mb-4">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-zinc-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {isRTL ? "لا توجد أحداث" : "No events"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    {isRTL ? "اختر فصل آخر." : "Select a different semester."}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* timeline line */}
                  <div className="absolute top-0 bottom-0 start-[11px] w-px bg-zinc-700/40" />

                  <div className="space-y-0">
                    {events.map((event, i) => {
                      const style = getStyle(event.type);
                      const upcoming = i === upcomingIdx;
                      const past = upcomingIdx >= 0 && i < upcomingIdx;

                      return (
                        <div key={i} className="relative">
                          {/* upcoming marker */}
                          {upcoming && (
                            <div className="flex items-center gap-2 mb-2 ms-7">
                              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                                {isRTL ? "القادم" : "Upcoming"}
                              </span>
                              <div className="flex-1 h-px bg-blue-500/20" />
                            </div>
                          )}

                          <div
                            className={`flex items-start gap-3.5 py-3 sm:py-3.5 transition-opacity ${
                              past ? "opacity-50" : ""
                            }`}
                          >
                            {/* dot */}
                            <div className="relative z-10 mt-1.5 shrink-0">
                              <div
                                className={`w-[9px] h-[9px] rounded-full ring-[3px] ring-zinc-900 ${style.dot} ${
                                  upcoming ? "ring-blue-500/20" : ""
                                }`}
                              />
                            </div>

                            {/* content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                                <div className="min-w-0 flex-1">
                                  <p className={`text-sm font-medium ${past ? "text-zinc-500" : "text-white"}`}>
                                    {isRTL ? event.nameAr : event.nameEn}
                                    {event.tentative && (
                                      <span className="text-zinc-600 font-normal ms-1 text-xs">
                                        *
                                      </span>
                                    )}
                                  </p>
                                  <p className={`text-xs mt-0.5 tabular-nums ${past ? "text-zinc-600" : "text-zinc-500"}`}>
                                    {formatDate(event.date, locale)}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex self-start items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${style.bg} ${style.text} ${style.border}`}
                                >
                                  {isRTL ? style.label.ar : style.label.en}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {events.some((e) => e.tentative) && (
                    <p className="text-[10px] text-zinc-600 mt-4 pt-3 border-t border-zinc-700/30 ms-7">
                      {isRTL ? "* تواريخ مؤقتة وقابلة للتغيير." : "* Tentative dates, subject to change."}
                    </p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
