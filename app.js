const IMAGE = '/assets/accessory-preview.svg';
const PHONE = '(47) 3380-8696';
const PHONE_LINK = 'tel:+554733808696';
const ADDRESS = 'R. Luiz Abry, 22 - Sala 04 - Centro, Pomerode - SC, 89107-000';
const MAP_QUERY = encodeURIComponent(ADDRESS);
const MAP_URL = 'https://www.google.com/maps/dir/?api=1&destination=' + MAP_QUERY;
const MAP_EMBED = 'https://maps.google.com/maps?q=' + MAP_QUERY + '&output=embed';
const PHOTO_IDS = {
  capinhas:'photo-1601784551446-20c9e07cdbdb',
  peliculas:'photo-1511707171634-5f897ff02aa9',
  carregadores:'photo-1498049794561-7780e7231661',
  cabos:'photo-1556656793-08538906a9f8',
  fones:'photo-1505740420928-5e560c06d30e',
  suportes:'photo-1605236453806-6ff36851218e',
  acessorios:'photo-1498049794561-7780e7231661',
  outros:'photo-1511707171634-5f897ff02aa9'
};
const app = document.getElementById('app');
const dialog = document.getElementById('form-dialog');
const toastRegion = document.getElementById('toast-region');

const paths = {
  phone:'<rect x="6" y="2.5" width="12" height="19" rx="2.4"/><path d="M10 18.5h4"/>',
  case:'<rect x="5" y="3" width="14" height="18" rx="3"/><circle cx="9" cy="7" r="1"/><circle cx="13" cy="7" r="1"/><circle cx="9" cy="11" r="1"/><path d="M9 15h6"/>',
  shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  cable:'<path d="M7 2v5m10-5v5M5 7h14v3a7 7 0 0 1-7 7v5"/><path d="M9 7V4h6v3"/>',
  headphones:'<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="2" y="13" width="5" height="8" rx="2"/><rect x="17" y="13" width="5" height="8" rx="2"/>',
  plug:'<path d="M12 22v-5m-5-7V3m10 7V3M5 10h14v2a7 7 0 0 1-14 0v-2Z"/>',
  stand:'<path d="M5 4h14v9H5z"/><path d="M12 13v5m-4 3h8l-4-3-4 3Z"/>',
  accessories:'<circle cx="12" cy="12" r="9"/><path d="M8 12h8m-4-4v8"/>',
  repair:'<path d="m14.7 6.3 3 3M5 19l8.6-8.6a4 4 0 0 0 5.2-5.2l-2.5 2.5-3-3L15.8 2a4 4 0 0 0-5.2 5.2L2 15.8V22h6.2L5 18.8"/>',
  pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  star:'<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.4l6-.9L12 3Z"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',
  right:'<path d="m9 18 6-6-6-6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m18 6-12 12M6 6l12 12"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  plus:'<path d="M12 5v14m-7-7h14"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/>',
  trash:'<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  box:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/>',
  grid:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  sparkle:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/>',
  power:'<path d="M12 2v10m6.4-6.4a9 9 0 1 1-12.8 0"/>',
  user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  upload:'<path d="M12 16V4m-5 5 5-5 5 5"/><path d="M4 20h16"/>',
  imageOff:'<path d="m2 2 20 20M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A11 11 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a10 10 0 0 0 3-.5"/>',
  external:'<path d="M14 3h7v7m0-7L10 14"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  chart:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
  phoneCall:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>'
};
function icon(name, size, extra) {
  return '<svg class="' + (extra || '') + '" width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || paths.sparkle) + '</svg>';
}
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
const categories = [
  {id:'capinhas',name:'Capinhas',icon:'case'},
  {id:'peliculas',name:'Películas',icon:'shield'},
  {id:'carregadores',name:'Carregadores',icon:'plug'},
  {id:'cabos',name:'Cabos',icon:'cable'},
  {id:'fones',name:'Fones',icon:'headphones'},
  {id:'suportes',name:'Suportes',icon:'stand'},
  {id:'acessorios',name:'Acessórios',icon:'accessories'},
  {id:'outros',name:'Outros',icon:'sparkle'}
];
let categoryState = [];
let products = [];
let adminSession = null;
let adminChecked = false;
let adminCsrf = '';
let adminConfigured = false;
const reviews = [
  'Loja com excelente atendimento e preço justo.',
  'A melhor assistência da cidade😁',
  'São bons de negociação.',
  'Tive uma experiência boa e com um ótimo atendimento.',
  'Atendimento muito bom e preço justo'
];
const faq = [
  ['Quais produtos estão disponíveis na loja?','A disponibilidade pode mudar. Consulte os produtos cadastrados no site ou ligue para confirmar antes de visitar.'],
  ['Que tipos de acessórios encontro?','A Celular.com atua com acessórios para dispositivos móveis. Consulte as categorias e fale com a loja sobre as opções disponíveis para o seu aparelho.'],
  ['A Celular.com faz assistência técnica?','A loja informa assistência para dispositivos móveis. Entre em contato para confirmar se pode atender à sua necessidade.'],
  ['Como consulto os preços?','Quando um preço estiver cadastrado, ele aparece no produto. Se mostrar “Consultar preço”, ligue para a loja para saber o valor.'],
  ['Onde fica a loja e como confirmo o atendimento?','A loja fica na R. Luiz Abry, 22 - Sala 04, Centro de Pomerode-SC. Ligue para (47) 3380-8696 para falar com a equipe.']
];
let filter = 'todos';
let search = '';
let menuOpen = false;
const titleMap = {'/':'Celular.com | Acessórios para celular em Pomerode','/produtos':'Produtos | Celular.com Pomerode','/categorias':'Categorias de acessórios | Celular.com','/assistencia':'Assistência para dispositivos móveis | Celular.com','/sobre':'Sobre a Celular.com | Pomerode','/avaliacoes':'Avaliações | Celular.com Pomerode','/contato':'Contato e localização | Celular.com','/faq':'Perguntas frequentes | Celular.com','/admin':'Administração | Celular.com','/admin/login':'Login administrativo | Celular.com','/admin/produtos':'Produtos | Administração Celular.com','/admin/categorias':'Categorias | Administração Celular.com','/admin/imagens':'Imagens | Administração Celular.com','/admin/conta':'Configurações da conta | Administração Celular.com'};
const descriptionMap = {
  '/':'Acessórios para dispositivos móveis em Pomerode-SC. Consulte produtos e fale com a Celular.com.',
  '/produtos':'Consulte os produtos cadastrados pela Celular.com e confirme a disponibilidade diretamente com a loja em Pomerode.',
  '/categorias':'Explore categorias de acessórios para dispositivos móveis na Celular.com, no Centro de Pomerode.',
  '/assistencia':'Entre em contato com a Celular.com para consultar a assistência disponível para dispositivos móveis em Pomerode.',
  '/sobre':'Conheça a Celular.com, loja física de acessórios para dispositivos móveis no Centro de Pomerode-SC.',
  '/avaliacoes':'Veja as avaliações fornecidas para a Celular.com: nota 4,4 de 5 com 54 avaliações.',
  '/contato':'Telefone, endereço e como chegar à loja física Celular.com em Pomerode-SC.',
  '/faq':'Informações sobre produtos, acessórios, assistência, preços e localização da Celular.com.',
  '/admin/conta':'Altere com segurança o login e a senha da conta administrativa.'
};
function photoUrl(categoryId, width) {
  const photo = PHOTO_IDS[categoryId] || PHOTO_IDS.acessorios;
  return 'https://images.unsplash.com/' + photo + '?auto=format&fit=crop&w=' + (width || 800) + '&q=78';
}
function photoTag(src, alt, className) {
  return '<img class="' + (className || '') + '" src="' + esc(src) + '" alt="' + esc(alt) + '" data-fallback="' + IMAGE + '" loading="lazy" decoding="async">';
}
function displayPrice(product) {
  return product.price === null || product.price === undefined || product.price === '' ? 'Consultar preço' :
    'R$ ' + Number(product.price).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function path() { return decodeURI(location.pathname.replace(/\/$/,'') || '/'); }
function cat(id) { return categoryState.find(function(c) { return c.id === id; }) || categories.find(function(c) { return c.id === id; }) || {name:'Acessórios',icon:'accessories'}; }
function brand() { return '<a class="brand" href="/" aria-label="Celular.com, início"><span class="brand-mark">' + icon('phone',21) + '</span><span>Celular<span class="brand-dot">.com</span></span></a>'; }
function button(href,label,style,ico,extra) { return '<a class="button ' + (style || '') + ' ' + (extra || '') + '" href="' + href + '">' + (ico ? icon(ico,17) : '') + '<span>' + label + '</span></a>'; }
const nav = [['Início','/'],['Produtos','/produtos'],['Categorias','/categorias'],['Assistência','/assistencia'],['Sobre','/sobre'],['Avaliações','/avaliacoes'],['Contato','/contato']];
function header(current) {
  const links = nav.map(function(item) {
    const active = current === item[1] || (item[1] === '/produtos' && current.indexOf('/produto/') === 0);
    return '<a href="' + item[1] + '"' + (active ? ' aria-current="page"' : '') + '>' + item[0] + '</a>';
  }).join('');
  return '<header class="site-header"><div class="shell header-inner">' + brand() + '<nav id="primary-nav" class="main-nav' + (menuOpen ? ' is-open' : '') + '" aria-label="Navegação principal">' + links + '</nav><div class="header-actions">' + button(PHONE_LINK,'Falar conosco','button-small','phoneCall') + '<button class="menu-toggle" type="button" data-action="menu" aria-label="' + (menuOpen ? 'Fechar menu' : 'Abrir menu') + '" aria-expanded="' + menuOpen + '" aria-controls="primary-nav">' + icon(menuOpen ? 'close':'menu',20) + '</button></div></div></header>';
}
function footer() {
  return '<footer class="site-footer"><div class="shell"><div class="footer-main"><div>' + brand() + '<p class="footer-brand-copy">Acessórios para dispositivos móveis, assistência e atendimento na loja física em Pomerode.</p></div><div class="footer-col"><h3>Explore</h3><a href="/produtos">Produtos</a><a href="/categorias">Categorias</a><a href="/assistencia">Assistência</a><a href="/sobre">Sobre a loja</a></div><div class="footer-col"><h3>Informações</h3><a href="/avaliacoes">Avaliações</a><a href="/contato">Contato</a><a href="/faq">FAQ</a><a href="/admin/login">Acesso administrativo</a></div><div class="footer-col"><h3>Visite a loja</h3><div class="footer-address">' + ADDRESS + '</div><a href="' + PHONE_LINK + '">' + PHONE + '</a><span>Loja física · sem entregas</span></div></div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Celular.com · Pomerode-SC</span><a href="/faq">Dúvidas frequentes</a></div></div></footer>';
}
function intro(kicker,title,description) {
  return '<section class="page-intro"><div class="shell"><div class="breadcrumb"><a href="/">Início</a>' + icon('right',13) + '<span>' + kicker + '</span></div><span class="eyebrow"><span class="eyebrow-dot"></span>' + kicker + '</span><h1 class="page-heading">' + title + '</h1><p class="page-description">' + description + '</p></div></section>';
}
function stars(n) {
  return '<span class="stars" aria-label="Avaliação geral 4,4 de 5">' + [0,1,2,3].map(function() { return icon('star',n || 15); }).join('') + '<span class="star-partial">' + icon('star',n || 15) + '</span></span>';
}
function categoryCard(item,large) {
  return '<a class="category-card ' + (large ? 'category-large' : '') + '" href="/produtos?categoria=' + encodeURIComponent(item.id) + '"><span class="category-icon category-photo">' + photoTag(photoUrl(item.id,640),'Imagem demonstrativa da categoria ' + item.name.toLowerCase(),'category-photo-image') + '<span>' + icon(item.icon,23) + '</span></span><span class="category-info"><h3>' + esc(item.name) + '</h3><p>Consulte opções disponíveis na loja.</p></span><span class="category-arrow">' + icon('arrow',17) + '</span></a>';
}
function productCard(item) {
  const src = item.imageUrl || photoUrl(item.categoryId || item.category,800);
  const alt = item.imageUrl ? 'Foto do produto ' + item.name : 'Imagem demonstrativa de ' + cat(item.categoryId || item.category).name.toLowerCase();
  return '<article class="product-card" data-card data-category="' + esc(item.categoryId || item.category) + '"><div class="product-image">' + photoTag(src,alt) + '<span class="demo-tag">' + (item.imageUrl ? 'Foto do produto' : 'Imagem demonstrativa') + '</span>' + (item.featured ? '<span class="featured-tag">Destaque</span>' : '') + '</div><div class="product-details"><span class="product-category">' + esc(item.category || cat(item.categoryId || item.category).name) + '</span><h3>' + esc(item.name) + '</h3>' + (item.description ? '<p>' + esc(item.description) + '</p>' : '') + '<div class="product-card-foot"><span class="product-price">' + esc(displayPrice(item)) + '</span><a class="button-link" href="tel:+554733808696">Consultar ' + icon('phoneCall',16) + '</a></div></div></article>';
}
function cta() {
  return '<section class="section-tight"><div class="shell"><div class="cta-panel"><div class="cta-copy"><h2>Precisa de uma orientação?</h2><p>Fale com a equipe da Celular.com ou visite a loja física em Pomerode.</p></div>' + button(PHONE_LINK,'Falar com a loja','button-dark','phoneCall') + '</div></div></section>';
}
function map() {
  return '<div class="map-card map-live"><iframe title="Mapa da localização da Celular.com em Pomerode" src="' + MAP_EMBED + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>';
}
function home() {
  const homeCats = categoryState.filter(function(c) { return c.id !== 'assistencia'; }).slice(0,6);
  return '<main id="main"><section class="hero"><div class="shell hero-grid"><div><span class="eyebrow"><span class="eyebrow-dot"></span>Tecnologia por perto · Pomerode</span><h1>Seu celular.<br>Seus acessórios.<br>Sua <span>assistência.</span></h1><p class="hero-copy">A Celular.com reúne acessórios para dispositivos móveis e atendimento de assistência, com uma loja física no Centro de Pomerode.</p><div class="hero-actions">' + button('/produtos','Ver produtos','button-dark','arrow') + button('/sobre','Conhecer a loja','button-outline') + '</div><div class="hero-note">' + icon('pin',17) + '<span>R. Luiz Abry, 22 · Centro · Pomerode - SC</span></div></div><div class="hero-stage" aria-label="Smartphone ilustrativo da Celular.com"><div class="stage-grid"></div><div class="orbit"></div><span class="signal signal-one">' + icon('cable',19) + '</span><span class="signal signal-two">' + icon('headphones',19) + '</span><span class="signal signal-three">' + icon('sparkle',14) + '</span><div class="hero-phone"><div class="phone-screen"><span class="phone-island"></span><div class="phone-status"><span>9:41</span><span>● ◖ ▰</span></div><div class="phone-brand">CELULAR.COM</div><h2>Mais perto<br>de você.</h2><p>Tecnologia com cuidado local.</p><div class="phone-art">' + icon('phone',72) + '</div><div class="phone-apps"><span class="app-dot">' + icon('shield',14) + '</span><span class="app-dot">' + icon('cable',14) + '</span><span class="app-dot">' + icon('headphones',14) + '</span></div><span class="phone-home"></span></div></div><div class="floating-chip chip-rating">' + icon('star',17) + '<span><strong>4,4/5</strong> · 54 avaliações</span></div><div class="floating-chip chip-protection">' + icon('shield',17) + '<span>Acessórios & assistência</span></div></div></div></section><section class="trust-strip"><div class="shell trust-inner"><span class="trust-kicker">Seu próximo passo começa aqui</span><div class="trust-item"><span class="trust-icon">' + icon('shield',17) + '</span>Atendimento na loja</div><div class="trust-item"><span class="trust-icon">' + icon('repair',17) + '</span>Assistência</div><div class="trust-item"><span class="trust-icon">' + icon('pin',17) + '</span>Centro de Pomerode</div></div></section><section class="section"><div class="shell"><div class="section-head"><div class="section-head-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>Encontre o que procura</span><h2>Acessórios para<br>acompanhar você.</h2><p class="section-subtitle">Conheça algumas categorias disponíveis na loja. Consulte a Celular.com para confirmar opções e disponibilidade.</p></div>' + button('/categorias','Ver categorias','button-outline','arrow') + '</div><div class="category-grid">' + homeCats.map(function(c) { return categoryCard(c,false); }).join('') + '</div></div></section><section class="section-tight"><div class="shell"><div class="showcase"><div class="showcase-grid"><div><span class="eyebrow"><span class="eyebrow-dot"></span>Cuidado com seu dispositivo</span><h2>Um lugar para acessórios e assistência.</h2><p>Encontre orientação para seus dispositivos móveis e conheça os acessórios da loja. Para entender as opções disponíveis, converse diretamente com a equipe.</p>' + button('/assistencia','Conhecer a assistência','button','arrow') + '</div><div class="service-visual"><span class="service-orb"></span><span class="scan-ring"></span><span class="service-phone">' + icon('scan',52) + '</span><span class="service-chip service-chip-a">' + icon('check',15) + ' Atendimento</span><span class="service-chip service-chip-b">' + icon('repair',15) + ' Assistência</span></div></div></div></div></section><section class="section"><div class="shell"><div class="section-head\"><div class="section-head-copy\"><span class="eyebrow\"><span class="eyebrow-dot\"></span>Quem já conhece</span><h2>O que dizem da loja.</h2><p class="section-subtitle">Avaliação geral informada: 4,4 de 5, com 54 avaliações.</p></div>' + button('/avaliacoes','Ver avaliações','button-link','arrow') + '</div><div class="review-highlight"><div class="rating-card"><div><span class="mini-label">Avaliação geral</span><div class="rating-score">4,4<span style="font-size:24px;letter-spacing:-.03em">/5</span></div>' + stars(15) + '</div><p>Com base em 54 avaliações.</p></div><div class="quote-card"><span class="quote-mark">“</span><blockquote>' + esc(reviews[0]) + '</blockquote><div class="quote-foot"><strong>Avaliação compartilhada</strong><span>Avaliação compartilhada</span></div></div></div></div></section><section class="section-tight"><div class="shell"><div class="location-band"><div class="location-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>Visite a loja física</span><h2>Celular.com em Pomerode</h2><p>' + ADDRESS + '<br>Pomerode - SC · CEP 89107-000</p></div><div class="location-actions">' + button(MAP_URL,'Como chegar','button-outline','pin') + button(PHONE_LINK,'Ligar para a loja','button-dark','phoneCall') + '</div></div></div></section></main>';
}
function productsPage() {
  const cats = categoryState.filter(function(c) { return c.id !== 'assistencia'; });
  const requested = new URLSearchParams(location.search).get('categoria');
  if (requested && cats.some(function(c) { return c.id === requested; })) filter = requested;
  else if (!requested) filter = 'todos';
  const choices = [['todos','Todos']].concat(cats.map(function(c) { return [c.id,c.name]; }));
  return '<main id="main">' + intro('Produtos','Consulte os produtos da loja.','Veja os itens cadastrados pela Celular.com e confirme disponibilidade e preço diretamente com a equipe.') + '<section class="content-section"><div class="shell"><div class="catalog-toolbar"><div class="filter-list" role="group" aria-label="Filtrar produtos por categoria">' + choices.map(function(item) { return '<button class="filter-btn" type="button" data-filter="' + esc(item[0]) + '" aria-pressed="' + (filter === item[0]) + '">' + esc(item[1]) + '</button>'; }).join('') + '</div><label class="search-field">' + icon('search',17) + '<span class="sr-only">Buscar produtos</span><input id="product-search" type="search" placeholder="Buscar produto..." value="' + esc(search) + '"></label></div><p class="result-count" id="result-count\"></p><div class="product-grid" id="product-grid">' + products.filter(function(p) { return p.active; }).map(productCard).join('') + '</div><div class="empty-state" id="product-empty" hidden><h3>Nenhum produto encontrado</h3><p>Tente buscar por outro termo ou limpar os filtros.</p><button class="button button-outline button-small" type="button" data-action="clear-filters">Limpar filtros</button></div><p class="service-disclaimer">As imagens são demonstrativas. Confirme produto, disponibilidade e preço diretamente com a loja. A Celular.com não realiza entregas.</p></div></section></main>';
}
function categoriesPage() {
  return '<main id="main">' + intro('Explore a loja','Categorias para o seu dispositivo.','Veja as principais categorias da Celular.com e consulte quais opções estão disponíveis para o seu aparelho.') + '<section class="content-section"><div class="shell"><div class="category-page-grid">' + categoryState.map(function(c) { return categoryCard(c,true); }).join('') + '</div></div></section></main>';
}
function assistancePage() {
  return '<main id="main">' + intro('Assistência','Assistência para dispositivos móveis.','A Celular.com informa assistência para dispositivos móveis. Entre em contato para confirmar se pode atender à sua necessidade.') + '<section class="content-section"><div class="shell"><div class="assistance-feature"><div class="assistance-photo">' + photoTag(photoUrl('acessorios',1100),'Imagem demonstrativa de cuidado técnico com um dispositivo móvel','assistance-photo-image') + '</div><div class="assistance-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>Fale com a equipe</span><h2>Conte o que seu aparelho precisa.</h2><p>Os serviços específicos, prazos e valores precisam ser confirmados diretamente com a loja.</p>' + button(PHONE_LINK,'Ligar para consultar','button-dark','phoneCall') + '</div></div></div></section></main>';
}
function aboutPage() {
  return '<main id="main">' + intro('Sobre a Celular.com','Tecnologia e atendimento perto de você.','Uma loja física em Pomerode para conhecer acessórios e conversar sobre assistência para dispositivos móveis.') + '<section class="content-section"><div class="shell"><div class="about-layout"><div class="about-copy"><p class="lead">A Celular.com é uma loja de acessórios para dispositivos móveis e assistência, localizada no Centro de Pomerode.</p><p>Atendimento próximo, negociação e preço justo aparecem nas avaliações compartilhadas. Para conhecer as opções da loja, entre em contato ou faça uma visita.</p><p>A loja está no Centro de Pomerode. Consulte a equipe sobre os produtos e serviços disponíveis.</p><div class="fact-row"><div class="fact"><strong>4,4/5</strong><span>Avaliação geral</span></div><div class="fact"><strong>54</strong><span>Avaliações</span></div><div class="fact"><strong>Centro</strong><span>Pomerode - SC</span></div></div><div style="margin-top:24px">' + button('/contato','Ver contato e localização','button-dark','pin') + '</div></div><div class="about-visual" aria-label="Ilustração demonstrativa de smartphone"><span class="about-device">' + icon('phone',63) + '</span><span class="about-sticker">Celular.com<span>Acessórios · Assistência</span></span></div></div></div></section></main>';
}
function reviewsPage() {
  return '<main id="main">' + intro('Avaliações','Experiências compartilhadas por clientes.','Comentários fornecidos para a Celular.com, apresentados sem nomes ou detalhes de autoria que não foram informados.') + '<section class="content-section"><div class="shell"><div class="review-summary"><div class="review-summary-score">4,4</div><div class="review-summary-text">' + stars(17) + '<p>Avaliação geral · 54 avaliações</p></div></div><div class="review-grid">' + reviews.map(function(text) { return '<article class="review-card"><span class="quote-mark">“</span><blockquote>' + esc(text) + '</blockquote><footer><span>Comentário compartilhado</span><span>Avaliação fornecida</span></footer></article>'; }).join('') + '</div></div></section></main>';
}
function contactPage() {
  return '<main id="main">' + intro('Contato','Fale com a Celular.com.','Consulte produtos e assistência por telefone ou visite a loja física no Centro de Pomerode.') + '<section class="content-section"><div class="shell"><div class="contact-layout"><div class="contact-stack"><article class="contact-card"><span class="contact-icon">' + icon('phoneCall',20) + '</span><div><h3>Telefone</h3><a class="address-link" href="' + PHONE_LINK + '">' + PHONE + '</a></div></article><article class="contact-card"><span class="contact-icon">' + icon('pin',20) + '</span><div><h3>Endereço</h3><p>' + ADDRESS + '</p></div></article>' + map() + button(MAP_URL,'Como chegar','button-outline','external') + '</div><div class="contact-form-card contact-call-card"><span class="eyebrow"><span class="eyebrow-dot"></span>Atendimento direto</span><h2>Converse com a equipe.</h2><p>Ligue para confirmar a disponibilidade de produtos ou consultar a assistência antes da sua visita.</p>' + button(PHONE_LINK,'Ligar para ' + PHONE,'button-dark','phoneCall') + '<div class="contact-data-note">Loja física · Centro de Pomerode · Sem entregas</div></div></div></div></section></main>';
}
function faqPage() {
  return '<main id="main">' + intro('Ajuda','Dúvidas frequentes.','Respostas rápidas sobre produtos, assistência, localização e atendimento da Celular.com.') + '<section class="content-section"><div class="shell"><div class="faq-list">' + faq.map(function(item,i) { return '<article class="faq-item' + (i === 0 ? ' is-open':'') + '"><h2 style="margin:0;font:inherit"><button class="faq-question" type="button" data-action="faq" aria-expanded="' + (i === 0) + '" aria-controls="faq-answer-' + i + '"><span>' + (i+1) + '. ' + esc(item[0]) + '</span>' + icon('chevron',18) + '</button></h2><div class="faq-answer" id="faq-answer-' + i + '"><div><p>' + esc(item[1]) + '</p></div></div></article>'; }).join('') + '</div></div></section></main>';
}
function productDetail(id) {
  const item = products.find(function(p) { return p.id === id && p.active; });
  if (!item) return notFound(true);
  const category = cat(item.categoryId || item.category);
  const source = item.imageUrl || photoUrl(item.categoryId || item.category, 1100);
  const alt = item.imageUrl ? 'Foto do produto ' + item.name : 'Imagem demonstrativa de ' + category.name.toLowerCase();
  return '<main id="main"><section class="page-intro"><div class="shell"><div class="breadcrumb"><a href="/">Início</a>' + icon('right',13) + '<a href="/produtos">Produtos</a>' + icon('right',13) + '<span>' + esc(item.name) + '</span></div></div></section><section class="content-section"><div class="shell"><div class="detail-layout"><div class="detail-image">' + photoTag(source,alt) + '<span class="demo-tag">' + (item.imageUrl ? 'Foto do produto' : 'Imagem demonstrativa') + '</span></div><div class="detail-copy"><span class="eyebrow"><span class="eyebrow-dot"></span>' + esc(category.name) + '</span><h1>' + esc(item.name) + '</h1><p>' + esc(item.description || '') + '</p><div class="detail-note">Disponibilidade sob consulta. Confirme preço e detalhes com a loja física.</div><ul class="detail-list"><li>' + icon('pin',16) + 'Atendimento na loja física em Pomerode</li><li>' + icon('phoneCall',16) + 'Informações diretamente com a equipe</li></ul><strong class="detail-price">' + esc(displayPrice(item)) + '</strong><div class="detail-actions">' + button(PHONE_LINK,'Consultar com a loja','button-dark','phoneCall') + button('/produtos','Voltar aos produtos','button-outline') + '</div></div></div></div></section></main>';
}
function notFound(detail) {
  return '<main id="main" class="not-found"><div class="shell"><div class="not-found-card"><div class="not-found-number">404</div><h1>' + (detail ? 'Produto não encontrado' : 'Esta página não foi encontrada') + '</h1><p>' + (detail ? 'Volte ao catálogo para consultar outros produtos.' : 'Talvez o endereço tenha mudado. Você pode voltar ao início ou explorar os produtos.') + '</p><div class="not-found-actions">' + button('/','Voltar ao início','button-dark','arrow') + button('/produtos','Ver produtos','button-outline') + '</div></div></div></main>';
}
function adminNav(label,href,ico,current) {
  return '<a href="' + href + '"' + (current === href ? ' aria-current="page"' : '') + '>' + icon(ico,16) + '<span>' + label + '</span></a>';
}
function adminShell(content,current,heading,section) {
  return '<div class="admin-shell"><aside class="admin-sidebar"><div class="admin-side-brand">' + brand() + '<div><strong>Administração</strong>Celular.com</div></div><p class="admin-nav-label">Gerenciar</p><nav class="admin-nav" aria-label="Navegação do painel">' + adminNav('Visão geral','/admin','chart',current) + adminNav('Produtos','/admin/produtos','box',current) + adminNav('Categorias','/admin/categorias','grid',current) + adminNav('Imagens','/admin/imagens','image',current) + adminNav('Configurações da conta','/admin/conta','user',current) + '</nav><div class="admin-side-bottom"><p class="admin-nav-label">Site</p><nav class="admin-nav">' + adminNav('Ver página inicial','/','eye',current) + '<button class="admin-logout" type="button" data-action="logout">' + icon('power',16) + '<span>Sair do painel</span></button></nav></div></aside><main class="admin-main" id="main"><div class="admin-topline"><div class="admin-topline-copy"><span>Celular.com / ' + section + '</span><h1>' + heading + '</h1></div><div class="admin-user"><span class="admin-avatar">' + esc((adminSession && adminSession.username || 'A').slice(0,1).toUpperCase()) + '</span>' + esc(adminSession && adminSession.username || 'Administrador') + '</div></div><div class="admin-status-banner">' + icon('info',17) + '<span>As alterações são salvas no catálogo do site.</span></div>' + content + '</main></div>';
}
function accountSettings() {
  return '<div class="admin-panels"><section class="admin-panel"><div class="admin-panel-head"><h2>Alterar login</h2></div><form id="account-username-form"><div class="field"><label for="account-username">Novo login</label><input id="account-username" name="username" autocomplete="username" required minlength="3" maxlength="40" value="' + esc(adminSession && adminSession.username || '') + '"></div><div class="field"><label for="account-username-password">Confirme sua senha atual</label><input id="account-username-password" name="currentPassword" type="password" autocomplete="current-password" required maxlength="256"></div><p class="live-form-error" data-form-error role="status" aria-live="polite"></p><button class="button button-dark button-small" type="submit">Salvar login</button></form></section><section class="admin-panel"><div class="admin-panel-head"><h2>Alterar senha</h2></div><form id="account-password-form"><div class="field"><label for="account-current-password">Senha atual</label><input id="account-current-password" name="currentPassword" type="password" autocomplete="current-password" required maxlength="256"></div><div class="field"><label for="account-new-password">Nova senha</label><input id="account-new-password" name="newPassword" type="password" autocomplete="new-password" required minlength="12" maxlength="256"></div><div class="field"><label for="account-password-confirmation">Confirme a nova senha</label><input id="account-password-confirmation" name="confirmation" type="password" autocomplete="new-password" required minlength="12" maxlength="256"></div><p class="live-form-error" data-form-error role="status" aria-live="polite"></p><button class="button button-dark button-small" type="submit">Salvar senha</button></form></section></div>';
}
function stat(label,value,ico,note) {
  return '<article class="admin-stat"><div class="admin-stat-top"><span>' + label + '</span>' + icon(ico,15) + '</div><strong>' + value + '</strong><small>' + note + '</small></article>';
}
function recentRows() {
  return products.slice(0,5).map(function(p) { return '<tr><td><div class="table-product"><span class="table-thumb">' + photoTag(p.imageUrl || photoUrl(p.categoryId,240),'') + '</span><span><strong>' + esc(p.name) + '</strong><span>' + esc(p.category || cat(p.categoryId).name) + '</span></span></div></td><td>' + esc(displayPrice(p)) + '</td><td><span class="status-pill' + (p.active ? '' : ' inactive') + '">' + (p.active ? 'Ativo':'Desativado') + '</span></td></tr>'; }).join('') || '<tr><td colspan="3">Nenhum produto cadastrado.</td></tr>';
}
function dashboard() {
  return '<div class="admin-stats">' + stat('Produtos cadastrados',products.length,'box','Catálogo da loja') + stat('Produtos ativos',products.filter(function(p) { return p.active; }).length,'check','Visíveis no site') + stat('Categorias',categoryState.length,'grid','Organização da vitrine') + stat('Em destaque',products.filter(function(p) { return p.featured; }).length,'star','Produtos no início') + stat('Avaliação geral','4,4/5','star','54 avaliações informadas') + '</div><div class="admin-panels"><section class="admin-panel"><div class="admin-panel-head"><h2>Produtos atualizados</h2><a href="/admin/produtos">Gerenciar produtos →</a></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>PRODUTO</th><th>PREÇO</th><th>STATUS</th></tr></thead><tbody>' + recentRows() + '</tbody></table></div></section><section class="admin-panel"><div class="admin-panel-head"><h2>Ações rápidas</h2><span class="mini-label">Catálogo</span></div><div class="quick-grid"><button class="quick-action" data-action="add-product" type="button"><span class="quick-action-icon">' + icon('plus',16) + '</span><span><strong>Novo produto</strong><span>Adicionar à vitrine</span></span></button><a class="quick-action" href="/admin/categorias"><span class="quick-action-icon">' + icon('grid',16) + '</span><span><strong>Editar categorias</strong><span>Organizar a vitrine</span></span></a><a class="quick-action" href="/admin/imagens"><span class="quick-action-icon">' + icon('image',16) + '</span><span><strong>Gerenciar fotos</strong><span>Imagens dos produtos</span></span></a><a class="quick-action" href="/avaliacoes"><span class="quick-action-icon">' + icon('star',16) + '</span><span><strong>Ver avaliações</strong><span>4,4/5 · 54 avaliações</span></span></a></div></section></div>';
}
function productsAdmin() {
  const rows = products.map(function(p) {
    return '<tr data-admin-product="' + esc(p.id) + '"><td><div class="table-product"><span class="table-thumb">' + photoTag(p.imageUrl || photoUrl(p.categoryId,240),'') + '</span><span><strong>' + esc(p.name) + '</strong><span>' + esc(p.category || cat(p.categoryId).name) + '</span></span></div></td><td>' + esc(displayPrice(p)) + '</td><td><button class="toggle-switch" type="button" role="switch" aria-checked="' + p.active + '" aria-label="' + (p.active ? 'Desativar ':'Ativar ') + esc(p.name) + '" data-action="toggle-product" data-id="' + esc(p.id) + '"></button></td><td><button class="icon-button' + (p.featured ? ' is-active':'') + '" type="button" aria-label="' + (p.featured ? 'Remover destaque de ':'Destacar ') + esc(p.name) + '" aria-pressed="' + p.featured + '" data-action="feature-product" data-id="' + esc(p.id) + '">' + icon('star',14) + '</button></td><td><div class="admin-row-actions"><button class="icon-button" type="button" aria-label="Editar ' + esc(p.name) + '" data-action="edit-product" data-id="' + esc(p.id) + '">' + icon('edit',14) + '</button><button class="icon-button" type="button" aria-label="Excluir ' + esc(p.name) + '" data-action="delete-product" data-id="' + esc(p.id) + '">' + icon('trash',14) + '</button></div></td></tr>';
  }).join('') || '<tr><td colspan="5">Nenhum produto cadastrado. Adicione um produto para começar.</td></tr>';
  return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Produtos da vitrine</h2><p>' + products.length + (products.length === 1 ? ' produto cadastrado':' produtos cadastrados') + '</p></div><button class="button button-dark button-small" data-action="add-product" type="button">' + icon('plus',16) + 'Adicionar produto</button></div><div class="catalog-toolbar"><div class="mini-label">Preço opcional · disponibilidade sob consulta</div><label class="search-field admin-search">' + icon('search',17) + '<span class="sr-only">Buscar no painel</span><input id="admin-product-search" type="search" placeholder="Buscar produto..."></label></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>PRODUTO</th><th>PREÇO</th><th>STATUS</th><th>DESTAQUE</th><th>AÇÕES</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
}
function categoriesAdmin() {
  const rows = categoryState.map(function(c) {
    const count = products.filter(function(p) { return p.categoryId === c.id; }).length;
    return '<tr><td><div class="table-product"><span class="category-icon category-admin-icon">' + icon(c.icon || 'accessories',16) + '</span><span><strong>' + esc(c.name) + '</strong><span>' + count + (count === 1 ? ' produto':' produtos') + '</span></span></div></td><td><div class="admin-row-actions"><button class="icon-button" type="button" aria-label="Editar categoria ' + esc(c.name) + '" data-action="edit-category" data-id="' + esc(c.id) + '">' + icon('edit',14) + '</button><button class="icon-button" type="button" aria-label="Excluir categoria ' + esc(c.name) + '" data-action="delete-category" data-id="' + esc(c.id) + '">' + icon('trash',14) + '</button></div></td></tr>';
  }).join('') || '<tr><td colspan="2">Nenhuma categoria cadastrada.</td></tr>';
  return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Categorias do catálogo</h2><p>Crie e edite categorias para organizar os produtos.</p></div><button class="button button-dark button-small" type="button" data-action="add-category">' + icon('plus',16) + 'Adicionar categoria</button></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>CATEGORIA</th><th>AÇÕES</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
}
function imagesAdmin() {
  const cards = products.map(function(p) {
    const source = p.imageUrl || photoUrl(p.categoryId,600);
    return '<article class="admin-image-card"><div class="admin-image-preview">' + photoTag(source,p.imageUrl ? 'Foto de ' + p.name : 'Imagem demonstrativa da categoria ' + (p.category || '').toLowerCase()) + '<span>' + (p.imageUrl ? 'Foto real cadastrada':'Imagem demonstrativa') + '</span></div><div class="admin-image-meta"><strong>' + esc(p.name) + '</strong><small>' + esc(p.category || cat(p.categoryId).name) + '</small><button class="button button-outline button-small" type="button" data-action="edit-product" data-id="' + esc(p.id) + '">' + icon('image',14) + (p.imageUrl ? 'Substituir ou remover foto':'Adicionar foto') + '</button></div></article>';
  }).join('');
  return '<section class="admin-list-card"><div class="admin-list-toolbar"><div><h2>Imagens por produto</h2><p>Envie uma foto real ou use a imagem demonstrativa automática.</p></div></div>' + (cards ? '<div class="admin-image-grid">' + cards + '</div>' : '<div class="empty-state"><h3>Nenhum produto cadastrado</h3><p>Adicione produtos primeiro; depois você poderá enviar uma imagem para cada um.</p><a class="button button-outline button-small" href="/admin/produtos">Ir para produtos ' + icon('arrow',15) + '</a></div>') + '</section>';
}
function loginPage() {
  return '<main id="main" class="login-shell"><section class="login-aside">' + brand() + '<div class="login-aside-content"><span class="eyebrow"><span class="eyebrow-dot"></span>Área administrativa</span><h1>Cuide da vitrine da Celular.com.</h1><p>Atualize produtos, categorias e imagens da loja em um painel protegido.</p></div><div class="login-aside-foot">Celular.com · Pomerode - SC</div></section><section class="login-panel"><form class="login-card" id="login-form"><span class="eyebrow"><span class="eyebrow-dot"></span>Acesso restrito</span><h2>Entrar no painel</h2>' + (adminConfigured ? '<p>Use a conta administrativa configurada no PostgreSQL.</p><div class="field"><label for="admin-user">Usuário</label><input id="admin-user" name="username" autocomplete="username" required maxlength="40"></div><div class="field"><label for="admin-password">Senha</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required maxlength="256"></div><p class="login-error" id="login-error" role="status" aria-live="polite"></p><button class="button button-dark" type="submit">Entrar no painel ' + icon('arrow',17) + '</button>' : '<div class="login-demo-note"><strong>Primeiro acesso</strong><p>Execute <code>npm run admin:create</code> no terminal para configurar a conta inicial. A senha será solicitada sem aparecer na tela e armazenada apenas como hash.</p></div>') + '<div class="login-back"><a class="button-link" href="/">← Voltar ao site</a></div></form></section></main>';
}
function render() {
  const current = path();
  document.title = titleMap[current] || (current.indexOf('/produto/') === 0 ? 'Produto | Celular.com' : 'Página não encontrada | Celular.com');
  let out;
  if (current === '/') out = header(current) + home() + footer();
  else if (current === '/produtos') out = header(current) + productsPage() + footer();
  else if (current === '/categorias') out = header(current) + categoriesPage() + cta() + footer();
  else if (current === '/assistencia') out = header(current) + assistancePage() + cta() + footer();
  else if (current === '/sobre') out = header(current) + aboutPage() + cta() + footer();
  else if (current === '/avaliacoes') out = header(current) + reviewsPage() + footer();
  else if (current === '/contato') out = header(current) + contactPage() + footer();
  else if (current === '/faq') out = header(current) + faqPage() + footer();
  else if (current.indexOf('/produto/') === 0) out = header('/produtos') + productDetail(decodeURIComponent(current.split('/').pop())) + footer();
  else if (current === '/admin/login') out = header(current) + loginPage() + footer();
  else if (current === '/admin') out = adminShell(dashboard(),current,'Dashboard','Visão geral');
  else if (current === '/admin/produtos') out = adminShell(productsAdmin(),current,'Produtos','Catálogo');
  else if (current === '/admin/categorias') out = adminShell(categoriesAdmin(),current,'Categorias','Organização');
  else if (current === '/admin/imagens') out = adminShell(imagesAdmin(),current,'Imagens','Mídia');
  else if (current === '/admin/conta') out = adminShell(accountSettings(),current,'Configurações da conta','Conta');
  else out = header(current) + notFound(false) + footer();
  app.innerHTML = out;
  if (current === '/produtos') updateCatalog();
  if (current === '/admin/produtos') filterAdmin();
  window.scrollTo(0,0);
}
function updateCatalog() {
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  let count = 0;
  cards.forEach(function(card) {
    const title = card.querySelector('h3').textContent;
    const item = products.find(function(p) { return p.name === title; });
    const value = (card.textContent + ' ' + (item ? item.description : '')).toLocaleLowerCase('pt-BR');
    const match = (filter === 'todos' || card.dataset.category === filter) && value.indexOf(search.toLocaleLowerCase('pt-BR')) !== -1;
    card.hidden = !match;
    if (match) count++;
  });
  const countNode = document.getElementById('result-count');
  const empty = document.getElementById('product-empty');
  if (countNode) countNode.textContent = count + (count === 1 ? ' produto' : ' produtos');
  if (empty) empty.hidden = count !== 0;
}
function filterAdmin() {
  const input = document.getElementById('admin-product-search');
  if (!input) return;
  input.value = window.adminSearch || '';
  document.querySelectorAll('[data-admin-product]').forEach(function(row) {
    row.hidden = row.textContent.toLocaleLowerCase('pt-BR').indexOf(input.value.toLocaleLowerCase('pt-BR')) === -1;
  });
}
function rerender() { render(); }
function toast(message) {
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = icon('check',17) + '<span>' + esc(message) + '</span>';
  toastRegion.appendChild(node);
  window.setTimeout(function() { node.remove(); },2800);
}
function showDialog() {
  if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open','');
  document.body.classList.add('dialog-open');
}
function closeDialog() {
  if (dialog.open && dialog.close) dialog.close(); else dialog.removeAttribute('open');
  document.body.classList.remove('dialog-open');
}
function go(href) {
  const target = new URL(href,location.origin);
  if (target.origin !== location.origin) { location.assign(target.href); return; }
  history.pushState({},'',target.pathname + target.search + target.hash);
  menuOpen = false;
  filter = new URLSearchParams(target.search).get('categoria') || 'todos';
  render();
}
dialog.addEventListener('close',function() { document.body.classList.remove('dialog-open'); });
dialog.addEventListener('click',function(event) { if (event.target === dialog) closeDialog(); });
render();
