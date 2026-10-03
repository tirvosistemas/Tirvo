/* Ressel Aldane Advogados · projeto demonstrativo criado pela Tirvo */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var hover = window.matchMedia('(hover: hover)').matches;
  var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };

  /* Cabeçalho: compacta ao rolar */
  var head = $('[data-head]'), tick = false;
  function onScroll() { if (head) head.classList.toggle('is-scrolled', window.scrollY > 30); tick = false; }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* Selo da logo */
  $$('[data-logo]').forEach(function (logo) {
    if (reduce) return;
    setTimeout(function () { logo.classList.add('is-build'); }, 120);
  });

  /* Menu das áreas */
  $$('[data-sub]').forEach(function (w) {
    var btn = $('[data-sub-toggle]', w), panel = $('.drop', w), t = null;
    var set = function (o) { btn.setAttribute('aria-expanded', String(o)); panel.classList.toggle('is-open', o); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (hover) {
      w.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
      w.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 200); });
    }
    d.addEventListener('click', function (e) { if (!w.contains(e.target)) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  /* Menu móvel: página que se abre */
  var mBtn = $('[data-menu]'), sheet = $('[data-drawer]'), sbg = null;
  if (mBtn && sheet) {
    var setM = function (o) {
      mBtn.setAttribute('aria-expanded', String(o));
      mBtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
      root.classList.toggle('menu-open', o);
      d.body.style.overflow = o ? 'hidden' : '';
      if (o) sheet.removeAttribute('inert'); else sheet.setAttribute('inert', '');
    };
    sheet.setAttribute('inert', '');
    mBtn.addEventListener('click', function () { setM(mBtn.getAttribute('aria-expanded') !== 'true'); });
    if (sbg) sbg.addEventListener('click', function () { setM(false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setM(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setM(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1140) setM(false); });
  }

  /* Títulos revelados linha por linha, com um fio dourado embaixo */
  var titles = $$('main h1, main h2').filter(function (t) { return !t.hasAttribute('data-plain'); });
  function lines(title) {
    var label = d.createElement('span'); label.className = 'sr-only';
    label.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    var words = [], nodes = [];
    var walker = d.createTreeWalker(title, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = d.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
        var s = d.createElement('span'); s.className = 'wd'; s.style.display = 'inline-block'; s.textContent = p; frag.appendChild(s); words.push(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    // agrupa por linha visual: cada palavra recebe o atraso da sua linha
    var tops = [], l = -1, last = null;
    words.forEach(function (w) { var t = Math.round(w.offsetTop); if (last === null || Math.abs(t - last) > 4) { l++; last = t; } w.style.setProperty('--l', l); });
    words.forEach(function (w) {
      var o = d.createElement('span'); o.className = 'ln'; o.style.display = 'inline-block'; o.setAttribute('aria-hidden', 'true');
      var i = d.createElement('span'); i.className = 'ln__i'; i.style.setProperty('--l', w.style.getPropertyValue('--l'));
      w.parentNode.replaceChild(o, w); i.appendChild(w); o.appendChild(i);
    });
    title.prepend(label);
    title.classList.add('rule-sweep');
    return l + 1;
  }
  if (reduce || !hasIO) {
    titles.forEach(function (t) { t.classList.add('is-go', 'is-done'); });
  } else {
    var nl = new Map();
    titles.forEach(function (t) { nl.set(t, lines(t)); });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var t = e.target, wait = t.tagName === 'H1' ? 250 : 60;
        setTimeout(function () { t.classList.add('is-go'); }, wait);
        setTimeout(function () { t.classList.add('is-done'); }, wait + nl.get(t) * 110 + 600);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    titles.forEach(function (t) { tio.observe(t); });
  }

  /* Faixas infinitas */
  $$('[data-loop]').forEach(function (track) {
    $$(':scope > *', track).forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
  });

  /* Contadores */
  function count(el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), t0 = 0;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1900), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Entradas ao rolar */
  $$('[data-leaf]').forEach(function (g) { Array.from(g.children).forEach(function (c, i) { c.style.setProperty('--i', i); }); });
  var targets = $$('[data-fx], [data-leaf], [data-io], .sig, .dial, .hbars');
  var counters = $$('[data-count]');
  if (!hasIO || reduce) {
    targets.forEach(function (t) { t.classList.add('is-in'); });
    counters.forEach(function (c) { c.textContent = fmt(parseFloat(c.dataset.count), parseInt(c.dataset.dec || '0', 10)); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
    targets.forEach(function (t) { io.observe(t); });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
    }, { threshold: .5 });
    counters.forEach(function (c) { c.textContent = '0'; cio.observe(c); });
  }

  /* Filtro das publicações */
  $$('[data-ptabs]').forEach(function (bar) {
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('.post[data-cat]').forEach(function (p) { p.classList.toggle('is-out', b.dataset.f !== 'all' && p.dataset.cat !== b.dataset.f); });
    });
  });

  /* Busca e abas nas dúvidas */
  var q = $('[data-faq-search]');
  if (q) {
    var items = $$('.qa'), empty = $('.empty'), cat = 'all';
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var apply = function () {
      var v = norm(q.value.trim()), n = 0;
      items.forEach(function (it) { var ok = (!v || norm(it.textContent).indexOf(v) >= 0) && (cat === 'all' || it.dataset.cat === cat); it.classList.toggle('is-out', !ok); if (ok) n++; });
      if (empty) empty.style.display = n ? 'none' : 'block';
    };
    q.addEventListener('input', apply);
    $$('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { cat = b.dataset.tab; $$('[data-tab]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); apply(); });
    });
  }

  /* Aviso para botões e perfis fictícios */
  var toast = d.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); d.body.appendChild(toast);
  var tt = null;
  d.addEventListener('click', function (e) {
    var el = e.target.closest('[data-demo]'); if (!el) return;
    e.preventDefault();
    toast.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-info"/></svg><span>' + (el.dataset.demo || 'Este é um site demonstrativo.') + ' <a href="https://tirvo.tech/#contato">Fale com a Tirvo</a>.</span>';
    toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('is-on'); }, 5200);
  });

  /* Cartão do WhatsApp */
  var wa = $('.wa');
  if (wa && !reduce) { setTimeout(function () { wa.classList.add('is-tip'); }, 6000); setTimeout(function () { wa.classList.remove('is-tip'); }, 13000); }

  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  onScroll();
})();
