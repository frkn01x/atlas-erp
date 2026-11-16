# Satis → Satis Siparisleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Satis Siparisleri — Satis akisi

Sol menu → Satis → Satis Siparisleri → Yeni kayit. Cari, urun, miktar, birim fiyat ve vergi secin. Kayittan sonra Onayla, Sevk et ve Fatura olustur dugmeleri satirda sirayla gorunur. Ayrinti paneli aciksa islem sonrasi kapanmaz.

Kaynak: sales.1; kapsam: sales

## Satis Siparisleri — Sevkiyat kurallari

Depo bos ise ana depo kullanilir. Sevk etmek icin satis islem iznine ek depo islem yetkisi gerekir. Kullanilabilir stok yetersizse islem butunuyle geri alinir. Onayli belge satirlari degistirilemez.

Kaynak: sales.2; kapsam: sales

## Satis Siparisleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → Satis Siparisleri. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: sales.detail.erisim; kapsam: sales

## Satis Siparisleri — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.
Depo (bos: ana depo): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: sales.detail.alanlar; kapsam: sales

## Satis Siparisleri — Adım adım kullanım

Sol menü → Satis → Satis Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Sevk et.
Sevk edildi durumunda: Fatura olustur.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: sales.detail.adimlar; kapsam: sales

## Satis Siparisleri — Dikkat edilmesi gerekenler ve sık hatalar

Siparişi kaydetmek/onaylamak stoğu düşürmez; fiziksel stok Sevk et ile değişir. Sevk için depo işlem yetkisi ve yeterli kullanılabilir stok gerekir. Onaydan sonra satırları değiştirmeyin. Fatura oluşturmak tahsilat yapmaz; muhasebeci fatura ve ödeme adımını yürütür.

Kaynak: sales.detail.dikkat; kapsam: sales

## Satis Siparisleri — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Satış; TEST — Cari; TEST — Kalem 2 adet, birim fiyat 150, vergi %20. Ara toplam 300, vergi 60, toplam 360 TL. Onayla → Sevk et sonrasında 10 adet stok 8’e iner; Fatura olustur taslak müşteri faturası açar.

Kaynak: sales.detail.ornek; kapsam: sales

## Satis Siparisleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: sales.detail.kontrol; kapsam: sales
