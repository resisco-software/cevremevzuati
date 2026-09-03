/**
 * Alan kimlik renkleri.
 * mevzuat.gov.tr'de bütün konular aynı görünür; burada her çevre alanının
 * sabit bir rengi var, böylece kullanıcı haritayı zamanla öğreniyor.
 * Her iki değer de kendi temasının zemininde en az 4.5:1 kontrast verir.
 */
export const areaColors: Record<string, { light: string; dark: string }> = {
  kurulus: { light: '#4A4FA8', dark: '#A3A8EE' },
  izin: { light: '#0F6E5A', dark: '#4FC2A5' },
  hava: { light: '#1C6E8C', dark: '#68C2E0' },
  su: { light: '#1D5AA8', dark: '#86B4EE' },
  atiksu: { light: '#0F6B70', dark: '#55C0C6' },
  atik: { light: '#8A5A0F', dark: '#DFAC58' },
  urun: { light: '#93490F', dark: '#E9A272' },
  toprak: { light: '#6E4A2C', dark: '#C79B76' },
  gurultu: { light: '#6B3FA0', dark: '#BFA0EA' },
  kimyasal: { light: '#98336B', dark: '#EE9BC6' },
  deniz: { light: '#194B87', dark: '#7FADE4' },
  doga: { light: '#2C6B2F', dark: '#84C687' },
  maden: { light: '#55605C', dark: '#AEB9B5' },
  entegre: { light: '#5B3C8C', dark: '#B29BE2' },
  olcum: { light: '#96334A', dark: '#EE9AA8' },
};

const fallback = { light: '#5C646A', dark: '#9AA3A9' };

/**
 * Alan rengini CSS değişkeni olarak verir.
 * Bileşen bunu `style` ile geçer, CSS `var(--area)` ile okur; böylece
 * 15 rengin hepsi için ayrı sınıf üretmeye gerek kalmaz.
 */
export function areaStyle(id: string) {
  const color = areaColors[id] ?? fallback;
  return {
    '--area': color.light,
    '--area-dark': color.dark,
  } as React.CSSProperties;
}
