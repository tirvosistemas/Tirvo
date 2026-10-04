"""Gera carrosséis em lista (P??.html) a partir de uma especificação curta. Uso: python3 carrossel.py P18 P20 …"""
import sys
from pathlib import Path
AQUI = Path(__file__).parent

def ico(n, cls='ico', st=''):
    if cls == 'icone-g':
        return ('<div class="ic-comp"><svg class="anel" viewBox="0 0 470 470"><circle cx="235" cy="235" r="150" fill="rgba(255,85,0,.06)" stroke="rgba(255,122,51,.45)" stroke-width="2"/>'
                '<circle cx="235" cy="235" r="200" fill="none" stroke="rgba(255,122,51,.2)" stroke-width="2" stroke-dasharray="4 10"/>'
                '<circle cx="235" cy="235" r="228" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1.5"/>'
                '<g fill="none" stroke="#fafafa" stroke-width="5"><path d="M95 135V95H135M335 95H375V135M375 335V375H335M135 375H95V335"/></g>'
                '<circle cx="435" cy="235" r="7" fill="#ff5500" style="filter:drop-shadow(0 0 8px #ff5500)"/><circle cx="64" cy="170" r="4" fill="#ff8a4c"/></svg>'
                f'<svg class="icone-g"><use href="#i-{n}"/></svg></div>')
    return f'<svg class="{cls}"{st}><use href="#i-{n}"/></svg>'

CAB = '''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="tirvo:formato" content="feed">
  <meta name="tirvo:slides" content="{n}">
  <title>{id}: {titulo}</title>
  <link rel="stylesheet" href="../stories/premium/base.css">
  <link rel="stylesheet" href="feed.css">
  <style>
    .peca {{ background: radial-gradient(560px 460px at 540px 640px, rgba(255, 85, 0, .14), transparent 70%), linear-gradient(180deg, #060607 0%, #09090b 50%, #060607 100%); }}
{css}
  </style>
</head>
<body>
'''
TOPO = '''    <header class="cab"><span>tirvo<b>_</b> / {tema}</span><span class="num">{i:02d}<i>/{n:02d}</i></span></header>
    <svg class="regua" width="888" height="14"></svg>
'''
ROD = '''    <footer class="rod"><span class="dica">deslize<svg class="ico"><use href="#i-arrow-right"/></svg></span><img class="logo" data-logo></footer>
  </main>
'''
FIM = '''    <div class="fim">
      <div class="divisor-h"></div>
      <div class="links"><span class="lk"><svg class="ico"><use href="#i-globe"/></svg><u>tirvo.tech</u></span><span class="lk"><svg class="ico"><use href="#i-mail"/></svg><u>engenharia@tirvo.tech</u></span></div>
      <div class="acoes">
        <span class="btn cheio" data-frame="18,0,18,0" data-tone="quente"><span>Visite nosso site</span><svg class="ico"><use href="#i-arrow-up-right"/></svg></span>
        <span class="btn vazado" data-frame="0,18,0,18" data-tone="branco"><svg class="ico"><use href="#i-send"/></svg><span>Chame no direct</span></span>
      </div>
    </div>
    <footer class="rod"><span class="dica">@tirvotech</span><img class="logo" data-logo></footer>
  </main>
  <script src="slide.js"></script>
  <script src="../stories/premium/base.js"></script>
</body>
</html>
'''

def gerar(pid, s):
    sl = s['slides']; n = len(sl) + 2
    h = CAB.format(n=n, id=pid, titulo=s['titulo'], css=s.get('css', ''))
    # capa
    c = s['capa']
    h += f'  <main class="peca feed lista" data-n="1">\n' + TOPO.format(tema=s['tema'], i=1, n=n)
    h += f'    <p class="rotulo r"><i>//</i> {c["rotulo"]}</p>\n    <h1 class="titulo capa-t" style="font-size:{c.get("tam", 98)}px">{c["titulo"]}</h1>\n{c.get("visual", "")}\n' + ROD
    for i, x in enumerate(sl, start=2):
        h += f'  <main class="peca feed lista" data-n="{i}">\n' + TOPO.format(tema=s['tema'], i=i, n=n)
        if x.get('num'): h += f'    <span class="grande-num">{x["num"]}</span>\n'
        if x.get('selo'): h += f'    <span class="tag-sinal selo"><span class="led"></span>{x["selo"]}</span>\n'
        if x.get('rotulo'): h += f'    <p class="rotulo r"><i>//</i> {x["rotulo"]}</p>\n'
        h += f'    <div class="ilustra">{x["visual"]}</div>\n'
        txt = (f'<small>{x["small"]}</small>' if x.get('small') else '') + f'<h2>{x["h2"]}</h2>' + (f'<p class="corpo">{x["corpo"]}</p>' if x.get('corpo') else '')
        h += f'    <div class="txt">{txt}</div>\n' + ROD
    f = s['final']
    h += f'  <main class="peca feed lista final" data-n="{n}">\n' + TOPO.format(tema=s['tema'], i=n, n=n)
    h += f'    <p class="rotulo r"><i>//</i> {f["rotulo"]}</p>\n    <h1 class="titulo">{f["titulo"]}</h1>\n    <p class="corpo">{f["corpo"]}</p>\n'
    if f.get('palavra'): h += f'    <div class="palavra"><b data-frame="18,0,18,0" data-tone="neon">{f["palavra"]}</b><span>{f.get("palavra_txt", "Quem responde é a mesma equipe que constrói os projetos.")}</span></div>\n'
    h += FIM
    (AQUI / f'{pid}.html').write_text(h, encoding='utf-8')

C = {}

C['P18'] = dict(titulo='8 perguntas antes de contratar um site', tema='checklist',
  css='''    .prancheta { width: 520px; height: 470px; border-radius: 24px; border: 2px solid rgba(255,255,255,.2); background: linear-gradient(180deg,#141417,#0c0c0e); padding: 70px 44px 30px; display: grid; gap: 14px; position: relative; }
    .prancheta::before { content: ""; position: absolute; left: 50%; top: -18px; width: 160px; height: 44px; margin-left: -80px; border-radius: 10px; background: #1d1d22; border: 2px solid rgba(255,255,255,.25); }
    .prancheta span { display: flex; align-items: center; gap: 16px; }
    .prancheta i { width: 26px; height: 26px; border-radius: 6px; border: 2px solid #ff7a33; flex: none; }
    .prancheta b { height: 12px; border-radius: 6px; background: rgba(255,255,255,.12); flex: 1; }
    .par { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; width: 840px; }
    .par > div { height: 300px; display: grid; justify-items: center; align-content: center; gap: 20px; text-align: center; font-size: 26px; color: var(--t2); }
    .par .ico { font-size: 96px; color: #ff8c52; stroke-width: 1.2; filter: drop-shadow(0 0 10px rgba(255,85,0,.5)); }
    .med3 { display: flex; gap: 30px; }
    .med3 > div { width: 250px; height: 260px; display: grid; justify-items: center; align-content: center; gap: 18px; font-size: 26px; font-weight: 600; }''',
  capa=dict(rotulo='leve para a reunião', titulo='Vai contratar<br>um site? <em>8 perguntas</em><br>antes de fechar.', tam=96,
    visual='    <div style="position:absolute;z-index:3;left:280px;top:640px;width:520px"><div class="prancheta">' + '<span><i></i><b></b></span>'*8 + '</div></div>'),
  slides=[
    dict(num='01', visual='<div class="par"><div data-frame="20,0,20,0" data-tone="laranja">' + ico('code') + 'sob medida</div><div data-frame="20,0,20,0" data-tone="branco" style="opacity:.6">' + ico('template') + 'tema pronto</div></div>',
         h2='O código é <em>sob medida</em> ou é um tema pronto?'),
    dict(num='02–03', visual='<div class="par"><div data-frame="20,0,20,0" data-tone="branco">' + ico('globe') + 'domínio no nome da empresa</div><div data-frame="20,0,20,0" data-tone="branco">' + ico('package') + 'código-fonte entregue</div></div>',
         h2='O domínio fica no meu nome? <em>Eu recebo o código-fonte?</em>'),
    dict(num='04', visual=ico('search', 'icone-g'), h2='O <em>SEO técnico</em> já vem incluído?', corpo='Estrutura semântica, metadados e dados estruturados.'),
    dict(num='05', visual='<div class="med3"><div data-frame="18,0,18,0" data-tone="branco">' + ico('gauge', 'ico', ' style="font-size:70px;color:#ff8c52"') + 'Performance</div><div data-frame="18,0,18,0" data-tone="branco">' + ico('eye', 'ico', ' style="font-size:70px;color:#ff8c52"') + 'Acessibilidade</div><div data-frame="18,0,18,0" data-tone="branco">' + ico('shield', 'ico', ' style="font-size:70px;color:#ff8c52"') + 'Segurança</div></div>',
         h2='Como o site <em>será testado?</em>'),
    dict(num='06–07', visual='<div class="cx-lista" style="width:760px"><span data-frame="14,0,14,0" data-tone="branco"><span class="bx">' + ico('check') + '</span>Responsável depois do lançamento</span><span data-frame="14,0,14,0" data-tone="branco"><span class="bx">' + ico('check') + '</span>SSL e backup</span><span data-frame="14,0,14,0" data-tone="branco"><span class="bx">' + ico('check') + '</span>Monitoramento</span></div>',
         h2='Quem cuida do site depois? <em>Tem SSL, backup e monitoramento?</em>'),
    dict(num='08', visual=ico('lock', 'icone-g'), h2='O projeto <em>segue a LGPD?</em>', corpo='Coleta mínima de dados e privacidade desde o projeto.'),
  ],
  final=dict(rotulo='guarde a lista', titulo='Salve para a<br>próxima <em>reunião.</em>', corpo='Na Tirvo, as 8 respostas <b>estão no site</b>, antes de qualquer conversa.'),
)

C['P20'] = dict(titulo='5 sinais de que a planilha virou gargalo', tema='sistemas',
  css='''    .plan { display: grid; grid-template-columns: repeat(6, 110px); gap: 4px; padding: 14px; border-radius: 16px; border: 2px solid rgba(255,255,255,.18); background: #0f0f12; }
    .plan i { height: 40px; border-radius: 4px; background: rgba(255,255,255,.06); }
    .plan i.r { background: rgba(255,85,0,.35); box-shadow: inset 0 0 0 2px #ff6a1f; }
    .tres-t { display: flex; gap: 22px; }
    .tres-t > div { width: 260px; height: 220px; display: grid; justify-items: center; align-content: center; gap: 10px; }
    .tres-t b { font: 600 64px/1 var(--mono); }
    .tres-t small { font: 500 16px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--t3); }
    .ref { font: 600 120px/1 var(--mono); color: #ff8a4c; text-shadow: 0 0 30px rgba(255,85,0,.6); padding: 40px 60px; }
    .pilha { position: relative; width: 420px; height: 440px; }
    .pilha span { position: absolute; left: 0; width: 420px; height: 60px; border-radius: 10px; border: 1.6px solid rgba(255,122,51,.5); background: #121215; box-shadow: 0 0 14px rgba(255,85,0,.15); }
    .painel { width: 760px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .painel > div { height: 200px; padding: 26px; display: grid; align-content: space-between; }
    .painel small { font: 500 16px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--t3); }
    .painel svg { width: 100%; height: 70px; }''',
  capa=dict(rotulo='sistemas e automações', titulo='5 sinais de que a<br>planilha <em>virou gargalo.</em>', tam=94,
    visual='    <div style="position:absolute;z-index:3;left:150px;top:620px"><div class="plan">' + ''.join('<i class="r"></i>' if k in (8, 15, 21, 28) else '<i></i>' for k in range(36)) + '</div></div>'),
  slides=[
    dict(num='01', visual=ico('user', 'icone-g'), h2='Só uma pessoa <em>entende a planilha.</em>', corpo='Quando ela falta, <b>a operação para.</b>'),
    dict(num='02', visual='<div class="tres-t"><div data-frame="16,0,16,0" data-tone="branco"><b>127</b><small>planilha</small></div><div data-frame="16,0,16,0" data-tone="branco"><b>131</b><small>sistema</small></div><div data-frame="16,0,16,0" data-tone="laranja"><b>119</b><small>whatsapp</small></div></div>',
         h2='Os mesmos dados digitados <em>em três lugares.</em>', corpo='E cada lugar mostra <b>um número diferente.</b>'),
    dict(num='03', visual=ico('clock', 'icone-g'), h2='O relatório da semana <em>leva um dia inteiro.</em>'),
    dict(num='04', visual='<span class="ref" data-frame="20,0,20,0" data-tone="laranja">#REF!</span>', h2='Um erro de fórmula <em>já virou prejuízo.</em>'),
    dict(num='05', visual='<div class="pilha">' + ''.join(f'<span style="top:{380-k*62}px;transform:rotate({(-1)**k*k*0.8}deg);opacity:{1-k*0.1}"></span>' for k in range(7)) + '</div>',
         h2='Crescer significa <em>mais planilhas,</em> não mais controle.'),
    dict(rotulo='contou 3 ou mais?', visual='<div class="painel">' + ''.join(f'<div data-frame="16,0,16,0" data-tone="{t}"><small>{n}</small><svg viewBox="0 0 200 70"><path d="{d}" fill="none" stroke="#ff7a33" stroke-width="3" style="filter:drop-shadow(0 0 4px #ff5500)"/></svg></div>' for n, t, d in [('pedidos', 'laranja', 'M0 60 40 50 80 52 120 30 160 34 200 10'), ('estoque', 'branco', 'M0 30 40 34 80 28 120 32 160 26 200 30'), ('prazos', 'branco', 'M0 20 40 30 80 26 120 44 160 40 200 50')]) + '</div>',
         h2='Um sistema que se encaixa <em>na sua operação.</em>', corpo='Menos planilha, menos retrabalho, <b>mais controle.</b>'),
  ],
  final=dict(rotulo='guarde e compartilhe', titulo='Salve e mande<br>para o <em>seu sócio.</em>', corpo='Quer entender o seu caso? <b>Chame no direct.</b> A conversa é com quem constrói.'),
)

C['P24'] = dict(titulo='6 regras para o feed parecer de uma empresa só', tema='design para redes',
  css="""    .feed9 { display: grid; grid-template-columns: repeat(3, 150px); gap: 6px; padding: 14px; border-radius: 22px; border: 2px solid rgba(255,255,255,.18); background: #0d0d10; }
    .feed9 i { aspect-ratio: 4 / 5; border-radius: 4px; background: #17171b; position: relative; }
    .feed9 i::after { content: ""; position: absolute; right: 8px; bottom: 8px; width: 26px; height: 8px; border-radius: 2px; background: rgba(255,255,255,.4); }
    .feed9 i.o { background: linear-gradient(160deg, #2a1206, #120905); box-shadow: inset 0 0 0 1px rgba(255,122,51,.5); }
    .pal1 { display: flex; gap: 16px; }
    .pal1 span { width: 150px; height: 300px; border-radius: 18px; border: 1px solid rgba(255,255,255,.14); }
    .fontes2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; width: 800px; }
    .fontes2 > div { height: 320px; padding: 30px; display: grid; align-content: space-between; }
    .fontes2 b { font-size: 150px; line-height: .9; letter-spacing: -.04em; }
    .fontes2 small { font: 500 17px/1.3 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--t3); }
    .tres-p { display: flex; gap: 18px; }
    .tres-p span { position: relative; width: 240px; height: 300px; border-radius: 14px; border: 1px solid rgba(255,255,255,.14); background: #121215; }
    .tres-p span img { position: absolute; right: 16px; bottom: 16px; height: 22px; }
    .tres-p span::after { content: ""; position: absolute; right: 8px; bottom: 8px; width: 104px; height: 38px; border: 2px solid #ff6a1f; border-radius: 6px; box-shadow: 0 0 10px rgba(255,85,0,.5); }
    .resp { width: 420px; height: 460px; border-radius: 16px; border: 1px solid rgba(255,255,255,.14); background: #101013; display: grid; place-items: center; font-size: 40px; font-weight: 640; letter-spacing: -.03em; position: relative; }
    .resp::before { content: ""; position: absolute; inset: 40px; border: 2px dashed rgba(255,122,51,.4); border-radius: 8px; }
    .numer { display: flex; gap: 14px; }
    .numer span { width: 190px; height: 240px; border-radius: 12px; border: 1px solid rgba(255,255,255,.14); background: #121215; display: grid; place-items: start end; padding: 16px; font: 500 22px/1 var(--mono); color: var(--t2); }
    .numer span b { color: #fafafa; font-weight: 500; }
    .riscos { display: grid; gap: 16px; width: 760px; }
    .riscos span { position: relative; font-size: 38px; font-weight: 560; color: var(--t3); padding: 6px 0; }
    .riscos span::after { content: ""; position: absolute; left: -6px; right: -6px; top: 52%; height: 5px; border-radius: 3px; background: #ff5500; box-shadow: 0 0 10px #ff5500; transform: rotate(-1.5deg); }
    .riscos span.ok { color: #fafafa; }
    .riscos span.ok::after { display: none; }""",
  capa=dict(rotulo='as regras que este perfil segue', titulo='Seu feed não precisa<br>de mais criatividade.<br><em>Precisa de 6 regras.</em>', tam=88,
    visual='    <div style="position:absolute;z-index:3;left:300px;top:640px"><div class="feed9">' + ''.join('<i class="o"></i>' if k in (0, 4, 8) else '<i></i>' for k in range(9)) + '</div></div>'),
  slides=[
    dict(num='01', visual='<div class="pal1"><span style="background:#09090b"></span><span style="background:#16161a"></span><span style="background:#ff5500;box-shadow:0 0 40px rgba(255,85,0,.45)"></span><span style="background:#fafafa"></span></div>',
         h2='Uma cor de <em>destaque.</em>', corpo='O resto é fundo e texto. <b>Destaque demais não destaca nada.</b>'),
    dict(num='02', visual='<div class="fontes2"><div data-frame="18,0,18,0" data-tone="branco"><b style="font-weight:680">Aa</b><small>títulos</small></div><div data-frame="18,0,18,0" data-tone="branco"><b style="font-weight:400;font-size:120px">Aa</b><small>textos</small></div></div>',
         h2='Duas fontes, <em>no máximo.</em>', corpo='Uma para títulos, outra para textos.'),
    dict(num='03', visual='<div class="tres-p"><span><img data-logo></span><span><img data-logo></span><span><img data-logo></span></div>',
         h2='A logo sempre <em>no mesmo lugar.</em>', corpo='Pequena, num canto, <b>igual em toda a série.</b>'),
    dict(num='04', visual='<div class="resp">Uma frase.</div>', h2='<em>Respiro.</em>', corpo='Menos texto na arte. <b>O detalhe vai na legenda.</b>'),
    dict(num='05', visual='<div class="numer"><span><b>01</b>/08</span><span><b>02</b>/08</span><span><b>03</b>/08</span><span><b>04</b>/08</span></div>',
         h2='Numeração e grade <em>fixas.</em>', corpo='O seguidor reconhece a série <b>antes de ler.</b>'),
    dict(num='06', visual='<div class="riscos"><span>Frase pronta de efeito</span><span>Promessa sem prova</span><span class="ok">Frases curtas e diretas.</span></div>',
         h2='O mesmo <em>tom de voz.</em>', corpo='Frases curtas, <b>sem clichê e sem exagero.</b>'),
  ],
  final=dict(rotulo='guarde as 6', titulo='Salve e confira<br>o <em>seu feed.</em>', corpo='Quando as regras viram manual, <b>qualquer pessoa da equipe posta sem desmontar a marca.</b>'),
)

C['P26'] = dict(titulo='domínio, hospedagem e SSL', tema='propriedade',
  css="""    .chaves { display: flex; gap: 30px; }
    .chaves span { display: grid; justify-items: center; gap: 16px; width: 220px; padding: 30px 0; font: 500 20px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--t2); }
    .chaves .ico { font-size: 80px; color: #ff8c52; stroke-width: 1.2; filter: drop-shadow(0 0 10px rgba(255,85,0,.5)); }
    .certidao { width: 700px; padding: 40px 44px; display: grid; gap: 18px; }
    .certidao small { font: 500 17px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--t3); }
    .certidao b { font: 500 40px/1 var(--mono); color: #fafafa; }
    .certidao .tit { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px; border-radius: 12px; border: 2px solid #ff6a1f; box-shadow: 0 0 16px rgba(255,85,0,.3); font-size: 30px; font-weight: 600; }
    .barra-url { display: grid; gap: 24px; width: 760px; }
    .barra-url span { display: flex; align-items: center; gap: 18px; height: 96px; padding: 0 30px; border-radius: 48px; border: 2px solid rgba(255,255,255,.2); background: #0f0f12; font: 500 30px/1 var(--mono); }
    .barra-url .ico { font-size: 34px; }
    .pedido { width: 720px; padding: 36px 40px; display: grid; gap: 20px; }
    .pedido span { display: flex; align-items: center; gap: 18px; font-size: 30px; font-weight: 560; }
    .pedido .ico { font-size: 32px; color: #ff8a4c; }
    .dois { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; width: 840px; }
    .dois > div { height: 330px; padding: 32px; display: grid; align-content: start; gap: 16px; }
    .dois small { font: 500 17px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--or-pale); }
    .dois b { font-size: 40px; font-weight: 680; letter-spacing: -.035em; line-height: 1; }
    .dois p { font-size: 24px; line-height: 1.38; color: var(--t2); }""",
  capa=dict(rotulo='quem é o dono do seu site?', titulo='Domínio, hospedagem<br>e SSL: <em>quem é o dono<br>do seu site?</em>', tam=86,
    visual='    <div style="position:absolute;z-index:3;left:120px;top:700px"><div class="chaves">'
      + ''.join(f'<span data-frame="20,0,20,0" data-tone="{t}">' + ico(i) + f'{n}</span>' for i, n, t in [('globe', 'domínio', 'laranja'), ('server', 'hospedagem', 'branco'), ('lock', 'ssl', 'branco')]) + '</div></div>'),
  slides=[
    dict(num='01', visual='<div class="certidao" data-frame="22,0,22,0" data-tone="branco"><small>registro de domínio</small><b>seunegocio.com.br</b><span class="tit">Titular: a sua empresa' + ico('check', 'ico', ' style="color:#ff8a4c;font-size:34px"') + '</span></div>',
         h2='<em>Domínio</em>', corpo='É o endereço. <b>Precisa estar no nome da empresa,</b> não do fornecedor.'),
    dict(num='02', visual=ico('server', 'icone-g'), h2='<em>Hospedagem</em>', corpo='É onde o site mora. <b>Saiba onde fica e quem tem o acesso.</b>'),
    dict(num='03', visual='<div class="barra-url"><span style="color:#a1a1aa">' + ico('lock', 'ico', ' style="color:#ff8a4c"') + 'https://seunegocio.com.br</span><span style="color:#71717a;border-style:dashed">' + ico('x', 'ico', ' style="color:#71717a"') + 'não seguro · seunegocio.com.br</span></div>',
         h2='<em>SSL</em>', corpo='É o cadeado do navegador. <b>Sem ele, o navegador avisa que o site não é seguro.</b>'),
    dict(rotulo='não sabe responder?', visual='<div class="pedido" data-frame="22,0,22,0" data-tone="laranja" data-acento="topo"><span>' + ico('mail') + 'Acessos ao domínio</span><span>' + ico('mail') + 'Acessos à hospedagem</span><span>' + ico('mail') + 'Nome do titular</span></div>',
         h2='Peça hoje ao seu fornecedor.'),
    dict(rotulo='na tirvo, você escolhe', visual='<div class="dois"><div data-frame="22,0,22,0" data-tone="branco"><small>modelo 01</small><b>Código entregue</b><p>Tudo fica com você: código, domínio e infraestrutura.</p></div><div data-frame="0,22,0,22" data-tone="laranja"><small>modelo 02</small><b>Gestão 360º</b><p>A Tirvo opera, e o projeto continua sendo seu.</p></div></div>',
         h2='O projeto é <em>sempre seu.</em>'),
  ],
  final=dict(rotulo='compartilhe', titulo='Mande para quem<br>contratou o <em>site<br>da sua empresa.</em>', corpo=''),
)

C['P30'] = dict(titulo='os 6 capítulos de um manual de marca', tema='marca',
  css="""    .leque { position: relative; width: 640px; height: 460px; }
    .leque span { position: absolute; left: 200px; top: 30px; width: 260px; height: 360px; border-radius: 14px; border: 1px solid rgba(255,255,255,.18); background: linear-gradient(180deg,#17171b,#0d0d10); transform-origin: 50% 110%; box-shadow: 0 20px 40px rgba(0,0,0,.5); }
    .leque span b { position: absolute; left: 22px; top: 22px; font: 500 16px/1 var(--mono); letter-spacing: .14em; color: var(--or-pale); }
    .pg-conc { width: 680px; padding: 44px; display: grid; gap: 18px; }
    .pg-conc small { font: 500 17px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--t3); }
    .pg-conc p { font: italic 400 46px/1.15 var(--serif); }
    .versoes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: 800px; }
    .versoes span { height: 180px; border-radius: 14px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.14); }
    .respiro2 { position: relative; padding: 70px; border: 2px dashed rgba(255,122,51,.55); }
    .respiro2 img { height: 70px; display: block; }
    .sw4 { display: flex; gap: 14px; }
    .sw4 span { width: 190px; height: 300px; border-radius: 16px; border: 1px solid rgba(255,255,255,.14); display: grid; align-content: end; padding: 16px; gap: 6px; font: 500 15px/1.3 var(--mono); }
    .escala { display: grid; gap: 10px; width: 760px; }
    .escala span { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.08); padding-bottom: 8px; font-weight: 640; letter-spacing: -.03em; }
    .escala small { font: 500 16px/1 var(--mono); color: var(--t3); letter-spacing: .1em; }
    .proib { display: flex; gap: 30px; align-items: center; }
    .proib > span { width: 340px; height: 260px; border-radius: 16px; border: 1px solid rgba(255,255,255,.14); background: #121215; display: grid; place-items: center; position: relative; }
    .proib .x { position: absolute; right: 16px; top: 16px; width: 44px; height: 44px; border-radius: 50%; border: 2px solid #ff6a1f; display: grid; place-items: center; }
    .proib .x .ico { font-size: 24px; color: #ff8a4c; stroke-width: 2.4; }""",
  capa=dict(rotulo='o que faltou no seu', titulo='Os 6 capítulos de um<br><em>manual de marca</em><br>de verdade.', tam=90,
    visual='    <div style="position:absolute;z-index:3;left:220px;top:690px"><div class="leque">' + ''.join(f'<span style="transform:rotate({a}deg)"><b>0{i+1}</b></span>' for i, a in enumerate([-30, -18, -6, 6, 18, 30])) + '</div></div>'),
  slides=[
    dict(num='01', visual='<div class="pg-conc" data-frame="22,0,22,0" data-tone="branco"><small>conceito</small><p>"A ideia por trás da marca, em poucas linhas."</p></div>', h2='<em>Conceito</em>', corpo='O porquê de cada escolha. <b>Sem ele, o resto vira gosto pessoal.</b>'),
    dict(num='02', visual='<div class="versoes"><span style="background:#0d0d10"><img data-logo style="height:56px"></span><span style="background:#16161a"><img data-logo style="height:40px"></span><span style="background:#0d0d10"><svg viewBox="0 0 100 100" width="90" height="90"><path fill="#f4f4f5" d="M6.5 35.5V6.5H35.5V13.5H13.5V35.5Z M93.5 35.5V6.5H64.5V13.5H86.5V35.5Z M6.5 64.5V93.5H35.5V86.5H13.5V64.5Z M93.5 64.5V93.5H64.5V86.5H86.5V64.5Z"/><path fill="#f4f4f5" fill-opacity="0.45" d="M48.5 22h3v12h-3Z M48.5 66h3v12h-3Z M22 48.5h12v3h-12Z M66 48.5h12v3h-12Z"/><circle cx="50" cy="50" r="10" fill="#ff5500"/></svg></span><span style="background:#121215;font:500 18px/1 var(--mono);color:#8a8a93;letter-spacing:.14em">VERSÕES</span></div>',
         h2='Logotipo <em>e versões.</em>', corpo='Principal, horizontal, símbolo sozinho, <b>positivo e negativo.</b>'),
    dict(num='03', visual='<div class="respiro2"><img data-logo></div>', h2='Respiro e <em>tamanho mínimo.</em>', corpo='A distância que a logo precisa <b>e o menor tamanho em que ela funciona.</b>'),
    dict(num='04', visual='<div class="sw4"><span style="background:#09090b">#09090B<br>RGB 9 9 11</span><span style="background:#ff5500;color:#fff">#FF5500<br>RGB 255 85 0</span><span style="background:#fafafa;color:#09090b">#FAFAFA<br>RGB 250 250 250</span><span style="background:#a1a1aa;color:#09090b">#A1A1AA<br>RGB 161 161 170</span></div>',
         h2='<em>Paleta</em>', corpo='Cores com códigos <b>para tela e impressão.</b>'),
    dict(num='05', visual='<div class="escala"><span style="font-size:76px">Título<small>76</small></span><span style="font-size:48px">Subtítulo<small>48</small></span><span style="font-size:32px;font-weight:400">Texto corrido<small>32</small></span><span style="font:500 22px/1 var(--mono);letter-spacing:.16em">RÓTULO<small>22</small></span></div>',
         h2='<em>Tipografia</em>', corpo='Fontes, pesos e <b>hierarquia de títulos e textos.</b>'),
    dict(num='06', visual='<div class="proib"><span style="font:500 20px/1.5 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:#8a8a93;text-align:center">sombra, efeito<br>ou distorção<span class="x">' + ico('x') + '</span></span><span style="border-color:rgba(255,122,51,.5)"><img data-logo style="height:48px"></span></div>',
         h2='Usos proibidos <em>e aplicações.</em>', corpo='O que nunca fazer com a marca, <b>e exemplos reais de uso.</b>'),
  ],
  final=dict(rotulo='guarde a lista', titulo='Salve e confira<br>o manual <em>da<br>sua marca.</em>', corpo='Se faltar capítulo, <b>chame no direct com a palavra:</b>', palavra='MARCA'),
)

if __name__ == '__main__':
    for i in sys.argv[1:] or list(C):
        gerar(i, C[i]); print('gerado', i)
