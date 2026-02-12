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

/* Theme: match Attendance / GPA / Grade Calculator */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_select]:py-2.5";
const sectionGap = "space-y-12";

export default function Calendar() {
  const locale = useLocale();
  const [selectedYear, setSelectedYear] = useState<string>(
    academicCalendarData[0].id
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
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
    <div className="min-h-screen w-full flex flex-col text-white">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8 overflow-x-hidden overflow-y-auto">
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
                <div className="grid grid-cols-1 gap-6">
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
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {(["holiday", "exam", "registration", "deadline", "academic"] as const).map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
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
              </Card>
            </div>

            {/* Row 2: Events list - no inner cards, simple rows */}
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
              <div className="space-y-0">
                {currentSemester?.events.map((event, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 ${
                      index > 0 ? "border-t border-zinc-600/25" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">
                        {locale === "ar" ? event.nameAr : event.nameEn}
                      </p>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {formatDate(event.date)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap self-start sm:self-center ${getEventTypeStyles(
                        event.type
                      )}`}
                    >
                      {getTypeLabel(event.type)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
