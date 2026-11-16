import { enhanceModules, operationTransitions } from './operations-schema.js';
import {hasModule} from './access.js';
const f = (key, label, type = 'text', required = false, extra = {}) => ({ key, label, type, required, ...extra });
const fields = {
  contact: [f('name','Ad / unvan','text',true), f('email','E-posta','email'), f('phone','Telefon'), f('taxId','Vergi no'), f('address','Adres'), f('kind','Tur','select',true,{options:['customer','vendor','both']})],
  product: [f('name','Urun adi','text',true),f('sku','Stok kodu','text',true),f('price','Satis fiyati','money',true),f('cost','Alis maliyeti','money',true),f('taxRate','Vergi %','number',true)],
  order: [f('name','Belge adi','text',true),f('partnerId','Cari','relation',true,{relation:'contacts'}),f('lines','Urun satirlari','lines',true)],
  basic: [f('name','Baslik','text',true),f('description','Aciklama','textarea'),f('dueDate','Tarih','date')],
  employee: [f('name','Ad soyad','text',true),f('email','Is e-postasi','email'),f('department','Departman'),f('job','Gorev'),f('manager','Yonetici')]
};
function mod(id,label,source,group,roles,fs=fields.basic,states=['draft','active','done'],extra={}) {
  return {id,label,source,group,roles,fields:[...fs],states,level:'basic',...extra};
}
export const modules = [
  mod('contacts','Kisiler','contacts','Satis',['sales','purchaser','accountant','hr'],fields.contact,['active'],{level:'core'}),
  mod('products','Urunler','product','Stok',['sales','purchaser','warehouse'],fields.product,['active'],{level:'core'}),
  mod('crm','CRM / Firsatlar','crm','Satis',['sales'],[...fields.basic,f('partnerId','Musteri','relation',false,{relation:'contacts'}),f('expectedRevenue','Beklenen gelir','money')],['draft','qualified','proposal','won','lost']),
  mod('sales','Satis Siparisleri','sale_management','Satis',['sales'],fields.order,['draft','confirmed','delivered','invoiced'],{level:'core'}),
  mod('purchases','Satin Alma','purchase','Tedarik',['purchaser'],fields.order,['draft','confirmed','received','billed'],{level:'core'}),
  mod('invoices','Faturalar','account','Muhasebe',['accountant'],[...fields.order,f('kind','Fatura turu','select',true,{options:['customer','vendor']})],['draft','posted','paid','reversed'],{level:'core'}),
  mod('inventory','Stok Hareketleri','stock','Stok',['warehouse'],[],[],{level:'core',readOnly:true}),
  mod('journal','Muhasebe Fisleri','account','Muhasebe',['accountant'],[],[],{level:'core',readOnly:true}),
  mod('manufacturing','Uretim Emirleri','mrp','Uretim',['production'],[...fields.basic,f('productId','Mamul','relation',true,{relation:'products'}),f('quantity','Miktar','number',true),f('components','Recete bilesenleri','components',true)],['draft','confirmed','done'],{level:'core'}),
  mod('maintenance','Bakim','maintenance','Uretim',['production'],[...fields.basic,f('equipment','Ekipman'),f('assignee','Teknisyen')],['draft','active','done']),
  mod('repairs','Onarim','repair','Uretim',['production'],[...fields.basic,f('serialNumber','Seri no')],['draft','active','done']),
  mod('employees','Calisanlar','hr','Insan Kaynaklari',['hr'],fields.employee,['active','archived']),
  mod('attendance','Puantaj','hr_attendance','Insan Kaynaklari',['hr'],[f('name','Kayit adi','text',true),f('employeeId','Calisan','relation',true,{relation:'employees'}),f('checkIn','Giris','datetime-local',true),f('checkOut','Cikis','datetime-local')],['active','done']),
  mod('leave','Izin Talepleri','hr_holidays','Insan Kaynaklari',['hr'],[...fields.basic,f('employeeId','Calisan','relation',true,{relation:'employees'}),f('startDate','Baslangic','date',true),f('endDate','Bitis','date',true)],['draft','submitted','approved','rejected']),
  mod('expenses','Masraflar','hr_expense','Insan Kaynaklari',['hr','accountant'],[...fields.basic,f('amount','Tutar','money',true)],['draft','submitted','approved','rejected']),
  mod('recruitment','Ise Alim','hr_recruitment','Insan Kaynaklari',['hr'],[...fields.basic,f('email','Aday e-postasi','email'),f('position','Pozisyon')],['draft','interview','offered','hired','rejected']),
  mod('skills','Yetkinlikler','hr_skills','Insan Kaynaklari',['hr'],[...fields.basic,f('employeeId','Calisan','relation',true,{relation:'employees'}),f('level','Seviye','select',true,{options:['beginner','intermediate','advanced']})]),
  mod('fleet','Arac Filosu','fleet','Insan Kaynaklari',['hr'],[...fields.basic,f('plate','Plaka','text',true),f('odometer','Kilometre','number'),f('driver','Surucu')]),
  mod('lunch','Yemek Siparisleri','lunch','Insan Kaynaklari',['hr'],[...fields.basic,f('vendor','Tedarikci'),f('amount','Tutar','money')]),
  mod('projects','Projeler','project','Hizmetler',['project'],fields.basic),
  mod('tasks','Gorevler','project','Hizmetler',['project'],[...fields.basic,f('projectId','Proje','relation',true,{relation:'projects'}),f('assignee','Sorumlu')],['draft','active','done']),
  mod('todo','Yapilacaklar','project_todo','Hizmetler',['project'],fields.basic),
  mod('timesheets','Zaman Kayitlari','hr_timesheet','Hizmetler',['project'],[...fields.basic,f('projectId','Proje','relation',true,{relation:'projects'}),f('hours','Saat','number',true)]),
  mod('calendar','Takvim','calendar','Verimlilik',['project','hr','sales'],[...fields.basic,f('startsAt','Baslangic','datetime-local',true),f('endsAt','Bitis','datetime-local',true)]),
  mod('discuss','Mesaj Kayitlari','mail','Verimlilik',['project','hr','sales'],[...fields.basic,f('channel','Kanal')]),
  mod('pos','POS Satislari','point_of_sale','Satis',['sales'],fields.order,['draft','confirmed','delivered','invoiced'],{level:'basic',flow:'sales'}),
  mod('restaurant','Restoran Masalari','pos_restaurant','Satis',['sales'],[...fields.basic,f('table','Masa no'),f('seats','Kapasite','number')]),
  mod('website','Web Sayfalari','website','Web',['marketing'],[...fields.basic,f('slug','Adres yolu')],['draft','published']),
  mod('ecommerce','E-ticaret Siparisleri','website_sale','Web',['sales'],fields.order,['draft','confirmed','delivered','invoiced'],{flow:'sales'}),
  mod('courses','Egitimler','website_slides','Web',['marketing'],[...fields.basic,f('content','Ders icerigi','textarea')],['draft','published']),
  mod('jobs','Is Ilanlari','website_hr_recruitment','Web',['hr'],[...fields.basic,f('location','Konum')],['draft','published','closed']),
  mod('events','Etkinlikler','website_event','Pazarlama',['marketing'],[...fields.basic,f('capacity','Kapasite','number'),f('location','Konum')],['draft','published','done']),
  mod('surveys','Anketler','survey','Pazarlama',['marketing'],[...fields.basic,f('questions','Sorular','textarea')],['draft','published','closed']),
  mod('emailMarketing','E-posta Kampanyalari','mass_mailing','Pazarlama',['marketing'],[...fields.basic,f('subject','Konu'),f('body','Icerik','textarea')],['draft','ready']),
  mod('smsMarketing','SMS Kampanyalari','mass_mailing_sms','Pazarlama',['marketing'],[...fields.basic,f('body','Mesaj','textarea')],['draft','ready']),
  mod('marketingCards','Pazarlama Kartlari','marketing_card','Pazarlama',['marketing'],fields.basic,['draft','ready']),
  mod('livechat','Destek Talepleri','im_livechat','Web',['sales'],[...fields.basic,f('email','Musteri e-postasi','email')],['draft','active','done']),
  mod('dataRecycle','Veri Arsiv Talepleri','data_recycle','Verimlilik',['admin'],fields.basic,['draft','reviewed'])
];
enhanceModules(modules);
export const roles = ['admin','manager','sales','purchaser','accountant','warehouse','production','hr','project','marketing'];
export const moduleMap = Object.assign(Object.create(null),Object.fromEntries(modules.map(m=>[m.id,m])));
export function allowed(user, module, write = false) {
  return hasModule(user,module,write);
}
export function transitions(m,state) {
  const flow=m.flow||m.id;
  if(operationTransitions[m.id])return operationTransitions[m.id][state]||[];
  const special={sales:{draft:['confirm'],confirmed:['deliver'],delivered:['invoice']},purchases:{draft:['confirm'],confirmed:['receive'],received:['bill']},invoices:{draft:['post'],posted:['pay','reverse']},manufacturing:{draft:['confirm'],confirmed:['complete']},leave:{draft:['submit'],submitted:['approve','reject']},expenses:{draft:['submit'],submitted:['approve','reject']},crm:{draft:['qualified','lost'],qualified:['proposal','lost'],proposal:['won','lost']},recruitment:{draft:['interview','rejected'],interview:['offered','rejected'],offered:['hired','rejected']}};
  if(special[flow])return special[flow][state]||[];
  const i=m.states.indexOf(state);
  return i>=0 && i<m.states.length-1?[m.states[i+1]]:[];
}
export const actionLabels={confirm:'Onayla',deliver:'Sevk et',invoice:'Fatura olustur',receive:'Teslim al',bill:'Tedarikci faturasi',post:'Muhasebelestir',pay:'Odemeyi kaydet',reverse:'Ters kayit',complete:'Uretimi tamamla',submit:'Onaya gonder',approve:'Onayla',reject:'Reddet',active:'Baslat',done:'Tamamla',published:'Yayinla',ready:'Hazirla',archived:'Arsivle',quote:'Satis teklifi olustur',hire:'Ise al / calisan olustur',checkOut:'Cikis yap',cancelLeave:'Izni iptal et',apply:'Sayimi uygula',transfer:'Transfer et',produce:'Uretim emri ac',publish:'Yayinla',unpublish:'Yayindan kaldir',checkout:'Kasada tahsil et',sendCampaign:'Kampanyayi gonder'};
