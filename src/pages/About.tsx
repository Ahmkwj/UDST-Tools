import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
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
          <PageHeader
            title={{
              en: "UDST Tools",
              ar: "أدوات UDST",
            }}
            description={{
              en: "A collection of tools to help you manage your academic journey",
              ar: "مجموعة من الأدوات لمساعدتك في رحلتك الأكاديمية",
            }}
          />

          {/* Developer's Message */}
          <Card
            title={locale === "ar" ? "رسالة المطور" : "Developer's Message"}
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar" ? (
                  <>
                    مرحبًا، أنا أحمد، طالب في جامعة UDST. قمت بإنشاء هذه المنصة
                    لمساعدة زملائي الطلاب في إدارة حياتهم الأكاديمية بشكل أفضل.
                    كطالب، أدرك التحديات التي نواجهها في تتبع معدلاتنا التراكمية
                    & الحضور، وحساب درجاتنا، وإدارة جداولنا الدراسية.
                    <br />
                    <br />
                    هذه المنصة هي نتيجة لساعات من العمل والتطوير، مدفوعة برغبتي
                    في توفير حلول سهلة الاستخدام لزملائي الطلاب. جميع الأدوات
                    مجانية للاستخدام ومفتوحة المصدر، وأرحب بأي اقتراحات للتحسين.
                  </>
                ) : (
                  <>
                    Hello, I'm Ahmed, a student at UDST. I created this platform
                    to help my fellow students better manage their academic
                    lives. As a student myself, I understand the challenges we
                    face in tracking our GPAs & Attendance, calculating grades,
                    and managing our schedules.
                    <br />
                    <br />
                    This platform is the result of hours of development, driven
                    by my desire to provide user-friendly solutions for fellow
                    students. All tools are free to use and open source, and I
                    welcome any suggestions for improvement.
                  </>
                )}
              </p>
            </div>
          </Card>

          {/* Tools section */}
          <Card title={locale === "ar" ? "الأدوات المتاحة" : "Available Tools"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-13.5 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z"
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

              <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
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

              <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.331 0-4.512-.645-6.374-1.766z"
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
            </div>
          </Card>

          {/* Features Coming Soon */}
          <Card title={locale === "ar" ? "قريبًا" : "Coming Soon"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {locale === "ar" ? "حسابات المستخدمين" : "User Accounts"}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400">
                  {locale === "ar"
                    ? "احفظ تقدمك وخصص تجربتك"
                    : "Save your progress and personalize your experience"}
                </p>
              </div>

              <div className="group bg-zinc-800/30 hover:bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75h18M12 15.75h.008v.008H12v-.008z"
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
