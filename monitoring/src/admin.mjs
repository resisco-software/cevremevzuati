export function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
}

export function page(body) {
  return `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Çevre Mevzuatı · İzleme masası</title><style>
  :root{color-scheme:light dark;--bg:#f5f7f5;--card:#fff;--text:#172c26;--muted:#52675f;--border:#cdd9d2;--accent:#135d48}
  @media(prefers-color-scheme:dark){:root{--bg:#10201c;--card:#182c26;--text:#e7f0ec;--muted:#adbbb5;--border:#395047;--accent:#b0e1c9}}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:48px 24px}h1{font-size:clamp(28px,5vw,44px);line-height:1.15;letter-spacing:-.04em}h2{font-size:20px;line-height:1.4}p{max-width:75ch}a{color:var(--accent);overflow-wrap:anywhere}small,.muted{color:var(--muted)}article,section{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;margin:20px 0}.stats{display:flex;flex-wrap:wrap;gap:24px}.stats strong{font-size:28px;display:block}label{display:block;font-size:14px;margin-top:12px}input,select,textarea,button{font:inherit;padding:10px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);max-width:100%}input,textarea{width:100%}textarea{min-height:90px}button{cursor:pointer;background:var(--accent);color:var(--bg);font-weight:650;margin-top:16px}button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.row{display:flex;flex-wrap:wrap;gap:16px;align-items:end}.row>*{flex:1;min-width:180px}.pill{display:inline-block;border:1px solid var(--border);border-radius:20px;padding:2px 12px;font-size:13px}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 system-ui}summary{cursor:pointer;color:var(--accent)}
  </style><main><small>ÇEVRE MEVZUATI / İZLEME MASASI</small>${body}</main></html>`;
}

export const KINDS = {
  new_candidate: 'Yeni düzenleme adayı',
  amendment_candidate: 'Değişiklik adayı',
  repeal_candidate: 'Kaldırma / ilga adayı',
  source_changed: 'Kaynak metni değişti',
  scope_review: 'Çevre kapsamı incelenecek',
  carbon_review: 'Karbon kapsamı incelenecek',
  unreadable: 'Otomatik okunamayan yeni metin',
  manual_text_review: 'Metin / ek incelemesi',
  annex_review: 'Yeni ek incelemesi',
  source_error: 'Kaynak erişim sorunu',
};

export function loginPage(error = '') {
  return page(`<h1>İzleme masasına giriş</h1><p>İnceleme kuyruğu yalnızca yetkili kullanıcıya açıktır.</p>
    ${error ? `<p role="alert">${escapeHtml(error)}</p>` : ''}
    <section><form method="post" action="/login"><label for="token">Yönetici erişim anahtarı</label>
    <input id="token" name="token" type="password" required minlength="32" autocomplete="current-password">
    <button>Giriş yap</button></form></section>`);
}

export function dashboard(summary, events, enabled) {
  const cards = events
    .map((event) => {
      const details = JSON.parse(event.details);
      return `<article><span class="pill">${escapeHtml(KINDS[event.kind] ?? event.kind)}</span>
      <h2>${escapeHtml(event.title)}</h2><p><a href="${escapeHtml(event.url)}" target="_blank" rel="noopener noreferrer">Resmî kaynağı aç ↗</a></p>
      <p class="muted">Yayım tarihi: ${escapeHtml(event.publication_date ?? 'Doğrulanacak')} · Yürürlük tarihi: doğrulanacak</p>
      ${details.error ? `<p role="alert">${escapeHtml(details.error)}</p>` : ''}
      ${event.new_snapshot ? `<p><a href="/api/evidence/${escapeHtml(event.new_snapshot)}">Tespit anındaki kaynak kopyasını indir</a>${event.old_snapshot ? ` · <a href="/api/evidence/${escapeHtml(event.old_snapshot)}">Önceki kopya</a>` : ''}</p>` : ''}
      <details><summary>Ön eleme işaretleri ve kaynak alıntısı</summary><pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre></details>
      <form method="post" action="/review"><input type="hidden" name="id" value="${escapeHtml(event.id)}">
      <div class="row"><label>İnceleme kararı<select name="decision" required><option value="">Seçiniz</option><option value="approved">Çevre kapsamında; editöre ilet</option><option value="rejected">Çevre kapsamı dışında / kapat</option><option value="carbon">Karbon sitesine yönlendir</option></select></label>
      <label>İnceleyen<input name="reviewer" required maxlength="120" autocomplete="name"></label></div>
      <label>Dayanak / inceleme notu<textarea name="note" required maxlength="4000" placeholder="İlgili madde, ek, kapsam ve yürürlük dayanağı"></textarea></label>
      <button>İnceleme kararını kaydet</button></form></article>`;
    })
    .join('');
  return page(`<h1>Yeni metinler. Değişiklikler.<br>Tek inceleme kuyruğu.</h1>
    <p>${enabled ? 'Zamanlayıcı etkinleştirme ayarı açık. Son çalışma ve biriken işler aşağıda; bu, kaynakların tamamının doğrulandığı anlamına gelmez.' : 'Otomatik izleme etkin değil. Canlı bağlantı ve kaynak kabul testleri bekleniyor.'}</p>
    <p>Ön eleme hukuki yorum değildir. Karar kaydı mevzuatı sitede yayımlamaz; yayın öncesi madde, ek ve yürürlük kontrolü gerekir.</p>
    <section class="stats"><div><strong>${summary.queued}</strong>Bekleyen tarama</div><div><strong>${summary.pending.reduce((sum, row) => sum + row.count, 0)}</strong>İnceleme kaydı</div><div><strong>${summary.sourceErrors}</strong>Kaynak sorunu</div></section>
    <p class="muted">Son tamamlanan iş grubu: ${summary.lastRun?.completed_at ? escapeHtml(new Date(summary.lastRun.completed_at).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })) : 'Henüz yok'}</p>
    <p><a href="/api/export">Kararları ve bulguları indir (JSON)</a> · <a href="/admin">Yenile</a></p>
    ${cards || '<section><h2>İnceleme kuyruğu boş</h2><p>Bu, kaynaklarda değişiklik olmadığı anlamına gelmez. Bekleyen taramaları ve kaynak sorunlarını kontrol edin.</p></section>'}
    ${events.length === 100 ? '<p>En eski 100 bekleyen kayıt gösteriliyor. İnceledikçe sonraki kayıtlar açılır; tamamı dışa aktarıma dahildir.</p>' : ''}
    <form method="post" action="/logout"><button>Çıkış yap</button></form>`);
}
