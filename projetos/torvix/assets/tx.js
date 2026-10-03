/* Torvix Industrial · projeto demonstrativo criado pela Tirvo */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var hover = window.matchMedia('(hover: hover)').matches;
  var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };

  /* Cabeçalho: linha de progresso em ciano na borda inferior */
  var head = $('[data-head]'), tick = false;
  function onScroll() {
    if (head) {
      var h = d.documentElement.scrollHeight - window.innerHeight;
      head.style.setProperty('--sp', (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%');
    }
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* Logo: a porca gira e trava, o nome é cortado a laser */
  $$('[data-logo]').forEach(function (logo) {
    if (reduce) return;
    setTimeout(function () { logo.classList.add('is-build'); }, 120);
  });

  /* Menu de soluções */
  $$('[data-sub]').forEach(function (w) {
    var btn = $('[data-sub-toggle]', w), panel = $('.mega', w), t = null;
    var set = function (o) { btn.setAttribute('aria-expanded', String(o)); panel.classList.toggle('is-open', o); };
    var hovAt = 0;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      /* o hover já abriu o painel: o clique logo em seguida não deve fechá-lo */
      if (Date.now() - hovAt < 700) { set(true); return; }
      set(btn.getAttribute('aria-expanded') !== 'true');
    });
    if (hover) {
      w.addEventListener('mouseenter', function () { clearTimeout(t); if (btn.getAttribute('aria-expanded') !== 'true') hovAt = Date.now(); set(true); });
      w.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 200); });
    }
    d.addEventListener('click', function (e) { if (!w.contains(e.target)) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  /* Menu móvel: painel de controle */
  var mBtn = $('[data-menu]'), sheet = $('[data-ctrl]'), sbg = null;
  if (mBtn && sheet) {
    var setM = function (o) {
      mBtn.setAttribute('aria-expanded', String(o));
      mBtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
      /* o painel começa logo abaixo do cabeçalho, com ou sem a faixa de aviso visível */
      var hd = $('[data-head]');
      if (o && hd) sheet.style.paddingTop = Math.max(90, Math.round(hd.getBoundingClientRect().bottom) + 16) + 'px';
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

  /* Títulos cortados a laser */
  var titles = $$('main h1, main h2').filter(function (t) { return !t.hasAttribute('data-plain'); });
  titles.forEach(function (t) {
    var o = d.createElement('span'); o.className = 'lz';
    var i = d.createElement('span'); i.className = 'lz__t';
    while (t.firstChild) i.appendChild(t.firstChild);
    o.appendChild(i); t.appendChild(o);
  });
  if (reduce || !hasIO) {
    titles.forEach(function (t) { t.classList.add('is-go'); });
  } else {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var t = e.target;
        setTimeout(function () { t.classList.add('is-go'); }, t.tagName === 'H1' ? 300 : 80);
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
  $$('[data-seq]').forEach(function (g) { Array.from(g.children).forEach(function (c, i) { c.style.setProperty('--i', i); }); });
  var targets = $$('[data-fx], [data-seq], [data-io], .arc, .panel, .kpi');
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

  /* Luz nos cartões de solução */
  if (hover && !reduce) {
    $$('.sol').forEach(function (c) {
      c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });
  }

  /* Abas de processos */
  $$('[data-ptabs]').forEach(function (w) {
    var tabs = $$('[role="tab"]', w);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; var p = d.getElementById(x.getAttribute('aria-controls')); if (p) { p.classList.toggle('is-on', on); p.hidden = !on; } });
      });
      t.addEventListener('keydown', function (e) {
        var i = tabs.indexOf(t);
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
      });
    });
  });

  /* Filtro do parque de máquinas */
  $$('[data-mtabs]').forEach(function (bar) {
    var table = d.getElementById(bar.dataset.mtabs);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('tbody tr', table).forEach(function (r) { r.classList.toggle('is-out', b.dataset.f !== 'all' && r.dataset.cat !== b.dataset.f); });
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
  if (wa && !reduce) { setTimeout(function () { wa.classList.add('is-tip'); }, 4000); setTimeout(function () { wa.classList.remove('is-tip'); }, 10000); }

  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  onScroll();
})();
