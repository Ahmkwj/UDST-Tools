import { useState } from "react";
import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";

type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type Course = {
  id: string;
  code: string;
  name: string;
  timeSlots: TimeSlot[];
};

export default function SchedulePlanner() {
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [conflicts, setConflicts] = useState<
    {
      courseId1: string;
      courseId2: string;
      timeSlot1: TimeSlot;
      timeSlot2: TimeSlot;
    }[]
  >([]);

  // Days of the week
  const daysOfWeek = [
    { value: "sunday", labelEn: "Sunday", labelAr: "الأحد" },
    { value: "monday", labelEn: "Monday", labelAr: "الاثنين" },
    { value: "tuesday", labelEn: "Tuesday", labelAr: "الثلاثاء" },
    { value: "wednesday", labelEn: "Wednesday", labelAr: "الأربعاء" },
    { value: "thursday", labelEn: "Thursday", labelAr: "الخميس" },
  ];

  // Function to check if two time slots overlap
  const doTimeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    if (slot1.day !== slot2.day) return false;

    const start1 = new Date(`2024-01-01T${slot1.startTime}`);
    const end1 = new Date(`2024-01-01T${slot1.endTime}`);
    const start2 = new Date(`2024-01-01T${slot2.startTime}`);
    const end2 = new Date(`2024-01-01T${slot2.endTime}`);

    return start1 < end2 && end1 > start2;
  };

  // Function to check for conflicts when adding/updating time slots
  const checkConflicts = (updatedCourses: Course[]) => {
    const newConflicts: {
      courseId1: string;
      courseId2: string;
      timeSlot1: TimeSlot;
      timeSlot2: TimeSlot;
    }[] = [];

    // Check each course against every other course
    for (let i = 0; i < updatedCourses.length; i++) {
      for (let j = i + 1; j < updatedCourses.length; j++) {
        const course1 = updatedCourses[i];
        const course2 = updatedCourses[j];

        // Check each time slot of course1 against each time slot of course2
        for (const slot1 of course1.timeSlots) {
          for (const slot2 of course2.timeSlots) {
            if (doTimeSlotsOverlap(slot1, slot2)) {
              newConflicts.push({
                courseId1: course1.id,
                courseId2: course2.id,
                timeSlot1: slot1,
                timeSlot2: slot2,
              });
            }
          }
        }
      }
    }

    setConflicts(newConflicts);
  };

  // Function to add a new course
  const addCourse = () => {
    const newCourse: Course = {
      id: crypto.randomUUID(),
      code: "",
      name: "",
      timeSlots: [],
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  // Function to update a course
  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId ? { ...course, ...updates } : course
    );
    setCourses(updatedCourses);
    checkConflicts(updatedCourses);
  };

  // Function to add a time slot to a course
  const addTimeSlot = (courseId: string) => {
    const newTimeSlot: TimeSlot = {
      id: crypto.randomUUID(),
      day: daysOfWeek[0].value,
      startTime: "08:00",
      endTime: "09:00",
    };

    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? { ...course, timeSlots: [...course.timeSlots, newTimeSlot] }
        : course
    );

    setCourses(updatedCourses);
    checkConflicts(updatedCourses);
  };

  // Function to update a time slot
  const updateTimeSlot = (
    courseId: string,
    timeSlotId: string,
    updates: Partial<TimeSlot>
  ) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            timeSlots: course.timeSlots.map((slot) =>
              slot.id === timeSlotId ? { ...slot, ...updates } : slot
            ),
          }
        : course
    );

    setCourses(updatedCourses);
    checkConflicts(updatedCourses);
  };

  // Function to remove a time slot
  const removeTimeSlot = (courseId: string, timeSlotId: string) => {
    const updatedCourses = courses.map((course) =>
      course.id === courseId
        ? {
            ...course,
            timeSlots: course.timeSlots.filter(
              (slot) => slot.id !== timeSlotId
            ),
          }
        : course
    );

    setCourses(updatedCourses);
    checkConflicts(updatedCourses);
  };

  // Function to remove a course
  const removeCourse = (courseId: string) => {
    const updatedCourses = courses.filter((course) => course.id !== courseId);
    setCourses(updatedCourses);
    checkConflicts(updatedCourses);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Schedule Planner",
              ar: "مخطط الجدول الدراسي",
            }}
            description={{
              en: "Plan your course schedule and check for time conflicts in real-time",
              ar: "خطط جدولك الدراسي وتحقق من تعارضات الأوقات بشكل مباشر",
            }}
          />

          {courses.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75m0 0h4.5m-4.5 0v-1.5c0-.414.336-.75.75-.75h3a.75.75 0 01.75.75v1.5m-4.5 0h4.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  {locale === "ar" ? "لم تتم إضافة مقررات" : "No Courses Added"}
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 max-w-md mb-8">
                  {locale === "ar"
                    ? "ابدأ بإضافة مقرراتك للفصل الدراسي. سيتم التحقق من تعارضات المواعيد تلقائياً."
                    : "Start by adding your courses for the semester. Time conflicts will be checked automatically."}
                </p>
                <button
                  onClick={addCourse}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group transform hover:scale-105"
                >
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
                  {locale === "ar" ? "إضافة مقرر جديد" : "Add New Course"}
                </button>
              </div>
            </Card>
          ) : (
            <>
              {/* Add Course Button */}
              <div className="flex justify-end">
                <button
                  onClick={addCourse}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
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
                  {locale === "ar" ? "إضافة مقرر" : "Add Course"}
                </button>
              </div>

              {/* Courses List */}
              <div className="space-y-6">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <div className="space-y-6">
                      {/* Course Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label={
                              locale === "ar" ? "رمز المقرر" : "Course Code"
                            }
                            value={course.code}
                            onChange={(e) =>
                              updateCourse(course.id, { code: e.target.value })
                            }
                            placeholder={
                              locale === "ar"
                                ? "مثال: MATH101"
                                : "e.g., MATH101"
                            }
                          />
                          <Input
                            label={
                              locale === "ar" ? "اسم المقرر" : "Course Name"
                            }
                            value={course.name}
                            onChange={(e) =>
                              updateCourse(course.id, { name: e.target.value })
                            }
                            placeholder={
                              locale === "ar"
                                ? "مثال: مقدمة في الرياضيات"
                                : "e.g., Introduction to Mathematics"
                            }
                          />
                        </div>
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title={
                            locale === "ar" ? "حذف المقرر" : "Remove Course"
                          }
                        >
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-zinc-300">
                            {locale === "ar"
                              ? "مواعيد المحاضرات"
                              : "Class Times"}
                          </h3>
                          <button
                            onClick={() => addTimeSlot(course.id)}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {locale === "ar" ? "+ إضافة موعد" : "+ Add Time"}
                          </button>
                        </div>

                        <div className="space-y-4">
                          {course.timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-start gap-4 bg-zinc-800/30 p-4 rounded-lg"
                            >
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Select
                                  value={slot.day}
                                  onChange={(e) =>
                                    updateTimeSlot(course.id, slot.id, {
                                      day: e.target.value,
                                    })
                                  }
                                  label={locale === "ar" ? "اليوم" : "Day"}
                                >
                                  {daysOfWeek.map((day) => (
                                    <option key={day.value} value={day.value}>
                                      {locale === "ar"
                                        ? day.labelAr
                                        : day.labelEn}
                                    </option>
                                  ))}
                                </Select>
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(course.id, slot.id, {
                                      startTime: e.target.value,
                                    })
                                  }
                                  label={locale === "ar" ? "من" : "From"}
                                />
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(course.id, slot.id, {
                                      endTime: e.target.value,
                                    })
                                  }
                                  label={locale === "ar" ? "إلى" : "To"}
                                />
                              </div>
                              <button
                                onClick={() =>
                                  removeTimeSlot(course.id, slot.id)
                                }
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                title={
                                  locale === "ar"
                                    ? "حذف الموعد"
                                    : "Remove Time Slot"
                                }
                              >
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Conflicts Section */}
              {conflicts.length > 0 && (
                <Card>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-red-400">
                      {locale === "ar"
                        ? "تعارضات في المواعيد"
                        : "Schedule Conflicts"}
                    </h3>
                    <div className="space-y-3">
                      {conflicts.map((conflict, index) => {
                        const course1 = courses.find(
                          (c) => c.id === conflict.courseId1
                        );
                        const course2 = courses.find(
                          (c) => c.id === conflict.courseId2
                        );
                        if (!course1 || !course2) return null;

                        const day1 = daysOfWeek.find(
                          (d) => d.value === conflict.timeSlot1.day
                        );
                        const day2 = daysOfWeek.find(
                          (d) => d.value === conflict.timeSlot2.day
                        );

                        return (
                          <div
                            key={index}
                            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                          >
                            <p className="text-sm text-red-300">
                              {locale === "ar" ? (
                                <>
                                  تعارض بين {course1.code} ({day1?.labelAr}{" "}
                                  {conflict.timeSlot1.startTime} -{" "}
                                  {conflict.timeSlot1.endTime}) و {course2.code}{" "}
                                  ({day2?.labelAr}{" "}
                                  {conflict.timeSlot2.startTime} -{" "}
                                  {conflict.timeSlot2.endTime})
                                </>
                              ) : (
                                <>
                                  Conflict between {course1.code} (
                                  {day1?.labelEn} {conflict.timeSlot1.startTime}{" "}
                                  - {conflict.timeSlot1.endTime}) and{" "}
                                  {course2.code} ({day2?.labelEn}{" "}
                                  {conflict.timeSlot2.startTime} -{" "}
                                  {conflict.timeSlot2.endTime})
                                </>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
