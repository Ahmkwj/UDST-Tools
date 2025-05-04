import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import { useLocale } from "../context/LanguageContext";

export default function About() {
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
          <div className="text-center mb-2 md:mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mt-4 mb-6">
              {locale === "ar" ? "أدوات UDST" : "UDST Tools"}
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
              {locale === "ar"
                ? "مجموعة من الأدوات لمساعدتك في رحلتك الأكاديمية"
                : "A collection of tools to help you manage your academic journey"}
            </p>
          </div>

          {/* Tools section */}
          <Card title={locale === "ar" ? "الأدوات المتاحة" : "Available Tools"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {locale === "ar"
                      ? "حاسبة المعدل التراكمي"
                      : "GPA Calculator"}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {locale === "ar"
                    ? "احسب معدلك التراكمي وتتبع أداءك الأكاديمي عبر الفصول الدراسية"
                    : "Calculate your GPA and track academic performance across semesters"}
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {locale === "ar" ? "حاسبة الدرجات" : "Grade Calculator"}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {locale === "ar"
                    ? "قدّر درجاتك النهائية في المقررات بناءً على أوزان التقييمات"
                    : "Estimate your final course grades based on assignment weights"}
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {locale === "ar" ? "حاسبة الحضور" : "Attendance Calculator"}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {locale === "ar"
                    ? "تتبع حضورك وخطط للغياب ضمن الحدود المسموح بها"
                    : "Track attendance and plan absences within course limits"}
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {locale === "ar" ? "منشئ الجدول" : "Schedule Maker"}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {locale === "ar"
                    ? "حوّل جدولك من PDF إلى تنسيق التقويم"
                    : "Convert your PDF schedule into a calendar format"}
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimer section */}
          <Card title={locale === "ar" ? "ملاحظة مهمة" : "Important Note"}>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
              <p className="text-yellow-400 font-medium mb-2">
                {locale === "ar" ? "تنويه:" : "Disclaimer:"}
              </p>
              <p className="text-zinc-300">
                {locale === "ar"
                  ? "هذه المنصة غير مرتبطة أو معتمدة أو متصلة بجامعة الدوحة للعلوم والتكنولوجيا (UDST). إنها مشروع طلابي مستقل."
                  : "This platform is not affiliated with, endorsed by, or connected to University of Doha for Science and Technology (UDST). It is an independent student project."}
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
