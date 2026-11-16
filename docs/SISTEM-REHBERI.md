# Atlas ERP — Ayrıntılı Sistem ve İş Akışı Rehberi

Bu tam belge yönetici kaynak dosyasıdır. Çalışanlara tamamı dağıtılmaz: uygulama her istekte modül/rehber yetkisini denetler ve yalnızca izinli kapsamı sunar. Model serbest cevap yerine yetkili bölümleri seçer. Gerçek iş kayıtları modele gönderilmez.

Menü adları arayüzde görünen biçimleriyle yazılmıştır. Örneklerde fiyatlar KDV hariç TL’dir; her örnek kendi başlangıç koşuluyla uygulanmalıdır.

## Kisiler — Cari karti

Sol menu → Satis → Kisiler → Yeni kayit. Ad/unvan girin; kind alani customer=musteri, vendor=tedarikci, both=ikisidir. Vergi ve adres bilgilerini burada tamamlayin.

Kaynak: contacts.1; kapsam: contacts

## Kisiler — Pazarlama izni

E-posta pazarlama izni yes ise kisi kampanyaya dahil edilebilir. Izin yoksa gonderilmez. Abonelikten cikis kisinin iznini kaldirir.

Kaynak: contacts.2; kapsam: contacts

## Urunler — Urun olusturma

Sol menu → Stok → Urunler → Yeni kayit. Ad, benzersiz stok kodu, KDV haric satis/alish fiyati ve vergi yuzdesi girilir. Yeni urunun stogu sifirdir; stok alimi veya sayimla olusur.

Kaynak: products.1; kapsam: products

## Urunler — Stok ve magaza

Toplam stok depo hareketlerinden hesaplanir. Magazada yayinla=yes, urunu yayinlanan sitenin vitrinine acar. Rezerve stok satilabilir bakiyeyi dusurur.

Kaynak: products.2; kapsam: products

## CRM / Firsatlar — Firsat asamalari

Sol menu → Satis → CRM / Firsatlar. Firsat olusturun; nitelendirme, teklif, kazanildi/kaybedildi asamalarini satir dugmelerinden ilerletin.

Kaynak: crm.1; kapsam: crm

## CRM / Firsatlar — Teklif donusumu

Cari ve urun satirlari dolduruldugunda Satis teklifi olustur dugmesi satis kaydi acar. Bir firsat ikinci defa teklife donusturulemez.

Kaynak: crm.2; kapsam: crm

## Satis Siparisleri — Satis akisi

Sol menu → Satis → Satis Siparisleri → Yeni kayit. Cari, urun, miktar, birim fiyat ve vergi secin. Kayittan sonra Onayla, Sevk et ve Fatura olustur dugmeleri satirda sirayla gorunur. Ayrinti paneli aciksa islem sonrasi kapanmaz.

Kaynak: sales.1; kapsam: sales

## Satis Siparisleri — Sevkiyat kurallari

Depo bos ise ana depo kullanilir. Sevk etmek icin satis islem iznine ek depo islem yetkisi gerekir. Kullanilabilir stok yetersizse islem butunuyle geri alinir. Onayli belge satirlari degistirilemez.

Kaynak: sales.2; kapsam: sales

## Satin Alma — Satin alma kaydi

Sol menu → Tedarik → Satin Alma → Yeni kayit. Belge adi, cari, urun satirlari ve depo girilir. Depo bos ise ana depo kullanilir. Fiyatlar KDV harictir.

Kaynak: purchases.1; kapsam: purchases

## Satin Alma — Onay ve teslim alma

Kayit satirindaki Onayla dugmesini kullanin. Durum degistiginde ayni satirda Teslim al gorunur. Bir kez teslim alinir; tekrar stok girisi engellenir. Teslim alma stok bakiyesini ve stok hareketini birlikte olusturur.

Kaynak: purchases.2; kapsam: purchases

## Satin Alma — Tedarikci faturasi

Teslim alinan kayitta Tedarikci faturasi dugmesi taslak fatura acar. Muhasebe islerini o module yetkili kullanici takip eder. Bir siparise tekrar fatura olusturulamaz.

Kaynak: purchases.3; kapsam: purchases

## Faturalar — Fatura olusturma

Sol menu → Muhasebe → Faturalar. Musteri veya tedarikci faturasi olusturulur. Urun miktari × KDV haric birim fiyat ara toplami; satir bazli vergi genel toplami verir.

Kaynak: invoices.1; kapsam: invoices

## Faturalar — Muhasebe ve odeme

Satirdaki Muhasebelestir dugmesi borc/alacak dengeli fis olusturur. Sonraki Odemeyi kaydet dugmesi tam odeme kaydi acar; bu dugme bankadan para gondermez. Ikinci odeme ve taslak faturaya odeme engellenir. Odenmemis faturaya ters kayit yapilabilir.

Kaynak: invoices.2; kapsam: invoices

## Faturalar — Belge ciktilari

Ayrinti panelinde yazdirilabilir fatura ve NES test dugmeleri bulunur. UBL XML indir once belge numarasi/UUID ayirir. NES test ortamına gonder, durum sorgula ve PDF indir islemleri hesap ayarlari tamamlandiginda kullanilir. Yerel yazdirma resmi e-belge degildir.

Kaynak: invoices.3; kapsam: invoices

## Stok Hareketleri — Stok defteri

Sol menu → Stok → Stok Hareketleri. Giris pozitif, cikis negatif miktardir. Depolar arasi transfer iki hareket olusturur ve toplam stogu degistirmez. Kayitlar is akislarindan olusur; deftere elle kayit eklenmez.

Kaynak: inventory.1; kapsam: inventory

## Muhasebe Fisleri — Muhasebe fisleri

Sol menu → Muhasebe → Muhasebe Fisleri. Fatura, odeme ve ters kayit fisleri otomatik olusur. debit borc, credit alacak demektir; her fisin toplam borcu ve alacagi esittir. Bu deftere disaridan kayit eklenemez veya fis satiri duzenlenemez.

Kaynak: journal.1; kapsam: journal

## Uretim Emirleri — Uretim emri

Sol menu → Uretim → Uretim Emirleri. Mamul, uretim miktari, birim bilesenler ve depo girilir. Onayla ardindan Uretimi tamamla kullanilir. Bilesenler miktar kadar tuketilir, mamul girisi olusur. Yetersiz malzemede tum islem geri alinir.

Kaynak: manufacturing.1; kapsam: manufacturing

## Bakim — Bakim talebi

Sol menu → Uretim → Bakim. Ekipman, oncelik ve maliyet girilir. Baslat ve Tamamla ile ilerler. Tamamlanma zamani ve maliyet ekipman kartina islenir.

Kaynak: maintenance.1; kapsam: maintenance

## Calisanlar — Calisan karti

Sol menu → Insan Kaynaklari → Calisanlar. Ad, is e-postasi, departman, gorev, yonetici ve yillik izin hakki tutulur. Hak bos ise temel hesap 20 gun kabul eder; kullanilan izin uygulama tarafindan korunur. Bordro veya otomatik hak edis bu surumde yoktur.

Kaynak: employees.1; kapsam: employees

## Puantaj — Puantaj

Sol menu → Insan Kaynaklari → Puantaj. Calisan ve giris zamani girilir; cikis zamani girilebilir veya Cikis yap aninda olusur. Ayni calisanin iki acik kaydi olamaz. Tek kayit en fazla 24 saattir. 09:00-17:30 araligi 8,5 saat eder.

Kaynak: attendance.1; kapsam: attendance

## Izin Talepleri — Izin talebi

Sol menu → Insan Kaynaklari → Izin Talepleri. Calisan, baslangic ve bitis tarihi girilir. Onaya gonder ardindan Onayla veya Reddet kullanilir. Hafta ici gunler hesaplanir; resmi tatil takvimi yoktur.

Kaynak: leave.1; kapsam: leave

## Izin Talepleri — Bakiye ve iptal

Onayda bakiye azalir; cakisan onayli izin veya yetersiz hak reddedilir. Onayli izin Izin iptal et ile iptal edilince kullanilan gun geri verilir. Hak, kullanilmis gunun altina indirilemez.

Kaynak: leave.2; kapsam: leave

## Ise Alim — Aday sureci

Sol menu → Insan Kaynaklari → Ise Alim. Aday, pozisyon ve departman girilir. Gorusme ve teklif asamalarindan sonra Ise al / calisan olustur bir calisan karti acar.

Kaynak: recruitment.1; kapsam: recruitment

## Ise Alim — AI mulakat

AI Mulakat ekraninda pozisyon ve gorev gereksinimlerini tanimlayin; sorular aday cevaplarina gore ilerler. Avatar soruyu seslendirebilir; cevaplar yazilidir. Bu arac teknik gorusme/pratik icindir, otomatik ise alma/eleme karari vermez.

Kaynak: recruitment.2; kapsam: recruitment

## Ise Alim — Davet ve veri

Davet baglantisi yalnizca ilgili mulakata erisir, suresi sinirlidir. Adayin cevaplari yapilandirilmis AI saglayicisina gonderilir; aday onayi alinmadan cevap gonderilmez. Ses kaydi ve biyometrik analiz yapilmaz.

Kaynak: recruitment.3; kapsam: recruitment

## Arac Filosu — Arac filosu

Sol menu → Insan Kaynaklari → Arac Filosu. Plaka, kilometre, surucu, sigorta ve muayene tarihleri tutulur. Toplam maliyet ve kilometre servis/yakit kayitlariyla ilerler.

Kaynak: fleet.1; kapsam: fleet

## Projeler — Proje ve gorev

Sol menu → Hizmetler → Projeler. Proje olusturulur ve baslatilir. Bagli acik gorevler varken proje tamamlanamaz. Gorevler kendi ekraninda takip edilir.

Kaynak: projects.1; kapsam: projects

## Gorevler — Gorev takibi

Sol menu → Hizmetler → Gorevler. Proje, sorumlu, planlanan saat ve tarih girilir. Taslak, aktif ve tamamlandi asamalari vardir. Tamamlanmis projeye yeni gorev eklenemez.

Kaynak: tasks.1; kapsam: tasks

## Zaman Kayitlari — Zaman kaydi

Sol menu → Hizmetler → Zaman Kayitlari. Calisan, proje, istege bagli gorev, calisma tarihi ve saat girilir. Gorev secilen projeye ait olmali; gunluk onayli toplam 24 saati asamaz.

Kaynak: timesheets.1; kapsam: timesheets

## Zaman Kayitlari — Onay ve tutar

Onaya gonder ve Onayla kullanilir. Faturalanabilir=yes ise saat × saatlik tutar hesaplanir. Operasyon Ozeti proje bazinda onayli saat ve tutari gosterir; kendiliginden musteri faturasi kesmez.

Kaynak: timesheets.2; kapsam: timesheets

## POS Satislari — Kasa sepeti

Sol menu → Satis → POS Satislari. Urun ara, sepete ekle ve cari sec. Nakit kaydi veya iyzico Sandbox secip Tahsil et kullan. Fiyat ve vergi sunucudan hesaplanir; ayni istek iki satis olusturmaz.

Kaynak: pos.1; kapsam: pos

## POS Satislari — Odeme sonucu

Nakit uygulama icinde kayittir, kart cekimi degildir. iyzico kart bilgileri saglayicinin sayfasinda girilir. Dogrulanmis basarili sonucta stok, fatura ve muhasebe kaydi olusur. Tahsilat Takibi odeme sonucunu sorgular.

Kaynak: pos.2; kapsam: pos

## Web Sayfalari — Surukle birak editor

Sol menu → Web → Web Sayfalari. Kutuphaneden kapak, metin, urun vitrini, buton, gorsel ve iletisim bloklarini ekleyin. Surukleyerek veya yukari/asagi dugmeleriyle siralayin. Secilen blok ozellikleri sag panelden degisir.

Kaynak: website.1; kapsam: website

## Web Sayfalari — Taslak ve yayin

Kaydet taslagi saklar. Yayinla ziyaretciye gorunen kopyayi gunceller. Yayindaki sayfanin taslagini duzenlemek eski yayini degistirmez; tekrar Yayinla gerekir. Yayindan kaldir ziyaretci erisimini kapatir. Sayfa adresi kucuk harf/rakam/tire icermeli.

Kaynak: website.2; kapsam: website

## E-ticaret Siparisleri — Magaza ve siparis

Urunler ekraninda Magazada yayinla=yes olan urunler yayinlanan web sitesinin vitrinine cikar. Ziyaretci sepete urun ekler ve alici/teslimat formunu doldurur. Fiyat istemciden kabul edilmez.

Kaynak: ecommerce.1; kapsam: ecommerce

## E-ticaret Siparisleri — Stok rezervasyonu

Odeme baslatilinca ana depoda stok rezerve edilir. Basarili iyzico sonucu imza, tutar, para birimi ve siparis kimligiyle dogrulanir. Siparis sevkiyata hazir hale gelir; stok fiziksel sevkiyatta duser. Dogrulanmis basarisiz odemede rezervasyon kalkar.

Kaynak: ecommerce.2; kapsam: ecommerce

## Etkinlikler — Etkinlik kaydi

Sol menu → Pazarlama → Etkinlikler. Tarih, konum ve kontenjan girilir; yayinlaninca ziyaretci formu acilir. Ayni e-posta ikinci kez kaydolamaz; kontenjan dolunca yeni kayit reddedilir. Kontenjan 0/bos ise sinirsizdir.

Kaynak: events.1; kapsam: events

## Anketler — Anket formu

Sol menu → Pazarlama → Anketler. Her satira bir soru yazin (en fazla 50). Yayina acildiginda ziyaretci ad/e-posta ve serbest metin yanitlarini gonderir. Ayni e-posta ikinci yanit veremez; yanitlar yetkili yonetim ekranindan gorulur.

Kaynak: surveys.1; kapsam: surveys

## E-posta Kampanyalari — SMTP ve izin

Yonetici Ayarlar/Entegrasyonlar ekraninda SMTP/TLS, gonderen ve HTTPS abonelikten cikis adresini tanimlar. E-posta pazarlama izni=yes ve gecerli e-postasi olan cariler kampanyaya dahil edilir.

Kaynak: emailMarketing.1; kapsam: emailMarketing

## E-posta Kampanyalari — Kampanya kuyrugu

Kampanya konusu/duz metni yazilir, Hazirla ardindan Kampanyayi gonder kullanilir. En fazla 500 benzersiz alici kabul edilir. Gonderim durumlari ayrintida incelenir. Ag hatasinda otomatik tekrar gonderilmez; alici teslimi kontrol edilmelidir.

Kaynak: emailMarketing.2; kapsam: emailMarketing

## Depolar — Depo kartlari

Sol menu → Stok → Depolar → Yeni kayit. Depo adi ve adresi kaydedilir. Siparis/transfer formlarinda depo secilir; bos birakilan depo ana depoyu belirtir.

Kaynak: warehouses.1; kapsam: warehouses

## Stok Sayimi / Acilis — Sayim ve acilis

Sol menu → Stok → Stok Sayimi / Acilis. Urun, depo ve sayilan miktar girin; Sayimi uygula dugmesini kullanin. Sayilan miktar eklenecek miktar degil, islem sonundaki hedef bakiyedir. Rezerve stokun altina dusulemez.

Kaynak: stockAdjustments.1; kapsam: stockAdjustments

## Depolar Arasi Transfer — Depolar arasi transfer

Sol menu → Stok → Depolar Arasi Transfer. Urun, miktar ve iki depo secin. Cikis veya giris deposu bos ise ana depo kullanilir; ayni depolar kabul edilmez. Transfer et dugmesi cikis ve girisi atomik yapar; toplam stok sabit kalir.

Kaynak: stockTransfers.1; kapsam: stockTransfers

## Urun Receteleri — Birim urun recetesi

Sol menu → Uretim → Urun Receteleri. Mamul ve bir adet mamul icin gerekli bilesen/miktarlar tanimlanir. Mamul kendi bileseni olamaz. Uretim emri ac dugmesi bir emri taslak olarak olusturur.

Kaynak: boms.1; kapsam: boms

## Ekipmanlar — Ekipman karti

Sol menu → Uretim → Ekipmanlar. Ad, seri no, konum ve sonraki bakim tarihi tutulur. Bakim tamamlandikca son bakim ve toplam maliyet uygulama tarafindan guncellenir.

Kaynak: equipment.1; kapsam: equipment

## Arac Servis / Yakit — Servis ve yakit

Sol menu → Insan Kaynaklari → Arac Servis / Yakit. Arac, tarih, kilometre, tur ve tutar girilir. Tamamla maliyeti araca ekler. Geriye giden kilometre reddedilir.

Kaynak: vehicleServices.1; kapsam: vehicleServices

## Kisiler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → Kisiler. Standart roller: sales, purchaser, accountant, hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: contacts.detail.erisim; kapsam: contacts

## Kisiler — Alanlar nasıl doldurulur?

Ad / unvan: zorunlu.
E-posta: isteğe bağlı.
Telefon: isteğe bağlı.
Vergi no: isteğe bağlı.
Adres: isteğe bağlı.
Tur: zorunlu. Seçenekler: customer, vendor, both.
Soyadi: isteğe bağlı.
Il: isteğe bağlı.
Ilce: isteğe bağlı.
Ulke: isteğe bağlı.
Posta kodu: isteğe bağlı.
e-Fatura alici etiketi: isteğe bağlı.
E-posta pazarlama izni: isteğe bağlı. Seçenekler: yes, no.

Kaynak: contacts.detail.alanlar; kapsam: contacts

## Kisiler — Adım adım kullanım

Sol menü → Satis → Kisiler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: contacts.detail.adimlar; kapsam: contacts

## Kisiler — Dikkat edilmesi gerekenler ve sık hatalar

Cari oluşturmak stok, fatura veya ödeme üretmez. Aynı isim yerine doğru kartı seçtiğinizi vergi ve iletişim bilgileriyle kontrol edin.

Kaynak: contacts.detail.dikkat; kapsam: contacts

## Kisiler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Cari adıyla bir kayıt açın; Tür=both seçin. Böylece aynı cari müşteri ve tedarikçi olarak kullanılabilir. E-posta pazarlama iznini gerçekten izin yoksa no bırakın.

Kaynak: contacts.detail.ornek; kapsam: contacts

## Kisiler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: contacts.detail.kontrol; kapsam: contacts

## Urunler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Urunler. Standart roller: sales, purchaser, warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: products.detail.erisim; kapsam: products

## Urunler — Alanlar nasıl doldurulur?

Urun adi: zorunlu.
Stok kodu: zorunlu.
Satis fiyati: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Alis maliyeti: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Vergi %: zorunlu.
Magazada yayinla: isteğe bağlı. Seçenekler: yes, no.
Urun aciklamasi: isteğe bağlı.
HTTPS gorsel adresi: isteğe bağlı.

Kaynak: products.detail.alanlar; kapsam: products

## Urunler — Adım adım kullanım

Sol menü → Stok → Urunler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: products.detail.adimlar; kapsam: products

## Urunler — Dikkat edilmesi gerekenler ve sık hatalar

Ürün eklerken benzersiz ve anlamlı stok kodu, doğru ad, KDV hariç fiyat, doğru vergi yüzdesi ve mağazada yayın seçimini kontrol edin. Fiyatlara KDV ekleyerek yazmayın. Başlangıç stoğunu ürün formundan vermeyin; satın alma veya sayım kullanın. Aynı ürüne ikinci kart açmak yerine mevcut kartı bulun. Mağazada yayınla=yes yalnızca yayımlanan mağazada gösterim içindir; ürünü oluşturmak tek başına siteyi yayımlamaz.

Kaynak: products.detail.dikkat; kapsam: products

## Urunler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Kalem; Stok kodu=TEST-KALEM-001; Alış maliyeti=100; Satış fiyatı=150; Vergi %=20. Kaydet sonrasında stok 0 olmalıdır.

Kaynak: products.detail.ornek; kapsam: products

## Urunler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: products.detail.kontrol; kapsam: products

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

## Satis Siparisleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → Satis Siparisleri. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: sales.detail.erisim; kapsam: sales

## Satis Siparisleri — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.
Depo (bos: ana depo): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: sales.detail.alanlar; kapsam: sales

## Satis Siparisleri — Adım adım kullanım

Sol menü → Satis → Satis Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Sevk et.
Sevk edildi durumunda: Fatura olustur.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: sales.detail.adimlar; kapsam: sales

## Satis Siparisleri — Dikkat edilmesi gerekenler ve sık hatalar

Siparişi kaydetmek/onaylamak stoğu düşürmez; fiziksel stok Sevk et ile değişir. Sevk için depo işlem yetkisi ve yeterli kullanılabilir stok gerekir. Onaydan sonra satırları değiştirmeyin. Fatura oluşturmak tahsilat yapmaz; muhasebeci fatura ve ödeme adımını yürütür.

Kaynak: sales.detail.dikkat; kapsam: sales

## Satis Siparisleri — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Satış; TEST — Cari; TEST — Kalem 2 adet, birim fiyat 150, vergi %20. Ara toplam 300, vergi 60, toplam 360 TL. Onayla → Sevk et sonrasında 10 adet stok 8’e iner; Fatura olustur taslak müşteri faturası açar.

Kaynak: sales.detail.ornek; kapsam: sales

## Satis Siparisleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: sales.detail.kontrol; kapsam: sales

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

## Faturalar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Muhasebe → Faturalar. Standart roller: accountant; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: invoices.detail.erisim; kapsam: invoices

## Faturalar — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.
Fatura turu: zorunlu. Seçenekler: customer, vendor.

Kaynak: invoices.detail.alanlar; kapsam: invoices

## Faturalar — Adım adım kullanım

Sol menü → Muhasebe → Faturalar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Muhasebelestir.
Muhasebelesti durumunda: Odemeyi kaydet.
Muhasebelesti durumunda: Ters kayit.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: invoices.detail.adimlar; kapsam: invoices

## Faturalar — Dikkat edilmesi gerekenler ve sık hatalar

Sipariş faturası zaten oluşturulduysa Yeni kayit ile ikinci kez kesmeyin. customer müşteri, vendor tedarikçi faturasıdır. Taslağa ödeme kaydı yapılamaz. Ödeme düğmesi manuel muhasebe kaydıdır, bankadan para göndermez veya kart çekmez. Ödenmiş faturaya ikinci ödeme uygulanmamalıdır. NES işlemleri ayrı test hesabı ve şirket/vergi bilgilerinin tamamlanmasını gerektirir; yerel çıktı resmî e-fatura değildir.

Kaynak: invoices.detail.dikkat; kapsam: invoices

## Faturalar — Örnek senaryo ve beklenen sonuç

Örnek: satıştan oluşan 360 TL taslak faturayı Muhasebelestir yapın; fatura fişinin borç ve alacak toplamı ayrı ayrı 360 TL olmalı. Odemeyi kaydet sonrasında durum Ödendi olur ve ayrıca ödeme fişi oluşur.

Kaynak: invoices.detail.ornek; kapsam: invoices

## Faturalar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: invoices.detail.kontrol; kapsam: invoices

## Stok Hareketleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Stok Hareketleri. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: inventory.detail.erisim; kapsam: inventory

## Stok Hareketleri — Alanlar nasıl doldurulur?

Bu ekran iş akışlarından otomatik oluşan kayıtları gösterir; elle kayıt ekleme alanı yoktur.

Kaynak: inventory.detail.alanlar; kapsam: inventory

## Stok Hareketleri — Adım adım kullanım

Sol menü → Stok → Stok Hareketleri ekranını açın. Kaydı adından arayın, Ayrinti ile kaynak ve satırlarını inceleyin.
Bu kartın ilk kaydından sonra bağlı işlemler ilgili modüllerde yürütülür.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: inventory.detail.adimlar; kapsam: inventory

## Stok Hareketleri — Dikkat edilmesi gerekenler ve sık hatalar

Stok hareketleri salt okunurdur. Fatura oluşturmak, ödemek veya taslak sipariş kaydetmek stok hareketi üretmez. Kayıtları ve kaynak belgeyi birlikte kontrol edin.

Kaynak: inventory.detail.dikkat; kapsam: inventory

## Stok Hareketleri — Örnek senaryo ve beklenen sonuç

Örnek: 10 adet satın alma girişi ve 2 adet satış çıkışı sonrasında hareketler +10 ve -2, ürün bakiyesi 8 olmalıdır.

Kaynak: inventory.detail.ornek; kapsam: inventory

## Stok Hareketleri — İşlemden sonra ne kontrol edilir?

Kaynak belge ve otomatik satırları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: inventory.detail.kontrol; kapsam: inventory

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

## Uretim Emirleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Uretim Emirleri. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: manufacturing.detail.erisim; kapsam: manufacturing

## Uretim Emirleri — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Mamul: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Miktar: zorunlu.
Recete bilesenleri: zorunlu. Bileşen ürününü ve birim mamul için gereken pozitif miktarı girin.
Urun recetesi: isteğe bağlı. Arama kutusuna adını yazın; ardından Urun Receteleri listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Depo: isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.

Kaynak: manufacturing.detail.alanlar; kapsam: manufacturing

## Uretim Emirleri — Adım adım kullanım

Sol menü → Uretim → Uretim Emirleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Uretimi tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: manufacturing.detail.adimlar; kapsam: manufacturing

## Uretim Emirleri — Dikkat edilmesi gerekenler ve sık hatalar

Onaylamak tüketim değildir. Bileşenlerden biri yetersizse hiçbir bileşen tüketilmemeli ve mamul girişi olmamalıdır. Doğru üretim deposunu kontrol edin.

Kaynak: manufacturing.detail.dikkat; kapsam: manufacturing

## Uretim Emirleri — Örnek senaryo ve beklenen sonuç

Örnek: 2 kalem tüketen reçeteden 1 set üretin. Onayla → Uretimi tamamla sonrasında kalem 2 azalır, set 1 artar.

Kaynak: manufacturing.detail.ornek; kapsam: manufacturing

## Uretim Emirleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: manufacturing.detail.kontrol; kapsam: manufacturing

## Bakim — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Bakim. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: maintenance.detail.erisim; kapsam: maintenance

## Bakim — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Ekipman: isteğe bağlı.
Teknisyen: isteğe bağlı.
Ekipman: zorunlu. Arama kutusuna adını yazın; ardından Ekipmanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Oncelik: zorunlu. Seçenekler: normal, high, urgent.
Bakim maliyeti: isteğe bağlı. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.

Kaynak: maintenance.detail.alanlar; kapsam: maintenance

## Bakim — Adım adım kullanım

Sol menü → Uretim → Bakim ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: maintenance.detail.adimlar; kapsam: maintenance

## Bakim — Dikkat edilmesi gerekenler ve sık hatalar

Gerekli ekipman ilişkisini seçin; serbest açıklama ekipman seçiminin yerine geçmez. Bakım maliyeti otomatik fatura veya muhasebe fişi üretmez.

Kaynak: maintenance.detail.dikkat; kapsam: maintenance

## Bakim — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Makine için 50 TL maliyetli bakım oluşturun. Baslat → Tamamla sonrasında ekipman toplam bakım maliyeti 50 TL artmalıdır.

Kaynak: maintenance.detail.ornek; kapsam: maintenance

## Bakim — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: maintenance.detail.kontrol; kapsam: maintenance

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

## Puantaj — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Puantaj. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: attendance.detail.erisim; kapsam: attendance

## Puantaj — Alanlar nasıl doldurulur?

Kayit adi: zorunlu.
Calisan: zorunlu. Arama kutusuna adını yazın; ardından Calisanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Giris: zorunlu. Tarih ve saati birlikte seçin.
Cikis: isteğe bağlı. Tarih ve saati birlikte seçin.

Kaynak: attendance.detail.alanlar; kapsam: attendance

## Puantaj — Adım adım kullanım

Sol menü → Insan Kaynaklari → Puantaj ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Cikis yap.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: attendance.detail.adimlar; kapsam: attendance

## Puantaj — Dikkat edilmesi gerekenler ve sık hatalar

Aynı çalışan için iki açık puantaj olamaz. Çıkış girişten önce olamaz; tek kayıt en fazla 24 saat kapsar. Molalar otomatik düşülmez.

Kaynak: attendance.detail.dikkat; kapsam: attendance

## Puantaj — Örnek senaryo ve beklenen sonuç

Örnek: aynı tarihte 09:00 giriş, 17:30 çıkış kaydedip Cikis yap kullanın. Süre 8,5 saat olmalıdır.

Kaynak: attendance.detail.ornek; kapsam: attendance

## Puantaj — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: attendance.detail.kontrol; kapsam: attendance

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

## Ise Alim — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Ise Alim. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: recruitment.detail.erisim; kapsam: recruitment

## Ise Alim — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Aday e-postasi: isteğe bağlı.
Pozisyon: isteğe bağlı.
Departman: isteğe bağlı.

Kaynak: recruitment.detail.alanlar; kapsam: recruitment

## Ise Alim — Adım adım kullanım

Sol menü → Insan Kaynaklari → Ise Alim ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Gorusme.
Taslak durumunda: Reddedildi.
Gorusme durumunda: Teklif.
Gorusme durumunda: Reddedildi.
Teklif durumunda: Ise al / calisan olustur.
Teklif durumunda: Reddedildi.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: recruitment.detail.adimlar; kapsam: recruitment

## Ise Alim — Dikkat edilmesi gerekenler ve sık hatalar

AI Mulakat için Sistem → AI Mulakat ekranına gidin. Gereksinimleri yazın, 2–10 soru seçin ve davet oluşturun. Sorular önceki yanıta göre değişir; yanıt iletimi için onay gerekir. Avatar yerel Türkçe tarayıcı sesi varsa konuşur. AI otomatik işe alma/eleme kararı vermez; gerçek aday verisiyle demo yapmayın.

Kaynak: recruitment.detail.dikkat; kapsam: recruitment

## Ise Alim — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Aday, pozisyon Yazılımcı ve departman Yazılım. Görüşme → Teklif → Ise al / calisan olustur ile bağlantılı çalışan kartı oluşmalıdır.

Kaynak: recruitment.detail.ornek; kapsam: recruitment

## Ise Alim — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: recruitment.detail.kontrol; kapsam: recruitment

## Arac Filosu — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Arac Filosu. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: fleet.detail.erisim; kapsam: fleet

## Arac Filosu — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Plaka: zorunlu.
Kilometre: isteğe bağlı.
Surucu: isteğe bağlı.
Surucu: isteğe bağlı. Arama kutusuna adını yazın; ardından Calisanlar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Sigorta bitisi: isteğe bağlı. Takvimden tarih seçin.
Muayene tarihi: isteğe bağlı. Takvimden tarih seçin.

Kaynak: fleet.detail.alanlar; kapsam: fleet

## Arac Filosu — Adım adım kullanım

Sol menü → Insan Kaynaklari → Arac Filosu ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: fleet.detail.adimlar; kapsam: fleet

## Arac Filosu — Dikkat edilmesi gerekenler ve sık hatalar

Araçtaki maliyet ve kilometre servis/yakıt kayıtlarından ilerler. Sigorta/muayene tarihini kaydetmek otomatik uyarı göndermez.

Kaynak: fleet.detail.dikkat; kapsam: fleet

## Arac Filosu — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Araç, plaka TEST-001 ve kilometre 100. Sonraki servis kaydı 120 kilometre ve 75 TL ise araç toplam maliyeti 75 TL artmalıdır.

Kaynak: fleet.detail.ornek; kapsam: fleet

## Arac Filosu — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: fleet.detail.kontrol; kapsam: fleet

## Projeler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Hizmetler → Projeler. Standart roller: project; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: projects.detail.erisim; kapsam: projects

## Projeler — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.

Kaynak: projects.detail.alanlar; kapsam: projects

## Projeler — Adım adım kullanım

Sol menü → Hizmetler → Projeler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Baslat.
Devam ediyor durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: projects.detail.adimlar; kapsam: projects

## Projeler — Dikkat edilmesi gerekenler ve sık hatalar

Proje tamamlamak kendiliğinden müşteri faturası oluşturmaz. Tarih ve sorumlu alanları kayıt takibi içindir.

Kaynak: projects.detail.dikkat; kapsam: projects

## Projeler — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Proje oluşturup Baslat yapın. Bağlı açık görev varken Tamamla reddedilmeli; görevler bitirildikten sonra tamamlanmalıdır.

Kaynak: projects.detail.ornek; kapsam: projects

## Projeler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: projects.detail.kontrol; kapsam: projects

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

## POS Satislari — Nereden açılır ve hangi yetki gerekir?

Sol menü → Satis → POS Satislari. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: pos.detail.erisim; kapsam: pos

## POS Satislari — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.

Kaynak: pos.detail.alanlar; kapsam: pos

## POS Satislari — Adım adım kullanım

Sol menü → Satis → POS Satislari ekranını açın. Ürünü arayın, sepete ekleyin ve kasa formunu tamamlayın.
Taslak durumunda: Kasada tahsil et.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: pos.detail.adimlar; kapsam: pos

## POS Satislari — Dikkat edilmesi gerekenler ve sık hatalar

Nakit demo kaydı gerçek para transferi değildir. iyzico Sandbox için ayarlar ve dış HTTPS dönüş adresi gerekir; kart verisi ERP formuna girilmez. Aynı isteğin tekrarı ikinci satış oluşturmamalıdır.

Kaynak: pos.detail.dikkat; kapsam: pos

## POS Satislari — Örnek senaryo ve beklenen sonuç

Örnek: stokta bulunan ürünü Sistem değil Satis → POS Satislari ekranında aratıp sepete ekleyin; cari ve Nakit seçip tahsil edin. Stok azalmalı, bağlantılı fatura ve ödeme kaydı oluşmalıdır.

Kaynak: pos.detail.ornek; kapsam: pos

## POS Satislari — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: pos.detail.kontrol; kapsam: pos

## Web Sayfalari — Nereden açılır ve hangi yetki gerekir?

Sol menü → Web → Web Sayfalari. Standart roller: marketing; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: website.detail.erisim; kapsam: website

## Web Sayfalari — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Adres yolu: isteğe bağlı.
Sayfa bloklari: isteğe bağlı.

Kaynak: website.detail.alanlar; kapsam: website

## Web Sayfalari — Adım adım kullanım

Sol menü → Web → Web Sayfalari ekranını açın. Sayfa editöründe adı, adresi ve blokları düzenleyin; taslağı kaydedin.
Taslak durumunda: Yayinla.
Yayin kaydi durumunda: Yayinla.
Yayin kaydi durumunda: Yayindan kaldir.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: website.detail.adimlar; kapsam: website

## Web Sayfalari — Dikkat edilmesi gerekenler ve sık hatalar

Taslak düzenlemek yayımdaki kopyayı değiştirmez; yeniden Yayinla gerekir. Sayfa adresi küçük harf/rakam/tire olmalı ve benzersizdir. Gerekli ürünlerin Magazada yayinla seçimi yes olmalıdır.

Kaynak: website.detail.dikkat; kapsam: website

## Web Sayfalari — Örnek senaryo ve beklenen sonuç

Örnek: Web → Web Sayfalari ekranında sayfa adı ve test-magaza adresi belirleyin. Kapak, metin ve ürün vitrini blokları ekleyip sürükleyin; Kaydet → Yayinla yapın.

Kaynak: website.detail.ornek; kapsam: website

## Web Sayfalari — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: website.detail.kontrol; kapsam: website

## E-ticaret Siparisleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Web → E-ticaret Siparisleri. Standart roller: sales; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: ecommerce.detail.erisim; kapsam: ecommerce

## E-ticaret Siparisleri — Alanlar nasıl doldurulur?

Belge adi: zorunlu.
Cari: zorunlu. Arama kutusuna adını yazın; ardından Kisiler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Urun satirlari: zorunlu. Her satırda ürün, pozitif miktar, KDV hariç birim fiyat ve vergi yüzdesi bulunur.

Kaynak: ecommerce.detail.alanlar; kapsam: ecommerce

## E-ticaret Siparisleri — Adım adım kullanım

Sol menü → Web → E-ticaret Siparisleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Onayla.
Onaylandi durumunda: Sevk et.
Sevk edildi durumunda: Fatura olustur.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: ecommerce.detail.adimlar; kapsam: ecommerce

## E-ticaret Siparisleri — Dikkat edilmesi gerekenler ve sık hatalar

Sunucu ürün fiyatını yeniden hesaplar; ziyaretçinin değiştirdiği fiyat kabul edilmez. iyzico başarı dönüşü imza, tutar ve para birimiyle doğrulanır. Gerçek test hesabı ve erişilebilir HTTPS olmadan dış ödeme testi tamamlanmış sayılmaz.

Kaynak: ecommerce.detail.dikkat; kapsam: ecommerce

## E-ticaret Siparisleri — Örnek senaryo ve beklenen sonuç

Örnek: yayımlanmış mağazada bir ürün seçin, sepete ekleyin ve test teslimat bilgileri girin. Ödeme başlatılması stok rezervasyonu yapar; fiziksel çıkış sevkiyatta olur.

Kaynak: ecommerce.detail.ornek; kapsam: ecommerce

## E-ticaret Siparisleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: ecommerce.detail.kontrol; kapsam: ecommerce

## Etkinlikler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Pazarlama → Etkinlikler. Standart roller: marketing; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: events.detail.erisim; kapsam: events

## Etkinlikler — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Kapasite: isteğe bağlı.
Konum: isteğe bağlı.
Baslangic: zorunlu. Tarih ve saati birlikte seçin.
Bitis: zorunlu. Tarih ve saati birlikte seçin.

Kaynak: events.detail.alanlar; kapsam: events

## Etkinlikler — Adım adım kullanım

Sol menü → Pazarlama → Etkinlikler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Yayinla.
Yayin kaydi durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: events.detail.adimlar; kapsam: events

## Etkinlikler — Dikkat edilmesi gerekenler ve sık hatalar

Aynı e-posta iki kez kaydolamaz; kapasite 0/boş sınırsız anlamındadır. Bitiş başlangıçtan önce olamaz.

Kaynak: events.detail.dikkat; kapsam: events

## Etkinlikler — Örnek senaryo ve beklenen sonuç

Örnek: kapasitesi 1 olan TEST — Etkinlik yayımlayın. İlk test e-postasıyla kayıt kabul edilmeli; başka e-postayla ikinci kayıt kapasite nedeniyle reddedilmelidir.

Kaynak: events.detail.ornek; kapsam: events

## Etkinlikler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: events.detail.kontrol; kapsam: events

## Anketler — Nereden açılır ve hangi yetki gerekir?

Sol menü → Pazarlama → Anketler. Standart roller: marketing; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: surveys.detail.erisim; kapsam: surveys

## Anketler — Alanlar nasıl doldurulur?

Baslik: zorunlu.
Aciklama: isteğe bağlı.
Tarih: isteğe bağlı. Takvimden tarih seçin.
Her satira bir soru: zorunlu.

Kaynak: surveys.detail.alanlar; kapsam: surveys

## Anketler — Adım adım kullanım

Sol menü → Pazarlama → Anketler ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Yayinla.
Yayin kaydi durumunda: closed.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: surveys.detail.adimlar; kapsam: surveys

## Anketler — Dikkat edilmesi gerekenler ve sık hatalar

Her satır bir sorudur; 1–50 soru ve soru başına en fazla 500 karakter kullanılır. Gerçek kişisel veya hassas bilgiyi sorulara ve yanıtlara koymayın.

Kaynak: surveys.detail.dikkat; kapsam: surveys

## Anketler — Örnek senaryo ve beklenen sonuç

Örnek: iki sorulu TEST — Anket yayımlayıp test e-postasıyla yanıtlayın. Cevaplar yetkili ayrıntı ekranında görünmeli; aynı e-postayla ikinci yanıt reddedilmelidir.

Kaynak: surveys.detail.ornek; kapsam: surveys

## Anketler — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: surveys.detail.kontrol; kapsam: surveys

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

## Stok Sayimi / Acilis — Nereden açılır ve hangi yetki gerekir?

Sol menü → Stok → Stok Sayimi / Acilis. Standart roller: warehouse; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: stockAdjustments.detail.erisim; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Alanlar nasıl doldurulur?

Sayim adi: zorunlu.
Urun: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Depo (bos: ana depo): isteğe bağlı. Arama kutusuna adını yazın; ardından Depolar listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Sayilan miktar: zorunlu.

Kaynak: stockAdjustments.detail.alanlar; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Adım adım kullanım

Sol menü → Stok → Stok Sayimi / Acilis ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Sayimi uygula.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: stockAdjustments.detail.adimlar; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Dikkat edilmesi gerekenler ve sık hatalar

Sayım alanı eklenecek miktar değil hedef toplam bakiyedir. Yanlış depoda sayım yapmayın; rezervasyon altına düşen sayım reddedilir.

Kaynak: stockAdjustments.detail.dikkat; kapsam: stockAdjustments

## Stok Sayimi / Acilis — Örnek senaryo ve beklenen sonuç

Örnek: stoğu 8 olan üründe Sayilan miktar=12 girip Sayimi uygula yapın. Sonuç 20 değil 12, oluşan fark hareketi +4 olmalıdır.

Kaynak: stockAdjustments.detail.ornek; kapsam: stockAdjustments

## Stok Sayimi / Acilis — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: stockAdjustments.detail.kontrol; kapsam: stockAdjustments

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

## Urun Receteleri — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Urun Receteleri. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: boms.detail.erisim; kapsam: boms

## Urun Receteleri — Alanlar nasıl doldurulur?

Recete adi: zorunlu.
Mamul: zorunlu. Arama kutusuna adını yazın; ardından Urunler listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Birim mamul bilesenleri: zorunlu. Bileşen ürününü ve birim mamul için gereken pozitif miktarı girin.

Kaynak: boms.detail.alanlar; kapsam: boms

## Urun Receteleri — Adım adım kullanım

Sol menü → Uretim → Urun Receteleri ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Uretim emri ac.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: boms.detail.adimlar; kapsam: boms

## Urun Receteleri — Dikkat edilmesi gerekenler ve sık hatalar

Mamul kendi bileşeni olamaz. Bileşen miktarları bir birim mamul içindir; üretim miktarıyla çarpılır. Reçete kaydetmek stok tüketmez.

Kaynak: boms.detail.dikkat; kapsam: boms

## Urun Receteleri — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Set mamulü için bir adet mamulde 2 adet TEST — Kalem kullanacak reçete kaydedin. Uretim emri ac bir adet mamul için taslak emir oluşturur.

Kaynak: boms.detail.ornek; kapsam: boms

## Urun Receteleri — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: boms.detail.kontrol; kapsam: boms

## Ekipmanlar — Nereden açılır ve hangi yetki gerekir?

Sol menü → Uretim → Ekipmanlar. Standart roller: production; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: equipment.detail.erisim; kapsam: equipment

## Ekipmanlar — Alanlar nasıl doldurulur?

Ekipman adi: zorunlu.
Seri no: isteğe bağlı.
Konum: isteğe bağlı.
Sonraki bakim: isteğe bağlı. Takvimden tarih seçin.

Kaynak: equipment.detail.alanlar; kapsam: equipment

## Ekipmanlar — Adım adım kullanım

Sol menü → Uretim → Ekipmanlar ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Devam ediyor durumunda: Arsivle.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: equipment.detail.adimlar; kapsam: equipment

## Ekipmanlar — Dikkat edilmesi gerekenler ve sık hatalar

Son bakım ve toplam bakım maliyeti tamamlanan bakım kayıtlarından güncellenir. Kart oluşturmak otomatik bakım planı veya bildirim kurmaz.

Kaynak: equipment.detail.dikkat; kapsam: equipment

## Ekipmanlar — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Makine, seri no TEST-SERI-01, konum Atölye. Yeni kart oluşturmak bakım harcaması yaratmaz.

Kaynak: equipment.detail.ornek; kapsam: equipment

## Ekipmanlar — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: equipment.detail.kontrol; kapsam: equipment

## Arac Servis / Yakit — Nereden açılır ve hangi yetki gerekir?

Sol menü → Insan Kaynaklari → Arac Servis / Yakit. Standart roller: hr; admin tüm alanlara erişir. Yönetici modül bazında bu varsayılanı değiştirebilir. Sadece görüntüleme izni olan kullanıcı işlem yapamaz. Menü görünmüyorsa Sistem → Kullanicilar ve Roller ekranını yöneticiniz kontrol etmelidir. Rehberi görme izni kayıtları görme izninden ayrıdır.

Kaynak: vehicleServices.detail.erisim; kapsam: vehicleServices

## Arac Servis / Yakit — Alanlar nasıl doldurulur?

Islem adi: zorunlu.
Arac: zorunlu. Arama kutusuna adını yazın; ardından Arac Filosu listesinden kaydı seçin. Sadece arama metnini yazmak seçim değildir.
Tarih: zorunlu. Takvimden tarih seçin.
Kilometre: zorunlu.
Tutar: zorunlu. KDV hariç TL tutarı girin; en fazla iki ondalık kullanın.
Tur: zorunlu. Seçenekler: service, fuel, insurance, other.

Kaynak: vehicleServices.detail.alanlar; kapsam: vehicleServices

## Arac Servis / Yakit — Adım adım kullanım

Sol menü → Insan Kaynaklari → Arac Servis / Yakit ekranını açın. Yeni kayit düğmesine basın, zorunlu alanları ve ilişkileri tamamlayıp Kaydet kullanın.
Taslak durumunda: Tamamla.
İşlem düğmeleri kayıt satırında görünür. Ayrıntı panelinde işlem yapıyorsanız panel açık kalıp yeni duruma geçer. Kritik işlemler onay ister. Eski sürüm uyarısında Yenile kullanın; aynı işlemi tekrar tekrar göndermeyin.

Kaynak: vehicleServices.detail.adimlar; kapsam: vehicleServices

## Arac Servis / Yakit — Dikkat edilmesi gerekenler ve sık hatalar

Kilometre önceki değerden küçük olamaz. Türler service=servis, fuel=yakıt, insurance=sigorta, other=diğer. Aynı tamamlanma tekrar maliyet eklememelidir.

Kaynak: vehicleServices.detail.dikkat; kapsam: vehicleServices

## Arac Servis / Yakit — Örnek senaryo ve beklenen sonuç

Örnek: TEST — Araç için tür service, kilometre 120, tutar 75 seçip Tamamla yapın. Araç kilometresi 120 ve ek maliyet 75 TL olmalıdır.

Kaynak: vehicleServices.detail.ornek; kapsam: vehicleServices

## Arac Servis / Yakit — İşlemden sonra ne kontrol edilir?

Belgenin güncel durumu, seçilen ilişkiler ve hesaplanan alanları kontrol edin. Hata çıktığında mesajı okuyun; yetki hatası için yöneticiye başvurun. Kaydı yeniden oluşturmak yerine önce Ara/Yenile ile mevcut işlemi bulun. Örnekler bağımsız senaryolardır; önceki örneğin stok veya bakiyesinin sizin veritabanınızda aynen bulunduğunu varsaymayın.

Kaynak: vehicleServices.detail.kontrol; kapsam: vehicleServices
