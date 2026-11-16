# Test entegrasyonlarini acma

## 1. Sirket

Ayarlar ve Entegrasyonlar → Sirket. Ticari unvan, VKN/TCKN, vergi dairesi, adres/ilce/il/ulke ve 3 buyuk harfli fatura seri on ekini girin. Fatura numarasi 3 harf + 4 yil + 9 sira numarasidir. NES'e gonderilecek carinin de adres/vergi/etiket bilgilerini tamamlayin. Seri on ekini mevcut NES test hesabinizdaki seri kurallariyla eslestirin.

## 2. iyzico Sandbox

Ayarlar → iyzico Sandbox. Sandbox API key, secret key ve **disaridan erisilebilir, gecerli sertifikali HTTPS uygulama ana adresini** girin. API sunucusu sabit olarak sandbox-api.iyzipay.com'a gider. Callback yolu `/api/public/iyzico/callback` olur. Yerel HTTP localhost:8080 tek basina bu HTTPS kosulunu saglamaz; sizin HTTPS ters vekilinizin uygulamaya yonlendirilmesi gerekir. Bu proje kendiliginden internet portu acmaz veya ucretli alan adi/tunel olusturmaz.

Caride ad, soyad, sandbox alici TCKN'si, e-posta, telefon, adres, il ve ulke alanlarini tamamlayin. POS ekraninda urun ve cari secip iyzico Sandbox tahsilatina tiklayin. Kart bilgisi iyzico sayfasinda girilir. Donuste sonuc sayfasi acilir; ayrica Tahsilat Takibi ekranindaki sonuc sorgulama dugmesiyle ayni odeme dogrulanabilir. Pending odemeler icin stok rezervasyonu tutulur; tarayiciyi kapatmak rezerve stogu serbest birakmaz. Sonucu sorgulayarak odemeyi sonuclandirin. Saglayicidan dogrulanmis FAILURE gelirse rezervasyon geri alinir. Ag hatasinda sonucun bilinmedigi durumlarda otomatik yeni odeme acilmaz.

Kaynaklar:

- https://docs.iyzico.com/en/getting-started/preliminaries/authentication/hmacsha256-auth
- https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-initialize
- https://docs.iyzico.com/en/payment-methods/checkoutform/cf-implementation/cf-retrieve
- https://docs.iyzico.com/en/advanced/response-signature-validation

## 3. NES Test

Ayarlar → NES Test e-Donusum. Test hesabinizdaki Bearer API key, gonderici etiketi ve kaynak uygulama adini girin. e-Fatura icin carinin alici etiketini Kisiler ekranindan girin; test icin varsayilan alici etiketi de ayarlanabilir. e-Arsiv'de e-Fatura etiketleri kullanilmaz.

Musteri faturasini muhasebelestirin. Fatura ayrintisinda belge turunu secin, once UBL XML'i indirin/inceleyin, sonra NES TEST ortamına gonderin. Durum sorgusu ve PDF indirme ayni paneldedir. Gonderimde zaman asimi olursa sonucun bilinmedigi belirtilir; ayni belge otomatik tekrar gonderilmez. Once durumunu sorgulayin. Kayitli belge UUID'si ve numarasi tekrar XML hazirlandiginda degismez.

Resmi test teknik kaynaklari:

- https://developertest.nes.com.tr/docs
- https://apitest.nes.com.tr/einvoice/v1.swagger.taged.json
- https://apitest.nes.com.tr/earchive/v1.swagger.taged.json
- https://nes.com.tr/e-fatura-entegrasyonu

Kullanilan upload servisi `POST /v1/uploads/document`; UBL XML multipart dosya olarak gonderilir. `IsDirectSend`, `PreviewType`, `SourceApp`, `AutoSaveCompany` ve e-Fatura etiketleri ilgili servise gore eklenir. Durum ve PDF icin e-Fatura outgoing/invoices, e-Arsiv invoices uclari kullanilir. Uygulama canli NES adresine gecmez.

## 4. SMTP ve kampanya

Ayarlar → E-posta/SMTP. Genel DNS adina sahip sunucu, port, TLS, kullanici/parola, gonderen ve abonelikten cikis icin HTTPS uygulama adresini girin. Kaydedip baglantiyi test edin. Gizli alanlar kayittan sonra bos gosterilir; yanindaki Kayitli etiketi degerin saklandigini belirtir.

Kisiler ekraninda yalnizca izinli alicilarda E-posta pazarlama izni=yes secin. Kampanyada konu ve duz metin icerigi olusturun; hazirlayip gonderin. Gonderim durumlarini kampanya ayrintisindan kontrol edin. SMTP ag/kimlik dogrulama hatalari gercekten gonderildi diye raporlanmaz. Abonelikten cikis baglantisi e-postaya eklenir; ayni e-postaya sahip cari kayitlarinin izni kaldirilir.

## Saklama ve yedekleme

Entegrasyon anahtarlari/sifreleri yalnizca UI'dan alinir ve Atlas ayar koleksiyonunda sifreli tutulur. `settings_keys` Docker volume icindeki 32 baytlik anahtar, bu veritabaninin yedegiyle birlikte guvenli olarak yedeklenmelidir. `docker compose down -v` bu anahtari silebilir; normal `down` silmez. Anahtar kaybolursa eski ayar ve bekleyen odeme anahtar snapshot'lari acilamaz. Gizli ayarlarin acik halini loglara, ZIP'e veya Git'e eklemeyin.

MongoDB baglantisi ve ilk yonetici baslatma degerleri altyapi ayarlaridir; mevcut .env uzerinde kalir. Kullanici tarafli iyzico/NES/SMTP ayarlari icin .env girdisi gerekmez.
