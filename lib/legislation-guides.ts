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

export function getLegislationGuide(slug: string) {
  return guides[slug];
}
