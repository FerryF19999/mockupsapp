(()=>{
const card=document.querySelector('#belanja > .nx-campaign');if(!card)return;
(document.querySelector('.nemu-promo-controls')||document.querySelector('#promoCarousel')).after(card);
function tick(){let c;try{c=JSON.parse(localStorage.getItem('nemu.challenge.v1')||'{}')}catch{return}if(!Number.isFinite(c.start))return;let badge=card.querySelector('.nx-seven-timer');if(!badge){badge=document.createElement('span');badge.className='nx-seven-timer';card.append(badge)}const s=Math.max(0,Math.floor((c.start+7*86400000-Date.now())/1000)),days=Math.floor(s/86400),clock=[Math.floor(s/3600)%24,Math.floor(s/60)%60,s%60].map(n=>String(n).padStart(2,'0')).join(':');badge.textContent=s?days+' hari · '+clock:'Waktu berakhir';badge.setAttribute('aria-label','Sisa waktu tantangan: '+badge.textContent)}
tick();setInterval(tick,1000);
})();
