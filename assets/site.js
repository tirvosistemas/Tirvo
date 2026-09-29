/* Tirvo · script único do site (gerado a partir da página inicial; não editar à mão) */

    /* ==========================================================
       CONFIGURAÇÃO
       ========================================================== */
    const CONFIG = {
      // Contato (WhatsApp)
      whatsappNumber: '5541991933850',
      whatsappEndpoint: 'https://api.whatsapp.com/send?phone=5541991933850&text=',
      // Opacidade do texto fantasma do H1. Usar 0 cria a máquina de escrever clássica, mas piora o LCP.
      // Carrossel do Nexus
      AUTOPLAY_MS: 5000,
      RESUME_AFTER_MS: 8000,
      SWIPE_THRESHOLD: 50,
      // Campo neural do hero
      neural: {
        areaPerNode: 13000,
        minNodes: 36,
        maxNodes: 110,
        maxNodesSmall: 48,
        linkDist: 130,
        linkDistSmall: 100,
        radius: 190,
        radiusTouch: 140,
        force: 900,
        maxSpeed: 200,
      },
      // Contadores
      counters: { duration: 1600, threshold: 0.4 },
      // Formulário
      form: { maxChars: 1500, minName: 2, minChallenge: 20, draftKey: 'tirvo:rascunho' },
      // Cabeçalho
      header: { solidAfter: 40 },
      // Lightbox
      lightbox: { maxScale: 4, doubleTapScale: 2.5, hintMs: 2800 },
      // Mascote: tempos (ms) e frases de cada seção, na ordem em que aparecem
      mascot: {
        dwell: 700,
        revisitGap: 20000,
        bubbleMin: 4200,
        bubblePerChar: 40,
        bubbleMax: 9000,
        talkPerChar: 38,
        talkMax: 2600,
        blinkMin: 2400,
        blinkMax: 6000,
        idleMin: 14000,
        idleMax: 24000,
        flightMs: 1050,
        comboWindow: 1200,
        dizzyAt: 7,
        hoverSoundGap: 700,
        soundKey: 'tirvo:sons-next',
        // Respostas quando o visitante brinca com o Next
        play: {
          tickle: ['Hihi, isso faz cócegas.', 'Ei, assim eu não consigo me concentrar.', 'Tá bom, tá bom, você venceu.'],
          boing: ['Ei, essa é a minha antena.', 'Boing. Ela sempre volta para o lugar.', 'Cuidado, é por ela que chegam as ideias.'],
          dizzy: ['Uau, fiquei tonto. Vamos com calma?', 'Tudo girando por aqui. Mas já estou pronto de novo.'],
          party: ['Que melodia. Você tocou a Tirvo inteira.', 'Bis. Agora o próximo passo é tirar o seu projeto do papel.'],
        },
        messages: {
          inicio: ['Oi, eu sou o Next, o guia da Tirvo. Vou te levar ao próximo passo.', 'Sites, sistemas, marcas e IA, tudo com rigor de engenharia. Role para ver.'],
          alerta: ['Rede social é terreno alugado: as regras mudam sem aviso.', 'Use as redes para atrair e o seu site para converter.'],
          servicos: ['São cinco frentes: sites, sistemas, marca, design e IA. Qual delas é a sua?', 'Toque em um cartão para ver tudo sobre o serviço na página dele.'],
          equipe: ['Aqui ninguém usa template: é gente que programa de verdade.', 'Programadores raiz lado a lado com especialistas em IA.'],
          metodo: ['Três fases, zero improviso: Descoberta, Engenharia e Lançamento.', 'Você sabe o que será entregue em cada etapa, e quando.'],
          nexus: ['Esse é o Nexus: um enxame de agentes que escreve o código e entrega em .zip.', 'Toque no cartão para ver o Nexus por dentro, tela por tela.'],
          numeros: ['Zero código genérico. Tudo é projetado para o seu negócio.', 'Com a Gestão 360º, sua operação é monitorada 24/7.'],
          faq: ['Ficou alguma dúvida? Abra uma pergunta ou veja todas na página de FAQ.', 'Não achou o que procurava? Dá para falar direto no WhatsApp.'],
          contato: ['Conte o seu desafio em poucas linhas. A mensagem chega pronta no WhatsApp da equipe.', 'Nenhum dado fica guardado aqui: tudo vai direto para o WhatsApp.'],
          rodape: ['Toque nas letras da Tirvo aqui embaixo: cada uma tem uma surpresa.', 'O próximo passo é uma conversa com a equipe. É só tocar no WhatsApp.'],
        },
        // No rodapé: o Next pula de letra em letra e depois corre até o botão do WhatsApp
        footer: {
          letters: 'Toque nas letras da Tirvo: cada uma tem uma surpresa.',
          whatsapp: 'O próximo passo é uma conversa com a equipe. Toque aqui no WhatsApp.',
          hopMs: 950,
          perchMs: 1900,
          waMs: 7500,
          waAfterPlay: 2500,
        },
      },
    };

    /* ==========================================================
       UTILITÁRIOS
       ========================================================== */
    const root = document.documentElement;
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const supports = (rule) => typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports(rule);
    const hasIO = 'IntersectionObserver' in window;

    // Executa a função no máximo uma vez por quadro, sempre com os argumentos mais recentes
    const rafThrottle = (fn) => {
      let frame = 0;
      let lastArgs = [];
      return (...args) => {
        lastArgs = args;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          fn(...lastArgs);
        });
      };
    };

    // Preferência de movimento reduzido, reativa
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = {
      get value() { return motionQuery.matches; },
      subscribe(callback) {
        const handler = () => callback(motionQuery.matches);
        motionQuery.addEventListener('change', handler);
        return () => motionQuery.removeEventListener('change', handler);
      },
    };

    const finePointerQuery = matchMedia('(hover: hover) and (pointer: fine)');
    const isFinePointer = () => finePointerQuery.matches;

    // Observa a visibilidade de um elemento; devolve a função que encerra a observação
    function onVisible(element, callback, options = {}) {
      if (!element) return () => {};
      if (!hasIO) {
        callback(true, null);
        return () => {};
      }
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) callback(entry.isIntersecting, entry);
      }, options);
      observer.observe(element);
      return () => observer.disconnect();
    }

    // Visibilidade da aba
    const tabListeners = new Set();
    const onTabVisibility = (callback) => {
      tabListeners.add(callback);
      return () => tabListeners.delete(callback);
    };
    document.addEventListener('visibilitychange', () => {
      root.classList.toggle('is-tab-hidden', document.hidden);
      tabListeners.forEach((callback) => callback(!document.hidden));
    });

    // Trava de rolagem compartilhada por menu e lightbox
    let scrollLocks = 0;
    function lockScroll(lock) {
      scrollLocks = Math.max(0, scrollLocks + (lock ? 1 : -1));
      root.style.overflow = scrollLocks ? 'hidden' : '';
    }

    // Anúncio em região viva (reinicia o texto para permitir repetições)
    function announce(region, message) {
      if (!region) return;
      region.textContent = '';
      setTimeout(() => { region.textContent = message; }, 40);
    }

    // Executor seguro: a falha de um módulo nunca derruba os demais
    function run(name, fn) {
      try {
        return fn();
      } catch (error) {
        document.dispatchEvent(new CustomEvent('tirvo:falha', { detail: { modulo: name, erro: error } }));
        return null;
      }
    }

    // Pausa animações CSS contínuas quando o bloco sai da tela
    function observeScope(element) {
      if (!element) return;
      onVisible(element, (visible) => element.classList.toggle('is-offscreen', !visible), { rootMargin: '100px 0px' });
    }

    /* ==========================================================
       ESCOPOS DE ANIMAÇÃO GENÉRICOS
       ========================================================== */
    function initAnimScopes() {
      $$('[data-anim-scope]').forEach((element) => {
        if (!element.dataset.animScope) observeScope(element);
      });
    }

    /* ==========================================================
       CABEÇALHO INTELIGENTE + SCROLL-SPY
       ========================================================== */
    // Efeito de decodificação: embaralha com símbolos e revela o texto da esquerda para a direita
    const SCRAMBLE_GLYPHS = '01<>/_#$%*+=';
    function scramble(element, { duration = 420, delay = 0 } = {}) {
      if (!element) return;
      const text = (element.dataset.text ??= element.textContent);
      cancelAnimationFrame(element._scrambleFrame);
      clearTimeout(element._scrambleTimer);
      if (prefersReducedMotion.value) {
        element.textContent = text;
        return;
      }
      element._scrambleTimer = setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const revealed = Math.floor(progress * text.length);
          let out = '';
          for (let index = 0; index < text.length; index += 1) {
            out += index < revealed || text[index] === ' '
              ? text[index]
              : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          }
          element.textContent = out;
          if (progress < 1) element._scrambleFrame = requestAnimationFrame(tick);
        };
        element._scrambleFrame = requestAnimationFrame(tick);
      }, delay);
    }

    function initHeader() {
      const header = $('[data-header]');
      if (!header) return;
      // Topo sempre fixo: a rolagem só troca o fundo transparente pelo de vidro
      const update = () => header.classList.toggle('is-scrolled', window.scrollY > CONFIG.header.solidAfter);
      window.addEventListener('scroll', rafThrottle(update), { passive: true });
      requestAnimationFrame(update);

      // Indicador de luz que desliza até o item ativo (ou o que está sob o mouse)
      const list = $('.nav__list', header);
      const navLinks = $$('.nav__link', header);
      let indicator = null;
      let hovered = null;
      const moveIndicator = () => {
        if (!indicator) return;
        const target = hovered || navLinks.find((link) => link.classList.contains('is-active'));
        if (!target || !target.offsetWidth) {
          indicator.style.opacity = '0';
          return;
        }
        indicator.style.width = `${target.offsetWidth}px`;
        indicator.style.transform = `translateX(${target.offsetLeft}px)`;
        indicator.style.opacity = '1';
      };
      if (list) {
        indicator = document.createElement('li');
        indicator.className = 'nav__indicator';
        indicator.setAttribute('aria-hidden', 'true');
        indicator.setAttribute('role', 'presentation');
        list.prepend(indicator);
        navLinks.forEach((link) => {
          link.addEventListener('pointerenter', () => {
            hovered = link;
            moveIndicator();
            scramble($('.scr__live', link), { duration: 380 });
          });
          link.addEventListener('focus', () => { hovered = link; moveIndicator(); });
          link.addEventListener('blur', () => { hovered = null; moveIndicator(); });
        });
        list.addEventListener('pointerleave', () => { hovered = null; moveIndicator(); });
        window.addEventListener('resize', rafThrottle(moveIndicator), { passive: true });
        document.fonts?.ready.then(moveIndicator);
      }

      // Destaque da seção ativa no topo e no menu do celular
      const links = $$('[data-nav-link]');
      const ids = [...new Set(links.map((link) => link.hash.slice(1)))];
      const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
      if (!hasIO || !sections.length) return;
      let activeId = '';
      const setActive = (id) => {
        activeId = id;
        links.forEach((link) => {
          const active = link.hash.slice(1) === id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
        moveIndicator();
      };
      const spy = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else if (activeId === entry.target.id) setActive('');
        }
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach((section) => spy.observe(section));
    }

    /* ==========================================================
       MENU MÓVEL (diálogo modal com foco preso)
       ========================================================== */
    function initMobileMenu() {
      const toggle = $('[data-menu-toggle]');
      const menu = $('[data-menu]');
      const closeButton = $('[data-menu-close]');
      if (!toggle || !menu) return;

      let open = false;
      let cleanup = null;
      let hideTimer = 0;
      let clockTimer = 0;
      const clock = $('[data-menu-clock]', menu);
      const clockFormat = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
      const updateClock = () => { if (clock) clock.textContent = clockFormat.format(new Date()); };
      const desktop = matchMedia('(min-width: 1024px)');
      const focusables = () => $$('a[href], button:not([disabled])', menu);
      const outside = () => $$('[data-overlay-inert]');

      function trapTab(event) {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!menu.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      function openMenu() {
        if (open) return;
        open = true;
        clearTimeout(hideTimer);
        menu.hidden = false;
        root.classList.add('is-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Fechar menu');
        outside().forEach((element) => { element.inert = true; });
        lockScroll(true);
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
        // Itens "decodificam" em cascata e o relógio de Curitiba aparece na barra de status
        $$('[data-scramble-menu]', menu).forEach((label, index) => scramble(label, { duration: 520, delay: 140 + index * 70 }));
        updateClock();
        clockTimer = setInterval(updateClock, 15000);
        const firstLink = $('.menu__link', menu);
        firstLink?.focus({ preventScroll: true });

        const onKeydown = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeMenu();
          } else if (event.key === 'Tab') {
            trapTab(event);
          }
        };
        const onBreakpoint = (event) => { if (event.matches) closeMenu(false); };
        document.addEventListener('keydown', onKeydown);
        desktop.addEventListener('change', onBreakpoint);
        cleanup = () => {
          document.removeEventListener('keydown', onKeydown);
          desktop.removeEventListener('change', onBreakpoint);
        };
      }

      function closeMenu(restoreFocus = true) {
        if (!open) return;
        open = false;
        cleanup?.();
        cleanup = null;
        menu.classList.remove('is-open');
        clearInterval(clockTimer);
        root.classList.remove('is-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
        outside().forEach((element) => { element.inert = false; });
        lockScroll(false);
        hideTimer = setTimeout(() => { if (!open) menu.hidden = true; }, prefersReducedMotion.value ? 0 : 340);
        if (restoreFocus) toggle.focus({ preventScroll: true });
      }

      toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()));
      closeButton?.addEventListener('click', () => closeMenu());
      menu.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        event.preventDefault();
        const target = document.getElementById(link.hash.slice(1));
        closeMenu();
        if (target) {
          history.pushState(null, '', link.hash);
          target.scrollIntoView({ behavior: prefersReducedMotion.value ? 'auto' : 'smooth', block: 'start' });
        }
      });
    }

    /* ==========================================================
       SUBMENU DE SERVIÇOS (topo no computador, sanfona no menu do celular)
       ========================================================== */
    function initSubmenu() {
      const rootItem = $('[data-sub-root]');
      const toggle = $('[data-sub-toggle]');
      const panel = $('[data-sub]');
      if (rootItem && toggle && panel) {
        let open = false;
        let leaveTimer = 0;
        let hideTimer = 0;
        const set = (value, focusFirst = false) => {
          if (open === value) return;
          open = value;
          clearTimeout(hideTimer);
          toggle.setAttribute('aria-expanded', String(value));
          rootItem.classList.toggle('is-open', value);
          if (value) {
            panel.hidden = false;
            requestAnimationFrame(() => panel.classList.add('is-open'));
            if (focusFirst) $('a', panel)?.focus({ preventScroll: true });
          } else {
            panel.classList.remove('is-open');
            hideTimer = setTimeout(() => { if (!open) panel.hidden = true; }, prefersReducedMotion.value ? 0 : 220);
          }
        };
        let hoverOpenedAt = 0;
        // Com o mouse, passar por cima já abre: o clique logo em seguida mantém aberto em vez de fechar
        toggle.addEventListener('click', () => set(open && performance.now() - hoverOpenedAt > 700 ? false : true));
        toggle.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); set(true, true); }
        });
        const fine = matchMedia('(hover: hover) and (pointer: fine)');
        rootItem.addEventListener('pointerenter', (event) => {
          if (event.pointerType !== 'mouse' || !fine.matches) return;
          clearTimeout(leaveTimer);
          if (!open) hoverOpenedAt = performance.now();
          set(true);
        });
        rootItem.addEventListener('pointerleave', (event) => {
          if (event.pointerType !== 'mouse') return;
          leaveTimer = setTimeout(() => set(false), 180);
        });
        rootItem.addEventListener('focusout', (event) => {
          if (!rootItem.contains(event.relatedTarget)) set(false);
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && open) { set(false); toggle.focus({ preventScroll: true }); }
        });
        document.addEventListener('click', (event) => { if (open && !rootItem.contains(event.target)) set(false); });
        panel.addEventListener('keydown', (event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          const links = $$('a', panel);
          const index = links.indexOf(document.activeElement);
          if (index < 0) return;
          event.preventDefault();
          links[(index + (event.key === 'ArrowDown' ? 1 : links.length - 1)) % links.length].focus();
        });
      }

      // Menu do celular: Serviços abre a lista das cinco páginas logo abaixo
      $$('[data-msub-toggle]').forEach((button) => {
        const list = document.getElementById(button.getAttribute('aria-controls'));
        if (!list) return;
        button.addEventListener('click', () => {
          const expand = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(expand));
          list.hidden = !expand;
          if (expand) requestAnimationFrame(() => list.classList.add('is-open'));
          else list.classList.remove('is-open');
        });
      });
    }

    /* ==========================================================
       NAVEGAÇÃO POR ÂNCORA PRECISA (content-visibility)
       ========================================================== */
    function initAnchors() {
      // Seções adiadas têm altura estimada; antes de saltar para uma âncora, elas são renderizadas
      const renderAll = () => root.classList.add('is-cv-off');
      if (window.location.hash.length > 1) {
        renderAll();
        // Chegando de outra página com âncora: as alturas reais mudam a posição, então o destino é reajustado
        let target = null;
        try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); } catch { target = null; }
        if (target) {
          let userMoved = false;
          const stop = () => { userMoved = true; };
          ['wheel', 'touchstart', 'keydown'].forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
          const jump = () => { if (!userMoved) target.scrollIntoView({ block: 'start', behavior: 'instant' }); };
          requestAnimationFrame(jump);
          setTimeout(jump, 450);
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(jump, 60));
        }
      }
      document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || link.hash.length < 2 || root.classList.contains('is-cv-off')) return;
        if (document.getElementById(link.hash.slice(1))) renderAll();
      }, true);
      window.addEventListener('hashchange', renderAll);
    }

    /* ==========================================================
       BARRA DE PROGRESSO (fallback para navegadores sem scroll-driven)
       ========================================================== */
    function initScrollProgress() {
      const bar = $('[data-progress]');
      if (!bar || supports('animation-timeline: scroll()')) return;
      let max = 1;
      const update = () => {
        bar.style.transform = `scaleX(${clamp(window.scrollY / max, 0, 1).toFixed(4)})`;
      };
      const measure = () => {
        max = Math.max(1, root.scrollHeight - window.innerHeight);
        update();
      };
      window.addEventListener('scroll', rafThrottle(update), { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(rafThrottle(measure)).observe(document.body);
      else window.addEventListener('resize', rafThrottle(measure), { passive: true });
      measure();
    }

    /* ==========================================================
       REVELAÇÕES NA ROLAGEM
       ========================================================== */
    function initReveal() {
      const elements = $$('[data-reveal]');
      $$('[data-stagger]').forEach((group) => {
        $$(':scope > [data-reveal]', group).forEach((element, index) => element.style.setProperty('--i', String(index)));
      });
      const revealAll = () => elements.forEach((element) => element.classList.add('is-revealed'));
      if (!hasIO || prefersReducedMotion.value) {
        revealAll();
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

      // Títulos começam recortados por clip-path (área de interseção zero): observa-se o contêiner pai
      const titlesByParent = new Map();
      const titleObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (titlesByParent.get(entry.target) || []).forEach((title) => title.classList.add('is-revealed'));
          titleObserver.unobserve(entry.target);
        }
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

      elements.forEach((element) => {
        if (element.dataset.reveal === 'title' && element.parentElement) {
          const parent = element.parentElement;
          if (!titlesByParent.has(parent)) titlesByParent.set(parent, []);
          titlesByParent.get(parent).push(element);
          titleObserver.observe(parent);
        } else {
          observer.observe(element);
        }
      });

      prefersReducedMotion.subscribe((reduce) => {
        if (!reduce) return;
        observer.disconnect();
        titleObserver.disconnect();
        revealAll();
      });
    }

    /* ==========================================================
       RÓTULOS MONO QUE SE DECODIFICAM
       ========================================================== */
    function initSectionLabels() {
      const labels = $$('[data-decode]');
      if (!labels.length || !hasIO || prefersReducedMotion.value) return;
      const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
      const DURATION = 420;
      const decodable = /[\p{L}\p{N}]/u;

      const scramble = (label) => {
        const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        const originals = nodes.map((node) => node.textContent);
        const total = originals.reduce((sum, text) => sum + text.length, 0);
        label.setAttribute('aria-label', label.textContent.replace(/\s+/g, ' ').trim());
        const start = performance.now();

        const frame = (now) => {
          const progress = clamp((now - start) / DURATION, 0, 1);
          const settled = Math.floor(progress * total);
          let offset = 0;
          nodes.forEach((node, index) => {
            const source = originals[index];
            let output = '';
            for (let i = 0; i < source.length; i += 1) {
              const char = source[i];
              output += offset + i < settled || !decodable.test(char) ? char : GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            offset += source.length;
            node.textContent = output;
          });
          if (progress < 1) {
            requestAnimationFrame(frame);
          } else {
            nodes.forEach((node, index) => { node.textContent = originals[index]; });
            label.removeAttribute('aria-label');
          }
        };
        requestAnimationFrame(frame);
      };

      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          scramble(entry.target);
        }
      }, { threshold: 0.6 });
      labels.forEach((label) => observer.observe(label));
    }

    /* ==========================================================
       CAMPO NEURAL DO HERO (canvas)
       ========================================================== */
    function initNeuralField() {
      const canvas = $('[data-neural]');
      const hero = $('#inicio');
      if (!canvas || !hero || !canvas.getContext) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cfg = CONFIG.neural;
      const coarse = matchMedia('(pointer: coarse)').matches;
      const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
      const NEIGHBORS = [[0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
      const LINK_ALPHA = 0.4;
      const NODE_ALPHAS = [0.6, 0.73, 0.86];
      const POINTER_ALPHAS = [0.16, 0.34];
      const TAU = Math.PI * 2;

      let width = 0;
      let height = 0;
      let heroTop = 0;
      let linkDist = cfg.linkDist;
      let radius = cfg.radius;
      let cols = 0;
      let rows = 0;
      let grid = [];
      let nodes = [];
      let visible = true;
      let running = false;
      let rafId = 0;
      let lastTime = 0;
      let revealed = false;
      const pointer = { x: 0, y: 0, active: false };
      const linkBuckets = [[], [], [], []];
      const pointerBuckets = [[], []];
      const nodeGroups = [[], [], []];

      // Brilho dos hubs pré-renderizado (proibido usar shadowBlur no laço)
      const glow = (() => {
        const size = 64;
        const sprite = document.createElement('canvas');
        sprite.width = size;
        sprite.height = size;
        const g = sprite.getContext('2d');
        const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 85, 0, 0.55)');
        gradient.addColorStop(0.35, 'rgba(255, 85, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 85, 0, 0)');
        g.fillStyle = gradient;
        g.fillRect(0, 0, size, size);
        return sprite;
      })();

      const targetCount = () => {
        let count = clamp(Math.round((width * height) / cfg.areaPerNode), cfg.minNodes, cfg.maxNodes);
        if (coarse || width < 768) count = Math.min(count, cfg.maxNodesSmall);
        if (lowPower) count = Math.round(count * 0.7);
        return count;
      };

      const makeNode = () => {
        const angle = Math.random() * TAU;
        const speed = 8 + Math.random() * 14;
        const hub = Math.random() < 0.12;
        const alpha = 0.55 + Math.random() * 0.35;
        const bvx = Math.cos(angle) * speed;
        const bvy = Math.sin(angle) * speed;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          bvx,
          bvy,
          vx: bvx,
          vy: bvy,
          r: hub ? 1.7 + Math.random() * 0.5 : 0.8 + Math.random() * 1.4,
          group: alpha < 0.67 ? 0 : alpha < 0.79 ? 1 : 2,
          hub,
        };
      };

      const syncCount = () => {
        const target = targetCount();
        while (nodes.length < target) nodes.push(makeNode());
        if (nodes.length > target) nodes.length = target;
      };

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(rect.width));
        const nextHeight = Math.max(1, Math.round(rect.height));
        // Redistribui os nós proporcionalmente
        if (width && height) {
          const sx = nextWidth / width;
          const sy = nextHeight / height;
          for (const node of nodes) {
            node.x *= sx;
            node.y *= sy;
          }
        }
        width = nextWidth;
        height = nextHeight;
        heroTop = rect.top + window.scrollY;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        linkDist = width < 768 ? cfg.linkDistSmall : cfg.linkDist;
        radius = coarse ? cfg.radiusTouch : cfg.radius;
        cols = Math.ceil(width / linkDist) + 1;
        rows = Math.ceil(height / linkDist) + 1;
        grid = Array.from({ length: cols * rows }, () => []);
        syncCount();
        if (!running) draw();
      };

      const step = (dt) => {
        const damping = Math.pow(0.9, dt * 60);
        const r2 = radius * radius;
        const maxV2 = cfg.maxSpeed * cfg.maxSpeed;
        const margin = 24;
        for (const node of nodes) {
          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2 && d2 > 4) {
              const d = Math.sqrt(d2);
              const t = 1 - d / radius;
              const force = t * t * cfg.force;
              node.vx += (dx / d) * force * dt;
              node.vy += (dy / d) * force * dt;
            }
          }
          // Relaxa suavemente de volta à deriva original
          node.vx = node.bvx + (node.vx - node.bvx) * damping;
          node.vy = node.bvy + (node.vy - node.bvy) * damping;
          const v2 = node.vx * node.vx + node.vy * node.vy;
          if (v2 > maxV2) {
            const k = cfg.maxSpeed / Math.sqrt(v2);
            node.vx *= k;
            node.vy *= k;
          }
          node.x += node.vx * dt;
          node.y += node.vy * dt;
          if (node.x < -margin) node.x += width + margin * 2;
          else if (node.x > width + margin) node.x -= width + margin * 2;
          if (node.y < -margin) node.y += height + margin * 2;
          else if (node.y > height + margin) node.y -= height + margin * 2;
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        if (!cols) return;

        // Grade espacial: evita a comparação O(n²)
        for (const cell of grid) cell.length = 0;
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          const cx = clamp((node.x / linkDist) | 0, 0, cols - 1);
          const cy = clamp((node.y / linkDist) | 0, 0, rows - 1);
          grid[cy * cols + cx].push(i);
        }

        for (const bucket of linkBuckets) bucket.length = 0;
        const l2 = linkDist * linkDist;
        for (let cy = 0; cy < rows; cy += 1) {
          for (let cx = 0; cx < cols; cx += 1) {
            const cell = grid[cy * cols + cx];
            if (!cell.length) continue;
            for (const [ox, oy] of NEIGHBORS) {
              const nx = cx + ox;
              const ny = cy + oy;
              if (nx < 0 || nx >= cols || ny >= rows) continue;
              const other = grid[ny * cols + nx];
              const same = ox === 0 && oy === 0;
              for (let a = 0; a < cell.length; a += 1) {
                const p = nodes[cell[a]];
                for (let b = same ? a + 1 : 0; b < other.length; b += 1) {
                  const q = nodes[other[b]];
                  const dx = p.x - q.x;
                  const dy = p.y - q.y;
                  const d2 = dx * dx + dy * dy;
                  if (d2 >= l2) continue;
                  const t = 1 - Math.sqrt(d2) / linkDist;
                  const alpha = t * t * LINK_ALPHA;
                  linkBuckets[Math.min(3, (alpha / LINK_ALPHA * 4) | 0)].push(p.x, p.y, q.x, q.y);
                }
              }
            }
          }
        }

        // Um stroke() por faixa de alfa
        ctx.lineWidth = 1;
        for (let k = 0; k < 4; k += 1) {
          const bucket = linkBuckets[k];
          if (!bucket.length) continue;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(((k + 0.5) / 4) * LINK_ALPHA).toFixed(3)})`;
          ctx.beginPath();
          for (let i = 0; i < bucket.length; i += 4) {
            ctx.moveTo(bucket[i], bucket[i + 1]);
            ctx.lineTo(bucket[i + 2], bucket[i + 3]);
          }
          ctx.stroke();
        }

        // Linhas laranja até o ponteiro
        if (pointer.active) {
          for (const bucket of pointerBuckets) bucket.length = 0;
          const r2 = radius * radius;
          for (const node of nodes) {
            const dx = node.x - pointer.x;
            const dy = node.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 >= r2) continue;
            const t = 1 - Math.sqrt(d2) / radius;
            pointerBuckets[t > 0.5 ? 1 : 0].push(node.x, node.y);
          }
          for (let k = 0; k < 2; k += 1) {
            const bucket = pointerBuckets[k];
            if (!bucket.length) continue;
            ctx.strokeStyle = `rgba(255, 85, 0, ${POINTER_ALPHAS[k]})`;
            ctx.beginPath();
            for (let i = 0; i < bucket.length; i += 2) {
              ctx.moveTo(pointer.x, pointer.y);
              ctx.lineTo(bucket[i], bucket[i + 1]);
            }
            ctx.stroke();
          }
        }

        // Nós brancos agrupados por alfa
        for (const group of nodeGroups) group.length = 0;
        for (const node of nodes) if (!node.hub) nodeGroups[node.group].push(node);
        for (let k = 0; k < 3; k += 1) {
          const group = nodeGroups[k];
          if (!group.length) continue;
          ctx.fillStyle = `rgba(255, 255, 255, ${NODE_ALPHAS[k]})`;
          ctx.beginPath();
          for (const node of group) {
            ctx.moveTo(node.x + node.r, node.y);
            ctx.arc(node.x, node.y, node.r, 0, TAU);
          }
          ctx.fill();
        }

        // Hubs laranja com brilho em sprite
        const size = 34;
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        for (const node of nodes) {
          if (!node.hub) continue;
          ctx.drawImage(glow, node.x - size / 2, node.y - size / 2, size, size);
          ctx.moveTo(node.x + node.r, node.y);
          ctx.arc(node.x, node.y, node.r, 0, TAU);
        }
        ctx.fill();

        if (!revealed) {
          revealed = true;
          canvas.classList.add('is-ready');
        }
      };

      const frame = (now) => {
        rafId = 0;
        if (!running) return;
        const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
        lastTime = now;
        step(dt);
        draw();
        rafId = requestAnimationFrame(frame);
      };

      const start = () => {
        if (running || prefersReducedMotion.value || !visible || document.hidden) return;
        running = true;
        lastTime = 0;
        rafId = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };
      const renderStatic = () => {
        stop();
        pointer.active = false;
        draw();
      };

      // Ponteiro (mouse ou dedo): nunca chama preventDefault, a rolagem continua intacta
      const setPointer = (event) => {
        if (prefersReducedMotion.value) return;
        pointer.x = event.clientX;
        pointer.y = event.pageY - heroTop;
        pointer.active = true;
      };
      const releasePointer = () => { pointer.active = false; };
      hero.addEventListener('pointermove', setPointer, { passive: true });
      hero.addEventListener('pointerdown', setPointer, { passive: true });
      hero.addEventListener('pointerleave', releasePointer, { passive: true });
      hero.addEventListener('pointercancel', releasePointer, { passive: true });
      hero.addEventListener('pointerup', (event) => { if (event.pointerType !== 'mouse') releasePointer(); }, { passive: true });

      // Inicia depois do primeiro quadro: o canvas nunca atrasa o LCP
      requestAnimationFrame(() => {
        setTimeout(() => {
          run('neural:inicio', () => {
            resize();
            if (prefersReducedMotion.value) renderStatic();
            else start();

            let resizeTimer = 0;
            const scheduleResize = () => {
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(() => run('neural:resize', resize), 150);
            };
            if ('ResizeObserver' in window) new ResizeObserver(scheduleResize).observe(hero);
            else window.addEventListener('resize', scheduleResize, { passive: true });

            onVisible(hero, (isVisible) => {
              visible = isVisible;
              if (isVisible) start();
              else stop();
            });
            onTabVisibility((isVisible) => (isVisible ? start() : stop()));
            prefersReducedMotion.subscribe((reduce) => (reduce ? renderStatic() : start()));
          });
        }, 0);
      });
    }

    /* ==========================================================
       TÍTULOS ESCRITOS COMO A LOGO: códigos que se embaralham e viram letra, com o cursor do terminal
       ========================================================== */
    function initTitles() {
      const titles = $$('main h1, main h2, .footer__closing');
      if (!titles.length) return;
      // Os mesmos símbolos que se embaralham na logo animada
      const GLYPHS = ['0', '1', '<', '>', '/', '{', '}', '#', '$', '%', '&', '*', '+', '=', '?'];
      const STEPS = 5;
      const STEP_MS = 45;
      titles.forEach((title) => {
        // Sai o efeito antigo de surgir recortado: o título passa a ser escrito
        if (title.dataset.reveal === 'title') delete title.dataset.reveal;
        title.removeAttribute('data-typewriter');
      });
      const settle = (title) => {
        title.classList.add('tt-on', 'is-revealed');
      };
      if (prefersReducedMotion.value) {
        titles.forEach(settle);
        return;
      }

      const split = (title) => {
        title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
        const chars = [];
        const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, {
          acceptNode: (node) => (node.parentElement.closest('svg') || !node.textContent.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
          const frag = document.createDocumentFragment();
          for (const char of node.textContent) {
            if (/\s/.test(char)) {
              frag.appendChild(document.createTextNode(char));
              continue;
            }
            const span = document.createElement('span');
            span.className = 'tt-c is-hid';
            span.textContent = char;
            frag.appendChild(span);
            chars.push(span);
          }
          node.parentNode.replaceChild(frag, node);
        });
        title.classList.add('tt-on');
        return chars;
      };

      const type = (title, chars, wait) => {
        const n = chars.length;
        if (!n) { settle(title); return; }
        // Títulos longos andam mais rápido: a escrita inteira fica entre meio segundo e um segundo e meio
        const gap = Math.max(16, Math.min(60, 1400 / n));
        // Um único cursor, deitado como o da logo, que anda logo depois da letra que está sendo escrita
        const cur = document.createElement('span');
        cur.className = 'tt-cur';
        cur.setAttribute('aria-hidden', 'true');
        let at = null;
        const moveCaret = (el, before) => {
          const key = before ? -1 : el;
          if (at === key) return;
          at = key;
          if (before) el.before(cur); else el.after(cur);
        };
        moveCaret(chars[0], true);
        title.classList.add('tt-wait');
        const state = new Array(n).fill(-1);
        let start = 0;
        const tick = (now) => {
          if (!start) start = now;
          const t = now - start;
          let head = -1;
          let done = true;
          for (let i = 0; i < n; i += 1) {
            const local = t - i * gap;
            let next;
            if (local < 0) { next = -1; done = false; }
            else if (local < STEPS * STEP_MS) { next = Math.floor(local / STEP_MS); done = false; head = i; }
            else { next = STEPS; head = i; }
            if (next === state[i]) continue;
            const el = chars[i];
            if (next < 0) {
              el.classList.add('is-hid');
            } else if (next < STEPS) {
              el.classList.remove('is-hid');
              el.classList.add('is-scr');
              el.dataset.s = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            } else {
              el.classList.remove('is-hid', 'is-scr');
              delete el.dataset.s;
            }
            state[i] = next;
          }
          if (head >= 0) moveCaret(chars[head]);
          if (!done) { requestAnimationFrame(tick); return; }
          moveCaret(chars[n - 1]);
          title.classList.remove('tt-wait');
          title.classList.add('tt-done', 'is-revealed');
        };
        // O cursor pisca um instante antes, como o terminal esperando o primeiro caractere
        setTimeout(() => {
          title.classList.remove('tt-wait');
          requestAnimationFrame(tick);
        }, wait);
      };

      const hero = $('.hero__title');
      const queue = new Map();
      titles.forEach((title) => queue.set(title, split(title)));
      const play = (title, wait) => {
        const chars = queue.get(title);
        if (!chars) return;
        queue.delete(title);
        type(title, chars, wait);
      };
      if (hero && queue.has(hero)) {
        // Na página inicial, o título espera a abertura terminar para ser escrito à vista
        const chars = queue.get(hero);
        queue.delete(hero);
        (window.tirvoIntro?.done ?? Promise.resolve()).then(() => type(hero, chars, window.tirvoIntro ? 450 : 350));
      }
      if (!hasIO) {
        queue.forEach((_chars, title) => play(title, 250));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          play(entry.target, entry.target.tagName === 'H1' ? 450 : 260);
        }
      }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
      queue.forEach((_chars, title) => observer.observe(title));
      prefersReducedMotion.subscribe((reduce) => {
        if (!reduce) return;
        observer.disconnect();
        $$('.tt-c').forEach((el) => el.classList.remove('is-hid', 'is-scr'));
        titles.forEach(settle);
      });
    }

    /* ==========================================================
       CTAs MAGNÉTICOS
       ========================================================== */
    function initMagnetic() {
      const elements = $$('[data-magnetic]');
      if (!elements.length) return;
      const MAX = 8;
      const visibleSet = new Set();
      let pointerX = -9999;
      let pointerY = -9999;
      let enabled = false;

      if (hasIO) {
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visibleSet.add(entry.target);
            else {
              visibleSet.delete(entry.target);
              release(entry.target);
            }
          }
        });
        elements.forEach((element) => observer.observe(element));
      } else {
        elements.forEach((element) => visibleSet.add(element));
      }

      function release(element) {
        if (!element.classList.contains('is-magnet')) return;
        element.classList.remove('is-magnet');
        element.style.translate = '0px 0px';
      }

      const update = () => {
        if (!enabled) return;
        const list = [...visibleSet];
        // Primeiro todas as leituras de layout, depois todas as escritas
        const rects = list.map((element) => element.getBoundingClientRect());
        list.forEach((element, index) => {
          const rect = rects[index];
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = pointerX - cx;
          const dy = pointerY - cy;
          const zone = Math.max(rect.width, rect.height) / 2 + 60;
          if (Math.hypot(dx, dy) < zone) {
            element.classList.add('is-magnet');
            const tx = clamp((dx / zone) * MAX * 1.6, -MAX, MAX);
            const ty = clamp((dy / zone) * MAX * 1.6, -MAX, MAX);
            element.style.translate = `${tx.toFixed(2)}px ${ty.toFixed(2)}px`;
          } else {
            release(element);
          }
        });
      };
      const onMove = rafThrottle(update);
      const handler = (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        onMove();
      };

      const evaluate = () => {
        const shouldEnable = isFinePointer() && !prefersReducedMotion.value;
        if (shouldEnable === enabled) return;
        enabled = shouldEnable;
        if (enabled) window.addEventListener('pointermove', handler, { passive: true });
        else {
          window.removeEventListener('pointermove', handler);
          elements.forEach(release);
        }
      };
      evaluate();
      prefersReducedMotion.subscribe(evaluate);
      finePointerQuery.addEventListener('change', evaluate);
    }

    /* ==========================================================
       CARTÕES COM HOLOFOTE
       ========================================================== */
    function initSpotlight() {
      const cards = $$('[data-spotlight]');
      if (!cards.length || !isFinePointer()) return;
      let rectsStale = true;
      window.addEventListener('scroll', () => { rectsStale = true; }, { passive: true });
      window.addEventListener('resize', () => { rectsStale = true; }, { passive: true });

      cards.forEach((card) => {
        let rect = null;
        let x = 0;
        let y = 0;
        let stamp = -1;
        const write = rafThrottle(() => {
          card.style.setProperty('--mx', `${x.toFixed(1)}px`);
          card.style.setProperty('--my', `${y.toFixed(1)}px`);
        });
        card.addEventListener('pointerenter', () => { rect = null; }, { passive: true });
        card.addEventListener('pointermove', (event) => {
          if (!rect || rectsStale || stamp < 0) {
            rect = card.getBoundingClientRect();
            rectsStale = false;
            stamp = 1;
          }
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          write();
        }, { passive: true });
        card.addEventListener('pointerleave', () => { rect = null; stamp = -1; }, { passive: true });
      });
    }

    /* ==========================================================
       LINHA DO TEMPO DESENHADA PELA ROLAGEM (fallback)
       ========================================================== */
    function initTimeline() {
      const timeline = $('[data-timeline]');
      if (!timeline || supports('animation-timeline: view()')) return;
      if (prefersReducedMotion.value || !hasIO) {
        timeline.classList.add('is-drawn');
        return;
      }
      const stop = onVisible(timeline, (visible) => {
        if (!visible) return;
        timeline.classList.add('is-drawn');
        stop();
      }, { threshold: 0.3 });
    }

    /* ==========================================================
       SELOS COM ANÉIS GIRATÓRIOS
       ========================================================== */
    function initSeals() {
      observeScope($('.seals[data-anim-scope]'));
    }

    /* ==========================================================
       PIPELINE DO NEXUS (pulso de dados)
       ========================================================== */
    function initNexusPipeline() {
      observeScope($('#nexus[data-anim-scope]'));
    }

    /* ==========================================================
       TERMINAL DOS AGENTES DO NEXUS
       ========================================================== */
    function initNexusTerminal() {
      const terminal = $('[data-terminal]');
      if (!terminal) return;
      const lines = $$('.term__line', terminal);
      if (!lines.length || prefersReducedMotion.value) return;

      const CHAR_MS = 17;
      const LINE_PAUSE = 220;
      const HOLD_MS = 4000;
      const phases = [];
      lines.forEach((line, index) => {
        const length = line.textContent.length;
        phases.push({ line, duration: clamp(length * CHAR_MS, 240, 1100), steps: Math.max(1, length) });
        phases.push({ duration: index === lines.length - 1 ? HOLD_MS : LINE_PAUSE });
      });

      terminal.classList.add('is-armed');
      let index = 0;
      let elapsed = 0;
      let last = 0;
      let rafId = 0;
      let visible = false;

      const reset = () => {
        lines.forEach((line) => line.style.setProperty('--p', '0'));
        index = 0;
      };
      const frame = (now) => {
        rafId = 0;
        if (!visible || document.hidden) {
          last = 0;
          return;
        }
        const dt = last ? Math.min(now - last, 100) : 16;
        last = now;
        elapsed += dt;
        let phase = phases[index];
        while (phase && elapsed >= phase.duration) {
          elapsed -= phase.duration;
          if (phase.line) phase.line.style.setProperty('--p', '1');
          index += 1;
          if (index >= phases.length) reset();
          phase = phases[index];
        }
        if (phase?.line) {
          const progress = Math.floor((elapsed / phase.duration) * phase.steps) / phase.steps;
          phase.line.style.setProperty('--p', progress.toFixed(4));
        }
        rafId = requestAnimationFrame(frame);
      };
      const resume = () => {
        if (!rafId && visible && !document.hidden) {
          last = 0;
          rafId = requestAnimationFrame(frame);
        }
      };

      onVisible(terminal, (isVisible) => {
        visible = isVisible;
        resume();
      }, { threshold: 0.25 });
      onTabVisibility(resume);
      prefersReducedMotion.subscribe((reduce) => {
        if (!reduce) return;
        visible = false;
        terminal.classList.remove('is-armed');
      });
    }

    /* ==========================================================
       LIGHTBOX COM ZOOM (dialog nativo)
       ========================================================== */
    function initLightbox() {
      const dialog = $('[data-lightbox]');
      if (!dialog || typeof dialog.showModal !== 'function') return null;
      const cfg = CONFIG.lightbox;
      const stage = $('[data-lb-stage]', dialog);
      const counter = $('[data-lb-counter]', dialog);
      const caption = $('[data-lb-caption]', dialog);
      const zoomLabel = $('[data-lb-zoom]', dialog);
      const hint = $('[data-lb-hint]', dialog);
      const prevButton = $('[data-lb-prev]', dialog);
      const nextButton = $('[data-lb-next]', dialog);

      let items = [];
      let index = 0;
      let trigger = null;
      let onClose = null;
      let image = null;
      let loadToken = 0;
      let hintShown = false;
      let hintTimer = 0;
      let renderQueued = false;
      let lastPointerType = 'mouse';
      const view = { s: 1, x: 0, y: 0, fitW: 0, fitH: 0, natW: 0, natH: 0, stageW: 0, stageH: 0, left: 0, top: 0, max: cfg.maxScale };

      const render = () => {
        if (renderQueued) return;
        renderQueued = true;
        requestAnimationFrame(() => {
          renderQueued = false;
          if (!image) return;
          image.style.transform = `translate3d(${view.x.toFixed(2)}px, ${view.y.toFixed(2)}px, 0) scale(${view.s.toFixed(4)})`;
          zoomLabel.textContent = `${Math.round(view.s * 100)}%`;
          stage.classList.toggle('is-zoomed', view.s > 1.001);
        });
      };

      const measureStage = () => {
        const rect = stage.getBoundingClientRect();
        view.stageW = rect.width;
        view.stageH = rect.height;
        view.left = rect.left;
        view.top = rect.top;
      };

      // Mantém a imagem sempre dentro da área visível
      const clampPan = () => {
        const w = view.fitW * view.s;
        const h = view.fitH * view.s;
        view.x = w <= view.stageW ? (view.stageW - w) / 2 : clamp(view.x, view.stageW - w, 0);
        view.y = h <= view.stageH ? (view.stageH - h) / 2 : clamp(view.y, view.stageH - h, 0);
      };

      const fit = () => {
        if (!image || !view.natW) return;
        measureStage();
        const k = Math.min(view.stageW / view.natW, view.stageH / view.natH, 1);
        view.fitW = view.natW * k;
        view.fitH = view.natH * k;
        image.style.width = `${view.fitW}px`;
        image.style.height = `${view.fitH}px`;
        view.max = Math.max(cfg.maxScale, view.natW / view.fitW);
        view.s = 1;
        clampPan();
        render();
      };

      const zoomTo = (scale, px = view.stageW / 2, py = view.stageH / 2) => {
        if (!image) return;
        const next = clamp(scale, 1, view.max);
        const k = next / view.s;
        view.x = px - (px - view.x) * k;
        view.y = py - (py - view.y) * k;
        view.s = next;
        clampPan();
        render();
      };

      const toggleZoomAt = (clientX, clientY) => {
        if (view.s > 1.001) zoomTo(1);
        else zoomTo(cfg.doubleTapScale, clientX - view.left, clientY - view.top);
      };

      const load = (target) => {
        index = (target + items.length) % items.length;
        const item = items[index];
        counter.textContent = `${index + 1} / ${items.length}`;
        caption.textContent = item.caption;
        const token = ++loadToken;
        const next = new Image();
        next.className = 'lightbox__img';
        next.alt = item.alt;
        next.decoding = 'async';
        next.draggable = false;
        next.addEventListener('load', () => {
          if (token !== loadToken || !dialog.open) return;
          view.natW = next.naturalWidth;
          view.natH = next.naturalHeight;
          image?.remove();
          image = next;
          stage.prepend(next);
          fit();
        }, { once: true });
        next.src = item.src;
      };

      const go = (direction) => {
        if (items.length < 2) return;
        load(index + direction);
      };

      // Gestos: arrastar, pinça, toque duplo e deslizar
      const pointers = new Map();
      let gesture = null;
      let moved = false;
      let downTarget = null;
      let lastTap = { t: 0, x: 0, y: 0 };

      const midpoint = () => {
        const [a, b] = [...pointers.values()];
        return { x: (a.x + b.x) / 2 - view.left, y: (a.y + b.y) / 2 - view.top, d: Math.hypot(a.x - b.x, a.y - b.y) };
      };
      const beginPan = (x, y, timeStamp = 0) => {
        gesture = { type: 'pan', startX: x, startY: y, x0: view.x, y0: view.y, t0: timeStamp };
      };

      stage.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) return;
        lastPointerType = event.pointerType;
        // Com a captura, pointerup e click passam a mirar o palco: o alvo real fica guardado aqui
        if (pointers.size === 0) downTarget = event.target;
        stage.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        measureStage();
        if (pointers.size === 1) {
          moved = false;
          beginPan(event.clientX, event.clientY, event.timeStamp);
        } else if (pointers.size === 2) {
          const mid = midpoint();
          gesture = { type: 'pinch', d0: Math.max(1, mid.d), s0: view.s, ix: (mid.x - view.x) / view.s, iy: (mid.y - view.y) / view.s };
          moved = true;
        }
      });

      stage.addEventListener('pointermove', (event) => {
        if (!pointers.has(event.pointerId)) return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (!gesture || !image) return;
        if (gesture.type === 'pinch' && pointers.size >= 2) {
          const mid = midpoint();
          const scale = clamp(gesture.s0 * (mid.d / gesture.d0), 1, view.max);
          view.s = scale;
          view.x = mid.x - gesture.ix * scale;
          view.y = mid.y - gesture.iy * scale;
          clampPan();
          render();
        } else if (gesture.type === 'pan') {
          const dx = event.clientX - gesture.startX;
          const dy = event.clientY - gesture.startY;
          if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
          if (view.s > 1.001) {
            view.x = gesture.x0 + dx;
            view.y = gesture.y0 + dy;
            clampPan();
            render();
            stage.classList.add('is-panning');
          }
        }
      });

      const endPointer = (event) => {
        if (!pointers.has(event.pointerId)) return;
        const current = gesture;
        pointers.delete(event.pointerId);
        stage.classList.remove('is-panning');
        if (current?.type === 'pan' && event.type === 'pointerup' && pointers.size === 0) {
          const dx = event.clientX - current.startX;
          const dy = event.clientY - current.startY;
          if (view.s <= 1.001 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            go(dx < 0 ? 1 : -1);
          } else if (!moved && event.pointerType !== 'mouse' && downTarget === image) {
            const isDouble = event.timeStamp - lastTap.t < 300 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 30;
            if (isDouble) {
              toggleZoomAt(event.clientX, event.clientY);
              lastTap = { t: 0, x: 0, y: 0 };
            } else {
              lastTap = { t: event.timeStamp, x: event.clientX, y: event.clientY };
            }
          }
        }
        if (pointers.size === 1) {
          const [remaining] = [...pointers.values()];
          beginPan(remaining.x, remaining.y);
        } else if (pointers.size === 0) {
          gesture = null;
        }
      };
      stage.addEventListener('pointerup', endPointer);
      stage.addEventListener('pointercancel', endPointer);

      stage.addEventListener('dblclick', (event) => {
        if (lastPointerType !== 'mouse' || downTarget !== image) return;
        toggleZoomAt(event.clientX, event.clientY);
      });

      // Clique no fundo fecha; clique na imagem não
      stage.addEventListener('click', (event) => {
        if (downTarget === stage && !moved) dialog.close();
      });

      stage.addEventListener('wheel', (event) => {
        if (!image) return;
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 0.05 : 0.0015;
        zoomTo(view.s * Math.exp(-event.deltaY * unit), event.clientX - view.left, event.clientY - view.top);
      }, { passive: false });

      $('[data-lb-close]', dialog).addEventListener('click', () => dialog.close());
      prevButton.addEventListener('click', () => go(-1));
      nextButton.addEventListener('click', () => go(1));
      $('[data-lb-zoom-in]', dialog).addEventListener('click', () => zoomTo(view.s * 1.25));
      $('[data-lb-zoom-out]', dialog).addEventListener('click', () => zoomTo(view.s / 1.25));
      $('[data-lb-reset]', dialog).addEventListener('click', () => zoomTo(1));
      $('[data-lb-actual]', dialog).addEventListener('click', () => {
        if (view.fitW) zoomTo(view.natW / view.fitW);
      });

      dialog.addEventListener('keydown', (event) => {
        if (event.target.closest('input, textarea')) return;
        switch (event.key) {
          case 'ArrowRight': event.preventDefault(); go(1); break;
          case 'ArrowLeft': event.preventDefault(); go(-1); break;
          case '+':
          case '=': event.preventDefault(); zoomTo(view.s * 1.25); break;
          case '-':
          case '_': event.preventDefault(); zoomTo(view.s / 1.25); break;
          case '0': event.preventDefault(); zoomTo(1); break;
          default: break;
        }
      });

      const onResize = rafThrottle(() => fit());

      dialog.addEventListener('close', () => {
        root.classList.remove('is-lightbox-open');
        lockScroll(false);
        window.removeEventListener('resize', onResize);
        clearTimeout(hintTimer);
        hint.classList.remove('is-visible');
        loadToken += 1;
        image?.remove();
        image = null;
        pointers.clear();
        gesture = null;
        trigger?.focus({ preventScroll: true });
        const callback = onClose;
        onClose = null;
        callback?.(index);
      });

      return {
        open(list, startIndex, triggerElement, closeCallback) {
          if (!list.length) return;
          items = list;
          trigger = triggerElement || null;
          onClose = closeCallback || null;
          prevButton.hidden = items.length < 2;
          nextButton.hidden = items.length < 2;
          dialog.showModal();
          root.classList.add('is-lightbox-open');
          lockScroll(true);
          window.addEventListener('resize', onResize, { passive: true });
          load(startIndex);
          if (!hintShown) {
            hintShown = true;
            hint.classList.add('is-visible');
            hintTimer = setTimeout(() => hint.classList.remove('is-visible'), cfg.hintMs);
          }
        },
      };
    }

    /* ==========================================================
       CARROSSEL DO NEXUS (laço infinito, padrão APG)
       ========================================================== */
    function initCarousel(lightbox) {
      const carousel = $('[data-carousel]');
      if (!carousel) return;
      const track = $('[data-carousel-track]', carousel);
      const viewport = $('[data-carousel-viewport]', carousel);
      const frameEl = $('.carousel__frame', carousel);
      const slides = $$('[data-slide]', track);
      const total = slides.length;
      if (!total) return;

      const addr = $('[data-carousel-addr]', carousel);
      const captionEl = $('[data-carousel-caption]', carousel);
      const counterEl = $('[data-carousel-counter]', carousel);
      const pad = (value) => String(value).padStart(2, '0');
      const items = slides.map((slide) => {
        const img = $('img', slide);
        return { src: img.getAttribute('src'), alt: img.alt, caption: slide.dataset.caption || '' };
      });
      const updateMeta = (i) => {
        addr.textContent = `NEXUS://tela-${pad(i + 1)}`;
        captionEl.textContent = items[i].caption;
        counterEl.textContent = `${pad(i + 1)} / ${pad(total)}`;
      };

      // Uma única tela: só o lightbox
      if (total === 1) {
        updateMeta(0);
        const button = $('.carousel__open', slides[0]);
        button?.addEventListener('click', () => lightbox?.open(items, 0, button));
        return;
      }

      carousel.classList.add('is-enhanced');
      const controls = $('[data-carousel-controls]', carousel);
      const dots = $('[data-carousel-dots]', carousel);
      const toggle = $('[data-carousel-toggle]', carousel);
      const iconPause = $('[data-icon-pause]', toggle);
      const iconPlay = $('[data-icon-play]', toggle);
      controls.hidden = false;
      dots.hidden = false;
      $$('.carousel__side', carousel).forEach((button) => { button.hidden = false; });

      // Clones para o laço contínuo (aria-hidden e inertes)
      const CLONES = Math.min(2, total);
      const makeClone = (slide) => {
        const clone = slide.cloneNode(true);
        clone.removeAttribute('data-slide');
        clone.removeAttribute('role');
        clone.removeAttribute('aria-roledescription');
        clone.removeAttribute('aria-label');
        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true;
        clone.classList.add('is-clone');
        return clone;
      };
      slides.slice(-CLONES).forEach((slide) => track.insertBefore(makeClone(slide), slides[0]));
      slides.slice(0, CLONES).forEach((slide) => track.appendChild(makeClone(slide)));
      const all = $$('.carousel__slide', track);

      // Indicadores em segmentos (estilo stories)
      const segments = items.map((item, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'carousel__seg';
        button.setAttribute('aria-label', `Ir para a tela ${i + 1}`);
        const fill = document.createElement('span');
        fill.className = 'carousel__seg-fill';
        button.appendChild(fill);
        button.addEventListener('click', () => goTo(i, { user: true }));
        dots.appendChild(button);
        return { button, fill };
      });

      let current = 0;
      let position = CLONES;
      let pendingJump = false;
      let jumpTimer = 0;

      const setPosition = (value, animate) => {
        track.classList.toggle('is-jumping', !animate);
        track.style.setProperty('--pos', String(value));
        all.forEach((slide, k) => slide.classList.toggle('is-active', k === value));
      };
      const flush = () => {
        getComputedStyle(track).transform;
        all.forEach((slide) => getComputedStyle(slide).transform);
        track.classList.remove('is-jumping');
      };

      const updateState = () => {
        updateMeta(current);
        segments.forEach(({ button, fill }, i) => {
          fill.style.transform = `scaleX(${i < current ? 1 : 0})`;
          if (i === current) button.setAttribute('aria-current', 'true');
          else button.removeAttribute('aria-current');
        });
        slides.forEach((slide, i) => {
          const button = $('.carousel__open', slide);
          if (button) button.tabIndex = i === current ? 0 : -1;
        });
        // Pré-carrega a próxima tela
        const nextImg = $('img', slides[(current + 1) % total]);
        if (nextImg && nextImg.loading === 'lazy') nextImg.loading = 'eager';
      };

      const finishJump = () => {
        clearTimeout(jumpTimer);
        if (!pendingJump) return;
        pendingJump = false;
        position = CLONES + current;
        setPosition(position, false);
        flush();
      };

      function goTo(target, { user = false, direction = 0 } = {}) {
        if (pendingJump) finishJump();
        if (user) suspend();
        elapsed = 0;
        let nextPosition = CLONES + target;
        if (direction === 1 && current === total - 1 && target === 0) nextPosition = CLONES + total;
        else if (direction === -1 && current === 0 && target === total - 1) nextPosition = CLONES - 1;
        current = target;
        position = nextPosition;
        pendingJump = position !== CLONES + target;
        setPosition(position, true);
        updateState();
        if (pendingJump) jumpTimer = setTimeout(finishJump, 780);
      }
      const next = (options = {}) => goTo((current + 1) % total, { ...options, direction: 1 });
      const prev = (options = {}) => goTo((current - 1 + total) % total, { ...options, direction: -1 });

      track.addEventListener('transitionend', (event) => {
        if (event.target === track && event.propertyName === 'transform') finishJump();
      });

      // Autoplay com pausas
      const paused = { hover: false, focus: false, offscreen: true, tab: document.hidden, lightbox: false, suspended: false };
      let userPaused = prefersReducedMotion.value;
      let elapsed = 0;
      let last = 0;
      let rafId = 0;
      let resumeTimer = 0;
      const isRunning = () => !userPaused && !Object.values(paused).some(Boolean);

      const tick = (now) => {
        rafId = 0;
        if (!isRunning()) {
          last = 0;
          return;
        }
        if (last) elapsed += now - last;
        last = now;
        const progress = clamp(elapsed / CONFIG.AUTOPLAY_MS, 0, 1);
        segments[current].fill.style.transform = `scaleX(${progress.toFixed(4)})`;
        if (progress >= 1) next();
        rafId = requestAnimationFrame(tick);
      };

      const updateToggle = () => {
        toggle.setAttribute('aria-pressed', String(userPaused));
        toggle.setAttribute('aria-label', userPaused ? 'Retomar apresentação' : 'Pausar apresentação');
        iconPause.hidden = userPaused;
        iconPlay.hidden = !userPaused;
      };

      function sync() {
        const on = isRunning();
        track.setAttribute('aria-live', on ? 'off' : 'polite');
        if (on && !rafId) {
          last = 0;
          rafId = requestAnimationFrame(tick);
        }
        updateToggle();
      }

      function suspend() {
        paused.suspended = true;
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          paused.suspended = false;
          sync();
        }, CONFIG.RESUME_AFTER_MS);
        sync();
      }

      toggle.addEventListener('click', () => {
        userPaused = !userPaused;
        if (!userPaused) {
          paused.suspended = false;
          clearTimeout(resumeTimer);
        }
        sync();
      });
      $$('[data-carousel-prev]', carousel).forEach((button) => button.addEventListener('click', () => prev({ user: true })));
      $$('[data-carousel-next]', carousel).forEach((button) => button.addEventListener('click', () => next({ user: true })));

      frameEl.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse') return;
        paused.hover = true;
        sync();
      });
      frameEl.addEventListener('pointerleave', () => {
        paused.hover = false;
        sync();
      });
      frameEl.addEventListener('focusin', () => {
        paused.focus = true;
        sync();
      });
      frameEl.addEventListener('focusout', (event) => {
        if (frameEl.contains(event.relatedTarget)) return;
        paused.focus = false;
        sync();
      });
      // Visível = pelo menos 35% da tela (ou do carrossel, se for menor que a tela) ocupada por ele
      onVisible(carousel, (_, entry) => {
        const shown = entry ? entry.intersectionRect.height : Infinity;
        const needed = Math.min(entry ? entry.boundingClientRect.height : 0, window.innerHeight) * 0.35;
        paused.offscreen = !(shown > 0 && shown >= needed);
        sync();
      }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
      onTabVisibility((visible) => {
        paused.tab = !visible;
        sync();
      });
      prefersReducedMotion.subscribe((reduce) => {
        if (reduce) userPaused = true;
        sync();
      });

      // Teclado: ← e → quando o carrossel tem o foco
      carousel.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const onSlide = event.target.classList.contains('carousel__open');
        if (event.key === 'ArrowRight') next({ user: true });
        else prev({ user: true });
        if (onSlide) $('.carousel__open', slides[current])?.focus({ preventScroll: true });
      });

      // Clique/Enter na tela ativa abre o lightbox; nas vizinhas, navega
      let suppressClick = false;
      const openLightbox = (i, button) => {
        if (!lightbox) return;
        paused.lightbox = true;
        sync();
        lightbox.open(items, i, button, (finalIndex) => {
          paused.lightbox = false;
          if (typeof finalIndex === 'number' && finalIndex !== current) {
            goTo(finalIndex, { user: true });
            $('.carousel__open', slides[current])?.focus({ preventScroll: true });
          }
          sync();
        });
      };
      slides.forEach((slide, i) => {
        const button = $('.carousel__open', slide);
        button?.addEventListener('click', (event) => {
          if (suppressClick) {
            event.preventDefault();
            return;
          }
          if (i !== current) goTo(i, { user: true });
          else openLightbox(i, button);
        });
      });

      // Arrastar/deslizar via Pointer Events (touch-action: pan-y preserva a rolagem vertical)
      let drag = null;
      viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('.carousel__side')) return;
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp, dx: 0, active: false };
      });
      viewport.addEventListener('pointermove', (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (!drag.active) {
          if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
            drag.active = true;
            if (pendingJump) finishJump();
            viewport.setPointerCapture(event.pointerId);
            track.classList.add('is-dragging');
            suspend();
          } else if (Math.abs(dy) > 10) {
            drag = null;
            return;
          }
        }
        if (drag.active) {
          drag.dx = dx;
          track.style.setProperty('--drag', `${dx.toFixed(1)}px`);
        }
      });
      const endDrag = (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        if (drag.active) {
          const velocity = drag.dx / Math.max(1, event.timeStamp - drag.t);
          track.classList.remove('is-dragging');
          track.style.setProperty('--drag', '0px');
          if (drag.dx <= -CONFIG.SWIPE_THRESHOLD || velocity < -0.5) next({ user: true });
          else if (drag.dx >= CONFIG.SWIPE_THRESHOLD || velocity > 0.5) prev({ user: true });
          suppressClick = true;
          setTimeout(() => { suppressClick = false; }, 60);
        }
        drag = null;
      };
      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
      viewport.addEventListener('dragstart', (event) => event.preventDefault());

      setPosition(position, false);
      flush();
      updateState();
      sync();
    }

    /* ==========================================================
       CONTADORES
       ========================================================== */
    function initCounters() {
      const wrap = $('[data-counters]');
      if (!wrap) return;
      const numbers = $$('[data-count-to]', wrap);
      const ignite = $('[data-ignite]', wrap);
      // Valores finais já estão no HTML (sem JS, SEO e movimento reduzido)
      if (!numbers.length || !hasIO || prefersReducedMotion.value) return;

      let finished = false;
      const finish = () => {
        finished = true;
        numbers.forEach((el) => { el.textContent = el.dataset.countTo; });
        ignite?.classList.add('is-ignited');
      };
      numbers.forEach((el) => { el.textContent = el.dataset.countFrom; });
      ignite?.classList.remove('is-ignited');

      const animate = () => {
        const start = performance.now();
        const frame = (now) => {
          if (finished) return;
          const t = clamp((now - start) / CONFIG.counters.duration, 0, 1);
          const eased = easeOutExpo(t);
          numbers.forEach((el) => {
            const value = Math.round(lerp(Number(el.dataset.countFrom), Number(el.dataset.countTo), eased));
            el.textContent = String(value);
          });
          if (t < 1) requestAnimationFrame(frame);
          else finish();
        };
        requestAnimationFrame(frame);
      };

      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        animate();
      }, { threshold: CONFIG.counters.threshold });
      observer.observe(wrap);
      prefersReducedMotion.subscribe((reduce) => {
        if (!reduce) return;
        observer.disconnect();
        finish();
      });
    }

    /* ==========================================================
       FAQ (details exclusivo + animação suave)
       ========================================================== */
    function initFaq() {
      const items = $$('[data-faq-item]');
      if (!items.length) return;
      const nativeExclusive = 'name' in HTMLDetailsElement.prototype;
      const cssSmooth = supports('interpolate-size: allow-keywords') && supports('selector(::details-content)');

      if (!nativeExclusive) {
        items.forEach((item) => {
          item.addEventListener('toggle', () => {
            if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
          });
        });
      }
      if (cssSmooth || typeof Element.prototype.animate !== 'function') return;

      // Fallback com Web Animations API
      items.forEach((item) => {
        const summary = $('summary', item);
        const answer = $('.faq__a', item);
        let animation = null;
        summary.addEventListener('click', (event) => {
          if (prefersReducedMotion.value) return;
          event.preventDefault();
          animation?.cancel();
          answer.style.overflow = 'clip';
          if (!item.open) {
            item.open = true;
            const height = answer.offsetHeight;
            animation = answer.animate([{ height: '0px', opacity: 0 }, { height: `${height}px`, opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.16, 1, .3, 1)' });
          } else {
            const height = answer.offsetHeight;
            animation = answer.animate([{ height: `${height}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.65, 0, .35, 1)' });
            animation.addEventListener('finish', () => { item.open = false; });
          }
          animation.addEventListener('finish', () => {
            answer.style.overflow = '';
            animation = null;
          });
        });
      });
    }

    /* ==========================================================
       FORMULÁRIO → WHATSAPP: serialização
       ========================================================== */

    // Converte o DOM do editor em trechos { t, b, i } e quebras { br } — lê apenas textContent
    function extractRuns(container) {
      const runs = [];
      const endsWithBreak = () => !runs.length || runs[runs.length - 1].br;
      const walk = (node, format) => {
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent.replace(/ /g, ' ').replace(/[\r\n]+/g, ' ');
            if (text) runs.push({ t: text, b: format.b, i: format.i });
            return;
          }
          if (child.nodeType !== Node.ELEMENT_NODE) return;
          const tag = child.tagName;
          if (tag === 'BR') {
            // Ignora o <br> final de preenchimento que alguns navegadores inserem
            if (child === child.parentNode.lastChild && child.previousSibling) return;
            runs.push({ br: true });
            return;
          }
          const block = tag === 'DIV' || tag === 'P' || tag === 'LI';
          const style = child.style;
          const weight = style.fontWeight;
          const bold = format.b || tag === 'B' || tag === 'STRONG' || weight === 'bold' || Number(weight) >= 600;
          const italic = format.i || tag === 'I' || tag === 'EM' || style.fontStyle === 'italic';
          if (block && !endsWithBreak()) runs.push({ br: true });
          walk(child, { b: bold, i: italic });
        });
      };
      walk(container, { b: false, i: false });
      return runs;
    }

    const runsToPlain = (runs) => runs.map((run) => (run.br ? '\n' : run.t)).join('');

    // Marcação do WhatsApp: *negrito*, _itálico_, *_ambos_*
    function serializeToWhatsApp(runs) {
      const merged = [];
      for (const run of runs) {
        if (run.br) {
          merged.push({ br: true });
          continue;
        }
        const previous = merged[merged.length - 1];
        if (previous && !previous.br && previous.b === run.b && previous.i === run.i) previous.t += run.t;
        else merged.push({ t: run.t, b: run.b, i: run.i });
      }
      let output = '';
      for (const run of merged) {
        if (run.br) {
          output += '\n';
          continue;
        }
        if (!run.b && !run.i) {
          output += run.t;
          continue;
        }
        const [, lead, core, trail] = run.t.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!core) {
          output += run.t;
          continue;
        }
        const open = run.b && run.i ? '*_' : run.b ? '*' : '_';
        const close = run.b && run.i ? '_*' : run.b ? '*' : '_';
        output += `${lead}${open}${core}${close}${trail}`;
      }
      return output
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    }

    function buildWhatsAppMessage({ nome, empresa, servicos, desafio }) {
      const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
      return [
        '*Novo contato pelo site da Tirvo*',
        '',
        `*Nome:* ${clean(nome)}`,
        `*Empresa:* ${clean(empresa) || 'Não informada'}`,
        `*Serviços de interesse:* ${servicos.length ? servicos.join(', ') : 'A definir'}`,
        '',
        '*Desafio / necessidade:*',
        desafio,
      ].join('\n');
    }

    /* ==========================================================
       FORMULÁRIO → WHATSAPP: editor rico
       ========================================================== */
    function createRichEditor(area, { maxChars, toolbar, onChange }) {
      const formatButtons = $$('[data-format]', toolbar);
      const canFormat = typeof document.execCommand === 'function'
        && (typeof document.queryCommandSupported !== 'function' || document.queryCommandSupported('bold'));
      if (!canFormat) {
        formatButtons.forEach((button) => { button.hidden = true; });
        const separator = $('[data-format-sep]', toolbar);
        if (separator) separator.hidden = true;
      }

      let savedRange = null;
      const isInside = (node) => !!node && area.contains(node);
      const runs = () => extractRuns(area);
      const plain = () => (area.textContent.length ? runsToPlain(runs()) : '');
      const length = () => plain().length;
      const selectedLength = () => {
        const selection = document.getSelection();
        if (!selection || !selection.rangeCount || !isInside(selection.anchorNode)) return 0;
        return selection.toString().length;
      };

      const changed = (silent = false) => {
        area.dataset.empty = String(area.textContent.length === 0);
        if (!silent) onChange?.();
      };

      const updateToolbar = () => {
        if (!canFormat) return;
        const selection = document.getSelection();
        if (!selection || !isInside(selection.anchorNode)) return;
        formatButtons.forEach((button) => {
          const command = button.dataset.format;
          if (command !== 'bold' && command !== 'italic') return;
          let active = false;
          try { active = document.queryCommandState(command); } catch { active = false; }
          button.setAttribute('aria-pressed', String(active));
        });
      };

      const exec = (command) => {
        if (!canFormat) return;
        area.focus();
        try {
          document.execCommand('styleWithCSS', false, false);
          document.execCommand(command, false, null);
        } catch {
          /* comando indisponível neste navegador */
        }
        updateToolbar();
        changed();
      };

      const endRange = () => {
        const range = document.createRange();
        range.selectNodeContents(area);
        range.collapse(false);
        return range;
      };
      const currentRange = () => {
        const selection = document.getSelection();
        if (selection && selection.rangeCount && isInside(selection.anchorNode)) return selection.getRangeAt(0);
        if (savedRange && isInside(savedRange.startContainer)) return savedRange;
        return endRange();
      };
      const textBefore = (range) => {
        const probe = document.createRange();
        probe.selectNodeContents(area);
        probe.setEnd(range.startContainer, range.startOffset);
        return probe.toString();
      };

      // Inserção manual por nós de texto (nunca innerHTML)
      const insertNodes = (text, range, moveCaret) => {
        const fragment = document.createDocumentFragment();
        text.split('\n').forEach((part, index) => {
          if (index) fragment.appendChild(document.createElement('br'));
          if (part) fragment.appendChild(document.createTextNode(part));
        });
        const lastNode = fragment.lastChild;
        range.deleteContents();
        range.insertNode(fragment);
        if (lastNode) {
          const after = document.createRange();
          after.setStartAfter(lastNode);
          after.collapse(true);
          savedRange = after.cloneRange();
          if (moveCaret) {
            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(after);
          }
        }
      };

      const announceLimit = () => onChange?.({ limit: true });

      const insertPlain = (text) => {
        const room = maxChars - length() + selectedLength();
        if (room <= 0) {
          announceLimit();
          return;
        }
        const chunk = text.slice(0, room);
        area.focus();
        let inserted = false;
        if (canFormat) {
          try { inserted = document.execCommand('insertText', false, chunk); } catch { inserted = false; }
        }
        if (!inserted) insertNodes(chunk, currentRange(), true);
        changed();
      };

      const lastLeaf = (node) => {
        let leaf = node.lastChild;
        while (leaf && leaf.lastChild) leaf = leaf.lastChild;
        return leaf;
      };
      const trimToLimit = () => {
        let guard = 4000;
        while (length() > maxChars && guard > 0) {
          guard -= 1;
          const leaf = lastLeaf(area);
          if (!leaf) break;
          if (leaf.nodeType === Node.TEXT_NODE && leaf.textContent.length > 1) {
            const excess = length() - maxChars;
            leaf.textContent = leaf.textContent.slice(0, Math.max(0, leaf.textContent.length - excess));
          } else {
            leaf.remove();
          }
        }
        const selection = document.getSelection();
        if (document.activeElement === area && selection) {
          selection.removeAllRanges();
          selection.addRange(endRange());
        }
      };

      if (canFormat) {
        // styleWithCSS é aplicado a cada comando (e não na inicialização, que forçaria um layout)
        formatButtons.forEach((button) => {
          button.addEventListener('mousedown', (event) => event.preventDefault());
          button.addEventListener('click', () => exec(button.dataset.format));
        });
      }

      document.addEventListener('selectionchange', () => {
        const selection = document.getSelection();
        if (!selection || !selection.rangeCount || !isInside(selection.anchorNode)) return;
        savedRange = selection.getRangeAt(0).cloneRange();
        updateToolbar();
      });

      area.addEventListener('keydown', (event) => {
        const modifier = event.ctrlKey || event.metaKey;
        if (!modifier || event.altKey) return;
        const key = event.key.toLowerCase();
        if (key === 'b') {
          event.preventDefault();
          exec('bold');
        } else if (key === 'i') {
          event.preventDefault();
          exec('italic');
        } else if (key === 'u') {
          event.preventDefault();
        }
      });

      area.addEventListener('beforeinput', (event) => {
        const type = event.inputType || '';
        if (type.startsWith('format') && type !== 'formatBold' && type !== 'formatItalic' && type !== 'formatRemove') {
          event.preventDefault();
          return;
        }
        if (type === 'insertFromPaste' || type === 'insertFromDrop' || !type.startsWith('insert')) return;
        const room = maxChars - length() + selectedLength();
        const incoming = type === 'insertParagraph' || type === 'insertLineBreak' ? 1 : (event.data ? event.data.length : 0);
        if (incoming > room && type !== 'insertCompositionText') {
          event.preventDefault();
          if (room > 0 && type === 'insertText' && event.data) insertPlain(event.data.slice(0, room));
          else announceLimit();
        }
      });

      area.addEventListener('input', () => {
        if (length() > maxChars) {
          trimToLimit();
          announceLimit();
        }
        changed();
      });

      // Colar e soltar: somente texto puro
      const normalizeText = (text) => text.replace(/\r\n?/g, '\n').replace(/\t/g, ' ');
      area.addEventListener('paste', (event) => {
        event.preventDefault();
        const text = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
        if (text) insertPlain(normalizeText(text));
      });
      area.addEventListener('drop', (event) => {
        event.preventDefault();
        const text = event.dataTransfer ? event.dataTransfer.getData('text/plain') : '';
        if (text) insertPlain(normalizeText(text));
      });

      return {
        runs,
        plain,
        length,
        focus: () => area.focus(),
        clear() {
          area.replaceChildren();
          savedRange = null;
          changed(true);
        },
        // Reconstrói o rascunho com createElement/createTextNode
        setRuns(list) {
          area.replaceChildren();
          let budget = maxChars;
          for (const item of list) {
            if (budget <= 0) break;
            if (item && item.br === true) {
              area.appendChild(document.createElement('br'));
              budget -= 1;
              continue;
            }
            if (!item || typeof item.t !== 'string') continue;
            const text = item.t.slice(0, budget);
            budget -= text.length;
            let node = document.createTextNode(text);
            if (item.i === true) {
              const italic = document.createElement('i');
              italic.appendChild(node);
              node = italic;
            }
            if (item.b === true) {
              const bold = document.createElement('b');
              bold.appendChild(node);
              node = bold;
            }
            area.appendChild(node);
          }
          changed(true);
        },
        // Ditado: insere no cursor (ou no fim, se o editor não estiver focado)
        insertDictation(raw) {
          let text = String(raw || '').trim();
          if (!text) return;
          text = text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1);
          const focused = document.activeElement === area;
          const range = focused ? currentRange() : endRange();
          const before = textBefore(range);
          const chunk = (before && !/\s$/.test(before) ? ' ' : '') + text;
          const room = maxChars - length();
          if (room <= 0) {
            announceLimit();
            return;
          }
          insertNodes(chunk.slice(0, room), range, focused);
          if (chunk.length > room) announceLimit();
          changed();
        },
      };
    }

    /* ==========================================================
       FORMULÁRIO → WHATSAPP: ditado por voz (Web Speech API)
       ========================================================== */
    function createSpeechInput({ button, statusEl, interimEl, hintEl, onFinal }) {
      const inactive = { stop() {} };
      if (!button) return inactive;
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const say = (message) => announce(statusEl, message);

      if (!Recognition) {
        button.hidden = true;
        if (hintEl) {
          hintEl.textContent = 'Ditado por voz disponível no Chrome, Edge e Safari.';
          hintEl.hidden = false;
        }
        return inactive;
      }
      if (!window.isSecureContext) {
        button.disabled = true;
        button.setAttribute('aria-label', 'Ditado por voz indisponível: exige conexão segura (HTTPS)');
        if (hintEl) {
          hintEl.textContent = 'O ditado por voz exige conexão segura (HTTPS).';
          hintEl.hidden = false;
        }
        return inactive;
      }

      const ERRORS = {
        'not-allowed': 'Permissão do microfone negada. Libere o acesso nas configurações do navegador.',
        'service-not-allowed': 'Permissão do microfone negada. Libere o acesso nas configurações do navegador.',
        'no-speech': 'Não ouvimos nada. Tente novamente.',
        'audio-capture': 'Nenhum microfone encontrado.',
        network: 'Falha de conexão no reconhecimento de voz.',
      };
      let recognition = null;

      const setListening = (on) => {
        button.classList.toggle('is-listening', on);
        button.setAttribute('aria-pressed', String(on));
        if (!on && interimEl) interimEl.textContent = '';
      };
      const cleanup = () => {
        if (recognition) {
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
        }
        recognition = null;
        setListening(false);
      };
      const start = () => {
        try {
          recognition = new Recognition();
          recognition.lang = 'pt-BR';
          recognition.interimResults = true;
          recognition.continuous = true;
          recognition.maxAlternatives = 1;
          recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
              const result = event.results[i];
              if (result.isFinal) onFinal(result[0].transcript);
              else interim += result[0].transcript;
            }
            if (interimEl) interimEl.textContent = interim;
          };
          recognition.onerror = (event) => {
            const message = ERRORS[event.error];
            if (message) say(message);
          };
          recognition.onend = cleanup;
          recognition.start();
          setListening(true);
          say('Ouvindo… pode falar.');
        } catch {
          cleanup();
        }
      };
      const stop = () => {
        if (!recognition) return;
        try { recognition.stop(); } catch { cleanup(); }
      };
      const abort = () => {
        if (!recognition) return;
        const current = recognition;
        cleanup();
        try { current.abort(); } catch { /* já encerrado */ }
      };

      button.addEventListener('click', () => (recognition ? stop() : start()));
      window.addEventListener('pagehide', abort);
      return { stop: abort };
    }

    /* ==========================================================
       FORMULÁRIO → WHATSAPP: orquestração
       ========================================================== */
    function initContactForm() {
      const form = $('[data-contact-form]');
      if (!form) return;
      const cfg = CONFIG.form;
      const stack = $('[data-contact-stack]');
      const nome = form.elements.namedItem('nome');
      const empresa = form.elements.namedItem('empresa');
      const chips = $$('[data-service-chip]', form);
      const area = $('[data-editor-area]', form);
      const editorBox = $('[data-editor]', form);
      const mirror = $('[data-desafio-sync]', form);
      const counter = $('[data-counter]', form);
      const status = $('[data-form-status]', form);
      const errorNome = $('[data-error-for="nome"]', form);
      const errorDesafio = $('[data-error-for="desafio"]', form);
      const submit = $('[data-submit]', form);
      const successTitle = $('[data-success-title]');
      const successLink = $('[data-success-link]');
      const resetButton = $('[data-reset-form]');
      // Separador de milhar pt-BR (1.500) sem instanciar o Intl, cuja carga do ICU custa caro na inicialização
      const number = { format: (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.') };
      const interacted = { nome: false, desafio: false };
      const touched = { nome: false, desafio: false };
      let lastLevel = 0;
      let restoring = false;

      const storage = (() => {
        try {
          const store = window.sessionStorage;
          store.setItem('tirvo:teste', '1');
          store.removeItem('tirvo:teste');
          return store;
        } catch {
          return null;
        }
      })();

      const selectedServices = () => chips.filter((chip) => chip.checked).map((chip) => chip.value);

      const setError = (field, errorEl, message) => {
        errorEl.textContent = message;
        if (field === area) editorBox.classList.toggle('is-invalid', Boolean(message));
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      };

      const updateCounter = () => {
        const used = editor.length();
        counter.textContent = `${number.format(used)} / ${number.format(cfg.maxChars)}`;
        const ratio = used / cfg.maxChars;
        counter.classList.toggle('is-near', ratio >= 0.8 && ratio < 1);
        counter.classList.toggle('is-full', ratio >= 1);
        // Anuncia somente ao cruzar os limites de 80% e 100%
        const level = ratio >= 1 ? 2 : ratio >= 0.8 ? 1 : 0;
        if (level > lastLevel) {
          announce(status, level === 2
            ? `Limite de ${number.format(cfg.maxChars)} caracteres atingido.`
            : `Você usou 80% do limite de ${number.format(cfg.maxChars)} caracteres.`);
        }
        lastLevel = level;
      };

      let draftTimer = 0;
      const saveDraft = () => {
        if (!storage || restoring) return;
        clearTimeout(draftTimer);
        draftTimer = setTimeout(() => {
          try {
            storage.setItem(cfg.draftKey, JSON.stringify({
              nome: nome.value,
              empresa: empresa.value,
              servicos: selectedServices(),
              desafio: editor.runs(),
            }));
          } catch {
            /* armazenamento indisponível */
          }
        }, 350);
      };
      const clearDraft = () => {
        clearTimeout(draftTimer);
        try { storage?.removeItem(cfg.draftKey); } catch { /* armazenamento indisponível */ }
      };

      const validateNome = () => {
        const ok = nome.value.trim().length >= cfg.minName;
        setError(nome, errorNome, ok ? '' : 'Informe seu nome.');
        return ok;
      };
      const validateDesafio = () => {
        const ok = editor.plain().trim().length >= cfg.minChallenge;
        setError(area, errorDesafio, ok ? '' : 'Descreva seu desafio com pelo menos 20 caracteres.');
        return ok;
      };

      const editor = createRichEditor(area, {
        maxChars: cfg.maxChars,
        toolbar: $('.editor__toolbar', form),
        onChange: (info) => {
          if (info && info.limit) {
            announce(status, `Limite de ${number.format(cfg.maxChars)} caracteres atingido.`);
            return;
          }
          if (!restoring) interacted.desafio = true;
          mirror.value = editor.plain();
          updateCounter();
          if (touched.desafio) validateDesafio();
          saveDraft();
        },
      });

      const speech = createSpeechInput({
        button: $('[data-mic]', form),
        statusEl: $('[data-voice-status]', form),
        interimEl: $('[data-interim]', form),
        hintEl: $('[data-voice-hint]', form),
        onFinal: (text) => editor.insertDictation(text),
      });

      // Restaura o rascunho da sessão
      const restoreDraft = () => {
        if (!storage) return;
        try {
          const raw = storage.getItem(cfg.draftKey);
          if (!raw) return;
          const draft = JSON.parse(raw);
          restoring = true;
          if (typeof draft.nome === 'string') nome.value = draft.nome.slice(0, 80);
          if (typeof draft.empresa === 'string') empresa.value = draft.empresa.slice(0, 80);
          if (Array.isArray(draft.servicos)) chips.forEach((chip) => { chip.checked = draft.servicos.includes(chip.value); });
          if (Array.isArray(draft.desafio)) editor.setRuns(draft.desafio);
        } catch {
          /* rascunho inválido: ignorado */
        } finally {
          restoring = false;
        }
      };
      restoreDraft();
      mirror.value = editor.plain();
      lastLevel = 0;
      updateCounter();

      nome.addEventListener('input', () => {
        interacted.nome = true;
        if (touched.nome) validateNome();
        saveDraft();
      });
      nome.addEventListener('blur', () => {
        if (!interacted.nome) return;
        touched.nome = true;
        validateNome();
      });
      area.addEventListener('blur', () => {
        if (!interacted.desafio) return;
        touched.desafio = true;
        validateDesafio();
      });
      empresa.addEventListener('input', saveDraft);
      chips.forEach((chip) => chip.addEventListener('change', saveDraft));

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        speech.stop();
        touched.nome = true;
        touched.desafio = true;
        const okNome = validateNome();
        const okDesafio = validateDesafio();
        if (!okNome || !okDesafio) {
          (okNome ? area : nome).focus();
          const messages = [];
          if (!okNome) messages.push('Informe seu nome.');
          if (!okDesafio) messages.push('Descreva seu desafio com pelo menos 20 caracteres.');
          announce(status, `Revise o formulário. ${messages.join(' ')}`);
          return;
        }

        const message = buildWhatsAppMessage({
          nome: nome.value,
          empresa: empresa.value,
          servicos: selectedServices(),
          desafio: serializeToWhatsApp(editor.runs()),
        });
        const url = CONFIG.whatsappEndpoint + encodeURIComponent(message);

        // window.open com 'noopener' nas features sempre devolve null: por isso o opener é zerado à mão
        const opened = window.open(url, '_blank');
        clearDraft();
        if (opened) {
          opened.opener = null;
        } else {
          window.location.href = url;
          return;
        }

        successLink.href = url;
        form.classList.add('is-busy');
        submit.setAttribute('aria-disabled', 'true');
        setTimeout(() => {
          form.classList.remove('is-busy');
          submit.removeAttribute('aria-disabled');
          stack.classList.add('is-sent');
          successTitle.focus({ preventScroll: true });
        }, 650);
      });

      resetButton.addEventListener('click', () => {
        form.reset();
        editor.clear();
        mirror.value = '';
        interacted.nome = false;
        interacted.desafio = false;
        touched.nome = false;
        touched.desafio = false;
        setError(nome, errorNome, '');
        setError(area, errorDesafio, '');
        lastLevel = 0;
        updateCounter();
        clearDraft();
        stack.classList.remove('is-sent');
        nome.focus({ preventScroll: true });
      });
    }

    /* ==========================================================
       LINKS DE SERVIÇO QUE PRÉ-SELECIONAM O FORMULÁRIO
       ========================================================== */
    function initServiceDeepLinks() {
      // Vindo de uma página de serviço (/?servico=sites#contato): o serviço já chega marcado no formulário
      const fromPage = new URLSearchParams(location.search).get('servico');
      const preset = fromPage && /^[a-z]+$/.test(fromPage) ? $(`[data-service-chip="${fromPage}"]`) : null;
      if (preset && !preset.checked) {
        preset.checked = true;
        preset.dispatchEvent(new Event('change', { bubbles: true }));
      }
      $$('[data-service-link]').forEach((link) => {
        link.addEventListener('click', () => {
          const chip = $(`[data-service-chip="${link.dataset.serviceLink}"]`);
          if (!chip) return;
          if (!chip.checked) {
            chip.checked = true;
            chip.dispatchEvent(new Event('change', { bubbles: true }));
          }
          const label = chip.closest('.chip-check');
          if (!label) return;
          label.classList.remove('is-flash');
          requestAnimationFrame(() => label.classList.add('is-flash'));
          setTimeout(() => label.classList.remove('is-flash'), 1400);
        });
      });
    }

    /* ==========================================================
       WHATSAPP FLUTUANTE
       ========================================================== */
    function initFloatingWhatsApp() {
      const button = $('[data-wa-float]');
      const card = $('[data-contact-card]');
      if (!button) return;
      let formVisible = false;
      const update = () => {
        const conceal = formVisible || root.classList.contains('is-menu-open') || root.classList.contains('is-lightbox-open');
        button.classList.toggle('is-concealed', conceal);
      };
      if (card && hasIO) {
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) formVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
          update();
        }, { threshold: [0, 0.2, 0.4, 0.6] });
        observer.observe(card);
      }
      new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['class'] });
      update();
    }

    /* ==========================================================
       SONS DO MASCOTE: sintetizados com Web Audio (nenhum arquivo baixado)
       ========================================================== */
    function createMascotSounds(storageKey) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      let ctx = null;
      let master = null;
      // Sem botão de mudo: os sons ficam sempre ligados (limpa a preferência antiga, se houver)
      try { localStorage.removeItem(storageKey); } catch (error) { /* armazenamento indisponível */ }

      const ensure = () => {
        if (!AudioCtx) return null;
        if (!ctx) {
          ctx = new AudioCtx();
          master = ctx.createGain();
          master.gain.value = 0.22;
          const limiter = ctx.createDynamicsCompressor();
          master.connect(limiter);
          limiter.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        return ctx;
      };
      // O navegador só libera áudio depois de um gesto: o primeiro toque, clique ou tecla na página prepara tudo
      ['pointerdown', 'keydown', 'touchend'].forEach((type) => addEventListener(type, ensure, { capture: true, passive: true }));

      // Toca só com o áudio já liberado ou durante um gesto; nunca acumula sons para disparar de uma vez depois
      const ready = () => {
        if (!AudioCtx) return false;
        if (ctx && ctx.state === 'running') return true;
        if (navigator.userActivation?.isActive) { ensure(); return true; }
        return false;
      };

      // Uma nota com envelope curto, deslize de frequência e vibrato opcionais
      const tone = ({ f0, f1 = f0, dur = 0.1, type = 'sine', at = 0, vol = 0.5, vib = 0, vibRate = 0 }) => {
        const start = ctx.currentTime + at;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f0, start);
        if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, start + dur);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(vol, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain);
        gain.connect(master);
        if (vib) {
          const lfo = ctx.createOscillator();
          const depth = ctx.createGain();
          lfo.frequency.value = vibRate;
          depth.gain.value = vib;
          lfo.connect(depth);
          depth.connect(osc.frequency);
          lfo.start(start);
          lfo.stop(start + dur + 0.03);
        }
        osc.start(start);
        osc.stop(start + dur + 0.03);
        return osc;
      };

      const SOUNDS = {
        // Passar o mouse: "bup" curto subindo
        hover: () => tone({ f0: 520, f1: 900, dur: 0.09, vol: 0.45 }),
        // Toque: "bi-bup" de duas notas
        tap: () => {
          tone({ f0: 660, dur: 0.07, type: 'triangle', vol: 0.55 });
          tone({ f0: 990, dur: 0.1, type: 'triangle', at: 0.075, vol: 0.55 });
        },
        // Antena: mola com vibrato
        boing: () => tone({ f0: 170, f1: 440, dur: 0.48, vol: 0.75, vib: 70, vibRate: 22 }),
        // Cócegas: risadinha de notas rápidas
        giggle: () => [1046, 1318, 1175, 1480, 1318].forEach((f, i) => tone({
          f0: f * (1 + (Math.random() - 0.5) * 0.04), f1: f * 0.82, dur: 0.075, type: 'triangle', at: i * 0.085, vol: 0.4,
        })),
        // Tontura: descida longa e ondulada
        dizzy: () => tone({ f0: 900, f1: 150, dur: 0.95, vol: 0.55, vib: 45, vibRate: 9 }),
        // Fechar o balão
        pop: () => tone({ f0: 1400, f1: 480, dur: 0.05, vol: 0.35 }),
        // Pulinho de uma letra para outra
        hop: () => tone({ f0: 360, f1: 820, dur: 0.12, vol: 0.32 }),
        // Comemoração: arpejo subindo e acorde final
        fanfare: () => {
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone({ f0: f, dur: 0.16, type: 'triangle', at: i * 0.09, vol: 0.45 }));
          [523.25, 659.25, 783.99, 1046.5].forEach((f) => tone({ f0: f, dur: 0.6, type: 'triangle', at: 0.4, vol: 0.22 }));
        },
      };

      let chatterNodes = [];
      const stopChatter = () => {
        chatterNodes.forEach((osc) => { try { osc.stop(); } catch (error) { /* já parou */ } });
        chatterNodes = [];
      };

      return {
        play(name) { if (ready()) SOUNDS[name]?.(); },
        // "Fala" de robô: bipes curtos com altura aleatória enquanto a boca mexe
        chatter(ms) {
          stopChatter();
          if (!ready()) return;
          const count = Math.min(18, Math.floor(ms / 90));
          for (let i = 0; i < count; i += 1) {
            chatterNodes.push(tone({ f0: 430 + Math.random() * 380, dur: 0.045, type: 'triangle', at: i * 0.09, vol: 0.22 }));
          }
        },
        stopChatter,
        // Nota de xilofone: corpo em triângulo e um toque agudo de ataque
        note(freq) {
          if (!ready()) return;
          tone({ f0: freq, dur: 0.42, type: 'triangle', vol: 0.5 });
          tone({ f0: freq * 2, dur: 0.1, vol: 0.14 });
        },
      };
    }

    // Uma instância de som para o site todo: o botão de som do Next vale também para a assinatura do rodapé
    /* ==========================================================
       VOZ DO NEXT: síntese de fala do próprio aparelho, em português do Brasil, afinada para soar como um robozinho
       ========================================================== */
    function createMascotVoice() {
      const synth = window.speechSynthesis;
      if (!synth || typeof SpeechSynthesisUtterance !== 'function') return null;
      // Como as frases devem soar (o texto escrito continua o mesmo)
      const SPOKEN = [
        [/\bHihi\b/g, 'Ri ri ri'],
        [/\bBoing\b/g, 'Bóim'],
        [/\.zip\b/g, ' ponto zip'],
        [/360º/g, 'trezentos e sessenta'],
        [/24\/7/g, 'vinte e quatro horas, sete dias por semana'],
        [/\bIA\b/g, 'I A'],
        [/…/g, ','],
      ];
      // Prefere as vozes neurais (Natural, Online, Google) e, entre elas, as brasileiras
      const score = (v) => (/^pt[-_]BR/i.test(v.lang) ? 100 : 0)
        + (/natural|neural|online/i.test(v.name) ? 40 : 0)
        + (/google/i.test(v.name) ? 30 : 0)
        + (/francisca|thalita|luciana|maria|felipe|antonio|daniel/i.test(v.name) ? 10 : 0)
        + (v.localService ? 5 : 0);
      let voice = null;
      const pick = () => {
        const options = synth.getVoices().filter((v) => /^pt/i.test(v.lang));
        voice = options.sort((a, b) => score(b) - score(a))[0] || null;
      };
      pick();
      synth.addEventListener?.('voiceschanged', pick);
      // O navegador só libera a fala depois de um toque: o primeiro gesto dispara uma fala muda que destrava (iPhone incluso)
      let unlocked = false;
      const unlock = () => {
        if (unlocked || !voice) return;
        unlocked = true;
        const primer = new SpeechSynthesisUtterance(' ');
        primer.volume = 0;
        synth.speak(primer);
      };
      ['pointerup', 'keydown', 'touchend'].forEach((type) => addEventListener(type, unlock, { capture: true, passive: true }));
      addEventListener('pagehide', () => synth.cancel());
      document.addEventListener('visibilitychange', () => { if (document.hidden) synth.cancel(); });

      let serial = 0;
      return {
        get ready() {
          const active = navigator.userActivation ? navigator.userActivation.hasBeenActive : unlocked;
          return Boolean(voice) && active && !document.hidden;
        },
        say(message, onend) {
          const id = ++serial;
          synth.cancel();
          const utterance = new SpeechSynthesisUtterance(SPOKEN.reduce((line, [pattern, spoken]) => line.replace(pattern, spoken), message));
          utterance.voice = voice;
          utterance.lang = voice.lang;
          utterance.pitch = 1.55;
          utterance.rate = 1.04;
          const done = () => { if (id === serial) onend(); };
          utterance.onend = done;
          utterance.onerror = done;
          synth.speak(utterance);
        },
        stop() {
          serial += 1;
          synth.cancel();
        },
      };
    }

    let siteSounds = null;
    const getSounds = () => (siteSounds ??= createMascotSounds(CONFIG.mascot.soundKey));

    /* ==========================================================
       MASCOTE: coreografia da abertura, acompanhamento por seção e balões de fala
       ========================================================== */
    function initMascot() {
      const mascot = $('[data-mascot]');
      if (!mascot) return;
      const bot = $('[data-mascot-bot]', mascot);
      const text = $('[data-mascot-text]', mascot);
      const closeButton = $('[data-mascot-close]', mascot);
      const cfg = CONFIG.mascot;
      const sfx = getSounds();
      const voice = createMascotVoice();

      // Temporizadores nomeados: reagendar uma chave cancela o anterior
      const timers = new Map();
      const later = (key, ms, fn) => { clearTimeout(timers.get(key)); timers.set(key, setTimeout(fn, ms)); };
      const cancel = (...keys) => keys.forEach((key) => clearTimeout(timers.get(key)));

      const setFace = (face) => { if (mascot.dataset.face !== face) mascot.dataset.face = face; };
      const setPose = (pose) => {
        if (mascot.dataset.pose === pose) return;
        mascot.dataset.pose = pose;
        // O olhar que segue o cursor vale só em repouso; nas outras poses, manda a direção da pose
        if (pose !== 'rest') {
          mascot.style.removeProperty('--ex');
          mascot.style.removeProperty('--ey');
        }
      };
      const relax = () => { setPose('rest'); setFace('neutral'); };

      /* ---------- Piscar: intervalo irregular, às vezes em dobro ---------- */
      const blinkOnce = (ms) => {
        mascot.classList.add('is-blink');
        setTimeout(() => mascot.classList.remove('is-blink'), ms);
      };
      const blink = () => {
        if (!document.hidden && mascot.dataset.face !== 'happy') {
          blinkOnce(130);
          if (Math.random() < 0.22) setTimeout(() => blinkOnce(120), 260);
        }
        later('blink', cfg.blinkMin + Math.random() * (cfg.blinkMax - cfg.blinkMin), blink);
      };

      /* ---------- Balão de fala ---------- */
      let bubbleOpen = false;
      let concealed = false;
      let current = '';
      let scene = null; // cena do rodapé em andamento: 'letters', 'wa' ou 'return'
      const history = new Map(); // seção → { count, at }

      const hideBubble = () => {
        cancel('hide', 'talk', 'pose');
        sfx.stopChatter();
        if (mascot.classList.contains('is-voice')) voice.stop();
        mascot.classList.remove('is-bubble-open', 'is-talking', 'is-voice');
        bubbleOpen = false;
        // Durante a cena do rodapé, a pose é da cena
        if (!scene) relax();
      };
      const speak = (message, announce, { pose = 'present', face = 'happy' } = {}) => {
        cancel('idleSeq', 'hide', 'talk', 'pose');
        text.textContent = message;
        bubbleOpen = true;
        setPose(pose);
        setFace(face);
        // Com voz disponível, ele fala em voz alta, apontando, e o balão não aparece
        if (voice?.ready) {
          text.setAttribute('aria-live', 'off');
          sfx.stopChatter();
          mascot.classList.remove('is-bubble-open');
          mascot.classList.add('is-voice', 'is-talking');
          voice.say(message, () => {
            mascot.classList.remove('is-talking');
            later('hide', 600, hideBubble);
          });
          // Garantia caso o aparelho nunca avise o fim da fala
          later('hide', 4000 + message.length * 90, hideBubble);
          return;
        }
        // Sem voz (aparelho sem português ou antes do primeiro toque na página): balão escrito
        // Anuncia para leitores de tela só quando o visitante pediu a dica; nas trocas de seção, fica em silêncio
        text.setAttribute('aria-live', announce ? 'polite' : 'off');
        mascot.classList.remove('is-voice');
        mascot.classList.add('is-bubble-open', 'is-talking');
        const talk = Math.min(cfg.talkMax, 500 + message.length * cfg.talkPerChar);
        // A "voz" de bipes só acompanha falas que o visitante provocou
        if (announce) sfx.chatter(talk);
        later('talk', talk, () => { mascot.classList.remove('is-talking'); setFace('neutral'); });
        later('pose', talk + 900, () => { if (bubbleOpen) setPose('rest'); });
        later('hide', Math.min(cfg.bubbleMax, cfg.bubbleMin + message.length * cfg.bubblePerChar), hideBubble);
      };
      const speakAbout = (id, manual) => {
        const lines = cfg.messages[id];
        if (!lines || !lines.length) return;
        if (id === 'rodape' && canRoam()) {
          if (manual) startFooterScene({ letters: !footerVisit.letters });
          else if (!scene && performance.now() - footerSceneAt > cfg.revisitGap) startFooterScene();
          return;
        }
        const record = history.get(id) || { count: 0, at: 0 };
        if (!manual) {
          // Em cada seção, a primeira frase ao chegar; ao voltar depois de um tempo, a seguinte. Depois disso, só se pedirem.
          if (record.count >= lines.length) return;
          if (record.count && performance.now() - record.at < cfg.revisitGap) return;
        }
        history.set(id, { count: record.count + 1, at: performance.now() });
        speak(lines[record.count % lines.length], manual);
      };

      /* ---------- Seção atual (faixa central da tela) ---------- */
      const trackSections = () => {
        const sections = Object.keys(cfg.messages).map((id) => document.getElementById(id)).filter(Boolean);
        if (!hasIO || !sections.length) return;
        const inBand = new Set();
        const observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          }
          const id = sections.filter((section) => inBand.has(section)).pop()?.id || '';
          if (id === current) return;
          current = id;
          cancel('section');
          // Só fala depois que o visitante se demora na seção (rolagem rápida não dispara balões em série)
          if (id) later('section', cfg.dwell, () => { if (current === id && !concealed) speakAbout(id, false); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((section) => observer.observe(section));
      };

      /* ---------- Ocultação: menu, lightbox e digitação no celular ---------- */
      let formFocus = false;
      const wide = matchMedia('(min-width: 768px)');
      const updateConceal = () => {
        concealed = root.classList.contains('is-menu-open')
          || root.classList.contains('is-lightbox-open')
          || (formFocus && !wide.matches);
        mascot.classList.toggle('is-concealed', concealed);
        if (concealed && bubbleOpen) hideBubble();
        if (concealed && scene) endScene({ instant: true });
      };
      const watchConceal = () => {
        new MutationObserver(updateConceal).observe(root, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('focusin', (event) => {
          formFocus = Boolean(event.target.closest?.('form'));
          updateConceal();
        });
        document.addEventListener('focusout', () => {
          formFocus = false;
          requestAnimationFrame(updateConceal);
        });
        updateConceal();
      };

      /* ---------- Olhar que acompanha o cursor (só mouse, um cálculo por quadro) ---------- */
      const trackPointer = () => {
        if (!isFinePointer() || prefersReducedMotion.value) return;
        let x = 0;
        let y = 0;
        const apply = rafThrottle(() => {
          if (mascot.dataset.pose !== 'rest' || concealed) return;
          const rect = bot.getBoundingClientRect();
          const dx = x - (rect.left + rect.width / 2);
          const dy = y - (rect.top + rect.height * 0.33);
          const distance = Math.hypot(dx, dy) || 1;
          const reach = Math.min(1, distance / 420);
          mascot.style.setProperty('--ex', `${((dx / distance) * 5 * reach).toFixed(1)}px`);
          mascot.style.setProperty('--ey', `${((dy / distance) * 3.5 * reach).toFixed(1)}px`);
        });
        addEventListener('pointermove', (event) => { x = event.clientX; y = event.clientY; apply(); }, { passive: true });
      };

      /* ---------- Gestos ociosos para chamar a atenção de vez em quando ---------- */
      const IDLE_MOVES = [
        [['wave', 'happy', 1500]],
        [['look-l', 'neutral', 900], ['look-r', 'neutral', 900]],
        [['cheer', 'happy', 1250]],
      ];
      const scheduleIdle = () => {
        later('idle', cfg.idleMin + Math.random() * (cfg.idleMax - cfg.idleMin), () => {
          if (!document.hidden && !bubbleOpen && !concealed && !scene && mascot.dataset.pose === 'rest') {
            const steps = IDLE_MOVES[Math.floor(Math.random() * IDLE_MOVES.length)];
            const play = (index) => {
              if (index >= steps.length) { relax(); return; }
              const [pose, face, ms] = steps[index];
              setPose(pose);
              setFace(face);
              later('idleSeq', ms, () => play(index + 1));
            };
            play(0);
          }
          scheduleIdle();
        });
      };

      /* ---------- Interação direta: dica, brincadeiras e sons ---------- */
      const REACTIONS = {
        boing: { sound: 'boing', className: 'is-boing', ms: 800, face: 'surprised', pose: 'explain' },
        tickle: { sound: 'giggle', className: 'is-tickle', ms: 650, face: 'happy', pose: 'cheer' },
        dizzy: { sound: 'dizzy', className: 'is-dizzy', ms: 1500, face: 'dizzy', pose: 'rest' },
      };
      const playCount = { boing: 0, tickle: 0, dizzy: 0, party: 0 };
      const react = (kind) => {
        const reaction = REACTIONS[kind];
        const line = cfg.play[kind][playCount[kind]++ % cfg.play[kind].length];
        sfx.play(reaction.sound);
        mascot.classList.remove('is-boing', 'is-tickle', 'is-dizzy');
        void mascot.offsetWidth; // reinicia a animação se o mesmo gesto se repetir
        mascot.classList.add(reaction.className);
        later('react', reaction.ms, () => mascot.classList.remove(reaction.className));
        if (kind === 'dizzy') {
          hideBubble();
          setFace('dizzy');
          later('reactSpeak', reaction.ms, () => speak(line, true));
        } else {
          speak(line, true, { face: reaction.face, pose: reaction.pose });
        }
      };

      let combo = 0;
      let lastTap = 0;
      bot.addEventListener('click', (event) => {
        if (mascot.classList.contains('is-intro')) return;
        // Fora do canto, o toque só faz cócegas: a cena continua
        if (scene) {
          sfx.play('giggle');
          mascot.classList.remove('is-tickle');
          void mascot.offsetWidth;
          mascot.classList.add('is-tickle');
          later('react', 650, () => mascot.classList.remove('is-tickle'));
          return;
        }
        const now = performance.now();
        combo = now - lastTap < cfg.comboWindow ? combo + 1 : 1;
        lastTap = now;
        // Muitos toques seguidos: ele gira e fica tonto
        if (combo >= cfg.dizzyAt) {
          combo = 0;
          react('dizzy');
          return;
        }
        // Primeiro toque: dica sobre a seção. Com o balão aberto: antena (cabeça) ou cócegas (corpo).
        if (!bubbleOpen) {
          sfx.play('tap');
          setFace('surprised');
          later('surprise', 220, () => speakAbout(current || 'inicio', true));
          return;
        }
        const rect = bot.getBoundingClientRect();
        const onHead = event.detail > 0 && event.clientY - rect.top < rect.height * 0.5;
        react(onHead ? 'boing' : 'tickle');
      });
      let lastHoverSound = 0;
      bot.addEventListener('pointerenter', (event) => {
        if (mascot.classList.contains('is-intro')) return;
        if (event.pointerType !== 'touch' && performance.now() - lastHoverSound > cfg.hoverSoundGap) {
          lastHoverSound = performance.now();
          sfx.play('hover');
        }
        if (!bubbleOpen && mascot.dataset.pose === 'rest') setFace('happy');
      });
      bot.addEventListener('pointerleave', () => {
        if (!bubbleOpen && mascot.dataset.pose === 'rest') setFace('neutral');
      });
      // A animação de entrada sai de cena ao terminar, liberando o invólucro para os gestos de brincadeira
      $('.mascot__pop', mascot).addEventListener('animationend', (event) => {
        if (event.animationName === 'bot-pop') mascot.classList.remove('is-entering');
      });
      // Com o cursor sobre o mascote ou o balão, o balão não some
      mascot.addEventListener('pointerenter', () => cancel('hide'));
      mascot.addEventListener('pointerleave', () => { if (bubbleOpen && !scene && !mascot.classList.contains('is-voice')) later('hide', 2400, hideBubble); });
      // Quando o visitante toca todas as letras da assinatura do rodapé, o Next comemora junto
      const party = () => {
        if (!landed || concealed) return;
        // Se ainda está voltando das letras, comemora assim que chegar ao canto
        if (scene) { later('party', 400, party); return; }
        speak(cfg.play.party[playCount.party++ % cfg.play.party.length], true, { pose: 'cheer', face: 'happy' });
      };
      document.addEventListener('tirvo:marca-completa', party);
      closeButton.addEventListener('click', (event) => {
        sfx.play('pop');
        hideBubble();
        if (scene) endScene();
        // Pelo teclado, o foco volta para o robô; com mouse ou toque, sem anel de foco
        if (event.detail === 0) bot.focus({ preventScroll: true });
      });
      mascot.addEventListener('keydown', (event) => { if (event.key === 'Escape' && bubbleOpen) hideBubble(); });

      /* ---------- Rodapé: pula nas letras da Tirvo e corre até o WhatsApp ---------- */
      const signature = $('[data-signature]');
      const waButton = $('[data-wa-float]');
      const bubble = $('[data-mascot-bubble]', mascot);
      const foot = cfg.footer;
      // Onde ele pisa no topo de cada letra (T, R, V e O), em coordenadas do viewBox da assinatura
      const PERCHES = [[1357.6, -660.2], [2064.6, -534.8], [2642.2, -534.8], [3005.8, -546.8]];
      const ROUTE = [0, 1, 2, 3];
      const FEET = 0.955; // altura da sola em relação à caixa do robô
      let sceneToken = 0;
      let footerSceneAt = -Infinity;
      let footerVisit = { letters: false, wa: false };
      let offset = { x: 0, y: 0 };
      let homeBox = null;
      let motion = null;
      let bubbleMotion = null;
      let perch = -1;
      let pin = null; // enquanto ele pula nas letras, o balão fica parado neste ponto para dar tempo de ler

      const canRoam = () => landed && !concealed && !prefersReducedMotion.value && Boolean(signature)
        && typeof mascot.animate === 'function' && mascot.classList.contains('is-at-footer');
      const away = () => offset.x !== 0 || offset.y !== 0;
      const setOffset = (x, y) => {
        offset = { x, y };
        mascot.style.transform = x || y ? `translate(${x}px, ${y}px)` : '';
        mascot.classList.toggle('is-away', x !== 0 || y !== 0);
        if (pin) bubble.style.transform = `translate(${pin.x - x}px, ${pin.y - y}px)`;
      };
      const pinBubble = (on) => {
        pin = on ? { ...offset } : null;
        mascot.classList.toggle('is-pinned', on);
        if (!on) bubble.style.removeProperty('transform');
      };
      const measureHome = () => {
        const box = mascot.getBoundingClientRect();
        homeBox = { left: box.left - offset.x, top: box.top - offset.y, width: box.width, height: box.height };
      };
      const pause = (ms, token) => new Promise((resolve) => { later('scenePause', ms, () => resolve(token === sceneToken)); });

      // Leva o robô até (x, y), medidos a partir do canto. Com arco, é um pulo; sem arco, uma corrida.
      const moveTo = (x, y, ms, arc = 0) => {
        const from = offset;
        motion?.cancel();
        setOffset(x, y);
        const frames = [];
        const counter = [];
        for (let i = 0; i <= 14; i += 1) {
          const t = i / 14;
          const ease = arc ? t : t < 0.5 ? 2 * t * t : 1 - ((2 - 2 * t) ** 2) / 2;
          const px = lerp(from.x, x, ease);
          const py = lerp(from.y, y, t) - arc * 4 * t * (1 - t);
          frames.push({ transform: `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)` });
          if (pin) counter.push({ transform: `translate(${(pin.x - px).toFixed(1)}px, ${(pin.y - py).toFixed(1)}px)` });
        }
        // O balão fixo recebe o movimento inverso, quadro a quadro, e fica parado na tela
        bubbleMotion?.cancel();
        bubbleMotion = pin ? bubble.animate(counter, { duration: ms }) : null;
        const animation = mascot.animate(frames, { duration: ms });
        motion = animation;
        return animation.finished.then(() => {
          if (motion === animation) motion = null;
          return true;
        }, () => false);
      };
      const hop = async (x, y, token) => {
        setPose('fly');
        setFace('happy');
        sfx.play('hop');
        const rise = Math.max(0, offset.y - y);
        const ok = await moveTo(x, y, clamp(foot.hopMs + rise * 0.5, foot.hopMs, foot.hopMs + 450), clamp(homeBox.height * 0.6 + rise * 0.25, 40, 200));
        return ok && token === sceneToken;
      };
      const run = async (x, token) => {
        const distance = Math.abs(x - offset.x);
        if (distance < 2) return token === sceneToken;
        mascot.style.setProperty('--lean', x > offset.x ? '9deg' : '-9deg');
        mascot.classList.add('is-running');
        setPose('run');
        setFace('happy');
        const ok = await moveTo(x, offset.y, clamp(distance * 1.1, 420, 1500));
        mascot.classList.remove('is-running');
        return ok && token === sceneToken;
      };
      const perchOffset = (index) => {
        const matrix = signature.getScreenCTM();
        if (!matrix || !homeBox) return null;
        const [vx, vy] = PERCHES[index];
        const point = new DOMPoint(vx, vy).matrixTransform(matrix);
        return { x: point.x - homeBox.width / 2 - homeBox.left, y: point.y - homeBox.height * FEET - homeBox.top };
      };
      // As letras cabem inteiras na tela, com espaço para o robô em cima do T
      const lettersInView = () => {
        const top = perchOffset(0);
        const box = signature.getBoundingClientRect();
        return Boolean(top) && homeBox.top + top.y > 8 && box.top + box.width * 0.36 < innerHeight;
      };
      // Balão das letras: centralizado sobre a assinatura, sem passar das bordas da tela
      const centerBubble = () => {
        const box = signature.getBoundingClientRect();
        const left = homeBox.left + offset.x + homeBox.width * 0.5;
        const wanted = box.left + box.width / 2 - bubble.offsetWidth / 2;
        const target = clamp(wanted, 12, innerWidth - 12 - bubble.offsetWidth);
        mascot.style.setProperty('--bub-dx', `${Math.round(target - left)}px`);
      };
      const sceneSay = (message, pose) => {
        speak(message, false, { pose, face: 'happy' });
        // Falando em voz alta, a fala termina sozinha; com balão, a cena decide quando ele fecha
        if (mascot.classList.contains('is-voice')) return;
        cancel('pose', 'hide');
        later('talk', Math.min(cfg.talkMax, 500 + message.length * cfg.talkPerChar), () => mascot.classList.remove('is-talking'));
      };

      const playLetters = async (token) => {
        scene = 'letters';
        footerVisit.letters = true;
        for (let step = 0; step < ROUTE.length; step += 1) {
          const target = perchOffset(ROUTE[step]);
          if (!target || !(await hop(target.x, target.y, token))) return false;
          perch = ROUTE[step];
          setPose('point-down');
          if (step === 0) {
            centerBubble();
            sceneSay(foot.letters, 'point-down');
            pinBubble(true);
          }
          if (!(await pause(foot.perchMs, token))) return false;
        }
        return true;
      };
      // Depois das letras, ele espera no canto; se o visitante não completar a brincadeira, lembra do WhatsApp
      const scheduleWhatsApp = () => {
        if (footerVisit.wa) return;
        const nudge = () => {
          if (scene || bubbleOpen) { later('sceneWa', 1500, nudge); return; }
          startFooterScene({ letters: false });
        };
        later('sceneWa', foot.waAfterPlay, nudge);
      };
      const playWhatsApp = async (token) => {
        footerVisit.wa = true;
        const wa = waButton?.getBoundingClientRect();
        if (!wa || waButton.classList.contains('is-concealed') || wa.bottom > innerHeight || wa.top < 0) {
          endScene();
          return;
        }
        scene = 'wa';
        hideBubble();
        const x = wa.left - 6 - homeBox.width - homeBox.left;
        if (!(await run(x, token))) return;
        mascot.style.setProperty('--bub-right', `${Math.round(homeBox.left + x + homeBox.width - wa.right)}px`);
        mascot.classList.add('is-at-wa');
        waButton.classList.add('is-called');
        sceneSay(foot.whatsapp, 'point');
        if (await pause(foot.waMs, token)) endScene();
      };
      async function startFooterScene({ letters = true } = {}) {
        if (!canRoam()) return;
        cancel('sceneWa', 'idleSeq');
        const token = ++sceneToken;
        scene = 'start';
        hideBubble();
        if (!motion) measureHome();
        if (letters && !footerVisit.letters && lettersInView()) {
          // Pulou em todas as letras: volta para o canto e espera antes de chamar para o WhatsApp
          if (await playLetters(token)) {
            await endScene();
            scheduleWhatsApp();
          }
          return;
        }
        await playWhatsApp(token);
      }
      // Volta para o canto (correndo, ou na hora quando a tela muda de tamanho ou algo o esconde)
      async function endScene({ instant = false } = {}) {
        const token = ++sceneToken;
        cancel('scenePause');
        waButton?.classList.remove('is-called');
        perch = -1;
        hideBubble();
        later('sceneUnpin', 220, () => { if (scene !== 'letters') pinBubble(false); });
        later('sceneWaBubble', 250, () => { if (scene !== 'wa') mascot.classList.remove('is-at-wa'); });
        const finish = () => {
          scene = null;
          mascot.classList.remove('is-running', 'is-at-wa');
          relax();
          footerSceneAt = performance.now();
        };
        if (!away()) { finish(); return; }
        scene = 'return';
        if (instant || concealed || !homeBox) {
          motion?.cancel();
          motion = null;
          setOffset(0, 0);
          finish();
          return;
        }
        if (offset.y !== 0 && !(await hop(offset.x, 0, token))) return;
        if (await run(0, token)) finish();
      }

      // Tocou numa letra: missão cumprida, ele desce e volta para o canto. Quando o visitante para de brincar, lembra do WhatsApp.
      signature?.addEventListener('click', (event) => {
        if (!event.target.closest('[data-letter]') || !canRoam()) return;
        if (scene === 'letters' || scene === 'start') endScene();
        // A cada toque, a espera recomeça: ele só vai ao WhatsApp quando o visitante para de brincar
        if (scene !== 'wa') scheduleWhatsApp();
      });
      // Em cima das letras, acompanha a rolagem
      addEventListener('scroll', rafThrottle(() => {
        if (scene !== 'letters' || perch < 0 || motion) return;
        const target = perchOffset(perch);
        if (!target) return;
        // O balão fixo acompanha as letras na rolagem
        if (pin) { pin.x += target.x - offset.x; pin.y += target.y - offset.y; }
        setOffset(target.x, target.y);
      }), { passive: true });
      addEventListener('resize', () => {
        if (scene) endScene({ instant: true });
      }, { passive: true });

      /* ---------- Pouso no canto e início do acompanhamento ---------- */
      let landed = false;
      const land = () => {
        if (landed) return;
        landed = true;
        relax();
        watchConceal();
        trackPointer();
        trackSections();
        // Com o nome da Tirvo do rodapé na tela, o balão passa para a altura dos pés e a cena do rodapé fica disponível
        if (signature && hasIO) {
          new IntersectionObserver(([entry]) => {
            const was = mascot.classList.contains('is-at-footer');
            mascot.classList.toggle('is-at-footer', entry.isIntersecting);
            if (entry.isIntersecting && !was) footerVisit = { letters: false, wa: false };
            if (!entry.isIntersecting && was) {
              cancel('sceneWa');
              if (scene) endScene();
            }
          }).observe(signature);
        }
        if (!prefersReducedMotion.value) scheduleIdle();
      };
      const dock = (animate) => {
        const first = mascot.getBoundingClientRect();
        removeEventListener('resize', placeOnAnchor);
        anchor?.remove();
        mascot.style.removeProperty('transform');
        mascot.classList.remove('is-intro');
        if (!animate || prefersReducedMotion.value || typeof mascot.animate !== 'function') {
          mascot.classList.add('is-entering');
          land();
          return;
        }
        // FLIP: mede o antes e o depois e anima só transform, num arco até o canto
        mascot.classList.add('is-flying');
        setPose('fly');
        setFace('happy');
        const last = mascot.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const scale = first.width / last.width;
        const flight = mascot.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.42 - 70}px) scale(${(scale + 1) / 2}) rotate(-7deg)`, offset: 0.45 },
          { transform: 'none' },
        ], { duration: cfg.flightMs, easing: 'cubic-bezier(.5, 0, .25, 1)' });
        flight.finished.catch(() => {}).then(() => {
          mascot.classList.remove('is-flying');
          land();
        });
      };

      /* ---------- Coreografia da abertura, sincronizada com o tempo da logo animada ---------- */
      // [fim da fase (s), pose, expressão]: surge, aponta para a mira que se forma, entra em foco quando ela trava,
      // se assusta com o ponto que acende, "programa" o nome, acompanha a frase, comemora e acena
      const INTRO = [
        [0.55, 'rest', 'happy'],
        [1.7, 'build', 'neutral'],
        [2.1, 'build', 'focus'],
        [2.45, 'build', 'surprised'],
        [3.25, 'build', 'focus'],
        [4.3, 'present', 'neutral'],
        [5.05, 'cheer', 'happy'],
        [Infinity, 'wave', 'happy'],
      ];
      const intro = $('[data-intro]');
      const anchor = $('[data-mascot-anchor]');
      // Leva o robô (ancorado no canto) até a âncora da abertura só com transform
      const placeOnAnchor = () => {
        if (!anchor) return;
        mascot.style.removeProperty('transform');
        const target = anchor.getBoundingClientRect();
        const box = mascot.getBoundingClientRect();
        mascot.style.transform = `translate(${target.left - box.left}px, ${target.top - box.top}px) scale(${target.width / box.width})`;
      };
      const introRunning = intro && root.classList.contains('intro-on') && window.tirvoIntro?.done;

      mascot.hidden = false;
      blink();
      if (!introRunning) {
        dock(false);
        return;
      }
      mascot.classList.add('is-intro', 'is-entering');
      placeOnAnchor();
      addEventListener('resize', placeOnAnchor, { passive: true });
      let frame = 0;
      const tick = () => {
        const time = window.tirvoIntro?.time ? window.tirvoIntro.time() : 0;
        const [, pose, face] = INTRO.find(([end]) => time < end);
        setPose(pose);
        setFace(face);
        frame = requestAnimationFrame(tick);
      };
      tick();
      window.tirvoIntro.done.then(() => {
        cancelAnimationFrame(frame);
        dock(true);
      });
    }

    /* ==========================================================
       ASSINATURA DO RODAPÉ: escreve ao entrar na tela e repete ao toque
       ========================================================== */
    function initSignature() {
      const sig = $('[data-signature]');
      if (!sig) return;

      // Escrita a fogo ao entrar na tela (repete a cada nova visita ao rodapé)
      if (hasIO && !prefersReducedMotion.value) {
        sig.classList.add('sig--anim');
        new IntersectionObserver((entries) => {
          for (const entry of entries) {
            sig.classList.toggle('is-visible', entry.isIntersecting);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) sig.classList.add('is-drawn');
            else if (!entry.isIntersecting) sig.classList.remove('is-drawn');
          }
        }, { threshold: [0, 0.3] }).observe(sig);
      }

      /* Brincadeiras: cada letra é uma tecla de xilofone com uma acrobacia; o pino pula.
         Tocar as cinco letras em poucos segundos dispara a comemoração (e o Next comemora junto). */
      const sfx = getSounds();
      const NOTES = { t: 523.25, i: 659.25, r: 783.99, v: 880, o: 1046.5 };
      const DURATION = { t: 900, i: 1100, r: 900, v: 850, o: 1100, pin: 1100, party: 2000 };
      const timers = new Map();
      const played = new Map();
      const play = (name) => {
        const className = `is-play-${name}`.replace('is-play-party', 'is-party');
        clearTimeout(timers.get(name));
        sig.classList.remove(className);
        void sig.getBoundingClientRect(); // reinicia a animação quando a mesma letra é tocada de novo
        sig.classList.add(className);
        timers.set(name, setTimeout(() => sig.classList.remove(className), DURATION[name]));
      };
      sig.addEventListener('click', (event) => {
        const letter = event.target.closest('[data-letter]')?.dataset.letter;
        if (!letter) return;
        if (letter === 'pin') {
          sfx.play('boing');
          play('pin');
          return;
        }
        sfx.note(NOTES[letter]);
        play(letter);
        const now = performance.now();
        played.set(letter, now);
        if (Object.keys(NOTES).every((key) => now - (played.get(key) ?? -Infinity) < 8000)) {
          played.clear();
          setTimeout(() => {
            sfx.play('fanfare');
            play('party');
            document.dispatchEvent(new CustomEvent('tirvo:marca-completa'));
          }, 450);
        }
      });
    }

    /* ==========================================================
       VITRINES DOS SERVIÇOS (telas, fluxo, marcas, peças e agente)
       ========================================================== */
    function initServiceDemos() {
      const sfx = getSounds();
      const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
      const touched = (demo) => demo.classList.add('is-touched');

      // Palco em leque: tocar num item lateral traz para a frente; tocar no da frente gira todos
      const fanStage = (demo, selector, attr, center, ring) => {
        const items = $$(selector, demo);
        demo.addEventListener('click', (event) => {
          touched(demo);
          sfx.play('tap');
          const item = event.target.closest(selector);
          if (item && item.dataset[attr] !== center) {
            const front = items.find((other) => other.dataset[attr] === center);
            front.dataset[attr] = item.dataset[attr];
            item.dataset[attr] = center;
            return;
          }
          items.forEach((other) => { other.dataset[attr] = ring[(ring.indexOf(other.dataset[attr]) + 1) % ring.length]; });
        });
      };

      // 01 · Telas de sites premium
      const sites = $('[data-demo="sites"]');
      if (sites) fanStage(sites, '.shot', 'pos', 'c', ['l', 'c', 'r']);

      // 04 · Peças digitais
      const pieces = $('[data-demo="pieces"]');
      if (pieces) fanStage(pieces, '.pc', 'slot', '1', ['0', '1', '2']);

      // 02 · Fluxo de automação: o dado passa por cada sistema e vira uma linha no log
      const flow = $('[data-demo="flow"]');
      if (flow) {
        const nodes = $$('[data-flow-node]', flow);
        const log = $('[data-flow-log]', flow);
        const countEl = $('[data-flow-count]', flow);
        const stateEl = $('[data-flow-state]', flow);
        const number = new Intl.NumberFormat('pt-BR');
        const leads = ['Rafael M.', 'Juliana P.', 'Carlos T.', 'Ana L.', 'Bruno C.'];
        let count = 1284;
        let serial = 4822;
        let turn = 0;
        let running = false;
        const events = [
          () => `Pedido #${serial} · ERP atualizado`,
          () => `Lead ${leads[serial % leads.length]} · CRM`,
          () => `Nota fiscal ${number.format(serial - 3617)} emitida`,
          () => 'Cobrança conciliada · banco',
          () => 'Estoque sincronizado · 3 lojas',
        ];
        const run = () => {
          if (running) return;
          running = true;
          flow.classList.add('is-running');
          stateEl.textContent = 'Executando';
          const step = prefersReducedMotion.value ? 0 : 300;
          nodes.forEach((node, index) => {
            setTimeout(() => {
              node.classList.add('is-hit');
              setTimeout(() => node.classList.remove('is-hit'), 650);
            }, index * step);
          });
          setTimeout(() => {
            count += 1;
            serial += 1;
            countEl.textContent = number.format(count);
            const line = document.createElement('p');
            const time = document.createElement('time');
            const text = document.createElement('span');
            const ok = document.createElement('b');
            time.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
            text.textContent = events[turn % events.length]();
            ok.textContent = 'ok';
            turn += 1;
            line.className = 'is-new';
            line.append(time, text, ok);
            log.prepend(line);
            while (log.children.length > 3) log.lastElementChild.remove();
            stateEl.textContent = 'Fluxo ativo';
            flow.classList.remove('is-running');
            running = false;
          }, nodes.length * step + 150);
        };
        flow.addEventListener('click', () => { touched(flow); sfx.play('tap'); run(); });
        // Enquanto está na tela, o fluxo roda sozinho de tempos em tempos
        let auto = 0;
        onVisible(flow, (visible) => {
          clearInterval(auto);
          if (visible && !prefersReducedMotion.value) auto = setInterval(run, 5200);
        });
      }

      // 03 · Logotipos 3D: cada marca gira de verdade (36 quadros renderizados em 3D)
      const brand = $('[data-demo="brand"]');
      if (brand) {
        const FRAMES = 36;
        const still = () => prefersReducedMotion.value;
        const logos = $$('[data-lg3]', brand).map((el, index) => ({
          el,
          mark: $('.lg3__mark', el),
          base: Number(el.dataset.angle) || 0,
          phase: index * 1.9,
          angle: (Number(el.dataset.angle) || 0) + 180,
          hover: false,
          hx: 0.5,
          spin: null,
          focusUntil: 0,
          frame: -1,
        }));
        const paint = (logo) => {
          const frame = ((Math.round(logo.angle / (360 / FRAMES)) % FRAMES) + FRAMES) % FRAMES;
          if (frame === logo.frame) return;
          logo.frame = frame;
          logo.mark.style.backgroundPosition = `${(frame % 6) * 20}% ${Math.floor(frame / 6) * 20}%`;
        };
        const setFocus = () => {
          const now = performance.now();
          let any = false;
          logos.forEach((logo) => {
            const on = logo.hover || logo.spin !== null || now < logo.focusUntil;
            logo.el.classList.toggle('is-focus', on);
            any = any || on;
          });
          brand.classList.toggle('has-focus', any);
        };
        let raf = 0;
        let visible = false;
        const tick = (now) => {
          logos.forEach((logo) => {
            if (logo.spin) {
              const progress = Math.min(1, (now - logo.spin.start) / 1150);
              logo.angle = logo.spin.from + 360 * (1 - (1 - progress) ** 3);
              if (progress === 1) { logo.spin = null; logo.angle %= 360; logo.focusUntil = now + 2200; }
            } else {
              let target = logo.base + 18 * Math.sin(now / 1700 + logo.phase);
              if (logo.hover) target = (logo.hx - 0.5) * 80;
              else if (now < logo.focusUntil) target = 0;
              const delta = ((target - logo.angle + 540) % 360) - 180;
              logo.angle += delta * 0.07;
            }
            paint(logo);
          });
          setFocus();
          if (visible) raf = requestAnimationFrame(tick);
        };
        const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };

        logos.forEach((logo) => {
          logo.el.addEventListener('pointerenter', (event) => {
            if (event.pointerType !== 'mouse') return;
            logo.hover = true;
            if (still()) { logo.angle = 0; paint(logo); setFocus(); }
          });
          logo.el.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse') return;
            const rect = logo.el.getBoundingClientRect();
            logo.hx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
          }, { passive: true });
          logo.el.addEventListener('pointerleave', () => {
            logo.hover = false;
            if (still()) { logo.angle = logo.base; paint(logo); setFocus(); }
          });
        });
        // Clique ou toque: giro completo, a marca salta e fica em destaque
        brand.addEventListener('click', (event) => {
          const el = event.target.closest('[data-lg3]');
          if (!el) return;
          const logo = logos.find((item) => item.el === el);
          touched(brand);
          sfx.play('tap');
          if (still()) {
            logos.forEach((other) => { other.focusUntil = 0; other.angle = other.base; paint(other); });
            logo.angle = 0;
            logo.focusUntil = performance.now() + 2600;
            paint(logo);
            setFocus();
            setTimeout(setFocus, 2700);
            return;
          }
          logo.spin = { from: logo.angle, start: performance.now() };
          el.classList.remove('is-pop');
          void el.offsetWidth;
          el.classList.add('is-pop');
        });

        logos.forEach(paint);
        onVisible(brand, (isVisible) => {
          if (isVisible) brand.classList.add('is-in');
          if (still()) {
            logos.forEach((logo) => { logo.angle = logo.base; paint(logo); });
            return;
          }
          visible = isVisible;
          if (visible) start(); else cancelAnimationFrame(raf);
        }, { threshold: 0.25 });
      }

      // 05 · Agente de IA: recebe a tarefa, executa cada etapa e reporta o resultado
      const agent = $('[data-demo="agent"]');
      if (agent) {
        const askEl = $('[data-agent-ask]', agent);
        const stateEl = $('[data-agent-state]', agent);
        const footEl = $('[data-agent-foot]', agent);
        const steps = $$('[data-agent-steps] li', agent);
        const tasks = [
          {
            ask: 'Cliente pediu orçamento de 40 cadeiras pelo WhatsApp.',
            steps: ['Entendeu o pedido', 'Consultou o estoque no ERP', 'Calculou preço e prazo', 'Enviou a proposta ao cliente'],
            done: 'Proposta enviada em 3,4 s, sem intervenção humana.',
          },
          {
            ask: 'Chegaram 12 notas fiscais no e-mail do financeiro.',
            steps: ['Leu os anexos', 'Conferiu valores com os pedidos', 'Lançou no sistema financeiro', 'Avisou o gestor no chat interno'],
            done: '12 notas lançadas em 6,1 s.',
          },
          {
            ask: 'Paciente quer remarcar a consulta de quinta-feira.',
            steps: ['Identificou o paciente', 'Buscou horários livres na agenda', 'Confirmou o novo horário', 'Enviou lembrete por WhatsApp'],
            done: 'Consulta remarcada em 2,8 s.',
          },
        ];
        let index = 0;
        let token = 0;
        let loop = 0;
        let visible = false;

        const play = async (task) => {
          const mine = ++token;
          const alive = () => mine === token;
          clearTimeout(loop);
          steps.forEach((li, i) => {
            li.className = '';
            li.querySelector('span').textContent = task.steps[i];
          });
          footEl.classList.add('is-hidden');
          agent.classList.remove('is-thinking');
          if (prefersReducedMotion.value) {
            askEl.textContent = task.ask;
            steps.forEach((li) => { li.className = 'is-done'; });
            stateEl.textContent = 'Concluído';
            footEl.textContent = task.done;
            footEl.classList.remove('is-hidden');
            return;
          }
          stateEl.textContent = 'Recebendo tarefa';
          agent.classList.add('is-typing');
          for (let i = 1; i <= task.ask.length; i += 1) {
            askEl.textContent = task.ask.slice(0, i);
            await wait(20);
            if (!alive()) return;
          }
          agent.classList.remove('is-typing');
          agent.classList.add('is-thinking');
          stateEl.textContent = 'Executando';
          for (const li of steps) {
            li.className = 'is-run';
            await wait(560);
            if (!alive()) return;
            li.className = 'is-done';
          }
          agent.classList.remove('is-thinking');
          stateEl.textContent = 'Concluído';
          footEl.textContent = task.done;
          footEl.classList.remove('is-hidden');
          if (visible) loop = setTimeout(next, 4200);
        };
        const next = () => {
          index = (index + 1) % tasks.length;
          play(tasks[index]);
        };

        agent.addEventListener('click', () => { touched(agent); sfx.play('tap'); next(); });
        let started = false;
        onVisible(agent, (isVisible) => {
          visible = isVisible;
          if (!isVisible) {
            clearTimeout(loop);
            return;
          }
          if (prefersReducedMotion.value) return;
          if (!started) {
            started = true;
            index = -1;
            loop = setTimeout(next, 500);
          } else if (!agent.classList.contains('is-thinking') && !agent.classList.contains('is-typing')) {
            loop = setTimeout(next, 1800);
          }
        }, { threshold: 0.35 });
      }
    }

    /* ==========================================================
       ANO ATUAL NO RODAPÉ
       ========================================================== */
    function initYear() {
      const year = String(new Date().getFullYear());
      $$('[data-year]').forEach((element) => { element.textContent = year; });
    }

    /* ==========================================================
       INICIALIZAÇÃO
       ========================================================== */
    root.classList.toggle('is-tab-hidden', document.hidden);

    // Etapa 1 — o que aparece na primeira dobra
    run('initTitles', initTitles);
    run('initMascot', initMascot);
    run('initAnchors', initAnchors);
    run('initHeader', initHeader);
    run('initMobileMenu', initMobileMenu);
    run('initSubmenu', initSubmenu);
    run('initScrollProgress', initScrollProgress);
    run('initReveal', initReveal);
    run('initAnimScopes', initAnimScopes);
    run('initNeuralField', initNeuralField);

    // Etapa 2 — o restante, um módulo por fatia ociosa (nenhuma tarefa longa na carga)
    let lightbox = null;
    const deferred = [
      ['initSectionLabels', initSectionLabels],
      ['initFloatingWhatsApp', initFloatingWhatsApp],
      ['initServiceDeepLinks', initServiceDeepLinks],
      ['initTimeline', initTimeline],
      ['initSeals', initSeals],
      ['initNexusPipeline', initNexusPipeline],
      ['initNexusTerminal', initNexusTerminal],
      ['initCounters', initCounters],
      ['initFaq', initFaq],
      ['initLightbox', () => { lightbox = initLightbox(); }],
      ['initCarousel', () => initCarousel(lightbox)],
      ['initContactForm', initContactForm],
      ['initMagnetic', initMagnetic],
      ['initSpotlight', initSpotlight],
      ['initServiceDemos', initServiceDemos],
      ['initYear', initYear],
      ['initSignature', initSignature],
    ];
    const whenIdle = typeof window.requestIdleCallback === 'function'
      ? (callback) => window.requestIdleCallback(callback, { timeout: 1200 })
      : (callback) => setTimeout(callback, 50);
    const pump = () => {
      const next = deferred.shift();
      if (next) run(next[0], next[1]);
      if (deferred.length) whenIdle(pump);
    };
    whenIdle(pump);
  