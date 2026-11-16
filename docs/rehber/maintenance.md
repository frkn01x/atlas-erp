# Uretim → Bakim

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Bakim — Bakim talebi

Sol menu → Uretim → Bakim. Ekipman, oncelik ve maliyet girilir. Baslat ve Tamamla ile ilerler. Tamamlanma zamani ve maliyet ekipman kartina islenir.

Kaynak: maintenance.1; kapsam: maintenance

## Bakim — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Bakim. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: maintenance.detail.erisim; kapsam: maintenance

## Bakim — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Ekipman: isteğe bağlı.
Teknisyen: isteğe bağlı.
Ekipman: zorunlu. Arama kutusuna adını yazın; ardından Ekipmanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Oncelik: zorunlu. Seçenekler: normal, high, urgent.
Bakim maliyeti: isteğe bağlı. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.

Kaynak: maintenance.detail.alanlar; kapsam: maintenance

## Bakim — Adım adım kullanım

Sol menü → Uretim → Bakim ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: maintenance.detail.adimlar; kapsam: maintenance

## Bakim — Dikkat edilmesi gerekenler ve sık hatalar

Gerekli ekipman ilişkisini seçin; serbest açıklama ekipman seçiminin yerine geçmez. Bakım maliyeti otomatik fatura veya muhasebe fişi üretmez.

Kaynak: maintenance.detail.dikkat; kapsam: maintenance

## Bakim — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Makine için 50 TL maliyetli bakım oluşturun. Baslat → Tamamla sonrasında ekipman toplam bakım maliyeti 50 TL artmalıdır.

Kaynak: maintenance.detail.ornek; kapsam: maintenance

## Bakim — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: maintenance.detail.kontrol; kapsam: maintenance
