import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

/* Match GPA & Attendance: responsive padding, touch-friendly inputs */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const sectionGap = "space-y-8 sm:space-y-12";
const inputSelectClass =
  "!bg-zinc-800/50 !border-zinc-500/40 !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 placeholder-zinc-500 [&_input]:min-h-[44px] [&_select]:min-h-[44px] [&_input]:py-3 [&_select]:py-3 sm:[&_input]:min-h-0 sm:[&_select]:min-h-0 sm:[&_input]:py-2.5 sm:[&_select]:py-2.5";

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
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Schedule Planner", ar: "مخطط الجدول" }}
            description={{
              en: "Plan your schedule and detect time conflicts",
              ar: "خطط جدولك واكتشف تعارضات المواعيد",
            }}
          />

          <div className={`${sectionGap} mt-8 sm:mt-12`}>
            <Card title={locale === "ar" ? "المواد" : "Courses"} className={cardClass}>
              <p className="text-xs text-zinc-500 mb-4">
                {locale === "ar"
                  ? "أضف المواد ومواعيدها لاكتشاف التعارضات."
                  : "Add courses and their times to detect conflicts."}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                onClick={addCourse}
                className="mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {locale === "ar" ? "إضافة مادة" : "Add Course"}
              </Button>

              {courses.length === 0 ? (
                <div className="py-10 sm:py-12 text-center rounded-xl border border-zinc-600/30 border-dashed bg-zinc-800/20">
                  <p className="text-sm text-zinc-400">{locale === "ar" ? "لا توجد مواد بعد" : "No courses yet"}</p>
                  <p className="text-xs text-zinc-500 mt-1">{locale === "ar" ? "أضف مادة لبدء التخطيط" : "Add a course to start planning"}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 p-4 sm:p-5"
                    >
                      <div className="flex gap-3 items-center mb-4">
                        <Input
                          value={course.name}
                          onChange={(e) => updateCourseName(course.id, e.target.value)}
                          placeholder={locale === "ar" ? "اسم المادة" : "Course Name"}
                          className={`flex-1 min-w-0 ${inputSelectClass} !mb-0`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(course.id)}
                          className="!p-2 shrink-0"
                          aria-label={locale === "ar" ? "حذف المادة" : "Remove course"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>

                      <div className="space-y-0">
                        {course.timeSlots.map((slot, slotIndex) => (
                          <div
                            key={slot.id}
                            className={`flex items-center gap-2 py-2.5 flex-nowrap min-w-0 overflow-x-auto ${slotIndex > 0 ? "border-t border-zinc-600/25" : ""}`}
                          >
                            <Select
                              value={slot.day}
                              onChange={(e) => updateTimeSlot(course.id, slot.id, "day", e.target.value)}
                              className={`shrink-0 w-[7.5rem] ${inputSelectClass} !mb-0 [&_select]:text-sm`}
                            >
                              {daysOfWeek[locale === "ar" ? "ar" : "en"].map((day) => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </Select>
                            <Select
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(course.id, slot.id, "startTime", e.target.value)}
                              className={`shrink-0 w-[5.25rem] ${inputSelectClass} !mb-0 [&_select]:text-xs`}
                            >
                              {timeOptions.map((time) => (
                                <option key={time.value} value={time.value}>{time.display}</option>
                              ))}
                            </Select>
                            <span className="text-zinc-500 text-xs shrink-0">–</span>
                            <Select
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(course.id, slot.id, "endTime", e.target.value)}
                              className={`shrink-0 w-[5.25rem] ${inputSelectClass} !mb-0 [&_select]:text-xs`}
                            >
                              {timeOptions.map((time) => (
                                <option key={time.value} value={time.value}>{time.display}</option>
                              ))}
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(course.id, slot.id)}
                              className="!p-2 shrink-0 ms-auto"
                              aria-label={locale === "ar" ? "حذف الموعد" : "Remove slot"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => addTimeSlot(course.id)}
                          className="mt-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
              <p className="text-xs text-zinc-500 mb-4">
                {locale === "ar"
                  ? "تعارضات تلقائية عند تداخل مواعيد المواد."
                  : "Conflicts are detected automatically when course times overlap."}
              </p>
              {conflicts.length === 0 ? (
                <div className="py-8 sm:py-10 text-center rounded-xl border border-zinc-600/30 bg-zinc-800/20">
                  <p className="text-sm text-zinc-400">{locale === "ar" ? "لا توجد تعارضات" : "No conflicts detected"}</p>
                  <p className="text-xs text-zinc-500 mt-1">{locale === "ar" ? "أضف مواد ومواعيدها للتحقق" : "Add courses and times to check"}</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {conflicts.map((conflict, index) => (
                    <div
                      key={index}
                      className={`py-3 sm:py-3.5 ${index > 0 ? "border-t border-zinc-600/25" : ""}`}
                    >
                      <p className="text-sm font-medium text-white">
                        {locale === "ar" ? "تعارض في" : "Conflict on"} {conflict.day}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5 break-words">
                        {getCourseName(conflict.courseId1)} ({getTimeSlotDetails(conflict.courseId1, conflict.timeSlotId1)}) {locale === "ar" ? "و" : "and"} {getCourseName(conflict.courseId2)} ({getTimeSlotDetails(conflict.courseId2, conflict.timeSlotId2)})
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
