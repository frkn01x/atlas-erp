# Stok → Stok Sayimi / Acilis

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Stok Sayimi / Acilis — Sayim ve acilis

Sol menu → Stok → Stok Sayimi / Acilis. Urun, depo ve sayilan miktar girin; Sayimi uygula dugmesini kullanin. Sayilan miktar eklenecek miktar degil, islem sonundaki hedef bakiyedir. Rezerve stokun altina dusulemez.

Kaynak: stockAdjustments.1; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Stok Sayimi / Acilis. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: stockAdjustments.detail.erisim; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Alanlar nasıl doldurulur?

Sayim adi: zorunlu.
Urun: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Depo (bos: ana depo): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Sayilan miktar: zorunlu.

Kaynak: stockAdjustments.detail.alanlar; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Adım adım kullanım

Sol menü → Stok → Stok Sayimi / Acilis ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Sayimi uygula.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: stockAdjustments.detail.adimlar; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Dikkat edilmesi gerekenler ve sık hatalar

Sayım alanı eklenecek miktar değil hedef toplam bakiyedir. Yanlış depoda sayım yapmayın; rezervasyon altına düşen sayım reddedilir.

Kaynak: stockAdjustments.detail.dikkat; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Örnek senaryo ve beklenen sonuç

Örnek: stoğu 8 olan üründe Sayilan miktar=12 girip Sayimi uygula yapın. Sonuç 20 değil 12, oluşan fark hareketi +4 olmalıdır.

Kaynak: stockAdjustments.detail.ornek; kapsam: stockAdjustments

## Stok Sayimi / Acilis — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: stockAdjustments.detail.kontrol; kapsam: stockAdjustments
