# Site do Ribeirão Informa

Site estático, grátis no GitHub Pages: https://ribeiraoinforma.github.io
As notícias ficam em `data/noticias.json` e as artes em `midia/AAAA-MM-DD/`.
Capa, seções, agenda e página de cada matéria são montadas sozinhas a partir desse arquivo.

## Seções e editorias
| Seção do site | Editorias que caem nela |
|---|---|
| Cidade | CIDADE, TRÂNSITO, TEMPO, SEGURANÇA, POLÍTICA, EDUCAÇÃO (e qualquer editoria desconhecida) |
| Serviço | SERVIÇO, CONCURSOS, EMPREGO, UTILIDADE |
| Esporte | ESPORTE, FUTEBOL |
| Lazer | LAZER, GASTRONOMIA, PASSEIO, EVENTO |
| Cultura | CULTURA, SHOW, TEATRO, MÚSICA, CINEMA |
| Bem-estar | BEM-ESTAR, SAÚDE, VIDA |
| Economia | ECONOMIA, NEGÓCIOS |

## Rotina (cada notícia principal do feed)
Da raiz do site:

    python3 scripts/adicionar_noticia.py <legenda.txt> <card.png> --editoria ESPORTE

Opções:
- `--destaque` vira a manchete da capa no dia.
- `--link URL` link da matéria original.
- `--evento-data AAAA-MM-DD` (+ `--evento-fim`, `--evento-hora "20h"`, `--evento-local "Theatro Pedro II"`): entra na Agenda até a data passar. Usar só com data, hora e local confirmados na fonte.
- O card é opcional: sem card a notícia aparece com um quadro azul com o título.

Depois, commit com autor anônimo e push:

    git -c user.name="Ribeirão Informa" -c user.email="noreply@ribeiraoinforma.invalid" commit -am "Notícias de <data>"
    git push

O site atualiza em 1 a 2 minutos. As artes ficam públicas em
https://ribeiraoinforma.github.io/midia/<data>/<arquivo>.jpg (servem de link para o Metricool).

## Redes
Links das redes ficam no topo de `assets/app.js` (objeto REDES). Link vazio = ícone escondido.
O "Tempo agora" vem do Open-Meteo (grátis, sem chave), direto no navegador de quem visita.
