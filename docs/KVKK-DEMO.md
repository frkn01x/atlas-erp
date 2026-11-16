# Demo giriş bilgilendirmesi ve zorunlu kutu

15 Kasım 2026: login formunda /kvkk bağlantısı ve varsayılan olarak boş rıza beyanı kutusu bulunur. Kutu işaretlenmeden buton açılmaz. Sunucu privacyAccepted değerinin boolean true ve privacyVersion değerinin güncel sürüm olmasını denetler; eski oturumlar geçersizdir. Başarılı kimlik doğrulamadan sonra oturum ve demo_login_consent denetim kaydı aynı transaction içinde oluşturulur. Metin sürümü, kapsam, kullanıcı ve sunucu zamanı kaydedilir. Parola veya IP bu beyan kaydına eklenmez.

Bu işlev kullanıcı talebiyle demo akışı için uygulanmıştır. Hizmeti zorunlu rızaya bağlamak geçerli bir KVKK açık rızası sağlamaz; ürün metninde ve kaynak bağlantısında açıkça belirtilir. Şirket/başvuru bilgileri uydurulmamıştır; demo bilgilendirmesi gerçek kullanıma yönelik tamamlanmış aydınlatma metni değildir.

Tam metin KVKK-DEMO-METNI.md içindedir; arayüzdeki metinden üretilmiştir. Pazarlama/AI/yurt dışı aktarım için genel rıza olarak sunulmaz.

Yeni kabul senaryoları: işaretlenmeyen kutu, string true, eski sürüm reddi; reddedilen girişten sonra oturum bulunmaması; başarılı girişte metin sürümünün denetim kaydında bulunması. Önceki 14 Kasım test sonucu bu değişikliklerden öncedir. Bu oturumda Docker motoruna erişim reddedildiği için güncel Docker derlemesi/kabul testleri çalıştırılamadı; yalnızca JavaScript sözdizimi kontrol edildi. Ready.ps1 tam çalıştırması gerekir (SkipAcceptance kullanılmamalı).
