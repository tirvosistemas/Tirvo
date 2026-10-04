// Plano de 30 dias do @tirvotech: dados gerais (premissas, estratégia, vitrine, rotinas e metas).
// As peças de cada semana ficam em semana-N.js e entram em PLANO.pecas.
window.PLANO = {
  versao: '1.0',
  pecas: [],
  dias: {},

  premissas: [
    { tema: 'Capacidade', escolha: 'A', opcoes: [
      ['A', 'Plano A: 30 posts no feed e 18 sequências de stories. As artes e os Reels são produzidos aqui. Você revisa e posta, com cerca de 40 min por dia para postar e fazer a sementeira.', true],
      ['B', 'Plano B: 3 posts por semana (2 Reels e 1 carrossel) e stories em 3 dias. Use se a semana apertar.'],
    ] },
    { tema: 'Rosto na câmera', escolha: 'A', opcoes: [
      ['A', 'Reels em motion design, sem rosto, com narração de locutor, texto na tela e trilha original já mixada no vídeo.', true],
      ['B', 'O fundador aparece em 1 Reels por semana, gravado no celular, com o mesmo roteiro.'],
    ] },
    { tema: 'Oferta de entrada', escolha: 'A', opcoes: [
      ['A', 'Conversa de Descoberta: você conta o desafio e recebe o orçamento sem compromisso, depois da Descoberta. É o primeiro passo real do método.', true],
      ['B', 'Diagnóstico de presença digital (site e perfil) [CONFIRMAR: se vai existir e em que formato].'],
    ] },
    { tema: 'Destino do link', escolha: 'A', opcoes: [
      ['A', 'Um link só: tirvo.tech. É a sede; a rede social é a vitrine.', true],
      ['B', 'Link direto para o WhatsApp +55 (41) 99193-3850.'],
    ] },
    { tema: 'Meta de conversão', escolha: 'A', opcoes: [
      ['A', 'Conversas no direct puxadas por palavra-chave (SITE, MARCA, IA, REDES, DESCOBERTA).', true],
      ['B', 'Cliques no link do perfil.'],
    ] },
    { tema: 'Início', escolha: 'A', opcoes: [
      ['A', 'O Dia 1 cai numa segunda-feira. Os dias da semana do plano partem disso.', true],
      ['B', 'Outro dia: os dias da semana mudam e a ordem das peças continua a mesma.'],
    ] },
  ],

  avisos: [
    'Gestão de redes é um serviço novo: o escopo está marcado com [CONFIRMAR] e as artes que falam dele só são feitas depois da sua confirmação.',
    'O Hipercode aparece só como vitrine: IA própria em fase final de testes, não disponível ao público e não usada em projetos de clientes. Nenhuma peça oferece o Hipercode.',
    'Nenhum cliente, número, depoimento ou preço foi inventado. Só aparece trabalho real da própria Tirvo (o site e a marca). As imagens ilustrativas do site não são usadas.',
    'Os horários são hipóteses para testar, não regras. A semana 4 testa justamente o horário.',
    'Toda imagem e todo vídeo levam a logo da Tirvo.',
  ],

  estrategia: {
    porque: [
      ['Todo mundo é público frio', 'Com zero seguidores, quem vê cada post é um desconhecido. A distribuição depende de retenção, envios e salvamentos.'],
      ['Vitrine antes de alcance', 'Quem gosta de um Reels abre o perfil em segundos. Bio, grade, fixados e destaques decidem se a visita vira seguidor ou conversa.'],
      ['Os 9 primeiros posts montam a vitrine', 'A primeira semana existe para o perfil parecer uma empresa séria. Não julgue a conta por ela.'],
      ['Constância vence volume', 'Uma cadência que dá para manter por 30 dias rende mais do que uma semana heroica. Por isso existe o Plano B.'],
      ['Uma ideia, quatro formatos', 'Cada ideia vira Reels, carrossel, stories e destaque. Aprende-se mais rápido sem começar do zero todo dia.'],
      ['Sementeira antes do algoritmo', 'Sem audiência, os primeiros envios e comentários vêm de pessoas reais que você aciona de propósito.'],
    ],
    posicionamento: 'Sites, sistemas, marca e IA com rigor de engenharia, para empresas de todo o Brasil que se recusam a parecer genéricas.',
    pilares: [
      { id: 'autoridade', nome: 'Autoridade em site e conversão', promessa: 'Por que sites não vendem e o que resolve, sem jargão.', servicos: 'Criação de sites · Sistemas e automações', fatia: 35, metrica: 'Salvamentos' },
      { id: 'marca', nome: 'Marca e posicionamento premium', promessa: 'Como a marca é percebida e o que a deixa coerente em todo canal.', servicos: 'Logotipo e identidade visual · Design gráfico · Gestão de redes', fatia: 25, metrica: 'Envios' },
      { id: 'vitrine', nome: 'Vitrine e prova', promessa: 'O trabalho real da própria Tirvo: o site, a marca, o método e os bastidores.', servicos: 'Todos os serviços', fatia: 25, metrica: 'Visitas ao perfil e cliques no link' },
      { id: 'dono', nome: 'Dono de negócio na prática', promessa: 'As dores de quem toca uma empresa, explicadas sem jargão.', servicos: 'Sites · Engenharia de IA · Automações', fatia: 15, metrica: 'Envios' },
    ],
  },

  dia0: {
    intro: 'Antes do primeiro post. Leva cerca de 40 minutos e muda o que acontece com cada visita ao perfil.',
    itens: [
      { item: 'Nome do perfil', veredito: 'ajustar', acao: 'O campo Nome entra na busca. Use a marca e o que ela faz.', copiar: 'Tirvo | Sites, Marca e IA' },
      { item: '@', veredito: 'ok', acao: 'Mantenha @tirvotech, igual ao rodapé do site.' },
      { item: 'Foto', veredito: 'conferir', acao: 'Use a mira da logo (os quatro cantos e o ponto laranja) centralizada, sobre fundo preto. Ela precisa ser legível num círculo de 40 px. Arquivo: icon-512.png do site.' },
      { item: 'Bio', veredito: 'ajustar', acao: 'Para quem é, o que muda e um próximo passo. São 125 caracteres, dentro do limite de 150.', copiar: 'Sites, sistemas, marca e IA com rigor de engenharia.\nCuritiba · atendemos todo o Brasil\nSeu projeto começa com uma conversa ↓' },
      { item: 'Link', veredito: 'ajustar', acao: 'Só um link no lançamento, o do site. Mais links dividem o clique.', copiar: 'https://tirvo.tech' },
      { item: 'Categoria', veredito: 'conferir', acao: 'Escolha a categoria mais próxima de criação de sites que o app oferecer (por exemplo, Web designer) e deixe a categoria visível no perfil.' },
      { item: 'Botões de contato', veredito: 'ajustar', acao: 'Ative WhatsApp (+55 41 99193-3850), e-mail (engenharia@tirvo.tech) e endereço (Av. Silva Jardim, 1003, Centro, Curitiba).' },
      { item: 'Destaques: ordem', veredito: 'ajustar', acao: 'Os 3 primeiros respondem o que a Tirvo faz, por que confiar e como falar com ela. Ordem: Serviços, Sobre a Tirvo, Contato, Método, Dúvidas.' },
      { item: 'Destaques: capas', veredito: 'conferir', acao: 'As 5 capas no mesmo padrão: fundo preto e ícone em traço laranja. Nada de foto nem de texto nas capas.' },
      { item: 'Destaques: gestão de redes', veredito: 'decidir', acao: 'Depois de confirmar o escopo do serviço novo, acrescente 1 story sobre ele no fim do destaque Serviços. A partir do dia 30, os stories de prova de sexta podem formar um destaque Vitrine.' },
      { item: 'Posts fixados', veredito: 'depois do dia 5', acao: 'Fixe 3 posts (confira no app o limite atual): P01 Terreno alugado, P02 5 sinais e P08 Por dentro do tirvo.tech. No dia 14, troque um deles pelo Reels de melhor retenção.' },
      { item: 'Corte da grade', veredito: 'conferir', acao: 'O perfil mostra as miniaturas em retrato, mais estreitas que o post 4:5. As artes deixam 96 px livres nas laterais para nada importante ser cortado. Confira no app depois do primeiro post.' },
    ],
    grade: {
      nota: 'A ordem de publicação define a grade: o último post entra no canto superior esquerdo. As capas alternam texto e imagem, como num tabuleiro.',
      linhas: [['P09', 'P08', 'P07'], ['P06', 'P05', 'P04'], ['P03', 'P02', 'P01']],
      tipo: { P09: 'texto', P08: 'imagem', P07: 'texto', P06: 'imagem', P05: 'texto', P04: 'imagem', P03: 'texto', P02: 'imagem', P01: 'texto' },
    },
  },

  semanas: [
    { n: 1, nome: 'Fundação da vitrine', dias: [1, 7], variavel: 'Capa tipográfica × capa visual. A grade alterna os dois tipos de capa; compare visitas ao perfil e alcance por tipo.', meta: '9 posts no ar até o dia 5, perfil revisado e 3 posts fixados.' },
    { n: 2, nome: 'Primeiras leituras de alcance', dias: [8, 14], variavel: 'Gancho dos Reels: dor (dias 8 e 12) × contra-intuitivo (dia 10). Compare retenção nos 3 primeiros segundos.', meta: '3 Reels, 2 carrosséis e 1 post. Checkpoint no dia 14.' },
    { n: 3, nome: 'Conversão em conversa', dias: [15, 21], variavel: 'Tipo de CTA: salvar (dias 16 e 18) × palavra-chave no direct (dias 15, 17 e 19). Compare salvamentos e conversas.', meta: 'Stories de segunda a sexta. Primeiras conversas qualificadas no direct.' },
    { n: 4, nome: 'Ritmo e horário', dias: [22, 28], variavel: 'Horário: manhã às 8h (dias 22, 23 e 26) × noite às 19h30 (dias 24 e 25). Compare o alcance das primeiras 24 h.', meta: 'Manter a cadência e preparar o /analisar do mês.' },
    { n: 5, nome: 'Repetir o que funcionou', dias: [29, 30], variavel: 'Repetição do vencedor: o melhor Reels do mês volta com um gancho novo. Compare com a versão original.', meta: 'Retrospectiva do dia 30 e direção dos dias 31 a 60.' },
  ],

  checkpoints: {
    5: { nome: 'Checkpoint do dia 5', itens: ['Grade com 9 posts completa e coerente.', 'Bio, link, botões e destaques revisados.', '3 posts fixados.', 'Linha de base anotada: alcance, visitas ao perfil e seguidores de cada post.'] },
    14: { nome: 'Checkpoint do dia 14', itens: ['Cole os Insights das 2 semanas no /analisar.', 'Separe o que viajou (alcance de não seguidores) do que só ficou bonito na grade.', 'Troque 1 fixado pelo Reels de melhor retenção.', 'A partir daqui, as metas passam a ser relativas à mediana da própria Tirvo.'] },
    30: { nome: 'Retrospectiva do dia 30', itens: ['/analisar com o mês inteiro.', 'Pilar × formato: o que ficou acima da mediana em pelo menos 3 peças.', 'Quantas conversas qualificadas e de onde vieram.', 'Defina os dias 31 a 60 com base nisso.'] },
  },

  storiesMapa: [
    { dia: 'segunda-feira', tema: 'Bastidor real', acao: 'Responder a enquete', figurinha: 'Enquete' },
    { dia: 'terça-feira', tema: 'Mito × verdade', acao: 'Acertar o quiz', figurinha: 'Quiz' },
    { dia: 'quarta-feira', tema: 'Antes e depois de uma decisão', acao: 'Mover o slider ou responder', figurinha: 'Slider de emoji ou caixinha' },
    { dia: 'quinta-feira', tema: 'Pergunta de dono de negócio', acao: 'Mandar a própria pergunta', figurinha: 'Caixinha de perguntas' },
    { dia: 'sexta-feira', tema: 'Prova e convite', acao: 'Abrir o link ou chamar no direct', figurinha: 'Link ou palavra-chave' },
    { dia: 'sábado e domingo', tema: 'Presença leve', acao: 'Responder a caixinha', figurinha: 'Caixinha de perguntas' },
  ],
  storiesRegras: [
    'Toda sequência segue o arco da skill: Gancho de contexto, Fricção narrativa, Valor ou paradoxo e Conversão com figurinha.',
    'Semanas 1 e 2: sequência completa só segunda, quarta e sexta. Terça e quinta, apenas compartilhe o post do feed no story.',
    'Semanas 3 a 5: sequência de segunda a sexta.',
    'Fim de semana: compartilhe o post de sábado e use a arte da caixinha de perguntas no domingo.',
    'As figurinhas são colocadas no app, na área marcada da arte.',
    'Sem hashtag nos stories.',
  ],

  sementeira: {
    tempo: '15 a 20 minutos por dia, a partir do dia 1.',
    passos: [
      ['Envie a peça do dia', 'Mande para 3 a 5 pessoas reais que vão achar útil: clientes, parceiros, contatos do WhatsApp. Peça só a opinião, nada artificial.'],
      ['5 comentários de verdade', 'Comente em perfis de donos de negócio, comunidades e serviços complementares. Acrescente um ponto ou faça uma pergunta. Nunca só "parabéns".'],
      ['Resposta na primeira hora', 'Responda todo comentário em até 60 min depois de postar, com uma pergunta de volta. Conversa qualificada vai para o direct com a palavra-chave.'],
      ['Direct só com contexto', 'Mande mensagem só para quem interagiu e tem a ver com o público. Nunca em massa.'],
      ['Canais próprios', 'Instagram no site, na assinatura do e-mail, no status do WhatsApp e nas redes profissionais.'],
      ['Registro em 3 linhas', 'O que foi postado, o que se mexeu e o que mudar. Use o campo de anotações de cada peça.'],
    ],
    proibido: 'Sem compra de seguidores, grupos de engajamento, robôs de comentário, seguir e deixar de seguir em massa ou direct em massa.',
    engajamento: [
      ['Direct com palavra-chave', 'Quando o objetivo é conversa qualificada.'],
      ['Link na bio', 'Quando o objetivo é mostrar o site, o método ou a oferta de entrada.'],
      ['Salvar e enviar', 'Nos posts de topo de funil.'],
      ['Sem CTA forte', 'Nas peças puras de alcance frio.'],
    ],
  },

  metas: {
    norte: 'Conversas qualificadas no direct (perfis que se encaixam no público) e cliques no link para a conversa de Descoberta.',
    indicadores: [
      ['Poder de parada', 'Retenção nos 3 primeiros segundos; em stories, saídas no 1º frame.'],
      ['Retenção', 'Tempo médio assistido; no carrossel, quem passa do 1º slide.'],
      ['Propagação', 'Envios e salvamentos divididos pelo alcance.'],
      ['Conversão', 'Visitas ao perfil, visita que vira seguidor, cliques no link e conversas.'],
    ],
    execucao: [
      ['Calendário publicado', '100% do Plano A (30 posts e 18 sequências) ou 100% do Plano B'],
      ['Resposta a comentários', 'Até 60 min, todos'],
      ['Sementeira', '5 sessões por semana'],
      ['Fichas aprovadas', '30 de 30 antes de postar'],
    ],
    regras: [
      'Compare só depois de 3 peças do mesmo pilar e formato, sempre contra a mediana das outras.',
      'Peça acima da mediana volta com uma variação, nunca copiada.',
      'Peça fraca troca o gancho e o primeiro frame antes de se descartar o formato ou o pilar.',
      'Nunca conclua com uma peça só. Diga o que ainda não dá para concluir.',
      'Semanas 1 e 2 constroem a linha de base. Sem números de mercado inventados.',
    ],
  },

  proximos: [
    'Dobrar no pilar e no formato que ficaram acima da mediana em pelo menos 3 peças.',
    'Transformar as perguntas reais do direct em carrosséis de dúvidas e em stories de quinta.',
    'Mostrar o primeiro projeto de cliente, com autorização por escrito [CONFIRMAR PERMISSÃO].',
    'Criar o destaque Vitrine e, se o escopo estiver fechado, um destaque de Gestão de redes.',
    'Testar collab com um serviço complementar (fotografia, contabilidade, arquitetura).',
  ],
  comoUsar: [
    ['Aprove as premissas', 'Responda com os códigos (por exemplo, "1A 3B") ou "ok".'],
    ['Cole a ficha na skill', 'Botão "Copiar comando" de cada peça. Ele já leva as 6 dimensões da Fase 0.'],
    ['Responda "ok"', 'A skill pula a Fase 0 e produz a peça.'],
    ['Revise e publique', 'Baixe a mídia, copie a legenda e as hashtags e marque como postado.'],
    ['Toda semana: /analisar', 'Preencha as métricas das peças, use "Copiar para /analisar" e volte às regras de decisão.'],
  ],
};
