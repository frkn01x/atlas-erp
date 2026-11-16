# Ödeme rezervasyonu ve 5122 politikası

- Kullanıcının seçtiği politika: sorgulamada 5122 alınırsa stok rezervasyonu aynı işlem içinde kaldırılır, sipariş iptal edilir ve ödeme released olur. Sağlayıcı oturumu iptal edilmiş sayılmaz.
- Serbest bırakılmış oturumdan sonradan imzası/tutarı doğrulanmış ödeme gelirse payment_review kaydedilir. Stok tekrar ayrılmaz, sipariş tamamlanmaz ve otomatik fatura üretilmez. Yönetici sağlayıcı üzerinden iade/teslimat için incelemelidir; otomatik iade yapılmaz.
- Tekrarlanan 5122 rezervasyonu ikinci kez çözmez. Kesinleşmiş başarılı ödeme sonradan gelen 5122 ile geri alınmaz.
- Yeni kayıtlar 15 dakika sonra kontrol edilir. Görev 30 saniyede bir en fazla beş kayıt işler; eski kayıtların oluşturulma zamanı kullanılır. API kapalıysa görev çalışmaz; açıldığında geciken kayıtları seçer. Beş dakikalık kayıt kilidi çoklu worker çakışmasını sınırlar.
- Ağ hatası ve 5122 dışı belirsizliklerde stok korunur. Giderek uzayan aralıklarla altı otomatik denemeden sonra yönetici incelemesi gerekir.
- Serbest bırakılmış veya gecikmiş ödeme kayıtları Tahsilat Takibi ekranında gösterilir ve tekrar sorgulanabilir. Sağlayıcı tokeni geç ödeme kontrolü için korunur.

## Doğrulama

Check-Reservations.ps1; ağsız Docker içinde sahte verilerle zamanlama/kilit/tekrar, 5122 serbest bırakma, geri alma ve geç ödeme korumasını; ayrıca protokol testlerini ve React derlemesini kontrol eder. Birim testleri gerçek Atlas veya sağlayıcı çağırmaz. Ardından güncellenen normal uygulama görevi mevcut gecikmiş ödemeleri kayıtlı iyzico ayarlarıyla sorgulayabilir.

Manuel tekrar kontrolü ödeme/POS, stok rezervasyonu ve ilgili sipariş/fatura/sevkiyat akışlarıyla sınırlıdır. İK, roller, mülakat ve diğer ilgisiz modüllere dokunulmadı.
