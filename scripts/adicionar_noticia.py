#!/usr/bin/env python3
"""Adiciona uma notícia do radar ao site do Ribeirão Informa.

Uso:
  python3 scripts/adicionar_noticia.py <legenda.txt> <card.png> --editoria CULTURA [--data 2026-11-26] [--link URL_DA_MATERIA]

Lê a legenda no formato do manual de redação (1ª linha = manchete,
parágrafos, "📰 Fonte: <veículo>"), converte o card para JPG leve em
midia/<data>/ e grava a notícia no topo de data/noticias.json.
Rodar da raiz do site. Se a notícia (mesmo id) já existir, ela é atualizada.
"""

import argparse, json, re, sys, unicodedata
from datetime import date
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
EMOJI = re.compile(r"[\U0001F000-\U0001FAFF☀-➿️‍]+")


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
    ap.add_argument("card")
    ap.add_argument("--editoria", required=True)
    ap.add_argument("--data", default=date.today().isoformat())
    ap.add_argument("--link", default="", help="URL da matéria original (opcional)")
    a = ap.parse_args()

    titulo, paragrafos, fonte = ler_legenda(a.legenda)
    if not fonte:
        sys.exit("Legenda sem 'Fonte:'. Regra do jornal: não publica sem fonte.")

    nid = f"{a.data}-{slug(titulo)}"
    pasta = RAIZ / "midia" / a.data
    pasta.mkdir(parents=True, exist_ok=True)
    img_rel = f"midia/{a.data}/{slug(titulo)}.jpg"
    im = Image.open(a.card).convert("RGB")
    im.thumbnail((1080, 1350))
    im.save(RAIZ / img_rel, "JPEG", quality=82, optimize=True, progressive=True)

    arq = RAIZ / "data" / "noticias.json"
    base = (
        json.loads(arq.read_text(encoding="utf-8"))
        if arq.exists()
        else {"noticias": []}
    )
    base["noticias"] = [n for n in base["noticias"] if n["id"] != nid]
    base["noticias"].insert(
        0,
        {
            "id": nid,
            "data": a.data,
            "editoria": a.editoria.upper(),
            "titulo": titulo,
            "resumo": paragrafos[0] if paragrafos else "",
            "texto": paragrafos,
            "fonte": fonte,
            "link": a.link,
            "imagem": img_rel,
        },
    )
    base["noticias"].sort(key=lambda n: n["data"], reverse=True)
    arq.write_text(
        json.dumps(base, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"ok: {nid}")


if __name__ == "__main__":
    main()
