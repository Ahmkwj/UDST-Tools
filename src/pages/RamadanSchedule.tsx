import { useLocale } from "../context/LanguageContext";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";

/* Theme: match Calendar, Attendance, GPA */
const CARD = {
  base: "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl",
};
const cardClass = `${CARD.base} !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8`;
const sectionGap = "space-y-8 sm:space-y-12";

const START_TIMES: { regular: string; ramadan: string }[] = [
  { regular: "8:00 AM", ramadan: "8:00 AM" },
  { regular: "9:00 AM", ramadan: "8:45 AM" },
  { regular: "9:30 AM", ramadan: "9:05 AM" },
  { regular: "10:00 AM", ramadan: "9:30 AM" },
  { regular: "10:30 AM", ramadan: "9:50 AM" },
  { regular: "11:00 AM", ramadan: "10:15 AM" },
  { regular: "11:30 AM", ramadan: "10:35 AM" },
  { regular: "12:00 PM", ramadan: "11:00 AM" },
  { regular: "12:30 PM", ramadan: "11:20 AM" },
  { regular: "1:00 PM", ramadan: "12:00 PM" },
  { regular: "1:30 PM", ramadan: "12:20 PM" },
  { regular: "2:00 PM", ramadan: "12:45 PM" },
  { regular: "2:30 PM", ramadan: "1:05 PM" },
  { regular: "3:00 PM", ramadan: "1:30 PM" },
  { regular: "3:30 PM", ramadan: "1:50 PM" },
  { regular: "4:00 PM", ramadan: "2:15 PM" },
  { regular: "4:30 PM", ramadan: "2:35 PM" },
  { regular: "5:00 PM", ramadan: "3:00 PM" },
  { regular: "5:30 PM", ramadan: "3:20 PM" },
  { regular: "6:00 PM", ramadan: "3:45 PM" },
  { regular: "6:30 PM", ramadan: "4:05 PM" },
  { regular: "7:00 PM", ramadan: "4:30 PM" },
];

const DURATION_MAP: { regular: string; ramadan: string }[] = [
  { regular: "60 mins", ramadan: "40 mins" },
  { regular: "90 mins", ramadan: "60 mins" },
  { regular: "120 mins", ramadan: "80 mins" },
  { regular: "150 mins", ramadan: "100 mins" },
  { regular: "180 mins", ramadan: "120 mins" },
  { regular: "240 mins", ramadan: "160 mins" },
  { regular: "300 mins", ramadan: "200 mins" },
];

type TimePair = { regular: string; ramadan: string };
const DETAILED_EXAMPLES: { labelEn: string; labelAr: string; pairs: TimePair[] }[] = [
  {
    labelEn: "60 mins to 40 mins",
    labelAr: "60 دقيقة إلى 40 دقيقة",
    pairs: [
      { regular: "8:00–9:00", ramadan: "8:00–8:40" },
      { regular: "9:00–10:00", ramadan: "8:45–9:25" },
      { regular: "10:00–11:00", ramadan: "9:30–10:10" },
      { regular: "11:00–12:00", ramadan: "10:15–10:55" },
      { regular: "4:00–5:00", ramadan: "2:15–2:55" },
      { regular: "7:00–8:00", ramadan: "4:30–5:10" },
      { regular: "6:30–8:00", ramadan: "4:05–5:05" },
      { regular: "9:30–11:00", ramadan: "9:05–10:05" },
      { regular: "10:30–11:30", ramadan: "9:50–10:30" },
      { regular: "11:30–12:30", ramadan: "10:35–11:15" },
      { regular: "1:30–2:30", ramadan: "12:20–1:00" },
      { regular: "2:30–3:30", ramadan: "1:05–1:45" },
      { regular: "9:30–10:30", ramadan: "9:05–9:45" },
      { regular: "3:30–4:30", ramadan: "1:50–2:30" },
      { regular: "4:30–5:30", ramadan: "2:35–3:15" },
      { regular: "5:30–6:30", ramadan: "3:20–4:00" },
      { regular: "6:30–7:30", ramadan: "4:05–4:45" },
    ],
  },
  {
    labelEn: "90 mins to 60 mins",
    labelAr: "90 دقيقة إلى 60 دقيقة",
    pairs: [
      { regular: "8:00–9:30", ramadan: "8:00–9:00" },
      { regular: "9:00–10:30", ramadan: "8:45–9:45" },
      { regular: "10:00–11:30", ramadan: "9:30–10:30" },
      { regular: "12:00–1:30", ramadan: "11:00–12:00" },
      { regular: "10:30–12:00", ramadan: "9:50–10:50" },
      { regular: "11:30–1:00", ramadan: "10:35–11:35" },
      { regular: "11:00–12:30", ramadan: "10:15–11:15" },
      { regular: "9:00–11:00", ramadan: "8:45–10:05" },
      { regular: "1:30–3:00", ramadan: "12:20–1:20" },
      { regular: "3:00–4:30", ramadan: "1:30–2:30" },
      { regular: "4:30–6:00", ramadan: "2:35–3:35" },
      { regular: "6:00–7:30", ramadan: "3:45–4:45" },
      { regular: "1:00–2:30", ramadan: "12:00–1:00" },
      { regular: "4:00–5:30", ramadan: "2:15–3:15" },
      { regular: "5:30–7:00", ramadan: "3:20–4:20" },
      { regular: "12:00–1:00", ramadan: "11:00–11:40" },
      { regular: "3:00–4:00", ramadan: "1:30–2:10" },
    ],
  },
  {
    labelEn: "120 mins to 80 mins",
    labelAr: "120 دقيقة إلى 80 دقيقة",
    pairs: [
      { regular: "8:00–10:00", ramadan: "8:00–9:20" },
      { regular: "10:00–12:00", ramadan: "9:30–10:50" },
      { regular: "11:00–3:00", ramadan: "10:15–12:55" },
      { regular: "3:00–5:00", ramadan: "1:30–2:50" },
      { regular: "12:30–2:30", ramadan: "11:20–12:40" },
      { regular: "11:30–2:30", ramadan: "10:35–12:35" },
      { regular: "2:30–5:30", ramadan: "1:05–3:05" },
      { regular: "10:30–1:30", ramadan: "9:50–11:50" },
      { regular: "1:30–4:30", ramadan: "12:20–2:20" },
      { regular: "4:30–7:30", ramadan: "2:35–4:35" },
      { regular: "10:30–12:30", ramadan: "9:50–11:10" },
      { regular: "2:30–4:30", ramadan: "1:05–2:25" },
      { regular: "4:30–6:30", ramadan: "2:35–3:55" },
      { regular: "1:30–3:30", ramadan: "12:20–1:40" },
      { regular: "3:30–5:30", ramadan: "1:50–3:10" },
      { regular: "5:30–7:30", ramadan: "3:20–4:40" },
      { regular: "2:30–4:00", ramadan: "1:05–2:05" },
      { regular: "4:00–6:00", ramadan: "2:15–3:35" },
      { regular: "6:00–8:00", ramadan: "3:45–5:05" },
      { regular: "5:00–7:00", ramadan: "3:00–4:20" },
      { regular: "2:00–4:00", ramadan: "12:45–2:05" },
    ],
  },
  {
    labelEn: "150 mins to 100 mins",
    labelAr: "150 دقيقة إلى 100 دقيقة",
    pairs: [
      { regular: "1:00–4:00", ramadan: "12:00–2:00" },
      { regular: "4:00–7:00", ramadan: "2:15–4:15" },
      { regular: "9:00–12:00", ramadan: "8:45–10:45" },
      { regular: "9:30–12:30", ramadan: "9:05–11:05" },
      { regular: "4:30–7:00", ramadan: "2:35–4:15" },
      { regular: "12:00–4:00", ramadan: "11:00–1:40" },
      { regular: "9:30–11:30", ramadan: "9:05–10:25" },
      { regular: "12:00–2:00", ramadan: "11:00–12:20" },
      { regular: "11:30–1:30", ramadan: "10:35–11:55" },
      { regular: "5:00–8:00", ramadan: "3:00–5:00" },
    ],
  },
  {
    labelEn: "180 mins to 120 mins",
    labelAr: "180 دقيقة إلى 120 دقيقة",
    pairs: [
      { regular: "8:00–11:00", ramadan: "8:00–10:00" },
      { regular: "11:00–2:00", ramadan: "10:15–12:15" },
      { regular: "2:00–5:00", ramadan: "12:45–2:45" },
      { regular: "10:00–1:00", ramadan: "9:30–11:30" },
      { regular: "12:00–3:00", ramadan: "11:00–1:00" },
      { regular: "3:00–6:00", ramadan: "1:30–3:30" },
      { regular: "12:30–3:30", ramadan: "11:20–1:20" },
      { regular: "3:30–6:30", ramadan: "1:50–3:50" },
      { regular: "11:00–1:00", ramadan: "10:15–11:35" },
      { regular: "1:00–3:00", ramadan: "12:00–1:20" },
      { regular: "12:30–2:00", ramadan: "11:20–12:20" },
      { regular: "2:00–3:30", ramadan: "12:45–1:45" },
      { regular: "3:30–5:00", ramadan: "1:50–2:50" },
      { regular: "5:00–6:30", ramadan: "3:00–4:00" },
      { regular: "5:00–6:00", ramadan: "3:00–3:40" },
      { regular: "6:00–7:00", ramadan: "3:45–4:25" },
    ],
  },
  {
    labelEn: "240 mins to 160 mins",
    labelAr: "240 دقيقة إلى 160 دقيقة",
    pairs: [
      { regular: "8:00–12:00", ramadan: "8:00–10:40" },
      { regular: "12:30–4:30", ramadan: "11:20–2:00" },
    ],
  },
  {
    labelEn: "300 mins to 200 mins",
    labelAr: "300 دقيقة إلى 200 دقيقة",
    pairs: [],
  },
];

export default function RamadanSchedule() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8 overflow-x-hidden overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <PageHeader
            title={{
              en: "Ramadan Class Schedule",
              ar: "جدول الحصص في رمضان",
            }}
            description={{
              en: "How class start times and durations are adjusted during Ramadan (e.g. Ramadan 2026).",
              ar: "كيف يتم تعديل أوقات بداية الحصص ومدتها خلال رمضان (مثال: رمضان 2026).",
            }}
          />

          <div className={sectionGap}>
            <Card
              title={
                locale === "ar"
                  ? "تحويل وقت البداية"
                  : "Start Time Conversion"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "الجدول التالي يوضح وقت البداية في الجدول العادي وما يقابله في جدول رمضان."
                  : "Regular schedule start time and the corresponding Ramadan start time."}
              </p>
              <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 overflow-hidden">
                <div
                  className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-zinc-600/25 ${
                    locale === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {locale === "ar" ? "الجدول العادي" : "Regular Schedule"}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {locale === "ar" ? "جدول رمضان" : "Ramadan Schedule"}
                  </span>
                </div>
                {START_TIMES.map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-t border-zinc-600/25 ${
                      locale === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-sm text-white tabular-nums">
                      {row.regular}
                    </span>
                    <span className="text-sm text-zinc-400 tabular-nums">
                      {row.ramadan}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={
                locale === "ar"
                  ? "تعديل مدة الحصة"
                  : "Class Duration Adjustment"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "مدة الحصة في الجدول العادي وما يقابله في جدول رمضان."
                  : "Regular class duration and the corresponding Ramadan duration."}
              </p>
              <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 overflow-hidden">
                <div
                  className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-zinc-600/25 ${
                    locale === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {locale === "ar" ? "الجدول العادي" : "Regular Schedule"}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {locale === "ar" ? "جدول رمضان" : "Ramadan Schedule"}
                  </span>
                </div>
                {DURATION_MAP.map((row, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-t border-zinc-600/25 ${
                      locale === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-sm text-white tabular-nums">
                      {row.regular}
                    </span>
                    <span className="text-sm text-zinc-400 tabular-nums">
                      {row.ramadan}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={locale === "ar" ? "ملاحظات" : "Notes"}
              className={cardClass}
            >
              <div className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 p-4 sm:p-5 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-medium text-white">
                    {locale === "ar" ? "1. " : "1. "}
                  </span>
                  {locale === "ar"
                    ? "توقعات الحضور تبقى كما هي طوال رمضان."
                    : "Attendance expectations will remain the same throughout Ramadan."}
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-medium text-white">
                    {locale === "ar" ? "2. " : "2. "}
                  </span>
                  {locale === "ar"
                    ? "صلاة الظهر تكون يومياً من 11:40 صباحاً إلى 12:00 ظهراً. عند الحاجة قد يعدل المدرس توقيت الحصة ليتيح وقتاً للصلاة."
                    : "The Dhuhr prayer will happen every day from 11:40 AM to 12:00 PM. Where necessary, your instructor may adjust your class timing to allow for prayer time."}
                </p>
              </div>
            </Card>

            <Card
              title={
                locale === "ar"
                  ? "أمثلة مفصلة (رمضان 2026)"
                  : "Detailed Examples (Ramadan 2026)"
              }
              className={cardClass}
            >
              <p className="text-xs text-zinc-500 mb-3 sm:mb-4 leading-relaxed">
                {locale === "ar"
                  ? "أمثلة لتحويل أوقات الحصص من الجدول العادي إلى جدول رمضان حسب مدة الحصة."
                  : "Examples of regular to Ramadan time conversion by class duration."}
              </p>
              <div className="space-y-6">
                {DETAILED_EXAMPLES.filter((g) => g.pairs.length > 0).map(
                  (group, gi) => (
                    <div
                      key={gi}
                      className="rounded-xl border border-zinc-600/30 bg-zinc-800/20 overflow-hidden"
                    >
                      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-zinc-600/25">
                        <p className="text-sm font-medium text-white">
                          {locale === "ar" ? group.labelAr : group.labelEn}
                        </p>
                      </div>
                      {group.pairs.map((pair, pi) => (
                        <div
                          key={pi}
                          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-zinc-600/25 ${
                            locale === "ar" ? "sm:flex-row-reverse" : ""
                          }`}
                        >
                          <span className="text-sm text-zinc-400 tabular-nums">
                            {locale === "ar" ? "عادي: " : "Regular: "}
                            <span className="text-white">{pair.regular}</span>
                          </span>
                          <span className="text-sm tabular-nums text-zinc-300">
                            {locale === "ar" ? "رمضان: " : "Ramadan: "}
                            <span className="text-white">{pair.ramadan}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
