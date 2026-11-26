# Site do Ribeirão Informa

Site estático (grátis no GitHub Pages). As notícias ficam em `data/noticias.json`
e as artes em `midia/AAAA-MM-DD/`. A capa e a página de cada matéria são montadas
sozinhas a partir desse arquivo.

## Rotina diária (radar)
Para cada post do dia, da raiz do site:

    python3 scripts/adicionar_noticia.py fila/<data>/1-x.txt fila/<data>/1-x.png --editoria CULTURA --data <data> [--link URL]

Depois: `git add -A && git commit -m "Notícias de <data>" && git push`.
O site atualiza em 1 a 2 minutos. Os JPG em `midia/` também servem de link público
das artes para o Metricool (https://ribeiraoinforma.github.io/midia/...).

## Redes
Links das redes ficam no topo de `assets/app.js` (objeto REDES). Link vazio = ícone escondido.
