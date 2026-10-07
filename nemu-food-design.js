(()=>{
const q=s=>document.querySelector(s);
q('#makan .heading h1').innerHTML='Lagi pengin<br><em>makan apa?</em>';
q('#makan .heading .sub').textContent='Dari makan siang sampai teman ngopi.';
q('#makan .heading').insertAdjacentHTML('afterbegin','<div class="nx-food-location"><svg><use href="assets/sprite.svg#pin"/></svg> Sekitar Tangerang <span>· Lokasi demo</span></div>');
q('#foodSearch').placeholder='Cari menu atau tempat favoritmu';
q('#makan .food-promos').after(q('#nxFoodAI'));
q('#nxFoodAI b').textContent='Belum tahu mau makan apa?';q('#nxFoodAI small').textContent='Ceritakan seleramu, Nemu bantu pilih.';
q('.food-promo-main > div > span').textContent='PILIHAN MAKAN SIANG';q('.food-promo-main h2').innerHTML='Isi perut.<br>Senangkan hati.';q('.food-promo-main p').textContent='Rice bowl ayam mulai Rp25.000';q('.food-promo-main button').innerHTML='Intip menu <b>↗</b>';
const cats=[['Semua','food-icon-all.png','Semua'],['Nasi','food-icon-rice.png','Nasi & ayam'],['Burger','food-icon-burger.png','Burger'],['Kopi','food-icon-coffee.png','Kopi']];
cats.forEach(([id,img,label])=>{q('[data-cuisine="'+id+'"]').innerHTML='<span class="nx-cuisine-art">'+('<img src="assets/'+img+'" alt="">')+'</span><b>'+label+'</b>'});
q('.food-list-heading h2').textContent='Enak, nggak jauh';
const decorate=()=>{document.querySelectorAll('#foodGrid .resto-card').forEach(card=>{const i=Number(card.dataset.resto);card.querySelector('.resto-bottom span').textContent='Mulai '+rupiah(Math.min(...demoMenus[i].map(m=>m.price)));})};decorate();new MutationObserver(decorate).observe(q('#foodGrid'),{childList:true});
// Contextual entry copy, while preserving one Nemu AI identity inside the panel.
const copy=()=>{const food=q('#makan').classList.contains('active')||q('#restoPage').classList.contains('active');const health=q('#sehat').classList.contains('active');q('#askNemu .nemu-speech').textContent=health?'Asisten Sehat':food?'Mode AI':'Mode AI';q('#askNemu').setAttribute('aria-label',health?'Buka Asisten Sehat':food?'Buka Mode AI untuk makanan':'Buka Mode AI')};document.querySelectorAll('.view').forEach(v=>new MutationObserver(copy).observe(v,{attributes:true,attributeFilter:['class']}));copy();
})();
