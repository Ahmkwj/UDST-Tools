import { useLocale } from "../../context/LanguageContext";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="relative z-10 w-full py-6 md:py-8 mt-auto bg-gradient-to-b from-transparent to-zinc-900/50">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">UT</span>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-zinc-400 text-sm">
              {locale === "ar"
                ? "صًنع بكل ❤️ بواسطة أحمد"
                : "Made with ❤️ by Ahmed"}
            </p>
            <a
              href="https://t.me/ahmkwj"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-blue-400 transition-colors ${
                locale === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="flex-shrink-0"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
              </svg>
              <span>{locale === "ar" ? "تواصل معي" : "Contact me"}</span>
            </a>
            <p className="text-zinc-600 text-xs">
              {locale === "ar"
                ? "مشروع مستقل، غير مرتبط بجامعة الدوحة للعلوم والتكنولوجيا"
                : "An independent project, not affiliated with UDST"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
