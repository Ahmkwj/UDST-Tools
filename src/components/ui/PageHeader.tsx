import { useLocale } from "../../context/LanguageContext";

interface PageHeaderProps {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className={`w-full text-center mb-8 md:mb-12 ${isRTL ? "rtl" : "ltr"}`}>
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-4">
    {locale === "ar" ? title.ar : title.en}
      </h1>
      <div className="h-1 w-16 md:w-24 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 mb-4"></div>
      <p className="text-lg text-zinc-300 max-w-2xl mx-auto px-4">
        {locale === "ar" ? description.ar : description.en}
      </p>
    </div>
  );
} 