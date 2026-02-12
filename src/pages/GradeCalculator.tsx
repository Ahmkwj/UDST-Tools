import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

/* Theme: match Attendance / GPA */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:py-2.5";
const sectionGap = "space-y-12";

type Assignment = {
  id: string;
  name: string;
  weight: number;
  score: number | null;
};

type GradeScale = {
  [key: string]: {
    min: number;
    max: number;
    color: string;
    points: number;
    description: string;
    descriptionAr: string;
  };
};

export default function GradeCalculator() {
  const locale = useLocale();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  // Grade scale configuration
  const gradeScale: GradeScale = {
    A: {
      min: 90,
      max: 100,
      color: "text-emerald-400",
      points: 4.0,
      description: "Excellent",
      descriptionAr: "ممتاز",
    },
    "B+": {
      min: 85,
      max: 89.99,
      color: "text-blue-400",
      points: 3.5,
      description: "Very Good",
      descriptionAr: "جيد جدًا مرتفع",
    },
    B: {
      min: 80,
      max: 84.99,
      color: "text-blue-400",
      points: 3.0,
      description: "Very Good",
      descriptionAr: "جيد جدًا",
    },
    "C+": {
      min: 75,
      max: 79.99,
      color: "text-yellow-400",
      points: 2.5,
      description: "Good",
      descriptionAr: "جيد مرتفع",
    },
    C: {
      min: 70,
      max: 74.99,
      color: "text-yellow-400",
      points: 2.0,
      description: "Good",
      descriptionAr: "جيد",
    },
    "D+": {
      min: 65,
      max: 69.99,
      color: "text-orange-400",
      points: 1.5,
      description: "Pass",
      descriptionAr: "مقبول مرتفع",
    },
    D: {
      min: 60,
      max: 64.99,
      color: "text-orange-400",
      points: 1.0,
      description: "Pass",
      descriptionAr: "مقبول",
    },
    F: {
      min: 0,
      max: 59.99,
      color: "text-red-400",
      points: 0.0,
      description: "Fail",
      descriptionAr: "راسب",
    },
  };

  // Add a new assignment
  const addAssignment = () => {
    const defaultAssignments = [
      { name: locale === "ar" ? "الاختبار النهائي" : "Final", weight: 30 },
      { name: locale === "ar" ? "اللابات" : "Laboratory", weight: 10 },
      { name: locale === "ar" ? "الاختبار النصفي" : "Midterm", weight: 25 },
      { name: locale === "ar" ? "الكويزات" : "Quiz", weight: 20 },
      { name: locale === "ar" ? "المشروع" : "Project", weight: 15 },
    ];

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name:
        assignments.length < defaultAssignments.length
          ? defaultAssignments[assignments.length].name
          : locale === "ar"
          ? `التكليف ${assignments.length + 1}`
          : `Assignment ${assignments.length + 1}`,
      weight:
        assignments.length < defaultAssignments.length
          ? defaultAssignments[assignments.length].weight
          : 10,
      score: null,
    };
    setAssignments([...assignments, newAssignment]);
  };

  // Remove an assignment
  const removeAssignment = (id: string) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  // Update assignment details
  const updateAssignment = (
    id: string,
    field: keyof Assignment,
    value: any
  ) => {
    setAssignments(
      assignments.map((assignment) => {
        if (assignment.id === id) {
          return { ...assignment, [field]: value };
        }
        return assignment;
      })
    );
  };

  // Recalculate when assignments change
  useEffect(() => {
    // Calculate total weight
    const weight = assignments.reduce(
      (sum, assignment) => sum + assignment.weight,
      0
    );
    setTotalWeight(weight);
  }, [assignments]);

  // Calculate current weighted grade
  const calculateCurrentGrade = () => {
    const completedAssignments = assignments.filter((a) => a.score !== null);

    if (completedAssignments.length === 0) return 0;

    const weightedSum = completedAssignments.reduce(
      (sum, a) => sum + ((a.score || 0) * a.weight) / 100,
      0
    );

    const completedWeight = completedAssignments.reduce(
      (sum, a) => sum + a.weight,
      0
    );

    const grade =
      completedWeight > 0 ? (weightedSum / completedWeight) * 100 : 0;
    return Math.round(grade * 10) / 10; // Round to nearest 0.1
  };

  // Calculate projected final grade
  const calculateFinalGrade = () => {
    const weightedSum = assignments.reduce(
      (sum, a) => sum + ((a.score !== null ? a.score : 0) * a.weight) / 100,
      0
    );

    const grade =
      totalWeight > 0 ? (weightedSum / Math.min(totalWeight, 100)) * 100 : 0;
    return Math.round(grade * 10) / 10; // Round to nearest 0.1
  };

  // Get letter grade
  const getLetterGrade = (grade: number) => {
    // Round grade before comparison
    const roundedGrade = Math.round(grade * 10) / 10;

    for (const [letter, range] of Object.entries(gradeScale)) {
      if (roundedGrade >= range.min && roundedGrade <= range.max) {
        return {
          letter,
          color: range.color,
          points: range.points,
          description: range.description,
        };
      }
    }
    return {
      letter: "N/A",
      color: "text-zinc-400",
      points: 0,
      description: "",
    };
  };

  const currentGrade = calculateCurrentGrade();
  const finalGrade = calculateFinalGrade();
  const currentLetterGrade = getLetterGrade(currentGrade);
  const finalLetterGrade = getLetterGrade(finalGrade);
  const isWeightExceeded = totalWeight > 100;
  const hasCompletedAssignments = assignments.some((a) => a.score !== null);

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "Grade Calculator",
              ar: "حاسبة الدرجات",
            }}
            description={{
              en: "Add assignments with weights and scores to see your current and projected final grade.",
              ar: "أضف التكليفات وأوزانها ودرجاتها لمعرفة وضعك الحالي والتوقع النهائي.",
            }}
          />

          <div className={sectionGap}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Assignments */}
              <Card
                title={locale === "ar" ? "التكليفات" : "Assignments"}
                className={cardClass}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      isWeightExceeded
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {locale === "ar" ? "مجموع الأوزان" : "Total weight"}: {totalWeight}%
                    {isWeightExceeded && (locale === "ar" ? " (تجاوز 100%)" : " (over 100%)")}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAssignment}
                    className="!p-2 rounded-xl border-zinc-500/40 text-zinc-400 hover:text-white hover:bg-zinc-700/40"
                    aria-label={locale === "ar" ? "إضافة تكليف" : "Add assignment"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </Button>
                </div>

                {assignments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-zinc-400 text-sm mb-1">
                      {locale === "ar" ? "لا توجد تكليفات" : "No assignments yet"}
                    </p>
                    <p className="text-zinc-500 text-xs max-w-[200px]">
                      {locale === "ar" ? "اضغط + لإضافة تكليف وبدء الحساب." : "Click + to add an assignment and start."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 ${assignments.indexOf(assignment) > 0 ? "border-t border-zinc-600/25" : ""}`}
                      >
                        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                          <Input
                            label={locale === "ar" ? "الاسم" : "Name"}
                            value={assignment.name}
                            onChange={(e) => updateAssignment(assignment.id, "name", e.target.value)}
                            className={`${inputSelectClass} !mb-0`}
                          />
                          <Input
                            label={locale === "ar" ? "الوزن %" : "Weight %"}
                            type="number"
                            min="0"
                            max="100"
                            value={assignment.weight}
                            onChange={(e) => updateAssignment(assignment.id, "weight", Number(e.target.value))}
                            className={`${inputSelectClass} !mb-0 [&_input]:py-2`}
                          />
                          <Input
                            label={locale === "ar" ? "الدرجة %" : "Score %"}
                            type="number"
                            min="0"
                            max="100"
                            value={assignment.score ?? ""}
                            onChange={(e) =>
                              updateAssignment(
                                assignment.id,
                                "score",
                                e.target.value === "" ? null : Math.min(100, Math.max(0, Number(e.target.value)))
                              )
                            }
                            placeholder={locale === "ar" ? "—" : "—"}
                            className={`${inputSelectClass} !mb-0 [&_input]:py-2`}
                          />
                        </div>
                        <div className="flex items-center gap-2 sm:ms-auto">
                          <span className="text-xs text-zinc-500 tabular-nums">
                            {assignment.score !== null
                              ? `${((assignment.score * assignment.weight) / 100).toFixed(1)} / ${assignment.weight}`
                              : `— / ${assignment.weight}`}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAssignment(assignment.id)}
                            className="!p-2 rounded-xl border-zinc-500/40 text-zinc-400 hover:text-red-400 hover:border-red-500/40"
                            aria-label={locale === "ar" ? "حذف" : "Remove"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            {/* Right: Results + Grade Scale */}
              <div className={sectionGap}>
                <Card
                  title={locale === "ar" ? "النتيجة" : "Results"}
                  className={cardClass}
                >
                  {!hasCompletedAssignments ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-zinc-400 text-sm mb-1">
                        {locale === "ar" ? "لا توجد درجات مُدخلة" : "No scores entered yet"}
                      </p>
                      <p className="text-zinc-500 text-xs max-w-[200px]">
                        {locale === "ar" ? "أدخل درجات التكليفات أقصى اليسار لرؤية النتيجة." : "Enter assignment scores on the left to see results."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-zinc-600/40">
                        <div className="text-center sm:text-center">
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                            {locale === "ar" ? "الوضع الحالي" : "Current"}
                          </p>
                          <p className="text-4xl sm:text-5xl font-bold tabular-nums text-blue-400">
                            {currentGrade.toFixed(1)}%
                          </p>
                          <p className={`text-lg font-semibold ${currentLetterGrade.color}`}>
                            {currentLetterGrade.letter}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {assignments.filter((a) => a.score !== null).length} {locale === "ar" ? "تكليف مكتمل" : "completed"}
                          </p>
                        </div>
                        <div className="text-center sm:text-center">
                          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                            {locale === "ar" ? "التوقع النهائي" : "Projected final"}
                          </p>
                          <p className="text-4xl sm:text-5xl font-bold tabular-nums text-white">
                            {finalGrade.toFixed(1)}%
                          </p>
                          <p className={`text-lg font-semibold ${finalLetterGrade.color}`}>
                            {finalLetterGrade.letter}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {locale === "ar" ? "بافتراض 0% للمتبقي" : "If rest is 0%"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-8 gap-y-2 pt-4">
                        <span className="text-sm text-zinc-400">
                          {locale === "ar" ? "مكتمل:" : "Completed:"}{" "}
                          <span className="font-medium text-white">
                            {assignments.filter((a) => a.score !== null).reduce((s, a) => s + a.weight, 0)}%
                          </span>
                        </span>
                        <span className="text-sm text-zinc-400">
                          {locale === "ar" ? "متبقي:" : "Remaining:"}{" "}
                          <span className="font-medium text-white">
                            {assignments.filter((a) => a.score === null).reduce((s, a) => s + a.weight, 0)}%
                          </span>
                        </span>
                        <span className="text-sm text-zinc-400">
                          {locale === "ar" ? "التقدم:" : "Progress:"}{" "}
                          <span className="font-medium text-white">
                            {assignments.length ? Math.round((assignments.filter((a) => a.score !== null).length / assignments.length) * 100) : 0}%
                          </span>
                        </span>
                      </div>
                    </>
                  )}
                </Card>

                <Card
                  title={locale === "ar" ? "سلم الدرجات" : "Grade Scale"}
                  className={cardClass}
                >
                  <div className="space-y-0">
                    {Object.entries(gradeScale).map(([grade, info]) => (
                      <div
                        key={grade}
                        className={`flex flex-wrap items-center gap-x-4 gap-y-1 py-3 ${grade !== "A" ? "border-t border-zinc-600/25" : ""}`}
                      >
                        <span className={`w-8 font-semibold ${info.color}`}>{grade}</span>
                        <span className="text-sm text-zinc-400 tabular-nums">
                          {info.min} – {info.max}%
                        </span>
                        <span className="text-sm text-zinc-500">{info.points.toFixed(1)} pts</span>
                        <span className="text-sm text-zinc-500 ms-auto">
                          {locale === "ar" ? info.descriptionAr : info.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
