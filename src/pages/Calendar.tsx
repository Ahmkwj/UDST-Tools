import { useState } from "react";
import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import {
  academicCalendarData,
  type CalendarEvent,
} from "../data/academicCalendar";

export default function Calendar() {
  const locale = useLocale();
  const [selectedYear, setSelectedYear] = useState<string>(
    academicCalendarData[0].id
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
    academicCalendarData[0].semesters[0].id
  );

  // Get current academic year data
  const currentYear = academicCalendarData.find(
    (year) => year.id === selectedYear
  );
  const currentSemester = currentYear?.semesters.find(
    (sem) => sem.id === selectedSemester
  );

  // Function to format date
  const formatDate = (date: string | string[]) => {
    if (Array.isArray(date)) {
      const start = new Date(date[0]);
      const end = new Date(date[1]);
      return `${start.toLocaleDateString(
        locale === "ar" ? "ar-QA" : "en-US"
      )} - ${end.toLocaleDateString(locale === "ar" ? "ar-QA" : "en-US")}`;
    }
    return new Date(date).toLocaleDateString(
      locale === "ar" ? "ar-QA" : "en-US"
    );
  };

  // Get event type styles
  const getEventTypeStyles = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "holiday":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      case "exam":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "registration":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "deadline":
        return "bg-orange-500/20 text-orange-400 border-orange-500/20";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-3 md:py-8 px-2 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-3 sm:space-y-6 pt-4 sm:pt-8 pb-8 sm:pb-16">
          <PageHeader
            title={{
              en: "Academic Calendar",
              ar: "التقويم الأكاديمي",
            }}
            description={{
              en: "View important academic dates and events for each semester",
              ar: "عرض التواريخ والأحداث الأكاديمية المهمة لكل فصل دراسي",
            }}
          />

          {/* Filters */}
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Select
                label={locale === "ar" ? "السنة الأكاديمية" : "Academic Year"}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
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
              >
                {currentYear?.semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {locale === "ar" ? semester.nameAr : semester.nameEn}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          {/* Calendar Events */}
          <Card
            title={
              currentSemester
                ? locale === "ar"
                  ? currentSemester.nameAr
                  : currentSemester.nameEn
                : ""
            }
          >
            <div className="space-y-2.5 sm:space-y-3">
              {currentSemester?.events.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg border ${getEventTypeStyles(
                    event.type
                  )} flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 active:brightness-110 transition-all duration-200 touch-pan-x`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">
                        {locale === "ar" ? event.nameAr : event.nameEn}
                      </h3>
                    </div>
                    <div className="text-sm opacity-80">
                      {formatDate(event.date)}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${getEventTypeStyles(
                      event.type
                    )} whitespace-nowrap self-start sm:self-center`}
                  >
                    {event.type === "holiday" &&
                      (locale === "ar" ? "عطلة" : "Holiday")}
                    {event.type === "exam" &&
                      (locale === "ar" ? "اختبار" : "Exam")}
                    {event.type === "registration" &&
                      (locale === "ar" ? "تسجيل" : "Registration")}
                    {event.type === "deadline" &&
                      (locale === "ar" ? "موعد نهائي" : "Deadline")}
                    {event.type === "academic" &&
                      (locale === "ar" ? "أكاديمي" : "Academic")}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Legend */}
          <Card title={locale === "ar" ? "دليل الألوان" : "Color Legend"}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30">
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs sm:text-sm">
                  {locale === "ar" ? "عطلة" : "Holiday"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-xs sm:text-sm">
                  {locale === "ar" ? "اختبار" : "Exam"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-xs sm:text-sm">
                  {locale === "ar" ? "تسجيل" : "Registration"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-xs sm:text-sm">
                  {locale === "ar" ? "موعد نهائي" : "Deadline"}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/30">
                <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
                <span className="text-xs sm:text-sm">
                  {locale === "ar" ? "أكاديمي" : "Academic"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
