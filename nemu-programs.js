(() => {
  const q = selector => document.querySelector(selector);
  const seenKey = 'nemu.program-popup.seen.v1';
  let seen = false;
  try { seen = sessionStorage.getItem(seenKey) === 'true'; } catch {}

  document.body.insertAdjacentHTML('beforeend', `
    <dialog id="nxProgramPopup" class="nx-program-popup" aria-labelledby="nxProgramTitle">
      <header class="nx-program-header">
        <span class="nx-overline">BERKEMBANG BARENG NEMU</span>
        <button class="nx-program-close" aria-label="Tutup popup">×</button>
      </header>
      <div class="nx-program-options" role="group" aria-label="Pilih program Nemu">
        <button data-program-tab="live" aria-pressed="true">Nemu Live</button>
        <button data-program-tab="affiliate" aria-pressed="false">Affiliate</button>
      </div>
      <div id="nxProgramBody"></div>
    </dialog>`);
  const dialog = q('#nxProgramPopup');
  const body = q('#nxProgramBody');
  q('.nx-program-close').onclick = () => dialog.close();
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  function open(kind) {
    const live = kind === 'live';
    seen = true;
    try { sessionStorage.setItem(seenKey, 'true'); } catch {}
    dialog.querySelectorAll('[data-program-tab]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.programTab === kind));
    });
    body.innerHTML = `
      <div class="nx-program-art"><img src="assets/${live ? 'promo-tote-mascot.png' : 'promo-star-mascot.png'}" alt="Maskot Nemu"></div>
      <h2 id="nxProgramTitle">${live ? 'Mulai Live di Nemu' : 'Program Affiliate Nemu'}</h2>
      <p>${live ? 'Kenalkan produkmu, sapa penonton, dan temukan pembeli lewat live.' : 'Bagikan produk favoritmu dan kenali peluang bersama Nemu.'}</p>
      <button class="nx-btn" id="nxProgramPrimary">${live ? 'Siapkan live pertamamu' : 'Kenali program affiliate'} <span aria-hidden="true">↗</span></button>
      <button class="nx-program-later">Nanti dulu</button>`;
    q('.nx-program-later').onclick = () => dialog.close();
    q('#nxProgramPrimary').onclick = () => details(kind);
    if (!dialog.open) dialog.showModal();
  }

  function details(kind) {
    const live = kind === 'live';
    body.innerHTML = `
      <h2 id="nxProgramTitle">${live ? 'Siapkan live pertamamu.' : 'Rekomendasikan dengan caramu.'}</h2>
      <ol>${(live ? [
        'Siapkan akun dan produk yang ingin ditampilkan.',
        'Tentukan topik live dan cek kamera serta koneksi.',
        'Lanjutkan ke Nemu Live untuk menyiapkan siaran.'
      ] : [
        'Pilih produk yang kamu kenal dan ingin rekomendasikan.',
        'Pelajari persyaratan serta ketentuan program.',
        'Gunakan tautan affiliate setelah akunmu disetujui.'
      ]).map(text => '<li>' + text + '</li>').join('')}</ol>
      ${live ? '<a class="nx-btn" href="https://nemu-ai.com/live" target="_blank" rel="noopener">Buka Nemu Live ↗</a>' : '<p class="nx-program-note">Pendaftaran affiliate dan detail komisi belum terhubung di prototipe ini.</p>'}
      <button class="nx-program-later">Kembali</button>`;
    q('.nx-program-later').onclick = () => open(kind);
    q('.nx-program-later').focus();
  }

  dialog.querySelectorAll('[data-program-tab]').forEach(button => {
    button.onclick = () => open(button.dataset.programTab);
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-nx-program],[data-discovery="affiliate"],a.nemu-live-card[href="https://nemu-ai.com/live"]');
    if (!button) return;
    event.preventDefault();
    open(button.dataset.nxProgram || (button.dataset.discovery === 'affiliate' ? 'affiliate' : 'live'));
  });

  // Show once per tab session, after onboarding or any other open dialog closes.
  // Existing live and affiliate cards can still reopen it on demand.
  const shop = q('#belanja');
  let timer;
  function eligible() {
    return !seen && shop.classList.contains('active') && !document.hidden &&
      !q('dialog[open], .modal.open') && !q('input:focus, textarea:focus, select:focus');
  }
  function schedule() {
    clearTimeout(timer);
    if (eligible()) timer = setTimeout(() => { if (eligible()) open('live'); }, 700);
  }
  const observer = new MutationObserver(schedule);
  observer.observe(shop, { attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('dialog, .modal').forEach(modal => {
    observer.observe(modal, { attributes: true, attributeFilter: ['open', 'class'] });
  });
  document.addEventListener('nemu-intro-finished', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('focusout', schedule);
  schedule();
})();
