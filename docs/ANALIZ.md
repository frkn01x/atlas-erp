# Kaynak kod incelemesi

Kaynak: kullanicinin belirttigi `odoo-20.0.zip`. Arsivdeki talimatlar kullanici istegi olarak alinmadi; kaynak dosyalar metin/veri olarak okundu, Python kodu ve kurulum betikleri calistirilmadi. Gorsel dosyalari tasinmadi veya tasarim referansi olarak incelenmedi.

## Gercek kapsam

Arsivde 59.782 girdi ve 666 `__manifest__.py` bulunuyor. Bunlarin 663'u ust duzey eklenti; 3'u `test_base` altinda kurulum testi fiksturu. Manifestlerde 34 ana uygulama `application=True` olarak isaretli. Bunlara bagli teknik eklentiler, kopru moduller, ulke muhasebe yerellestirmeleri, odeme/tasiyici entegrasyonlari ve testler ayrica bulunuyor.

Model klasorlerinde 3.640 Python dosyasi, regex ile 1.420 adet `action_` veya `button_` adli islem metodu tespit edildi. Bu rakamlar tum is mantiginin sayisi degildir: hesaplanan alanlar, kisitlar, ORM hook'lari, wizard'lar, controller'lar ve diger metodlar da islev tasir. Envanter otomatik yapisal taramadir; her satirin elle incelendigi anlamina gelmez.

Her manifest icin ad, ozet, kategori, bagimliliklar ve lisans alanlari; model dosyasi ve islem adlari `shared/catalog.json` icinde tutulur. Tek satirli sabit olmayan manifest degerleri bos kalabilir. Kaynak Python ifadeleri calistirilmadi.

## Mimari farki

Odoo'nun kaynak yapisi Python ORM modelleri, PostgreSQL iliskileri, XML gorunumleri, CSV/XML erisim kurallari, moduller arasi kalitim, controller'lar, cron gorevleri, wizard'lar ve web varliklarindan olusur. Bunlar React'e dosya uzantisi degistirerek tasinamaz. Yeni uygulamada React ekranlari, Node.js HTTP API'si, MongoDB Atlas koleksiyonlari, sunucu tarafli izinler ve acik durum gecisleri yazildi.

`shared/modules.js` yeni uygulamanin alan ve durum tanimlarini paylasir. Bu dosya is alanlarini tanimlar; kaynak Odoo modullerinin kodunu calistiran bir uyumluluk katmani degildir. MongoDB'de varsayilan `atlas_erp_` on ekiyle records, users, sessions ve audits koleksiyonlari kullanilir. Paralar integer kurus cinsindendir; stok urun bazinda tek bakiyedir.

## Satis / satin alma / stok / muhasebe icin kod kanitlari

- `addons/purchase/models/purchase_order.py:698`: `button_approve`, siparisi satin alma durumuna getirir. `:708` `button_confirm`, uygun baslangic durumunu ve onay kosullarini kontrol eder; cift onay icin `to approve` durumuna gecis de vardir. Yeni surumde tek onay uygulanmistir; limitli/cift onay yoktur.
- `addons/purchase_stock/models/purchase_order.py`: satin alma onayi stok akisina baglanir. Yeni uygulamada onay, fiziksel teslim alma ve tedarikci faturasi ayri adimlardir. Parcali teslim/backorder yoktur.
- `addons/sale/models/sale_order.py`: `action_confirm`, iptal, kilitleme, fatura goruntuleme ve odeme baglantilari vardir. Yeni surum taslak → onay → tam sevk → tam fatura akisini uygular; iptal/iade/iskonto politikasi ve faturalanabilir miktar kurallari henuz yoktur.
- `addons/stock/models/stock_picking.py`: onay, rezervasyon (`action_assign`), `button_validate`, iade, bolme, hurda ve paketleme ayridir. Yeni surum yalnızca tam miktarda stok giris/cikis defteri ve negatif stok engeli uygular. Rezervasyon, lot/seri, lokasyon, paket ve geri siparis eksiktir.
- `addons/account/models/account_move.py:6771`: `action_register_payment`, sadece posted muhasebe kayitlari icin odemeye izin verir. `:6864` `action_post`, ana muhasebelestirme akisina gecer. Yeni surumde de taslak faturaya odeme yapilamaz. Musteri/tedarikci faturasi, tek vergi orani/satir, tam manuel odeme ve odenmemis faturada ters fis vardir.
- `addons/account/security/account_security.xml`: salt okunur, faturalama, muhasebe ve yonetici yetkileri ayrismistir. Yeni surumde accountant operasyon rolu ve admin kullanici yonetimi ayrildi. Odoo'nun alan/kayit bazli tum kurallari tasinmadi.
- `odoo/addons/base/security/base_groups.xml`: ic kullanici, yonetici, portal, public, coklu sirket ve coklu para birimi gibi gruplar vardir. Yeni surumde portal/public kayit sistemi veya coklu sirket secimi yoktur.

## Diger ana alanlar

Uretim, BOM, bakim/onarim; calisan, puantaj, izin, masraf, aday ve yetkinlik; proje/gorev/zaman kaydi; POS/restoran; e-ticaret/site/egitim; etkinlik/anket; e-posta/SMS pazarlama; takvim/mesaj/destek ve veri temizleme ana uygulama aileleridir.

Yeni surumde uretimin basit bilesen tuketimi tamamlanma islemine baglanmistir. Diger ailelerin cogu temel kayit alanlariyla temsil edilir. Ornegin mesaj kaydi canli sohbet degildir; kampanya taslagi e-posta/SMS gondermez; yayin kaydi gercek bir web sayfasi yayini yapmaz. Bu fark ekranlarda ve kapsam belgesinde belirtilmistir.

Her ana uygulamanin listesi ve bagimliliklari `application-modules.md`; teknik moduller dahil tam durum matrisi `migration-matrix.csv` icindedir. Kalem kalem farklar kapatilmadan ve kabul testleri gecmeden modul esdegerligi iddia edilmemelidir.

## Teknik dayanaklar

Birden cok kayitta atomik islem icin MongoDB surucusunun `withTransaction` API'si kullanilir: https://www.mongodb.com/docs/drivers/node/current/crud/transactions/

Zorunlu ortam degerleri Docker Compose interpolation ile denetlenir: https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/
