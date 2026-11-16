# Stok → Depolar

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Depolar — Depo kartlari

Sol menu → Stok → Depolar → Yeni kayit. Depo adi ve adresi kaydedilir. Siparis/transfer formlarinda depo secilir; bos birakilan depo ana depoyu belirtir.

Kaynak: warehouses.1; kapsam: warehouses

## Depolar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Depolar. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: warehouses.detail.erisim; kapsam: warehouses

## Depolar — Alanlar nasıl doldurulur?

Depo adi: zorunlu.
Adres: isteğe bağlı.

Kaynak: warehouses.detail.alanlar; kapsam: warehouses

## Depolar — Adım adım kullanım

Sol menü → Stok → Depolar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: warehouses.detail.adimlar; kapsam: warehouses

## Depolar — Dikkat edilmesi gerekenler ve sık hatalar

Depo kartı oluşturmak stok taşımaz. Stok taşıma ayrı transfer işlemiyle yapılır.

Kaynak: warehouses.detail.dikkat; kapsam: warehouses

## Depolar — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Şube Deposu oluşturun. Siparişte depo boş kalırsa bu yeni depoya değil ana depoya işlem yapılır.

Kaynak: warehouses.detail.ornek; kapsam: warehouses

## Depolar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: warehouses.detail.kontrol; kapsam: warehouses
