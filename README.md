# Atlas ERP

**React, Node.js ve MongoDB Atlas ile geliştirilmiş, Docker üzerinde çalışan modüler ERP demo projesi.**

Atlas ERP; satış, satın alma, stok, üretim, finans, insan kaynakları, proje yönetimi ve dijital satış kanallarını tek uygulamada birleştirir. Bir sipariş yalnızca listeye eklenen bir satır olarak kalmaz: teslimat, stok hareketi, fatura ve muhasebe kaydı gibi sonraki işlemlerle bağlantılı ilerler. Aynı yaklaşım adaydan çalışana, reçeteden üretime ve projeden zaman kaydına uzanır.

Mevcut uygulama **20 temel iş alanını destekleyen 30 etkin modül ekranı** içerir. Kullanıcı yönetimi, entegrasyon ayarları, AI rehber, AI mülakat ve izleme ekranları bunlara ek destek işlevleridir.

Bu depo bir demo ve geliştirme çalışmasıdır. Gerçek ticari kullanım için her iş alanının kurum ihtiyaçlarına göre değerlendirilmesi, dış sağlayıcı hesaplarıyla denenmesi ve kalan işlevlerin tamamlanması gerekir. Aşağıdaki bölümler kodda bulunan davranışları ve mevcut sınırları birlikte açıklar.

## İçindekiler

- [Projenin kapsamı ve temel yaklaşım](#kapsam)
- [Genel görünüm ve modül haritası](#harita)
- [Kullanılan teknolojiler](#teknolojiler)
- [Uygulama bileşenleri ve veri yapısı](#mimari)
- [Modüllerin ayrıntılı açıklaması](#moduller)
- [Birbirine bağlı örnek iş akışları](#akislar)
- [Kullanıcılar, roller ve uygulama ekranları](#kullanicilar)
- [AI rehber ve mülakat kullanımı](#ai)
- [Dış servis entegrasyonları](#entegrasyonlar)
- [Docker kurulumu ve günlük kullanım](#kurulum)
- [WAF ve izleme servisleri](#izleme)
- [Testler, demo sıfırlama ve dokümanlar](#testler)
- [Mevcut sınırlar ve geliştirme başlıkları](#sinirlar)

<a id="kapsam"></a>
## Projenin kapsamı ve temel yaklaşım

### Hangi ihtiyaçlar karşılanıyor?

- Cari ve ürün kartlarını ortak bir başlangıç noktası olarak kullanmak.
- Satın alma ile depoya ürün almak; satışla depodan sevk etmek.
- Siparişlerden müşteri veya tedarikçi faturası oluşturmak.
- Fatura ve ödeme işlemlerini muhasebe fişlerinde takip etmek.
- Reçete tanımlayıp bileşenleri tüketerek mamul üretmek.
- Aday, çalışan, izin, puantaj ve araç bilgilerini izlemek.
- Projeleri görevlere ayırmak ve çalışanların zamanını kaydetmek.
- POS ve e-ticaret kanallarında sipariş/tahsilat akışlarını denemek.
- Web sayfalarını bloklarla hazırlayıp taslak ve yayımlanmış içerikleri ayrı yönetmek.
- E-posta kampanyası, anket ve etkinlik süreçlerini yürütmek.
- Modül kullanımını AI rehberden öğrenmek; uyarlanan teknik mülakat senaryosu çalıştırmak.

### 20 iş alanı neden 30 ekrana ayrılıyor?

Bir iş alanının birden fazla destek kaydı vardır. Örneğin stok/depo alanı; ürün, depo, sayım, transfer ve stok hareketi ekranlarıyla yürür. Üretim; reçete ve üretim emri olarak ayrılır. Proje yönetimi proje ve görev kayıtlarını, filo yönetimi araç ve servis/yakıt kayıtlarını birlikte kullanır. Bu ayrım, menü sayısıyla iş alanı sayısının farklı olmasının nedenidir.

### Kayıt, işlem ve çıktı ayrımı

Bir kartı veya belgeyi kaydetmek, her zaman sonraki işlemi yapmaz. Satın alma kaydının oluşturulması stok girişi değildir; teslim alma gerekir. Satış siparişinin onaylanması sevkiyat değildir. Fatura oluşturmak ödeme almak anlamına gelmez. Reçete kaydetmek bileşen tüketmez. Her modülün aşağıda belirtilen işlem sırası bu ayrımları koruyacak şekilde tasarlanmıştır.

```mermaid
flowchart LR
    K["Kayıt oluştur\n(Kaydet)"] --> O["Belgeyi onayla"]
    O --> I["Fiziksel/mali işlem\n(Teslim al, Sevk et, Muhasebeleştir...)"]
    I --> C["Çıktı ve bağlantılı kayıtlar\n(Stok hareketi, fatura, fiş)"]
    K -.->|"tek başına yeterli değildir"| I
```

Liste satırlarındaki işlem düğmeleri mevcut duruma göre değişir. Ayrıntı panelinden işlem yapıldığında panel yeni duruma göre güncellenir; her adımda kapatıp yeniden açmak gerekmez. Kayıtlar adla aranabilir, listeler yenilenebilir ve uygun ekranlarda CSV çıktısı alınabilir.

<a id="harita"></a>
## Genel görünüm ve modül haritası

Aşağıdaki şema 30 modül ekranının hangi iş alanı altında toplandığını ve temel ilişkileri gösterir.

```mermaid
mindmap
  root((Atlas ERP))
    Satış
      Kişiler
      CRM / Fırsatlar
      Satış Siparişleri
      POS Satışları
    Tedarik
      Satın Alma
    Stok
      Ürünler
      Depolar
      Stok Sayımı / Açılış
      Depolar Arası Transfer
      Stok Hareketleri
    Muhasebe
      Faturalar
      Muhasebe Fişleri
    Üretim
      Ürün Reçeteleri
      Üretim Emirleri
      Ekipmanlar
      Bakım
    İnsan Kaynakları
      Çalışanlar
      İşe Alım
      İzin Talepleri
      Puantaj
      Araç Filosu
      Araç Servis / Yakıt
    Hizmetler
      Projeler
      Görevler
      Zaman Kayıtları
    Web
      Web Sayfaları
      E-ticaret Siparişleri
    Pazarlama
      E-posta Kampanyaları
      Etkinlikler
      Anketler
```

### Modüller arası temel bağlantılar

```mermaid
flowchart TD
    Kisiler["Kişiler (Cari)"]
    Urunler["Ürünler"]
    Depolar["Depolar"]

    CRM["CRM / Fırsatlar"]
    Satis["Satış Siparişleri"]
    POS["POS Satışları"]
    Eticaret["E-ticaret Siparişleri"]
    Alma["Satın Alma"]

    Stok["Stok Hareketleri"]
    Sayim["Stok Sayımı / Açılış"]
    Transfer["Depolar Arası Transfer"]

    Fatura["Faturalar"]
    Fis["Muhasebe Fişleri"]

    Recete["Ürün Reçeteleri"]
    Uretim["Üretim Emirleri"]

    Kisiler --> CRM --> Satis
    Kisiler --> Satis
    Kisiler --> Alma
    Kisiler --> POS
    Kisiler --> Eticaret
    Urunler --> Satis
    Urunler --> Alma
    Urunler --> POS
    Urunler --> Eticaret
    Urunler --> Recete --> Uretim
    Depolar --> Alma
    Depolar --> Satis
    Depolar --> Sayim
    Depolar --> Transfer
    Depolar --> Uretim

    Alma -->|"Teslim al"| Stok
    Satis -->|"Sevk et"| Stok
    POS --> Stok
    Eticaret -->|"Sevk et"| Stok
    Sayim --> Stok
    Transfer --> Stok
    Uretim -->|"Üretimi tamamla"| Stok

    Alma -->|"Tedarikçi faturası"| Fatura
    Satis -->|"Fatura oluştur"| Fatura
    POS --> Fatura
    Eticaret -->|"Fatura oluştur"| Fatura
    Fatura -->|"Muhasebeleştir / Öde"| Fis
```

<a id="teknolojiler"></a>
## Kullanılan teknolojiler

Aşağıdaki sürümler proje dosyalarında tanımlanan sürümlerdir; otomatik olarak en yeni sürüm iddiası taşımaz.

| Katman | Teknoloji | Projedeki görevi |
| --- | --- | --- |
| Arayüz | React 19.1.0 | Yönetim ekranları, formlar, listeler, POS, web editörü ve AI arayüzleri |
| Arayüz dili | JavaScript / JSX | Bileşen ve etkileşim kodları |
| Arayüz derlemesi | Vite 6.4.6 | React uygulamasının dağıtım dosyalarının hazırlanması |
| Görünüm | CSS | Sayfa düzeni, mobil uyum, formlar, avatar ve editör görünümü |
| Sunucu çalışma ortamı | Node.js 22 Alpine Docker imajı | API ve arka plan e-posta işçisi |
| HTTP API | Express 5.1.0 | Uygulama uç noktaları ve iş akışlarına erişim |
| Veritabanı | MongoDB Atlas | İş kayıtları, kullanıcılar, ayarlar ve ilişkili uygulama verileri |
| Veritabanı sürücüsü | MongoDB Node.js Driver 7.9.0 | Atlas bağlantısı, sorgular, index ve transaction işlemleri |
| E-posta | Nodemailer 10.5.0 | SMTP bağlantısı ve kampanya iletimi |
| Web sunucusu | Nginx 1.30.5 Alpine | Derlenmiş arayüzün sunulması ve API yönlendirmesi |
| Konteyner yönetimi | Docker / Docker Compose | Derleme, test ve servislerin birlikte çalıştırılması |
| WAF | ModSecurity + OWASP Core Rule Set | Uygulama önündeki web uygulama güvenlik duvarı |
| Metrikler | Prometheus 3.16.0 | API/WAF servis metriklerinin toplanması |
| Günlük toplama | Grafana Alloy 1.22.0 | Uygulama bileşenlerinin günlüklerini Loki'ye iletme |
| Günlük depolama | Loki 3.7.10 | Toplanan günlüklerin saklanması ve sorgulanması |
| İzleme arayüzü | Grafana 13.3.1 | Metrik ve günlük panoları |
| Nginx metrikleri | nginx-prometheus-exporter 1.5.3 | WAF Nginx ölçümlerinin Prometheus'a sunulması |
| AI protokolü | Chat Completions uyumlu HTTPS API | OpenRouter veya aynı protokolü uygulayan sağlayıcılara erişim |
| Seslendirme | Tarayıcı Speech Synthesis API | Yerel Türkçe ses mevcutsa mülakat sorularının okunması |
| Avatar | SVG ve CSS animasyonu | Mülakatçının insan biçiminde görselleştirilmesi |
| Belge biçimi | UBL XML / PDF / yazdırılabilir HTML | Fatura hazırlığı ve NES test belge işlemleri |
| Test çalıştırıcısı | Node.js yerleşik test araçları | Birim, protokol ve kabul senaryoları |
| Yardımcı komutlar | Windows PowerShell / CMD | Docker görevlerinin tek komutla başlatılması |

### Neden Docker üzerinden çalıştırılıyor?

Uygulamanın paket indirmeleri, derlemesi ve testleri konteynerlerde yapılır. Bilgisayara Node.js, MongoDB sunucusu veya npm paketleri kurmak normal kullanım için gerekmez. Uygulamanın iş veritabanı için Atlas kullanılır. Sürücü uyumluluğu ve oturum regresyonu gibi izole testlerde, gerçek iş verilerinden bağımsız geçici bir MongoDB konteyneri çalıştırılır. Docker Desktop ve bağlantı bilgileri hazır olduğunda PowerShell betikleri diğer adımları yürütür.

<a id="mimari"></a>
## Uygulama bileşenleri ve veri yapısı

### Mimari şema

```mermaid
flowchart LR
    T["Tarayıcı"] --> WAF["WAF\nModSecurity + OWASP CRS"]
    WAF --> WEB["Web\nNginx + React derlemesi"]
    WAF --> API["API\nNode.js + Express"]
    WEB --> API
    API --> DB[("MongoDB Atlas")]
    API --> W["E-posta işçisi\n(kuyruk)"]
    W --> SMTP["SMTP sunucusu"]
    API --> AI["AI sağlayıcı\nOpenRouter uyumlu"]
    API --> IY["iyzico Sandbox"]
    API --> NES["NES test e-dönüşüm"]
```

### React arayüzü

Arayüz; oturum açma, genel bakış, modül listeleri, kayıt formları ve ayrıntı pencerelerini içerir. POS ekranı, sayfa editörü, AI rehber ve mülakat ekranları kendi bileşenleriyle çalışır. Yönetim uygulaması ve ziyaretçilere açılan mağaza/form ekranları aynı arayüz projesinde bulunur.

### Node.js / Express API

API; kayıtların oluşturulması, güncellenmesi, aranması, belge durumlarının ilerletilmesi, ödemelerin takibi ve dış servis işlemleri için kullanılır. Satış/satın alma/üretim gibi alanların etkileri ortak iş akışı kodlarında tanımlıdır. E-posta kampanyalarının kuyruk işçisi API sürecinde çalışır.

### MongoDB Atlas

İş verileri Atlas'ta tutulur. Aynı koleksiyondaki iş kayıtları modül türüyle ayrılır. Bir kayıt genel olarak şirket, modül, belge durumu, sürüm, zaman ve modüle özgü veri alanlarını taşır. İlgili kayıtlar kimlikleri üzerinden birbirine bağlanır: siparişin carisi, satırdaki ürün, görevin projesi, izin kaydının çalışanı gibi.

| Koleksiyon grubu | İçerik |
| --- | --- |
| records | Cari, ürün, sipariş, fatura, fiş, stok ve diğer modül kayıtları |
| users / sessions | Kullanıcılar ve uygulama oturum bilgileri |
| settings | Şirket ve sağlayıcı ayarları |
| payments | POS/e-ticaret tahsilat süreçleri |
| mail_deliveries | Kampanya alıcıları ve teslimat durumları |
| submissions | Anket cevapları ve etkinlik başvuruları |
| interviews | AI mülakat oturumları, sorular ve cevaplar |
| sequences | Belge numarası sayaçları |
| audits | Uygulamada gerçekleştirilen işlemlerin geçmişi |

```mermaid
erDiagram
    COMPANY ||--o{ RECORDS : sahip
    COMPANY ||--o{ USERS : icerir
    COMPANY ||--o{ SETTINGS : ayarlar
    USERS ||--o{ SESSIONS : oturum
    RECORDS ||--o{ AUDITS : "islem gecmisi"
    RECORDS ||--o{ PAYMENTS : tahsilat
    RECORDS ||--o{ SUBMISSIONS : "anket / etkinlik"
    RECORDS ||--o{ MAIL_DELIVERIES : "kampanya alicilari"
    RECORDS ||--o{ INTERVIEWS : "AI mulakat"
    RECORDS }o--o{ RECORDS : "kimlik ile baglanti"
    SEQUENCES ||--o{ RECORDS : "belge numarasi"
```

Koleksiyon adları varsayılan olarak `atlas_erp_` ön ekini alır. `COLLECTION_PREFIX` değiştirilmesi eski kayıtları otomatik taşımaz.

### Tutar ve miktar gösterimi

Arayüzde fiyatlar TL olarak girilir. Veritabanındaki parasal değerler tam sayı kuruş cinsindedir: `15000` değeri 150,00 TL demektir. JSON/CSV verileri incelenirken bu fark gözetilmelidir. Ürün satırlarında miktar, KDV hariç birim fiyat ve vergi yüzdesi tutulur. Belge toplamı satırlardan hesaplanır.

### Proje dizinleri

```text
atlas-erp/
  api/
    knowledge/          Chatbotun kullandığı modül rehberi
    src/                API, iş akışları, sağlayıcılar ve bakım komutları
    test/               Birim, protokol ve API kabul senaryoları
  web/
    src/                React bileşenleri ve CSS dosyaları
  shared/               Modül, alan, durum ve ortak tanımlar
  infra/
    waf/                ModSecurity/CRS ve Nginx yapılandırması
    prometheus/         Metrik toplama ve uyarı kuralları
    alloy/              Günlük toplama yapılandırması
    loki/               Günlük depolama yapılandırması
    grafana/            Veri kaynakları ve pano tanımları
  docs/
    rehber/             Her modül için ayrıntılı Markdown rehberi
  Dockerfile
  compose.yaml
  compose.acceptance.yaml
  Ready.ps1 / Ready.cmd
  Start.ps1 / Start.cmd
  Test.ps1 / Acceptance.ps1
  Reset-Demo.ps1
```

<a id="moduller"></a>
## Modüllerin ayrıntılı açıklaması

Aşağıdaki başlıklar uygulamadaki etkin 30 modülü kapsar. Menü adları arayüzde görünen yazımlarıyla verilmiştir. Örneklerdeki isimler gerçek veri değildir; test sırasında oluşturulacak demo kayıtlarıdır. Örnek sonuçlar kendi belirtilen başlangıç bakiyeleri için geçerlidir.

### Hızlı modül dizini

- [Satis → Kisiler](#modul-contacts)
- [Stok → Urunler](#modul-products)
- [Satis → CRM / Firsatlar](#modul-crm)
- [Satis → Satis Siparisleri](#modul-sales)
- [Tedarik → Satin Alma](#modul-purchases)
- [Muhasebe → Faturalar](#modul-invoices)
- [Stok → Stok Hareketleri](#modul-inventory)
- [Muhasebe → Muhasebe Fisleri](#modul-journal)
- [Uretim → Uretim Emirleri](#modul-manufacturing)
- [Uretim → Bakim](#modul-maintenance)
- [Insan Kaynaklari → Calisanlar](#modul-employees)
- [Insan Kaynaklari → Puantaj](#modul-attendance)
- [Insan Kaynaklari → Izin Talepleri](#modul-leave)
- [Insan Kaynaklari → Ise Alim](#modul-recruitment)
- [Insan Kaynaklari → Arac Filosu](#modul-fleet)
- [Hizmetler → Projeler](#modul-projects)
- [Hizmetler → Gorevler](#modul-tasks)
- [Hizmetler → Zaman Kayitlari](#modul-timesheets)
- [Satis → POS Satislari](#modul-pos)
- [Web → Web Sayfalari](#modul-website)
- [Web → E-ticaret Siparisleri](#modul-ecommerce)
- [Pazarlama → Etkinlikler](#modul-events)
- [Pazarlama → Anketler](#modul-surveys)
- [Pazarlama → E-posta Kampanyalari](#modul-emailMarketing)
- [Stok → Depolar](#modul-warehouses)
- [Stok → Stok Sayimi / Acilis](#modul-stockAdjustments)
- [Stok → Depolar Arasi Transfer](#modul-stockTransfers)
- [Uretim → Urun Receteleri](#modul-boms)
- [Uretim → Ekipmanlar](#modul-equipment)
- [Insan Kaynaklari → Arac Servis / Yakit](#modul-vehicleServices)

<a id="modul-contacts"></a>
### 1. Kisiler

**Menü yolu:** Sol menü → Satis → Kisiler

Müşteri ve tedarikçilerin ortak cari kartlarını yönetir; satış, satın alma, fatura ve kampanya ekranlarında kullanılacak temel bilgileri sağlar.

**Kullanım şeması**

```mermaid
flowchart LR
    K["Kisiler\n(cari kartı)"] --> A["CRM / Fırsatlar"]
    K --> B["Satış Siparişleri"]
    K --> C["Satın Alma"]
    K --> D["Faturalar"]
    K --> E["POS / E-ticaret"]
    K --> F["E-posta Kampanyaları"]
```

**Alanlar ve kayıt içeriği**

- **Ad / unvan**: metin; zorunlu.
- **E-posta**: e-posta.
- **Telefon**: metin.
- **Vergi no**: metin.
- **Adres**: metin.
- **Tur**: seçim; zorunlu; seçenekler: `customer`, `vendor`, `both`.
- **Soyadi**: metin.
- **Il**: metin.
- **Ilce**: metin.
- **Ulke**: metin.
- **Posta kodu**: metin.
- **e-Fatura alici etiketi**: metin.
- **E-posta pazarlama izni**: seçim; seçenekler: `yes`, `no`.

**Kullanım sırası**

Sol menü → Satis → Kisiler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

Bu kart üzerinde ayrı bir belge ilerletme adımı bulunmaz; ilgili diğer modüllerde kullanılır.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Cari adıyla bir kayıt açın; Tür=both seçin. Böylece aynı cari müşteri ve tedarikçi olarak kullanılabilir. E-posta pazarlama iznini gerçekten izin yoksa no bırakın.

**Kapsam ve kullanım notları**

Cari oluşturmak stok, fatura veya ödeme üretmez. Aynı isim yerine doğru kartı seçtiğinizi vergi ve iletişim bilgileriyle kontrol edin.

Ayrıntılı rehber: [Kisiler](docs/rehber/contacts.md).

<a id="modul-products"></a>
### 2. Urunler

**Menü yolu:** Sol menü → Stok → Urunler

Satılacak, satın alınacak veya üretimde kullanılacak ürünleri tanımlar. Fiyat, maliyet, vergi, mağaza bilgileri ve stok görüntülemesini bir araya getirir.

**Kullanım şeması**

```mermaid
flowchart LR
    U["Urunler"] --> A["Satın Alma"]
    U --> B["Satış / POS / E-ticaret"]
    U --> C["Ürün Reçeteleri"]
    U --> D["Stok Sayımı"]
    U --> E["Depolar Arası Transfer"]
    U -->|"Magazada yayinla = yes"| F["Mağaza vitrini"]
    A -->|"Teslim al"| S["Stok bakiyesi"]
    D --> S
```

**Alanlar ve kayıt içeriği**

- **Urun adi**: metin; zorunlu.
- **Stok kodu**: metin; zorunlu.
- **Satis fiyati**: TL tutarı; zorunlu.
- **Alis maliyeti**: TL tutarı; zorunlu.
- **Vergi %**: sayısal değer; zorunlu.
- **Magazada yayinla**: seçim; seçenekler: `yes`, `no`.
- **Urun aciklamasi**: açıklama.
- **HTTPS gorsel adresi**: metin.

**Kullanım sırası**

Sol menü → Stok → Urunler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

Bu kart üzerinde ayrı bir belge ilerletme adımı bulunmaz; ilgili diğer modüllerde kullanılır.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Kalem; Stok kodu=TEST-KALEM-001; Alış maliyeti=100; Satış fiyatı=150; Vergi %=20. Kaydet sonrasında stok 0 olmalıdır.

**Kapsam ve kullanım notları**

Ürün eklerken benzersiz ve anlamlı stok kodu, doğru ad, KDV hariç fiyat, doğru vergi yüzdesi ve mağazada yayın seçimini kontrol edin. Fiyatlara KDV ekleyerek yazmayın. Başlangıç stoğunu ürün formundan vermeyin; satın alma veya sayım kullanın. Aynı ürüne ikinci kart açmak yerine mevcut kartı bulun. Mağazada yayınla=yes yalnızca yayımlanan mağazada gösterim içindir; ürünü oluşturmak tek başına siteyi yayımlamaz.

Ayrıntılı rehber: [Urunler](docs/rehber/products.md).

<a id="modul-crm"></a>
### 3. CRM / Firsatlar

**Menü yolu:** Sol menü → Satis → CRM / Firsatlar

Potansiyel satış fırsatlarını aşama bazında takip eder ve uygun fırsatı satış teklifine dönüştürür.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Nitelikli: Nitelikli
    Taslak --> Kaybedildi: Kaybedildi
    Nitelikli --> Teklif: Teklif
    Nitelikli --> Kaybedildi: Kaybedildi
    Teklif --> Kazanildi: Kazanıldı
    Teklif --> Kaybedildi: Kaybedildi
    Teklif --> SatisTeklifi: Satis teklifi olustur
    Kazanildi --> SatisTeklifi: Satis teklifi olustur
    SatisTeklifi --> [*]
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Musteri**: ilişkili kayıt; Kisiler ekranındaki kayıttan seçilir.
- **Beklenen gelir**: TL tutarı.
- **Teklif urunleri**: ürün satırları.

**Kullanım sırası**

Sol menü → Satis → CRM / Firsatlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Nitelikli** işlemi kullanılabilir.
- **Taslak** durumunda **Kaybedildi** işlemi kullanılabilir.
- **Nitelikli** durumunda **Teklif** işlemi kullanılabilir.
- **Nitelikli** durumunda **Kaybedildi** işlemi kullanılabilir.
- **Teklif** durumunda **Satis teklifi olustur** işlemi kullanılabilir.
- **Teklif** durumunda **Kazanıldı** işlemi kullanılabilir.
- **Teklif** durumunda **Kaybedildi** işlemi kullanılabilir.
- **Kazanıldı** durumunda **Satis teklifi olustur** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Fırsat için müşteri, ürün ve tutar belirleyin. Nitelikli/teklif aşamalarından ilerleyip Satis teklifi olustur kullanın. Satış siparişlerinde bağlantılı kayıt görünmelidir.

**Kapsam ve kullanım notları**

Fırsatın kazanılması tek başına stok veya muhasebe hareketi oluşturmaz. Satış teklifi için cari ve ürün satırları gereklidir; aynı fırsat ikinci kez teklife dönüşmez.

Ayrıntılı rehber: [CRM / Firsatlar](docs/rehber/crm.md).

<a id="modul-purchases"></a>
### 4. Satin Alma

**Menü yolu:** Sol menü → Tedarik → Satin Alma

Tedarikçiden alınacak ürünler için sipariş, teslim alma ve tedarikçi faturası sürecini yürütür.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Onaylandi: Onayla
    Onaylandi --> TeslimAlindi: Teslim al (stok girişi)
    TeslimAlindi --> Faturalandi: Tedarikci faturasi
    Faturalandi --> [*]
```

**Alanlar ve kayıt içeriği**

- **Belge adi**: metin; zorunlu.
- **Cari**: ilişkili kayıt; zorunlu; Kisiler ekranındaki kayıttan seçilir.
- **Urun satirlari**: ürün satırları; zorunlu.
- **Depo (bos: ana depo)**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.

**Kullanım sırası**

Sol menü → Tedarik → Satin Alma ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onayla** işlemi kullanılabilir.
- **Onaylandı** durumunda **Teslim al** işlemi kullanılabilir.
- **Teslim alındı** durumunda **Tedarikci faturasi** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Satın Alma; TEST — Cari; TEST — Kalem 10 adet, birim fiyat 100 ve vergi %20. Ara toplam 1.000, vergi 200, toplam 1.200 TL olur. Onayla → Teslim al sonrasında ana depodaki stok 0’dan 10’a çıkar. Tedarikci faturasi ile taslak fatura oluşur.

**Kapsam ve kullanım notları**

Taslak kaydetmek veya yalnızca onaylamak stok girişi değildir. Teslim al için Stok/Depolar Arası Transfer modülünde de işlem yetkisi gerekir. Teslim alınan siparişi tekrar teslim almayın; aynı hareket iki kez işlenmemelidir. Fatura oluşturmak muhasebeleştirme veya banka ödemesi değildir.

Ayrıntılı rehber: [Satin Alma](docs/rehber/purchases.md).

<a id="modul-sales"></a>
### 5. Satis Siparisleri

**Menü yolu:** Sol menü → Satis → Satis Siparisleri

Müşteri siparişini onay, sevkiyat ve faturalama adımlarıyla yürütür.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Onaylandi: Onayla
    Onaylandi --> SevkEdildi: Sevk et (stok çıkışı)
    SevkEdildi --> Faturalandi: Fatura olustur
    Faturalandi --> [*]
```

**Alanlar ve kayıt içeriği**

- **Belge adi**: metin; zorunlu.
- **Cari**: ilişkili kayıt; zorunlu; Kisiler ekranındaki kayıttan seçilir.
- **Urun satirlari**: ürün satırları; zorunlu.
- **Depo (bos: ana depo)**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.

**Kullanım sırası**

Sol menü → Satis → Satis Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onayla** işlemi kullanılabilir.
- **Onaylandı** durumunda **Sevk et** işlemi kullanılabilir.
- **Sevk edildi** durumunda **Fatura olustur** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Satış; TEST — Cari; TEST — Kalem 2 adet, birim fiyat 150, vergi %20. Ara toplam 300, vergi 60, toplam 360 TL. Onayla → Sevk et sonrasında 10 adet stok 8’e iner; Fatura olustur taslak müşteri faturası açar.

**Kapsam ve kullanım notları**

Siparişi kaydetmek/onaylamak stoğu düşürmez; fiziksel stok Sevk et ile değişir. Sevk için depo işlem yetkisi ve yeterli kullanılabilir stok gerekir. Onaydan sonra satırları değiştirmeyin. Fatura oluşturmak tahsilat yapmaz; muhasebeci fatura ve ödeme adımını yürütür.

Ayrıntılı rehber: [Satis Siparisleri](docs/rehber/sales.md).

<a id="modul-invoices"></a>
### 6. Faturalar

**Menü yolu:** Sol menü → Muhasebe → Faturalar

Müşteri ve tedarikçi faturalarının satırlarını, toplamlarını, muhasebe durumunu ve belge çıktısını yönetir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Muhasebelesti: Muhasebelestir (fatura fişi)
    Muhasebelesti --> Odendi: Odemeyi kaydet (ödeme fişi)
    Muhasebelesti --> TersKayit: Ters kayit
    Odendi --> [*]
    TersKayit --> [*]
```

**Alanlar ve kayıt içeriği**

- **Belge adi**: metin; zorunlu.
- **Cari**: ilişkili kayıt; zorunlu; Kisiler ekranındaki kayıttan seçilir.
- **Urun satirlari**: ürün satırları; zorunlu.
- **Fatura turu**: seçim; zorunlu; seçenekler: `customer`, `vendor`.

**Kullanım sırası**

Sol menü → Muhasebe → Faturalar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Muhasebelestir** işlemi kullanılabilir.
- **Muhasebeleşti** durumunda **Odemeyi kaydet** işlemi kullanılabilir.
- **Muhasebeleşti** durumunda **Ters kayit** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: satıştan oluşan 360 TL taslak faturayı Muhasebelestir yapın; fatura fişinin borç ve alacak toplamı ayrı ayrı 360 TL olmalı. Odemeyi kaydet sonrasında durum Ödendi olur ve ayrıca ödeme fişi oluşur.

**Kapsam ve kullanım notları**

Sipariş faturası zaten oluşturulduysa Yeni kayit ile ikinci kez kesmeyin. customer müşteri, vendor tedarikçi faturasıdır. Taslağa ödeme kaydı yapılamaz. Ödeme düğmesi manuel muhasebe kaydıdır, bankadan para göndermez veya kart çekmez. Ödenmiş faturaya ikinci ödeme uygulanmamalıdır. NES işlemleri ayrı test hesabı ve şirket/vergi bilgilerinin tamamlanmasını gerektirir; yerel çıktı resmî e-fatura değildir.

Ayrıntılı rehber: [Faturalar](docs/rehber/invoices.md).

<a id="modul-journal"></a>
### 7. Muhasebe Fisleri

**Menü yolu:** Sol menü → Muhasebe → Muhasebe Fisleri

Fatura, ödeme ve ters kayıt işlemlerinin oluşturduğu muhasebe fişlerini görüntüler.

**Kullanım şeması**

```mermaid
flowchart LR
    F["Fatura: Muhasebelestir"] --> FIS1["Fatura fişi"]
    O["Fatura: Odemeyi kaydet"] --> FIS2["Ödeme fişi"]
    T["Fatura: Ters kayit"] --> FIS3["Ters kayıt fişi"]
    FIS1 --> D["Muhasebe Fisleri\n(salt okunur defter)"]
    FIS2 --> D
    FIS3 --> D
```

**Alanlar ve kayıt içeriği**

Bu ekran otomatik oluşan kayıtları gösterir; elle doldurulacak bir kayıt formu yoktur.

**Kullanım sırası**

Sol menü → Muhasebe → Muhasebe Fisleri ekranını açın. Kaydı adından arayın, Ayrinti ile kaynak ve satırlarını inceleyin.

Bu kart üzerinde ayrı bir belge ilerletme adımı bulunmaz; ilgili diğer modüllerde kullanılır.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Satış / invoice fişini açın; müşteri alacağı 360 TL borç, satış geliri 300 TL ve hesaplanan KDV 60 TL alacak olmalıdır. Ödeme fişi faturadan ayrı kayıttır.

**Kapsam ve kullanım notları**

Salt okunur defterdir. Borç/alacak dengesizliği veya aynı kaynak için yinelenen fiş görürseniz yeni fiş ekleyerek düzeltmeye çalışmayın; ilgili fatura iş akışını inceleyin.

Ayrıntılı rehber: [Muhasebe Fisleri](docs/rehber/journal.md).

<a id="modul-inventory"></a>
### 8. Stok Hareketleri

**Menü yolu:** Sol menü → Stok → Stok Hareketleri

Ürünlerin giriş, çıkış ve depo transfer hareketlerini kaynak belgeleriyle birlikte izler.

**Kullanım şeması**

```mermaid
flowchart LR
    A["Satın Alma: Teslim al"] -->|"+"| H["Stok Hareketleri\n(salt okunur defter)"]
    B["Satış / E-ticaret: Sevk et"] -->|"-"| H
    C["POS: Kasada tahsil et"] -->|"-"| H
    D["Stok Sayımı: Sayimi uygula"] -->|"fark"| H
    E["Transfer: Transfer et"] -->|"çıkış + giriş"| H
    F["Üretim: Uretimi tamamla"] -->|"bileşen - / mamul +"| H
```

**Alanlar ve kayıt içeriği**

Bu ekran otomatik oluşan kayıtları gösterir; elle doldurulacak bir kayıt formu yoktur.

**Kullanım sırası**

Sol menü → Stok → Stok Hareketleri ekranını açın. Kaydı adından arayın, Ayrinti ile kaynak ve satırlarını inceleyin.

Bu kart üzerinde ayrı bir belge ilerletme adımı bulunmaz; ilgili diğer modüllerde kullanılır.

**Örnek işlem ve beklenen sonuç**

Örnek: 10 adet satın alma girişi ve 2 adet satış çıkışı sonrasında hareketler +10 ve -2, ürün bakiyesi 8 olmalıdır.

**Kapsam ve kullanım notları**

Stok hareketleri salt okunurdur. Fatura oluşturmak, ödemek veya taslak sipariş kaydetmek stok hareketi üretmez. Kayıtları ve kaynak belgeyi birlikte kontrol edin.

Ayrıntılı rehber: [Stok Hareketleri](docs/rehber/inventory.md).

<a id="modul-warehouses"></a>
### 9. Depolar

**Menü yolu:** Sol menü → Stok → Depolar

Stok işlemlerinde seçilecek depo kartlarını tanımlar.

**Kullanım şeması**

```mermaid
flowchart LR
    D["Depolar"] --> A["Satın Alma"]
    D --> B["Satış Siparişleri"]
    D --> C["Stok Sayımı"]
    D --> T["Depolar Arası Transfer"]
    D --> U["Üretim Emirleri"]
    X["Depo boş bırakılırsa"] --> M["Ana depo kullanılır"]
```

**Alanlar ve kayıt içeriği**

- **Depo adi**: metin; zorunlu.
- **Adres**: metin.

**Kullanım sırası**

Sol menü → Stok → Depolar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

Bu kart üzerinde ayrı bir belge ilerletme adımı bulunmaz; ilgili diğer modüllerde kullanılır.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Şube Deposu oluşturun. Siparişte depo boş kalırsa bu yeni depoya değil ana depoya işlem yapılır.

**Kapsam ve kullanım notları**

Depo kartı oluşturmak stok taşımaz. Stok taşıma ayrı transfer işlemiyle yapılır.

Ayrıntılı rehber: [Depolar](docs/rehber/warehouses.md).

<a id="modul-stockAdjustments"></a>
### 10. Stok Sayimi / Acilis

**Menü yolu:** Sol menü → Stok → Stok Sayimi / Acilis

Sayım veya açılış bakiyesiyle depodaki hedef stok miktarını uygular.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Uygulandi: Sayimi uygula
    Uygulandi --> [*]
    note right of Uygulandi
        Sayilan miktar hedef toplam bakiyedir.
        Örnek: stok 8, sayım 12 → bakiye 12, fark +4
    end note
```

**Alanlar ve kayıt içeriği**

- **Sayim adi**: metin; zorunlu.
- **Urun**: ilişkili kayıt; zorunlu; Urunler ekranındaki kayıttan seçilir.
- **Depo (bos: ana depo)**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.
- **Sayilan miktar**: sayısal değer; zorunlu.

**Kullanım sırası**

Sol menü → Stok → Stok Sayimi / Acilis ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Sayimi uygula** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: stoğu 8 olan üründe Sayilan miktar=12 girip Sayimi uygula yapın. Sonuç 20 değil 12, oluşan fark hareketi +4 olmalıdır.

**Kapsam ve kullanım notları**

Sayım alanı eklenecek miktar değil hedef toplam bakiyedir. Yanlış depoda sayım yapmayın; rezervasyon altına düşen sayım reddedilir.

Ayrıntılı rehber: [Stok Sayimi / Acilis](docs/rehber/stockAdjustments.md).

<a id="modul-stockTransfers"></a>
### 11. Depolar Arasi Transfer

**Menü yolu:** Sol menü → Stok → Depolar Arasi Transfer

Bir depodan diğerine ürün miktarı taşır.

**Durum ve stok şeması**

```mermaid
flowchart LR
    T["Taslak"] -->|"Transfer et"| OK["Transfer tamamlandı"]
    subgraph Etki["Örnek etki (3 adet)"]
        A["Ana depo: 12"] -->|"-3"| A2["Ana depo: 9"]
        B["Şube deposu: 0"] -->|"+3"| B2["Şube deposu: 3"]
    end
    OK --> Etki
```

**Alanlar ve kayıt içeriği**

- **Transfer adi**: metin; zorunlu.
- **Urun**: ilişkili kayıt; zorunlu; Urunler ekranındaki kayıttan seçilir.
- **Miktar**: sayısal değer; zorunlu.
- **Cikis deposu (bos: ana)**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.
- **Giris deposu (bos: ana)**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.

**Kullanım sırası**

Sol menü → Stok → Depolar Arasi Transfer ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Transfer et** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: ana depoda 12 adet üründen 3 adedi TEST — Şube Deposu’na aktarın. Ana depo 9, şube 3, toplam 12 olmalıdır.

**Kapsam ve kullanım notları**

Miktar pozitif olmalı, depolar aynı olmamalı ve çıkış deposunda yeterli stok olmalıdır. Boş depo ana depo demektir; iki tarafı da boş bırakmayın.

Ayrıntılı rehber: [Depolar Arasi Transfer](docs/rehber/stockTransfers.md).

<a id="modul-boms"></a>
### 12. Urun Receteleri

**Menü yolu:** Sol menü → Uretim → Urun Receteleri

Bir birim mamulün üretimi için gereken bileşenleri ve miktarlarını tanımlar.

**Kullanım şeması**

```mermaid
flowchart LR
    R["Recete\n(1 set = 2 kalem)"] -->|"Uretim emri ac"| E["Taslak üretim emri"]
    E --> M["Üretim Emirleri"]
    R -.->|"kaydetmek stok tüketmez"| X["Stok değişmez"]
```

**Alanlar ve kayıt içeriği**

- **Recete adi**: metin; zorunlu.
- **Mamul**: ilişkili kayıt; zorunlu; Urunler ekranındaki kayıttan seçilir.
- **Birim mamul bilesenleri**: bileşen satırları; zorunlu.

**Kullanım sırası**

Sol menü → Uretim → Urun Receteleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Devam ediyor** durumunda **Uretim emri ac** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Set mamulü için bir adet mamulde 2 adet TEST — Kalem kullanacak reçete kaydedin. Uretim emri ac bir adet mamul için taslak emir oluşturur.

**Kapsam ve kullanım notları**

Mamul kendi bileşeni olamaz. Bileşen miktarları bir birim mamul içindir; üretim miktarıyla çarpılır. Reçete kaydetmek stok tüketmez.

Ayrıntılı rehber: [Urun Receteleri](docs/rehber/boms.md).

<a id="modul-manufacturing"></a>
### 13. Uretim Emirleri

**Menü yolu:** Sol menü → Uretim → Uretim Emirleri

Reçete/bileşen bilgilerine göre üretim emri yürütür; tamamlanınca tüketim ve mamul hareketlerini oluşturur.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Onaylandi: Onayla
    Onaylandi --> Tamamlandi: Uretimi tamamla
    Tamamlandi --> [*]
    note right of Tamamlandi
        Bileşenler düşer, mamul artar.
        Bir bileşen yetersizse hiçbir hareket oluşmaz.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Mamul**: ilişkili kayıt; zorunlu; Urunler ekranındaki kayıttan seçilir.
- **Miktar**: sayısal değer; zorunlu.
- **Recete bilesenleri**: bileşen satırları; zorunlu.
- **Urun recetesi**: ilişkili kayıt; Urun Receteleri ekranındaki kayıttan seçilir.
- **Depo**: ilişkili kayıt; Depolar ekranındaki kayıttan seçilir.

**Kullanım sırası**

Sol menü → Uretim → Uretim Emirleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onayla** işlemi kullanılabilir.
- **Onaylandı** durumunda **Uretimi tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: 2 kalem tüketen reçeteden 1 set üretin. Onayla → Uretimi tamamla sonrasında kalem 2 azalır, set 1 artar.

**Kapsam ve kullanım notları**

Onaylamak tüketim değildir. Bileşenlerden biri yetersizse hiçbir bileşen tüketilmemeli ve mamul girişi olmamalıdır. Doğru üretim deposunu kontrol edin.

Ayrıntılı rehber: [Uretim Emirleri](docs/rehber/manufacturing.md).

<a id="modul-employees"></a>
### 14. Calisanlar

**Menü yolu:** Sol menü → Insan Kaynaklari → Calisanlar

Çalışan kartlarını, görev/departman bilgilerini ve izin bakiyelerini yönetir.

**Kullanım şeması**

```mermaid
flowchart LR
    IA["Ise Alim:\nIse al / calisan olustur"] --> C["Calisanlar"]
    C --> I["Izin Talepleri\n(izin bakiyesi)"]
    C --> P["Puantaj"]
    C --> Z["Zaman Kayitlari"]
    C --> F["Arac Filosu\n(sürücü)"]
    C -->|"Arsivle"| AR["Arşivlenmiş çalışan"]
```

**Alanlar ve kayıt içeriği**

- **Ad soyad**: metin; zorunlu.
- **Is e-postasi**: e-posta.
- **Departman**: metin.
- **Gorev**: metin.
- **Yonetici**: metin.
- **Yillik izin hakki (gun)**: sayısal değer.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Calisanlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Devam ediyor** durumunda **Arsivle** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Çalışan için departman ve görev girin; yıllık izin hakkını 20 yapın. Yeni çalışanın kullanılan izni 0 olmalıdır.

**Kapsam ve kullanım notları**

Bu sürüm bordro veya mevzuata göre otomatik izin hak edişi hesaplamaz. İzin hakkını kullanılan iznin altına indirmeyin; kullanılan günler onay/iptal akışından hesaplanır. Gerçek kişisel veri yerine demo verisi kullanın.

Ayrıntılı rehber: [Calisanlar](docs/rehber/employees.md).

<a id="modul-recruitment"></a>
### 15. Ise Alim

**Menü yolu:** Sol menü → Insan Kaynaklari → Ise Alim

Adayı görüşme, teklif ve işe alma aşamalarında takip eder; AI mülakat özelliğiyle birlikte kullanılabilir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Gorusme: Görüşme
    Taslak --> Reddedildi: Reddedildi
    Gorusme --> Teklif: Teklif
    Gorusme --> Reddedildi: Reddedildi
    Teklif --> IseAlindi: Ise al / calisan olustur
    Teklif --> Reddedildi: Reddedildi
    IseAlindi --> [*]
    note right of IseAlindi
        Bağlantılı çalışan kartı oluşur.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Aday e-postasi**: e-posta.
- **Pozisyon**: metin.
- **Departman**: metin.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Ise Alim ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Görüşme** işlemi kullanılabilir.
- **Taslak** durumunda **Reddedildi** işlemi kullanılabilir.
- **Görüşme** durumunda **Teklif** işlemi kullanılabilir.
- **Görüşme** durumunda **Reddedildi** işlemi kullanılabilir.
- **Teklif** durumunda **Ise al / calisan olustur** işlemi kullanılabilir.
- **Teklif** durumunda **Reddedildi** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Aday, pozisyon Yazılımcı ve departman Yazılım. Görüşme → Teklif → Ise al / calisan olustur ile bağlantılı çalışan kartı oluşmalıdır.

**Kapsam ve kullanım notları**

AI Mulakat için Sistem → AI Mulakat ekranına gidin. Gereksinimleri yazın, 2–10 soru seçin ve davet oluşturun. Sorular önceki yanıta göre değişir; yanıt iletimi için onay gerekir. Avatar yerel Türkçe tarayıcı sesi varsa konuşur. AI otomatik işe alma/eleme kararı vermez; gerçek aday verisiyle demo yapmayın.

Ayrıntılı rehber: [Ise Alim](docs/rehber/recruitment.md).

<a id="modul-leave"></a>
### 16. Izin Talepleri

**Menü yolu:** Sol menü → Insan Kaynaklari → Izin Talepleri

Çalışan izinlerinin tarihlerini, onayını ve bakiye etkisini yönetir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> OnayBekliyor: Onaya gonder
    OnayBekliyor --> Onaylandi: Onayla (kullanılan gün artar)
    OnayBekliyor --> Reddedildi: Reddet
    Onaylandi --> IptalEdildi: Izni iptal et (gün geri verilir)
    IptalEdildi --> [*]
    Reddedildi --> [*]
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Calisan**: ilişkili kayıt; zorunlu; Calisanlar ekranındaki kayıttan seçilir.
- **Baslangic**: tarih; zorunlu.
- **Bitis**: tarih; zorunlu.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Izin Talepleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onaya gonder** işlemi kullanılabilir.
- **Onay bekliyor** durumunda **Onayla** işlemi kullanılabilir.
- **Onay bekliyor** durumunda **Reddet** işlemi kullanılabilir.
- **Onaylandı** durumunda **Izni iptal et** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: 20 günlük hakkı olan TEST — Çalışan için iki hafta içi günü kapsayan izin oluşturup Onaya gonder → Onayla yapın. Kullanılan gün 2, kalan 18 olmalı; Izni iptal et ile kullanılan gün 0’a dönmelidir.

**Kapsam ve kullanım notları**

Hafta sonu günleri sayılmaz; resmî tatil takvimi uygulanmaz. Çakışan onaylı izin ve yetersiz bakiye reddedilir. İzin iptali silme değildir; geçmiş kayıt korunur.

Ayrıntılı rehber: [Izin Talepleri](docs/rehber/leave.md).

<a id="modul-attendance"></a>
### 17. Puantaj

**Menü yolu:** Sol menü → Insan Kaynaklari → Puantaj

Çalışanların giriş/çıkış saatlerini ve bir kayıt için toplam süreyi izler.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> DevamEdiyor: Giriş kaydı
    DevamEdiyor --> Tamamlandi: Cikis yap (süre hesaplanır)
    Tamamlandi --> [*]
    note right of Tamamlandi
        Örnek: 09:00 giriş, 17:30 çıkış = 8,5 saat
    end note
```

**Alanlar ve kayıt içeriği**

- **Kayit adi**: metin; zorunlu.
- **Calisan**: ilişkili kayıt; zorunlu; Calisanlar ekranındaki kayıttan seçilir.
- **Giris**: tarih ve saat; zorunlu.
- **Cikis**: tarih ve saat.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Puantaj ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Devam ediyor** durumunda **Cikis yap** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: aynı tarihte 09:00 giriş, 17:30 çıkış kaydedip Cikis yap kullanın. Süre 8,5 saat olmalıdır.

**Kapsam ve kullanım notları**

Aynı çalışan için iki açık puantaj olamaz. Çıkış girişten önce olamaz; tek kayıt en fazla 24 saat kapsar. Molalar otomatik düşülmez.

Ayrıntılı rehber: [Puantaj](docs/rehber/attendance.md).

<a id="modul-projects"></a>
### 18. Projeler

**Menü yolu:** Sol menü → Hizmetler → Projeler

Proje kartlarını ve projelerin tamamlanma durumunu yönetir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> DevamEdiyor: Baslat
    DevamEdiyor --> Tamamlandi: Tamamla
    Tamamlandi --> [*]
    note right of DevamEdiyor
        Bağlı açık görev varken Tamamla reddedilir.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.

**Kullanım sırası**

Sol menü → Hizmetler → Projeler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Baslat** işlemi kullanılabilir.
- **Devam ediyor** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Proje oluşturup Baslat yapın. Bağlı açık görev varken Tamamla reddedilmeli; görevler bitirildikten sonra tamamlanmalıdır.

**Kapsam ve kullanım notları**

Proje tamamlamak kendiliğinden müşteri faturası oluşturmaz. Tarih ve sorumlu alanları kayıt takibi içindir.

Ayrıntılı rehber: [Projeler](docs/rehber/projects.md).

<a id="modul-tasks"></a>
### 19. Gorevler

**Menü yolu:** Sol menü → Hizmetler → Gorevler

Bir projeye bağlı görevlerin sorumlu, plan ve durum bilgilerini takip eder.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> DevamEdiyor: Baslat
    DevamEdiyor --> Tamamlandi: Tamamla
    Tamamlandi --> [*]
    note left of Taslak
        Görev bir projeye bağlıdır.
        Tamamlanan projeye yeni görev açılamaz.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Proje**: ilişkili kayıt; zorunlu; Projeler ekranındaki kayıttan seçilir.
- **Sorumlu**: metin.
- **Planlanan saat**: sayısal değer.

**Kullanım sırası**

Sol menü → Hizmetler → Gorevler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Baslat** işlemi kullanılabilir.
- **Devam ediyor** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Proje altında TEST — Görev, planlanan süre 8 saat. Baslat → Tamamla sonrasında bağlı proje tamamlanabilir.

**Kapsam ve kullanım notları**

Doğru projeyi seçin. Tamamlanan projeye yeni görev açılamaz; bu kayıtta sorumlu serbest metin alanıdır.

Ayrıntılı rehber: [Gorevler](docs/rehber/tasks.md).

<a id="modul-timesheets"></a>
### 20. Zaman Kayitlari

**Menü yolu:** Sol menü → Hizmetler → Zaman Kayitlari

Çalışanın proje/görev üzerinde geçirdiği zamanı kaydeder ve onaylı çalışma tutarını hesaplar.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> OnayBekliyor: Onaya gonder
    OnayBekliyor --> Onaylandi: Onayla
    Onaylandi --> [*]
    note right of Onaylandi
        Tutar = Saat x Saatlik tutar
        Örnek: 4 saat x 100 TL = 400 TL
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Proje**: ilişkili kayıt; zorunlu; Projeler ekranındaki kayıttan seçilir.
- **Saat**: sayısal değer; zorunlu.
- **Calisan**: ilişkili kayıt; zorunlu; Calisanlar ekranındaki kayıttan seçilir.
- **Gorev**: ilişkili kayıt; Gorevler ekranındaki kayıttan seçilir.
- **Calisma tarihi**: tarih; zorunlu.
- **Saatlik tutar**: TL tutarı.
- **Faturalanabilir**: seçim; seçenekler: `yes`, `no`.

**Kullanım sırası**

Sol menü → Hizmetler → Zaman Kayitlari ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onaya gonder** işlemi kullanılabilir.
- **Onay bekliyor** durumunda **Onayla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Çalışan, TEST — Proje, aynı projeye ait görev, 4 saat, saatlik tutar 100 ve Faturalanabilir=yes. Onaya gonder → Onayla sonrasında hesaplanan tutar 400 TL olmalıdır.

**Kapsam ve kullanım notları**

Görev başka projeye ait olamaz. Aynı çalışan ve gün için onaylı toplam 24 saati aşamaz. Hesaplanan tutar otomatik fatura veya maaş ödemesi değildir.

Ayrıntılı rehber: [Zaman Kayitlari](docs/rehber/timesheets.md).

<a id="modul-equipment"></a>
### 21. Ekipmanlar

**Menü yolu:** Sol menü → Uretim → Ekipmanlar

Bakım işlemlerinde kullanılacak ekipmanları ve biriken bakım bilgilerini tutar.

**Kullanım şeması**

```mermaid
flowchart LR
    E["Ekipmanlar"] --> B["Bakim kayıtları"]
    B -->|"Tamamla"| G["Son bakım ve toplam\nbakım maliyeti güncellenir"]
    G --> E
    E -->|"Arsivle"| AR["Arşivlenmiş ekipman"]
```

**Alanlar ve kayıt içeriği**

- **Ekipman adi**: metin; zorunlu.
- **Seri no**: metin.
- **Konum**: metin.
- **Sonraki bakim**: tarih.

**Kullanım sırası**

Sol menü → Uretim → Ekipmanlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Devam ediyor** durumunda **Arsivle** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Makine, seri no TEST-SERI-01, konum Atölye. Yeni kart oluşturmak bakım harcaması yaratmaz.

**Kapsam ve kullanım notları**

Son bakım ve toplam bakım maliyeti tamamlanan bakım kayıtlarından güncellenir. Kart oluşturmak otomatik bakım planı veya bildirim kurmaz.

Ayrıntılı rehber: [Ekipmanlar](docs/rehber/equipment.md).

<a id="modul-maintenance"></a>
### 22. Bakim

**Menü yolu:** Sol menü → Uretim → Bakim

Ekipmana ait bakım talebini başlatma/tamamlama süreciyle izler.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> DevamEdiyor: Baslat
    DevamEdiyor --> Tamamlandi: Tamamla
    Tamamlandi --> [*]
    note right of Tamamlandi
        Ekipmanın toplam bakım maliyeti artar.
        Örnek: 50 TL bakım → +50 TL
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Ekipman**: metin.
- **Teknisyen**: metin.
- **Ekipman**: ilişkili kayıt; zorunlu; Ekipmanlar ekranındaki kayıttan seçilir.
- **Oncelik**: seçim; zorunlu; seçenekler: `normal`, `high`, `urgent`.
- **Bakim maliyeti**: TL tutarı.

**Kullanım sırası**

Sol menü → Uretim → Bakim ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Baslat** işlemi kullanılabilir.
- **Devam ediyor** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Makine için 50 TL maliyetli bakım oluşturun. Baslat → Tamamla sonrasında ekipman toplam bakım maliyeti 50 TL artmalıdır.

**Kapsam ve kullanım notları**

Gerekli ekipman ilişkisini seçin; serbest açıklama ekipman seçiminin yerine geçmez. Bakım maliyeti otomatik fatura veya muhasebe fişi üretmez.

Ayrıntılı rehber: [Bakim](docs/rehber/maintenance.md).

<a id="modul-fleet"></a>
### 23. Arac Filosu

**Menü yolu:** Sol menü → Insan Kaynaklari → Arac Filosu

Araç kartlarını, kilometreyi, sürücü bilgilerini ve biriken giderleri yönetir.

**Durum ve ilişki şeması**

```mermaid
flowchart LR
    T["Taslak"] -->|"Baslat"| D["Devam ediyor"] -->|"Tamamla"| TM["Tamamlandı"]
    S["Arac Servis / Yakit\nkayıtları"] -->|"Tamamla"| G["Kilometre ve\ntoplam maliyet güncellenir"]
    G --> D
    C["Calisanlar"] -->|"Surucu"| D
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Plaka**: metin; zorunlu.
- **Kilometre**: sayısal değer.
- **Surucu**: metin.
- **Surucu**: ilişkili kayıt; Calisanlar ekranındaki kayıttan seçilir.
- **Sigorta bitisi**: tarih.
- **Muayene tarihi**: tarih.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Arac Filosu ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Baslat** işlemi kullanılabilir.
- **Devam ediyor** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Araç, plaka TEST-001 ve kilometre 100. Sonraki servis kaydı 120 kilometre ve 75 TL ise araç toplam maliyeti 75 TL artmalıdır.

**Kapsam ve kullanım notları**

Araçtaki maliyet ve kilometre servis/yakıt kayıtlarından ilerler. Sigorta/muayene tarihini kaydetmek otomatik uyarı göndermez.

Ayrıntılı rehber: [Arac Filosu](docs/rehber/fleet.md).

<a id="modul-vehicleServices"></a>
### 24. Arac Servis / Yakit

**Menü yolu:** Sol menü → Insan Kaynaklari → Arac Servis / Yakit

Araçlara ait servis, yakıt, sigorta ve diğer giderleri kaydeder.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Tamamlandi: Tamamla
    Tamamlandi --> [*]
    note right of Tamamlandi
        Araç kilometresi ve toplam maliyet güncellenir.
        Örnek: 120 km, 75 TL → maliyet +75 TL
    end note
```

**Alanlar ve kayıt içeriği**

- **Islem adi**: metin; zorunlu.
- **Arac**: ilişkili kayıt; zorunlu; Arac Filosu ekranındaki kayıttan seçilir.
- **Tarih**: tarih; zorunlu.
- **Kilometre**: sayısal değer; zorunlu.
- **Tutar**: TL tutarı; zorunlu.
- **Tur**: seçim; zorunlu; seçenekler: `service`, `fuel`, `insurance`, `other`.

**Kullanım sırası**

Sol menü → Insan Kaynaklari → Arac Servis / Yakit ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: TEST — Araç için tür service, kilometre 120, tutar 75 seçip Tamamla yapın. Araç kilometresi 120 ve ek maliyet 75 TL olmalıdır.

**Kapsam ve kullanım notları**

Kilometre önceki değerden küçük olamaz. Türler service=servis, fuel=yakıt, insurance=sigorta, other=diğer. Aynı tamamlanma tekrar maliyet eklememelidir.

Ayrıntılı rehber: [Arac Servis / Yakit](docs/rehber/vehicleServices.md).

<a id="modul-pos"></a>
### 25. POS Satislari

**Menü yolu:** Sol menü → Satis → POS Satislari

Ürün sepeti üzerinden kasada satış ve nakit/iyzico sandbox tahsilat akışını yürütür.

**Akış şeması**

```mermaid
flowchart TD
    A["Ürünü ara ve sepete ekle"] --> B["Cari ve ödeme yöntemini seç"]
    B --> C{"Ödeme yöntemi"}
    C -->|"Nakit"| D["Kasada tahsil et"]
    C -->|"iyzico Sandbox"| E["Hosted ödeme sayfası"]
    E --> D
    D --> F["Stok azalır"]
    D --> G["Bağlantılı fatura"]
    D --> H["Ödeme kaydı"]
```

**Alanlar ve kayıt içeriği**

- **Belge adi**: metin; zorunlu.
- **Cari**: ilişkili kayıt; zorunlu; Kisiler ekranındaki kayıttan seçilir.
- **Urun satirlari**: ürün satırları; zorunlu.

**Kullanım sırası**

Sol menü → Satis → POS Satislari ekranını açın. Ürünü arayın, sepete ekleyin ve kasa formunu tamamlayın.

- **Taslak** durumunda **Kasada tahsil et** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: stokta bulunan ürünü Sistem değil Satis → POS Satislari ekranında aratıp sepete ekleyin; cari ve Nakit seçip tahsil edin. Stok azalmalı, bağlantılı fatura ve ödeme kaydı oluşmalıdır.

**Kapsam ve kullanım notları**

Nakit demo kaydı gerçek para transferi değildir. iyzico Sandbox için ayarlar ve dış HTTPS dönüş adresi gerekir; kart verisi ERP formuna girilmez. Aynı isteğin tekrarı ikinci satış oluşturmamalıdır.

Ayrıntılı rehber: [POS Satislari](docs/rehber/pos.md).

<a id="modul-website"></a>
### 26. Web Sayfalari

**Menü yolu:** Sol menü → Web → Web Sayfalari

Ziyaretçi sayfalarını bloklarla hazırlar; taslakları ve yayımlanmış içerikleri yönetir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Yayinda: Yayinla
    Yayinda --> Yayinda: Taslağı düzenle + yeniden Yayinla
    Yayinda --> Taslak: Yayindan kaldir
    note right of Yayinda
        Taslak düzenlemek yayımdaki kopyayı değiştirmez.
        Değişiklik için yeniden Yayinla gerekir.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Adres yolu**: metin.
- **Sayfa bloklari**: sayfa blokları.

**Kullanım sırası**

Sol menü → Web → Web Sayfalari ekranını açın. Sayfa editöründe adı, adresi ve blokları düzenleyin; taslağı kaydedin.

- **Taslak** durumunda **Yayinla** işlemi kullanılabilir.
- **Yayın kaydı** durumunda **Yayinla** işlemi kullanılabilir.
- **Yayın kaydı** durumunda **Yayindan kaldir** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: Web → Web Sayfalari ekranında sayfa adı ve test-magaza adresi belirleyin. Kapak, metin ve ürün vitrini blokları ekleyip sürükleyin; Kaydet → Yayinla yapın.

**Kapsam ve kullanım notları**

Taslak düzenlemek yayımdaki kopyayı değiştirmez; yeniden Yayinla gerekir. Sayfa adresi küçük harf/rakam/tire olmalı ve benzersizdir. Gerekli ürünlerin Magazada yayinla seçimi yes olmalıdır.

Ayrıntılı rehber: [Web Sayfalari](docs/rehber/website.md).

<a id="modul-ecommerce"></a>
### 27. E-ticaret Siparisleri

**Menü yolu:** Sol menü → Web → E-ticaret Siparisleri

Mağaza vitrini, sepet, teslimat bilgileri ve ödeme ile bağlantılı çevrim içi siparişi yürütür.

**Akış şeması**

```mermaid
sequenceDiagram
    actor Z as Ziyaretçi
    participant M as Mağaza (Web Sayfası)
    participant A as API
    participant I as iyzico Sandbox
    participant S as Stok
    Z->>M: Ürün seç, sepete ekle, teslimat bilgisi gir
    M->>A: Siparişi gönder
    A->>A: Fiyatı sunucuda yeniden hesapla
    A->>I: Ödeme başlat
    A->>S: Stok rezervasyonu
    I-->>A: Dönüş (imza, tutar, para birimi doğrulanır)
    A-->>Z: Sipariş sonucu
    Note over A,S: Onayla → Sevk et → Fatura olustur<br/>fiziksel çıkış Sevk et adımında olur
```

**Alanlar ve kayıt içeriği**

- **Belge adi**: metin; zorunlu.
- **Cari**: ilişkili kayıt; zorunlu; Kisiler ekranındaki kayıttan seçilir.
- **Urun satirlari**: ürün satırları; zorunlu.

**Kullanım sırası**

Sol menü → Web → E-ticaret Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Onayla** işlemi kullanılabilir.
- **Onaylandı** durumunda **Sevk et** işlemi kullanılabilir.
- **Sevk edildi** durumunda **Fatura olustur** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: yayımlanmış mağazada bir ürün seçin, sepete ekleyin ve test teslimat bilgileri girin. Ödeme başlatılması stok rezervasyonu yapar; fiziksel çıkış sevkiyatta olur.

**Kapsam ve kullanım notları**

Sunucu ürün fiyatını yeniden hesaplar; ziyaretçinin değiştirdiği fiyat kabul edilmez. iyzico başarı dönüşü imza, tutar ve para birimiyle doğrulanır. Gerçek test hesabı ve erişilebilir HTTPS olmadan dış ödeme testi tamamlanmış sayılmaz.

Ayrıntılı rehber: [E-ticaret Siparisleri](docs/rehber/ecommerce.md).

<a id="modul-emailMarketing"></a>
### 28. E-posta Kampanyalari

**Menü yolu:** Sol menü → Pazarlama → E-posta Kampanyalari

İzinli alıcılarla e-posta kampanyası hazırlama ve SMTP gönderim sonuçlarını takip eder.

**Akış şeması**

```mermaid
flowchart LR
    T["Taslak"] -->|"Hazirla"| H["Hazır\n(izinli alıcılar belirlenir)"]
    H -->|"Kampanyayi gonder"| Q["Kuyruk"]
    Q --> W["E-posta işçisi"]
    W --> SMTP["SMTP"]
    SMTP --> R["Alıcı bazlı sonuç\nve kampanya özeti"]
    C["Kisiler:\nE-posta pazarlama izni = yes"] -.-> H
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Konu**: metin.
- **Icerik**: açıklama.

**Kullanım sırası**

Sol menü → Pazarlama → E-posta Kampanyalari ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Hazirla** işlemi kullanılabilir.
- **Hazır** durumunda **Kampanyayi gonder** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: test SMTP ayarını yöneticinin girmesinden sonra yalnızca izinli test carisiyle kampanya hazırlayın. Hazirla → Kampanyayi gonder sonrasında teslimatlar ve kampanya özeti sonunda tutarlı olmalıdır.

**Kapsam ve kullanım notları**

Gerçek e-posta gönderimi yan etkilidir; manuel denemede yalnızca size ait test alıcılarını kullanın. Pazarlama izni olmayan kişiler seçilmez. En fazla 500 benzersiz alıcı vardır. Ağ hatasında otomatik tekrar gönderim yoktur. Özet sayaçlar kuyruk bitince güncellenir; anlık gecikme olabilir.

Ayrıntılı rehber: [E-posta Kampanyalari](docs/rehber/emailMarketing.md).

<a id="modul-events"></a>
### 29. Etkinlikler

**Menü yolu:** Sol menü → Pazarlama → Etkinlikler

Tarihli ve kontenjanlı etkinlikler açar; ziyaretçi kayıtlarını toplar.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Yayinda: Yayinla
    Yayinda --> Tamamlandi: Tamamla
    Tamamlandi --> [*]
    note right of Yayinda
        Ziyaretçi kayıtları kabul edilir.
        Aynı e-posta iki kez kaydolamaz.
        Kapasite dolunca yeni kayıt reddedilir.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Kapasite**: sayısal değer.
- **Konum**: metin.
- **Baslangic**: tarih ve saat; zorunlu.
- **Bitis**: tarih ve saat; zorunlu.

**Kullanım sırası**

Sol menü → Pazarlama → Etkinlikler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Yayinla** işlemi kullanılabilir.
- **Yayın kaydı** durumunda **Tamamla** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: kapasitesi 1 olan TEST — Etkinlik yayımlayın. İlk test e-postasıyla kayıt kabul edilmeli; başka e-postayla ikinci kayıt kapasite nedeniyle reddedilmelidir.

**Kapsam ve kullanım notları**

Aynı e-posta iki kez kaydolamaz; kapasite 0/boş sınırsız anlamındadır. Bitiş başlangıçtan önce olamaz.

Ayrıntılı rehber: [Etkinlikler](docs/rehber/events.md).

<a id="modul-surveys"></a>
### 30. Anketler

**Menü yolu:** Sol menü → Pazarlama → Anketler

Yayımlanabilir soru formları oluşturur ve ziyaretçi cevaplarını gösterir.

**Durum şeması**

```mermaid
stateDiagram-v2
    [*] --> Taslak
    Taslak --> Yayinda: Yayinla
    Yayinda --> Kapali: closed
    Kapali --> [*]
    note right of Yayinda
        Ziyaretçi yanıtları toplanır.
        Aynı e-postayla ikinci yanıt reddedilir.
        Yanıtlar yetkili ayrıntı ekranında görünür.
    end note
```

**Alanlar ve kayıt içeriği**

- **Baslik**: metin; zorunlu.
- **Aciklama**: açıklama.
- **Tarih**: tarih.
- **Her satira bir soru**: açıklama; zorunlu.

**Kullanım sırası**

Sol menü → Pazarlama → Anketler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.

- **Taslak** durumunda **Yayinla** işlemi kullanılabilir.
- **Yayın kaydı** durumunda **closed** işlemi kullanılabilir.

**Örnek işlem ve beklenen sonuç**

Örnek: iki sorulu TEST — Anket yayımlayıp test e-postasıyla yanıtlayın. Cevaplar yetkili ayrıntı ekranında görünmeli; aynı e-postayla ikinci yanıt reddedilmelidir.

**Kapsam ve kullanım notları**

Her satır bir soru; 1–50 soru ve soru başına en fazla 500 karakter kullanılır. Gerçek kişisel veya hassas bilgiyi sorulara ve yanıtlara koymayın.

Ayrıntılı rehber: [Anketler](docs/rehber/surveys.md).

<a id="akislar"></a>
## Birbirine bağlı örnek iş akışları

### Satın almadan satış tahsilatına

Bu senaryo, ürünün ilk kez oluşturulduğu ve başlangıç stoğunun sıfır olduğu bir ortam içindir.

```mermaid
sequenceDiagram
    actor U as Kullanıcı
    participant K as Kişiler / Ürünler
    participant SA as Satın Alma
    participant ST as Stok
    participant SS as Satış Siparişi
    participant F as Faturalar
    participant FIS as Muhasebe Fişleri

    U->>K: TEST — Cari (both) ve TEST — Kalem
    U->>SA: 10 adet, 100 TL, KDV %20 (toplam 1.200 TL)
    U->>SA: Onayla (stok değişmez)
    U->>SA: Teslim al
    SA->>ST: +10 (stok 10)
    U->>SA: Tedarikçi faturası
    SA->>F: Taslak fatura 1.200 TL
    U->>F: Muhasebeleştir (ödeme isteğe bağlı)
    F->>FIS: Fatura fişi
    U->>SS: 2 adet, 150 TL, KDV %20 (toplam 360 TL)
    U->>SS: Onayla, Sevk et
    SS->>ST: -2 (stok 8)
    U->>SS: Fatura oluştur
    SS->>F: Taslak müşteri faturası 360 TL
    U->>F: Muhasebeleştir, Ödemeyi kaydet
    F->>FIS: Fatura fişi + ayrı ödeme fişi
```

1. **Satış → Kişiler:** `TEST — Cari` oluşturulur; türü `both` seçilir.
2. **Stok → Ürünler:** `TEST — Kalem` oluşturulur. Alış maliyeti 100 TL, satış fiyatı 150 TL, vergi %20 belirlenir.
3. **Tedarik → Satın Alma:** 10 adet ürün, 100 TL birim fiyat ve %20 KDV ile sipariş kaydedilir.
4. **Onayla:** Sipariş onaylanır; stok henüz değişmez.
5. **Teslim al:** Ana depoda 10 adet ürün oluşur.
6. **Tedarikçi faturası:** 1.200 TL toplamlı taslak tedarikçi faturası oluşturulur.
7. **Muhasebe → Faturalar:** Fatura muhasebeleştirilir, ardından istenirse manuel ödeme kaydı yapılır.
8. **Satış → Satış Siparişleri:** 2 adet ürün, 150 TL birim fiyat ve %20 KDV ile satış açılır.
9. **Onayla → Sevk et:** Satış ilerletilir; stok 10'dan 8'e iner.
10. **Fatura oluştur:** 360 TL toplamlı müşteri faturası açılır.
11. **Muhasebeleştir → Ödemeyi kaydet:** Fatura ve ödeme aşamaları tamamlanır.
12. **Muhasebe Fişleri:** Fatura ve ödeme için ayrı fişler görüntülenir.

Kontrol noktaları: satın alma toplamı 1.200 TL, satış toplamı 360 TL, kalan stok 8 adet ve her fişte toplam borç ile toplam alacak eşit olmalıdır. Örnek oran ve fiyatlar demo verisidir.

### Stoktan üretime

```mermaid
flowchart LR
    A["Bileşen ve mamul\nürün kartları"] --> B["Bileşen stoğu\n(satın alma veya sayım)"]
    B --> C["Reçete\n(1 mamul = gerekli bileşenler)"]
    C --> D["Üretim emri\n(taslak)"]
    D --> E["Onayla"]
    E --> F["Üretimi tamamla"]
    F --> G["Bileşenler azalır\nMamul artar"]
```

1. Bileşen ve mamul için ayrı ürün kartları açılır.
2. Bileşen stoğu satın alma veya sayım üzerinden oluşturulur.
3. Bir adet mamul için gereken bileşenler reçeteye yazılır.
4. Reçeteden üretim emri açılır veya emir elle oluşturulur.
5. Emir onaylanır; üretim miktarı ve depo gözden geçirilir.
6. Üretim tamamlanır; bileşenler azalır, mamul artar.

Örnek: bir set için iki kalem gerekiyorsa, bir set üretiminde iki kalem tüketilir. Üretim öncesindeki ve sonraki miktarlar hem ürün kartında hem stok hareketlerinde karşılaştırılır.

### Adaydan çalışan ve izin takibine

```mermaid
flowchart TD
    A["İşe Alım: demo aday"] --> B["Görüşme"]
    B --> C["Teklif"]
    B -.-> M["Sistem → AI Mülakat\n(ayrı akış, otomatik karar vermez)"]
    C --> D["İşe al / çalışan oluştur"]
    D --> E["Çalışan kartı\n(yıllık izin hakkı)"]
    E --> F["İzin talebi → Onaya gönder → Onayla"]
    F --> G["Kullanılan gün artar"]
    F -->|"İzni iptal et"| H["Kullanılan gün geri verilir"]
    E --> I["Puantaj ve zaman kaydı\n(ayrı ekranlar)"]
```

1. İşe Alım ekranında demo aday oluşturulur.
2. Görüşme ve teklif aşamaları yürütülür.
3. İstenirse ayrı AI Mülakat ekranında pozisyona göre bir görüşme hazırlanır.
4. İşe al işlemi çalışan kartı oluşturur.
5. Çalışanın yıllık izin hakkı kontrol edilir.
6. İzin talebi onaya gönderilir; onaydan sonra kullanılan günler güncellenir.
7. İzin iptal edilirse kullanılan günler geri verilir.
8. Aynı çalışan için puantaj ve proje zaman kaydı ayrı ekranlarda denenebilir.

AI mülakat ile İşe Alım kaydının durum ilerlemesi aynı işlem değildir. AI görüşmesinin tamamlanması adayı otomatik işe almaz.

### Projeden zaman maliyetine

```mermaid
flowchart LR
    P["Proje\n(Başlat)"] --> G["Görevler"]
    G --> Z["Zaman kaydı\nçalışan, tarih, saat, saatlik tutar"]
    Z --> O["Onaya gönder → Onayla"]
    O --> H["Hesaplanan tutar\n4 saat x 100 TL = 400 TL"]
    H --> S["Operasyon Özeti\nproje bazlı saat/tutar"]
    G --> T["Açık görevler tamamlanır"]
    T --> K["Proje: Tamamla"]
```

1. Proje oluşturulup başlatılır.
2. Projeye bağlı görevler eklenir.
3. Çalışan, tarih, proje, görev ve süreyle zaman kaydı girilir.
4. Faturalanabilir seçeneği ve saatlik tutar belirlenir.
5. Kayıt onaya gönderilip onaylanır.
6. Operasyon Özeti üzerinden proje bazlı saat/tutar takip edilir.
7. Açık görevler tamamlandıktan sonra proje kapatılır.

Dört saat ve 100 TL saatlik tutar, 400 TL hesaplanan çalışma tutarı üretir. Bu sonuç tek başına fatura veya maaş kaydı değildir.

### Web sayfasından mağaza siparişine

```mermaid
flowchart LR
    A["Ürünlerde Magazada yayinla = yes"] --> B["Web editörü:\nürün vitrini bloğu"]
    B --> C["Taslağı kaydet → Yayinla"]
    C --> D["Ziyaretçi sayfayı açar\nve sepet oluşturur"]
    D --> E["Teslimat bilgisi +\nödeme başlat"]
    E --> F["iyzico sandbox sonucu"]
    F --> G["E-ticaret siparişi\nOnayla → Sevk et → Fatura oluştur"]
```

1. Ürünlerin mağazada yayın seçimi ve fiyatları tamamlanır.
2. Web sayfası editöründe ürün vitrini bloğu eklenir.
3. Sayfa taslağı kaydedilir ve yayımlanır.
4. Ziyaretçi yayımlanan adresten ürünleri görür ve sepet oluşturur.
5. Teslimat bilgileriyle ödeme başlatılır.
6. iyzico sandbox sonucu uygulamaya yansır.
7. İlgili sipariş, fatura ve sevkiyat adımları takip edilir.

Sayfa taslağındaki değişiklikler yayımlanmış mağazaya ancak yeniden yayınlama sonrasında geçer. Dış ödeme senaryosu için sağlayıcı hesabı ve dışarıdan erişilebilen uygulama dönüş adresi gereklidir.

<a id="kullanicilar"></a>
## Kullanıcılar, roller ve uygulama ekranları

### Kullanıcı oluşturma

Yönetici, **Sistem → Kullanıcılar ve Roller → + Kullanıcı ekle** yolundan ad, e-posta, parola ve rolleri belirler. Modül kullanımında ister rolün varsayılanı kullanılabilir ister kişi için ayrı bir seçim yapılabilir. Gerçek çalışanlar yerine demo test hesapları oluşturulması, manuel denemelerin takibini kolaylaştırır.

| Rol | Temel kullanım alanı |
| --- | --- |
| `admin` | Kullanıcılar, ayarlar ve bütün uygulama alanları |
| `manager` | Operasyon alanlarının genel yönetimi |
| `sales` | Cari, ürün, CRM, satış, POS ve e-ticaret süreçleri |
| `purchaser` | Cari, ürün ve satın alma süreçleri |
| `accountant` | Cari, faturalar, muhasebe fişleri ve ilgili tahsilat ekranları |
| `warehouse` | Ürün, depo, sayım, transfer ve stok hareketleri |
| `production` | Üretim, reçeteler, ekipman ve bakım |
| `hr` | Çalışan, aday, izin, puantaj ve filo |
| `project` | Proje, görev ve zaman kayıtları |
| `marketing` | Web sayfaları, kampanyalar, anket ve etkinlik |

```mermaid
flowchart LR
    admin["admin"] --> ALL["Tüm alanlar ve ayarlar"]
    manager["manager"] --> OPS["Operasyon alanları"]
    sales["sales"] --> S1["Kişiler, Ürünler, CRM,\nSatış, POS, E-ticaret"]
    purchaser["purchaser"] --> S2["Kişiler, Ürünler, Satın Alma"]
    accountant["accountant"] --> S3["Kişiler, Faturalar,\nMuhasebe Fişleri, Tahsilat"]
    warehouse["warehouse"] --> S4["Ürünler, Depolar, Sayım,\nTransfer, Stok Hareketleri"]
    production["production"] --> S5["Reçeteler, Üretim,\nEkipman, Bakım"]
    hr["hr"] --> S6["Çalışan, İşe Alım, İzin,\nPuantaj, Filo"]
    project["project"] --> S7["Proje, Görev, Zaman Kaydı"]
    marketing["marketing"] --> S8["Web, Kampanya,\nAnket, Etkinlik"]
```

Bu tablo temel çalışma alanlarını özetler; güncel ekran tanımları `shared/modules.js` ve `shared/operations-schema.js` içindedir. Bir kullanıcıya birden fazla rol verilebilir. Örneğin satın alma ve fiziksel teslim alma görevlerini aynı kişi yapacaksa `purchaser` ve `warehouse` birlikte kullanılabilir. Ayrı personelle testte sipariş hazırlayan kişi ve depo teslimatını yapan kişi farklı hesaplar kullanır.

### Kişi bazında modül seçimi

Kullanıcı formunda her modül için **Rolden gelsin**, **Erişim yok**, **Sadece görüntüle** veya **Görüntüle ve işlem yap** seçenekleri bulunur. Muhasebe fişleri ve stok defteri gibi otomatik oluşan ekranlar elle belge oluşturma ekranına dönüşmez.

Rehber bilgisi için ayrı seçim bulunur: **Modül yetkisinden gelsin**, **Rehber bilgisine izin ver** ve **Rehber bilgisini engelle**. Bir çalışana farklı bir modülün kullanımını öğretmek için o modülün rehberi açılabilir. Bu, aynı modülün iş kayıtlarını kullanıcıya açmakla aynı seçim değildir.

### Genel bakış ve yardımcı ekranlar

- **Genel Bakış:** Modül kayıt sayıları ve ilgili operasyon kartları; muhasebe alanlarında mizan görünümü.
- **Operasyon Özeti:** Onaylı zamanlar ve izin gibi bazı süreçlerin özet sonuçları.
- **Tahsilat Takibi:** POS/e-ticaret ödeme kayıtları ve güncel sonuç sorgulaması.
- **Denetim Kayıtları:** İşlemlerin zamanı, türü, yapan hesabı ve ilgili kayıt bilgileri.
- **Kapsam Envanteri:** Uygulamadaki iş alanlarının ve modüllerin çalışma envanteri.
- **Ayarlar ve Entegrasyonlar:** Şirket, AI, ödeme, e-dönüşüm ve SMTP ayarları.
- **Parola Değiştir:** Kullanıcının kendi hesap parolasını değiştirme ekranı.

### Demo giriş bilgilendirmesi

Giriş ekranında demo veri bilgilendirmesi, tam metin bağlantısı ve kullanıcı talebiyle eklenen zorunlu kutu vardır. Tam metin `/kvkk` adresinde okunabilir. Proje bir demo olduğundan gerçek kişisel veriler yerine test verileri kullanılmalıdır. Bu metin, şirket/başvuru bilgileri tamamlanmış gerçek kullanım aydınlatması veya geçerli açık rıza elde edildiği iddiası taşımaz. Tam içerik [docs/KVKK-DEMO-METNI.md](docs/KVKK-DEMO-METNI.md) içindedir.

<a id="ai"></a>
## AI rehber ve mülakat kullanımı

### AI Rehber ne yapıyor?

**Sistem → AI Rehber** ekranında önce modül seçilir, ardından soru yazılır. Rehber; alanların doldurulması, işlem sırası, dikkat edilecek noktalar ve örnek sonuçlar gibi uygulama kullanım sorularını yanıtlar. Son eklenen içerik 30 modül için toplam **226 kaynak bölümü** içerir.

```mermaid
flowchart LR
    S["Kullanıcı:\nmodül seç + soru yaz"] --> Y{"AI ayarı var mı?"}
    Y -->|"Evet"| AI["Seçilen modülün rehber içeriği\n+ soru → yapılandırılan sağlayıcı"]
    Y -->|"Hayır"| L["Yerel rehber araması"]
    AI --> K["İlgili kaynak bölümleri seçilir"]
    L --> K
    K --> C["Cevap kaynak metinlerden gelir\nKullanılan bölüm adları görünür"]
```

Örnek sorular:

- Ürün eklemesi nasıl yapılır?
- Ürün eklerken hangi alanlara dikkat etmeliyim?
- Satın almada stoğun artması için hangi düğmeye basılır?
- Sayılan miktar alanına eklemek istediğim miktarı mı yazmalıyım?
- Ödenmiş faturaya yeniden ödeme yapılır mı?
- Üretim emrinde bileşen miktarları nasıl değerlendirilir?
- İzin iptal edilince çalışan bakiyesi nasıl değişir?
- Web sayfasını düzenledim, ziyaretçi neden eski hâlini görüyor?

Rehberin mevcut tasarımı, modelin ilgili kaynak bölümlerini seçmesine dayanır. Gösterilen cevap kaynak metinlerden gelir. Bu nedenle genel bir sohbet asistanı gibi her konuda serbest danışmanlık üretmesi veya canlı işletme verileri üzerinden analiz yapması beklenmemelidir. Cevabın altında kullanılan bölüm adları görünür.

AI ayarı yoksa uygulama yerel rehber araması kullanabilir. AI ayarı varsa seçilen modülün rehber içeriği ve soru, yapılandırılan sağlayıcıyla işlenir. Kullanıcının hangi modülün rehberini göreceği kullanıcı formundaki rehber seçimine bağlıdır.

### Rehber dosyaları

- `api/knowledge/guide.json`: Çalışan uygulamanın okuduğu rehber kaynağı.
- `docs/SISTEM-REHBERI.md`: Tam yönetici rehberi.
- `docs/rehber/*.md`: Modül bazında ayrılmış ayrıntılı Markdown belgeleri.

Sadece Markdown dosyasını değiştirmek, uygulamanın okuduğu JSON içeriğini kendiliğinden değiştirmez. İlgili kaynak bölümü JSON ile birlikte güncellenmeli, API imajı yeniden hazırlanmalı ve API yeniden başlatılmalıdır. Genişletilmiş rehber ve doküman dosyaları aynı içerik grubundan üretilmiştir; sonraki düzenlemelerde bu eşleşme korunmalıdır.

### OpenRouter veya uyumlu sağlayıcı ayarlama

1. Yönetici hesabıyla giriş yapın.
2. **Sistem → Ayarlar ve Entegrasyonlar** ekranını açın.
3. **AI / OpenRouter uyumlu API** sekmesini seçin.
4. API ana adresini, API anahtarını ve model kimliğini girin.
5. Önce **Ayarları kaydet**, sonra **Kayıtlı AI bağlantısını test et** kullanın.
6. AI Rehber ekranından modül seçip gerçek bir kullanım sorusu sorun.

OpenRouter ana adres örneği:

```text
https://openrouter.ai/api/v1
```

Ana adres alanına `/chat/completions` sonunu eklemeyin; uygulama bu yolu kendi ekler. API anahtarı alanına anahtarın kendisi yazılır. Model alanı sağlayıcının kullandığı tam model kimliğidir. Aynı protokolü uygulayan başka sağlayıcılar da kendi HTTPS ana adresi, anahtarı ve model adıyla kullanılabilir.

**Token parametresi** alanında `max_tokens` veya modelin gereksinimine göre `max_completion_tokens` seçilebilir. **Sıcaklık** alanı isteğe bağlıdır ve boş bırakılabilir. Sağlayıcı protokolünün uyumlu olması, her modelin her davranışının ayrıca denenmiş olduğu anlamına gelmez. Özellikle yanıt biçimi ve modelin çıktı üretme davranışı gerçek modelle kontrol edilmelidir.

### AI Mülakat nasıl çalışıyor?

**Sistem → AI Mülakat** ekranında pozisyon, görev gereksinimleri ve soru sayısı belirlenir. Soru sayısı 2–10 arasındadır. Gerekirse kayıtlı demo aday seçilir. Sistem ilk teknik soruyu oluşturur; adayın yazılı cevabından sonra yeni soru önceki yanıtları dikkate alır. Görüşme sonunda teknik gelişim geri bildirimi gösterilir.

```mermaid
sequenceDiagram
    actor Y as Yönetici
    participant UI as AI Mülakat ekranı
    participant API as API
    participant AI as AI sağlayıcı
    actor C as Aday
    Y->>UI: Pozisyon, gereksinimler, soru sayısı (2-10)
    UI->>API: Görüşme oluştur
    API->>AI: İlk teknik soru
    AI-->>API: Soru
    API-->>UI: Davet bağlantısı (24 saat)
    loop Soru sayısı kadar
        UI->>C: Soru (avatar + yerel Türkçe ses varsa)
        C->>API: Yazılı cevap (onayla ve ilet)
        API->>AI: Önceki yanıtlara göre yeni soru
    end
    API->>AI: Teknik gelişim geri bildirimi
    AI-->>UI: Geri bildirim
    Note over API: Kayıtlar 30 gün sonra temizlenir<br/>Otomatik işe alma / eleme / puanlama yoktur
```

Görüşmeci görünümü SVG/CSS ile hazırlanmış animasyonlu bir insan avatarıdır. Konuşma sırasında ağız/baş hareketleri bulunur. Tarayıcıda yerel Türkçe ses mevcutsa soru seslendirilebilir. Yerel ses bulunmuyorsa görüşme yazılı olarak devam eder. Bu sürüm gerçek insan videosu veya gerçek zamanlı video görüşme hizmeti değildir.

Mülakat ekranında şu işlemler bulunur:

- Yeni pozisyon ve görüşme oluşturma.
- Görüşmeyi listeden açma.
- Soruyu dinleme ve sesi durdurma.
- Yeni soruları otomatik seslendirme seçimi.
- Yazılı cevap gönderme.
- Soru/cevap geçmişini görüntüleme.
- Aday için görüşme bağlantısı oluşturma/yenileme.
- Görüşmeyi kapatma.

Davetler varsayılan olarak 24 saatliktir. Görüşme kayıtlarının 30 günlük temizlenme zamanı bulunur; veritabanı temizleme işlemi tam saniyesinde gerçekleşmeyebilir. AI'nın rolü soru ve teknik geri bildirim üretmektir. Adayı otomatik işe alma, eleme, sıralama veya genel aday puanlaması bu akışın parçası değildir.

<a id="entegrasyonlar"></a>
## Dış servis entegrasyonları

Sağlayıcı bilgileri uygulamanın yönetim ekranından girilir. AI, iyzico, NES ve SMTP için günlük kullanım ayarları `.env` dosyasına eklenmez. `.env`, temel uygulama/Atlas kurulumu içindir.

```mermaid
flowchart LR
    Y["Sistem → Ayarlar ve Entegrasyonlar"] --> A["Şirket ve belge bilgileri"]
    Y --> B["AI / OpenRouter uyumlu API"]
    Y --> C["iyzico Sandbox"]
    Y --> D["NES test e-dönüşüm"]
    Y --> E["SMTP"]
    B --> B1["AI Rehber, AI Mülakat"]
    C --> C1["POS, E-ticaret ödemeleri"]
    D --> D1["Fatura: UBL XML, durum, PDF"]
    E --> E1["E-posta Kampanyaları"]
```

### Şirket ve belge bilgileri

**Şirket ve belge bilgileri** sekmesinde ticari unvan, vergi bilgileri, adres, şehir, ülke, iletişim ve fatura seri ön eki yer alır. E-belge örneklerinde seri ön eki üç büyük harftir. Demo senaryolarında test bilgileri kullanılır. Bu alanları doldurmak projenin gerçek bir şirket için bütün belge süreçlerini otomatik tamamladığı anlamına gelmez.

### iyzico Sandbox

iyzico bağlantısı POS ve e-ticaret ödeme akışlarında kullanılır. Yönetici **iyzico Sandbox** sekmesine API anahtarı, gizli anahtar ve HTTPS uygulama adresini girer. Kart işlemleri sağlayıcının hosted ödeme sayfasında yürür. Ödeme durumu, ilgili sipariş/fatura ve Tahsilat Takibi ekranında izlenir.

Önemli çalışma ayrımları:

- Nakit seçimi uygulama içi tahsilat kaydıdır.
- iyzico Sandbox test ortamıdır; canlı tahsilat entegrasyonu olarak sunulmaz.
- Mağaza ödemesi ve fiziksel sevkiyat ayrı adımlardır.
- Sağlayıcının dönüş yapacağı adres dışarıdan erişilebilir olmalıdır; yalnızca yerel localhost adresi sağlayıcının ulaşabileceği bir adres değildir.
- Gerçek bir sandbox senaryosu, kullanıcının kendi hesabıyla ödeme başlangıcı ve dönüşü birlikte denenerek tamamlanır.

### NES test e-dönüşüm

NES bağlantısı; temel e-Fatura/e-Arşiv XML hazırlama, test ortamına gönderme, belge durumunu sorgulama ve PDF alma işlemleri için bulunur. Ayarlar sekmesinde Bearer API anahtarı, gönderici etiketi, varsayılan alıcı etiketi ve kaynak uygulama adı yer alır.

Fatura ayrıntısındaki belge alanından belge türü seçilir. UBL XML hazırlığı numara ve UUID üretir. Sonraki gönderim/durum/PDF işlemleri NES test servisleriyle yürür. Yerel yazdırılabilir fatura görünümü, NES tarafından oluşturulmuş resmî bir e-belgeyle aynı çıktı değildir.

Bu sürümün UBL kapsamı temel TRY/SATIŞ/KDV'li fatura senaryosudur. İstisna, tevkifat ve iade gibi ek belge senaryoları ayrı geliştirme başlıklarıdır. Teknik servis belgeleri: [NES geliştirici test dokümanları](https://developertest.nes.com.tr/docs).

### SMTP ve e-posta pazarlama

SMTP ayarları; sunucu, port, bağlantı türü, kullanıcı, parola, gönderen adresi/adı ve abonelikten çıkış için uygulama adresinden oluşur. Kayıt sonrasında **Kayıtlı SMTP bağlantısını test et** kullanılabilir.

Kampanyada alıcılar, cari kartındaki e-posta pazarlama izni ve adres bilgisine göre belirlenir. Gönderimler kuyrukta sırayla işlenir. Her alıcının sonucu ve kampanya toplamları ayrı takip edilir. Teslimat listesi tamamlandıktan sonra kampanya özetinin güncellenmesi kısa bir süre alabilir.

Bağlantı testinin geçmesi bütün e-postaların alıcıya ulaşacağı anlamına gelmez. Manuel testte size ait alıcılarla gerçek teslimat ayrıca kontrol edilmelidir. Otomatik senaryolarda kullanılan `.invalid` alan adları, dışarıya gerçek e-posta göndermeden hata takibini denemek içindir.

<a id="kurulum"></a>
## Docker kurulumu ve günlük kullanım

```mermaid
flowchart TD
    A["Docker Desktop açık"] --> B[".env hazırla\n(Atlas bağlantısı, yönetici)"]
    B --> C[".env.test hazırla\n(ayrı test veritabanı)"]
    C --> D["Ready.ps1"]
    D --> D1["Docker ve Compose kontrolü"]
    D1 --> D2["Test imajı + birim testleri"]
    D2 --> D3["React derlemesi"]
    D3 --> D4["API kabul testleri\n(ayrı Atlas veritabanı)"]
    D4 --> D5["Uygulama ve izleme servisleri açılır"]
    D5 --> D6["HTTP, WAF, izleme kontrolleri"]
    D6 --> R["readiness-result.json\nok=true, running=false"]
    R --> S["Sonraki günlerde: Start.ps1"]
```

### Gerekli bileşenler

- Linux konteyner motoru çalışan Docker Desktop.
- `compose.acceptance.yaml` içindeki birleştirme özelliklerini destekleyen güncel Docker Compose.
- MongoDB Atlas üzerinde uygulama ve ayrı kabul testi veritabanı.
- Windows PowerShell; `.cmd` yardımcı dosyaları isteğe bağlıdır.
- İlk konteyner imajları ve paketlerin indirilebilmesi için internet bağlantısı.

Node.js veya MongoDB sunucusunu bilgisayara ayrıca kurmayın. Projenin derleme ve test adımları Docker içinde çalışır. İlk çalıştırmada imaj indirmeleri nedeniyle sonraki çalıştırmalara göre daha uzun bekleme olabilir. Kullanılacak bellek, uygulama ile birlikte izleme servislerini de çalıştıracak şekilde ayrılmalıdır.

### 1. Proje klasörünü açma

PowerShell'i proje klasöründe açın veya örnek yerel çalışma yoluna geçin:

```powershell
Set-Location "C:\Projects\atlas-erp"
```

Başka bir bilgisayarda bu yolu kendi proje dizininizle değiştirin.

### 2. Temel ortam dosyasını hazırlama

`.env.example` dosyasını `.env` olarak kopyalayın. Dosya zaten hazırlanmışsa üzerine yazmayın. Temel alanlar:

| Alan | Açıklama |
| --- | --- |
| `MONGODB_URI` | Atlas bağlantı adresi |
| `MONGODB_DB` | Uygulamanın iş veritabanı adı |
| `COLLECTION_PREFIX` | Koleksiyonların ortak ön eki; varsayılan `atlas_erp_` |
| `ADMIN_EMAIL` | İlk yönetici hesabının e-postası |
| `ADMIN_PASSWORD` | İlk yönetici hesabının parolası |
| `COMPANY_NAME` | Uygulamada gösterilecek çalışma alanı adı |
| `APP_PORT` | Uygulamanın yerel portu; varsayılan `8080` |

Örnek alanlar gerçek bağlantı/parola değildir:

```dotenv
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=atlas_erp
COLLECTION_PREFIX=atlas_erp_
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=BURAYA_YENI_DEMO_PAROLASI
COMPANY_NAME=Demo ERP
APP_PORT=8080
```

İlk yönetici bilgileri ilk veritabanı başlangıcında kullanılır. Hesap oluştuktan sonra yalnızca `.env` parolasını değiştirmek mevcut kullanıcı parolasını değiştirmez. Mevcut bilgisayardaki giriş bilgileri `LOCAL-ACCESS.txt` dosyasında bulunur; README içinde gerçek hesap bilgileri yayınlanmaz.

Atlas kullanıcısının seçilen veritabanlarında işlem yapabilmesi ve çalıştıran bilgisayarın Atlas bağlantı koşullarını karşılaması gerekir. Yerel `.env` dosyasında veritabanı adı değiştirmek eski kayıtları yeni ada taşımaz.

### 3. Kabul testi veritabanını ayırma

`.env.test` dosyası `.env` ile aynı temel alanları kullanır; ancak veritabanı ayrı olmalıdır. Örnek:

```dotenv
MONGODB_DB=erp_db_acceptance
```

Diğer gerekli bağlantı/yönetici alanlarını da bu dosyada tamamlayın. Betikler test veritabanı adında `test` veya `acceptance` bulunmasını bekler. Testler iş kayıtları oluşturur; ana iş veritabanını test veritabanı olarak kullanmayın. Test ortamında oluşturulan kayıtlar normalde otomatik temizlenmez.

### 4. İlk tam çalıştırma

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Ready.ps1"
```

`RemoteSigned` seçeneği bu açılan PowerShell işlemi için kullanılır; sistemin kalıcı ayarını değiştirmez. Alternatif olarak `Ready.cmd` açılabilir.

Betik sırasıyla Docker erişimini ve Compose tanımını kontrol eder, test imajını üretir, birim testlerini çalıştırır, React'i derler, Docker'da üretilen lock dosyasını projeye alır, ayrı Atlas veritabanında API kabul testlerini çalıştırır ve uygulama/izleme servislerini açar. Son olarak HTTP, WAF ve izleme kontrollerini yürütür.

Sonuçlar `readiness-result.json` ve `readiness.log` dosyalarına yazılır. JSON içinde `running=false` ve `ok=true` tamamlanmış başarılı çalıştırmayı belirtir. Komutun yalnızca başlamış olması veya konteynerlerin oluşturulması, bütün testlerin tamamlandığı anlamına gelmez.

### 5. Normal açılış

Kurulum ve derleme daha önce tamamlandıysa:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Start.ps1"
```

Veya `Start.cmd` dosyasını açın. Bu yol API kabul testlerini yeniden çalıştırmaz. Yeni kaynak kodu eklendiyse yalnızca normal açılışla eski imajı kullanmak yerine `Ready.ps1` ile yeniden derleyin.

### 6. Kabul testlerini atlayarak yeniden derleme

Yalnızca son değişikliklerin kapsamı bunu uygun kılıyorsa:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Ready.ps1" -SkipAcceptance
```

Bu seçenek API kabul senaryolarını çalıştırmaz; birim testleri, arayüz derlemesi, uygulama başlangıcı ve son kontroller devam eder. Sunucu iş akışları değiştiğinde tam kabul testinin yerini almaz.

### 7. Yerel adresler

- Yönetim uygulaması: [http://localhost:8080](http://localhost:8080)
- Grafana: [http://localhost:3001](http://localhost:3001)
- Demo bilgilendirme sayfası: [http://localhost:8080/kvkk](http://localhost:8080/kvkk)

`APP_PORT` değiştirildiyse uygulama adreslerinde o portu kullanın. Mağaza, anket, etkinlik ve mülakat adresleri ilgili kayıttan açılır; her kayıt için aynı sabit bağlantı kullanılmaz.

### 8. Durumu görme, günlük okuma ve kapatma

```powershell
docker compose ps
```

```powershell
docker compose logs --tail 100 api web waf
```

```powershell
docker compose logs --tail 100 prometheus loki alloy grafana
```

```powershell
docker compose down
```

Normal `down`, Atlas'taki iş kayıtlarını silmez. Yerel kalıcı servis verileri Docker volume'lerinde tutulur. Tüm kalıcı volume'leri silen komutlar günlük kapatma yöntemi olarak kullanılmamalıdır; bunların kaybı bazı ayarların tekrar kullanımını ve izleme geçmişini etkileyebilir.

### Sık karşılaşılan çalıştırma durumları

**Docker motoru bulunamadı:** Docker Desktop'ı açın ve Linux motorunun hazır olmasını bekleyin. Terminalde `docker info` çalıştırarak motorun yanıt verdiğini kontrol edin.

**Konteyner oluşturuldu ama uygulama henüz açılmıyor:** `Waiting` geçici başlangıç durumudur. `Healthy` beklenir; yine de tarayıcıdan ana sayfa ve API kontrolü ayrıca yapılır. `Ready.ps1` bu son kontrolü içerir.

**alloy-storage Exited:** Bu servis yalnızca Alloy çalışma klasörünü hazırlayan tek seferlik yardımcıdır. Başarıyla tamamlandıktan sonra kapanması normaldir; sürekli açık kalması beklenmez.

**Tarayıcı eski ekranı gösteriyor:** Yeni imajın derlendiğini kontrol edin ve sayfada `Ctrl+F5` kullanın. Yeni rehber için API'nin de güncel içerikle yeniden başlaması gerekir.

**API bağlantısı veya Atlas başlangıcı tamamlanamıyor:** Veritabanı adı, Atlas URI'si, veritabanı kullanıcısı ve Atlas bağlantı yapılandırmasını kontrol edin. `api` konteyner günlüğü başlangıç durumunu gösterir.

**502 yanıtı:** WAF/web/API zincirini ve `docker compose ps` sonucunu kontrol edin. Projedeki Nginx tanımları servis adresi değişikliklerini yeniden çözümleyecek şekilde düzenlenmiştir. Sorun sürüyorsa `Ready.ps1` sonucu ve `api web waf` günlükleri birlikte incelenmelidir.

<a id="izleme"></a>
## WAF ve izleme servisleri

```mermaid
flowchart LR
    T["Tarayıcı"] --> WAF["WAF\nModSecurity + CRS"]
    WAF --> WEB["Web (Nginx)"]
    WAF --> API["API"]
    API -->|"metrikler"| P["Prometheus"]
    WAF -->|"nginx-prometheus-exporter"| P
    API -->|"günlükler"| AL["Alloy"]
    WEB -->|"günlükler"| AL
    WAF -->|"günlükler"| AL
    AL --> L["Loki"]
    P --> G["Grafana\nAtlas ERP panosu"]
    L --> G
```

### ModSecurity WAF

Uygulamaya gelen web trafiği ModSecurity ve OWASP Core Rule Set kullanan WAF servisinden geçer. WAF uygulamanın önünde çalışır; React ekranlarını veya ERP iş akışlarını yazan bileşen değildir. Docker tanımı `infra/waf/Dockerfile`, Nginx ve kural yapılandırmaları `infra/waf/` altındadır.

Mevcut CRS imajı `4.30.0-nginx-alpine-202611090911` etiketiyle tanımlanmıştır. Kural motoru açıktır ve proje yapılandırmasında seviye 2 ayarlanmıştır. Otomatik kontrol SQL enjeksiyonu, XSS ve dizin geçişi örneklerinin WAF tarafından engellenmesini dener. Bu örneklerin geçmesi WAF'ın bütün olası durumlarının test edildiği anlamına gelmez.

### Prometheus

Prometheus API ve WAF exporter metriklerini toplar. İstek sayıları, sonuç kodları, istek süreleri, süreç belleği, çalışma süresi ve Nginx ölçümleri panolarda kullanılabilir. Metrik saklama ayarı 7 gün ve 512 MB boyut sınırıyla tanımlanmıştır.

### Alloy ve Loki

Alloy; API, web ve WAF günlüklerini ilgili Docker volume'lerinden okuyup Loki'ye iletir. Loki bu günlükleri etiketleri üzerinden sorgulanabilir hâle getirir. Günlük saklama yapılandırması 72 saattir. `alloy-storage`, Alloy'un çalışma alanını hazırlayıp kapanan yardımcı servistir.

### Grafana

Grafana veri kaynakları ve Atlas ERP panosu dosyalarla hazırlanır. Başlangıçta Prometheus ve Loki kaynakları eklenir. Pano; servis durumu, trafik, gecikme, süreç belleği, bazı sonuç kodları, günlükler ve uyarıları birlikte incelemek için kullanılır.

Grafana hesabının yerel bilgileri `LOCAL-MONITORING.txt` dosyasındadır. ERP kullanıcısı oluşturmak Grafana kullanıcısı oluşturmaz; iki uygulamanın girişleri ayrıdır. Bu sürümde pano uyarıları bulunur, ancak otomatik e-posta/SMS alarm gönderimi ayrıca yapılandırılmış değildir.

<a id="testler"></a>
## Testler, demo sıfırlama ve dokümanlar

### Test katmanları

```mermaid
flowchart TB
    U["Birim ve protokol testleri\n(tutar, durum, belge, sağlayıcı biçimleri)"] --> K["API kabul testleri\n(ayrı Atlas veritabanı, WAF üzerinden HTTP)"]
    K --> B["Başlatma ve izleme kontrolleri\n(API sağlık, React, WAF, Prometheus, Loki, Grafana)"]
    B --> M["Manuel testler\n(ekran, roller, sürükle-bırak, avatar sesi, gerçek sağlayıcı hesapları)"]
```

**Birim ve protokol testleri:** Tutar hesapları, durumlar, belge hazırlığı, sağlayıcı istek/yanıt biçimleri ve uygulama yardımcılarının beklenen davranışlarını dener.

**API kabul testleri:** Ayrı Atlas test veritabanında gerçek HTTP çağrılarıyla cari/ürün, satın alma, satış, stok, muhasebe, üretim, İK, proje, mağaza ve diğer akışları yürütür. AI için izole bir test sağlayıcısı kullanılabilir. Kabul trafiği WAF üzerinden gider.

**Başlatma ve izleme kontrolleri:** Ana API sağlık yanıtı, React ana sayfası, WAF örnekleri, Prometheus hedefleri, Loki günlük akışı ve Grafana sağlık durumunu kontrol eder.

**Manuel testler:** Form kullanımı, liste işlemleri, rol bazında çalışma, sürükle-bırak, avatar sesi, gerçek sağlayıcı hesabı ve kullanıcının ekranda gördüğü sonuçlar üzerinden ayrıca yapılır. Derlemenin geçmesi bu ekran denemelerinin hepsinin yapıldığı anlamına gelmez.

### Test komutları

Yalnızca birim/protokol testleri:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Test.ps1"
```

Yalnızca ayrı Atlas veritabanındaki API kabul testleri:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Acceptance.ps1"
```

Tam süreç için `Ready.ps1` kullanılır. Test paketleri bilgisayara kurulmaz; test imajında bulunur.

### Son kayıtlı doğrulama ve kapsamı

16 Kasım 2026 tarihinde MongoDB Node.js sürücüsü 7.9.0'a güncellenmiştir. Bu güncellemede Docker içinde 50 birim testi, 227 HTTP kabul kontrolü, React derlemesi ve eşzamanlı parola değişimi/oturum regresyonu başarılı olmuştur. Kabul testleri geçici yerel MongoDB replica setinde, sahte AI sağlayıcısıyla ve gerçek hesaplar kullanılmadan çalıştırılmıştır; bu çalıştırmanın kabul trafiği WAF üzerinden geçmez. Doğrulanan API sürümü başlatılmış ve uygulamanın WAF üzerinden HTTP sağlık kontrolü geçmiştir. Sonuç `mongodb-upgrade-result.json`, ayrıntılar `mongodb-upgrade.log` dosyasındadır.

Bu güncelleme testlerinde iyzico/NES'e gerçek gönderim ve dışarıya e-posta gönderimi yapılmamıştır. Önceki manuel sağlayıcı testleri ayrı doğrulamalardır; aşağıdaki 15 Kasım kaydı da önceki sürümün tarihsel sonucudur.

15 Kasım 2026 tarihinde kaydedilen çalıştırmalarda 34 birim testi, 213 HTTP kabul kontrolü, React derlemesi ve HTTP/WAF/izleme kontrolleri başarılı olmuştur. HTTP kabul sayısı kampanya durumunu beklerken yapılan ek sorgulara göre değişebilir; sabit bir test fonksiyonu sayısı olarak yorumlanmamalıdır.

Bu sonuç, daha sonra eklenen **226 bölümlük rehber genişletmesinin** ve **Reset-Demo bakım komutunun** aynı testte çalıştırıldığı anlamına gelmez. Rehberin kapsam/sözdizimi kontrolleri yapılmış, sıfırlama komutu hazırlanmıştır; gerçek sıfırlama sonucu kendi sonuç dosyası üzerinden ayrıca doğrulanır. Yeni bir kod değişikliği, eski başarılı test kaydını kendiliğinden güncel test kanıtına dönüştürmez.

Gerçek iyzico/NES/SMTP işlemleri ile kullanılan AI modelinin davranışı, kullanıcının kendi test hesaplarıyla ayrıca denenmelidir. AI rehber için OpenRouter üzerinden manuel yanıt alınmıştır; bu, bütün modellerin ve mülakat senaryolarının tamamının denendiği anlamına gelmez. Bazı model/sağlayıcı yanıtlarında boş metin durumu görülmüştür; kullanılan modelle soru çeşitliliği ayrıca kontrol edilmelidir.

### Demo iş verilerini sıfırlama

Bu komut normal başlatma değildir; mevcut şirketin demo iş kayıtlarını siler. İlk kez kullanmadan önce [demo sıfırlama belgesini](docs/DEMO-SIFIRLAMA.md) okuyun.

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Reset-Demo.ps1"
```

```mermaid
flowchart TD
    A["API ve rehber içeriği\nDocker'da hazırlanır"] --> B["API ve e-posta işçisi durdurulur"]
    B --> C["İş kayıtları\n.private/backups/ altına yedeklenir"]
    C --> D["Yedek dosyaları ve\nkayıt sayıları doğrulanır"]
    D --> E["İş kayıtları ve bağlantılı\nödeme/form/mülakat/gönderim kayıtları sıfırlanır"]
    E --> F["Kullanıcılar, roller, ayarlar,\ndenetim geçmişi, belge sayaçları korunur"]
    F --> G["Uygulama tekrar başlatılır"]
    G --> H["reset-demo-result.json\nok=true, appReady=true"]
```

Süreç:

1. Güncel API ve rehber içeriği Docker'da hazırlanır.
2. API ve e-posta işçisi durdurulur.
3. Demo şirkete ait iş kayıtları `.private/backups/` altına yedeklenir.
4. Yedek dosyaları ve kayıt sayıları doğrulanır.
5. İş kayıtları ve bağlantılı ödeme/form/mülakat/gönderim kayıtları sıfırlanır.
6. Kullanıcılar, roller, ayarlar, denetim geçmişi ve belge numara sayaçları korunur.
7. Uygulama tekrar başlatılır.

Sonuç dosyası `reset-demo-result.json`, günlük `reset-demo.log` dosyasıdır. Başarılı bakım ve yeniden başlatma için hem `ok=true` hem `appReady=true` beklenir. İş ekranları boşalırken kullanıcıların ve AI/iyzico/NES/SMTP ayarlarının kalması beklenen davranıştır.

Belge numara sayaçları korunur; bu nedenle yeni belge numaraları her zaman birden başlamaz. Yerel demo sıfırlama, dış sağlayıcıda daha önce oluşmuş belgeleri/işlemleri silmez. Yedekten geri yükleme otomatik yapılmaz; bakım belgesinde açıklanan ayrı bir işlem gerektirir.

### Manuel test için önerilen sıra

1. Adminle test kullanıcılarının oluşturulması.
2. Muhasebeci, İK, satış, satın alma, depo, üretim, proje ve pazarlama hesaplarının açılması.
3. Her hesapta ilgili menülerin ve rehber kapsamının kontrolü.
4. Cari ve ürün kartlarının hazırlanması.
5. Satın alma, depoya kabul ve tedarikçi faturası.
6. Satış, sevkiyat, müşteri faturası ve ödeme.
7. Muhasebe fişleri ve stok hareketlerinin karşılaştırılması.
8. Sayım ve depolar arası transfer.
9. Reçete ve üretim.
10. Aday, AI mülakat, çalışan, izin ve puantaj.
11. Proje, görev ve zaman kayıtları.
12. Ekipman/bakım ve araç/servis.
13. Web editörü, yayın ve mağaza.
14. POS ve dış sağlayıcı sandbox işlemleri.
15. E-posta, anket ve etkinlik.
16. Özet ekranları, çıktılar ve izleme panosu.

Her aşamada beklenen ilk bakiye, işlemden sonraki durum ve bağlantılı belge kontrol edilmelidir. Bir testin kayıtları sonraki testin başlangıcını değiştiriyorsa, örnek rakamları aynen uygulamadan önce mevcut miktarları not edin.

### Proje dokümanları

| Belge | İçerik |
| --- | --- |
| [Sistem rehberi](docs/SISTEM-REHBERI.md) | Tüm modüllerin ayrıntılı kullanım bölümleri |
| [Modül rehberleri](docs/rehber/products.md) | Modül bazındaki rehberlere örnek; diğerleri aynı klasörde |
| [Modül kapsamı](docs/MODULLER.md) | Seçilen iş alanları ve temel davranışlar |
| [Entegrasyonlar](docs/ENTEGRASYONLAR.md) | Sağlayıcı ayarları ve test senaryoları |
| [Yeni sürüm kontrolleri](docs/YENI-SURUM-TESTLERI.md) | Yeni ekranların ve AI özelliklerinin kullanım notları |
| [Doğrulama kaydı](docs/DOGRULAMA.md) | Tarihli önceki doğrulama açıklamaları |
| [Demo sıfırlama](docs/DEMO-SIFIRLAMA.md) | Yedekleme ve iş kayıtlarını sıfırlama süreci |
| [Demo bilgilendirme metni](docs/KVKK-DEMO-METNI.md) | Giriş ekranındaki tam bilgilendirme |
| [Kapsam analizi](docs/ANALIZ.md) | Modül kapsamı ve iş alanı analizi |
| [Kapsam notları](docs/KAPSAM.md) | İlk kapsam ve ileri geliştirme başlıkları |

Bazı kapsam/doğrulama dosyaları önceki sürüm tarihlerini taşır. Güncel bir çalıştırma değerlendirilirken dosyanın tarihi ve o çalıştırmanın `readiness-result.json` içeriği birlikte okunmalıdır.

<a id="sinirlar"></a>
