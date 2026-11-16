# Dogrulama — 0.3.0

14 Kasim 2026 Istanbul saati 17:14:55'te biten Ready.ps1 -SkipAcceptance calistirmasi basarilidir. Ana uygulama WAF ve izleme servisleriyle Docker uzerinde acik birakildi. test-results.json son sonucu ve onceki ayni uygulama koduna ait kabul testini birlikte kaydeder.

## Gecen kontroller

- 34 birim/domain/protokol/yetki/AI testi: 34 basarili, 0 basarisiz.
- 204 HTTP kabul kontrolu: ayni uygulama koduyla 14 Kasim 17:02'de baslayan onceki tam calistirmada gecti. Son calistirmada tekrar edilmedi; arada yalnizca izleme depolama izinleri ve tanilama duzeltildi. Testler ayri Atlas test veritabaninda, ModSecurity WAF uzerinden calisti.
- React production derlemesi ve npm audit --audit-level=high: basarili; audit 0 bildirim verdi.
- Ana uygulama HTTP kontrolu: API sagligi ve React ana sayfasi basarili.
- WAF: SQL enjeksiyonu, XSS ve dizin gecisi ornekleri HTTP 403 ile engellendi; WAF basligi dogrulandi.
- Prometheus: API ve WAF exporter hedefleri up durumunda.
- Loki: WAF gunlukleri sorgulanabildi. Test parolasinin canary degeri API/web/WAF gunluklerinde bulunmadi.
- Grafana: API sagligi ve veritabani durumu basarili.
- Alloy: veri klasoru izni duzeltildi; gunlukler Loki'ye ulasti. Tek seferlik depolama hazirlayicisinin basariyla kapanmasi normaldir.
- Lock dosyasi Docker'da uretildi; hosta paket kurulumu yapilmadi.

## Kabul kapsami

Satis/satin alma/stok/fatura/odeme, eszamanlilik ve rollback; CRM'den teklif; depo sayim/transfer ve yetersiz stok; BOM/uretim; adaydan calisan; izin bakiyesi/cakisma/iptal; puantaj; proje/gorev/zaman; bakim ve filo maliyeti; sayfa taslak/yayin/yeniden yayin; magaza; idempotent nakit POS; anket/etkinlik; NES icin yerel XML/numara; SMTP hata takibi kontrol edildi.

Yeni guvenlik senaryolari modul read/write/deny, rolsuz acik izin, bagimsiz rehber grant/deny, muhasebe-IK ayrimi, yetki degisiminde oturum iptali, kapali rehber kaynagini secme girisimi, AI hedefi SSRF kurallari, uyarlanan mulakat, yanit onayi, davet izolasyonu/yenileme/iptal ve tekrarlanan yanitin tekrar islenmemesini kapsar.

## Sinirlar

Gercek AI/iyzico/NES/SMTP hesaplariyla islem yapilmadi. AI kabul testi izole sahte saglayiciyla calisti; gercek modeli kullanmak icin yonetici UI'dan HTTPS ana adres, anahtar ve model girer. NES XML yerel uretildi, disariya belge gonderilmedi; e-posta testi .invalid alan adiyla hata takibini sinadi. Gercek sandbox odeme ve belge islemleri kendi test hesaplariyla ayrica denenmelidir.

Sesli avatar tarayicinin yerel Turkce sesine baglidir; yazili gorusme ses olmadan da calisir. Avatar, surukle-birak ve diger ekranlarin tam gorsel kullanici testi tamamlanmadi. React derlemesi/API testleri bu gorsel testlerin yerine gecmez. Onceki tarayici erisim reddi asilmaya calisilmadi.

Bu sonuc tum OWASP aciklarinin olmadigi, bagimsiz sizma testi, mevzuat uygunlugu, performans veya felaket kurtarma testi anlamina gelmez. Internet yayini icin HTTPS/cookie/ag erisim/yedekleme ayrica yapilandirilmalidir. Compose varsayilan olarak yalnizca localhost portlarini yayinlar.

## Izlenebilirlik

Codex oturumu Docker named-pipe kanalina erisemedi. Kullanici Ready.ps1'i kendi terminalinde calistirdi; paylasilan readiness-result.json ve sirlar arindirilmis readiness.log dosyalari incelendi. Ilk denemelerde web baslangic yetkisi ve Alloy veri klasoru izni sorunlari bulundu ve giderildi. Son basarili sonuc eski basarisiz denemelerin yerine kullanildi. Kabul testi sonucu tam calistirmadan, izleme sonucu son calistirmadan alinmistir.

Testler erp_db_acceptance veritabaninda kayit olusturdu; ana ERP kayitlari test fixture'lariyla doldurulmadi. Gercek sirlar .env veya LOCAL dosyalarindan paylasim arsivine alinmaz. settings_keys ve diger Docker volume'leri arsivde yoktur; yedekleme ayrica gerekir.
