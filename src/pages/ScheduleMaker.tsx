import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";
import Footer from "../components/ui/Footer";

export default function ScheduleMaker() {
  const locale = useLocale();

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          {/* Header section */}
          <PageHeader
            title={{
              en: "Schedule Maker",
              ar: "منشئ الجدول",
            }}
            description={{
              en: "Convert your PDF schedule into a calendar format",
              ar: "حوّل جدولك من PDF إلى تنسيق التقويم",
            }}
          />

          {/* Coming Soon Message */}
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                strokeWidth={1.5}
                          stroke="currentColor"
                className="w-10 h-10 text-blue-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008z"
                          />
                        </svg>
                      </div>

            <div className="max-w-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                {locale === "ar" ? "قريبًا!" : "Coming Soon!"}
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                {locale === "ar"
                  ? "نحن نعمل على تطوير هذه الأداة لمساعدتك في تحويل جدولك الدراسي من PDF إلى تنسيق التقويم بسهولة. ترقبوا!"
                  : "We're working on developing this tool to help you easily convert your class schedule from PDF to calendar format. Stay tuned!"}
                      </p>
                    </div>

            <div className="mt-8 px-4 py-3 rounded-lg bg-zinc-700/50 border border-zinc-600/50">
              <p className="text-sm text-zinc-300">
                {locale === "ar"
                  ? "سيتم إطلاق هذه الميزة قريبًا"
                  : "This feature will be available soon"}
                      </p>
                    </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
