// Ribeirão Informa: monta topo, capa e matéria a partir de data/noticias.json
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

const ICONES = {
  instagram:
    '<path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z"/>',
  facebook:
    '<path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0024 12z"/>',
  tiktok:
    '<path d="M19.6 6.7a4.8 4.8 0 01-3.8-4.2V2h-3.4v13.7a2.9 2.9 0 11-2-2.8V9.4a6.3 6.3 0 105.4 6.3V8.8a8.2 8.2 0 004.8 1.5V6.9l-1-.2z"/>',
  threads:
    '<path d="M17.7 11.1l-.4-.2c-.2-3.9-2.4-6.1-6-6.1-2.2 0-4 .9-5.1 2.6l2 1.4c.8-1.2 2.1-1.5 3.1-1.5 1.2 0 2.1.4 2.7 1.1.4.5.7 1.2.8 2-1-.2-2.1-.2-3.3-.2-3.3.2-5.4 2.1-5.3 4.8.1 1.4.8 2.6 2 3.4 1 .6 2.3.9 3.6.9 1.8-.1 3.2-.8 4.2-2 .7-.9 1.2-2.1 1.4-3.6.9.5 1.5 1.2 1.9 2 .6 1.4.7 3.7-1.2 5.6-1.6 1.6-3.6 2.3-6.6 2.4-3.3 0-5.8-1.1-7.4-3.2C3.8 18.5 3 15.7 3 12s.8-6.5 2.4-8.5C7 1.4 9.5.4 12.8.3c3.3 0 5.9 1.1 7.6 3.2.8 1 1.5 2.3 1.9 3.8l2.3-.6c-.5-1.9-1.3-3.5-2.4-4.8C20 .8 16.9-.4 12.8-.4 8.8-.4 5.7 1 3.6 3.6 1.8 5.9.8 9.1.8 13s1 7.1 2.8 9.4c2.1 2.6 5.2 4 9.2 4 3.6 0 6.1-1 8.2-3 2.8-2.7 2.7-6.1 1.8-8.2-.7-1.5-1.9-2.7-3.6-3.5l.5-.6zM12.5 18c-1.4.1-2.8-.6-2.9-1.9-.1-1 .7-2 3-2.2h.9c.8 0 1.6.1 2.3.2-.3 3.3-1.8 3.8-3.3 3.9z" transform="scale(.92) translate(1 1)"/>',
  kwai: '<path d="M7 3h3.2v7.3L16.7 3h4l-6.9 7.4L21 21h-4l-5.3-8.1-1.5 1.6V21H7z"/>',
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
  const [a, m, d] = iso.split("-");
  return `${+d} ${MESES[+m - 1]} ${a}`;
};

function redesHTML() {
  return Object.entries(REDES)
    .filter(([, u]) => u)
    .map(
      ([r, u]) =>
        `<a href="${u}" target="_blank" rel="noopener" aria-label="${r}" title="${r}"><svg viewBox="0 0 24 24">${ICONES[r]}</svg></a>`,
    )
    .join("");
}

function montarTopo() {
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
  $("#topo").innerHTML = `
  <header class="topo"><div class="wrap">
    <a class="marca" href="./">
      <img class="selo" src="${SELO}" alt="" onerror="this.remove()">
      <div class="nome">RIBEIRÃO <span>INFORMA</span><small>NOTÍCIAS DE RIBEIRÃO PRETO</small></div>
    </a>
    <nav class="redes" aria-label="Redes sociais">${redesHTML()}</nav>
  </div></header>
  <div class="hoje"><div class="wrap"><span>${hoje}</span><span><b>Notícia confirmada</b>, sempre com a fonte · <a href="sobre.html">Quem somos</a></span></div></div>`;
  $("#rodape").innerHTML = `
  <footer class="rodape"><div class="wrap">
    <div><b style="color:#fff">Ribeirão Informa</b> · Tudo o que acontece em Ribeirão Preto/SP<br>
    Cada notícia cita o veículo que publicou primeiro. Viu um erro? Fale com a gente no Instagram.</div>
    <nav class="redes">${redesHTML()}</nav>
  </div></footer>`;
}

async function carregar() {
  const r = await fetch(
    "data/noticias.json?v=" + Date.now().toString().slice(0, -5),
  );
  return (await r.json()).noticias || [];
}

function cardHTML(n) {
  return `<a class="card" href="noticia.html?id=${encodeURIComponent(n.id)}">
    <img src="${esc(n.imagem)}" alt="" loading="lazy" width="1080" height="1350">
    <div class="corpo"><span><span class="tag">${esc(n.editoria)}</span></span>
    <h3>${esc(n.titulo)}</h3>
    <div class="meta">${dataBR(n.data)} · Fonte: <span class="fonte">${esc(n.fonte)}</span></div></div></a>`;
}

function sigaHTML() {
  return `<section class="siga"><div><h2>Siga o <span>Ribeirão Informa</span></h2>
    <p>As notícias da cidade chegam primeiro nas redes, três vezes por dia.</p></div>
    <a class="btn" href="${REDES.instagram}" target="_blank" rel="noopener">Seguir no Instagram</a></section>`;
}

async function capa() {
  const lista = await carregar();
  const editorias = [...new Set(lista.map((n) => n.editoria))];
  let filtro = new URLSearchParams(location.search).get("editoria") || "";
  const desenhar = () => {
    const vis = filtro ? lista.filter((n) => n.editoria === filtro) : lista;
    $("#filtros").innerHTML = ["", ...editorias]
      .map(
        (e) =>
          `<button class="chip" data-e="${esc(e)}" aria-pressed="${e === filtro}">${e || "TODAS"}</button>`,
      )
      .join("");
    if (!vis.length) {
      $("#conteudo").innerHTML =
        `<p class="vazio">Nenhuma notícia por aqui ainda.</p>`;
      return;
    }
    const [d, ...resto] = vis;
    $("#conteudo").innerHTML = `
      <a class="destaque" href="noticia.html?id=${encodeURIComponent(d.id)}">
        <img src="${esc(d.imagem)}" alt="" width="1080" height="1350">
        <div><span class="tag">${esc(d.editoria)}</span><h1>${esc(d.titulo)}</h1>
        <p>${esc(d.resumo)}</p><div class="meta">${dataBR(d.data)} · Fonte: <span class="fonte">${esc(d.fonte)}</span></div></div>
      </a>
      ${resto.length ? `<h2 class="secao">Últimas notícias</h2><div class="grade">${resto.slice(0, 11).map(cardHTML).join("")}</div>` : ""}
      ${sigaHTML()}
      ${resto.length > 11 ? `<h2 class="secao">Mais notícias</h2><div class="grade">${resto.slice(11, 60).map(cardHTML).join("")}</div>` : ""}`;
  };
  $("#filtros").addEventListener("click", (ev) => {
    const b = ev.target.closest(".chip");
    if (!b) return;
    filtro = b.dataset.e;
    desenhar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  desenhar();
}

async function materia() {
  const id = new URLSearchParams(location.search).get("id");
  const lista = await carregar();
  const n = lista.find((x) => x.id === id);
  if (!n) {
    $("#conteudo").innerHTML =
      `<div class="materia"><p class="vazio">Notícia não encontrada. <a href="./">Voltar para a capa</a></p></div>`;
    return;
  }
  document.title = `${n.titulo} | Ribeirão Informa`;
  const url = location.href;
  const zap = `https://wa.me/?text=${encodeURIComponent(n.titulo + " " + url)}`;
  const fonte = n.link
    ? `<a href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.fonte)}</a>`
    : esc(n.fonte);
  const [primeiro, ...demais] = n.texto;
  const outras = lista.filter((x) => x.id !== n.id).slice(0, 3);
  $("#conteudo").innerHTML = `
    <a class="voltar" href="./">← Todas as notícias</a>
    <article class="materia">
      <span class="tag">${esc(n.editoria)}</span>
      <h1>${esc(n.titulo)}</h1>
      <div class="meta">${dataBR(n.data)} · Fonte: <span class="fonte">${fonte}</span></div>
      <img src="${esc(n.imagem)}" alt="Card da notícia: ${esc(n.titulo)}" width="1080" height="1350">
      <p class="linha-fina">${esc(primeiro)}</p>
      <div class="texto">${demais.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <div class="caixa-fonte">📰 Informação publicada originalmente por <b>${fonte}</b>. O Ribeirão Informa só divulga notícia confirmada e sempre cita a fonte.</div>
      <div class="compartilhar">
        <a class="btn whats" href="${zap}" target="_blank" rel="noopener">Mandar no WhatsApp</a>
        <button class="btn claro" id="copiar">Copiar link</button>
      </div>
    </article>
    ${outras.length ? `<h2 class="secao">Leia também</h2><div class="grade">${outras.map(cardHTML).join("")}</div>` : ""}
    ${sigaHTML()}`;
  $("#copiar").onclick = async (e) => {
    try {
      await navigator.clipboard.writeText(url);
      e.target.textContent = "Link copiado!";
    } catch {
      prompt("Copie o link:", url);
    }
  };
}

montarTopo();
if (document.body.dataset.pagina === "capa") capa();
if (document.body.dataset.pagina === "materia") materia();
