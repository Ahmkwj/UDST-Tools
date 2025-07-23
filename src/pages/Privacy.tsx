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
          <PageHeader
            title={{
              en: "Privacy Policy",
              ar: "سياسة الخصوصية",
            }}
            description={{
              en: "How we protect and handle your personal information on UDST Tools",
              ar: "كيف نحمي ونتعامل مع معلوماتك الشخصية في أدوات UDST",
            }}
          />

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-sm text-zinc-400">
              {locale === "ar" 
                ? "آخر تحديث: يوليو 2025"
                : "Last updated: July 2025"
              }
            </p>
          </div>

          {/* Introduction */}
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                {locale === "ar" ? "مقدمة" : "Introduction"}
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "مرحبًا بك في أدوات UDST، منصة مجانية ومفتوحة المصدر مصممة خصيصًا لطلاب جامعة الدوحة للعلوم والتكنولوجيا. نحن ملتزمون بحماية خصوصيتك وشفافية التعامل مع بياناتك الشخصية."
                  : "Welcome to UDST Tools, a free and open-source platform designed specifically for University of Doha for Science and Technology students. We are committed to protecting your privacy and being transparent about how we handle your personal data."
                }
              </p>
              <p className="text-zinc-300 leading-relaxed">
                {locale === "ar"
                  ? "هذه السياسة توضح كيفية جمعنا، واستخدامنا، وحمايتنا لمعلوماتك عند استخدامك لمنصتنا وأدواتنا الأكاديمية."
                  : "This policy explains how we collect, use, and protect your information when you use our platform and academic tools."
                }
              </p>
            </div>
          </Card>

          {/* Information We Collect */}
          <Card>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {locale === "ar" ? "المعلومات التي نجمعها" : "Information We Collect"}
                </h2>
              </div>

              {/* Account Information */}
              <div className={`border-blue-500 ${locale === "ar" ? "border-r-4 pr-6" : "border-l-4 pl-6"}`}>
                <h3 className="text-lg font-medium text-white mb-3">
                  {locale === "ar" ? "معلومات الحساب" : "Account Information"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "البريد الإلكتروني: مطلوب لإنشاء الحساب وتسجيل الدخول"
                        : "Email address: Required for account creation and login"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "الاسم الكامل: لتخصيص تجربتك وإظهار معلوماتك في الطلبات"
                        : "Full name: To personalize your experience and display your information in requests"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "كلمة المرور: مشفرة ومحمية بأقوى المعايير الأمنية"
                        : "Password: Encrypted and protected with the strongest security standards"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className={`border-green-500 ${locale === "ar" ? "border-r-4 pr-6" : "border-l-4 pl-6"}`}>
                <h3 className="text-lg font-medium text-white mb-3">
                  {locale === "ar" ? "المعلومات الأكاديمية (اختيارية)" : "Academic Information (Optional)"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "المعدل التراكمي الحالي والساعات المعتمدة"
                        : "Current GPA and credit hours"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "عدد المواد الحالية المسجل بها"
                        : "Number of currently enrolled courses"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "رقم الطالب (لطلبات تبديل المواد فقط)"
                        : "Student ID (for course swap requests only)"
                      }
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-sm text-emerald-300">
                    {locale === "ar"
                      ? "هذه المعلومات اختيارية تمامًا وتستخدم فقط لتحسين دقة الحسابات في أدواتنا"
                      : "This information is completely optional and used only to improve calculation accuracy in our tools"
                    }
                  </p>
                </div>
              </div>

              {/* Usage Data */}
              <div className={`border-purple-500 ${locale === "ar" ? "border-r-4 pr-6" : "border-l-4 pl-6"}`}>
                <h3 className="text-lg font-medium text-white mb-3">
                  {locale === "ar" ? "بيانات الاستخدام" : "Usage Data"}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "الأدوات المستخدمة ومعدل الاستخدام (بدون تفاصيل شخصية)"
                        : "Tools used and usage frequency (without personal details)"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "أوقات تسجيل الدخول والجلسات (لتحسين الأداء)"
                        : "Login times and sessions (for performance improvement)"
                      }
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className={`w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <p className="text-zinc-300 text-sm">
                      {locale === "ar" 
                        ? "تقارير الأخطاء والمشاكل التقنية (لحل المشاكل)"
                        : "Error reports and technical issues (for troubleshooting)"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {locale === "ar" ? "كيف نستخدم معلوماتك" : "How We Use Your Information"}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-zinc-700 pb-2">
                    {locale === "ar" ? "الوظائف الأساسية" : "Core Functions"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "إدارة حسابك وتسجيل الدخول" : "Account management and authentication"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "حفظ تفضيلاتك وإعداداتك" : "Saving your preferences and settings"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "تخصيص واجهة المستخدم" : "Personalizing the user interface"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-zinc-700 pb-2">
                    {locale === "ar" ? "تحسين الأدوات" : "Tool Enhancement"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "حسابات المعدل التراكمي المخصصة" : "Personalized GPA calculations"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "توقعات الدرجات والأداء" : "Grade and performance predictions"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "تتبع التقدم الأكاديمي" : "Academic progress tracking"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-semibold text-red-300 mb-3">
                  {locale === "ar" ? "ما لا نفعله أبدًا:" : "What We Never Do:"}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <span className="text-red-200 text-sm">
                      {locale === "ar" ? "بيع أو مشاركة بياناتك مع أطراف ثالثة" : "Sell or share your data with third parties"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <span className="text-red-200 text-sm">
                      {locale === "ar" ? "إرسال رسائل تسويقية أو إعلانات" : "Send marketing emails or advertisements"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <span className="text-red-200 text-sm">
                      {locale === "ar" ? "مشاركة معلوماتك مع الجامعة أو الإدارة" : "Share your information with university administration"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <span className="text-red-200 text-sm">
                      {locale === "ar" ? "تتبع موقعك أو أنشطتك خارج المنصة" : "Track your location or activities outside the platform"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Security & Protection */}
          <Card>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {locale === "ar" ? "أمان وحماية البيانات" : "Data Security & Protection"}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-1 gap-8">
                <div className="space-y-6">
                  <div className={`border-red-500 ${locale === "ar" ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}>
                    <h4 className="font-semibold text-white mb-2">
                      {locale === "ar" ? "التشفير المتقدم" : "Advanced Encryption"}
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {locale === "ar"
                        ? "جميع البيانات مشفرة باستخدام بروتوكولات AES-256 و HTTPS. كلمات المرور محمية بخوارزميات التشفير الأحادي (bcrypt)."
                        : "All data is encrypted using AES-256 and HTTPS protocols. Passwords are protected with one-way hashing algorithms (bcrypt)."
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`border-green-500 ${locale === "ar" ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}>
                    <h4 className="font-semibold text-white mb-2">
                      {locale === "ar" ? "النسخ الاحتياطي الآمن" : "Secure Backups"}
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {locale === "ar"
                        ? "نسخ احتياطية منتظمة ومشفرة لحماية بياناتك من الفقدان، مع إمكانية الاسترداد السريع."
                        : "Regular encrypted backups to protect your data from loss, with quick recovery capabilities."
                      }
                    </p>
                  </div>

                  <div className={`border-purple-500 ${locale === "ar" ? "border-r-4 pr-4" : "border-l-4 pl-4"}`}>
                    <h4 className="font-semibold text-white mb-2">
                      {locale === "ar" ? "المراقبة الأمنية" : "Security Monitoring"}
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {locale === "ar"
                        ? "مراقبة مستمرة للأنشطة المشبوهة وحماية من محاولات الاختراق والوصول غير المصرح به."
                        : "Continuous monitoring for suspicious activities and protection against hacking attempts and unauthorized access."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Your Rights & Control */}
          <Card>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {locale === "ar" ? "حقوقك والتحكم في بياناتك" : "Your Rights & Data Control"}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-zinc-700 pb-2">
                    {locale === "ar" ? "حقوقك" : "Your Rights"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "الوصول إلى بياناتك" : "Access your data"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "تحديث معلوماتك" : "Update your information"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "تحميل بياناتك" : "Download your data"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" ? "حذف حسابك" : "Delete your account"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white border-b border-zinc-700 pb-2">
                    {locale === "ar" ? "كيفية إدارة بياناتك" : "How to Manage Your Data"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}>
1.                      </span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" 
                          ? "انتقل إلى صفحة الملف الشخصي لتحديث معلوماتك"
                          : "Go to Profile page to update your information"
                        }
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                        2.
                      </span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" 
                          ? "استخدم نموذج التواصل لطلب حذف الحساب"
                          : "Use the contact form to request account deletion"
                        }
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className={`text-blue-400 font-medium text-sm mt-0.5 flex-shrink-0 ${locale === "ar" ? "ml-3" : "mr-3"}`}>
                        3.
                      </span>
                      <span className="text-zinc-300 text-sm">
                        {locale === "ar" 
                          ? "راسلنا للحصول على نسخة من بياناتك"
                          : "Contact us to get a copy of your data"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">
                  {locale === "ar" ? "وقت الاستجابة" : "Response Time"}
                </h4>
                <p className="text-blue-200 text-sm">
                  {locale === "ar"
                    ? "نلتزم بالرد على جميع طلبات البيانات خلال 48 ساعة، وتنفيذ طلبات الحذف خلال 7 أيام."
                    : "We commit to responding to all data requests within 48 hours and executing deletion requests within 7 days."
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* Data Retention */}
          <Card>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                {locale === "ar" ? "الاحتفاظ بالبيانات" : "Data Retention"}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-zinc-700/50 rounded-lg p-4 bg-zinc-800/30">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 bg-green-400 rounded-full ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <h4 className="font-semibold text-white text-sm">
                      {locale === "ar" ? "الحسابات النشطة" : "Active Accounts"}
                    </h4>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    {locale === "ar"
                      ? "طالما كان حسابك نشطًا"
                      : "As long as your account is active"
                    }
                  </p>
                </div>
                
                <div className="border border-zinc-700/50 rounded-lg p-4 bg-zinc-800/30">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 bg-yellow-400 rounded-full ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <h4 className="font-semibold text-white text-sm">
                      {locale === "ar" ? "الحسابات غير النشطة" : "Inactive Accounts"}
                    </h4>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    {locale === "ar"
                      ? "حذف تلقائي بعد سنتين من عدم النشاط"
                      : "Auto-deleted after 2 years of inactivity"
                    }
                  </p>
                </div>
                
                <div className="border border-zinc-700/50 rounded-lg p-4 bg-zinc-800/30">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 bg-red-400 rounded-full ${locale === "ar" ? "ml-3" : "mr-3"}`}></div>
                    <h4 className="font-semibold text-white text-sm">
                      {locale === "ar" ? "الحسابات المحذوفة" : "Deleted Accounts"}
                    </h4>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    {locale === "ar"
                      ? "حذف فوري ونهائي لجميع البيانات"
                      : "Immediate and permanent deletion of all data"
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
