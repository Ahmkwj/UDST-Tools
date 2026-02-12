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

const TOOLS: { key: string; en: string; ar: string; descEn: string; descAr: string }[] = [
  { key: "gpa", en: "GPA Calculator", ar: "حاسبة المعدل التراكمي", descEn: "Calculate GPA and track performance across semesters", descAr: "احسب المعدل وتتبع الأداء عبر الفصول" },
  { key: "grade", en: "Grade Calculator", ar: "حاسبة الدرجات", descEn: "Estimate final grades from assignment weights", descAr: "قدّر الدرجة النهائية من أوزان التقييمات" },
  { key: "attendance", en: "Attendance Calculator", ar: "حاسبة الحضور", descEn: "Track attendance and plan absences within limits", descAr: "تتبع الحضور وخطط للغياب ضمن الحدود" },
  { key: "schedule", en: "Schedule Planner", ar: "مخطط الجدول", descEn: "Plan schedule and detect time conflicts", descAr: "خطط الجدول واكتشف تعارضات المواعيد" },
  { key: "calendar", en: "Academic Calendar", ar: "التقويم الأكاديمي", descEn: "Track important academic dates", descAr: "تتبع المواعيد الأكاديمية المهمة" },
  { key: "fees", en: "Fees Manager", ar: "مدير الرسوم", descEn: "Estimate tuition and fees by program", descAr: "تقدير الرسوم الدراسية حسب البرنامج" },
  { key: "links", en: "UDST Links", ar: "روابط UDST", descEn: "Quick links to student portals and resources", descAr: "روابط سريعة للبوابات والموارد" },
  { key: "accounts", en: "User Accounts", ar: "حسابات المستخدمين", descEn: "Save progress and personalize experience", descAr: "احفظ التقدم وخصص التجربة" },
];

export default function About() {
  const locale = useLocale();

  return (
    <div className="min-h-screen w-full flex flex-col text-white">
      <div className="flex-1 py-14 sm:py-20 px-5 sm:px-8">
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
                ? "أنا أحمد، طالب في UDST. أنشأت هذه المنصة لمساعدة زملائي في تتبع المعدل والحضور وحساب الدرجات وإدارة الجدول. الأدوات مجانية ومفتوحة المصدر، وأرحب باقتراحاتكم."
                : "I'm Ahmed, a UDST student. I built this platform to help peers track GPA and attendance, calculate grades, and manage schedules. All tools are free and open source; suggestions welcome."}
            </p>
          </Card>

          <Card title={locale === "ar" ? "الأدوات المتاحة" : "Available Tools"} className={cardClass}>
            <div className="divide-y divide-zinc-600/25">
              {TOOLS.map((t) => (
                <div key={t.key} className="py-4 first:pt-0 last:pb-0">
                  <div className="font-medium text-white">
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
            <p className="text-zinc-400 text-sm border-l-2 border-amber-500/50 pl-4">
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
