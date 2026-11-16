# Yerel iyzico sandbox ödeme dönüşü

Uygulama localhost üzerinde kalır. Docker içindeki cloudflared, geçici bir HTTPS adresini yalnızca iyzico dönüşüne yönlendirir. Bilgisayarın masaüstünü, dosyalarını veya bütün ERP sayfalarını yayımlamak için hazırlanmış değildir. Açık kalan dönüş yolu dışarıdan istek alır; tünel risksiz veya sıfır riskli diye sunulmaz.

## Başlatma

Docker Desktop açıkken proje klasöründe:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Start-Payment-Tunnel.ps1"
```

Bilgisayara cloudflared paketi kurulmaz; cloudflare/cloudflared:2026.11.0 Docker imajı kullanılır. Cloudflare hesabı veya alan adı gerekmez. Bu geçici tünel yalnızca geliştirme ve test içindir.

Betik önce mevcut ERP servislerini açar. callback-gateway servisi yalnızca POST /api/public/iyzico/callback yolunu WAF'a iletir; diğer yollar 404 döner. Yönetim, giriş ve mağaza yollarının kapalı olduğu Docker içindeki tunnel-check ile denenir. Sonra tünel başlatılır ve dış HTTPS adresinde de yol kontrolü yapılır. Kontrol başarısız olursa tünel ve geçit kapatılır.

Başarıda terminalde ve LOCAL-TUNNEL.txt dosyasında https://rastgele-ad.trycloudflare.com biçiminde ana adres gösterilir. Bu adresi yönetici hesabıyla Sistem → Ayarlar ve Entegrasyonlar → iyzico Sandbox → HTTPS uygulama adresi alanına yazıp Ayarları kaydet kullanın. Sonuna /api veya callback yolu eklemeyin.

Sonuç dosyası tunnel-result.json; günlük payment-tunnel.log dosyasıdır. Başlatma sonucunda ok=true, running=false ve scope=iyzico-callback-only beklenir. running alanı betiğin çalışmasını ifade eder; başarılı işlemden sonra tünel Docker'da açık kalır.

## Ödeme akışı

ERP'yi http://localhost:8080 üzerinden kullanmaya devam edin; APP_PORT değiştiyse kendi portunuzu kullanın. Ödeme de aynı tarayıcıda bu localhost adresinden başlatılmalıdır. Uygulamayı bir yerde 127.0.0.1, başka yerde localhost olarak karıştırmayın.

Ödeme iyzico sandbox sayfasında yürür. Dönüş, dış HTTPS adresinden geçide ve WAF üzerinden API'ye gelir. API sonucu sağlayıcıdan sorgular. Geçit, ödeme sonuç sayfasına yönlendirmeyi yeniden yerel localhost adresine çevirir. Böylece ERP arayüzü dış tünelden sunulmadan yerelde devam eder. Ödeme sonucu yine Tahsilat Takibi ekranından sorgulanabilir.

Bu hazırlığın tamamlanması başarılı gerçek sandbox ödemesi yapıldığı anlamına gelmez; kart adımı ve sonuç ayrıca kullanıcının test hesabıyla doğrulanmalıdır. Başlangıç testleri eksik token ile yalnızca yol erişimini dener, dışarıya ödeme başlatmaz.

## Kapatma

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Stop-Payment-Tunnel.ps1"
```

ERP'nin yerel servisleri açık kalır; cloudflared ve callback-gateway durur. Tünel arka planda Docker'da çalıştığı için yalnızca PowerShell penceresini kapatmak tüneli kapatmaz. Test bitince kapatma betiğini kullanın. Yeniden başlatıldığında yeni bir adres oluşur; yeni ödeme başlatmadan önce UI'daki adresi güncelleyin. Eski tünel kapandıysa eski adrese dönmeye çalışan açık ödemeler için manuel durum sorgulaması gerekebilir.

Tünel adresini bilen biri izin verilen yola istek gönderebilir. Tünel üzerinden geçen test ödeme dönüşü Cloudflare altyapısından geçer. Yalnızca demo alıcı ve sandbox kart bilgileri kullanın. Üretim yayını için bu geçici yöntem kullanılmaz.

Kaynak: [Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

Hazırlıkta Compose ve PowerShell/JavaScript sözdizimi kontrol edildi. Docker motoruna agent oturumundan erişim reddedildiği için çalışma testleri kullanıcının başlattığı betik ve sonuç dosyaları üzerinden ayrıca doğrulanmalıdır.
