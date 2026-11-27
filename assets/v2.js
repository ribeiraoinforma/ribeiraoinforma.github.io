// Ribeirão Informa: visual novo da capa (index.html e previa.html). Carregado ANTES do app.js.
// Usa as peças do app.js (SECOES, carregar, fotoSrc, esc...) na hora em que a capa é montada.
(function () {
  const HOME = /previa\.html$/.test(location.pathname) ? "previa.html" : "./";
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // capas de editoria: por enquanto gradiente + desenho em CSS; depois, imagem própria (capas/<slug>.jpg)
  const CAPA_ED = Object.fromEntries(
    ["cidade", "servico", "esporte", "lazer", "cultura", "bem-estar", "economia", "estado", "brasil", "futebol"].map((s) => [s, `midia/capas/${s}.jpg`]),
  );

  function topoV2(ativa) {
    const hoje = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    });
    const link = (href, nome, slug, cor) =>
      `<a href="${href}" style="--cor:${cor || "#f5b700"}"${slug === ativa ? ' aria-current="page"' : ""}>${nome}</a>`;
    $("#topo").innerHTML = `
    <div class="v2-barra"><div class="v2-wrap">
      <span class="v2-hoje">${hoje}</span>
      <span class="v2-tempo" id="v2-tempo"></span>
      <span class="v2-selo-conf">✔ Notícia confirmada, sempre com a fonte</span>
    </div></div>
    <header class="v2-topo"><div class="v2-wrap">
      <a class="v2-marca" href="${HOME}">
        <span class="v2-logo3d"><img src="${SELO}" alt=""></span>
        <span class="v2-nome"><b>RIBEIRÃO</b> <i>INFORMA</i><small>Notícias de Ribeirão Preto</small></span>
      </a>
      <div class="v2-acoes">
        <button class="btn-avisos v2-btn ouro" type="button" hidden>🔔 <span>Ativar avisos</span></button>
        <button class="btn-instalar v2-btn" type="button" hidden>📲 Instalar o app</button>
        <nav class="redes v2-redes" aria-label="Redes sociais">${redesHTML()}</nav>
      </div>
    </div></header>
    <nav class="v2-nav" aria-label="Seções"><div class="v2-wrap">
      ${link(HOME, "Início", "inicio")}
      ${SECOES.map((s) => link(`${HOME}?secao=${s.slug}`, s.nome, s.slug, s.cor)).join("")}
      ${link("agenda.html", "Agenda", "agenda", "#d9480f")}
    </div></nav>`;
    $("#rodape").innerHTML = `
    <footer class="v2-rodape"><div class="v2-wrap">
      <div class="v2-rod-marca"><span class="v2-logo3d"><img src="${SELO}" alt=""></span>
        <div><b>RIBEIRÃO <i>INFORMA</i></b><p>Tudo o que acontece em Ribeirão Preto/SP. Cada notícia cita o veículo que publicou primeiro.</p></div></div>
      <nav>${SECOES.map((s) => `<a href="${HOME}?secao=${s.slug}">${s.nome}</a>`).join("")}<a href="agenda.html">Agenda</a><a href="sobre.html">Quem somos</a></nav>
      <nav class="redes v2-redes">${redesHTML()}</nav>
    </div></footer>`;
  }

  const meta = (n) =>
    `<span class="v2-meta">${dataBR(n.data)} · ${esc(n.fonte)}</span>`;
  const tag = (n) =>
    `<span class="v2-tag" style="--cor:${corDe(n)}">${esc(n.editoria)}</span>`;
  const img = (n, w, prio) => {
    const f = fotoSrc(fotoDe(n), w);
    return f
      ? `<img src="${f}" alt="" ${prio ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${reserva(n)}>`
      : "";
  };

  // crédito da foto, pequeno, no canto da imagem
  const cred = (n) =>
    n.foto && n.credito_foto
      ? `<small class="v2-cred">${/^(imagem ilustrativa|foto de arquivo)/i.test(n.credito_foto) ? "" : "Foto: "}${esc(n.credito_foto)}</small>`
      : "";

  // cartão com foto de fundo e texto por cima (estilo portal internacional)
  const sobre = (n, cls, w, prio) =>
    `<a class="v2-sobre ${cls || ""} tilt" href="${linkMateria(n)}" style="--cor:${corDe(n)}">
      <div class="v2-img">${img(n, w, prio)}${cred(n)}</div><div class="v2-grad"></div>
      <div class="v2-txt">${tag(n)}<h3>${esc(n.titulo)}</h3>${cls === "gigante" ? `<p>${esc(n.resumo || "")}</p>` : ""}${meta(n)}</div></a>`;

  // cartão com foto em cima e texto embaixo
  const cartao = (n) =>
    `<a class="v2-cartao tilt" href="${linkMateria(n)}" style="--cor:${corDe(n)}">
      <div class="v2-img">${img(n, 500)}${cred(n)}</div>
      <div class="v2-corpo">${tag(n)}<h3>${esc(n.titulo)}</h3>${meta(n)}</div></a>`;

  const linha = (n) =>
    `<a class="v2-linha" href="${linkMateria(n)}" style="--cor:${corDe(n)}">
      <div class="v2-img">${img(n, 330)}</div><div>${tag(n)}<h4>${esc(n.titulo)}</h4>${meta(n)}</div></a>`;

  const capaEditoria = (s) =>
    `<div class="v2-capa-ed" style="--cor:${s.cor}${CAPA_ED[s.slug] ? `;--capa:url(${CAPA_ED[s.slug]})` : ""}"${CAPA_ED[s.slug] ? ' data-capa' : ""}>
      <div class="v2-capa-fundo"${CAPA_ED[s.slug] ? ` style="background-image:url(${CAPA_ED[s.slug]})"` : ""}></div>
      <h2 data-t="${s.nome}">${s.nome}</h2><p>${s.desc}</p>
      <a href="${HOME}?secao=${s.slug}">Ver tudo →</a></div>`;

  function ticker(lista) {
    const itens = lista
      .slice(0, 10)
      .map(
        (n) =>
          `<a href="${linkMateria(n)}"><b style="color:${corDe(n)}">●</b> ${esc(n.titulo)}</a>`,
      )
      .join("");
    return `<div class="v2-ticker"><span class="v2-ao-vivo">ÚLTIMAS</span><div class="v2-trilho"><div class="v2-rolo">${itens}${itens}</div></div></div>`;
  }

  function servico(lista) {
    return `<section class="v2-servico">
      <div class="v2-box v2-vidro" id="tempo"><h3>Tempo agora em Ribeirão</h3><p class="mini">Carregando…</p></div>
      <div class="v2-box v2-vidro">${agendaBox(lista).replace(/<section class="box">|<\/section>/g, "")}</div>
      <div class="v2-box v2-vidro">${telefonesBox().replace(/<section class="box">|<\/section>/g, "")}</div>
      <div class="v2-box v2-vidro" id="v2-cotacao"><h2 class="box-t">Dólar e euro hoje</h2><p class="mini">Carregando…</p></div>
      <div class="v2-box v2-vidro" id="v2-horoscopo"><h2 class="box-t">Horóscopo do dia</h2><p class="mini">Carregando…</p></div>
      ${anuncie("caixa")}
    </section>`;
  }

  const EMAIL = "ribeiraoinforma@gmail.com";
  const anuncie = (tipo) =>
    tipo === "caixa"
      ? `<a class="v2-box v2-anuncie" href="mailto:${EMAIL}?subject=Quero%20anunciar%20no%20Ribeir%C3%A3o%20Informa"><span>ESPAÇO PUBLICITÁRIO</span><b>Anuncie aqui</b><p>Sua marca no portal de notícias de Ribeirão Preto, no site, no app e nas redes.</p><i>${EMAIL}</i></a>`
      : `<a class="v2-anuncie-faixa" href="mailto:${EMAIL}?subject=Quero%20anunciar%20no%20Ribeir%C3%A3o%20Informa"><span>ESPAÇO PUBLICITÁRIO</span><b>Anuncie aqui</b><em>Fale com a gente: ${EMAIL}</em></a>`;

  const brl = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
  async function cotacao() {
    const el = $("#v2-cotacao");
    if (!el) return;
    try {
      const d = await (await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL")).json();
      const linhaC = (nome, ic, c) => {
        const p = Number(c.pctChange);
        return `<div class="v2-moeda"><span>${ic} ${nome}</span><b>${brl(c.bid)}</b><em class="${p >= 0 ? "sobe" : "desce"}">${p >= 0 ? "▲" : "▼"} ${Math.abs(p).toFixed(2).replace(".", ",")}%</em></div>`;
      };
      el.innerHTML = `<h2 class="box-t">Dólar e euro hoje</h2>${linhaC("Dólar", "💵", d.USDBRL)}${linhaC("Euro", "💶", d.EURBRL)}<p class="mini">Valor de venda (comercial), atualizado ${new Date(d.USDBRL.create_date.replace(" ", "T")).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}. Fonte: AwesomeAPI.</p>`;
    } catch {
      el.innerHTML = `<h2 class="box-t">Dólar e euro hoje</h2><p class="mini">Cotação indisponível agora. Tente de novo em instantes.</p>`;
    }
  }

  async function horoscopo() {
    const el = $("#v2-horoscopo");
    if (!el) return;
    try {
      const h = await (await fetch("data/horoscopo.json?t=" + Date.now())).json();
      const op = h.signos.map((s, i) => `<option value="${i}">${s.emoji} ${esc(s.nome)}</option>`).join("");
      el.innerHTML = `<h2 class="box-t">Horóscopo do dia</h2><select aria-label="Escolha o seu signo">${op}</select><p class="v2-horo-txt"></p><p class="mini">${dataBR(h.data)} · para se divertir</p>`;
      const sel = el.querySelector("select"), txt = el.querySelector(".v2-horo-txt");
      let salvo = 0;
      try { salvo = +localStorage.getItem("ri-signo") || 0; } catch {}
      sel.value = salvo;
      const mostra = () => { txt.textContent = h.signos[sel.value].texto; try { localStorage.setItem("ri-signo", sel.value); } catch {} };
      sel.onchange = mostra;
      mostra();
    } catch {
      el.remove();
    }
  }

  function convite() {
    return `<section class="v2-convite">
      <div class="v2-conv-3d"><div class="v2-cel"><div class="v2-cel-tela"><img src="${SELO}" alt=""><b>Ribeirão Informa</b><span>🔔 Saiu notícia importante. Toque para ler.</span></div></div></div>
      <div class="v2-conv-txt"><h2>Seu celular <em>avisa</em> quando sai notícia importante</h2>
        <p>Instale o app do Ribeirão Informa (Android e iPhone) e receba no WhatsApp as urgentes do dia. É grátis.</p>
        <div class="v2-conv-btns"><a class="v2-btn ouro" href="app/">📲 Instalar o app</a>${REDES.whatsapp ? `<a class="v2-btn zap" href="${REDES.whatsapp}" target="_blank" rel="noopener">💬 Canal no WhatsApp</a>` : ""}</div></div>
    </section>`;
  }

  function efeitos() {
    if (reduzir) return;
    // inclinação 3D dos cartões seguindo o mouse
    document.querySelectorAll(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(6px)`;
        el.style.setProperty("--brilho-x", `${(x + 0.5) * 100}%`);
        el.style.setProperty("--brilho-y", `${(y + 0.5) * 100}%`);
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
    // aparecer ao rolar
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) =>
            e.isIntersecting &&
            (e.target.classList.add("vis"), io.unobserve(e.target)),
        ),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".v2-revela").forEach((el) => io.observe(el));
    // paralaxe leve na manchete
    const g = document.querySelector(".v2-sobre.gigante .v2-img img");
    if (g)
      addEventListener(
        "scroll",
        () => {
          g.style.transform = `scale(1.08) translateY(${Math.min(scrollY, 600) * 0.06}px)`;
        },
        { passive: true },
      );
  }

  async function tempoMini() {
    try {
      const u =
        "https://api.open-meteo.com/v1/forecast?latitude=-21.1775&longitude=-47.8103&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo";
      const d = await (await fetch(u)).json();
      const [ic] = CLIMA[d.current.weather_code] || ["🌡️"];
      $("#v2-tempo").textContent =
        `${ic} ${Math.round(d.current.temperature_2m)}° em Ribeirão`;
    } catch {}
  }

  async function capaV2() {
    document.body.classList.add("v2");
    const lista = await carregar();
    const secao = SECOES.find((s) => s.slug === params.get("secao"));
    topoV2(secao ? secao.slug : "inicio");
    tempoMini();
    if (secao) {
      const ns = lista.filter((n) => secaoDe(n) === secao);
      $("#conteudo").innerHTML =
        `${capaEditoria(secao).replace("<a href", "<a hidden href")}
        <div class="v2-grade v2-revela">${ns
          .slice(0, 60)
          .map((n, i) => (i === 0 ? sobre(n, "largo", 1280, true) : cartao(n)))
          .join("")}</div>`;
      efeitos();
      mostrarInstalar();
      mostrarAvisos();
      return;
    }
    const locais = lista.filter((n) => !secaoDe(n).fora);
    const base = locais.length ? locais : lista;
    const d =
      base.find((n) => n.destaque && n.data === base[0].data) || base[0];
    const resto = base.filter((n) => n !== d);
    const lado = resto.slice(0, 2),
      faixa = resto.slice(2, 6),
      ultimas = resto.slice(6, 12),
      depois = resto.slice(12);

    const blocos = SECOES.map((s) => {
      const ns = (s.fora ? lista : depois.concat(ultimas))
        .filter((n) => secaoDe(n) === s)
        .slice(0, 5);
      if (!ns.length) return "";
      const [p, ...r] = ns;
      return `<section class="v2-bloco v2-revela" style="--cor:${s.cor}">
        ${capaEditoria(s)}
        <div class="v2-bloco-c">${sobre(p, "largo", 960)}<div class="v2-bloco-g">${r.map(cartao).join("")}</div></div></section>`;
    });
    const blocosHTML = blocos.filter(Boolean);
    if (blocosHTML.length > 3) blocosHTML.splice(3, 0, `<div class="v2-anuncie-wrap">${anuncie("faixa")}</div>`);

    $("#conteudo").innerHTML = `
      ${ticker(base)}
      <section class="v2-mosaico">
        ${sobre(d, "gigante", 1280, true)}
        <div class="v2-lado">${lado.map((n) => sobre(n, "medio", 960)).join("")}</div>
      </section>
      ${faixa.length ? `<section class="v2-faixa v2-revela">${faixa.map(cartao).join("")}</section>` : ""}
      <section class="v2-duas v2-revela">
        <div><h2 class="v2-tit">Últimas notícias</h2><div class="v2-lista">${ultimas.map(linha).join("")}</div></div>
        ${convite()}
      </section>
      ${servico(lista)}
      ${blocosHTML.join("")}`;
    carregarTempo();
    cotacao();
    horoscopo();
    efeitos();
    mostrarInstalar();
    mostrarAvisos();
  }
  window.CAPA_V2 = capaV2;
  // páginas internas (notícia, agenda, quem somos): mesmo topo e rodapé do visual novo
  window.TOPO_V2 = (ativa) => {
    document.body.classList.add("v2", "v2-interna");
    topoV2(ativa === "" ? "-" : ativa);
    tempoMini();
  };
})();
