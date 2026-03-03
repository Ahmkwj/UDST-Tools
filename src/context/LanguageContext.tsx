import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type Locale = "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Retrieve saved language from localStorage or default to 'en'
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem("locale");
    return savedLocale === "en" || savedLocale === "ar" ? savedLocale : "en";
  });

  const isRTL = locale === "ar";

  // Save to localStorage whenever locale changes
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LanguageProvider");
  }
  return context.locale;
}

export function useSetLocale() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useSetLocale must be used within a LanguageProvider");
  }
  return context.setLocale;
}

export function useIsRTL() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useIsRTL must be used within a LanguageProvider");
  }
  return context.isRTL;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
