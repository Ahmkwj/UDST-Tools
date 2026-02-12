import * as React from "react";
import { useLocale } from "./src/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./src/components/ui/Footer";

type ToolItem = {
  path: string;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
};

type ToolGroup = {
  headingEn: string;
  headingAr: string;
  items: ToolItem[];
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    headingEn: "Academic",
    headingAr: "أكاديمي",
    items: [
      { path: "/calendar", en: "Academic Calendar", ar: "التقويم الأكاديمي", descEn: "Important dates, exams, and deadlines for the year", descAr: "المواعيد المهمة والامتحانات والمواعيد النهائية للسنة" },
      { path: "/schedule-planner", en: "Schedule Planner", ar: "مخطط الجدول", descEn: "Build your weekly schedule and detect time conflicts before registering", descAr: "ابنِ جدولك الأسبوعي واكتشف التعارضات قبل التسجيل" },
      { path: "/attendance-calculator", en: "Attendance Calculator", ar: "حاسبة الحضور", descEn: "Track absence by minutes and stay under the 15% limit", descAr: "تتبع الغياب بالدقائق وابقَ تحت حد 15%" },
    ],
  },
  {
    headingEn: "Calculators",
    headingAr: "حاسبات",
    items: [
      { path: "/gpa-calculator", en: "GPA Calculator", ar: "حاسبة المعدل التراكمي", descEn: "Calculate current GPA, add courses from transcript, and see projected GPA", descAr: "احسب معدلك الحالي، أضف مواد من كشف الدرجات، وتوقع المعدل" },
      { path: "/grade-calculator", en: "Grade Calculator", ar: "حاسبة الدرجات", descEn: "Estimate final course grade from assignments and weights", descAr: "قدّر الدرجة النهائية من التقييمات وأوزانها" },
      { path: "/study-time-calculator", en: "Study Time Calculator", ar: "حاسبة وقت الدراسة", descEn: "Plan study hours based on credits and goals", descAr: "خطط ساعات الدراسة حسب الساعات والأهداف" },
    ],
  },
  {
    headingEn: "Financial",
    headingAr: "مالي",
    items: [
      { path: "/fees-manager", en: "Fees Manager", ar: "مدير الرسوم", descEn: "Estimate tuition and fees by program and course load", descAr: "قدّر الرسوم الدراسية حسب البرنامج والحمل الدراسي" },
    ],
  },
  {
    headingEn: "Resources",
    headingAr: "موارد",
    items: [
      { path: "/links", en: "UDST Links", ar: "روابط UDST", descEn: "Quick links to student portal, email, and university resources", descAr: "روابط سريعة للبوابة الطلابية والبريد وموارد الجامعة" },
      { path: "/guide", en: "User Guide", ar: "دليل المستخدم", descEn: "Step-by-step guide for every tool", descAr: "دليل خطوة بخطوة لكل أداة" },
      { path: "/feedback", en: "Feedback", ar: "الملاحظات", descEn: "Send suggestions or report issues", descAr: "أرسل اقتراحات أو أبلغ عن مشكلة" },
    ],
  },
];

const CHEVRON = (
  <svg className="w-4 h-4 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const viewport = { once: true, margin: "-50px" };
const transition = { duration: 0.35 };

const Home: React.FC = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const isRTL = locale === "ar";

  const handleGetStarted = () => navigate(`/${locale}/guide`);

  return (
    <div className="min-h-screen w-full flex flex-col text-white bg-[#141414]">
      {/* Hero: one clear block */}
      <section className="px-5 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-600/40 mb-6">
            <span className="text-xl font-bold text-blue-400">UT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            {isRTL ? "أدوات UDST" : "UDST Tools"}
          </h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
            {isRTL
              ? "أدوات أكاديمية مجانية لطلاب الجامعة: المعدل، الدرجات، الحضور، الجدول، والرسوم في مكان واحد."
              : "Free academic tools for university students: GPA, grades, attendance, scheduling, and fees in one place."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              {isRTL ? "ابدأ من الدليل" : "Start with the guide"}
            </button>
            <a
              href={`/${locale}/about`}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 border border-zinc-600/40 text-zinc-200 font-medium hover:bg-zinc-700 transition-colors"
            >
              {isRTL ? "حول" : "About"}
            </a>
          </div>
        </div>
      </section>

      {/* All tools: long scroll, one background, sections with border-t */}
      <section className="border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={transition}
            className="text-xl font-semibold text-white mb-8"
          >
            {isRTL ? "كل الأدوات" : "All tools"}
          </motion.h2>

          <div className="space-y-14">
            {TOOL_GROUPS.map((group, gIdx) => (
              <motion.div
                key={group.headingEn}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ ...transition, delay: gIdx * 0.05 }}
              >
                <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500 mb-5">
                  {isRTL ? group.headingAr : group.headingEn}
                </h3>
                <ul className="space-y-0">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <a
                        href={`/${locale}${item.path}`}
                        className="flex items-center gap-4 py-4 border-t border-zinc-800 first:border-t-0 first:pt-0 group"
                      >
                        <span className="flex-1 min-w-0">
                          <span className="font-medium text-white group-hover:text-blue-300 transition-colors block">
                            {isRTL ? item.ar : item.en}
                          </span>
                          <span className="text-sm text-zinc-400 mt-0.5 block">
                            {isRTL ? item.descAr : item.descEn}
                          </span>
                        </span>
                        <span className={isRTL ? "rotate-180" : ""}>{CHEVRON}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why: short, same background */}
      <section className="border-t border-zinc-800 px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={transition}
            className="text-xl font-semibold text-white mb-8"
          >
            {isRTL ? "لماذا أدوات UDST؟" : "Why UDST Tools?"}
          </motion.h2>
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...transition, delay: 0.05 }}
            className="space-y-4"
          >
            <li className="flex gap-3">
              <span className="text-blue-400 mt-0.5 shrink-0">1.</span>
              <span className="text-zinc-300">{isRTL ? "مصمم لجامعة الدوحة للعلوم والتكنولوجيا: نظام الدرجات والتقويم مطابق للجامعة." : "Built for UDST: grading system and academic calendar match your university."}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 mt-0.5 shrink-0">2.</span>
              <span className="text-zinc-300">{isRTL ? "حسابات فورية ودقيقة، واجهة بسيطة." : "Instant, accurate calculations and a simple interface."}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 mt-0.5 shrink-0">3.</span>
              <span className="text-zinc-300">{isRTL ? "مجاني بالكامل وبياناتك تبقى خاصة." : "Completely free; your data stays private."}</span>
            </li>
          </motion.ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 px-5 sm:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={transition}
            className="text-zinc-400 mb-6"
          >
            {isRTL ? "اقرأ الدليل السريع لتعرف كيف تستخدم كل أداة." : "Read the quick guide to learn how to use each tool."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...transition, delay: 0.05 }}
          >
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              {isRTL ? "فتح دليل المستخدم" : "Open user guide"}
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
