# Guncel kapsam: secilen 20 temel is alani

Kullanicinin son kapsam karari, Odoo'daki tum 663 eklentiyi tasimak yerine sectigi 20 is alaninin temel islemlerini calistirmaktir. Guncel davranislar MODULLER.md, entegrasyon kurulumu ENTEGRASYONLAR.md, gercek test sonuclari DOGRULAMA.md icindedir.

## Kodlanan kapsam

CRM'den teklif; satis/satin alma ve stok; depo sayim/transfer; recete/uretim; fatura ve otomatik muhasebe; calisan/ise alim/izin/puantaj; proje/gorev/zaman; POS kasa; e-ticaret sepeti; surukle-birak sayfa yayini; SMTP kampanya kuyrugu; ekipman/bakim ve filo giderleri; anket/etkinlik ziyaretci formlari.

Iyzi ve NES entegrasyonlari yalnizca test ortamlarina baglanir. Sirket, e-posta ve API ayarlari yonetici UI'sindan alinir; gizli degerler sifreli saklanir. Gercek saglayici basarisi ile saglayici protokol/fixture testleri ayri degerlendirilir.

## Bu surumde olmayan ileri ozellikler

- Kismi kabul/sevk/fatura/odeme, iskonto/fiyat listesi, iade ve odeme iadesi.
- FIFO/agirlikli maliyet, lot/seri, paket ve otomatik stok degerleme.
- Coklu sirket/para birimi, banka mutabakati, tam hesap plani ve mevzuat raporlari.
- Bordro, vardiya, resmi tatil takvimi ve otomatik izin hak edisi.
- MRP kapasite planlama, is merkezleri, operasyon rotasi ve alt uretim zinciri.
- Fiziksel POS cihazi, offline kasa ve kasa gun sonu oturumu.
- Tum UBL-TR vergi/istisna/tevkifat/iade senaryolari; yerel yazdirma ciktisinin resmi e-belge yerine gecmesi.
- E-posta inbox/bounce analizi, otomatik ag hatasi tekrari ve canli SMS/sohbet.

Bunlar secilen temel is akislarinin calistigi iddiasiyla karistirilmamalidir. Kaynak modul ile tam Odoo esdegerligi iddia edilmez. Tum kaynak manifestlerinin teknik envanteri korunur; menude yalnizca secilen alanlar ve destek ekranlari gosterilir.
