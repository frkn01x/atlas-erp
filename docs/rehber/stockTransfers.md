# Stok → Depolar Arasi Transfer

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Depolar Arasi Transfer — Depolar arasi transfer

Sol menu → Stok → Depolar Arasi Transfer. Urun, miktar ve iki depo secin. Cikis veya giris deposu bos ise ana depo kullanilir; ayni depolar kabul edilmez. Transfer et dugmesi cikis ve girisi atomik yapar; toplam stok sabit kalir.

Kaynak: stockTransfers.1; kapsam: stockTransfers

## Depolar Arasi Transfer — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Depolar Arasi Transfer. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: stockTransfers.detail.erisim; kapsam: stockTransfers

## Depolar Arasi Transfer — Alanlar nasıl doldurulur?

Transfer adi: zorunlu.
Urun: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Miktar: zorunlu.
Cikis deposu (bos: ana): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Giris deposu (bos: ana): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: stockTransfers.detail.alanlar; kapsam: stockTransfers

## Depolar Arasi Transfer — Adım adım kullanım

Sol menü → Stok → Depolar Arasi Transfer ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Transfer et.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: stockTransfers.detail.adimlar; kapsam: stockTransfers

## Depolar Arasi Transfer — Dikkat edilmesi gerekenler ve sık hatalar

Miktar pozitif olmalı, depolar aynı olmamalı ve çıkış deposunda yeterli stok olmalıdır. Boş depo ana depo demektir; iki tarafı da boş bırakmayın.

Kaynak: stockTransfers.detail.dikkat; kapsam: stockTransfers

## Depolar Arasi Transfer — Örnek senaryo ve beklenen sonuç

Örnek: ana depoda 12 adet üründen 3 adedi TEST — Şube Deposu’na aktarın. Ana depo 9, şube 3, toplam 12 olmalıdır.

Kaynak: stockTransfers.detail.ornek; kapsam: stockTransfers

## Depolar Arasi Transfer — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: stockTransfers.detail.kontrol; kapsam: stockTransfers
