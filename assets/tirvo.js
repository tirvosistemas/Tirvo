/* Tirvo · logos 3D da página de identidade visual (o restante vem do script da página inicial, assets/site.js) */
(function () {
  'use strict';
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

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

})();
