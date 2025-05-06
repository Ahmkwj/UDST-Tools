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
              en: "Our commitment to protecting your information while you use our academic tools",
              ar: "التزامنا بحماية معلوماتك أثناء استخدامك لأدواتنا الأكاديمية",
            }}
          />

          {/* Data Collection & Storage */}
          <Card
            title={
              locale === "ar"
                ? "جمع البيانات وتخزينها"
                : "Data Collection & Storage"
            }
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
                    ? "نستخدم Supabase، وهي منصة مفتوحة المصدر متوافقة مع معايير أمان البيانات الصناعية، لإدارة حسابات المستخدمين وتخزين البيانات بأمان. جميع المعلومات الشخصية مشفرة باستخدام خوارزميات تشفير قوية ومخزنة في بيئة آمنة تلتزم بأفضل ممارسات حماية البيانات."
                    : "We utilize Supabase, an open-source platform compliant with industry data security standards, to manage user accounts and securely store data. All personal information is encrypted using robust encryption algorithms and stored in a secure environment that adheres to data protection best practices."}
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
                    ? "نجمع فقط المعلومات الضرورية لتشغيل حسابك وتخصيص تجربتك، مثل البريد الإلكتروني والاسم والمعلومات الأكاديمية التي تقدمها طواعية. بيانات الحساب الأساسية مطلوبة لتوفير خدماتنا، بينما البيانات الأكاديمية (مثل المعدل التراكمي والساعات المعتمدة) اختيارية وتستخدم فقط لتخصيص الأدوات الحسابية لتجربتك."
                    : "We collect only the information necessary to operate your account and personalize your experience, such as email, name, and academic information you voluntarily provide. Account data is required to provide our services, while academic data (like GPA and credit hours) is optional and used solely to tailor our calculation tools to your experience."}
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
                      d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                    />
                  </svg>
                </div>
                <p className="text-zinc-300 leading-relaxed flex-1">
                  {locale === "ar"
                    ? "لا نشارك بياناتك الشخصية مع أي أطراف ثالثة أو مؤسسات تعليمية. نحن مشروع طلابي مستقل تمامًا ملتزم بالحفاظ على خصوصية المستخدمين."
                    : "We do not share your personal data with any third parties or educational institutions. We are a completely independent student project committed to preserving user privacy."}
                </p>
              </div>
            </div>
          </Card>

          {/* Data Security Measures */}
          <Card
            title={
              locale === "ar"
                ? "تدابير أمان البيانات"
                : "Data Security Measures"
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
                      ? "جميع البيانات المخزنة والمنقولة محمية باستخدام بروتوكولات التشفير الحديثة. كلمات المرور مشفرة باستخدام خوارزميات تجزئة قوية، مما يعني أنه لا يمكن لأي شخص، بما في ذلك فريقنا، الوصول إلى كلمة المرور الأصلية الخاصة بك. الاتصالات مع خوادمنا محمية باستخدام بروتوكول HTTPS الآمن."
                      : "All stored and transmitted data is protected using modern encryption protocols. Passwords are hashed using strong algorithms, meaning no one, including our team, can access your original password. Communications with our servers are secured using HTTPS protocol."}
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
                      ? "لديك السيطرة الكاملة على بياناتك الشخصية والأكاديمية. يمكنك تحديث معلومات ملفك الشخصي أو تعديل بياناتك الأكاديمية أو حذف حسابك تمامًا في أي وقت. عند حذف حسابك، تتم إزالة جميع معلوماتك الشخصية من أنظمتنا بشكل دائم."
                      : "You have complete control over your personal and academic data. You can update your profile information, modify your academic data, or delete your account entirely at any time. When you delete your account, all of your personal information is permanently removed from our systems."}
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
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5h-1.5m-15 0A2.25 2.25 0 013 6.75V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6.75a2.25 2.25 0 00-2.25-2.25H5.25m-1.5 0h3m-3 18.75h3"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar"
                      ? "النسخ الاحتياطي والاسترداد"
                      : "Backup & Recovery"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "يتم نسخ بياناتك احتياطيًا بشكل آمن بانتظام لمنع فقدانها في حالة حدوث مشكلة فنية. تخضع جميع عمليات النسخ الاحتياطي لنفس مستوى التشفير والحماية مثل نظام البيانات الأساسي لدينا."
                      : "Your data is securely backed up regularly to prevent loss in case of a technical issue. All backups are subject to the same level of encryption and protection as our primary data system."}
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
                      ? "تخصيص الأدوات الأكاديمية"
                      : "Academic Tool Personalization"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "نستخدم معلوماتك الأكاديمية لتخصيص أدواتنا الحسابية (مثل حاسبة المعدل التراكمي، حاسبة الدرجات، وحاسبة الحضور) وفقًا لوضعك التعليمي الفردي. هذا يوفر لك تجربة أكثر دقة وفعالية دون الحاجة إلى إعادة إدخال نفس المعلومات في كل مرة تستخدم فيها المنصة."
                      : "We use your academic information to customize our calculation tools (such as GPA Calculator, Grade Calculator, and Attendance Calculator) according to your individual educational situation. This provides you with a more accurate and efficient experience without having to re-enter the same information each time you use the platform."}
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
                      d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">
                    {locale === "ar" ? "تحليلات المنصة" : "Platform Analytics"}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {locale === "ar"
                      ? "نجمع بيانات استخدام مجهولة الهوية ومجمعة لتحسين منصتنا وفهم كيفية استخدام أدواتنا. هذه المعلومات لا تتضمن أي بيانات تعريف شخصية وتستخدم فقط لأغراض التحسين الداخلي."
                      : "We collect anonymized, aggregated usage data to improve our platform and understand how our tools are being used. This information contains no personally identifiable information and is used solely for internal improvement purposes."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Rights & Choices */}
          <Card
            title={locale === "ar" ? "حقوقك وخياراتك" : "Your Rights & Choices"}
          >
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex-shrink-0 flex items-center justify-center mt-1 ltr:mr-3 rtl:ml-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-indigo-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                    />
                  </svg>
                </div>
                <p className="text-zinc-300 leading-relaxed flex-1">
                  {locale === "ar"
                    ? "لديك الحق في الوصول إلى بياناتك الشخصية، وتصحيحها، وتحديثها، وطلب حذفها. للاستفسارات المتعلقة بالبيانات، يرجى التواصل معنا."
                    : "You have the right to access, correct, update, and request deletion of your personal data. For data-related inquiries, please contact us."}
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card title={locale === "ar" ? "تواصل معنا" : "Contact Us"}>
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "إذا كانت لديك أي أسئلة أو مخاوف بشأن خصوصية بياناتك، أو ترغب في ممارسة حقوقك المتعلقة ببياناتك، أو تحتاج إلى مساعدة في حذف حسابك، يرجى التواصل معنا عبر نموذج الملاحظات في التطبيق. نلتزم بالرد على جميع الاستفسارات في غضون 48 ساعة."
                  : "If you have any questions or concerns about your data privacy, wish to exercise your data-related rights, or need assistance with account deletion, please contact us through our in-app feedback form. We are committed to responding to all inquiries within 48 hours."}
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
