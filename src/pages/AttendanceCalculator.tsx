import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

type ClassInfo = {
  duration: number;
  missedTimes: number | string;
};

/* Match GPA Calculator: responsive padding, touch-friendly inputs */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const absenteeismCardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-6 lg:!px-8 lg:!pt-7 lg:!pb-7 flex flex-col`;
const sectionInnerClass = "bg-zinc-700/25 border border-zinc-600/30 rounded-xl";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] [&_input]:py-3 [&_select]:py-3 sm:[&_input]:min-h-0 sm:[&_select]:min-h-0 sm:[&_input]:py-2.5 sm:[&_select]:py-2.5";
const sectionGap = "space-y-8 sm:space-y-12";

export default function AttendanceCalculator() {
  const locale = useLocale();
  const [absenteeismPercentage, setAbsenteeismPercentage] =
    useState<string>("");
  const [weeksInSemester, setWeeksInSemester] = useState<string>("14");
  const [classesPerWeek, setClassesPerWeek] = useState<number>(0);
  const [classInfos, setClassInfos] = useState<ClassInfo[]>([]);
  const [newAbsenteeismPercentage, setNewAbsenteeismPercentage] =
    useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(true);

  useEffect(() => {
    const warningDismissed = localStorage.getItem("attendanceWarningDismissed");
    if (warningDismissed) setShowWarning(false);
  }, []);

  const dismissWarning = () => {
    setShowWarning(false);
    localStorage.setItem("attendanceWarningDismissed", "true");
  };

  useEffect(() => {
    let newClassInfos: ClassInfo[] = [];
    if (classesPerWeek > classInfos.length) {
      newClassInfos = [
        ...classInfos,
        ...Array(classesPerWeek - classInfos.length)
          .fill(null)
          .map(() => ({ duration: 60, missedTimes: 0 })),
      ];
    } else {
      newClassInfos = classInfos.slice(0, classesPerWeek);
    }
    setClassInfos(newClassInfos);
  }, [classesPerWeek]);

  useEffect(() => {
    calculateAttendance();
  }, [absenteeismPercentage, weeksInSemester, classInfos]);

  const updateClassInfo = (
    index: number,
    field: keyof ClassInfo,
    value: number | string,
  ) => {
    const updatedClassInfos = [...classInfos];
    if (field === "duration" && typeof value === "number")
      value = Math.max(0, value);
    if (field === "missedTimes" && typeof value === "number")
      value = Math.max(0, value);
    updatedClassInfos[index] = { ...updatedClassInfos[index], [field]: value };
    setClassInfos(updatedClassInfos);
  };

  const calculateAttendance = () => {
    const currentAbsenteeismPercentage = parseFloat(absenteeismPercentage) || 0;
    const weeks = parseInt(weeksInSemester) || 0;
    let totalClassMinutes = 0;
    let totalMissedMinutes = 0;
    classInfos.forEach((classInfo) => {
      const classDurationMinutes = classInfo.duration || 0;
      totalClassMinutes += classDurationMinutes * weeks;
      let missedMinutes = 0;
      if (typeof classInfo.missedTimes === "number") {
        missedMinutes = classInfo.missedTimes * classDurationMinutes;
      } else if (typeof classInfo.missedTimes === "string") {
        missedMinutes = parseInt(classInfo.missedTimes) || 0;
      }
      totalMissedMinutes += missedMinutes;
    });
    let calculatedPercentage = currentAbsenteeismPercentage;
    if (totalClassMinutes > 0) {
      calculatedPercentage += (totalMissedMinutes / totalClassMinutes) * 100;
    }
    setNewAbsenteeismPercentage(calculatedPercentage);
  };

  const handleCustomInput = (index: number) => {
    const updatedClassInfos = [...classInfos];
    updatedClassInfos[index].missedTimes = "";
    setClassInfos(updatedClassInfos);
  };

  const limitPercent = 15;
  const barFillPercent = Math.min(
    100,
    (newAbsenteeismPercentage / limitPercent) * 100,
  );

  // Total classes left across all (for summary)
  let totalRemainingClasses = 0;
  if (classesPerWeek > 0) {
    classInfos.forEach((classInfo) => {
      const totalMinutesInSemester =
        (classInfo.duration || 0) * parseInt(weeksInSemester || "0");
      const maxMissedMinutes = totalMinutesInSemester * 0.15;
      let currentMissedMinutes = 0;
      if (typeof classInfo.missedTimes === "number") {
        currentMissedMinutes =
          classInfo.missedTimes * (classInfo.duration || 0);
      } else {
        currentMissedMinutes = parseInt(classInfo.missedTimes || "0");
      }
      const remainingMinutes = Math.max(
        0,
        maxMissedMinutes - currentMissedMinutes,
      );
      totalRemainingClasses +=
        classInfo.duration > 0
          ? Math.floor(remainingMinutes / classInfo.duration)
          : 0;
    });
  }

  const statusText =
    newAbsenteeismPercentage <= 5
      ? locale === "ar"
        ? "حضور ممتاز"
        : "Excellent attendance"
      : newAbsenteeismPercentage <= 10
        ? locale === "ar"
          ? "كن حذراً مع الغياب"
          : "Be cautious with absences"
        : newAbsenteeismPercentage >= 15
          ? locale === "ar"
            ? "تم تجاوز الحد"
            : "Limit exceeded"
          : locale === "ar"
            ? "قريب من الحد"
            : "Near limit";

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "Attendance Calculator",
              ar: "حاسبة الحضور",
            }}
            description={{
              en: "Track your class attendance, calculate absence percentages, and plan your remaining absences within the allowed limits.",
              ar: "تتبع حضورك في المحاضرات، احسب نسب الغياب، وخطط لغياباتك المتبقية ضمن الحدود المسموح بها.",
            }}
          />

          <div className={sectionGap}>
            {/* Row 1: Absenteeism + Semester Setup side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <Card
                title={locale === "ar" ? "نسبة الغياب" : "Absenteeism"}
                className={absenteeismCardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "نسبة غيابك الحالية ومدى اقترابك من حد 15%."
                    : "Your current absence rate and how close you are to the 15% limit."}
                </p>
                <div className="flex flex-1 flex-col min-h-[120px] sm:min-h-[180px] w-full">
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums tracking-tight text-blue-400 text-center">
                      {newAbsenteeismPercentage.toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-full pt-4 mt-auto space-y-2">
                    <div className="h-3 w-full rounded-full bg-zinc-700/60 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(barFillPercent, 0.5)}%` }}
                        className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out min-w-[6px]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">
                        {statusText}
                      </p>
                      <span className="text-[10px] text-zinc-500 tabular-nums">
                        0% — 15%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title={locale === "ar" ? "إعداد الفصل" : "Semester Setup"}
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "أدخل بيانات الفصل ونسبة الغياب الحالية من سجلك."
                    : "Enter your semester details and current absence from your record."}
                </p>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <Input
                    label={
                      locale === "ar"
                        ? "نسبة الغياب الحالية"
                        : "Current Absenteeism %"
                    }
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder={locale === "ar" ? "مثال: 3.5" : "e.g. 3.5"}
                    value={absenteeismPercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (e.target.value === "" || isNaN(value)) {
                        setAbsenteeismPercentage("");
                      } else {
                        setAbsenteeismPercentage(
                          Math.max(0, Math.min(100, value)).toString(),
                        );
                      }
                    }}
                    helperText={
                      locale === "ar" ? "0 إن لم تتغيب من قبل" : "0 if none yet"
                    }
                    className={inputSelectClass}
                  />
                  <Input
                    label={
                      locale === "ar" ? "أسابيع الفصل" : "Weeks in Semester"
                    }
                    type="number"
                    min="1"
                    step="1"
                    placeholder="14"
                    value={weeksInSemester}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (e.target.value === "" || isNaN(value)) {
                        setWeeksInSemester("");
                      } else {
                        setWeeksInSemester(Math.max(1, value).toString());
                      }
                    }}
                    helperText={
                      locale === "ar"
                        ? "14 خريفي/شتوي، 6 صيفي"
                        : "14 Fall/Winter, 6 Spring"
                    }
                    className={inputSelectClass}
                  />
                  <Select
                    label={
                      locale === "ar" ? "محاضرات/أسبوع" : "Classes per Week"
                    }
                    value={classesPerWeek}
                    onChange={(e) =>
                      setClassesPerWeek(parseInt(e.target.value, 10))
                    }
                    className={inputSelectClass}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>
            </div>

            {/* Row 2: Classes & Remaining full width */}
            <Card
              title={
                locale === "ar" ? "المحاضرات والمتبقي" : "Classes & Remaining"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                {locale === "ar"
                  ? "أضف كل محاضرة وتتبع الجلسات الغائبة والمتبقي المسموح."
                  : "Add each class and track missed sessions and remaining allowance."}
              </p>
              {classesPerWeek === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-28 text-center">
                  <div
                    className={`w-20 h-20 rounded-2xl ${sectionInnerClass} flex items-center justify-center mb-5`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-white">
                    {locale === "ar"
                      ? "لم يتم اختيار محاضرات"
                      : "No Classes Selected"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-[280px]">
                    {locale === "ar"
                      ? "اختر عدد المحاضرات في الأسبوع أعلاه"
                      : "Select classes per week above"}
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {classInfos.map((classInfo, index) => {
                    const totalMinutesInSemester =
                      (classInfo.duration || 0) *
                      parseInt(weeksInSemester || "0");
                    const maxMissedMinutes = totalMinutesInSemester * 0.15;
                    let currentMissedMinutes = 0;
                    if (typeof classInfo.missedTimes === "number") {
                      currentMissedMinutes =
                        classInfo.missedTimes * (classInfo.duration || 0);
                    } else {
                      currentMissedMinutes = parseInt(
                        classInfo.missedTimes || "0",
                      );
                    }
                    const remainingMinutes = Math.max(
                      0,
                      maxMissedMinutes - currentMissedMinutes,
                    );
                    const remainingClasses =
                      classInfo.duration > 0
                        ? Math.floor(remainingMinutes / classInfo.duration)
                        : 0;
                    const classAbsenteeismPercentage =
                      totalMinutesInSemester > 0
                        ? (currentMissedMinutes / totalMinutesInSemester) * 100
                        : 0;
                    const isOver =
                      newAbsenteeismPercentage >= 15 ||
                      classAbsenteeismPercentage >= 15;

                    return (
                      <div
                        key={index}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 ${
                          index > 0 ? "border-t border-zinc-600/25" : ""
                        }`}
                      >
                        <div className="shrink-0 w-full sm:w-20 lg:w-24 flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate block">
                            {locale === "ar"
                              ? `المحاضرة ${index + 1}`
                              : `Class ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                              {locale === "ar" ? "المدة" : "Duration"}
                            </span>
                            <Select
                              value={classInfo.duration}
                              onChange={(e) =>
                                updateClassInfo(
                                  index,
                                  "duration",
                                  parseInt(e.target.value),
                                )
                              }
                              className={`${inputSelectClass} !mb-0 min-w-[100px] [&_select]:py-2 [&_select]:text-sm w-full sm:w-auto`}
                            >
                              <option value={30}>
                                {locale === "ar" ? "30 د" : "30 min"}
                              </option>
                              <option value={60}>
                                {locale === "ar" ? "1 ساعة" : "1 hr"}
                              </option>
                              <option value={90}>
                                {locale === "ar" ? "1.5 ساعة" : "1.5 hr"}
                              </option>
                              <option value={120}>
                                {locale === "ar" ? "2 ساعة" : "2 hr"}
                              </option>
                              <option value={150}>
                                {locale === "ar" ? "2.5 ساعة" : "2.5 hr"}
                              </option>
                              <option value={180}>
                                {locale === "ar" ? "3 ساعات" : "3 hr"}
                              </option>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                              {locale === "ar" ? "الغياب" : "Missed"}
                            </span>
                            {typeof classInfo.missedTimes === "number" ? (
                              <Select
                                value={classInfo.missedTimes}
                                onChange={(e) => {
                                  if (e.target.value === "custom") {
                                    handleCustomInput(index);
                                  } else {
                                    updateClassInfo(
                                      index,
                                      "missedTimes",
                                      parseInt(e.target.value),
                                    );
                                  }
                                }}
                                className={`${inputSelectClass} !mb-0 min-w-[72px] w-full sm:w-auto [&_select]:py-2 [&_select]:text-sm`}
                              >
                                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                                <option value="custom">
                                  {locale === "ar" ? "تخصيص" : "Custom"}
                                </option>
                              </Select>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={classInfo.missedTimes}
                                onChange={(e) =>
                                  updateClassInfo(
                                    index,
                                    "missedTimes",
                                    e.target.value,
                                  )
                                }
                                className={`${inputSelectClass} !mb-0 w-20 min-w-[72px] [&_input]:py-2 [&_input]:text-center`}
                              />
                            )}
                          </div>
                          <div
                            className={`flex items-center gap-2 w-full sm:w-auto pt-2 mt-2 border-t border-zinc-600/25 sm:pt-0 sm:mt-0 sm:border-t-0 sm:border-zinc-600/40 ${
                              locale === "ar"
                                ? "sm:border-r sm:pr-5"
                                : "sm:border-l sm:pl-5"
                            }`}
                          >
                            <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                              {locale === "ar" ? "المتبقي" : "Left"}
                            </span>
                            <span
                              className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-2 sm:py-1.5 rounded-xl text-sm font-semibold tabular-nums ${
                                isOver
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-blue-500/15 text-blue-400"
                              }`}
                            >
                              {isOver
                                ? locale === "ar"
                                  ? "تجاوز"
                                  : "Over"
                                : remainingClasses}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Notice */}
            {showWarning && (
              <Card
                title={locale === "ar" ? "تنبيه" : "Notice"}
                className={`${cardClass} !py-4 sm:!py-5 lg:!py-6 border-s-4 border-s-amber-400/30`}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "معلومات مهمة حول دقة نظام الحضور."
                    : "Important information about attendance system accuracy."}
                </p>
                <div className="flex gap-3 sm:gap-4 items-start">
                  <p className="flex-1 min-w-0 text-sm text-zinc-400 leading-relaxed">
                    {locale === "ar"
                      ? "يرجى عدم الاعتماد بشكل كامل على هذه النتائج، خصوصًا عند اقتراب نسبة الغياب من 15%. نظام الحضور قد لا يكون دقيقًا دائمًا."
                      : "Please don't rely solely on these results, especially when attendance is close to 15%. The attendance system may not always be accurate."}
                  </p>
                  <button
                    onClick={dismissWarning}
                    className="flex-shrink-0 p-2.5 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700/40 transition-colors"
                    title={locale === "ar" ? "إغلاق" : "Close"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
