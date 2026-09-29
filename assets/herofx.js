/* Fundos vivos dos topos: cada página tem o seu, ligado ao assunto dela.
   Cada <canvas data-hero-fx="..."> desenha atrás do topo em que está (veja o mapa FX no fim). */
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
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

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

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

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

    /* ---------- Sobre a Tirvo · foco: partículas que convergem para a mira, em espiral no sentido horário ---------- */
    function focus() {
      var parts = [], rings = [], cx = 0, cy = 0, fr = 180, maxR = 0, next = 1800;
      function measure() {
        var f = host.querySelector('.ab-focus');
        var hb = host.getBoundingClientRect();
        if (f) {
          var a = f.getBoundingClientRect();
          cx = a.left - hb.left + a.width / 2; cy = a.top - hb.top + a.height / 2; fr = a.width / 2;
        } else { cx = W * 0.72; cy = H * 0.5; fr = 180; }
        maxR = Math.sqrt(Math.pow(Math.max(cx, W - cx), 2) + Math.pow(Math.max(cy, H - cy), 2)) + 20;
      }
      function spawn(p, far) {
        p.a = Math.random() * TAU;
        p.r = far ? maxR * rnd(0.85, 1) : rnd(fr * 0.8, maxR);
        p.v = rnd(9, 22); p.s = rnd(0.6, 1.3); p.hot = Math.random() < 0.16; p.age = far ? 0 : 2000;
        return p;
      }
      function resize() {
        measure();
        parts = [];
        for (var i = 0, n = W < 640 ? 44 : 84; i < n; i++) parts.push(spawn({}, false));
      }
      function draw(dt) {
        var s = dt / 1000;
        // Pulso de foco: um anel fino sai da mira e se apaga, a cada poucos segundos
        next -= dt;
        if (next <= 0) { rings.push(0); next = 5600; }
        ctx.lineWidth = 1;
        for (var i = rings.length - 1; i >= 0; i--) {
          rings[i] += s * 64;
          var a = 0.09 * (1 - rings[i] / (maxR - fr));
          if (a <= 0) { rings.splice(i, 1); continue; }
          ctx.strokeStyle = rgba(ORANGE, a);
          ctx.beginPath(); ctx.arc(cx, cy, fr * 1.02 + rings[i], 0, TAU); ctx.stroke();
        }
        for (i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.age += dt;
          var dr = p.v * (1 + 60 / Math.max(p.r, 60)) * s;
          p.r -= dr;
          p.a += s * (0.03 + 5 / Math.max(p.r, 40));
          if (p.r < fr * 0.5) { spawn(p, true); continue; }
          var fade = clamp((p.r - fr * 0.5) / (fr * 0.55), 0, 1) * clamp(p.age / 1600, 0, 1) * clamp((maxR - p.r) / 60, 0, 1);
          var x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r;
          var tx = cx + Math.cos(p.a - 0.025) * (p.r + 9 * p.s), ty = cy + Math.sin(p.a - 0.025) * (p.r + 9 * p.s);
          var alpha = (p.hot ? 0.42 : 0.2) * fade;
          if (ptr.on) {
            var dx = x - ptr.x, dy = y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 130) alpha += 0.25 * (1 - d / 130) * fade;
          }
          ctx.lineWidth = p.s;
          ctx.strokeStyle = p.hot ? rgba(ORANGE, alpha) : 'rgba(233,233,238,' + alpha + ')';
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Equipe · cursores da equipe desenhando juntos, como num editor compartilhado ---------- */
    function team() {
      var names = ['Front-end', 'Back-end', 'UX/UI', 'Branding', 'IA', 'DevOps'];
      var crew = [], blocks = [], step = 32, bg = null, wasOn = false;
      function target(c) {
        if (ptr.on) {
          var a = Math.random() * TAU, d = rnd(70, 180);
          c.tx = ptr.x + Math.cos(a) * d; c.ty = ptr.y + Math.sin(a) * d;
        } else { c.tx = rnd(W * 0.05, W * 0.95); c.ty = rnd(H * 0.12, H * 0.9); }
        c.tx = clamp(c.tx, 12, W - 90); c.ty = clamp(c.ty, Math.max(96, H * 0.12), H - 40);
        c.wait = 0;
      }
      function resize() {
        step = W < 640 ? 26 : 32;
        bg = document.createElement('canvas');
        bg.width = Math.round(W * dpr); bg.height = Math.round(H * dpr);
        var b = bg.getContext('2d');
        b.scale(dpr, dpr);
        b.fillStyle = 'rgba(255,255,255,.075)';
        for (var y = step; y < H; y += step) for (var x = step; x < W; x += step) b.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        if (!crew.length) {
          for (var i = 0; i < names.length; i++) {
            var c = { name: names[i], x: rnd(W * 0.1, W * 0.9), y: rnd(H * 0.15, H * 0.9), vx: 0, vy: 0, trail: [], hot: i % 2 === 0 };
            target(c); crew.push(c);
          }
        } else crew.forEach(function (c) { c.x = clamp(c.x, 0, W); c.y = clamp(c.y, 0, H); target(c); });
        blocks = [];
      }
      function chip(c, x, y) {
        ctx.font = '500 10px ' + MONO;
        var w = ctx.measureText(c.name).width + 12;
        ctx.fillStyle = c.hot ? 'rgba(255,85,0,.88)' : 'rgba(233,233,238,.82)';
        roundRect(x, y, w, 17, 4); ctx.fill();
        ctx.fillStyle = '#0b0b0f';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.name, x + 6, y + 9);
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000;
        ctx.drawImage(bg, 0, 0, W, H);
        // Quando o mouse entra, a equipe vem trabalhar perto de você
        if (ptr.on !== wasOn) { wasOn = ptr.on; crew.forEach(target); }
        // Molduras que cada um desenha e que se apagam com o tempo
        ctx.lineWidth = 1;
        for (var i = blocks.length - 1; i >= 0; i--) {
          var b = blocks[i];
          b.age += dt;
          var g = ease(clamp(b.age / 520, 0, 1));
          var a = clamp((7200 - b.age) / 1400, 0, 1);
          if (a <= 0) { blocks.splice(i, 1); continue; }
          var x0 = b.x - b.w * g, y0 = b.y - b.h * g;
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = b.hot ? rgba(ORANGE, 0.34 * a) : 'rgba(233,233,238,' + 0.16 * a + ')';
          ctx.strokeRect(x0 + 0.5, y0 + 0.5, b.w * g, b.h * g);
          ctx.setLineDash([]);
          if (g >= 1) {
            ctx.font = '500 9px ' + MONO;
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(233,233,238,' + 0.28 * a + ')';
            ctx.fillText(b.tag, x0 + 4, y0 - 3);
          }
        }
        // Linhas finas ligando quem trabalha perto
        for (i = 0; i < crew.length; i++) {
          for (var j = i + 1; j < crew.length; j++) {
            var dx = crew[i].x - crew[j].x, dy = crew[i].y - crew[j].y, d = Math.sqrt(dx * dx + dy * dy);
            if (d > 380) continue;
            ctx.strokeStyle = rgba(ORANGE, 0.1 * (1 - d / 380));
            ctx.beginPath(); ctx.moveTo(crew[i].x, crew[i].y); ctx.lineTo(crew[j].x, crew[j].y); ctx.stroke();
          }
        }
        for (i = 0; i < crew.length; i++) {
          var c = crew[i];
          if (c.wait > 0) { c.wait -= dt; if (c.wait <= 0) target(c); }
          var ax = (c.tx - c.x) * 7 - c.vx * 5, ay = (c.ty - c.y) * 7 - c.vy * 5;
          c.vx += ax * s; c.vy += ay * s;
          var sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
          if (sp > 360) { c.vx *= 360 / sp; c.vy *= 360 / sp; }
          c.x += c.vx * s; c.y += c.vy * s;
          if (c.wait <= 0 && Math.abs(c.tx - c.x) < 4 && Math.abs(c.ty - c.y) < 4 && sp < 20) {
            // Chegou: desenha uma moldura presa à grade, com o cursor no canto
            if (Math.random() < 0.7) {
              var bw = step * ((2 + Math.random() * 4) | 0), bh = step * ((1 + Math.random() * 3) | 0);
              blocks.push({ x: Math.round(c.x / step) * step, y: Math.round(c.y / step) * step, w: bw, h: bh, age: 0, hot: c.hot, tag: c.name.toLowerCase() });
              if (blocks.length > 16) blocks.shift();
            }
            c.wait = rnd(500, 1500);
          }
          c.trail.push(c.x, c.y);
          if (c.trail.length > 48) c.trail.splice(0, 2);
          if (c.trail.length > 4) {
            ctx.strokeStyle = c.hot ? rgba(ORANGE, 0.22) : 'rgba(233,233,238,.14)';
            ctx.beginPath(); ctx.moveTo(c.trail[0], c.trail[1]);
            for (j = 2; j < c.trail.length; j += 2) ctx.lineTo(c.trail[j], c.trail[j + 1]);
            ctx.stroke();
          }
          // Seta do cursor e o nome de quem está ali
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(0, 15); ctx.lineTo(4, 11.4); ctx.lineTo(7, 17.6); ctx.lineTo(9.4, 16.6); ctx.lineTo(6.6, 10.6); ctx.lineTo(11.6, 10.6);
          ctx.closePath();
          ctx.fillStyle = c.hot ? 'rgba(255,85,0,.92)' : 'rgba(233,233,238,.9)';
          ctx.strokeStyle = 'rgba(11,11,15,.9)';
          ctx.fill(); ctx.stroke();
          ctx.restore();
          chip(c, c.x + 12, c.y + 16);
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Método · fluxo em três fases: descoberta dispersa, engenharia alinhada, lançamento que sobe ---------- */
    function pipeline() {
      var ps = [], marks = [], g1 = 0, g2 = 0, lane = 26, n = 0;
      function spawn(p, anywhere) {
        p.x = anywhere ? rnd(-20, W) : rnd(-80, -10);
        p.y0 = rnd(H * 0.06, H * 0.9); p.y = p.y0; p.vy = 0;
        p.v = rnd(30, 54); p.s = rnd(0.7, 1.4); p.j = Math.random() * TAU;
        p.lane = Math.round(p.y0 / lane) * lane; p.zone = 0;
        return p;
      }
      function resize() {
        g1 = W * 0.34; g2 = W * 0.67; lane = W < 640 ? 22 : 26;
        n = W < 640 ? 70 : 140;
        if (ps.length !== n) { ps = []; for (var i = 0; i < n; i++) ps.push(spawn({}, true)); }
        else ps.forEach(function (p) { p.lane = Math.round(p.y0 / lane) * lane; });
      }
      function label(x, num, txt) {
        ctx.font = '500 10px ' + MONO;
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = rgba(ORANGE, 0.7);
        ctx.fillText(num, x, H - 34);
        ctx.fillStyle = 'rgba(233,233,238,.5)';
        ctx.fillText(txt, x + ctx.measureText(num + ' ').width, H - 34);
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000;
        // Portões entre as fases
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.strokeStyle = 'rgba(233,233,238,.1)';
        ctx.beginPath(); ctx.moveTo(g1, 0); ctx.lineTo(g1, H); ctx.moveTo(g2, 0); ctx.lineTo(g2, H); ctx.stroke();
        ctx.setLineDash([]);
        label(Math.max(16, g1 - Math.min(g1 - 16, W * 0.3)), '01', 'descoberta');
        label(g1 + 10, '02', 'engenharia');
        label(g2 + 10, '03', 'lançamento');
        // Marcas nos portões por onde cada partícula passou
        for (var i = marks.length - 1; i >= 0; i--) {
          var m = marks[i];
          m.a -= s * 0.9;
          if (m.a <= 0) { marks.splice(i, 1); continue; }
          ctx.fillStyle = rgba(ORANGE, 0.7 * m.a);
          ctx.fillRect(m.x - 5, m.y - 0.5, 10, 1.5);
        }
        for (i = 0; i < ps.length; i++) {
          var p = ps[i];
          var boost = 1;
          if (ptr.on) {
            var dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) boost += 2.2 * (1 - d / 120);
          }
          var zone = p.x < g1 ? 0 : p.x < g2 ? 1 : 2;
          if (zone !== p.zone) { if (marks.length < 60) marks.push({ x: zone === 1 ? g1 : g2, y: p.y, a: 1 }); p.zone = zone; }
          var hot = boost > 1 ? (boost - 1) / 2.2 : 0;
          if (zone === 0) {
            // Descoberta: ainda solto, explorando
            p.j += s * p.s;
            p.x += p.v * 0.75 * boost * s;
            p.y = p.y0 + Math.sin(p.j) * 16 + Math.cos(p.j * 0.7 + p.x * 0.01) * 8;
            ctx.fillStyle = hot ? rgba(ORANGE, 0.3 + hot * 0.5) : 'rgba(233,233,238,.24)';
            ctx.fillRect(p.x - 0.8 * p.s, p.y - 0.8 * p.s, 1.6 * p.s, 1.6 * p.s);
          } else if (zone === 1) {
            // Engenharia: entra na linha e ganha forma
            var t = (p.x - g1) / (g2 - g1);
            p.x += p.v * boost * s;
            p.y += (p.lane - p.y) * (1 - Math.pow(0.02, s));
            var len = 5 + 12 * t;
            ctx.strokeStyle = t > 0.7 || hot ? rgba(ORANGE, 0.25 + 0.4 * Math.max(t - 0.4, hot)) : 'rgba(233,233,238,' + (0.2 + 0.2 * t) + ')';
            ctx.lineWidth = p.s;
            ctx.beginPath(); ctx.moveTo(p.x - len, p.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          } else {
            // Lançamento: acelera e sobe
            var u = (p.x - g2) / (W - g2);
            var vx = p.v * (1 + 3.2 * u) * boost;
            p.vy -= s * (30 + 150 * u);
            p.x += vx * s; p.y += p.vy * s;
            ctx.strokeStyle = rgba(ORANGE, 0.6 * (1 - u * 0.5));
            ctx.lineWidth = p.s * 1.1;
            ctx.beginPath(); ctx.moveTo(p.x - vx * 0.14, p.y - p.vy * 0.14); ctx.lineTo(p.x, p.y); ctx.stroke();
            if (p.x > W + 30 || p.y < -30) spawn(p, false);
          }
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Nexus · enxame de agentes que recebe uma tarefa, voa até ela e a conclui ---------- */
    function swarm() {
      var bs = [], task = { x: 0, y: 0, t: 0, id: 11 }, rings = [];
      function newTask() {
        // A tarefa aparece num espaço livre do topo, nunca escondida atrás da imagem ao lado do texto
        var hb = host.getBoundingClientRect(), show = host.querySelector('.page-hero__show'), r = show && show.getBoundingClientRect();
        for (var i = 0; i < 24; i++) {
          task.x = rnd(W >= 1024 ? W * 0.4 : W * 0.1, W * 0.94); task.y = rnd(H * 0.14, H * 0.9);
          if (!r || task.x < r.left - hb.left - 30 || task.x > r.right - hb.left + 30 || task.y < r.top - hb.top - 30 || task.y > r.bottom - hb.top + 30) break;
        }
        task.t = 0; task.age = 0; task.id++;
      }
      function resize() {
        var n = W < 640 ? 44 : 90;
        if (bs.length !== n) {
          bs = [];
          for (var i = 0; i < n; i++) bs.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-40, 40), vy: rnd(-40, 40), lead: i % 9 === 0 });
        }
        newTask();
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000;
        var tx = ptr.on ? ptr.x : task.x, ty = ptr.on ? ptr.y : task.y;
        var near = 0, i, j, a, b;
        // Ligações curtas: os agentes conversam entre si
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.1)';
        ctx.beginPath();
        for (i = 0; i < bs.length; i++) {
          a = bs[i];
          var ax = 0, ay = 0, cx = 0, cy = 0, avx = 0, avy = 0, cnt = 0;
          for (j = 0; j < bs.length; j++) {
            if (i === j) continue;
            b = bs[j];
            var dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 > 4900) continue;
            cnt++; cx += b.x; cy += b.y; avx += b.vx; avy += b.vy;
            if (d2 < 484) { var inv = 900 / Math.max(d2, 16); ax += dx * inv; ay += dy * inv; }
            if (j > i && d2 < 1600) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
          }
          if (cnt) {
            ax += (avx / cnt - a.vx) * 0.9 + (cx / cnt - a.x) * 0.45;
            ay += (avy / cnt - a.vy) * 0.9 + (cy / cnt - a.y) * 0.45;
          }
          // Vai até a tarefa e circula em volta dela enquanto trabalha
          var ex = tx - a.x, ey = ty - a.y, ed = Math.sqrt(ex * ex + ey * ey) || 1;
          if (ed < 80) near++;
          var orbit = ed < 110 ? 0.9 : 0.25;
          var wantX = (ex / ed) * 130 + (-ey / ed) * 110 * orbit, wantY = (ey / ed) * 130 + (ex / ed) * 110 * orbit;
          ax += (wantX - a.vx) * 1.1; ay += (wantY - a.vy) * 1.1;
          a.vx += ax * s; a.vy += ay * s;
          var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
          var max = a.lead ? 170 : 150;
          if (sp > max) { a.vx *= max / sp; a.vy *= max / sp; } else if (sp < 40) { a.vx *= 40 / (sp || 1); a.vy *= 40 / (sp || 1); }
          a.x += a.vx * s; a.y += a.vy * s;
        }
        ctx.stroke();
        if (!ptr.on) {
          task.age += dt;
          if (near > bs.length * 0.25) task.t += dt;
          if (task.t > 1500 || task.age > 9000) { rings.push({ x: task.x, y: task.y, r: 10, a: 1 }); newTask(); }
          // A tarefa: moldura tracejada com o número
          var k = clamp(task.t / 1500, 0, 1);
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = rgba(ORANGE, 0.55);
          ctx.strokeRect(task.x - 11, task.y - 11, 22, 22);
          ctx.setLineDash([]);
          ctx.fillStyle = rgba(ORANGE, 0.16 + 0.5 * k);
          ctx.fillRect(task.x - 11, task.y + 14, 22 * k, 2);
          ctx.font = '500 9px ' + MONO;
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'rgba(233,233,238,.4)';
          ctx.fillText('tarefa ' + String(task.id).padStart(3, '0'), task.x - 11, task.y - 16);
        }
        for (i = rings.length - 1; i >= 0; i--) {
          var r = rings[i];
          r.r += s * 90; r.a -= s * 0.8;
          if (r.a <= 0) { rings.splice(i, 1); continue; }
          ctx.strokeStyle = rgba(ORANGE, 0.5 * r.a);
          ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
        }
        // Cada agente é uma pequena seta que aponta para onde vai
        for (i = 0; i < bs.length; i++) {
          a = bs[i];
          var h = Math.atan2(a.vy, a.vx), z = a.lead ? 8 : 6.5;
          ctx.fillStyle = a.lead ? rgba(ORANGE, 0.95) : 'rgba(233,233,238,.72)';
          ctx.beginPath();
          ctx.moveTo(a.x + Math.cos(h) * z, a.y + Math.sin(h) * z);
          ctx.lineTo(a.x + Math.cos(h + 2.5) * z * 0.8, a.y + Math.sin(h + 2.5) * z * 0.8);
          ctx.lineTo(a.x + Math.cos(h - 2.5) * z * 0.8, a.y + Math.sin(h - 2.5) * z * 0.8);
          ctx.closePath(); ctx.fill();
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Criação de sites · a página se monta em blocos e a inspeção mostra as medidas ---------- */
    function wire() {
      var blocks = [], cols = 12, gut = 24, margin = 0, colW = 0, t = 0;
      function col(i) { return margin + i * (colW + gut); }
      function span(k) { return k * colW + (k - 1) * gut; }
      function layout() {
        blocks = []; t = 0;
        var mobile = W < 640;
        cols = mobile ? 4 : 12; gut = mobile ? 14 : 24;
        var cw = Math.min(W - (mobile ? 32 : 48), 1296);
        margin = (W - cw) / 2; colW = (cw - gut * (cols - 1)) / cols;
        var y = mobile ? 84 : 96;
        blocks.push({ x: col(0), y: y, w: span(cols), h: 34, k: 'nav' });
        y += 34 + gut;
        var types = mobile ? ['full', 'text', 'img', 'pair'] : ['split', 'split2', 'cards3', 'cards4', 'full', 'text'];
        while (y < H - 70) {
          var h = Math.round(rnd(84, 176) / 8) * 8;
          if (y + h > H - 30) h = H - 30 - y;
          if (h < 48) break;
          var ty = types[(Math.random() * types.length) | 0];
          if (ty === 'split') { blocks.push({ x: col(0), y: y, w: span(7), h: h, k: 'text' }, { x: col(7), y: y, w: span(5), h: h, k: 'img' }); }
          else if (ty === 'split2') { blocks.push({ x: col(0), y: y, w: span(5), h: h, k: 'img' }, { x: col(5), y: y, w: span(7), h: h, k: 'text' }); }
          else if (ty === 'cards3' || ty === 'cards4') {
            var k = ty === 'cards3' ? 3 : 4;
            for (var i = 0; i < k; i++) blocks.push({ x: col(i * (12 / k)), y: y, w: span(12 / k), h: h, k: 'card' });
          } else if (ty === 'pair') { blocks.push({ x: col(0), y: y, w: span(2), h: h, k: 'card' }, { x: col(2), y: y, w: span(2), h: h, k: 'card' }); }
          else blocks.push({ x: col(0), y: y, w: span(cols), h: h, k: ty === 'full' || ty === 'img' ? 'img' : 'text' });
          y += h + gut;
        }
        blocks.forEach(function (b, i) { b.born = 300 + i * 150; });
      }
      function edge(b, p) {
        // Contorno desenhado aos poucos, como um traço que percorre o bloco
        var per = 2 * (b.w + b.h), L = per * p;
        ctx.beginPath(); ctx.moveTo(b.x, b.y);
        var segs = [[b.w, 0], [0, b.h], [-b.w, 0], [0, -b.h]], x = b.x, y = b.y;
        for (var i = 0; i < 4 && L > 0; i++) {
          var len = Math.abs(segs[i][0] + segs[i][1]), f = Math.min(1, L / len);
          x += segs[i][0] * f; y += segs[i][1] * f; ctx.lineTo(x, y); L -= len;
        }
        ctx.stroke();
      }
      function inner(b, a) {
        ctx.strokeStyle = 'rgba(233,233,238,' + 0.07 * a + ')';
        ctx.fillStyle = 'rgba(233,233,238,' + 0.055 * a + ')';
        var pad = 12;
        if (b.k === 'img') {
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.moveTo(b.x + b.w, b.y); ctx.lineTo(b.x, b.y + b.h); ctx.stroke();
        } else if (b.k === 'nav') {
          ctx.fillRect(b.x + pad, b.y + 11, 12, 12);
          for (var i = 0; i < 4; i++) ctx.fillRect(b.x + b.w * 0.45 + i * 54, b.y + 15, 38, 4);
          ctx.fillRect(b.x + b.w - 80, b.y + 9, 68, 16);
        } else {
          var lines = Math.max(1, Math.min(5, Math.floor((b.h - pad * 2) / 16)));
          if (b.k === 'card') { ctx.beginPath(); ctx.arc(b.x + pad + 8, b.y + pad + 8, 8, 0, TAU); ctx.fill(); }
          var top = b.k === 'card' ? b.y + pad + 26 : b.y + pad + 4;
          for (i = 0; i < lines && top + i * 16 < b.y + b.h - pad; i++) {
            var w = (b.w - pad * 2) * (i === 0 ? 0.7 : i === lines - 1 ? 0.45 : 0.92);
            ctx.fillRect(b.x + pad, top + i * 16, w, i === 0 && b.k === 'text' ? 8 : 4);
          }
        }
      }
      function resize() { layout(); }
      function draw(dt) {
        t += dt;
        // Colunas da grade de layout
        ctx.fillStyle = 'rgba(255,85,0,.022)';
        for (var c = 0; c < cols; c++) ctx.fillRect(col(c), 0, colW, H);
        var out = t > 8200, hover = null;
        ctx.lineWidth = 1;
        for (var i = 0; i < blocks.length; i++) {
          var b = blocks[i];
          var p = ease(clamp((t - b.born) / 650, 0, 1));
          var a = out ? clamp(1 - (t - 8200 - (blocks.length - i) * 60) / 500, 0, 1) : 1;
          if (p <= 0 || a <= 0) continue;
          ctx.strokeStyle = 'rgba(233,233,238,' + 0.13 * a + ')';
          edge(b, p);
          if (p >= 1) inner(b, a * clamp((t - b.born - 650) / 400, 0, 1));
          if (!out && p >= 1 && aim.x >= b.x && aim.x <= b.x + b.w && aim.y >= b.y && aim.y <= b.y + b.h) hover = b;
        }
        if (hover) {
          // Inspeção: contorno laranja, alças nos cantos e as medidas do bloco
          var b2 = hover, al = 0.4 + 0.6 * aim.power;
          ctx.fillStyle = rgba(ORANGE, 0.05 * al);
          ctx.fillRect(b2.x, b2.y, b2.w, b2.h);
          ctx.strokeStyle = rgba(ORANGE, 0.75 * al);
          ctx.strokeRect(b2.x + 0.5, b2.y + 0.5, b2.w - 1, b2.h - 1);
          ctx.fillStyle = rgba(ORANGE, al);
          [[b2.x, b2.y], [b2.x + b2.w, b2.y], [b2.x, b2.y + b2.h], [b2.x + b2.w, b2.y + b2.h]].forEach(function (q) { ctx.fillRect(q[0] - 2.5, q[1] - 2.5, 5, 5); });
          var txt = Math.round(b2.w) + ' × ' + Math.round(b2.h);
          ctx.font = '500 10px ' + MONO;
          var tw = ctx.measureText(txt).width + 10, ly = b2.y > 24 ? b2.y - 20 : b2.y + b2.h + 4;
          ctx.fillStyle = rgba(ORANGE, 0.9 * al);
          roundRect(b2.x, ly, tw, 16, 3); ctx.fill();
          ctx.fillStyle = '#0b0b0f'; ctx.textBaseline = 'middle';
          ctx.fillText(txt, b2.x + 5, ly + 8.5);
        }
        if (t > 8200 + blocks.length * 60 + 700) layout();
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Sistemas e automações · fluxo de dados entre módulos, com pacotes correndo pelas conexões ---------- */
    function flow() {
      var nodes = [], edges = [], packets = [], adj = [], sp = 124, emit = 0;
      var NAMES = ['api', 'crm', 'erp', 'banco', 'fila', 'nf-e', 'e-mail', 'painel', 'app', 'agenda', 'estoque', 'webhook'];
      function resize() {
        sp = W < 640 ? 92 : 124;
        nodes = []; edges = []; packets = []; adj = [];
        var cols = Math.floor(W / sp) + 1, rows = Math.floor(H / sp) + 1;
        var ox = (W - (cols - 1) * sp) / 2, oy = (H - (rows - 1) * sp) / 2;
        var grid = [];
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            if (Math.random() < 0.36) continue;
            var n = { x: ox + c * sp, y: oy + r * sp, glow: 0, i: nodes.length, name: Math.random() < 0.35 ? NAMES[(Math.random() * NAMES.length) | 0] : '' };
            nodes.push(n); adj.push([]); grid[r * cols + c] = n;
          }
        }
        function link(a, b, elbow) {
          var pts = elbow ? [a.x, a.y, b.x, a.y, b.x, b.y] : [a.x, a.y, b.x, b.y];
          var len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
          var e = { a: a, b: b, pts: pts, len: len };
          adj[a.i].push(edges.length); adj[b.i].push(edges.length); edges.push(e);
        }
        for (r = 0; r < rows; r++) {
          for (c = 0; c < cols; c++) {
            var a = grid[r * cols + c];
            if (!a) continue;
            for (var k = 1; k <= 2; k++) { var right = grid[r * cols + c + k]; if (c + k < cols && right) { link(a, right, false); break; } }
            for (k = 1; k <= 2; k++) { var down = grid[(r + k) * cols + c]; if (r + k < rows && down) { if (Math.random() < 0.75) link(a, down, false); break; } }
            var diag = grid[(r + 1) * cols + c + 1];
            if (c + 1 < cols && r + 1 < rows && diag && Math.random() < 0.25) link(a, diag, true);
          }
        }
        for (var i = 0; i < (W < 640 ? 8 : 16); i++) launch(null);
      }
      function launch(from) {
        if (!edges.length) return;
        var n = from || nodes[(Math.random() * nodes.length) | 0];
        if (!adj[n.i].length) return;
        var ei = adj[n.i][(Math.random() * adj[n.i].length) | 0];
        packets.push({ e: ei, fwd: edges[ei].a === n, d: 0, v: rnd(90, 140) });
      }
      function at(e, fwd, d) {
        // Posição ao longo do caminho (reto ou em L)
        var p = e.pts, dist = fwd ? d : e.len - d;
        for (var i = 0; i < p.length - 2; i += 2) {
          var seg = Math.abs(p[i + 2] - p[i]) + Math.abs(p[i + 3] - p[i + 1]);
          if (dist <= seg || i === p.length - 4) { var f = seg ? clamp(dist / seg, 0, 1) : 0; return [p[i] + (p[i + 2] - p[i]) * f, p[i + 1] + (p[i + 3] - p[i + 1]) * f]; }
          dist -= seg;
        }
        return [p[0], p[1]];
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000, i;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.08)';
        ctx.beginPath();
        for (i = 0; i < edges.length; i++) {
          var p = edges[i].pts;
          ctx.moveTo(p[0], p[1]);
          for (var j = 2; j < p.length; j += 2) ctx.lineTo(p[j], p[j + 1]);
        }
        ctx.stroke();
        // O mouse vira gatilho: o módulo mais perto dispara dados
        var trig = null;
        if (ptr.on) {
          var best = 150 * 150;
          for (i = 0; i < nodes.length; i++) { var dx = nodes[i].x - ptr.x, dy = nodes[i].y - ptr.y, d2 = dx * dx + dy * dy; if (d2 < best) { best = d2; trig = nodes[i]; } }
          if (trig) { trig.glow = 1; emit -= dt; if (emit <= 0 && packets.length < 44) { launch(trig); emit = 280; } }
        }
        for (i = packets.length - 1; i >= 0; i--) {
          var k = packets[i], e = edges[k.e];
          k.d += k.v * s;
          if (k.d >= e.len) {
            var to = k.fwd ? e.b : e.a;
            to.glow = 1;
            packets.splice(i, 1);
            if (Math.random() < 0.9 || packets.length < 10) {
              var opts = adj[to.i].filter(function (x) { return x !== k.e; });
              if (opts.length) { var ni = opts[(Math.random() * opts.length) | 0]; packets.push({ e: ni, fwd: edges[ni].a === to, d: 0, v: k.v }); }
              else launch(null);
            }
            continue;
          }
          var head = at(e, k.fwd, k.d), tail = at(e, k.fwd, Math.max(0, k.d - 18));
          ctx.strokeStyle = rgba(ORANGE, 0.5);
          ctx.beginPath(); ctx.moveTo(tail[0], tail[1]); ctx.lineTo(head[0], head[1]); ctx.stroke();
          ctx.fillStyle = rgba(ORANGE, 0.95);
          ctx.fillRect(head[0] - 1.5, head[1] - 1.5, 3, 3);
        }
        if (packets.length < (W < 640 ? 6 : 12)) launch(null);
        ctx.font = '500 9px ' + MONO;
        ctx.textBaseline = 'top';
        for (i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          n.glow *= Math.pow(0.2, s);
          ctx.fillStyle = '#0d0d11';
          roundRect(n.x - 11, n.y - 7, 22, 14, 3); ctx.fill();
          ctx.strokeStyle = n.glow > 0.05 ? rgba(ORANGE, 0.2 + 0.7 * n.glow) : 'rgba(233,233,238,.16)';
          ctx.stroke();
          ctx.fillStyle = n.glow > 0.05 ? rgba(ORANGE, 0.3 + 0.6 * n.glow) : 'rgba(233,233,238,.18)';
          ctx.fillRect(n.x - 5, n.y - 1, 10, 2);
          if (n.name) { ctx.fillStyle = 'rgba(233,233,238,' + (0.26 + 0.4 * n.glow) + ')'; ctx.fillText(n.name, n.x - 11, n.y + 11); }
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Logotipo e identidade visual · curvas vetoriais com pontos e alças, sobre a grade de construção ---------- */
    function pen() {
      var curves = [], cx = 0, cy = 0, unit = 1;
      function resize() {
        var n = W < 640 ? 4 : 6;
        curves = [0.3, 0.56, 0.8].map(function (fy, ci) {
          var pts = [];
          for (var i = 0; i < n; i++) {
            pts.push({ bx: -W * 0.06 + (W * 1.12 * i) / (n - 1), by: H * fy + rnd(-H * 0.12, H * 0.12), ph: Math.random() * TAU, ph2: Math.random() * TAU,
              ax: rnd(10, 30), ay: rnd(24, 60), ox: 0, oy: 0, x: 0, y: 0 });
          }
          return { pts: pts, hot: ci === 1 };
        });
        cx = W >= 1024 ? W * 0.74 : W * 0.6; cy = H * 0.48; unit = Math.min(W, H) / 900;
      }
      function draw(dt) {
        var t = time * 0.001, s = Math.min(dt, 40) / 1000, i, j;
        // Grade de construção: círculos em proporção áurea e diagonais, como no desenho de um logotipo
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.075)';
        ctx.beginPath();
        [55, 89, 144, 233, 377].forEach(function (r, k) {
          var rr = r * unit * 1.1, ox = Math.cos(t * 0.1 + k) * 4, oy = Math.sin(t * 0.1 + k) * 4;
          ctx.moveTo(cx + ox + rr, cy + oy); ctx.arc(cx + ox, cy + oy, rr, 0, TAU);
        });
        var L = 480 * unit;
        ctx.moveTo(cx - L, cy - L); ctx.lineTo(cx + L, cy + L); ctx.moveTo(cx - L, cy + L); ctx.lineTo(cx + L, cy - L);
        ctx.moveTo(cx - L * 1.3, cy); ctx.lineTo(cx + L * 1.3, cy); ctx.moveTo(cx, cy - L); ctx.lineTo(cx, cy + L);
        ctx.stroke();
        // Ponto mais perto do mouse é puxado, como quem ajusta a curva com a ferramenta caneta
        var grab = null, gd = (ptr.on ? 170 : 130) * (ptr.on ? 1 : 0.8);
        gd *= gd;
        for (i = 0; i < curves.length; i++) {
          for (j = 0; j < curves[i].pts.length; j++) {
            var q = curves[i].pts[j];
            var x0 = q.bx + Math.sin(t * 0.35 + q.ph) * q.ax, y0 = q.by + Math.sin(t * 0.27 + q.ph2) * q.ay;
            q.x0 = x0; q.y0 = y0;
            var dx = x0 - aim.x, dy = y0 - aim.y, d2 = dx * dx + dy * dy;
            if (d2 < gd) { gd = d2; grab = q; }
          }
        }
        var k = 1 - Math.pow(0.02, s);
        for (i = 0; i < curves.length; i++) {
          for (j = 0; j < curves[i].pts.length; j++) {
            q = curves[i].pts[j];
            var wx = q === grab ? (aim.x - q.x0) * 0.55 * aim.power : 0, wy = q === grab ? (aim.y - q.y0) * 0.55 * aim.power : 0;
            q.ox += (wx - q.ox) * k; q.oy += (wy - q.oy) * k;
            q.x = q.x0 + q.ox; q.y = q.y0 + q.oy;
          }
        }
        for (i = 0; i < curves.length; i++) {
          var cv = curves[i], P = cv.pts, hs = [];
          // Catmull-Rom convertida em Bézier: as alças saem das tangentes
          for (j = 0; j < P.length; j++) {
            var pr = P[Math.max(0, j - 1)], nx = P[Math.min(P.length - 1, j + 1)];
            var tx = (nx.x - pr.x) / 6, ty = (nx.y - pr.y) / 6;
            hs.push([P[j].x - tx, P[j].y - ty, P[j].x + tx, P[j].y + ty]);
          }
          ctx.lineWidth = cv.hot ? 1.4 : 1;
          ctx.strokeStyle = cv.hot ? rgba(ORANGE, 0.65) : 'rgba(233,233,238,.22)';
          ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);
          for (j = 1; j < P.length; j++) ctx.bezierCurveTo(hs[j - 1][2], hs[j - 1][3], hs[j][0], hs[j][1], P[j].x, P[j].y);
          ctx.stroke();
          ctx.lineWidth = 1;
          for (j = 0; j < P.length; j++) {
            var show = cv.hot || P[j] === grab;
            if (show) {
              ctx.strokeStyle = 'rgba(233,233,238,.32)';
              ctx.beginPath(); ctx.moveTo(hs[j][0], hs[j][1]); ctx.lineTo(hs[j][2], hs[j][3]); ctx.stroke();
              ctx.fillStyle = 'rgba(233,233,238,.6)';
              ctx.beginPath(); ctx.arc(hs[j][0], hs[j][1], 2.4, 0, TAU); ctx.arc(hs[j][2], hs[j][3], 2.4, 0, TAU); ctx.fill();
            }
            var z = P[j] === grab ? 7 : 5;
            ctx.fillStyle = '#0b0b0f';
            ctx.fillRect(P[j].x - z / 2, P[j].y - z / 2, z, z);
            ctx.strokeStyle = P[j] === grab ? rgba(ORANGE, 1) : cv.hot ? rgba(ORANGE, 0.8) : 'rgba(233,233,238,.35)';
            ctx.strokeRect(P[j].x - z / 2 + 0.5, P[j].y - z / 2 + 0.5, z - 1, z - 1);
          }
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Design gráfico · retícula de impressão que respira, com marcas de corte ---------- */
    function halftone() {
      var step = 16;
      function resize() { step = W < 640 ? 15 : 18; }
      function crop(x, y, sx, sy) {
        ctx.moveTo(x + sx * 6, y); ctx.lineTo(x + sx * 22, y);
        ctx.moveTo(x, y + sy * 6); ctx.lineTo(x, y + sy * 22);
      }
      function draw() {
        var t = time * 0.001;
        var b1x = W * (0.72 + 0.16 * Math.sin(t * 0.21)), b1y = H * (0.45 + 0.24 * Math.sin(t * 0.17 + 1));
        var b2x = W * (0.3 + 0.2 * Math.cos(t * 0.13)), b2y = H * (0.62 + 0.26 * Math.sin(t * 0.19 + 2));
        var R1 = Math.max(W, H) * 0.24, R2 = Math.max(W, H) * 0.18, Rp = coarse ? 110 : 150;
        var rowH = step * 0.866;
        var white = new Path2D(), hot = new Path2D();
        for (var r = 0, y = step / 2; y < H + step; r++, y += rowH) {
          for (var x = (r % 2) * step / 2; x < W + step; x += step) {
            var d1 = (x - b1x) * (x - b1x) + (y - b1y) * (y - b1y), d2 = (x - b2x) * (x - b2x) + (y - b2y) * (y - b2y);
            var v = 0.18 * (0.5 + 0.5 * Math.sin((x + y) * 0.006 - t * 0.6)) + Math.exp(-d1 / (R1 * R1)) * 0.8 + Math.exp(-d2 / (R2 * R2)) * 0.55;
            var dp = (x - aim.x) * (x - aim.x) + (y - aim.y) * (y - aim.y);
            var pv = Math.exp(-dp / (Rp * Rp)) * aim.power;
            var rad = step * 0.48 * Math.min(1, v * 0.85 + pv);
            if (rad < 0.45) continue;
            var path = pv > 0.22 ? hot : white;
            path.moveTo(x + rad, y); path.arc(x, y, rad, 0, TAU);
          }
        }
        ctx.fillStyle = 'rgba(233,233,238,.17)'; ctx.fill(white);
        ctx.fillStyle = rgba(ORANGE, 0.55); ctx.fill(hot);
        // Marcas de corte e de registro, como numa prova de gráfica
        var m = W < 640 ? 14 : 28;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.3)';
        ctx.beginPath();
        crop(m, m + 60, 1, 1); crop(W - m, m + 60, -1, 1); crop(m, H - m, 1, -1); crop(W - m, H - m, -1, -1);
        var rx = W - m - 10, ry = H / 2;
        ctx.moveTo(rx + 7, ry); ctx.arc(rx, ry, 7, 0, TAU);
        ctx.moveTo(rx - 11, ry); ctx.lineTo(rx + 11, ry); ctx.moveTo(rx, ry - 11); ctx.lineTo(rx, ry + 11);
        ctx.stroke();
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Engenharia de IA · camadas de um modelo com sinais atravessando da entrada à resposta ---------- */
    function layers() {
      var L = [], edges = [], pulses = [], spawn = 0, base = null;
      function resize() {
        var sizes = W < 640 ? [4, 6, 6, 3] : [5, 8, 9, 8, 4];
        var x0 = W < 640 ? W * 0.08 : W * 0.1, x1 = W < 640 ? W * 0.92 : W * 0.93;
        L = sizes.map(function (k, li) {
          var col = [], top = H * 0.14, bot = H * 0.88, gap = (bot - top) / (k - 1 || 1);
          var off = k === 1 ? (bot - top) / 2 : 0;
          for (var i = 0; i < k; i++) col.push({ x: x0 + (x1 - x0) * li / (sizes.length - 1), y: top + off + gap * i, act: 0, cool: 0, li: li, out: [] });
          return col;
        });
        edges = []; pulses = [];
        base = new Path2D();
        for (var li = 0; li < L.length - 1; li++) {
          L[li].forEach(function (a) {
            L[li + 1].forEach(function (b) {
              var e = { a: a, b: b, w: rnd(0.2, 1), heat: 0 };
              a.out.push(e); edges.push(e);
              base.moveTo(a.x, a.y); base.lineTo(b.x, b.y);
            });
          });
        }
      }
      function fire(n) {
        n.act = 1;
        if (!n.out.length || pulses.length > 70) return;
        var k = 1 + ((Math.random() * 2.4) | 0);
        for (var i = 0; i < k; i++) {
          var e = n.out[(Math.random() * n.out.length) | 0];
          pulses.push({ e: e, t: 0, v: rnd(0.9, 1.4) });
        }
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000, i;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.045)';
        ctx.stroke(base);
        spawn -= dt;
        if (spawn <= 0) { fire(L[0][(Math.random() * L[0].length) | 0]); spawn = rnd(380, 820); }
        if (ptr.on) {
          for (var li = 0; li < L.length; li++) {
            for (i = 0; i < L[li].length; i++) {
              var n = L[li][i], dx = n.x - ptr.x, dy = n.y - ptr.y;
              n.cool -= dt;
              if (dx * dx + dy * dy < 130 * 130 && n.cool <= 0) { fire(n); n.cool = 420; }
            }
          }
        }
        // Conexões por onde o sinal acabou de passar ficam acesas por um instante
        for (i = 0; i < edges.length; i++) {
          var e = edges[i];
          if (e.heat < 0.03) continue;
          e.heat *= Math.pow(0.18, s);
          ctx.strokeStyle = rgba(ORANGE, 0.28 * e.heat * (0.4 + e.w));
          ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
        }
        for (i = pulses.length - 1; i >= 0; i--) {
          var p = pulses[i];
          p.t += s * p.v;
          p.e.heat = Math.max(p.e.heat, 0.4 + 0.6 * p.t);
          if (p.t >= 1) { pulses.splice(i, 1); if (Math.random() < 0.78) fire(p.e.b); else p.e.b.act = Math.max(p.e.b.act, 0.6); continue; }
          var x = p.e.a.x + (p.e.b.x - p.e.a.x) * p.t, y = p.e.a.y + (p.e.b.y - p.e.a.y) * p.t;
          ctx.fillStyle = rgba(ORANGE, 0.95);
          ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill();
        }
        for (li = 0; li < L.length; li++) {
          var edgeL = li === 0 || li === L.length - 1;
          for (i = 0; i < L[li].length; i++) {
            n = L[li][i];
            n.act *= Math.pow(0.3, s);
            var r = edgeL ? 5 : 3.6;
            if (n.act > 0.05) {
              ctx.fillStyle = rgba(ORANGE, 0.14 * n.act);
              ctx.beginPath(); ctx.arc(n.x, n.y, r + 9 * n.act, 0, TAU); ctx.fill();
            }
            ctx.fillStyle = n.act > 0.05 ? rgba(ORANGE, 0.25 + 0.7 * n.act) : '#0d0d11';
            ctx.strokeStyle = n.act > 0.05 ? rgba(ORANGE, 0.9) : 'rgba(233,233,238,.24)';
            ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill(); ctx.stroke();
          }
        }
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Privacidade · malha hexagonal de proteção; onde o mouse passa, ela se fecha com um cadeado ---------- */
    function hexes() {
      var r = 24, cells = [], grid = null;
      function hexPath(p, x, y, rr) {
        for (var i = 0; i < 6; i++) {
          var a = Math.PI / 6 + (i * Math.PI) / 3;
          if (i === 0) p.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else p.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        p.closePath();
      }
      function resize() {
        r = W < 640 ? 18 : 24;
        var w = Math.sqrt(3) * r, hstep = 1.5 * r;
        cells = []; grid = new Path2D();
        for (var row = 0, y = 0; y < H + r; row++, y += hstep) {
          for (var x = (row % 2) * w / 2; x < W + w; x += w) { cells.push([x, y]); hexPath(grid, x, y, r - 1); }
        }
      }
      function lock(x, y, a) {
        ctx.strokeStyle = rgba(ORANGE, a); ctx.fillStyle = rgba(ORANGE, a);
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(x, y - 3, 3.6, Math.PI, 0); ctx.stroke();
        ctx.fillRect(x - 5, y - 3, 10, 8);
        ctx.lineWidth = 1;
      }
      function draw() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(233,233,238,.05)';
        ctx.stroke(grid);
        // Varredura diagonal lenta: a malha é verificada o tempo todo
        var u = ((time * 0.00006) % 1.5) - 0.25, D = W + H;
        var R = coarse ? 110 : 150, best = null, bd = Infinity;
        for (var i = 0; i < cells.length; i++) {
          var x = cells[i][0], y = cells[i][1];
          var band = 1 - Math.abs((x + y) / D - u) / 0.035;
          var dx = x - aim.x, dy = y - aim.y, d = Math.sqrt(dx * dx + dy * dy);
          var near = d < R ? (1 - d / R) * aim.power : 0;
          if (d < bd) { bd = d; best = cells[i]; }
          if (band <= 0 && near <= 0.02) continue;
          var p = new Path2D();
          hexPath(p, x, y, r - 1);
          if (near > 0.02) { ctx.fillStyle = rgba(ORANGE, 0.1 * near); ctx.fill(p); }
          ctx.strokeStyle = near > 0.02 ? rgba(ORANGE, 0.12 + 0.5 * near) : 'rgba(233,233,238,' + 0.14 * Math.max(0, band) + ')';
          ctx.stroke(p);
        }
        if (best && bd < R) lock(best[0], best[1], 0.85 * aim.power);
      }
      return { resize: resize, draw: draw };
    }

    var FX = {
      code: function () { return codeField(false); },
      combo: function () { return codeField(true); },
      grid: precisionGrid,
      focus: focus,
      team: team,
      pipeline: pipeline,
      swarm: swarm,
      wire: wire,
      flow: flow,
      pen: pen,
      halftone: halftone,
      layers: layers,
      hexes: hexes,
    };
    if (!FX[mode]) return;
    impl = FX[mode]();

    function resize() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!aim.x) { var w = wander(time); aim.x = w.x; aim.y = w.y; }
      impl.resize();
      if (!running) { if (reduce.matches) still(); else paint(16); }
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
    // Sem animação: avança alguns segundos em silêncio e mostra um quadro parado, já montado
    function still() {
      stop(); aim.power = 0.6;
      for (var i = 0; i < 70; i++) { time += 64; impl.draw(64); }
      paint(16);
    }

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
    if (!reduce.matches) start();
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
