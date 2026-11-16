import {fail,hashToken} from './domain.js';
export function candidateAllowed(s,key,now=new Date()){return !!s&&!s.invitationRevoked&&s.inviteExpiresAt>now&&typeof key==='string'&&key.length===64&&hashToken(key)===s.inviteHash;}
export function validateInterviewReply(value,remaining){
 fail(typeof value.feedback==='string'&&value.feedback.length<=2500,'Mulakat AI geribildirim bicimi gecersiz.',502);
 if(remaining>0)fail(typeof value.question==='string'&&value.question.trim().length>=8&&value.question.length<=1500,'Mulakat AI soru bicimi gecersiz.',502);
 const text=`${value.question||''} ${value.feedback}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').replaceAll('ı','i');
 fail(!/yasiniz|medeni durum|hamile|cinsiyetiniz|dini inanc|etnik koken|saglik durumunuz|engellilik durumunuz|sendika uyeligi|ise alinmali|ise alinmay|ise almayin|aday.{0,30}(elenmeli|ise uygun)|(?:puan|skor)\s*[:=]\s*\d/.test(text),'Model hassas kisisel soru veya ise alim karari uretti; yanit kullanilmadi.',502);
 return {question:remaining>0?value.question.trim():'',feedback:value.feedback.trim()};
}
