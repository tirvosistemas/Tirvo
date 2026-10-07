/* Ortival Engenharia · projeto demonstrativo criado pela Tirvo */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var fmt = function (n, dec) { return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };

  /* ---------- Cabeçalho, progresso de leitura ---------- */
  var head = $('[data-head]');
  var bar = $('.progress span');
  var lastY = 0, ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (head) {
      head.classList.toggle('is-scrolled', y > 12);
    }
    if (bar) {
      var h = d.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    }
    lastY = y;
    scrubAll();
    parallaxAll();
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------- Logo montada viga por viga ---------- */
  $$('[data-logo]').forEach(function (logo) {
    $$('.logo__name b, .logo__name small', logo).forEach(function (el) {
      var txt = el.textContent; el.textContent = '';
      el.setAttribute('aria-hidden', 'true');
      txt.split('').forEach(function (ch, i) { var s = d.createElement('span'); s.textContent = ch; s.style.setProperty('--i', i); el.appendChild(s); });
    });
    if (reduce) return;
    var play = function () { logo.classList.remove('is-build'); void logo.offsetWidth; logo.classList.add('is-build'); };
    setTimeout(play, 150);
    var last = 0;
    logo.addEventListener('mouseenter', function () { var n = Date.now(); if (n - last > 2600) { last = n; play(); } });
  });

  /* ---------- Menu: letras embaralhadas no hover ---------- */
  var NAVG = '▮▯┃━┼╋'.split('');
  $$('.scr').forEach(function (s) {
    var live = $('.scr__live', s), text = live.textContent, timer = null;
    var host = s.closest('a, button') || s;
    host.addEventListener('mouseenter', function () {
      if (reduce) return;
      var f = 0; clearInterval(timer);
      timer = setInterval(function () {
        f++;
        live.textContent = text.split('').map(function (c, i) { return c === ' ' ? ' ' : (i < f / 1.6 ? c : NAVG[(Math.random() * NAVG.length) | 0]); }).join('');
        if (f / 1.6 >= text.length) { clearInterval(timer); live.textContent = text; }
      }, 28);
    });
  });

  /* ---------- Submenu de serviços ---------- */
  $$('[data-sub]').forEach(function (wrap) {
    var btn = $('[data-sub-toggle]', wrap), panel = $('.subnav', wrap), t = null;
    var set = function (open) { btn.setAttribute('aria-expanded', String(open)); panel.classList.toggle('is-open', open); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    wrap.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { clearTimeout(t); set(true); } });
    wrap.addEventListener('mouseleave', function () { if (window.matchMedia('(hover: hover)').matches) { t = setTimeout(function () { set(false); }, 180); } });
    d.addEventListener('click', function (e) { if (!wrap.contains(e.target)) set(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); } });
  });

  /* ---------- Menu móvel ---------- */
  var mBtn = $('[data-menu]'), mm = $('[data-mmenu]');
  if (mBtn && mm) {
    $$('.mmenu__list a', mm).forEach(function (a, i) { a.style.setProperty('--i', i); });
    var setM = function (open) {
      mBtn.setAttribute('aria-expanded', String(open));
      mBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (open && head) {
        var r = head.getBoundingClientRect(), top = r.top;
        if (head.classList.contains('is-hidden')) top = 0;
        mm.style.setProperty('--mm-top', Math.max(0, top) + head.offsetHeight + 'px');
      }
      mm.classList.toggle('is-open', open);
      root.classList.toggle('menu-open', open);
      d.body.style.overflow = open ? 'hidden' : '';
      if (head) head.classList.remove('is-hidden');
      if (open) { mm.removeAttribute('inert'); } else { mm.setAttribute('inert', ''); }
    };
    mm.setAttribute('inert', '');
    mBtn.addEventListener('click', function () { setM(mBtn.getAttribute('aria-expanded') !== 'true'); });
    mm.addEventListener('click', function (e) { if (e.target.closest('a')) setM(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setM(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1100) setM(false); });
  }

  /* ---------- Títulos: palavras içadas uma a uma ---------- */
  var titles = $$('main h1, main h2').filter(function (t) { return !t.hasAttribute('data-notype'); });
  function splitWords(title) {
    var label = d.createElement('span'); label.className = 'sr-only';
    var clone = title.cloneNode(true);
    $$('.cota__tag', clone).forEach(function (n) { n.remove(); });
    label.textContent = clone.textContent.replace(/\s+/g, ' ').trim();
    var nodes = [], w = 0;
    var walker = d.createTreeWalker(title, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentElement;
      if (!n.textContent.trim() || p.closest('svg') || p.closest('.cota__tag') || p.closest('.sr-only')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    } });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var frag = d.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(part)); return; }
        var o = d.createElement('span'); o.className = 'tw'; o.setAttribute('aria-hidden', 'true');
        var i = d.createElement('span'); i.className = 'tw__i'; i.style.setProperty('--w', w++); i.textContent = part;
        o.appendChild(i); frag.appendChild(o);
      });
      node.parentNode.replaceChild(frag, node);
    });
    $$('.cota__tag', title).forEach(function (n) { n.setAttribute('aria-hidden', 'true'); });
    title.prepend(label);
    return w;
  }
  if (reduce || !hasIO) {
    titles.forEach(function (t) { t.classList.add('is-done', 'is-go'); });
  } else {
    var counts = new Map();
    titles.forEach(function (t) { counts.set(t, splitWords(t)); });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        var t = e.target, n = counts.get(t);
        setTimeout(function () { t.classList.add('is-go'); }, t.tagName === 'H1' ? 250 : 60);
        setTimeout(function () { t.classList.add('is-done'); }, (t.tagName === 'H1' ? 250 : 60) + n * 70 + 500);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    titles.forEach(function (t) { tio.observe(t); });
  }

  /* ---------- Faixas infinitas: duplica o conteúdo ---------- */
  $$('[data-loop]').forEach(function (track) {
    $$(':scope > *', track).forEach(function (el) { var c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $$('a, button', c).forEach(function (x) { x.tabIndex = -1; }); track.appendChild(c); });
  });

  /* ---------- Máscara andar por andar nas imagens ---------- */
  $$('.floors').forEach(function (f) {
    if ($('.floors__mask', f)) return;
    var m = d.createElement('div'); m.className = 'floors__mask'; m.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 7; i++) { var s = d.createElement('span'); s.style.setProperty('--i', i); m.appendChild(s); }
    f.appendChild(m);
  });

  /* ---------- Palavras que acendem com a rolagem ---------- */
  var scrubs = $$('.scrub');
  scrubs.forEach(function (el) {
    var words = [];
    var walk = function (node, hl) {
      Array.from(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = d.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            var s = d.createElement('span'); s.className = 'w' + (hl ? ' hl' : ''); s.textContent = p; frag.appendChild(s); words.push(s);
          });
          c.parentNode.replaceChild(frag, c);
        } else if (c.nodeType === 1) { walk(c, hl || c.classList.contains('hl')); }
      });
    };
    walk(el, false);
    el._words = words;
  });
  function scrubAll() {
    if (reduce) return;
    var vh = window.innerHeight;
    scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = (vh * .85 - r.top) / (r.height + vh * .35);
      p = Math.max(0, Math.min(1, p));
      var lit = Math.round(p * el._words.length);
      el._words.forEach(function (w, i) { w.classList.toggle('is-lit', i < lit); });
    });
  }

  /* ---------- Parallax leve ---------- */
  var pars = $$('[data-parallax]');
  function parallaxAll() {
    if (reduce) return;
    var vh = window.innerHeight;
    pars.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var k = parseFloat(el.dataset.parallax) || .12;
      var c = (r.top + r.height / 2 - vh / 2);
      el.style.transform = 'translate3d(0,' + (c * -k).toFixed(1) + 'px,0) scale(1.12)';
    });
  }

  /* ---------- Contadores ---------- */
  function count(el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), dur = 1800, t0 = 0;
    if (reduce) { el.textContent = fmt(to, dec); return; }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Entradas ao rolar ---------- */
  $$('[data-stagger]').forEach(function (g) { Array.from(g.children).forEach(function (c, i) { c.style.setProperty('--i', i); }); });
  var IOSEL = '[data-fx], [data-stagger], .floors, .ring, .chart, .bars2, .steps, .gantt, .prog, .live, .device, .mstep__n, .gauge, .cota, [data-io]';
  var targets = $$(IOSEL);
  var counters = $$('[data-count]');
  if (!hasIO || reduce) {
    targets.forEach(function (t) { t.classList.add('is-in'); });
    counters.forEach(function (c) { c.textContent = fmt(parseFloat(c.dataset.count), parseInt(c.dataset.dec || '0', 10)); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -9% 0px', threshold: .08 });
    targets.forEach(function (t) { io.observe(t); });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
    }, { threshold: .4 });
    counters.forEach(function (c) { c.textContent = '0'; cio.observe(c); });
  }

  /* ---------- Cartões: luz que segue o cursor e leve inclinação ---------- */
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    $$('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100) + '%'); card.style.setProperty('--my', (y * 100) + '%');
        card.style.transform = 'perspective(1200px) rotateX(' + ((.5 - y) * 5).toFixed(2) + 'deg) rotateY(' + ((x - .5) * 6).toFixed(2) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .25).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- Filtro de obras ---------- */
  $$('[data-filters]').forEach(function (bar) {
    var scope = d.getElementById(bar.dataset.filters);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var f = b.dataset.f;
      $$('[data-cat]', scope).forEach(function (w) { w.classList.toggle('is-out', f !== 'all' && w.dataset.cat.split(' ').indexOf(f) < 0); });
    });
  });

  /* ---------- Busca nas dúvidas ---------- */
  var faqIn = $('[data-faq-search]');
  if (faqIn) {
    var qas = $$('.qa'), empty = $('.faq-empty'), cat = 'all';
    var apply = function () {
      var q = faqIn.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      var shown = 0;
      qas.forEach(function (qa) {
        var txt = qa.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        var ok = (!q || txt.indexOf(q) >= 0) && (cat === 'all' || qa.dataset.cat === cat);
        qa.classList.toggle('is-out', !ok); if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? 'none' : 'block';
    };
    faqIn.addEventListener('input', apply);
    $$('[data-faq-cat]').forEach(function (b) {
      b.addEventListener('click', function () {
        cat = b.dataset.faqCat;
        $$('[data-faq-cat]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        apply();
      });
    });
  }

  /* ---------- Aviso para botões e perfis fictícios ---------- */
  var toast = d.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  d.body.appendChild(toast);
  var tTimer = null;
  function showToast(msg) {
    toast.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-info"/></svg><span>' + msg + ' <a href="https://tirvo.tech/#contato">Fale com a Tirvo</a>.</span>';
    toast.classList.add('is-on'); clearTimeout(tTimer);
    tTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 5200);
  }
  d.addEventListener('click', function (e) {
    var el = e.target.closest('[data-demo]'); if (!el) return;
    e.preventDefault();
    showToast(el.dataset.demo || 'Este é um site demonstrativo. Este botão não leva a um perfil real.');
  });

  /* ---------- Botão do WhatsApp ---------- */
  var wa = $('.wa');
  if (wa && !reduce) {
    setTimeout(function () { wa.classList.add('is-tip'); }, 4500);
    setTimeout(function () { wa.classList.remove('is-tip'); }, 12500);
  }

  /* ---------- Animação 3D ---------- */
  $$('.film').forEach(function (fig) {
    var v = fig.querySelector('video'), play = fig.querySelector('.film__play');
    var tog = fig.querySelector('[data-film="toggle"]'), full = fig.querySelector('[data-film="full"]');
    var bar = fig.querySelector('.film__track i'), mq = window.matchMedia('(max-width: 760px)');
    var cur = '';
    function pick() {
      var k = mq.matches ? 'v' : 'h'; if (k === cur) return;
      var t = v.currentTime || 0, was = !v.paused; cur = k;
      v.poster = v.dataset['p' + k]; v.src = v.dataset[k];
      if (t) v.currentTime = t; if (was) v.play().catch(function () {});
    }
    function setIcon(name, label) { tog.innerHTML = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; tog.setAttribute('aria-label', label); }
    function start() { pick(); var p = v.play(); if (p) p.catch(function () {}); }
    v.addEventListener('play', function () { fig.classList.add('is-playing'); setIcon('pause', 'Pausar'); });
    v.addEventListener('pause', function () { setIcon('play', 'Reproduzir'); });
    v.addEventListener('timeupdate', function () { if (v.duration) bar.style.width = (100 * v.currentTime / v.duration) + '%'; });
    var snd = fig.querySelector('[data-film="sound"]');
    function setSound(on) {
      v.muted = !on; fig.classList.toggle('is-sound', on); snd.setAttribute('aria-pressed', on ? 'true' : 'false');
      snd.setAttribute('aria-label', on ? 'Desativar o som' : 'Ativar o som');
      snd.innerHTML = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + (on ? 'sound' : 'mute') + '"/></svg>';
    }
    snd.addEventListener('click', function () { setSound(v.muted); if (v.paused) start(); });
    fig.querySelector('[data-film="chip"]').addEventListener('click', function () { setSound(true); if (v.paused) start(); });
    play.addEventListener('click', function () { setSound(true); start(); });
    v.addEventListener('click', function () { if (v.paused) start(); else v.pause(); });
    tog.addEventListener('click', function () { if (v.paused) start(); else v.pause(); });
    var frame = fig.querySelector('.film__frame'), closeB = fig.querySelector('[data-film="close"]');
    function fsEl() { return d.fullscreenElement || d.webkitFullscreenElement; }
    function setFull(on) {
      frame.classList.toggle('is-full', on);
      full.setAttribute('aria-label', on ? 'Sair da tela cheia' : 'Tela cheia');
      full.innerHTML = '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + (on ? 'shrink' : 'expand') + '"/></svg>';
      if (on) closeB.focus({preventScroll: true}); else full.focus({preventScroll: true});
    }
    function openFull() {
      var req = frame.requestFullscreen || frame.webkitRequestFullscreen;
      if (!req) { if (v.webkitEnterFullscreen) { if (v.paused) start(); v.webkitEnterFullscreen(); } return; }
      setFull(true);
      var r = req.call(frame);
      if (r && r.then) r.then(function () {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
      }, function () { setFull(false); });
    }
    function closeFull() {
      if (fsEl()) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
      if (screen.orientation && screen.orientation.unlock) { try { screen.orientation.unlock(); } catch (e) {} }
      setFull(false);
    }
    full.addEventListener('click', function () { if (frame.classList.contains('is-full')) closeFull(); else openFull(); });
    closeB.addEventListener('click', closeFull);
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
      d.addEventListener(ev, function () { if (!fsEl() && frame.classList.contains('is-full')) closeFull(); });
    });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && frame.classList.contains('is-full')) closeFull(); });
    if (mq.addEventListener) mq.addEventListener('change', pick);
    pick();
    if (!reduce && 'IntersectionObserver' in window) {
      var auto = true;
      tog.addEventListener('click', function () { auto = false; });
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { if (auto) start(); } else if (!v.paused) v.pause(); });
      }, {threshold: .45}).observe(v);
    }
  });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  onScroll();
})();
