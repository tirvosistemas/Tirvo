/* Fundos vivos dos topos (teste): campo de código, grade de precisão com a mira, horizonte de linhas e a combinação.
   Cada <canvas data-hero-fx="code|grid|horizon|combo"> desenha atrás do topo em que está. */
(function () {
  'use strict';
  var canvases = document.querySelectorAll('canvas[data-hero-fx]');
  if (!canvases.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var ORANGE = [255, 85, 0];
  var GLYPHS = ['0', '1', '<', '>', '/', '{', '}', '#', '$', '%', '&', '*', '+', '=', '?'];
  var WORD = 'tirvo';
  var TAU = Math.PI * 2;
  var MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function setup(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var host = canvas.parentElement;
    var mode = canvas.getAttribute('data-hero-fx');
    var W = 0, H = 0, dpr = 1;
    var visible = true, running = false, raf = 0, last = 0, time = 0;
    // Ponteiro real e o ponto que o efeito segue (suavizado); sem ponteiro, o ponto passeia sozinho
    var ptr = { x: 0, y: 0, on: false, idle: 0 };
    var aim = { x: 0, y: 0, power: 0 };
    var impl = null;

    function wander(t) {
      return {
        x: W * (0.62 + 0.24 * Math.sin(t * 0.00021) + 0.08 * Math.sin(t * 0.00057)),
        y: H * (0.42 + 0.22 * Math.sin(t * 0.00031 + 1.3) + 0.06 * Math.cos(t * 0.00071)),
      };
    }

    function follow(dt) {
      var target = ptr.on ? ptr : wander(time);
      var k = 1 - Math.pow(ptr.on ? 0.0009 : 0.02, dt / 1000);
      aim.x += (target.x - aim.x) * k;
      aim.y += (target.y - aim.y) * k;
      var want = ptr.on ? 1 : 0.45;
      aim.power += (want - aim.power) * (1 - Math.pow(0.05, dt / 1000));
    }

    /* ---------- Mira: círculo com quatro marcas, cantos e linhas-guia até as bordas ---------- */
    function drawReticle(alpha, withGuides) {
      var x = aim.x, y = aim.y, r = coarse ? 18 : 22;
      ctx.save();
      ctx.lineWidth = 1;
      if (withGuides) {
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = rgba(ORANGE, 0.22 * alpha);
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(x - r - 10, y);
        ctx.moveTo(x + r + 10, y); ctx.lineTo(W, y);
        ctx.moveTo(x, 0); ctx.lineTo(x, y - r - 10);
        ctx.moveTo(x, y + r + 10); ctx.lineTo(x, H);
        ctx.stroke();
        ctx.setLineDash([]);
        // Coordenadas nas bordas, como numa planta
        ctx.font = '500 10px ' + MONO;
        ctx.fillStyle = rgba(ORANGE, 0.55 * alpha);
        ctx.textBaseline = 'bottom';
        ctx.fillText('x ' + String(Math.round(x)).padStart(4, '0'), x + 6, H - 10);
        ctx.textBaseline = 'bottom';
        ctx.fillText('y ' + String(Math.round(y)).padStart(4, '0'), 8, y - 6);
      }
      ctx.strokeStyle = rgba(ORANGE, 0.85 * alpha);
      ctx.shadowColor = rgba(ORANGE, 0.6 * alpha);
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - r - 7, y); ctx.lineTo(x - r + 5, y);
      ctx.moveTo(x + r - 5, y); ctx.lineTo(x + r + 7, y);
      ctx.moveTo(x, y - r - 7); ctx.lineTo(x, y - r + 5);
      ctx.moveTo(x, y + r - 5); ctx.lineTo(x, y + r + 7);
      ctx.stroke();
      var c = r + 14, l = 7;
      ctx.strokeStyle = rgba(ORANGE, 0.45 * alpha);
      ctx.beginPath();
      ctx.moveTo(x - c, y - c + l); ctx.lineTo(x - c, y - c); ctx.lineTo(x - c + l, y - c);
      ctx.moveTo(x + c - l, y - c); ctx.lineTo(x + c, y - c); ctx.lineTo(x + c, y - c + l);
      ctx.moveTo(x + c, y + c - l); ctx.lineTo(x + c, y + c); ctx.lineTo(x + c - l, y + c);
      ctx.moveTo(x - c + l, y + c); ctx.lineTo(x - c, y + c); ctx.lineTo(x - c, y + c - l);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = rgba(ORANGE, alpha);
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      ctx.restore();
    }

    /* ---------- 1 · Campo de código ---------- */
    function codeField(withReticle) {
      var cell = 0, cols = 0, rows = 0, cells = [];
      var atlas = null, gw = 0, gh = 0;
      var chars = GLYPHS.concat(WORD.split(''));
      function buildAtlas() {
        var size = Math.round(cell * 0.56);
        gw = Math.ceil(cell * dpr); gh = gw;
        atlas = document.createElement('canvas');
        atlas.width = gw * chars.length; atlas.height = gh * 3;
        var a = atlas.getContext('2d');
        a.scale(dpr, dpr);
        a.font = '500 ' + size + 'px ' + MONO;
        a.textAlign = 'center'; a.textBaseline = 'middle';
        // Linha 0: branco apagado · linha 1: laranja · linha 2: letra acesa
        var colors = ['#e9e9ee', '#ff5500', '#ffffff'];
        for (var row = 0; row < 3; row++) {
          a.fillStyle = colors[row];
          if (row === 1) { a.shadowColor = 'rgba(255,85,0,.8)'; a.shadowBlur = 6; } else a.shadowBlur = 0;
          for (var i = 0; i < chars.length; i++) a.fillText(chars[i], (i * gw) / dpr + cell / 2, (row * gh) / dpr + cell / 2);
        }
      }
      function resize() {
        cell = W < 640 ? 22 : 26;
        cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1;
        cells = [];
        for (var i = 0; i < cols * rows; i++) {
          cells.push({ g: (Math.random() * GLYPHS.length) | 0, next: Math.random() * 4000, heat: 0, base: 0.05 + Math.random() * 0.09, on: Math.random() < 0.62 });
        }
        buildAtlas();
      }
      function draw(dt) {
        var r = (coarse ? 130 : 170) * (0.75 + 0.25 * aim.power);
        var r2 = r * r;
        var cool = Math.pow(0.35, dt / 1000);
        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols; x++) {
            var c = cells[y * cols + x];
            var px = x * cell, py = y * cell;
            var dx = px + cell / 2 - aim.x, dy = py + cell / 2 - aim.y;
            var d2 = dx * dx + dy * dy;
            var f = d2 < r2 ? 1 - Math.sqrt(d2) / r : 0;
            f *= aim.power;
            c.heat = Math.max(c.heat * cool, f);
            // Quanto mais quente, mais rápido o símbolo troca
            c.next -= dt * (1 + c.heat * 30);
            if (c.next <= 0) {
              c.g = (Math.random() * GLYPHS.length) | 0;
              c.next = 900 + Math.random() * 5200;
              if (!c.heat && Math.random() < 0.08) c.on = !c.on;
            }
            if (!c.on && c.heat < 0.05) continue;
            var sx = c.g * gw;
            ctx.globalAlpha = c.base * (1 - c.heat);
            if (ctx.globalAlpha > 0.004) ctx.drawImage(atlas, sx, 0, gw, gh, px, py, cell, cell);
            if (c.heat > 0.05) {
              if (c.heat > 0.72) {
                // No centro, o código vira letra: tirvo, lido na linha
                var li = GLYPHS.length + ((x + y * 3) % WORD.length);
                ctx.globalAlpha = Math.min(1, (c.heat - 0.72) * 3) * 0.9;
                ctx.drawImage(atlas, li * gw, gh * 2, gw, gh, px, py, cell, cell);
                ctx.globalAlpha = (1 - Math.min(1, (c.heat - 0.72) * 3)) * 0.8;
              } else ctx.globalAlpha = 0.12 + c.heat * 0.75;
              ctx.drawImage(atlas, sx, gh, gw, gh, px, py, cell, cell);
            }
          }
        }
        ctx.globalAlpha = 1;
        if (withReticle) drawReticle(0.35 + 0.65 * aim.power, true);
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- 2 · Grade de precisão com a mira (lente que entorta a grade) ---------- */
    function precisionGrid() {
      var step = 48, seg = 12;
      function resize() { step = W < 640 ? 36 : 48; seg = W < 640 ? 10 : 12; }
      function warp(x, y, out) {
        var dx = x - aim.x, dy = y - aim.y;
        var R = (coarse ? 150 : 210);
        var e = Math.exp(-(dx * dx + dy * dy) / (R * R)) * 0.55 * aim.power;
        // Leve ondulação para a grade nunca ficar parada
        var w = Math.sin(y * 0.012 + time * 0.0006) * 2 + Math.cos(x * 0.01 - time * 0.0005) * 2;
        out.x = x + dx * e + w * 0.6;
        out.y = y + dy * e + w * 0.4;
      }
      var p = { x: 0, y: 0 };
      function draw() {
        var grad = ctx.createRadialGradient(aim.x, aim.y, 0, aim.x, aim.y, coarse ? 220 : 320);
        grad.addColorStop(0, rgba(ORANGE, 0.55 * aim.power + 0.1));
        grad.addColorStop(0.35, rgba(ORANGE, 0.16 * aim.power + 0.05));
        grad.addColorStop(1, 'rgba(255,255,255,0.055)');
        ctx.lineWidth = 1;
        ctx.strokeStyle = grad;
        ctx.beginPath();
        var off = (time * 0.004) % step;
        for (var gx = -step + off; gx <= W + step; gx += step) {
          for (var y = -seg; y <= H + seg; y += seg) { warp(gx, y, p); if (y === -seg) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
        }
        for (var gy = -step + off; gy <= H + step; gy += step) {
          for (var x = -seg; x <= W + seg; x += seg) { warp(x, gy, p); if (x === -seg) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); }
        }
        ctx.stroke();
        // Pontos nos cruzamentos perto da mira
        var R = coarse ? 170 : 240;
        for (gx = -step + off; gx <= W + step; gx += step) {
          for (gy = -step + off; gy <= H + step; gy += step) {
            var dx = gx - aim.x, dy = gy - aim.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d > R) continue;
            warp(gx, gy, p);
            ctx.fillStyle = rgba(ORANGE, (1 - d / R) * 0.9 * aim.power);
            ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
          }
        }
        drawReticle(0.4 + 0.6 * aim.power, true);
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- 3 · Horizonte de linhas (terreno em perspectiva) ---------- */
    function horizon() {
      var ROWS = 34, NEAR = 1, FAR = 18, horizonY = 0, camH = 0;
      function resize() { horizonY = H * 0.4; camH = H * 0.9; ROWS = W < 640 ? 26 : 34; }
      function height(x, z) {
        return Math.sin(x * 0.0042 + z * 0.55 + time * 0.00035) * 0.5
          + Math.sin(x * 0.0017 - z * 0.3 - time * 0.00022) * 0.8
          + Math.cos(x * 0.009 + z * 0.9) * 0.18;
      }
      function draw() {
        var dz = (FAR - NEAR) / ROWS;
        var phase = (time * 0.00045) % dz;
        var seg = W < 640 ? 10 : 14;
        ctx.lineWidth = 1;
        for (var i = ROWS; i >= 0; i--) {
          var z = NEAR + i * dz - phase;
          if (z <= NEAR * 0.6) continue;
          var scale = camH / z;
          var depth = 1 - (z - NEAR) / (FAR - NEAR);
          var alpha = 0.05 + depth * depth * 0.32;
          ctx.beginPath();
          var hot = 0;
          for (var sx = -seg; sx <= W + seg; sx += seg) {
            var wx = (sx - W / 2) / scale * 60;
            var amp = 34 * (0.55 + depth);
            var h = height(wx, z) * amp * (scale / camH) * 4;
            var y = horizonY + scale * 0.35 - h;
            // O ponteiro abre uma onda/vale por onde passa
            var dx = sx - aim.x, dy = y - aim.y;
            var e = Math.exp(-(dx * dx) / 22000 - (dy * dy) / 9000) * aim.power;
            y += e * 46 * (0.4 + depth) + Math.sin(dx * 0.03 - time * 0.006) * e * 6;
            if (e > hot) hot = e;
            if (sx === -seg) ctx.moveTo(sx, y); else ctx.lineTo(sx, y);
          }
          if (hot > 0.02) {
            var g = ctx.createLinearGradient(aim.x - 260, 0, aim.x + 260, 0);
            var base = 'rgba(233,233,238,' + alpha + ')';
            g.addColorStop(0, base);
            g.addColorStop(0.5, rgba(ORANGE, Math.min(0.95, alpha + hot * 0.7)));
            g.addColorStop(1, base);
            ctx.strokeStyle = g;
          } else ctx.strokeStyle = 'rgba(233,233,238,' + alpha + ')';
          ctx.stroke();
        }
        // Linha do horizonte, fina e laranja como o cursor da logo
        var hg = ctx.createLinearGradient(0, 0, W, 0);
        hg.addColorStop(0, 'rgba(255,85,0,0)');
        hg.addColorStop(0.5, 'rgba(255,85,0,.55)');
        hg.addColorStop(1, 'rgba(255,85,0,0)');
        ctx.fillStyle = hg;
        ctx.fillRect(0, horizonY + camH / FAR * 0.35 - 1, W, 1.5);
      }
      return { resize: resize, draw: draw };
    }

    impl = mode === 'grid' ? precisionGrid() : mode === 'horizon' ? horizon() : codeField(mode === 'combo');

    function resize() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!aim.x) { var w = wander(time); aim.x = w.x; aim.y = w.y; }
      impl.resize();
      if (!running) paint(16);
    }
    function paint(dt) {
      ctx.clearRect(0, 0, W, H);
      impl.draw(dt);
    }
    function frame(now) {
      if (!running) return;
      var dt = last ? Math.min(64, now - last) : 16;
      last = now; time += dt;
      if (ptr.on && !coarse) { ptr.idle += dt; if (ptr.idle > 2600) ptr.on = false; }
      follow(dt);
      paint(dt);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduce.matches || !visible || document.hidden) return;
      running = true; last = 0; raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; cancelAnimationFrame(raf); }
    function still() { stop(); aim.power = 0.6; paint(16); }

    // Mouse ou dedo: nunca bloqueia a rolagem
    function move(e) {
      var r = host.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { ptr.on = false; return; }
      ptr.x = x; ptr.y = y; ptr.on = true; ptr.idle = 0;
    }
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { ptr.on = false; }, { passive: true });
    window.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') setTimeout(function () { ptr.on = false; }, 900); }, { passive: true });

    resize();
    requestAnimationFrame(function () { canvas.classList.add('is-ready'); });
    if (reduce.matches) still(); else start();
    if ('ResizeObserver' in window) {
      var t = 0;
      new ResizeObserver(function () { clearTimeout(t); t = setTimeout(resize, 120); }).observe(host);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(host);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
    if (reduce.addEventListener) reduce.addEventListener('change', function () { if (reduce.matches) still(); else start(); });
  }

  function boot() { for (var i = 0; i < canvases.length; i++) setup(canvases[i]); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot, boot); else boot();
})();
