import { useState } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import Checkbox from "../components/ui/Checkbox";

type Course = {
  id: string;
  name: string;
  creditHours: number;
  difficulty: "easy" | "medium" | "hard";
  hasAssignments: boolean;
  hasUpcomingExam: boolean;
};

export default function StudyTimeCalculator() {
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "",
      creditHours: 3,
      difficulty: "medium",
      hasAssignments: false,
      hasUpcomingExam: false,
    },
  ]);

  const [results, setResults] = useState<{
    totalHours: number;
    weeklyBreakdown: {
      lectures: number;
      assignments: number;
      examPrep: number;
      selfStudy: number;
    };
    dailyRecommendation: number;
  } | null>(null);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Math.random().toString(),
        name: "",
        creditHours: 3,
        difficulty: "medium",
        hasAssignments: false,
        hasUpcomingExam: false,
      },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (
    id: string,
    field: keyof Course,
    value: string | number | boolean
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              [field]:
                field === "creditHours"
                  ? Math.max(1, Math.min(6, Number(value)))
                  : value,
            }
          : course
      )
    );
  };

  const calculateStudyTime = () => {
    let totalHours = 0;
    let assignmentHours = 0;
    let examPrepHours = 0;
    let lectureHours = 0;

    courses.forEach((course) => {
      // Base study hours per credit hour (2-3 hours per credit hour is a common recommendation)
      const baseHours = course.creditHours * 2.5;

      // Adjust for difficulty
      const difficultyMultiplier =
        course.difficulty === "easy"
          ? 0.8
          : course.difficulty === "hard"
          ? 1.3
          : 1;

      // Calculate lecture hours (1 hour per credit hour)
      lectureHours += course.creditHours;

      // Add assignment time if applicable
      if (course.hasAssignments) {
        assignmentHours += course.creditHours * 1.5;
      }

      // Add exam preparation time if applicable
      if (course.hasUpcomingExam) {
        examPrepHours += course.creditHours * 2;
      }

      // Calculate total hours for this course
      totalHours += baseHours * difficultyMultiplier;
    });

    // Add assignment and exam prep hours to total
    totalHours += assignmentHours + examPrepHours;

    // Calculate self-study hours (total minus lecture, assignment, and exam prep)
    const selfStudyHours =
      totalHours - (lectureHours + assignmentHours + examPrepHours);

    // Set results
    setResults({
      totalHours: Math.round(totalHours),
      weeklyBreakdown: {
        lectures: Math.round(lectureHours),
        assignments: Math.round(assignmentHours),
        examPrep: Math.round(examPrepHours),
        selfStudy: Math.round(selfStudyHours),
      },
      dailyRecommendation: Math.round(totalHours / 7),
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Study Time Calculator",
              ar: "حاسبة وقت الدراسة",
            }}
            description={{
              en: "Plan your study schedule effectively based on your course load",
              ar: "خطط جدول دراستك بفعالية بناءً على عبء المواد",
            }}
          />

          <Card>
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="p-4 bg-zinc-800/30 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {locale === "ar"
                        ? `المادة ${index + 1}`
                        : `Course ${index + 1}`}
                    </h3>
                    {courses.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCourse(course.id)}
                        icon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        }
                      >
                        {locale === "ar" ? "حذف" : "Remove"}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={locale === "ar" ? "اسم المادة" : "Course Name"}
                      value={course.name}
                      onChange={(e) =>
                        updateCourse(course.id, "name", e.target.value)
                      }
                      placeholder={
                        locale === "ar"
                          ? "أدخل اسم المادة"
                          : "Enter course name"
                      }
                    />

                    <Input
                      type="number"
                      label={
                        locale === "ar" ? "الساعات المعتمدة" : "Credit Hours"
                      }
                      value={course.creditHours}
                      onChange={(e) =>
                        updateCourse(course.id, "creditHours", e.target.value)
                      }
                      min={1}
                      max={6}
                    />

                    <Select
                      label={locale === "ar" ? "مستوى الصعوبة" : "Difficulty"}
                      value={course.difficulty}
                      onChange={(e) =>
                        updateCourse(
                          course.id,
                          "difficulty",
                          e.target.value as "easy" | "medium" | "hard"
                        )
                      }
                    >
                      <option value="easy">
                        {locale === "ar" ? "سهل" : "Easy"}
                      </option>
                      <option value="medium">
                        {locale === "ar" ? "متوسط" : "Medium"}
                      </option>
                      <option value="hard">
                        {locale === "ar" ? "صعب" : "Hard"}
                      </option>
                    </Select>

                    <div className="flex flex-col gap-3">
                      <Checkbox
                        label={
                          locale === "ar" ? "لديه واجبات" : "Has Assignments"
                        }
                        checked={course.hasAssignments}
                        onChange={(e) =>
                          updateCourse(
                            course.id,
                            "hasAssignments",
                            e.target.checked
                          )
                        }
                      />

                      <Checkbox
                        label={
                          locale === "ar"
                            ? "لديه اختبار قادم"
                            : "Has Upcoming Exam"
                        }
                        checked={course.hasUpcomingExam}
                        onChange={(e) =>
                          updateCourse(
                            course.id,
                            "hasUpcomingExam",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center gap-4">
                <Button
                  variant="secondary"
                  onClick={addCourse}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  }
                >
                  {locale === "ar" ? "إضافة مقرر" : "Add Course"}
                </Button>

                <Button onClick={calculateStudyTime}>
                  {locale === "ar"
                    ? "حساب وقت الدراسة"
                    : "Calculate Study Time"}
                </Button>
              </div>
            </div>
          </Card>

          {results && (
            <Card
              title={
                locale === "ar"
                  ? "توصيات وقت الدراسة"
                  : "Study Time Recommendations"
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-800/30 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">
                      {locale === "ar"
                        ? "إجمالي ساعات الدراسة الأسبوعية"
                        : "Total Weekly Study Hours"}
                    </h4>
                    <p className="text-3xl font-bold text-blue-400">
                      {results.totalHours}{" "}
                      <span className="text-lg text-zinc-400">
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-800/30 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">
                      {locale === "ar"
                        ? "التوصية اليومية"
                        : "Daily Recommendation"}
                    </h4>
                    <p className="text-3xl font-bold text-blue-400">
                      {results.dailyRecommendation}{" "}
                      <span className="text-lg text-zinc-400">
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-lg">
                  <h4 className="text-lg font-medium mb-4">
                    {locale === "ar" ? "التقسيم الأسبوعي" : "Weekly Breakdown"}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>{locale === "ar" ? "المحاضرات" : "Lectures"}</span>
                      <span className="font-medium">
                        {results.weeklyBreakdown.lectures}{" "}
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {locale === "ar" ? "الواجبات" : "Assignments"}
                      </span>
                      <span className="font-medium">
                        {results.weeklyBreakdown.assignments}{" "}
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {locale === "ar"
                          ? "التحضير للاختبارات"
                          : "Exam Preparation"}
                      </span>
                      <span className="font-medium">
                        {results.weeklyBreakdown.examPrep}{" "}
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        {locale === "ar" ? "الدراسة الذاتية" : "Self Study"}
                      </span>
                      <span className="font-medium">
                        {results.weeklyBreakdown.selfStudy}{" "}
                        {locale === "ar" ? "ساعة" : "hours"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">
                    {locale === "ar" ? "نصائح للدراسة الفعالة" : "Study Tips"}
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-zinc-300">
                    <li>
                      {locale === "ar"
                        ? "قسّم وقت دراستك إلى فترات قصيرة مع استراحات منتظمة"
                        : "Break your study time into shorter sessions with regular breaks"}
                    </li>
                    <li>
                      {locale === "ar"
                        ? "ركز على المواد الصعبة عندما تكون في ذروة نشاطك"
                        : "Focus on difficult subjects when you're most alert"}
                    </li>
                    <li>
                      {locale === "ar"
                        ? "خصص وقتاً إضافياً للمراجعة قبل الاختبارات"
                        : "Allocate extra time for review before exams"}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
