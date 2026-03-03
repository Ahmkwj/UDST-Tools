import { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

/* ── Color palette for courses ── */
const PALETTE = [
  { bg: "bg-blue-500/10", border: "border-blue-500/25", text: "text-blue-400", dot: "bg-blue-500", strip: "bg-blue-500" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", dot: "bg-emerald-500", strip: "bg-emerald-500" },
  { bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400", dot: "bg-violet-500", strip: "bg-violet-500" },
  { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", dot: "bg-amber-500", strip: "bg-amber-500" },
  { bg: "bg-rose-500/10", border: "border-rose-500/25", text: "text-rose-400", dot: "bg-rose-500", strip: "bg-rose-500" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-400", dot: "bg-cyan-500", strip: "bg-cyan-500" },
  { bg: "bg-orange-500/10", border: "border-orange-500/25", text: "text-orange-400", dot: "bg-orange-500", strip: "bg-orange-500" },
  { bg: "bg-zinc-400/10", border: "border-zinc-400/25", text: "text-zinc-300", dot: "bg-zinc-400", strip: "bg-zinc-400" },
];

type TimeSlot = { id: string; day: string; startTime: string; endTime: string };
type Course = { id: string; name: string; timeSlots: TimeSlot[] };
type Conflict = {
  courseId1: string;
  courseId2: string;
  timeSlotId1: string;
  timeSlotId2: string;
  day: string;
};

const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
const DAY_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu"];
const DAY_SHORT_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي"];

function generateTimeOptions(locale: string) {
  const times: { value: string; display: string }[] = [];
  for (let h = 8; h <= 23; h++) {
    for (let m = 0; m < 60; m += 30) {
      const ampm = h < 12 ? (locale === "ar" ? "ص" : "AM") : (locale === "ar" ? "م" : "PM");
      const dh = h % 12 || 12;
      const val = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const disp = `${dh}:${m.toString().padStart(2, "0")} ${ampm}`;
      times.push({ value: val, display: disp });
    }
  }
  return times;
}

export default function SchedulePlanner() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const days = isRTL ? DAYS_AR : DAYS_EN;
  const daysShort = isRTL ? DAY_SHORT_AR : DAY_SHORT_EN;
  const timeOptions = generateTimeOptions(locale);

  const [courses, setCourses] = useLocalStorage<Course[]>("sched-courses", []);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  useEffect(() => {
    const c: Conflict[] = [];
    courses.forEach((c1, i) => {
      courses.slice(i + 1).forEach((c2) => {
        c1.timeSlots.forEach((s1) => {
          c2.timeSlots.forEach((s2) => {
            if (s1.day === s2.day) {
              const a1 = new Date(`2024-01-01T${s1.startTime}`);
              const b1 = new Date(`2024-01-01T${s1.endTime}`);
              const a2 = new Date(`2024-01-01T${s2.startTime}`);
              const b2 = new Date(`2024-01-01T${s2.endTime}`);
              if (
                (a1 >= a2 && a1 < b2) ||
                (b1 > a2 && b1 <= b2) ||
                (a2 >= a1 && a2 < b1) ||
                (b2 > a1 && b2 <= a1)
              ) {
                c.push({
                  courseId1: c1.id,
                  courseId2: c2.id,
                  timeSlotId1: s1.id,
                  timeSlotId2: s2.id,
                  day: s1.day,
                });
              }
            }
          });
        });
      });
    });
    setConflicts(c);
  }, [courses]);

  const addCourse = () =>
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        name: isRTL ? "مادة جديدة" : "New Course",
        timeSlots: [],
      },
    ]);

  const removeCourse = (id: string) =>
    setCourses(courses.filter((c) => c.id !== id));

  const updateName = (id: string, name: string) =>
    setCourses(courses.map((c) => (c.id === id ? { ...c, name } : c)));

  const addSlot = (courseId: string) =>
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              timeSlots: [
                ...c.timeSlots,
                { id: Date.now().toString(), day: days[0], startTime: "08:00", endTime: "09:00" },
              ],
            }
          : c,
      ),
    );

  const removeSlot = (courseId: string, slotId: string) =>
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? { ...c, timeSlots: c.timeSlots.filter((s) => s.id !== slotId) }
          : c,
      ),
    );

  const updateSlot = (
    courseId: string,
    slotId: string,
    field: keyof TimeSlot,
    value: string,
  ) =>
    setCourses(
      courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              timeSlots: c.timeSlots.map((s) =>
                s.id === slotId ? { ...s, [field]: value } : s,
              ),
            }
          : c,
      ),
    );

  const getName = (id: string) => courses.find((c) => c.id === id)?.name ?? "";
  const getSlotTime = (cId: string, sId: string) => {
    const s = courses.find((c) => c.id === cId)?.timeSlots.find((t) => t.id === sId);
    return s ? `${s.startTime} - ${s.endTime}` : "";
  };

  const totalSlots = courses.reduce((s, c) => s + c.timeSlots.length, 0);

  /* weekly overview: which courses are on which days */
  const weekMap = DAYS_EN.map((_, di) => {
    const dayName = days[di];
    return courses
      .map((c, ci) => ({
        courseIdx: ci,
        has: c.timeSlots.some((s) => s.day === dayName),
      }))
      .filter((x) => x.has);
  });

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Schedule Planner", ar: "مخطط الجدول" }}
            description={{
              en: "Plan your weekly schedule, add courses with their time slots, and detect conflicts automatically.",
              ar: "خطط جدولك الأسبوعي، أضف المواد ومواعيدها، واكتشف التعارضات تلقائيًا.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ STATS + WEEKLY OVERVIEW ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Stats -- 2 cols */}
              <Card className={`${cardClass} lg:col-span-2`}>
                <div className="grid grid-cols-3 gap-3 py-2">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-400 tabular-nums">
                      {courses.length}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {isRTL ? "مواد" : "Courses"}
                    </p>
                  </div>
                  <div className="text-center border-x border-zinc-700/40">
                    <p className="text-3xl font-bold text-white tabular-nums">
                      {totalSlots}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {isRTL ? "مواعيد" : "Time Slots"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-3xl font-bold tabular-nums ${
                        conflicts.length > 0 ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {conflicts.length}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {isRTL ? "تعارضات" : "Conflicts"}
                    </p>
                  </div>
                </div>

                {/* Add course button */}
                <button
                  type="button"
                  onClick={addCourse}
                  className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/15 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  {isRTL ? "إضافة مادة" : "Add Course"}
                </button>
              </Card>

              {/* Weekly overview -- 3 cols */}
              <Card
                title={isRTL ? "نظرة أسبوعية" : "Weekly Overview"}
                className={`${cardClass} lg:col-span-3`}
              >
                {courses.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">
                    {isRTL
                      ? "أضف مواد لرؤية النظرة الأسبوعية."
                      : "Add courses to see the weekly overview."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* day columns */}
                    <div className="grid grid-cols-5 gap-2">
                      {daysShort.map((day, di) => (
                        <div key={di} className="text-center">
                          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
                            {day}
                          </p>
                          <div className="flex flex-col items-center gap-1.5 min-h-[40px]">
                            {weekMap[di].length > 0 ? (
                              weekMap[di].map((entry) => (
                                <div
                                  key={entry.courseIdx}
                                  className={`w-full h-2.5 rounded-full ${PALETTE[entry.courseIdx % PALETTE.length].strip} opacity-70`}
                                  title={courses[entry.courseIdx]?.name}
                                />
                              ))
                            ) : (
                              <div className="w-full h-2.5 rounded-full bg-zinc-700/30" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-zinc-700/40">
                      {courses.map((c, i) => (
                        <span
                          key={c.id}
                          className="flex items-center gap-1.5 text-[10px] text-zinc-400"
                        >
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${PALETTE[i % PALETTE.length].dot}`}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* ════════ COURSES ════════ */}
            {courses.length === 0 ? (
              <Card className={cardClass}>
                <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-700/30 border border-zinc-600/30 flex items-center justify-center mb-4">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-7 h-7 text-zinc-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {isRTL ? "لم تتم إضافة مواد بعد" : "No courses yet"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    {isRTL
                      ? "اضغط \"إضافة مادة\" أعلاه للبدء بتخطيط جدولك الأسبوعي."
                      : "Click \"Add Course\" above to start planning your weekly schedule."}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {courses.map((course, ci) => {
                  const color = PALETTE[ci % PALETTE.length];
                  return (
                    <Card key={course.id} className={`${cardClass} relative overflow-hidden`}>
                      {/* color strip */}
                      <div
                        className={`absolute top-0 start-0 w-1 h-full ${color.strip} rounded-s-2xl`}
                      />

                      {/* header */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${color.bg} ${color.text} border ${color.border}`}
                        >
                          {ci + 1}
                        </span>
                        <input
                          value={course.name}
                          onChange={(e) => updateName(course.id, e.target.value)}
                          placeholder={isRTL ? "اسم المادة" : "Course Name"}
                          className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-zinc-600"
                        />
                        <span className="text-[10px] text-zinc-500 shrink-0 tabular-nums">
                          {course.timeSlots.length}{" "}
                          {isRTL ? "موعد" : "slot"}
                          {!isRTL && course.timeSlots.length !== 1 ? "s" : ""}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCourse(course.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                          aria-label="Remove"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* time slots */}
                      {course.timeSlots.length > 0 && (
                        <div className="rounded-xl border border-zinc-600/25 bg-zinc-800/20 overflow-hidden mb-3">
                          {course.timeSlots.map((slot, si) => (
                            <div
                              key={slot.id}
                              className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 ${
                                si > 0 ? "border-t border-zinc-600/20" : ""
                              }`}
                            >
                              <select
                                value={slot.day}
                                onChange={(e) =>
                                  updateSlot(course.id, slot.id, "day", e.target.value)
                                }
                                className="bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-2.5 py-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors shrink-0 w-[6.5rem] sm:w-[7.5rem]"
                              >
                                {days.map((d) => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                              <select
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateSlot(course.id, slot.id, "startTime", e.target.value)
                                }
                                className="bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-2 py-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors shrink-0 w-[5rem]"
                              >
                                {timeOptions.map((t) => (
                                  <option key={t.value} value={t.value}>{t.display}</option>
                                ))}
                              </select>
                              <span className="text-zinc-600 text-xs shrink-0">-</span>
                              <select
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateSlot(course.id, slot.id, "endTime", e.target.value)
                                }
                                className="bg-zinc-800/60 border border-zinc-600/40 rounded-lg px-2 py-2 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors shrink-0 w-[5rem]"
                              >
                                {timeOptions.map((t) => (
                                  <option key={t.value} value={t.value}>{t.display}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => removeSlot(course.id, slot.id)}
                                className="p-1 rounded text-zinc-600 hover:text-zinc-300 transition-colors ms-auto shrink-0"
                                aria-label="Remove slot"
                              >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => addSlot(course.id)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-zinc-600/30 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-500/40 transition-colors"
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M10.75 6.75a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" />
                        </svg>
                        {isRTL ? "إضافة موعد" : "Add Time Slot"}
                      </button>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ════════ CONFLICTS ════════ */}
            {conflicts.length > 0 && (
              <Card
                title={isRTL ? "تعارضات المواعيد" : "Time Conflicts"}
                className={`${cardClass} !border-red-500/25`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {isRTL
                      ? "تم اكتشاف تعارضات في مواعيد المواد التالية."
                      : "The following course time slots overlap and conflict with each other."}
                  </p>
                </div>

                <div className="space-y-2">
                  {conflicts.map((cf, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-red-500/15 bg-red-500/[0.04] px-4 py-3"
                    >
                      <p className="text-sm font-medium text-white">
                        {getName(cf.courseId1)}{" "}
                        <span className="font-normal">
                          {isRTL ? "و" : "&"}
                        </span>{" "}
                        {getName(cf.courseId2)}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {cf.day} -- {getSlotTime(cf.courseId1, cf.timeSlotId1)}{" "}
                        {isRTL ? "و" : "and"}{" "}
                        {getSlotTime(cf.courseId2, cf.timeSlotId2)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* no conflicts state */}
            {courses.length > 0 && totalSlots > 0 && conflicts.length === 0 && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    {isRTL ? "لا توجد تعارضات" : "No Conflicts"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {isRTL
                      ? "جميع مواعيد المواد متوافقة."
                      : "All course time slots are compatible with each other."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
