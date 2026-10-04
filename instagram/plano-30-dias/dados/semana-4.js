// Semanas 4 e 5 (dias 22 a 30): ritmo e horário; depois, repetir o que funcionou.
(() => {
  const add = (p) => PLANO.pecas.push(p);

  add({
    id: 'P23', dia: 22, hora: '08:00', formato: 'reels', pilar: 'vitrine',
    titulo: 'Um site, do zero ao ar, em 20 segundos',
    alavanca: 'Curiosidade (processo)', metrica: 'Retenção e visitas ao perfil', cta: 'Seguir para ver os próximos bastidores',
    ficha: {
      nicho: 'Processo de criação de sites da Tirvo',
      publico: 'Quem nunca viu como um site é feito por dentro',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'Ver as etapas reais de um projeto em 20 segundos',
      tom: 'Bastidores, ritmo rápido',
    },
    ganchos: [
      ['Quebra de padrão', 'Um site, do zero ao ar, em 20 segundos.', 'Promete uma transformação visual completa e cumpre no tempo dito.'],
      ['Dor aguda', 'Não sabe o que a agência faz com o seu dinheiro?'],
      ['Ganho rápido', 'As 5 etapas de um site, sem enrolação.'],
    ],
    roteiro: {
      duracao: '20 s', palavras: 40, audio: 'Sem narração. Faixa com batida marcada; cortes no tempo da música.',
      linhas: [
        ['0–2 s', 'Um site, do zero ao ar, em 20 segundos.', 'Tela preta e o cursor piscando.'],
        ['2–5 s', 'Descoberta: entender o negócio.', 'Notas e mapa de ideias.'],
        ['5–9 s', 'Arquitetura e wireframe.', 'Caixas cinza montando a página.'],
        ['9–13 s', 'Design system e interface.', 'Cor, fonte e imagens entram no wireframe.'],
        ['13–17 s', 'Código sob medida e testes.', 'Decodificação; três medidores sobem.'],
        ['17–20 s', 'No ar, com SSL e monitoramento. Siga para mais bastidores.', 'Cadeado, luz verde de status e cartão final com a logo.'],
      ],
    },
    capa: 'Metade wireframe, metade site pronto, com o título "Do zero ao ar em 20 s".',
    alt: 'Reels que mostra as etapas de criação de um site na Tirvo: descoberta, wireframe, design, código, testes e publicação.',
    linhas: [
      'Um site sério passa por 5 etapas antes de ir ao ar. Aqui estão as 5, em 20 segundos.',
      'O que acontece entre o "fechado" e o "no ar".',
    ],
    legenda: `Um site sério passa por 5 etapas antes de ir ao ar. Aqui estão as 5, em 20 segundos.

Descoberta. Arquitetura. Design. Código e testes. Lançamento com SSL e monitoramento.

Na vida real, cada etapa tem prazo combinado na Descoberta e a sua aprovação antes da próxima.

Siga para ver os próximos bastidores.`,
    hashtags: '#criacaodesites #webdesign #desenvolvimentoweb #bastidores',
    teste: 'Variável da semana: horário da manhã (8h). Compare o alcance em 24 h com P25 (noite).',
    instrucoes: ['Vídeo produzido depois do plano.', 'Postar às 8h em ponto, por causa do teste de horário.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S22', dia: 22, hora: '12:30', formato: 'stories', pilar: 'vitrine', tema: 'Bastidor real',
    titulo: 'Como planejamos o mês da própria Tirvo',
    alavanca: 'Curiosidade', metrica: 'Respostas na enquete', cta: 'Votar na enquete',
    ficha: { nicho: 'Planejamento de conteúdo', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Mostrar o plano por trás do perfil', tom: 'Bastidores' },
    ganchos: [
      ['Quebra de padrão', 'Este perfil tem um plano de 30 dias. Com testes.', 'Real, curioso e abre o caminho para gestão de redes.'],
      ['Dor aguda', 'Posta sem saber o que funciona?'],
      ['Ganho rápido', 'O que dá para testar num perfil em 4 semanas.'],
    ],
    frames: [
      ['Gancho de contexto', 'Este perfil segue um plano de 30 dias. Com testes.', 'Calendário com os dias marcados.', '', 'Um teste por semana.'],
      ['Fricção narrativa', 'Semana 1: tipo de capa. Semana 2: gancho. Semana 3: chamada. Semana 4: horário.', 'Quatro linhas em Geist Mono, uma por semana.', '', 'Por que um de cada vez?'],
      ['Valor ou paradoxo', 'Um teste por vez é o único jeito de saber o que mudou o resultado.', 'Dois gráficos, um com uma variável destacada.', '', 'Qual você testaria?'],
      ['Conversão com figurinha', 'No seu perfil, o que você testaria primeiro?', 'Área livre para a enquete. Rodapé completo.', 'Enquete: "Horário" / "Gancho"', ''],
    ],
    teste: 'Respostas.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P24', dia: 23, hora: '08:00', formato: 'carrossel', pilar: 'marca',
    titulo: '6 regras para o feed parecer de uma empresa só',
    alavanca: 'Utilidade (regras)', metrica: 'Salvamentos', cta: 'Salvar',
    ficha: {
      nicho: 'Design gráfico para redes e gestão de redes',
      publico: 'Dono de negócio que faz os próprios posts ou troca de designer com frequência',
      objetivo: 'Salvamentos',
      promessa: '6 regras simples que deixam qualquer feed coerente',
      tom: 'Educativo prático',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu feed não precisa de mais criatividade. Precisa de 6 regras.', 'Inverte a expectativa e entrega um método aplicável.'],
      ['Dor aguda', 'Cada post seu parece de uma empresa diferente?'],
      ['Ganho rápido', '6 regras para o feed parecer de uma empresa só.'],
    ],
    slides: [
      ['Seu feed não precisa de mais criatividade.\nPrecisa de 6 regras.', 'Capa tipográfica, com a grade de um feed ao fundo.', 'São as mesmas que usamos aqui.'],
      ['01 · Uma cor de destaque.\nO resto é fundo e texto. Destaque demais não destaca nada.', 'Paleta com um único laranja.', 'A segunda é sobre letras.'],
      ['02 · Duas fontes, no máximo.\nUma para títulos, outra para textos.', 'Duas famílias tipográficas lado a lado.', 'A terceira quase ninguém segue.'],
      ['03 · A logo sempre no mesmo lugar.\nPequena, num canto, igual em toda a série.', 'Três posts com a logo no mesmo canto.', 'Agora, espaço.'],
      ['04 · Respiro.\nMenos texto na arte. O detalhe vai na legenda.', 'Post com muito espaço vazio e uma frase.', 'Ritmo.'],
      ['05 · Numeração e grade fixas.\nO seguidor reconhece a série antes de ler.', 'Carrossel com 01/08 em Geist Mono.', 'E a última vale para o texto.'],
      ['06 · O mesmo tom de voz.\nFrases curtas, sem clichê, sem exagero.', 'Duas frases genéricas riscadas e uma frase direta.', 'Guarde as 6.'],
      ['Salve e confira o seu feed com as 6 regras.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel com 6 regras para manter um feed coerente: uma cor de destaque, duas fontes, logo fixa, respiro, numeração e tom de voz.',
    linhas: [
      'Feed coerente não depende de inspiração. Depende de regra.',
      'As 6 regras que este perfil segue, para você aplicar no seu.',
    ],
    legenda: `Feed coerente não depende de inspiração. Depende de regra.

01 Uma cor de destaque
02 Duas fontes, no máximo
03 Logo sempre no mesmo lugar
04 Respiro
05 Numeração e grade fixas
06 O mesmo tom de voz

São as mesmas regras que este perfil segue. Quando elas viram manual, qualquer pessoa da equipe consegue postar sem desmontar a marca.

Salve e confira o seu feed.`,
    hashtags: '#designgrafico #identidadevisual #gestaoderedessociais #designpararedessociais',
    teste: 'Horário da manhã. Compare o alcance em 24 h com P26 (noite).',
    instrucoes: ['Publique as 8 imagens na ordem às 8h.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'S23', dia: 23, hora: '12:30', formato: 'stories', pilar: 'dono', tema: 'Mito × verdade',
    titulo: 'Rede social basta?',
    alavanca: 'Quebra de crença', metrica: 'Respostas no quiz', cta: 'Responder o quiz',
    ficha: { nicho: 'Presença digital', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Entender o papel de cada canal', tom: 'Direto' },
    ganchos: [
      ['Quebra de padrão', 'Mito: rede social basta.', 'Volta à tese do P01 com um formato de quiz.'],
      ['Dor aguda', 'Seu negócio inteiro está num perfil?'],
      ['Ganho rápido', 'O papel de cada canal, em um story.'],
    ],
    frames: [
      ['Gancho de contexto', 'Mito: "meu negócio não precisa de site, tenho Instagram".', 'Carimbo "mito" sobre um perfil.', '', 'Funciona até o dia em que não funciona.'],
      ['Fricção narrativa', 'Algoritmo muda, perfil cai, audiência fica na plataforma.', 'Gráfico de alcance que despenca.', '', 'A verdade é mais simples.'],
      ['Valor ou paradoxo', 'Verdade: rede social atrai. Site converte. Um não substitui o outro.', 'Duas colunas: vitrine e sede.', '', 'Teste-se.'],
      ['Conversão com figurinha', 'Onde o seu cliente chega quando pesquisa você no Google?', 'Área livre para o quiz. Rodapé completo.', 'Quiz: "No meu site" / "No meu Instagram" / "Em lugar nenhum"', ''],
    ],
    teste: 'Respostas no quiz.', instrucoes: ['Publique os 4 frames em sequência.', 'Mande mensagem para quem responder "Em lugar nenhum".'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P25', dia: 24, hora: '19:30', formato: 'reels', pilar: 'dono',
    titulo: 'Se o seu perfil sumir hoje, o que sobra?',
    alavanca: 'Medo de perda', metrica: 'Envios', cta: 'Enviar para um sócio',
    ficha: {
      nicho: 'Presença digital própria (parte 2 do terreno alugado)',
      publico: 'Dono de negócio que vende só pelas redes sociais',
      objetivo: 'Envios',
      promessa: 'Saber o que fica com a empresa se o perfil cair amanhã',
      tom: 'Opinativo, com tensão',
    },
    ganchos: [
      ['Quebra de padrão', 'O seu perfil some hoje. O que sobra?', 'Cenário concreto que o dono imagina na hora e envia ao sócio.'],
      ['Dor aguda', 'Anos de seguidores, zero contatos salvos.'],
      ['Ganho rápido', 'O que garantir antes que o perfil caia.'],
    ],
    roteiro: {
      duracao: '22 s', palavras: 50, audio: 'Sem narração. Faixa tensa, que respira no fim.',
      linhas: [
        ['0–2 s', 'O seu perfil some hoje. O que sobra?', 'Perfil na tela; ele se desfaz em pixels.'],
        ['2–6 s', 'Seguidores, mensagens e conteúdo ficam com a plataforma.', 'Ícones voando para dentro de uma nuvem trancada.'],
        ['6–11 s', 'O que é seu: o domínio, o site e os contatos que você guardou.', 'Três blocos sólidos acendem em laranja.'],
        ['11–17 s', 'Rede social atrai. Site converte e fica.', 'O perfil volta, ligado por um fio ao site.'],
        ['17–22 s', 'Manda para o seu sócio antes que seja tarde.', 'Cartão final com a logo e o cursor.'],
      ],
    },
    capa: 'Perfil se desfazendo em pixels com o título "O seu perfil some hoje. O que sobra?"',
    alt: 'Reels que mostra o que uma empresa perde se o perfil cair e o que continua dela: domínio, site e contatos.',
    linhas: [
      'Se o perfil cair amanhã, a audiência fica com a plataforma. O domínio fica com você.',
      'Perfil é aluguel. Domínio, site e contatos são patrimônio.',
    ],
    legenda: `Se o perfil cair amanhã, a audiência fica com a plataforma. O domínio fica com você.

Seguidores, mensagens e alcance não são da empresa. O que é dela: o domínio, o site e os contatos que ela guardou.

Rede social atrai. Site converte e fica.

Manda para o seu sócio.`,
    hashtags: '#presencadigital #donodenegocio #criacaodesites #empreendedorismodigital',
    teste: 'Variável da semana: horário da noite (19h30). Compare o alcance em 24 h com P23 e P27.',
    instrucoes: ['Vídeo produzido depois do plano.', 'Postar às 19h30, por causa do teste de horário.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S24', dia: 24, hora: '12:30', formato: 'stories', pilar: 'autoridade', tema: 'Antes e depois de uma decisão',
    titulo: 'Tudo no direct × site, WhatsApp e formulário',
    alavanca: 'Contraste', metrica: 'Respostas no slider', cta: 'Mover o slider',
    ficha: { nicho: 'Canais de contato', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Organizar a entrada de pedidos', tom: 'Leve' },
    ganchos: [
      ['Quebra de padrão', 'O direct não é balcão de atendimento.', 'Provoca quem atende tudo pelo direct.'],
      ['Dor aguda', 'Pedido perdido no meio de 40 conversas?'],
      ['Ganho rápido', 'Um caminho único para o pedido chegar.'],
    ],
    frames: [
      ['Gancho de contexto', 'Antes: todo pedido chegava pelo direct, misturado com tudo.', 'Lista de mensagens sem fim.', '', 'Funciona até lotar.'],
      ['Fricção narrativa', 'Pedido perdido, resposta atrasada, cliente que desiste.', 'Mensagem marcada como "vista" e esquecida.', '', 'A decisão diferente.'],
      ['Valor ou paradoxo', 'Depois: o site recebe o pedido organizado e leva para o WhatsApp certo.', 'Fluxo: site, formulário, WhatsApp.', '', 'E no seu caso?'],
      ['Conversão com figurinha', 'Quão organizada está a entrada de pedidos na sua empresa?', 'Área livre para o slider. Rodapé completo.', 'Slider de emoji', ''],
    ],
    teste: 'Média do slider.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P26', dia: 25, hora: '19:30', formato: 'carrossel', pilar: 'autoridade',
    titulo: 'Domínio, hospedagem e SSL: quem é o dono do seu site?',
    alavanca: 'Aversão à perda', metrica: 'Envios e salvamentos', cta: 'Enviar para quem contratou o site',
    ficha: {
      nicho: 'Propriedade e infraestrutura de sites',
      publico: 'Dono de negócio que não sabe em nome de quem está o domínio da empresa',
      objetivo: 'Envios e salvamentos',
      promessa: 'Conferir em 3 itens se o site é realmente da empresa',
      tom: 'Educativo direto',
    },
    ganchos: [
      ['Quebra de padrão', 'Seu site pode estar no nome de outra pessoa.'],
      ['Dor aguda', 'Domínio, hospedagem e SSL: quem é o dono do seu site?', 'Pergunta direta que muitos donos não sabem responder, e isso gera envio.'],
      ['Ganho rápido', 'Confira em 3 itens se o seu site é seu.'],
    ],
    slides: [
      ['Domínio, hospedagem e SSL:\nquem é o dono do seu site?', 'Capa tipográfica com três chaves numeradas.', 'Comece pelo endereço.'],
      ['01 · Domínio\nÉ o endereço (seunegocio.com.br). Precisa estar no nome da empresa, não do fornecedor.', 'Certificado de registro com o titular em destaque.', 'Depois, onde o site mora.'],
      ['02 · Hospedagem\nÉ onde o site mora. Saiba onde fica e quem tem o acesso.', 'Servidor com uma etiqueta de acesso.', 'E o cadeado.'],
      ['03 · SSL\nÉ o cadeado do navegador. Sem ele, o navegador avisa que o site não é seguro.', 'Barra de endereço com e sem o cadeado.', 'E se você não souber responder?'],
      ['Não sabe responder às 3?\nPeça hoje ao seu fornecedor os acessos e o nome do titular.', 'Lista de pedido com três itens.', 'Na Tirvo, você escolhe o modelo.'],
      ['Código entregue: tudo fica com você.\nGestão 360º: a Tirvo opera, e o projeto continua sendo seu.', 'Duas colunas com molduras chanfradas.', 'Guarde a lista.'],
      ['Mande para quem contratou o site da sua empresa.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel que explica domínio, hospedagem e SSL e como conferir se o site está no nome da empresa.',
    linhas: [
      'Muita empresa descobre que o domínio não é dela no dia em que troca de fornecedor.',
      'Três perguntas para saber se o seu site é realmente seu.',
    ],
    legenda: `Muita empresa descobre que o domínio não é dela no dia em que troca de fornecedor.

Confira os 3:

01 Domínio: está no nome da empresa?
02 Hospedagem: você sabe onde fica e quem tem acesso?
03 SSL: o cadeado aparece no navegador?

Se não souber responder, peça hoje ao fornecedor os acessos e o nome do titular.

Mande para quem contratou o site da sua empresa.`,
    hashtags: '#dominio #hospedagemdesites #segurancadigital #sitesprofissionais',
    teste: 'Horário da noite. Compare o alcance com P24 (manhã).',
    instrucoes: ['Publique as 7 imagens na ordem às 19h30.'],
    midia: { qtd: 7 },
  });

  add({
    id: 'S25', dia: 25, hora: '12:30', formato: 'stories', pilar: 'dono', tema: 'Pergunta de dono de negócio',
    titulo: '"Vocês atendem fora de Curitiba?"',
    alavanca: 'Remoção de objeção', metrica: 'Perguntas recebidas', cta: 'Mandar a própria pergunta',
    ficha: { nicho: 'Atendimento em todo o Brasil', publico: 'Seguidores de fora de Curitiba', objetivo: 'Respostas e conversas', promessa: 'Tirar a dúvida da distância', tom: 'Direto' },
    ganchos: [
      ['Quebra de padrão', 'Curitiba é a base. O Brasil é o mapa.', 'Remove a objeção da distância logo de saída.'],
      ['Dor aguda', 'Acha que precisa de uma agência na sua cidade?'],
      ['Ganho rápido', 'Como funciona um projeto 100% online.'],
    ],
    frames: [
      ['Gancho de contexto', '"Vocês atendem fora de Curitiba?"', 'Balão de mensagem e o mapa do Brasil em pontos.', '', 'Atendemos.'],
      ['Fricção narrativa', 'A base é em Curitiba. Os projetos vêm de todo o Brasil.', 'Pontos acendendo pelo mapa a partir de Curitiba.', '', 'E como fica a proximidade?'],
      ['Valor ou paradoxo', 'Reuniões, aprovações e acompanhamento online, com a mesma proximidade de um atendimento presencial.', 'Videochamada e um carimbo de aprovação.', '', 'Tem outra pergunta?'],
      ['Conversão com figurinha', 'O que mais você quer saber antes de começar?', 'Área livre para a caixinha. Rodapé completo.', 'Caixinha de perguntas', ''],
    ],
    teste: 'Perguntas recebidas.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P27', dia: 26, hora: '08:00', formato: 'reels', pilar: 'marca',
    titulo: 'Logotipo × logomarca em 15 segundos',
    alavanca: 'Curiosidade (quebra de crença)', metrica: 'Retenção e salvamentos', cta: 'Salvar',
    ficha: {
      nicho: 'Logotipo e identidade visual (o P04 em vídeo)',
      publico: 'Empreendedor que vai criar ou refazer a marca',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'Entender a diferença em 15 segundos, com a logo da Tirvo como exemplo',
      tom: 'Didático, rápido',
    },
    ganchos: [
      ['Quebra de padrão', 'Logotipo e logomarca não são a mesma coisa.', 'Mesmo gancho do P04, agora testado em vídeo (uma ideia, quatro formatos).'],
      ['Dor aguda', 'Pediu logomarca e recebeu logotipo?'],
      ['Ganho rápido', 'A diferença em 15 segundos.'],
    ],
    roteiro: {
      duracao: '15 s', palavras: 36, audio: 'Sem narração. Faixa curta, ritmo rápido.',
      linhas: [
        ['0–2 s', 'Logotipo e logomarca não são a mesma coisa.', 'A logo da Tirvo inteira, que se separa em duas partes.'],
        ['2–6 s', 'Logotipo: o nome desenhado. Só tipografia.', 'Fica só "tirvo", com medidas.'],
        ['6–10 s', 'Logomarca: símbolo e nome juntos.', 'A mira volta e encaixa ao lado do nome.'],
        ['10–15 s', 'Identidade visual: o sistema inteiro. Salve.', 'Paleta, fontes e aplicações aparecem em volta; cartão final com a logo.'],
      ],
    },
    capa: 'A logo da Tirvo dividida ao meio com o título "Logotipo × logomarca".',
    alt: 'Reels que explica a diferença entre logotipo, logomarca e identidade visual usando a logo da Tirvo.',
    linhas: [
      'Em 15 segundos: o nome do que você vai pedir no briefing.',
      'Logotipo, logomarca e identidade visual, sem confusão.',
    ],
    legenda: `Em 15 segundos: o nome do que você vai pedir no briefing.

Logotipo é o nome desenhado. Logomarca é símbolo e nome juntos. Identidade visual é o sistema que mantém tudo igual.

Salve para o dia de contratar a sua marca.`,
    hashtags: '#logotipo #logomarca #identidadevisual #branding',
    teste: 'Horário da manhã. E compare a retenção com o P04 (mesma ideia em carrossel).',
    instrucoes: ['Vídeo produzido depois do plano.', 'Postar às 8h.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S26', dia: 26, hora: '17:30', formato: 'stories', pilar: 'marca', tema: 'Prova e convite',
    titulo: 'Gestão de redes: o seu feed com o mesmo rigor',
    alavanca: 'Prova (este perfil)', metrica: 'Conversas no direct', cta: 'REDES no direct',
    ficha: { nicho: 'Gestão de redes sociais (serviço novo)', publico: 'Seguidores que acompanharam o mês', objetivo: 'Conversas', promessa: 'Mostrar que este perfil é a prova do serviço', tom: 'Direto' },
    ganchos: [
      ['Quebra de padrão', 'Este perfil é o nosso portfólio de gestão de redes.', 'A prova é o próprio feed que a pessoa acompanhou.'],
      ['Dor aguda', 'Sem tempo para cuidar do perfil da empresa?'],
      ['Ganho rápido', 'Seu feed planejado, produzido e medido.'],
    ],
    frames: [
      ['Gancho de contexto', 'Este perfil é o nosso portfólio de gestão de redes.', 'A grade do @tirvotech em miniatura.', '', 'Tudo com método.'],
      ['Fricção narrativa', 'Plano de 30 dias, um teste por semana, peças feitas com a mesma identidade.', 'Calendário e peças alinhadas.', '', 'E agora isso vale para a sua empresa.'],
      ['Valor ou paradoxo', 'A Tirvo agora cuida também das redes de outras empresas. [CONFIRMAR escopo]', 'Perfil genérico se organizando.', '', 'Quer saber como?'],
      ['Conversão com figurinha', 'Mande REDES no direct.', 'Área livre para a figurinha. Rodapé completo.', 'Palavra-chave REDES (ou figurinha de link)', ''],
    ],
    teste: 'Conversas com REDES.', instrucoes: ['Confirme o escopo do serviço antes de produzir.', 'Publique os 4 frames em sequência.'],
    obs: '[CONFIRMAR: escopo do serviço de gestão de redes.]',
    midia: { qtd: 4, aguardando: 'Escopo do serviço de gestão de redes' },
  });

  add({
    id: 'P28', dia: 27, hora: '10:00', formato: 'img', pilar: 'vitrine',
    titulo: 'O sistema da nossa marca, em uma tela',
    alavanca: 'Prova real (o próprio trabalho)', metrica: 'Visitas ao perfil', cta: 'Salvar como referência',
    ficha: {
      nicho: 'Identidade visual: a marca da própria Tirvo',
      publico: 'Empreendedor que quer ver um sistema de marca completo e real',
      objetivo: 'Visitas ao perfil',
      promessa: 'Ver as peças que uma identidade visual precisa ter, num caso real',
      tom: 'Visual, enxuto',
    },
    ganchos: [
      ['Quebra de padrão', 'O sistema da nossa marca, em uma tela.', 'Mostra trabalho real, sem conceito ilustrativo, e organiza tudo de uma vez.'],
      ['Dor aguda', 'A sua marca tem mais que um logo?'],
      ['Ganho rápido', 'As peças mínimas de uma identidade visual.'],
    ],
    arte: {
      texto: 'O sistema da nossa marca, em uma tela.\nCapa de link · ícone · paleta · tipografia',
      direcao: 'Quadro com peças reais da Tirvo: a capa de link oficial, o ícone (favicon) em 3 tamanhos, a paleta e as três fontes. Logo da Tirvo embaixo à direita.',
    },
    capa: 'A própria arte.',
    alt: 'Quadro da identidade visual da Tirvo: capa de link com a logo e o slogan, ícone em três tamanhos, paleta de preto, laranja, cinza e branco, e as fontes Geist, Instrument Serif e Geist Mono.',
    linhas: [
      'Uma marca não é um arquivo. É um sistema que se repete igual em todo lugar.',
      'Esta é a nossa: logo, ícone, paleta, fontes e slogan.',
    ],
    legenda: `Uma marca não é um arquivo. É um sistema que se repete igual em todo lugar.

Esta é a nossa:
· Logo e capa de link para quando alguém compartilha o site.
· Ícone que funciona até em 16 px, na aba do navegador.
· Paleta curta: preto, laranja, cinza e branco.
· Três fontes, cada uma com uma função.

É isso que entregamos num projeto de identidade visual, com o manual que explica como usar.

Salve como referência.`,
    hashtags: '#identidadevisual #branding #logotipo #designgrafico #tirvotech',
    teste: 'Visitas ao perfil, comparadas com P22.',
    instrucoes: ['Compartilhe no story de sábado.'],
    midia: { qtd: 1 },
  });

  add({
    id: 'C28', dia: 28, hora: '11:00', formato: 'caixinha', pilar: 'vitrine', tema: 'Presença leve',
    titulo: 'Caixinha: pergunte à engenharia', alavanca: 'Reciprocidade', metrica: 'Perguntas recebidas', cta: 'Mandar uma pergunta',
    ficha: { nicho: 'Relacionamento', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Responder dúvidas reais', tom: 'Próximo' },
    ganchos: [['Quebra de padrão', 'Quem responde aqui é quem constrói.', 'Mesma arte do dia 7.'], ['Dor aguda', 'A dúvida que ninguém respondeu.'], ['Ganho rápido', 'Pergunte. A engenharia responde.']],
    frames: [['Conversão com figurinha', 'Pergunte à engenharia.', 'Mesma arte do dia 7.', 'Caixinha de perguntas', '']],
    teste: 'Número de perguntas.', instrucoes: ['Reutilize a arte do dia 7.', 'Prepare o /analisar do mês.'],
    midia: { qtd: 1, compartilhada: 'C07' },
  });

  // Semana 5
  add({
    id: 'P29', dia: 29, hora: '12:15', formato: 'reels', pilar: 'autoridade',
    titulo: 'O vencedor do mês, com um gancho novo',
    alavanca: 'Definida pelo vencedor', metrica: 'A mesma do Reels original', cta: 'O mesmo do Reels original',
    ficha: {
      nicho: 'O tema do Reels com melhor retenção do mês (padrão: P11, site lento)',
      publico: 'O mesmo do Reels original',
      objetivo: 'Alcance de topo de funil (retenção)',
      promessa: 'A mesma do Reels original, com outra entrada',
      tom: 'O mesmo do Reels original',
    },
    ganchos: [
      ['Quebra de padrão', 'Abra o seu site no 4G. Agora.', 'Padrão caso o vencedor seja o P11. Troque de acordo com o /analisar do dia 28.'],
      ['Dor aguda', 'O cliente desistiu antes de ver o seu site.'],
      ['Ganho rápido', 'Um teste de 10 segundos no seu site.'],
    ],
    roteiro: {
      duracao: '20 s', palavras: 45, audio: 'Sem narração. A mesma faixa do original, para isolar o gancho.',
      linhas: [
        ['0–2 s', 'Novo gancho (definido no dia 28).', 'Novo primeiro frame.'],
        ['2–18 s', 'Corpo do Reels vencedor, sem mudanças.', 'Mesmas cenas do original.'],
        ['18–20 s', 'Mesmo CTA do original.', 'Cartão final com a logo.'],
      ],
    },
    capa: 'Nova capa com o gancho novo.',
    alt: 'Nova versão do Reels de melhor desempenho do mês, com um gancho diferente.',
    linhas: ['Definidas a partir do vencedor.', 'Definidas a partir do vencedor.'],
    legenda: `[Definir no dia 28: a legenda do Reels vencedor, com uma primeira linha nova.]`,
    hashtags: '[Mesmas do vencedor, com 1 ou 2 trocadas]',
    teste: 'Variável da semana: só o gancho muda. Compare a retenção nos 3 primeiros segundos com o original.',
    instrucoes: ['Escolha o vencedor no /analisar do dia 28.', 'Vídeo produzido depois.'],
    midia: { qtd: 2, video: true },
  });

  add({
    id: 'S29', dia: 29, hora: '17:30', formato: 'stories', pilar: 'vitrine', tema: 'Bastidor real',
    titulo: '4 testes em 30 dias',
    alavanca: 'Transparência', metrica: 'Respostas', cta: 'Votar na enquete',
    ficha: { nicho: 'Bastidores do perfil', publico: 'Seguidores do mês', objetivo: 'Respostas', promessa: 'Contar o que foi testado e o que vem agora', tom: 'Bastidores' },
    ganchos: [
      ['Quebra de padrão', '30 dias, 4 testes, nenhum chute.', 'Fecha o arco do mês com honestidade.'],
      ['Dor aguda', 'Postou um mês sem saber o que funcionou?'],
      ['Ganho rápido', 'O que testamos e o que vem agora.'],
    ],
    frames: [
      ['Gancho de contexto', '30 dias de perfil. 4 testes. Nenhum chute.', 'Calendário completo com marcas de feito.', '', 'Os testes foram estes.'],
      ['Fricção narrativa', 'Capa, gancho, chamada e horário. Um por semana.', 'Quatro linhas em Geist Mono.', '', 'O que ganhou?'],
      ['Valor ou paradoxo', 'O que funcionou melhor: [escreva no app com o resultado real].', 'Área para texto digitado no app, com a mira.', '', 'E agora você escolhe.'],
      ['Conversão com figurinha', 'O que você quer ver mais nos próximos 30 dias?', 'Área livre para a enquete. Rodapé completo.', 'Enquete: "Sites" / "Marca"', ''],
    ],
    teste: 'Respostas.', instrucoes: ['Escreva no frame 3, pelo app, o resultado real do /analisar.'],
    midia: { qtd: 4 },
  });

  add({
    id: 'P30', dia: 30, hora: '19:00', formato: 'carrossel', pilar: 'marca',
    titulo: 'O que vem num manual de marca de verdade',
    alavanca: 'Utilidade e especificidade', metrica: 'Salvamentos', cta: 'Salvar',
    ficha: {
      nicho: 'Manual de marca e identidade visual',
      publico: 'Empreendedor que recebeu "só o logo" e quer saber o que faltou',
      objetivo: 'Salvamentos',
      promessa: 'Os 6 capítulos que um manual de marca completo precisa ter',
      tom: 'Educativo prático',
    },
    ganchos: [
      ['Quebra de padrão', 'Recebeu só o arquivo do logo? Faltou o manual.'],
      ['Dor aguda', 'Sua marca sai diferente em cada fornecedor?'],
      ['Ganho rápido', 'Os 6 capítulos de um manual de marca de verdade.', 'Checklist concreto, fácil de salvar e de cobrar.'],
    ],
    slides: [
      ['Os 6 capítulos de um manual de marca de verdade.', 'Capa visual: manual aberto, páginas em leque.', 'Confira se o seu tem.'],
      ['01 · Conceito\nA ideia por trás da marca, em poucas linhas.', 'Página com um parágrafo e a mira.', 'Depois, o desenho.'],
      ['02 · Logotipo e versões\nPrincipal, horizontal, símbolo sozinho, positivo e negativo.', 'Grade com as versões.', 'E as regras de uso.'],
      ['03 · Respiro e tamanho mínimo\nA distância que a logo precisa e o menor tamanho em que ela funciona.', 'Diagrama de respiro medido pela mira.', 'Cor.'],
      ['04 · Paleta\nCores com códigos para tela e impressão.', 'Amostras com HEX, RGB e CMYK.', 'Letra.'],
      ['05 · Tipografia\nFontes, pesos e hierarquia de títulos e textos.', 'Escala tipográfica.', 'E o que não fazer.'],
      ['06 · Usos proibidos e aplicações\nO que nunca fazer com a marca, e exemplos reais de uso.', 'Cartão "sombra, efeito ou distorção" com um X e a logo correta ao lado.', 'Guarde a lista.'],
      ['Salve e confira o manual da sua marca.\nSe faltar capítulo, chame no direct com a palavra MARCA.', 'Slide final com o rodapé completo.', ''],
    ],
    capa: 'Slide 01.',
    alt: 'Carrossel com os 6 capítulos de um manual de marca: conceito, versões do logotipo, respiro, paleta, tipografia e usos proibidos.',
    linhas: [
      'O arquivo do logo é 10% da marca. O manual é o que faz os outros 90% saírem iguais.',
      'Sem manual, cada fornecedor inventa a sua marca de novo.',
    ],
    legenda: `Sem manual, cada fornecedor inventa a sua marca de novo.

Um manual de verdade tem 6 capítulos:

01 Conceito
02 Logotipo e versões
03 Respiro e tamanho mínimo
04 Paleta
05 Tipografia
06 Usos proibidos e aplicações

Salve e confira o da sua marca. Se faltar capítulo, chame no direct com a palavra MARCA.`,
    hashtags: '#manualdemarca #identidadevisual #branding #designdemarca #tirvotech',
    teste: 'Salvamentos, comparados com a mediana dos carrosséis do mês.',
    instrucoes: ['Publique as 8 imagens na ordem.', 'Retrospectiva do dia 30.'],
    midia: { qtd: 8 },
  });

  add({
    id: 'S30', dia: 30, hora: '12:30', formato: 'stories', pilar: 'marca', tema: 'Mito × verdade',
    titulo: 'Logo pronto em 1 dia é economia?',
    alavanca: 'Quebra de crença', metrica: 'Respostas no quiz', cta: 'Responder o quiz',
    ficha: { nicho: 'Identidade visual', publico: 'Seguidores', objetivo: 'Respostas', promessa: 'Mostrar o custo escondido de uma marca sem conceito', tom: 'Direto' },
    ganchos: [
      ['Quebra de padrão', 'Mito: logo rápido é logo barato.', 'Conversa com o carrossel do dia (manual de marca).'],
      ['Dor aguda', 'Refez o logo duas vezes em três anos?'],
      ['Ganho rápido', 'O que perguntar antes de fechar um logo.'],
    ],
    frames: [
      ['Gancho de contexto', 'Mito: logo feito em 1 dia é economia.', 'Carimbo "mito" sobre um relógio de 24 h.', '', 'A conta aparece depois.'],
      ['Fricção narrativa', 'Sem conceito e sem manual, cada peça nova vira retrabalho.', 'Pilha de versões do mesmo logo.', '', 'A verdade.'],
      ['Valor ou paradoxo', 'Verdade: marca com conceito e manual é feita uma vez e aplicada sempre igual.', 'Uma versão, aplicada em várias peças.', '', 'Teste-se.'],
      ['Conversão com figurinha', 'Sua marca tem manual?', 'Área livre para o quiz. Rodapé completo.', 'Quiz: "Tem" / "Não tem" / "O que é isso?"', ''],
    ],
    teste: 'Respostas.', instrucoes: ['Publique os 4 frames em sequência.'],
    midia: { qtd: 4 },
  });

  Object.assign(PLANO.dias, {
    22: { tarefas: ['Teste de horário: o Reels sai às 8h em ponto.', 'Sementeira de 15 min.'] },
    23: { tarefas: ['O carrossel sai às 8h.', 'Compartilhe o P24 no story.'] },
    24: { tarefas: ['O Reels sai às 19h30.'] },
    25: { tarefas: ['O carrossel sai às 19h30.', 'Compartilhe o P26 no story.'] },
    26: { tarefas: ['O Reels sai às 8h.'] },
    27: { tarefas: ['Compartilhe o P28 no story.'] },
    28: { tarefas: ['/analisar do mês: escolha o Reels vencedor para o dia 29.'] },
    29: { tarefas: ['Sementeira de 15 min.'] },
    30: { tarefas: ['Retrospectiva do dia 30.', 'Defina os dias 31 a 60.'] },
  });
})();
