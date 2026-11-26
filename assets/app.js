// Ribeirão Informa: monta topo, capa, seções, agenda e matéria a partir de data/noticias.json
// Para ligar uma rede nova, basta preencher o link dela aqui (vazio = escondida).
const REDES = {
  instagram: "https://www.instagram.com/ribeiraoinforma/",
  facebook: "",
  tiktok: "",
  threads: "",
  kwai: "",
};
const SELO =
  "https://cdn.creativeclaw.co/u/c6e73e30/images/428bec61-c6b0-4db6-aea5-ef5ef96f2395.png";

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

const ICONES = {
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
    <nav class="redes" aria-label="Redes sociais">${redesHTML()}</nav>
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
    <nav class="mapa">${SECOES.map((s) => `<a href="./?secao=${s.slug}">${s.nome}</a>`).join("")}<a href="agenda.html">Agenda</a><a href="sobre.html">Quem somos</a></nav>
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
const FOTO_PADRAO = {
  cultura: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Vista_do_Theatro_Pedro_II_em_2022.jpg/1280px-Vista_do_Theatro_Pedro_II_em_2022.jpg",
    credito: "Mtvdanilo / Wikimedia Commons, CC BY-SA 4.0",
  },
};
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
  `onerror="this.onerror=null;${n.imagem && /^midia\//.test(n.imagem) ? `this.src='${esc(n.imagem)}';this.parentNode.classList.add('de-card')` : "this.remove()"}"`;

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
    <a class="btn" href="${REDES.instagram}" target="_blank" rel="noopener">Seguir no Instagram</a></section>`;
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
  const d =
    lista.find((n) => n.destaque && n.data === lista[0].data) || lista[0];
  const resto = lista.filter((n) => n !== d);
  const dupla = resto.slice(0, 2),
    ultimas = resto.slice(2, 8),
    depois = resto.slice(8);

  // blocos por seção: 1 grande + até 3 em lista, cada um na cor da seção
  const blocos = SECOES.map((s) => {
    const ns = depois.filter((n) => secaoDe(n) === s).slice(0, 4);
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
        ${dupla.length ? `<div class="dupla">${dupla.map(cardHTML).join("")}</div>` : ""}
        ${ultimas.length ? `<h2 class="secao">Últimas notícias</h2><div class="lista-v">${ultimas.map(itemHTML).join("")}</div>` : ""}
      </div>
      <aside class="lateral">${tempoBox()}${agendaBox(lista)}${telefonesBox()}</aside>
    </div>
    ${sigaHTML()}
    ${blocos}`;
  carregarTempo();
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
if (pagina === "capa") capa();
else if (pagina === "materia") materia();
else if (pagina === "agenda") agenda();
else montarTopo("");
