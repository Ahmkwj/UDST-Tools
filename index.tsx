import * as React from "react";
import { useLocale } from "./src/context/LanguageContext";
import { motion } from "framer-motion";
import { useAuth } from "./src/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user } = useAuth();
  const navigate = useNavigate();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const handleGetStarted = () => {
    if (user) {
      navigate(`/${locale}/guide`);
    } else {
      navigate(`/${locale}/login`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-blue-900/5 blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-blue-900/5 blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className={`relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-6 py-12 ${
          isRTL ? "rtl" : ""
        }`}
      >
        <motion.div variants={fadeIn} className="text-center space-y-6">
          <motion.div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              UT
            </span>
          </motion.div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
            </h1>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              BETA
            </span>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-3xl mx-auto">
            {locale === "ar"
              ? "مجموعة شاملة من الأدوات الأكاديمية المصممة خصيصًا لطلاب جامعة الدوحة للعلوم والتكنولوجيا"
              : "A comprehensive suite of academic tools designed specifically for University of Doha for Science and Technology students"}
          </p>
          <motion.div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              onClick={handleGetStarted}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {locale === "ar" ? "ابدأ الآن" : "Get Started"}
            </a>
            <a
              href={`/${locale}/about`}
              className="px-8 py-3 rounded-xl bg-zinc-800/50 text-white font-medium hover:bg-zinc-800 transition-all duration-300 transform hover:scale-105"
            >
              {locale === "ar" ? "تعرف علينا" : "Learn More"}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 w-full py-20 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent"
          >
            {locale === "ar" ? "ميزاتنا الرئيسية" : "Our Core Features"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* GPA Calculator */}
            <motion.div
              variants={fadeIn}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "حاسبة المعدل" : "GPA Calculator"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "احسب معدلك التراكمي بدقة وتوقع نتائجك المستقبلية"
                  : "Calculate your GPA accurately and predict future outcomes"}
              </p>
            </motion.div>

            {/* Grade Calculator */}
            <motion.div
              variants={fadeIn}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "حاسبة الدرجات" : "Grade Calculator"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "احسب درجاتك النهائية وحدد ما تحتاجه للنجاح"
                  : "Calculate your final grades and determine what you need to succeed"}
              </p>
            </motion.div>

            {/* Attendance Tracker */}
            <motion.div
              variants={fadeIn}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "متابعة الحضور" : "Attendance Tracker"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "تتبع نسبة غيابك وتجنب تجاوز الحد المسموح (15%) مع حسابات دقيقة بالدقائق"
                  : "Track your absence percentage and avoid exceeding the allowed limit (15%) with precise minute-based calculations"}
              </p>
            </motion.div>

            {/* Schedule Planner */}
            <motion.div
              variants={fadeIn}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "مخطط الجدول" : "Schedule Planner"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "خطط جدولك الدراسي واكتشف تعارضات المواعيد فوريًا لحل مشاكل التسجيل في PeopleSoft"
                  : "Plan your class schedule and detect time conflicts instantly to solve PeopleSoft registration issues"}
              </p>
            </motion.div>

            {/* Academic Calendar */}
            <motion.div
              variants={fadeIn}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "التقويم الأكاديمي" : "Academic Calendar"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "تتبع المواعيد المهمة والأحداث الأكاديمية"
                  : "Keep track of important dates and academic events"}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="relative z-10 w-full py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-zinc-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent"
          >
            {locale === "ar" ? "لماذا تختارنا؟" : "Why Choose Us?"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "مصمم لـ UDST" : "Built for UDST"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "مصمم خصيصًا لنظام الدرجات والتقويم الأكاديمي لجامعة الدوحة للعلوم والتكنولوجيا"
                  : "Specifically designed for UDST's grading system and academic calendar"}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "حسابات فورية" : "Instant Calculations"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "نتائج فورية مع واجهة سهلة الاستخدام وحسابات دقيقة لجميع احتياجاتك الأكاديمية"
                  : "Instant results with user-friendly interface and accurate calculations for all your academic needs"}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "آمن ومجاني" : "Secure & Free"}
              </h3>
              <p className="text-zinc-400">
                {locale === "ar"
                  ? "جميع الأدوات مجانية تمامًا مع حماية كاملة لخصوصيتك وبياناتك الأكاديمية"
                  : "All tools are completely free with full protection of your privacy and academic data"}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative z-10 w-full py-20 px-4 md:px-8 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
            {locale === "ar"
              ? "جاهز لتحسين تجربتك الأكاديمية؟"
              : "Ready to Enhance Your Academic Experience?"}
          </h2>
          <p className="text-zinc-400 mb-8">
            {locale === "ar"
              ? "انضم إلى زملائك الطلاب في UDST واستفد من أدواتنا المتخصصة اليوم"
              : "Join your fellow UDST students and take advantage of our specialized tools today"}
          </p>
          <a
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            {locale === "ar" ? "ابدأ الآن" : "Get Started"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </motion.section>

      {/* Footer Note */}
      <div className="relative z-10 w-full py-8 text-center">
        <p className="text-sm text-zinc-500">
          {locale === "ar"
            ? "مشروع طلابي مستقل، غير مرتبط رسميًا بجامعة الدوحة للعلوم والتكنولوجيا"
            : "An independent student project, not officially affiliated with University of Doha for Science and Technology"}
        </p>
      </div>
    </div>
  );
};

export default Home;
