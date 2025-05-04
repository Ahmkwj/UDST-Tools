import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Footer from "../components/ui/Footer";
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

// Feature flags
const SHOW_FUTURE_SCENARIOS = false;

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

    // Only allow repeating for failing grades (D+, D, F)
    if (
      field === "previousGrade" &&
      updatedCourses[index].isRepeat &&
      !["F", "D+", "D"].includes(value as string)
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
    setNumberOfCourses(0);
    setCourses([]);
    setNewCumulativeGPA(0);
    setPreviousCumulativeGPA(0);
    setNewTotalGradePoints(0);
    setNewTotalCredits(0);
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
    termCredits: number
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
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Input Sections */}
            <div className="space-y-6 md:space-y-8 h-full flex flex-col">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
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
                    onChange={(e) =>
                      setNumberOfCourses(parseInt(e.target.value))
                    }
                    helperText="Choose the number of courses you are currently taking"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </Select>
                </form>
              </Card>

              {/* Course Information Card */}
              <Card
                title="Course Information"
                className="bg-zinc-900/70 backdrop-blur-sm ring-1 ring-zinc-800/50 flex-1 relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px]"
              >
                {numberOfCourses === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-3 text-center w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-zinc-600 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-zinc-400 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                      No Courses Selected
                    </p>
                    <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                      Choose the number of courses you're taking this semester
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6 h-full overflow-y-auto px-1 sm:px-0">
                    {courses.map((course, index) => (
                      <div
                        key={index}
                        className="p-4 sm:p-6 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-4 sm:space-y-6"
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <h3 className="text-sm font-semibold text-blue-400">
                            Course {index + 1}
                          </h3>
                          <div className="text-xs font-medium text-zinc-400 bg-zinc-800/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                            {course.credits} Credits
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
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
                          className="max-w-full overflow-hidden text-ellipsis"
                        />

                        {course.isRepeat && (
                          <Select
                            label="Previous Grade"
                            value={course.previousGrade}
                            onChange={(e) =>
                              updateCourse(
                                index,
                                "previousGrade",
                                e.target.value
                              )
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
                )}
              </Card>
            </div>

            {/* Right Column - Results Section */}
            <div className="space-y-8">
              <Card title="GPA Calculation Result">
                <div className="text-center mb-6 md:mb-8">
                  <div className="inline-flex items-baseline">
                    <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                      {newCumulativeGPA.toFixed(3)}
                    </span>
                    <span className="text-xl md:text-2xl text-zinc-400 ml-2">
                      /4.00
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm md:text-base mt-3">
                    Cumulative GPA
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex justify-between items-center p-4 sm:p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
                      <span className="text-sm font-medium text-zinc-300">
                        Grade Points
                      </span>
                      <span className="text-base font-semibold text-white">
                        {newTotalGradePoints.toFixed(3)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-4 sm:p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
                      <span className="text-sm font-medium text-zinc-300">
                        Total Credits
                      </span>
                      <span className="text-base font-semibold text-white">
                        {newTotalCredits.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* GPA Graph */}
                  <div className="mt-6 md:mt-8 pt-6 border-t border-zinc-800 overflow-x-hidden">
                    <h3 className="text-base font-semibold text-zinc-200 mb-2">
                      GPA Trend
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mb-4 md:mb-6">
                      Visualizes the progression from your previous cumulative
                      GPA to your projected GPA after this semester.
                    </p>
                    <div className="h-[180px] sm:h-[200px] w-full">
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
                                callback: function (
                                  tickValue: number | string
                                ) {
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
                                label: (context: any) =>
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
          {SHOW_FUTURE_SCENARIOS && (
            <div className="mt-6 md:mt-8">
              <Card title="Future Scenarios">
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
                      scenario.cumulativeGPA - newCumulativeGPA
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
                                  };

                                  // Add a tooltip for grade explanation
                                  const gradePoints =
                                    calculateGradePoints(grade);
                                  const gradeTitle = `${grade} (${gradePoints.toFixed(
                                    1
                                  )} points)`;

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
