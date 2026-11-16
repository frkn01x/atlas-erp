# Satis → POS Satislari

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## POS Satislari — Kasa sepeti

Sol menu → Satis → POS Satislari. Urun ara, sepete ekle ve cari sec. Nakit kaydi veya iyzico Sandbox secip Tahsil et kullan. Fiyat ve vergi sunucudan hesaplanir; ayni istek iki satis olusturmaz.

Kaynak: pos.1; kapsam: pos

## POS Satislari — Odeme sonucu

Nakit uygulama icinde kayittir, kart cekimi degildir. iyzico kart bilgileri saglayicinin sayfasinda girilir. Dogrulanmis basarili sonucta stok, fatura ve muhasebe kaydi olusur. Tahsilat Takibi odeme sonucunu sorgular.

Kaynak: pos.2; kapsam: pos

## POS Satislari — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → POS Satislari. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: pos.detail.erisim; kapsam: pos

## POS Satislari — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.

Kaynak: pos.detail.alanlar; kapsam: pos

## POS Satislari — Adım adım kullanım

Sol menü → Satis → POS Satislari ekranını açın. Ürünü arayın, sepete ekleyin ve kasa formunu tamamlayın.
Taslak durumunda: Kasada tahsil et.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: pos.detail.adimlar; kapsam: pos

## POS Satislari — Dikkat edilmesi gerekenler ve sık hatalar

Nakit demo kaydı gerçek para transferi değildir. iyzico Sandbox için ayarlar ve dış HTTPS dönüş adresi gerekir; kart verisi ERP formuna girilmez. Aynı isteğin tekrarı ikinci satış oluşturmamalıdır.

Kaynak: pos.detail.dikkat; kapsam: pos

## POS Satislari — Örnek senaryo ve beklenen sonuç

Örnek: stokta bulunan ürünü Sistem değil Satis → POS Satislari ekranında aratıp sepete ekleyin; cari ve Nakit seçip tahsil edin. Stok azalmalı, bağlantılı fatura ve ödeme kaydı oluşmalıdır.

Kaynak: pos.detail.ornek; kapsam: pos

## POS Satislari — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: pos.detail.kontrol; kapsam: pos
