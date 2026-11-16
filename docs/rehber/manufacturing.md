# Uretim → Uretim Emirleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Uretim Emirleri — Uretim emri

Sol menu → Uretim → Uretim Emirleri. Mamul, uretim miktari, birim bilesenler ve depo girilir. Onayla ardindan Uretimi tamamla kullanilir. Bilesenler miktar kadar tuketilir, mamul girisi olusur. Yetersiz malzemede tum islem geri alinir.

Kaynak: manufacturing.1; kapsam: manufacturing

## Uretim Emirleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Uretim Emirleri. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: manufacturing.detail.erisim; kapsam: manufacturing

## Uretim Emirleri — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Mamul: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Miktar: zorunlu.
Recete bilesenleri: zorunlu. Bileşen ürününü ve birim mamul için gereken pozitif miktarı girin.
Urun recetesi: isteğe bağlı. Arama kutusuna adını yazın; ardından Urun Receteleri listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Depo: isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: manufacturing.detail.alanlar; kapsam: manufacturing

## Uretim Emirleri — Adım adım kullanım

Sol menü → Uretim → Uretim Emirleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Uretimi tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: manufacturing.detail.adimlar; kapsam: manufacturing

## Uretim Emirleri — Dikkat edilmesi gerekenler ve sık hatalar

Onaylamak tüketim değildir. Bileşenlerden biri yetersizse hiçbir bileşen tüketilmemeli ve mamul girişi olmamalıdır. Doğru üretim deposunu kontrol edin.

Kaynak: manufacturing.detail.dikkat; kapsam: manufacturing

## Uretim Emirleri — Örnek senaryo ve beklenen sonuç

Örnek: 2 kalem tüketen reçeteden 1 set üretin. Onayla → Uretimi tamamla sonrasında kalem 2 azalır, set 1 artar.

Kaynak: manufacturing.detail.ornek; kapsam: manufacturing

## Uretim Emirleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: manufacturing.detail.kontrol; kapsam: manufacturing
