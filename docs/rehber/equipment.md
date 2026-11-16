# Uretim → Ekipmanlar

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Ekipmanlar — Ekipman karti

Sol menu → Uretim → Ekipmanlar. Ad, seri no, konum ve sonraki bakim tarihi tutulur. Bakim tamamlandikca son bakim ve toplam maliyet uygulama tarafindan guncellenir.

Kaynak: equipment.1; kapsam: equipment

## Ekipmanlar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Ekipmanlar. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: equipment.detail.erisim; kapsam: equipment

## Ekipmanlar — Alanlar nasıl doldurulur?

Ekipman adi: zorunlu.
Seri no: isteğe bağlı.
Konum: isteğe bağlı.
Sonraki bakim: isteğe bağlı. Takvimden tarih seçin.

Kaynak: equipment.detail.alanlar; kapsam: equipment

## Ekipmanlar — Adım adım kullanım

Sol menü → Uretim → Ekipmanlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Arsivle.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: equipment.detail.adimlar; kapsam: equipment

## Ekipmanlar — Dikkat edilmesi gerekenler ve sık hatalar

Son bakım ve toplam bakım maliyeti tamamlanan bakım kayıtlarından güncellenir. Kart oluşturmak otomatik bakım planı veya bildirim kurmaz.

Kaynak: equipment.detail.dikkat; kapsam: equipment

## Ekipmanlar — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Makine, seri no TEST-SERI-01, konum Atölye. Yeni kart oluşturmak bakım harcaması yaratmaz.

Kaynak: equipment.detail.ornek; kapsam: equipment

## Ekipmanlar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: equipment.detail.kontrol; kapsam: equipment
