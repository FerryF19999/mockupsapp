(() => {
  const q = selector => document.querySelector(selector);
  const escape = escapeProductText;
  const catalogKey = 'nemu.catalog.demo.v1';
  const samples = {
    food: [
      { name: 'Bowl ayam & sayur', image: 'food.jpg', kcal: 480, protein: 32, carbs: 46, fat: 18 },
      { name: 'Burger daging', image: 'burger.jpg', kcal: 550, protein: 28, carbs: 48, fat: 27 },
      { name: 'Kopi susu', image: 'coffee.jpg', kcal: 150, protein: 6, carbs: 18, fat: 6 }
    ],
    sell: [
      { name: 'Jaket Denim Biru', image: 'tryon-denim.jpg', category: 'Fashion pria', price: 190000, description: 'Jaket denim biru dengan kancing depan. Lengkapi ukuran dan detail kondisi sebelum diterbitkan.' },
      { name: 'Sneakers Putih', image: 'sneakers-generated.jpg', category: 'Fashion pria', price: 285000, description: 'Sneakers putih untuk aktivitas sehari-hari. Lengkapi ukuran dan detail kondisi barang.' },
      { name: 'Ponsel Vivo V11 Pro', image: 'phone-generated.jpg', category: 'Ponsel dan aksesori', price: 900000, description: 'Ponsel Vivo V11 Pro. Periksa kapasitas, kelengkapan, dan kondisi perangkat sebelum diterbitkan.' }
    ]
  };
  const catalog = products.filter(product => product.localDemo);

  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="nxCapture" class="nx-capture" aria-labelledby="nxCaptureTitle">
      <header class="nx-capture-header"><div><h2 id="nxCaptureTitle"></h2><span>DEMO AI</span></div><button id="nxCaptureClose" aria-label="Tutup foto">×</button></header>
      <div id="nxCaptureBody"></div>
      <input id="nxCaptureCamera" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden>
      <input id="nxCaptureGallery" type="file" accept="image/jpeg,image/png,image/webp" hidden>
    </dialog>`);
  const dialog = q('#nxCapture'), body = q('#nxCaptureBody');
  let mode = 'food', sampleIndex = 0, photo = '', uploaded = false, phase = 'snap', timer, reading = 0;
  q('#nxCaptureClose').onclick = () => dialog.close();
  dialog.addEventListener('close', () => { clearTimeout(timer); reading++; });
  const icon = name => `<svg aria-hidden="true"><use href="assets/sprite.svg#${name}"/></svg>`;
  const steps = () => mode === 'sell' ? `<ol class="nx-snap-steps" aria-label="Langkah jual barang">${['snap', 'list', 'sell'].map((step, i) => `<li class="${phase === step ? 'active' : ''}" ${phase === step ? 'aria-current="step"' : ''}><span>${i + 1}</span>${['Snap', 'List', 'Sell'][i]}</li>`).join('')}</ol>` : '';
  const note = '<p class="nx-capture-note">Hasil contoh untuk mencoba alur. Foto belum dianalisis AI.</p>';
  function open(kind) {
    mode = kind === 'sell' ? 'sell' : 'food';
    sampleIndex = 0; photo = ''; uploaded = false; phase = 'snap'; clearTimeout(timer);
    q('#nxCaptureTitle').textContent = mode === 'food' ? 'Foto Makanan' : 'Snap · List · Sell';
    renderCapture();
    if (!dialog.open) dialog.showModal();
  }
  function renderCapture() {
    const food = mode === 'food';
    body.innerHTML = `${steps()}
      <div class="nx-capture-preview ${photo ? 'has-photo' : ''}">${photo ? `<img src="${escape(photo)}" alt="Foto ${food ? 'makanan' : 'barang'} pilihanmu">` : `${icon('camera')}<b>${food ? 'Kenali isi piringmu' : 'Foto barang, mulai jualan'}</b><span>${food ? 'Lihat contoh kalori dan nutrisi dari foto.' : 'Siapkan listing, lalu terbitkan ke katalog.'}</span>`}</div>
      <div class="nx-capture-sources"><button data-photo-source="camera">${icon('camera')} Ambil foto</button><button data-photo-source="gallery">${icon('image')} Dari galeri</button></div>
      <div class="nx-capture-examples"><span>${uploaded ? 'Pilih data contoh untuk demo ini' : 'Atau coba dengan foto contoh'}</span><div>${samples[mode].map((item, i) => `<button data-photo-sample="${i}" aria-pressed="${photo && sampleIndex === i ? 'true' : 'false'}"><img src="assets/${item.image}" alt=""><span>${escape(item.name)}</span></button>`).join('')}</div></div>
      <p id="nxCaptureError" class="nx-capture-error" role="status"></p>
      <button class="nx-capture-primary" id="nxAnalyzePhoto" ${photo ? '' : 'disabled'}>${food ? 'Analisis makanan' : 'Kenali barang'} <span>· Demo</span></button>${note}`;
    q('#nxAnalyzePhoto').onclick = analyze;
  }
  body.addEventListener('click', event => {
    const source = event.target.closest('[data-photo-source]');
    if (source) q(source.dataset.photoSource === 'camera' ? '#nxCaptureCamera' : '#nxCaptureGallery').click();
    const example = event.target.closest('[data-photo-sample]');
    if (example) {
      sampleIndex = Number(example.dataset.photoSample);
      if (!uploaded) photo = productImage(samples[mode][sampleIndex].image);
      renderCapture();
    }
  });
  async function readPhoto(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) {
      q('#nxCaptureError').textContent = 'Pilih JPG, PNG, atau WebP maksimal 12 MB.'; return;
    }
    const version = ++reading;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      if (!dialog.open || version !== reading) return;
      photo = canvas.toDataURL('image/jpeg', .82); uploaded = true; renderCapture();
    } catch { if (dialog.open && q('#nxCaptureError')) q('#nxCaptureError').textContent = 'Foto belum bisa dibaca. Coba foto lain.'; }
  }
  q('#nxCaptureCamera').onchange = readPhoto;
  q('#nxCaptureGallery').onchange = readPhoto;
  function analyze() {
    if (!photo) return;
    body.innerHTML = `${steps()}<div class="nx-photo-working" role="status"><img src="${escape(photo)}" alt="Foto yang dipilih"><span class="nx-photo-spinner"></span><h3>Menyiapkan contoh hasil…</h3><p>Simulasi analisis AI</p></div>`;
    timer = setTimeout(() => {
      if (!dialog.open) return;
      if (mode === 'food') renderFoodResult(); else { phase = 'list'; renderListing(); }
    }, 900);
  }
  function renderFoodResult() {
    const item = samples.food[sampleIndex];
    body.innerHTML = `<div class="nx-photo-result"><img src="${escape(photo)}" alt="Foto makanan"><div><span class="nx-photo-badge">CONTOH HASIL AI</span><h3>${escape(item.name)}</h3><p>Per 1 porsi</p></div></div>
      <div class="nx-photo-macros">${[['protein','Protein'],['carbs','Karbo'],['fat','Lemak']].map(([key, label]) => `<div><b data-macro="${key}">${item[key]} g</b><span>${label}</span></div>`).join('')}</div>
      <form id="nxFoodResultForm" class="nx-capture-form">
        <label>Nama makanan<input name="name" value="${escape(item.name)}" required maxlength="80"></label>
        <div class="nx-capture-fields"><label>Porsi<select name="portion"><option value="0.5">½ porsi</option><option value="1" selected>1 porsi</option><option value="1.5">1½ porsi</option><option value="2">2 porsi</option></select></label><label>Energi (kkal)<input name="kcal" type="number" min="0" max="10000" step="1" value="${item.kcal}" required></label></div>
        <label>Waktu makan<select name="meal">${['Sarapan','Makan siang','Makan malam','Camilan'].map(meal => `<option ${meal === 'Makan siang' ? 'selected' : ''}>${meal}</option>`).join('')}</select></label>
        ${note}<button class="nx-capture-primary">Tambah ke diary</button><button type="button" class="nx-capture-secondary" id="nxRetakePhoto">Ganti foto</button>
      </form>`;
    q('[name="portion"]').onchange = event => {
      const portion = Number(event.target.value);
      q('[name="kcal"]').value = Math.round(item.kcal * portion);
      body.querySelectorAll('[data-macro]').forEach(node => { node.textContent = Math.round(item[node.dataset.macro] * portion) + ' g'; });
    };
    q('#nxRetakePhoto').onclick = () => { phase = 'snap'; renderCapture(); };
    q('#nxFoodResultForm').onsubmit = event => {
      event.preventDefault();
      const data = new FormData(event.target);
      const entry = { name: String(data.get('name')).trim(), kcal: Number(data.get('kcal')), meal: String(data.get('meal')), source: 'demo-ai' };
      if (!entry.name) return;
      dialog.close();
      document.querySelector('[data-view="sehat"]').click();
      document.dispatchEvent(new CustomEvent('nemu-food-demo-saved', { detail: entry }));
      say('Contoh analisis ditambahkan ke diary.');
    };
  }
  function renderListing() {
    const item = samples.sell[sampleIndex];
    const categories = [...document.querySelectorAll('#categoryCards [data-category]')].map(button => button.dataset.category);
    body.innerHTML = `${steps()}<div class="nx-photo-result"><img src="${escape(photo)}" alt="Foto barang"><div><span class="nx-photo-badge">CONTOH HASIL AI</span><h3>Listing siap kamu rapikan</h3><p>Periksa detail sebelum terbit.</p></div></div>
      <form id="nxListingForm" class="nx-capture-form">
        <label>Nama barang<input name="name" required maxlength="80" value="${escape(item.name)}"></label>
        <div class="nx-capture-fields"><label>Harga (Rp)<input name="price" type="number" min="1000" max="1000000000" step="1" required value="${item.price}"></label><label>Kondisi<select name="condition"><option>Preloved</option><option>Baru</option></select></label></div>
        <label>Kategori<select name="category">${categories.map(category => `<option ${category === item.category ? 'selected' : ''}>${escape(category)}</option>`).join('')}</select></label>
        <label>Deskripsi<textarea name="description" rows="3" maxlength="600" required>${escape(item.description)}</textarea></label>
        <p class="nx-capture-note">Terbit di katalog demo perangkat ini. Data contoh bisa kamu ubah.</p>
        <p id="nxPublishError" class="nx-capture-error" role="status"></p>
        <button class="nx-capture-primary">Terbitkan ke katalog</button><button type="button" class="nx-capture-secondary" id="nxRetakePhoto">Ganti foto</button>
      </form>`;
    q('#nxRetakePhoto').onclick = () => { phase = 'snap'; renderCapture(); };
    q('#nxListingForm').onsubmit = publish;
  }
  function publish(event) {
    event.preventDefault();
    const data = new FormData(event.target), name = String(data.get('name')).trim();
    if (!name) return;
    const product = { id: crypto.randomUUID(), name, price: Number(data.get('price')), image: photo.startsWith('assets/') ? photo.slice(7) : photo,
      category: String(data.get('category')), state: String(data.get('condition')), description: String(data.get('description')).trim(),
      place: 'Dikirim dari Tangerang', seller: 'Toko saya · demo', isNew: true, localDemo: true, createdAt: Date.now() };
    try { localStorage.setItem(catalogKey, JSON.stringify([...catalog, product])); }
    catch { q('#nxPublishError').textContent = 'Penyimpanan perangkat penuh. Coba foto dengan ukuran lebih kecil.'; return; }
    catalog.push(product); products.push(product); resetArrivals(); renderProducts(); phase = 'sell';
    body.innerHTML = `${steps()}<div class="nx-photo-success"><span>${icon('check')}</span><h3>Sudah terbit!</h3><p>Barangmu sekarang ada di katalog demo Nemu.</p></div><div class="nx-photo-result"><img src="${escape(productImage(product.image))}" alt="${escape(name)}"><div><span class="nx-photo-badge">KATALOG DEMO</span><h3>${escape(name)}</h3><b>${rupiah(product.price)}</b></div></div><button class="nx-capture-primary" id="nxViewPublished">Lihat di katalog</button><button class="nx-capture-secondary" id="nxSellAgain">Foto barang lain</button>`;
    q('#nxViewPublished').onclick = () => {
      dialog.close(); category = 'Semua'; activeBrand = ''; query = ''; sortLow = false; q('#globalSearch').value = '';
      document.querySelector('[data-view="belanja"]').click(); renderProducts(); resetArrivals();
      q('#newProducts').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    q('#nxSellAgain').onclick = () => open('sell');
  }
  document.addEventListener('nemu-photo-open', event => open(event.detail));
})();
