// Ribeirão Informa: monta topo, capa, seções, agenda e matéria a partir de data/noticias.json
// Para ligar uma rede nova, basta preencher o link dela aqui (vazio = escondida).
const REDES = {
  whatsapp: "https://whatsapp.com/channel/0029VbE9Ox5KwqSR7FtcE341",
  instagram: "https://www.instagram.com/ribeiraoinforma/",
  facebook: "",
  tiktok: "",
  threads: "",
  kwai: "",
};
const SELO = "icones/selo-96.png";

// Seções do site, com a mesma cor das artes das redes.
// Cada notícia cai na seção que lista a editoria dela; editoria desconhecida cai em "Cidade".
const SECOES = [
  {
    slug: "cidade",
    nome: "Cidade",
    cor: "#0b2a5b",
    desc: "O dia a dia de Ribeirão: bairros, prefeitura, trânsito, tempo e segurança.",
    editorias: [
      "CIDADE",
      "TRÂNSITO",
      "TEMPO",
      "SEGURANÇA",
      "POLÍTICA",
      "EDUCAÇÃO",
      "URGENTE",
    ],
  },
  {
    slug: "servico",
    nome: "Serviço",
    cor: "#0f5e57",
    desc: "Prazos, vacinação, concursos, vagas e tudo o que é útil saber.",
    editorias: ["SERVIÇO", "CONCURSOS", "EMPREGO", "UTILIDADE"],
  },
  {
    slug: "esporte",
    nome: "Esporte",
    cor: "#14703a",
    desc: "Botafogo-SP, Comercial, corridas e o esporte da cidade.",
    editorias: ["ESPORTE", "FUTEBOL"],
  },
  {
    slug: "lazer",
    nome: "Lazer",
    cor: "#d9480f",
    desc: "Passeios, feiras, parques, gastronomia e o que fazer no fim de semana.",
    editorias: ["LAZER", "GASTRONOMIA", "PASSEIO", "EVENTO", "EVENTOS"],
  },
  {
    slug: "cultura",
    nome: "Cultura",
    cor: "#5f2b8f",
    desc: "Shows, teatro, cinema, exposições e a agenda cultural.",
    editorias: ["CULTURA", "SHOW", "TEATRO", "MÚSICA", "CINEMA"],
  },
  {
    slug: "bem-estar",
    nome: "Bem-estar",
    cor: "#0b7285",
    desc: "Saúde, qualidade de vida e cuidados para o dia a dia.",
    editorias: ["BEM-ESTAR", "SAÚDE", "VIDA"],
  },
  {
    slug: "economia",
    nome: "Economia",
    cor: "#212529",
    desc: "Empregos, empresas, preços e o bolso de quem vive em Ribeirão.",
    editorias: ["ECONOMIA", "NEGÓCIOS"],
  },
  // seções de fora da cidade: ganham bloco próprio na capa, nunca viram a manchete
  {
    slug: "estado",
    nome: "Estado",
    cor: "#1f4e9c",
    fora: true,
    desc: "Governo de São Paulo e o que muda no estado para quem mora em Ribeirão.",
    editorias: ["ESTADO", "SÃO PAULO", "GOVERNO SP"],
  },
  {
    slug: "brasil",
    nome: "Brasil",
    cor: "#8a5a00",
    fora: true,
    desc: "Governo federal e as decisões de Brasília que mexem com o seu dia a dia.",
    editorias: ["BRASIL", "GOVERNO FEDERAL", "NACIONAL"],
  },
  {
    slug: "futebol",
    nome: "Futebol",
    cor: "#c2255c",
    fora: true,
    desc: "Os grandes times do Brasil, Brasileirão, Copa do Brasil e Seleção.",
    editorias: ["FUTEBOL-BRASIL", "BRASILEIRÃO", "SELEÇÃO"],
  },
];
const URGENTE = "#b3122e";
const secaoDe = (n) =>
  SECOES.find((s) => s.editorias.includes((n.editoria || "").toUpperCase())) ||
  SECOES[0];
const corDe = (n) =>
  (n.editoria || "").toUpperCase() === "URGENTE" ? URGENTE : secaoDe(n).cor;

const TELEFONES = [
  ["190", "Polícia Militar"],
  ["192", "SAMU"],
  ["193", "Bombeiros"],
  ["199", "Defesa Civil"],
  ["181", "Disque Denúncia (SP)"],
];

const ZAP_ICONE =
  '<path d="M12 .5A11.4 11.4 0 002.2 17.7L.6 23.5l6-1.6A11.4 11.4 0 1012 .5zm0 20.8a9.4 9.4 0 01-4.8-1.3l-.3-.2-3.6.9 1-3.5-.2-.4A9.4 9.4 0 1112 21.3zm5.2-7c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a7.7 7.7 0 01-3.8-3.3c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 00-.8.4 3.4 3.4 0 00-1 2.5 5.9 5.9 0 001.2 3.1 13.4 13.4 0 005.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 002-1.4 2.5 2.5 0 00.2-1.4c-.1-.1-.3-.2-.6-.3z"/>';
const ICONES = {
  whatsapp: ZAP_ICONE,
  instagram:
    '<path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z"/>',
  facebook:
    '<path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0024 12z"/>',
  tiktok:
    '<path d="M19.6 6.7a4.8 4.8 0 01-3.8-4.2V2h-3.4v13.7a2.9 2.9 0 11-2-2.8V9.4a6.3 6.3 0 105.4 6.3V8.8a8.2 8.2 0 004.8 1.5V6.9l-1-.2z"/>',
  threads:
    '<text x="12" y="18" text-anchor="middle" font-size="18" font-weight="700" font-family="Arial">@</text>',
  kwai: '<text x="12" y="18" text-anchor="middle" font-size="17" font-weight="900" font-family="Arial">K</text>',
};

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) =>
  String(t ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];
const dataBR = (iso) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return "";
  const [a, m, d] = iso.split("-");
  return `${+d} ${MESES[+m - 1] || ""} ${a}`;
};
// só aceita links http(s); qualquer outra coisa vira texto
const urlSegura = (u) => (/^https?:\/\//i.test(String(u || "")) ? esc(u) : "");
const hojeISO = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
const params = new URLSearchParams(location.search);

function redesHTML() {
  return Object.entries(REDES)
    .filter(([, u]) => u)
    .map(
      ([r, u]) =>
        `<a href="${u}" target="_blank" rel="noopener" aria-label="${r}" title="${r}"><svg viewBox="0 0 24 24">${ICONES[r]}</svg></a>`,
    )
    .join("");
}

function montarTopo(ativa) {
  if (window.TOPO_V2 && document.body.dataset.pagina !== "capa") return window.TOPO_V2(ativa);
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  const link = (href, nome, slug, cor) =>
    `<a href="${href}" style="--cor:${cor || "#0b2a5b"}"${slug === ativa ? ' aria-current="page"' : ""}>${nome}</a>`;
  $("#topo").innerHTML = `
  <header class="topo"><div class="wrap">
    <a class="marca" href="./">
      <img class="selo" src="${SELO}" alt="" onerror="this.remove()">
      <div class="nome">RIBEIRÃO <span>INFORMA</span><small>NOTÍCIAS DE RIBEIRÃO PRETO</small></div>
    </a>
    <div class="topo-dir"><button class="btn-avisos" type="button" hidden aria-label="Ativar avisos no celular">🔔 <span>Ativar avisos</span></button><button class="btn-instalar" type="button" hidden>📲 Instalar o app</button><nav class="redes" aria-label="Redes sociais">${redesHTML()}</nav></div>
  </div></header>
  <nav class="secoes" aria-label="Seções"><div class="wrap">
    ${link("./", "Início", "inicio")}
    ${SECOES.map((s) => link(`./?secao=${s.slug}`, s.nome, s.slug, s.cor)).join("")}
    ${link("agenda.html", "Agenda", "agenda", "#d9480f")}
  </div></nav>
  <div class="hoje"><div class="wrap"><span>${hoje}</span><span><b>Notícia confirmada</b>, sempre com a fonte · <a href="sobre.html">Quem somos</a></span></div></div>`;
  $("#rodape").innerHTML = `
  <footer class="rodape"><div class="wrap">
    <div><b style="color:#fff">Ribeirão Informa</b> · Tudo o que acontece em Ribeirão Preto/SP<br>
    Cada notícia cita o veículo que publicou primeiro. Viu um erro? Fale com a gente no Instagram.</div>
    <nav class="mapa">${SECOES.map((s) => `<a href="./?secao=${s.slug}">${s.nome}</a>`).join("")}<a href="agenda.html">Agenda</a><a href="sobre.html">Quem somos</a>${REDES.whatsapp ? `<a href="${REDES.whatsapp}" target="_blank" rel="noopener">💬 Avisos no WhatsApp</a>` : ""}</nav>
    <nav class="redes">${redesHTML()}</nav>
  </div></footer>`;
}

async function carregar() {
  const r = await fetch(
    "data/noticias.json?v=" + Date.now().toString().slice(0, -5),
  );
  return (await r.json()).noticias || [];
}

// ---------- peças ----------
const linkMateria = (n) => `noticia.html?id=${encodeURIComponent(n.id)}`;
const tagHTML = (n) =>
  `<span class="tag" style="--cor:${corDe(n)}">${esc(n.editoria)}</span>`;
const metaHTML = (n, fonte) =>
  `<div class="meta">${dataBR(n.data)} · Fonte: <span class="fonte">${fonte || esc(n.fonte)}</span></div>`;

// Miniatura horizontal: foto se houver; senão um quadro na cor da seção.
// Foto padrão por seção (uso livre, com crédito) para quando a notícia não trouxer foto.
// Foto padrão por seção: só foto genérica, que não indique lugar ou fato específico. Vazio por enquanto.
const FOTO_PADRAO = {};
// Sempre que possível, uma foto: a da notícia, a padrão da seção ou o card da notícia.
const fotoDe = (n) =>
  n.foto || (FOTO_PADRAO[secaoDe(n).slug] || {}).url || n.imagem || "";
// largura: miniaturas do Wikimedia em tamanho menor para carregar rápido no celular
const fotoSrc = (u, largura) => {
  u = String(u || "");
  if (largura) u = u.replace(/\/(\d+)px-([^/]+)$/, `/${largura}px-$2`);
  return /^https?:\/\//i.test(u) || /^midia\//.test(u) ? esc(u) : "";
};
// Se a foto externa falhar: troca pelo card da notícia; sem card, some e fica o fundo na cor da seção.
const reserva = (n) =>
  `onerror="this.onerror=null;${n.imagem && /^midia\/[A-Za-z0-9._\/-]+$/.test(n.imagem) ? `this.src='${esc(n.imagem)}';this.parentNode.classList.add('de-card')` : "this.remove()"}"`;

function thumbHTML(n, lazy = true, largura = 500) {
  const f = fotoSrc(fotoDe(n), largura);
  if (f)
    return `<div class="thumb${!n.foto && f === esc(n.imagem) ? " de-card" : ""}" style="--cor:${corDe(n)}"><img src="${f}" alt="" ${lazy ? 'loading="lazy"' : ""} decoding="async" ${reserva(n)} width="1200" height="675"></div>`;
  const s = secaoDe(n);
  return `<div class="thumb bloco-cor" style="--cor:${corDe(n)}"><span>${(n.editoria || "").toUpperCase() === "URGENTE" ? "Urgente" : esc(s.nome)}</span></div>`;
}

function cardHTML(n) {
  return `<a class="card" href="${linkMateria(n)}">${thumbHTML(n)}
    <div class="corpo">${tagHTML(n)}<h3>${esc(n.titulo)}</h3>${metaHTML(n)}</div></a>`;
}

function itemHTML(n) {
  return `<a class="item" href="${linkMateria(n)}" style="--cor:${corDe(n)}">${thumbHTML(n, true, 330)}
    <div>${tagHTML(n)}<h3>${esc(n.titulo)}</h3>${metaHTML(n)}</div></a>`;
}

function destaqueHTML(n) {
  const fd = fotoSrc(n.foto || (FOTO_PADRAO[secaoDe(n).slug] || {}).url || "");
  if (fd) {
    return `<a class="destaque foto" href="${linkMateria(n)}" style="--cor:${corDe(n)}">
      <img src="${fd}" alt="" fetchpriority="high" onerror="this.onerror=null;this.parentNode.classList.add('falhou');this.remove()" width="1200" height="675">
      <div class="sobre">${tagHTML(n)}<h1>${esc(n.titulo)}</h1><p>${esc(n.resumo)}</p>${metaHTML(n)}</div></a>`;
  }
  const arte = n.imagem
    ? `<img src="${esc(n.imagem)}" alt="" width="1080" height="1350">`
    : `<div class="sem-img" style="--cor:${corDe(n)}">${tagHTML(n)}<b>${esc(n.titulo)}</b></div>`;
  return `<a class="destaque" href="${linkMateria(n)}" style="--cor:${corDe(n)}">${arte}
    <div>${tagHTML(n)}<h1>${esc(n.titulo)}</h1><p>${esc(n.resumo)}</p>${metaHTML(n)}</div></a>`;
}

function sigaHTML() {
  return `<section class="siga"><div><h2>Siga o <span>Ribeirão Informa</span></h2>
    <p>As notícias da cidade chegam primeiro nas redes, o dia todo.</p></div>
    <div class="siga-btns">${zapBotao()}<a class="btn" href="${REDES.instagram}" target="_blank" rel="noopener">Seguir no Instagram</a></div></section>`;
}

// Botão do canal do WhatsApp (avisos de notícia urgente)
const zapBotao = (txt = "Receber avisos no WhatsApp") =>
  REDES.whatsapp
    ? `<a class="btn whats zap" href="${REDES.whatsapp}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true">${ZAP_ICONE}</svg>${txt}</a>`
    : "";
function zapFaixa() {
  if (!REDES.whatsapp) return "";
  return `<a class="zap-faixa" href="${REDES.whatsapp}" target="_blank" rel="noopener">
    <svg viewBox="0 0 24 24" aria-hidden="true">${ZAP_ICONE}</svg>
    <span><b>Receba as notícias urgentes no WhatsApp</b><small>Entre no canal do Ribeirão Informa. É grátis e ninguém vê seu número.</small></span>
    <em>Entrar</em></a>`;
}

// ---------- agenda ----------
function eventos(lista, limite) {
  const hoje = hojeISO();
  return lista
    .filter((n) => n.evento && (n.evento.fim || n.evento.data) >= hoje)
    .sort((a, b) => a.evento.data.localeCompare(b.evento.data))
    .slice(0, limite || 999);
}
function eventoHTML(n) {
  const e = n.evento,
    [, m, d] = e.data.split("-");
  const fim = e.fim && e.fim !== e.data ? ` a ${dataBR(e.fim)}` : "";
  return `<a class="evento" href="${linkMateria(n)}" style="--cor:${corDe(n)}">
    <div class="dia"><b>${+d}</b><span>${MESES[+m - 1]}</span></div>
    <div><h4>${esc(n.titulo)}</h4><p>${dataBR(e.data)}${fim}${e.hora ? " · " + esc(e.hora) : ""}${e.local ? " · " + esc(e.local) : ""}</p></div></a>`;
}
function agendaBox(lista) {
  const ev = eventos(lista, 4);
  return `<section class="box"><h2 class="box-t">Agenda da cidade</h2>
    ${ev.length ? ev.map(eventoHTML).join("") : `<p class="mini">Nenhum evento marcado no momento.</p>`}
    <a class="mais" href="agenda.html">Ver agenda completa →</a></section>`;
}

// ---------- tempo agora (Open-Meteo, grátis e sem chave) ----------
const CLIMA = {
  0: ["☀️", "Céu limpo"],
  1: ["🌤️", "Poucas nuvens"],
  2: ["⛅", "Parcialmente nublado"],
  3: ["☁️", "Nublado"],
  45: ["🌫️", "Neblina"],
  48: ["🌫️", "Neblina"],
  51: ["🌦️", "Garoa"],
  53: ["🌦️", "Garoa"],
  55: ["🌦️", "Garoa"],
  61: ["🌧️", "Chuva fraca"],
  63: ["🌧️", "Chuva"],
  65: ["🌧️", "Chuva forte"],
  80: ["🌦️", "Pancadas de chuva"],
  81: ["🌧️", "Pancadas de chuva"],
  82: ["⛈️", "Chuva forte"],
  95: ["⛈️", "Tempestade"],
  96: ["⛈️", "Tempestade"],
  99: ["⛈️", "Tempestade"],
};
const tempoBox = () =>
  `<section class="box tempo" id="tempo"><h2 class="box-t">Tempo agora em Ribeirão</h2><p class="mini">Carregando…</p></section>`;
async function carregarTempo() {
  const el = $("#tempo");
  if (!el) return;
  try {
    const u =
      "https://api.open-meteo.com/v1/forecast?latitude=-21.1775&longitude=-47.8103&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=1&timezone=America%2FSao_Paulo";
    const d = await (await fetch(u)).json();
    const [ic, txt] = CLIMA[d.current.weather_code] || ["🌡️", ""];
    el.innerHTML = `<h2 class="box-t">Tempo agora em Ribeirão</h2>
      <div class="agora"><span class="ic">${ic}</span><b>${Math.round(d.current.temperature_2m)}°</b><span>${txt}</span></div>
      <p class="mini">Hoje: mín ${Math.round(d.daily.temperature_2m_min[0])}° · máx ${Math.round(d.daily.temperature_2m_max[0])}° · chance de chuva ${d.daily.precipitation_probability_max[0] ?? 0}%</p>
      <p class="credito">Dados: Open-Meteo</p>`;
  } catch {
    el.remove();
  }
}

const telefonesBox =
  () => `<section class="box"><h2 class="box-t">Telefones úteis</h2><ul class="fones">
    ${TELEFONES.map(([n, s]) => `<li><a href="tel:${n}"><b>${n}</b> ${s}</a></li>`).join("")}</ul></section>`;

// ---------- páginas ----------
async function capa() {
  const lista = await carregar();
  const secao = SECOES.find((s) => s.slug === params.get("secao"));
  montarTopo(secao ? secao.slug : "inicio");
  if (secao) return paginaSecao(lista, secao);

  if (!lista.length) {
    $("#conteudo").innerHTML =
      `<p class="vazio">Nenhuma notícia por aqui ainda.</p>`;
    return;
  }
  // a manchete e as últimas são sempre da cidade; Estado, Brasil e Futebol vão em blocos próprios
  const locais = lista.filter((n) => !secaoDe(n).fora);
  const base = locais.length ? locais : lista;
  const d = base.find((n) => n.destaque && n.data === base[0].data) || base[0];
  const resto = base.filter((n) => n !== d);
  const dupla = resto.slice(0, 2),
    ultimas = resto.slice(2, 8),
    depois = resto.slice(8);

  // blocos por seção: 1 grande + até 3 em lista, cada um na cor da seção
  const blocos = SECOES.map((s) => {
    const ns = (s.fora ? lista : depois)
      .filter((n) => secaoDe(n) === s)
      .slice(0, 4);
    if (!ns.length) return "";
    const [p, ...r] = ns;
    return `<section class="bloco" style="--cor:${s.cor}">
      <div class="bloco-t"><h2>${s.nome}</h2><a href="./?secao=${s.slug}">Ver tudo →</a></div>
      <div class="bloco-c">${cardHTML(p)}<div class="lista-v">${r.map(itemHTML).join("")}</div></div></section>`;
  }).join("");

  $("#conteudo").innerHTML = `
    <div class="capa">
      <div>
        ${destaqueHTML(d)}
        ${zapFaixa()}
        ${dupla.length ? `<div class="dupla">${dupla.map(cardHTML).join("")}</div>` : ""}
        ${ultimas.length ? `<h2 class="secao">Últimas notícias</h2><div class="lista-v">${ultimas.map(itemHTML).join("")}</div>` : ""}
      </div>
      <aside class="lateral">${tempoBox()}${agendaBox(lista)}${telefonesBox()}</aside>
    </div>
    ${sigaHTML()}
    ${blocos}`;
  carregarTempo();
  mostrarInstalar();
  mostrarAvisos();
}

function paginaSecao(lista, s) {
  document.title = `${s.nome} | Ribeirão Informa`;
  const ns = lista.filter((n) => secaoDe(n) === s);
  $("#conteudo").innerHTML = `
    <header class="cab-secao" style="--cor:${s.cor}"><h1>${s.nome}</h1><p>${s.desc}</p></header>
    ${
      ns.length
        ? `<div class="grade">${ns.slice(0, 60).map(cardHTML).join("")}</div>`
        : `<p class="vazio">As primeiras notícias de ${s.nome.toLowerCase()} chegam em breve. Enquanto isso, veja as <a href="./">últimas da cidade</a>.</p>`
    }
    ${sigaHTML()}`;
}

async function agenda() {
  montarTopo("agenda");
  const lista = await carregar();
  const ev = eventos(lista);
  $("#conteudo").innerHTML = `
    <header class="cab-secao" style="--cor:#d9480f"><h1>Agenda</h1><p>Shows, feiras, eventos e programação gratuita em Ribeirão Preto, sempre com a fonte.</p></header>
    <section class="box agenda-full">${ev.length ? ev.map(eventoHTML).join("") : `<p class="vazio">Nenhum evento marcado no momento.</p>`}</section>
    ${sigaHTML()}`;
}

async function materia() {
  montarTopo("");
  const lista = await carregar();
  const n = lista.find((x) => x.id === params.get("id"));
  if (!n) {
    $("#conteudo").innerHTML =
      `<div class="materia"><p class="vazio">Notícia não encontrada. <a href="./">Voltar para a capa</a></p></div>`;
    return;
  }
  const s = secaoDe(n);
  document.querySelectorAll(".secoes a").forEach((a) => {
    if (a.getAttribute("href") === `./?secao=${s.slug}`)
      a.setAttribute("aria-current", "page");
  });
  document.title = `${n.titulo} | Ribeirão Informa`;
  const url = location.href;
  const zap = `https://wa.me/?text=${encodeURIComponent(n.titulo + " " + url)}`;
  const fonte = urlSegura(n.link)
    ? `<a href="${urlSegura(n.link)}" target="_blank" rel="noopener">${esc(n.fonte)}</a>`
    : esc(n.fonte);
  const [primeiro, ...demais] = n.texto || [n.resumo];
  const outras = lista
    .filter((x) => x.id !== n.id && secaoDe(x) === s)
    .slice(0, 3);
  const e = n.evento;
  const pad = FOTO_PADRAO[s.slug];
  const fm = n.foto
    ? { url: n.foto, credito: n.credito_foto }
    : pad && !n.imagem
      ? pad
      : null;
  const midia =
    fm && fotoSrc(fm.url)
      ? `<figure class="foto-mat"><img src="${fotoSrc(fm.url)}" alt="" ${reserva(n)} width="1200" height="675">${fm.credito ? `<figcaption>Foto: ${esc(fm.credito)}</figcaption>` : ""}</figure>`
      : n.imagem
        ? `<img class="card-mat" src="${esc(n.imagem)}" alt="Card da notícia: ${esc(n.titulo)}" width="1080" height="1350">`
        : "";
  $("#conteudo").innerHTML = `
    <a class="voltar" href="./?secao=${s.slug}">← ${s.nome}</a>
    <article class="materia" style="--cor:${corDe(n)}">
      ${tagHTML(n)}
      <h1>${esc(n.titulo)}</h1>
      ${metaHTML(n, fonte)}
      ${midia}
      <p class="linha-fina">${esc(primeiro)}</p>
      <div class="texto">${demais.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      ${e ? `<div class="caixa-evento"><b>📅 Anote:</b> ${dataBR(e.data)}${e.fim && e.fim !== e.data ? " a " + dataBR(e.fim) : ""}${e.hora ? " · " + esc(e.hora) : ""}${e.local ? "<br>📍 " + esc(e.local) : ""}</div>` : ""}
      <div class="caixa-fonte">📰 Informação publicada originalmente por <b>${fonte}</b>. O Ribeirão Informa só divulga notícia confirmada e sempre cita a fonte.</div>
      <div class="compartilhar">
        <a class="btn whats" href="${zap}" target="_blank" rel="noopener">Mandar no WhatsApp</a>
        <button class="btn claro" id="copiar">Copiar link</button>
      </div>
      ${zapFaixa()}
    </article>
    ${outras.length ? `<h2 class="secao">Mais de ${s.nome}</h2><div class="grade">${outras.map(cardHTML).join("")}</div>` : ""}
    ${sigaHTML()}`;
  $("#copiar").onclick = async (ev) => {
    try {
      await navigator.clipboard.writeText(url);
      ev.target.textContent = "Link copiado!";
    } catch {
      prompt("Copie o link:", url);
    }
  };
}

const pagina = document.body.dataset.pagina;
if (pagina === "capa") (window.CAPA_V2 || capa)();
else if (pagina === "materia") materia();
else if (pagina === "agenda") agenda();
else montarTopo("");

// ---------- app instalável (PWA) ----------
// Android/Chrome: um toque instala (beforeinstallprompt).
// iPhone: a Apple não deixa instalar com um toque, então abrimos um passo a passo com desenhos.
// Navegador de dentro do Instagram/Facebook etc.: pedimos para abrir no Safari/Chrome.
if ("serviceWorker" in navigator) {
  // o OneSignal registra o MESMO sw.js (com ?appId=...). Se já existe um registro,
  // não registramos de novo, senão um atropela o outro e a inscrição de avisos falha.
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .getRegistration("/")
      .then((r) => r || navigator.serviceWorker.register("sw.js"))
      .catch(() => {}),
  );
}
const UA = navigator.userAgent;
const ehApp = () =>
  matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;
const ehIOS = () =>
  /iphone|ipad|ipod/i.test(UA) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const ehAndroid = () => /android/i.test(UA);
const ehCelular = () => ehIOS() || ehAndroid() || /mobile/i.test(UA);
const ehInterno = () =>
  /Instagram|FBAN|FBAV|FB_IAB|Line\/|Twitter|TikTok|musical_ly|Snapchat|; wv\)/i.test(
    UA,
  );
const ehSafari = () =>
  ehIOS() && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//i.test(UA) && !ehInterno();
let pedidoInstalar = null;
const guardado = (k, v) => {
  try {
    if (v === undefined) return localStorage.getItem(k);
    localStorage.setItem(k, v);
  } catch {
    return null;
  }
};

// desenhos simples (SVG) dos botões do celular
const IC_COMPARTILHAR = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const IC_MAIS = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const IC_TRES = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>`;
const IC_TRES_V = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="19" r="2" fill="currentColor"/></svg>`;

function passo(n, html) {
  return `<li><span class="num">${n}</span><div>${html}</div></li>`;
}

function guiaHTML() {
  const linkSite = location.origin + "/app";
  if (ehInterno()) {
    const ios = ehIOS();
    return `<h2>Abra no ${ios ? "Safari" : "Chrome"} para instalar</h2>
      <p class="sub">Você está no navegador de dentro de outro app (Instagram, Facebook...). Ele não deixa instalar.</p>
      <ol class="passos">
        ${passo(1, `Toque nos ${IC_TRES} ou ${IC_TRES_V} no <b>canto de cima</b> da tela.`)}
        ${passo(2, `Escolha <b>${ios ? "Abrir no navegador externo" : "Abrir no Chrome"}</b>${ios ? " (ou <b>Abrir no Safari</b>)" : ""}.`)}
        ${passo(3, `Lá, toque de novo em <b>📲 Instalar o app</b>.`)}
      </ol>
      <p class="sub">Não achou? Copie o link e cole no ${ios ? "Safari" : "Chrome"}:</p>
      <button class="btn" id="copiar-site" data-link="${esc(linkSite)}">Copiar o link do site</button>`;
  }
  if (ehIOS() && !ehSafari()) {
    return `<h2>Abra no Safari para instalar</h2>
      <p class="sub">No iPhone, o app se instala pelo <b>Safari</b> (a bússola azul).</p>
      <button class="btn" id="copiar-site" data-link="${esc(linkSite)}">Copiar o link do site</button>
      <ol class="passos">
        ${passo(1, `Toque no botão acima para copiar o link.`)}
        ${passo(2, `Abra o <b>Safari</b>, toque na barra de endereço e cole.`)}
        ${passo(3, `Toque em <b>📲 Instalar o app</b> e siga os passos.`)}
      </ol>`;
  }
  if (ehIOS()) {
    return `<h2>Instale em 3 toques</h2>
      <ol class="passos">
        ${passo(1, `Toque no botão <b>Compartilhar</b> ${IC_COMPARTILHAR}<br><small>Fica na barra <b>de baixo</b> do Safari, no meio. Não aparece? Toque nos ${IC_TRES} no canto de baixo e depois em <b>Compartilhar</b> ${IC_COMPARTILHAR}.</small>`)}
        ${passo(
          2,
          `Abre uma lista. Toque na linha <b>Adicionar à Tela de Início</b>, a que tem o quadradinho com ${IC_MAIS}
          <div class="menu-ios" aria-hidden="true">
            <div class="mi-redondos"><span>Copiar</span><span>Adicionar a Preferidos</span><span>Lista de Leitura</span><span>Adicionar Favorito</span></div>
            <div class="mi-bloco"><div>☆ Preferidos</div><div>Adicionar à Nota Rápida</div><div>Buscar na Página</div><div class="mi-certo">${IC_MAIS} Adicionar à Tela de Início <b>← ESTA</b></div></div>
          </div>
          <small>⚠️ <b>Não é</b> "Favoritos" nem "Preferidos". É a linha com o <b>quadradinho e o +</b>, no bloco cinza do meio. Não achou? Role a lista para baixo. Se ainda não aparecer, toque em <b>Editar Ações</b> (no fim da lista) e ligue <b>Adicionar à Tela de Início</b>.</small>`,
        )}
        ${passo(3, `Toque em <b>Adicionar</b>, no <b>canto de cima, à direita</b>. Pronto: o ícone do Ribeirão Informa aparece na sua tela, junto com os outros apps.`)}
      </ol>
      <div class="seta-baixo" aria-hidden="true"><span>Compartilhar fica aqui embaixo</span>⬇︎</div>`;
  }
  if (ehAndroid() && pedidoInstalar) {
    return `<h2>Instale com 1 toque</h2>
      <p class="sub">Toque no botão abaixo e depois em <b>Instalar</b>.</p>
      <button class="btn" id="instalar-agora">📲 Instalar agora</button>`;
  }
  if (ehAndroid()) {
    return `<h2>Instale em 2 toques</h2>
      <ol class="passos">
        ${passo(1, `Toque nos ${IC_TRES_V} no <b>canto de cima, à direita</b> do Chrome.`)}
        ${passo(2, `Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b> e confirme.`)}
      </ol>
      <div class="seta-cima" aria-hidden="true">⬆︎<span>o menu fica aqui em cima</span></div>`;
  }
  return `<h2>Instale no celular</h2>
    <p class="sub">Abra <b>${esc(location.host)}</b> no celular e toque em <b>📲 Instalar o app</b>.
    No computador, use o ícone de instalar na barra de endereço do Chrome.</p>`;
}

function abrirGuia() {
  document.getElementById("guia")?.remove();
  const el = document.createElement("div");
  el.id = "guia";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.innerHTML = `<div class="guia-caixa"><button class="fechar" aria-label="Fechar">×</button>
    <img src="icones/icone-192.png" alt="" width="64" height="64" class="guia-icone">
    ${guiaHTML()}
    <button class="btn claro" id="guia-ok">Entendi</button></div>`;
  document.body.appendChild(el);
  const fechar = () => el.remove();
  el.querySelector(".fechar").onclick = fechar;
  el.querySelector("#guia-ok").onclick = fechar;
  el.addEventListener("click", (e) => {
    if (e.target === el) fechar();
  });
  const cp = el.querySelector("#copiar-site");
  if (cp)
    cp.onclick = async () => {
      try {
        await navigator.clipboard.writeText(cp.dataset.link);
        cp.textContent = "Link copiado! Agora cole no navegador";
      } catch {
        prompt("Copie o link:", cp.dataset.link);
      }
    };
  const ja = el.querySelector("#instalar-agora");
  if (ja)
    ja.onclick = () => {
      fechar();
      instalar();
    };
}

async function instalar() {
  if (pedidoInstalar) {
    pedidoInstalar.prompt();
    const r = await pedidoInstalar.userChoice.catch(() => null);
    pedidoInstalar = null;
    if (r && r.outcome === "accepted") {
      esconderInstalar();
      return;
    }
  } else abrirGuia();
}

function esconderInstalar() {
  document
    .querySelectorAll(".btn-instalar,#instalar,.instalar-faixa")
    .forEach((e) => e.remove());
}

function mostrarInstalar() {
  if (ehApp()) return esconderInstalar();
  document.querySelectorAll(".btn-instalar").forEach((b) => {
    b.hidden = false;
    b.onclick = instalar;
  });
  // faixa na capa, logo abaixo da faixa do WhatsApp (só no celular)
  const zap = document.querySelector(".capa .zap-faixa");
  if (ehCelular() && zap && !document.querySelector(".instalar-faixa")) {
    const f = document.createElement("button");
    f.type = "button";
    f.className = "instalar-faixa";
    f.innerHTML = `<img src="icones/icone-192.png" alt="" width="40" height="40"><span><b>Tenha o Ribeirão Informa no celular</b><small>Instale o app grátis. Abre direto da sua tela.</small></span><em>Instalar</em>`;
    f.onclick = instalar;
    zap.after(f);
  }
  // aviso pequeno no rodapé da tela (uma vez a cada 14 dias)
  const fechado = +guardado("ri-instalar-fechado") || 0;
  if (
    ehCelular() &&
    !document.getElementById("instalar") &&
    Date.now() - fechado > 14 * 864e5
  ) {
    setTimeout(() => {
      if (ehApp() || document.getElementById("instalar")) return;
      const el = document.createElement("div");
      el.id = "instalar";
      el.innerHTML = `<img src="icones/icone-192.png" alt="" width="44" height="44"><div class="txt"><p><b>Instale o app do Ribeirão Informa</b></p>
        <button class="btn" type="button">📲 Instalar o app</button></div><button class="fechar" aria-label="Fechar">×</button>`;
      document.body.appendChild(el);
      el.querySelector(".btn").onclick = () => {
        el.remove();
        instalar();
      };
      el.querySelector(".fechar").onclick = () => {
        guardado("ri-instalar-fechado", Date.now());
        el.remove();
      };
    }, 4000);
  }
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  pedidoInstalar = e;
  // se o passo a passo já está aberto, troca para o botão de 1 toque
  if (document.getElementById("guia")) abrirGuia();
});
// link curto /app chega aqui com ?instalar=1 e já abre a instalação
if (/[?&]instalar=1/.test(location.search) && !ehApp()) {
  history.replaceState(null, "", location.pathname);
  setTimeout(abrirGuia, 900);
}
window.addEventListener("appinstalled", esconderInstalar);
setTimeout(mostrarInstalar, 600);
// link no rodapé abre o passo a passo a qualquer hora
setTimeout(() => {
  const mapa = document.querySelector(".rodape .mapa, .v2-rodape nav:not(.redes)");
  if (mapa && !ehApp()) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "📲 Instalar o app";
    a.onclick = (ev) => {
      ev.preventDefault();
      instalar();
    };
    mapa.appendChild(a);
  }
}, 700);

// ---------- notificações no celular (OneSignal, grátis) ----------
// Android/computador: um toque em "Ativar avisos" e pronto.
// iPhone: a Apple só deixa receber avisos com o app instalado na Tela de Início (iOS 16.4+),
// então fora do app explicamos isso e abrimos o passo a passo de instalação.
const ONESIGNAL_APP_ID = "7140f1ac-f0cf-4cee-a53d-76f94e300c79";
const temPush = () =>
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;
let osPronto = null;
let osErro = "";
window.addEventListener("unhandledrejection", (e) => {
  const m = String((e.reason && (e.reason.message || e.reason)) || "");
  if (/onesignal|push|subscri|service ?worker/i.test(m)) osErro = m.slice(0, 160);
});
function carregarOneSignal() {
  if (osPronto) return osPronto;
  osPronto = new Promise((ok0) => {
    let feito = false;
    const ok = (v) => {
      if (!feito) {
        feito = true;
        ok0(v);
      }
    };
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async (OS) => {
      try {
        await OS.init({
          appId: ONESIGNAL_APP_ID,
          serviceWorkerPath: "sw.js",
          serviceWorkerParam: { scope: "/" },
          notifyButton: { enable: false },
          allowLocalhostAsSecureOrigin: true,
        });
        OS.Notifications.addEventListener("permissionChange", atualizarAvisos);
        ok(OS);
      } catch (e) {
        osErro = "OneSignal: " + ((e && e.message) || e);
        ok(null);
      }
    });
    const s = document.createElement("script");
    // cópia do SDK hospedada no próprio site (o iPhone não carregava do cdn.onesignal.com)
    s.src = "/assets/onesignal/OneSignalSDK.page.es6.js?v=160900";
    s.defer = true;
    s.onerror = () => {
      osErro = "não carregou o arquivo de avisos do site";
      ok(null);
    };
    setTimeout(() => {
      if (feito) return;
      osErro = osErro || "o serviço de avisos demorou demais para responder";
      ok(null);
    }, 15000);
    document.head.appendChild(s);
  });
  return osPronto;
}
// ligado = permissão dada E inscrição confirmada no OneSignal
const avisosLigados = () =>
  temPush() && Notification.permission === "granted" && guardado("ri-avisos-ok") === "1";

function explicarIphone() {
  document.getElementById("guia")?.remove();
  const el = document.createElement("div");
  el.id = "guia";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.innerHTML = `<div class="guia-caixa"><button class="fechar" aria-label="Fechar">×</button>
    <img src="icones/icone-192.png" alt="" width="64" height="64" class="guia-icone">
    <h2>Você está no Safari</h2>
    <p class="sub">No iPhone, os avisos <b>só ligam dentro do app</b>, não aqui no navegador.</p>
    <div class="ja-instalou"><b>Já instalou o app?</b><br>Saia do Safari e toque no ícone <img src="icones/icone-192.png" alt="" width="28" height="28"> <b>Ribeirão Informa</b> na tela do celular. Lá dentro aparece sozinha a pergunta <b>"Quer receber as notícias?"</b>: toque em <b>Sim</b> e depois em <b>Permitir</b>.</div>
    <p class="sub"><b>Ainda não instalou?</b> Toque no botão abaixo.</p>
    <button class="btn" id="ir-instalar">📲 Instalar o app</button>
    <button class="btn claro" id="guia-ok">Entendi</button></div>`;
  document.body.appendChild(el);
  const fechar = () => el.remove();
  el.querySelector(".fechar").onclick = fechar;
  el.querySelector("#guia-ok").onclick = fechar;
  el.querySelector("#ir-instalar").onclick = () => {
    fechar();
    abrirGuia();
  };
  el.addEventListener("click", (e) => {
    if (e.target === el) fechar();
  });
}

// resultado da ativação, com o motivo quando falha (para o leitor conseguir contar o que apareceu)
function resultadoAvisos(ok, titulo, motivo) {
  document.getElementById("avisos-resultado")?.remove();
  const el = document.createElement("div");
  el.id = "avisos-resultado";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  const iosV = (UA.match(/OS (\d+)_(\d+)/) || []).slice(1).join(".");
  const diag = [
    iosV ? "iOS " + iosV : "",
    ehApp() ? "app instalado" : "navegador",
    "Notification" in window ? "permissão: " + Notification.permission : "sem suporte a avisos",
    "PushManager" in window ? "push ok" : "sem push",
  ].filter(Boolean).join(" · ");
  el.innerHTML = `<div class="guia-caixa"><div class="sino-grande" aria-hidden="true">${ok ? "✅" : "⚠️"}</div>
    <h2>${esc(titulo)}</h2>${motivo ? `<p class="sub">${esc(motivo)}</p>` : ""}
    <p class="diag">${esc(diag)}</p>
    <button class="btn" type="button">${ok ? "Ótimo!" : "Fechar"}</button></div>`;
  document.body.appendChild(el);
  el.querySelector(".btn").onclick = () => el.remove();
  if (!ok) testarConexao(el.querySelector(".diag"));
}

// testa se o celular alcança os endereços do serviço de avisos (bloqueador, VPN, DNS...)
async function testarConexao(linha) {
  const alvo = async (u) => {
    try {
      await Promise.race([
        fetch(u, { mode: "no-cors", cache: "no-store" }),
        new Promise((_, n) => setTimeout(() => n(new Error("tempo")), 8000)),
      ]);
      return "ok";
    } catch {
      return "BLOQUEADO";
    }
  };
  const [cdn, api] = await Promise.all([
    alvo("/assets/onesignal/OneSignalSDK.page.es6.js?v=160900"),
    alvo("https://api.onesignal.com/"),
  ]);
  if (linha) linha.textContent += ` · sdk: ${cdn} · api: ${api} · v${VERSAO_SITE}`;
}

async function ativarAvisos() {
  if (ehIOS() && !ehApp()) return explicarIphone();
  if (!temPush()) {
    const iosV = +((UA.match(/OS (\d+)_(\d+)/) || [])[1] || 0);
    return resultadoAvisos(
      false,
      "Não deu certo: este aparelho não aceita avisos",
      ehIOS() && iosV && iosV < 17
        ? "O iPhone precisa estar no iOS 16.4 ou mais novo. Atualize em Ajustes > Geral > Atualização de Software."
        : "Use o Chrome (Android) ou o app instalado (iPhone).",
    );
  }
  if (Notification.permission === "denied") {
    return resultadoAvisos(
      false,
      "Não deu certo: os avisos estão bloqueados",
      ehIOS()
        ? "Abra Ajustes > Notificações > Ribeirão Informa e ligue Permitir Notificações."
        : "Libere em Configurações do navegador > Notificações.",
    );
  }
  // o pedido do celular tem que sair NA HORA do toque (o iPhone ignora se demorar),
  // então pedimos a permissão primeiro e só depois ligamos o OneSignal
  let perm = Notification.permission;
  let erroPerm = "";
  try {
    if (perm !== "granted") perm = await Notification.requestPermission();
  } catch (e) {
    erroPerm = (e && e.message) || String(e);
  }
  if (perm !== "granted") {
    return resultadoAvisos(
      false,
      "Não deu certo: a permissão não foi dada",
      erroPerm
        ? "O celular respondeu: " + erroPerm
        : "Toque de novo no 🔔 e, na mensagem do celular, escolha Permitir.",
    );
  }
  const OS = await carregarOneSignal();
  let inscrito = false;
  try {
    if (OS?.User?.PushSubscription) {
      if (!OS.User.PushSubscription.optedIn) await OS.User.PushSubscription.optIn();
      for (let i = 0; i < 60 && !OS.User.PushSubscription.id; i++)
        await new Promise((r) => setTimeout(r, 500));
      inscrito = !!OS.User.PushSubscription.id;
    }
  } catch (e) {
    osErro = osErro || "inscrição: " + ((e && e.message) || e);
  }
  if (!inscrito) {
    return resultadoAvisos(
      false,
      "Não deu certo: a permissão foi dada, mas a inscrição não concluiu",
      (osErro || "sem resposta do serviço de avisos") + ". Feche o app, abra de novo e toque no 🔔.",
    );
  }
  guardado("ri-avisos-ok", "1");
  atualizarAvisos();
  resultadoAvisos(true, "Pronto! Avisos ligados", "Quando sair notícia importante, ela aparece na sua tela.");
}

function alertaCurto(txt) {
  document.getElementById("aviso-curto")?.remove();
  const d = document.createElement("div");
  d.id = "aviso-curto";
  d.setAttribute("role", "status");
  d.textContent = txt;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 5000);
}

function atualizarAvisos() {
  if (!avisosLigados()) return;
  document
    .querySelectorAll(".avisos-faixa,#avisos-convite,.btn-avisos")
    .forEach((e) => e.remove());
}

function mostrarAvisos() {
  if (avisosLigados()) {
    carregarOneSignal(); // mantém a inscrição em dia
    return;
  }
  // permissão já dada mas inscrição não confirmada: tenta sozinho, sem o leitor tocar em nada
  if (temPush() && Notification.permission === "granted") {
    carregarOneSignal().then(async (OS) => {
      try {
        const ps = OS?.User?.PushSubscription;
        if (ps && !ps.optedIn) await ps.optIn();
        for (let i = 0; i < 60 && ps && !ps.id; i++)
          await new Promise((r) => setTimeout(r, 500));
        if (ps?.id) {
          guardado("ri-avisos-ok", "1");
          atualizarAvisos();
          alertaCurto("Avisos ligados! 🔔");
        }
      } catch {}
    });
  }
  if (!ehIOS() && !temPush()) return;
  // faixa na capa, logo abaixo da faixa de instalar / do WhatsApp
  const ref =
    document.querySelector(".capa .instalar-faixa") ||
    document.querySelector(".capa .zap-faixa");
  if (ref && !document.querySelector(".avisos-faixa")) {
    const f = document.createElement("button");
    f.type = "button";
    f.className = "avisos-faixa";
    f.innerHTML = `<span class="sino" aria-hidden="true">🔔</span><span><b>Receba as notícias importantes no celular</b><small>Ative os avisos: chegou notícia, aparece na sua tela.</small></span><em>Ativar</em>`;
    f.onclick = ativarAvisos;
    ref.after(f);
  }
  // botão com sino no topo, sempre à vista enquanto os avisos estiverem desligados
  document.querySelectorAll(".btn-avisos").forEach((bt) => {
    bt.hidden = false;
    bt.onclick = ativarAvisos;
  });
  // dentro do app instalado: tela grande no meio, impossível de não ver
  const fechado = +guardado("ri-avisos-fechado") || 0;
  if (ehApp() && Date.now() - fechado > 3 * 864e5 && !document.getElementById("avisos-convite")) {
    carregarOneSignal(); // já deixa pronto
    setTimeout(() => {
      if (avisosLigados() || document.getElementById("avisos-convite") || document.getElementById("guia")) return;
      const el = document.createElement("div");
      el.id = "avisos-convite";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.innerHTML = `<div class="guia-caixa"><div class="sino-grande" aria-hidden="true">🔔</div>
        <h2>Quer receber as notícias importantes no celular?</h2>
        <p class="sub">Chegou notícia importante de Ribeirão, aparece na sua tela. É grátis e você pode desligar quando quiser.</p>
        <button class="btn btn-grande" type="button" id="avisos-sim">🔔 Sim, ativar avisos</button>
        <p class="sub">Depois toque em <b>Permitir</b>.</p>
        <button class="btn claro" type="button" id="avisos-nao">Agora não</button></div>`;
      document.body.appendChild(el);
      el.querySelector("#avisos-sim").onclick = () => {
        el.remove();
        ativarAvisos();
      };
      el.querySelector("#avisos-nao").onclick = () => {
        guardado("ri-avisos-fechado", Date.now());
        el.remove();
      };
    }, 1200);
  }
}
setTimeout(mostrarAvisos, 800);
// link no rodapé
setTimeout(() => {
  const mapa = document.querySelector(".rodape .mapa, .v2-rodape nav:not(.redes)");
  if (mapa && !avisosLigados() && (ehIOS() || temPush())) {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = "🔔 Ativar avisos";
    a.onclick = (ev) => {
      ev.preventDefault();
      ativarAvisos();
    };
    mapa.appendChild(a);
  }
}, 750);

// número da versão no rodapé (para saber se o celular está com a versão nova)
const VERSAO_SITE = "15";
setTimeout(() => {
  const r = document.querySelector(".rodape .wrap, .v2-rodape .v2-wrap");
  if (r && !document.querySelector(".versao")) {
    const v = document.createElement("p");
    v.className = "versao";
    v.textContent = "versão " + VERSAO_SITE + (ehApp() ? " · app" : "");
    r.appendChild(v);
  }
}, 800);
