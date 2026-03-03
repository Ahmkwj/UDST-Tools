import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] sm:[&_input]:min-h-0 sm:[&_select]:min-h-0";

type Course = {
  grade: string;
  credits: number;
  isRepeat: boolean;
  previousGrade: string;
};

const GRADE_MAP: Record<string, number> = {
  A: 4.0,
  "B+": 3.5,
  B: 3.0,
  "C+": 2.5,
  C: 2.0,
  "D+": 1.5,
  D: 1.0,
  F: 0.0,
  W: 0.0,
};

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "B+": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  B: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "C+": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  C: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "D+": "text-red-400 bg-red-500/10 border-red-500/20",
  D: "text-red-400 bg-red-500/10 border-red-500/20",
  F: "text-red-400 bg-red-500/10 border-red-500/20",
  W: "text-zinc-400 bg-zinc-700/30 border-zinc-600/30",
};

/* ── GPA Ring ── */
function GPARing({ gpa }: { gpa: number }) {
  const size = 160;
  const strokeWidth = 10;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(gpa / 4, 1);
  const offset = circ * (1 - filled);

  const color =
    gpa >= 3.5
      ? "#10b981"
      : gpa >= 3.0
        ? "#3b82f6"
        : gpa >= 2.0
          ? "#f59e0b"
          : "#ef4444";

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-zinc-700/50"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export default function GPACalculator() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [totalGradePoints, setTotalGradePoints] = useLocalStorage<
    number | string
  >("gpa-totalGradePoints", "");
  const [totalCredits, setTotalCredits] = useLocalStorage<number | string>(
    "gpa-totalCredits",
    "",
  );
  const [numberOfCourses, setNumberOfCourses] = useLocalStorage<number>(
    "gpa-numberOfCourses",
    0,
  );
  const [courses, setCourses] = useLocalStorage<Course[]>("gpa-courses", []);

  const [newCumulativeGPA, setNewCumulativeGPA] = useState(0);
  const [previousCumulativeGPA, setPreviousCumulativeGPA] = useState(0);
  const [newTotalGradePoints, setNewTotalGradePoints] = useState(0);
  const [newTotalCredits, setNewTotalCredits] = useState(0);

  /* sync course array length */
  useEffect(() => {
    setCourses((prev) => {
      if (numberOfCourses > prev.length) {
        return [
          ...prev,
          ...Array(numberOfCourses - prev.length)
            .fill(null)
            .map(() => ({
              grade: "A",
              credits: 3,
              isRepeat: false,
              previousGrade: "F",
            })),
        ];
      }
      return prev.slice(0, numberOfCourses);
    });
  }, [numberOfCourses]);

  /* recalculate */
  useEffect(() => {
    const tgp = Math.max(0, parseFloat(totalGradePoints as string) || 0);
    const tc = Math.max(0, parseFloat(totalCredits as string) || 0);

    let newTGP = tgp;
    let newTC = tc;

    courses.forEach((course) => {
      const credits = Math.max(1, course.credits || 1);
      if (course.grade === "W") return;

      const gp = GRADE_MAP[course.grade] * credits;

      if (course.isRepeat) {
        if (course.previousGrade && course.previousGrade !== "W")
          newTGP -= GRADE_MAP[course.previousGrade] * credits;
        newTGP += gp;
      } else {
        newTGP += gp;
        newTC += credits;
      }
    });

    const prevGPA = tc > 0 ? Math.min(4, Math.max(0, tgp / tc)) : 0;
    const newGPA = newTC > 0 ? Math.min(4, Math.max(0, newTGP / newTC)) : 0;

    setPreviousCumulativeGPA(prevGPA);
    setNewCumulativeGPA(newGPA);
    setNewTotalGradePoints(newTGP);
    setNewTotalCredits(newTC);
  }, [totalGradePoints, totalCredits, courses]);

  const updateCourse = (
    idx: number,
    field: keyof Course,
    value: string | number | boolean,
  ) => {
    setCourses((prev) => {
      const next = [...prev];
      if (field === "credits") {
        const n = typeof value === "number" ? value : parseFloat(value as string);
        value = Math.max(1, n || 1);
      }
      next[idx] = { ...next[idx], [field]: value };
      if (field === "isRepeat" && value === false)
        next[idx].previousGrade = "F";
      if (
        field === "previousGrade" &&
        next[idx].isRepeat &&
        !["F", "D+", "D"].includes(value as string)
      )
        next[idx].isRepeat = false;
      if (field === "grade" && value === "W") next[idx].isRepeat = false;
      return next;
    });
  };

  const gpaDiff = newCumulativeGPA - previousCumulativeGPA;
  const diffColor =
    gpaDiff > 0.005
      ? "text-emerald-400"
      : gpaDiff < -0.005
        ? "text-red-400"
        : "text-zinc-400";

  const gpaLabel =
    newCumulativeGPA >= 3.5
      ? isRTL ? "امتياز" : "Excellent"
      : newCumulativeGPA >= 3.0
        ? isRTL ? "جيد جدًا" : "Very Good"
        : newCumulativeGPA >= 2.5
          ? isRTL ? "جيد" : "Good"
          : newCumulativeGPA >= 2.0
            ? isRTL ? "مقبول" : "Satisfactory"
            : isRTL ? "ضعيف" : "Poor";

  const gpaLabelColor =
    newCumulativeGPA >= 3.5
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : newCumulativeGPA >= 3.0
        ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
        : newCumulativeGPA >= 2.5
          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
          : "text-red-400 bg-red-500/10 border-red-500/20";

  const termGPA = (() => {
    let pts = 0;
    let cr = 0;
    courses.forEach((c) => {
      if (c.grade === "W") return;
      const credits = Math.max(1, c.credits || 1);
      pts += GRADE_MAP[c.grade] * credits;
      cr += credits;
    });
    return cr > 0 ? Math.min(4, pts / cr) : 0;
  })();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "GPA Calculator", ar: "حاسبة المعدل التراكمي" }}
            description={{
              en: "Enter your transcript totals and this semester's courses to project your new cumulative GPA.",
              ar: "أدخل إجماليات كشف درجاتك ومواد الفصل الحالي لمعرفة معدلك التراكمي المتوقع.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ HERO: ring + transcript ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Ring -- 2 cols */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  <div className="relative">
                    <GPARing gpa={newCumulativeGPA} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {newCumulativeGPA.toFixed(2)}
                      </span>
                      <span className="text-xs text-zinc-500 -mt-0.5">
                        / 4.00
                      </span>
                    </div>
                  </div>

                  <span
                    className={`mt-5 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${gpaLabelColor}`}
                  >
                    {gpaLabel}
                  </span>

                  {/* quick stats */}
                  <div className="grid grid-cols-3 w-full mt-6 border-t border-zinc-700/40 pt-4 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {previousCumulativeGPA.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "السابق" : "Previous"}
                      </p>
                    </div>
                    <div className="text-center border-x border-zinc-700/40">
                      <p className={`text-lg font-bold tabular-nums ${diffColor}`}>
                        {gpaDiff >= 0 ? "+" : ""}
                        {gpaDiff.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "التغيير" : "Change"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {newTotalCredits.toFixed(0)}
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "ساعات" : "Credits"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transcript -- 3 cols */}
              <Card
                title={isRTL ? "من كشف الدرجات" : "From Transcript"}
                className={`${cardClass} lg:col-span-3`}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "أدخل الإجماليات من كشف درجاتك الأكاديمي الرسمي."
                    : "Enter the totals from your official academic transcript."}
                </p>

                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={isRTL ? "مجموع نقاط الدرجات" : "Total Grade Points"}
                      type="number"
                      min="0"
                      step="0.1"
                      value={totalGradePoints}
                      onChange={(e) => setTotalGradePoints(e.target.value)}
                      placeholder="0"
                      helperText={
                        isRTL
                          ? "مجموع (الدرجة x الساعات) لكل المواد"
                          : "Sum of (grade x credits) for all courses"
                      }
                      className={inputSelectClass}
                    />
                    <Input
                      label={isRTL ? "إجمالي الساعات المعتمدة" : "Total Credits"}
                      type="number"
                      min="0"
                      step="1"
                      value={totalCredits}
                      onChange={(e) => setTotalCredits(e.target.value)}
                      placeholder="0"
                      helperText={
                        isRTL
                          ? "إجمالي ساعات المواد المكتملة"
                          : "Total completed credit hours"
                      }
                      className={inputSelectClass}
                    />
                  </div>
                  <Select
                    label={isRTL ? "عدد مواد هذا الفصل" : "Courses This Semester"}
                    value={numberOfCourses.toString()}
                    onChange={(e) =>
                      setNumberOfCourses(parseInt(e.target.value))
                    }
                    className={inputSelectClass}
                  >
                    <option value="0">
                      {isRTL ? "اختر العدد" : "Select"}
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {isRTL ? (n === 1 ? "مادة" : "مواد") : (n === 1 ? "course" : "courses")}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>
            </div>

            {/* ════════ COURSES ════════ */}
            {numberOfCourses > 0 && (
              <Card
                title={isRTL ? "مواد الفصل الحالي" : "This Semester's Courses"}
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "اختر الدرجة المتوقعة أو الفعلية وعدد الساعات لكل مادة. فعّل خيار الإعادة إذا كنت تعيد المادة."
                    : "Select the expected or actual grade and credit hours for each course. Toggle repeat if you are retaking it."}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-600/30 bg-zinc-700/15 overflow-hidden"
                    >
                      {/* header */}
                      <div className="flex items-center justify-between px-4 pt-3.5 pb-2 sm:px-5">
                        <span className="text-sm font-semibold text-white">
                          {isRTL ? `المادة ${idx + 1}` : `Course ${idx + 1}`}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                            GRADE_COLORS[course.grade] || "text-zinc-400 bg-zinc-700/30 border-zinc-600/30"
                          }`}
                        >
                          {course.grade === "W"
                            ? isRTL ? "انسحاب" : "W"
                            : `${course.grade} (${GRADE_MAP[course.grade]?.toFixed(1)})`}
                        </span>
                      </div>

                      {/* inputs */}
                      <div className="px-4 sm:px-5 pb-4 pt-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                              {isRTL ? "الدرجة" : "Grade"}
                            </label>
                            <select
                              value={course.grade}
                              onChange={(e) =>
                                updateCourse(idx, "grade", e.target.value)
                              }
                              className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                            >
                              {Object.keys(GRADE_MAP).map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                  {g === "W" ? (isRTL ? " (انسحاب)" : " (Withdraw)") : ` (${GRADE_MAP[g].toFixed(1)})`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                              {isRTL ? "الساعات" : "Credits"}
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="6"
                              step="1"
                              value={course.credits}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                updateCourse(
                                  idx,
                                  "credits",
                                  isNaN(v) ? 1 : Math.max(1, Math.min(6, v)),
                                );
                              }}
                              className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Withdrawal note */}
                        {course.grade === "W" && (
                          <p className="text-xs text-amber-400/80 mt-3">
                            {isRTL
                              ? "الانسحاب لا يدخل في حساب المعدل."
                              : "Withdrawals are not included in GPA calculation."}
                          </p>
                        )}

                        {/* Repeat toggle */}
                        {course.grade !== "W" && (
                          <div className="mt-3 pt-3 border-t border-zinc-600/25">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs text-zinc-500">
                                {isRTL ? "إعادة مادة؟" : "Retaking?"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCourse(idx, "isRepeat", !course.isRepeat)
                                }
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                                  course.isRepeat
                                    ? "bg-blue-500"
                                    : "bg-zinc-600"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ${
                                    course.isRepeat
                                      ? "translate-x-5 rtl:-translate-x-5"
                                      : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>

                            {course.isRepeat && (
                              <div className="mt-3">
                                <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                                  {isRTL ? "الدرجة السابقة" : "Previous Grade"}
                                </label>
                                <select
                                  value={course.previousGrade}
                                  onChange={(e) =>
                                    updateCourse(
                                      idx,
                                      "previousGrade",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full sm:w-32 bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                >
                                  {["F", "D+", "D"].map((g) => (
                                    <option key={g} value={g}>
                                      {g} ({GRADE_MAP[g].toFixed(1)})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* term summary */}
                {courses.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-zinc-600/30 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="text-xs text-zinc-500">
                      {isRTL ? "معدل الفصل:" : "Term GPA:"}{" "}
                      <span className="font-semibold text-white tabular-nums">
                        {termGPA.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500">
                      {isRTL ? "نقاط الدرجات الجديدة:" : "New Grade Points:"}{" "}
                      <span className="font-semibold text-white tabular-nums">
                        {newTotalGradePoints.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500">
                      {isRTL ? "إجمالي الساعات:" : "Total Credits:"}{" "}
                      <span className="font-semibold text-white tabular-nums">
                        {newTotalCredits.toFixed(0)}
                      </span>
                    </span>
                  </div>
                )}
              </Card>
            )}

            {/* empty state */}
            {numberOfCourses === 0 && (
              <Card className={cardClass}>
                <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-700/30 border border-zinc-600/30 flex items-center justify-center mb-4">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7 text-zinc-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {isRTL ? "لم تتم إضافة مواد بعد" : "No courses added yet"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    {isRTL
                      ? "اختر عدد المواد من قسم كشف الدرجات أعلاه لبدء حساب المعدل."
                      : "Select the number of courses in the Transcript section above to start calculating your GPA."}
                  </p>
                </div>
              </Card>
            )}

            {/* ════════ GRADE SCALE ════════ */}
            <Card
              title={isRTL ? "سلم الدرجات" : "Grade Scale"}
              className={cardClass}
            >
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.entries(GRADE_MAP)
                  .filter(([g]) => g !== "W")
                  .map(([grade, pts]) => (
                    <div
                      key={grade}
                      className="flex flex-col items-center py-2.5 rounded-lg bg-zinc-700/20 border border-zinc-600/20"
                    >
                      <span className="text-sm font-semibold text-white">
                        {grade}
                      </span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 tabular-nums">
                        {pts.toFixed(1)}
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
