import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

/**
 * Tüm dış bağlantılar bu bileşenden geçer: yeni sekme, güvenli rel,
 * görünür ikon ve ekran okuyucu için "yeni sekmede açılır" uyarısı.
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
