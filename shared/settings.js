export const settingGroups = {
 ai:{label:'AI / OpenRouter uyumlu API',fields:[['baseUrl','Chat Completions API ana adresi (ornek: https://openrouter.ai/api/v1)'],['apiKey','API anahtari','secret'],['model','Model kimligi (saglayicinizdaki tam ad)'],['tokenParameter','Token parametresi (bos/max_tokens veya max_completion_tokens)'],['temperature','Sicaklik (istege bagli 0-2; bos birakilabilir)']]},
 company:{label:'Sirket ve belge bilgileri',fields:[['name','Ticari unvan'],['taxId','VKN / TCKN'],['taxOffice','Vergi dairesi'],['address','Adres'],['district','Ilce'],['city','Il'],['country','Ulke'],['email','E-posta'],['invoicePrefix','Fatura seri on eki (3 harf)']]},
 iyzico:{label:'iyzico Sandbox',fields:[['apiKey','API anahtari','secret'],['secretKey','Gizli anahtar','secret'],['publicUrl','HTTPS uygulama adresi (odeme donusu)']]},
 nes:{label:'NES Test e-Donusum',fields:[['apiKey','Bearer API anahtari','secret'],['senderAlias','Gonderici etiketi / SenderAlias'],['receiverAlias','Varsayilan alici etiketi'],['sourceApp','Kaynak uygulama adi']]},
 smtp:{label:'E-posta / SMTP',fields:[['host','SMTP sunucusu'],['port','Port'],['secure','TLS (yes / no)'],['user','Kullanici'],['password','Parola','secret'],['from','Gonderen e-posta'],['fromName','Gonderen adi'],['publicUrl','Abonelikten cikis icin HTTPS uygulama adresi']]}
};
export const secretFields=Object.fromEntries(Object.entries(settingGroups).map(([k,g])=>[k,g.fields.filter(f=>f[2]==='secret').map(f=>f[0])]));
