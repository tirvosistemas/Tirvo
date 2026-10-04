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
      ['Quebra de padrão', 'Seu melhor vendedor pode trabalhar às 23h.'],
      ['Dor aguda', 'O cliente pediu orçamento às 23h. Quem respondeu?'],
      ['Ganho rápido', 'Seu site trabalha enquanto você dorme?', 'Pergunta simples, com imagem clara, que o dono responde na hora.'],
    ],
    roteiro: {
      duracao: '22 s', palavras: 50, audio: 'Sem narração. Faixa calma, noturna.',
      linhas: [
        ['0–2 s', 'Seu site trabalha enquanto você dorme?', 'Relógio marcando 23:04, luzes da cidade, a tela de um celular acende.'],
        ['2–6 s', 'O cliente pesquisou à noite, achou você, abriu o site.', 'Busca, clique e o site abrindo rápido.'],
        ['6–10 s', 'Se o próximo passo não é óbvio, ele fecha e volta amanhã. Ou não volta.', 'O dedo hesita; a aba fecha.'],
        ['10–15 s', 'Com o caminho certo, o pedido chega organizado, pelo formulário ou pelo WhatsApp.', 'Formulário enviado; notificação de pedido com os dados preenchidos.'],
        ['15–19 s', 'De manhã, você só responde.', 'Relógio marca 08:00; a mira se fecha sobre o pedido.'],
        ['19–22 s', 'Quer o seu site assim? Mande SITE no direct.', 'Cartão final com a logo e o cursor.'],
      ],
    },
    capa: 'Relógio às 23:04 com o título "Seu site trabalha enquanto você dorme?"',
    alt: 'Reels que mostra um cliente encontrando um site à noite e deixando um pedido organizado, que a empresa responde de manhã.',
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
    instrucoes: ['Vídeo produzido depois do plano.', 'Responda quem mandar SITE em até 1 hora.'],
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
      ['Quebra de padrão', 'Logo bonito não é identidade visual.', 'Contraria o senso comum e a animação prova o ponto.'],
      ['Dor aguda', 'Cada peça da sua marca sai de um jeito?'],
      ['Ganho rápido', 'O que transforma um logo numa marca, em 20 segundos.'],
    ],
    roteiro: {
      duracao: '20 s', palavras: 45, audio: 'Sem narração. Faixa instrumental.',
      linhas: [
        ['0–2 s', 'Logo bonito não é identidade visual.', 'Um logo sozinho no centro; o resto da tela vazio.'],
        ['2–6 s', 'Sem regras, cada peça sai de um jeito.', 'O mesmo logo em posts com cores e fontes diferentes, tremendo.'],
        ['6–11 s', 'Identidade é sistema: paleta, tipografia, respiro e aplicações.', 'As peças se alinham; a paleta e as fontes encaixam.'],
        ['11–16 s', 'Com um manual, qualquer pessoa aplica a marca igual.', 'Páginas de manual viram; as aplicações ficam iguais.'],
        ['16–20 s', 'Quer a sua marca assim? Mande MARCA no direct.', 'Cartão final com a logo e o cursor.'],
      ],
    },
    capa: 'Logo solto no centro com o título "Logo bonito não é identidade visual".',
    alt: 'Reels que mostra a diferença entre ter só um logo e ter uma identidade visual com paleta, tipografia e manual de marca.',
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
    instrucoes: ['Vídeo produzido depois do plano.'],
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
      ['Quebra de padrão', 'Nenhuma linha de código antes desta conversa.', 'Mostra método e reduz o medo de começar.'],
      ['Dor aguda', 'Projeto que nunca termina começa sem escopo.'],
      ['Ganho rápido', 'Como um projeto começa sem surpresa.'],
    ],
    roteiro: {
      duracao: '24 s', palavras: 55, audio: 'Sem narração. Faixa instrumental.',
      linhas: [
        ['0–2 s', 'Nenhuma linha de código antes desta conversa.', 'Editor vazio; o cursor pisca e espera.'],
        ['2–7 s', 'Descoberta: imersão no negócio, nos objetivos e no público.', 'Mapa de ideias se montando.'],
        ['7–12 s', 'Arquitetura de informação e diagnóstico técnico.', 'Wireframe e checklist técnico.'],
        ['12–17 s', 'Saem escopo e cronograma claros, e você aprova antes de começar.', 'Carimbo "aprovado" sobre o escopo.'],
        ['17–21 s', 'Só então começa a Engenharia.', 'O editor se enche de código.'],
        ['21–24 s', 'Quer começar pela Descoberta? Mande DESCOBERTA no direct.', 'Cartão final com a logo e o cursor.'],
      ],
    },
    capa: 'Editor vazio com o cursor e o título "Nenhuma linha de código antes desta conversa."',
    alt: 'Reels que explica a fase de Descoberta do método da Tirvo: imersão, arquitetura, diagnóstico e aprovação do escopo antes do código.',
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
    instrucoes: ['Vídeo produzido depois do plano.'],
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
