// 首页开场动画：珠宝从天而降，堆成一座金山，然后进入首页（Matter.js 物理引擎）
(() => {
  const intro = document.querySelector("[data-intro]");
  if (!intro) return;
  const root = document.documentElement;

  let finished = false;
  function enter() {
    if (finished) return;
    finished = true;
    root.classList.remove("intro-playing");
    intro.classList.add("leaving");
    setTimeout(() => {
      intro.remove();
      document.body.style.overflow = "";
    }, 1100);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.Matter || reduceMotion) {
    root.classList.remove("intro-playing");
    intro.remove();
    return;
  }

  document.body.style.overflow = "hidden";
  intro.querySelector(".intro-skip").addEventListener("click", enter);

  const { Engine, Bodies, Composite, Body } = Matter;
  const canvas = intro.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const S = Math.max(26, Math.min(W, H) / 20); // 单件珠宝尺寸
  const groundY = H - Math.max(24, H * 0.05);

  /* ---------- 珠宝贴图（离屏画布预渲染） ---------- */
  function sprite(draw) {
    const D = Math.ceil(S * 1.6);
    const c = document.createElement("canvas");
    c.width = c.height = D * dpr;
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.translate(D / 2, D / 2);
    draw(g, S * 0.62);
    return { img: c, D };
  }
  const lin = (g, x0, y0, x1, y1, stops) => {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    return gr;
  };

  function gem(tint) {
    return (g, r) => {
      const [hi, mid, lo] = tint;
      const crown = [[-0.45 * r, -0.55 * r], [0.45 * r, -0.55 * r], [r, -0.12 * r], [-r, -0.12 * r]];
      g.beginPath();
      crown.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.closePath();
      g.fillStyle = lin(g, -r, -r, r, 0, [[0, hi], [0.5, mid], [1, hi]]);
      g.fill();
      g.beginPath();
      g.moveTo(-r, -0.12 * r);
      g.lineTo(r, -0.12 * r);
      g.lineTo(0, 0.95 * r);
      g.closePath();
      g.fillStyle = lin(g, -r, 0, r, r, [[0, mid], [0.45, hi], [1, lo]]);
      g.fill();
      g.strokeStyle = "rgba(255,255,255,.75)";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(-0.45 * r, -0.55 * r); g.lineTo(-0.2 * r, -0.12 * r); g.lineTo(0, -0.55 * r); g.lineTo(0.2 * r, -0.12 * r); g.lineTo(0.45 * r, -0.55 * r);
      g.moveTo(-0.2 * r, -0.12 * r); g.lineTo(0, 0.95 * r); g.lineTo(0.2 * r, -0.12 * r);
      g.moveTo(-0.6 * r, -0.12 * r); g.lineTo(0, 0.95 * r); g.lineTo(0.6 * r, -0.12 * r);
      g.stroke();
    };
  }
  const goldGrad = (g, r) => lin(g, -r, -r, r, r, [[0, "#fff1b8"], [0.35, "#f2c14e"], [0.7, "#b8861f"], [1, "#f7d878"]]);

  const SPRITES = {
    diamond: sprite(gem(["#ffffff", "#cfe3ff", "#8fa9cf"])),
    ruby: sprite(gem(["#ffb3b8", "#d1202f", "#6d0a14"])),
    emerald: sprite(gem(["#b8f5cf", "#1f9e5a", "#0b4a2a"])),
    sapphire: sprite(gem(["#b9cdff", "#2547b8", "#0d1c5a"])),
    ingot: sprite((g, r) => {
      // 元宝
      g.beginPath();
      g.moveTo(-1.05 * r, -0.35 * r);
      g.quadraticCurveTo(-0.85 * r, 0.55 * r, 0, 0.55 * r);
      g.quadraticCurveTo(0.85 * r, 0.55 * r, 1.05 * r, -0.35 * r);
      g.quadraticCurveTo(0.6 * r, -0.05 * r, 0, -0.05 * r);
      g.quadraticCurveTo(-0.6 * r, -0.05 * r, -1.05 * r, -0.35 * r);
      g.fillStyle = goldGrad(g, r);
      g.fill();
      g.strokeStyle = "#8a6216";
      g.lineWidth = 1.2;
      g.stroke();
      g.beginPath();
      g.ellipse(0, -0.12 * r, 0.42 * r, 0.36 * r, 0, Math.PI, 0);
      g.fillStyle = lin(g, -0.4 * r, -0.5 * r, 0.4 * r, 0, [[0, "#fff6cf"], [0.6, "#e8b23a"], [1, "#a8781a"]]);
      g.fill();
      g.stroke();
    }),
    coin: sprite((g, r) => {
      // 金钱币
      g.beginPath();
      g.arc(0, 0, 0.7 * r, 0, Math.PI * 2);
      g.fillStyle = goldGrad(g, r);
      g.fill();
      g.strokeStyle = "#8a6216";
      g.lineWidth = 1.2;
      g.stroke();
      g.beginPath();
      g.arc(0, 0, 0.56 * r, 0, Math.PI * 2);
      g.strokeStyle = "rgba(138,98,22,.6)";
      g.stroke();
      g.fillStyle = "#5a3a0a";
      g.fillRect(-0.16 * r, -0.16 * r, 0.32 * r, 0.32 * r);
    }),
    bangle: sprite((g, r) => {
      // 翡翠手镯
      g.beginPath();
      g.arc(0, 0, 0.72 * r, 0, Math.PI * 2);
      g.lineWidth = 0.28 * r;
      g.strokeStyle = lin(g, -r, -r, r, r, [[0, "#b8f0cc"], [0.4, "#2f9e5f"], [0.75, "#17643a"], [1, "#7fd6a2"]]);
      g.stroke();
      g.beginPath();
      g.arc(0, 0, 0.72 * r, Math.PI * 1.1, Math.PI * 1.45);
      g.lineWidth = 0.08 * r;
      g.strokeStyle = "rgba(255,255,255,.7)";
      g.stroke();
    }),
    pearl: sprite((g, r) => {
      const gr = g.createRadialGradient(-0.15 * r, -0.15 * r, 0, 0, 0, 0.45 * r);
      gr.addColorStop(0, "#ffffff");
      gr.addColorStop(0.6, "#f1e6e2");
      gr.addColorStop(1, "#b9aaa4");
      g.beginPath();
      g.arc(0, 0, 0.42 * r, 0, Math.PI * 2);
      g.fillStyle = gr;
      g.fill();
    }),
  };

  // 种类：权重、物理形状
  const KINDS = [
    ["diamond", 22, () => ({ sides: 6, r: S * 0.5 })],
    ["ingot", 15, () => ({ rect: [S * 1.2, S * 0.55] })],
    ["coin", 17, () => ({ sides: 9, r: S * 0.44 })],
    ["bangle", 10, () => ({ sides: 12, r: S * 0.6 })],
    ["pearl", 12, () => ({ sides: 8, r: S * 0.27 })],
    ["ruby", 8, () => ({ sides: 6, r: S * 0.5 })],
    ["emerald", 8, () => ({ sides: 6, r: S * 0.5 })],
    ["sapphire", 8, () => ({ sides: 6, r: S * 0.5 })],
  ];
  const totalW = KINDS.reduce((s, k) => s + k[1], 0);
  function pickKind() {
    let x = Math.random() * totalW;
    for (const k of KINDS) if ((x -= k[1]) < 0) return k;
    return KINDS[0];
  }
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  /* ---------- 物理世界 ---------- */
  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.15;
  const opts = { isStatic: true, render: { visible: false } };
  const ground = Bodies.rectangle(W / 2, groundY + 50, W * 3, 100, opts);
  Composite.add(engine.world, ground);

  const COUNT = Math.round(Math.max(170, Math.min(300, (W * H) / 4200)));
  const DROP_MS = 3200;
  const pieces = [];
  let spawned = 0;

  function spawn() {
    const [kind, , shape] = pickKind();
    const sh = shape();
    const x = W / 2 + gauss() * Math.min(W * 0.16, H * 0.22);
    const y = -S - Math.random() * H * 0.25;
    const common = { friction: 0.9, frictionStatic: 6, restitution: 0.12, frictionAir: 0.012, density: 0.002 };
    const body = sh.rect
      ? Bodies.rectangle(x, y, sh.rect[0], sh.rect[1], { ...common, chamfer: { radius: S * 0.12 } })
      : Bodies.polygon(x, y, sh.sides, sh.r, common);
    Body.setAngle(body, Math.random() * Math.PI * 2);
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
    Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 4 + Math.random() * 6 });
    body.kind = kind;
    pieces.push(body);
    Composite.add(engine.world, body);
  }

  /* ---------- 闪光 ---------- */
  const glints = [];
  function addGlint() {
    if (!pieces.length) return;
    const b = pieces[(Math.random() * pieces.length) | 0];
    if (b.position.y < 0) return;
    glints.push({ x: b.position.x + (Math.random() - 0.5) * S * 0.4, y: b.position.y - S * 0.2, life: 0, max: 26 + Math.random() * 20, size: S * (0.35 + Math.random() * 0.4) });
  }
  function drawGlint(gl) {
    const k = Math.sin((gl.life / gl.max) * Math.PI);
    const s = gl.size * k;
    ctx.save();
    ctx.translate(gl.x, gl.y);
    ctx.globalAlpha = k;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#ffe6a0";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- 主循环 ---------- */
  const start = performance.now();
  let last = start;
  let revealed = false;
  let peakY = groundY;

  function frame(now) {
    if (finished && !intro.isConnected) return;
    const t = now - start;
    // 按节奏投放：先稀后密
    const target = Math.min(COUNT, Math.floor(COUNT * Math.pow(Math.min(1, t / DROP_MS), 0.8)));
    while (spawned < target) { spawn(); spawned++; }

    const dt = Math.min(32, now - last);
    last = now;
    Engine.update(engine, dt);

    ctx.clearRect(0, 0, W, H);
    // 地面倒影光
    const floor = ctx.createRadialGradient(W / 2, groundY, 0, W / 2, groundY, W * 0.5);
    floor.addColorStop(0, "rgba(255,200,110,.35)");
    floor.addColorStop(1, "rgba(255,200,110,0)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, groundY - H * 0.25, W, H * 0.3);

    peakY = groundY;
    for (const b of pieces) {
      // 落定的珠宝就地“定住”，层层堆高成山，而不是摊平
      if (!b.isStatic) {
        b.still = b.speed < 0.45 && b.angularSpeed < 0.05 ? (b.still || 0) + 1 : 0;
        if (b.still > 10) Body.setStatic(b, true);
      }
      const sp = SPRITES[b.kind];
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);
      ctx.drawImage(sp.img, -sp.D / 2, -sp.D / 2, sp.D, sp.D);
      ctx.restore();
      if (b.isStatic) peakY = Math.min(peakY, b.position.y);
    }

    if (t > 600 && Math.random() < 0.55) addGlint();
    for (let i = glints.length - 1; i >= 0; i--) {
      const gl = glints[i];
      gl.life++;
      drawGlint(gl);
      if (gl.life > gl.max) glints.splice(i, 1);
    }

    // 堆好之后：山顶放光，出现标题
    const settled = spawned >= COUNT && t > DROP_MS + 1200 && (t > DROP_MS + 2600 || pieces.every((b) => b.isStatic));
    if (settled && !revealed) {
      revealed = true;
      intro.style.setProperty("--peak", `${Math.max(H * 0.3, peakY)}px`);
      intro.classList.add("revealed");
      setTimeout(enter, 2600);
    }
    if (!finished || intro.isConnected) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  intro.addEventListener("click", (e) => { if (revealed && !e.target.closest(".intro-skip")) enter(); });
})();
