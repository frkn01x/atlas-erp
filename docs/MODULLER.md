# Secilen 20 is alani — 0.2.0

Bu surumun kapsami kullanicinin sectigi temel is alanlaridir. Odoo arsivinin tum teknik eklentileriyle esdegerlik hedeflenmez. Asagidaki davranislar kodlanmistir; hangi testlerin gercekten gectigi DOGRULAMA.md dosyasinda ayri tutulur.

1. **CRM:** firsat asamalari, beklenen gelir, cari ve teklif satirlari; firsattan bir defa satis teklifi olusturma.
2. **Satis:** teklif/siparis, onay, depodan tam sevk, musteri faturasi. Isleme alinmis siparisin satirlari degistirilemez.
3. **Satin alma:** siparis, onay, secilen depoya tam kabul ve tedarikci faturasi.
4. **Stok/depo:** depo kartlari, urun ve depo bazinda bakiye, sayim/acilis miktari uygulama, depolar arasi transfer, stok defteri, negatif/kullanilabilir stok engeli. Eski urun bakiyeleri ilk hareketlerinde ana depo bakiyesi olarak degerlendirilir.
5. **Uretim/MRP:** birim urun recetesi, receteden uretim emri, onay, bilesen tuketimi ve mamul girisi. Manuel uretim emri de acilabilir.
6. **Faturalama:** musteri/tedarikci faturasi, satir bazli KDV, yazdirilabilir belge; NES test icin UBL XML hazirlama, e-Fatura/e-Arsiv gonderim, belge durumu ve PDF alma baglantilari.
7. **Muhasebe:** otomatik dengeli fisler, tam odeme kaydi, henuz odenmemis faturada ters fis, hesap bazinda mizan. POS nakit CASH; iyzico tahsilati BANK hesabina kaydedilir.
8. **Insan kaynaklari:** calisan, departman/gorev/yonetici bilgileri ve izin hakki/kullanim bakiyesi.
9. **Ise alim:** aday asamalari, teklif, ise alma islemiyle calisan karti olusturma.
10. **Izin:** tarih araligi, hafta ici is gunu hesabi, onaya gonderme, onay/ret, onayli izin cakismasi ve bakiye engeli, iptalde bakiyenin geri verilmesi. Resmi tatil takvimi bu hesapta yoktur.
11. **Puantaj:** giris/cikis kaydi, ayni calisanda ikinci acik kaydi engelleme, cikista toplam saat hesaplama. Tek kayit 24 saati asamaz.
12. **Proje:** proje ve bagli gorevler, gorev asamalari, acik gorev varken projeyi tamamlamama.
13. **Zaman cizelgesi:** calisan/proje/gorev ve gun bazinda saat, onay, saatlik tutar ve faturalanabilir toplam; calisanin gunluk onayli saatleri 24'u asamaz.
14. **POS:** urun arama, sepet, cari secimi, sunucudan fiyat/KDV hesabi, nakit kaydi veya iyzico sandbox hosted odeme sayfasi. Ayni istek kimligi ikinci bir nakit satis olusturmaz.
15. **E-ticaret:** yayinlanmis urun vitrini, sepet, alici/teslimat formu, server tarafli fiyat, odeme icin stok rezervasyonu; dogrulanmis tahsilattan sonra fatura ve sevkiyata hazir siparis.
16. **Web sitesi:** blok kutuphanesi, surukle-birak ekleme/siralama, klavyeyle yukari/asagi tasima, metin/gorsel/tema/buton ozellikleri, onizleme, taslak/yayin ayirimi, yayindan kaldirma. Ham HTML veya JavaScript calistirilmaz.
17. **E-posta pazarlama:** SMTP ayarlari, baglanti testi, kampanya konusu/duz metin, yalnizca izinli alici listesi, gonderim kuyrugu, basarili/hatali teslim sayilari, abonelikten cikis. Alici basi en fazla bir kayit; kampanya basina 500 alici siniri. Otomatik hatali gonderim tekrari yapilmaz.
18. **Bakim:** ekipman karti, oncelikli bakim talebi, durum takibi, tamamlanma tarihi ve ekipmana islenen bakim maliyeti.
19. **Filo:** arac/surucu, kilometre, sigorta/muayene tarihleri, servis/yakit/sigorta gideri, geriye giden kilometre engeli ve toplam arac maliyeti.
20. **Anket/etkinlik:** yayina acilan ziyaretci formlari, serbest metinli anket cevaplari, etkinlik kaydi, e-posta basina tek katilim/yanit, kontenjan engeli ve yonetimden yanit goruntuleme. Kontenjan 0 veya bos ise sinirsizdir.

## Destek ekranlari

Kisiler, urunler, kullanici/roller, denetim kaydi, tahsilat takibi, operasyon ozeti ve Ayarlar/Entegrasyonlar ekranlari bu alanlari destekler. Secilen kapsamda 30 is/yapi alani menude sunulur. Kaynak arsiv icin daha once hazirlanan teknik envanter ayrica korunur; kapsam disi taslaklar menude gosterilmez.

## Entegrasyon ayarlari

Yonetici uygulama icindeki **Ayarlar ve Entegrasyonlar** ekranindan sirket, iyzico, NES ve SMTP bilgilerini girer. Bunlar icin .env anahtari okunmaz. Gizli alanlar AES-256-GCM ile sifrelenir; sirket/alan kimligi de sifrelemeye baglanir. API, gizli degeri geri dondurmez. Bos birakmak mevcut anahtari korur; temizleme secenegi anahtari kaldirir. Sifreleme anahtari ayri Docker volume icindedir.

iyzico yalnizca sandbox, NES yalnizca apitest servislerine gider. iyzico sonucu imza, siparis, token, tutar, para birimi ve fraudStatus=1 ile dogrulanir. Callback tek basina odeme kaniti sayilmaz. Kart bilgileri bu uygulamada toplanmaz. Baslatilan odemeler icin kullanilan anahtarlar sifreli snapshot olarak tutulur; ayar degisikligi eski odemeyi otomatik olarak bozmaz.

## Sinirlar

Bu temel surumde kismi kabul/sevk/fatura/odeme, iade/iskonto, stok degerleme/FIFO, lot/seri, vardiya/bordro, resmi tatil/izin hak edisi, MRP kapasite/is merkezi, fiziksel POS cihazi, banka mutabakati ve tam mevzuat raporlamasi yoktur. UBL temel TRY/SATIS/KDV'li fatura senaryosuyla sinirlidir; sifir KDV istisna kodu, tevkifat ve iade senaryosu eklenmemistir. Yerel yazdirma ciktisi resmi e-belge degildir.

Gercek iyzico sandbox ve NES hesabiyla islem, kullanici UI'dan test anahtarlarini girdikten sonra ayrica dogrulanmalidir. Otomatik testlerde sahte/yerel saglayici yanitlari kullanilir; bunlar saglayicida kabul kaniti degildir. SMTP teslimi icin de kullanicinin kendi sunucusunda baglanti ve izinli deneme gonderimi gereklidir. Gonderimde ag zaman asimi varsa alici teslimi kontrol edilmeden tekrar gonderilmemelidir.
