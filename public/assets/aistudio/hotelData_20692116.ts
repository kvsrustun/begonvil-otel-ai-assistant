export interface GuideSection {
  id: number;
  title: string;
  category: string;
  content: string;
  keywords: string[];
}

export interface RoomData {
  oda_tipi: string;
  kapasite: number;
  metrekare: number;
  manzara: string;
  gecelik_fiyat_tl: number;
  evcil_hayvan: boolean;
  oda_sayisi: number;
  description?: string;
  features?: string[];
}

export interface TestQuestion {
  id: number;
  soru: string;
  beklenen_cevap: string;
  kaynak: string;
  category: 'rag' | 'table' | 'table_calc' | 'out_of_scope';
  explanation: string;
}

export const HOTEL_INFO = {
  name: "Begonvil Otel",
  subTitle: "Ege Kıyısında Butik Tatil Deneyimi",
  location: "Ege Kıyısı, Türkiye",
  year: 2026,
  roomCount: 64,
  distanceToBeach: "200 m (Her 30 dk ücretsiz shuttle)",
  distanceToHospital: "8 km",
  distanceToAirport: "Yaklaşık 45 dakika",
  summary: "Begonvil Otel, Ege kıyısında 64 odalı bir butik oteldir. Ege mutfağı, ısıtmalı kapalı havuz ve doğayla iç içe huzurlu konaklama sunar."
};

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 1,
    title: "1. Giriş ve çıkış",
    category: "Giriş / Çıkış",
    content: "Odaya giriş saati 14:00, çıkış saati 12:00'dir. Müsaitlik olursa 10:00'dan itibaren erken giriş 1.000 TL karşılığında yapılabilir. Geç çıkış 16:00'ya kadar 1.000 TL, 18:00'e kadar gecelik oda ücretinin yarısıdır. Girişte tüm misafirlerin kimlik ya da pasaport göstermesi zorunludur.",
    keywords: ["giriş", "çıkış", "check-in", "check-out", "erken giriş", "geç çıkış", "saat", "14:00", "12:00", "1.000 TL", "kimlik", "pasaport"]
  },
  {
    id: 2,
    title: "2. Rezervasyon ve iptal",
    category: "Rezervasyon",
    content: "Konaklamadan 7 gün öncesine kadar yapılan iptaller ücretsizdir. 7 günden az kala yapılan iptallerde ilk gecenin ücreti alınır. Haber vermeden gelinmezse konaklamanın tamamı ücretlendirilir. Konaklamadan en az 60 gün önce yapılan erken rezervasyonlarda yüzde 15 indirim uygulanır; erken rezervasyon ücreti iade edilmez.",
    keywords: ["rezervasyon", "iptal", "iade", "erken rezervasyon", "indirim", "%15", "7 gün", "ilk gece", "haber vermeden", "no-show"]
  },
  {
    id: 3,
    title: "3. Ödeme",
    category: "Finans & Ödeme",
    content: "Kredi kartı, nakit (Türk lirası ve euro) ve havale ile ödeme kabul edilir. Girişte depozito alınmaz. Minibar, restoran ve spa harcamaları çıkışta tek faturada ödenir.",
    keywords: ["ödeme", "kredi kartı", "nakit", "euro", "havale", "depozito", "minibar", "fatura", "harcama"]
  },
  {
    id: 4,
    title: "4. Yeme içme",
    category: "Restoran & Kahvaltı",
    content: "Açık büfe kahvaltı 07:30-10:30 saatleri arasında verilir ve tüm oda fiyatlarına dahildir. Öğle yemeği 12:30-16:00, akşam yemeği 19:00-22:00 saatleri arasında alakart servis edilir. Lavanta Restoran için en az bir gün önceden rezervasyon gerekir. Vegan ve glutensiz seçenekler her öğünde vardır. Oda servisi 24 saat açıktır ve yüzde 10 servis ücreti eklenir.",
    keywords: ["kahvaltı", "yeme", "içme", "açık büfe", "öğle yemeği", "akşam yemeği", "lavanta restoran", "alakart", "vegan", "glutensiz", "oda servisi", "07:30", "10:30"]
  },
  {
    id: 5,
    title: "5. Havuz ve plaj",
    category: "Havuz & Plaj",
    content: "Açık havuz Mayıs-Ekim döneminde 08:00-19:00, ısıtmalı kapalı havuz yıl boyunca 09:00-21:00 saatleri arasında açıktır. Şezlong ve havlu ücretsizdir. Otelin plajı 200 metre uzaklıktadır ve her 30 dakikada bir ücretsiz servis vardır. Havuz alanında cam bardak kullanılmaz. 12 yaşından küçük çocuklar havuzda yetişkin gözetiminde olmalıdır.",
    keywords: ["havuz", "kapalı havuz", "açık havuz", "ısıtmalı havuz", "kışın", "yıl boyunca", "plaj", "deniz", "şezlong", "havlu", "servis", "shuttle", "çocuk"]
  },
  {
    id: 6,
    title: "6. Spa",
    category: "Sağlık & Güzellik",
    content: "Spa 10:00-21:00 saatleri arasında açıktır. Hamam ve sauna 16 yaşından büyük misafirler için ücretsizdir. Masajlar ücretlidir; 50 dakikalık klasik masaj 2.200 TL, 80 dakikalık aromaterapi masajı 3.100 TL'dir. Masaj rezervasyonu resepsiyondan yapılır.",
    keywords: ["spa", "hamam", "sauna", "masaj", "fiyat", "klasik masaj", "aromaterapi", "2.200 TL", "3.100 TL", "rezervasyon", "saat"]
  },
  {
    id: 7,
    title: "7. Çocuk kulübü",
    category: "Aile & Çocuk",
    content: "Mini kulüp 4-12 yaş arası çocuklar için her gün 10:00-17:00 saatleri arasında ücretsizdir. Mini disko her akşam 20:30'da başlar. Bebek yatağı ve mama sandalyesi ücretsiz verilir; rezervasyon sırasında belirtilmelidir.",
    keywords: ["çocuk", "mini kulüp", "mini disko", "bebek yatağı", "mama sandalyesi", "ücretsiz", "disko", "aktivite"]
  },
  {
    id: 8,
    title: "8. Havalimanı transferi",
    category: "Ulaşım",
    content: "Havalimanı ile otel arası yolculuk yaklaşık 45 dakikadır. Tek yön transfer 1-4 kişilik araç için 1.800 TL, VIP araç için 3.000 TL'dir. Transfer talebi gelişten en az 48 saat önce yapılmalıdır.",
    keywords: ["havalimanı", "transfer", "ulaşım", "vip", "tek yön", "1.800 TL", "3.000 TL", "45 dakika", "48 saat"]
  },
  {
    id: 9,
    title: "9. Evcil hayvan",
    category: "Evcil Hayvan",
    content: "Ağırlığı 10 kilogramın altındaki kedi ve köpekler kabul edilir. Evcil hayvan için gecelik 600 TL temizlik ücreti alınır. Evcil hayvanlı misafirler yalnızca bahçe katındaki odalarda konaklayabilir. Hayvanlar ortak alanlarda tasmalı olmalıdır; havuz ve restoran alanlarına giremez.",
    keywords: ["evcil hayvan", "kedi", "köpek", "10 kg", "600 TL", "bahçe katı", "tasma", "hayvan"]
  },
  {
    id: 10,
    title: "10. Otopark ve şarj",
    category: "Araç & Şarj",
    content: "Açık otopark misafirler için ücretsizdir. Otoparkta iki elektrikli araç şarj istasyonu bulunur; şarj ücreti kilovatsaat başına 12 TL'dir.",
    keywords: ["otopark", "şarj", "elektrikli araç", "ev", "kilovatsaat", "kwh", "12 TL", "ücretsiz otopark"]
  },
  {
    id: 11,
    title: "11. İnternet ve iş merkezi",
    category: "İnternet & Ofis",
    content: "Tüm otelde Wi-Fi ücretsizdir; şifre oda kartı kılıfında yazılıdır. İş merkezi 7 gün 24 saat açıktır; yazıcıdan ilk 20 sayfa ücretsizdir.",
    keywords: ["wifi", "wi-fi", "internet", "şifre", "iş merkezi", "yazıcı", "baskı", "çıktı"]
  },
  {
    id: 12,
    title: "12. Sigara",
    category: "Kurallar",
    content: "Odalarda, balkonlarda ve kapalı alanlarda sigara içmek yasaktır. Bu kurala uyulmazsa 5.000 TL özel temizlik ücreti alınır. Sigara içme alanları bahçede işaretlenmiştir.",
    keywords: ["sigara", "balkon", "oda", "yasak", "5.000 TL", "temizlik ücreti", "duman"]
  },
  {
    id: 13,
    title: "13. Emanet ve kayıp eşya",
    category: "Güvenlik & Hizmet",
    content: "Her odada ücretsiz kasa bulunur; değerli eşyalar resepsiyon kasasına da bırakılabilir. Kayıp eşyalar 6 ay saklanır; misafire kargoyla gönderilmesi istenirse kargo ücreti alıcıya aittir.",
    keywords: ["kasa", "emanet", "kayıp eşya", "değerli eşya", "6 ay", "kargo"]
  },
  {
    id: 14,
    title: "14. Sağlık",
    category: "Sağlık & İlk Yardım",
    content: "Otel doktoru her gün 09:00-17:00 saatleri arasında revirdedir; bu saatler dışında resepsiyon yardımcı olur. En yakın hastane otele 8 kilometre uzaklıktadır.",
    keywords: ["doktor", "revir", "sağlık", "hastane", "ilaç", "acil", "8 kilometre", "09:00-17:00"]
  },
  {
    id: 15,
    title: "15. Etkinlikler",
    category: "Eğlence & Etkinlik",
    content: "Haftalık etkinlik programı resepsiyonda ve odalarda bulunur. Her çarşamba akşamı Ege mutfağı akşamı, her cuma akşamı bahçede canlı müzik vardır.",
    keywords: ["etkinlik", "canlı müzik", "çarşamba", "cuma", "ege mutfağı", "program", "müzik"]
  }
];

export const ROOMS_DATA: RoomData[] = [
  {
    oda_tipi: "Standart Bahçe Odası",
    kapasite: 2,
    metrekare: 24,
    manzara: "bahçe",
    gecelik_fiyat_tl: 4200,
    evcil_hayvan: true,
    oda_sayisi: 14,
    description: "Huzurlu begonviller ve zeytin ağaçlarına bakan ferah bahçe odası. Evcil hayvan dostu.",
    features: ["Çift kişilik yatak", "Bahçe manzaralı balkon", "Duşakabin banyo", "Evcil hayvan kabul edilir"]
  },
  {
    oda_tipi: "Standart Deniz Odası",
    kapasite: 2,
    metrekare: 24,
    manzara: "deniz",
    gecelik_fiyat_tl: 5200,
    evcil_hayvan: false,
    oda_sayisi: 18,
    description: "Ege'nin turkuaz sularına nazır, konforlu standart deniz manzaralı oda.",
    features: ["Deniz manzaralı balkon", "King yatak seçeneği", "Mini bar & kahve seti"]
  },
  {
    oda_tipi: "Superior Deniz Odası",
    kapasite: 3,
    metrekare: 32,
    manzara: "deniz",
    gecelik_fiyat_tl: 6400,
    evcil_hayvan: false,
    oda_sayisi: 12,
    description: "Geniş oturma alanı ve panoramik deniz manzarasına sahip 3 kişilik üst segment oda.",
    features: ["3 kişilik kapasite", "Geniş balkon", "Koltuk yatak", "Panoramik deniz manzarası"]
  },
  {
    oda_tipi: "Aile Odası",
    kapasite: 4,
    metrekare: 40,
    manzara: "bahçe",
    gecelik_fiyat_tl: 7400,
    evcil_hayvan: false,
    oda_sayisi: 8,
    description: "Aileler için ideal, 40 m² genişlikte bahçe manzaralı ferah yaşam alanı.",
    features: ["4 kişilik kapasite", "40 m² alan", "2 ayrı oda bölmesi", "Bahçe manzarası"]
  },
  {
    oda_tipi: "Bahçe Katı Suit",
    kapasite: 3,
    metrekare: 48,
    manzara: "bahçe",
    gecelik_fiyat_tl: 8900,
    evcil_hayvan: true,
    oda_sayisi: 4,
    description: "Özel bahçe verandası, geniş salonu ve evcil hayvan dostu mimarisiyle lüks suit.",
    features: ["Evcil hayvan kabul edilir", "Özel veranda", "48 m² alan", "Jakuzi & oturma grubu"]
  },
  {
    oda_tipi: "Deniz Manzaralı Suit",
    kapasite: 3,
    metrekare: 55,
    manzara: "deniz",
    gecelik_fiyat_tl: 11500,
    evcil_hayvan: false,
    oda_sayisi: 4,
    description: "55 m² büyüklükte, gün batımını doğrudan gören lüks süit deneyimi.",
    features: ["55 m² lüks alan", "Kesintisiz deniz manzarası", "Özel şezlonglu teras", "Ayrı oturma odası"]
  },
  {
    oda_tipi: "Erişilebilir Oda",
    kapasite: 2,
    metrekare: 30,
    manzara: "bahçe",
    gecelik_fiyat_tl: 4200,
    evcil_hayvan: false,
    oda_sayisi: 3,
    description: "Engelsiz erişim için özel olarak tasarlanmış, geniş kapılı ve donanımlı bahçe odası.",
    features: ["Tekerlekli sandalye uyumlu", "Özel banyo tutacakları", "Geniş koridor", "Zemin kat erişimi"]
  },
  {
    oda_tipi: "Kral Dairesi",
    kapasite: 4,
    metrekare: 95,
    manzara: "deniz",
    gecelik_fiyat_tl: 24000,
    evcil_hayvan: false,
    oda_sayisi: 1,
    description: "95 m² panoramik Ege manzarası, özel jakuzi ve geniş salonuyla otelin en ayrıcalıklı dairesi.",
    features: ["95 m² genişlik", "4 kişilik kapasite", "Özel jakuzi & şömine", "Geniş panoramik teras"]
  }
];

export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    soru: "Odaya kaçta girebilirim?",
    beklenen_cevap: "14:00; müsaitse 10:00'dan itibaren 1.000 TL ile erken giriş.",
    kaynak: "Giriş ve çıkış",
    category: "rag",
    explanation: "Rehber Bölüm 1'de giriş saatinin 14:00 olduğu, müsaitlik durumunda 10:00'dan itibaren 1.000 TL karşılığı erken giriş yapılabileceği belirtilmiştir."
  },
  {
    id: 2,
    soru: "Rezervasyonumu 3 gün kala iptal edersem ne öderim?",
    beklenen_cevap: "İlk gecenin ücreti.",
    kaynak: "Rezervasyon ve iptal",
    category: "rag",
    explanation: "Rehber Bölüm 2'ye göre 7 günden az kala yapılan iptallerde ilk gecenin ücreti alınır."
  },
  {
    id: 3,
    soru: "Kahvaltı saat kaça kadar?",
    beklenen_cevap: "10:30'a kadar (07:30-10:30).",
    kaynak: "Yeme içme",
    category: "rag",
    explanation: "Rehber Bölüm 4'e göre açık büfe kahvaltı 07:30-10:30 saatleri arasındadır ve fiyata dahildir."
  },
  {
    id: 4,
    soru: "Kapalı havuz kışın açık mı?",
    beklenen_cevap: "Evet, yıl boyunca 09:00-21:00.",
    kaynak: "Havuz ve plaj",
    category: "rag",
    explanation: "Rehber Bölüm 5'e göre ısıtmalı kapalı havuz yıl boyunca (kış dahil) 09:00-21:00 saatleri arasında açıktır."
  },
  {
    id: 5,
    soru: "Masaj fiyatları ne kadar?",
    beklenen_cevap: "50 dk klasik 2.200 TL, 80 dk aromaterapi 3.100 TL.",
    kaynak: "Spa",
    category: "rag",
    explanation: "Rehber Bölüm 6'da 50 dakikalık klasik masaj 2.200 TL, 80 dakikalık aromaterapi masajı 3.100 TL olarak listelenmiştir."
  },
  {
    id: 6,
    soru: "Kedimi getirebilir miyim?",
    beklenen_cevap: "10 kg altı ise evet; gecelik 600 TL, yalnızca bahçe katı odalar.",
    kaynak: "Evcil hayvan",
    category: "rag",
    explanation: "Rehber Bölüm 9'a göre ağırlığı 10 kg altındaki evcil hayvanlar kabul edilir, gecelik 600 TL ve sadece bahçe katı odalarda kalınabilir."
  },
  {
    id: 7,
    soru: "Havalimanından alıyor musunuz?",
    beklenen_cevap: "Evet; tek yön 1.800 TL (VIP 3.000 TL), 48 saat önceden talep.",
    kaynak: "Havalimanı transferi",
    category: "rag",
    explanation: "Rehber Bölüm 8'e göre havalimanı transferi mevcuttur; 1-4 kişilik araç 1.800 TL, VIP 3.000 TL olup en az 48 saat önce talep edilmelidir."
  },
  {
    id: 8,
    soru: "Balkonda sigara içebilir miyim?",
    beklenen_cevap: "Hayır; ihlalde 5.000 TL temizlik ücreti.",
    kaynak: "Sigara",
    category: "rag",
    explanation: "Rehber Bölüm 12'ye göre odalarda, balkonlarda ve kapalı alanlarda sigara içmek yasaktır. Kural ihlalinde 5.000 TL özel temizlik ücreti alınır."
  },
  {
    id: 9,
    soru: "Elektrikli aracımı şarj edebilir miyim?",
    beklenen_cevap: "Evet; iki istasyon, kWh başına 12 TL.",
    kaynak: "Otopark ve şarj",
    category: "rag",
    explanation: "Rehber Bölüm 10'da iki elektrikli araç şarj istasyonu bulunduğu ve kWh başına 12 TL ücretlendirildiği belirtilmiştir."
  },
  {
    id: 10,
    soru: "Aile Odası kaç kişilik ve gecesi ne kadar?",
    beklenen_cevap: "4 kişilik, 40 m2, bahçe manzaralı, gecelik 7.400 TL.",
    kaynak: "tablo: odalar.csv",
    category: "table",
    explanation: "odalar.csv tablosundan: Aile Odası 4 kişilik, 40 m², bahçe manzaralı ve gecelik 7.400 TL'dir."
  },
  {
    id: 11,
    soru: "Deniz Manzaralı Suit'te 3 gece kalırsam ne öderim?",
    beklenen_cevap: "3 x 11.500 = 34.500 TL.",
    kaynak: "tablo + hesap",
    category: "table_calc",
    explanation: "odalar.csv tablosundan Deniz Manzaralı Suit gecelik 11.500 TL olup, 3 gece konaklama: 3 × 11.500 = 34.500 TL eder."
  },
  {
    id: 12,
    soru: "Otel kaç yıldızlı?",
    beklenen_cevap: "Rehberde yok; uydurmamalı.",
    kaynak: "yok",
    category: "out_of_scope",
    explanation: "Rehberde ve veri tabanında otelin kaç yıldızlı olduğu bilgisi yer almamaktadır. Model kesinlikle uydurmamalı / halüsinasyon görmemeli, bilgisi olmadığını belirtmelidir."
  },
  {
    id: 13,
    soru: "Düğün organizasyonu yapıyor musunuz?",
    beklenen_cevap: "Rehberde yok; uydurmamalı.",
    kaynak: "yok",
    category: "out_of_scope",
    explanation: "Rehberde ve veri tabanında düğün organizasyonu hakkında hiçbir bilgi bulunmamaktadır. Model kesinlikle uydurmamalıdır."
  },
  {
    id: 14,
    soru: "VIP transfer ne kadar?",
    beklenen_cevap: "VIP araç tek yön transfer ücreti 3.000 TL'dir.",
    kaynak: "araç: transfer_ucreti",
    category: "table_calc",
    explanation: "Özel transfer_ucreti aracından: VIP araç tek yön transfer ücreti 3.000 TL'dir."
  },
  {
    id: 15,
    soru: "Standart transfer aracı kaç TL?",
    beklenen_cevap: "1-4 kişilik standart araç tek yön transfer ücreti 1.800 TL'dir.",
    kaynak: "araç: transfer_ucreti",
    category: "table_calc",
    explanation: "Özel transfer_ucreti aracından: 1-4 kişilik standart araç transfer ücreti 1.800 TL'dir."
  }
];
