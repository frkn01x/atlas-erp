# Hizmetler → Gorevler

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Gorevler — Gorev takibi

Sol menu → Hizmetler → Gorevler. Proje, sorumlu, planlanan saat ve tarih girilir. Taslak, aktif ve tamamlandi asamalari vardir. Tamamlanmis projeye yeni gorev eklenemez.

Kaynak: tasks.1; kapsam: tasks

## Gorevler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Hizmetler → Gorevler. Standart roller: project; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: tasks.detail.erisim; kapsam: tasks

## Gorevler — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Proje: zorunlu. Arama kutusuna adını yazın; ardından Projeler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Sorumlu: isteğe bağlı.
Planlanan saat: isteğe bağlı.

Kaynak: tasks.detail.alanlar; kapsam: tasks

## Gorevler — Adım adım kullanım

Sol menü → Hizmetler → Gorevler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: tasks.detail.adimlar; kapsam: tasks

## Gorevler — Dikkat edilmesi gerekenler ve sık hatalar

Doğru projeyi seçin. Tamamlanan projeye yeni görev açılamaz; bu kayıtta sorumlu serbest metin alanıdır.

Kaynak: tasks.detail.dikkat; kapsam: tasks

## Gorevler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Proje altında TEST — Görev, planlanan süre 8 saat. Baslat → Tamamla sonrasında bağlı proje tamamlanabilir.

Kaynak: tasks.detail.ornek; kapsam: tasks

## Gorevler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: tasks.detail.kontrol; kapsam: tasks
