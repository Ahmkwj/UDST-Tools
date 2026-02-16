import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useLocale } from "./src/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Footer from "./src/components/ui/Footer";

/* ── Animated grid background ── */
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const step = 60;
      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step;
          const y = r * step;
          const dist = Math.sqrt(
            Math.pow(x - w / 2, 2) + Math.pow(y - h * 0.35, 2),
          );
          const wave = Math.sin(dist * 0.008 - time * 0.6) * 0.5 + 0.5;
          const alpha = wave * 0.07 * Math.max(0, 1 - dist / (w * 0.7));
          ctx.fillStyle = `rgba(161, 161, 170, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step;
          const y = r * step;
          const dist = Math.sqrt(
            Math.pow(x - w / 2, 2) + Math.pow(y - h * 0.35, 2),
          );
          const wave = Math.sin(dist * 0.008 - time * 0.6) * 0.5 + 0.5;
          const alpha = wave * 0.03 * Math.max(0, 1 - dist / (w * 0.7));

          if (c < cols - 1) {
            ctx.strokeStyle = `rgba(161, 161, 170, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + step, y);
            ctx.stroke();
          }
          if (r < rows - 1) {
            ctx.strokeStyle = `rgba(161, 161, 170, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + step);
            ctx.stroke();
          }
        }
      }

      time += 0.016;
      animFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ── Scroll-triggered section wrapper ── */
function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature card ── */
function FeatureCard({
  icon,
  title,
  desc,
  href,
  badge,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  badge?: string;
  delay: number;
}) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => navigate(href)}
      className="group relative cursor-pointer rounded-2xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-blue-500/5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-700/40 text-zinc-400 transition-colors duration-300 group-hover:bg-blue-500/15 group-hover:text-blue-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-white group-hover:text-zinc-100 transition-colors">
              {title}
            </h3>
            {badge && (
              <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/20">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
        </div>
        <svg
          className="w-4 h-4 shrink-0 text-zinc-600 transition-all duration-300 group-hover:text-blue-400 group-hover:translate-x-0.5 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── Stat counter ── */
function StatCounter({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const dur = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <span className="text-3xl sm:text-4xl font-bold text-blue-400 tabular-nums">
        {count}+
      </span>
      <span className="text-xs text-zinc-400 mt-1">{label}</span>
    </motion.div>
  );
}

/* ── Feature data ── */
type Feature = {
  path: string;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
  badge?: string;
  icon: React.ReactNode;
};

const FEATURES: { headingEn: string; headingAr: string; items: Feature[] }[] = [
  {
    headingEn: "Academic",
    headingAr: "الأكاديمية",
    items: [
      {
        path: "/calendar",
        en: "Academic Calendar",
        ar: "التقويم الأكاديمي",
        descEn:
          "View important dates, exam periods, and registration deadlines for every semester.",
        descAr:
          "استعرض التواريخ المهمة وفترات الامتحانات ومواعيد التسجيل لكل فصل.",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
        ),
      },
      {
        path: "/ramadan-schedule",
        en: "Ramadan Schedule",
        ar: "جدول رمضان",
        descEn:
          "Paste your enrollment schedule and instantly convert class times to Ramadan hours.",
        descAr: "الصق جدول تسجيلك وحوّل أوقات الحصص إلى توقيت رمضان فورًا.",
        badge: "NEW",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        ),
      },
      {
        path: "/schedule-planner",
        en: "Schedule Planner",
        ar: "مخطط الجدول",
        descEn:
          "Build your weekly timetable visually and catch time conflicts before registering.",
        descAr: "ابنِ جدولك الأسبوعي بصريًا واكتشف التعارضات قبل التسجيل.",
        badge: "NEW",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008Z"
            />
          </svg>
        ),
      },
      {
        path: "/attendance-calculator",
        en: "Attendance Tracker",
        ar: "متابعة الحضور",
        descEn:
          "Track absences by minutes per class and stay safely under the 15% limit.",
        descAr: "تتبّع غيابك بالدقائق لكل حصة وابقَ ضمن حدّ الـ 15% بأمان.",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    headingEn: "Calculators",
    headingAr: "الحاسبات",
    items: [
      {
        path: "/gpa-calculator",
        en: "GPA Calculator",
        ar: "حاسبة المعدل",
        descEn:
          "Enter transcript data, add this semester's courses, and see your projected cumulative GPA.",
        descAr:
          "أدخل بيانات كشف الدرجات وأضف مواد الفصل الحالي لتوقع معدلك التراكمي.",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
            />
          </svg>
        ),
      },
      {
        path: "/grade-calculator",
        en: "Grade Calculator",
        ar: "حاسبة الدرجات",
        descEn:
          "Add assignments with weights and scores to estimate your final course grade.",
        descAr: "أضف التقييمات بأوزانها ودرجاتك لتقدير الدرجة النهائية.",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    headingEn: "Financial",
    headingAr: "المالية",
    items: [
      {
        path: "/fees-manager",
        en: "Fees Manager",
        ar: "إدارة الرسوم",
        descEn:
          "Estimate tuition, fees, and total cost based on your program and course load.",
        descAr:
          "قدّر الرسوم الدراسية والتكاليف الإجمالية حسب برنامجك وحملك الدراسي.",
        badge: "NEW",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    headingEn: "Resources",
    headingAr: "الموارد",
    items: [
      {
        path: "/links",
        en: "UDST Links",
        ar: "روابط UDST",
        descEn:
          "Quick links to the student portal, email, Blackboard, and more.",
        descAr: "روابط سريعة للبوابة الطلابية والبريد والبلاك بورد وأكثر.",
        icon: (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            />
          </svg>
        ),
      },
    ],
  },
];

const HIGHLIGHTS = [
  {
    en: "Built for UDST",
    ar: "مصمم لجامعة UDST",
    descEn:
      "Grading system, calendar, and attendance rules match your university exactly.",
    descAr: "نظام الدرجات والتقويم وقواعد الحضور مطابقة لجامعتك تمامًا.",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
      </svg>
    ),
  },
  {
    en: "Instant & Accurate",
    ar: "فوري ودقيق",
    descEn: "All calculations happen in your browser. No loading, no waiting.",
    descAr: "كل الحسابات تتم في متصفحك. بدون تحميل وبدون انتظار.",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    ),
  },
  {
    en: "Private & Free",
    ar: "خاص ومجاني",
    descEn: "No account needed. Your data never leaves your device.",
    descAr: "بدون حساب. بياناتك لا تغادر جهازك أبدًا.",
    icon: (
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Z"
        />
      </svg>
    ),
  },
];

/* ── Component ── */
const Home: React.FC = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const isRTL = locale === "ar";
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.97]);

  return (
    <div ref={containerRef} className="page-container">
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden">
          <GridBackground />

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900 pointer-events-none" />

          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 px-5 sm:px-8 pt-20 sm:pt-32 lg:pt-40 pb-16 sm:pb-24"
          >
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-8 backdrop-blur-sm"
              >
                <span className="text-2xl font-bold text-blue-400 tracking-tight">
                  UT
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]"
              >
                {isRTL ? "أدوات UDST" : "UDST Tools"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-5 text-zinc-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
              >
                {isRTL
                  ? "أدوات أكاديمية مجانية لطلاب جامعة الدوحة للعلوم والتكنولوجيا: المعدل التراكمي، الدرجات، الحضور، الجداول، والرسوم الدراسية في مكان واحد."
                  : "Free academic tools for university students: GPA, grades, attendance, scheduling, and fees in one place."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10 flex flex-wrap justify-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => navigate("/gpa-calculator")}
                  className="px-7 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  {isRTL ? "ابدأ الآن" : "Get Started"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/guide")}
                  className="px-7 py-3 rounded-xl bg-zinc-800/80 border border-zinc-600/40 text-zinc-200 font-semibold text-sm hover:bg-zinc-700/80 hover:border-zinc-500/50 transition-all duration-200 backdrop-blur-sm"
                >
                  {isRTL ? "دليل الاستخدام" : "User Guide"}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="relative z-10 py-12 sm:py-16 px-5 sm:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              <StatCounter
                value={8}
                label={isRTL ? "أدوات" : "Tools"}
                delay={0}
              />
              <div className="w-px h-10 bg-zinc-700/60" />
              <StatCounter
                value={2}
                label={isRTL ? "لغتان" : "Languages"}
                delay={0.1}
              />
              <div className="w-px h-10 bg-zinc-700/60" />
              <StatCounter
                value={100}
                label={isRTL ? "مجاني" : "Free"}
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="relative z-10 py-12 sm:py-20 px-5 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {isRTL
                    ? "كل ما تحتاجه في مكان واحد"
                    : "Everything you need in one place"}
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
                  {isRTL
                    ? "أدوات مصمّمة خصيصًا لطلاب جامعة الدوحة للعلوم والتكنولوجيا لتسهيل حياتك الأكاديمية."
                    : "Tools designed specifically for UDST students to simplify your academic life."}
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-10 sm:space-y-14">
              {FEATURES.map((group, gIdx) => (
                <div key={group.headingEn}>
                  <ScrollReveal delay={gIdx * 0.05}>
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                      {isRTL ? group.headingAr : group.headingEn}
                    </p>
                  </ScrollReveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.items.map((item, idx) => (
                      <FeatureCard
                        key={item.path}
                        icon={item.icon}
                        title={isRTL ? item.ar : item.en}
                        desc={isRTL ? item.descAr : item.descEn}
                        href={item.path}
                        badge={item.badge}
                        delay={idx * 0.08}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY / HIGHLIGHTS ── */}
        <section className="relative z-10 py-12 sm:py-20 px-5 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {isRTL ? "لماذا أدوات UDST؟" : "Why UDST Tools?"}
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {HIGHLIGHTS.map((h, idx) => (
                <ScrollReveal key={h.en} delay={idx * 0.1}>
                  <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-5 sm:p-6 text-center h-full">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 mb-4">
                      {h.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      {isRTL ? h.ar : h.en}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {isRTL ? h.descAr : h.descEn}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 py-16 sm:py-24 px-5 sm:px-8">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {isRTL ? "جاهز لتبدأ؟" : "Ready to get started?"}
              </h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
                {isRTL
                  ? "اطّلع على دليل الاستخدام أو ابدأ مباشرةً بحساب معدلك التراكمي."
                  : "Read the quick guide or jump right in and calculate your GPA."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/gpa-calculator")}
                  className="px-7 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  {isRTL ? "احسب معدلك" : "Calculate GPA"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/guide")}
                  className="px-7 py-3 rounded-xl bg-zinc-800/80 border border-zinc-600/40 text-zinc-200 font-semibold text-sm hover:bg-zinc-700/80 transition-all duration-200"
                >
                  {isRTL ? "دليل الاستخدام" : "User Guide"}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
