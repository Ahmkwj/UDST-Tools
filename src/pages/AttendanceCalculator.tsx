import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";

type ClassInfo = {
  duration: number;
  missedTimes: number | string;
};

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] sm:[&_input]:min-h-0 sm:[&_select]:min-h-0";

/* ── Circular progress ring ── */
function ProgressRing({
  percent,
  size = 160,
  strokeWidth = 10,
  color,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(percent / 15, 1);
  const offset = circ * (1 - filled);

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

/* ── Per-class mini bar ── */
function MiniBar({ percent }: { percent: number }) {
  const clamped = Math.min(percent, 100);
  const color =
    percent >= 100
      ? "bg-red-500"
      : percent >= 70
        ? "bg-amber-500"
        : "bg-blue-500";
  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-700/50 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${Math.max(clamped, 1)}%` }}
      />
    </div>
  );
}

export default function AttendanceCalculator() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [absenteeismPercentage, setAbsenteeismPercentage] =
    useLocalStorage<string>("att-absenteeism", "");
  const [weeksInSemester, setWeeksInSemester] = useLocalStorage<string>(
    "att-weeks",
    "14",
  );
  const [classesPerWeek, setClassesPerWeek] = useLocalStorage<number>(
    "att-classesPerWeek",
    0,
  );
  const [classInfos, setClassInfos] = useLocalStorage<ClassInfo[]>(
    "att-classInfos",
    [],
  );
  const [newAbsenteeismPercentage, setNewAbsenteeismPercentage] =
    useState<number>(0);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("attendanceWarningDismissed")) setShowWarning(false);
  }, []);

  const dismissWarning = () => {
    setShowWarning(false);
    localStorage.setItem("attendanceWarningDismissed", "true");
  };

  /* sync classInfos when count changes */
  useEffect(() => {
    setClassInfos((prev) => {
      if (classesPerWeek > prev.length) {
        return [
          ...prev,
          ...Array(classesPerWeek - prev.length)
            .fill(null)
            .map(() => ({ duration: 60, missedTimes: 0 })),
        ];
      }
      return prev.slice(0, classesPerWeek);
    });
  }, [classesPerWeek]);

  /* recalculate on any relevant change */
  useEffect(() => {
    const currentPct = parseFloat(absenteeismPercentage) || 0;
    const weeks = parseInt(weeksInSemester) || 0;
    let totalMin = 0;
    let missedMin = 0;
    classInfos.forEach((c) => {
      const dur = c.duration || 0;
      totalMin += dur * weeks;
      if (typeof c.missedTimes === "number") missedMin += c.missedTimes * dur;
      else missedMin += parseInt(c.missedTimes) || 0;
    });
    setNewAbsenteeismPercentage(
      totalMin > 0 ? currentPct + (missedMin / totalMin) * 100 : currentPct,
    );
  }, [absenteeismPercentage, weeksInSemester, classInfos]);

  const updateClassInfo = (
    idx: number,
    field: keyof ClassInfo,
    value: number | string,
  ) => {
    setClassInfos((prev) => {
      const next = [...prev];
      if (field === "duration" && typeof value === "number")
        value = Math.max(0, value);
      if (field === "missedTimes" && typeof value === "number")
        value = Math.max(0, value);
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleCustomInput = (idx: number) => {
    setClassInfos((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], missedTimes: "" };
      return next;
    });
  };

  /* ── derived values ── */
  const ringColor =
    newAbsenteeismPercentage >= 15
      ? "#ef4444"
      : newAbsenteeismPercentage >= 10
        ? "#f59e0b"
        : "#3b82f6";

  const statusLabel =
    newAbsenteeismPercentage <= 5
      ? isRTL
        ? "ممتاز"
        : "Excellent"
      : newAbsenteeismPercentage <= 10
        ? isRTL
          ? "حذر"
          : "Caution"
        : newAbsenteeismPercentage >= 15
          ? isRTL
            ? "تجاوز"
            : "Exceeded"
          : isRTL
            ? "خطر"
            : "At Risk";

  const statusColor =
    newAbsenteeismPercentage >= 15
      ? "text-red-400 bg-red-500/10 border-red-500/20"
      : newAbsenteeismPercentage >= 10
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : newAbsenteeismPercentage <= 5
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          : "text-blue-400 bg-blue-500/10 border-blue-500/20";

  /* per-class stats */
  const classStats = classInfos.map((c) => {
    const weeks = parseInt(weeksInSemester) || 0;
    const totalMin = (c.duration || 0) * weeks;
    const maxMissedMin = totalMin * 0.15;
    let missedMin = 0;
    if (typeof c.missedTimes === "number") missedMin = c.missedTimes * (c.duration || 0);
    else missedMin = parseInt(c.missedTimes || "0") || 0;
    const remaining = Math.max(0, maxMissedMin - missedMin);
    const remainingClasses = c.duration > 0 ? Math.floor(remaining / c.duration) : 0;
    const pctUsed = maxMissedMin > 0 ? (missedMin / maxMissedMin) * 100 : 0;
    const isOver = pctUsed >= 100;
    return { remainingClasses, pctUsed, isOver, missedMin, totalMin };
  });

  const totalRemaining = classStats.reduce((s, c) => s + c.remainingClasses, 0);
  const totalMissed = classStats.reduce(
    (s, _stat, i) => {
      const ci = classInfos[i];
      if (typeof ci.missedTimes === "number") return s + ci.missedTimes;
      return s + (ci.duration > 0 ? Math.ceil((parseInt(ci.missedTimes || "0") || 0) / ci.duration) : 0);
    },
    0,
  );

  const durationLabel = (d: number) => {
    if (d < 60) return d + (isRTL ? " د" : " min");
    const h = d / 60;
    if (h === 1) return isRTL ? "ساعة" : "1 hr";
    if (h === 1.5) return isRTL ? "1.5 ساعة" : "1.5 hr";
    if (h === 2) return isRTL ? "ساعتان" : "2 hr";
    if (h === 2.5) return isRTL ? "2.5 ساعة" : "2.5 hr";
    if (h === 3) return isRTL ? "3 ساعات" : "3 hr";
    return h + (isRTL ? " ساعة" : " hr");
  };

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Attendance Tracker", ar: "متابعة الحضور" }}
            description={{
              en: "Track your absences per class and stay within the 15% limit. Results update as you type.",
              ar: "تتبّع غيابك لكل محاضرة وابقَ ضمن حدّ الـ 15%. النتائج تتحدّث فورًا.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ HERO: ring + stats + setup ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Ring card -- 2 cols */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  <div className="relative">
                    <ProgressRing
                      percent={newAbsenteeismPercentage}
                      size={160}
                      strokeWidth={10}
                      color={ringColor}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {newAbsenteeismPercentage.toFixed(1)}
                      </span>
                      <span className="text-xs text-zinc-500 -mt-0.5">
                        / 15%
                      </span>
                    </div>
                  </div>

                  <span
                    className={`mt-5 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
                  >
                    {statusLabel}
                  </span>

                  {/* quick stats */}
                  {classesPerWeek > 0 && (
                    <div className="grid grid-cols-3 w-full mt-6 border-t border-zinc-700/40 pt-4 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white tabular-nums">
                          {classesPerWeek}
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                          {isRTL ? "محاضرات" : "Classes"}
                        </p>
                      </div>
                      <div className="text-center border-x border-zinc-700/40">
                        <p className="text-lg font-bold text-white tabular-nums">
                          {totalMissed}
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                          {isRTL ? "غياب" : "Missed"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-400 tabular-nums">
                          {totalRemaining}
                        </p>
                        <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                          {isRTL ? "متبقي" : "Left"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Setup card -- 3 cols */}
              <Card
                title={isRTL ? "إعداد الفصل" : "Semester Setup"}
                className={`${cardClass} lg:col-span-3`}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "أدخل بيانات الفصل ونسبة الغياب من سجلك الأكاديمي."
                    : "Enter your semester details and current absence percentage from your academic record."}
                </p>

                <div className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={isRTL ? "نسبة الغياب الحالية %" : "Current Absence %"}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder={isRTL ? "مثال: 3.5" : "e.g. 3.5"}
                      value={absenteeismPercentage}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (e.target.value === "" || isNaN(v))
                          setAbsenteeismPercentage("");
                        else
                          setAbsenteeismPercentage(
                            Math.max(0, Math.min(100, v)).toString(),
                          );
                      }}
                      helperText={isRTL ? "0 إن لم تتغيّب بعد" : "0 if none yet"}
                      className={inputSelectClass}
                    />
                    <Input
                      label={isRTL ? "عدد أسابيع الفصل" : "Semester Weeks"}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="14"
                      value={weeksInSemester}
                      onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if (e.target.value === "" || isNaN(v))
                          setWeeksInSemester("");
                        else setWeeksInSemester(Math.max(1, v).toString());
                      }}
                      helperText={
                        isRTL ? "14 عادي، 6 صيفي" : "14 regular, 6 summer"
                      }
                      className={inputSelectClass}
                    />
                  </div>

                  <Select
                    label={isRTL ? "عدد المحاضرات في الأسبوع" : "Classes per Week"}
                    value={classesPerWeek}
                    onChange={(e) =>
                      setClassesPerWeek(parseInt(e.target.value, 10))
                    }
                    className={inputSelectClass}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n === 0
                          ? isRTL
                            ? "اختر العدد"
                            : "Select"
                          : n}
                      </option>
                    ))}
                  </Select>
                </div>
              </Card>
            </div>

            {/* ════════ CLASSES ════════ */}
            {classesPerWeek > 0 && (
              <Card
                title={isRTL ? "محاضراتك" : "Your Classes"}
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "اضبط مدة كل محاضرة وعدد مرات غيابك. المتبقي يعني عدد الجلسات التي يمكنك تفويتها قبل بلوغ حد 15%."
                    : "Set each class duration and how many times you missed it. Remaining shows sessions you can still miss before hitting 15%."}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {classInfos.map((classInfo, idx) => {
                    const stat = classStats[idx];
                    if (!stat) return null;

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-600/30 bg-zinc-700/15 overflow-hidden"
                      >
                        {/* top bar: class label + remaining badge */}
                        <div className="flex items-center justify-between px-4 pt-3.5 pb-2 sm:px-5">
                          <span className="text-sm font-semibold text-white">
                            {isRTL
                              ? `المحاضرة ${idx + 1}`
                              : `Class ${idx + 1}`}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg tabular-nums ${
                              stat.isOver
                                ? "bg-red-500/15 text-red-400"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {stat.isOver
                              ? isRTL
                                ? "تجاوز الحد"
                                : "Exceeded"
                              : isRTL
                                ? `${stat.remainingClasses} متبقية`
                                : `${stat.remainingClasses} left`}
                          </span>
                        </div>

                        {/* mini progress bar */}
                        <div className="px-4 sm:px-5 pb-1">
                          <MiniBar percent={stat.pctUsed} />
                        </div>

                        {/* inputs row */}
                        <div className="px-4 sm:px-5 pb-4 pt-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                                {isRTL ? "المدة" : "Duration"}
                              </label>
                              <select
                                value={classInfo.duration}
                                onChange={(e) =>
                                  updateClassInfo(
                                    idx,
                                    "duration",
                                    parseInt(e.target.value),
                                  )
                                }
                                className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                              >
                                {[30, 60, 90, 120, 150, 180].map((d) => (
                                  <option key={d} value={d}>
                                    {durationLabel(d)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                                {isRTL ? "مرات الغياب" : "Times Missed"}
                              </label>
                              {typeof classInfo.missedTimes === "number" ? (
                                <select
                                  value={classInfo.missedTimes}
                                  onChange={(e) => {
                                    if (e.target.value === "custom")
                                      handleCustomInput(idx);
                                    else
                                      updateClassInfo(
                                        idx,
                                        "missedTimes",
                                        parseInt(e.target.value),
                                      );
                                  }}
                                  className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                >
                                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  ))}
                                  <option value="custom">
                                    {isRTL ? "دقائق..." : "Minutes..."}
                                  </option>
                                </select>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder={
                                    isRTL ? "دقائق" : "minutes"
                                  }
                                  value={classInfo.missedTimes}
                                  onChange={(e) =>
                                    updateClassInfo(
                                      idx,
                                      "missedTimes",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* empty state */}
            {classesPerWeek === 0 && (
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
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {isRTL
                      ? "لم يتم اختيار محاضرات بعد"
                      : "No classes added yet"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    {isRTL
                      ? "اختر عدد المحاضرات في الأسبوع من قسم إعداد الفصل أعلاه لبدء التتبّع."
                      : "Select the number of classes per week in the Semester Setup section above to start tracking."}
                  </p>
                </div>
              </Card>
            )}

            {/* ════════ NOTICE ════════ */}
            {showWarning && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3.5 sm:px-5 sm:py-4 flex items-start gap-3">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                <p className="flex-1 text-sm text-zinc-400 leading-relaxed">
                  {isRTL
                    ? "هذه الأداة للتقدير فقط. لا تعتمد عليها بالكامل خصوصًا عند اقتراب نسبة الغياب من 15%. نظام الحضور الرسمي قد يختلف."
                    : "This tool provides estimates only. Do not rely on it entirely, especially near the 15% limit. The official attendance system may differ."}
                </p>
                <button
                  onClick={dismissWarning}
                  className="shrink-0 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700/40 transition-colors"
                  title={isRTL ? "إغلاق" : "Dismiss"}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
