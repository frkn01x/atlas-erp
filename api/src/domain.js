import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { moduleMap, transitions } from '../../shared/modules.js';
import { validBlocks } from '../../shared/blocks.js';
export class Fault extends Error { constructor(status,message){super(message);this.status=status;} }
export const fail=(condition,message,status=400)=>{if(!condition)throw new Fault(status,message);};
export const oidPattern=/^[a-f0-9]{24}$/i;
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
export function literalRegex(value){return Array.from(value,c=>'.*+?^${}()|[]'.includes(c)||c.charCodeAt(0)===92?String.fromCharCode(92)+c:c).join('');}
export function hashPassword(p){fail(typeof p==='string'&&p.length>=16&&p.length<=256,'Parola 16-256 karakter olmali.');const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(p,salt,64).toString('hex')}`;}
export function verifyPassword(p,stored){if(typeof p!=='string'||p.length>256)return false;const [salt,hex]=stored.split(':');const actual=scryptSync(p,salt,64);const expected=Buffer.from(hex,'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);}
export function cents(v){fail(typeof v==='string'||typeof v==='number','Gecersiz tutar.');const s=String(v);fail(/^\d{1,10}(\.\d{1,2})?$/.test(s),'Tutar negatif olamaz ve en fazla iki ondalik icermeli.');const [a,b='']=s.split('.');const n=Number(a)*100+Number(b.padEnd(2,'0'));fail(Number.isSafeInteger(n),'Tutar siniri asildi.');return n;}
export function positive(v){fail((typeof v==='number'||typeof v==='string')&&/^\d+(\.\d{1,3})?$/.test(String(v)),'Miktar en fazla 3 ondalik olmali.');const n=Number(v);fail(Number.isFinite(n)&&n>0&&n<=1000000,'Miktar 0-1.000.000 araliginda olmali.');return n;}
export function totals(lines){let subtotal=0,tax=0;for(const l of lines){const n=Math.round(l.quantity*l.unitPrice);subtotal+=n;tax+=Math.round(n*l.taxRate/100);}fail(Number.isSafeInteger(subtotal+tax)&&subtotal+tax<=1e12,'Belge tutari cok buyuk.');return {subtotal,tax,total:subtotal+tax};}
export function validateInput(id,input){
  const m=moduleMap[id];fail(m,'Modul bulunamadi.',404);fail(!m.readOnly,'Bu kayitlar is akisindan olusur.',403);
  fail(input&&typeof input==='object'&&!Array.isArray(input),'Gecersiz kayit.');
  const out={};
  for(const f of m.fields){let v=input[f.key];if(v===undefined||v===null||v===''){fail(!f.required,`${f.label} zorunlu.`);continue;}
    if(['lines','components'].includes(f.type)&&Array.isArray(v)&&!v.length&&!f.required)continue;
    if(f.type==='blocks'){try{out[f.key]=validBlocks(v);}catch(e){throw new Fault(400,e.message);}continue;}
    if(f.type==='money'){out[f.key]=cents(v);continue;}
    if(f.type==='number'){v=Number(v);fail(Number.isFinite(v)&&v>=0&&v<=1e9,`${f.label} gecersiz.`);out[f.key]=v;continue;}
    if(f.type==='lines'||f.type==='components'){
      fail(Array.isArray(v)&&v.length>0&&v.length<=100,'1-100 urun satiri gerekli.');
      out[f.key]=v.map(l=>{fail(l&&typeof l.productId==='string'&&oidPattern.test(l.productId),'Gecerli urun secin.');const row={productId:l.productId,quantity:positive(l.quantity)};
        if(f.type==='lines'){row.unitPrice=cents(l.unitPrice);row.taxRate=Number(l.taxRate??0);fail(Number.isFinite(row.taxRate)&&row.taxRate>=0&&row.taxRate<=100,'Vergi orani 0-100 olmali.');}
        return row;});continue;
    }
    fail(typeof v==='string'&&v.length<=(f.type==='textarea'?20000:500),`${f.label} gecersiz veya cok uzun.`);
    v=v.trim();fail(!f.required||v.length>0,`${f.label} zorunlu.`);
    if(f.type==='relation')fail(oidPattern.test(v),'Gecerli iliskili kayit secin.');
    if(f.type==='select')fail(f.options.includes(v),`${f.label} secimi gecersiz.`);
    if(f.type==='email')fail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),'E-posta gecersiz.');
    if(f.type==='date'){const parsed=new Date(v);fail(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(parsed)&&parsed.toISOString().slice(0,10)===v,`${f.label} gecersiz.`);}
    if(f.type==='datetime-local')fail(!isNaN(Date.parse(v)),`${f.label} gecersiz.`);
    out[f.key]=v;
  }
  if(id==='products')fail(out.taxRate<=100,'Vergi 0-100 olmali.');
  if(out.startDate&&out.endDate)fail(out.endDate>=out.startDate,'Bitis baslangictan once olamaz.');
  if(out.checkOut)fail(out.checkOut>=out.checkIn,'Cikis giristen once olamaz.');
  if(out.endsAt)fail(out.endsAt>=out.startsAt,'Bitis baslangictan once olamaz.');
  if(id==='manufacturing'){out.quantity=positive(out.quantity);fail(!out.components.some(l=>l.productId===out.productId),'Mamul kendi bileseni olamaz.');}
  if(id==='boms')fail(!out.components.some(l=>l.productId===out.productId),'Mamul kendi bileseni olamaz.');
  if(id==='stockTransfers')out.quantity=positive(out.quantity);
  if(id==='stockAdjustments'&&out.count>0)out.count=positive(out.count);
  if(id==='events'&&out.capacity!==undefined)fail(Number.isInteger(out.capacity)&&out.capacity<=100000,'Kontenjan 0-100000 arasinda tam sayi olmali (0: sinirsiz).');
  if(id==='surveys'){const qs=out.questions.split('\n').map(q=>q.trim()).filter(Boolean);fail(qs.length>0&&qs.length<=50&&qs.every(q=>q.length<=500),'1-50 soru kullanin; her soru en fazla 500 karakter olmali.');out.questions=qs.join('\n');}
  if(out.lines)Object.assign(out,totals(out.lines));
  if(id==='website')fail(out.slug&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(out.slug),'Sayfa adresi kucuk harf, rakam ve tire olmali.');
  if(id==='stockTransfers')fail((out.fromWarehouseId||'main')!==(out.toWarehouseId||'main'),'Cikis ve giris deposu farkli olmali.');
  if(id==='timesheets')fail(out.hours>0&&out.hours<=24,'Gunluk zaman kaydi 0-24 saat araliginda olmali.');
  if(out.imageUrl)fail(/^https:\/\//.test(out.imageUrl),'Gorsel adresi HTTPS olmali.');
  return out;
}
export function nextState(m,state,action){fail(transitions(m,state).includes(action),'Bu durumda bu islem yapilamaz.',409);return ({confirm:'confirmed',deliver:'delivered',invoice:'invoiced',receive:'received',bill:'billed',post:'posted',pay:'paid',reverse:'reversed',complete:'done',submit:'submitted',approve:'approved',reject:'rejected',hire:'hired',checkOut:'done',cancelLeave:'cancelled',apply:'done',transfer:'done',produce:'active',quote:state,publish:'published',unpublish:'draft',checkout:'paid',sendCampaign:'sending'})[action]||action;}
export function workingDays(start,end){let days=0;for(let d=new Date(start+'T12:00:00Z'),last=new Date(end+'T12:00:00Z');d<=last;d.setUTCDate(d.getUTCDate()+1)){if(![0,6].includes(d.getUTCDay()))days++;fail(days<=366,'Izin araligi cok uzun.');}return days;}
export function posting(invoice){const vendor=invoice.kind==='vendor';const d=invoice.subtotal,t=invoice.tax,total=d+t;fail(total>0,'Sifir tutarli fatura muhasebelestirilemez.');return vendor?[{account:'EXPENSE',debit:d,credit:0},{account:'VAT_INPUT',debit:t,credit:0},{account:'AP',debit:0,credit:total}]:[{account:'AR',debit:total,credit:0},{account:'REVENUE',debit:0,credit:d},{account:'VAT_OUTPUT',debit:0,credit:t}];}
export function payment(invoice){const t=invoice.total;return invoice.kind==='vendor'?[{account:'AP',debit:t,credit:0},{account:'BANK',debit:0,credit:t}]:[{account:'BANK',debit:t,credit:0},{account:'AR',debit:0,credit:t}];}
export function balanced(lines){fail(lines.every(l=>Number.isSafeInteger(l.debit)&&Number.isSafeInteger(l.credit)&&l.debit>=0&&l.credit>=0),'Gecersiz muhasebe satiri.');fail(lines.reduce((s,l)=>s+l.debit-l.credit,0)===0,'Borc ve alacak dengeli degil.');return lines;}
export function csv(rows,keys){const cell=v=>{let s=typeof v==='object'?JSON.stringify(v):String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};return '\uFEFF'+[keys.map(cell).join(','),...rows.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\r\n');}
