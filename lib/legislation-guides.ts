import type { Legislation } from '@/lib/legislation-data';

export type GuideItem = {
  title: string;
  text: string;
  references: string[];
};

export type LegislationGuide = {
  purpose: {
    lead: string;
    detail: string;
    references: string[];
  };
  boundary?: {
    title: string;
    text: string;
    references: string[];
    relatedSlug?: string;
    relatedLabel?: string;
  };
  audiences: GuideItem[];
  decisions: GuideItem[];
  readingOrder: GuideItem[];
};

const guides: Record<string, LegislationGuide> = {
  skhkky: {
    purpose: {
      lead: 'Sanayi ve enerji üretim tesislerinden atmosfere çıkan is, duman, toz, gaz, buhar ve aerosollerin nasıl kontrol edileceğini belirler.',
      detail:
        'Yönetmelik yalnızca bacadaki bir ölçüm sonucuna bakmaz. İşletmenin kurulması ve işletilmesi, emisyonların sınırlandırılması, tesis etki alanındaki hava kalitesi, yakıt ve hammaddelerin depolanması ile taşınması aynı düzen içinde ele alınır.',
      references: ['Madde 1', 'Madde 2'],
    },
    boundary: {
      title: 'SKHKKY teknik şartları belirler; ÇİLY izin sürecini kurar',
      text: 'Hava emisyonu konulu çevre izninin başvuru ve sonuçlandırma süreci Çevre İzin ve Lisans Yönetmeliği ile birlikte yürür. SKHKKY ise başvuruda incelenen teknik esasları, sınır değerleri, ölçüm ve modelleme kurallarını verir. Çevre izni listelerinde bulunmayan sanayi ve enerji üretim tesisleri için de SKHKKY hükümleri ayrıca gündeme gelebilir.',
      references: ['Madde 5', 'Madde 8-10', 'Madde 19-23'],
      relatedSlug: 'cevre-izin-ve-lisans-yonetmeligi',
      relatedLabel: 'Çevre İzin ve Lisans Yönetmeliği',
    },
    audiences: [
      {
        title: 'Tesis sahibi ve işletmeci',
        text: 'Emisyon sınırlarının sağlanması, gerekli ölçümlerin yaptırılması, iki yıllık teyit raporu ve ölçüm kayıtlarının saklanması işletme tarafındaki temel takip alanlarıdır.',
        references: ['Madde 6', 'Madde 14', 'Madde 27-28'],
      },
      {
        title: 'Çevre yönetimi ve izin ekibi',
        text: 'Hava emisyonu başvuru dosyasının hangi teknik hükümlere göre incelendiğini, eksikliklerin nasıl tamamlandığını ve uygunluk kararının hangi koşullara bağlandığını gösterir.',
        references: ['Madde 8', 'Madde 9', 'Madde 10'],
      },
      {
        title: 'Proses, arıtma ve baca tasarım ekibi',
        text: 'Toz toplama, atık gaz arıtımı, baca çıkışı, baca yüksekliği ve sektöre özel teknik şartlar yatırım ve değişiklik kararlarını doğrudan etkiler.',
        references: ['Ek-1', 'Ek-4', 'Ek-5'],
      },
      {
        title: 'Emisyon ölçümünü hazırlayan kuruluş',
        text: 'Ölçülecek kaynakların, ölçüm yönteminin, sürekli ölçüm gereğinin ve rapor içeriğinin dayanağı bu metindedir.',
        references: ['Madde 23-26', 'Ek-3', 'Ek-11'],
      },
      {
        title: 'Tesis çevresindeki etkileri izleyen taraflar',
        text: 'Komşu taşınmazlara zarar, tesis etki alanındaki hava kalitesi ve yetkili merciin ek ölçüm veya tedbir istemesi bu düzenlemede karşılık bulur.',
        references: ['Madde 12', 'Madde 15', 'Madde 23'],
      },
    ],
    decisions: [
      {
        title: 'Hava emisyonu uygunluğu',
        text: 'Çevre izin dosyasındaki hava emisyonu bölümünün hangi hüküm, esas ve sınır değerlere göre inceleneceğini belirler.',
        references: ['Madde 8-10'],
      },
      {
        title: 'Baca ve alan kaynağı sınırları',
        text: 'Toz, gaz ve buhar emisyonları ile açık depolama, taşıma, kırma ve benzeri alan kaynaklarında uygulanacak genel şartları gösterir.',
        references: ['Ek-1'],
      },
      {
        title: 'Sektöre özel teknik şartlar',
        text: 'Yakma, çimento, kireç, metal, kimya ve diğer yüksek kirletici vasıflı tesisler için genel hükümlerden önce uygulanacak özel sınır ve şartları içerir.',
        references: ['Ek-5'],
      },
      {
        title: 'Ölçüm mü, modelleme mi?',
        text: 'Kütlesel debi eşikleri aşıldığında tesis etki alanında hava kalitesi ölçümü ve dağılım modeli gereğini; emisyon tespiti ve raporlama esaslarını düzenler.',
        references: ['Madde 6/d-g', 'Madde 23-24', 'Ek-2', 'Ek-3'],
      },
      {
        title: 'Baca yüksekliği ve çıkış koşulları',
        text: 'Atık gazın atmosfere veriliş biçimi ile baca yüksekliğinin belirlenmesinde kullanılacak teknik esasları içerir.',
        references: ['Ek-4'],
      },
      {
        title: 'Periyodik ve sürekli izleme',
        text: 'İki yıllık teyit raporu, sürekli ölçüm kararı, sonuçların yetkili mercie sunulması ve kayıtların saklanması konularını düzenler.',
        references: ['Madde 14', 'Madde 26', 'Madde 28'],
      },
    ],
    readingOrder: [
      {
        title: 'Önce tesisin ve kaynakların fotoğrafını çıkarın',
        text: 'Prosesleri, yakıtları, ısıl güçleri, bacaları ve baca dışı kaynakları belirleyin; metindeki tanımlarla aynı dili kurun.',
        references: ['Madde 2', 'Madde 4'],
      },
      {
        title: 'İzin bağlantısını ayırın',
        text: 'Tesisin çevre izni sürecindeki yerini ÇİLY’den; hava emisyonu uygunluk ölçütlerini SKHKKY Madde 5-10’dan okuyun.',
        references: ['Madde 5-10'],
      },
      {
        title: 'Sektöre özel bölümü önce kontrol edin',
        text: 'Tesis Ek-5’te yer alıyorsa ilgili sektör başlığındaki özel şartları belirleyin; ardından Ek-1’deki genel hükümleri tamamlayıcı olarak okuyun.',
        references: ['Ek-5', 'Ek-1'],
      },
      {
        title: 'Ölçüm ve rapor planını kurun',
        text: 'Kaynak bazında emisyon tespitini Ek-3’e, rapor içeriğini Ek-11’e, sürekli ölçüm gereğini Madde 26’ya göre kontrol edin.',
        references: ['Ek-3', 'Ek-11', 'Madde 24', 'Madde 26'],
      },
      {
        title: 'Tesis etki alanını ayrı değerlendirin',
        text: 'Ek-2 Tablo 2.1 eşiklerini, hava kalitesi ölçümünü ve dağılım modellemesini baca ölçümünden ayrı bir karar adımı olarak ele alın.',
        references: ['Madde 6/e-g', 'Madde 23', 'Ek-2'],
      },
      {
        title: 'Baca ve izleme sürekliliğini kapatın',
        text: 'Baca yüksekliği ve çıkış şartlarını Ek-4’ten; teyit, sürekli ölçüm ve kayıt düzenini Madde 14, 26 ve 28’den tamamlayın.',
        references: ['Ek-4', 'Madde 14', 'Madde 26', 'Madde 28'],
      },
    ],
  },
};

const categoryAudience: Record<string, { title: string; text: string }> = {
  kurulus: {
    title: 'Yatırım, proje ve planlama ekibi',
    text: 'Yeni yatırım, kapasite artışı, alan genişlemesi ve faaliyet değişikliği kararlarında kapsamı belirleyen eşik, liste ve süreçleri doğru sırada kontrol etmek için bu düzenlemeyi kullanır.',
  },
  izin: {
    title: 'İzin, lisans ve denetim ekibi',
    text: 'Başvuru, belge, yenileme, bildirim ve denetim adımlarının hangi hükümlere dayandığını izlemek için bu düzenlemeyi kullanır.',
  },
  hava: {
    title: 'Proses, baca ve ölçüm ekibi',
    text: 'Emisyon kaynakları, teknik önlemler, ölçüm düzeni ve raporlama başlıklarını tesisin proses bilgileriyle eşleştirmek için bu düzenlemeyi kullanır.',
  },
  su: {
    title: 'Su yönetimi ve proses ekibi',
    text: 'Su kaynağı, havza, kalite hedefi, kullanım ve izleme başlıklarını faaliyet ve konum bilgileriyle birlikte değerlendirmek için bu düzenlemeyi kullanır.',
  },
  atiksu: {
    title: 'Arıtma, altyapı ve deşarj ekibi',
    text: 'Atıksu kaynağı, bağlantı veya deşarj noktası, arıtma ihtiyacı, sınır değer ve izleme düzenini kurmak için bu düzenlemeyi kullanır.',
  },
  atik: {
    title: 'Atık yönetimi ve saha operasyonu',
    text: 'Atığın sınıflandırılması, sahada yönetimi, taşınması ve uygun işleme gönderilmesi arasındaki kayıt ve uygulama zincirini kurmak için bu düzenlemeyi kullanır.',
  },
  urun: {
    title: 'Üretim, satın alma ve ürün uyumu ekibi',
    text: 'Piyasaya arz, ithalat, ürün sınıfı, beyan, toplama ve geri kazanım başlıklarının ürüne etkisini belirlemek için bu düzenlemeyi kullanır.',
  },
  toprak: {
    title: 'Saha, bakım ve iyileştirme ekibi',
    text: 'Kirlenme şüphesi, saha incelemesi, numune, bildirim ve iyileştirme adımlarını arazi ve proses geçmişiyle eşleştirmek için bu düzenlemeyi kullanır.',
  },
  gurultu: {
    title: 'Akustik, proje ve işletme ekibi',
    text: 'Gürültü kaynağı, kullanım alanı, ölçüm veya modelleme ve kontrol tedbirlerini birlikte değerlendirmek için bu düzenlemeyi kullanır.',
  },
  kimyasal: {
    title: 'Kimyasal uyum ve proses güvenliği ekibi',
    text: 'Madde, karışım, tonaj, tehlike sınıfı ve kullanım biçimini kayıt, bildirim, kısıtlama veya güvenlik yükümlülükleriyle eşleştirmek için bu düzenlemeyi kullanır.',
  },
  deniz: {
    title: 'Kıyı tesisi ve deniz operasyonu ekibi',
    text: 'Tesis konumu, deniz faaliyeti, kabul veya boşaltım işlemi ile acil durum ve izleme gerekliliklerini birlikte kontrol etmek için bu düzenlemeyi kullanır.',
  },
  doga: {
    title: 'Yer seçimi, planlama ve saha ekibi',
    text: 'Koruma statüsü, alan sınırı, izin mercii ve yasak veya koşullu faaliyet hükümlerini yatırım kararı öncesinde kontrol etmek için bu düzenlemeyi kullanır.',
  },
  maden: {
    title: 'Maden planlama ve saha rehabilitasyonu ekibi',
    text: 'Faaliyet, atık yönetimi, depolama, kapatma ve doğaya yeniden kazandırma adımlarını işletme planıyla birlikte kurmak için bu düzenlemeyi kullanır.',
  },
  entegre: {
    title: 'Üretim, teknoloji ve dönüşüm ekibi',
    text: 'Faaliyetin bütün çevresel etkilerini, mevcut en iyi teknikleri ve izleme şartlarını tek bir yatırım ve işletme planında buluşturmak için bu düzenlemeyi kullanır.',
  },
  olcum: {
    title: 'Ölçüm, laboratuvar ve raporlama ekibi',
    text: 'Numune alma, analiz, cihaz, kalite güvencesi, veri geçerliliği ve raporlamaya ilişkin teknik başlıkları doğru kaynaktan izlemek için bu düzenlemeyi kullanır.',
  },
};

function uniqueReferences(references: Array<string | undefined>) {
  return [
    ...new Set(
      references.filter((reference): reference is string => Boolean(reference)),
    ),
  ];
}

function createDefaultGuide(item: Legislation): LegislationGuide {
  const officialReferences = item.officialReferences ?? [];
  const scopeReference =
    item.primaryAnnex ?? officialReferences[0]?.reference ?? 'Kapsam hükümleri';
  const applicationReferences = uniqueReferences([
    ...officialReferences.slice(0, 3).map((entry) => entry.reference),
    item.primaryAnnex,
  ]).slice(0, 3);
  const operationalAudience =
    item.categories
      .map((category) => categoryAudience[category])
      .find(Boolean) ??
    ({
      title: 'Uygulama ve belge hazırlayan ekip',
      text: 'Kapsam, yükümlülük, belge, süre ve istisna başlıklarını somut faaliyet bilgileriyle eşleştirmek için bu düzenlemeyi kullanır.',
    } satisfies { title: string; text: string });
  const obligationSummary = item.obligations.slice(0, 4).join(', ');
  const decisionReferences =
    applicationReferences.length > 0
      ? applicationReferences
      : ['İlgili uygulama hükümleri'];

  return {
    purpose: {
      lead: item.summary,
      detail: `${item.appliesTo} Düzenlemenin uygulamadaki ana kontrol alanları ${obligationSummary.toLocaleLowerCase('tr-TR')} başlıklarıdır; kesin yükümlülük, resmî metindeki kapsam, istisna, süre ve geçiş hükümleri birlikte okunarak belirlenir.`,
      references: ['Amaç hükmü', 'Kapsam hükmü'],
    },
    audiences: [
      {
        title: 'Tesis sahibi ve sorumlu yönetim',
        text: 'Faaliyetin kapsama girip girmediğini, hangi iş ve belgelerin yönetim sorumluluğunda olduğunu ve kararların hangi resmî hükümlere dayanacağını görmek için bu düzenlemeyi bilmelidir.',
        references: [scopeReference],
      },
      {
        title: 'Çevre yönetimi ve mevzuat uyum ekibi',
        text: `${obligationSummary} başlıklarını takip planına, sorumlu kişilere ve kanıtlayıcı kayıtlara bağlamak için bu düzenlemeyi kullanır.`,
        references: decisionReferences,
      },
      {
        title: operationalAudience.title,
        text: operationalAudience.text,
        references: [scopeReference],
      },
      {
        title: 'Denetim, ölçüm ve belge hazırlayan taraflar',
        text: 'İncelenecek kayıtların, teknik belgelerin ve uygunluk kanıtlarının hangi kapsam ve uygulama hükümlerine karşılık geldiğini görmek için bu düzenlemeyi kullanır.',
        references: decisionReferences,
      },
    ],
    decisions: [
      {
        title: 'Kapsama girer mi?',
        text: item.appliesTo,
        references: [scopeReference],
      },
      ...item.obligations.slice(0, 4).map((obligation) => ({
        title: obligation,
        text: `“${obligation}” başlığında aranacak işlem, belge, süre, eşik ve istisnalar resmî metindeki ilgili hükümlerden kontrol edilir.`,
        references: decisionReferences,
      })),
    ],
    readingOrder: [
      {
        title: 'Amaç, kapsam ve tanımlarla başlayın',
        text: 'Düzenlemenin sınırını ve kullandığı kavramları belirleyin; faaliyet adını yalnızca günlük kullanımıyla değil, resmî metindeki tanımıyla karşılaştırın.',
        references: ['Amaç', 'Kapsam', 'Tanımlar'],
      },
      {
        title: 'Kapsamı belirleyen atfı kontrol edin',
        text: `${scopeReference}. Faaliyet, kapasite, proses, ürün, konum ve istisna koşullarından ilgili olanları birlikte okuyun.`,
        references: [scopeReference],
      },
      {
        title: 'Uygulama başlıklarını faaliyetle eşleştirin',
        text: `${obligationSummary} başlıklarından hangilerinin somut faaliyetle ilişkili olduğunu belirleyin; sonucu ilgili hüküm ve ek üzerinden doğrulayın.`,
        references: decisionReferences,
      },
      {
        title: 'İstisna, süre ve geçiş hükümlerini ayırın',
        text: 'Ana yükümlülükle birlikte istisnaları, başvuru veya yenileme sürelerini, geçici maddeleri ve yürürlük hükümlerini ayrıca kontrol edin.',
        references: ['İstisnalar', 'Geçici maddeler', 'Yürürlük'],
      },
      {
        title: 'Güncel metin ve değişiklik zinciriyle kapatın',
        text: `${item.publicationLabel} tarihli ilk yayımı, sayfadaki değişiklik kayıtlarını ve varsa konsolide güncel metni birlikte kontrol edin.`,
        references: ['İlk yayım', 'Değişiklikler', 'Güncel metin'],
      },
    ],
  };
}

export function getLegislationGuide(item: Legislation) {
  return guides[item.slug] ?? createDefaultGuide(item);
}
