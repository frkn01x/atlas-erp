import {nesErrorDetail} from './nes-error-detail.js';
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { fail,Fault } from './domain.js';
export const iyziPaths={initialize:'/payment/iyzipos/checkoutform/initialize/auth/ecom',retrieve:'/payment/iyzipos/checkoutform/auth/ecom/detail'};
export function iyziHeaders(config,path,body,nonce=randomBytes(20).toString('hex')){
 const signature=createHmac('sha256',config.secretKey).update(nonce+path+body).digest('hex');
 return {'Content-Type':'application/json','x-iyzi-rnd':nonce,Authorization:'IYZWSv2 '+Buffer.from(`apiKey:${config.apiKey}&randomKey:${nonce}&signature:${signature}`).toString('base64')};
}
export function verifyIyzi(response,secret,stage){
 const fields=stage==='initialize'?['conversationId','token']:['paymentStatus','paymentId','currency','basketId','conversationId','paidPrice','price','token'];
 const normalized=k=>['paidPrice','price'].includes(k)?String(response[k]).replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,''):String(response[k]??'');
 const expected=createHmac('sha256',secret).update(fields.map(normalized).join(':')).digest('hex');
 const supplied=response.signature;fail(typeof supplied==='string'&&/^[a-f0-9]{64}$/i.test(supplied)&&timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(supplied,'hex')),'iyzico yanit imzasi dogrulanamadi.',502);
}
export async function iyziCall(config,stage,payload,fetcher=fetch){
 fail(config.apiKey&&config.secretKey,'iyzico anahtarlarini Ayarlar ekranindan girin.',409);const path=iyziPaths[stage];fail(path,'Bilinmeyen odeme islemi.');const body=JSON.stringify(payload);
 let response;try{response=await fetcher('https://sandbox-api.iyzipay.com'+path,{method:'POST',headers:iyziHeaders(config,path,body),body,redirect:'error',signal:AbortSignal.timeout(20000)});}catch{throw new Fault(502,'iyzico sandbox baglantisi kurulamadi.');}
 fail(response.ok,'iyzico sandbox HTTP istegini reddetti.',502);const result=await response.json();
 if(result.status!=='success'){
  const code=String(result.errorCode||'unknown').slice(0,30);
  const error=new Fault(422,stage==='retrieve'&&code==='5122'?'Odeme sonucu bulunamadi (5122).':`iyzico islemi reddetti (${code}).`);
  error.providerCode=code;throw error;
 }
 verifyIyzi(result,config.secretKey,stage);return result;
}
export async function nesCall(config,kind,path,{method='GET',body,fetcher=fetch,binary=false}={}){
 fail(config.apiKey,'NES API anahtarini Ayarlar ekranindan girin.',409);fail(['einvoice','earchive'].includes(kind)&&path.startsWith('/v1/'),'Gecersiz NES servisi.');
 let r;try{r=await fetcher(`https://apitest.nes.com.tr/${kind}${path}`,{method,headers:{Authorization:`Bearer ${config.apiKey}`},body,redirect:'error',signal:AbortSignal.timeout(25000)});}catch{throw new Fault(502,'NES test servisine baglanilamadi.');}
 if(!r.ok){const detail=await nesErrorDetail(r,config.apiKey);throw new Fault(422,`NES test servisi istegi reddetti (HTTP ${r.status}).${detail?' NES: '+detail:' Belge ve hesap yetkilerini kontrol edin.'}`);}return binary?Buffer.from(await r.arrayBuffer()):r.status===204?{}:r.json();
}
export const xmlEscape=v=>String(v??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const amount=n=>(n/100).toFixed(2);
export const invoiceIssueDate=date=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));
export function invoiceXml(invoice,seller,buyer,products,kind){
 for(const party of [seller,buyer])fail(party.name&&/^\d{10,11}$/.test(party.taxId||'')&&party.address&&party.city,'Sirket ve carinin unvan, VKN/TCKN, adres ve il bilgilerini tamamlayin.');
 fail(invoice.documentNumber&&invoice.documentUuid,'Fatura belge numarasi gerekli.');
 const e=xmlEscape,d=invoice.data;
 const party=p=>`<cac:Party><cac:PartyIdentification><cbc:ID schemeID="${p.taxId.length===10?'VKN':'TCKN'}">${e(p.taxId)}</cbc:ID></cac:PartyIdentification><cac:PartyName><cbc:Name>${e(p.name)}</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>${e(p.address)}</cbc:StreetName><cbc:CitySubdivisionName>${e(p.district||'Merkez')}</cbc:CitySubdivisionName><cbc:CityName>${e(p.city)}</cbc:CityName><cac:Country><cbc:Name>${e(p.country||'Turkiye')}</cbc:Name></cac:Country></cac:PostalAddress><cac:PartyTaxScheme><cac:TaxScheme><cbc:Name>${e(p.taxOffice||'')}</cbc:Name></cac:TaxScheme></cac:PartyTaxScheme>${p.taxId.length===11?`<cac:Person><cbc:FirstName>${e(p.name)}</cbc:FirstName><cbc:FamilyName>${e(p.surname||p.name)}</cbc:FamilyName></cac:Person>`:''}</cac:Party>`;
 const groups=new Map();for(const l of d.lines){const net=Math.round(l.quantity*l.unitPrice),tax=Math.round(net*l.taxRate/100),g=groups.get(l.taxRate)||{net:0,tax:0};g.net+=net;g.tax+=tax;groups.set(l.taxRate,g);}
 const taxSub=(rate,net,tax)=>`<cac:TaxSubtotal><cbc:TaxableAmount currencyID="TRY">${amount(net)}</cbc:TaxableAmount><cbc:TaxAmount currencyID="TRY">${amount(tax)}</cbc:TaxAmount><cbc:Percent>${rate}</cbc:Percent><cac:TaxCategory><cac:TaxScheme><cbc:Name>KDV</cbc:Name><cbc:TaxTypeCode>0015</cbc:TaxTypeCode></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal>`;
 fail(d.lines.every(l=>l.taxRate>0),'Bu ilk e-belge surumunde KDV istisnasi desteklenmiyor; sifir KDV icin istisna kodu gerekir.');
 return `<?xml version="1.0" encoding="UTF-8"?><Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"><cbc:UBLVersionID>2.1</cbc:UBLVersionID><cbc:CustomizationID>TR1.2</cbc:CustomizationID><cbc:ProfileID>${kind==='earchive'?'EARSIVFATURA':'TEMELFATURA'}</cbc:ProfileID><cbc:ID>${e(invoice.documentNumber)}</cbc:ID><cbc:CopyIndicator>false</cbc:CopyIndicator><cbc:UUID>${e(invoice.documentUuid)}</cbc:UUID><cbc:IssueDate>${invoiceIssueDate(invoice.createdAt)}</cbc:IssueDate><cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode><cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode><cbc:LineCountNumeric>${d.lines.length}</cbc:LineCountNumeric><cac:AccountingSupplierParty>${party(seller)}</cac:AccountingSupplierParty><cac:AccountingCustomerParty>${party(buyer)}</cac:AccountingCustomerParty><cac:TaxTotal><cbc:TaxAmount currencyID="TRY">${amount(d.tax)}</cbc:TaxAmount>${[...groups].map(([r,g])=>taxSub(r,g.net,g.tax)).join('')}</cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="TRY">${amount(d.subtotal)}</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="TRY">${amount(d.subtotal)}</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="TRY">${amount(d.total)}</cbc:TaxInclusiveAmount><cbc:AllowanceTotalAmount currencyID="TRY">0.00</cbc:AllowanceTotalAmount><cbc:PayableAmount currencyID="TRY">${amount(d.total)}</cbc:PayableAmount></cac:LegalMonetaryTotal>${d.lines.map((l,i)=>{const net=Math.round(l.quantity*l.unitPrice),tax=Math.round(net*l.taxRate/100);return `<cac:InvoiceLine><cbc:ID>${i+1}</cbc:ID><cbc:InvoicedQuantity unitCode="C62">${l.quantity}</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="TRY">${amount(net)}</cbc:LineExtensionAmount><cac:TaxTotal><cbc:TaxAmount currencyID="TRY">${amount(tax)}</cbc:TaxAmount>${taxSub(l.taxRate,net,tax)}</cac:TaxTotal><cac:Item><cbc:Name>${e(products[l.productId]||l.productId)}</cbc:Name></cac:Item><cac:Price><cbc:PriceAmount currencyID="TRY">${amount(l.unitPrice)}</cbc:PriceAmount></cac:Price></cac:InvoiceLine>`;}).join('')}</Invoice>`;
}
