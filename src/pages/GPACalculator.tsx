import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
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
  Legend
);

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
  const [totalGradePoints, setTotalGradePoints] = useState<number | string>("");
  const [totalCredits, setTotalCredits] = useState<number | string>("");
  const [numberOfCourses, setNumberOfCourses] = useState<number>(1);
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
    refreshScenarios();
  }, [totalGradePoints, totalCredits, courses]);

  const updateCourse = (
    index: number,
    field: keyof Course,
    value: string | number | boolean
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

    // Only allow repeating for failing grades
    if (
      field === "grade" &&
      updatedCourses[index].isRepeat &&
      ["A", "B+", "B", "C+", "C"].includes(value as string)
    ) {
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

      if (course.isRepeat) {
        // Subtract old grade points if repeating
        if (course.previousGrade) {
          newTGP -= calculateGradePoints(course.previousGrade) * courseCredits;
        }
        newTGP += gradePoints;
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

  const resetForm = () => {
    setTotalGradePoints("");
    setTotalCredits("");
    setNumberOfCourses(1);
    setCourses([
      {
        grade: "A",
        credits: 3,
        isRepeat: false,
        previousGrade: "F",
      },
    ]);
    setNewCumulativeGPA(0);
    setPreviousCumulativeGPA(0);
    setNewTotalGradePoints(0);
    setNewTotalCredits(0);
  };

  const refreshScenarios = () => {
    const currentGPA = newCumulativeGPA || 0;
    const currentCredits = parseFloat(totalCredits as string) || 0;

    const updatedScenarios = scenarios.map((scenario) => {
      const randomGrades = generateRandomGrades(scenario.numCourses);
      const termGPA = calculateTermGPA(randomGrades);
      const scenarioCredits = scenario.numCourses * 3;
      const updatedCumulativeGPA = calculateNewCumulativeGPA(
        currentGPA,
        currentCredits,
        termGPA,
        scenarioCredits
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

    const randomGrades = generateRandomGrades(scenario.numCourses);
    const termGPA = calculateTermGPA(randomGrades);
    const scenarioCredits = scenario.numCourses * 3;
    const updatedCumulativeGPA = calculateNewCumulativeGPA(
      currentGPA,
      currentCredits,
      termGPA,
      scenarioCredits
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

  const generateRandomGrades = (numCourses: number): string[] => {
    const grades = ["A", "B+", "B", "C+"];
    return Array.from(
      { length: numCourses },
      () => grades[Math.floor(Math.random() * grades.length)]
    );
  };

  const calculateTermGPA = (grades: string[]): number => {
    if (grades.length === 0) return 0;

    const total = grades.reduce(
      (sum, grade) => sum + calculateGradePoints(grade),
      0
    );
    return total / grades.length;
  };

  const calculateNewCumulativeGPA = (
    oldGPA: number,
    oldCredits: number,
    termGPA: number,
    termCredits: number
  ): number => {
    const oldPoints = oldGPA * oldCredits;
    const newPoints = termGPA * termCredits;
    const totalCredits = oldCredits + termCredits;

    return totalCredits > 0 ? (oldPoints + newPoints) / totalCredits : 0;
  };

  return (
    <div className="relative min-h-screen w-full py-8 px-4 md:px-8 overflow-y-auto bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Sections */}
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card title="Current GPA Information" className="relative">
              <div className="absolute top-6 right-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="!p-2"
                  onClick={resetForm}
                  aria-label="Reset calculator"
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
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </Button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Total Grade Points"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 95.500"
                    value={totalGradePoints}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (e.target.value === "" || isNaN(value)) {
                        setTotalGradePoints("");
                      } else {
                        setTotalGradePoints(Math.max(0, value));
                      }
                    }}
                    helperText="Total points earned so far"
                  />

                  <Input
                    label="Total Earned Credits"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="e.g. 50"
                    value={totalCredits}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (e.target.value === "" || isNaN(value)) {
                        setTotalCredits("");
                      } else {
                        setTotalCredits(Math.max(0, value));
                      }
                    }}
                    helperText="Total credits earned so far"
                  />
                </div>

                <Select
                  label="Number of Courses"
                  value={numberOfCourses}
                  onChange={(e) => setNumberOfCourses(parseInt(e.target.value))}
                  helperText="Choose the number of courses you are currently taking"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Select>
              </form>
            </Card>

            {/* Course Information Card */}
            {numberOfCourses > 0 && (
              <Card
                title="Course Information"
                className="bg-zinc-900/90 border border-zinc-800/50"
              >
                <div className="space-y-6">
                  {courses.map((course, index) => (
                    <div
                      key={index}
                      className="p-4 bg-zinc-800/40 border border-zinc-700/50 rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-blue-400">
                          Course {index + 1}
                        </h3>
                        <div className="text-xs font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-full">
                          {course.credits} Credits
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Grade"
                          value={course.grade}
                          onChange={(e) =>
                            updateCourse(index, "grade", e.target.value)
                          }
                        >
                          {["A", "B+", "B", "C+", "C", "D+", "D", "F"].map(
                            (grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            )
                          )}
                        </Select>

                        <Input
                          label="Credits"
                          type="number"
                          min="1"
                          step="1"
                          value={course.credits}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            updateCourse(
                              index,
                              "credits",
                              isNaN(value) ? 1 : Math.max(1, value)
                            );
                          }}
                        />
                      </div>

                      <Checkbox
                        checked={course.isRepeat}
                        onChange={(e) =>
                          updateCourse(index, "isRepeat", e.target.checked)
                        }
                        label="Repeating this course"
                      />

                      {course.isRepeat && (
                        <Select
                          label="Previous Grade"
                          value={course.previousGrade}
                          onChange={(e) =>
                            updateCourse(index, "previousGrade", e.target.value)
                          }
                        >
                          {["F", "D+", "D"].map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Results Section */}
          <div className="space-y-8">
            <Card title="GPA Calculation Result">
              <div className="text-center mb-8">
                <div className="inline-flex items-baseline">
                  <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                    {newCumulativeGPA.toFixed(3)}
                  </span>
                  <span className="text-2xl text-zinc-400 ml-2">/4.00</span>
                </div>
                <p className="text-zinc-400 text-base mt-3">Cumulative GPA</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-zinc-800/50">
                    <span className="text-sm font-medium text-zinc-300">
                      Grade Points
                    </span>
                    <span className="text-base font-semibold text-white">
                      {newTotalGradePoints.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-lg bg-zinc-800/50">
                    <span className="text-sm font-medium text-zinc-300">
                      Total Credits
                    </span>
                    <span className="text-base font-semibold text-white">
                      {newTotalCredits.toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* GPA Graph */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <h3 className="text-base font-semibold text-zinc-200 mb-2">
                    GPA Trend
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6">
                    Visualizes the progression from your previous cumulative GPA
                    to your projected GPA after this semester.
                  </p>
                  <div className="h-[200px] w-full">
                    <Line
                      data={{
                        labels: ["Previous", "Current"],
                        datasets: [
                          {
                            label: "GPA",
                            data: [previousCumulativeGPA, newCumulativeGPA],
                            borderColor: "rgb(59, 130, 246)",
                            backgroundColor: "rgba(59, 130, 246, 0.5)",
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: "rgb(59, 130, 246)",
                            pointBorderColor: "#fff",
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            min:
                              Math.floor(
                                Math.min(
                                  previousCumulativeGPA,
                                  newCumulativeGPA
                                ) * 2
                              ) / 2,
                            max:
                              Math.ceil(
                                Math.max(
                                  previousCumulativeGPA,
                                  newCumulativeGPA
                                ) * 2
                              ) / 2,
                            grid: {
                              color: "rgba(255, 255, 255, 0.1)",
                            },
                            ticks: {
                              color: "rgba(255, 255, 255, 0.7)",
                              stepSize: 1,
                              callback: function (tickValue: number | string) {
                                return typeof tickValue === "number"
                                  ? tickValue.toFixed(1)
                                  : tickValue;
                              },
                            },
                            title: {
                              display: true,
                              text: "GPA",
                              color: "rgba(255, 255, 255, 0.7)",
                              font: {
                                size: 12,
                              },
                            },
                          },
                          x: {
                            grid: {
                              color: "rgba(255, 255, 255, 0.1)",
                            },
                            ticks: {
                              color: "rgba(255, 255, 255, 0.7)",
                            },
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            titleColor: "rgb(255, 255, 255)",
                            bodyColor: "rgb(255, 255, 255)",
                            padding: 12,
                            borderColor: "rgba(255, 255, 255, 0.1)",
                            borderWidth: 1,
                            displayColors: false,
                            callbacks: {
                              label: (context) =>
                                `GPA: ${context.parsed.y.toFixed(3)}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  {/* GPA Change Indicator */}
                  <div className="flex items-center justify-center mt-6">
                    <div
                      className={`text-sm font-medium flex items-center gap-1 ${
                        newCumulativeGPA > previousCumulativeGPA
                          ? "text-emerald-400"
                          : newCumulativeGPA < previousCumulativeGPA
                          ? "text-red-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {newCumulativeGPA > previousCumulativeGPA ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : newCumulativeGPA < previousCumulativeGPA ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
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
                          className="w-4 h-4"
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
                          newCumulativeGPA - previousCumulativeGPA
                        ).toFixed(3)}{" "}
                        points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Future Scenarios Section - Full Width */}
        <div className="mt-8">
          <Card title="Future Scenarios">
            <p className="text-base text-zinc-300 mb-8">
              Explore possible outcomes based on different course loads for your
              next semester
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scenarios.map((scenario, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between bg-zinc-800/80 px-4 py-3">
                    <h3 className="font-medium text-zinc-100">
                      {scenario.numCourses} Course
                      {scenario.numCourses > 1 ? "s" : ""}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="!p-1.5"
                      onClick={() => refreshSingleScenario(index)}
                      aria-label="Refresh scenario"
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
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </Button>
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="text-sm text-zinc-400">Term GPA</div>
                      <div className="text-2xl font-semibold text-white">
                        {scenario.termGPA.toFixed(3)}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-sm text-zinc-400">Cumulative</div>
                      <div className="text-2xl font-semibold text-white">
                        {scenario.cumulativeGPA.toFixed(3)}
                      </div>
                    </div>
                    <div className="col-span-2 pt-3 border-t border-zinc-700">
                      <div className="text-sm text-zinc-400 mb-2">
                        Projected Grades
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scenario.grades.map((grade, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-zinc-700/80 rounded-full text-sm font-medium text-white"
                          >
                            {grade}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
