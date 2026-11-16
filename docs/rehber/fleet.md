# Insan Kaynaklari → Arac Filosu

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Arac Filosu — Arac filosu

Sol menu → Insan Kaynaklari → Arac Filosu. Plaka, kilometre, surucu, sigorta ve muayene tarihleri tutulur. Toplam maliyet ve kilometre servis/yakit kayitlariyla ilerler.

Kaynak: fleet.1; kapsam: fleet

## Arac Filosu — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Arac Filosu. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: fleet.detail.erisim; kapsam: fleet

## Arac Filosu — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Plaka: zorunlu.
Kilometre: isteğe bağlı.
Surucu: isteğe bağlı.
Surucu: isteğe bağlı. Arama kutusuna adını yazın; ardından Calisanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Sigorta bitisi: isteğe bağlı. Takvimden tarih seçin.
Muayene tarihi: isteğe bağlı. Takvimden tarih seçin.

Kaynak: fleet.detail.alanlar; kapsam: fleet

## Arac Filosu — Adım adım kullanım

Sol menü → Insan Kaynaklari → Arac Filosu ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: fleet.detail.adimlar; kapsam: fleet

## Arac Filosu — Dikkat edilmesi gerekenler ve sık hatalar

Araçtaki maliyet ve kilometre servis/yakıt kayıtlarından ilerler. Sigorta/muayene tarihini kaydetmek otomatik uyarı göndermez.

Kaynak: fleet.detail.dikkat; kapsam: fleet

## Arac Filosu — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Araç, plaka TEST-001 ve kilometre 100. Sonraki servis kaydı 120 kilometre ve 75 TL ise araç toplam maliyeti 75 TL artmalıdır.

Kaynak: fleet.detail.ornek; kapsam: fleet

## Arac Filosu — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: fleet.detail.kontrol; kapsam: fleet
