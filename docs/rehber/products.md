# Stok → Urunler

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Urunler — Urun olusturma

Sol menu → Stok → Urunler → Yeni kayit. Ad, benzersiz stok kodu, KDV haric satis/alish fiyati ve vergi yuzdesi girilir. Yeni urunun stogu sifirdir; stok alimi veya sayimla olusur.

Kaynak: products.1; kapsam: products

## Urunler — Stok ve magaza

Toplam stok depo hareketlerinden hesaplanir. Magazada yayinla=yes, urunu yayinlanan sitenin vitrinine acar. Rezerve stok satilabilir bakiyeyi dusurur.

Kaynak: products.2; kapsam: products

## Urunler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Urunler. Standart roller: sales, purchaser, warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: products.detail.erisim; kapsam: products

## Urunler — Alanlar nasıl doldurulur?

Urun adi: zorunlu.
Stok kodu: zorunlu.
Satis fiyati: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Alis maliyeti: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Vergi %: zorunlu.
Magazada yayinla: isteğe bağlı. Seçenekler: yes, no.
Urun aciklamasi: isteğe bağlı.
HTTPS gorsel adresi: isteğe bağlı.

Kaynak: products.detail.alanlar; kapsam: products

## Urunler — Adım adım kullanım

Sol menü → Stok → Urunler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: products.detail.adimlar; kapsam: products

## Urunler — Dikkat edilmesi gerekenler ve sık hatalar

Ürün eklerken benzersiz ve anlamlı stok kodu, doğru ad, KDV hariç fiyat, doğru vergi yüzdesi ve mağazada yayın seçimini kontrol edin. Fiyatlara KDV ekleyerek yazmayın. Başlangıç stoğunu ürün formundan vermeyin; satın alma veya sayım kullanın. Aynı ürüne ikinci kart açmak yerine mevcut kartı bulun. Mağazada yayınla=yes yalnızca yayımlanan mağazada gösterim içindir; ürünü oluşturmak tek başına siteyi yayımlamaz.

Kaynak: products.detail.dikkat; kapsam: products

## Urunler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Kalem; Stok kodu=TEST-KALEM-001; Alış maliyeti=100; Satış fiyatı=150; Vergi %=20. Kaydet sonrasında stok 0 olmalıdır.

Kaynak: products.detail.ornek; kapsam: products

## Urunler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: products.detail.kontrol; kapsam: products
