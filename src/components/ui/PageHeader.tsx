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

  return (
    <header
      className={`w-full mb-12 sm:mb-14 rounded-2xl border border-zinc-600/40 bg-zinc-800/50 backdrop-blur-xl px-6 py-6 sm:px-8 sm:py-7 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white pb-3 mb-3 border-b border-zinc-600/40">
        {locale === "ar" ? title.ar : title.en}
      </h1>
      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
        {locale === "ar" ? description.ar : description.en}
      </p>
    </header>
  );
}
