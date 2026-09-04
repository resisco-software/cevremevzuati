'use client';

import { useEffect } from 'react';

/**
 * İlk yüklemedeki çapayı (örn. /#alanlar) hedefine götürür.
 *
 * Tarayıcı çapaya belge ayrıştırılırken atlıyor; vinext akış hâlinde
 * RSC gönderdiği ve yazı tipi sonradan yerine oturduğu için hedefin
 * konumu o andan sonra değişiyor, sayfa yanlış yerde kalıyordu.
 * Yerleşim durulana kadar birkaç kez yeniden hizalıyoruz.
 *
 * Kullanıcı kaydırmaya başlarsa düzeltme bırakılır; okuduğu yerden
 * zıplatmak, hiç zıplamamaktan daha kötü olur.
 */
export function HashScroll() {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;

    const id = (() => {
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    })();

    let timer = 0;
    let tries = 0;
    let stopped = false;

    function stop() {
      stopped = true;
      window.clearTimeout(timer);
    }

    function align() {
      if (stopped) return;
      const target =
        document.getElementById(id) ?? document.getElementsByName(id)[0];
      if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
      tries += 1;
      // Yazı tipi takası ve geç gelen içerik yerleşimi kaydırabiliyor.
      if (tries < 4) timer = window.setTimeout(align, 150);
    }

    // Hidratlamadan hemen sonra değil, ilk boyamadan sonra.
    timer = window.setTimeout(align, 0);

    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    for (const event of events) {
      window.addEventListener(event, stop, { passive: true, once: true });
    }

    return () => {
      stop();
      for (const event of events) window.removeEventListener(event, stop);
    };
  }, []);

  return null;
}
