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

    /* ---------- Hypercode · o enxame ao vivo: equipes de agentes, cada uma montando uma parte do sistema ---------- */
    // Cada equipe: área, parte do sistema que ela monta, tipo de peça, agentes, tarefas (uma palavra) e itens dessa parte
    var SWARM = [
      ['Arquitetura', 'plano de tarefas', 'graph', 'Atlas Titan Chronos Apex', 'planejando fatiando mapeando priorizando delegando', 'auth|api|banco|painel|filas|deploy|busca|app|e-mail|relatórios'],
      ['DevOps', 'pipeline de deploy', 'pipe', 'Quantum Zenith Orion Astra Hype Flux Vulcan Thorin Odin Kael', 'implantando configurando escalando publicando empacotando orquestrando', 'build|testes|imagem|deploy|escala|backup|dns|ssl|cdn|rollback'],
      ['Plataforma', 'núcleo do sistema', 'box', 'Cipher Bóris Sansão Buba Tito Zico Dru Caco Dino', 'compilando otimizando versionando refatorando integrando', 'filas|cache|eventos|jobs|config|logs|sessões|arquivos|agenda|plugins'],
      ['Backend', 'api de pedidos', 'api', 'Nexa Vector Byte Zyn Dax Krix Nova Pulsar Nebula', 'codificando roteando validando autenticando processando', 'GET /pedidos|POST /login|PUT /perfil|GET /itens|POST /pedidos|DELETE /sessao|GET /notas|PATCH /estoque|POST /upload|GET /clientes'],
      ['Banco de dados', 'modelo de dados', 'db', 'Photon Tex List Catatal Hermes Phoenix Castor Pollux', 'modelando indexando migrando consultando normalizando', 'usuarios|pedidos|produtos|estoque|clientes|notas|sessoes|pagamentos|enderecos|eventos'],
      ['Integrações', 'conexões externas', 'box', 'Alexia Kiko Guto Lora Tita Mel Lola Duda', 'conectando importando exportando notificando acoplando', 'webhook|e-mail|erp|whatsapp|planilhas|crm|correios|nota fiscal|agenda|sms'],
      ['Frontend', 'painel do cliente', 'ui', 'Pixel Vesper Raze Trix Prisma Eclipse Sol Lua Terra Iris', 'montando estilizando animando renderizando ajustando', 'cabeçalho|menu|cards|gráfico|tabela|formulário|busca|filtros|rodapé|modal'],
      ['UI/UX', 'protótipo de telas', 'ui', 'Milo Dante Pingo Tico Teco', 'desenhando prototipando refinando alinhando', 'grade|tipografia|cores|ícones|estados|fluxos|botões|espaços'],
      ['Mobile', 'versão mobile', 'ui', 'Lico Zeca Chico Nino Soneca', 'adaptando ajustando encaixando otimizando', 'login|início|carrinho|perfil|pedidos|alertas|busca|ajustes'],
      ['QA', 'testes automatizados', 'test', 'Vex Enzo Maya Lara Zuri Kai Cleo Hugo Téo', 'testando validando reproduzindo verificando aprovando', 'login.spec|carrinho.spec|checkout.spec|api.spec|perfil.spec|busca.spec|estoque.spec|e2e.spec|admin.spec|upload.spec'],
      ['Segurança', 'auditoria de segurança', 'sec', 'Liz Nora Breno Sofia Gaby Bidu Nico Joca', 'auditando blindando escaneando cifrando verificando', 'tokens|senhas|cabeçalhos|permissões|pacotes|entradas|sessões|cors|uploads|limites'],
      ['Monitoramento', 'métricas ao vivo', 'spark', 'Scooby Simba Teddy Bento Mito', 'monitorando medindo alertando registrando rastreando', 'latência|erros|cpu|memória|requisições|uptime|fila|disco'],
    ];

    function swarm() {
      var SANS = '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif', CODE = '"Geist Mono", ' + MONO;
      var INK = 'rgba(233,233,238,';
      var teams = SWARM.map(function (t) {
        return { area: t[0], part: t[1], kind: t[2], names: t[3].split(' '), jobs: t[4].split(' '), items: t[5].split('|'), next: (Math.random() * 9) | 0, on: false };
      });
      var queue = teams.slice().sort(function () { return Math.random() - 0.5; });
      var zones = [], avs = {}, widths = {}, bg = null, sm = false, hot = null, hotZone = null;
      var S, R, ROW, PH, HDR, CH, F_NAME, F_JOB, F_AREA, F_ITEM, F_HDR;

      function tw(font, s) {
        var k = font + '|' + s;
        if (!(k in widths)) { ctx.font = font; widths[k] = ctx.measureText(s).width; }
        return widths[k];
      }
      function pick(a) { return a[(Math.random() * a.length) | 0]; }
      function shuffle(a) { return a.slice().sort(function () { return Math.random() - 0.5; }); }
      function seeded(a) {
        return function () {
          a = (a + 0x6D2B79F5) | 0;
          var t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      /* Avatar: uma cabeça de chip com uma matriz de LEDs 5x5 espelhada, única para cada nome */
      function avatar(name) {
        var key = name + '|' + S;
        if (avs[key]) return avs[key];
        var h = 2166136261;
        for (var i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 16777619);
        var rand = seeded(h >>> 0), k = Math.min(dpr, 2);
        var c = document.createElement('canvas');
        c.width = c.height = Math.ceil(S * k);
        var g = c.getContext('2d');
        g.scale(k, k);
        var r = S * 0.3, o = 0.5, w = S - 1;
        g.beginPath();
        g.moveTo(o + r, o); g.arcTo(o + w, o, o + w, o + w, r); g.arcTo(o + w, o + w, o, o + w, r);
        g.arcTo(o, o + w, o, o, r); g.arcTo(o, o, o + w, o, r); g.closePath();
        var gr = g.createLinearGradient(0, 0, S, S);
        gr.addColorStop(0, '#26262e'); gr.addColorStop(1, '#0b0b0f');
        g.fillStyle = gr; g.fill();
        g.strokeStyle = 'rgba(233,233,238,.3)'; g.lineWidth = 1; g.stroke();
        // Metade da matriz sorteada pelo nome e espelhada; a coluna do meio e alguns pontos acendem em laranja
        var n = 5, pad = S * 0.21, cell = (S - pad * 2) / n, d = cell * 0.74, lit = [], cnt = 0;
        for (var y = 0; y < n; y++) {
          lit[y] = [];
          for (var x = 0; x < 3; x++) { lit[y][x] = rand() < 0.5; if (lit[y][x]) cnt++; }
        }
        while (cnt < 5) { var ry = (rand() * n) | 0, rx = (rand() * 3) | 0; if (!lit[ry][rx]) { lit[ry][rx] = true; cnt++; } }
        var live = null;
        for (y = 0; y < n; y++) {
          for (x = 0; x < n; x++) {
            var hx = x < 3 ? x : n - 1 - x, on = lit[y][hx];
            var px = pad + x * cell + (cell - d) / 2, py = pad + y * cell + (cell - d) / 2;
            if (!on) { g.fillStyle = 'rgba(233,233,238,.07)'; g.fillRect(px, py, d, d); continue; }
            var hotCell = hx === 2 || (y * 7 + hx * 3 + (h & 7)) % 5 === 0;
            g.fillStyle = hotCell ? 'rgba(255,85,0,.95)' : 'rgba(233,233,238,.86)';
            g.fillRect(px, py, d, d);
            if (hotCell && !live) live = { x: px, y: py };
          }
        }
        avs[key] = { img: c, lx: live ? live.x : S / 2 - d / 2, ly: live ? live.y : S / 2 - d / 2, d: d };
        return avs[key];
      }

      /* Espaços livres do topo: tudo que não é texto, botão ou a tela do Hypercode vira área de trabalho */
      function where(el) {
        var x = 0, y = 0, e = el;
        while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
        if (e !== host) {
          var r = el.getBoundingClientRect(), hb = host.getBoundingClientRect();
          return { l: r.left - hb.left, t: r.top - hb.top, r: r.right - hb.left, b: r.bottom - hb.top };
        }
        return { l: x, t: y, r: x + el.offsetWidth, b: y + el.offsetHeight };
      }
      function bestRect(grid, nc, nr, minW, minH) {
        var hts = new Int16Array(nc), best = null, bs = 0;
        for (var y = 0; y < nr; y++) {
          for (var x = 0; x < nc; x++) hts[x] = grid[y * nc + x] ? 0 : hts[x] + 1;
          var st = [];
          for (x = 0; x <= nc; x++) {
            var hh = x < nc ? hts[x] : 0, start = x;
            while (st.length && st[st.length - 1][1] > hh) {
              var tp = st.pop(), w = x - tp[0], h = tp[1];
              if (w >= minW && h >= minH) {
                var sc = Math.min(w, 120) * Math.min(h, 34) + w * h * 0.001;
                if (sc > bs) { bs = sc; best = { x: tp[0], y: y - h + 1, w: w, h: h }; }
              }
              start = tp[0];
            }
            st.push([start, hh]);
          }
        }
        return best;
      }
      function findZones() {
        var cs = 8, nc = Math.ceil(W / cs), nr = Math.ceil(H / cs), grid = new Uint8Array(nc * nr);
        var pad = sm ? 8 : 20, edge = sm ? 8 : 20;
        function block(l, t, r, b) {
          var c0 = clamp(Math.floor(l / cs), 0, nc), c1 = clamp(Math.ceil(r / cs), 0, nc);
          var r0 = clamp(Math.floor(t / cs), 0, nr), r1 = clamp(Math.ceil(b / cs), 0, nr);
          for (var y = r0; y < r1; y++) for (var x = c0; x < c1; x++) grid[y * nc + x] = 1;
        }
        var head = document.querySelector('.site-header'), top = head ? head.offsetHeight + 12 : 84;
        block(0, 0, W, top);
        block(0, H * 0.9, W, H);
        block(0, 0, edge, H); block(W - edge, 0, W, H);
        [].forEach.call(host.querySelectorAll('.crumbs, .label, .page-hero__title, .lead, .page-hero__actions > *, .page-hero__shot'), function (el) {
          if (!el.offsetWidth) return;
          var q = where(el);
          block(q.l - pad, q.t - pad, q.r + pad, q.b + pad);
        });
        var minW = Math.ceil(((sm ? 44 : 90) + R) / cs), minH = Math.ceil((ROW + 6) / cs), out = [];
        for (var k = 0; k < (sm ? 3 : 5); k++) {
          var b = bestRect(grid, nc, nr, minW, minH);
          if (!b) break;
          block(b.x * cs - 24, b.y * cs - 24, (b.x + b.w) * cs + 24, (b.y + b.h) * cs + 24);
          var zx = b.x * cs, zy = b.y * cs, zw = b.w * cs, zh = Math.min(b.h, 34) * cs;
          // Faixas muito largas viram duas ou três equipes lado a lado
          var parts = sm ? 1 : clamp(Math.floor(zw / 540), 1, 3), gap = 28, each = (zw - gap * (parts - 1)) / parts;
          for (var j = 0; j < parts; j++) out.push(zone(zx + j * (each + gap), zy, each, zh));
        }
        return out;
      }
      function zone(x, y, w, h) {
        var hdr = h >= HDR + ROW ? HDR : 0, rows = Math.max(1, Math.floor((h - hdr) / ROW));
        var rh = Math.min(ROW * 1.35, (h - hdr) / rows), cols = Math.max(1, Math.floor(w / ((sm ? 44 : 90) + R)));
        var sw = w / cols, z = { x: x, y: y, w: w, h: h, hdr: hdr, pw: Math.min(sm ? 90 : 170, sw - R), slots: [], pieces: [], agents: [], wait: [], team: null, st: 'build', t: 0 };
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) z.slots.push({ x: x + c * sw, y: y + hdr + r * rh + (rh + ROW) / 2 - S / 2 - 3 });
        }
        return z;
      }

      /* Peças: cada uma é desenhada da esquerda para a direita, com o agente puxando a ponta */
      function piece(z, t, txt, sl, after, n) {
        var row = t.kind === 'api' || t.kind === 'test' || t.kind === 'sec', ic = sm ? 10 : 12;
        var pc = { kind: t.kind, txt: txt, row: row, x: sl.x, y: sl.y - PH / 2, h: PH, g: 0, go: false, dur: rnd(3, 5.2), by: null, done: false, flash: 0, ha: 1, hide: false, after: after, sl: sl, n: n };
        if (row) {
          while (ic + tw(F_ITEM, pc.txt) > z.pw && pc.txt.length > 4) pc.txt = pc.txt.slice(0, -1);
          pc.w = ic + tw(F_ITEM, pc.txt);
        } else pc.w = z.pw * rnd(0.8, 1);
        if (t.kind === 'spark') { pc.pts = []; for (var i = 0; i < 10; i++) pc.pts.push(rnd(0.15, 0.85)); }
        if (t.kind === 'ui') pc.bars = [rnd(0.5, 1), rnd(0.3, 0.8)];
        return pc;
      }
      function tip(pc) {
        var e = Math.min(1, pc.g);
        return { x: pc.x + pc.w * e, y: pc.y + pc.h / 2 };
      }

      /* Agentes: entram, pegam uma peça livre, puxam a ponta até o fim e passam para a próxima */
      function agent(t, name, x, y, delay) {
        return { name: name, t: t, job: pick(t.jobs), x: x, y: y, vx: 0, vy: 0, p: null, a: 0, st: 'in', delay: delay || 0, av: avatar(name), ph: Math.random() * TAU };
      }
      function claim(z, ag) {
        var best = null, bd = -1, seen = 0;
        for (var i = 0; i < z.pieces.length && seen < 3; i++) {
          var pc = z.pieces[i];
          if (pc.by || pc.done || (pc.after && !pc.after.done)) continue;
          seen++;
          var d = 1e9;
          for (var j = 0; j < z.agents.length; j++) {
            var o = z.agents[j];
            if (o === ag || o.st === 'out') continue;
            var q = o.p ? tip(o.p) : o;
            d = Math.min(d, Math.hypot(q.x - pc.x, q.y - pc.y));
          }
          if (d > bd) { bd = d; best = pc; }
        }
        if (best) {
          best.by = ag; ag.p = best; ag.job = pick(ag.t.jobs);
          if (best.after) best.after.hide = true;
        } else ag.job = z.st === 'build' ? 'revisando' : 'concluído';
        return best;
      }
      function load(z) {
        var t = null;
        for (var i = 0; i < queue.length; i++) if (!queue[i].on) { t = queue.splice(i, 1)[0]; queue.push(t); break; }
        if (z.team) z.team.on = false;
        if (!t) return;
        t.on = true; z.team = t; z.st = 'build'; z.t = 0;
        var items = shuffle(t.items), ns = z.slots.length;
        var n = Math.min(items.length, Math.max(ns * 2, 4));
        z.pieces = [];
        for (i = 0; i < n; i++) z.pieces.push(piece(z, t, items[i], z.slots[i % ns], i >= ns ? z.pieces[i - ns] : null, i));
        // Na tela ficam os que cabem; o resto da equipe entra no revezamento
        var vis = Math.min(t.names.length, ns, sm ? 3 : 7);
        z.agents = []; z.wait = [];
        for (i = 0; i < t.names.length; i++) {
          var name = t.names[(t.next + i) % t.names.length];
          if (i >= vis) { z.wait.push(name); continue; }
          var ag = agent(t, name, 0, 0, i * 240);
          z.agents.push(ag);
          if (claim(z, ag)) { var q = tip(ag.p); ag.x = q.x + S / 2 + 4; ag.y = q.y; }
          else { ag.x = z.slots[i % ns].x + S; ag.y = z.slots[i % ns].y; }
        }
        t.next = (t.next + vis) % t.names.length;
      }

      function resize() {
        sm = W < 640;
        S = sm ? 20 : 30; CH = sm ? 26 : 30; ROW = sm ? 38 : 48; PH = sm ? 16 : 20; HDR = sm ? 18 : 22;
        F_NAME = '600 ' + (sm ? 10 : 11) + 'px ' + SANS;
        F_JOB = '400 ' + (sm ? 8.5 : 9.5) + 'px ' + CODE;
        F_AREA = '500 ' + (sm ? 7.5 : 8) + 'px ' + CODE;
        F_ITEM = '400 ' + (sm ? 8 : 9) + 'px ' + CODE;
        F_HDR = '500 ' + (sm ? 8.5 : 9) + 'px ' + CODE;
        // Reserva à direita de cada peça: a cabeça e o cartão mais largo possível
        var card = 0;
        teams.forEach(function (t) {
          t.names.forEach(function (nm) { card = Math.max(card, tw(F_NAME, nm)); });
          t.jobs.concat(['revisando', 'concluído']).forEach(function (j) { card = Math.max(card, tw(F_JOB, j) + 7); });
        });
        R = S + 10 + card + 16 + 6;
        var step = sm ? 26 : 32;
        bg = document.createElement('canvas');
        bg.width = Math.round(W * dpr); bg.height = Math.round(H * dpr);
        var b = bg.getContext('2d');
        b.scale(dpr, dpr);
        b.fillStyle = 'rgba(255,255,255,.07)';
        for (var y = step; y < H; y += step) for (var x = step; x < W; x += step) b.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        teams.forEach(function (t) { t.on = false; });
        zones = findZones();
        // Cada equipe começa num ponto diferente do trabalho, para as partes não ficarem prontas ao mesmo tempo
        zones.forEach(function (z, i) { load(z); for (var k = 0; k < i * 80; k++) update(z, 0.04); });
      }

      function update(z, s) {
        z.t += s;
        for (var i = z.agents.length - 1; i >= 0; i--) {
          var ag = z.agents[i];
          if (ag.delay > 0) { ag.delay -= s * 1000; continue; }
          if (ag.st === 'out') { ag.a -= s * 2.6; if (ag.a <= 0) z.agents.splice(i, 1); continue; }
          ag.a = Math.min(1, ag.a + s * 2.4);
          if (!ag.p && z.st === 'build' && ag.job === 'revisando' && Math.random() < s * 2) claim(z, ag);
          var tx = ag.x, ty = ag.y;
          if (ag.p) { var q = tip(ag.p); tx = q.x + S / 2 + 4; ty = q.y; }
          if (ag.p && ag.p.go) {
            // Trabalhando: acompanha a ponta da peça de perto
            var f = 1 - Math.pow(0.0004, s);
            ag.x += (tx - ag.x) * f; ag.y += (ty - ag.y) * f; ag.vx = ag.vy = 0;
            ag.p.g += s / ag.p.dur;
            if (ag.p.g >= 1) {
              var pc = ag.p;
              pc.g = 1; pc.done = true; pc.flash = 1; pc.by = null; ag.p = null;
              // Revezamento: às vezes quem terminou passa a vez para outro da equipe
              if (z.wait.length && Math.random() < 0.45) {
                ag.st = 'out'; z.wait.push(ag.name);
                var nx = agent(z.team, z.wait.shift(), ag.x, ag.y, 260);
                z.agents.push(nx); claim(z, nx);
              } else claim(z, ag);
            }
          } else {
            // A caminho: mola suave até o começo da próxima peça
            var kx = 150 * (tx - ag.x) - 22 * ag.vx, ky = 150 * (ty - ag.y) - 22 * ag.vy;
            ag.vx += kx * s; ag.vy += ky * s;
            var sp = Math.hypot(ag.vx, ag.vy);
            if (sp > 420) { ag.vx *= 420 / sp; ag.vy *= 420 / sp; }
            ag.x += ag.vx * s; ag.y += ag.vy * s;
            if (ag.p && Math.abs(tx - ag.x) < 5 && Math.abs(ty - ag.y) < 5) ag.p.go = true;
          }
        }
        for (i = 0; i < z.pieces.length; i++) {
          var p = z.pieces[i];
          p.flash = Math.max(0, p.flash - s * 1.2);
          if (p.hide) p.ha = Math.max(0, p.ha - s * 2.5);
        }
        if (z.st === 'build' && z.pieces.length && z.pieces.every(function (p) { return p.done; })) {
          z.st = 'done'; z.t = 0;
          z.agents.forEach(function (a) { if (a.st !== 'out') { a.job = 'concluído'; a.p = null; } });
        } else if (z.st === 'done' && z.t > 1.9) {
          z.st = 'fade'; z.t = 0;
          z.agents.forEach(function (a) { a.st = 'out'; });
        } else if (z.st === 'fade' && z.t > 0.9) load(z);
      }

      function frame(z, za) {
        var l = sm ? 7 : 9, a = z === hotZone ? 0.5 : 0.2;
        ctx.strokeStyle = z === hotZone ? rgba(ORANGE, 0.55) : INK + a + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        [[z.x, z.y, 1, 1], [z.x + z.w, z.y, -1, 1], [z.x, z.y + z.h, 1, -1], [z.x + z.w, z.y + z.h, -1, -1]].forEach(function (c) {
          ctx.moveTo(c[0] + c[2] * l, c[1] + 0.5 * c[3]); ctx.lineTo(c[0] + 0.5 * c[2], c[1] + 0.5 * c[3]); ctx.lineTo(c[0] + 0.5 * c[2], c[1] + c[3] * l);
        });
        ctx.stroke();
        if (!z.hdr || !z.team) return;
        var done = 0;
        z.pieces.forEach(function (p) { done += Math.min(1, p.g); });
        var prog = z.pieces.length ? done / z.pieces.length : 0, hy = z.y + (sm ? 8 : 10), x0 = z.x + l + 5;
        ctx.font = F_HDR; ctx.textBaseline = 'middle';
        ctx.fillStyle = rgba(ORANGE, (0.55 + 0.45 * Math.sin(time * 0.006)) * za);
        ctx.beginPath(); ctx.arc(x0 + 2.5, hy, 2.5, 0, TAU); ctx.fill();
        ctx.fillStyle = INK + 0.62 * za + ')';
        ctx.fillText(z.team.part, x0 + 10, hy);
        var right = z.st === 'build' ? Math.round(prog * 100) + '%' : 'pronto';
        if (z.w > 300 || sm) right = z.team.names.length + ' agentes · ' + right;
        if (z.w < 220) right = z.st === 'build' ? Math.round(prog * 100) + '%' : 'pronto';
        ctx.fillStyle = z.st === 'build' ? INK + 0.4 * za + ')' : rgba(ORANGE, 0.9 * za);
        ctx.fillText(right, z.x + z.w - l - 5 - tw(F_HDR, right), hy);
        // Barra de progresso da parte
        var by = hy + (sm ? 7 : 9);
        ctx.fillStyle = INK + 0.06 * za + ')';
        ctx.fillRect(x0, by, z.w - 2 * (l + 5), 1);
        ctx.fillStyle = rgba(ORANGE, 0.6 * za);
        ctx.fillRect(x0, by, (z.w - 2 * (l + 5)) * prog, 1);
      }

      function drawPiece(pc, za) {
        var al = za * pc.ha;
        if (al <= 0.01 || pc.g <= 0) return;
        var e = Math.min(1, pc.g), x = pc.x, y = pc.y, w = pc.w, h = pc.h, cy = y + h / 2, fl = pc.flash;
        ctx.font = F_ITEM; ctx.textBaseline = 'middle';
        if (pc.row) {
          var ic = sm ? 10 : 12, n = Math.ceil(pc.txt.length * e), tx = x + ic;
          if (pc.kind === 'api') {
            var sp = pc.txt.indexOf(' ');
            ctx.fillStyle = rgba(ORANGE, 0.85 * al);
            ctx.fillText(pc.txt.slice(0, Math.min(n, sp)), tx, cy);
            if (n > sp) { ctx.fillStyle = INK + 0.55 * al + ')'; ctx.fillText(pc.txt.slice(sp, n), tx + tw(F_ITEM, pc.txt.slice(0, sp)), cy); }
          } else {
            ctx.fillStyle = INK + 0.55 * al + ')';
            ctx.fillText(pc.txt.slice(0, n), tx, cy);
          }
          // Ícone do estado: ponto, teste rodando ou cadeado; laranja quando termina
          var ix = x + 3.5;
          ctx.strokeStyle = ctx.fillStyle = pc.done ? rgba(ORANGE, (0.7 + 0.3 * fl) * al) : INK + 0.35 * al + ')';
          ctx.lineWidth = 1.2;
          if (pc.kind === 'api') { ctx.beginPath(); ctx.arc(ix, cy, 2.2, 0, TAU); ctx.fill(); }
          else if (pc.kind === 'test') {
            ctx.beginPath();
            if (pc.done) { ctx.moveTo(ix - 3, cy); ctx.lineTo(ix - 1, cy + 2.2); ctx.lineTo(ix + 3, cy - 2.4); }
            else { var r0 = time * 0.008; ctx.arc(ix, cy, 3, r0, r0 + 4); }
            ctx.stroke();
          } else {
            ctx.beginPath(); ctx.arc(ix, cy - 1.6, 2, Math.PI, 0); ctx.stroke();
            ctx.fillRect(ix - 3, cy - 1.2, 6, 4.4);
          }
          ctx.lineWidth = 1;
          if (pc.done && pc.kind !== 'api') {
            ctx.fillStyle = rgba(ORANGE, 0.75 * al);
            ctx.fillText('ok', x + w + 6, cy);
          }
          return;
        }
        var sx = x + w * e;
        ctx.setLineDash(pc.done ? [] : [3, 3]);
        ctx.strokeStyle = pc.done ? (fl > 0 ? rgba(ORANGE, (0.25 + 0.55 * fl) * al) : INK + 0.24 * al + ')') : INK + 0.34 * al + ')';
        ctx.beginPath();
        ctx.moveTo(sx, y + 0.5); ctx.lineTo(x + 0.5, y + 0.5); ctx.lineTo(x + 0.5, y + h - 0.5); ctx.lineTo(sx, y + h - 0.5);
        if (pc.done) ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
        if (pc.done && fl > 0) { ctx.fillStyle = rgba(ORANGE, 0.08 * fl * al); ctx.fillRect(x, y, w, h); }
        if (!pc.done) { ctx.fillStyle = rgba(ORANGE, 0.7 * al); ctx.fillRect(sx - 1, y - 1, 2, h + 2); }
        // O que já foi varrido aparece: rótulo e o detalhe de cada tipo de peça
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y - 1, w * e, h + 2); ctx.clip();
        var lx = x + 7, lab = pc.txt;
        if (pc.kind === 'graph') {
          ctx.fillStyle = rgba(ORANGE, 0.8 * al);
          var id = 'T' + ('0' + (pc.n + 1)).slice(-2);
          ctx.fillText(id, lx, cy); lx += tw(F_ITEM, id) + 5;
        } else if (pc.kind === 'db') {
          ctx.fillStyle = INK + 0.4 * al + ')';
          ctx.fillRect(lx, cy - 3.5, 7, 1.5); ctx.fillRect(lx, cy - 0.75, 7, 1.5); ctx.fillRect(lx, cy + 2, 7, 1.5);
          lx += 11;
        }
        ctx.fillStyle = INK + 0.6 * al + ')';
        ctx.fillText(lab, lx, cy);
        var dx = lx + tw(F_ITEM, lab) + 8, dw = x + w - 6 - dx;
        if (dw > 6) {
          if (pc.kind === 'ui') {
            ctx.fillStyle = INK + 0.14 * al + ')';
            ctx.fillRect(dx, cy - 3.5, dw * pc.bars[0], 2.5); ctx.fillRect(dx, cy + 1.5, dw * pc.bars[1], 2.5);
          } else if (pc.kind === 'spark') {
            ctx.strokeStyle = rgba(ORANGE, 0.65 * al);
            ctx.beginPath();
            for (var i = 0; i < pc.pts.length; i++) {
              var px = dx + dw * i / (pc.pts.length - 1), py = y + 3 + (h - 6) * pc.pts[i];
              if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
            }
            ctx.stroke();
          } else if (pc.kind === 'pipe') {
            ctx.fillStyle = INK + 0.08 * al + ')'; ctx.fillRect(dx, cy - 1.5, dw, 3);
            ctx.fillStyle = rgba(ORANGE, 0.55 * al); ctx.fillRect(dx, cy - 1.5, dw * e, 3);
          } else if (pc.kind === 'db') {
            ctx.strokeStyle = INK + 0.2 * al + ')';
            for (var k = 0; k < 3 && k * 12 + 8 < dw; k++) ctx.strokeRect(dx + k * 12 + 0.5, cy - 3.5, 8, 7);
          } else {
            ctx.fillStyle = INK + 0.3 * al + ')';
            for (k = 0; k < 3 && k * 6 < dw; k++) ctx.fillRect(dx + k * 6, cy - 1, 2, 2);
          }
        }
        ctx.restore();
      }

      function links(z, za) {
        var kd = z.team && z.team.kind;
        if (kd !== 'pipe' && kd !== 'graph' && kd !== 'db') return;
        ctx.strokeStyle = INK + 0.16 * za + ')';
        ctx.beginPath();
        for (var i = 1; i < z.pieces.length; i++) {
          var a = z.pieces[i - 1], b = z.pieces[i];
          if (!a.done || !b.done || a.hide || b.hide || a.sl === b.sl) continue;
          var x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
          if (Math.abs(y1 - y2) < 2 && x2 > x1) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); continue; }
          var my = (y1 + y2) / 2;
          ctx.moveTo(x1, y1); ctx.lineTo(x1 + 6, y1); ctx.lineTo(x1 + 6, my); ctx.lineTo(x2 - 6, my); ctx.lineTo(x2 - 6, y2); ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      }

      function drawAgent(ag) {
        var al = ag.a;
        if (al <= 0.01 || ag.delay > 0) return;
        var x = ag.x, y = ag.y, h2 = S / 2, work = ag.p && ag.p.go, isHot = ag === hot;
        ctx.globalAlpha = al;
        // Área da equipe em cima da cabeça
        ctx.font = F_AREA; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = isHot ? rgba(ORANGE, 0.9) : INK + '.5)';
        ctx.fillText(ag.t.area.toUpperCase(), x - h2, y - h2 - 4);
        // Anel girando enquanto trabalha
        if (work || isHot) {
          var r0 = time * 0.005 + ag.ph;
          ctx.strokeStyle = rgba(ORANGE, isHot ? 0.95 : 0.7);
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(x, y, h2 + 3.5, r0, r0 + (isHot ? TAU : 1.5)); ctx.stroke();
          ctx.lineWidth = 1;
        }
        ctx.drawImage(ag.av.img, x - h2, y - h2, S, S);
        if (work) {
          ctx.fillStyle = rgba(ORANGE, 0.35 + 0.65 * Math.abs(Math.sin(time * 0.007 + ag.ph)));
          ctx.fillRect(x - h2 + ag.av.lx - 0.6, y - h2 + ag.av.ly - 0.6, ag.av.d + 1.2, ag.av.d + 1.2);
        }
        // Ponto de estado no canto da cabeça
        ctx.fillStyle = '#0b0b0f';
        ctx.beginPath(); ctx.arc(x + h2 - 1, y + h2 - 1, 3.8, 0, TAU); ctx.fill();
        ctx.fillStyle = work ? rgba(ORANGE, 1) : INK + '.55)';
        ctx.beginPath(); ctx.arc(x + h2 - 1, y + h2 - 1, 2.3, 0, TAU); ctx.fill();
        // Cartão ao lado: nome e a tarefa do momento
        var cx = x + h2 + 6, jw = tw(F_JOB, ag.job), cw = Math.max(tw(F_NAME, ag.name), jw + (work ? 7 : 0)) + 16;
        roundRect(cx, y - CH / 2, cw, CH, 5);
        ctx.fillStyle = 'rgba(13,13,17,.9)'; ctx.fill();
        ctx.strokeStyle = isHot ? rgba(ORANGE, 0.85) : INK + '.14)'; ctx.stroke();
        ctx.textBaseline = 'middle';
        ctx.font = F_NAME; ctx.fillStyle = 'rgba(242,242,245,.96)';
        ctx.fillText(ag.name, cx + 8, y - CH * 0.2);
        ctx.font = F_JOB; ctx.fillStyle = ag.job === 'concluído' ? INK + '.6)' : rgba(ORANGE, 0.95);
        ctx.fillText(ag.job, cx + 8, y + CH * 0.22);
        if (work && time % 1000 < 560) ctx.fillText('_', cx + 9 + jw, y + CH * 0.22);
        ctx.globalAlpha = 1;
      }

      function draw(dt) {
        var s = Math.min(dt, 40) / 1000;
        ctx.drawImage(bg, 0, 0, W, H);
        // Mouse por perto: o agente mais próximo e a área dele se destacam
        hot = null; hotZone = null;
        if (ptr.on) {
          var bd = sm ? 50 : 70;
          zones.forEach(function (z) {
            if (ptr.x > z.x && ptr.x < z.x + z.w && ptr.y > z.y && ptr.y < z.y + z.h) hotZone = z;
            z.agents.forEach(function (ag) {
              var d = Math.hypot(ag.x - ptr.x, ag.y - ptr.y);
              if (d < bd && ag.st !== 'out') { bd = d; hot = ag; hotZone = z; }
            });
          });
        }
        for (var i = 0; i < zones.length; i++) {
          var z = zones[i];
          update(z, s);
          var za = z.st === 'fade' ? Math.max(0, 1 - z.t / 0.9) : z.st === 'build' ? Math.min(1, z.t / 0.5) : 1;
          frame(z, za);
          links(z, za);
          z.pieces.forEach(function (p) { drawPiece(p, za); });
        }
        for (i = 0; i < zones.length; i++) zones[i].agents.forEach(drawAgent);
      }
      return { resize: resize, draw: draw };
    }

    /* ---------- Equipe · pessoas ligadas em rede, passando o trabalho de mão em mão ---------- */
    function crew() {
      var people = [], batons = [], rings = [], top = 90;
      function near(p, k) {
        return people.filter(function (q) { return q !== p; })
          .sort(function (a, b) { return Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y); })
          .slice(0, k);
      }
      function resize() {
        var cols = W < 640 ? 3 : W < 1024 ? 5 : 7, rows = W < 640 ? 4 : 3;
        top = Math.max(90, H * 0.14);
        var cw = W / cols, rh = (H - top - 30) / rows;
        people = [];
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var x = cw * (c + 0.5 + (r % 2 ? 0.25 : -0.25)) + rnd(-cw, cw) * 0.18;
            people.push({ x: clamp(x, 24, W - 24), y: top + rh * (r + 0.5) + rnd(-rh, rh) * 0.2, ph: Math.random() * TAU, lit: 0, talk: 0 });
          }
        }
        // Ninguém fica em cima da órbita da equipe ao lado do texto
        var hb = host.getBoundingClientRect(), sh = host.querySelector('.team-orbit'), r0 = sh && sh.getBoundingClientRect();
        if (r0 && r0.width) {
          var cx = r0.left - hb.left + r0.width / 2, cy = r0.top - hb.top + r0.height / 2, rr = Math.min(r0.width, r0.height) / 2 + 20;
          people = people.filter(function (p) { return Math.hypot(p.x - cx, p.y - cy) > rr; });
        }
        people.forEach(function (p) { p.nb = near(p, 3); p.bx = p.x; p.by = p.y; });
        batons = [];
        var n = W < 640 ? 2 : 3;
        for (var i = 0; i < n; i++) pass(people[(Math.random() * people.length) | 0], null, rnd(0, 900));
      }
      function pass(from, prev, delay) {
        var opts = from.nb.filter(function (q) { return q !== prev; });
        var to = opts[(Math.random() * opts.length) | 0] || from.nb[0];
        var mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2, dx = to.x - from.x, dy = to.y - from.y;
        var bend = rnd(0.18, 0.32) * (Math.random() < 0.5 ? -1 : 1);
        batons.push({ a: from, b: to, cx: mx - dy * bend, cy: my + dx * bend, t: -(delay || 0) / 1000, dur: rnd(1.1, 1.6) });
      }
      function person(p, glow) {
        var a = 0.3 + 0.6 * glow;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = glow > 0.05 ? rgba(ORANGE, a) : 'rgba(233,233,238,.3)';
        ctx.beginPath(); ctx.arc(p.x, p.y - 8, 6.5, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y + 14, 13, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
      }
      function bubble(p, k) {
        // Balão de "digitando" sobre quem acabou de receber o trabalho
        var x = p.x + 10, y = p.y - 32;
        ctx.fillStyle = 'rgba(233,233,238,' + 0.1 * k + ')';
        roundRect(x, y, 26, 13, 6.5); ctx.fill();
        for (var i = 0; i < 3; i++) {
          var up = Math.max(0, Math.sin(time * 0.009 - i * 0.9));
          ctx.fillStyle = rgba(ORANGE, (0.35 + 0.45 * up) * k);
          ctx.beginPath(); ctx.arc(x + 7 + i * 6, y + 6.5 - up * 1.6, 1.4, 0, TAU); ctx.fill();
        }
      }
      function draw(dt) {
        var s = Math.min(dt, 40) / 1000;
        // Cada pessoa respira no lugar
        for (var i = 0; i < people.length; i++) {
          var p = people[i];
          p.x = p.bx + Math.sin(time * 0.0004 + p.ph) * 4;
          p.y = p.by + Math.cos(time * 0.0005 + p.ph * 1.3) * 3;
          p.lit = Math.max(0, p.lit - s * 0.7);
          p.talk = Math.max(0, p.talk - s);
        }
        // Rede fina entre vizinhos
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = 'rgba(233,233,238,.1)';
        ctx.beginPath();
        people.forEach(function (p) { p.nb.forEach(function (q) { if (q.x > p.x || (q.x === p.x && q.y > p.y)) { ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); } }); });
        ctx.stroke();
        ctx.setLineDash([]);
        // Com o mouse por perto, quem está perto se conecta a você
        if (ptr.on) {
          for (i = 0; i < people.length; i++) {
            p = people[i];
            var d = Math.hypot(p.x - ptr.x, p.y - ptr.y);
            if (d > 200) continue;
            var k = 1 - d / 200;
            p.lit = Math.max(p.lit, k);
            ctx.strokeStyle = rgba(ORANGE, 0.28 * k);
            ctx.beginPath(); ctx.moveTo(ptr.x, ptr.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          }
        }
        // O trabalho passa de mão em mão por um arco
        for (i = batons.length - 1; i >= 0; i--) {
          var b = batons[i];
          b.t += s / b.dur;
          if (b.t < 0) continue;
          if (b.t >= 1) {
            b.b.lit = 1; b.b.talk = 1.3;
            rings.push({ x: b.b.x, y: b.b.y, t: 0 });
            batons.splice(i, 1);
            pass(b.b, b.a, rnd(700, 1400));
            continue;
          }
          var e = ease(b.t), u = 1 - e;
          ctx.strokeStyle = rgba(ORANGE, 0.3);
          ctx.beginPath(); ctx.moveTo(b.a.x, b.a.y);
          for (var j = 1; j <= 16; j++) {
            var tt = e * j / 16, uu = 1 - tt;
            ctx.lineTo(uu * uu * b.a.x + 2 * uu * tt * b.cx + tt * tt * b.b.x, uu * uu * b.a.y + 2 * uu * tt * b.cy + tt * tt * b.b.y);
          }
          ctx.stroke();
          var bx = u * u * b.a.x + 2 * u * e * b.cx + e * e * b.b.x, by = u * u * b.a.y + 2 * u * e * b.cy + e * e * b.b.y;
          ctx.fillStyle = rgba(ORANGE, 0.9);
          ctx.fillRect(bx - 3, by - 3, 6, 6);
          ctx.fillStyle = rgba(ORANGE, 0.18);
          ctx.fillRect(bx - 6, by - 6, 12, 12);
        }
        // Anel de quem recebeu
        for (i = rings.length - 1; i >= 0; i--) {
          var r = rings[i];
          r.t += s;
          if (r.t > 1) { rings.splice(i, 1); continue; }
          ctx.strokeStyle = rgba(ORANGE, 0.4 * (1 - r.t));
          ctx.beginPath(); ctx.arc(r.x, r.y + 2, 14 + 22 * ease(r.t), 0, TAU); ctx.stroke();
        }
        for (i = 0; i < people.length; i++) {
          person(people[i], people[i].lit);
          if (people[i].talk > 0) bubble(people[i], Math.min(1, people[i].talk * 2));
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
      agents: swarm,
      crew: crew,
      pipeline: pipeline,
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
