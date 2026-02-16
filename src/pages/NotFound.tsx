import { useLocale } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Footer from "../components/ui/Footer";
import LocalizedLink from "../components/LocalizedLink";

const cardClass =
  "!bg-zinc-800/50 !rounded-2xl !border !border-zinc-600/40 backdrop-blur-xl !px-4 !pt-4 !pb-5 sm:!px-6 sm:!pt-6 sm:!pb-7 lg:!px-8 lg:!pt-7 lg:!pb-8";

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="page-container">
      <div className="flex-1 py-8 pb-20 px-4 sm:py-14 sm:pb-14 sm:px-5 lg:py-20 lg:px-8">
        <div className="max-w-lg mx-auto space-y-8 sm:space-y-12">
          <Card className={cardClass}>
            <div className="flex flex-col items-center text-center py-6 sm:py-10">
              <h1 className="text-7xl sm:text-8xl font-bold text-blue-400 mb-4">
                404
              </h1>

              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {locale === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
              </h2>

              <p className="text-sm text-zinc-400 max-w-sm mb-8">
                {locale === "ar"
                  ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
                  : "The page you are looking for does not exist or has been moved."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <LocalizedLink
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {locale === "ar" ? "العودة للرئيسية" : "Home"}
                </LocalizedLink>
                <LocalizedLink
                  href="/guide"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border border-zinc-600/40 bg-zinc-800/50 text-zinc-300 text-sm font-medium hover:bg-zinc-700/50 hover:text-white transition-colors"
                >
                  {locale === "ar" ? "تصفح الدليل" : "Guide"}
                </LocalizedLink>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
