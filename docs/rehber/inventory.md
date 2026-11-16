# Stok → Stok Hareketleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Stok Hareketleri — Stok defteri

Sol menu → Stok → Stok Hareketleri. Giris pozitif, cikis negatif miktardir. Depolar arasi transfer iki hareket olusturur ve toplam stogu degistirmez. Kayitlar is akislarindan olusur; deftere elle kayit eklenmez.

Kaynak: inventory.1; kapsam: inventory

## Stok Hareketleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Stok Hareketleri. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: inventory.detail.erisim; kapsam: inventory

## Stok Hareketleri — Alanlar nasıl doldurulur?

Bu ekran iş akışlarından otomatik oluşan kayıtları gösterir; elle kayıt ekleme alanı yoktur.

Kaynak: inventory.detail.alanlar; kapsam: inventory

## Stok Hareketleri — Adım adım kullanım

Sol menü → Stok → Stok Hareketleri ekranını açın. Kaydı adından arayın, Ayrinti ile kaynak ve satırlarını inceleyin.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: inventory.detail.adimlar; kapsam: inventory

## Stok Hareketleri — Dikkat edilmesi gerekenler ve sık hatalar

Stok hareketleri salt okunurdur. Fatura oluşturmak, ödemek veya taslak sipariş kaydetmek stok hareketi üretmez. Kayıtları ve kaynak belgeyi birlikte kontrol edin.

Kaynak: inventory.detail.dikkat; kapsam: inventory

## Stok Hareketleri — Örnek senaryo ve beklenen sonuç

Örnek: 10 adet satın alma girişi ve 2 adet satış çıkışı sonrasında hareketler +10 ve -2, ürün bakiyesi 8 olmalıdır.

Kaynak: inventory.detail.ornek; kapsam: inventory

## Stok Hareketleri — İşlemden sonra ne kontrol edilir?

Kaynak belge ve otomatik satırları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: inventory.detail.kontrol; kapsam: inventory
