/* Velune Odontologia · projeto demonstrativo criado pela Tirvo */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var hover = window.matchMedia('(hover: hover)').matches;
  var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };

  /* Cabeçalho fixo no topo */
  var head = $('[data-head]'), lastY = 0, tick = false;
  function onScroll() {
    var y = window.scrollY;
    if (head) {
      head.classList.toggle('is-scrolled', y > 10);
    }
    lastY = y; tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* Logo desenhada a traço */
  $$('[data-logo]').forEach(function (logo) {
    var b = $('.logo__name b', logo);
    if (b) {
      var t = b.textContent; b.textContent = ''; b.setAttribute('aria-hidden', 'true');
      t.split('').forEach(function (c, i) { var s = d.createElement('span'); s.textContent = c; s.style.setProperty('--i', i); b.appendChild(s); });
    }
    if (reduce) return;
    var play = function () { logo.classList.remove('is-build'); void logo.offsetWidth; logo.classList.add('is-build'); };
    setTimeout(play, 120);
  });

  /* Menu de tratamentos */
  $$('[data-sub]').forEach(function (w) {
    var btn = $('[data-sub-toggle]', w), panel = $('.mega', w), t = null;
    var set = function (o) { btn.setAttribute('aria-expanded', String(o)); panel.classList.toggle('is-open', o); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (hover) {
      w.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
      w.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 200); });
    }
    d.addEventListener('click', function (e) { if (!w.contains(e.target)) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  /* Menu móvel em folha */
  var mBtn = $('[data-menu]'), sheet = $('[data-sheet]'), sbg = $('.sheet-bg');
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
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) setM(false); });
  }

  /* Títulos: as palavras surgem do desfoque e o destaque ganha um traço em arco */
  var titles = $$('main h1, main h2').filter(function (t) { return !t.hasAttribute('data-plain'); });
  function split(title) {
    var label = d.createElement('span'); label.className = 'sr-only';
    label.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    var nodes = [], w = 0;
    var walker = d.createTreeWalker(title, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      return (!n.textContent.trim() || n.parentElement.closest('svg')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    } });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = d.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
        var s = d.createElement('span'); s.className = 'wb'; s.setAttribute('aria-hidden', 'true'); s.style.setProperty('--w', w++); s.textContent = p; frag.appendChild(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    $$('svg', title).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
    title.prepend(label);
    return w;
  }
  if (reduce || !hasIO) {
    titles.forEach(function (t) { t.classList.add('is-go', 'is-done'); });
  } else {
    var cnt = new Map();
    titles.forEach(function (t) { cnt.set(t, split(t)); });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var t = e.target, wait = t.tagName === 'H1' ? 300 : 80;
        setTimeout(function () { t.classList.add('is-go'); }, wait);
        setTimeout(function () { t.classList.add('is-done'); }, wait + cnt.get(t) * 55 + 400);
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
  $$('[data-cascade]').forEach(function (g) { Array.from(g.children).forEach(function (c, i) { c.style.setProperty('--i', i); }); });
  var targets = $$('[data-fx], [data-cascade], [data-io], .donut-w, .vbars, .semi');
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

  /* Luz que acompanha o cursor nos cartões e botões */
  if (hover && !reduce) {
    $$('.tcard').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    $$('.btn--teal').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--bx', (e.clientX - r.left) + 'px'); b.style.setProperty('--by', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Antes e depois */
  $$('[data-ba]').forEach(function (ba) {
    var input = $('input', ba);
    var set = function (v) { ba.style.setProperty('--pos', v + '%'); };
    input.addEventListener('input', function () { set(input.value); });
    if (!reduce && hasIO) {
      var o = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; o.disconnect();
        var t0 = 0;
        (function anim(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600); var v = 50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p); set(v); input.value = v; if (p < 1) requestAnimationFrame(anim); })(performance.now());
      }, { threshold: .6 });
      o.observe(ba);
    }
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
  if (wa && !reduce) { setTimeout(function () { wa.classList.add('is-tip'); }, 5000); setTimeout(function () { wa.classList.remove('is-tip'); }, 13000); }

  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  onScroll();
})();
