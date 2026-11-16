# Insan Kaynaklari → Izin Talepleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Izin Talepleri — Izin talebi

Sol menu → Insan Kaynaklari → Izin Talepleri. Calisan, baslangic ve bitis tarihi girilir. Onaya gonder ardindan Onayla veya Reddet kullanilir. Hafta ici gunler hesaplanir; resmi tatil takvimi yoktur.

Kaynak: leave.1; kapsam: leave

## Izin Talepleri — Bakiye ve iptal

Onayda bakiye azalir; cakisan onayli izin veya yetersiz hak reddedilir. Onayli izin Izin iptal et ile iptal edilince kullanilan gun geri verilir. Hak, kullanilmis gunun altina indirilemez.

Kaynak: leave.2; kapsam: leave

## Izin Talepleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Izin Talepleri. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: leave.detail.erisim; kapsam: leave

## Izin Talepleri — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Calisan: zorunlu. Arama kutusuna adını yazın; ardından Calisanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Baslangic: zorunlu. Takvimden tarih seçin.
Bitis: zorunlu. Takvimden tarih seçin.

Kaynak: leave.detail.alanlar; kapsam: leave

## Izin Talepleri — Adım adım kullanım

Sol menü → Insan Kaynaklari → Izin Talepleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onaya gonder.
Onay bekliyor durumunda: Onayla.
Onay bekliyor durumunda: Reddet.
Onaylandi durumunda: Izni iptal et.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: leave.detail.adimlar; kapsam: leave

## Izin Talepleri — Dikkat edilmesi gerekenler ve sık hatalar

Hafta sonu günleri sayılmaz; resmî tatil takvimi uygulanmaz. Çakışan onaylı izin ve yetersiz bakiye reddedilir. İzin iptali silme değildir; geçmiş kayıt korunur.

Kaynak: leave.detail.dikkat; kapsam: leave

## Izin Talepleri — Örnek senaryo ve beklenen sonuç

Örnek: 20 günlük hakkı olan TEST — Çalışan için iki hafta içi günü kapsayan izin oluşturup Onaya gonder → Onayla yapın. Kullanılan gün 2, kalan 18 olmalı; Izni iptal et ile kullanılan gün 0’a dönmelidir.

Kaynak: leave.detail.ornek; kapsam: leave

## Izin Talepleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: leave.detail.kontrol; kapsam: leave
