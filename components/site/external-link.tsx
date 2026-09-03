import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

import { isOfficialSourceUrl } from '@/lib/official-url';

/**
 * Tüm dış bağlantılar bu bileşenden geçer: yeni sekme, güvenli rel,
 * görünür ikon ve ekran okuyucu için "yeni sekmede açılır" uyarısı.
 * javascript:/data: ve resmî olmayan adresler bağlantı olarak basılmaz.
 */
export function ExternalLink({
  href,
  children,
  className,
  showIcon = true,
  iconClassName = 'size-3.5',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
}) {
  if (!isOfficialSourceUrl(href)) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {showIcon && <ExternalLinkIcon className={iconClassName} aria-hidden="true" />}
      <span className="sr-only"> (yeni sekmede açılır)</span>
    </a>
  );
}
