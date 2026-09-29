# Tirvo: guia da marca para o Claude

Este repositório é o site da Tirvo (tirvo.tech), uma agência de Curitiba que atende todo o Brasil com criação de sites, sistemas e automações, logotipo e identidade visual, design gráfico e engenharia de IA.

Leia este guia antes de criar qualquer conteúdo da marca, como posts, carrosséis, stories, Reels, legendas e respostas a comentários. Tudo precisa ter a mesma cara do site.

## Referências no próprio repositório

- `assets/site.css`: cores, fontes e estilos. É a fonte oficial das variáveis visuais.
- `marca.html`: a história e o significado de cada elemento da logo.
- `marca/tirvo-logo.svg` e `marca/tirvo-logo.png`: o logotipo oficial. Use sempre esses arquivos, nunca redesenhe.
- `marca/tirvo-capa-de-link.png`: exemplo de composição pronta.
- `vitrine-*.webp` e `nexus-*.webp`: referências de estilo dos trabalhos.
- `index.html` e as pastas `servicos/`, `metodo/`, `equipe/` e `faq/`: tom de voz e conteúdo dos serviços.

## Cores

| Uso | Cor |
|---|---|
| Fundo principal | `#09090b` |
| Fundo elevado | `#0f0f12` e `#16161a` |
| Preto total | `#000000` |
| Destaque (laranja Tirvo) | `#ff5500` |
| Destaque quente, em gradientes | `#ff3300` |
| Brilho do laranja | `rgba(255, 85, 0, .45)` |
| Texto principal | `#fafafa` |
| Texto secundário | `#a1a1aa` |
| Texto terciário | `#8a8a93` |
| Linhas e bordas | `rgba(255, 255, 255, .06)` a `.18` |

Regras de cor:

- O fundo é sempre escuro. Não existe versão clara da marca nas redes.
- O laranja é tempero, não fundo. Use em um detalhe por peça, como o ponto da mira, uma palavra-chave ou uma linha.
- Os brilhos são radiais, suaves e em laranja sobre o fundo escuro, como no topo de `marca.html`.
- Uma grade fina de linhas brancas bem transparentes (`rgba(255,255,255,.04)`) pode aparecer ao fundo, sumindo nas bordas.

## Tipografia

- **Geist**: títulos e textos. Peso firme nos títulos e espaçamento entre letras levemente negativo.
- **Instrument Serif**, em itálico: uma ou duas palavras de ênfase dentro de um título, nunca um parágrafo inteiro.
- **Geist Mono**: rótulos, numeração (01, 02, 03), dados, trechos de terminal e o cursor.

Não use outras fontes. As três estão no Google Fonts.

## Logotipo e elementos

- **A mira**: quatro cantos, quatro marcas de medida e o ponto laranja no centro. Significa hiperfoco.
- **O cursor**: o traço laranja piscando depois de `tirvo_`. Lembra o terminal e mostra que a Tirvo segue rodando depois da entrega.
- **A decodificação**: símbolos de código (`0 1 < > / { } # $ % & * + = ?`) se embaralham até formar o texto. Serve bem para Reels e stories animados.
- **O slogan**: "Se algo pode ser melhorado, ainda não está pronto." A primeira parte fica em cinza (`#a1a1aa`) e a segunda em branco (`#fafafa`).

Regras do logotipo:

- Não distorça, não gire, não troque as cores e não aplique sombras nem efeitos.
- Deixe uma área de respiro ao redor equivalente, no mínimo, à altura da mira.
- Nas peças, o logotipo fica pequeno em um canto, de preferência embaixo à esquerda ou à direita, sempre no mesmo lugar dentro de uma série.

## Formatos do Instagram

| Formato | Tamanho | Observações |
|---|---|---|
| Post e carrossel | 1080 x 1350 (4:5) | Margem de 96 px. Carrossel com numeração em Geist Mono (01/05). |
| Post quadrado | 1080 x 1080 | Só quando o conteúdo pedir. |
| Story | 1080 x 1920 | Deixe livres cerca de 250 px no topo e embaixo por causa da interface do app. |
| Reels | 1080 x 1920, MP4 | Capa em 1080 x 1920 com a área central de 1080 x 1350 legível no feed. Entre 7 e 30 s. |

Como produzir:

- Monte as artes em HTML e CSS usando as mesmas variáveis de `assets/site.css`. Depois renderize em PNG, ou em MP4 no caso de animação, com o Chromium do Playwright já instalado no ambiente.
- Guarde os modelos reutilizáveis em uma pasta fora do site público, para que não sejam publicados em tirvo.tech.
- A composição deve ter muito espaço vazio, um título curto, no máximo um destaque em laranja e o logotipo pequeno.
- Animações devem ser curtas e precisas, com a mira se fechando, o ponto acendendo, o texto se decodificando e o cursor piscando. Nada de efeitos exagerados.

## Tom de voz

- Português do Brasil, direto, técnico e próximo. Escreva como uma equipe de engenheiros que explica com clareza.
- Frases curtas. Mostre o que foi feito e o porquê.
- Pontos centrais da marca: hiperfoco, precisão, código de verdade, IA trabalhando junto, acompanhamento depois da entrega.
- Nas legendas, no máximo um emoji, e só quando ajudar. Use de 3 a 5 hashtags relevantes no fim.
- Nas respostas a comentários, seja cordial e objetivo. Dúvidas sobre orçamento vão para o WhatsApp +55 (41) 99193-3850 ou para o link na bio.

## Proibido

- Pontos de exclamação.
- Clichês e frases prontas, como "transforme seu negócio", "leve sua empresa ao próximo nível" ou "soluções inovadoras".
- Português de Portugal.
- Preços ou valores.
- Fontes, cores ou versões do logotipo fora deste guia.
- Imagens de banco genéricas e fotos que não sejam da Tirvo.
- Prometer prazos ou resultados que não foram combinados.

## Publicação

- Nunca publique, responda ou apague nada no Instagram sem antes mostrar a peça e a legenda e receber aprovação explícita.
- Os dados de acesso ficam nas variáveis de ambiente `IG_ACCESS_TOKEN` e `IG_USER_ID`. Nunca escreva essas chaves em arquivos, commits ou mensagens.
