/* Tirvo · logo animada (mira de foco, nome decodificado com o cursor do terminal e a frase). Gerado; não editar à mão. */
(function () {
  'use strict';
  var DEC = {"0":"M123.6 -106.4 396.4 -608.8 476.4 -603.6 203.6 -101.2ZM300 16Q222 16 165.2 -28.9Q108.4 -73.8 78.2 -156.8Q48 -239.8 48 -354Q48 -469 78.2 -552.1Q108.4 -635.2 165.2 -680.6Q222 -726 300 -726Q378.8 -726 435.2 -680.6Q491.6 -635.2 521.8 -552.1Q552 -469 552 -354Q552 -239.8 521.8 -156.8Q491.6 -73.8 435.2 -28.9Q378.8 16 300 16ZM300 -82Q345 -82 376.7 -114.3Q408.4 -146.6 425.8 -207.8Q443.2 -269 443.2 -354Q443.2 -440.8 425.8 -502Q408.4 -563.2 376.7 -595.6Q345 -628 300 -628Q256 -628 223.8 -595.6Q191.6 -563.2 174.2 -502Q156.8 -440.8 156.8 -354Q156.8 -269 174.2 -207.8Q191.6 -146.6 223.8 -114.3Q256 -82 300 -82Z","1":"M273.2 0V-506H91.2V-594.8H181.2Q220.1 -594.8 244.1 -606.2Q268.2 -617.6 279.1 -642.8Q290 -668 290 -710H378V0ZM56 0V-98.8H544V0Z","<":"M528.8 -28.4 71.2 -229.4V-350.2L528.8 -551.2V-452.4L133.4 -278.4V-301.4L528.8 -127.4Z",">":"M71.2 -28.4V-127.4L466.6 -301.4V-278.4L71.2 -452.4V-551.2L528.8 -350.2V-229.4Z","/":"M100.8 110 403.2 -750H499.2L196.8 110Z","{":"M402.8 122.4Q312.2 122.4 272.3 72.8Q232.4 23.2 232.4 -55.2V-155Q232.4 -197.4 222.4 -222Q212.4 -246.6 185.6 -257Q158.8 -267.4 108 -267.4V-363Q158.8 -363 185.6 -373.3Q212.4 -383.6 222.4 -408.3Q232.4 -433 232.4 -475.4V-575.2Q232.4 -653.6 272.3 -703.2Q312.2 -752.8 402.8 -752.8H492V-660.4H411.6Q367 -660.4 348.7 -637.6Q330.4 -614.8 330.4 -570.8V-484.2Q330.4 -410.8 299.4 -368.2Q268.4 -325.6 196.8 -318.6V-311.8Q268.4 -305.6 299.4 -262.7Q330.4 -219.8 330.4 -146.2V-59.6Q330.4 -13.8 348.9 8.1Q367.4 30 411.6 30H492V122.4Z","}":"M197.2 122.4H108V30H188.4Q232.8 30 251.2 8.1Q269.6 -13.8 269.6 -59.6V-146.2Q269.6 -219.8 301 -262.7Q332.4 -305.6 403.2 -311.8V-318.6Q332.6 -325.6 301.1 -368.2Q269.6 -410.8 269.6 -484.2V-570.8Q269.6 -614.8 251.3 -637.6Q233 -660.4 188.4 -660.4H108V-752.8H197.2Q287.8 -752.8 327.7 -703.2Q367.6 -653.6 367.6 -575.2V-475.4Q367.6 -433 377.6 -408.3Q387.6 -383.6 414.5 -373.3Q441.4 -363 492 -363V-267.4Q441.4 -267.4 414.5 -257Q387.6 -246.6 377.6 -222Q367.6 -197.4 367.6 -155V-55.2Q367.6 23.2 327.7 72.8Q287.8 122.4 197.2 122.4Z","#":"M294.2 0 422.4 -710H507.4L379.4 0ZM44 -189.2 57.2 -272H516.4L503.2 -189.2ZM93.4 0 221.6 -710H305.6L178.6 0ZM83.6 -434.4 96.8 -517.2H556L542.8 -434.4Z","$":"M262.4 90.2V-801H338.8V90.2ZM309.2 14Q232.4 14 174.7 -16.5Q117 -47 83.1 -101.9Q49.2 -156.8 43.2 -231.4L149.2 -237.8Q156 -187.2 177.1 -152.3Q198.2 -117.4 232.1 -99.7Q266 -82 312.2 -82Q358.6 -82 389.8 -93.3Q421 -104.6 436.9 -126.8Q452.8 -149 452.8 -180Q452.8 -212.2 438.4 -234.5Q424 -256.8 384 -275.1Q344 -293.4 266 -313.2Q194.6 -331.8 148.9 -358.4Q103.2 -385 81.6 -423Q60 -461 60 -512Q60 -572.8 88.4 -617.5Q116.8 -662.2 170.1 -686.7Q223.4 -711.2 298 -711.2Q372 -711.2 424.6 -683.5Q477.2 -655.8 507.7 -605.7Q538.2 -555.6 545.4 -488L439.4 -481.8Q433.8 -522.8 416.9 -552.8Q400 -582.8 369.9 -599Q339.8 -615.2 294.8 -615.2Q233.4 -615.2 198.3 -589.2Q163.2 -563.2 163.2 -516.8Q163.2 -485.8 176.9 -465.7Q190.6 -445.6 225.9 -430.1Q261.2 -414.6 325.6 -396.8Q411.8 -373.6 462.4 -345.5Q513 -317.4 534.9 -277.9Q556.8 -238.4 556.8 -180.4Q556.8 -121.8 526 -78Q495.2 -34.2 439.7 -10.1Q384.2 14 309.2 14Z","%":"M153.2 -366Q91.8 -366 49.9 -410.8Q8 -455.6 8 -542Q8 -629.2 49.9 -673.6Q91.8 -718 153.2 -718Q214.8 -718 256.6 -673.6Q298.4 -629.2 298.4 -542Q298.4 -455.6 256.6 -410.8Q214.8 -366 153.2 -366ZM153.2 -432.8Q183.2 -432.8 200.6 -461.1Q218 -489.4 218 -542Q218 -594.6 200.6 -622.9Q183.2 -651.2 153.2 -651.2Q123.2 -651.2 105.8 -622.9Q88.4 -594.6 88.4 -542Q88.4 -489.4 105.8 -461.1Q123.2 -432.8 153.2 -432.8ZM49.4 0 469.8 -710H550.6L130.2 0ZM446.8 8Q385.4 8 343.5 -36.8Q301.6 -81.6 301.6 -168Q301.6 -255.2 343.5 -299.6Q385.4 -344 446.8 -344Q508.4 -344 550.2 -299.6Q592 -255.2 592 -168Q592 -81.6 550.2 -36.8Q508.4 8 446.8 8ZM446.8 -58.8Q476.8 -58.8 494.2 -87.1Q511.6 -115.4 511.6 -168Q511.6 -220.6 494.2 -248.9Q476.8 -277.2 446.8 -277.2Q416.8 -277.2 399.4 -248.9Q382 -220.6 382 -168Q382 -115.4 399.4 -87.1Q416.8 -58.8 446.8 -58.8Z","&":"M235.2 16Q131.8 16 73.9 -33.3Q16 -82.6 16 -172.4Q16 -219.2 29.6 -255.2Q43.2 -291.2 74 -323.9Q104.8 -356.6 156.8 -392Q135.2 -420.2 119.5 -446Q103.8 -471.8 95.1 -498.6Q86.4 -525.4 86.4 -556.4Q86.4 -635.2 134.9 -680.6Q183.4 -726 269 -726Q355.4 -726 399.4 -683.9Q443.4 -641.8 443.4 -570Q443.4 -511 408.2 -464.9Q373 -418.8 294.8 -368L437.2 -184.8Q453.6 -207 462.8 -241.7Q472 -276.4 472.4 -321.6L569.6 -311.2Q567.6 -252.2 547.3 -197.3Q527 -142.4 496.4 -106.4L582 0H466L431.2 -42.8Q403.2 -16.6 354.5 -0.3Q305.8 16 235.2 16ZM247.6 -79.4Q292.8 -79.4 323.2 -90.1Q353.6 -100.8 369.6 -117.2L212.8 -317.2Q165.6 -285 144.8 -253.1Q124 -221.2 124 -179.2Q124 -134.2 154 -106.8Q184 -79.4 247.6 -79.4ZM243.2 -438.4Q277.6 -460 298.7 -478.9Q319.8 -497.8 329.2 -518.1Q338.6 -538.4 338.6 -561.2Q338.6 -594 320.2 -611.7Q301.8 -629.4 268.6 -629.4Q232 -629.4 211.9 -610.1Q191.8 -590.8 191.8 -556.4Q191.8 -538.4 196.4 -520.3Q201 -502.2 212.4 -482.6Q223.8 -463 243.2 -438.4Z","*":"M201.6 -279.8 136.4 -323.8 232.4 -455 80 -454.8V-535L232.4 -534.8L136.4 -666L201.6 -710L300 -568.8L399.2 -710L464.4 -666L367.6 -534.8L520 -535V-454.8L367.6 -455L464.4 -323.8L399.2 -279.8L300 -421Z","+":"M59 -246V-338.4H541V-246ZM253.8 -51.2V-533.2H346.2V-51.2Z","=":"M78.6 -360.8V-450H521.4V-360.8ZM78.6 -144.6V-233.8H521.4V-144.6Z","?":"M248 -205.2Q248 -279 269.5 -322.8Q291 -366.6 343.4 -397.6Q380.6 -419.8 399.8 -437.2Q419 -454.6 425.7 -473.9Q432.4 -493.2 432.4 -521.2Q432.4 -567.6 402.1 -598.6Q371.8 -629.6 313.6 -629.6Q245.4 -629.6 210.5 -595.1Q175.6 -560.6 168 -494L60.8 -500.4Q66.8 -566.2 98.6 -617.1Q130.4 -668 184.8 -697Q239.2 -726 313.6 -726Q382.2 -726 433 -699.9Q483.8 -673.8 511.5 -627.8Q539.2 -581.8 539.2 -522Q539.2 -479.8 526.1 -448.8Q513 -417.8 486 -392.3Q459 -366.8 416.8 -340Q389 -323 373.7 -304.8Q358.4 -286.6 352.4 -263.1Q346.4 -239.6 346.4 -205.2ZM230.4 0V-131.6H365.6V0Z"};
  var KEYS = Object.keys(DEC);
  var PIV = [[21, 21], [79, 21], [21, 79], [79, 79]];
  var FROM = [[-1, -1, -90], [1, -1, 90], [-1, 1, 90], [1, 1, -90]];
  var TT = 1.45, STEP = 0.11, DT = 0.045, TS = TT + 0.9;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(t, a, d) { return clamp((t - a) / d); }
  function bez(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    function sx(t) { return ((ax * t + bx) * t + cx) * t; }
    function sy(t) { return ((ay * t + by) * t + cy) * t; }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 30; i++) { var v = sx(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      return sy(t);
    };
  }
  var E = { corner: bez(.7, 0, .2, 1), out: bez(0, 0, .58, 1), inout: bez(.42, 0, .58, 1), ease: bez(.25, .1, .25, 1), pop: bez(.3, 1.8, .5, 1) };
  function rnd(a, b) {
    var h = Math.imul(a + 1, 374761393) ^ Math.imul(b + 7, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  function mount(svg) {
    var cfg = JSON.parse(svg.getAttribute('data-tl'));
    function q(k) { return svg.querySelector('[data-k="' + k + '"]'); }
    var corners = [0, 1, 2, 3].map(function (i) { return q('c' + i); });
    var cg = q('cg'), ticks = q('t'), ring = q('ring'), halo = q('halo'), dot = q('dot'), cur = q('cur'), curg = q('curg');
    function kids(k) { var g = q(k); return g ? Array.prototype.map.call(g.children, function (c) { return c.firstElementChild; }) : []; }
    var letters = kids('w'), sl = kids('s');
    letters.concat(sl).forEach(function (p) { p._d = p.getAttribute('d'); p._fill = p.getAttribute('fill'); p._adv = +p.getAttribute('data-adv'); });
    var T0 = cfg.T0;
    var sc = function (s) { return 'translate(50 50) scale(' + r2(s) + ') translate(-50 -50)'; };

    function glyphState(p, T, start, steps, seed) {
      if (T < start) { p.setAttribute('opacity', 0); return; }
      if (T < start + steps * DT) {
        var k = Math.floor((T - start) / DT);
        p.setAttribute('d', DEC[KEYS[Math.floor(rnd(seed, k) * KEYS.length)]]);
        p.setAttribute('transform', 'translate(' + r2((p._adv - 480) / 2) + ' 0) scale(.8)');
        p.setAttribute('fill', '#ff5500'); p.setAttribute('opacity', .55);
      } else {
        p.setAttribute('d', p._d); p.removeAttribute('transform'); p.setAttribute('fill', p._fill);
        p.setAttribute('opacity', r2(.55 + .45 * E.ease(seg(T, start + steps * DT, .35))));
      }
    }

    function render(t) {
      var T = t - T0;
      var pc = seg(T, 0, 1.05), ec = E.corner(pc);
      corners.forEach(function (el, i) {
        var o = FROM[i], p = PIV[i];
        el.setAttribute('transform', 'translate(' + r2(o[0] * 34 * (1 - ec)) + ' ' + r2(o[1] * 34 * (1 - ec)) + ') rotate(' + r2(o[2] * (1 - ec)) + ' ' + p[0] + ' ' + p[1] + ')');
        el.setAttribute('opacity', pc <= 0 ? 0 : pc < .3 ? r2(E.corner(pc / .3)) : 1);
      });
      var pl = seg(T, 1.05, .22), ls = 1;
      if (pl > 0 && pl < 1) ls = pl < .5 ? 1 - .06 * E.out(pl / .5) : .94 + .06 * E.out((pl - .5) / .5);
      cg.setAttribute('transform', sc(ls));
      ticks.setAttribute('opacity', r2(.45 * E.out(seg(T, 1.1, .3))));
      var ds = E.pop(seg(T, 1.2, .5));
      dot.setAttribute('transform', sc(ds));
      halo.setAttribute('transform', sc(ds));
      var ho = 1;
      if (T > 2.4) { var ph = ((T - 2.4) % 2.6) / 2.6; ho = ph < .5 ? 1 - .65 * E.inout(ph / .5) : .35 + .65 * E.inout((ph - .5) / .5); }
      halo.setAttribute('opacity', r2(ho));
      var pr = seg(T, 1.25, .9);
      if (pr > 0 && pr < 1) { var e = E.out(pr); ring.setAttribute('opacity', r2(.9 * (1 - e))); ring.setAttribute('transform', sc(.4 + 2.8 * e)); }
      else ring.setAttribute('opacity', 0);
      letters.forEach(function (p, i) { glyphState(p, T, TT + i * STEP, 6, i); });
      sl.forEach(function (p, j) { glyphState(p, T, TS + j * .012, 3, 100 + j); });
      var cx = null, on = false, done = false, tDone = TT + 5 * STEP + .3;
      if (T >= 0) {
        if (T < TT) { cx = 0; on = (T % 1) < .5; }
        else if (T < tDone) { cx = cfg.pen[Math.min(4, Math.floor((T - TT) / STEP))]; on = true; }
        else { cx = cfg.pen[4]; on = ((T - tDone) % 1.1) < .55; done = true; }
      }
      if (cx === null) { cur.setAttribute('opacity', 0); curg.setAttribute('opacity', 0); return; }
      var x = r2(cfg.wx + cx + 60);
      cur.setAttribute('x', x); curg.setAttribute('x', x);
      cur.setAttribute('opacity', on ? 1 : 0);
      var g = .55;
      if (done) { var pg = ((T - tDone) % 1.1) / 1.1; g = .55 + .45 * (pg < .5 ? E.inout(pg / .5) : 1 - E.inout((pg - .5) / .5)); }
      curg.setAttribute('opacity', on ? r2(g) : 0);
    }
    // Enquadra o palco: a caixa ocupa "fill" da janela, centralizada
    function frame(w, h, fill, box) {
      var bw = box[2] - box[0], bh = box[3] - box[1], s = Math.max(bw / (w * fill), bh / (h * fill));
      var vw = w * s, vh = h * s;
      svg.setAttribute('viewBox', [r2((box[0] + box[2]) / 2 - vw / 2), r2((box[1] + box[3]) / 2 - vh / 2), r2(vw), r2(vh)].join(' '));
    }
    return { svg: svg, cfg: cfg, render: render, frame: frame, logoEnd: T0 + 2.6, sloganEnd: T0 + TS + .6 + .45 };
  }

  // Cabeçalho: a logo se monta ao abrir a página e repete a cada ciclo; entre um ciclo e outro, o CSS faz o cursor piscar
  function loop(svg, opts) {
    var c = mount(svg), end = c.logoEnd, raf = 0, timer = 0, start = 0;
    function idle() { c.render(end); svg.classList.add('is-idle'); }
    if (reduce) { idle(); return; }
    function tick(now) {
      var t = (now - start) / 1000;
      if (t >= end) { idle(); raf = 0; if (opts.every) timer = setTimeout(play, opts.every); return; }
      c.render(t); raf = requestAnimationFrame(tick);
    }
    function play() {
      clearTimeout(timer);
      if (document.hidden) { timer = setTimeout(play, 1500); return; }
      if (raf) return;
      svg.classList.remove('is-idle');
      start = performance.now(); c.render(0); raf = requestAnimationFrame(tick);
    }
    c.render(0);
    return { play: play };
  }

  function boot() {
    var head = document.querySelector('.tl--header');
    if (head) {
      var h = loop(head, { every: 9000 });
      var ready = window.tirvoIntro && window.tirvoIntro.done ? window.tirvoIntro.done : Promise.resolve();
      if (h) ready.then(function () { setTimeout(h.play, 250); });
    }
    // Menu móvel: a logo se monta de novo a cada abertura
    var menuLogo = document.querySelector('.tl--menu'), menu = document.querySelector('[data-menu]');
    if (menuLogo && menu) {
      var m = loop(menuLogo, { every: 0 });
      if (m) new MutationObserver(function () { if (!menu.hidden) setTimeout(m.play, 120); }).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
    }
  }
  window.TirvoLogo = { mount: mount, reduce: reduce };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
