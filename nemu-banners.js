(() => {
  const root = document.querySelector('#promoCarousel');
  root.classList.add('nemu-promo');
  promoSlides.splice(0, promoSlides.length,
    {
      label: 'Produk diskon', tag: 'Lagi diskon',
      title: '<span>Diskon hingga</span><strong>87%</strong>',
      cta: 'Lihat diskon', image: 'banners-v2/discount.png',
      alt: 'Jaket denim dan sepatu bersama maskot bintang Nemu', target: 'discountProducts'
    },
    {
      label: 'Hemat ongkir', tag: 'Belanja lebih hemat',
      title: '<span>Gratis ongkir</span><strong>hingga 20rb</strong>',
      cta: 'Cek voucher', image: 'banners-v2/shipping.png',
      alt: 'Nemu ungu membawa tas bersama paket kiriman'
    },
    {
      label: 'Mobil dan motor second', tag: 'Pilihan second',
      title: '<span>Mobil &amp; motor</span><strong>Sesuai budget</strong>',
      cta: 'Lihat kendaraan', image: 'banners-v2/vehicle.png',
      alt: 'Mobil krem, skuter ungu, dan Nemu memegang kunci kendaraan'
    }
  );
  root.querySelector('[data-promo-slide="3"]')?.remove();
  root.querySelector('.nx-banner-mascot')?.remove();
  root.querySelector('.nx-promo-description')?.remove();
  const pagination = root.querySelector('.promo-pagination');
  // Navigation has its own row, outside both the artwork and the CTA.
  const controls = document.createElement('div');
  controls.className = 'nemu-promo-controls';
  controls.append(pagination);
  root.after(controls);
  root.querySelector('img').decoding = 'async';
  pagination.querySelectorAll('[data-promo-slide]').forEach((button, i) => {
    button.setAttribute('aria-label', `Promo ${i + 1}: ${promoSlides[i].label}`);
    button.setAttribute('aria-controls', 'promoCarousel');
  });
  setPromoSlide(0);
  document.querySelector('#promoAction').onclick = () => {
    if (promoIndex === 0) {
      document.querySelector('#discountProducts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (promoIndex === 1) {
      openMissions();
    } else {
      document.querySelector('[data-category="Otomotif"]').click();
    }
  };
  const foodBanners = [
    ['.food-promo-main', 'meal', 'Rice bowl ayam dengan Nemu ungu', 'Isi perut.<br>Senangkan hati.'],
    ['.food-promo-coffee', 'coffee', 'Kopi, croissant, dan Nemu dengan syal ungu', 'Secangkir kopi,<br>jeda yang pas.'],
    ['.food-promo-reward', 'reward', 'Nemu bintang bersama hadiah voucher', 'Poinmu jadi<br>voucher makan.']
  ];
  foodBanners.forEach(([selector, asset, alt, title]) => {
    const banner = document.querySelector(selector);
    const picture = banner.querySelector('img');
    banner.classList.add('nemu-promo');
    picture.src = `assets/banners-v2/${asset}.png`;
    picture.alt = alt;
    picture.decoding = 'async';
    banner.querySelector('h2').innerHTML = title;
  });
})();
