import { useState, useRef } from "react";
import { useLocale } from "../context/LanguageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Footer from "../components/ui/Footer";

/* Theme */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const sectionGap = "space-y-8 sm:space-y-12";

/* ── Ramadan time conversion maps ── */
const START_TIME_MAP: Record<number, number> = {
  480: 480,
  540: 525,
  570: 545,
  600: 570,
  630: 590,
  660: 615,
  690: 635,
  720: 660,
  750: 680,
  780: 720,
  810: 740,
  840: 765,
  870: 785,
  900: 810,
  930: 830,
  960: 855,
  990: 875,
  1020: 900,
  1050: 920,
  1080: 945,
  1110: 965,
  1140: 990,
};

const DURATION_MAP: Record<number, number> = {
  60: 40,
  90: 60,
  120: 80,
  150: 100,
  180: 120,
  240: 160,
  300: 200,
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

function convertToRamadan(
  startStr: string,
  endStr: string,
): { ramadanStart: string; ramadanEnd: string; warning?: string } {
  const startMins = parseTimeToMinutes(startStr);
  const endMins = parseTimeToMinutes(endStr);
  if (startMins < 0 || endMins < 0)
    return { ramadanStart: "?", ramadanEnd: "?", warning: "Invalid time" };

  const ramStart = START_TIME_MAP[startMins];
  if (ramStart === undefined)
    return {
      ramadanStart: "?",
      ramadanEnd: "?",
      warning: `Start time ${startStr} not in conversion table`,
    };

  const duration = endMins - startMins;
  const ramDuration = DURATION_MAP[duration];
  if (ramDuration === undefined) {
    const ratio = 2 / 3;
    const approx = Math.round(duration * ratio);
    return {
      ramadanStart: minutesToDisplay(ramStart),
      ramadanEnd: minutesToDisplay(ramStart + approx),
      warning: `Duration ${duration} min not standard; approximated`,
    };
  }

  return {
    ramadanStart: minutesToDisplay(ramStart),
    ramadanEnd: minutesToDisplay(ramStart + ramDuration),
  };
}

/* ── Parser ── */
const SKIP_LINES = new Set([
  "credit",
  "status",
  "units",
  "grading basis",
  "academic program",
  "requirement designation",
  "enrolled",
  "class",
  "start/end dates",
  "days and times",
  "room",
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

function parseSchedule(raw: string): {
  schedule: ParsedSchedule | null;
  errors: string[];
} {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim());
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
  const classTypeRe =
    /^(Lecture|Laboratory|Tutorial|Seminar|Lab)\s*-\s*Class\s+\d+\s*-?\s*Section\s+(\d+)/i;
  const daysRe = /^Days?:\s*(.+)/i;
  const timesRe =
    /^Times?:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))\s+to\s+(\d{1,2}:\d{2}\s*(?:AM|PM))/i;
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
      if (
        last &&
        !last.room &&
        !courseRe.test(line) &&
        !classTypeRe.test(line) &&
        !daysRe.test(line) &&
        !timesRe.test(line) &&
        !semesterRe.test(line)
      ) {
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
    if (courseMatch) {
      currentCourseCode = courseMatch[1];
      currentCourseName = courseMatch[2];
      continue;
    }

    const classMatch = line.match(classTypeRe);
    if (classMatch) {
      currentClassType = classMatch[1];
      currentSection = classMatch[2];
      currentDay = "";
      continue;
    }

    const dayMatch = line.match(daysRe);
    if (dayMatch) {
      currentDay = dayMatch[1].trim();
      continue;
    }

    const timeMatch = line.match(timesRe);
    if (timeMatch) {
      const startTime = timeMatch[1].replace(/\s+/g, "");
      const endTime = timeMatch[2].replace(/\s+/g, "");
      const key = `${currentCourseCode}-${currentClassType}-${currentDay}-${startTime}`;
      if (!seen.has(key) && currentCourseCode) {
        seen.add(key);
        const { ramadanStart, ramadanEnd, warning } = convertToRamadan(
          startTime,
          endTime,
        );
        classes.push({
          courseCode: currentCourseCode,
          courseName: currentCourseName,
          classType: currentClassType,
          section: currentSection,
          day: currentDay,
          startTime,
          endTime,
          room: "",
          ramadanStart,
          ramadanEnd,
          warning,
        });
        awaitingRoom = true;
      }
      continue;
    }
  }

  if (!studentName) errors.push("Could not find student name.");
  else if (studentName.length > 80)
    errors.push(
      "The first line looks like instructions, not a name. Paste only the content from PeopleSoft: Manage Classes > View My Classes > Printable Page.",
    );
  if (!semester) errors.push("Could not find semester (e.g. Winter 2026).");
  if (classes.length === 0)
    errors.push(
      "No classes found. Make sure you pasted the full schedule from the Printable Page (Manage Classes > View My Classes > Printable Page).",
    );

  if (errors.length > 0) return { schedule: null, errors };
  const displayName =
    studentName.length > 50 ? studentName.slice(0, 47) + "..." : studentName;
  return {
    schedule: { studentName: displayName, semester, classes },
    errors: [],
  };
}

/* ── Day ordering ── */
const DAY_ORDER: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function groupByDay(
  classes: ParsedClass[],
): { day: string; items: ParsedClass[] }[] {
  const map = new Map<string, ParsedClass[]>();
  for (const c of classes) {
    if (!map.has(c.day)) map.set(c.day, []);
    map.get(c.day)!.push(c);
  }
  const groups = Array.from(map.entries()).map(([day, items]) => ({
    day,
    items: items.sort(
      (a, b) =>
        parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime),
    ),
  }));
  groups.sort((a, b) => (DAY_ORDER[a.day] ?? 99) - (DAY_ORDER[b.day] ?? 99));
  return groups;
}

/* ── Image generator (Canvas API) ── */
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
  for (const g of groups) {
    totalH += dayLabelH + dayGap;
    totalH += g.items.length * rowHeight;
    totalH += blockGap;
  }
  totalH += 20;

  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = totalH * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);

  const bg = "#18181b";
  const blockBg = "#27272a";
  const border = "#3f3f46";
  const textPrimary = "#f4f4f5";
  const textSecondary = "#a1a1aa";
  const textTertiary = "#71717a";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, totalH);

  let y = pad;

  ctx.fillStyle = textPrimary;
  ctx.font = "600 16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`${schedule.semester} · Ramadan Schedule`, pad, y + 14);
  y += 28 + 12;

  for (const group of groups) {
    ctx.fillStyle = textTertiary;
    ctx.font = "600 10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(group.day.toUpperCase(), pad, y + 10);
    y += dayLabelH + dayGap;

    const blockW = W - pad * 2;
    const blockH = group.items.length * rowHeight;

    ctx.fillStyle = blockBg;
    ctx.fillRect(pad, y, blockW, blockH);

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, y, blockW, blockH);

    for (let i = 0; i < group.items.length; i++) {
      const c = group.items[i];
      if (i > 0) {
        ctx.strokeStyle = border;
        ctx.beginPath();
        ctx.moveTo(pad + rowPadX, y);
        ctx.lineTo(W - pad - rowPadX, y);
        ctx.stroke();
      }

      const leftX = pad + rowPadX;
      const rightX = W - pad - rowPadX;
      const rowMidY = y + rowHeight / 2;

      ctx.fillStyle = textPrimary;
      ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(c.courseCode, leftX, y + 16);

      ctx.fillStyle = textSecondary;
      ctx.font = "400 10px -apple-system, BlinkMacSystemFont, sans-serif";
      const nameMaxW = rightX - leftX - 110;
      let nameText = c.courseName;
      if (ctx.measureText(nameText).width > nameMaxW) {
        for (let n = nameText.length - 1; n > 2; n--) {
          nameText = c.courseName.slice(0, n) + "\u2026";
          if (ctx.measureText(nameText).width <= nameMaxW) break;
        }
      }
      ctx.fillText(nameText, leftX, y + 30);

      if (c.room) {
        ctx.fillStyle = textTertiary;
        ctx.font = "400 9px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillText(c.room, leftX, y + 42);
      }

      ctx.fillStyle = textPrimary;
      ctx.font = "600 13px -apple-system, BlinkMacSystemFont, sans-serif";
      const ramStr = `${c.ramadanStart} – ${c.ramadanEnd}`;
      const ramW = ctx.measureText(ramStr).width;
      ctx.fillText(ramStr, rightX - ramW, rowMidY + 4);

      y += rowHeight;
    }

    y += blockGap;
  }

  ctx.fillStyle = textTertiary;
  ctx.font = "400 9px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Generated by https://udst.tools", pad, y + 8);

  const link = document.createElement("a");
  const safeSemester = schedule.semester.replace(/\s+/g, "-").toLowerCase();
  link.download = `ramadan-${safeSemester}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* ── Component ── */
export default function RamadanScheduleMaker() {
  const locale = useLocale();
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

  const dayNameAr: Record<string, string> = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
    Friday: "الجمعة",
    Saturday: "السبت",
  };

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "Ramadan Schedule",
              ar: "جدول رمضان",
            }}
            description={{
              en: "Convert your class times to Ramadan hours and save as a phone-sized image.",
              ar: "حوّل أوقات الحصص إلى توقيت رمضان واحفظ الجدول كصورة بحجم الهاتف.",
            }}
          />

          <div className={sectionGap}>
            <Card
              title={
                locale === "ar" ? "الصق جدول التسجيل" : "Paste Your Schedule"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "من PeopleSoft: اذهب إلى Manage Classes ثم View My Classes ثم Printable Page. عند فتح الصفحة، انسخ جميع محتويات النافذة والصقها هنا."
                  : "In PeopleSoft go to Manage Classes, then View My Classes, then click Printable Page. Copy the whole content of the window that opens and paste it here."}
              </p>
              <textarea
                ref={textareaRef}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "الصق المحتوى من Printable Page هنا..."
                    : "Paste the content from the Printable Page here..."
                }
                rows={10}
                className="w-full rounded-xl border border-zinc-500/40 bg-zinc-800/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-y min-h-[160px] font-mono leading-relaxed"
              />
              <div className="flex gap-3 mt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConvert}
                  disabled={!rawInput.trim()}
                  className="flex-1 sm:flex-none"
                >
                  {locale === "ar" ? "حوّل الجدول" : "Convert Schedule"}
                </Button>
                {(schedule || errors.length > 0) && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleClear}
                    className="rounded-xl border-zinc-500/40 text-zinc-300 hover:text-white hover:bg-zinc-700/40"
                  >
                    {locale === "ar" ? "مسح" : "Clear"}
                  </Button>
                )}
              </div>
            </Card>

            {errors.length > 0 && (
              <Card
                title={locale === "ar" ? "خطأ" : "Error"}
                className={`${cardClass} border-s-4 !border-s-red-400/30`}
              >
                <div className="space-y-2">
                  {errors.map((err, i) => (
                    <p key={i} className="text-sm text-red-400 leading-relaxed">
                      {err}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {schedule && (
              <>
                <Card
                  title={
                    locale === "ar" ? "الجدول المحوّل" : "Converted Schedule"
                  }
                  className={cardClass}
                >
                 

                  {hasWarnings && (
                    <p className="text-xs text-amber-400/90 mb-4 leading-relaxed">
                      {locale === "ar"
                        ? "بعض الأوقات غير موجودة في جدول التحويل وتم تقريبها."
                        : "Some times were not in the conversion table and have been approximated."}
                    </p>
                  )}

                  <div className="space-y-8">
                    {groups.map((group) => (
                      <div key={group.day}>
                        <p className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
                          {locale === "ar"
                            ? (dayNameAr[group.day] ?? group.day)
                            : group.day}
                        </p>
                        <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 overflow-hidden">
                          {group.items.map((c, ci) => (
                            <div
                              key={ci}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5 ${
                                ci > 0 ? "border-t border-zinc-600/25" : ""
                              } ${locale === "ar" ? "sm:flex-row-reverse" : ""}`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                  <span className="text-sm font-semibold text-white">
                                    {c.courseCode}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {c.classType}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[280px] sm:max-w-none">
                                  {c.courseName}
                                </p>
                                {c.room && (
                                  <p className="text-[11px] text-zinc-500 mt-1">
                                    {locale === "ar" ? "Room:" : "Room:"} {c.room}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`flex flex-col sm:items-end gap-0.5 shrink-0 ${
                                  locale === "ar" ? "sm:items-start" : ""
                                }`}
                              >
                                <span className="text-xs text-zinc-500 line-through tabular-nums">
                                  {c.startTime} – {c.endTime}
                                </span>
                                <span className="text-sm font-semibold text-white tabular-nums">
                                  {c.ramadanStart} – {c.ramadanEnd}
                                </span>
                                {c.warning && (
                                  <span className="text-[10px] text-amber-400/80 mt-0.5">
                                    {c.warning}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card
                  title={locale === "ar" ? "حفظ كصورة" : "Save as Image"}
                  className={cardClass}
                >
                  <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                    {locale === "ar"
                      ? "حمّل جدولك المحوّل كصورة بحجم الهاتف لسهولة الاستخدام."
                      : "Download your converted schedule as a phone-sized image for easy reference."}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => generateImage(schedule)}
                  >
                    {locale === "ar" ? "تحميل الصورة" : "Download Image"}
                  </Button>
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
