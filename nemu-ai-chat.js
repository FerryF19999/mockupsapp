(()=>{
const q=s=>document.querySelector(s),form=q('#nxFinderForm'),input=q('#nxFinderInput'),results=q('#nxFinderResults'),body=q('.nx-finder-body'),send=form.querySelector('button'),original=form.onsubmit;
let pending=null,indicator=null;
function fitInput(){input.style.height='24px';if(input.value)input.style.height=Math.min(96,input.scrollHeight)+'px'}
input.addEventListener('input',fitInput);
new MutationObserver(fitInput).observe(q('#nxFinder'),{attributes:true,attributeFilter:['open']});
const transcript=document.createElement('div');transcript.className='nx-ai-thread';results.before(transcript);
const svg=path=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';
const icons={copy:svg('<rect x="8" y="3" width="12" height="15" rx="2"/><path d="M16 21H6a2 2 0 0 1-2-2V8"/>'),like:svg('<path d="M7 10v11H3V10Zm0 0 5-7c2 0 2 2 1 6h6a2 2 0 0 1 2 2l-2 8a2 2 0 0 1-2 2H7"/>'),dislike:svg('<path d="M7 14V3H3v11Zm0 0 5 7c2 0 2-2 1-6h6a2 2 0 0 0 2-2l-2-8a2 2 0 0 0-2-2H7"/>')};
function idle(){send.innerHTML='↑';send.setAttribute('aria-label','Kirim pencarian');input.readOnly=false;form.removeAttribute('aria-busy');pending=null}
function cancel(){if(pending!==null){clearTimeout(pending);indicator?.remove();idle()}}
function reset(){cancel();transcript.replaceChildren()}
q('#askNemu').addEventListener('click',reset);q('#nxFoodAI')?.addEventListener('click',reset);q('#nxSearchHistory').addEventListener('click',reset);q('#nxFinder').addEventListener('close',cancel);
send.addEventListener('click',e=>{if(pending!==null){e.preventDefault();cancel();const p=document.createElement('p');p.className='nx-ai-stopped';p.textContent='Pencarian dihentikan.';transcript.append(p)}});
form.onsubmit=e=>{e.preventDefault();if(pending!==null)return;const prompt=input.value.trim();if(!prompt)return;
const user=document.createElement('div');user.className='nx-ai-user';user.textContent=prompt;transcript.append(user);q('.nx-finder-welcome').hidden=true;
// Prepare the local demo response, then reveal it after a brief loading state.
original(e);const reply=document.createElement('section');reply.className='nx-ai-reply';if(/^(halo|hai|hello|hi)[!.\s]*$/i.test(prompt)){results.replaceChildren();const p=document.createElement('p');p.textContent=input.placeholder.includes('kopi')?'Hai! Lagi ingin makan apa? Sebutkan menu atau budgetmu, aku bantu cari.':'Hai! Barang apa yang lagi kamu cari? Ceritakan kebutuhan dan budgetmu, ya.';reply.append(p)}else{const p=document.createElement('p');p.textContent=results.querySelector('.nx-find-product')?'Ini pilihan dari katalog Nemu yang cocok dengan pencarianmu. Ketuk untuk lihat detailnya.':'Belum ketemu pilihan yang pas. Coba jenis barang atau menu dan budget yang berbeda.';reply.append(p);while(results.firstChild)reply.append(results.firstChild)}
if(q('#nxFinder').dataset.context==='health'){const lead=reply.querySelector('p');if(lead)lead.textContent='Aku bantu mengelola catatan harianmu. Mau mulai dari mana?'}
const copyText=reply.textContent,actions=document.createElement('div');actions.className='nx-ai-feedback';const status=document.createElement('span');status.className='nx-feedback-status';status.setAttribute('role','status');
const copy=document.createElement('button');copy.type='button';copy.innerHTML=icons.copy;copy.setAttribute('aria-label','Salin jawaban');copy.title='Salin jawaban';copy.onclick=async()=>{try{await navigator.clipboard.writeText(copyText);status.textContent='Tersalin'}catch{status.textContent='Belum bisa menyalin. Coba izinkan akses clipboard.'}};actions.append(copy);
[['like','Suka'],['dislike','Tidak suka']].forEach(([icon,label])=>{const b=document.createElement('button');b.type='button';b.innerHTML=icons[icon];b.title=label;b.setAttribute('aria-label',label);b.setAttribute('aria-pressed','false');b.onclick=()=>{const selected=b.getAttribute('aria-pressed')!=='true';actions.querySelectorAll('[aria-pressed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b&&selected)));status.textContent=selected?'Masukan ditandai di sesi ini.':''};actions.append(b)});actions.append(status);reply.append(actions);
input.value='';fitInput();input.readOnly=true;form.setAttribute('aria-busy','true');send.innerHTML='■';send.setAttribute('aria-label','Hentikan pencarian');indicator=document.createElement('div');indicator.className='nx-ai-thinking';indicator.setAttribute('role','status');indicator.innerHTML='<span>✦</span> Nemu sedang mencari<span class="nx-thinking-dots">…</span>';transcript.append(indicator);body.scrollTop=body.scrollHeight;
pending=setTimeout(()=>{indicator.remove();transcript.append(reply);idle();body.scrollTop=body.scrollHeight},1000);
};
})();
