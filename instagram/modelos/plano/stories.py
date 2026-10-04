"""Gera as sequências de stories do plano (S??.html) a partir de uma especificação curta.

Cada sequência tem 4 frames: 3 com visual próprio + texto e rodapé compacto, e o 4º com a
pergunta, a área da figurinha e o rodapé completo. Uso: python3 stories.py S15 S16 …
(sem argumentos, gera todas as sequências de SEQUENCIAS)."""
import sys
from pathlib import Path

AQUI = Path(__file__).parent

CABECA = '''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="tirvo:formato" content="story">
  <meta name="tirvo:slides" content="4">
  <title>{id}: {titulo}</title>
  <link rel="stylesheet" href="../stories/premium/base.css">
  <link rel="stylesheet" href="story.css">
  <style>
    .peca {{ background: radial-gradient(560px 520px at 540px 760px, rgba(255, 85, 0, .15), transparent 70%), radial-gradient(900px 420px at 540px 1930px, rgba(255, 70, 0, .2), transparent 70%), linear-gradient(180deg, #050506 0%, #09090b 50%, #050506 100%); }}
    .vis {{ z-index: 3; left: 84px; top: 380px; width: 912px; height: 600px; display: grid; place-items: center; }}
    .vis > svg.fundo {{ position: absolute; inset: 0; }}
    .selo-ad {{ z-index: 4; left: 84px; top: 352px; }}
    .carimbo {{ display: inline-block; padding: 14px 30px; border: 5px solid #ff6a1f; border-radius: 12px; font: 600 64px/1 var(--mono); letter-spacing: .12em; color: #ff8a4c; transform: rotate(-8deg); box-shadow: 0 0 30px rgba(255, 85, 0, .35), inset 0 0 20px rgba(255, 85, 0, .2); text-shadow: 0 0 16px rgba(255, 85, 0, .6); }}
    .tag {{ display: inline-flex; align-items: center; gap: 14px; height: 92px; padding: 0 30px; font: 600 40px/1 var(--mono); letter-spacing: .08em; }}
    .tag .ico {{ font-size: 36px; color: #ff8a4c; }}
    .linha-ic {{ display: flex; align-items: center; gap: 18px; height: 96px; padding: 0 28px; font-size: 32px; font-weight: 560; letter-spacing: -.02em; }}
    .linha-ic .ico {{ font-size: 36px; color: #ff8a4c; filter: drop-shadow(0 0 6px rgba(255, 85, 0, .6)); }}
    .balao {{ max-width: 760px; padding: 30px 36px; border-radius: 34px; font-size: 40px; line-height: 1.25; letter-spacing: -.02em; }}
    .balao.c {{ border-bottom-right-radius: 10px; background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .14); }}
    .balao.t {{ border-bottom-left-radius: 10px; background: linear-gradient(135deg, rgba(255, 106, 31, .22), rgba(255, 51, 0, .08)), #120905; border: 1px solid rgba(255, 120, 60, .55); }}
    .balao small {{ display: block; margin-bottom: 12px; font: 500 18px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: #ffb187; }}
{css}
  </style>
</head>
<body>
'''

FRAME = '''  <main class="peca st" data-n="{n}">
    <header class="topo"><span>tirvo<b>_</b> / {tema}</span><span class="num">0{n}<i>/04</i></span></header>
    <svg class="regua" width="912" height="14"></svg>
{visual}
    <div class="txt" style="top:{top}px">{texto}</div>
    <div class="parte">{parte}</div>
    <div class="st-rod" data-frame="20,0,20,0" data-tone="branco"><img class="logo" data-logo><span class="lks"><span class="lk"><u>tirvo.tech</u></span><span class="arroba">@tirvotech</span></span></div>
  </main>
'''

FINAL = '''  <main class="peca st" data-n="4">
    <header class="topo"><span>tirvo<b>_</b> / {tema}</span><span class="num">04<i>/04</i></span></header>
    <svg class="regua" width="912" height="14"></svg>
    <p class="rotulo r"><i>//</i> {rotulo}</p>
    <h1 class="titulo" style="font-size:{tam}px">{pergunta}</h1>
{extra}
    <div class="figurinha" style="top:{fig_top}px;height:{fig_h}px"><i></i><i></i><i></i><i></i></div>
    <div class="st-fim">
      <div class="divisor-h"></div>
      <div class="links"><span class="lk"><svg class="ico"><use href="#i-globe"/></svg><u>{link}</u></span><span class="lk"><svg class="ico"><use href="#i-mail"/></svg><u>engenharia@tirvo.tech</u></span></div>
      <div class="acoes">
        <span class="btn cheio" data-frame="18,0,18,0" data-tone="quente"><span>Visite nosso site</span><svg class="ico"><use href="#i-arrow-up-right"/></svg></span>
        <span class="btn vazado" data-frame="0,18,0,18" data-tone="branco"><svg class="ico"><use href="#i-send"/></svg><span>Chame no direct</span></span>
      </div>
      <div class="base"><img class="logo" data-logo><span>@tirvotech</span></div>
    </div>
  </main>
  <script src="slide.js"></script>
{script}  <script src="../stories/premium/base.js"></script>
</body>
</html>
'''


def ico(nome):
    return f'<svg class="ico"><use href="#i-{nome}"/></svg>'


def gerar(sid, s):
    html = CABECA.format(id=sid, titulo=s['titulo'], css=s.get('css', ''))
    for i, (visual, texto, top) in enumerate(s['frames'], start=1):
        parte = ''.join('<i class="on"></i>' if k < i else '<i></i>' for k in range(4))
        html += FRAME.format(n=i, tema=s['tema'], visual=visual, texto=texto, top=top, parte=parte)
    f = s['final']
    html += FINAL.format(tema=s['tema'], rotulo=f['rotulo'], tam=f.get('tam', 96), pergunta=f['pergunta'],
                         extra=f.get('extra', ''), fig_top=f.get('fig_top', 800), fig_h=f.get('fig_h', 380),
                         link=f.get('link', 'tirvo.tech'), script=s.get('script', ''))
    (AQUI / f'{sid}.html').write_text(html, encoding='utf-8')


G = lambda t: f'<p class="grande">{t}</p>'
C = lambda t: f'<p class="corpo">{t}</p>'

SEQUENCIAS = {}

# ---------- Semana 3 ----------
SEQUENCIAS['S15'] = dict(
    titulo='quem responde o direct', tema='bastidor',
    css='''    .dm { width: 860px; display: grid; gap: 18px; }
    .dm .cx { display: flex; align-items: center; gap: 20px; height: 120px; padding: 0 34px; border-radius: 60px; border: 2px solid rgba(255, 255, 255, .2); background: #0e0e11; font-size: 36px; color: var(--t3); }
    .dm .cx i { width: 8px; height: 50px; background: #ff5500; box-shadow: 0 0 14px #ff5500; }
    .dm .cx .ico { margin-left: auto; font-size: 42px; color: #ff8a4c; }
    .dm pre { margin: 0; padding: 30px 34px; font: 500 26px/1.7 var(--mono); color: rgba(255, 255, 255, .22); border-radius: 22px; border: 1px dashed rgba(255, 255, 255, .12); }
    .dm pre b { color: rgba(255, 138, 76, .55); font-weight: 500; }
    .tags4 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; width: 860px; }''',
    frames=[
        ('''    <div class="vis"><div class="dm"><pre><b>const</b> projeto = escopo(conversa)
<b>for</b> (etapa <b>of</b> projeto) validar(etapa)</pre><div class="cx"><i></i>Mensagem…''' + ico('send') + '''</div></div></div>''',
         G('Quem responde este direct <em>também escreve código.</em>'), 1080),
        ('''    <svg class="vis arte" viewBox="0 0 912 600" style="display:block"><g fill="none" stroke-linecap="round"><path d="M80 150C300 150 360 300 520 300" stroke="rgba(255,255,255,.35)" stroke-width="4" stroke-dasharray="10 12"/><path d="M80 450C300 450 360 300 520 300" stroke="rgba(255,255,255,.35)" stroke-width="4" stroke-dasharray="10 12"/><path d="M520 300H820" stroke="#ff6a1f" stroke-width="7" style="filter:drop-shadow(0 0 8px #ff5500)"/><path d="M800 280l24 20-24 20" stroke="#ff6a1f" stroke-width="7"/></g><g font-family="Geist Mono" font-size="22" letter-spacing="3" fill="#8a8a93"><text x="80" y="120">ATENDIMENTO</text><text x="80" y="510">EXECUÇÃO</text></g><text x="660" y="270" text-anchor="middle" font-family="Geist Mono" font-size="22" letter-spacing="3" fill="#ffb187">A MESMA EQUIPE</text><circle cx="520" cy="300" r="16" fill="#ff5500" style="filter:drop-shadow(0 0 10px #ff5500)"/></svg>''',
         G('Sem repasse entre atendimento e execução.') + C('<b>Nada se perde no caminho.</b>'), 1060),
        ('''    <div class="vis"><div class="tags4">
      <span class="tag" data-frame="16,0,16,0" data-tone="laranja">''' + ico('browser') + '''SITE</span>
      <span class="tag" data-frame="16,0,16,0" data-tone="branco">''' + ico('gem') + '''MARCA</span>
      <span class="tag" data-frame="16,0,16,0" data-tone="branco">''' + ico('cpu') + '''IA</span>
      <span class="tag" data-frame="16,0,16,0" data-tone="branco">''' + ico('smartphone') + '''REDES</span>
    </div></div>''',
         G('Para começar, <em>uma palavra basta.</em>') + C('Mande no direct e a engenharia responde.'), 1040),
    ],
    final=dict(rotulo='enquete', pergunta='Sobre o que você<br>mandaria mensagem<br><em>hoje?</em>'),
)

SEQUENCIAS['S16'] = dict(
    titulo='site bom é site bonito?', tema='mito × verdade',
    css='''    .nav-b { position: relative; width: 760px; height: 460px; border-radius: 22px; border: 2px solid rgba(255, 255, 255, .2); background: linear-gradient(160deg, #1d1712, #0d0b0a); overflow: hidden; }
    .nav-b .bh { height: 50px; border-bottom: 1px solid rgba(255, 255, 255, .1); }
    .nav-b em { position: absolute; left: 50px; top: 120px; font: italic 400 96px/1 var(--serif); color: rgba(255, 255, 255, .85); }
    .nav-b .arco { position: absolute; right: 60px; bottom: -80px; width: 300px; height: 380px; border-radius: 150px 150px 0 0; background: linear-gradient(180deg, rgba(255, 255, 255, .14), rgba(255, 255, 255, .03)); }
    .nav-b .carimbo { position: absolute; right: 40px; top: 90px; }
    .cel { position: relative; width: 300px; height: 560px; border-radius: 44px; border: 2px solid rgba(255, 255, 255, .3); background: #0d0d10; overflow: hidden; }
    .cel .img { position: absolute; left: 20px; right: 20px; top: 60px; height: 380px; border-radius: 20px; background: linear-gradient(160deg, #2a2016, #120e0b); }
    .cel .bt { position: absolute; right: -60px; bottom: 30px; width: 160px; height: 56px; border-radius: 12px; background: #ff5500; opacity: .9; }
    .relo { display: grid; justify-items: center; gap: 30px; }
    .relo b { font: 600 220px/.8 var(--sans); letter-spacing: -.06em; color: transparent; -webkit-text-stroke: 3px rgba(255, 122, 51, .9); filter: drop-shadow(0 0 16px rgba(255, 85, 0, .4)); }
    .relo .bt-g { display: flex; align-items: center; gap: 16px; height: 110px; padding: 0 50px; border-radius: 20px; background: linear-gradient(135deg, #ff6a1f, #ff3300); font-size: 40px; font-weight: 600; box-shadow: 0 0 50px rgba(255, 85, 0, .5); }''',
    frames=[
        ('''    <div class="vis"><div class="nav-b"><div class="bh"></div><em>Lindo.</em><span class="arco"></span><span class="carimbo">MITO</span></div></div>''',
         G('Mito: <em>site bom é site bonito.</em>') + C('Bonito ajuda. Não basta.'), 1060),
        ('''    <div class="vis"><div class="cel"><span class="img"></span><span class="bt"></span></div>
      <svg class="fundo" viewBox="0 0 912 600"><g fill="none" stroke="#ff6a1f" stroke-width="4" style="filter:drop-shadow(0 0 6px #ff5500)"><path d="M640 470v-22h22M716 448h22v22M738 530v22h-22M662 552h-22v-22"/></g><text x="700" y="588" text-anchor="middle" font-family="Geist Mono" font-size="20" letter-spacing="2" fill="#ffb187">BOTÃO FORA DA TELA</text></svg></div>''',
         G('Tem site lindo que <em>ninguém consegue usar</em> no celular.'), 1060),
        ('''    <div class="vis"><div class="relo"><b>5 s</b><span class="bt-g">Pedir orçamento''' + ico('arrow-right') + '''</span></div></div>''',
         G('Verdade: site bom é o que faz o visitante <em>agir em segundos.</em>'), 1060),
    ],
    final=dict(rotulo='quiz', pergunta='Em 5 segundos,<br>o visitante entende<br><em>o que você faz?</em>', tam=90),
)

SEQUENCIAS['S17'] = dict(
    titulo='logo às pressas × marca com manual', tema='antes e depois',
    css='''    .guardanapo { width: 560px; height: 460px; transform: rotate(-4deg); border-radius: 8px; background: linear-gradient(160deg, #e9e5dc, #cfc9bc); box-shadow: 0 40px 70px rgba(0, 0, 0, .6); display: grid; place-items: center; }
    .apls { position: relative; width: 860px; height: 520px; }
    .apl { position: absolute; width: 240px; height: 200px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, .16); background: #121215; display: grid; place-items: center; font-size: 40px; font-weight: 700; letter-spacing: -.03em; }
    .apl small { position: absolute; left: 16px; bottom: 12px; font: 500 14px/1 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--t3); }''',
    frames=[
        ('''    <span class="selo-ad selo"><span class="led"></span>antes</span>
    <div class="vis"><div class="guardanapo"><svg viewBox="0 0 300 200" width="420" height="280"><g fill="none" stroke="#3f3a33" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M70 120c10-40 40-60 60-40s-10 50 10 50 40-60 70-40"/><path d="M60 150c60 6 120 6 180-4"/><path d="M90 60l20 10M200 50l-14 18" stroke-width="2"/></g><text x="150" y="190" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="26" fill="#3f3a33">por enquanto</text></svg></div></div>''',
         G('Antes: um logo feito às pressas, <em>"para resolver por enquanto".</em>'), 1060),
        ('''    <div class="vis"><div class="apls">
      <span class="apl" style="left:20px;top:30px;transform:rotate(-7deg);font-family:serif;font-weight:400;color:#d4d4d8">Marca<small>cartão</small></span>
      <span class="apl" style="left:310px;top:0;transform:rotate(4deg);color:#8a8a93;font-style:italic">MARCA<small>site</small></span>
      <span class="apl" style="left:600px;top:50px;transform:rotate(-3deg);font-family:monospace;font-weight:400;color:#a1a1aa">marca<small>fachada</small></span>
      <span class="apl" style="left:120px;top:290px;transform:rotate(6deg);color:#fafafa;font-weight:300;font-size:52px">marca<small>post</small></span>
      <span class="apl" style="left:470px;top:300px;transform:rotate(-5deg);letter-spacing:.2em;color:#d4d4d8">M A R C A<small>proposta</small></span>
    </div></div>''',
         G('Cada fornecedor aplica de um jeito. <span class="cinza">A marca se desmonta <em>peça por peça.</em></span>'), 1040),
        ('''    <span class="selo-ad selo"><span class="led"></span>depois</span>
    <div class="vis"><div class="apls">
      <svg class="fundo" viewBox="0 0 860 520" style="position:absolute;inset:0"><g stroke="rgba(255,122,51,.35)" stroke-width="1.4" stroke-dasharray="5 7"><path d="M0 40H860M0 250H860M0 290H860M0 500H860"/></g></svg>
      <span class="apl" style="left:10px;top:40px"><img data-logo style="height:30px"><small>cartão</small></span>
      <span class="apl" style="left:310px;top:40px"><img data-logo style="height:30px"><small>site</small></span>
      <span class="apl" style="left:610px;top:40px"><img data-logo style="height:30px"><small>fachada</small></span>
      <span class="apl" style="left:160px;top:290px"><img data-logo style="height:30px"><small>post</small></span>
      <span class="apl" style="left:460px;top:290px"><img data-logo style="height:30px"><small>proposta</small></span>
    </div></div>''',
         G('Depois: conceito, sistema e manual. <em>Igual em qualquer mão.</em>'), 1060),
    ],
    final=dict(rotulo='slider', pergunta='Quão igual a sua<br>marca está em<br><em>todos os lugares?</em>', tam=90),
)

SEQUENCIAS['S18'] = dict(
    titulo='quanto custa um site?', tema='pergunta de dono',
    css='''    .dado { width: 220px; height: 220px; border-radius: 34px; border: 3px solid rgba(255, 255, 255, .5); background: #121215; transform: rotate(14deg); display: grid; grid-template-columns: repeat(3, 1fr); padding: 30px; gap: 10px; }
    .dado i { width: 30px; height: 30px; border-radius: 50%; background: #fafafa; place-self: center; }
    .etiqueta { width: 300px; height: 170px; border-radius: 16px 60px 60px 16px; border: 3px dashed rgba(255, 122, 51, .7); display: grid; place-items: center; font: 600 90px/1 var(--mono); color: #ff8a4c; transform: rotate(-6deg); }
    .passos2 { display: grid; gap: 20px; width: 860px; }''',
    frames=[
        ('''    <div class="vis"><p class="balao c" style="justify-self:end">Quanto custa um site?</p></div>''',
         G('A pergunta que <em>todo mundo faz primeiro.</em>') + C('E ela merece uma resposta honesta.'), 1040),
        ('''    <div class="vis" style="grid-auto-flow:column;gap:80px"><span class="dado"><i></i><i style="visibility:hidden"></i><i></i><i style="visibility:hidden"></i><i></i><i style="visibility:hidden"></i><i></i><i style="visibility:hidden"></i><i></i></span><span class="etiqueta">?</span></div>''',
         G('Um número sem conhecer o projeto <em>é chute.</em>') + C('E chute vira surpresa no meio do caminho.'), 1040),
        ('''    <div class="vis"><div class="passos2">
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="branco">''' + ico('chat') + '''01 · Conversa e Descoberta</span>
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="laranja">''' + ico('file-code') + '''02 · Orçamento sem compromisso</span>
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="branco">''' + ico('check') + '''03 · Você decide com calma</span>
    </div></div>''',
         G('Primeiro entender. <em>Depois orçar.</em>'), 1060),
    ],
    final=dict(rotulo='caixinha', pergunta='Qual é a sua<br>pergunta antes de<br><em>começar um projeto?</em>', tam=88),
)

SEQUENCIAS['S19'] = dict(
    titulo='3 fases, 3 aprovações', tema='prova e convite',
    css='''    .carimbos { display: flex; gap: 40px; }
    .carimbos span { width: 230px; height: 230px; border-radius: 50%; border: 5px solid #ff6a1f; display: grid; place-items: center; text-align: center; font: 600 24px/1.25 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: #ff8a4c; box-shadow: 0 0 30px rgba(255, 85, 0, .3), inset 0 0 30px rgba(255, 85, 0, .15); }
    .carimbos span:nth-child(1) { transform: rotate(-10deg); } .carimbos span:nth-child(2) { transform: rotate(6deg); } .carimbos span:nth-child(3) { transform: rotate(-4deg); }
    .fases { display: grid; gap: 20px; width: 860px; }
    .publicar { display: grid; justify-items: center; gap: 30px; }
    .publicar .bt { display: flex; align-items: center; gap: 18px; height: 120px; padding: 0 56px; border-radius: 22px; border: 2px solid rgba(255, 255, 255, .25); background: #121215; font-size: 42px; font-weight: 600; color: var(--t2); }
    .publicar .bt .ico { font-size: 44px; color: #ff8a4c; }''',
    frames=[
        ('''    <div class="vis"><div class="carimbos"><span>escopo<br>ok</span><span>design<br>ok</span><span>no ar<br>ok</span></div></div>''',
         G('Em três momentos, <em>nada avança sem você.</em>'), 1060),
        ('''    <div class="vis"><div class="fases">
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="laranja">''' + ico('check') + '''Fim da Descoberta · aprova o escopo</span>
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="laranja">''' + ico('check') + '''Na Engenharia · aprova o design</span>
      <span class="linha-ic" data-frame="16,0,16,0" data-tone="branco" style="opacity:.55">''' + ico('lock') + '''Antes do Lançamento · …</span>
    </div></div>''',
         G('Primeiro o escopo. <em>Depois o design.</em>'), 1060),
        ('''    <div class="vis"><div class="publicar"><span class="bt">''' + ico('lock') + '''Publicar</span><span class="selo"><span class="led"></span>aguardando a sua aprovação</span></div></div>''',
         G('Você testa. <em>Só então vai ao ar.</em>') + C('É assim que o projeto termina sem surpresa.'), 1040),
    ],
    final=dict(rotulo='comece pela descoberta', pergunta='Mande <em>DESCOBERTA</em><br>no direct.', tam=100,
               extra='    <p class="corpo" style="position:absolute;z-index:4;left:84px;top:640px;width:900px">Ou veja o método completo no site.</p>',
               fig_top=760, fig_h=420, link='tirvo.tech/metodo'),
)

# ---------- Semanas 4 e 5 ----------
SEQUENCIAS['S22'] = dict(
    titulo='como planejamos o mês da própria Tirvo', tema='bastidor',
    css='''    .cal { display: grid; grid-template-columns: repeat(7, 104px); gap: 10px; }
    .cal span { height: 104px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, .12); background: rgba(255, 255, 255, .03); display: grid; place-items: center; font: 500 24px/1 var(--mono); color: var(--t3); }
    .cal span.f { border-color: rgba(255, 122, 51, .6); background: rgba(255, 85, 0, .1); color: #ffb187; }
    .sem4 { display: grid; gap: 16px; width: 860px; }
    .sem4 span { display: grid; grid-template-columns: 150px 1fr; align-items: center; height: 96px; padding: 0 28px; font-size: 32px; font-weight: 560; }
    .sem4 b { font: 500 22px/1 var(--mono); color: var(--or); letter-spacing: .1em; }
    .graf { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 860px; }
    .graf > div { height: 380px; padding: 30px; display: grid; align-content: space-between; }
    .graf small { font: 500 18px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--t3); }''',
    frames=[
        ('''    <div class="vis"><div class="cal">''' + ''.join(f'<span class="{"f" if k < 22 else ""}">{k+1:02d}</span>' for k in range(28)) + '''</div></div>''',
         G('Este perfil segue um plano de 30 dias. <em>Com testes.</em>'), 1060),
        ('''    <div class="vis"><div class="sem4">
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 1</b>Tipo de capa</span>
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 2</b>Gancho dos Reels</span>
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 3</b>Tipo de chamada</span>
      <span data-frame="16,0,16,0" data-tone="laranja"><b>SEM 4</b>Horário</span>
    </div></div>''',
         G('Um teste por semana. <em>Um de cada vez.</em>'), 1060),
        ('''    <div class="vis"><div class="graf">
      <div data-frame="18,0,18,0" data-tone="branco"><small>tudo junto</small><svg viewBox="0 0 360 200"><path d="M0 150 60 90 120 160 180 60 240 140 300 80 360 120" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="4"/></svg><small>o que mudou?</small></div>
      <div data-frame="18,0,18,0" data-tone="laranja"><small>uma variável</small><svg viewBox="0 0 360 200"><path d="M0 150 120 140 180 70 360 60" fill="none" stroke="#ff6a1f" stroke-width="5" style="filter:drop-shadow(0 0 6px #ff5500)"/><circle cx="180" cy="70" r="9" fill="#ff5500"/></svg><small>foi o horário</small></div>
    </div></div>''',
         G('Só assim dá para saber <em>o que mudou o resultado.</em>'), 1060),
    ],
    final=dict(rotulo='enquete', pergunta='No seu perfil,<br>o que você testaria<br><em>primeiro?</em>', tam=90),
)

SEQUENCIAS['S23'] = dict(
    titulo='rede social basta?', tema='mito × verdade',
    css='''    .perfil-m { position: relative; width: 320px; height: 560px; border-radius: 44px; border: 2px solid rgba(255, 255, 255, .3); background: #0d0d10; padding: 70px 22px; display: grid; align-content: start; gap: 12px; }
    .perfil-m .gr { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
    .perfil-m .gr i { aspect-ratio: 4 / 5; background: #1c1c21; border-radius: 3px; }
    .perfil-m .carimbo { position: absolute; left: 30px; top: 230px; }
    .duas { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 860px; }
    .duas > div { height: 360px; display: grid; justify-items: center; align-content: center; gap: 22px; text-align: center; }
    .duas b { font-size: 44px; font-weight: 680; letter-spacing: -.03em; }
    .duas small { font: 500 18px/1 var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--t3); }
    .duas .ico { font-size: 90px; color: #ff8c52; stroke-width: 1.2; filter: drop-shadow(0 0 10px rgba(255,85,0,.5)); }''',
    frames=[
        ('''    <div class="vis"><div class="perfil-m"><div class="gr">''' + '<i></i>'*9 + '''</div><span class="carimbo">MITO</span></div></div>''',
         G('Mito: <em>"meu negócio não precisa de site, tenho Instagram".</em>'), 1060),
        ('''    <svg class="vis arte" viewBox="0 0 912 600" style="display:block"><g stroke="rgba(255,255,255,.08)"><path d="M60 100H860M60 250H860M60 400H860M60 550H860"/></g><path d="M60 140C200 130 300 160 420 180S560 420 620 470 760 520 860 530" fill="none" stroke="#ff6a1f" stroke-width="6" style="filter:drop-shadow(0 0 8px #ff5500)"/><circle cx="860" cy="530" r="10" fill="#ff5500"/><text x="70" y="80" font-family="Geist Mono" font-size="20" letter-spacing="3" fill="#8a8a93">ALCANCE ORGÂNICO</text></svg>''',
         G('Algoritmo muda, perfil cai, <em>audiência fica na plataforma.</em>'), 1060),
        ('''    <div class="vis"><div class="duas"><div data-frame="20,0,20,0" data-tone="branco">''' + ico('smartphone') + '''<b>Atrai</b><small>rede social · vitrine</small></div><div data-frame="20,0,20,0" data-tone="laranja">''' + ico('landmark') + '''<b>Converte</b><small>site · sede</small></div></div></div>''',
         G('Verdade: um <em>não substitui</em> o outro.'), 1060),
    ],
    final=dict(rotulo='quiz', pergunta='Quem pesquisa você<br>no Google <em>chega onde?</em>', tam=92),
)

SEQUENCIAS['S24'] = dict(
    titulo='tudo no direct × site, WhatsApp e formulário', tema='antes e depois',
    css='''    .msgs { display: grid; gap: 12px; width: 760px; }
    .msgs span { display: grid; grid-template-columns: 70px 1fr auto; align-items: center; gap: 18px; height: 88px; padding: 0 22px; border-radius: 18px; background: rgba(255, 255, 255, .04); border: 1px solid rgba(255, 255, 255, .08); }
    .msgs i { width: 56px; height: 56px; border-radius: 50%; background: #1f1f24; }
    .msgs b { height: 14px; border-radius: 7px; background: rgba(255, 255, 255, .14); }
    .msgs small { font: 500 16px/1 var(--mono); color: var(--t3); }
    .msgs .perdido { border-color: rgba(255, 122, 51, .6); }
    .msgs .perdido small { color: #ff8a4c; }
    .fluxo { display: flex; align-items: center; gap: 18px; }
    .fluxo span { display: grid; justify-items: center; gap: 14px; width: 220px; padding: 30px 0; font-size: 28px; font-weight: 600; }
    .fluxo span .ico { font-size: 64px; color: #ff8c52; filter: drop-shadow(0 0 8px rgba(255,85,0,.5)); }
    .fluxo > .ico { font-size: 44px; color: var(--t3); }''',
    frames=[
        ('''    <span class="selo-ad selo"><span class="led"></span>antes</span>
    <div class="vis"><div class="msgs">''' + ''.join(f'<span><i></i><b style="width:{w}%"></b><small>{t}</small></span>' for w, t in [(80, '09:12'), (60, '10:40'), (70, '11:03'), (50, '13:27'), (65, '15:58')]) + '''</div></div>''',
         G('Antes: todo pedido chegava pelo direct, <em>misturado com tudo.</em>'), 1060),
        ('''    <div class="vis"><div class="msgs"><span class="perdido"><i></i><b style="width:70%"></b><small>visto · 3 dias</small></span><span style="opacity:.5"><i></i><b style="width:50%"></b><small>visto</small></span><span style="opacity:.3"><i></i><b style="width:60%"></b><small>visto</small></span></div></div>''',
         G('Pedido perdido, resposta atrasada, <em>cliente que desiste.</em>'), 1060),
        ('''    <span class="selo-ad selo"><span class="led"></span>depois</span>
    <div class="vis"><div class="fluxo"><span data-frame="18,0,18,0" data-tone="branco">''' + ico('browser') + '''Site</span>''' + ico('arrow-right') + '''<span data-frame="18,0,18,0" data-tone="branco">''' + ico('file-code') + '''Formulário</span>''' + ico('arrow-right') + '''<span data-frame="18,0,18,0" data-tone="laranja">''' + ico('whatsapp') + '''WhatsApp</span></div></div>''',
         G('Depois: o pedido chega <em>organizado</em> no WhatsApp certo.'), 1060),
    ],
    final=dict(rotulo='slider', pergunta='Quão organizada está<br>a entrada de pedidos<br><em>na sua empresa?</em>', tam=86),
)

SEQUENCIAS['S25'] = dict(
    titulo='vocês atendem fora de Curitiba?', tema='pergunta de dono',
    css='''    .mapa { position: relative; width: 640px; height: 600px; }
    .video { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 760px; }
    .video > div { height: 300px; border-radius: 22px; border: 1px solid rgba(255, 255, 255, .14); background: linear-gradient(160deg, #19191e, #0c0c0e); display: grid; place-items: center; }
    .video .ico { font-size: 90px; color: var(--t3); stroke-width: 1.2; }
    .video .eu .ico { color: #ff8c52; }''',
    frames=[
        ('''    <div class="vis"><p class="balao c" style="justify-self:end">Vocês atendem fora de Curitiba?</p></div>''',
         G('A pergunta que chega <em>de todo canto.</em>') + C('A resposta é sim.'), 1040),
        ('''    <div class="vis"><svg class="mapa" id="mapa" viewBox="0 0 640 600" width="640" height="600"></svg></div>''',
         G('A base é em Curitiba. <em>Os projetos, de todo o Brasil.</em>'), 1060),
        ('''    <div class="vis"><div class="video"><div data-frame="20,0,20,0" data-tone="branco">''' + ico('user') + '''</div><div class="eu" data-frame="20,0,20,0" data-tone="laranja">''' + ico('users') + '''</div></div></div>''',
         G('Reuniões, aprovações e acompanhamento <em>online.</em>') + C('Com a mesma proximidade de um atendimento presencial.'), 1040),
    ],
    final=dict(rotulo='caixinha', pergunta='O que mais você<br>quer saber <em>antes<br>de começar?</em>', tam=92),
)

SEQUENCIAS['S29'] = dict(
    titulo='4 testes em 30 dias', tema='bastidor',
    css='''    .cal { display: grid; grid-template-columns: repeat(6, 120px); gap: 10px; }
    .cal span { height: 110px; border-radius: 14px; border: 1px solid rgba(255, 122, 51, .5); background: rgba(255, 85, 0, .08); display: grid; place-items: center; }
    .cal span .ico { font-size: 36px; color: #ff8a4c; stroke-width: 2.4; }
    .sem4 { display: grid; gap: 16px; width: 860px; }
    .sem4 span { display: grid; grid-template-columns: 150px 1fr; align-items: center; height: 96px; padding: 0 28px; font-size: 32px; font-weight: 560; }
    .sem4 b { font: 500 22px/1 var(--mono); color: var(--or); letter-spacing: .1em; }
    .resultado { width: 860px; height: 420px; display: grid; place-items: center; }
    .resultado small { position: absolute; left: 30px; top: 26px; font: 500 18px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase; color: var(--or-pale); }''',
    frames=[
        ('''    <div class="vis"><div class="cal">''' + ('<span>' + ico('check') + '</span>') * 30 + '''</div></div>''',
         G('30 dias de perfil. 4 testes. <em>Nenhum chute.</em>'), 1080),
        ('''    <div class="vis"><div class="sem4">
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 1</b>Capa</span>
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 2</b>Gancho</span>
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 3</b>Chamada</span>
      <span data-frame="16,0,16,0" data-tone="branco"><b>SEM 4</b>Horário</span>
    </div></div>''',
         G('Um teste por semana. <em>E o que ganhou?</em>'), 1060),
        ('''    <div class="vis"><div class="resultado" data-frame="22,0,22,0" data-tone="laranja" data-acento="topo"><small>o que funcionou melhor</small></div></div>''',
         G('A resposta está aqui em cima, <em>escrita à mão.</em>'), 1060),
    ],
    final=dict(rotulo='enquete', pergunta='O que você quer<br>ver mais nos próximos<br><em>30 dias?</em>', tam=90),
)

SEQUENCIAS['S30'] = dict(
    titulo='logo pronto em 1 dia é economia?', tema='mito × verdade',
    css='''    .relogio24 { position: relative; display: grid; place-items: center; }
    .relogio24 .carimbo { position: absolute; right: -40px; top: 40px; }
    .versoes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 820px; }
    .versoes span { height: 170px; border-radius: 14px; border: 1px solid rgba(255, 255, 255, .14); background: #121215; display: grid; place-items: center; font: 500 22px/1 var(--mono); color: var(--t3); }
    .uma { display: grid; justify-items: center; gap: 30px; }
    .uma .apls { display: flex; gap: 14px; }
    .uma .apls span { width: 190px; height: 130px; border-radius: 12px; border: 1px solid rgba(255, 122, 51, .4); background: #121215; display: grid; place-items: center; }''',
    frames=[
        ('''    <div class="vis"><div class="relogio24"><svg viewBox="0 0 300 300" width="380" height="380"><circle cx="150" cy="150" r="130" fill="#0f0f12" stroke="rgba(255,255,255,.4)" stroke-width="6"/><path d="M150 150V60M150 150l60 30" stroke="#fafafa" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="150" r="10" fill="#ff5500"/><text x="150" y="250" text-anchor="middle" font-family="Geist Mono" font-size="22" fill="#8a8a93">24 h</text></svg><span class="carimbo">MITO</span></div></div>''',
         G('Mito: <em>logo feito em 1 dia é economia.</em>'), 1060),
        ('''    <div class="vis"><div class="versoes">''' + ''.join(f'<span>v{k}_final{"_agora" if k > 3 else ""}</span>' for k in range(1, 7)) + '''</div></div>''',
         G('Sem conceito e sem manual, <em>cada peça nova vira retrabalho.</em>'), 1060),
        ('''    <div class="vis"><div class="uma"><img data-logo style="height:90px"><div class="apls">''' + '<span><img data-logo style="height:26px"></span>' * 4 + '''</div></div></div>''',
         G('Verdade: marca com conceito e manual é feita uma vez <em>e aplicada sempre igual.</em>'), 1040),
    ],
    final=dict(rotulo='quiz', pergunta='Sua marca tem<br><em>manual?</em>', tam=104),
)

SEQUENCIAS['S25']['script'] = """  <script>
    (() => {
      const alvo = document.getElementById('mapa'); if (!alvo) return;
      const LON0 = -74.5, LAT0 = 5.6, K = 14, X0 = 40, Y0 = 12;
      const xy = (lat, lon) => [X0 + (lon - LON0) * K, Y0 + (LAT0 - lat) * K * 1.04];
      const brasil = [[5.2,-60.2],[4.5,-51.6],[2,-50],[-1,-48],[-1.5,-44],[-2.8,-41],[-3.5,-38.5],[-5,-35.2],[-8,-34.8],[-11,-37],[-13,-38.5],[-16,-39],[-19.5,-39.7],[-22.9,-41.9],[-23.5,-45],[-25.5,-48.3],[-28.5,-48.8],[-30.5,-50.3],[-33.7,-53.4],[-32,-53.8],[-30.2,-57.6],[-27.3,-55.5],[-26,-54.6],[-24,-54.3],[-22.5,-55.8],[-20,-58],[-16.3,-58.3],[-15.4,-60.2],[-13.5,-61.8],[-12.4,-64.5],[-11,-65.3],[-9.7,-66.6],[-10,-70.5],[-9.4,-72.7],[-7.4,-73.9],[-4.3,-70],[-2,-69.5],[-1,-70],[1.7,-69.4],[1.2,-66.9],[2.2,-63.9],[4.5,-64.5],[5.2,-60.2]];
      const dentro = (lat, lon) => { let c = false; for (let i = 0, j = brasil.length - 1; i < brasil.length; j = i++) { const [yi, xi] = brasil[i], [yj, xj] = brasil[j]; if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c; } return c; };
      let h = '<defs><filter id="hl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>';
      h += `<path d="M${brasil.map(p => xy(...p).map(v => v.toFixed(1)).join(' ')).join('L')}Z" fill="rgba(255,85,0,.04)" stroke="rgba(255,130,70,.4)" stroke-width="1.4"/>`;
      for (let lat = 5; lat >= -34; lat -= 1.3) for (let lon = -74; lon <= -34; lon += 1.3) { if (!dentro(lat, lon)) continue; const [x, y] = xy(lat, lon); h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="rgba(255,150,100,.45)"/>`; }
      const cwb = xy(-25.43, -49.27);
      [[-3.1, -60.0], [-1.46, -48.5], [-3.73, -38.5], [-8.05, -34.9], [-12.97, -38.5], [-15.79, -47.88], [-23.55, -46.63], [-22.9, -43.2], [-30.03, -51.23], [-20.44, -54.65], [-9.97, -67.8]].forEach(([la, lo]) => {
        const [x, y] = xy(la, lo); const mx = (cwb[0] + x) / 2, my = (cwb[1] + y) / 2 - Math.hypot(x - cwb[0], y - cwb[1]) * .28;
        const d = `M${cwb[0].toFixed(1)} ${cwb[1].toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
        h += `<path d="${d}" fill="none" stroke="#ff5500" stroke-width="4" opacity=".3" filter="url(#hl)"/><path d="${d}" fill="none" stroke="#ff8a4c" stroke-width="1.6"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#ffd2b8"/>`;
      });
      h += `<circle cx="${cwb[0]}" cy="${cwb[1]}" r="26" fill="none" stroke="rgba(255,120,60,.6)" stroke-width="1.4"/><circle cx="${cwb[0]}" cy="${cwb[1]}" r="9" fill="#ff5500" style="filter:drop-shadow(0 0 8px #ff5500)"/>`;
      h += `<text x="${cwb[0] - 40}" y="${cwb[1] + 52}" text-anchor="end" font-family="Geist Mono" font-size="18" letter-spacing="2" fill="#ffb187">CURITIBA</text>`;
      alvo.innerHTML = h;
    })();
  </script>
"""

if __name__ == '__main__':
    ids = sys.argv[1:] or list(SEQUENCIAS)
    for i in ids:
        gerar(i, SEQUENCIAS[i])
        print('gerado', i)
