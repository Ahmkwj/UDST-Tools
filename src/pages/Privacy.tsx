import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

export default function Privacy() {
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
              en: "Privacy & Data",
              ar: "الخصوصية والبيانات",
            }}
            description={{
              en: "How we handle your data and protect your privacy",
              ar: "كيف نتعامل مع بياناتك ونحمي خصوصيتك",
            }}
          />

          {/* No Data Collection */}
          <Card
            title={locale === "ar" ? "لا نجمع أي بيانات" : "No Data Collection"}
          >
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex-shrink-0 flex items-center justify-center mt-1 ltr:mr-3 rtl:ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-green-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-zinc-300 leading-relaxed flex-1">
                  {locale === "ar"
                    ? "نحن لا نجمع أو نخزن أو نشارك أي معلومات شخصية. كل البيانات التي تدخلها تبقى في متصفحك فقط ويتم مسحها تلقائيًا عند إغلاق الصفحة أو تحديثها."
                    : "We do not collect, store, or share any personal information. All data you enter stays in your browser only and is automatically cleared when you close or refresh the page."}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex-shrink-0 flex items-center justify-center mt-1 ltr:mr-3 rtl:ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-green-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <p className="text-zinc-300 leading-relaxed flex-1">
                  {locale === "ar"
                    ? "جميع العمليات الحسابية والمعالجة تتم محليًا في متصفحك. لا يوجد اتصال بالخادم أو تخزين للبيانات."
                    : "All calculations and processing happen locally in your browser. There is no server communication or data storage."}
                </p>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card title={locale === "ar" ? "كيف يعمل" : "How It Works"}>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex-shrink-0 flex items-center justify-center mt-1 ltr:mr-3 rtl:ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar" ? "معالجة محلية" : "Local Processing"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "عندما تستخدم أي من أدواتنا (مثل حاسبة المعدل التراكمي أو حاسبة الدرجات)، تتم جميع العمليات الحسابية في متصفحك فقط."
                      : "When you use any of our tools (like the GPA Calculator or Grade Calculator), all calculations are performed in your browser only."}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex-shrink-0 flex items-center justify-center mt-1 ltr:mr-3 rtl:ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar" ? "بيانات مؤقتة" : "Temporary Data"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "جميع البيانات التي تدخلها تُخزن مؤقتًا في ذاكرة المتصفح فقط. بمجرد إغلاق علامة التبويب أو تحديث الصفحة، يتم مسح جميع البيانات تلقائيًا."
                      : "All data you enter is temporarily stored in browser memory only. As soon as you close the tab or refresh the page, all data is automatically cleared."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Future Updates */}
          <Card
            title={locale === "ar" ? "التحديثات المستقبلية" : "Future Updates"}
          >
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "في المستقبل، قد نضيف ميزة الحسابات الاختيارية لحفظ تقدمك. إذا تم إضافة هذه الميزة، سنقوم بتحديث سياسة الخصوصية هذه وإعلامك بجميع التغييرات. ستظل خصوصية بياناتك دائمًا أولويتنا القصوى."
                  : "In the future, we may add optional accounts to save your progress. If this feature is added, we will update this privacy policy and inform you of all changes. Your data privacy will always remain our top priority."}
              </p>
            </div>
          </Card>

          {/* Contact */}
          <Card title={locale === "ar" ? "تواصل معنا" : "Contact Us"}>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "إذا كان لديك أي أسئلة أو مخاوف بشأن خصوصية بياناتك، يرجى التواصل معنا. نحن نأخذ خصوصيتك على محمل الجد ونرحب بأي استفسارات."
                  : "If you have any questions or concerns about your data privacy, please reach out to us. We take your privacy seriously and welcome any inquiries."}
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
