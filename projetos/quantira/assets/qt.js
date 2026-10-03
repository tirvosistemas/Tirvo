/* Quantira Contabilidade · projeto demonstrativo criado pela Tirvo */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var hover = window.matchMedia('(hover: hover)').matches;
  var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };

  /* Cabeçalho: ganha fundo ao rolar; botão do WhatsApp encolhe */
  var head = $('[data-head]'), tick = false, waEl = $('.wa');
  function onScroll() {
    var y = window.scrollY;
    if (head) head.classList.toggle('is-scrolled', y > 10);
    if (waEl) waEl.classList.toggle('is-small', y > 700);
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* Logo em odômetro: cada letra gira pelos números até parar no lugar */
  $$('[data-logo]').forEach(function (logo) {
    var w = $('.logo__word', logo);
    if (w) {
      var t = w.textContent; w.textContent = ''; w.setAttribute('aria-hidden', 'true');
      t.split('').forEach(function (ch, i) {
        var o = d.createElement('span'); o.className = 'od';
        var st = d.createElement('span'); st.className = 'od__s'; st.style.setProperty('--i', i); st.style.setProperty('--n', 6);
        for (var k = 0; k < 6; k++) { var dg = d.createElement('span'), di = d.createElement('i'); di.textContent = (i * 3 + k * 7) % 10; dg.appendChild(di); st.appendChild(dg); }
        var L = d.createElement('span'); L.textContent = ch; st.appendChild(L);
        o.appendChild(st); w.appendChild(o);
      });
    }
    logo.classList.add('is-ready');
    if (reduce) return;
    setTimeout(function () { logo.classList.add('is-build'); }, 120);
  });

  /* Menu: destaque que desliza atrás do link sob o cursor */
  var nav = $('.nav'), pill = $('.nav__pill');
  if (nav && pill && hover) {
    $$('.nav__link', nav).forEach(function (l) {
      l.addEventListener('mouseenter', function () {
        var nr = nav.getBoundingClientRect(), r = l.getBoundingClientRect();
        pill.style.left = (r.left - nr.left) + 'px'; pill.style.width = r.width + 'px'; pill.style.opacity = '1';
      });
    });
    nav.addEventListener('mouseleave', function () { pill.style.opacity = '0'; });
  }

  /* Painel de serviços */
  $$('[data-sub]').forEach(function (w) {
    var btn = $('[data-sub-toggle]', w), panel = $('.panel', w), t = null;
    var set = function (o) { btn.setAttribute('aria-expanded', String(o)); panel.classList.toggle('is-open', o); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (hover) {
      w.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
      w.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 200); });
    }
    d.addEventListener('click', function (e) { if (!w.contains(e.target)) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  /* Menu móvel em painel */
  var mBtn = $('[data-menu]'), sheet = $('[data-mpanel]'), sbg = null;
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

  /* Títulos: um marca-texto passa por cada palavra e revela o texto */
  var titles = $$('main h1, main h2').filter(function (t) { return !t.hasAttribute('data-plain'); });
  function split(title) {
    var label = d.createElement('span'); label.className = 'sr-only';
    label.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    var nodes = [], w = 0;
    var walker = d.createTreeWalker(title, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = d.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
        var o = d.createElement('span'); o.className = 'hw'; o.setAttribute('aria-hidden', 'true'); o.style.setProperty('--w', w);
        var i = d.createElement('span'); i.className = 'hw__t'; i.style.setProperty('--w', w); i.textContent = p; w++;
        o.appendChild(i); frag.appendChild(o);
      });
      node.parentNode.replaceChild(frag, node);
    });
    title.prepend(label);
    return w;
  }
  if (reduce || !hasIO) {
    titles.forEach(function (t) { t.classList.add('is-go'); });
  } else {
    titles.forEach(function (t) { split(t); });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var t = e.target;
        setTimeout(function () { t.classList.add('is-go'); }, t.tagName === 'H1' ? 250 : 60);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    titles.forEach(function (t) { tio.observe(t); });
  }

  /* Odômetros: cada dígito gira até o valor */
  $$('[data-odo]').forEach(function (el) {
    var txt = el.dataset.odo, k = 0; el.textContent = ''; el.setAttribute('aria-label', txt);
    var wrap = d.createElement('span'); wrap.className = 'odo'; wrap.setAttribute('aria-hidden', 'true');
    txt.split('').forEach(function (ch) {
      if (!/[0-9]/.test(ch)) { var sp = d.createElement('span'); sp.className = 'odo__sep'; sp.textContent = ch; wrap.appendChild(sp); return; }
      var c = d.createElement('span'); c.className = 'odo__c'; c.style.setProperty('--k', k++);
      for (var n = 0; n <= 9; n++) { var s = d.createElement('span'); s.textContent = n; c.appendChild(s); }
      c.dataset.v = ch; wrap.appendChild(c);
    });
    el.appendChild(wrap);
    var run = function () { $$('.odo__c', wrap).forEach(function (c) { c.style.transform = 'translateY(' + (-parseInt(c.dataset.v, 10)) + 'em)'; }); };
    if (reduce || !hasIO) { run(); return; }
    var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); setTimeout(run, 150); } }, { threshold: .5 });
    o.observe(el);
  });

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
  $$('[data-grid]').forEach(function (g) { Array.from(g.children).forEach(function (c, i) { c.style.setProperty('--i', i); }); });
  var targets = $$('[data-fx], [data-grid], [data-io], .steps-chart, .stack, .meter');
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

  /* Quiz: qual regime tributário faz mais sentido */
  $$('[data-quiz]').forEach(function (q) {
    var steps = $$('.qstep', q), bars = $$('.qprog i', q), score = { simples: 0, presumido: 0, real: 0 }, at = 0;
    var show = function (i) { steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); }); bars.forEach(function (b, k) { b.classList.toggle('is-on', k <= i); }); at = i; };
    q.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pts]');
      if (b) {
        b.dataset.pts.split(',').forEach(function (p) { var kv = p.split(':'); score[kv[0]] += parseInt(kv[1], 10); });
        if (at < steps.length - 2) { show(at + 1); return; }
        var best = Object.keys(score).sort(function (a, c) { return score[c] - score[a]; })[0];
        $$('.qres', q).forEach(function (r) { r.hidden = r.dataset.r !== best; });
        show(steps.length - 1);
      }
      if (e.target.closest('[data-reset]')) { score = { simples: 0, presumido: 0, real: 0 }; show(0); }
    });
    show(0);
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

  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  onScroll();
})();
