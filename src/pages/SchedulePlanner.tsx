import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

type TimeSlot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type Course = {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
};

type Conflict = {
  courseId1: string;
  courseId2: string;
  timeSlotId1: string;
  timeSlotId2: string;
  day: string;
};

export default function SchedulePlanner() {
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  // Days of the week
  const daysOfWeek = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
  };

  // Add a new course
  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: locale === "ar" ? "مادة جديدة" : "New Course",
      timeSlots: [],
    };
    setCourses([...courses, newCourse]);
  };

  // Remove a course
  const removeCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  // Update course name
  const updateCourseName = (courseId: string, name: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, name } : course
      )
    );
  };

  // Add a time slot to a course
  const addTimeSlot = (courseId: string) => {
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      day: daysOfWeek[locale === "ar" ? "ar" : "en"][0],
      startTime: "08:00",
      endTime: "09:00",
    };

    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? { ...course, timeSlots: [...course.timeSlots, newTimeSlot] }
          : course
      )
    );
  };

  // Remove a time slot
  const removeTimeSlot = (courseId: string, timeSlotId: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              timeSlots: course.timeSlots.filter(
                (slot) => slot.id !== timeSlotId
              ),
            }
          : course
      )
    );
  };

  // Update time slot
  const updateTimeSlot = (
    courseId: string,
    timeSlotId: string,
    field: keyof TimeSlot,
    value: string
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              timeSlots: course.timeSlots.map((slot) =>
                slot.id === timeSlotId ? { ...slot, [field]: value } : slot
              ),
            }
          : course
      )
    );
  };

  // Check for time conflicts
  const checkConflicts = () => {
    const newConflicts: Conflict[] = [];

    courses.forEach((course1, i) => {
      courses.slice(i + 1).forEach((course2) => {
        course1.timeSlots.forEach((slot1) => {
          course2.timeSlots.forEach((slot2) => {
            if (slot1.day === slot2.day) {
              const start1 = new Date(`2024-01-01T${slot1.startTime}`);
              const end1 = new Date(`2024-01-01T${slot1.endTime}`);
              const start2 = new Date(`2024-01-01T${slot2.startTime}`);
              const end2 = new Date(`2024-01-01T${slot2.endTime}`);

              if (
                (start1 >= start2 && start1 < end2) ||
                (end1 > start2 && end1 <= end2) ||
                (start2 >= start1 && start2 < end1) ||
                (end2 > start1 && end2 <= end1)
              ) {
                newConflicts.push({
                  courseId1: course1.id,
                  courseId2: course2.id,
                  timeSlotId1: slot1.id,
                  timeSlotId2: slot2.id,
                  day: slot1.day,
                });
              }
            }
          });
        });
      });
    });

    setConflicts(newConflicts);
  };

  // Check for conflicts whenever courses change
  useEffect(() => {
    checkConflicts();
  }, [courses]);

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    return courses.find((course) => course.id === courseId)?.name || "";
  };

  // Get time slot details by IDs
  const getTimeSlotDetails = (courseId: string, timeSlotId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const timeSlot = course?.timeSlots.find((t) => t.id === timeSlotId);
    return timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : "";
  };

  // Generate time options with 12-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const ampm =
          hour < 12
            ? locale === "ar"
              ? "ص"
              : "AM"
            : locale === "ar"
            ? "م"
            : "PM";
        const displayHour = hour % 12 || 12;
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = `${displayHour}:${minute
          .toString()
          .padStart(2, "0")} ${ampm}`;
        times.push({ value: time, display: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Schedule Planner",
              ar: "مخطط الجدول",
            }}
            description={{
              en: "Plan your course schedule and detect time conflicts in real-time",
              ar: "خطط جدولك الدراسي واكتشف تعارضات المواعيد مباشرة",
            }}
          />

          {/* Introduction Card */}
          <Card title={locale === "ar" ? "مشكلة وحل" : "Problem & Solution"}>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "نعلم جيدًا مدى الإحباط الناتج عن التسجيل في المواد عبر بيبول سوفت. تقوم باختيار أوقات كل مقرر بدقة وعناية، لتتفاجأ برسالة خطأ تشير إلى تعارض في الجدول عند النقر على 'حفظ'. مع مخطط الجدول، يمكنك إضافة المواد وأوقاتها بسهولة، وسنقوم بإشعارك فورًا بأي تعارضات في الجدول بشكل آني."
                  : "We understand the frustration of enrolling in courses on PeopleSoft. You meticulously select the timings for each course, only to encounter a scheduling conflict error upon clicking 'Save'. With Schedule Planner, you can effortlessly add your courses and their timings, and we’ll instantly alert you to any conflicts in real-time."}
              </p>
            </div>
          </Card>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column - Course Management */}
            <div className="space-y-4 md:space-y-6">
              <Card
                title={locale === "ar" ? "المواد" : "Courses"}
                className="relative bg-gradient-to-br from-zinc-900/50 via-zinc-900/70 to-zinc-900/50"
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <Button
                    variant="outline"
                    onClick={addCourse}
                    className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/30 text-blue-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ltr:mr-2 rtl:ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {locale === "ar" ? "إضافة مادة" : "Add Course"}
                  </Button>
                </div>

                {courses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-3 text-center min-h-[200px] bg-gradient-to-br from-zinc-800/30 via-zinc-800/20 to-zinc-800/30 rounded-xl border border-zinc-700/50">
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
                      {locale === "ar" ? "لا توجد مواد بعد" : "No Courses Yet"}
                    </p>
                    <p className="text-zinc-500 text-xs sm:text-sm max-w-[180px] sm:max-w-[250px]">
                      {locale === "ar"
                        ? "أضف مادتك الأولى لبدء تخطيط جدولك"
                        : "Add your first course to start planning your schedule"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-gradient-to-br from-zinc-800/30 via-zinc-800/20 to-zinc-800/30 rounded-xl border border-zinc-700/50 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            value={course.name}
                            onChange={(e) =>
                              updateCourseName(course.id, e.target.value)
                            }
                            placeholder={
                              locale === "ar" ? "اسم المادة" : "Course Name"
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCourse(course.id)}
                            className="!p-2 shrink-0 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/30 text-red-400"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-3 mt-4">
                          {course.timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center gap-2 p-3 bg-gradient-to-br from-zinc-800/40 via-zinc-800/30 to-zinc-800/40 rounded-lg border border-zinc-700/30"
                            >
                              <Select
                                value={slot.day}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    course.id,
                                    slot.id,
                                    "day",
                                    e.target.value
                                  )
                                }
                                className="w-[140px] bg-zinc-900/50"
                              >
                                {daysOfWeek[locale === "ar" ? "ar" : "en"].map(
                                  (day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  )
                                )}
                              </Select>
                              <Select
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    course.id,
                                    slot.id,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="w-[130px] bg-zinc-900/50"
                              >
                                {timeOptions.map((time) => (
                                  <option key={time.value} value={time.value}>
                                    {time.display}
                                  </option>
                                ))}
                              </Select>
                              <span className="text-zinc-400">-</span>
                              <Select
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    course.id,
                                    slot.id,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="w-[130px] bg-zinc-900/50"
                              >
                                {timeOptions.map((time) => (
                                  <option key={time.value} value={time.value}>
                                    {time.display}
                                  </option>
                                ))}
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeTimeSlot(course.id, slot.id)
                                }
                                className="!p-2 ml-auto rtl:mr-auto rtl:ml-0 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 hover:border-red-500/30 text-red-400"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(course.id)}
                            className="w-full bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/30 text-blue-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ltr:mr-2 rtl:ml-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            {locale === "ar" ? "إضافة موعد" : "Add Time Slot"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Conflicts */}
            <div className="space-y-4 md:space-y-6">
              {/* Conflicts Card */}
              <Card
                title={locale === "ar" ? "تعارضات المواعيد" : "Time Conflicts"}
                className={`bg-gradient-to-br from-zinc-900/50 via-zinc-900/70 to-zinc-900/50 ${
                  conflicts.length > 0 ? "border-red-500/30" : ""
                }`}
              >
                {conflicts.length === 0 ? (
                  <div className="flex items-center justify-center py-4 px-3 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {locale === "ar"
                      ? "لا توجد تعارضات في المواعيد"
                      : "No time conflicts detected"}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conflicts.map((conflict, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gradient-to-br from-red-500/10 via-red-500/5 to-red-500/10 text-red-400 rounded-xl border border-red-500/20"
                      >
                        <div className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mt-0.5 ltr:mr-2 rtl:ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p className="font-medium">
                              {locale === "ar" ? "تعارض في" : "Conflict on"}{" "}
                              {conflict.day}
                            </p>
                            <p className="text-sm mt-1">
                              {getCourseName(conflict.courseId1)} (
                              {getTimeSlotDetails(
                                conflict.courseId1,
                                conflict.timeSlotId1
                              )}
                              )
                            </p>
                            <p className="text-sm">
                              {getCourseName(conflict.courseId2)} (
                              {getTimeSlotDetails(
                                conflict.courseId2,
                                conflict.timeSlotId2
                              )}
                              )
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
