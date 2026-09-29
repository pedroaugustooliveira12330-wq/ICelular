(function () {
  "use strict";

  const originalHome = home;
  const originalToast = toast;
  const currentRoute = function () { return decodeURI(location.pathname.replace(/\/$/, "") || "/"); };
  const pageTitles = titleMap;
  const imageFallback = function (root) {
    (root || document).querySelectorAll("img[data-fallback]").forEach(function (image) {
      if (image.dataset.fallbackBound) return;
      image.dataset.fallbackBound = "true";
      image.addEventListener("error", function () {
        if (image.src !== new URL(image.dataset.fallback, location.href).href) {
          image.src = image.dataset.fallback;
          image.classList.add("is-fallback");
        }
      });
    });
  };

  async function jsonRequest(url, options) {
    const init = Object.assign({ credentials: "same-origin" }, options || {});
    const headers = new Headers(init.headers || {});
    if (adminCsrf && url.indexOf("/api/admin/") === 0) headers.set("X-CSRF-Token", adminCsrf);
    if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
    init.headers = headers;
    const response = await fetch(url, init);
    const payload = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(payload.error || "A solicitação não foi concluída.");
    return payload;
  }

  function withCategoryDetails(items) {
    const icons = {capinhas:"case",peliculas:"shield",carregadores:"plug",cabos:"cable",fones:"headphones",suportes:"stand",acessorios:"accessories",outros:"sparkle"};
    return items.map(function (item) {
      return Object.assign({}, item, { icon:icons[item.id] || "accessories" });
    });
  }

  async function loadPublicData() {
    const previewMode = document.querySelector('meta[name="preview-mode"]');
    if (previewMode && previewMode.content === "true") {
      categoryState = withCategoryDetails(categories);
      products = [];
      return;
    }
    const result = await Promise.all([
      jsonRequest("/api/categories").catch(function () { return categories; }),
      jsonRequest("/api/products").catch(function () { return []; })
    ]);
    categoryState = withCategoryDetails(result[0]);
    products = result[1];
  }

  async function loadAdminData() {
    if (!adminSession || !adminSession.authenticated) throw new Error("Entre novamente para continuar.");
    const result = await Promise.all([
      jsonRequest("/api/admin/categories"),
      jsonRequest("/api/admin/products")
    ]);
    categoryState = withCategoryDetails(result[0]);
    products = result[1];
  }

  async function checkAdmin() {
    const session = await jsonRequest("/api/admin/session");
    adminChecked = true;
    adminConfigured = session.configured;
    adminCsrf = session.csrf || "";
    adminSession = session.authenticated ? session : null;
    return session;
  }

  function applySeo(route, product) {
    const title = route.indexOf("/produto/") === 0 && product ? product.name + " | Celular.com" :
      pageTitles[route] || "Página não encontrada | Celular.com";
    document.title = title;
    const description = route.indexOf("/produto/") === 0 && product ?
      (product.description || "Consulte " + product.name + " na Celular.com, loja física em Pomerode-SC.") :
      descriptionMap[route] || "A página solicitada não foi encontrada. Encontre a Celular.com no Centro de Pomerode.";
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute("content", description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDescription) ogDescription.setAttribute("content", description);
    const robots = document.querySelector('meta[name="robots"]');
    const publicRoute = ["/", "/produtos", "/categorias", "/assistencia", "/sobre", "/avaliacoes", "/contato", "/faq"].includes(route);
    const previewMode = document.querySelector('meta[name="preview-mode"]');
    if (robots) robots.setAttribute("content", previewMode && previewMode.content === "true" ? "noindex, nofollow" : route.indexOf("/admin") === 0 || route.indexOf("/produto/") === 0 && !product || !publicRoute && route.indexOf("/produto/") !== 0 ? "noindex, nofollow" : "index, follow");
    const originMeta = document.querySelector('meta[name="site-origin"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (originMeta && originMeta.content && canonical) {
      const url = originMeta.content.replace(/\/+$/, "") + (route === "/" ? "/" : route);
      canonical.setAttribute("href", url);
      if (ogUrl) ogUrl.setAttribute("content", url);
    }
  }

  function productPhoto(item, width) {
    return item.imageUrl || photoUrl(item.categoryId || item.category, width || 850);
  }

  window.categoryCard = function (item, large) {
    return '<a class="category-card ' + (large ? "category-large" : "") + '" href="/produtos?categoria=' + encodeURIComponent(item.id) + '"><span class="category-icon category-photo">' +
      photoTag(photoUrl(item.id, 640), "Imagem demonstrativa da categoria " + item.name.toLowerCase(), "category-photo-image") +
      '<span class="category-photo-icon">' + icon(item.icon || "accessories", 23) + '</span></span><span class="category-info"><h3>' + esc(item.name) +
      '</h3><p>Consulte opções disponíveis na loja.</p></span><span class="category-arrow">' + icon("arrow", 17) + "</span></a>";
  };

  window.productCard = function (item) {
    const categoryName = item.category || cat(item.categoryId).name;
    const src = productPhoto(item);
    return '<article class="product-card" data-card data-category="' + esc(item.categoryId) + '"><div class="product-image">' +
      photoTag(src, item.imageUrl ? "Foto do produto " + item.name : "Imagem demonstrativa de " + categoryName.toLowerCase()) +
      '<span class="demo-tag">' + (item.imageUrl ? "Foto do produto" : "Imagem demonstrativa") + "</span>" +
      (item.featured ? '<span class="featured-tag">Destaque</span>' : "") +
      '</div><div class="product-details"><span class="product-category">' + esc(categoryName) + "</span><h3>" + esc(item.name) + "</h3>" +
      (item.description ? "<p>" + esc(item.description) + "</p>" : "") +
      '<div class="product-card-foot"><span class="product-price">' + esc(displayPrice(item)) + '</span><a class="button-link" href="tel:+554733808696">Consultar ' + icon("phoneCall", 16) + "</a></div></div></article>";
  };

  window.map = function () {
    return '<div class="map-card map-live"><iframe title="Mapa da localização da Celular.com em Pomerode" src="' + MAP_EMBED +
      '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
  };

  window.home = function () {
    const holder = document.createElement("div");
    holder.innerHTML = originalHome();
    const featured = products.filter(function (product) { return product.active && product.featured; }).slice(0, 3);
    const featuredHtml = '<section class="section featured-section"><div class="shell"><div class="section-head"><div class="section-head-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>Vitrine da loja</span><h2>Em destaque.</h2><p class="section-subtitle">Consulte disponibilidade e preço diretamente com a equipe.</p></div>' +
      button("/produtos", "Ver produtos", "button-link", "arrow") + '</div>' +
      (featured.length ? '<div class="product-grid">' + featured.map(productCard).join("") + '</div>' :
        '<div class="featured-empty"><span class="category-icon">' + icon("box", 22) + '</span><div><strong>Nenhum produto em destaque cadastrado.</strong><p>Ligue para a loja para consultar as opções disponíveis.</p></div><a class="button-link" href="tel:+554733808696">Consultar ' + icon("arrow", 15) + "</a></div>") +
      "</div></section>";
    const showcase = holder.querySelector(".showcase");
    if (showcase) {
      const section = document.createElement("div");
      section.innerHTML = featuredHtml;
      const existingSection = showcase.closest(".section-tight");
      existingSection.parentNode.insertBefore(section.firstElementChild, existingSection);
    }
    const location = holder.querySelector(".location-band");
    if (location) {
      const shell = location.closest(".shell");
      const mapWrap = document.createElement("div");
      mapWrap.className = "home-map-wrap";
      mapWrap.innerHTML = map();
      shell.appendChild(mapWrap);
    }
    return holder.innerHTML;
  };

  window.productsPage = function () {
    const requested = new URLSearchParams(location.search).get("categoria");
    const selected = categoryState.some(function (category) { return category.id === requested; }) ? requested : "todos";
    filter = selected;
    const options = [["todos", "Todos"]].concat(categoryState.map(function (category) { return [category.id, category.name]; }));
    const visible = products.filter(function (product) {
      const categoryMatch = selected === "todos" || product.categoryId === selected;
      const searchMatch = (product.name + " " + (product.description || "") + " " + (product.category || "")).toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
      return product.active && categoryMatch && searchMatch;
    });
    return '<main id="main">' + intro("Produtos", "Consulte os produtos da loja.", "Veja os itens cadastrados pela Celular.com e confirme disponibilidade e preço diretamente com a equipe.") +
      '<section class="content-section"><div class="shell"><div class="catalog-toolbar"><div class="filter-list" role="group" aria-label="Filtrar produtos por categoria">' +
      options.map(function (item) { return '<a class="filter-btn' + (selected === item[0] ? " is-current" : "") + '" href="' + (item[0] === "todos" ? "/produtos" : "/produtos?categoria=" + encodeURIComponent(item[0])) + '"' + (selected === item[0] ? ' aria-current="true"' : "") + ">" + esc(item[1]) + "</a>"; }).join("") +
      '</div><label class="search-field">' + icon("search", 17) + '<span class="sr-only">Buscar produtos</span><input id="product-search" type="search" placeholder="Buscar produto..." value="' + esc(search) + '"></label></div>' +
      '<p class="result-count">' + visible.length + (visible.length === 1 ? " produto" : " produtos") + "</p>" +
      (visible.length ? '<div class="product-grid">' + visible.map(productCard).join("") + "</div>" :
        '<div class="empty-state"><h3>Consulte as opções disponíveis.</h3><p>' + (products.length ? "Não há produtos cadastrados nesta seleção." : "Não há produtos cadastrados na vitrine neste momento. Ligue para confirmar as opções disponíveis na loja.") + '</p><a class="button button-dark button-small" href="tel:+554733808696">' + icon("phoneCall", 15) + "Ligar para a loja</a>" + (selected !== "todos" ? '<a class="button button-outline button-small" href="/produtos">Ver todos os produtos</a>' : "") + "</div>") +
      '<p class="service-disclaimer">As imagens demonstrativas são ilustrativas. Confirme produto, disponibilidade e preço diretamente com a loja. A Celular.com não realiza entregas.</p></div></section></main>';
  };

  window.categoriesPage = function () {
    return '<main id="main">' + intro("Explore a loja", "Categorias para o seu dispositivo.", "Veja as principais categorias da Celular.com e consulte quais opções estão disponíveis para o seu aparelho.") +
      '<section class="content-section"><div class="shell"><div class="category-page-grid">' + categoryState.map(function (category) { return categoryCard(category, true); }).join("") +
      '</div><p class="service-disclaimer">Imagens demonstrativas das categorias. Os produtos disponíveis precisam ser confirmados com a loja.</p></div></section></main>';
  };

  window.assistancePage = function () {
    return '<main id="main">' + intro("Assistência", "Assistência para dispositivos móveis.", "A Celular.com informa assistência para dispositivos móveis. Entre em contato para confirmar se pode atender à sua necessidade.") +
      '<section class="content-section"><div class="shell"><div class="assistance-feature"><div class="assistance-photo">' +
      photoTag(photoUrl("acessorios", 1100), "Imagem demonstrativa de cuidado técnico com um dispositivo móvel", "assistance-photo-image") +
      '</div><div class="assistance-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>Fale com a equipe</span><h2>Conte o que seu aparelho precisa.</h2>' +
      '<p>Os serviços específicos, prazos e valores precisam ser confirmados diretamente com a loja.</p>' + button(PHONE_LINK, "Ligar para consultar", "button-dark", "phoneCall") +
      "</div></div></div></section></main>";
  };

  window.contactPage = function () {
    return '<main id="main">' + intro("Contato", "Fale com a Celular.com.", "Consulte produtos e assistência por telefone ou visite a loja física no Centro de Pomerode.") +
      '<section class="content-section"><div class="shell"><div class="contact-layout"><div class="contact-stack">' +
      '<article class="contact-card"><span class="contact-icon">' + icon("phoneCall", 20) + '</span><div><h3>Telefone</h3><a class="address-link" href="' + PHONE_LINK + '">' + PHONE + "</a></div></article>" +
      '<article class="contact-card"><span class="contact-icon">' + icon("pin", 20) + '</span><div><h3>Endereço</h3><p>' + ADDRESS + "</p></div></article>" +
      map() + button(MAP_URL, "Como chegar", "button-outline", "external") + '</div><div class="contact-form-card contact-call-card">' +
      '<span class="eyebrow"><span class="eyebrow-dot"></span>Atendimento direto</span><h2>Converse com a equipe.</h2>' +
      "<p>Ligue para confirmar a disponibilidade de produtos ou consultar a assistência antes da sua visita.</p>" +
      button(PHONE_LINK, "Ligar para " + PHONE, "button-dark", "phoneCall") +
      '<div class="contact-data-note">Loja física · Centro de Pomerode · Sem entregas</div></div></div></div></section></main>';
  };

  window.productDetail = function (id) {
    const item = products.find(function (product) { return product.id === id && product.active; });
    if (!item) return notFound(true);
    const categoryName = item.category || cat(item.categoryId).name;
    return '<main id="main"><section class="page-intro"><div class="shell"><div class="breadcrumb"><a href="/">Início</a>' + icon("right", 13) +
      '<a href="/produtos">Produtos</a>' + icon("right", 13) + "<span>" + esc(item.name) + "</span></div></div></section>" +
      '<section class="content-section"><div class="shell"><div class="detail-layout"><div class="detail-image">' +
      photoTag(productPhoto(item, 1100), item.imageUrl ? "Foto de " + item.name : "Imagem demonstrativa de " + categoryName.toLowerCase()) +
      '<span class="demo-tag">' + (item.imageUrl ? "Foto do produto" : "Imagem demonstrativa") + "</span></div><div class=\"detail-copy\">" +
      '<span class="eyebrow"><span class="eyebrow-dot"></span>' + esc(categoryName) + "</span><h1>" + esc(item.name) + "</h1>" +
      "<p>" + esc(item.description || "") + '</p><div class="detail-note">Disponibilidade sob consulta. Confirme preço e detalhes com a loja física.</div>' +
      '<ul class="detail-list"><li>' + icon("pin", 16) + "Atendimento na loja física em Pomerode</li><li>" + icon("phoneCall", 16) + "Informações diretamente com a equipe</li></ul>" +
      '<strong class="detail-price">' + esc(displayPrice(item)) + '</strong><div class="detail-actions">' +
      button(PHONE_LINK, "Consultar com a loja", "button-dark", "phoneCall") + button("/produtos", "Voltar aos produtos", "button-outline") +
      "</div></div></div></div></section></main>";
  };

  window.imagesAdmin = function () {
    const cards = products.map(function (product) {
      return '<article class="admin-image-card"><div class="admin-image-preview">' +
        photoTag(productPhoto(product, 600), product.imageUrl ? "Foto de " + product.name : "Imagem demonstrativa de " + String(product.category || "").toLowerCase()) +
        '<span>' + (product.imageUrl ? "Foto cadastrada" : "Imagem demonstrativa") + '</span></div><div class="admin-image-meta"><strong>' +
        esc(product.name) + "</strong><small>" + esc(product.category || cat(product.categoryId).name) + '</small><button class="button button-outline button-small" type="button" data-action="edit-product" data-id="' +
        esc(product.id) + '">' + icon("image", 14) + (product.imageUrl ? "Substituir ou remover foto" : "Adicionar foto") + "</button></div></article>";
    }).join("");
    return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Imagens por produto</h2><p>Envie uma foto real ou mantenha a imagem demonstrativa automática.</p></div></div>' +
      (cards ? '<div class="admin-image-grid">' + cards + "</div>" : '<div class="empty-state"><h3>Nenhum produto cadastrado</h3><p>Cadastre um produto primeiro. Depois, você poderá adicionar uma foto individual.</p><a class="button button-outline button-small" href="/admin/produtos">Ir para produtos ' + icon("arrow", 15) + "</a></div>") + "</section>";
  };

  window.notFound = function (detail) {
    return '<main id="main" class="not-found"><div class="shell not-found-layout"><div class="not-found-card"><div class="not-found-number">404</div><h1>' +
      (detail ? "Produto não encontrado" : "Esta página não foi encontrada") + "</h1><p>" +
      (detail ? "Volte ao catálogo e consulte os produtos cadastrados pela loja." : "O endereço não encontrou conexão. Volte ao início para continuar explorando.") +
      '<div class="not-found-actions">' + button("/", "Voltar para o início", "button-dark", "arrow") + "</div></div>" +
      '<div class="not-found-phone" aria-hidden="true"><div class="not-found-phone-screen"><span class="not-found-signal"></span><strong>404</strong><small>procurando sinal…</small></div></div></div></main>';
  };

  window.productsAdmin = function () {
    const rows = products.map(function (product) {
      return '<tr data-admin-product="' + esc(product.id) + '"><td><div class="table-product"><span class="table-thumb">' +
        photoTag(productPhoto(product, 240), "") + "</span><span><strong>" + esc(product.name) + "</strong><span>" +
        esc(product.category || cat(product.categoryId).name) + "</span></span></div></td><td>" + esc(displayPrice(product)) +
        '</td><td><button class="toggle-switch" type="button" role="switch" aria-checked="' + product.active + '" aria-label="' +
        (product.active ? "Desativar " : "Ativar ") + esc(product.name) + '" data-action="toggle-product" data-id="' + esc(product.id) + '"></button></td><td>' +
        '<button class="icon-button' + (product.featured ? " is-active" : "") + '" type="button" aria-label="' +
        (product.featured ? "Remover destaque de " : "Destacar ") + esc(product.name) + '" aria-pressed="' + product.featured +
        '" data-action="feature-product" data-id="' + esc(product.id) + '">' + icon("star", 14) + "</button></td><td><div class=\"admin-row-actions\">" +
        '<button class="icon-button" type="button" aria-label="Editar ' + esc(product.name) + '" data-action="edit-product" data-id="' + esc(product.id) + '">' +
        icon("edit", 14) + '</button><button class="icon-button" type="button" aria-label="Excluir ' + esc(product.name) + '" data-action="delete-product" data-id="' +
        esc(product.id) + '">' + icon("trash", 14) + "</button></div></td></tr>";
    }).join("") || '<tr><td colspan="5">Nenhum produto cadastrado. Adicione um produto para começar.</td></tr>';
    return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Produtos da vitrine</h2><p>' + products.length +
      (products.length === 1 ? " produto cadastrado" : " produtos cadastrados") + '</p></div><button class="button button-dark button-small" data-action="add-product" type="button">' +
      icon("plus", 16) + "Adicionar produto</button></div><div class=\"catalog-toolbar\"><div class=\"mini-label\">Preço opcional · disponibilidade sob consulta</div>" +
      '<label class="search-field admin-search">' + icon("search", 17) + '<span class="sr-only">Buscar no painel</span><input id="admin-product-search" type="search" placeholder="Buscar produto..."></label></div>' +
      '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>PRODUTO</th><th>PREÇO</th><th>STATUS</th><th>DESTAQUE</th><th>AÇÕES</th></tr></thead><tbody>' + rows + "</tbody></table></div></section>";
  };

  window.categoriesAdmin = function () {
    const rows = categoryState.map(function (category) {
      const count = products.filter(function (product) { return product.categoryId === category.id; }).length;
      return '<tr><td><div class="table-product"><span class="category-icon category-admin-icon">' + icon(category.icon || "accessories", 16) +
        '</span><span><strong>' + esc(category.name) + "</strong><span>" + count + (count === 1 ? " produto" : " produtos") +
        '</span></span></div></td><td><div class="admin-row-actions"><button class="icon-button" type="button" aria-label="Editar categoria ' +
        esc(category.name) + '" data-action="edit-category" data-id="' + esc(category.id) + '">' + icon("edit", 14) +
        '</button><button class="icon-button" type="button" aria-label="Excluir categoria ' + esc(category.name) +
        '" data-action="delete-category" data-id="' + esc(category.id) + '">' + icon("trash", 14) + "</button></div></td></tr>";
    }).join("") || '<tr><td colspan="2">Nenhuma categoria cadastrada.</td></tr>';
    return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Categorias do catálogo</h2><p>Crie e edite as categorias da vitrine.</p></div>' +
      '<button class="button button-dark button-small" type="button" data-action="add-category">' + icon("plus", 16) + "Adicionar categoria</button></div>" +
      '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>CATEGORIA</th><th>AÇÕES</th></tr></thead><tbody>' + rows + "</tbody></table></div></section>";
  };

  window.adminShell = function (content, current, heading, section) {
    return '<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-side-brand">' + brand() +
      '<div><strong>Administração</strong>Celular.com</div></div><p class="admin-nav-label">Gerenciar</p><nav class="admin-nav" aria-label="Navegação do painel">' +
      adminNav("Visão geral", "/admin", "chart", current) + adminNav("Produtos", "/admin/produtos", "box", current) +
      adminNav("Categorias", "/admin/categorias", "grid", current) + adminNav("Imagens", "/admin/imagens", "image", current) +
      adminNav("Configurações da conta", "/admin/conta", "user", current) +
      '</nav><div class="admin-side-bottom"><p class="admin-nav-label">Site</p><nav class="admin-nav">' + adminNav("Ver página inicial", "/", "eye", current) +
      '<button class="admin-logout" type="button" data-action="logout">' + icon("power", 16) + "<span>Sair do painel</span></button></nav></div></aside>" +
      '<main class="admin-main" id="main"><div class="admin-topline"><div class="admin-topline-copy"><span>Celular.com / ' + section +
      "</span><h1>" + heading + '</h1></div><div class="admin-user"><span class="admin-avatar">' +
      esc((adminSession && adminSession.username || "A").slice(0, 1).toUpperCase()) + "</span>" + esc(adminSession && adminSession.username || "Administrador") +
      '</div></div><div class="admin-status-banner">' + icon("info", 17) + "<span>As alterações são salvas no catálogo do site.</span></div>" + content + "</main></div>";
  };

  window.loginPage = function () {
    return '<main id="main" class="login-shell"><section class="login-aside">' + brand() +
      '<div class="login-aside-content"><span class="eyebrow"><span class="eyebrow-dot"></span>Área administrativa</span><h1>Cuide da vitrine da Celular.com.</h1>' +
      "<p>Atualize produtos, categorias e imagens da loja em um painel protegido.</p></div><div class=\"login-aside-foot\">Celular.com · Pomerode - SC</div></section>" +
      '<section class="login-panel"><form class="login-card" id="login-form"><span class="eyebrow"><span class="eyebrow-dot"></span>Acesso restrito</span><h2>Entrar no painel</h2>' +
      '<p class="login-error" id="login-error" role="status" aria-live="polite"></p>' +
      (adminConfigured ? '<p>Use a conta administrativa criada no servidor.</p><div class="field"><label for="admin-user">Usuário</label><input id="admin-user" name="username" autocomplete="username" required maxlength="40"></div>' +
        '<div class="field"><label for="admin-password">Senha</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required maxlength="256"></div>' +
        '<button class="button button-dark" type="submit">Entrar no painel ' + icon("arrow", 17) + "</button>" :
        '<div class="login-demo-note"><strong>Primeiro acesso</strong><p>Execute <code>npm run admin:create</code> no terminal para configurar a conta inicial. A senha será solicitada sem aparecer na tela e armazenada apenas como hash.</p></div>') +
      '<div class="login-back"><a class="button-link" href="/">← Voltar ao site</a></div></form></section></main>';
  };

  function updateCatalogNow() {
    const cards = Array.from(document.querySelectorAll("[data-card]"));
    let count = 0;
    cards.forEach(function (card) {
      const match = (filter === "todos" || card.dataset.category === filter) &&
        card.textContent.toLocaleLowerCase("pt-BR").indexOf(search.toLocaleLowerCase("pt-BR")) !== -1;
      card.hidden = !match;
      if (match) count += 1;
    });
    const result = document.querySelector(".result-count");
    if (result) result.textContent = count + (count === 1 ? " produto" : " produtos");
  }

  function productModalLive(item) {
    const editing = Boolean(item);
    const options = categoryState.map(function (category) {
      return '<option value="' + esc(category.id) + '"' + (item && item.categoryId === category.id ? " selected" : "") + ">" + esc(category.name) + "</option>";
    }).join("");
    const price = item && item.price !== null && item.price !== undefined ? String(item.price) : "";
    const currentPhoto = item && item.imageUrl ? '<div class="live-current-image">' + photoTag(item.imageUrl, "Foto atual de " + item.name) +
      '<button class="button-link" type="button" data-action="remove-product-image" data-id="' + esc(item.id) + '">Remover foto e usar imagem demonstrativa</button></div>' :
      '<p class="form-note">Sem foto real, será usada uma imagem demonstrativa.</p>';
    dialog.innerHTML = '<form class="modal-content" id="product-form"><div class="modal-head"><div><span class="eyebrow">Catálogo</span><h2>' +
      (editing ? "Editar produto" : "Adicionar produto") + "</h2></div><button class=\"modal-close\" type=\"button\" data-action=\"close\" aria-label=\"Fechar\">" +
      icon("close", 16) + '</button></div><div class="modal-body"><div class="field"><label for="modal-name">Nome</label><input id="modal-name" name="name" maxlength="100" required value="' +
      esc(item && item.name || "") + '" placeholder="Nome do produto"></div><div class="field"><label for="modal-category">Categoria</label><select id="modal-category" name="categoryId" required>' +
      options + '</select></div><div class="field"><label for="modal-description">Descrição <span class="optional-label">opcional</span></label><textarea id="modal-description" name="description" maxlength="500" placeholder="Informação útil para o cliente">' +
      esc(item && item.description || "") + '</textarea></div><div class="field"><label for="modal-price">Preço em reais <span class="optional-label">opcional</span></label><input id="modal-price" name="price" type="number" min="0" step="0.01" inputmode="decimal" value="' +
      esc(price) + '" placeholder="Deixe em branco para mostrar “Consultar preço”"></div><div class="field"><label for="modal-image">Foto do produto <span class="optional-label">JPG, PNG ou WebP · até 8 MB</span></label><input id="modal-image" name="image" type="file" accept="image/jpeg,image/png,image/webp">' +
      currentPhoto + '</div><div class="form-grid"><label class="contact-card live-check"><input type="checkbox" name="active"' + (!item || item.active ? " checked" : "") +
      '>Produto ativo</label><label class="contact-card live-check"><input type="checkbox" name="featured"' + (item && item.featured ? " checked" : "") +
      '>Produto em destaque</label></div><p class="live-form-error" id="product-form-error" role="status" aria-live="polite"></p></div><div class="modal-actions"><button class="button button-outline button-small" type="button" data-action="close">Cancelar</button><button class="button button-dark button-small" type="submit">' +
      (editing ? "Salvar alterações" : "Adicionar produto") + "</button></div></form>";
    dialog.dataset.mode = editing ? "edit-product" : "add-product";
    dialog.dataset.id = editing ? item.id : "";
    dialog.dataset.savedId = "";
    imageFallback(dialog);
    showDialog();
  }

  function categoryModalLive(item) {
    const editing = Boolean(item);
    dialog.innerHTML = '<form class="modal-content" id="category-form"><div class="modal-head"><div><span class="eyebrow">Organização do catálogo</span><h2>' +
      (editing ? "Editar categoria" : "Adicionar categoria") + '</h2></div><button class="modal-close" type="button" data-action="close" aria-label="Fechar">' +
      icon("close", 16) + '</button></div><div class="modal-body"><div class="field"><label for="category-name">Nome</label><input id="category-name" name="name" required maxlength="50" value="' +
      esc(item && item.name || "") + '" placeholder="Nome da categoria"></div><p class="live-form-error" id="category-form-error" role="status" aria-live="polite"></p></div>' +
      '<div class="modal-actions"><button class="button button-outline button-small" type="button" data-action="close">Cancelar</button><button class="button button-dark button-small" type="submit">' +
      (editing ? "Salvar categoria" : "Adicionar categoria") + "</button></div></form>";
    dialog.dataset.mode = editing ? "edit-category" : "add-category";
    dialog.dataset.id = editing ? item.id : "";
    showDialog();
  }

  async function refreshAdmin(route) {
    await loadAdminData();
    window.render(route);
  }

  window.render = function (forcedRoute) {
    const current = forcedRoute || currentRoute();
    let out = "";
    let currentProduct = null;
    if (current.indexOf("/admin") === 0) {
      if (current === "/admin/login") {
        if (adminSession && adminSession.authenticated) {
          history.replaceState({}, "", "/admin");
          return window.render("/admin");
        }
        out = loginPage();
      } else if (!adminSession || !adminSession.authenticated) {
        history.replaceState({}, "", "/admin/login");
        out = loginPage();
      } else if (current === "/admin") out = adminShell(dashboard(), current, "Dashboard", "Visão geral");
      else if (current === "/admin/produtos") out = adminShell(productsAdmin(), current, "Produtos", "Catálogo");
      else if (current === "/admin/categorias") out = adminShell(categoriesAdmin(), current, "Categorias", "Organização");
      else if (current === "/admin/imagens") out = adminShell(imagesAdmin(), current, "Imagens", "Mídia");
      else if (current === "/admin/conta") out = adminShell(accountSettings(), current, "Configurações da conta", "Conta");
      else out = header(current) + notFound(false) + footer();
    } else if (current === "/") out = header(current) + home() + footer();
    else if (current === "/produtos") out = header(current) + productsPage() + footer();
    else if (current === "/categorias") out = header(current) + categoriesPage() + cta() + footer();
    else if (current === "/assistencia") out = header(current) + assistancePage() + cta() + footer();
    else if (current === "/sobre") out = header(current) + aboutPage() + cta() + footer();
    else if (current === "/avaliacoes") out = header(current) + reviewsPage() + footer();
    else if (current === "/contato") out = header(current) + contactPage() + footer();
    else if (current === "/faq") out = header(current) + faqPage() + footer();
    else if (current.indexOf("/produto/") === 0) {
      currentProduct = products.find(function (product) { return product.id === decodeURIComponent(current.split("/").pop()) && product.active; });
      out = header("/produtos") + productDetail(decodeURIComponent(current.split("/").pop())) + footer();
    } else out = header(current) + notFound(false) + footer();
    app.innerHTML = out;
    applySeo(current, currentProduct);
    imageFallback(app);
    if (current === "/produtos") updateCatalogNow();
    if (current === "/admin/produtos") filterAdmin();
    window.scrollTo(0, 0);
  };

  window.go = async function (href) {
    const target = new URL(href, location.origin);
    if (target.origin !== location.origin) {
      location.assign(target.href);
      return;
    }
    const route = target.pathname.replace(/\/$/, "") || "/";
    if (route.indexOf("/admin") === 0) {
      try {
        const session = await checkAdmin();
        if (route === "/admin/login" && session.authenticated) {
          target.pathname = "/admin";
        } else if (route !== "/admin/login" && !session.authenticated) {
          target.pathname = "/admin/login";
        } else if (session.authenticated && route !== "/admin/login") {
          await loadAdminData();
        }
      } catch {
        target.pathname = "/admin/login";
        adminSession = null;
        adminConfigured = false;
      }
    }
    history.pushState({}, "", target.pathname + target.search + target.hash);
    menuOpen = false;
    filter = new URLSearchParams(target.search).get("categoria") || "todos";
    window.render();
  };

  window.productModal = productModalLive;
  window.categoryModal = categoryModalLive;

  function openLoginAfterFailure(message) {
    const error = document.getElementById("login-error");
    if (error) error.textContent = message;
  }

  document.addEventListener("click", function (event) {
    const anchor = event.target.closest("a[href]");
    if (anchor && anchor.origin === location.origin && !anchor.target &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.go(anchor.getAttribute("href"));
      return;
    }
    const control = event.target.closest("[data-action],[data-filter]");
    if (!control) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (control.hasAttribute("data-filter")) {
      filter = control.dataset.filter;
      window.render();
      return;
    }
    const action = control.dataset.action;
    if (action === "menu") { menuOpen = !menuOpen; window.render(); return; }
    if (action === "faq") {
      const isOpen = control.getAttribute("aria-expanded") === "true";
      control.setAttribute("aria-expanded", String(!isOpen));
      control.closest(".faq-item").classList.toggle("is-open", !isOpen);
      return;
    }
    if (action === "clear" || action === "clear-filters") {
      filter = "todos";
      search = "";
      history.replaceState({}, "", "/produtos");
      window.render();
      return;
    }
    if (action === "close") { closeDialog(); return; }
    if (action === "add-product") { productModalLive(null); return; }
    if (action === "edit-product") {
      const product = products.find(function (item) { return item.id === control.dataset.id; });
      if (product) productModalLive(product);
      return;
    }
    if (action === "add-category") { categoryModalLive(null); return; }
    if (action === "edit-category") {
      const category = categoryState.find(function (item) { return item.id === control.dataset.id; });
      if (category) categoryModalLive(category);
      return;
    }
    if (action === "toggle-product" || action === "feature-product") {
      const product = products.find(function (item) { return item.id === control.dataset.id; });
      if (!product) return;
      const updated = Object.assign({}, product, {
        active: action === "toggle-product" ? !product.active : product.active,
        featured: action === "feature-product" ? !product.featured : product.featured
      });
      jsonRequest("/api/admin/products/" + encodeURIComponent(product.id), { method: "PUT", body: JSON.stringify(updated) })
        .then(function () { toast(action === "toggle-product" ? (updated.active ? "Produto ativado." : "Produto desativado.") : "Destaque atualizado."); return refreshAdmin(currentRoute()); })
        .catch(function (error) { toast(error.message); });
      return;
    }
    if (action === "delete-product") {
      const product = products.find(function (item) { return item.id === control.dataset.id; });
      if (!product || !window.confirm("Excluir “" + product.name + "”? Essa ação não pode ser desfeita.")) return;
      jsonRequest("/api/admin/products/" + encodeURIComponent(product.id), { method: "DELETE" })
        .then(function () { toast("Produto excluído."); return refreshAdmin(currentRoute()); })
        .catch(function (error) { toast(error.message); });
      return;
    }
    if (action === "delete-category") {
      const category = categoryState.find(function (item) { return item.id === control.dataset.id; });
      if (!category || !window.confirm("Excluir a categoria “" + category.name + "”?")) return;
      jsonRequest("/api/admin/categories/" + encodeURIComponent(category.id), { method: "DELETE" })
        .then(function () { toast("Categoria excluída."); return refreshAdmin(currentRoute()); })
        .catch(function (error) { toast(error.message); });
      return;
    }
    if (action === "remove-product-image") {
      const id = control.dataset.id;
      jsonRequest("/api/admin/products/" + encodeURIComponent(id) + "/image", { method: "DELETE" })
        .then(function () { closeDialog(); toast("Foto removida; a imagem demonstrativa será usada."); return refreshAdmin(currentRoute()); })
        .catch(function (error) { toast(error.message); });
      return;
    }
    if (action === "logout") {
      jsonRequest("/api/admin/logout", { method: "POST" })
        .then(function () {
          adminSession = null;
          adminCsrf = "";
          toast("Você saiu do painel.");
          history.pushState({}, "", "/admin/login");
          return checkAdmin();
        })
        .then(function () { window.render(); })
        .catch(function (error) { toast(error.message); });
    }
  }, true);

  document.addEventListener("input", function (event) {
    if (event.target.id === "product-search") {
      event.stopImmediatePropagation();
      search = event.target.value;
      updateCatalogNow();
    } else if (event.target.id === "admin-product-search") {
      event.stopImmediatePropagation();
      const value = event.target.value.toLocaleLowerCase("pt-BR");
      document.querySelectorAll("[data-admin-product]").forEach(function (row) {
        row.hidden = row.textContent.toLocaleLowerCase("pt-BR").indexOf(value) < 0;
      });
    }
  }, true);

  document.addEventListener("submit", async function (event) {
    const form = event.target;
    if (!["login-form", "product-form", "category-form", "contact-form", "account-username-form", "account-password-form"].includes(form.id)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.id === "contact-form") {
      toast("Para falar com a loja, ligue para " + PHONE + ".");
      return;
    }
    const data = new FormData(form);
    const submit = form.querySelector('button[type="submit"]');
    const originalLabel = submit && submit.textContent;
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Salvando…";
    }
    try {
      if (form.id === "login-form") {
        const username = String(data.get("username") || "").trim();
        const password = String(data.get("password") || "");
        if (!username || !password) throw new Error("Preencha o usuário e a senha.");
        await jsonRequest("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) });
        await checkAdmin();
        await loadAdminData();
        history.replaceState({}, "", "/admin");
        window.render();
        return;
      }
      if (form.id === "product-form") {
        const name = String(data.get("name") || "").trim();
        if (!name) throw new Error("Informe o nome do produto.");
        const previousId = dialog.dataset.savedId || dialog.dataset.id;
        const body = {
          name: name,
          description: String(data.get("description") || "").trim(),
          categoryId: String(data.get("categoryId") || ""),
          price: String(data.get("price") || "").trim() || null,
          featured: data.has("featured"),
          active: data.has("active")
        };
        const result = await jsonRequest(previousId ? "/api/admin/products/" + encodeURIComponent(previousId) : "/api/admin/products", {
          method: previousId ? "PUT" : "POST",
          body: JSON.stringify(body)
        });
        dialog.dataset.savedId = result.id;
        const file = data.get("image");
        if (file instanceof File && file.size) {
          if (file.size > 8 * 1024 * 1024) throw new Error("A imagem deve ter até 8 MB.");
          const upload = new FormData();
          upload.set("image", file);
          await jsonRequest("/api/admin/products/" + encodeURIComponent(result.id) + "/image", { method: "POST", body: upload });
        }
        closeDialog();
        toast(previousId ? "Produto atualizado." : "Produto adicionado.");
        await refreshAdmin(currentRoute());
        return;
      }
      if (form.id === "category-form") {
        const id = dialog.dataset.id;
        const name = String(data.get("name") || "").trim();
        await jsonRequest(id ? "/api/admin/categories/" + encodeURIComponent(id) : "/api/admin/categories", {
          method: id ? "PUT" : "POST",
          body: JSON.stringify({ name: name })
        });
        closeDialog();
        toast(id ? "Categoria atualizada." : "Categoria adicionada.");
        await refreshAdmin(currentRoute());
      }
      if (form.id === "account-username-form") {
        const username = String(data.get("username") || "").trim();
        const currentPassword = String(data.get("currentPassword") || "");
        await jsonRequest("/api/admin/account/username", {
          method: "POST",
          body: JSON.stringify({ username: username, currentPassword: currentPassword })
        });
        await checkAdmin();
        toast("Login atualizado.");
        window.render(currentRoute());
        return;
      }
      if (form.id === "account-password-form") {
        await jsonRequest("/api/admin/account/password", {
          method: "POST",
          body: JSON.stringify({
            currentPassword: String(data.get("currentPassword") || ""),
            newPassword: String(data.get("newPassword") || ""),
            confirmation: String(data.get("confirmation") || "")
          })
        });
        form.reset();
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalLabel;
        }
        toast("Senha atualizada. As outras sessões foram encerradas.");
        return;
      }
    } catch (error) {
      if (form.id === "login-form") openLoginAfterFailure(error.message);
      else {
        const message = form.querySelector("[data-form-error]") || document.getElementById(form.id === "product-form" ? "product-form-error" : "category-form-error");
        if (message) message.textContent = error.message;
      }
      if (submit) {
        submit.disabled = false;
        submit.textContent = originalLabel;
      }
    }
  }, true);

  window.addEventListener("popstate", async function () {
    const route = currentRoute();
    if (route.indexOf("/admin") === 0) {
      try {
        const session = await checkAdmin();
        if (route !== "/admin/login" && session.authenticated) await loadAdminData();
        if (route !== "/admin/login" && !session.authenticated) {
          history.replaceState({}, "", "/admin/login");
          window.render();
          return;
        }
      } catch {
        history.replaceState({}, "", "/admin/login");
      }
    }
    window.render();
  });

  async function start() {
    app.innerHTML = '<main id="main" class="live-loading" role="status">Carregando Celular.com…</main>';
    try {
      await loadPublicData();
      if (currentRoute().indexOf("/admin") === 0) {
        const session = await checkAdmin();
        if (currentRoute() === "/admin/login" && session.authenticated) history.replaceState({}, "", "/admin");
        else if (currentRoute() !== "/admin/login" && !session.authenticated) history.replaceState({}, "", "/admin/login");
        else if (session.authenticated) await loadAdminData();
      }
      window.render();
      imageFallback(app);
    } catch (error) {
      if (currentRoute().indexOf("/admin") === 0) {
        adminConfigured = false;
        window.render("/admin/login");
        const status = document.getElementById("login-error");
        if (status) status.textContent = "Não foi possível validar o acesso agora. Atualize a página para tentar novamente.";
      } else {
        window.render();
        originalToast(error.message || "Não foi possível carregar a página.");
      }
    }
  }

  start();
})();
