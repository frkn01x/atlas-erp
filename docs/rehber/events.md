# Pazarlama → Etkinlikler

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Etkinlikler — Etkinlik kaydi

Sol menu → Pazarlama → Etkinlikler. Tarih, konum ve kontenjan girilir; yayinlaninca ziyaretci formu acilir. Ayni e-posta ikinci kez kaydolamaz; kontenjan dolunca yeni kayit reddedilir. Kontenjan 0/bos ise sinirsizdir.

Kaynak: events.1; kapsam: events

## Etkinlikler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Pazarlama → Etkinlikler. Standart roller: marketing; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: events.detail.erisim; kapsam: events

## Etkinlikler — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Kapasite: isteğe bağlı.
Konum: isteğe bağlı.
Baslangic: zorunlu. Tarih ve saati birlikte seçin.
Bitis: zorunlu. Tarih ve saati birlikte seçin.

Kaynak: events.detail.alanlar; kapsam: events

## Etkinlikler — Adım adım kullanım

Sol menü → Pazarlama → Etkinlikler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Yayinla.
Yayin kaydi durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: events.detail.adimlar; kapsam: events

## Etkinlikler — Dikkat edilmesi gerekenler ve sık hatalar

Aynı e-posta iki kez kaydolamaz; kapasite 0/boş sınırsız anlamındadır. Bitiş başlangıçtan önce olamaz.

Kaynak: events.detail.dikkat; kapsam: events

## Etkinlikler — Örnek senaryo ve beklenen sonuç

Örnek: kapasitesi 1 olan TEST — Etkinlik yayımlayın. İlk test e-postasıyla kayıt kabul edilmeli; başka e-postayla ikinci kayıt kapasite nedeniyle reddedilmelidir.

Kaynak: events.detail.ornek; kapsam: events

## Etkinlikler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: events.detail.kontrol; kapsam: events
