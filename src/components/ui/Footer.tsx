import { useLocale } from "../../context/LanguageContext";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="relative z-10 w-full py-6 md:py-8 mt-auto">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-zinc-500 text-sm">
            {locale === "ar"
              ? "صنع بكل ❤️ بواسطة أحمد • غير مرتبط بجامعة الدوحة للعلوم والتكنولوجيا"
              : "Made with ❤️ by Ahmed • Not affiliated with UDST"}
          </p>
        </div>
      </div>
    </footer>
  );
}
