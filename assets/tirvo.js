/* Tirvo · comportamento comum das páginas internas: cabeçalho, menu móvel, revelações, holofote e logos 3D */
(function () {
  'use strict';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Cabeçalho: ganha fundo de vidro ao rolar */
  var header = $('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Menu móvel com foco preso dentro do painel enquanto aberto */
  var menu = $('[data-menu]');
  var toggle = $('[data-menu-toggle]');
  if (menu && toggle) {
    var closeBtn = $('[data-menu-close]', menu);
    var outside = $$('body > *:not([data-menu]):not(script)');
    var lastFocus = null;
    var clock = $('[data-menu-clock]', menu);
    var tickClock = function () {
      if (!clock) return;
      try {
        clock.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date());
      } catch (e) { /* relógio é só decoração */ }
    };
    var open = function () {
      lastFocus = document.activeElement;
      menu.hidden = false;
      tickClock();
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      toggle.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      outside.forEach(function (el) { el.inert = true; });
      (closeBtn || menu).focus();
    };
    var close = function (restore) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      outside.forEach(function (el) { el.inert = false; });
      setTimeout(function () { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 330);
      if (restore !== false && lastFocus) lastFocus.focus();
    };
    toggle.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', function () { close(); });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) close(false);
    });
    document.addEventListener('keydown', function (event) {
      if (menu.hidden) return;
      if (event.key === 'Escape') { close(); return; }
      if (event.key !== 'Tab') return;
      var items = $$('a[href], button:not([disabled])', menu).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches && !menu.hidden) close(false); });
  }

  /* Revelações ao entrar na tela */
  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-revealed'); });
  }
  /* Rede de segurança: nada fica escondido se o observador falhar */
  setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-revealed'); }); }, 4000);

  /* Holofote que segue o ponteiro nos cartões */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', function (event) {
      var card = event.target.closest && event.target.closest('[data-spotlight]');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    }, { passive: true });
  }

  /* Ano corrente no rodapé */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Logos 3D: 36 quadros renderizados; giram devagar, seguem o mouse e dão um giro completo ao toque */
  var spins = $$('[data-spin]').map(function (card, index) {
    return { card: card, mark: $('.spin', card), angle: index * 55, base: index * 55, spinFrom: null, spinAt: 0, hover: null, frame: -1 };
  });
  if (spins.length) {
    var paint = function (s) {
      var frame = ((Math.round(s.angle / 10) % 36) + 36) % 36;
      if (frame === s.frame) return;
      s.frame = frame;
      s.mark.style.backgroundPosition = (frame % 6) * 20 + '% ' + Math.floor(frame / 6) * 20 + '%';
    };
    var running = false;
    var visible = true;
    var last = 0;
    var loop = function (now) {
      var dt = last ? Math.min(64, now - last) : 16;
      last = now;
      spins.forEach(function (s) {
        if (s.spinFrom !== null) {
          var p = Math.min(1, (now - s.spinAt) / 1100);
          s.angle = s.spinFrom + 360 * (1 - Math.pow(1 - p, 3));
          if (p === 1) s.spinFrom = null;
        } else if (s.hover !== null) {
          var target = (s.hover - 0.5) * 90;
          var delta = ((target - s.angle + 540) % 360) - 180;
          s.angle += delta * 0.12;
        } else if (!reduced.matches) {
          s.angle += dt * 0.02;
        }
        paint(s);
      });
      if (visible && (!reduced.matches || spins.some(function (s) { return s.spinFrom !== null || s.hover !== null; }))) requestAnimationFrame(loop);
      else running = false;
    };
    var start = function () { if (running) return; running = true; last = 0; requestAnimationFrame(loop); };
    spins.forEach(function (s) {
      if (reduced.matches) { s.angle = 0; }
      paint(s);
      s.card.addEventListener('pointermove', function (event) {
        if (event.pointerType !== 'mouse') return;
        var rect = s.card.getBoundingClientRect();
        s.hover = (event.clientX - rect.left) / rect.width;
        start();
      });
      s.card.addEventListener('pointerleave', function () { s.hover = null; if (reduced.matches) { s.angle = 0; paint(s); } });
      s.card.addEventListener('click', function () {
        if (s.spinFrom !== null) return;
        s.spinFrom = s.angle;
        s.spinAt = performance.now();
        start();
      });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries.some(function (e) { return e.isIntersecting; });
        if (visible) start();
      }).observe(spins[0].card.parentElement);
    }
    start();
  }

  /* Aba em segundo plano: pausa animações contínuas */
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('is-tab-hidden', document.hidden);
  });
})();
