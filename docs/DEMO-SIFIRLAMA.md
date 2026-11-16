# Demo iş kayıtlarını sıfırlama

Bu işlem kullanıcının 15 Kasım 2026 talebiyle tüm demo iş kayıtları için hazırlanmıştır. Sadece TEST adlarını aramaz. Ana demo şirketindeki tüm ürünler, cariler, stok/sayım/transfer hareketleri, siparişler, faturalar, muhasebe fişleri, İK/proje/pazarlama/site kayıtları ve bağlantılı iş verileri silinir.

Korunanlar: kullanıcılar, roller, modül/rehber izinleri, entegrasyon ayarları ve anahtarları, oturumlar, geçmiş denetim kayıtları, belge numara sayaçları. Silinmiş belgelere ait denetim geçmişi bu nedenle görünmeye devam edebilir. Dış iyzico/NES sistemlerindeki işlemler bu araçla silinmez veya iptal edilmez. Yeni iş belgelerinde numaralar birden başlamayabilir.

PowerShell:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File ".\Reset-Demo.ps1"
```

Betik güncel API imajını Docker içinde derler, API/e-posta işçisini durdurur, tek bootstrap yöneticisinin şirketini belirler. Şirket kapsamlı records, payments, mail_deliveries, submissions ve interviews koleksiyonlarını ayrı dosyalara BSON Extended JSON biçiminde yedekler. Dosya özetleri ve kayıt sayıları manifest.json dosyasına yazılır; dosyalar yeniden okunarak doğrulanır. Şirket filtresi olmayan toplu silme veya dropDatabase kullanılmaz.

Yedekten sonra kayıt sayısı değişirse işlem iptal edilir. Silmeler tek transaction içindedir; başarısızlık halinde transaction geri alınır. İşlem bir denetim kaydı bırakır ve kalan iş kayıtlarının sıfır olduğu kontrol edilir. Sonrasında uygulama yeniden başlatılır. Yedek alınmadan veya doğrulanmadan silme yapılmaz. Yedekler kişisel veri içerebilir; paylaşmayın.

Sonuç: reset-demo-result.json. Günlük: reset-demo.log. Yedekler: .private/backups/tarih-saat/. Sonuç hem ok=true hem appReady=true olduğunda bakım ve yeniden başlatma başarılıdır. Yedek manifestindeki database/prefix/companyId, kayıt sayıları ve SHA-256 özetleri geri yükleme öncesinde denetlenmelidir. Geri yükleme manuel bakım gerektirir: API durdurulmalı, EJSON dosyaları BSON tipleri korunarak ayrıştırılmalı, yalnızca aynı şirketin boş koleksiyonlarına transaction ile geri alınmalıdır. Bu betik otomatik geri yükleme çalıştırmaz.

Uygulama açılınca Ctrl+F5 yapın. Ürün/cari/sipariş/fatura ve diğer iş ekranları boş; test kullanıcıları ve AI ayarları mevcut olmalıdır. Rehber güncellendiği için API yeniden başlamış olmalıdır.

Hazırlıkta JavaScript/PowerShell sözdizimi ve 30 modülün 226 rehber bölümü kontrol edildi. Docker yürütme sonucu ayrıca reset-demo-result.json ile doğrulanmalıdır; önceki Ready test sonucu bu bakım komutunun çalıştırıldığı anlamına gelmez.
