# Instagram da Tirvo

Integração com a API oficial do Instagram (login do Instagram, `graph.instagram.com`) para a conta @tirvotech. A ferramenta faz o seguinte:

- renderiza as peças em HTML;
- guarda cada peça como rascunho;
- publica posts, carrosséis, Reels e stories só depois da aprovação;
- responde comentários, também com aprovação;
- puxa as métricas.

Esta pasta não aparece em tirvo.tech. Ela está no `exclude` do `_config.yml`.

## Requisitos

- As variáveis de ambiente `IG_ACCESS_TOKEN` e `IG_USER_ID`. Nunca as escreva em arquivos, commits ou mensagens.
- Acesso de rede a `graph.instagram.com`.
- Node 22 com o Playwright e o Chromium do ambiente.
- Um ffmpeg com libx264. Se não houver um no PATH, instale com `pip install imageio-ffmpeg`, que já traz o binário.

Todos os comandos rodam a partir da raiz do repositório:

```sh
node instagram/ig.mjs --ajuda
```

## Fluxo de publicação

1. **Criar a peça.** Monte a arte em HTML a partir de `modelos/base.css` e renderize.

   ```sh
   node instagram/ig.mjs render instagram/modelos/exemplo-post.html --saida instagram/saida/post.jpg
   node instagram/ig.mjs render instagram/modelos/exemplo-reels.html --saida instagram/saida/reels.mp4
   node instagram/ig.mjs render instagram/modelos/exemplo-reels.html --saida instagram/saida/capa.jpg --tempo 5000
   ```

2. **Criar o rascunho.** O comando converte a mídia para o formato que a API aceita e confere a legenda contra o guia da marca. Ele barra exclamação, clichês, preços, português de Portugal, mais de um emoji e hashtags fora da faixa de 3 a 5.

   ```sh
   node instagram/ig.mjs rascunho criar --tipo post --midia instagram/saida/post.jpg --legenda-arquivo legenda.txt
   node instagram/ig.mjs rascunho criar --tipo carrossel --midia 01.jpg --midia 02.jpg --midia 03.jpg --legenda-arquivo legenda.txt
   node instagram/ig.mjs rascunho criar --tipo reels --midia reels.mp4 --capa capa.jpg --legenda-arquivo legenda.txt
   node instagram/ig.mjs rascunho criar --tipo story --midia story.jpg
   ```

3. **Mostrar e aprovar.** Mostre a peça e a legenda. Rode `aprovar` só depois de um sim explícito. A aprovação guarda um hash da mídia, da legenda e das opções. Se qualquer coisa mudar depois, a publicação é recusada até uma nova aprovação.

   ```sh
   node instagram/ig.mjs rascunho ver <id>
   node instagram/ig.mjs aprovar <id>
   ```

4. **Publicar.**

   ```sh
   node instagram/ig.mjs publicar <id>
   ```

   A API só aceita mídia por URL pública. Por isso, ao publicar, os arquivos aprovados vão para `instagram/midia/<id>/` em um commit enviado ao ramo atual. O Instagram busca esses arquivos no `raw.githubusercontent.com`, pelo hash desse commit. A mídia só fica pública nesse momento, junto com a publicação. Isso exige que o repositório continue público.

## Comentários

```sh
node instagram/ig.mjs comentarios --sem-resposta
node instagram/ig.mjs rascunho resposta --comentario <id> --texto "..."
node instagram/ig.mjs aprovar <id-do-rascunho>
node instagram/ig.mjs publicar <id-do-rascunho>
```

As respostas passam pelo mesmo fluxo de aprovação. Dúvidas sobre orçamento vão para o WhatsApp +55 (41) 99193-3850 ou para o link na bio.

## Métricas

```sh
node instagram/ig.mjs conta
node instagram/ig.mjs metricas conta --dias 30
node instagram/ig.mjs metricas recentes --limite 10
node instagram/ig.mjs metricas midia <id>
```

Se a API recusar uma métrica, por exemplo por falta de seguidores ou de publicações, o comando mostra as outras e lista as indisponíveis.

## Token

`node instagram/ig.mjs token` confere se o token do ambiente funciona.

O token de longa duração vale 60 dias. A API permite renová-lo, mas cada renovação devolve um token diferente, e só quem administra o ambiente consegue gravá-lo na variável `IG_ACCESS_TOKEN`. Por isso a ferramenta não renova sozinha. Antes de o prazo acabar, gere um token novo no painel do app na Meta e troque a variável nas configurações do ambiente.

## Modelos

- `modelos/base.css`: cores, fontes, margem de 96 px, fundo com brilho e grade, rodapé com o logotipo, cursor e slogan.
- `modelos/fontes/`: Geist, Geist Mono e Instrument Serif itálico, servidas localmente porque o Chromium do ambiente não carrega o Google Fonts.
- `modelos/exemplo-post.html`: post estático em 4:5.
- `modelos/exemplo-reels.html`: Reels de 8 s. A mira se fecha, o ponto acende, o texto se decodifica e o cursor pisca.

Para animar, use animações CSS. Para efeitos em JavaScript, exponha `window.tirvoQuadro(ms)`. O renderizador controla o tempo quadro a quadro, então o vídeo sai sempre igual.

## Limites da API

- 100 publicações por 24 horas. Um carrossel conta como uma.
- Imagens em JPEG, de 4:5 a 1,91:1 no feed. A ferramenta converte PNG e WebP.
- Carrossel de 2 a 10 itens.
- Story não aceita legenda pela API. O texto vai na própria arte.
- Reels entre 3 s e 15 min pela API. O guia da marca pede de 7 a 30 s, e a ferramenta segue o guia.
