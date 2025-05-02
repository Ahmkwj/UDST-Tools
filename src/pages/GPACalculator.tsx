import { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";

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
    const newCourses: Course[] = [];
    for (let i = 0; i < numberOfCourses; i++) {
      newCourses.push({
        grade: "A",
        credits: 3,
        isRepeat: false,
        previousGrade: "",
      });
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
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
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
    const tgp = parseFloat(totalGradePoints as string) || 0;
    const tc = parseFloat(totalCredits as string) || 0;

    let newTGP = tgp;
    let newTC = tc;

    courses.forEach((course) => {
      const courseCredits = course.credits || 0;
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

    const prevGPA = tc > 0 ? tgp / tc : 0;
    const newGPA = newTC > 0 ? newTGP / newTC : 0;

    setPreviousCumulativeGPA(prevGPA);
    setNewCumulativeGPA(newGPA);
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
        {/* Page header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            GPA Calculator
          </h1>
          <div className="h-1 w-24 md:w-32 mx-auto bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Calculate your current and projected GPA with our advanced
            calculator
          </p>
        </header>

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
                    placeholder="e.g. 95.500"
                    value={totalGradePoints}
                    onChange={(e) => setTotalGradePoints(e.target.value)}
                    helperText="Total points earned so far"
                  />

                  <Input
                    label="Total Earned Credits"
                    type="number"
                    placeholder="e.g. 50"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    helperText="Total credits earned so far"
                  />
                </div>

                <Select
                  label="Number of Courses"
                  value={numberOfCourses}
                  onChange={(e) => setNumberOfCourses(parseInt(e.target.value))}
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
                        <h3 className="text-sm font-medium text-blue-400">
                          Course {index + 1}
                        </h3>
                        <div className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
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
                          value={course.credits}
                          onChange={(e) =>
                            updateCourse(
                              index,
                              "credits",
                              parseFloat(e.target.value) || 0
                            )
                          }
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
                          <option value="" disabled>
                            Choose the previous grade
                          </option>
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
                  <span className="text-5xl font-bold text-white">
                    {newCumulativeGPA.toFixed(3)}
                  </span>
                  <span className="text-xl text-zinc-400 ml-2">/4.00</span>
                </div>
                <p className="text-zinc-300 text-sm mt-2">New Cumulative GPA</p>
              </div>

              <div className="relative w-full h-4 bg-zinc-800 rounded-full mb-8 overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full 
                    transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, (newCumulativeGPA / 4) * 100)}%`,
                  }}
                ></div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-zinc-400">Previous GPA</span>
                  <span className="text-white font-medium">
                    {previousCumulativeGPA.toFixed(3)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-zinc-400">New Grade Points</span>
                  <span className="text-white font-medium">
                    {newTotalGradePoints.toFixed(3)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-zinc-400">New Total Credits</span>
                  <span className="text-white font-medium">
                    {newTotalCredits.toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Scenarios Section */}
            <Card title="Future Scenarios">
              <p className="text-zinc-300 text-sm mb-6">
                Explore possible outcomes for next semester
              </p>

              <div className="grid gap-4">
                {scenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/50 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-zinc-800/80 px-4 py-3">
                      <h3 className="font-medium text-white">
                        {scenario.numCourses} Course
                        {scenario.numCourses > 1 ? "s" : ""} Scenario
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
                      <div className="space-y-2">
                        <div className="text-zinc-400 text-sm">Term GPA</div>
                        <div className="text-2xl font-medium text-white">
                          {scenario.termGPA.toFixed(3)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-zinc-400 text-sm">Cumulative</div>
                        <div className="text-2xl font-medium text-white">
                          {scenario.cumulativeGPA.toFixed(3)}
                        </div>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-zinc-700">
                        <div className="text-zinc-400 text-sm mb-1">
                          Projected Grades
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {scenario.grades.map((grade, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-zinc-700 rounded text-sm text-white"
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
    </div>
  );
}
