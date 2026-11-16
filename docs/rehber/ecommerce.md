# Web → E-ticaret Siparisleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## E-ticaret Siparisleri — Magaza ve siparis

Urunler ekraninda Magazada yayinla=yes olan urunler yayinlanan web sitesinin vitrinine cikar. Ziyaretci sepete urun ekler ve alici/teslimat formunu doldurur. Fiyat istemciden kabul edilmez.

Kaynak: ecommerce.1; kapsam: ecommerce

## E-ticaret Siparisleri — Stok rezervasyonu

Odeme baslatilinca ana depoda stok rezerve edilir. Basarili iyzico sonucu imza, tutar, para birimi ve siparis kimligiyle dogrulanir. Siparis sevkiyata hazir hale gelir; stok fiziksel sevkiyatta duser. Dogrulanmis basarisiz odemede rezervasyon kalkar.

Kaynak: ecommerce.2; kapsam: ecommerce

## E-ticaret Siparisleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Web → E-ticaret Siparisleri. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: ecommerce.detail.erisim; kapsam: ecommerce

## E-ticaret Siparisleri — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.

Kaynak: ecommerce.detail.alanlar; kapsam: ecommerce

## E-ticaret Siparisleri — Adım adım kullanım

Sol menü → Web → E-ticaret Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Sevk et.
Sevk edildi durumunda: Fatura olustur.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: ecommerce.detail.adimlar; kapsam: ecommerce

## E-ticaret Siparisleri — Dikkat edilmesi gerekenler ve sık hatalar

Sunucu ürün fiyatını yeniden hesaplar; ziyaretçinin değiştirdiği fiyat kabul edilmez. iyzico başarı dönüşü imza, tutar ve para birimiyle doğrulanır. Gerçek test hesabı ve erişilebilir HTTPS olmadan dış ödeme testi tamamlanmış sayılmaz.

Kaynak: ecommerce.detail.dikkat; kapsam: ecommerce

## E-ticaret Siparisleri — Örnek senaryo ve beklenen sonuç

Örnek: yayımlanmış mağazada bir ürün seçin, sepete ekleyin ve test teslimat bilgileri girin. Ödeme başlatılması stok rezervasyonu yapar; fiziksel çıkış sevkiyatta olur.

Kaynak: ecommerce.detail.ornek; kapsam: ecommerce

## E-ticaret Siparisleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: ecommerce.detail.kontrol; kapsam: ecommerce
