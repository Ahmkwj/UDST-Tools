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
          <Card title={locale === "ar" ? "حماية البيانات" : "Data Protection"}>
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
                    ? "نحن نستخدم Supabase، وهي منصة آمنة ومفتوحة المصدر، لإدارة حسابات المستخدمين. يتم تشفير جميع البيانات الشخصية وتخزينها بشكل آمن."
                    : "We use Supabase, a secure and open-source platform, to manage user accounts. All personal data is encrypted and securely stored."}
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
                    ? "نحن نجمع فقط المعلومات الضرورية لتشغيل حسابك: البريد الإلكتروني والاسم. لا نشارك هذه المعلومات مع أي طرف ثالث."
                    : "We only collect information necessary for your account: email and name. This information is never shared with third parties."}
                </p>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card
            title={
              locale === "ar" ? "كيف نحمي بياناتك" : "How We Protect Your Data"
            }
          >
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
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar" ? "تشفير البيانات" : "Data Encryption"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "نستخدم تشفيرًا قويًا لحماية بياناتك. كلمات المرور مشفرة باستخدام خوارزميات حديثة، ولا يمكن لأحد الوصول إليها، حتى نحن."
                      : "We use strong encryption to protect your data. Passwords are hashed using modern algorithms and are inaccessible, even to us."}
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
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar" ? "التحكم في البيانات" : "Data Control"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "لديك التحكم الكامل في بياناتك. يمكنك تحديث معلومات ملفك الشخصي أو حذف حسابك في أي وقت."
                      : "You have full control over your data. You can update your profile information or delete your account at any time."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Usage */}
          <Card title={locale === "ar" ? "استخدام البيانات" : "Data Usage"}>
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
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar"
                      ? "الحسابات والميزات"
                      : "Accounts & Features"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "نستخدم معلومات حسابك لتوفير تجربة شخصية وآمنة. يمكنك الوصول إلى ميزات إضافية مثل حفظ التقدم وتخصيص الإعدادات."
                      : "We use your account information to provide a personalized and secure experience. You can access additional features like progress saving and settings customization."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card title={locale === "ar" ? "تواصل معنا" : "Contact Us"}>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "إذا كان لديك أي أسئلة أو مخاوف بشأن خصوصية بياناتك، أو إذا كنت ترغب في حذف حسابك، يرجى التواصل معنا. نحن هنا للمساعدة وضمان حماية خصوصيتك."
                  : "If you have any questions or concerns about your data privacy, or if you wish to delete your account, please contact us. We're here to help and ensure your privacy is protected."}
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
