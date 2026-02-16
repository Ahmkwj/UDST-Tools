import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
  padding: "!px-6 !pt-6 !pb-7 sm:!px-8 sm:!pt-7 sm:!pb-8",
};
const cardClass = `${CARD.base} ${CARD.padding}`;
const sectionGap = "space-y-12";

export default function Privacy() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8">
        <div className={`max-w-4xl mx-auto ${sectionGap}`}>
          <PageHeader
            title={{ en: "Privacy Policy", ar: "سياسة الخصوصية" }}
            description={{
              en: "How we protect and handle your data on UDST Tools",
              ar: "كيف نحمي ونتعامل مع بياناتك في أدوات UDST",
            }}
          />

          <p className="text-center text-sm text-zinc-500">
            {locale === "ar" ? "آخر تحديث: يوليو 2025" : "Last updated: July 2025"}
          </p>

          <Card title={locale === "ar" ? "مقدمة" : "Introduction"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "أدوات UDST منصة مجانية ومفتوحة المصدر لطلاب الجامعة. نلتزم بحماية خصوصيتك والشفافية في التعامل مع بياناتك. هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك."
                : "UDST Tools is a free, open-source platform for university students. We protect your privacy and are transparent about your data. This policy explains how we collect, use, and protect your information."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "المعلومات التي نجمعها" : "Information We Collect"} className={cardClass}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "معلومات الحساب" : "Account Information"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "البريد الإلكتروني: لإنشاء الحساب وتسجيل الدخول" : "Email: for account creation and login"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "الاسم الكامل: لتخصيص التجربة وعرض الطلبات" : "Full name: to personalize experience and display in requests"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "كلمة المرور: مشفرة ومعززة أمنيًا" : "Password: encrypted and secured"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "المعلومات الأكاديمية (اختيارية)" : "Academic Information (Optional)"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "المعدل التراكمي والساعات المعتمدة" : "Current GPA and credit hours"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "عدد المواد المسجل بها" : "Number of enrolled courses"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "رقم الطالب (لطلبات تبديل المواد فقط)" : "Student ID (course swap requests only)"}</p>
                </div>
                <p className="text-xs text-zinc-500 pt-2 border-t border-zinc-600/40 mt-2">
                  {locale === "ar" ? "اختياري بالكامل؛ لتحسين دقة الحسابات فقط." : "Fully optional; used only to improve calculation accuracy."}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "بيانات الاستخدام" : "Usage Data"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "الأدوات المستخدمة ومعدل الاستخدام (بدون تفاصيل شخصية)" : "Tools used and frequency (no personal details)"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "أوقات تسجيل الدخول والجلسات" : "Login times and sessions"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تقارير الأخطاء (لحل المشاكل)" : "Error reports (for troubleshooting)"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title={locale === "ar" ? "كيف نستخدم معلوماتك" : "How We Use Your Information"} className={cardClass}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "الوظائف الأساسية" : "Core Functions"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "إدارة الحساب وتسجيل الدخول" : "Account management and authentication"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "حفظ التفضيلات والإعدادات" : "Saving preferences and settings"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تخصيص واجهة المستخدم" : "Personalizing the user interface"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "تحسين الأدوات" : "Tool Enhancement"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "حسابات المعدل المخصصة" : "Personalized GPA calculations"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "توقعات الدرجات والأداء" : "Grade and performance predictions"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تتبع التقدم الأكاديمي" : "Academic progress tracking"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "ما لا نفعله أبدًا" : "What We Never Do"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "بيع أو مشاركة بياناتك مع أطراف ثالثة" : "Sell or share your data with third parties"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "إرسال رسائل تسويقية أو إعلانات" : "Send marketing emails or ads"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "مشاركة معلوماتك مع الجامعة أو الإدارة" : "Share your information with university or administration"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تتبع موقعك أو أنشطتك خارج المنصة" : "Track your location or activity outside the platform"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title={locale === "ar" ? "أمان وحماية البيانات" : "Data Security & Protection"} className={cardClass}>
            <div className="divide-y divide-zinc-600/25 space-y-0">
              <div className="py-4 first:pt-0">
                <div className="font-medium text-white text-sm mb-1">{locale === "ar" ? "التشفير المتقدم" : "Advanced Encryption"}</div>
                <p className="text-zinc-400 text-sm">
                  {locale === "ar" ? "البيانات مشفرة بـ AES-256 و HTTPS. كلمات المرور محمية بـ bcrypt." : "Data encrypted with AES-256 and HTTPS. Passwords protected with bcrypt."}
                </p>
              </div>
              <div className="py-4">
                <div className="font-medium text-white text-sm mb-1">{locale === "ar" ? "النسخ الاحتياطي الآمن" : "Secure Backups"}</div>
                <p className="text-zinc-400 text-sm">
                  {locale === "ar" ? "نسخ احتياطية منتظمة ومشفرة مع إمكانية الاسترداد السريع." : "Regular encrypted backups with quick recovery."}
                </p>
              </div>
              <div className="py-4 last:pb-0">
                <div className="font-medium text-white text-sm mb-1">{locale === "ar" ? "المراقبة الأمنية" : "Security Monitoring"}</div>
                <p className="text-zinc-400 text-sm">
                  {locale === "ar" ? "مراقبة الأنشطة المشبوهة والحماية من الاختراق والوصول غير المصرح به." : "Monitoring for suspicious activity and protection against unauthorized access."}
                </p>
              </div>
            </div>
          </Card>

          <Card title={locale === "ar" ? "حقوقك والتحكم في بياناتك" : "Your Rights & Data Control"} className={cardClass}>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "حقوقك" : "Your Rights"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "الوصول إلى بياناتك" : "Access your data"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تحديث معلوماتك" : "Update your information"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "تحميل بياناتك" : "Download your data"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "حذف حسابك" : "Delete your account"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-zinc-600/40 pb-2 mb-3">
                  {locale === "ar" ? "كيفية إدارة بياناتك" : "How to Manage Your Data"}
                </h3>
                <div className="divide-y divide-zinc-600/25 space-y-0">
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "الملف الشخصي: لتحديث معلوماتك" : "Profile page: to update your information"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "نموذج التواصل: لطلب حذف الحساب" : "Contact form: to request account deletion"}</p>
                  <p className="py-2 text-zinc-400 text-sm">{locale === "ar" ? "راسلنا للحصول على نسخة من بياناتك" : "Contact us for a copy of your data"}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm border-l-2 border-blue-500/50 pl-4">
                {locale === "ar" ? "الرد على طلبات البيانات خلال 48 ساعة؛ تنفيذ الحذف خلال 7 أيام." : "We respond to data requests within 48 hours; deletion within 7 days."}
              </p>
            </div>
          </Card>

          <Card title={locale === "ar" ? "الاحتفاظ بالبيانات" : "Data Retention"} className={cardClass}>
            <div className="divide-y divide-zinc-600/25 space-y-0">
              <div className="py-4 first:pt-0">
                <div className="font-medium text-white text-sm">{locale === "ar" ? "الحسابات النشطة" : "Active Accounts"}</div>
                <p className="text-zinc-400 text-sm mt-0.5">{locale === "ar" ? "طالما كان حسابك نشطًا" : "As long as your account is active"}</p>
              </div>
              <div className="py-4">
                <div className="font-medium text-white text-sm">{locale === "ar" ? "الحسابات غير النشطة" : "Inactive Accounts"}</div>
                <p className="text-zinc-400 text-sm mt-0.5">{locale === "ar" ? "حذف تلقائي بعد سنتين من عدم النشاط" : "Auto-deleted after 2 years of inactivity"}</p>
              </div>
              <div className="py-4 last:pb-0">
                <div className="font-medium text-white text-sm">{locale === "ar" ? "الحسابات المحذوفة" : "Deleted Accounts"}</div>
                <p className="text-zinc-400 text-sm mt-0.5">{locale === "ar" ? "حذف فوري ونهائي لجميع البيانات" : "Immediate and permanent deletion of all data"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
