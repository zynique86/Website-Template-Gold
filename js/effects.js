// 视觉特效：金粉粒子、卡片倾斜与流光、滚动渐显、飞入购物车、付款成功金色礼花
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 金粉粒子（横幅背景） ---------- */
  function goldDust(canvas, opts = {}) {
    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    const count = opts.count || 70;
    let w, h, dpr, particles;
    let mouse = { x: -999, y: -999 };

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.35 + 0.08),
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
      hue: opts.hue != null ? opts.hue : 40 + Math.random() * 12,
    });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, make);
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.phase += p.speed;
        // 鼠标附近的粒子被轻轻推开
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          p.x += (dx / dist) * 1.2;
          p.y += (dy / dist) * 1.2;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const a = 0.35 + Math.sin(p.phase) * 0.35;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `hsla(${p.hue}, 90%, 80%, ${a})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(frame);
    }

    host.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    host.addEventListener("pointerleave", () => (mouse = { x: -999, y: -999 }));
    window.addEventListener("resize", resize);
    resize();
    frame();
  }

  /* ---------- 卡片 3D 倾斜 + 跟随光斑 ---------- */
  function cardTilt() {
    if (!finePointer || reduceMotion) return;
    const sel = ".card, .cat-tile";
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(sel);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--tx", `${(0.5 - y) * 8}deg`);
      card.style.setProperty("--ty", `${(x - 0.5) * 10}deg`);
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.classList.add("is-tilting");
    });
    document.addEventListener("pointerout", (e) => {
      const card = e.target.closest(sel);
      if (card && !card.contains(e.relatedTarget)) {
        card.classList.remove("is-tilting");
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--ty", "0deg");
      }
    });
  }

  /* ---------- 滚动渐显（新渲染的卡片也会生效） ---------- */
  function scrollReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px" }
    );
    const targets = ".card, .cat-tile, .promise, .section-head, .cart-item, .panel";
    const watch = (root) => {
      root.querySelectorAll(targets).forEach((el, i) => {
        if (el.dataset.revealed) return;
        el.dataset.revealed = "1";
        // 已在首屏内的元素直接带延迟依次出现
        el.style.setProperty("--delay", `${(i % 8) * 60}ms`);
        el.classList.add("reveal");
        io.observe(el);
      });
    };
    watch(document);
    new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && watch(n.parentElement || document)))).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- 加入购物车：宝石飞入购物车 ---------- */
  function flyToCart() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      const cart = document.querySelector(".cart-link");
      const art = btn.closest(".card")?.querySelector(".card-art svg");
      if (!cart) return;
      const bump = () => {
        cart.classList.remove("bump");
        void cart.offsetWidth;
        cart.classList.add("bump");
      };
      if (!art || reduceMotion) return bump();
      const from = art.getBoundingClientRect();
      const to = cart.getBoundingClientRect();
      const ghost = art.cloneNode(true);
      ghost.classList.add("fly-ghost");
      Object.assign(ghost.style, { left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px" });
      document.body.appendChild(ghost);
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const anim = ghost.animate(
        [
          { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(.55) rotate(180deg)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(360deg)`, opacity: 0.2 },
        ],
        { duration: 750, easing: "cubic-bezier(.5,0,.3,1)" }
      );
      anim.onfinish = () => {
        ghost.remove();
        bump();
      };
    });
  }

  /* ---------- 金色礼花（付款成功） ---------- */
  function confetti() {
    if (reduceMotion) return;
    const c = document.createElement("canvas");
    c.className = "fx-confetti";
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    const w = (c.width = innerWidth), h = (c.height = innerHeight);
    const colors = ["#e9d29a", "#b8913a", "#fff4cf", "#8a6a22", "#ffffff"];
    const bits = Array.from({ length: 160 }, () => ({
      x: w / 2, y: h * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      s: Math.random() * 7 + 3,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      diamond: Math.random() < 0.4,
    }));
    let t = 0;
    (function tick() {
      ctx.clearRect(0, 0, w, h);
      bits.forEach((b) => {
        b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = Math.max(0, 1 - t / 150);
        if (b.diamond) {
          ctx.beginPath();
          ctx.moveTo(0, -b.s); ctx.lineTo(b.s * 0.7, 0); ctx.lineTo(0, b.s); ctx.lineTo(-b.s * 0.7, 0);
          ctx.fill();
        } else ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      });
      if (++t < 150) requestAnimationFrame(tick);
      else c.remove();
    })();
  }

  function watchSuccess() {
    const box = document.querySelector("[data-checkout]");
    if (!box) return;
    new MutationObserver(() => {
      if (box.querySelector(".success") && !box.dataset.celebrated) {
        box.dataset.celebrated = "1";
        confetti();
      }
    }).observe(box, { childList: true, subtree: true });
  }

  /* ---------- 鼠标闪光拖尾（仅桌面） ---------- */
  function sparkleTrail() {
    if (!finePointer || reduceMotion) return;
    let last = 0;
    document.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const s = document.createElement("span");
      s.className = "trail-spark";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });
  }

  /* ---------- 页头滚动后收紧 ---------- */
  function headerScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const heroCanvas = document.querySelector(".hero .fx-dust");
    if (heroCanvas) goldDust(heroCanvas, { count: 90 });

    const catHero = document.querySelector(".cat-hero");
    if (catHero) {
      const c = document.createElement("canvas");
      c.className = "fx-dust";
      c.setAttribute("aria-hidden", "true");
      catHero.prepend(c);
      // 中国风装饰：祥云与材质印章
      const seals = { jade: "翠", gold: "金", silver: "银", diamond: "钻" };
      catHero.insertAdjacentHTML(
        "beforeend",
        `<span class="cloud cloud-1" aria-hidden="true"></span><span class="cloud cloud-3" aria-hidden="true"></span><div class="cn-seal" aria-hidden="true">${seals[document.body.dataset.page] || "宝"}</div>`
      );
      const hues = { jade: 140, gold: 44, silver: 210, diamond: 205 };
      goldDust(c, { count: 50, hue: hues[document.body.dataset.page] });
    }

    cardTilt();
    scrollReveal();
    flyToCart();
    watchSuccess();
    sparkleTrail();
    headerScroll();
  });
})();
