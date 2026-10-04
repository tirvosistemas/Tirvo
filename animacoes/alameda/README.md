# Animação 3D do Edifício Alameda

Fonte da animação da Ortival Engenharia (empresa fictícia), feita com Remotion e Three.js.
Não é publicada no site. Os vídeos prontos ficam em `projetos/ortival/assets/video/`.

## Arquivos

- `src/tl.ts`: duração, linha do tempo das etapas, geometria do prédio e cor do céu.
- `src/Scene.tsx`: cena 3D (terreno, fundação, estrutura, alvenaria, fachada, grua, cremalheira, entorno e câmera).
- `src/crane.ts`: ciclos de içamento da grua, cargas e balanço do gancho.
- `src/tex.ts`: texturas procedurais e mapeamento triplanar.
- `src/Overlay.tsx`: textos e painel de etapas.
- `src/Root.tsx`: composições horizontal (1920x1080) e vertical (1080x1920).

## Como usar

```sh
npm install
npx remotion still src/index.ts Alameda previa.jpg --frame=400 --gl=swangle   # um quadro
./render.sh                                                                  # vídeos completos
```

Para ver um quadro de outro ângulo: `--props='{"cam":[x,y,z,alvoX,alvoY,alvoZ]}'`.
