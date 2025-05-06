import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import PageHeader from "../components/ui/PageHeader";
import LocalizedLink from "../components/LocalizedLink";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <div className="flex-1 py-4 md:py-8 px-3 md:px-8 overflow-x-hidden overflow-y-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6 pt-6 sm:pt-8 pb-12 sm:pb-16">
          <PageHeader
            title={{
              en: "Page Not Found",
              ar: "الصفحة غير موجودة",
            }}
            description={{
              en: "The page you're looking for doesn't exist or has been moved",
              ar: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها",
            }}
          />

          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {/* 404 Icon */}
              <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Error Code */}
              <h2 className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-4">
                404
              </h2>

              {/* Message */}
              <p className="text-zinc-400 mb-8 max-w-md">
                {locale === "ar"
                  ? "عذرًا، لا يمكننا العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها."
                  : "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."}
              </p>

              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row gap-3">
                <LocalizedLink
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </LocalizedLink>
                <LocalizedLink
                  href="/guide"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-zinc-800/50 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all duration-200"
                >
                  {locale === "ar" ? "تصفح الدليل" : "Browse Guide"}
                </LocalizedLink>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card title={locale === "ar" ? "روابط سريعة" : "Quick Links"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <LocalizedLink
                href="/calendar"
                className="flex items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {locale === "ar"
                      ? "التقويم الأكاديمي"
                      : "Academic Calendar"}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {locale === "ar"
                      ? "عرض المواعيد المهمة"
                      : "View important dates"}
                  </p>
                </div>
              </LocalizedLink>

              <LocalizedLink
                href="/links"
                className="flex items-center p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center ltr:mr-3 rtl:ml-3 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {locale === "ar" ? "روابط مفيدة" : "Useful Links"}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {locale === "ar"
                      ? "روابط الخدمات الجامعية"
                      : "University services links"}
                  </p>
                </div>
              </LocalizedLink>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
