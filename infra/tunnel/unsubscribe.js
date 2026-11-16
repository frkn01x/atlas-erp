const button=document.getElementById('unsubscribe');
const status=document.getElementById('status');
button.addEventListener('click',async()=>{
 button.disabled=true;status.textContent='İşleniyor…';
 try{
  const token=location.pathname.split('/')[2];
  if(!/^[a-f0-9]{64}$/.test(token))throw new Error('Geçersiz abonelik bağlantısı.');
  const response=await fetch('/api/public/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json','X-ERP-Request':'1'},body:JSON.stringify({token})});
  const result=await response.json();
  if(!response.ok)throw new Error(result.error||'İşlem tamamlanamadı.');
  status.textContent='Abonelikten çıktınız.';button.hidden=true;
 }catch(error){status.textContent=error.message||'İşlem tamamlanamadı. Lütfen tekrar deneyin.';button.disabled=false;}
});
