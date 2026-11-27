// Service worker do app Ribeirão Informa.
// Notícias (data/noticias.json) e páginas: sempre tenta a rede primeiro (nunca prende versão velha);
// sem sinal, usa a última cópia salva. Imagens e arquivos fixos: cópia salva primeiro, para abrir rápido.
// avisos no celular (OneSignal): o mesmo service worker recebe as notificações.
// Se estiver sem internet na instalação, o app segue funcionando, só sem avisos.
try {
  importScripts("assets/onesignal/OneSignalSDK.sw.js");
} catch (e) {}
const VERSAO = "ri-v19";
const BASICOS = [
  "./",
  "index.html",
  "noticia.html",
  "agenda.html",
  "sobre.html",
  "assets/style.css",
  "assets/app.js",
  "assets/v2.css",
  "assets/v2.js",
  "manifest.webmanifest",
  "icones/icone-192-b.png",
  "icones/icone-512-b.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(VERSAO)
      .then((c) => c.addAll(BASICOS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(
          ks
            .filter((k) => k !== VERSAO && k !== "ri-img")
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function redePrimeiro(req) {
  const cache = await caches.open(VERSAO);
  const chave = req.url.split("?")[0].endsWith(".json")
    ? req.url.split("?")[0]
    : req;
  try {
    const r = await fetch(req, { cache: "no-store" });
    if (r.ok) cache.put(chave, r.clone());
    return r;
  } catch {
    return (
      (await cache.match(chave, { ignoreSearch: true })) ||
      (await cache.match("index.html")) ||
      Response.error()
    );
  }
}

async function guardadoPrimeiro(req, nome) {
  const cache = await caches.open(nome);
  const salvo = await cache.match(req);
  const busca = fetch(req)
    .then((r) => {
      if (r.ok || r.type === "opaque") cache.put(req, r.clone());
      return r;
    })
    .catch(() => salvo);
  return salvo || busca;
}

async function limitarImagens() {
  const cache = await caches.open("ri-img");
  const ks = await cache.keys();
  for (let i = 0; i < ks.length - 120; i++) await cache.delete(ks[i]);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const mesmo = url.origin === location.origin;
  if (
    req.mode === "navigate" ||
    (mesmo &&
      (url.pathname.endsWith(".json") ||
        url.pathname.endsWith(".html") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith(".css")))
  ) {
    e.respondWith(redePrimeiro(req));
  } else if (req.destination === "image") {
    e.respondWith(guardadoPrimeiro(req, "ri-img"));
    e.waitUntil(limitarImagens());
  } else if (
    url.hostname.endsWith("gstatic.com") ||
    url.hostname.endsWith("googleapis.com")
  ) {
    e.respondWith(guardadoPrimeiro(req, VERSAO));
  }
  // o resto (ex.: previsão do tempo) vai direto para a rede
});
