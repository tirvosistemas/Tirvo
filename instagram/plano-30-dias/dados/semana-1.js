// Semana 1 (dias 1 a 7): fundação da vitrine. Os 9 posts da grade (P01 a P09), o post de sábado e os stories.
(() => {
  const add = (p) => PLANO.pecas.push(p);

  add({
    id: 'P01', dia: 1, hora: '08:30', formato: 'img', pilar: 'dono',
    titulo: 'Seu negócio está construído em terreno alugado',
    alavanca: 'Aversão à perda', metrica: 'Envios', cta: 'Enviar para quem vende só pelo direct',
    ficha: {
      nicho: 'Presença digital própria para empresas que dependem das redes sociais',
      publico: 'Dono de negócio que vende pelo Instagram e pelo WhatsApp e não tem site, ou tem um que ninguém usa',
      objetivo: 'Envios (alcance de topo de funil)',
      promessa: 'Entender por que rede social é vitrine e site é sede, e usar cada um no seu papel',
      tom: 'Opinativo direto, com contraste',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu perfil não é seu. É da plataforma.'],
      ['Dor aguda', 'Seu negócio está construído em terreno alugado.', 'Funciona com quem nunca ouviu falar da Tirvo e já traz a imagem que a arte desenha.'],
      ['Ganho rápido', 'Rede social é vitrine. Site é sede.'],
    ],
    arte: {
      texto: 'Seu negócio está construído em terreno alugado.\n\nRede social é vitrine. Site é sede.',
      direcao: 'Capa tipográfica. Título grande em Geist, com "terreno alugado" em Instrument Serif itálico. Abaixo, um esquema em traço fino: à esquerda, um lote quadriculado com uma etiqueta "alugado" e um perfil em cima; à direita, uma base sólida com o domínio "seu-site.com.br" e a mira laranja. Muito respiro, um único detalhe laranja (a mira) e a logo pequena embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Arte escura com o título "Seu negócio está construído em terreno alugado" e um esquema que compara um perfil de rede social, num lote marcado como alugado, com um site próprio sobre uma base sólida.',
    linhas: [
      'Seguidor não é cliente. E alcance emprestado não é patrimônio.',
      'O algoritmo muda sem aviso. O seu domínio, não.',
    ],
    legenda: `Seguidor não é cliente. E alcance emprestado não é patrimônio.

No Instagram, as regras não são suas. O algoritmo muda sem aviso, perfis são suspensos ou invadidos, e a audiência que levou anos para crescer continua sendo da plataforma.

Não é motivo para sair das redes. É motivo para usar cada coisa no seu papel:

→ Rede social atrai.
→ Site converte.

Um site próprio fica no seu domínio, aparece quando o cliente pesquisa no Google e recebe contatos 24 horas por dia, mesmo quando o post de ontem já sumiu do feed.

Começamos este perfil por aqui de propósito. A vitrine é aqui. A sede é tirvo.tech.

Manda para quem ainda vende só pelo direct.`,
    hashtags: '#presencadigital #criacaodesites #donodenegocio #pequenasempresas #tirvotech',
    teste: 'Faz parte da variável da semana (capa tipográfica). Compare envios por alcance e visitas ao perfil com os posts de capa visual.',
    instrucoes: ['Post 1 da grade: ele fica no canto inferior direito.', 'Depois do dia 5, fixe no perfil.', 'Compartilhe no story com a figurinha de post.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'P02', dia: 1, hora: '19:00', formato: 'carrossel', pilar: 'autoridade',
    titulo: '5 sinais de que o seu site está espantando clientes',
    alavanca: 'Curiosidade e aversão à perda', metrica: 'Salvamentos', cta: 'Salvar (secundário: SITE no direct)',
    ficha: {
      nicho: 'Sites para pequenas e médias empresas',
      publico: 'Dono de negócio com site no ar que recebe visitas e quase nenhum contato',
      objetivo: 'Salvamentos e envios',
      promessa: '5 sinais concretos que dá para conferir no próprio site em 2 minutos',
      tom: 'Educativo prático, direto',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu site é bonito. Por isso ninguém percebe o problema.'],
      ['Dor aguda', '5 sinais de que o seu site está espantando clientes.', 'É específico (5 sinais) e fala da perda que o dono já sente.'],
      ['Ganho rápido', 'Confira o seu site em 2 minutos com esta lista.'],
    ],
    slides: [
      ['5 sinais de que o seu site está espantando clientes.', 'Capa visual: janela de navegador em perspectiva, cursor saindo da tela, rótulo "checklist" em Geist Mono e numeração 01/08.', 'Abra o seu site ao lado e confira.'],
      ['01 · Demora para abrir no celular.\nQuem pesquisa no celular não espera. Cada segundo de tela branca é alguém voltando ao Google.', 'Barra de carregamento travada dentro de um celular, número 01 grande em contorno laranja.', 'E quando abre, falta o principal.'],
      ['02 · O botão de contato some.\nWhatsApp escondido no rodapé, telefone dentro de imagem. Se o próximo passo não é óbvio, ele não acontece.', 'Tela de celular com o botão de WhatsApp apagado no rodapé e uma mira apontando onde ele deveria estar.', 'O terceiro sinal é o mais comum.'],
      ['03 · Parece o site do concorrente.\nTema pronto é compartilhado com milhares de sites. O seu cliente já viu esse layout em outro negócio.', 'Três janelas idênticas lado a lado, só o logo muda.', 'O quarto sinal ninguém vê, só o Google.'],
      ['04 · Não aparece no Google pelo que você faz.\nSem estrutura semântica, metadados e dados estruturados, o Google não entende do que a página trata.', 'Resultado de busca em branco com uma lupa e trechos de código fantasma ao fundo.', 'O último sinal aparece no pior dia.'],
      ['05 · Ninguém sabe quem cuida dele.\nDomínio, hospedagem, SSL e atualizações sem dono. O site fica no ar até o dia em que para.', 'Painel de status com uma luz apagada e o rótulo "sem responsável".', 'Agora conte quantos você marcou.'],
      ['Contou 2 ou mais?\nO problema raramente é o design. É a engenharia por baixo dele.', 'Placar 0/5 com caixas de seleção em traço laranja. "engenharia" em Instrument Serif itálico.', 'O próximo passo está no último slide.'],
      ['Salve para revisar o seu site com calma.\nQuer uma segunda opinião técnica? Chame no direct com a palavra SITE.', 'Slide final com o rodapé completo: logo, tirvo.tech e engenharia@tirvo.tech em azul de link, botões "Visite nosso site" e "Chame no direct".', ''],
    ],
    capa: 'Slide 01. A janela de navegador é a imagem; o título ocupa o terço de cima.',
    alt: 'Carrossel com 5 sinais de que um site afasta clientes: demora no celular, botão de contato escondido, layout igual ao do concorrente, ausência no Google e falta de responsável técnico.',
    linhas: [
      'Se o seu site recebe visitas e não recebe contatos, o motivo costuma estar num destes 5 pontos.',
      'Um site pode ser bonito e, mesmo assim, afastar quem chega nele.',
    ],
    legenda: `Se o seu site recebe visitas e não recebe contatos, o motivo costuma estar num destes 5 pontos.

01 Demora para abrir no celular
02 O botão de contato some
03 Parece o site do concorrente
04 Não aparece no Google pelo que você faz
05 Ninguém sabe quem cuida dele

Nenhum deles se resolve trocando as cores. Todos se resolvem na engenharia: código leve, caminho claro até o contato, SEO técnico desde a primeira linha e alguém responsável depois da entrega.

Salve para revisar o seu site com calma. Se quiser uma segunda opinião técnica, chame no direct com a palavra SITE.`,
    hashtags: '#criacaodesites #sitesprofissionais #seotecnico #performanceweb #webdesign',
    teste: 'Capa visual (variável da semana). Observe quantas pessoas passam do slide 1 e os salvamentos por alcance.',
    instrucoes: ['Publique as 8 imagens na ordem, de 01 a 08.', 'Depois do dia 5, fixe no perfil.', 'Responda quem comentar SITE em até 1 hora.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'S01', dia: 1, hora: '12:30', formato: 'stories', pilar: 'vitrine', tema: 'Bastidor real',
    titulo: 'O perfil abriu hoje, do zero e de propósito',
    alavanca: 'Curiosidade (paradoxo)', metrica: 'Respostas na enquete', cta: 'Votar na enquete',
    ficha: {
      nicho: 'Bastidores da própria Tirvo',
      publico: 'Quem visitou o perfil no primeiro dia e as pessoas da sementeira',
      objetivo: 'Respostas e relacionamento',
      promessa: 'Mostrar com honestidade como e por que o perfil começa',
      tom: 'Bastidores, próximo',
    },
    ganchos: [
      ['Quebra de padrão', 'Uma agência de tecnologia começando o Instagram do zero.', 'O paradoxo prende quem chega e é verdadeiro.'],
      ['Dor aguda', 'Zero seguidores. E tudo bem.'],
      ['Ganho rápido', 'O que você vai encontrar aqui, em 4 stories.'],
    ],
    frames: [
      ['Gancho de contexto', 'Este perfil abriu hoje. Zero seguidores.', 'Contador "0" grande em Geist Mono, com o cursor laranja piscando ao lado. Logo pequena.', '', 'E foi de propósito.'],
      ['Fricção narrativa', 'Começar do zero, com o mesmo rigor de um projeto. Nada de seguidor comprado.', 'Régua de medida e a mira travando no centro da tela.', '', 'Tem um paradoxo nisso.'],
      ['Valor ou paradoxo', 'Uma agência que avisa: rede social é terreno alugado. Por isso a sede é tirvo.tech.', 'Lote quadriculado "alugado" × base sólida com o domínio, em traço fino.', '', 'Agora você escolhe.'],
      ['Conversão com figurinha', 'O que você quer ver primeiro por aqui?', 'Área livre no centro para a enquete. Rodapé completo.', 'Enquete: "Sites que vendem" / "Marca forte"', ''],
    ],
    teste: 'Saídas no frame 1 e respostas na enquete. É a linha de base dos stories.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Coloque a enquete na área marcada do frame 4.', 'Use o resultado da enquete para escolher o tema dos stories de quarta.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P03', dia: 2, hora: '12:15', formato: 'reels', pilar: 'autoridade',
    titulo: 'Template × projeto sob medida',
    alavanca: 'Contraste antes e depois', metrica: 'Retenção e envios', cta: 'Comentar TEMPLATE ou PROJETO',
    ficha: {
      nicho: 'Sites sob medida × temas prontos',
      publico: 'Dono de negócio que montou o site num construtor ou tema pronto e sente que ele não se diferencia',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'Ver, em 20 segundos, o que muda por baixo de um site feito do zero',
      tom: 'Contra-intuitivo, visual',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu site pode ter o layout de milhares de empresas.', 'Para no primeiro segundo, sem som, e a imagem do mosaico prova o que o texto diz.'],
      ['Dor aguda', 'O tema pronto está pesando no seu site.'],
      ['Ganho rápido', 'Template ou sob medida: a diferença em 20 segundos.'],
    ],
    roteiro: {
      duracao: '20 s', palavras: 46, audio: 'Sem narração. Faixa instrumental escolhida no app, volume baixo. Todo o conteúdo está no texto da tela.',
      linhas: [
        ['0–2 s', 'Seu site pode ter o layout de milhares de empresas.', 'Mosaico de 9 sites idênticos. A mira se fecha sobre um deles.'],
        ['2–5 s', 'Tema pronto: o mesmo layout, só troca o logo.', 'Os logos trocam em cortes secos sobre o mesmo layout.'],
        ['5–9 s', 'Por baixo, plugins que você não usa pesam em cada página.', 'Camadas de código se empilham e a barra de carregamento trava.'],
        ['9–13 s', 'Sob medida: código escrito do zero para o seu negócio.', 'Decodificação: símbolos de código se organizam numa interface limpa.'],
        ['13–17 s', 'Mais leve. Mais seguro. Mais fácil de evoluir.', 'Três marcações em laranja acendem, uma por vez.'],
        ['17–20 s', 'O seu é template ou projeto? Responde nos comentários.', 'Cartão final com a logo e o cursor piscando.'],
      ],
    },
    capa: 'Mosaico de sites idênticos com o título "Template × sob medida". A área central de 1080 × 1350 fica legível na grade.',
    alt: 'Reels que compara um site feito com tema pronto, igual ao de milhares de empresas, com um site sob medida, mais leve e seguro.',
    linhas: [
      'Tema pronto é rápido de montar e difícil de diferenciar.',
      'O layout que você escolheu num catálogo também foi escolhido por outros negócios.',
    ],
    legenda: `Tema pronto é rápido de montar e difícil de diferenciar.

Num projeto sob medida, o código nasce para o seu negócio: sem plugins que você não usa, com SEO técnico integrado e uma interface desenhada a partir da sua marca.

O seu site hoje é template ou projeto? Responde aqui nos comentários.`,
    hashtags: '#sitesobmedida #criacaodesites #desenvolvimentoweb #webdesignbrasil',
    teste: 'Capa tipográfica. Observe a retenção nos 3 primeiros segundos e o tempo médio assistido.',
    instrucoes: ['Vídeo produzido depois do plano (aguardando a sua liberação).', 'Escolha a música no app antes de publicar.', 'Compartilhe no story.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'P04', dia: 2, hora: '19:00', formato: 'carrossel', pilar: 'marca',
    titulo: 'Logotipo e logomarca não são a mesma coisa',
    alavanca: 'Curiosidade (quebra de crença)', metrica: 'Salvamentos', cta: 'Salvar para o dia do briefing',
    ficha: {
      nicho: 'Logotipo e identidade visual',
      publico: 'Empreendedor que vai criar ou refazer a marca e não sabe o que pedir',
      objetivo: 'Salvamentos e envios',
      promessa: 'Saber exatamente o que pedir: logotipo, logomarca ou identidade visual completa',
      tom: 'Educativo prático',
    },
    ganchos: [
      ['Quebra de padrão', 'Logotipo e logomarca não são a mesma coisa.', 'Desmonta uma crença comum e promete um ganho imediato: pedir certo.'],
      ['Dor aguda', 'Pediu um logo e recebeu só um desenho?'],
      ['Ganho rápido', 'O que pedir no briefing da sua marca, em 7 slides.'],
    ],
    slides: [
      ['Logotipo e logomarca não são a mesma coisa.', 'Capa visual: à esquerda, só as letras; à direita, símbolo e nome juntos. Os dois exemplos montados com a própria marca da Tirvo.', 'Veja a diferença na prática.'],
      ['Logotipo\nÉ o nome escrito de um jeito único. Só tipografia, desenhada para a marca.', 'A palavra "tirvo" isolada, com medidas em volta das letras.', 'E quando entra um símbolo?'],
      ['Logomarca\nÉ o termo que o Brasil usa para símbolo e nome juntos.', 'A logo completa da Tirvo: a mira e o nome. Rótulos apontam "símbolo" e "nome".', 'Mas a marca não para no desenho.'],
      ['Identidade visual é o sistema inteiro.\nPaleta, tipografia, manual de marca e aplicações.', 'Quatro blocos com ícones em traço laranja.', 'Começando pela cor e pela letra.'],
      ['Paleta e tipografia\nFazem a marca ser reconhecida antes de alguém ler o nome.', 'Amostras de cor da Tirvo (preto, laranja, branco) e as três fontes escritas nelas mesmas.', 'E o que mantém tudo igual?'],
      ['Manual de marca\nAs regras que mantêm tudo igual em qualquer mão: respiro, tamanho mínimo, usos proibidos.', 'Diagrama de área de respiro em volta da logo, medido pela altura da mira.', 'Na hora de contratar, lembre disso.'],
      ['No briefing, peça o sistema, não só o desenho.\nSalve para usar quando for contratar.', 'Slide final com o rodapé completo: logo, links, botões.', ''],
    ],
    capa: 'Slide 01, comparação lado a lado.',
    alt: 'Carrossel que explica a diferença entre logotipo, logomarca e identidade visual, usando a própria marca da Tirvo como exemplo.',
    linhas: [
      'Logotipo é o nome desenhado. Logomarca, no Brasil, é símbolo mais nome. A identidade é todo o resto.',
      'Antes de pedir um logo, vale saber o nome do que você está pedindo.',
    ],
    legenda: `Logotipo é o nome desenhado. Logomarca, no Brasil, é símbolo mais nome. A identidade visual é todo o resto.

E é no resto que a marca se sustenta: paleta, tipografia, manual e aplicações reais. Sem isso, cada peça nova sai de um jeito, e a marca se desmonta aos poucos.

Por isso, na Tirvo, um projeto de marca entrega o desenho e o sistema: conceito, logotipo, paleta, tipografia, manual de marca e aplicações.

Salve para o dia do briefing.`,
    hashtags: '#identidadevisual #logotipo #branding #designdemarca #tirvotech',
    teste: 'Capa visual. Compare salvamentos por alcance com P02.',
    instrucoes: ['Publique as 7 imagens na ordem.', 'Compartilhe no story.'],
    midia: { qtd: 7 },
  });

  add({
    id: 'P05', dia: 3, hora: '08:30', formato: 'img', pilar: 'autoridade',
    titulo: 'Ninguém sério pode prometer posição no Google',
    alavanca: 'Verdade contra-intuitiva', metrica: 'Envios e salvamentos', cta: 'Enviar para quem recebeu "primeira página garantida"',
    ficha: {
      nicho: 'SEO técnico para sites de empresas',
      publico: 'Dono de negócio que já recebeu proposta com primeira página garantida no Google',
      objetivo: 'Envios',
      promessa: 'Separar o que dá para garantir (a base técnica) do que ninguém controla (a posição)',
      tom: 'Opinativo direto',
    },
    ganchos: [
      ['Quebra de padrão', 'Ninguém sério pode prometer posição no Google.', 'Contraria uma promessa comum de mercado e dá um critério para o leitor se proteger.'],
      ['Dor aguda', 'Pagou por "primeira página garantida"? Leia isto.'],
      ['Ganho rápido', 'O que realmente faz o Google entender o seu site.'],
    ],
    arte: {
      texto: 'Ninguém sério pode prometer posição no Google.\n\nPode entregar a base técnica certa.',
      direcao: 'Capa tipográfica. Barra de busca grande com o texto "1º lugar garantido" riscado em laranja. Título em Geist, com "posição" em Instrument Serif itálico. Logo embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Arte com o título "Ninguém sério pode prometer posição no Google" e uma barra de busca com a frase "1º lugar garantido" riscada.',
    linhas: [
      'Quem garante a primeira posição no Google está prometendo algo que não controla.',
      'Posição no Google depende de concorrência, conteúdo e autoridade. Nenhuma agência controla os três.',
    ],
    legenda: `Quem garante a primeira posição no Google está prometendo algo que não controla.

A posição depende da concorrência, do conteúdo e da autoridade do domínio. Isso muda o tempo todo e não está na mão de quem cria o site.

O que dá para entregar, e a Tirvo entrega em todo site:

→ estrutura semântica
→ metadados
→ dados estruturados
→ alta performance

É a base para o Google encontrar e entender a página. O resto se constrói com conteúdo e tempo.

Manda para quem recebeu uma proposta com "primeira página garantida".`,
    hashtags: '#seo #seotecnico #criacaodesites #sitesprofissionais',
    teste: 'Capa tipográfica. Compare envios por alcance com P01.',
    instrucoes: ['Compartilhe no story.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'P06', dia: 3, hora: '19:00', formato: 'carrossel', pilar: 'vitrine',
    titulo: 'Como nasce um logo: 5 etapas',
    alavanca: 'Curiosidade de bastidor (processo)', metrica: 'Salvamentos e visitas ao perfil', cta: 'Salvar para consultar depois',
    ficha: {
      nicho: 'Logotipo e identidade visual: processo',
      publico: 'Empreendedor que vai criar ou refazer o logo e quer entender o que está comprando',
      objetivo: 'Salvamentos e visitas ao perfil',
      promessa: 'Entender as 5 etapas entre a ideia e um logo que funciona em qualquer tamanho',
      tom: 'Bastidores, técnico e claro',
    },
    ganchos: [
      ['Quebra de padrão', 'Um logo começa antes do desenho.', 'Contraria a ideia de que logo é só desenhar, e promete o processo inteiro.'],
      ['Dor aguda', 'O seu logo some na aba do navegador?'],
      ['Ganho rápido', 'As 5 etapas de um logo que funciona em qualquer tamanho.'],
    ],
    slides: [
      ['Um logo começa antes do desenho.', 'Capa: desenho técnico abstrato, com grade, círculos de construção, cotas e o ponto laranja no centro. Nenhuma marca fictícia.', '5 etapas.'],
      ['01 · Conceito\nUma frase antes de um traço. Para quem é, o que promete e do que precisa se diferenciar.', 'Campo de texto com a pergunta "O que essa marca precisa dizer?" e o cursor laranja.', 'Depois, os esboços.'],
      ['02 · Esboços\nMuitas ideias. Poucas sobrevivem.', 'Grade 3 × 3 de formas geométricas simples. Oito riscadas, uma destacada em laranja.', 'A escolhida vai para a régua.'],
      ['03 · Construção\nCada curva tem uma medida.', 'Desenho técnico com grade, diagonais, cotas e ângulo.', 'Agora, o teste.'],
      ['04 · Teste pequeno\nSe some em 16 px, ainda não está pronto.', 'O ícone oficial da Tirvo em 240, 110, 48 e 16 px, com o uso de cada tamanho.', 'E ainda falta o sistema.'],
      ['05 · Sistema\nLogo sozinho não é marca. Paleta, tipografia e manual.', 'Três faixas: paleta da Tirvo, as três fontes e os itens do manual.', 'Quer ver um caso inteiro?'],
      ['Quer ver o processo de ponta a ponta?\nA história da nossa própria marca está em tirvo.tech/marca.html.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01, desenho técnico.',
    alt: 'Carrossel em 7 imagens com as 5 etapas de criação de um logo na Tirvo: conceito, esboços, construção, teste em tamanho pequeno e sistema de marca.',
    linhas: [
      'Um logo bom passa por 5 etapas antes de chegar à tela.',
      'O desenho é a terceira etapa, não a primeira.',
    ],
    legenda: `Um logo bom passa por 5 etapas antes de chegar à tela. O desenho é só a terceira.

1. Conceito: uma frase que diz para quem a marca é e o que ela promete.
2. Esboços: muitas ideias, comparadas com essa frase.
3. Construção: grade, proporção e espessura definidas.
4. Teste pequeno: se some em 16 px, volta para a régua.
5. Sistema: paleta, tipografia e manual, para a marca sair igual em qualquer peça.

O caso completo da nossa própria marca está em tirvo.tech/marca.html.

Salve para consultar quando for criar o seu.`,
    hashtags: '#logotipo #identidadevisual #designdelogo #branding #tirvotech',
    teste: 'Carrossel de processo. Compare salvamentos por alcance com o P02.',
    instrucoes: ['Publique as 7 imagens na ordem.', 'Compartilhe no story.'],
    midia: { qtd: 7 },
  });

  add({
    id: 'S03', dia: 3, hora: '12:30', formato: 'stories', pilar: 'autoridade', tema: 'Antes e depois de uma decisão',
    titulo: 'Do "quero o 1º lugar" ao "quero ser entendido pelo Google"',
    alavanca: 'Contraste antes e depois', metrica: 'Respostas no quiz', cta: 'Responder o quiz',
    ficha: {
      nicho: 'SEO técnico',
      publico: 'Seguidores recentes e visitantes do perfil',
      objetivo: 'Respostas e relacionamento',
      promessa: 'Trocar uma meta impossível por uma meta que dá para construir',
      tom: 'Educativo, leve',
    },
    ganchos: [
      ['Quebra de padrão', 'A pergunta errada sobre o Google.', 'Gera curiosidade e liga com o post da manhã.'],
      ['Dor aguda', 'Seu site não aparece. Pode ser o pedido.'],
      ['Ganho rápido', 'Uma troca de pedido que muda o projeto.'],
    ],
    frames: [
      ['Gancho de contexto', 'Antes: "quero aparecer em 1º no Google".', 'Barra de busca com "1º lugar" e um X laranja.', '', 'Parece razoável.'],
      ['Fricção narrativa', 'Ninguém controla a posição. Concorrência, conteúdo e autoridade mudam todo dia.', 'Três medidores girando sozinhos.', '', 'Então, qual é o pedido certo?'],
      ['Valor ou paradoxo', 'Depois: "quero que o Google entenda o meu site". Isso dá para construir.', 'Código semântico se organizando ao lado de uma lupa com a mira.', '', 'Teste o que você já sabe.'],
      ['Conversão com figurinha', 'O que mais ajuda o Google a entender um site?', 'Área livre para o quiz. Rodapé completo.', 'Quiz: "Cores bonitas" / "Estrutura e conteúdo" (certa: estrutura e conteúdo)', ''],
    ],
    teste: 'Taxa de resposta no quiz e saídas no frame 1, comparadas com S01.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Quiz no frame 4, na área marcada.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P07', dia: 4, hora: '12:15', formato: 'carrossel', pilar: 'dono',
    titulo: '3 tarefas que a IA já pode assumir na sua empresa',
    alavanca: 'Ganho rápido e especificidade', metrica: 'Salvamentos', cta: 'IA no direct',
    ficha: {
      nicho: 'Inteligência artificial aplicada a empresas',
      publico: 'Dono de negócio curioso sobre IA, sem saber por onde começar',
      objetivo: 'Salvamentos e conversas',
      promessa: '3 usos concretos de IA que entram no que a empresa já usa, sem trocar tudo',
      tom: 'Educativo prático, sem jargão',
    },
    ganchos: [
      ['Quebra de padrão', 'IA no negócio não começa pelo chatbot.'],
      ['Dor aguda', 'Sua equipe passa o dia copiando dados de um lugar para outro?'],
      ['Ganho rápido', '3 tarefas que a IA já pode assumir na sua empresa.', 'É concreto, cabe na rotina do dono e não exige conhecer o assunto.'],
    ],
    slides: [
      ['3 tarefas que a IA já pode assumir na sua empresa.', 'Capa tipográfica: "IA" em Instrument Serif itálico, com um chip em traço laranja ao fundo.', 'Antes, uma regra.'],
      ['A IA entra no que você já usa.\nSistema, site, WhatsApp, planilhas. Não precisa trocar tudo.', 'Ícones dos sistemas atuais ligados a um ponto central por fios.', 'A primeira tarefa está no seu WhatsApp.'],
      ['01 · Atendimento\nResponder dúvidas frequentes a qualquer hora, com as informações reais da empresa.', 'Balões de conversa com a mira no último.', 'A segunda poupa horas da equipe.'],
      ['02 · Triagem de solicitações\nLer o pedido, separar por tipo e encaminhar para a pessoa certa.', 'Funil com pedidos entrando e saindo em três trilhas.', 'A terceira está nos seus arquivos.'],
      ['03 · Consulta a documentos internos\nEncontrar a resposta em contratos, manuais e tabelas sem abrir um por um.', 'Pilha de documentos com uma lupa e um trecho destacado.', 'Veja um exemplo do começo ao fim.'],
      ['Exemplo ilustrativo\nOrçamento de 40 cadeiras pelo WhatsApp: consultou o estoque, calculou preço e prazo, enviou a proposta.', 'Linha do tempo em três passos, com marcações de "feito".', 'Só falta a ordem certa.'],
      ['A ordem certa\n01 · Entender onde a IA gera resultado.\n02 · Só então projetar a integração.', 'Dois passos numerados em Geist Mono, ligados por uma seta.', 'Quer descobrir o seu ponto de partida?'],
      ['Onde a IA cabe no seu negócio?\nChame no direct com a palavra IA.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01, capa tipográfica.',
    alt: 'Carrossel com 3 tarefas que a inteligência artificial pode assumir numa empresa: atendimento, triagem de solicitações e consulta a documentos internos.',
    linhas: [
      'A IA mais útil para uma empresa raramente é a mais chamativa.',
      'Antes de pensar em robô, pense em tarefa repetida.',
    ],
    legenda: `A IA mais útil para uma empresa raramente é a mais chamativa.

Ela costuma estar em tarefas repetidas que já existem:

01 Atendimento de dúvidas frequentes
02 Triagem de solicitações
03 Consulta a documentos internos

E ela entra no que você já usa: o sistema, o site, o WhatsApp. Não precisa trocar tudo.

A ordem importa. Primeiro entendemos onde a IA gera resultado de verdade. Só depois projetamos a integração.

Quer descobrir onde a IA cabe no seu negócio? Chame no direct com a palavra IA.`,
    hashtags: '#inteligenciaartificial #iaparaempresas #automacao #agentesdeia #tirvotech',
    teste: 'Capa tipográfica. Compare salvamentos com P02 e P04.',
    instrucoes: ['Publique as 8 imagens na ordem.', 'Não citar o Hipercode neste post.', 'Compartilhe no story.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'P08', dia: 4, hora: '19:00', formato: 'carrossel', pilar: 'vitrine',
    titulo: 'Por dentro do tirvo.tech: 6 decisões do nosso próprio site',
    alavanca: 'Identidade e prova', metrica: 'Cliques no link e visitas ao perfil', cta: 'Ver ao vivo no link da bio',
    ficha: {
      nicho: 'Sites premium: o site da própria agência como prova',
      publico: 'Empreendedor que avalia uma agência pelo site dela antes de pedir orçamento',
      objetivo: 'Cliques no link e visitas ao perfil',
      promessa: '6 decisões de projeto que dá para levar para qualquer site',
      tom: 'Bastidores, técnico e próximo',
    },
    ganchos: [
      ['Quebra de padrão', 'O site de uma agência é o portfólio que não dá para fingir.', 'Coloca a Tirvo à prova logo de saída e convida a conferir.'],
      ['Dor aguda', 'Se a agência não cuida do próprio site, vai cuidar do seu?'],
      ['Ganho rápido', '6 decisões de projeto que você pode levar para o seu site.'],
    ],
    slides: [
      ['O site de uma agência é o portfólio que não dá para fingir.\nPor dentro do tirvo.tech.', 'Capa visual: captura real da abertura do tirvo.tech num celular em perspectiva.', '6 decisões, uma por slide.'],
      ['01 · A abertura se decodifica.\nSímbolos de código viram o nome: a marca nasce de código, como o trabalho.', 'Captura da abertura com os símbolos 0 1 < > / { }.', 'Logo depois, o problema do visitante.'],
      ['02 · O alerta vem antes dos serviços.\nA página começa pelo problema de quem chega: o negócio em terreno alugado.', 'Captura da seção "O alerta".', 'Só então, o que fazemos.'],
      ['03 · Cinco frentes, um padrão.\nSites, sistemas, marca, design e IA com o mesmo rigor.', 'Captura da seção de serviços.', 'E como o projeto acontece.'],
      ['04 · O método à vista.\nTrês fases e três aprovações. O cliente sabe o que vem antes de começar.', 'Captura da seção do método.', 'Por baixo de tudo isso.'],
      ['05 · Performance desde a primeira linha.\nCódigo sob medida, sem tema pronto, com SEO técnico integrado.', 'Trecho de código real do site com a mira sobre ele.', 'E o mais importante.'],
      ['06 · Um próximo passo em toda página.\n"Iniciar projeto" e WhatsApp sempre à mão.', 'Captura do menu com o botão em destaque.', 'Veja ao vivo.'],
      ['Veja ao vivo: tirvo.tech\nO link está na bio.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01, celular com o site.',
    alt: 'Carrossel que mostra 6 decisões de projeto do site da Tirvo, com capturas de tela do tirvo.tech.',
    linhas: [
      'Antes de pedir orçamento a uma agência, abra o site dela. Começamos pelo nosso.',
      'Cada seção do tirvo.tech tem um motivo. Aqui estão 6.',
    ],
    legenda: `Antes de pedir orçamento a uma agência, abra o site dela. Começamos pelo nosso.

Cada seção do tirvo.tech tem um motivo:

01 A abertura se decodifica
02 O alerta vem antes dos serviços
03 Cinco frentes, um padrão
04 O método à vista
05 Performance desde a primeira linha
06 Um próximo passo em toda página

Nenhuma delas veio de um tema pronto. Todas dá para levar para o seu site.

Veja ao vivo pelo link na bio.`,
    hashtags: '#webdesign #sitesprofissionais #desenvolvimentoweb #uxdesign #tirvotech',
    teste: 'Capa visual. Observe cliques no link do perfil nas 24 h seguintes.',
    instrucoes: ['Publique as 8 imagens na ordem.', 'Depois do dia 5, fixe no perfil.', 'Compartilhe no story com a figurinha de link para tirvo.tech.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'P09', dia: 5, hora: '12:15', formato: 'img', pilar: 'autoridade',
    titulo: 'O site não termina no lançamento',
    alavanca: 'Aversão à perda', metrica: 'Visitas ao perfil e cliques no link', cta: 'Detalhes no link da bio',
    ficha: {
      nicho: 'Manutenção e operação de sites',
      publico: 'Dono de negócio que já ficou sem saber quem chamar quando o site saiu do ar',
      objetivo: 'Cliques no link',
      promessa: 'Conhecer os dois jeitos de manter o site sob controle depois da entrega',
      tom: 'Educativo direto',
    },
    ganchos: [
      ['Quebra de padrão', 'O site não termina no lançamento.', 'Ecoa o cursor da marca (a Tirvo segue rodando) e abre a comparação.'],
      ['Dor aguda', 'O site caiu e você não sabe nem quem chamar?'],
      ['Ganho rápido', 'Dois jeitos de manter o site sob controle depois da entrega.'],
    ],
    arte: {
      texto: 'O site não termina no lançamento.\n\nCódigo entregue: o código-fonte completo e documentado, na sua infraestrutura.\nGestão 360º: hospedagem, domínio, SSL, backups, segurança e monitoramento 24/7.',
      direcao: 'Capa tipográfica dividida em duas colunas com molduras chanfradas. Título no topo, com "lançamento" em Instrument Serif itálico e o cursor laranja piscando no fim. Logo embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Arte que compara os dois modelos de entrega da Tirvo: Código entregue, com o código-fonte completo, e Gestão 360º, com hospedagem, segurança e monitoramento 24/7.',
    linhas: [
      'Todo site precisa de alguém responsável depois que vai ao ar. A pergunta é quem.',
      'Depois do lançamento, o site continua precisando de alguém. São dois caminhos.',
    ],
    legenda: `Todo site precisa de alguém responsável depois que vai ao ar. A pergunta é quem.

Na Tirvo, você escolhe:

Código entregue
Você recebe o código-fonte completo e documentado, pronto para publicar na sua própria infraestrutura. A operação fica com a sua equipe.

Gestão 360º
A Tirvo cuida de tudo: hospedagem, domínio e DNS, SSL, backups, atualizações de segurança, monitoramento 24/7 e manutenção contínua.

Os dois modelos estão explicados no tirvo.tech. O link está na bio.`,
    hashtags: '#manutencaodesites #hospedagemdesites #criacaodesites #sitesprofissionais',
    teste: 'Capa tipográfica. Observe cliques no link do perfil.',
    instrucoes: ['Último post da fundação: ele fecha a grade no canto superior esquerdo.', 'Confira a grade completa e faça o checkpoint do dia 5.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'S05', dia: 5, hora: '17:30', formato: 'stories', pilar: 'vitrine', tema: 'Prova e convite',
    titulo: 'Nove posts, nenhum cliente inventado',
    alavanca: 'Honestidade como prova', metrica: 'Cliques no link', cta: 'Abrir tirvo.tech pelo link',
    ficha: {
      nicho: 'Portfólio e prova honesta',
      publico: 'Quem acompanhou a primeira semana',
      objetivo: 'Cliques no link',
      promessa: 'Mostrar por que a prova aqui é o trabalho da própria Tirvo',
      tom: 'Bastidores, direto',
    },
    ganchos: [
      ['Quebra de padrão', 'Nove posts. Nenhum cliente inventado.', 'Promete transparência, que é rara, e liga com a grade nova.'],
      ['Dor aguda', 'Desconfia de portfólio bonito demais?'],
      ['Ganho rápido', 'Onde ver o trabalho da Tirvo de verdade.'],
    ],
    frames: [
      ['Gancho de contexto', 'Esta semana o feed ganhou 9 posts. Nenhum cliente inventado.', 'Miniatura da grade 3 × 3 com a mira passando sobre ela.', '', 'E não foi por falta de trabalho.'],
      ['Fricção narrativa', 'Projeto de cliente só aparece aqui com autorização.', 'Cadeado em traço laranja sobre uma pasta de projeto.', '', 'Então, o que mostramos?'],
      ['Valor ou paradoxo', 'O que é nosso: o próprio site, a própria marca e o método.', 'Três cartões: tirvo.tech, a marca da Tirvo, método.', '', 'Comece pelo site.'],
      ['Conversão com figurinha', 'O trabalho mais completo da Tirvo está no ar.', 'Área livre para a figurinha de link. Rodapé completo.', 'Link: tirvo.tech, com o texto "Ver o site"', ''],
    ],
    teste: 'Cliques na figurinha de link por visualização do frame 4.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Figurinha de link no frame 4.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P10', dia: 6, hora: '10:00', formato: 'img', pilar: 'marca',
    titulo: 'Se algo pode ser melhorado, ainda não está pronto',
    alavanca: 'Identidade (código de conduta)', metrica: 'Envios e salvamentos', cta: 'Enviar para quem trabalha assim',
    ficha: {
      nicho: 'Posicionamento da Tirvo: o princípio de trabalho',
      publico: 'Empreendedor exigente que valoriza capricho e se identifica com quem não entrega pela metade',
      objetivo: 'Envios',
      promessa: 'Um critério de qualidade que o leitor pode adotar no próprio trabalho',
      tom: 'Opinativo, enxuto',
    },
    ganchos: [
      ['Quebra de padrão', 'Se algo pode ser melhorado, ainda não está pronto.', 'É o princípio da marca, citável, e quem trabalha assim se reconhece e envia.'],
      ['Dor aguda', 'Pronto não é quando o prazo acaba.'],
      ['Ganho rápido', 'O critério que usamos antes de entregar qualquer projeto.'],
    ],
    arte: {
      texto: 'Se algo pode ser melhorado,\nainda não está pronto.',
      direcao: 'Cartão de citação. A primeira linha em cinza (#a1a1aa) e a segunda em branco, como no slogan oficial. Mira grande e discreta ao fundo, ponto laranja aceso. Logo embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Cartão com o princípio da Tirvo: "Se algo pode ser melhorado, ainda não está pronto."',
    linhas: [
      'Pronto não é quando o prazo acaba. É quando não sobra nada para melhorar.',
      'É a frase que lemos antes de entregar qualquer projeto.',
    ],
    legenda: `Pronto não é quando o prazo acaba. É quando não sobra nada para melhorar.

É o princípio da Tirvo, e ele vale para tudo: do primeiro traço de um logotipo à última linha de código de um sistema.

Na prática, é o que nos faz revisar, medir e refinar em ciclos, inclusive nas camadas que ninguém vê.

Manda para alguém que trabalha assim.`,
    hashtags: '#desenvolvimentoweb #designdemarca #engenhariadesoftware #tirvotech',
    teste: 'Capa tipográfica, fora da grade inicial. Compare envios com P01.',
    instrucoes: ['Compartilhe no story de sábado.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'C07', dia: 7, hora: '11:00', formato: 'caixinha', pilar: 'vitrine', tema: 'Presença leve',
    titulo: 'Caixinha: pergunte à engenharia',
    alavanca: 'Reciprocidade', metrica: 'Perguntas recebidas', cta: 'Mandar uma pergunta',
    ficha: {
      nicho: 'Relacionamento com seguidores e visitantes',
      publico: 'Quem já segue e quem chegou pelos posts da semana',
      objetivo: 'Respostas',
      promessa: 'Responder dúvidas reais sobre sites, marca e IA',
      tom: 'Próximo',
    },
    ganchos: [
      ['Quebra de padrão', 'Quem responde aqui é quem constrói.', 'É verdade e é o diferencial da equipe.'],
      ['Dor aguda', 'Aquela dúvida sobre o seu site que ninguém respondeu.'],
      ['Ganho rápido', 'Pergunte. A engenharia responde.'],
    ],
    frames: [
      ['Conversão com figurinha', 'Pergunte à engenharia.\nQuem responde é quem constrói.', 'Arte única reutilizável nos 4 domingos, com área livre para a caixinha. Rodapé completo.', 'Caixinha de perguntas: "Sua dúvida sobre site, marca ou IA"', ''],
    ],
    teste: 'Número de perguntas. As melhores viram stories de quinta e carrosséis de dúvidas.',
    instrucoes: ['A mesma arte serve para os dias 7, 14, 21 e 28.', 'Responda as perguntas nos stories da semana seguinte.'],
    midia: { qtd: 1, compartilhada: 'C07' },
  });

  Object.assign(PLANO.dias, {
    1: { tarefas: ['Dia 0 concluído antes do primeiro post.', 'Compartilhe o P01 no story logo depois de postar.', 'Sementeira: envie o P01 para 5 pessoas.'] },
    2: { tarefas: ['Compartilhe o P03 e o P04 no story (sem sequência própria nesta semana).', 'Sementeira de 15 min.'] },
    3: { tarefas: ['Sementeira de 15 min.'] },
    4: { tarefas: ['Compartilhe o P07 e o P08 no story.', 'Sementeira de 15 min.'] },
    5: { tarefas: ['Fixe P01, P02 e P08.', 'Checkpoint do dia 5.'] },
    6: { tarefas: ['Compartilhe o P10 no story.', 'Responda os comentários da semana.'] },
    7: { tarefas: ['Sem post no feed.', 'Anote os números da semana em cada peça.'] },
  });
})();
