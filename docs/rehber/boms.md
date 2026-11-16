# Uretim → Urun Receteleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Urun Receteleri — Birim urun recetesi

Sol menu → Uretim → Urun Receteleri. Mamul ve bir adet mamul icin gerekli bilesen/miktarlar tanimlanir. Mamul kendi bileseni olamaz. Uretim emri ac dugmesi bir emri taslak olarak olusturur.

Kaynak: boms.1; kapsam: boms

## Urun Receteleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Urun Receteleri. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: boms.detail.erisim; kapsam: boms

## Urun Receteleri — Alanlar nasıl doldurulur?

Recete adi: zorunlu.
Mamul: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Birim mamul bilesenleri: zorunlu. Bileşen ürününü ve birim mamul için gereken pozitif miktarı girin.

Kaynak: boms.detail.alanlar; kapsam: boms

## Urun Receteleri — Adım adım kullanım

Sol menü → Uretim → Urun Receteleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Uretim emri ac.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: boms.detail.adimlar; kapsam: boms

## Urun Receteleri — Dikkat edilmesi gerekenler ve sık hatalar

Mamul kendi bileşeni olamaz. Bileşen miktarları bir birim mamul içindir; üretim miktarıyla çarpılır. Reçete kaydetmek stok tüketmez.

Kaynak: boms.detail.dikkat; kapsam: boms

## Urun Receteleri — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Set mamulü için bir adet mamulde 2 adet TEST — Kalem kullanacak reçete kaydedin. Uretim emri ac bir adet mamul için taslak emir oluşturur.

Kaynak: boms.detail.ornek; kapsam: boms

## Urun Receteleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: boms.detail.kontrol; kapsam: boms
