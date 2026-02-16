import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import {
  academicCalendarData,
  type CalendarEvent,
} from "../data/academicCalendar";

/* Theme: match Attendance / GPA / Grade Calculator */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] [&_input]:py-3 [&_select]:py-3 sm:[&_input]:min-h-0 sm:[&_select]:min-h-0 sm:[&_input]:py-2.5 sm:[&_select]:py-2.5";
const sectionGap = "space-y-8 sm:space-y-12";

export default function Calendar() {
  const locale = useLocale();
  const [selectedYear, setSelectedYear] = useLocalStorage<string>(
    "cal-selectedYear",
    academicCalendarData[0].id
  );
  const [selectedSemester, setSelectedSemester] = useLocalStorage<string>(
    "cal-selectedSemester",
    academicCalendarData[0].semesters[0].id
  );

  const currentYear = academicCalendarData.find(
    (year) => year.id === selectedYear
  );
  const currentSemester = currentYear?.semesters.find(
    (sem) => sem.id === selectedSemester
  );

  const formatDate = (date: string | string[]) => {
    if (Array.isArray(date)) {
      const start = new Date(date[0]);
      const end = new Date(date[1]);
      return `${start.toLocaleDateString(
        locale === "ar" ? "ar-QA" : "en-US"
      )} – ${end.toLocaleDateString(locale === "ar" ? "ar-QA" : "en-US")}`;
    }
    return new Date(date).toLocaleDateString(
      locale === "ar" ? "ar-QA" : "en-US"
    );
  };

  const getEventTypeStyles = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "holiday":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "exam":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      case "registration":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "deadline":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      default:
        return "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    }
  };

  const getTypeLabel = (type: CalendarEvent["type"]) => {
    if (type === "holiday") return locale === "ar" ? "عطلة" : "Holiday";
    if (type === "exam") return locale === "ar" ? "اختبار" : "Exam";
    if (type === "registration") return locale === "ar" ? "تسجيل" : "Registration";
    if (type === "deadline") return locale === "ar" ? "موعد نهائي" : "Deadline";
    return locale === "ar" ? "أكاديمي" : "Academic";
  };

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "Academic Calendar",
              ar: "التقويم الأكاديمي",
            }}
            description={{
              en: "Important dates and events by year and semester.",
              ar: "التواريخ والأحداث المهمة حسب السنة والفصل.",
            }}
          />

          <div className={sectionGap}>
            {/* Row 1: Filters + Legend side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <Card
                title={locale === "ar" ? "اختيار الفصل" : "Select Semester"}
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                  {locale === "ar"
                    ? "اختر السنة الأكاديمية والفصل لعرض التواريخ والأحداث."
                    : "Choose academic year and semester to view dates and events."}
                </p>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <Select
                    label={locale === "ar" ? "السنة الأكاديمية" : "Academic year"}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className={inputSelectClass}
                  >
                    {academicCalendarData.map((year) => (
                      <option key={year.id} value={year.id}>
                        {locale === "ar" ? year.nameAr : year.nameEn}
                      </option>
                    ))}
                  </Select>
                  <Select
                    label={locale === "ar" ? "الفصل الدراسي" : "Semester"}
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className={inputSelectClass}
                  >
                    {currentYear?.semesters.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {locale === "ar" ? semester.nameAr : semester.nameEn}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>

              <Card
                title={locale === "ar" ? "دليل الأنواع" : "Event Types"}
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                  {locale === "ar"
                    ? "رموز أنواع الأحداث في القائمة أدناه."
                    : "Legend for event types shown in the list below."}
                </p>
                <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 p-4 sm:p-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-y-2">
                    {(["holiday", "exam", "registration", "deadline", "academic"] as const).map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            type === "holiday"
                              ? "bg-emerald-400"
                              : type === "exam"
                                ? "bg-red-400"
                                : type === "registration"
                                  ? "bg-blue-400"
                                  : type === "deadline"
                                    ? "bg-orange-400"
                                    : "bg-zinc-400"
                          }`}
                        />
                        <span className="text-xs text-zinc-400">
                          {getTypeLabel(type)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Row 2: Events list */}
            <Card
              title={
                currentSemester
                  ? locale === "ar"
                    ? currentSemester.nameAr
                    : currentSemester.nameEn
                  : locale === "ar"
                    ? "الأحداث"
                    : "Events"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "قائمة التواريخ والأحداث للفصل المحدد."
                  : "List of dates and events for the selected semester."}
              </p>
              {!currentSemester?.events.length ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center rounded-xl border border-zinc-600/30 border-dashed bg-zinc-800/20">
                  <p className="text-zinc-400 text-sm mb-1">
                    {locale === "ar" ? "لا توجد أحداث" : "No events"}
                  </p>
                  <p className="text-zinc-500 text-xs max-w-[240px] leading-relaxed">
                    {locale === "ar" ? "اختر سنة وفصل مختلفين." : "Select a different year or semester."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 overflow-hidden">
                  {currentSemester.events.map((event, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5 ${
                        index > 0 ? "border-t border-zinc-600/25" : ""
                      } ${locale === "ar" ? "sm:flex-row-reverse" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm sm:text-base">
                          {locale === "ar" ? event.nameAr : event.nameEn}
                          {event.tentative && (
                            <span className="text-zinc-500 font-normal ms-1">
                              {locale === "ar" ? "(مؤقت)" : "*Tentative"}
                            </span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                          {formatDate(event.date)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1.5 rounded-lg border whitespace-nowrap shrink-0 self-start sm:self-center ${getEventTypeStyles(
                          event.type
                        )}`}
                      >
                        {getTypeLabel(event.type)}
                      </span>
                    </div>
                  ))}
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
