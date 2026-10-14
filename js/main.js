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
  const gid = "g" + p.id + "-" + (productArt.n = (productArt.n || 0) + 1);
  const grad = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>`;
  const shapes = {
    ring: `<circle cx="100" cy="112" r="44" fill="none" stroke="url(#${gid})" stroke-width="12"/><circle cx="100" cy="62" r="16" fill="url(#${gid})"/>`,
    bangle: `<ellipse cx="100" cy="100" rx="62" ry="54" fill="none" stroke="url(#${gid})" stroke-width="16"/>`,
    drop: `<path d="M40 40 Q100 110 160 40" fill="none" stroke="#b9a57a" stroke-width="2"/><path d="M100 86 C80 112 78 132 100 152 C122 132 120 112 100 86Z" fill="url(#${gid})"/>`,
    gem: `<polygon points="60,78 80,54 120,54 140,78 100,150" fill="url(#${gid})"/><polyline points="60,78 140,78" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/><polyline points="80,54 90,78 100,150 110,78 120,54" stroke="#fff" stroke-opacity=".45" stroke-width="1.5" fill="none"/>`,
    chain: `<path d="M44 96 Q100 150 156 96" fill="none" stroke="url(#${gid})" stroke-width="6" stroke-dasharray="10 5" stroke-linecap="round"/><circle cx="100" cy="122" r="12" fill="url(#${gid})"/>`,
    anklet: `<ellipse cx="100" cy="104" rx="60" ry="26" fill="none" stroke="url(#${gid})" stroke-width="5" stroke-dasharray="8 5" stroke-linecap="round"/><circle cx="84" cy="134" r="7" fill="url(#${gid})"/><circle cx="116" cy="134" r="7" fill="url(#${gid})"/>`,
    studs: `<circle cx="70" cy="100" r="22" fill="url(#${gid})"/><circle cx="130" cy="100" r="22" fill="url(#${gid})"/><circle cx="64" cy="93" r="6" fill="#fff" fill-opacity=".6"/><circle cx="124" cy="93" r="6" fill="#fff" fill-opacity=".6"/>`,
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${escapeHtml(p.name)}">${grad}${shapes[TYPES[p.type].shape] || shapes.gem}</svg>`;
}

function productCard(p) {
  return `
    <article class="card">
      <div class="card-art" data-quick="${p.id}" role="button" tabindex="0" aria-label="快速查看 ${escapeHtml(p.name)}">${productArt(p)}<span class="qv-hint">快速查看</span>${p.tag ? `<span class="badge">${p.tag}</span>` : ""}</div>
      <div class="card-body">
        <p class="card-cat">${CATEGORIES[p.cat].name} · ${TYPES[p.type].name}</p>
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
  const th = CATEGORY_THEMES[key];
  const inCatAll = PRODUCTS.filter((p) => p.cat === key);
  const typeCount = new Set(inCatAll.map((p) => p.type)).size;

  /* 横幅：左文案 + 右侧古典窗框中的 3D 珠宝 */
  const hero = document.querySelector("[data-cat-hero]");
  hero.classList.add(`theme-${key}`);
  hero.innerHTML = `
    <div class="cat-scene" aria-hidden="true">${sceneDecor(key)}</div>
    <div class="container cat-hero-inner">
      <div class="cat-hero-copy">
        <p class="crumbs"><a href="index.html">首页</a> / ${c.name}</p>
        <div class="cat-title">
          <span class="cat-seal" aria-hidden="true">${th.seal}</span>
          <h1>${c.name}<small>${c.en}</small></h1>
        </div>
        <p class="lead">${c.tagline}</p>
        <p class="cat-intro">${c.intro}</p>
        <ul class="cat-stats">
          <li><strong>${inCatAll.length}</strong>款在售</li>
          <li><strong>${typeCount}</strong>种款式</li>
          ${th.stats.map((s) => `<li>${s}</li>`).join("")}
        </ul>
        <div class="cat-actions">
          <a class="btn" href="#spotlight">镇店之宝</a>
          <a class="btn btn-ghost" href="#guide">选购指南</a>
        </div>
      </div>
      <div class="cat-window frame-${th.frame}" aria-hidden="true">
        <div class="cat-window-inner">
          <div class="cat-window-art">${productArt(findProduct(th.spotlight))}</div>
          <div class="cat-jewel" data-jewel3d="${key}"></div>
        </div>
      </div>
      <p class="cat-poem" aria-hidden="true">${th.poem.join("<br>")}</p>
    </div>`;

  /* 镇店之宝 */
  const spot = document.querySelector("[data-spotlight]");
  const sp = findProduct(th.spotlight);
  if (spot && sp) {
    spot.innerHTML = `
      <div class="container spotlight-inner">
        <div class="spotlight-art">
          <div class="spotlight-rays" aria-hidden="true"></div>
          ${productArt(sp)}
          <span class="spotlight-seal" aria-hidden="true">珍</span>
        </div>
        <div class="spotlight-copy">
          <p class="eyebrow-cn">镇店之宝 · ${c.name}</p>
          <h2>${escapeHtml(sp.name)}</h2>
          <p class="spotlight-story">${th.story}</p>
          <dl class="spec-list">${th.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <div class="spotlight-buy">
            <span class="price">${formatPrice(sp.price)}</span>
            <button class="btn" data-add="${sp.id}">加入购物车</button>
            <button class="btn btn-ghost" data-jump-type="${sp.type}">查看同款${TYPES[sp.type].name}</button>
          </div>
        </div>
      </div>`;
  }

  /* 选购指南：卷轴卡片 */
  const guide = document.querySelector("[data-guide]");
  if (guide) {
    guide.innerHTML = `
      <div class="container">
        <div class="section-head"><h2>${c.name}选购指南</h2><p>懂行再出手，买得放心</p></div>
        <div class="scroll-grid">
          ${th.guide
            .map(([ch, t, d]) => `
            <article class="scroll-card">
              <span class="scroll-char">${ch}</span>
              <h3>${t}</h3>
              <p>${d}</p>
            </article>`)
            .join("")}
        </div>
      </div>`;
  }

  const grid = document.querySelector("[data-products]");
  const sortSel = document.querySelector("[data-sort]");
  const tabs = document.querySelector("[data-types]");
  const inCat = PRODUCTS.filter((p) => p.cat === key);
  // 只显示该材质下有商品的款式，网址带 #ring 等可直接打开对应款式
  const types = Object.keys(TYPES).filter((t) => inCat.some((p) => p.type === t));
  let active = types.includes(location.hash.slice(1)) ? location.hash.slice(1) : "all";

  const draw = () => {
    tabs.innerHTML = [["all", "全部", inCat.length], ...types.map((t) => [t, TYPES[t].name, inCat.filter((p) => p.type === t).length])]
      .map(([t, label, n]) => `<button class="tab ${t === active ? "active" : ""}" data-type="${t}" aria-pressed="${t === active}">${label}<span>${n}</span></button>`)
      .join("");
    let list = active === "all" ? inCat : inCat.filter((p) => p.type === active);
    if (sortSel.value === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortSel.value === "desc") list = [...list].sort((a, b) => b.price - a.price);
    grid.innerHTML = list.map(productCard).join("");
    const label = active === "all" ? c.name : c.name + TYPES[active].name;
    document.querySelector("[data-count]").textContent = `${label} · 共 ${list.length} 件商品`;
  };
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-type]");
    if (!btn) return;
    active = btn.dataset.type;
    history.replaceState(null, "", active === "all" ? location.pathname : "#" + active);
    draw();
  });
  sortSel.addEventListener("change", draw);
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump-type]");
    if (!j) return;
    active = j.dataset.jumpType;
    history.replaceState(null, "", "#" + active);
    draw();
    tabs.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  draw();
}

/* 分类页横幅背景装饰：翡翠山水、金饰光芒、银饰青花、钻石星空 */
function sceneDecor(key) {
  if (key === "jade") {
    return `
      <svg class="ink-mountains" viewBox="0 0 1440 360" preserveAspectRatio="none">
        <path d="M0 360V210C120 150 190 90 300 140S470 60 560 120S760 40 880 110S1080 70 1200 130S1360 100 1440 150V360Z" fill="#2f6b4c" opacity=".16"/>
        <path d="M0 360V260C140 200 230 170 340 220S520 150 640 210S840 160 960 220S1180 180 1300 230S1400 220 1440 240V360Z" fill="#1f4d36" opacity=".22"/>
        <path d="M0 360V310C160 270 260 260 400 290S640 250 780 290S1040 260 1180 300S1380 290 1440 300V360Z" fill="#163a29" opacity=".3"/>
      </svg>
      <span class="ink-sun"></span>
      <span class="cloud cloud-1"></span><span class="cloud cloud-3"></span>`;
  }
  if (key === "gold") return `<span class="gold-rays"></span><span class="cloud cloud-1"></span><span class="cloud cloud-3"></span>`;
  if (key === "silver") return `<span class="porcelain"></span><span class="moon-disc"></span>`;
  return `<span class="star-field"></span>`;
}

/* ---------- 商品快速查看 ---------- */
function openQuickView(id) {
  const p = findProduct(id);
  if (!p) return;
  let dlg = document.querySelector(".quick-view");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.className = "quick-view";
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
  }
  dlg.innerHTML = `
    <div class="qv-inner">
      <button class="qv-close" data-close aria-label="关闭">×</button>
      <div class="qv-art">${productArt(p)}</div>
      <div class="qv-copy">
        <p class="card-cat">${CATEGORIES[p.cat].name} · ${TYPES[p.type].name}</p>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.desc)}</p>
        <ul class="qv-promise"><li>正品鉴定证书</li><li>满¥999顺丰包邮</li><li>7天无理由退换</li></ul>
        <p class="price">${formatPrice(p.price)}</p>
        <button class="btn btn-block" data-add="${p.id}" data-close>加入购物车</button>
      </div>
    </div>`;
  dlg.showModal();
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

  document.addEventListener("keydown", (e) => {
    const qv = e.target.closest && e.target.closest("[data-quick]");
    if (qv && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openQuickView(qv.dataset.quick);
    }
  });
  document.addEventListener("click", (e) => {
    const qv = e.target.closest("[data-quick]");
    if (qv) openQuickView(qv.dataset.quick);
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
