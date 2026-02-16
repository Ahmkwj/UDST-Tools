import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import { useLocale } from "../context/LanguageContext";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";
const sectionGap = "space-y-8 sm:space-y-12";

const TOOLS: { key: string; en: string; ar: string; descEn: string; descAr: string }[] = [
  { key: "gpa", en: "GPA Calculator", ar: "حاسبة المعدل التراكمي", descEn: "Calculate GPA and track performance across semesters", descAr: "احسب المعدل وتتبع الأداء عبر الفصول" },
  { key: "grade", en: "Grade Calculator", ar: "حاسبة الدرجات", descEn: "Estimate final grades from assignment weights", descAr: "قدّر الدرجة النهائية من أوزان التقييمات" },
  { key: "attendance", en: "Attendance Calculator", ar: "حاسبة الحضور", descEn: "Track attendance and plan absences within limits", descAr: "تتبع الحضور وخطط للغياب ضمن الحدود" },
  { key: "schedule", en: "Schedule Planner", ar: "مخطط الجدول", descEn: "Plan schedule and detect time conflicts", descAr: "خطط الجدول واكتشف تعارضات المواعيد" },
  { key: "ramadan", en: "Ramadan Schedule", ar: "جدول رمضان", descEn: "Convert class times to Ramadan hours and save as image", descAr: "حوّل أوقات الحصص إلى توقيت رمضان واحفظها كصورة" },
  { key: "calendar", en: "Academic Calendar", ar: "التقويم الأكاديمي", descEn: "Track important academic dates", descAr: "تتبع المواعيد الأكاديمية المهمة" },
  { key: "fees", en: "Fees Manager", ar: "مدير الرسوم", descEn: "Estimate tuition and fees by program", descAr: "تقدير الرسوم الدراسية حسب البرنامج" },
  { key: "links", en: "UDST Links", ar: "روابط UDST", descEn: "Quick links to student portals and resources", descAr: "روابط سريعة للبوابات والموارد" },
];

export default function About() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8">
        <div className={`max-w-4xl mx-auto ${sectionGap}`}>
          <PageHeader
            title={{ en: "UDST Tools", ar: "أدوات UDST" }}
            description={{
              en: "Tools to manage your academic journey",
              ar: "أدوات لإدارة رحلتك الأكاديمية",
            }}
          />

          <Card title={locale === "ar" ? "رسالة المطور" : "Developer's Message"} className={cardClass}>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {locale === "ar"
                ? "أنا أحمد، طالب في جامعة الدوحة للعلوم والتكنولوجيا. أنشأت أدوات UDST لمساعدة زملائي الطلاب في إدارة شؤونهم الأكاديمية بسهولة أكبر -- من حساب المعدل التراكمي إلى تخطيط الجداول ومتابعة الحضور. كل شيء يعمل في متصفحك بدون الحاجة لإنشاء حساب. المشروع مجاني ومفتوح المصدر، ولا تغادر بياناتك جهازك أبدًا."
                : "I'm Ahmed, a student at the University of Doha for Science and Technology. I built UDST Tools to help fellow students manage their academics more easily -- from calculating GPA to planning schedules and tracking attendance. Everything runs in your browser with no account required. It's free, open-source, and your data never leaves your device."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "الأدوات المتاحة" : "Available Tools"} className={cardClass}>
            <div className="divide-y divide-zinc-600/25">
              {TOOLS.map((t) => (
                <div key={t.key} className="py-4 first:pt-0 last:pb-0">
                  <div className="font-medium text-blue-400">
                    {locale === "ar" ? t.ar : t.en}
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    {locale === "ar" ? t.descAr : t.descEn}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card title={locale === "ar" ? "ملاحظة مهمة" : "Important Note"} className={cardClass}>
            <p className="text-zinc-400 text-sm border-s-2 border-amber-500/50 ps-4">
              {locale === "ar"
                ? "هذه المنصة غير مرتبطة أو معتمدة من جامعة الدوحة للعلوم والتكنولوجيا (UDST). مشروع طلابي مستقل."
                : "This platform is not affiliated with or endorsed by UDST. It is an independent student project."}
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
