# Insan Kaynaklari → Calisanlar

Yönetici kaynak belgesi; uygulamada yetkili kapsam üzerinden sunulur.

## Calisanlar — Calisan karti

Sol menu → Insan Kaynaklari → Calisanlar. Ad, is e-postasi, departman, gorev, yonetici ve yillik izin hakki tutulur. Hak bos ise temel hesap 20 gun kabul eder; kullanilan izin uygulama tarafindan korunur. Bordro veya otomatik hak edis bu surumde yoktur.

Kaynak: employees.1; kapsam: employees

## Calisanlar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Calisanlar. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: employees.detail.erisim; kapsam: employees

## Calisanlar — Alanlar nasıl doldurulur?

Ad soyad: zorunlu.
Is e-postasi: isteğe bağlı.
Departman: isteğe bağlı.
Gorev: isteğe bağlı.
Yonetici: isteğe bağlı.
Yillik izin hakki (gun): isteğe bağlı.

Kaynak: employees.detail.alanlar; kapsam: employees

## Calisanlar — Adım adım kullanım

Sol menü → Insan Kaynaklari → Calisanlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Arsivle.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: employees.detail.adimlar; kapsam: employees

## Calisanlar — Dikkat edilmesi gerekenler ve sık hatalar

Bu sürüm bordro veya mevzuata göre otomatik izin hak edişi hesaplamaz. İzin hakkını kullanılan iznin altına indirmeyin; kullanılan günler onay/iptal akışından hesaplanır. Gerçek kişisel veri yerine demo verisi kullanın.

Kaynak: employees.detail.dikkat; kapsam: employees

## Calisanlar — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Çalışan için departman ve görev girin; yıllık izin hakkını 20 yapın. Yeni çalışanın kullanılan izni 0 olmalıdır.

Kaynak: employees.detail.ornek; kapsam: employees

## Calisanlar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: employees.detail.kontrol; kapsam: employees
