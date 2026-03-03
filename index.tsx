import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useLocale } from "./src/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Footer from "./src/components/ui/Footer";

/* ── Floating shapes background ── */
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* gradient orbs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/[0.03] blur-[90px]" />

      {/* geometric shapes */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 45, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[12%] w-16 h-16 border border-zinc-700/20 rounded-2xl"
      />
      <motion.div
        animate={{ y: [15, -15, 15], rotate: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[25%] left-[8%] w-10 h-10 border border-zinc-700/15 rounded-full"
      />
      <motion.div
        animate={{ y: [10, -20, 10], x: [-5, 5, -5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[55%] right-[6%] w-8 h-8 border border-blue-500/10 rounded-lg rotate-12"
      />
      <motion.div
        animate={{ y: [-12, 18, -12], rotate: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-[70%] left-[15%] w-12 h-12 border border-zinc-600/15 rounded-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] left-[50%] w-6 h-6 bg-blue-500/[0.04] rounded-md"
      />

      {/* dot grid - top area */}
      <svg className="absolute top-20 left-10 w-32 h-32 text-zinc-700/15 opacity-50" viewBox="0 0 100 100">
        {Array.from({ length: 25 }).map((_, i) => (
          <circle key={i} cx={(i % 5) * 25 + 5} cy={Math.floor(i / 5) * 25 + 5} r="1.5" fill="currentColor" />
        ))}
      </svg>
      <svg className="absolute bottom-40 right-10 w-24 h-24 text-zinc-700/10 opacity-50" viewBox="0 0 100 100">
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={(i % 4) * 30 + 5} cy={Math.floor(i / 4) * 30 + 5} r="1.5" fill="currentColor" />
        ))}
      </svg>
    </div>
  );
}

/* ── Scroll reveal ── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ── */
function Counter({ value, suffix = "+", label, delay = 0 }: { value: number; suffix?: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(e * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
        {count}<span className="text-blue-400">{suffix}</span>
      </span>
      <span className="text-xs text-zinc-500 mt-1">{label}</span>
    </motion.div>
  );
}

/* ── Tool data ── */
type Tool = {
  path: string;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
  badge?: string;
  color: string;
  icon: React.ReactNode;
};

const TOOLS: Tool[] = [
  {
    path: "/gpa-calculator",
    en: "GPA Calculator",
    ar: "حاسبة المعدل",
    descEn: "Enter transcript data and this semester's courses to project your cumulative GPA instantly.",
    descAr: "أدخل بيانات كشف الدرجات ومواد الفصل لمعرفة معدلك التراكمي المتوقع.",
    color: "blue",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>,
  },
  {
    path: "/grade-calculator",
    en: "Grade Calculator",
    ar: "حاسبة الدرجات",
    descEn: "Add assignments with weights and scores to estimate your final course grade.",
    descAr: "أضف التقييمات بأوزانها ودرجاتك لتقدير الدرجة النهائية للمادة.",
    color: "blue",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" /></svg>,
  },
  {
    path: "/attendance-calculator",
    en: "Attendance Tracker",
    ar: "متابعة الحضور",
    descEn: "Track absences by class and stay safely under the 15% limit all semester.",
    descAr: "تتبّع غيابك لكل حصة وابقَ ضمن حدّ الـ 15% بأمان طوال الفصل.",
    color: "emerald",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z" /></svg>,
  },
  {
    path: "/fees-manager",
    en: "Fees Manager",
    ar: "إدارة الرسوم",
    descEn: "Estimate tuition and total semester cost based on your program and courses.",
    descAr: "قدّر الرسوم الدراسية والتكاليف الإجمالية حسب برنامجك ومقرراتك.",
    color: "amber",
    badge: "NEW",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  },
  {
    path: "/calendar",
    en: "Academic Calendar",
    ar: "التقويم الأكاديمي",
    descEn: "View key dates, exam periods, and registration deadlines for every semester.",
    descAr: "استعرض التواريخ المهمة وفترات الامتحانات ومواعيد التسجيل.",
    color: "blue",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>,
  },
  {
    path: "/ramadan-schedule",
    en: "Ramadan Schedule",
    ar: "جدول رمضان",
    descEn: "Paste your enrollment schedule and instantly convert to Ramadan class hours.",
    descAr: "الصق جدول تسجيلك وحوّل أوقات الحصص إلى توقيت رمضان فورًا.",
    color: "blue",
    badge: "NEW",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
  },
  {
    path: "/schedule-planner",
    en: "Schedule Planner",
    ar: "مخطط الجدول",
    descEn: "Build your weekly timetable visually and catch time conflicts before registering.",
    descAr: "ابنِ جدولك الأسبوعي واكتشف التعارضات قبل التسجيل.",
    color: "blue",
    badge: "NEW",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  },
  {
    path: "/links",
    en: "UDST Links",
    ar: "روابط UDST",
    descEn: "Quick links to the student portal, email, Blackboard, and more.",
    descAr: "روابط سريعة للبوابة الطلابية والبريد والبلاك بورد.",
    color: "zinc",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>,
  },
];

const COLOR_MAP: Record<string, { iconBg: string; iconText: string; hoverBorder: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  blue:    { iconBg: "bg-blue-500/10",    iconText: "text-blue-400",    hoverBorder: "hover:border-blue-500/30",    badgeBg: "bg-blue-500/15",    badgeText: "text-blue-300",    badgeBorder: "border-blue-500/20" },
  emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-400", hoverBorder: "hover:border-emerald-500/30", badgeBg: "bg-emerald-500/15", badgeText: "text-emerald-300", badgeBorder: "border-emerald-500/20" },
  amber:   { iconBg: "bg-amber-500/10",   iconText: "text-amber-400",   hoverBorder: "hover:border-amber-500/30",   badgeBg: "bg-amber-500/15",   badgeText: "text-amber-300",   badgeBorder: "border-amber-500/20" },
  zinc:    { iconBg: "bg-zinc-500/10",    iconText: "text-zinc-400",    hoverBorder: "hover:border-zinc-500/30",    badgeBg: "bg-zinc-500/15",    badgeText: "text-zinc-300",    badgeBorder: "border-zinc-500/20" },
};

const HIGHLIGHTS = [
  {
    en: "Built for UDST", ar: "مصمم لجامعة UDST",
    descEn: "Grading scales, academic calendar, attendance rules, and fee structures all match your university exactly.",
    descAr: "سلم الدرجات والتقويم الأكاديمي وقواعد الحضور وهيكل الرسوم مطابقة لجامعتك تمامًا.",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" /></svg>,
  },
  {
    en: "Instant & Accurate", ar: "فوري ودقيق",
    descEn: "Every calculation runs in your browser in real time. No server, no loading screens, no waiting.",
    descAr: "كل الحسابات تتم في متصفحك مباشرة. بدون خادم وبدون تحميل وبدون انتظار.",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>,
  },
  {
    en: "Private & Free", ar: "خاص ومجاني",
    descEn: "No sign-up needed. Your data stays on your device, always. No tracking, no analytics, no ads.",
    descAr: "بدون تسجيل. بياناتك تبقى على جهازك دائمًا. بدون تتبع وبدون إعلانات.",
    icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Z" /></svg>,
  },
];

const STEPS = [
  { en: "Open any tool from the sidebar", ar: "افتح أي أداة من القائمة الجانبية", icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> },
  { en: "Enter your data directly", ar: "أدخل بياناتك مباشرة", icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg> },
  { en: "See results instantly", ar: "شاهد النتائج فورًا", icon: <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> },
];

/* ── Main component ── */
const Home: React.FC = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const isRTL = locale === "ar";

  return (
    <div className="page-container">
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* ────── HERO ────── */}
        <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
          <FloatingShapes />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900 pointer-events-none" />

          <div className="relative z-10 px-5 sm:px-8 py-20 sm:py-32 w-full max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700/40 bg-zinc-800/30 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400">
                {isRTL ? "مجاني ومفتوح للجميع" : "Free & open for all UDST students"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              <span className="text-white">{isRTL ? "أدوات " : "UDST "}</span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                {isRTL ? "UDST" : "Tools"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            >
              {isRTL
                ? "أدوات أكاديمية مجانية لطلاب جامعة الدوحة للعلوم والتكنولوجيا: المعدل التراكمي، الدرجات، الحضور، الجداول، والرسوم الدراسية."
                : "Free academic toolkit for UDST students: GPA, grades, attendance, scheduling, fees, and more -- all in one place."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-10 flex flex-wrap justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => navigate("/gpa-calculator")}
                className="group relative px-7 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                {isRTL ? "ابدأ الآن" : "Get Started"}
                <span className="absolute inset-0 rounded-xl bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/guide")}
                className="px-7 py-3.5 rounded-xl bg-zinc-800/80 border border-zinc-600/40 text-zinc-200 font-semibold text-sm hover:bg-zinc-700/80 hover:border-zinc-500/50 transition-all duration-200 backdrop-blur-sm"
              >
                {isRTL ? "دليل الاستخدام" : "User Guide"}
              </button>
            </motion.div>

            {/* scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 sm:mt-20 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 rounded-full border-2 border-zinc-600/40 flex items-start justify-center pt-2"
              >
                <div className="w-1 h-2 rounded-full bg-zinc-500" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ────── STATS ────── */}
        <section className="relative z-10 py-10 sm:py-14 px-5">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              <Counter value={8} label={isRTL ? "أدوات" : "Tools"} />
              <div className="w-px h-10 bg-zinc-700/50" />
              <Counter value={2} label={isRTL ? "لغتان" : "Languages"} delay={0.1} />
              <div className="w-px h-10 bg-zinc-700/50" />
              <Counter value={100} suffix="%" label={isRTL ? "مجاني" : "Free"} delay={0.2} />
            </div>
          </div>
        </section>

        {/* ────── TOOLS BENTO GRID ────── */}
        <section className="relative z-10 py-14 sm:py-24 px-5 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12 sm:mb-16">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">
                  {isRTL ? "الأدوات" : "Tools"}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {isRTL ? "كل ما تحتاجه في مكان واحد" : "Everything you need, one place"}
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
                  {isRTL
                    ? "أدوات مصمّمة خصيصًا لطلاب جامعة الدوحة للعلوم والتكنولوجيا."
                    : "Purpose-built tools designed specifically for UDST students."}
                </p>
              </div>
            </Reveal>

            {/* bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {TOOLS.map((tool, i) => {
                const c = COLOR_MAP[tool.color] || COLOR_MAP.blue;
                const isLarge = i < 2;

                return (
                  <Reveal key={tool.path} delay={i * 0.06} className={isLarge ? "lg:col-span-1 sm:col-span-1" : ""}>
                    <div
                      onClick={() => navigate(tool.path)}
                      className={`group cursor-pointer rounded-2xl border border-zinc-700/40 bg-zinc-800/25 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 ${c.hoverBorder} hover:bg-zinc-800/40 hover:shadow-lg hover:shadow-black/20 h-full flex flex-col`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.iconText} transition-transform duration-300 group-hover:scale-110`}>
                          {tool.icon}
                        </div>
                        {tool.badge && (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${c.badgeBg} ${c.badgeText} border ${c.badgeBorder}`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-zinc-100">
                        {isRTL ? tool.ar : tool.en}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed flex-1">
                        {isRTL ? tool.descAr : tool.descEn}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        <span>{isRTL ? "افتح" : "Open"}</span>
                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ────── HOW IT WORKS ────── */}
        <section className="relative z-10 py-14 sm:py-24 px-5 sm:px-8">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-12 sm:mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">
                  {isRTL ? "كيف يعمل" : "How it works"}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {isRTL ? "ثلاث خطوات فقط" : "Three simple steps"}
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {STEPS.map((step, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="text-center px-4 py-6">
                    <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 mb-5">
                      <span className="text-zinc-300">{step.icon}</span>
                      <span className="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      {isRTL ? step.ar : step.en}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ────── WHY ────── */}
        <section className="relative z-10 py-14 sm:py-24 px-5 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="text-center mb-12 sm:mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-3">
                  {isRTL ? "لماذا نحن" : "Why us"}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {isRTL ? "لماذا أدوات UDST؟" : "Why UDST Tools?"}
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {HIGHLIGHTS.map((h, i) => (
                <Reveal key={h.en} delay={i * 0.1}>
                  <div className="rounded-2xl border border-zinc-700/40 bg-zinc-800/25 p-6 sm:p-7 h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 text-blue-400 mb-5">
                      {h.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2.5">
                      {isRTL ? h.ar : h.en}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {isRTL ? h.descAr : h.descEn}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ────── CTA ────── */}
        <section className="relative z-10 py-20 sm:py-32 px-5 sm:px-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
          </div>
          <Reveal>
            <div className="relative max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/40 mb-8">
                <span className="text-2xl font-bold text-blue-400 tracking-tight">UT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {isRTL ? "جاهز لتبدأ؟" : "Ready to get started?"}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mb-10 max-w-md mx-auto">
                {isRTL
                  ? "اطلع على دليل الاستخدام أو ابدأ مباشرة بحساب معدلك التراكمي."
                  : "Check out the quick guide or jump right in and start calculating."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/gpa-calculator")}
                  className="group relative px-8 py-3.5 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  {isRTL ? "احسب معدلك" : "Calculate GPA"}
                  <span className="absolute inset-0 rounded-xl bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/guide")}
                  className="px-8 py-3.5 rounded-xl bg-zinc-800/80 border border-zinc-600/40 text-zinc-200 font-semibold text-sm hover:bg-zinc-700/80 transition-all duration-200"
                >
                  {isRTL ? "دليل الاستخدام" : "User Guide"}
                </button>
              </div>
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
