import { useState, useRef } from "react";
import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

/* ── Ramadan time conversion maps ── */
const START_TIME_MAP: Record<number, number> = {
  480: 480, 540: 525, 570: 545, 600: 570, 630: 590, 660: 615, 690: 635,
  720: 660, 750: 680, 780: 720, 810: 740, 840: 765, 870: 785, 900: 810,
  930: 830, 960: 855, 990: 875, 1020: 900, 1050: 920, 1080: 945,
  1110: 965, 1140: 990,
};

const DURATION_MAP: Record<number, number> = {
  60: 40, 90: 60, 120: 80, 150: 100, 180: 120, 240: 160, 300: 200,
};

/* ── Types ── */
type ParsedClass = {
  courseCode: string;
  courseName: string;
  classType: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  ramadanStart: string;
  ramadanEnd: string;
  warning?: string;
};

type ParsedSchedule = {
  studentName: string;
  semester: string;
  classes: ParsedClass[];
};

/* ── Time utilities ── */
function parseTimeToMinutes(t: string): number {
  const m = t.replace(/\s+/g, "").match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function minutesToDisplay(mins: number): string {
  let h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${period}`;
}

function convertToRamadan(startStr: string, endStr: string) {
  const startMins = parseTimeToMinutes(startStr);
  const endMins = parseTimeToMinutes(endStr);
  if (startMins < 0 || endMins < 0)
    return { ramadanStart: "?", ramadanEnd: "?", warning: "Invalid time" };

  const ramStart = START_TIME_MAP[startMins];
  if (ramStart === undefined)
    return { ramadanStart: "?", ramadanEnd: "?", warning: `Start time ${startStr} not in conversion table` };

  const duration = endMins - startMins;
  const ramDuration = DURATION_MAP[duration];
  if (ramDuration === undefined) {
    const approx = Math.round(duration * (2 / 3));
    return {
      ramadanStart: minutesToDisplay(ramStart),
      ramadanEnd: minutesToDisplay(ramStart + approx),
      warning: `Duration ${duration} min approximated`,
    };
  }

  return {
    ramadanStart: minutesToDisplay(ramStart),
    ramadanEnd: minutesToDisplay(ramStart + ramDuration),
  };
}

/* ── Parser ── */
const SKIP_LINES = new Set([
  "credit", "status", "units", "grading basis", "academic program",
  "requirement designation", "enrolled", "class", "start/end dates",
  "days and times", "room",
]);

function looksLikeHiddenOrUIText(line: string): boolean {
  const t = line.toLowerCase();
  return (
    /press\s+.+\s+to\s+/i.test(line) ||
    /control\+/i.test(line) ||
    /\bdrag(ging)?\s+(object|to)\b/i.test(line) ||
    /\b(start|click)\s+(drag|to)\b/i.test(line) ||
    t.includes("keyboard") ||
    t.includes("accessibility")
  );
}

function parseSchedule(raw: string): { schedule: ParsedSchedule | null; errors: string[] } {
  const lines = raw.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim());
  const errors: string[] = [];

  let studentName = "";
  let semester = "";
  const classes: ParsedClass[] = [];

  let currentCourseCode = "";
  let currentCourseName = "";
  let currentClassType = "";
  let currentSection = "";
  let currentDay = "";
  let awaitingRoom = false;

  const semesterRe = /^(Fall|Winter|Spring|Summer)\s+\d{4}$/i;
  const courseRe = /^([A-Z]{2,5}\s+\d{3,4})\s+(.+)/;
  const classTypeRe = /^(Lecture|Laboratory|Tutorial|Seminar|Lab)\s*-\s*Class\s+\d+\s*-?\s*Section\s+(\d+)/i;
  const daysRe = /^Days?:\s*(.+)/i;
  const timesRe = /^Times?:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))\s+to\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i;
  const dateRangeRe = /^\d{4}\/\d{2}\/\d{2}\s*-\s*\d{4}\/\d{2}\/\d{2}/;
  const numericRe = /^\d+\.\d+$/;
  const gradingRe = /^\d+%\s+and/i;
  const programRe = /^B\.Sc|^B\.A|^M\.Sc|^Diploma/i;

  const seen = new Set<string>();
  let foundName = false;
  let foundSemester = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const lower = line.toLowerCase();
    if (SKIP_LINES.has(lower)) continue;
    if (numericRe.test(line)) continue;
    if (gradingRe.test(line)) continue;
    if (programRe.test(line)) continue;
    if (dateRangeRe.test(line)) continue;

    if (awaitingRoom) {
      const last = classes[classes.length - 1];
      if (last && !last.room && !courseRe.test(line) && !classTypeRe.test(line) && !daysRe.test(line) && !timesRe.test(line) && !semesterRe.test(line)) {
        last.room = line;
        awaitingRoom = false;
        continue;
      }
      awaitingRoom = false;
    }

    if (!foundName) {
      if (looksLikeHiddenOrUIText(line)) continue;
      studentName = line;
      foundName = true;
      continue;
    }

    if (!foundSemester && semesterRe.test(line)) {
      semester = line;
      foundSemester = true;
      continue;
    }

    const courseMatch = line.match(courseRe);
    if (courseMatch) { currentCourseCode = courseMatch[1]; currentCourseName = courseMatch[2]; continue; }

    const classMatch = line.match(classTypeRe);
    if (classMatch) { currentClassType = classMatch[1]; currentSection = classMatch[2]; currentDay = ""; continue; }

    const dayMatch = line.match(daysRe);
    if (dayMatch) { currentDay = dayMatch[1].trim(); continue; }

    const timeMatch = line.match(timesRe);
    if (timeMatch) {
      const startTime = timeMatch[1].replace(/\s+/g, "");
      const endTime = timeMatch[2].replace(/\s+/g, "");
      const key = `${currentCourseCode}-${currentClassType}-${currentDay}-${startTime}`;
      if (!seen.has(key) && currentCourseCode) {
        seen.add(key);
        const { ramadanStart, ramadanEnd, warning } = convertToRamadan(startTime, endTime);
        classes.push({
          courseCode: currentCourseCode, courseName: currentCourseName,
          classType: currentClassType, section: currentSection, day: currentDay,
          startTime, endTime, room: "", ramadanStart, ramadanEnd, warning,
        });
        awaitingRoom = true;
      }
      continue;
    }
  }

  if (!studentName) errors.push("Could not find student name.");
  else if (studentName.length > 80) errors.push("The first line looks like instructions, not a name. Paste only the content from PeopleSoft: Manage Classes > View My Classes > Printable Page.");
  if (!semester) errors.push("Could not find semester (e.g. Winter 2026).");
  if (classes.length === 0) errors.push("No classes found. Make sure you pasted the full schedule from Printable Page.");

  if (errors.length > 0) return { schedule: null, errors };
  const displayName = studentName.length > 50 ? studentName.slice(0, 47) + "..." : studentName;
  return { schedule: { studentName: displayName, semester, classes }, errors: [] };
}

/* ── Day ordering ── */
const DAY_ORDER: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};
const DAY_AR: Record<string, string> = {
  Sunday: "الأحد", Monday: "الاثنين", Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة", Saturday: "السبت",
};
const DAY_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  Sunday:    { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Monday:    { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Tuesday:   { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Wednesday: { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Thursday:  { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Friday:    { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
  Saturday:  { dot: "bg-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400" },
};

function groupByDay(classes: ParsedClass[]) {
  const map = new Map<string, ParsedClass[]>();
  for (const c of classes) { if (!map.has(c.day)) map.set(c.day, []); map.get(c.day)!.push(c); }
  const groups = Array.from(map.entries()).map(([day, items]) => ({
    day, items: items.sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)),
  }));
  groups.sort((a, b) => (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99));
  return groups;
}

/* ── Image generator ── */
function generateImage(schedule: ParsedSchedule) {
  const scale = 2;
  const W = 390;
  const pad = 16;
  const rowPadX = 14;
  const rowHeight = 52;
  const dayLabelH = 22;
  const dayGap = 10;
  const blockGap = 12;

  const groups = groupByDay(schedule.classes);
  let totalH = pad + 28 + 12 + pad;
  for (const g of groups) { totalH += dayLabelH + dayGap + g.items.length * rowHeight + blockGap; }
  totalH += 20;

  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = totalH * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, W, totalH);

  let y = pad;
  ctx.fillStyle = "#f4f4f5";
  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`${schedule.semester} · Ramadan Schedule`, pad, y + 14);
  y += 28 + 12;

  for (const group of groups) {
    ctx.fillStyle = "#71717a";
    ctx.font = "600 10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(group.day.toUpperCase(), pad, y + 10);
    y += dayLabelH + dayGap;

    const blockW = W - pad * 2;
    const blockH = group.items.length * rowHeight;
    ctx.fillStyle = "#27272a";
    ctx.fillRect(pad, y, blockW, blockH);
    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, y, blockW, blockH);

    for (let i = 0; i < group.items.length; i++) {
      const c = group.items[i];
      if (i > 0) { ctx.strokeStyle = "#3f3f46"; ctx.beginPath(); ctx.moveTo(pad + rowPadX, y); ctx.lineTo(W - pad - rowPadX, y); ctx.stroke(); }
      const leftX = pad + rowPadX;
      const rightX = W - pad - rowPadX;
      const rowMidY = y + rowHeight / 2;

      ctx.fillStyle = "#f4f4f5";
      ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(c.courseCode, leftX, y + 16);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "400 10px -apple-system, BlinkMacSystemFont, sans-serif";
      const nameMaxW = rightX - leftX - 110;
      let nameText = c.courseName;
      if (ctx.measureText(nameText).width > nameMaxW) {
        for (let n = nameText.length - 1; n > 2; n--) { nameText = c.courseName.slice(0, n) + "\u2026"; if (ctx.measureText(nameText).width <= nameMaxW) break; }
      }
      ctx.fillText(nameText, leftX, y + 30);
      if (c.room) { ctx.fillStyle = "#71717a"; ctx.font = "400 9px -apple-system, BlinkMacSystemFont, sans-serif"; ctx.fillText(c.room, leftX, y + 42); }

      ctx.fillStyle = "#f4f4f5";
      ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
      const ramStr = `${c.ramadanStart} – ${c.ramadanEnd}`;
      const ramW = ctx.measureText(ramStr).width;
      ctx.fillText(ramStr, rightX - ramW, rowMidY + 4);
      y += rowHeight;
    }
    y += blockGap;
  }

  ctx.fillStyle = "#71717a";
  ctx.font = "400 9px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Generated by https://udst.tools", pad, y + 8);

  const link = document.createElement("a");
  link.download = `ramadan-${schedule.semester.replace(/\s+/g, "-").toLowerCase()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ── Component ── */
export default function RamadanScheduleMaker() {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [rawInput, setRawInput] = useLocalStorage<string>("ramadan-rawInput", "");
  const [schedule, setSchedule] = useState<ParsedSchedule | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleConvert = () => {
    const { schedule: parsed, errors: errs } = parseSchedule(rawInput);
    setErrors(errs);
    setSchedule(parsed);
  };

  const handleClear = () => {
    setRawInput("");
    setSchedule(null);
    setErrors([]);
    textareaRef.current?.focus();
  };

  const groups = schedule ? groupByDay(schedule.classes) : [];
  const hasWarnings = schedule?.classes.some((c) => c.warning);

  const uniqueCourses = schedule
    ? [...new Set(schedule.classes.map((c) => c.courseCode))]
    : [];
  const uniqueDays = schedule
    ? [...new Set(schedule.classes.map((c) => c.day))]
    : [];

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{ en: "Ramadan Schedule", ar: "جدول رمضان" }}
            description={{
              en: "Convert your regular class times to Ramadan hours and save as a phone-sized image.",
              ar: "حوّل أوقات حصصك العادية إلى توقيت رمضان واحفظ الجدول كصورة.",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {/* ════════ HOW IT WORKS + PASTE ════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Steps -- 2 cols */}
              <Card
                title={isRTL ? "الخطوات" : "How It Works"}
                className={`${cardClass} lg:col-span-2`}
              >
                <div className="space-y-4">
                  {[
                    {
                      n: "1",
                      en: <>Open <strong className="text-white">PeopleSoft</strong>, go to <strong className="text-white">Manage Classes</strong>, then <strong className="text-white">View My Classes</strong>.</>,
                      ar: <>افتح <strong className="text-white">PeopleSoft</strong>، ثم <strong className="text-white">Manage Classes</strong>، ثم <strong className="text-white">View My Classes</strong>.</>,
                    },
                    {
                      n: "2",
                      en: <>Click <strong className="text-white">Printable Page</strong> and copy the entire content of the window that opens.</>,
                      ar: <>اضغط <strong className="text-white">Printable Page</strong> وانسخ جميع محتويات النافذة التي ستفتح.</>,
                    },
                    {
                      n: "3",
                      en: "Paste it in the box and click Convert.",
                      ar: "الصق المحتوى في المربع واضغط تحويل.",
                    },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                        {step.n}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                        {isRTL ? step.ar : step.en}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Paste area -- 3 cols */}
              <Card
                title={isRTL ? "الصق الجدول" : "Paste Your Schedule"}
                className={`${cardClass} lg:col-span-3`}
              >
                <textarea
                  ref={textareaRef}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder={
                    isRTL
                      ? "الصق المحتوى من Printable Page هنا..."
                      : "Paste the content from the Printable Page here..."
                  }
                  rows={8}
                  className="w-full rounded-xl border border-zinc-600/40 bg-zinc-800/40 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y min-h-[140px] font-mono leading-relaxed"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleConvert}
                    disabled={!rawInput.trim()}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isRTL ? "حوّل الجدول" : "Convert"}
                  </button>
                  {(schedule || errors.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-2.5 rounded-xl border border-zinc-600/40 text-zinc-400 text-sm font-medium hover:text-white hover:bg-zinc-700/40 transition-colors"
                    >
                      {isRTL ? "مسح" : "Clear"}
                    </button>
                  )}
                </div>
              </Card>
            </div>

            {/* ════════ ERRORS ════════ */}
            {errors.length > 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-400">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    {errors.map((err, i) => (
                      <p key={i} className="text-sm text-red-400 leading-relaxed">{err}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════════ CONVERTED SCHEDULE ════════ */}
            {schedule && (
              <>
                {/* summary hero */}
                <Card className={cardClass}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {isRTL ? "الجدول المحوّل" : "Converted Schedule"}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {schedule.semester}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-400 tabular-nums">
                            {schedule.classes.length}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {isRTL ? "حصة" : "Classes"}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-zinc-700/40" />
                        <div className="text-center">
                          <p className="text-xl font-bold text-white tabular-nums">
                            {uniqueCourses.length}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {isRTL ? "مادة" : "Courses"}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-zinc-700/40" />
                        <div className="text-center">
                          <p className="text-xl font-bold text-white tabular-nums">
                            {uniqueDays.length}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {isRTL ? "يوم" : "Days"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasWarnings && (
                    <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2.5 flex items-center gap-2">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400 shrink-0">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs text-amber-400/90">
                        {isRTL
                          ? "بعض الأوقات غير موجودة في جدول التحويل وتم تقريبها."
                          : "Some times were approximated as they are not in the standard conversion table."}
                      </p>
                    </div>
                  )}
                </Card>

                {/* day-grouped classes */}
                <div className="space-y-4 sm:space-y-5">
                  {groups.map((group) => {
                    const dayColor = DAY_COLORS[group.day] || DAY_COLORS.Sunday;
                    return (
                      <Card key={group.day} className={`${cardClass} relative overflow-hidden`}>
                        <div className={`absolute top-0 start-0 w-1 h-full ${dayColor.dot} rounded-s-2xl`} />

                        {/* day header */}
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className={`inline-flex h-7 px-2.5 items-center rounded-lg text-xs font-semibold border ${dayColor.bg} ${dayColor.text} ${dayColor.border}`}>
                            {isRTL ? (DAY_AR[group.day] ?? group.day) : group.day}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {group.items.length}{" "}
                            {isRTL
                              ? (group.items.length === 1 ? "حصة" : "حصص")
                              : (group.items.length === 1 ? "class" : "classes")}
                          </span>
                        </div>

                        {/* class rows */}
                        <div className="rounded-xl border border-zinc-600/25 bg-zinc-800/20 overflow-hidden">
                          {group.items.map((c, ci) => (
                            <div
                              key={ci}
                              className={`px-4 py-3.5 sm:px-5 ${ci > 0 ? "border-t border-zinc-600/20" : ""}`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                {/* left: course info */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                    <span className="text-sm font-semibold text-white">
                                      {c.courseCode}
                                    </span>
                                    <span className="text-[10px] text-zinc-600 font-medium px-1.5 py-0.5 rounded bg-zinc-700/30">
                                      {c.classType}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-400 mt-0.5 truncate">
                                    {c.courseName}
                                  </p>
                                  {c.room && (
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                      {c.room}
                                    </p>
                                  )}
                                </div>

                                {/* right: times */}
                                <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
                                  <span className="text-xs text-zinc-500 line-through tabular-nums">
                                    {c.startTime} - {c.endTime}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-blue-400 shrink-0">
                                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-semibold text-white tabular-nums">
                                      {c.ramadanStart} - {c.ramadanEnd}
                                    </span>
                                  </div>
                                  {c.warning && (
                                    <span className="text-[10px] text-amber-400/80 mt-0.5">
                                      {c.warning}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* download */}
                <Card className={cardClass}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {isRTL ? "حفظ كصورة" : "Save as Image"}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {isRTL
                          ? "حمّل الجدول كصورة بحجم الهاتف."
                          : "Download as a phone-sized image for easy reference."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => generateImage(schedule)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      {isRTL ? "تحميل الصورة" : "Download Image"}
                    </button>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
