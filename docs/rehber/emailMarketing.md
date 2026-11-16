# Pazarlama → E-posta Kampanyalari

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## E-posta Kampanyalari — SMTP ve izin

Yonetici Ayarlar/Entegrasyonlar ekraninda SMTP/TLS, gonderen ve HTTPS abonelikten cikis adresini tanimlar. E-posta pazarlama izni=yes ve gecerli e-postasi olan cariler kampanyaya dahil edilir.

Kaynak: emailMarketing.1; kapsam: emailMarketing

## E-posta Kampanyalari — Kampanya kuyrugu

Kampanya konusu/duz metni yazilir, Hazirla ardindan Kampanyayi gonder kullanilir. En fazla 500 benzersiz alici kabul edilir. Gonderim durumlari ayrintida incelenir. Ag hatasinda otomatik tekrar gonderilmez; alici teslimi kontrol edilmelidir.

Kaynak: emailMarketing.2; kapsam: emailMarketing

## E-posta Kampanyalari — Nereden açılır ve hangi yetki gerekir?

Sol menü → Pazarlama → E-posta Kampanyalari. Standart roller: marketing; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: emailMarketing.detail.erisim; kapsam: emailMarketing

## E-posta Kampanyalari — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Konu: isteğe bağlı.
Icerik: isteğe bağlı.

Kaynak: emailMarketing.detail.alanlar; kapsam: emailMarketing

## E-posta Kampanyalari — Adım adım kullanım

Sol menü → Pazarlama → E-posta Kampanyalari ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Hazirla.
Hazir durumunda: Kampanyayi gonder.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: emailMarketing.detail.adimlar; kapsam: emailMarketing

## E-posta Kampanyalari — Dikkat edilmesi gerekenler ve sık hatalar

Gerçek e-posta gönderimi yan etkilidir; manuel denemede yalnızca size ait test alıcılarını kullanın. Pazarlama izni olmayan kişiler seçilmez. En fazla 500 benzersiz alıcı vardır. Ağ hatasında otomatik tekrar gönderim yoktur. Özet sayaçlar kuyruk bitince güncellenir; anlık gecikme olabilir.

Kaynak: emailMarketing.detail.dikkat; kapsam: emailMarketing

## E-posta Kampanyalari — Örnek senaryo ve beklenen sonuç

Örnek: test SMTP ayarını yöneticinin girmesinden sonra yalnızca izinli test carisiyle kampanya hazırlayın. Hazirla → Kampanyayi gonder sonrasında teslimatlar ve kampanya özeti sonunda tutarlı olmalıdır.

Kaynak: emailMarketing.detail.ornek; kapsam: emailMarketing

## E-posta Kampanyalari — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: emailMarketing.detail.kontrol; kapsam: emailMarketing
