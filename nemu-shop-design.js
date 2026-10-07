(()=>{
const shop=document.querySelector('#belanja'),search=document.querySelector('.store-search');
const marker=document.createComment('Search home');search.before(marker);
const intro=document.createElement('div');intro.className='nx-shop-intro';intro.innerHTML='<div class="nx-shop-search"></div>';shop.prepend(intro);document.querySelector('#globalSearch').placeholder='Cari barang atau brand';
function placeSearch(){if(shop.classList.contains('active'))intro.querySelector('.nx-shop-search').append(search);else marker.after(search)}
new MutationObserver(placeSearch).observe(shop,{attributes:true,attributeFilter:['class']});placeSearch();
const campaign=shop.querySelector('.nx-campaign'),categories=shop.querySelector('.category-section');if(campaign&&categories)categories.after(campaign);
})();
