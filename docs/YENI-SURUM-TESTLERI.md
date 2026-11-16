# 0.3.0 kullanimi ve kabul kontrolleri

Bu surumun Docker derlemesi, API kabul testleri ve WAF/monitoring kontrolleri Ready.ps1 ile yapilir. Kodun bulunmasi testlerin gectigi anlamina gelmez; readiness-result.json sonucunu kontrol edin. Paketler sadece Docker icine kurulur. Mevcut uygulama verileri silinmez; kabul testleri ayri .env.test veritabanini kullanir.

## 1. Daha az tiklama

Satis > Satis siparisleri ve Satin Alma > Satin alma siparisleri listelerinde durumun izin verdigi islemler dogrudan satirda gorunur. Ayrinti acip kapatmadan siradaki islemi yapin. Kritik stok/muhasebe islemleri onay ister. Acik ayrinti penceresi islemden sonra yeni durum ve butonlarla guncellenir. Yeni kayit olusturunca ayrinti acilir. Ayni eski surumle iki kez islem denemesi ikinci stok/muhasebe hareketini olusturmamalidir.

## 2. Kullanici yetkileri

Yonetim > Kullanicilar ekraninda kullanici olustururken veya duzenlerken modul bazinda erisim yok, sadece goruntule veya islem yap secin. Rol varsayilani da kullanilabilir. Acikca erisim yok secimi rol yetkisinden ustundur. Admin tum modullere erisir; sinirli kullanicida admin rolu vermeyin. Salt okunur kayit turlerine yazma yetkisi verilmez.

Yetki kaydinda kullanicinin mevcut oturumlari iptal edilir; yeniden giris gerekir. Iki yonetici ayni eski kullanici surumunu kaydederse ikincisi yenilemelidir. Depo hareketi gerektiren siparis teslim/alma islemleri ayrica stok/depo islem yetkisi ister.

## 3. Sistem rehberi ve chatbot

SISTEM-REHBERI.md yoneticiye ait tam rehberdir; tum dosyayi siradan kullanicilara dagitmayin. AI Rehber ekraninda yalnizca izinli modul bilgileri sunulur. Modulun uygulama izniyle chatbot rehber izni ayridir: yonetici IK rehberini muhasebeciye acabilir, bu IK kayitlarini acmaz.

Model sadece izinli rehber bolumlerini secer. Kullaniciya dondurulen cevap sunucudaki yetkili rehber metnidir; modelin serbest metni gosterilmez. Gercek ERP kayitlari bu chatbota bagli degildir. AI ayari yoksa yerel rehber aramasi calisir. Yetki iptalinde sunucu yeniden denetler; eski oturum gecersiz olur.

## 4. Konusan avatarli mulakat

AI Mulakat ekraninda pozisyon, teknik gereksinimler ve 2-10 soru belirleyin. Adaya sureli davet linkini paylasabilirsiniz. Davet anahtari linkin fragment kismindadir; sorgu/loga eklenmez. Linki yenilemek eskisini, gorusmeyi kapatmak daveti gecersiz kilar. Davet 24 saat gecerlidir; oturum kayitlari 30 gun sonra TTL ile temizlenir (MongoDB temizligi anlik degildir).

Aday saglayiciya iletim onayindan sonra yazarak yanitlar; AI sonraki teknik soruyu onceki yanitlara gore uretir. Animasyonlu insan avatarinda yerel Turkce tarayici sesi varsa soru seslendirilir. Yerel Turkce ses yoksa yazili gorusme devam eder. Mikrofon/kamera gerektirmez. Gercek insan videosu degildir. Teknik geri bildirim verilir; otomatik ise alma/eleme karari veya aday puani verilmez. Aday adinin secilmesi bu adi AI'a gondermez; metinlere hassas bilgi yazilmamalidir.

## 5. Saglayici ayarlari

Yonetici Ayarlar ekranindaki AI grubuna HTTPS API ana adresi (ornegin saglayicinin /v1 adresi), API anahtari ve model adini girer. Baglantiyi dogrula butonu kucuk bir model istegi yapar ve saglayici ucretlendirebilir. OpenRouter ve OpenAI Chat Completions protokolunu uygulayan saglayicilar hedeflenir; farkli protokoller otomatik desteklenmez. Model gerektiriyorsa max_completion_tokens secilebilir. Sicaklik bos birakilabilir.

Anahtarlar sunucuda AES-GCM ile sifrelenir, web yanitinda geri verilmez. Anahtarlar env uzerinden girilmez. Ozel ag/localhost/metadata hedefleri, URL icinde parola, yonlendirmeler ve DNS'in ozel adrese cozulmesi engellenir. Bu nedenle yerel LAN AI sunucusu bu surumde desteklenmez. settings_keys Docker volume yedegi anahtarlarin geri acilmasi icin gereklidir. Gercek saglayici dogrulamasi kullanicinin kendi API ayarlariyla ayrica yapilmalidir; otomatik testler yapay saglayici kullanir.

## 6. WAF ve izleme

Trafik ModSecurity + OWASP CRS uzerinden uygulamaya gider. API ve web hosta ayri port acmaz. Yerel uygulama localhost:8080, Grafana localhost:3001 adresindedir. Grafana girisi LOCAL-MONITORING.txt dosyasindadir; bu dosyayi paylasmayin. Prometheus API/WAF metriklerini, Alloy guvenli erisim gunluklerini Loki'ye toplar. Grafana'da Atlas ERP panosu hazirdir. Promtail yerine desteklenen Alloy kullanilir.

Prometheus metrikleri 7 gun/512 MB, Loki gunlukleri 72 saat tutulur. Gunluklerde istek govdesi, parola, AI anahtari veya sorularin tam metni tutulmaz. WAF engelleri guvenli erisim gunlugundeki 403 ve istek kimligiyle izlenir; hassas govde kaydi icin ModSecurity audit ciktilari disari yazilmaz. Grafana ve izleme servisleri is verilerine erisim vermez. Prometheus uyarilari panoda gorunur; e-posta/SMS alarm gonderimi ayarlanmamistir.

## Guvenlik sinirlari ve kontrol plani

Sunucuda modul/sirket filtreleri, oturum iptali, CSRF ozel baslik denetimi, hiz limitleri, veri dogrulama, iyimser surum kontrolu ve transaction tabanli stok/muhasebe hareketleri uygulanir. Tarayicida CSP ve iframe engeli vardir. WAF SQLi/XSS/dizin gecisi ornekleriyle; AI izin sizdirmasi, davet izolasyonu/iptali ve tekrar yanit mantigi kabul testleriyle denetlenir. Bagimlilik audit kontrolu Docker icinde calisir. Bunlar tum OWASP aciklarinin olmadigini kanitlayan bagimsiz sizma testi degildir.

Internet yayini icin alan adi, HTTPS, guvenli cookie, Atlas IP ag kurallari ve yedek/geri yukleme plani gerekir. Mevcut compose yalnizca yerel localhost portlarini yayinlar. Kullanici manuel testleri Docker otomatik kontrolleri gectikten sonra baslamalidir.
