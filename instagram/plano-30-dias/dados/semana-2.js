// Semana 2 (dias 8 a 14): primeiras leituras de alcance. Variável: gancho de dor × contra-intuitivo nos Reels.
(() => {
  const add = (p) => PLANO.pecas.push(p);

  add({
    id: 'P11', dia: 8, hora: '12:15', formato: 'reels', pilar: 'autoridade',
    titulo: "Seu site carrega. O cliente já foi.",
    alavanca: 'Aversão à perda', metrica: 'Retenção e envios', cta: 'Enviar para quem cuida do site da empresa',
    ficha: {
      nicho: 'Performance de sites',
      publico: 'Dono de negócio que nunca abriu o próprio site no 4G para ver quanto ele demora',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'Entender, em 20 segundos, por que um site lento perde o cliente antes da primeira palavra',
      tom: 'Direto, com tensão',
    },
    ganchos: [
      ["Dor aguda", "Seu site carrega. O cliente já foi.", "Cabe em 2 segundos de leitura e abre um ciclo: para onde ele foi? O dado do Google fecha na sequência."],
      ["Quebra de padrão", "Metade das visitas desiste antes da página abrir."],
      ["Ganho rápido", "Um teste de 10 segundos no seu site."],
    ],
    roteiro: {
      duracao: "28 s", palavras: 72, audio: "Sem narração: todo o conteúdo está no texto da tela (funciona no mudo). Trilha original feita no ElevenLabs para este vídeo, com efeitos sonoros (whoosh, impacto, cliques, decodificação) sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima.",
      linhas: [
        ["0–3,2 s", "Seu site carrega. O cliente já foi.", "Celular 3D com tela branca e barra de carregamento; cronômetro de tela branca; a seta de voltar risca a tela."],
        ["3,2–7,6 s", "53% das visitas no celular são abandonadas quando a página passa de 3 segundos.", "Contador até 53%, grade de 100 pontos com 53 apagando e o relógio chegando a 3 s. Fonte na tela: Google."],
        ["7,6–12 s", "Ele não reclama. Não manda mensagem. Só volta e abre o concorrente.", "Resultados de busca: o seu girando, o próximo abre e recebe o toque."],
        ["12–17 s", "De onde vem o peso?", "Blocos 3D caem sobre a página: imagem gigante, script sem uso, plugin esquecido. O medidor sobe e a página afunda."],
        ["17–21,6 s", "Código sob medida carrega só o que a tela precisa.", "Os blocos se desfazem; o celular volta e carrega em um toque."],
        ["21,6–25,2 s", "Abra o seu site no 4G, fora do Wi-Fi. Passou de 3? O cliente também.", "Ícone de 4G na mira e cronômetro contando."],
        ["25,2–28 s", "Manda pra quem cuida do site da sua empresa.", "Cartão final com a logo e o slogan."],
      ],
    },
    capa: "Quadro de 1,9 s: o título \"Seu site carrega. O cliente já foi.\" sobre o celular de tela branca, com o cronômetro correndo.",
    alt: "Vídeo com um celular em 3D preso numa tela branca, o dado do Google sobre abandono acima de 3 segundos e blocos pesados afundando uma página, até o site sob medida carregar em um toque.",
    linhas: [
      'Ninguém reclama de site lento. A pessoa só fecha e abre o próximo resultado.',
      'O cliente não avisa que desistiu. Ele só volta para o Google.',
    ],
    legenda: `Ninguém reclama de site lento. A pessoa só fecha e abre o próximo resultado.

O peso costuma vir de três lugares: imagens grandes demais, scripts que a página nem usa e plugins acumulados.

Teste hoje: abra o seu site no 4G, longe do Wi-Fi, e conte quanto tempo a tela fica em branco.

Manda para quem cuida do site da sua empresa.`,
    hashtags: '#performanceweb #velocidadedosite #criacaodesites #corewebvitals',
    teste: 'Variável da semana: gancho de dor. Compare a retenção nos 3 primeiros segundos com o P13 (contra-intuitivo).',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    obs: "Dado usado: Google (Think with Google, 2016): 53% das visitas em sites no celular são abandonadas quando a página leva mais de 3 segundos para carregar. A fonte aparece na tela.",
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S08', dia: 8, hora: '17:30', formato: 'stories', pilar: 'vitrine', tema: 'Bastidor real',
    titulo: 'Este story foi feito em código',
    alavanca: 'Curiosidade', metrica: 'Respostas na enquete', cta: 'Votar na enquete',
    ficha: {
      nicho: 'Bastidores de produção da Tirvo',
      publico: 'Seguidores da primeira semana',
      objetivo: 'Respostas e relacionamento',
      promessa: 'Mostrar como as peças da Tirvo nascem: em HTML, como um site',
      tom: 'Bastidores, curioso',
    },
    ganchos: [
      ['Quebra de padrão', 'Este story foi feito em código.', 'É verdade, é inesperado e demonstra a competência sem dizer que é boa.'],
      ['Dor aguda', 'Cada post da sua marca sai de um jeito?'],
      ['Ganho rápido', 'O truque para todo post ter a mesma cara.'],
    ],
    frames: [
      ['Gancho de contexto', 'Este story foi feito em código.', 'Metade da tela mostra o próprio frame; a outra metade, o HTML que o desenha.', '', 'Não é exagero.'],
      ['Fricção narrativa', 'Cada peça da Tirvo é uma página: HTML, CSS e as mesmas regras do site.', 'Trecho de CSS com as variáveis de cor da marca destacadas.', '', 'Para que tanto trabalho?'],
      ['Valor ou paradoxo', 'Dá mais trabalho no começo e garante que todo post saia com a mesma cara.', 'Grade de posts alinhada, todos com a logo no mesmo lugar.', '', 'E você?'],
      ['Conversão com figurinha', 'Já tinha visto post desenhado em código?', 'Área livre para a enquete. Rodapé completo.', 'Enquete: "Já sabia" / "Não fazia ideia"', ''],
    ],
    teste: 'Respostas na enquete, comparadas com S01.',
    instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P12', dia: 9, hora: '19:00', formato: 'carrossel', pilar: 'marca',
    titulo: '7 lugares onde a sua marca aparece e pode se desmontar',
    alavanca: 'Especificidade', metrica: 'Salvamentos', cta: 'Salvar e conferir um por um',
    ficha: {
      nicho: 'Identidade visual aplicada',
      publico: 'Dono de negócio com logo, mas sem identidade consistente nos canais',
      objetivo: 'Salvamentos',
      promessa: 'Uma lista dos 7 pontos de contato para conferir se a marca está igual em todos',
      tom: 'Educativo prático',
    },
    ganchos: [
      ['Quebra de padrão', 'Sua marca não é o logo. É o que aparece nestes 7 lugares.'],
      ['Dor aguda', '7 lugares onde a sua marca pode estar se desmontando.', 'Lista concreta, fácil de conferir e de salvar.'],
      ['Ganho rápido', 'Confira se a sua marca está igual em todo lugar.'],
    ],
    slides: [
      ['7 lugares onde a sua marca aparece e pode se desmontar.', 'Capa visual: sete miniaturas (cartão, fachada, perfil, site, proposta, uniforme, WhatsApp) em órbita em volta da mira.', 'Comece pelo primeiro contato.'],
      ['01 · Perfil nas redes\nFoto, destaques e posts precisam falar a mesma língua visual.', 'Celular com um perfil em ordem.', 'Depois do perfil, o site.'],
      ['02 · Site\nCores, fontes e tom iguais aos do perfil. O cliente percebe a diferença.', 'Navegador com a paleta aplicada.', 'E na conversa direta?'],
      ['03 · WhatsApp\nFoto, mensagem de saudação e catálogo também são marca.', 'Tela de conversa com o perfil comercial.', 'Na hora de vender.'],
      ['04 · Proposta comercial\nUm PDF genérico apaga tudo o que o site construiu.', 'Capa de proposta com a identidade aplicada.', 'No mundo físico.'],
      ['05 · Cartão e impressos\n06 · Fachada e sinalização\n07 · Uniforme e embalagem', 'Três aplicações físicas lado a lado.', 'O que mantém tudo igual?'],
      ['Um manual de marca.\nCores, fontes, respiro e usos. As mesmas regras em qualquer mão.', 'Páginas de manual abertas, com a área de respiro medida.', 'Salve a lista.'],
      ['Salve e confira os 7, um por um.\nOnde a sua marca está diferente?', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel com 7 pontos de contato onde a identidade visual de uma empresa precisa ser igual: perfil, site, WhatsApp, proposta, impressos, fachada e uniforme.',
    linhas: [
      'O cliente não vê o seu logo uma vez. Vê a sua marca em 7 lugares diferentes, e compara.',
      'Marca consistente é a que parece a mesma empresa em todo lugar.',
    ],
    legenda: `O cliente não vê o seu logo uma vez. Vê a sua marca em 7 lugares diferentes, e compara.

01 Perfil nas redes
02 Site
03 WhatsApp
04 Proposta comercial
05 Cartão e impressos
06 Fachada e sinalização
07 Uniforme e embalagem

Quando cada um sai de um jeito, a empresa parece menor do que é. O que mantém tudo igual é um manual de marca: as mesmas regras de cor, fonte e respiro em qualquer mão.

Salve e confira os 7 no seu negócio.`,
    hashtags: '#identidadevisual #brandingempresarial #manualdemarca #designgrafico',
    teste: 'Salvamentos por alcance, comparados com P04.',
    instrucoes: ['Publique as 8 imagens na ordem.', 'Compartilhe no story.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'P13', dia: 10, hora: '12:15', formato: 'reels', pilar: 'vitrine',
    titulo: 'A Tirvo está construindo uma IA própria',
    alavanca: 'Curiosidade e moeda social', metrica: 'Envios e novos seguidores', cta: 'Seguir para acompanhar os testes',
    ficha: {
      nicho: 'Bastidores de tecnologia: a IA proprietária da Tirvo (vitrine)',
      publico: 'Pessoas interessadas em IA e tecnologia que gostam de ver o que está sendo construído',
      objetivo: 'Envios e novos seguidores',
      promessa: 'Ver como funciona, por dentro, um enxame de agentes que programa',
      tom: 'Bastidores, contra-intuitivo',
    },
    ganchos: [
      ["Quebra de padrão", "Uma IA que não conversa. Ela entrega.", "Contraria o que todo mundo espera de IA e tem moeda social: quem envia parece estar à frente."],
      ["Dor aguda", "Cansou de IA que só responde pergunta?"],
      ["Ganho rápido", "Como um enxame de agentes escreve um software."],
    ],
    roteiro: {
      duracao: "27 s", palavras: 67, audio: "Sem narração: todo o conteúdo está no texto da tela (funciona no mudo). Trilha original feita no ElevenLabs para este vídeo, com efeitos sonoros (whoosh, impacto, cliques, decodificação) sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima.",
      linhas: [
        ["0–3,2 s", "Uma IA que não conversa. Ela entrega.", "Um chat comum aparece e é riscado em laranja."],
        ["3,2–7,6 s", "Hipercode: a IA própria que a Tirvo está construindo.", "Hexágonos 3D se juntam num favo: o enxame se forma. Selo \"em testes internos\"."],
        ["7,6–12,2 s", "Não é um chatbot. É um enxame de agentes autônomos, dedicados à programação.", "Agentes acendem em laranja e se ligam por linhas com pulsos de luz."],
        ["12,2–17,4 s", "Recebe a tarefa. Pesquisa. Escreve o código. Entrega o projeto.", "Quatro etapas acendem uma a uma; no fim, o arquivo projeto.zip."],
        ["17,4–21,8 s", "Cada execução é revisada, corrigida e aperfeiçoada. Estágio avançado, últimos testes, lançamento ainda não.", "Três linhas de status: feito, agora, ainda não."],
        ["21,8–27 s", "Siga para ver os próximos testes. O Hipercode ainda não está disponível ao público.", "Cartão final com a logo; o enxame desce."],
      ],
    },
    capa: "Quadro de 2,3 s: o título \"Uma IA que não conversa. Ela entrega.\" com o chat sendo riscado.",
    alt: "Vídeo com um enxame de hexágonos em 3D que se acendem e se conectam, mostrando como a IA própria da Tirvo, em testes internos, recebe uma tarefa, pesquisa, escreve código e entrega o projeto.",
    linhas: [
      'A maioria das IAs responde perguntas. Estamos construindo uma que entrega software.',
      'Bastidor da Tirvo: uma IA própria, em fase final de testes.',
    ],
    legenda: `A maioria das IAs responde perguntas. Estamos construindo uma que entrega software.

O Hipercode é a IA proprietária da Tirvo: um enxame de agentes autônomos dedicado à programação. Ele recebe a tarefa, pesquisa, escreve o código e entrega o projeto num arquivo .zip.

Está em estágio avançado, na fase final de testes. Ainda não está disponível ao público e não é usado em projetos de clientes.

Siga o perfil para acompanhar os próximos passos.`,
    hashtags: '#inteligenciaartificial #agentesautonomos #engenhariadesoftware #tirvotech',
    teste: 'Variável da semana: gancho contra-intuitivo. Compare a retenção nos 3 primeiros segundos com P11 e P15.',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    obs: "Vitrine apenas. Não oferece o Hipercode, não diz que ele é usado em projetos de clientes e deixa claro que ainda não está disponível. As capturas de tela do site não foram usadas porque mostram o nome antigo do produto.",
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S10', dia: 10, hora: '17:30', formato: 'stories', pilar: 'autoridade', tema: 'Antes e depois de uma decisão',
    titulo: 'De "quero um site" ao pedido que muda o projeto',
    alavanca: 'Contraste antes e depois', metrica: 'Respostas na caixinha', cta: 'Responder a caixinha',
    ficha: {
      nicho: 'Descoberta de projetos de site',
      publico: 'Seguidores que estão pensando em fazer ou refazer o site',
      objetivo: 'Respostas',
      promessa: 'Transformar um pedido vago num objetivo que orienta o projeto',
      tom: 'Educativo, próximo',
    },
    ganchos: [
      ['Quebra de padrão', '"Quero um site" não é um pedido.', 'Provoca e convida a reescrever o próprio pedido.'],
      ['Dor aguda', 'Respondendo a mesma pergunta 20 vezes por dia?'],
      ['Ganho rápido', 'Reescreva o seu pedido em uma frase.'],
    ],
    frames: [
      ['Gancho de contexto', 'Antes: "quero um site".', 'Campo de texto com a frase digitada e o cursor parado.', '', 'Parece claro.'],
      ['Fricção narrativa', 'Um site para quê? Vender, explicar, agendar, receber pedidos?', 'Quatro caminhos saindo do mesmo ponto.', '', 'A Descoberta resolve isso.'],
      ['Valor ou paradoxo', 'Depois: "quero receber pedidos de orçamento sem responder a mesma pergunta 20 vezes".', 'A frase nova aparece decodificada, com a mira em "pedidos de orçamento".', '', 'Agora é com você.'],
      ['Conversão com figurinha', 'Qual é o seu "quero um site"?', 'Área livre para a caixinha. Rodapé completo.', 'Caixinha: "Escreva o seu objetivo em uma frase"', ''],
    ],
    teste: 'Quantas respostas e quantas viram conversa no direct.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Responda cada resposta da caixinha no direct.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P14', dia: 11, hora: '12:15', formato: 'carrossel', pilar: 'marca',
    titulo: 'Seu feed é a primeira reunião com o cliente',
    alavanca: 'Identidade e status', metrica: 'Conversas no direct', cta: 'REDES no direct',
    ficha: {
      nicho: 'Gestão de redes sociais para empresas (serviço novo)',
      publico: 'Dono de negócio que posta quando dá tempo, cada post com uma cara',
      objetivo: 'Conversas qualificadas no direct',
      promessa: 'Ver o que muda quando o feed é planejado e produzido com o mesmo rigor de um site',
      tom: 'Direto, com contraste',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu feed é a primeira reunião com o cliente.', 'Muda a forma como o dono enxerga o próprio perfil, sem atacar ninguém.'],
      ['Dor aguda', 'Posta quando sobra tempo, e cada post sai de um jeito?'],
      ['Ganho rápido', 'O que muda quando alguém cuida do seu feed com método.'],
    ],
    slides: [
      ['Seu feed é a primeira reunião com o cliente.', 'Capa visual: perfil em celular, metade desorganizada, metade alinhada pela grade.', 'E muita empresa chega atrasada.'],
      ['O problema raramente é falta de post.\nÉ post solto: cada um com uma cor, uma fonte e um assunto.', 'Grade com posts desencontrados, cores diferentes.', 'O que muda com método?'],
      ['01 · Planejamento\nUm calendário com pilares, formatos e objetivo para cada post. [CONFIRMAR]', 'Calendário mensal com marcações por formato.', 'E a cara de cada peça.'],
      ['02 · Identidade aplicada\nModelos próprios a partir da sua marca. Nada de modelo pronto. [CONFIRMAR]', 'Modelos de post com a mesma grade e a logo no mesmo lugar.', 'O texto também conta.'],
      ['03 · Legendas no tom da marca\nGancho, valor e uma chamada clara. Sem clichê. [CONFIRMAR]', 'Legenda com a primeira linha destacada.', 'E depois de postar?'],
      ['04 · Métricas e ajuste\nO que funcionou volta com uma variação. O que não funcionou muda de gancho. [CONFIRMAR]', 'Gráfico simples com a mediana marcada.', 'O resultado é um perfil que parece uma empresa só.'],
      ['Perfil coerente transmite o mesmo que um site bem feito: que existe uma empresa séria por trás.', 'Lado a lado: perfil organizado e site, com a mesma paleta.', 'Quer o seu assim?'],
      ['A Tirvo agora cuida também das suas redes.\nChame no direct com a palavra REDES.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel que apresenta o serviço de gestão de redes sociais da Tirvo: planejamento, identidade aplicada, legendas e acompanhamento de métricas.',
    linhas: [
      'Antes da primeira reunião, o cliente já viu o seu feed.',
      'Seu perfil fala por você antes de você dizer qualquer coisa.',
    ],
    legenda: `Antes da primeira reunião, o cliente já viu o seu feed.

E o problema raramente é falta de post. É post solto: cada um com uma cor, uma fonte e um assunto.

Com método, o feed muda:

01 Planejamento com pilares e objetivo para cada post
02 Modelos próprios, a partir da sua marca
03 Legendas no tom da empresa
04 Métricas e ajuste a cada semana

[CONFIRMAR: escopo do serviço de gestão de redes]

A Tirvo agora cuida também das suas redes, com o mesmo rigor dos sites. Chame no direct com a palavra REDES.`,
    hashtags: '#gestaoderedessociais #socialmediaparaempresas #identidadevisual #marketingdeconteudo #tirvotech',
    teste: 'Conversas com a palavra REDES nas 48 h seguintes.',
    instrucoes: ['Confirme o escopo do serviço antes de produzir as artes.', 'Publique as 8 imagens na ordem.', 'Compartilhe no story.'],
    obs: '[CONFIRMAR: quais redes entram, o que está incluso e como funciona o acompanhamento. As artes deste post só são feitas depois disso.]',
    midia: { qtd: 8, aguardando: 'Escopo do serviço de gestão de redes' },
  });

  add({
    id: 'P15', dia: 12, hora: '19:00', formato: 'reels', pilar: 'autoridade',
    titulo: 'O peso escondido do site pronto',
    alavanca: 'Aversão à perda', metrica: 'Retenção', cta: 'Salvar',
    ficha: {
      nicho: 'Sites sob medida × construtores com plugins',
      publico: 'Dono de negócio com site em construtor ou tema que acumulou plugins com o tempo',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'Entender por que cada plugin a mais cobra em velocidade e segurança',
      tom: 'Direto, visual',
    },
    ganchos: [
      ["Quebra de padrão", "Cada plugin que você instala, o seu cliente carrega.", "Inverte o ponto de vista: o custo do plugin cai em quem visita, e a torre 3D mostra o peso somando."],
      ["Dor aguda", "Seu site tem plugin que ninguém lembra para que serve?"],
      ["Ganho rápido", "Revise os plugins do seu site em 10 minutos."],
    ],
    roteiro: {
      duracao: "28 s", palavras: 71, audio: "Sem narração: todo o conteúdo está no texto da tela (funciona no mudo). Trilha original feita no ElevenLabs para este vídeo, com efeitos sonoros (whoosh, impacto, cliques, decodificação) sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima.",
      linhas: [
        ["0–3,2 s", "Cada plugin que você instala, o seu cliente carrega.", "Blocos de plugin começam a cair sobre a página."],
        ["3,2–7,6 s", "Um de cada vez. Ninguém percebe o peso somando.", "A torre cresce: formulário, pop-up, galeria, chat, contador, slider, SEO, cache, backup, tradução, mapa, cookies."],
        ["7,6–12 s", "Cada um soma código em todas as páginas. Até onde nem aparece.", "O velocímetro de \"velocidade no celular\" despenca."],
        ["12–16,5 s", "E cada um é mais uma porta para manter atualizada.", "Cadeados abrem em laranja, um por um."],
        ["16,5–21 s", "Sob medida, a página leva só o que usa. Nada sobrando.", "A torre se desfaz e sobra a página limpa."],
        ["21–24,5 s", "Para cada plugin, pergunte: para que serve? Está atualizado? Alguém usa de verdade?", "Checklist com três caixas marcando."],
        ["24,5–28 s", "Salve e revise os plugins esta semana.", "Cartão final com a logo e o botão de salvar."],
      ],
    },
    capa: "Quadro de 2,4 s: o título \"Cada plugin que você instala, o seu cliente carrega.\" com a torre de plugins começando a subir.",
    alt: "Vídeo com uma torre de blocos de plugins em 3D crescendo sobre uma página, um velocímetro caindo e cadeados abrindo, terminando com um checklist de três perguntas para revisar plugins.",
    linhas: [
      "Plugin resolve rápido e cobra depois, em velocidade e em segurança.",
      "Cada plugin que você instala, o seu cliente carrega.",
    ],
    legenda: `Plugin resolve rápido e cobra depois, em velocidade e em segurança.

Cada um soma código nas páginas, até onde não aparece, e é mais uma porta para manter atualizada.

Revisão de 10 minutos, plugin por plugin:
1. Para que ele serve?
2. Está atualizado?
3. Alguém usa de verdade?

Num site sob medida, a página leva só o que usa.

Salve para revisar os plugins do seu site esta semana.`,
    hashtags: '#sitesobmedida #segurancadigital #desenvolvimentoweb #performanceweb',
    teste: 'Gancho de dor. Compare com P11 e P13.',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S12', dia: 12, hora: '12:30', formato: 'stories', pilar: 'vitrine', tema: 'Prova e convite',
    titulo: 'A mira da logo, por dentro',
    alavanca: 'Curiosidade', metrica: 'Cliques no link', cta: 'Abrir a história da marca',
    ficha: {
      nicho: 'Marca da própria Tirvo',
      publico: 'Seguidores e visitantes curiosos sobre marca',
      objetivo: 'Cliques no link',
      promessa: 'Entender o significado de cada elemento da logo da Tirvo',
      tom: 'Bastidores',
    },
    ganchos: [
      ['Quebra de padrão', 'Esta logo tem 9 peças. Nenhuma por acaso.', 'Desperta a curiosidade de contar as peças e prepara o post de sábado.'],
      ['Dor aguda', 'Sua logo significa alguma coisa?'],
      ['Ganho rápido', 'Leia uma logo em 4 stories.'],
    ],
    frames: [
      ['Gancho de contexto', 'Esta logo tem 9 peças. Nenhuma está ali por acaso.', 'A mira grande, com as peças numeradas em Geist Mono.', '', 'Comece pelos cantos.'],
      ['Fricção narrativa', 'Quatro cantos cercam o problema por todos os lados. Quatro marcas conferem cada detalhe.', 'Cantos e marcas de medida acendem em sequência.', '', 'E o centro?'],
      ['Valor ou paradoxo', 'O ponto laranja é o alvo encontrado. Ele pulsa e não se apaga.', 'O ponto acende e uma onda se espalha.', '', 'A história completa está no site.'],
      ['Conversão com figurinha', 'A história de cada traço está no site.', 'Área livre para a figurinha de link. Rodapé completo.', 'Link: tirvo.tech/marca.html, com o texto "Ver a marca"', ''],
    ],
    teste: 'Cliques no link do frame 4.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Endereço da figurinha: https://tirvo.tech/marca.html'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P16', dia: 13, hora: '10:00', formato: 'img', pilar: 'vitrine',
    titulo: 'A anatomia da mira',
    alavanca: 'Curiosidade e especificidade', metrica: 'Visitas ao perfil', cta: 'Salvar',
    ficha: {
      nicho: 'Marca da própria Tirvo como prova de método',
      publico: 'Empreendedor que valoriza marca com significado',
      objetivo: 'Visitas ao perfil e salvamentos',
      promessa: 'Ver como cada traço de uma marca pode carregar um método de trabalho',
      tom: 'Bastidores, técnico',
    },
    ganchos: [
      ['Quebra de padrão', 'Quatro cantos, quatro medidas e um ponto: a nossa forma de trabalhar.', 'Descreve o desenho e entrega o significado de uma vez.'],
      ['Dor aguda', 'Sua logo foi escolhida só porque era bonita?'],
      ['Ganho rápido', 'Como ler uma marca com significado.'],
    ],
    arte: {
      texto: 'A anatomia da mira.\n01 Quatro cantos: cercam o problema por todos os lados.\n02 Quatro marcas de medida: conferem cada detalhe antes da entrega.\n03 O ponto laranja: o alvo encontrado.',
      direcao: 'Infográfico técnico. A mira grande no centro com linhas de cota apontando para as 3 partes, numeradas em Geist Mono. Grade fina ao fundo. Logo completa pequena embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Infográfico da mira da logo da Tirvo: quatro cantos, quatro marcas de medida e o ponto laranja no centro, com o significado de cada parte.',
    linhas: [
      'Nenhum traço da logo da Tirvo está ali por acaso. Cada um descreve como trabalhamos.',
      'Uma marca pode ser o resumo de um método.',
    ],
    legenda: `Nenhum traço da logo da Tirvo está ali por acaso. Cada um descreve como trabalhamos.

Quatro cantos cercam o problema por todos os lados. Nada fica fora do quadro.

Quatro marcas de medida apontam para o centro e conferem cada detalhe antes da entrega.

O ponto laranja é o alvo encontrado. Ele pulsa e não se apaga.

Enquanto um projeto está com a gente, ele ocupa o centro da mira.

Salve como referência para pensar a sua marca.`,
    hashtags: '#designdemarca #identidadevisual #logotipo #branding #tirvotech',
    teste: 'Visitas ao perfil por alcance, comparadas com P06.',
    instrucoes: ['Compartilhe no story de sábado.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'C14', dia: 14, hora: '11:00', formato: 'caixinha', pilar: 'vitrine', tema: 'Presença leve',
    titulo: 'Caixinha: pergunte à engenharia', alavanca: 'Reciprocidade', metrica: 'Perguntas recebidas', cta: 'Mandar uma pergunta',
    ficha: { nicho: 'Relacionamento', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Responder dúvidas reais', tom: 'Próximo' },
    ganchos: [['Quebra de padrão', 'Quem responde aqui é quem constrói.', 'Mesma arte do dia 7.'], ['Dor aguda', 'A dúvida que ninguém respondeu.'], ['Ganho rápido', 'Pergunte. A engenharia responde.']],
    frames: [['Conversão com figurinha', 'Pergunte à engenharia.', 'Mesma arte do dia 7.', 'Caixinha de perguntas', '']],
    teste: 'Número de perguntas.', instrucoes: ['Reutilize a arte do dia 7.', 'Checkpoint do dia 14.'],
    midia: { qtd: 1, compartilhada: 'C07' },
  });

  Object.assign(PLANO.dias, {
    8: { tarefas: ['Compartilhe o P11 no story.', 'Sementeira de 15 min.'] },
    9: { tarefas: ['Compartilhe o P12 no story (sem sequência própria nesta semana).', 'Sementeira de 15 min.'] },
    10: { tarefas: ['Sementeira de 15 min.'] },
    11: { tarefas: ['Compartilhe o P14 no story.', 'Responda quem mandar REDES em até 1 hora.'] },
    12: { tarefas: ['Sementeira de 15 min.'] },
    13: { tarefas: ['Compartilhe o P16 no story.'] },
    14: { tarefas: ['Checkpoint do dia 14 com o /analisar.', 'Troque 1 fixado pelo Reels de melhor retenção.'] },
  });
})();
