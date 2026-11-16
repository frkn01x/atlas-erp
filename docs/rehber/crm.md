# Satis → CRM / Firsatlar

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## CRM / Firsatlar — Firsat asamalari

Sol menu → Satis → CRM / Firsatlar. Firsat olusturun; nitelendirme, teklif, kazanildi/kaybedildi asamalarini satir dugmelerinden ilerletin.

Kaynak: crm.1; kapsam: crm

## CRM / Firsatlar — Teklif donusumu

Cari ve urun satirlari dolduruldugunda Satis teklifi olustur dugmesi satis kaydi acar. Bir firsat ikinci defa teklife donusturulemez.

Kaynak: crm.2; kapsam: crm

## CRM / Firsatlar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → CRM / Firsatlar. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: crm.detail.erisim; kapsam: crm

## CRM / Firsatlar — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Musteri: isteğe bağlı. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Beklenen gelir: isteğe bağlı. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Teklif urunleri: isteğe bağlı. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.

Kaynak: crm.detail.alanlar; kapsam: crm

## CRM / Firsatlar — Adım adım kullanım

Sol menü → Satis → CRM / Firsatlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Nitelikli.
Taslak durumunda: Kaybedildi.
Nitelikli durumunda: Teklif.
Nitelikli durumunda: Kaybedildi.
Teklif durumunda: Satis teklifi olustur.
Teklif durumunda: Kazanildi.
Teklif durumunda: Kaybedildi.
Kazanildi durumunda: Satis teklifi olustur.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: crm.detail.adimlar; kapsam: crm

## CRM / Firsatlar — Dikkat edilmesi gerekenler ve sık hatalar

Fırsatın kazanılması tek başına stok veya muhasebe hareketi oluşturmaz. Satış teklifi için cari ve ürün satırları gereklidir; aynı fırsat ikinci kez teklife dönüşmez.

Kaynak: crm.detail.dikkat; kapsam: crm

## CRM / Firsatlar — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Fırsat için müşteri, ürün ve tutar belirleyin. Nitelikli/teklif aşamalarından ilerleyip Satis teklifi olustur kullanın. Satış siparişlerinde bağlantılı kayıt görünmelidir.

Kaynak: crm.detail.ornek; kapsam: crm

## CRM / Firsatlar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: crm.detail.kontrol; kapsam: crm
