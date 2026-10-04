# Animação 3D do Edifício Alameda

Fonte da animação da Ortival Engenharia (empresa fictícia), feita com Remotion e Three.js.
Não é publicada no site. Os vídeos prontos ficam em `projetos/ortival/assets/video/`.

## Arquivos

- `src/tl.ts`: duração, linha do tempo das etapas, geometria do prédio e cor do céu.
- `src/Scene.tsx`: cena 3D (terreno, fundação, estrutura, alvenaria, fachada, grua, entorno e câmera).
- `src/crane.ts`: ciclos de içamento da grua (dois por laje), cargas e balanço do gancho.
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

## Áudio

Trilha e efeitos gerados no ElevenLabs (Music v2.5 e Sound Effects v2), em `audio/`.

1. `npx esbuild audio/exp.ts --bundle --platform=node --external:three --outfile=audio/exp.js && node audio/exp.js > audio/crane.json` (movimento da grua quadro a quadro)
2. Converter os .mp3 para .wav 48 kHz estéreo e rodar `python3 mix.py` dentro de `audio/` (numpy e scipy)
3. Limitar e juntar ao vídeo: `ffmpeg -i mix.wav -af "volume=2.2dB,alimiter=limit=0.82:level=disabled" master.wav` e depois `ffmpeg -i video.mp4 -i master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest saida.mp4`
