# Parola değişimiyle eşzamanlı oturum oluşturma düzeltmesi

İzole testte önceki kodla eski paroladan gelen bekletilmiş giriş, parola değişimi tamamlandıktan sonra oturum üretebildi ve korumalı kullanıcı bilgisine erişebildi. Gerçek kullanıcılar veya Atlas bu testte kullanılmadı.

Giriş artık oturum eklemeden önce aynı MongoDB işlemi içinde kullanıcı satırına, doğrulanan passwordHash/active/authzVersion koşuluyla yazma yapar. Parola veya yetki değişimi aynı satıra yazdığı için işlemler serileşir; güncel olmayan doğrulama yeniden denemede reddedilir. Oturum authzVersion taşır ve korumalı her istekte güncel kullanıcı sürümüyle karşılaştırılır. Kendi parolasını değiştirme de sürümü artırır ve eski doğrulamayla yarışan ikinci değişimi reddeder.

Regresyon testi gerçek uygulama HTTP yollarını ve yalnızca geçici yerel test MongoDB replica set'ini kullanır. Eski kimlik snapshot'ı oturum işleminden önce bekletilir; parola değiştirilir; eski girişin reddi, eski oturumların reddi, yeni parola ile giriş ve iki eşzamanlı normal giriş kontrol edilir. Eski sürümle oluşturulmuş sahte oturumun middleware'de reddi de kontrol edilir. Üretim sunucusuna test hook'u eklenmedi.

Fix-Login.ps1 önce bu izole testi ve ilgili ağsız birim testlerini çalıştırır; yalnızca geçerlerse API'yi günceller. Mevcut eski oturumlarda sürüm alanı bulunmadığından kullanıcılar bir kez yeniden giriş yapmalıdır. Hesaplar ve mevcut parolalar değiştirilmez. İş modüllerinin kodları değiştirilmedi; giriş, çıkış, parola değiştirme ve rol değişikliği sonrası oturum iptali tekrar kontrol edilmelidir.
