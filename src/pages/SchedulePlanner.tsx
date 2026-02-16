import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const sectionGap = "space-y-12";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:py-2.5 [&_select]:py-2.5";

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
    <div className="page-container">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8">
        <div className={`max-w-4xl mx-auto ${sectionGap}`}>
          <PageHeader
            title={{ en: "Schedule Planner", ar: "مخطط الجدول" }}
            description={{
              en: "Plan your schedule and detect time conflicts",
              ar: "خطط جدولك واكتشف تعارضات المواعيد",
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <Card title={locale === "ar" ? "المواد" : "Courses"} className={cardClass}>
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
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-zinc-600/30 rounded-xl border-dashed">
                    <p className="text-zinc-400 text-sm mb-1">
                      {locale === "ar" ? "لا توجد مواد بعد" : "No courses yet"}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {locale === "ar" ? "أضف مادة لبدء التخطيط" : "Add a course to start planning"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-600/25 space-y-0">
                    {courses.map((course) => (
                      <div key={course.id} className="py-4 first:pt-0">
                        <div className="flex items-center gap-2">
                          <Input
                            value={course.name}
                            onChange={(e) =>
                              updateCourseName(course.id, e.target.value)
                            }
                            placeholder={
                              locale === "ar" ? "اسم المادة" : "Course Name"
                            }
                            className={`flex-1 ${inputSelectClass}`}
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
                              className="flex flex-wrap items-center gap-2 py-3 border-t border-zinc-600/25 first:border-t-0 first:pt-0"
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
                                className={`w-[140px] shrink-0 ${inputSelectClass}`}
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
                                className={`w-[130px] shrink-0 ${inputSelectClass}`}
                              >
                                {timeOptions.map((time) => (
                                  <option key={time.value} value={time.value}>
                                    {time.display}
                                  </option>
                                ))}
                              </Select>
                              <span className="text-zinc-400 shrink-0">-</span>
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
                                className={`w-[130px] shrink-0 ${inputSelectClass}`}
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

              <Card
                title={locale === "ar" ? "تعارضات المواعيد" : "Time Conflicts"}
                className={cardClass}
              >
                {conflicts.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-2">
                    {locale === "ar" ? "لا توجد تعارضات" : "No conflicts detected"}
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-600/25 space-y-0">
                    {conflicts.map((conflict, index) => (
                      <div key={index} className="py-3 first:pt-0 last:pb-0">
                        <p className="text-sm font-medium text-white">
                          {locale === "ar" ? "تعارض في" : "Conflict on"} {conflict.day}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {getCourseName(conflict.courseId1)} ({getTimeSlotDetails(conflict.courseId1, conflict.timeSlotId1)}) / {getCourseName(conflict.courseId2)} ({getTimeSlotDetails(conflict.courseId2, conflict.timeSlotId2)})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
