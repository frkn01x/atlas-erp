# Satis → Kisiler

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Kisiler — Cari karti

Sol menu → Satis → Kisiler → Yeni kayit. Ad/unvan girin; kind alani customer=musteri, vendor=tedarikci, both=ikisidir. Vergi ve adres bilgilerini burada tamamlayin.

Kaynak: contacts.1; kapsam: contacts

## Kisiler — Pazarlama izni

E-posta pazarlama izni yes ise kisi kampanyaya dahil edilebilir. Izin yoksa gonderilmez. Abonelikten cikis kisinin iznini kaldirir.

Kaynak: contacts.2; kapsam: contacts

## Kisiler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → Kisiler. Standart roller: sales, purchaser, accountant, hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: contacts.detail.erisim; kapsam: contacts

## Kisiler — Alanlar nasıl doldurulur?

Ad / unvan: zorunlu.
E-posta: isteğe bağlı.
Telefon: isteğe bağlı.
Vergi no: isteğe bağlı.
Adres: isteğe bağlı.
Tur: zorunlu. Seçenekler: customer, vendor, both.
Soyadi: isteğe bağlı.
Il: isteğe bağlı.
Ilce: isteğe bağlı.
Ulke: isteğe bağlı.
Posta kodu: isteğe bağlı.
e-Fatura alici etiketi: isteğe bağlı.
E-posta pazarlama izni: isteğe bağlı. Seçenekler: yes, no.

Kaynak: contacts.detail.alanlar; kapsam: contacts

## Kisiler — Adım adım kullanım

Sol menü → Satis → Kisiler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: contacts.detail.adimlar; kapsam: contacts

## Kisiler — Dikkat edilmesi gerekenler ve sık hatalar

Cari oluşturmak stok, fatura veya ödeme üretmez. Aynı isim yerine doğru kartı seçtiğinizi vergi ve iletişim bilgileriyle kontrol edin.

Kaynak: contacts.detail.dikkat; kapsam: contacts

## Kisiler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Cari adıyla bir kayıt açın; Tür=both seçin. Böylece aynı cari müşteri ve tedarikçi olarak kullanılabilir. E-posta pazarlama iznini gerçekten izin yoksa no bırakın.

Kaynak: contacts.detail.ornek; kapsam: contacts

## Kisiler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: contacts.detail.kontrol; kapsam: contacts
