# Çevre Mevzuatı izleme servisi

## Durum — 3 Eylül 2026

Yerel uygulama ve testler hazır; üretim izleme **etkin değil**. Cloudflare hesabı bağlı değil, üretim D1/R2 kaynakları ve erişim anahtarları oluşturulmadı. Zamanlayıcı bilerek kapalıdır. Sites yayını ve harici bildirim kanalı da etkinleştirilmedi.

Bu klasör, Sites tarafından barındırılan ön yüzden ayrı bir zamanlanmış Worker'dır. Sites manifestine desteklenmeyen cron alanları eklenmez. Ön yüzde `/izleme` yalnızca sunucu tarafından alınan özet durumunu gösterir. Dizin dosyasına otomatik yazım yoktur.

## Hazırlanan akış

- 08.00 / 18.00 Türkiye saati için tarama başlangıcı: `0 5,15 * * *` (UTC).
- Kalıcı iş kuyruğu 10 dakikada bir, en fazla 20 farklı kaynaklık gruplarla işlenir. Aynı kaynak eşzamanlı karşılaştırılmaz. Eksik işler kaybolmaz; tekrar denenir.
- Başlangıçta son üç gün taranır. Daha sonraki kesintilerde son kuyruğa alınan tarihten itibaren, her tarama başlangıcında en çok yedi günlük ek açık kapatılır. Bu tarih başarılı kontrol tarihi değildir.
- Dizindeki tüm kayıtların resmî kaynakları, varsa konsolide metinleri ve işlenmiş değişiklik bağlantıları doğrudan `lib/legislation-data.ts` üzerinden alınır. Katalog değişince Worker da yeniden yayımlanmalıdır.
- Günlük indeksin tüm mevzuat metinleri ve aynı güne ait bağlantılı mükerrer indeksler işlenir. Başlıkta çevre anahtar kelimesi bulunmaması dışlama nedeni değildir.
- Çevre alanlarına ilişkin anahtar kelimeler yalnızca inceleme sırası ve sınıflandırma işaretidir. Eşleşmeyen metinler de kapsam incelemesine girer. Karbon-only adaylar ayrı kuyruğa, karma metinler çevre incelemesine gider.
- Değişmeyen metin yeni olay oluşturmaz. İlk başarılı kopya başlangıç kaydıdır; geçmiş değişikliklerin doğrulandığını ifade etmez. HTML boşluk/biçim değişikliği tek başına metin değişikliği sayılmaz.
- D1: işler, kaynak durumları, olaylar, inceleme kararları. R2: ham kaynak kopyaları. Kaynak kopyaları SHA-256 ile ilişkilidir.
- PDF, görüntülü metin, desteklenmeyen belge/ek ve erişim hatası “değişiklik yok” sayılmaz. İnceleme/erişim sorunu kayıtları üretir. PDF metin çıkarımı/OCR bu sürümde yoktur.
- Kaynak hatası son başarılı kaynak kopyasını ve kontrol zamanını değiştirmez. Başarısız işler en çok 24 saat aralıkla yeniden denenir.
- İnceleme kararı gerekçe ve inceleyen adıyla ayrı denetim kaydı oluşturur. Onay dizini veya yürürlük bilgisini otomatik değiştirmez.

## Yerel doğrulama

Proje kökünden:

```sh
npm ci --prefix monitoring
npm test --prefix monitoring
WRANGLER_WRITE_LOGS=false npm run build --prefix monitoring
npm run test:worker --prefix monitoring
npx tsc --noEmit
npm run build
```

Test depolaması `node:sqlite` kullanır (Node 22.13+; bazı eski Node 22 sürümlerinde `--experimental-sqlite` gerekir). Üretimde D1 kullanılır. Şema `db/schema.ts` dosyasındadır; `npm run db:generate --prefix monitoring` ile yeni migration üretilir. Uygulanmış SQL/snapshot/journal dosyaları değiştirilmez.

## Üretime almadan önce — zorunlu kabul kapısı

1. Kullanıcının seçeceği Cloudflare hesabını bağla. Hesap/plan, CPU ve dış istek sınırlarını gerçek yük testiyle doğrula. Ücretli plan, hesap veya ödeme oluşturma/değiştirme için ayrıca izin al. [Resmî sınırlar](https://developers.cloudflare.com/workers/platform/limits/).
2. Hesaba ait D1 veritabanı ve özel R2 kovası oluştur; gerçek bağları izlenmeyen `wrangler.production.jsonc` dosyasına yaz. Örnek sıfır UUID ile yayın yapma. Sites'ın mevcut kaynaklarına dokunma.
3. `drizzle/*.sql` migration dosyalarını D1'e sırayla uygula. Önce staging üzerinde test et; üretimde runtime DDL çalıştırılmaz.
4. En az 32 karakterli rastgele `ADMIN_TOKEN` değerini Worker secret olarak kaydet. Anahtarı kullanıcı mesajına, Git'e veya loga yazma. Yönetici girişinin HTTPS üzerinde yetkisiz erişimi engellediğini doğrula. İnceleyen adı beyan niteliğindedir; çok kullanıcılı kimlik yönetimi bu sürümde yoktur.
5. Gerçek modern günlük indeks, birinci ve birden fazla mükerrer içeren gün, boş/yayımlanmamış tarih, resmî HTML, konsolide metin/PDF ve bağlantılı ek ile uçtan uca kabul testi yap. Bu oturumda 2 ve 3 Eylül günlük indeks ayrıştırması doğrulandı; mükerrer günlerin canlı uçları zaman aşımına uğradı. **Mükerrer kapsamının eksiksizliği henüz canlı doğrulanmadı.** Günlük sayfada mükerrer bağlantıları eksikse ek keşif kaynağı gerekir; `SOURCE_VALIDATED=true` yapılmaz.
6. Onaylı kaynak kabul testinden sonra `SOURCE_VALIDATED=true` ve `MONITOR_ENABLED=true` yap; `triggers.crons` değerini `['0 5,15 * * *', '*/10 * * * *']` olarak ayarla. [Cloudflare cron zamanları UTC'dir](https://developers.cloudflare.com/workers/configuration/cron-triggers/). Etkinleştirme isteğinin kendisi başarı kanıtı değildir; gerçek zamanlanmış olayı ve D1 kayıtlarını doğrula.
7. Worker'a yönetici anahtarından farklı, en az 32 karakterli rastgele `STATUS_TOKEN` secret ekle. Sites sunucu ortamına `MONITOR_SERVICE_URL` (doğrulanmış HTTPS Worker adresi) ve bu değeri gizli `MONITOR_STATUS_TOKEN` olarak ekle. Ön yüz bunları tarayıcıya göndermez. Durum anahtarı aday metinlere, dışa aktarıma veya inceleme kararlarına erişemez; yalnızca `/api/summary` okur. Bu özet ham kaynak metni veya karar notu içermez.
8. Sites'ın mevcut erişimi genel olduğundan, mevcut yayındaki diğer yerel değişikliklerle birlikte yayınlamadan önce açık genel yayın onayı al. Bu çalışma diğer yerel değişiklikleri commit etmedi veya yayımlamadı.
9. `/izleme` sayfasının gerçek başlangıç/iş bitiş zamanı ve kuyruk sayılarıyla çalıştığını, kesintide uyarı verdiğini doğrula. `STATUS_TOKEN` döndürülürse Sites'taki kopyasını da güncelle.
10. Harici bildirim alıcısı/kanalı kullanıcıyla belirlenince, yalnızca anlamlı yeni tespit, kalıcı arıza veya kullanıcı eylemi gerektiğinde bildirim ekle. Şimdilik bildirim kutusu `/admin` içinde; e-posta/push gönderimi yoktur. Değişiklik olmayan her çalışmada mesaj gönderilmez. Zamanlayıcının hiç çalışmamasını yakalayacak bağımsız watchdog da üretim işletimi için eklenmelidir.

## İnceleme arayüzü ve güvenlik

- `/admin`: erişim anahtarı ile giriş; HttpOnly, Secure, SameSite=Strict çerez; 1 saatlik tarayıcı oturumu.
- `/review`: karar + dayanak + inceleyen kaydı. Aynı kaynağa ait tekrar tespitler kararı sıfırlamaz.
- `/api/export`: 50 kayıtlık sayfalarla JSON; `next` takip edilerek tüm kayıtlar ve kararlar alınır.
- `/api/evidence/:id`: yalnızca yetkili indirme; HTML aktif sayfa olarak servis edilmez.
- `/health`: sadece etkinleştirme ayarı, gerçek kaynak sağlığı değildir.
- Kaynak çekimi yalnızca Resmî Gazete/Mevzuat Bilgi Sistemi alan adlarına; yönlendirmede de aynı kontrol. İstek başına 20 saniye ve 8 MB sınırı; aynı anda en fazla 3 kaynak.
- Dizin kayıtlarının `verification`, `checkedAt`, `status` ve yürürlük bilgilerine hiçbir otomatik yazım yoktur.

## Bilinen kapsam sınırları

Bu sürüm resmî RG/MBS kaynak izleyicisidir. Bakanlık genelgeleri, yerel idare kararları ve RG dışında yayımlanan idari belgeler için ayrı doğrulanmış kaynak adaptörleri henüz yoktur. Ek PDF/OCR ve çok kullanıcı kimlik yönetimi ayrı geliştirmedir. “Türkiye'deki bütün çevre mevzuatı eksiksiz ve güncel izleniyor” iddiasında bulunulmaz.
