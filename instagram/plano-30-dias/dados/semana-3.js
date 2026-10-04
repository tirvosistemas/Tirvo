// Semana 3 (dias 15 a 21): conversão em conversa. Variável: CTA de salvar × palavra-chave no direct.
(() => {
  const add = (p) => PLANO.pecas.push(p);

  add({
    id: 'P17', dia: 15, hora: '12:15', formato: 'reels', pilar: 'autoridade',
    titulo: 'Seu site trabalha enquanto você dorme?',
    alavanca: 'Ganho e contraste', metrica: 'Conversas no direct', cta: 'SITE no direct',
    ficha: {
      nicho: 'Sites que recebem contatos fora do horário comercial',
      publico: 'Dono de negócio que perde pedidos que chegam à noite e no fim de semana',
      objetivo: 'Conversas qualificadas',
      promessa: 'Ver como um site bem estruturado recebe e organiza pedidos 24 horas por dia',
      tom: 'Direto, com contraste',
    },
    ganchos: [
      ["Quebra de padrão", "23:04. Alguém procurou o que você vende.", "Hora exata e situação concreta: o dono se imagina dormindo enquanto o cliente procura."],
      ["Dor aguda", "O cliente pediu orçamento às 23h. Quem respondeu?"],
      ["Ganho rápido", "Seu site trabalha enquanto você dorme?"],
    ],
    roteiro: {
      duracao: "28 s", palavras: 57, audio: "Com narração de locutor (voz gerada no ElevenLabs, a mesma em todos os Reels), acompanhando o texto da tela, que continua funcionando no mudo. Trilha original que abaixa enquanto a voz fala, e efeitos sonoros sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima. Narração: “Onze da noite. Alguém procurou o que você vende. Achou o seu site. Gostou. Quis pedir um orçamento. E aí? Botão escondido, formulário sem fim, WhatsApp perdido no rodapé. Ele fecha a aba. E esquece. Com o caminho certo, o pedido chega inteiro. De manhã, você só responde. Quer o seu site trabalhando assim? Manda site no direct.”",
      linhas: [
        ["0–3,2 s", "23:04. Alguém procurou o que você vende.", "Relógio gigante virando os minutos sobre uma cidade 3D à noite, janelas acesas."],
        ["3,2–7,4 s", "Achou o seu site. Gostou. Quis pedir um orçamento.", "Três frases entram uma a uma com ícones."],
        ["7,4–12 s", "E aí? Botão escondido. Formulário que não acaba. WhatsApp perdido no rodapé.", "Três atritos entram com som de erro e tremem."],
        ["12–15 s", "Ele fecha a aba. Amanhã, já esqueceu.", "A janela do navegador se fecha; as luzes da cidade apagam."],
        ["15–20 s", "Com o caminho certo, o pedido chega inteiro.", "Notificação de pedido de orçamento com os campos preenchidos (exemplo)."],
        ["20–24 s", "08:00. Você só responde.", "O relógio marca 8h e a cidade amanhece."],
        ["24–28 s", "Quer o seu site trabalhando assim? Mande SITE no direct.", "Cartão final com a logo e a palavra SITE."],
      ],
    },
    capa: "Quadro de 2,4 s: o relógio 23:04 sobre a cidade à noite e o título \"Alguém procurou o que você vende.\"",
    alt: "Vídeo com uma cidade em 3D à noite e um relógio marcando 23:04, mostrando o que faz um cliente desistir de pedir orçamento no site e como o pedido chega organizado para ser respondido de manhã.",
    linhas: [
      'Muita gente pesquisa fornecedor fora do horário comercial. O site é o único da equipe acordado.',
      'O pedido que chega às 23h decide se o cliente volta amanhã.',
    ],
    legenda: `Muita gente pesquisa fornecedor fora do horário comercial. Nessa hora, o site é o único da equipe acordado.

Se o próximo passo não está claro, a pessoa fecha a aba e talvez não volte.

Com o caminho certo, o pedido chega organizado pelo formulário ou pelo WhatsApp, e de manhã você só responde.

Quer o seu site assim? Mande SITE no direct.`,
    hashtags: '#criacaodesites #sitequevende #whatsappbusiness #sitesprofissionais',
    teste: 'Variável da semana: CTA de palavra-chave. Conte as conversas com SITE em 48 h.',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S15', dia: 15, hora: '17:30', formato: 'stories', pilar: 'vitrine', tema: 'Bastidor real',
    titulo: 'Quem responde o direct',
    alavanca: 'Confiança', metrica: 'Respostas na enquete', cta: 'Votar na enquete',
    ficha: {
      nicho: 'Atendimento da Tirvo',
      publico: 'Seguidores que ainda não mandaram mensagem',
      objetivo: 'Respostas e conversas',
      promessa: 'Mostrar que a conversa é com quem constrói, sem intermediário',
      tom: 'Bastidores, próximo',
    },
    ganchos: [
      ['Quebra de padrão', 'Quem responde este direct também escreve código.', 'Verdadeiro e diferente do atendimento comum.'],
      ['Dor aguda', 'Cansou de explicar o projeto três vezes?'],
      ['Ganho rápido', 'Uma palavra no direct basta para começar.'],
    ],
    frames: [
      ['Gancho de contexto', 'Quem responde este direct também escreve código.', 'Caixa de mensagem com o cursor e, ao fundo, um editor de código.', '', 'Não tem atendimento no meio.'],
      ['Fricção narrativa', 'Sem repasse entre atendimento e execução. Nada se perde no caminho.', 'Duas setas que viram uma só.', '', 'E para começar é simples.'],
      ['Valor ou paradoxo', 'Uma palavra basta: SITE, MARCA, IA ou REDES.', 'Quatro etiquetas em Geist Mono.', '', 'Qual seria a sua?'],
      ['Conversão com figurinha', 'Sobre o que você mandaria mensagem hoje?', 'Área livre para a enquete. Rodapé completo.', 'Enquete: "Site" / "Marca"', ''],
    ],
    teste: 'Votos e conversas abertas a partir dos votos.',
    instrucoes: ['Publique os 4 frames em sequência.', 'Mande mensagem para quem votar, oferecendo ajuda sobre o tema escolhido.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P18', dia: 16, hora: '19:00', formato: 'carrossel', pilar: 'autoridade',
    titulo: '8 perguntas antes de contratar um site',
    alavanca: 'Utilidade (checklist)', metrica: 'Salvamentos', cta: 'Salvar para a reunião com a agência',
    ficha: {
      nicho: 'Contratação de sites',
      publico: 'Dono de negócio que vai pedir orçamentos de site nas próximas semanas',
      objetivo: 'Salvamentos',
      promessa: '8 perguntas que separam um projeto sério de um tema pronto com outro nome',
      tom: 'Educativo prático',
    },
    ganchos: [
      ['Quebra de padrão', 'Orçamento de site não se compara pelo preço. Compara-se por estas 8 respostas.'],
      ['Dor aguda', 'Vai contratar um site? Não feche antes de fazer estas 8 perguntas.', 'Protege o leitor de um erro caro e pede para ser salvo.'],
      ['Ganho rápido', '8 perguntas para levar na reunião com a agência.'],
    ],
    slides: [
      ['Vai contratar um site?\n8 perguntas antes de fechar.', 'Capa tipográfica, prancheta com 8 caixas de seleção.', 'Leve para a reunião.'],
      ['01 · O código é feito sob medida ou é um tema pronto?', 'Ícone de código e de modelo, lado a lado.', 'A segunda é sobre posse.'],
      ['02 · O domínio fica no meu nome?\n03 · Eu recebo o código-fonte?', 'Certificado de domínio e pasta de código.', 'Agora, o Google.'],
      ['04 · O SEO técnico já vem incluído?\nEstrutura semântica, metadados, dados estruturados.', 'Lupa sobre trechos de código.', 'E a velocidade?'],
      ['05 · Como o site será testado?\nPerformance, acessibilidade e segurança.', 'Três medidores.', 'Depois que vai ao ar…'],
      ['06 · Quem cuida do site depois do lançamento?\n07 · Tem SSL, backup e monitoramento?', 'Painel de status com luzes acesas.', 'A última é sobre dados.'],
      ['08 · O projeto segue a LGPD?\nColeta mínima de dados e privacidade desde o projeto.', 'Escudo com cadeado.', 'Guarde a lista.'],
      ['Salve para a próxima reunião com uma agência.\nNa Tirvo, as 8 respostas estão no site.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel com 8 perguntas para fazer antes de contratar a criação de um site, sobre código, domínio, SEO, testes, manutenção, segurança e LGPD.',
    linhas: [
      'Dois orçamentos de site podem ter o mesmo nome e entregar coisas completamente diferentes.',
      'A diferença entre dois orçamentos aparece nas respostas, não no PDF.',
    ],
    legenda: `Dois orçamentos de site podem ter o mesmo nome e entregar coisas completamente diferentes.

Leve estas 8 perguntas para a reunião:

01 O código é sob medida ou um tema pronto?
02 O domínio fica no meu nome?
03 Eu recebo o código-fonte?
04 O SEO técnico vem incluído?
05 Como o site será testado?
06 Quem cuida dele depois do lançamento?
07 Tem SSL, backup e monitoramento?
08 O projeto segue a LGPD?

Salve para a próxima reunião com uma agência.`,
    hashtags: '#criacaodesites #contratarsite #sitesprofissionais #lgpd',
    teste: 'Variável da semana: CTA de salvar. Compare salvamentos com P17 e P19 (palavra-chave).',
    instrucoes: ['Publique as 8 imagens na ordem.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'S16', dia: 16, hora: '12:30', formato: 'stories', pilar: 'autoridade', tema: 'Mito × verdade',
    titulo: 'Site bom é site bonito?',
    alavanca: 'Quebra de crença', metrica: 'Respostas no quiz', cta: 'Responder o quiz',
    ficha: { nicho: 'Conversão em sites', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Trocar o critério de "bonito" por "faz o visitante agir"', tom: 'Leve, direto' },
    ganchos: [
      ['Quebra de padrão', 'Mito: site bom é site bonito.', 'Formato de mito × verdade, fácil de entender sem som.'],
      ['Dor aguda', 'Seu site recebe elogio e não recebe pedido?'],
      ['Ganho rápido', 'O teste de 5 segundos do seu site.'],
    ],
    frames: [
      ['Gancho de contexto', 'Mito: site bom é site bonito.', 'Carimbo "mito" em laranja sobre uma tela elegante.', '', 'Bonito ajuda. Não basta.'],
      ['Fricção narrativa', 'Tem site lindo que ninguém consegue usar no celular.', 'Celular com o botão fora de alcance.', '', 'Então, o que é um site bom?'],
      ['Valor ou paradoxo', 'Verdade: site bom é o que faz o visitante agir em poucos segundos.', 'Cronômetro de 5 s e um botão destacado pela mira.', '', 'Faça o teste.'],
      ['Conversão com figurinha', 'Em 5 segundos, o visitante entende o que você faz?', 'Área livre para o quiz. Rodapé completo.', 'Quiz: "Entende" / "Não sei" / "Não"', ''],
    ],
    teste: 'Respostas no quiz.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P19', dia: 17, hora: '12:15', formato: 'reels', pilar: 'marca',
    titulo: 'Logo bonito não é identidade visual',
    alavanca: 'Verdade contra-intuitiva', metrica: 'Conversas no direct', cta: 'MARCA no direct',
    ficha: {
      nicho: 'Identidade visual',
      publico: 'Empreendedor que tem um logo e acha que já tem marca',
      objetivo: 'Conversas qualificadas',
      promessa: 'Ver em 20 segundos o que separa um logo de uma identidade visual',
      tom: 'Contra-intuitivo, visual',
    },
    ganchos: [
      ["Quebra de padrão", "Seu logo é bonito. Sua marca está desmontada.", "Elogia e corta na mesma frase: quem tem só logo se reconhece na hora."],
      ["Dor aguda", "Cada peça da sua marca sai de um jeito?"],
      ["Ganho rápido", "O que transforma um logo numa marca."],
    ],
    roteiro: {
      duracao: "28 s", palavras: 77, audio: "Com narração de locutor (voz gerada no ElevenLabs, a mesma em todos os Reels), acompanhando o texto da tela, que continua funcionando no mudo. Trilha original que abaixa enquanto a voz fala, e efeitos sonoros sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima. Narração: “Seu logo é bonito. Sua marca está desmontada. Post de um jeito, cartão de outro, site de um terceiro. O cliente não nota o detalhe. Nota a bagunça. Identidade visual não é um desenho. É um sistema. Com um manual, qualquer pessoa aplica igual. Logo é a peça. Identidade é o sistema. Quer a sua marca montada de verdade? Manda marca no direct.”",
      linhas: [
        ["0–3 s", "Seu logo é bonito. Sua marca está desmontada.", "Peças soltas em 3D (post, cartão, site, fachada) giram, cada uma de um jeito."],
        ["3–7,5 s", "Post de um jeito. Cartão de outro. Site de um terceiro.", "As peças tremem; nenhuma combina com a outra."],
        ["7,5–11,5 s", "O cliente não nota o detalhe. Nota a bagunça.", "O caos aumenta e a trilha prepara a virada."],
        ["11,5–16,5 s", "Identidade não é um desenho. É um sistema: paleta, tipografia, grade, respiro e regras de uso.", "Num corte, as peças se alinham numa grade e passam a seguir o mesmo padrão."],
        ["16,5–21 s", "Com um manual, qualquer pessoa aplica igual: você, a gráfica, quem faz seus posts.", "Um manual de marca em 3D vira as páginas."],
        ["21–24,5 s", "Logo é a peça. Identidade é o sistema.", "Frase de impacto com a palavra \"sistema\" em contorno ao fundo."],
        ["24,5–28 s", "Quer a sua marca montada de verdade? Mande MARCA no direct.", "Cartão final com a logo e a palavra MARCA."],
      ],
    },
    capa: "Quadro de 2,4 s: peças soltas da marca girando e o título \"Seu logo é bonito. Sua marca está desmontada.\"",
    alt: "Vídeo com peças de marca soltas em 3D que, num corte, se alinham numa grade com o mesmo padrão, explicando que identidade visual é um sistema com paleta, tipografia, grade, respiro e manual.",
    linhas: [
      'Logo é uma peça. Identidade visual é o sistema que mantém todas as peças iguais.',
      'Se cada post sai de um jeito, falta sistema, não logo.',
    ],
    legenda: `Logo é uma peça. Identidade visual é o sistema que mantém todas as peças iguais.

Paleta, tipografia, respiro, tamanhos e aplicações, tudo num manual que qualquer pessoa consegue seguir.

É isso que faz a marca parecer a mesma empresa no site, no feed, na proposta e na fachada.

Quer a sua marca assim? Mande MARCA no direct.`,
    hashtags: '#identidadevisual #branding #logotipo #manualdemarca',
    teste: 'CTA de palavra-chave. Conte as conversas com MARCA em 48 h.',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S17', dia: 17, hora: '17:30', formato: 'stories', pilar: 'marca', tema: 'Antes e depois de uma decisão',
    titulo: 'Logo às pressas × marca com manual',
    alavanca: 'Contraste', metrica: 'Respostas no slider', cta: 'Mover o slider',
    ficha: { nicho: 'Identidade visual', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Avaliar a consistência da própria marca', tom: 'Leve' },
    ganchos: [
      ['Quebra de padrão', 'A decisão de 1 dia que pesa por anos.', 'Liga com o Reels do dia e convida a uma autoavaliação.'],
      ['Dor aguda', 'Seu logo foi feito às pressas?'],
      ['Ganho rápido', 'Dê uma nota para a sua marca.'],
    ],
    frames: [
      ['Gancho de contexto', 'Antes: um logo feito às pressas, para "resolver por enquanto".', 'Logo rabiscado num guardanapo.', '', 'O "por enquanto" dura anos.'],
      ['Fricção narrativa', 'Cada fornecedor aplica de um jeito. A marca se desmonta peça por peça.', 'Aplicações desalinhadas.', '', 'A decisão diferente.'],
      ['Valor ou paradoxo', 'Depois: conceito, sistema e manual. A marca fica igual em qualquer mão.', 'Aplicações alinhadas por uma grade.', '', 'E a sua?'],
      ['Conversão com figurinha', 'Quão igual a sua marca está em todos os lugares?', 'Área livre para o slider. Rodapé completo.', 'Slider de emoji com a mira ou com 🎯', ''],
    ],
    teste: 'Média do slider e respostas.', instrucoes: ['Publique os 4 frames em sequência.', 'Mande mensagem para quem deixar nota baixa, perguntando o que mais incomoda.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P20', dia: 18, hora: '19:00', formato: 'carrossel', pilar: 'dono',
    titulo: '5 sinais de que a planilha virou gargalo',
    alavanca: 'Dor e especificidade', metrica: 'Salvamentos e envios', cta: 'Salvar (secundário: enviar ao sócio)',
    ficha: {
      nicho: 'Sistemas sob medida e automações',
      publico: 'Dono de empresa que controla a operação em planilhas e WhatsApp',
      objetivo: 'Salvamentos',
      promessa: '5 sinais claros de que a empresa já precisa de um sistema',
      tom: 'Educativo direto',
    },
    ganchos: [
      ['Quebra de padrão', 'A planilha não é o problema. O problema é o que ela virou.'],
      ['Dor aguda', '5 sinais de que a planilha virou gargalo na sua empresa.', 'O dono reconhece pelo menos 2 sinais e envia ao sócio.'],
      ['Ganho rápido', 'Descubra se já é hora de um sistema.'],
    ],
    slides: [
      ['5 sinais de que a planilha virou gargalo.', 'Capa visual: planilha gigante com células vermelhas e a mira sobre uma delas.', 'Conte quantos você reconhece.'],
      ['01 · Só uma pessoa entende a planilha.\nQuando ela falta, a operação para.', 'Planilha com um cadeado e um único avatar.', 'O segundo é silencioso.'],
      ['02 · Os mesmos dados são digitados em três lugares.\nE cada lugar mostra um número diferente.', 'Três telas com números diferentes.', 'O terceiro custa horas.'],
      ['03 · O relatório da semana leva um dia inteiro.', 'Relógio sobre uma pilha de abas.', 'O quarto aparece no pior momento.'],
      ['04 · Um erro de fórmula já virou prejuízo.', 'Célula com #REF! em destaque.', 'O último é sobre crescer.'],
      ['05 · Crescer significa mais planilhas, não mais controle.', 'Pilha de planilhas que não para de subir.', 'Contou 3 ou mais?'],
      ['Contou 3 ou mais?\nUm sistema sob medida se encaixa na sua operação, e não o contrário.\nMenos planilha, menos retrabalho, mais controle.', 'Painel limpo com 3 indicadores.', 'Guarde a lista.'],
      ['Salve e mande para o seu sócio.\nQuer entender o seu caso? Chame no direct.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel com 5 sinais de que uma empresa precisa trocar planilhas por um sistema sob medida.',
    linhas: [
      'Toda empresa começa na planilha. O problema é quando ela vira o sistema da empresa.',
      'Se só uma pessoa entende a planilha, ela já é um risco.',
    ],
    legenda: `Toda empresa começa na planilha. O problema é quando ela vira o sistema da empresa.

01 Só uma pessoa entende a planilha
02 Os mesmos dados são digitados em três lugares
03 O relatório da semana leva um dia
04 Um erro de fórmula já virou prejuízo
05 Crescer significa mais planilhas

Contou 3 ou mais? Um sistema sob medida se encaixa na sua operação, e não o contrário. Menos planilha, menos retrabalho, mais controle.

Salve e mande para o seu sócio.`,
    hashtags: '#sistemasobmedida #automacaodeprocessos #gestaoempresarial #pequenasempresas',
    teste: 'CTA de salvar. Compare salvamentos e envios com P18.',
    instrucoes: ['Publique as 8 imagens na ordem.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'S18', dia: 18, hora: '12:30', formato: 'stories', pilar: 'dono', tema: 'Pergunta de dono de negócio',
    titulo: '"Quanto custa um site?"',
    alavanca: 'Transparência', metrica: 'Perguntas recebidas', cta: 'Mandar a própria pergunta',
    ficha: { nicho: 'Orçamento de projetos', publico: 'Seguidores pensando em contratar', objetivo: 'Respostas e conversas', promessa: 'Explicar como o orçamento é feito, sem citar valores', tom: 'Direto, transparente' },
    ganchos: [
      ['Quebra de padrão', 'A pergunta que todo mundo faz primeiro.', 'Todo dono tem essa dúvida, e a resposta honesta gera confiança.'],
      ['Dor aguda', 'Cansou de pedir preço e receber "depende"?'],
      ['Ganho rápido', 'Como sai o orçamento de um projeto na Tirvo.'],
    ],
    frames: [
      ['Gancho de contexto', '"Quanto custa um site?" É a pergunta que todo mundo faz primeiro.', 'Balão de mensagem com a pergunta.', '', 'A resposta honesta.'],
      ['Fricção narrativa', 'Um número sem conhecer o projeto é chute. E chute vira surpresa no meio do caminho.', 'Dado rolando e uma etiqueta em branco.', '', 'Por isso, a ordem é outra.'],
      ['Valor ou paradoxo', 'Primeiro a conversa e a Descoberta. Depois o orçamento, sem compromisso, para você decidir com calma.', 'Linha em 2 passos: conversa, depois proposta.', '', 'Tem outra pergunta?'],
      ['Conversão com figurinha', 'Qual é a sua pergunta antes de começar um projeto?', 'Área livre para a caixinha. Rodapé completo.', 'Caixinha de perguntas', ''],
    ],
    teste: 'Perguntas recebidas.', instrucoes: ['Publique os 4 frames em sequência.', 'Sem citar valores, nem em resposta.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P21', dia: 19, hora: '12:15', formato: 'reels', pilar: 'vitrine',
    titulo: 'Da primeira conversa ao escopo: a Descoberta',
    alavanca: 'Redução de risco', metrica: 'Conversas no direct', cta: 'DESCOBERTA no direct',
    ficha: {
      nicho: 'Método da Tirvo: fase de Descoberta',
      publico: 'Empreendedor com receio de começar um projeto e se perder em prazo e custo',
      objetivo: 'Conversas qualificadas',
      promessa: 'Ver como o projeto começa, com escopo e cronograma claros antes do código',
      tom: 'Bastidores, didático',
    },
    ganchos: [
      ["Quebra de padrão", "Nenhuma linha de código antes desta conversa.", "Mostra método e reduz o medo de começar um projeto que nunca termina."],
      ["Dor aguda", "Projeto que começa pelo código costuma terminar no atraso."],
      ["Ganho rápido", "Como um projeto começa sem surpresa."],
    ],
    roteiro: {
      duracao: "28,5 s", palavras: 75, audio: "Com narração de locutor (voz gerada no ElevenLabs, a mesma em todos os Reels), acompanhando o texto da tela, que continua funcionando no mudo. Trilha original que abaixa enquanto a voz fala, e efeitos sonoros sincronizados aos cortes. Já vem mixada no MP4: poste com o áudio original, sem música do app por cima. Narração: “Nenhuma linha de código antes desta conversa. Projeto que começa pelo código costuma terminar no atraso. Por isso, todo projeto da Tirvo começa pela Descoberta. Primeiro, o negócio, os objetivos e o público. Depois, cada página e o que ela precisa fazer. Sai um escopo e um cronograma. Você aprova antes. Só então começa a Engenharia. Quer começar pela Descoberta? Manda descoberta no direct.”",
      linhas: [
        ["0–3 s", "Nenhuma linha de código antes desta conversa.", "Editor de código vazio com o cursor laranja piscando."],
        ["3–7 s", "Projeto que começa pelo código costuma terminar no atraso.", "A barra do cronograma passa do prazo: refação e ajuste."],
        ["7–11,5 s", "Por isso, todo projeto começa pela Descoberta.", "As três fases do método: Descoberta acende."],
        ["11,5–15,5 s", "Imersão: o negócio, os objetivos e o público.", "Mapa de ideias em 3D se forma com nós e ligações."],
        ["15,5–19 s", "Arquitetura: cada página e o que ela precisa fazer. E o diagnóstico técnico: o que existe, o que muda, o que fica.", "O mapa de ideias se reorganiza no mapa do site."],
        ["19–23 s", "Sai um escopo e um cronograma. Você aprova antes.", "Documento de escopo e o carimbo APROVADO com impacto."],
        ["23–25,5 s", "Só então começa a Engenharia.", "O editor se enche de código."],
        ["25,5–28,5 s", "Quer começar pela Descoberta? Mande DESCOBERTA no direct.", "Cartão final com a logo."],
      ],
    },
    capa: "Quadro de 2,4 s: o título \"Nenhuma linha de código antes desta conversa.\" sobre o editor vazio com o cursor.",
    alt: "Vídeo que mostra a fase de Descoberta da Tirvo: um mapa de ideias em 3D que vira o mapa do site, o escopo carimbado como aprovado e só então o código começando.",
    linhas: [
      'Projeto sem escopo é o que vira atraso e surpresa no meio do caminho.',
      'O primeiro passo de todo projeto da Tirvo não tem código. Tem conversa.',
    ],
    legenda: `Projeto sem escopo é o que vira atraso e surpresa no meio do caminho.

Por isso, na Tirvo, todo projeto começa pela Descoberta: imersão no negócio, arquitetura de informação e diagnóstico técnico.

Dela saem escopo e cronograma claros, e nada avança sem a sua aprovação.

Quer começar pela Descoberta? Mande DESCOBERTA no direct.`,
    hashtags: '#gestaodeprojetos #criacaodesites #metodologia #tirvotech',
    teste: 'CTA de palavra-chave. Conversas com DESCOBERTA em 48 h.',
    instrucoes: ['Baixe o 01.mp4 (vídeo) e o 02.jpg (capa).', 'No app, escolha o 02.jpg como capa do Reels.', 'Poste com o áudio original do vídeo, sem adicionar música do app.', 'Cole a legenda com as hashtags.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S19', dia: 19, hora: '17:30', formato: 'stories', pilar: 'vitrine', tema: 'Prova e convite',
    titulo: '3 fases, 3 aprovações',
    alavanca: 'Redução de risco', metrica: 'Conversas e cliques', cta: 'DESCOBERTA no direct',
    ficha: { nicho: 'Método da Tirvo', publico: 'Seguidores que estão avaliando a Tirvo', objetivo: 'Conversas', promessa: 'Mostrar onde o cliente decide em cada fase', tom: 'Direto' },
    ganchos: [
      ['Quebra de padrão', 'Em três momentos, nada avança sem você.', 'Promessa concreta e verdadeira do método.'],
      ['Dor aguda', 'Medo de ver o projeto só no final?'],
      ['Ganho rápido', 'Onde você aprova cada etapa.'],
    ],
    frames: [
      ['Gancho de contexto', 'Em três momentos, nada avança sem a sua aprovação.', 'Três carimbos de aprovação em fila.', '', 'O primeiro é antes de tudo.'],
      ['Fricção narrativa', 'Fim da Descoberta: você aprova o escopo. Na Engenharia: aprova o design.', 'Escopo e telas com o carimbo.', '', 'E o último?'],
      ['Valor ou paradoxo', 'Antes do Lançamento: você testa e só então o projeto vai ao ar.', 'Botão "publicar" travado até o último carimbo.', '', 'É assim que o projeto termina sem surpresa.'],
      ['Conversão com figurinha', 'Comece pela Descoberta.', 'Área livre para a figurinha de link ou para a palavra-chave. Rodapé completo.', 'Link: tirvo.tech/metodo/ ou texto "Mande DESCOBERTA"', ''],
    ],
    teste: 'Conversas e cliques.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P22', dia: 20, hora: '10:00', formato: 'img', pilar: 'vitrine',
    titulo: 'Design é decidir o que se lê primeiro',
    alavanca: 'Ganho rápido (critério aplicável)', metrica: 'Salvamentos', cta: 'Salvar como referência',
    ficha: {
      nicho: 'Design gráfico: hierarquia visual',
      publico: 'Empreendedor que faz as próprias artes ou avalia as que recebe',
      objetivo: 'Salvamentos e visitas ao perfil',
      promessa: 'Um critério simples para saber se uma peça está bem organizada',
      tom: 'Didático, enxuto',
    },
    ganchos: [
      ['Quebra de padrão', 'Design é decidir o que se lê primeiro.', 'Troca "deixar bonito" por um critério que qualquer pessoa consegue aplicar.'],
      ['Dor aguda', 'Sua arte tem tudo e ninguém lê nada?'],
      ['Ganho rápido', 'A ordem de leitura de uma peça em 5 passos.'],
    ],
    arte: {
      texto: 'Design é decidir o que se lê primeiro.\nTítulo, apoio, imagem, texto, ação.',
      direcao: 'Esquema de diagramação com blocos neutros (sem nenhuma peça fictícia) e o caminho do olhar numerado de 1 a 5 em laranja, com a legenda de cada nível à direita. Logo da Tirvo embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Esquema de uma peça gráfica com blocos numerados de 1 a 5 mostrando a ordem de leitura: título, apoio, imagem, texto e ação.',
    linhas: [
      'Quando tudo grita, nada é lido.',
      'Design gráfico não é deixar bonito. É decidir a ordem em que o olho lê.',
    ],
    legenda: `Quando tudo grita, nada é lido.

Uma peça bem diagramada tem uma ordem clara:
1. Título, maior e mais forte.
2. Apoio, num tom mais baixo.
3. Imagem, que confirma a ideia.
4. Texto, só o necessário.
5. Ação, com uma cor e um destaque.

Tamanho, peso, cor e espaço fazem esse trabalho. Teste na sua próxima arte: o que você leu primeiro?

Salve como referência.`,
    hashtags: '#designgrafico #hierarquiavisual #diagramacao #identidadevisual',
    teste: 'Salvamentos por alcance, comparados com P16.',
    instrucoes: ['Compartilhe no story de sábado.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'C21', dia: 21, hora: '11:00', formato: 'caixinha', pilar: 'vitrine', tema: 'Presença leve',
    titulo: 'Caixinha: pergunte à engenharia', alavanca: 'Reciprocidade', metrica: 'Perguntas recebidas', cta: 'Mandar uma pergunta',
    ficha: { nicho: 'Relacionamento', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Responder dúvidas reais', tom: 'Próximo' },
    ganchos: [['Quebra de padrão', 'Quem responde aqui é quem constrói.', 'Mesma arte do dia 7.'], ['Dor aguda', 'A dúvida que ninguém respondeu.'], ['Ganho rápido', 'Pergunte. A engenharia responde.']],
    frames: [['Conversão com figurinha', 'Pergunte à engenharia.', 'Mesma arte do dia 7.', 'Caixinha de perguntas', '']],
    teste: 'Número de perguntas.', instrucoes: ['Reutilize a arte do dia 7.'],
    midia: { qtd: 1, compartilhada: 'C07' },
  });

  Object.assign(PLANO.dias, {
    15: { tarefas: ['Compartilhe o P17 no story.', 'Sementeira de 15 min.'] },
    16: { tarefas: ['Compartilhe o P18 no story.', 'Sementeira de 15 min.'] },
    17: { tarefas: ['Responda quem mandar MARCA em até 1 hora.'] },
    18: { tarefas: ['Compartilhe o P20 no story.', 'Sementeira de 15 min.'] },
    19: { tarefas: ['Responda quem mandar DESCOBERTA em até 1 hora.'] },
    20: { tarefas: ['Compartilhe o P22 no story.'] },
    21: { tarefas: ['Anote os números da semana em cada peça.'] },
  });
})();
