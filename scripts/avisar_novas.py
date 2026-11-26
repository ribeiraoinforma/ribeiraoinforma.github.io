"""Roda no GitHub Actions a cada push que muda data/noticias.json.

Compara com a versão anterior e manda aviso no celular (scripts/notificar.py) para cada
notícia NOVA que tenha "notificar": true ou editoria URGENTE. No máximo 3 avisos por push,
para não incomodar o leitor.
"""

import json, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def ids_antes():
    try:
        txt = subprocess.run(
            ["git", "show", "HEAD~1:data/noticias.json"],
            cwd=RAIZ,
            capture_output=True,
            text=True,
            check=True,
        ).stdout
        return {n["id"] for n in json.loads(txt).get("noticias", [])}
    except Exception:
        return None  # sem versão anterior: não avisa nada, por segurança


def main():
    antes = ids_antes()
    if antes is None:
        print("sem versão anterior para comparar; nenhum aviso.")
        return
    agora = json.loads((RAIZ / "data" / "noticias.json").read_text(encoding="utf-8"))
    novas = [
        n
        for n in agora.get("noticias", [])
        if n["id"] not in antes
        and (n.get("notificar") or (n.get("editoria", "").strip().upper() == "URGENTE"))
    ]
    if not novas:
        print("nenhuma notícia nova para avisar.")
        return
    for n in novas[:3]:
        subprocess.run(
            [sys.executable, str(RAIZ / "scripts" / "notificar.py"), "--id", n["id"]]
        )


if __name__ == "__main__":
    main()
