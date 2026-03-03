import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

interface LocalizedLinkProps extends Omit<RouterLinkProps, "to"> {
  href: string;
}

export default function LocalizedLink({
  href,
  children,
  ...props
}: LocalizedLinkProps) {
  const isInternalLink = href.startsWith("/");

  if (!isInternalLink) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}
