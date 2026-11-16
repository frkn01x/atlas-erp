const f=(key,label,type='text',required=false,extra={})=>({key,label,type,required,...extra});
const rel=(key,label,relation,required=false)=>f(key,label,'relation',required,{relation});
export function enhanceModules(modules){
 const map=Object.fromEntries(modules.map(m=>[m.id,m]));
 const add=(id,label,group,roles,fields,states,source)=>{const m={id,label,group,roles,fields,states,source,level:'workflow'};modules.push(m);map[id]=m;};
 const extra=(id,fields)=>map[id].fields.push(...fields);
 extra('contacts',[f('surname','Soyadi'),f('city','Il'),f('district','Ilce'),f('country','Ulke'),f('zipCode','Posta kodu'),f('receiverAlias','e-Fatura alici etiketi'),f('marketingConsent','E-posta pazarlama izni','select',false,{options:['yes','no']})]);
 extra('products',[f('online','Magazada yayinla','select',false,{options:['yes','no']}),f('description','Urun aciklamasi','textarea'),f('imageUrl','HTTPS gorsel adresi')]);
 for(const id of ['sales','purchases'])extra(id,[rel('warehouseId','Depo (bos: ana depo)','warehouses')]);
 extra('crm',[f('lines','Teklif urunleri','lines')]);
 extra('employees',[f('leaveAllowance','Yillik izin hakki (gun)','number')]);
 extra('recruitment',[f('department','Departman')]);
 extra('timesheets',[rel('employeeId','Calisan','employees',true),rel('taskId','Gorev','tasks'),f('workDate','Calisma tarihi','date',true),f('hourlyRate','Saatlik tutar','money'),f('billable','Faturalanabilir','select',false,{options:['yes','no']})]);
 map.timesheets.states=['draft','submitted','approved'];
 extra('tasks',[f('plannedHours','Planlanan saat','number')]);
 extra('fleet',[rel('driverId','Surucu','employees'),f('insuranceDate','Sigorta bitisi','date'),f('inspectionDate','Muayene tarihi','date')]);
 extra('maintenance',[rel('equipmentId','Ekipman','equipment',true),f('priority','Oncelik','select',true,{options:['normal','high','urgent']}),f('cost','Bakim maliyeti','money')]);
 extra('manufacturing',[rel('bomId','Urun recetesi','boms'),rel('warehouseId','Depo','warehouses')]);
 extra('website',[f('blocks','Sayfa bloklari','blocks')]);
 extra('events',[f('startsAt','Baslangic','datetime-local',true),f('endsAt','Bitis','datetime-local',true)]);
 map.surveys.fields=map.surveys.fields.filter(f=>f.key!=='questions');extra('surveys',[f('questions','Her satira bir soru','textarea',true)]);
 map.emailMarketing.states=['draft','ready','sending','sent'];
 add('warehouses','Depolar','Stok',['warehouse'],[f('name','Depo adi','text',true),f('address','Adres')],['active'],'stock');
 add('stockAdjustments','Stok Sayimi / Acilis','Stok',['warehouse'],[f('name','Sayim adi','text',true),rel('productId','Urun','products',true),rel('warehouseId','Depo (bos: ana depo)','warehouses'),f('count','Sayilan miktar','number',true)],['draft','done'],'stock');
 add('stockTransfers','Depolar Arasi Transfer','Stok',['warehouse'],[f('name','Transfer adi','text',true),rel('productId','Urun','products',true),f('quantity','Miktar','number',true),rel('fromWarehouseId','Cikis deposu (bos: ana)','warehouses'),rel('toWarehouseId','Giris deposu (bos: ana)','warehouses')],['draft','done'],'stock');
 add('boms','Urun Receteleri','Uretim',['production'],[f('name','Recete adi','text',true),rel('productId','Mamul','products',true),f('components','Birim mamul bilesenleri','components',true)],['active'],'mrp');
 add('equipment','Ekipmanlar','Uretim',['production'],[f('name','Ekipman adi','text',true),f('serialNumber','Seri no'),f('location','Konum'),f('nextMaintenance','Sonraki bakim','date')],['active','archived'],'maintenance');
 add('vehicleServices','Arac Servis / Yakit','Insan Kaynaklari',['hr'],[f('name','Islem adi','text',true),rel('vehicleId','Arac','fleet',true),f('serviceDate','Tarih','date',true),f('odometer','Kilometre','number',true),f('cost','Tutar','money',true),f('kind','Tur','select',true,{options:['service','fuel','insurance','other']})],['draft','done'],'fleet');
 for(const id of ['crm','employees','recruitment','leave','attendance','projects','tasks','timesheets','maintenance','fleet','events','surveys','website','ecommerce','pos','emailMarketing'])map[id].level='workflow';
 const selected=new Set(['contacts','products','crm','sales','purchases','invoices','inventory','journal','manufacturing','maintenance','employees','attendance','leave','recruitment','fleet','projects','tasks','timesheets','pos','website','ecommerce','events','surveys','emailMarketing','warehouses','stockAdjustments','stockTransfers','boms','equipment','vehicleServices']);
 for(const m of modules)m.enabled=selected.has(m.id);
}
export const operationTransitions={
 crm:{draft:['qualified','lost'],qualified:['proposal','lost'],proposal:['quote','won','lost'],won:['quote']},
 recruitment:{draft:['interview','rejected'],interview:['offered','rejected'],offered:['hire','rejected']},
 attendance:{active:['checkOut']},leave:{draft:['submit'],submitted:['approve','reject'],approved:['cancelLeave']},
 timesheets:{draft:['submit'],submitted:['approve']},stockAdjustments:{draft:['apply']},stockTransfers:{draft:['transfer']},
 boms:{active:['produce']},website:{draft:['publish'],published:['publish','unpublish']},
 pos:{draft:['checkout']},emailMarketing:{draft:['ready'],ready:['sendCampaign']}
};
