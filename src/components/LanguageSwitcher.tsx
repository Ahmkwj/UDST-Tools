import { useLocale, useSetLocale } from "../context/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current path without the locale prefix
  const getPathWithoutLocale = () => {
    const path = location.pathname;
    if (path.startsWith(`/${locale}/`)) {
      return path.substring(`/${locale}/`.length);
    } else if (path === `/${locale}`) {
      return "/";
    }
    return path;
  };

  const handleLanguageChange = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    setLocale(newLocale);

    // Get current path without locale
    const pathWithoutLocale = getPathWithoutLocale();

    // Navigate to the same path but with new locale
    const newPath =
      pathWithoutLocale === "/"
        ? `/${newLocale}`
        : `/${newLocale}/${pathWithoutLocale}`;

    navigate(newPath);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
        />
      </svg>
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
