// 公共逻辑：页头页脚、商品插画、购物车、各页面渲染
const CART_KEY = "jinyu_cart";

function formatPrice(n) {
  return "¥" + n.toLocaleString("zh-CN");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 购物车（保存在浏览器本地） ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  const p = findProduct(id);
  showToast(`已加入购物车：${p ? p.name : ""}`);
}

function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((i) => i.id !== id);
  else cart.forEach((i) => { if (i.id === id) i.qty = qty; });
  saveCart(cart);
}

function cartLines() {
  return getCart()
    .map((i) => ({ ...i, product: findProduct(i.id) }))
    .filter((i) => i.product);
}

function cartTotals() {
  const lines = cartLines();
  const subtotal = lines.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = lines.reduce((s, i) => s + i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 20;
  return { lines, subtotal, count, shipping, total: subtotal + shipping };
}

function updateCartBadge() {
  const el = document.querySelector("[data-cart-count]");
  if (el) {
    const { count } = cartTotals();
    el.textContent = count;
    el.hidden = count === 0;
  }
}

function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- 商品插画（纯SVG，无需外部图片） ---------- */
function productArt(p) {
  const [c1, c2] = CATEGORIES[p.cat].colors;
  const gid = "g" + p.id;
  const grad = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>`;
  const shapes = {
    ring: `<circle cx="100" cy="112" r="44" fill="none" stroke="url(#${gid})" stroke-width="12"/><circle cx="100" cy="62" r="16" fill="url(#${gid})"/>`,
    bangle: `<ellipse cx="100" cy="100" rx="62" ry="54" fill="none" stroke="url(#${gid})" stroke-width="16"/>`,
    drop: `<path d="M40 40 Q100 110 160 40" fill="none" stroke="#b9a57a" stroke-width="2"/><path d="M100 86 C80 112 78 132 100 152 C122 132 120 112 100 86Z" fill="url(#${gid})"/>`,
    gem: `<polygon points="60,78 80,54 120,54 140,78 100,150" fill="url(#${gid})"/><polyline points="60,78 140,78" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/><polyline points="80,54 90,78 100,150 110,78 120,54" stroke="#fff" stroke-opacity=".45" stroke-width="1.5" fill="none"/>`,
    studs: `<circle cx="70" cy="100" r="22" fill="url(#${gid})"/><circle cx="130" cy="100" r="22" fill="url(#${gid})"/><circle cx="64" cy="93" r="6" fill="#fff" fill-opacity=".6"/><circle cx="124" cy="93" r="6" fill="#fff" fill-opacity=".6"/>`,
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${escapeHtml(p.name)}">${grad}${shapes[p.shape] || shapes.gem}</svg>`;
}

function productCard(p) {
  return `
    <article class="card">
      <div class="card-art">${productArt(p)}${p.tag ? `<span class="badge">${p.tag}</span>` : ""}</div>
      <div class="card-body">
        <p class="card-cat">${CATEGORIES[p.cat].name}</p>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <div class="card-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn btn-sm" data-add="${p.id}">加入购物车</button>
        </div>
      </div>
    </article>`;
}

/* ---------- 页头与页脚 ---------- */
function renderChrome() {
  const current = document.body.dataset.page;
  const navItems = [
    ["home", "index.html", "首页"],
    ...Object.entries(CATEGORIES).map(([k, c]) => [k, c.page, c.name]),
  ];
  const header = document.querySelector("[data-header]");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container header-inner">
        <a href="index.html" class="logo">金玉良缘<small>JINYU JEWELRY</small></a>
        <button class="nav-toggle" aria-label="菜单" aria-expanded="false">☰</button>
        <nav class="nav">
          ${navItems.map(([k, href, label]) => `<a href="${href}" class="${k === current ? "active" : ""}">${label}</a>`).join("")}
        </nav>
        <a href="cart.html" class="cart-link ${current === "cart" ? "active" : ""}">购物车<span class="cart-count" data-cart-count hidden>0</span></a>
      </div>`;
    const toggle = header.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });
  }
  const footer = document.querySelector("[data-footer]");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <p class="logo">金玉良缘</p>
          <p>以匠心传承东方珠宝之美。</p>
        </div>
        <div>
          <h4>商品分类</h4>
          ${Object.values(CATEGORIES).map((c) => `<a href="${c.page}">${c.name}</a>`).join("")}
        </div>
        <div>
          <h4>购物服务</h4>
          <a href="cart.html">购物车</a>
          <a href="checkout.html">结算付款</a>
          <span>满¥999包邮 · 7天无理由退换</span>
        </div>
        <div>
          <h4>联系我们</h4>
          <span>客服热线：400-000-0000</span>
          <span>营业时间：10:00 - 22:00</span>
        </div>
      </div>
      <p class="copyright">© ${new Date().getFullYear()} 金玉良缘珠宝 · 本站为演示模板，商品与支付均为示例</p>`;
  }
  updateCartBadge();
}

/* ---------- 首页 ---------- */
function renderHome() {
  const catGrid = document.querySelector("[data-categories]");
  if (catGrid) {
    catGrid.innerHTML = Object.entries(CATEGORIES)
      .map(([k, c]) => {
        const sample = PRODUCTS.find((p) => p.cat === k);
        return `
        <a class="cat-tile" href="${c.page}" style="--c1:${c.colors[0]};--c2:${c.colors[1]}">
          <div class="cat-art">${productArt(sample)}</div>
          <h3>${c.name}<small>${c.en}</small></h3>
          <p>${c.tagline}</p>
        </a>`;
      })
      .join("");
  }
  const featured = document.querySelector("[data-featured]");
  if (featured) {
    featured.innerHTML = PRODUCTS.filter((p) => p.tag === "热销").map(productCard).join("");
  }
}

/* ---------- 分类页 ---------- */
function renderCategory(key) {
  const c = CATEGORIES[key];
  document.title = `${c.name} | 金玉良缘珠宝`;
  const hero = document.querySelector("[data-cat-hero]");
  hero.style.setProperty("--c1", c.colors[0]);
  hero.style.setProperty("--c2", c.colors[1]);
  hero.innerHTML = `
    <div class="container">
      <p class="crumbs"><a href="index.html">首页</a> / ${c.name}</p>
      <h1>${c.name}<small>${c.en}</small></h1>
      <p class="lead">${c.tagline}</p>
      <p>${c.intro}</p>
    </div>`;

  const grid = document.querySelector("[data-products]");
  const sortSel = document.querySelector("[data-sort]");
  const draw = () => {
    let list = PRODUCTS.filter((p) => p.cat === key);
    if (sortSel.value === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortSel.value === "desc") list = [...list].sort((a, b) => b.price - a.price);
    grid.innerHTML = list.map(productCard).join("");
    document.querySelector("[data-count]").textContent = `共 ${list.length} 件商品`;
  };
  sortSel.addEventListener("change", draw);
  draw();
}

/* ---------- 购物车页 ---------- */
function renderCart() {
  const box = document.querySelector("[data-cart]");
  const { lines, subtotal, shipping, total } = cartTotals();
  if (!lines.length) {
    box.innerHTML = `<div class="empty"><p>购物车还是空的</p><a class="btn" href="index.html">去逛逛</a></div>`;
    return;
  }
  box.innerHTML = `
    <div class="cart-layout">
      <ul class="cart-list">
        ${lines
          .map(
            ({ product: p, qty }) => `
          <li class="cart-item">
            <div class="cart-thumb">${productArt(p)}</div>
            <div class="cart-info">
              <a href="${CATEGORIES[p.cat].page}" class="card-cat">${CATEGORIES[p.cat].name}</a>
              <h3>${escapeHtml(p.name)}</h3>
              <p class="price">${formatPrice(p.price)}</p>
            </div>
            <div class="qty">
              <button data-qty="${p.id}" data-delta="-1" aria-label="减少">−</button>
              <span>${qty}</span>
              <button data-qty="${p.id}" data-delta="1" aria-label="增加">+</button>
            </div>
            <button class="link-btn" data-remove="${p.id}">删除</button>
          </li>`
          )
          .join("")}
      </ul>
      <aside class="summary">
        <h2>订单摘要</h2>
        <div class="row"><span>商品小计</span><span>${formatPrice(subtotal)}</span></div>
        <div class="row"><span>运费</span><span>${shipping ? formatPrice(shipping) : "免运费"}</span></div>
        <div class="row total"><span>合计</span><span>${formatPrice(total)}</span></div>
        <a class="btn btn-block" href="checkout.html">去结算</a>
        <a class="link-btn" href="index.html">继续购物</a>
      </aside>
    </div>`;
}

/* ---------- 结算付款页（模拟支付，不会产生真实扣款） ---------- */
function renderCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  const summary = document.querySelector("[data-checkout-summary]");
  const { lines, subtotal, shipping, total } = cartTotals();

  if (!lines.length) {
    document.querySelector("[data-checkout]").innerHTML =
      `<div class="empty"><p>购物车为空，无法结算</p><a class="btn" href="index.html">去逛逛</a></div>`;
    return;
  }

  summary.innerHTML = `
    <h2>订单摘要</h2>
    <ul class="mini-list">
      ${lines.map(({ product: p, qty }) => `<li><span>${escapeHtml(p.name)} × ${qty}</span><span>${formatPrice(p.price * qty)}</span></li>`).join("")}
    </ul>
    <div class="row"><span>商品小计</span><span>${formatPrice(subtotal)}</span></div>
    <div class="row"><span>运费</span><span>${shipping ? formatPrice(shipping) : "免运费"}</span></div>
    <div class="row total"><span>应付金额</span><span>${formatPrice(total)}</span></div>`;

  const cardFields = form.querySelector("[data-card-fields]");
  form.querySelectorAll('input[name="pay"]').forEach((r) =>
    r.addEventListener("change", () => {
      const isCard = form.pay.value === "card";
      cardFields.hidden = !isCard;
      cardFields.querySelectorAll("input").forEach((i) => (i.required = isCard));
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!/^1\d{10}$/.test(form.phone.value.trim())) {
      showToast("请输入正确的11位手机号");
      form.phone.focus();
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "支付处理中…";
    setTimeout(() => {
      const orderNo = "JY" + Date.now().toString().slice(-10);
      const payNames = { wechat: "微信支付", alipay: "支付宝", card: "银行卡", cod: "货到付款" };
      saveCart([]);
      document.querySelector("[data-checkout]").innerHTML = `
        <div class="success">
          <div class="check">✓</div>
          <h2>${form.pay.value === "cod" ? "下单成功" : "支付成功"}</h2>
          <p>订单号：<strong>${orderNo}</strong></p>
          <p>支付方式：${payNames[form.pay.value]} · 金额：${formatPrice(total)}</p>
          <p>收货人：${escapeHtml(form.name.value)}（${escapeHtml(form.phone.value)}）</p>
          <p class="muted">这是演示页面，未产生任何真实扣款。</p>
          <a class="btn" href="index.html">返回首页</a>
        </div>`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  });
}

/* ---------- 启动 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  else if (CATEGORIES[page]) renderCategory(page);
  else if (page === "cart") renderCart();
  else if (page === "checkout") renderCheckout();

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add);
    const q = e.target.closest("[data-qty]");
    if (q) {
      const item = getCart().find((i) => i.id === q.dataset.qty);
      setQty(q.dataset.qty, (item ? item.qty : 0) + Number(q.dataset.delta));
      renderCart();
    }
    const rm = e.target.closest("[data-remove]");
    if (rm) {
      setQty(rm.dataset.remove, 0);
      renderCart();
    }
  });
});
