# Hizmetler → Zaman Kayitlari

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Zaman Kayitlari — Zaman kaydi

Sol menu → Hizmetler → Zaman Kayitlari. Calisan, proje, istege bagli gorev, calisma tarihi ve saat girilir. Gorev secilen projeye ait olmali; gunluk onayli toplam 24 saati asamaz.

Kaynak: timesheets.1; kapsam: timesheets

## Zaman Kayitlari — Onay ve tutar

Onaya gonder ve Onayla kullanilir. Faturalanabilir=yes ise saat × saatlik tutar hesaplanir. Operasyon Ozeti proje bazinda onayli saat ve tutari gosterir; kendiliginden musteri faturasi kesmez.

Kaynak: timesheets.2; kapsam: timesheets

## Zaman Kayitlari — Nereden açılır ve hangi yetki gerekir?

Sol menü → Hizmetler → Zaman Kayitlari. Standart roller: project; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: timesheets.detail.erisim; kapsam: timesheets

## Zaman Kayitlari — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Proje: zorunlu. Arama kutusuna adını yazın; ardından Projeler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Saat: zorunlu.
Calisan: zorunlu. Arama kutusuna adını yazın; ardından Calisanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Gorev: isteğe bağlı. Arama kutusuna adını yazın; ardından Gorevler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Calisma tarihi: zorunlu. Takvimden tarih seçin.
Saatlik tutar: isteğe bağlı. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Faturalanabilir: isteğe bağlı. Seçenekler: yes, no.

Kaynak: timesheets.detail.alanlar; kapsam: timesheets

## Zaman Kayitlari — Adım adım kullanım

Sol menü → Hizmetler → Zaman Kayitlari ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onaya gonder.
Onay bekliyor durumunda: Onayla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: timesheets.detail.adimlar; kapsam: timesheets

## Zaman Kayitlari — Dikkat edilmesi gerekenler ve sık hatalar

Görev başka projeye ait olamaz. Aynı çalışan ve gün için onaylı toplam 24 saati aşamaz. Hesaplanan tutar otomatik fatura veya maaş ödemesi değildir.

Kaynak: timesheets.detail.dikkat; kapsam: timesheets

## Zaman Kayitlari — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Çalışan, TEST — Proje, aynı projeye ait görev, 4 saat, saatlik tutar 100 ve Faturalanabilir=yes. Onaya gonder → Onayla sonrasında hesaplanan tutar 400 TL olmalıdır.

Kaynak: timesheets.detail.ornek; kapsam: timesheets

## Zaman Kayitlari — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: timesheets.detail.kontrol; kapsam: timesheets
