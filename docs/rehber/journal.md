# Muhasebe → Muhasebe Fisleri

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Muhasebe Fisleri — Muhasebe fisleri

Sol menu → Muhasebe → Muhasebe Fisleri. Fatura, odeme ve ters kayit fisleri otomatik olusur. debit borc, credit alacak demektir; her fisin toplam borcu ve alacagi esittir. Bu deftere disaridan kayit eklenemez veya fis satiri duzenlenemez.

Kaynak: journal.1; kapsam: journal

## Muhasebe Fisleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Muhasebe → Muhasebe Fisleri. Standart roller: accountant; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: journal.detail.erisim; kapsam: journal

## Muhasebe Fisleri — Alanlar nasıl doldurulur?

Bu ekran iş akışlarından otomatik oluşan kayıtları gösterir; elle kayıt ekleme alanı yoktur.

Kaynak: journal.detail.alanlar; kapsam: journal

## Muhasebe Fisleri — Adım adım kullanım

Sol menü → Muhasebe → Muhasebe Fisleri ekranını açın. Kaydı adından arayın, Ayrinti ile kaynak ve satırlarını inceleyin.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: journal.detail.adimlar; kapsam: journal

## Muhasebe Fisleri — Dikkat edilmesi gerekenler ve sık hatalar

Salt okunur defterdir. Borç/alacak dengesizliği veya aynı kaynak için yinelenen fiş görürseniz yeni fiş ekleyerek düzeltmeye çalışmayın; ilgili fatura iş akışını inceleyin.

Kaynak: journal.detail.dikkat; kapsam: journal

## Muhasebe Fisleri — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Satış / invoice fişini açın; müşteri alacağı 360 TL borç, satış geliri 300 TL ve hesaplanan KDV 60 TL alacak olmalıdır. Ödeme fişi faturadan ayrı kayıttır.

Kaynak: journal.detail.ornek; kapsam: journal

## Muhasebe Fisleri — İşlemden sonra ne kontrol edilir?

Kaynak belge ve otomatik satırları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: journal.detail.kontrol; kapsam: journal
