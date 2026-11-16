# Insan Kaynaklari → Arac Servis / Yakit

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Arac Servis / Yakit — Servis ve yakit

Sol menu → Insan Kaynaklari → Arac Servis / Yakit. Arac, tarih, kilometre, tur ve tutar girilir. Tamamla maliyeti araca ekler. Geriye giden kilometre reddedilir.

Kaynak: vehicleServices.1; kapsam: vehicleServices

## Arac Servis / Yakit — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Arac Servis / Yakit. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: vehicleServices.detail.erisim; kapsam: vehicleServices

## Arac Servis / Yakit — Alanlar nasıl doldurulur?

Islem adi: zorunlu.
Arac: zorunlu. Arama kutusuna adını yazın; ardından Arac Filosu listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Tarih: zorunlu. Takvimden tarih seçin.
Kilometre: zorunlu.
Tutar: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Tur: zorunlu. Seçenekler: service, fuel, insurance, other.

Kaynak: vehicleServices.detail.alanlar; kapsam: vehicleServices

## Arac Servis / Yakit — Adım adım kullanım

Sol menü → Insan Kaynaklari → Arac Servis / Yakit ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: vehicleServices.detail.adimlar; kapsam: vehicleServices

## Arac Servis / Yakit — Dikkat edilmesi gerekenler ve sık hatalar

Kilometre önceki değerden küçük olamaz. Türler service=servis, fuel=yakıt, insurance=sigorta, other=diğer. Aynı tamamlanma tekrar maliyet eklememelidir.

Kaynak: vehicleServices.detail.dikkat; kapsam: vehicleServices

## Arac Servis / Yakit — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Araç için tür service, kilometre 120, tutar 75 seçip Tamamla yapın. Araç kilometresi 120 ve ek maliyet 75 TL olmalıdır.

Kaynak: vehicleServices.detail.ornek; kapsam: vehicleServices

## Arac Servis / Yakit — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: vehicleServices.detail.kontrol; kapsam: vehicleServices
