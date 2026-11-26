#!/usr/bin/env python3
"""Adiciona uma notícia do radar ao site do Ribeirão Informa.

Uso (rodar da raiz do site):
  python3 scripts/adicionar_noticia.py <legenda.txt> [card.png] --editoria ESPORTE
      [--data 2026-11-26] [--link URL_DA_MATERIA] [--destaque]
      [--evento-data 2026-12-04 [--evento-fim 2026-12-05] [--evento-hora "20h"] [--evento-local "Theatro Pedro II"]]
      [--foto foto.jpg|https://... --credito-foto "Unsplash/Fulano"]

Editorias e a seção do site onde cada uma aparece:
  Cidade ....... CIDADE, TRÂNSITO, TEMPO, SEGURANÇA, POLÍTICA, EDUCAÇÃO
  Serviço ...... SERVIÇO, CONCURSOS, EMPREGO, UTILIDADE
  Esporte ...... ESPORTE, FUTEBOL
  Lazer ........ LAZER, GASTRONOMIA, PASSEIO, EVENTO
  Cultura ...... CULTURA, SHOW, TEATRO, MÚSICA, CINEMA
  Bem-estar .... BEM-ESTAR, SAÚDE, VIDA
  Economia ..... ECONOMIA, NEGÓCIOS
  Estado ....... ESTADO, SÃO PAULO, GOVERNO SP      (governo e notícias do estado de SP)
  Brasil ....... BRASIL, GOVERNO FEDERAL, NACIONAL  (governo federal, decisões de Brasília)
  Futebol ...... FUTEBOL-BRASIL, BRASILEIRÃO, SELEÇÃO (times grandes do país; Botafogo-SP
                 e Comercial continuam em ESPORTE/FUTEBOL, que é o esporte local)
  (qualquer outra editoria cai em Cidade)
  Estado, Brasil e Futebol nunca viram a manchete do site: têm bloco próprio na capa.

Lê a legenda no formato do manual de redação (1ª linha = manchete,
parágrafos, "📰 Fonte: <veículo>"). Se houver card, converte para JPG leve em
midia/<data>/. Grava a notícia em data/noticias.json (mais nova primeiro).
Com --evento-data a notícia entra também na Agenda até a data do evento passar.
Se a notícia (mesmo id) já existir, ela é atualizada.
"""

import argparse, json, re, sys, unicodedata
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
EMOJI = re.compile("[\U0001f000-\U0001faff☀-➿️‍]+")
LIMITE = 500  # notícias guardadas no site (as mais antigas saem)


def hoje_sp():
    return datetime.now(ZoneInfo("America/Sao_Paulo")).date().isoformat()


def slug(txt):
    t = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode()
    t = re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()
    return t[:60].rstrip("-")


def ler_legenda(caminho):
    linhas = Path(caminho).read_text(encoding="utf-8").strip().splitlines()
    titulo = EMOJI.sub("", linhas[0]).strip()
    corpo, fonte = [], ""
    for ln in linhas[1:]:
        if "Fonte:" in ln:
            fonte = ln.split("Fonte:", 1)[1].strip()
            break
        corpo.append(ln.rstrip())
    paragrafos = [p.strip() for p in "\n".join(corpo).split("\n\n") if p.strip()]
    return titulo, paragrafos, fonte


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("legenda")
    ap.add_argument("card", nargs="?", help="PNG/JPG do card (opcional)")
    ap.add_argument("--editoria", required=True)
    ap.add_argument("--data", default=hoje_sp())
    ap.add_argument("--link", default="", help="URL da matéria original (opcional)")
    ap.add_argument(
        "--destaque", action="store_true", help="manchete principal da capa no dia"
    )
    ap.add_argument("--evento-data", help="AAAA-MM-DD: entra na Agenda")
    ap.add_argument("--evento-fim", help="AAAA-MM-DD, se durar mais de um dia")
    ap.add_argument("--evento-hora", default="")
    ap.add_argument("--evento-local", default="")
    ap.add_argument(
        "--foto", help="foto de uso livre (horizontal) para capa e lista do site"
    )
    ap.add_argument(
        "--credito-foto",
        default="",
        help='ex.: "Unsplash/Fulano" ou "Prefeitura de RP (divulgação)"',
    )
    a = ap.parse_args()
    for nome in ("data", "evento_data", "evento_fim"):
        v = getattr(a, nome)
        if v is not None and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", v):
            sys.exit(f"--{nome.replace('_', '-')} deve ser AAAA-MM-DD (recebi {v!r}).")
    if a.link and not re.match(r"https?://", a.link):
        sys.exit("--link deve começar com http:// ou https://")

    titulo, paragrafos, fonte = ler_legenda(a.legenda)
    if not fonte:
        sys.exit("Legenda sem 'Fonte:'. Regra do jornal: não publica sem fonte.")

    nid = f"{a.data}-{slug(titulo)}"
    noticia = {
        "id": nid,
        "data": a.data,
        "editoria": a.editoria.strip().upper(),
        "titulo": titulo,
        "resumo": paragrafos[0] if paragrafos else "",
        "texto": paragrafos,
        "fonte": fonte,
        "link": a.link,
        "imagem": "",
    }
    if a.card:
        (RAIZ / "midia" / a.data).mkdir(parents=True, exist_ok=True)
        img_rel = f"midia/{a.data}/{slug(titulo)}.jpg"
        im = Image.open(a.card).convert("RGB")
        im.thumbnail((1080, 1350))
        im.save(RAIZ / img_rel, "JPEG", quality=82, optimize=True, progressive=True)
        noticia["imagem"] = img_rel
    if a.foto:
        if not a.credito_foto:
            sys.exit(
                "Foto sem crédito. Use --credito-foto (só fotos de uso livre ou enviadas pela rotina)."
            )
        if a.foto.startswith("https://"):
            # foto de uso livre hospedada fora (ex.: Wikimedia Commons): usa a URL direto
            noticia["foto"] = a.foto
        else:
            (RAIZ / "midia" / a.data).mkdir(parents=True, exist_ok=True)
            foto_rel = f"midia/{a.data}/{slug(titulo)}-foto.jpg"
            im = Image.open(a.foto).convert("RGB")
            im.thumbnail((1200, 1200))
            im.save(
                RAIZ / foto_rel, "JPEG", quality=78, optimize=True, progressive=True
            )
            noticia["foto"] = foto_rel
        noticia["credito_foto"] = a.credito_foto
    if a.destaque:
        noticia["destaque"] = True
    if a.evento_data:
        ev = {"data": a.evento_data}
        if a.evento_fim:
            ev["fim"] = a.evento_fim
        if a.evento_hora:
            ev["hora"] = a.evento_hora
        if a.evento_local:
            ev["local"] = a.evento_local
        noticia["evento"] = ev

    arq = RAIZ / "data" / "noticias.json"
    base = (
        json.loads(arq.read_text(encoding="utf-8"))
        if arq.exists()
        else {"noticias": []}
    )
    base["noticias"] = [n for n in base["noticias"] if n["id"] != nid]
    base["noticias"].insert(0, noticia)
    base["noticias"].sort(key=lambda n: n["data"], reverse=True)
    base["noticias"] = base["noticias"][:LIMITE]
    arq.write_text(
        json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"ok: {nid}")


if __name__ == "__main__":
    main()
