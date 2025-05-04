import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import { useLocale } from "../context/LanguageContext";

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
      descriptionAr: "جيد جداً مرتفع",
    },
    B: {
      min: 80,
      max: 84.99,
      color: "text-blue-400",
      points: 3.0,
      description: "Very Good",
      descriptionAr: "جيد جداً",
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
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column - Course and Assignment Management */}
            <div className="space-y-4 md:space-y-6">
              {/* Assignments Card */}
              <Card
                title={locale === "ar" ? "التكليفات" : "Assignments"}
                className="relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-6">
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`text-xs sm:text-sm px-2 py-1 rounded-lg ${
                        isWeightExceeded
                          ? "bg-red-500/20 text-red-400 border border-red-500/20"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {locale === "ar" ? "النسبة الكلية" : "Total Weight"}:{" "}
                      {totalWeight.toFixed(0)}%
                    </div>
                    {isWeightExceeded && (
                      <div className="bg-red-500/20 text-red-400 border border-red-500/20 text-xs sm:text-sm px-2 py-1 rounded-lg">
                        {locale === "ar" ? "يتجاوز 100%" : "Exceeds 100%"}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addAssignment}
                    className="!p-2"
                    aria-label={
                      locale === "ar" ? "إضافة تكليف" : "Add assignment"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </Button>
                </div>

                {assignments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-3 text-center min-h-[200px] sm:min-h-[250px] bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-600 mb-3"
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
                    <p className="text-zinc-400 text-sm sm:text-base mb-1">
                      {locale === "ar"
                        ? "لا توجد تكليفات بعد"
                        : "No Assignments Yet"}
                    </p>
                    <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                      {locale === "ar"
                        ? "أضف تكليفك الأول لبدء حساب درجتك"
                        : "Add your first assignment to start calculating your grade"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`p-3 md:p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 ${
                          assignment.score !== null ? "bg-opacity-70" : ""
                        }`}
                      >
                        {/* Mobile view - Stacked layout */}
                        <div className="block lg:hidden space-y-3">
                          <Input
                            label={
                              locale === "ar"
                                ? "اسم التكليف"
                                : "Assignment Name"
                            }
                            value={assignment.name}
                            onChange={(e) =>
                              updateAssignment(
                                assignment.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              label={
                                locale === "ar" ? "الوزن (%)" : "Weight (%)"
                              }
                              type="number"
                              min="0"
                              max="100"
                              value={assignment.weight}
                              onChange={(e) =>
                                updateAssignment(
                                  assignment.id,
                                  "weight",
                                  Number(e.target.value)
                                )
                              }
                            />
                            <Input
                              label={
                                locale === "ar" ? "الدرجة (%)" : "Score (%)"
                              }
                              type="number"
                              min="0"
                              max="100"
                              value={assignment.score || ""}
                              onChange={(e) =>
                                updateAssignment(
                                  assignment.id,
                                  "score",
                                  e.target.value === ""
                                    ? null
                                    : Math.min(
                                        100,
                                        Math.max(0, Number(e.target.value))
                                      )
                                )
                              }
                              placeholder={
                                locale === "ar"
                                  ? "لم يتم التصحيح"
                                  : "Not graded"
                              }
                            />
                          </div>
                        </div>

                        {/* Desktop view - Row layout */}
                        <div className="hidden lg:grid grid-cols-5 gap-4">
                          <div className="col-span-2">
                            <Input
                              label={
                                locale === "ar"
                                  ? "اسم التكليف"
                                  : "Assignment Name"
                              }
                              value={assignment.name}
                              onChange={(e) =>
                                updateAssignment(
                                  assignment.id,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-span-3 grid grid-cols-2 gap-4">
                            <Input
                              label={
                                locale === "ar" ? "الوزن (%)" : "Weight (%)"
                              }
                              type="number"
                              min="0"
                              max="100"
                              value={assignment.weight}
                              onChange={(e) =>
                                updateAssignment(
                                  assignment.id,
                                  "weight",
                                  Number(e.target.value)
                                )
                              }
                            />
                            <Input
                              label={
                                locale === "ar" ? "الدرجة (%)" : "Score (%)"
                              }
                              type="number"
                              min="0"
                              max="100"
                              value={assignment.score || ""}
                              onChange={(e) =>
                                updateAssignment(
                                  assignment.id,
                                  "score",
                                  e.target.value === ""
                                    ? null
                                    : Math.min(
                                        100,
                                        Math.max(0, Number(e.target.value))
                                      )
                                )
                              }
                              placeholder={
                                locale === "ar"
                                  ? "لم يتم التصحيح"
                                  : "Not graded"
                              }
                            />
                          </div>
                        </div>

                        {/* Footer with score ratio and delete button */}
                        <div className="flex items-center justify-between mt-3 pt-3 md:mt-4 md:pt-4 border-t border-zinc-700/30">
                          <div className="text-xs sm:text-sm font-medium bg-zinc-800/80 rounded-lg px-2 sm:px-3 py-1 border border-zinc-700/50">
                            {assignment.score !== null ? (
                              <>
                                <span className="text-blue-400">
                                  {(
                                    (assignment.score * assignment.weight) /
                                    100
                                  ).toFixed(1)}
                                </span>
                                <span className="text-zinc-600">/</span>
                                <span className="text-zinc-400">
                                  {assignment.weight.toFixed(1)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-zinc-600">--</span>
                                <span className="text-zinc-600">/</span>
                                <span className="text-zinc-500">
                                  {assignment.weight.toFixed(1)}
                                </span>
                              </>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAssignment(assignment.id)}
                            className="!p-2"
                            aria-label={
                              locale === "ar"
                                ? "حذف التكليف"
                                : "Remove assignment"
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Grade Results */}
            <div className="space-y-4 md:space-y-6">
              <Card
                title={
                  locale === "ar"
                    ? "نتائج حساب الدرجات"
                    : "Grade Calculation Results"
                }
              >
                {!hasCompletedAssignments ? (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-zinc-600 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <p className="text-zinc-400 text-sm sm:text-base mb-1">
                      {locale === "ar" ? "لا توجد درجات بعد" : "No Grades Yet"}
                    </p>
                    <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                      {locale === "ar"
                        ? "أضف التكليفات ودرجاتها لرؤية حساب درجتك"
                        : "Add assignments and their scores to see your grade calculation"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Main Grade Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      {/* Current Standing */}
                      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl border border-zinc-700/50 p-4 md:p-6 flex flex-col items-center justify-center">
                        <h3 className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2 md:mb-4">
                          {locale === "ar"
                            ? "الوضع الحالي"
                            : "Current Standing"}
                        </h3>
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-1 md:mb-2">
                          {currentGrade.toFixed(1)}%
                        </div>
                        <div
                          className={`text-xl md:text-2xl font-semibold ${currentLetterGrade.color} mb-1`}
                        >
                          {currentLetterGrade.letter}
                        </div>
                        <div className="text-xs md:text-sm text-zinc-400">
                          {currentLetterGrade.points.toFixed(2)}{" "}
                          {locale === "ar" ? "نقاط المعدل" : "GPA Points"}
                        </div>
                        <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-zinc-700/50 text-center w-full">
                          <div className="text-xs md:text-sm text-zinc-500">
                            {locale === "ar"
                              ? `بناءً على ${
                                  assignments.filter((a) => a.score !== null)
                                    .length
                                } تكليفات مكتملة`
                              : `Based on ${
                                  assignments.filter((a) => a.score !== null)
                                    .length
                                } completed assignments`}
                          </div>
                        </div>
                      </div>

                      {/* Projected Final */}
                      <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-xl border border-zinc-700/50 p-4 md:p-6 flex flex-col items-center justify-center">
                        <h3 className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2 md:mb-4">
                          {locale === "ar"
                            ? "التوقع النهائي"
                            : "Projected Final"}
                        </h3>
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 md:mb-2">
                          {finalGrade.toFixed(1)}%
                        </div>
                        <div
                          className={`text-xl md:text-2xl font-semibold ${finalLetterGrade.color} mb-1`}
                        >
                          {finalLetterGrade.letter}
                        </div>
                        <div className="text-xs md:text-sm text-zinc-400">
                          {finalLetterGrade.points.toFixed(2)}{" "}
                          {locale === "ar" ? "نقاط المعدل" : "GPA Points"}
                        </div>
                        <div className="mt-3 pt-3 md:mt-4 md:pt-4 border-t border-zinc-700/50 text-center w-full">
                          <div className="text-xs md:text-sm text-zinc-500">
                            {locale === "ar"
                              ? "إذا حصلت على 0% في العمل المتبقي"
                              : "If remaining work receives 0%"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 p-4 md:p-6">
                      <h3 className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3 md:mb-4">
                        {locale === "ar" ? "تفصيل الدرجات" : "Grade Breakdown"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">
                            {locale === "ar"
                              ? "العمل المكتمل"
                              : "Completed Work"}
                          </div>
                          <div className="text-base md:text-lg font-medium text-zinc-200">
                            {assignments
                              .filter((a) => a.score !== null)
                              .reduce((sum, a) => sum + a.weight, 0)}
                            % {locale === "ar" ? "من المجموع" : "of total"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">
                            {locale === "ar"
                              ? "العمل المتبقي"
                              : "Remaining Work"}
                          </div>
                          <div className="text-base md:text-lg font-medium text-zinc-200">
                            {assignments
                              .filter((a) => a.score === null)
                              .reduce((sum, a) => sum + a.weight, 0)}
                            % {locale === "ar" ? "من المجموع" : "of total"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">
                            {locale === "ar"
                              ? "تقدم المقرر"
                              : "Course Progress"}
                          </div>
                          <div className="text-base md:text-lg font-medium text-zinc-200">
                            {(
                              (assignments.filter((a) => a.score !== null)
                                .length /
                                assignments.length) *
                              100
                            ).toFixed(0)}
                            % {locale === "ar" ? "مكتمل" : "complete"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {/* Grade Scale Reference */}
              <Card
                title={
                  locale === "ar" ? "مرجع سلم الدرجات" : "Grade Scale Reference"
                }
              >
                <div className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 overflow-hidden">
                  <div className="overflow-x-auto -mx-4 px-4">
                    <table className="w-full min-w-[500px]">
                      <thead className="bg-zinc-800/50">
                        <tr>
                          <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            {locale === "ar" ? "الدرجة" : "Grade"}
                          </th>
                          <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            {locale === "ar" ? "النطاق" : "Range"}
                          </th>
                          <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            {locale === "ar" ? "النقاط" : "Points"}
                          </th>
                          <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            {locale === "ar" ? "الوصف" : "Description"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {Object.entries(gradeScale).map(([grade, info]) => (
                          <tr
                            key={grade}
                            className={`${info.color} hover:bg-zinc-800/30 transition-colors`}
                          >
                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-xs md:text-sm font-medium">
                              {grade}
                            </td>
                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-xs md:text-sm">
                              {locale === "ar"
                                ? `${info.min} إلى ${info.max}`
                                : `${info.min} to ${info.max}`}
                            </td>
                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-xs md:text-sm font-medium">
                              {info.points.toFixed(2)}
                            </td>
                            <td className="px-3 md:px-4 py-2 whitespace-nowrap text-xs md:text-sm">
                              {locale === "ar"
                                ? info.descriptionAr
                                : info.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
