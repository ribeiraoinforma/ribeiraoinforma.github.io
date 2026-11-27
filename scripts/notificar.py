"""Manda notificação no celular de quem ativou os avisos do Ribeirão Informa (OneSignal, grátis).

Uso, DEPOIS do git push (para o link já estar no ar):
    python3 scripts/notificar.py --id 2026-11-26-titulo-da-noticia
    python3 scripts/notificar.py --ultima            # a notícia mais recente
    python3 scripts/notificar.py --titulo "URGENTE: ..." --texto "..." --url https://ribeiraoinforma.github.io/

Precisa de duas variáveis de ambiente (NUNCA colocar no repositório, ele é público):
    ONESIGNAL_APP_ID       (ID do app no OneSignal)
    ONESIGNAL_API_KEY      (REST API Key do OneSignal)
Sem elas, o script só avisa e sai sem erro, para não travar a rotina.
"""

import argparse, json, os, sys, urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = "https://ribeiraoinforma.github.io/"


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--id", help="id da notícia em data/noticias.json")
    g.add_argument(
        "--ultima", action="store_true", help="notifica a notícia mais recente"
    )
    g.add_argument("--titulo", help="aviso avulso (use com --texto)")
    ap.add_argument("--texto", default="")
    ap.add_argument("--url", default=SITE)
    a = ap.parse_args()

    app_id = os.environ.get("ONESIGNAL_APP_ID", "").strip()
    chave = os.environ.get("ONESIGNAL_API_KEY", "").strip()
    if not app_id or not chave:
        print(
            "aviso: ONESIGNAL_APP_ID/ONESIGNAL_API_KEY não configurados; notificação não enviada."
        )
        return

    if a.titulo:
        titulo, texto, url = a.titulo, a.texto or "Toque para ler.", a.url
    else:
        base = json.loads((RAIZ / "data" / "noticias.json").read_text(encoding="utf-8"))
        ns = base.get("noticias", [])
        n = ns[0] if a.ultima and ns else next((x for x in ns if x["id"] == a.id), None)
        if not n:
            sys.exit(f"notícia não encontrada: {a.id}")
        ed = n.get("editoria", "").strip()
        titulo = ("🚨 " if ed == "URGENTE" else "") + n["titulo"]
        texto = n.get("resumo") or "Toque para ler no Ribeirão Informa."
        url = f"{SITE}noticia.html?id={n['id']}"
    if not url.startswith(SITE):
        sys.exit("--url precisa ser do próprio site.")

    corpo = {
        "app_id": app_id,
        "target_channel": "push",
        "included_segments": ["Total Subscriptions"],
        "headings": {"pt": titulo[:90], "en": titulo[:90]},
        "contents": {"pt": texto[:180], "en": texto[:180]},
        "url": url,
        "chrome_web_icon": SITE + "icones/icone-192-a.png",
        "chrome_web_badge": SITE + "icones/selo-96-a.png",
    }
    req = urllib.request.Request(
        "https://api.onesignal.com/notifications",
        data=json.dumps(corpo).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Key {chave}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            print("notificação enviada:", r.status, r.read().decode()[:200])
    except Exception as e:  # não derruba a rotina
        print("aviso: falha ao notificar:", e)


if __name__ == "__main__":
    main()
