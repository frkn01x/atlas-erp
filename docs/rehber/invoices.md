# Muhasebe → Faturalar

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Faturalar — Fatura olusturma

Sol menu → Muhasebe → Faturalar. Musteri veya tedarikci faturasi olusturulur. Urun miktari × KDV haric birim fiyat ara toplami; satir bazli vergi genel toplami verir.

Kaynak: invoices.1; kapsam: invoices

## Faturalar — Muhasebe ve odeme

Satirdaki Muhasebelestir dugmesi borc/alacak dengeli fis olusturur. Sonraki Odemeyi kaydet dugmesi tam odeme kaydi acar; bu dugme bankadan para gondermez. Ikinci odeme ve taslak faturaya odeme engellenir. Odenmemis faturaya ters kayit yapilabilir.

Kaynak: invoices.2; kapsam: invoices

## Faturalar — Belge ciktilari

Ayrinti panelinde yazdirilabilir fatura ve NES test dugmeleri bulunur. UBL XML indir once belge numarasi/UUID ayirir. NES test ortamına gonder, durum sorgula ve PDF indir islemleri hesap ayarlari tamamlandiginda kullanilir. Yerel yazdirma resmi e-belge degildir.

Kaynak: invoices.3; kapsam: invoices

## Faturalar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Muhasebe → Faturalar. Standart roller: accountant; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: invoices.detail.erisim; kapsam: invoices

## Faturalar — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.
Fatura turu: zorunlu. Seçenekler: customer, vendor.

Kaynak: invoices.detail.alanlar; kapsam: invoices

## Faturalar — Adım adım kullanım

Sol menü → Muhasebe → Faturalar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Muhasebelestir.
Muhasebelesti durumunda: Odemeyi kaydet.
Muhasebelesti durumunda: Ters kayit.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: invoices.detail.adimlar; kapsam: invoices

## Faturalar — Dikkat edilmesi gerekenler ve sık hatalar

Sipariş faturası zaten oluşturulduysa Yeni kayit ile ikinci kez kesmeyin. customer müşteri, vendor tedarikçi faturasıdır. Taslağa ödeme kaydı yapılamaz. Ödeme düğmesi manuel muhasebe kaydıdır, bankadan para göndermez veya kart çekmez. Ödenmiş faturaya ikinci ödeme uygulanmamalıdır. NES işlemleri ayrı test hesabı ve şirket/vergi bilgilerinin tamamlanmasını gerektirir; yerel çıktı resmî e-fatura değildir.

Kaynak: invoices.detail.dikkat; kapsam: invoices

## Faturalar — Örnek senaryo ve beklenen sonuç

Örnek: satıştan oluşan 360 TL taslak faturayı Muhasebelestir yapın; fatura fişinin borç ve alacak toplamı ayrı ayrı 360 TL olmalı. Odemeyi kaydet sonrasında durum Ödendi olur ve ayrıca ödeme fişi oluşur.

Kaynak: invoices.detail.ornek; kapsam: invoices

## Faturalar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: invoices.detail.kontrol; kapsam: invoices
