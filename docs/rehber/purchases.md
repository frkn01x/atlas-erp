# Tedarik → Satin Alma

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Satin Alma — Satin alma kaydi

Sol menu → Tedarik → Satin Alma → Yeni kayit. Belge adi, cari, urun satirlari ve depo girilir. Depo bos ise ana depo kullanilir. Fiyatlar KDV harictir.

Kaynak: purchases.1; kapsam: purchases

## Satin Alma — Onay ve teslim alma

Kayit satirindaki Onayla dugmesini kullanin. Durum degistiginde ayni satirda Teslim al gorunur. Bir kez teslim alinir; tekrar stok girisi engellenir. Teslim alma stok bakiyesini ve stok hareketini birlikte olusturur.

Kaynak: purchases.2; kapsam: purchases

## Satin Alma — Tedarikci faturasi

Teslim alinan kayitta Tedarikci faturasi dugmesi taslak fatura acar. Muhasebe islerini o module yetkili kullanici takip eder. Bir siparise tekrar fatura olusturulamaz.

Kaynak: purchases.3; kapsam: purchases

## Satin Alma — Nereden açılır ve hangi yetki gerekir?

Sol menü → Tedarik → Satin Alma. Standart roller: purchaser; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: purchases.detail.erisim; kapsam: purchases

## Satin Alma — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.
Depo (bos: ana depo): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: purchases.detail.alanlar; kapsam: purchases

## Satin Alma — Adım adım kullanım

Sol menü → Tedarik → Satin Alma ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Teslim al.
Teslim alindi durumunda: Tedarikci faturasi.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: purchases.detail.adimlar; kapsam: purchases

## Satin Alma — Dikkat edilmesi gerekenler ve sık hatalar

Taslak kaydetmek veya yalnızca onaylamak stok girişi değildir. Teslim al için Stok/Depolar Arası Transfer modülünde de işlem yetkisi gerekir. Teslim alınan siparişi tekrar teslim almayın; aynı hareket iki kez işlenmemelidir. Fatura oluşturmak muhasebeleştirme veya banka ödemesi değildir.

Kaynak: purchases.detail.dikkat; kapsam: purchases

## Satin Alma — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Satın Alma; TEST — Cari; TEST — Kalem 10 adet, birim fiyat 100 ve vergi %20. Ara toplam 1.000, vergi 200, toplam 1.200 TL olur. Onayla → Teslim al sonrasında ana depodaki stok 0’dan 10’a çıkar. Tedarikci faturasi ile taslak fatura oluşur.

Kaynak: purchases.detail.ornek; kapsam: purchases

## Satin Alma — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: purchases.detail.kontrol; kapsam: purchases
