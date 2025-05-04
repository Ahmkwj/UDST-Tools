import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { useLocale } from "../context/LanguageContext";

interface LocalizedLinkProps extends Omit<RouterLinkProps, "to"> {
  href: string;
  locale?: string;
}

export default function LocalizedLink({
  href,
  locale: explicitLocale,
  children,
  ...props
}: LocalizedLinkProps) {
  const currentLocale = useLocale();
  const targetLocale = explicitLocale || currentLocale;

  // If href starts with "/", it's an internal link that needs localization
  // Otherwise, it's an external link
  const isInternalLink = href.startsWith("/");

  // For internal links, prepend the locale to the path
  const localizedPath = isInternalLink ? `/${targetLocale}${href}` : href;

  if (!isInternalLink) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={localizedPath} {...props}>
      {children}
    </RouterLink>
  );
}
