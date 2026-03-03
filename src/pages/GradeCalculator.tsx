import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

type Assignment = {
  id: string;
  name: string;
  weight: number;
  score: number | null;
};

type ScaleEntry = {
  min: number;
  max: number;
  color: string;
  bg: string;
  border: string;
  points: number;
  en: string;
  ar: string;
};

const SCALE: Record<string, ScaleEntry> = {
  A:  { min: 90, max: 100,   color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", points: 4.0, en: "Excellent",       ar: "ممتاز" },
  "B+": { min: 85, max: 89.99, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    points: 3.5, en: "Very Good+",     ar: "جيد جدًا مرتفع" },
  B:  { min: 80, max: 84.99, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    points: 3.0, en: "Very Good",      ar: "جيد جدًا" },
  "C+": { min: 75, max: 79.99, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   points: 2.5, en: "Good+",          ar: "جيد مرتفع" },
  C:  { min: 70, max: 74.99, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   points: 2.0, en: "Good",           ar: "جيد" },
  "D+": { min: 65, max: 69.99, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     points: 1.5, en: "Pass+",          ar: "مقبول مرتفع" },
  D:  { min: 60, max: 64.99, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     points: 1.0, en: "Pass",           ar: "مقبول" },
  F:  { min: 0,  max: 59.99, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     points: 0.0, en: "Fail",           ar: "راسب" },
};

function getLetter(grade: number): { letter: string; entry: ScaleEntry } {
  const rounded = Math.round(grade * 10) / 10;
  for (const [letter, entry] of Object.entries(SCALE)) {
    if (rounded >= entry.min && rounded <= entry.max)
      return { letter, entry };
  }
  return { letter: "N/A", entry: SCALE.F };
}

/* ── Ring ── */
function GradeRing({ pct }: { pct: number }) {
  const size = 160;
  const sw = 10;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(pct / 100, 1);
  const offset = circ * (1 - filled);
  const { entry } = getLetter(pct);

  const stroke =
    entry === SCALE.A
      ? "#10b981"
      : entry === SCALE["B+"] || entry === SCALE.B
        ? "#3b82f6"
        : entry === SCALE["C+"] || entry === SCALE.C
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
        strokeWidth={sw}
        className="text-zinc-700/50"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

/* ── Mini contribution bar ── */
function ContribBar({
  score,
  weight,
}: {
  score: number | null;
  weight: number;
}) {
  if (weight <= 0) return null;
  const contrib = score !== null ? (score * weight) / 100 : 0;
  const pct = Math.min((contrib / weight) * 100, 100);
  const { entry } = getLetter(score ?? 0);

  const barColor =
    score === null
      ? "bg-zinc-600/40"
      : entry === SCALE.A
        ? "bg-emerald-500"
        : entry === SCALE["B+"] || entry === SCALE.B
          ? "bg-blue-500"
          : entry === SCALE["C+"] || entry === SCALE.C
            ? "bg-amber-500"
            : "bg-red-500";

  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-700/40 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${score !== null ? pct : 0}%` }}
      />
    </div>
  );
}

const DEFAULTS = [
  { en: "Final Exam", ar: "الاختبار النهائي", w: 30 },
  { en: "Midterm", ar: "الاختبار النصفي", w: 25 },
  { en: "Quizzes", ar: "الكويزات", w: 20 },
  { en: "Project", ar: "المشروع", w: 15 },
  { en: "Laboratory", ar: "اللابات", w: 10 },
];

export default function GradeCalculator() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [assignments, setAssignments] = useLocalStorage<Assignment[]>(
    "grade-assignments",
    [],
  );
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    setTotalWeight(assignments.reduce((s, a) => s + a.weight, 0));
  }, [assignments]);

  const addAssignment = () => {
    const idx = assignments.length;
    const def = idx < DEFAULTS.length ? DEFAULTS[idx] : null;
    setAssignments([
      ...assignments,
      {
        id: Date.now().toString(),
        name: def
          ? isRTL
            ? def.ar
            : def.en
          : isRTL
            ? `التكليف ${idx + 1}`
            : `Assignment ${idx + 1}`,
        weight: def ? def.w : 10,
        score: null,
      },
    ]);
  };

  const removeAssignment = (id: string) =>
    setAssignments(assignments.filter((a) => a.id !== id));

  const update = (id: string, field: keyof Assignment, value: unknown) =>
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );

  /* grades */
  const completed = assignments.filter((a) => a.score !== null);
  const completedWeight = completed.reduce((s, a) => s + a.weight, 0);
  const remainingWeight = assignments
    .filter((a) => a.score === null)
    .reduce((s, a) => s + a.weight, 0);

  const currentGrade = (() => {
    if (completed.length === 0) return 0;
    const ws = completed.reduce(
      (s, a) => s + ((a.score || 0) * a.weight) / 100,
      0,
    );
    return completedWeight > 0
      ? Math.round(((ws / completedWeight) * 100) * 10) / 10
      : 0;
  })();

  const finalGrade = (() => {
    const ws = assignments.reduce(
      (s, a) => s + ((a.score !== null ? a.score : 0) * a.weight) / 100,
      0,
    );
    const tw = Math.min(totalWeight, 100);
    return tw > 0 ? Math.round(((ws / tw) * 100) * 10) / 10 : 0;
  })();

  const currentLetter = getLetter(currentGrade);
  const finalLetter = getLetter(finalGrade);
  const hasScores = completed.length > 0;
  const isWeightOver = totalWeight > 100;

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Grade Calculator", ar: "حاسبة الدرجات" }}
            description={{
              en: "Add your course assignments with their weights and scores to track your current and projected final grade.",
              ar: "أضف تكليفات المادة وأوزانها ودرجاتك لمتابعة وضعك الحالي ومعرفة توقعك النهائي.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ HERO: ring + projected ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Current grade ring -- 2 cols */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  <div className="relative">
                    <GradeRing pct={hasScores ? currentGrade : 0} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {hasScores ? `${currentGrade.toFixed(1)}` : "--"}
                      </span>
                      <span className="text-xs text-zinc-500 -mt-0.5">
                        {hasScores ? "%" : ""}
                      </span>
                    </div>
                  </div>

                  {hasScores ? (
                    <span
                      className={`mt-5 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${currentLetter.entry.bg} ${currentLetter.entry.color} ${currentLetter.entry.border}`}
                    >
                      {currentLetter.letter} --{" "}
                      {isRTL
                        ? currentLetter.entry.ar
                        : currentLetter.entry.en}
                    </span>
                  ) : (
                    <span className="mt-5 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-zinc-600/30 bg-zinc-700/20 text-zinc-500">
                      {isRTL ? "لا توجد درجات" : "No scores yet"}
                    </span>
                  )}

                  {/* quick stats */}
                  <div className="grid grid-cols-3 w-full mt-6 border-t border-zinc-700/40 pt-4 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {completed.length}
                        <span className="text-zinc-500 font-normal">
                          /{assignments.length}
                        </span>
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "مكتمل" : "Done"}
                      </p>
                    </div>
                    <div className="text-center border-x border-zinc-700/40">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {completedWeight}%
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "وزن مكتمل" : "Weight Done"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white tabular-nums">
                        {remainingWeight}%
                      </p>
                      <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {isRTL ? "متبقي" : "Remaining"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Projected final + weight bar -- 3 cols */}
              <Card
                title={isRTL ? "التوقع النهائي" : "Projected Final"}
                className={`${cardClass} lg:col-span-3`}
              >
                <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                  {isRTL
                    ? "التقدير المتوقع بافتراض 0% للتكليفات المتبقية."
                    : "Projected grade assuming 0% for remaining assignments."}
                </p>

                <div className="flex items-center gap-5 sm:gap-6 mb-6">
                  <div>
                    <p className="text-5xl sm:text-6xl font-bold text-white tabular-nums tracking-tight">
                      {hasScores ? `${finalGrade.toFixed(1)}` : "--"}
                      <span className="text-2xl sm:text-3xl text-zinc-500 font-medium">
                        {hasScores ? "%" : ""}
                      </span>
                    </p>
                    {hasScores && (
                      <span
                        className={`inline-flex items-center mt-2 text-sm font-semibold ${finalLetter.entry.color}`}
                      >
                        {finalLetter.letter} --{" "}
                        {isRTL
                          ? finalLetter.entry.ar
                          : finalLetter.entry.en}
                      </span>
                    )}
                  </div>
                </div>

                {/* weight distribution bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{isRTL ? "توزيع الأوزان" : "Weight Distribution"}</span>
                    <span
                      className={`font-medium tabular-nums ${isWeightOver ? "text-red-400" : "text-zinc-400"}`}
                    >
                      {totalWeight}%{" "}
                      {isWeightOver
                        ? isRTL
                          ? "(تجاوز!)"
                          : "(exceeds 100%!)"
                        : ""}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-700/40 overflow-hidden flex">
                    {assignments.map((a) => {
                      const w = totalWeight > 0 ? (a.weight / Math.max(totalWeight, 100)) * 100 : 0;
                      const hasScore = a.score !== null;
                      const barColor = hasScore
                        ? getLetter(a.score!).entry === SCALE.A
                          ? "bg-emerald-500/70"
                          : getLetter(a.score!).entry === SCALE["B+"] ||
                              getLetter(a.score!).entry === SCALE.B
                            ? "bg-blue-500/70"
                            : getLetter(a.score!).entry === SCALE["C+"] ||
                                getLetter(a.score!).entry === SCALE.C
                              ? "bg-amber-500/70"
                              : "bg-red-500/70"
                        : "bg-zinc-600/50";
                      return (
                        <div
                          key={a.id}
                          className={`h-full ${barColor} transition-all duration-500 first:rounded-s-full last:rounded-e-full`}
                          style={{ width: `${w}%` }}
                          title={`${a.name}: ${a.weight}%`}
                        />
                      );
                    })}
                  </div>
                  {assignments.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      {assignments.map((a) => (
                        <span
                          key={a.id}
                          className="text-[10px] text-zinc-500 flex items-center gap-1"
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-sm ${
                              a.score !== null
                                ? getLetter(a.score).entry === SCALE.A
                                  ? "bg-emerald-500"
                                  : getLetter(a.score).entry === SCALE["B+"] ||
                                      getLetter(a.score).entry === SCALE.B
                                    ? "bg-blue-500"
                                    : getLetter(a.score).entry === SCALE["C+"] ||
                                        getLetter(a.score).entry === SCALE.C
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                : "bg-zinc-600"
                            }`}
                          />
                          {a.name} ({a.weight}%)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* ════════ ASSIGNMENTS ════════ */}
            <Card
              title={isRTL ? "التكليفات" : "Assignments"}
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-4 sm:mb-5">
                {isRTL
                  ? "أضف تكليفات المادة وأوزانها ودرجاتك. الحقول الفارغة تعني أن التكليف لم يُكتمل بعد."
                  : "Add your course assignments, their weight, and scores. Leave the score blank if not yet completed."}
              </p>

              {/* add button */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                    isWeightOver
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {isRTL ? "الأوزان" : "Weights"}: {totalWeight}%
                  {isWeightOver &&
                    (isRTL ? " (تجاوز!)" : " (over 100%!)")}
                </span>
                <button
                  type="button"
                  onClick={addAssignment}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-600/40 bg-zinc-700/20 text-xs font-medium text-zinc-300 hover:bg-zinc-700/40 hover:text-white transition-colors"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  {isRTL ? "إضافة" : "Add"}
                </button>
              </div>

              {assignments.length === 0 ? (
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
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {isRTL ? "لا توجد تكليفات" : "No assignments yet"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    {isRTL
                      ? "اضغط \"إضافة\" لبدء إضافة تكليفاتك وحساب درجتك."
                      : "Click \"Add\" to start adding assignments and calculating your grade."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {assignments.map((a, idx) => {
                    const contrib =
                      a.score !== null
                        ? ((a.score * a.weight) / 100).toFixed(1)
                        : null;
                    const letterInfo =
                      a.score !== null ? getLetter(a.score) : null;

                    return (
                      <div
                        key={a.id}
                        className="rounded-xl border border-zinc-600/30 bg-zinc-700/15 overflow-hidden"
                      >
                        {/* header row */}
                        <div className="flex items-center gap-3 px-4 pt-3.5 pb-2 sm:px-5">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-600/30 text-zinc-400 text-[11px] font-semibold">
                            {idx + 1}
                          </span>
                          <input
                            value={a.name}
                            onChange={(e) =>
                              update(a.id, "name", e.target.value)
                            }
                            placeholder={
                              isRTL ? "اسم التكليف" : "Assignment name"
                            }
                            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-zinc-600"
                          />
                          {letterInfo && (
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${letterInfo.entry.bg} ${letterInfo.entry.color} ${letterInfo.entry.border}`}
                            >
                              {letterInfo.letter}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeAssignment(a.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                            aria-label="Remove"
                          >
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* inputs */}
                        <div className="px-4 sm:px-5 pb-4 pt-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                                {isRTL ? "الوزن %" : "Weight %"}
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={a.weight}
                                onChange={(e) =>
                                  update(
                                    a.id,
                                    "weight",
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors tabular-nums"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-500 mb-1.5">
                                {isRTL ? "الدرجة %" : "Score %"}
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={a.score ?? ""}
                                onChange={(e) =>
                                  update(
                                    a.id,
                                    "score",
                                    e.target.value === ""
                                      ? null
                                      : Math.min(
                                          100,
                                          Math.max(0, Number(e.target.value)),
                                        ),
                                  )
                                }
                                placeholder="--"
                                className="w-full bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors tabular-nums"
                              />
                            </div>
                          </div>

                          {/* contribution bar + text */}
                          <div className="mt-3 space-y-1.5">
                            <ContribBar score={a.score} weight={a.weight} />
                            <div className="flex items-center justify-between text-[11px] text-zinc-500 tabular-nums">
                              <span>
                                {isRTL ? "المساهمة" : "Contribution"}
                              </span>
                              <span>
                                {contrib !== null
                                  ? `${contrib} / ${a.weight}`
                                  : `-- / ${a.weight}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* ════════ GRADE SCALE ════════ */}
            <Card
              title={isRTL ? "سلم الدرجات" : "Grade Scale"}
              className={cardClass}
            >
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.entries(SCALE).map(([grade, info]) => (
                  <div
                    key={grade}
                    className={`flex flex-col items-center py-2.5 rounded-lg border ${info.bg} ${info.border}`}
                  >
                    <span className={`text-sm font-semibold ${info.color}`}>
                      {grade}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5 tabular-nums">
                      {info.min}%+
                    </span>
                    <span className="text-[9px] text-zinc-500 tabular-nums">
                      {info.points.toFixed(1)} pts
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
