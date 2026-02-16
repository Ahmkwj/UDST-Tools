import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Feature flags
const SHOW_FUTURE_SCENARIOS = false;

/* Theme: match Attendance page exactly */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const gpaDisplayCardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-6 lg:!px-8 lg:!pt-7 lg:!pb-7 flex flex-col`;
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] [&_input]:py-3 [&_select]:py-3 sm:[&_input]:min-h-0 sm:[&_select]:min-h-0 sm:[&_input]:py-2.5 sm:[&_select]:py-2.5";
const sectionGap = "space-y-8 sm:space-y-12";

type Course = {
  grade: string;
  credits: number;
  isRepeat: boolean;
  previousGrade: string;
};

type Scenario = {
  numCourses: number;
  grades: string[];
  termGPA: number;
  cumulativeGPA: number;
};

export default function GPACalculator() {
  const locale = useLocale();
  const [totalGradePoints, setTotalGradePoints] = useState<number | string>("");
  const [totalCredits, setTotalCredits] = useState<number | string>("");
  const [numberOfCourses, setNumberOfCourses] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { numCourses: 4, grades: [], termGPA: 0, cumulativeGPA: 0 },
    { numCourses: 3, grades: [], termGPA: 0, cumulativeGPA: 0 },
    { numCourses: 2, grades: [], termGPA: 0, cumulativeGPA: 0 },
  ]);

  const [newCumulativeGPA, setNewCumulativeGPA] = useState<number>(0);
  const [previousCumulativeGPA, setPreviousCumulativeGPA] = useState<number>(0);
  const [newTotalGradePoints, setNewTotalGradePoints] = useState<number>(0);
  const [newTotalCredits, setNewTotalCredits] = useState<number>(0);

  // Initialize courses when number of courses changes
  useEffect(() => {
    let newCourses: Course[] = [];

    if (numberOfCourses > courses.length) {
      // Adding new courses
      newCourses = [
        ...courses, // Keep existing courses
        ...Array(numberOfCourses - courses.length)
          .fill(null)
          .map(() => ({
            grade: "A",
            credits: 3,
            isRepeat: false,
            previousGrade: "F",
          })),
      ];
    } else {
      // Removing courses or keeping the same number
      newCourses = courses.slice(0, numberOfCourses);
    }

    setCourses(newCourses);
  }, [numberOfCourses]);

  // Recalculate GPA whenever inputs change
  useEffect(() => {
    calculateGPA();
  }, [totalGradePoints, totalCredits, courses]);

  // Update scenarios whenever the calculated GPA changes
  useEffect(() => {
    refreshScenarios();
  }, [newCumulativeGPA, newTotalCredits]);

  const updateCourse = (
    index: number,
    field: keyof Course,
    value: string | number | boolean,
  ) => {
    const updatedCourses = [...courses];

    // For credits, ensure a positive value
    if (field === "credits") {
      const numValue =
        typeof value === "number" ? value : parseFloat(value as string);
      value = Math.max(1, numValue || 1);
    }

    updatedCourses[index] = { ...updatedCourses[index], [field]: value };

    // If repeat is turned off, clear previous grade
    if (field === "isRepeat" && value === false) {
      updatedCourses[index].previousGrade = "F";
    }

    // Only allow repeating for failing grades (D+, D, F) - withdrawals cannot be repeated
    if (
      field === "previousGrade" &&
      updatedCourses[index].isRepeat &&
      !["F", "D+", "D"].includes(value as string)
    ) {
      updatedCourses[index].isRepeat = false;
    }

    // If current grade is W, disable repeat option
    if (field === "grade" && value === "W") {
      updatedCourses[index].isRepeat = false;
    }

    setCourses(updatedCourses);
  };

  const calculateGradePoints = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      A: 4.0,
      "B+": 3.5,
      B: 3.0,
      "C+": 2.5,
      C: 2.0,
      "D+": 1.5,
      D: 1.0,
      F: 0.0,
      W: 0.0, // Withdrawal - no grade points, no credits counted
    };
    return gradePoints[grade] || 0;
  };

  const calculateGPA = () => {
    // Validate and sanitize input values
    const tgp = Math.max(0, parseFloat(totalGradePoints as string) || 0);
    const tc = Math.max(0, parseFloat(totalCredits as string) || 0);

    let newTGP = tgp;
    let newTC = tc;

    courses.forEach((course) => {
      // Ensure course credits are at least 1
      const courseCredits = Math.max(1, course.credits || 1);
      const gradePoints = calculateGradePoints(course.grade) * courseCredits;

      // Handle withdrawal grades - they don't count towards GPA at all
      if (course.grade === "W") {
        // Withdrawal: no grade points added, no credits added
        return; // Skip this course entirely
      }

      if (course.isRepeat) {
        // Subtract old grade points if repeating
        if (course.previousGrade && course.previousGrade !== "W") {
          newTGP -= calculateGradePoints(course.previousGrade) * courseCredits;
        }
        // Only add new grade points and credits if not a withdrawal
        newTGP += gradePoints;
        // For repeats, credits were already counted in the original attempt
      } else {
        newTGP += gradePoints;
        newTC += courseCredits;
      }
    });

    // Ensure we don't divide by zero
    const prevGPA = tc > 0 ? tgp / tc : 0;
    const newGPA = newTC > 0 ? newTGP / newTC : 0;

    // Ensure GPA is within valid range
    const validPrevGPA = Math.min(4.0, Math.max(0, prevGPA));
    const validNewGPA = Math.min(4.0, Math.max(0, newGPA));

    setPreviousCumulativeGPA(validPrevGPA);
    setNewCumulativeGPA(validNewGPA);
    setNewTotalGradePoints(newTGP);
    setNewTotalCredits(newTC);
  };

  const refreshScenarios = () => {
    // Validate inputs before calculating scenarios
    const currentGPA = newCumulativeGPA || 0;
    const currentCredits = parseFloat(totalCredits as string) || 0;

    // Only proceed if we have valid GPA data
    if (currentCredits <= 0 && courses.length === 0) {
      // Set default values for scenarios when no data is available
      const updatedScenarios = scenarios.map((scenario) => ({
        ...scenario,
        grades: Array(scenario.numCourses).fill("B"),
        termGPA: 3.0,
        cumulativeGPA: 3.0,
      }));
      setScenarios(updatedScenarios);
      return;
    }

    const updatedScenarios = scenarios.map((scenario) => {
      // Generate more realistic grade distribution
      const randomGrades = generateRealisticGrades(scenario.numCourses);

      // Calculate term GPA correctly based on credits per course
      const scenarioCredits = scenario.numCourses * 3; // Assuming 3 credits per course
      const termGPA = calculateTermGPA(randomGrades);

      // Calculate cumulative GPA with existing + scenario credits
      const updatedCumulativeGPA = calculateNewCumulativeGPA(
        currentGPA,
        currentCredits,
        termGPA,
        scenarioCredits,
      );

      return {
        ...scenario,
        grades: randomGrades,
        termGPA,
        cumulativeGPA: updatedCumulativeGPA,
      };
    });

    setScenarios(updatedScenarios);
  };

  const refreshSingleScenario = (index: number) => {
    const scenario = scenarios[index];
    const currentGPA = newCumulativeGPA || 0;
    const currentCredits = parseFloat(totalCredits as string) || 0;

    // Generate new random grades with realistic distribution
    const randomGrades = generateRealisticGrades(scenario.numCourses);

    // Calculate term GPA correctly
    const termGPA = calculateTermGPA(randomGrades);
    const scenarioCredits = scenario.numCourses * 3; // Assuming 3 credits per course

    // Calculate new cumulative GPA
    const updatedCumulativeGPA = calculateNewCumulativeGPA(
      currentGPA,
      currentCredits,
      termGPA,
      scenarioCredits,
    );

    const updatedScenarios = [...scenarios];
    updatedScenarios[index] = {
      ...scenario,
      grades: randomGrades,
      termGPA,
      cumulativeGPA: updatedCumulativeGPA,
    };

    setScenarios(updatedScenarios);
  };

  // Generate realistic grade distribution based on current GPA trend
  const generateRealisticGrades = (numCourses: number): string[] => {
    // Get current GPA trend to influence grade distribution
    const currentGPA = newCumulativeGPA || 3.0; // Default to 3.0 if no GPA available

    // Define grade pools based on current performance
    let primaryGrades: string[] = [];
    let secondaryGrades: string[] = [];

    if (currentGPA >= 3.5) {
      // High performer - mostly A's and B+'s
      primaryGrades = ["A", "A", "A", "B+"];
      secondaryGrades = ["B", "B+", "A", "C+"];
    } else if (currentGPA >= 3.0) {
      // Good performer - mostly B+'s and B's
      primaryGrades = ["B+", "B+", "A", "B"];
      secondaryGrades = ["B", "C+", "A", "B+"];
    } else if (currentGPA >= 2.5) {
      // Average performer - mostly B's and C+'s
      primaryGrades = ["B", "B", "C+", "B+"];
      secondaryGrades = ["C+", "C", "B", "D+"];
    } else {
      // Struggling performer - mostly C+'s and C's
      primaryGrades = ["C+", "C", "B", "D+"];
      secondaryGrades = ["C", "D+", "C+", "D"];
    }

    // Generate grades using primary pool 70% of the time, secondary 30%
    return Array.from({ length: numCourses }, () => {
      const useSecondary = Math.random() > 0.7;
      const gradePool = useSecondary ? secondaryGrades : primaryGrades;
      return gradePool[Math.floor(Math.random() * gradePool.length)];
    });
  };

  const calculateTermGPA = (grades: string[]): number => {
    if (grades.length === 0) return 0;

    // Assume each course is 3 credits
    const creditsPerCourse = 3;
    let totalPoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
      // Skip withdrawal grades - they don't count towards GPA
      if (grade === "W") {
        return; // Don't add points or credits for withdrawals
      }

      totalPoints += calculateGradePoints(grade) * creditsPerCourse;
      totalCredits += creditsPerCourse;
    });

    // Return the weighted GPA
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateNewCumulativeGPA = (
    oldGPA: number,
    oldCredits: number,
    termGPA: number,
    termCredits: number,
  ): number => {
    // Validate inputs to prevent calculation errors
    const validOldGPA = isNaN(oldGPA) ? 0 : Math.max(0, Math.min(4.0, oldGPA));
    const validOldCredits = isNaN(oldCredits) ? 0 : Math.max(0, oldCredits);
    const validTermGPA = isNaN(termGPA)
      ? 0
      : Math.max(0, Math.min(4.0, termGPA));
    const validTermCredits = isNaN(termCredits) ? 0 : Math.max(0, termCredits);

    // Calculate total grade points
    const oldPoints = validOldGPA * validOldCredits;
    const newPoints = validTermGPA * validTermCredits;
    const totalCredits = validOldCredits + validTermCredits;

    // Return cumulative GPA, ensuring it's within valid range (0-4.0)
    const cumulativeGPA =
      totalCredits > 0 ? (oldPoints + newPoints) / totalCredits : 0;
    return Math.min(4.0, Math.max(0, cumulativeGPA));
  };

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "GPA Calculator",
              ar: "حاسبة المعدل التراكمي",
            }}
            description={{
              en: "Enter your transcript totals and this semester's courses to see your new cumulative GPA.",
              ar: "أدخل إجماليات سجلك ومواد الفصل الحالي لمعرفة معدلك التراكمي الجديد.",
            }}
          />

          <div className={sectionGap}>
            {/* Row 1: Current GPA display + Inputs side by side (like Absenteeism | Semester Setup) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <Card
                title={locale === "ar" ? "المعدل الحالي" : "Current GPA"}
                className={gpaDisplayCardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "معدلك التراكمي من المواد المنجزة حتى الآن."
                    : "Your cumulative GPA from completed courses so far."}
                </p>
                <div className="flex flex-1 flex-col min-h-[120px] sm:min-h-[160px] w-full">
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums tracking-tight text-blue-400 text-center">
                      {previousCumulativeGPA.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider text-center">
                    / 4.00
                  </p>
                </div>
              </Card>

              <Card
                title={
                  locale === "ar" ? "من السجل الأكاديمي" : "From Transcript"
                }
                className={cardClass}
              >
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "أدخل الإجماليات من كشف درجاتك الأكاديمي."
                    : "Enter the totals from your academic transcript."}
                </p>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <Input
                    label={locale === "ar" ? "نقاط الدرجات" : "Grade Points"}
                    type="number"
                    min="0"
                    step="0.1"
                    value={totalGradePoints}
                    onChange={(e) => setTotalGradePoints(e.target.value)}
                    placeholder="0"
                    helperText={
                      locale === "ar"
                        ? "مجموع (الدرجة × الساعات) لجميع المواد السابقة"
                        : "Sum of (grade × credits) for all past courses"
                    }
                    className={inputSelectClass}
                  />
                  <Input
                    label={locale === "ar" ? "الساعات المعتمدة" : "Credits"}
                    type="number"
                    min="0"
                    step="1"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    placeholder="0"
                    helperText={
                      locale === "ar"
                        ? "مجموع ساعات المواد المنجزة"
                        : "Total completed credit hours"
                    }
                    className={inputSelectClass}
                  />
                </div>
              </Card>
            </div>

            {/* Row 2: This Semester - courses as simple rows, no inner cards */}
            <Card
              title={locale === "ar" ? "مواد الفصل الحالي" : "This Semester"}
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "أضف مواد هذا الفصل والدرجات المتوقعة أو الفعلية."
                  : "Add this term's courses and expected or actual grades."}
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="w-full max-w-xs">
                  <Select
                    label={locale === "ar" ? "عدد المواد" : "Number of courses"}
                    value={numberOfCourses.toString()}
                    onChange={(e) =>
                      setNumberOfCourses(parseInt(e.target.value))
                    }
                    className={inputSelectClass}
                  >
                    <option value="0">
                      {locale === "ar" ? "اختر" : "Select"}
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}{" "}
                        {locale === "ar"
                          ? num === 1
                            ? "مادة"
                            : "مواد"
                          : num === 1
                            ? "course"
                            : "courses"}
                      </option>
                    ))}
                  </Select>
                </div>
                {numberOfCourses > 0 && (
                  <div className="space-y-6">
                    {courses.map((course, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 p-4 sm:p-5"
                      >
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                         
                          <span className="text-sm font-medium text-white">
                            {locale === "ar"
                              ? `المادة ${index + 1}`
                              : `Course ${index + 1}`}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 min-w-0">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-medium text-zinc-500 whitespace-nowrap w-20 sm:w-auto shrink-0">
                              {locale === "ar" ? "الدرجة" : "Grade"}
                            </span>
                            <Select
                              value={course.grade}
                              onChange={(e) =>
                                updateCourse(index, "grade", e.target.value)
                              }
                              className={`flex-1 min-w-0 sm:flex-none sm:min-w-[88px] ${inputSelectClass} !mb-0 [&_select]:py-2 [&_select]:text-sm w-full sm:w-auto`}
                            >
                              {[
                                "A",
                                "B+",
                                "B",
                                "C+",
                                "C",
                                "D+",
                                "D",
                                "F",
                                "W",
                              ].map((g) => (
                                <option key={g} value={g}>
                                  {g}
                                  {g === "W"
                                    ? locale === "ar"
                                      ? " (انسحاب)"
                                      : " (W)"
                                    : ""}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-medium text-zinc-500 whitespace-nowrap w-20 sm:w-auto shrink-0">
                              {locale === "ar" ? "الساعات" : "Credits"}
                            </span>
                            <Input
                              type="number"
                              min="1"
                              max="6"
                              step="1"
                              value={course.credits}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                updateCourse(
                                  index,
                                  "credits",
                                  isNaN(v) ? 1 : Math.max(1, Math.min(6, v)),
                                );
                              }}
                              className={`flex-1 min-w-0 sm:flex-none sm:w-20 w-full min-w-[72px] ${inputSelectClass} !mb-0 [&_input]:py-2 [&_input]:text-center`}
                            />
                          </div>
                          {course.grade === "W" && (
                            <span className="text-xs text-amber-400 w-full sm:w-auto">
                              {locale === "ar"
                                ? "لا تدخل في المعدل"
                                : "Not counted in GPA"}
                            </span>
                          )}
                          {course.grade !== "W" && (
                            <div
                              className={`
                                w-full flex flex-col gap-3 pt-3 mt-1 border-t border-zinc-600/25
                                sm:flex-row sm:flex-wrap sm:gap-3 sm:pt-0 sm:mt-0 sm:border-t-0 sm:border-zinc-600/30 sm:w-auto shrink-0
                                ${locale === "ar" ? "sm:me-auto sm:border-r sm:pr-3 sm:pl-4" : "sm:ms-auto sm:border-l sm:pl-3 sm:pr-4"}
                              `}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                                  {locale === "ar"
                                    ? "أقوم بإعادة هذه المادة"
                                    : "Repeating this course?"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateCourse(
                                      index,
                                      "isRepeat",
                                      !course.isRepeat,
                                    )
                                  }
                                  className={`
                                    shrink-0 rounded-xl border px-3 py-2.5 min-h-[44px] text-xs font-medium transition-all duration-200
                                    sm:py-2 sm:min-h-0
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-[#141414]
                                    ${
                                      course.isRepeat
                                        ? "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/15"
                                        : "border-zinc-500/40 bg-zinc-800/50 text-zinc-400 hover:border-zinc-400/50 hover:text-zinc-300"
                                    }
                                  `}
                                >
                                  {course.isRepeat
                                    ? locale === "ar"
                                      ? "نعم"
                                      : "Yes"
                                    : locale === "ar"
                                      ? "لا"
                                      : "No"}
                                </button>
                              </div>
                              {course.isRepeat && (
                                <div className="flex flex-col gap-1.5 w-full sm:flex-row sm:items-center sm:gap-2 sm:w-auto">
                                  <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
                                    {locale === "ar"
                                      ? "الدرجة السابقة:"
                                      : "Previous Grade:"}
                                  </span>
                                  <Select
                                    value={course.previousGrade}
                                    onChange={(e) =>
                                      updateCourse(
                                        index,
                                        "previousGrade",
                                        e.target.value,
                                      )
                                    }
                                    className={`flex-1 min-w-0 sm:flex-none ${inputSelectClass} !mb-0 min-w-[72px] w-full max-w-[140px] sm:max-w-none [&_select]:py-2 [&_select]:text-sm`}
                                  >
                                    {["F", "D+", "D"].map((g) => (
                                      <option key={g} value={g}>
                                        {g}
                                      </option>
                                    ))}
                                  </Select>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Row 3: Results - no inner cards */}
            <Card
              title={locale === "ar" ? "المعدل الجديد" : "New GPA"}
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                {locale === "ar"
                  ? "معدلك التراكمي المتوقع بعد إضافة هذا الفصل."
                  : "Your projected cumulative GPA after this semester."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 lg:gap-8 items-start">
                <div className="flex flex-col items-center sm:items-start">
                  <p className="text-5xl sm:text-6xl lg:text-7xl font-bold tabular-nums tracking-tight text-blue-400 text-center sm:text-left">
                    {newCumulativeGPA.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                    / 4.00
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-w-0 w-full">
                  {courses.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {locale === "ar"
                          ? `بناءً على الدرجات في ${courses.length === 1 ? "مادتك" : `موادك (${courses.length})`} هذا الفصل.`
                          : `Based on the grades for your ${courses.length} ${courses.length === 1 ? "course" : "courses"} this semester.`}
                      </p>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {locale === "ar" ? (
                          <>
                            معدلك التراكمي في نهاية الفصل{" "}
                            <span className="font-semibold text-white">
                              {newCumulativeGPA.toFixed(2)}
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            Your cumulative GPA at the end of the term will be{" "}
                            <span className="font-semibold text-white">
                              {newCumulativeGPA.toFixed(2)}
                            </span>
                            .
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {locale === "ar"
                        ? "أدخل مواد الفصل الحالي أعلاه لمعرفة معدلك المتوقع."
                        : "Enter this semester's courses above to see your projected GPA."}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-1">
                    <span className="text-xs font-medium text-zinc-500">
                      {locale === "ar"
                        ? "نقاط الدرجات الجديدة: "
                        : "New Grade points:"}{" "}
                      <span className="font-semibold text-white tabular-nums">
                        {newTotalGradePoints.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      {locale === "ar"
                        ? "إجمالي الساعات الجديدة:"
                        : "New Total Credits:"}{" "}
                      <span className="font-semibold text-white tabular-nums">
                        {newTotalCredits.toFixed(0)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 sm:pt-6 sm:mt-6 border-t border-zinc-600/40">
                <h3 className="text-sm font-semibold text-white mb-1">
                  {locale === "ar"
                    ? "من السابق إلى الحالي"
                    : "Previous to current"}
                </h3>
                <p className="text-xs text-zinc-500 mb-3 sm:mb-4">
                  {locale === "ar"
                    ? "مقارنة المعدل قبل وبعد إضافة هذا الفصل."
                    : "Compare GPA before and after this semester."}
                </p>

                {courses.some((course) => course.grade === "W") && (
                  <p className="mb-3 sm:mb-4 text-xs text-amber-400/90">
                    {locale === "ar"
                      ? "الانسحاب (W) لا يدخل في المعدل ولا في الساعات."
                      : "Withdrawals (W) are not included in GPA or credits."}
                  </p>
                )}
                <div className="rounded-xl bg-zinc-800/30 border border-zinc-600/30 p-3 sm:p-5">
                  <div className="h-[160px] sm:h-[180px] lg:h-[200px] w-full min-h-0">
                    <Line
                      data={{
                        labels: [
                          locale === "ar" ? "السابق" : "Previous",
                          locale === "ar" ? "الحالي" : "Current",
                        ],
                        datasets: [
                          {
                            label: locale === "ar" ? "المعدل التراكمي" : "GPA",
                            data: [previousCumulativeGPA, newCumulativeGPA],
                            borderColor: "rgb(59, 130, 246)",
                            backgroundColor: "rgba(59, 130, 246, 0.08)",
                            borderWidth: 2.5,
                            tension: 0,
                            fill: true,
                            pointBackgroundColor: [
                              "rgba(161, 161, 170, 0.6)",
                              "rgb(59, 130, 246)",
                            ],
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                          padding: { top: 8, bottom: 8, left: 4, right: 12 },
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: 4,
                            grid: {
                              color: "rgba(161, 161, 170, 0.15)",
                              drawTicks: false,
                            },
                            border: { display: false },
                            ticks: {
                              color: "rgba(161, 161, 170, 0.7)",
                              stepSize: 0.5,
                              font: { size: 11 },
                              callback: function (tickValue: number | string) {
                                return typeof tickValue === "number"
                                  ? tickValue.toFixed(1)
                                  : tickValue;
                              },
                            },
                          },
                          x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                              color: "rgba(161, 161, 170, 0.8)",
                              font: { size: 12 },
                            },
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(24, 24, 27, 0.98)",
                            titleColor: "rgb(255, 255, 255)",
                            bodyColor: "rgb(228, 228, 231)",
                            padding: 12,
                            borderColor: "rgba(63, 63, 70, 0.8)",
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                              label: (context: { parsed: { y: number } }) =>
                                locale === "ar"
                                  ? `المعدل: ${context.parsed.y.toFixed(2)}`
                                  : `GPA: ${context.parsed.y.toFixed(2)}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4 sm:mt-5">
                  <div
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 sm:py-2 text-sm font-medium min-h-[44px] sm:min-h-0 items-center justify-center ${
                      newCumulativeGPA > previousCumulativeGPA
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : newCumulativeGPA < previousCumulativeGPA
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/30"
                    }`}
                  >
                    {newCumulativeGPA > previousCumulativeGPA ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203a.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : newCumulativeGPA < previousCumulativeGPA ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>
                      {Math.abs(
                        newCumulativeGPA - previousCumulativeGPA,
                      ).toFixed(2)}{" "}
                      {locale === "ar" ? "فرق" : "change"}
                      {Math.abs(newCumulativeGPA - previousCumulativeGPA) >
                        0 && (
                        <span className="opacity-80">
                          {" "}
                          {locale === "ar" ? "عن" : "from"}{" "}
                          {previousCumulativeGPA.toFixed(2)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Future Scenarios Section - Full Width */}
          {SHOW_FUTURE_SCENARIOS && (
            <div className="mt-6 md:mt-8">
              <Card title="Future Scenarios" className={cardClass}>
                <div className="mb-6 md:mb-8">
                  <p className="text-base text-zinc-300">
                    Explore possible outcomes based on different course loads
                  </p>
                  {parseFloat(totalCredits as string) <= 0 &&
                    courses.length === 0 && (
                      <p className="text-sm text-amber-400 mt-2">
                        Enter your current GPA information to see personalized
                        scenarios
                      </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {scenarios.map((scenario, index) => {
                    const isGPAHigher =
                      scenario.cumulativeGPA > newCumulativeGPA;
                    const gpaDifference = Math.abs(
                      scenario.cumulativeGPA - newCumulativeGPA,
                    );

                    return (
                      <div
                        key={index}
                        className="relative bg-gradient-to-br from-zinc-800/50 via-zinc-900/50 to-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50"
                      >
                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-center justify-between bg-zinc-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 border-b border-zinc-700/50">
                            <h3 className="font-medium text-zinc-100">
                              {scenario.numCourses} Course
                              {scenario.numCourses > 1 ? "s" : ""}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              className="!p-2 opacity-60"
                              onClick={() => refreshSingleScenario(index)}
                              aria-label="Refresh scenario"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </Button>
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-6 space-y-6">
                            {/* GPA Information */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <div className="text-sm text-zinc-400">
                                  Term GPA
                                </div>
                                <div className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                                  {scenario.termGPA.toFixed(3)}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-zinc-400">
                                  Cumulative
                                </div>
                                <div className="flex items-baseline space-x-2">
                                  <div className="text-2xl font-semibold text-white">
                                    {scenario.cumulativeGPA.toFixed(3)}
                                  </div>
                                  {gpaDifference > 0.001 && (
                                    <div
                                      className={`flex items-center text-sm font-medium ${
                                        isGPAHigher
                                          ? "text-emerald-400"
                                          : "text-red-400"
                                      }`}
                                    >
                                      {isGPAHigher ? "↑" : "↓"}
                                      {gpaDifference.toFixed(3)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Credits Information */}
                            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-800/50">
                              <span className="text-sm text-zinc-400">
                                Total Credits
                              </span>
                              <span className="text-sm font-medium text-zinc-200">
                                +{scenario.numCourses * 3} Credits
                              </span>
                            </div>

                            {/* Projected Grades */}
                            <div>
                              <div className="text-sm text-zinc-400 mb-3">
                                Projected Grades
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {scenario.grades.map((grade, i) => {
                                  const gradeColors = {
                                    A: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                    "B+": "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                    B: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                                    "C+": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                    C: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                    "D+": "bg-red-500/20 text-red-400 border-red-500/30",
                                    D: "bg-red-500/20 text-red-400 border-red-500/30",
                                    F: "bg-red-500/20 text-red-400 border-red-500/30",
                                    W: "bg-zinc-700/50 text-zinc-400 border-zinc-600/50",
                                  };

                                  // Add a tooltip for grade explanation
                                  const gradePoints =
                                    calculateGradePoints(grade);
                                  const gradeTitle =
                                    grade === "W"
                                      ? `${grade} (Withdrawal - no effect on GPA)`
                                      : `${grade} (${gradePoints.toFixed(1)} points)`;

                                  return (
                                    <span
                                      key={i}
                                      title={gradeTitle}
                                      className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                        gradeColors[
                                          grade as keyof typeof gradeColors
                                        ]
                                      }`}
                                    >
                                      {grade}
                                    </span>
                                  );
                                })}
                              </div>

                              {/* Scenario impact explanation */}
                              <div className="mt-3 text-xs text-zinc-400">
                                {isGPAHigher ? (
                                  <p>
                                    This scenario would improve your GPA by{" "}
                                    {gpaDifference.toFixed(3)} points.
                                  </p>
                                ) : gpaDifference > 0.001 ? (
                                  <p>
                                    This scenario would decrease your GPA by{" "}
                                    {gpaDifference.toFixed(3)} points.
                                  </p>
                                ) : (
                                  <p>
                                    This scenario would maintain your current
                                    GPA.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
