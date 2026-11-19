// IONRISE – menu, rozbalovací nabídky a volba jazyka
document.documentElement.classList.add('js');

(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  const drops = [...document.querySelectorAll('.has-drop')];
  const mobile = () => window.matchMedia('(max-width:960px)').matches;

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-label').textContent = open ? (toggle.dataset.close || 'Zavřít') : (toggle.dataset.open || 'Menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }
  function setDrop(li, open) {
    li.classList.toggle('open', open);
    li.querySelector('.drop-toggle').setAttribute('aria-expanded', String(open));
  }
  function closeDrops(except) { drops.forEach(d => d !== except && setDrop(d, false)); }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));

  drops.forEach(li => {
    const btn = li.querySelector('.drop-toggle');
    let timer;
    btn.addEventListener('click', () => {
      const open = !li.classList.contains('open');
      if (!mobile()) closeDrops(li);
      setDrop(li, open);
    });
    li.addEventListener('mouseenter', () => { if (mobile()) return; clearTimeout(timer); closeDrops(li); setDrop(li, true); });
    li.addEventListener('mouseleave', () => { if (mobile()) return; timer = setTimeout(() => setDrop(li, false), 180); });
    li.addEventListener('focusout', e => { if (!mobile() && !li.contains(e.relatedTarget)) setDrop(li, false); });
  });

  document.addEventListener('click', e => { if (!mobile() && !e.target.closest('.has-drop')) closeDrops(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = drops.find(d => d.classList.contains('open'));
    if (open && !mobile()) { setDrop(open, false); open.querySelector('.drop-toggle').focus(); }
    else if (nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  // Přepínač jazyka: zapamatovat volbu (pak už se neřídí jazykem prohlížeče)
  document.querySelectorAll('[data-lang]').forEach(a => a.addEventListener('click', () => {
    try { localStorage.setItem('lang', a.dataset.lang); } catch { /* bez úložiště */ }
  }));
  window.addEventListener('resize', () => { if (!mobile() && nav.classList.contains('open')) setMenu(false); });

})();
