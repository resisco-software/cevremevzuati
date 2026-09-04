import type { AnchorHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type SafeLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

/**
 * Vinext'in üretim RSC yönlendirmesi şu anda tıklamayı kesip istemci
 * navigasyonunu başlatamıyor. Normal bağlantı davranışını koruyarak her
 * rotayı tam sayfa isteğiyle güvenilir biçimde açar.
 */
const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  ({ children, href, ...props }, ref) => (
    <a ref={ref} href={href} {...props}>
      {children}
    </a>
  ),
);

SafeLink.displayName = 'SafeLink';

export default SafeLink;
