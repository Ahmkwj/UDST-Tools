import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";
const sectionGap = "space-y-8 sm:space-y-12";

export default function Privacy() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8">
        <div className={`max-w-4xl mx-auto ${sectionGap}`}>
          <PageHeader
            title={{ en: "Privacy Policy", ar: "سياسة الخصوصية" }}
            description={{
              en: "Your privacy matters. Here is how UDST Tools handles your data.",
              ar: "خصوصيتك مهمة. إليك كيف تتعامل أدوات UDST مع بياناتك.",
            }}
          />

          <p className="text-center text-sm text-zinc-500">
            {locale === "ar" ? "آخر تحديث: فبراير 2026" : "Last updated: February 2026"}
          </p>

          <Card title={locale === "ar" ? "كيف يعمل التطبيق" : "How It Works"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "أدوات UDST تطبيق يعمل بالكامل في المتصفح. جميع الحسابات تتم على جهازك. لا يتم إرسال أي بيانات إلى أي خادم. لا حاجة لإنشاء حساب. بياناتك تبقى على جهازك فقط."
                : "UDST Tools is a fully client-side application. All calculations happen in your browser. No data is sent to any server. No account is needed. Your data stays on your device."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "ما نخزّنه" : "What We Store"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "نستخدم التخزين المحلي (localStorage) فقط لحفظ تفضيلاتك مثل اللغة وآخر الإعدادات. لا نجمع أي معلومات شخصية. لا نستخدم ملفات تعريف ارتباط تتبع."
                : "We only use localStorage to save your preferences such as language and last settings. No personal information is collected. No tracking cookies are used."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "ما لا نفعله" : "What We Don't Do"} className={cardClass}>
            <ul className="space-y-3">
              {(locale === "ar"
                ? [
                    "لا نجمع معلومات شخصية",
                    "لا نتتبعك",
                    "لا نستخدم تحليلات",
                    "لا نخزّن درجاتك أو معدلك التراكمي",
                    "لا نرسل بيانات إلى أي مكان",
                  ]
                : [
                    "We don't collect personal information",
                    "We don't track you",
                    "We don't use analytics",
                    "We don't store your grades or GPA",
                    "We don't send data anywhere",
                  ]
              ).map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card title={locale === "ar" ? "الأطراف الثالثة" : "Third Parties"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "لا نستخدم خدمات تحليلات أو إعلانات أو أي خدمات من أطراف ثالثة. الموقع مستضاف كموقع ثابت."
                : "We don't use analytics services, ads, or any third-party services. The site is hosted as a static site."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "تواصل معنا" : "Contact"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "لأي أسئلة، تواصل عبر تيليجرام "
                : "For questions, reach out on Telegram "}
              <a
                href="https://t.me/ahmkwj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                @ahmkwj
              </a>
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
