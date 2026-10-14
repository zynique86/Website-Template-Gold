// 首页开场动画。默认方案在 index.html 的 window.INTRO 里设置（目前为 ink）。
// 四个方案都保留，可用地址 hash 单独播放：
//   index.html#box    锦盒开启：盒盖掀开，钻石升起并飞入首页的月洞门
//   index.html#gate   朱门开启：印章盖上，朱红大门向两侧推开
//   index.html#ink    水墨书写：墨滴晕开，毛笔写出“金玉良缘”，墨色化开
//   index.html#scroll 卷轴展开：卷轴从中间向两侧展开，露出首页
(() => {
  const VARIANTS = ["box", "gate", "ink", "scroll"];
  const variant = window.INTRO;
  const root = document.documentElement;
  if (!VARIANTS.includes(variant)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("intro-playing");
    return;
  }

  const seal = `<div class="hero-seal op-seal"><span>金</span><span>玉</span><span>良</span><span>缘</span></div>`;
  const TEMPLATES = {
    box: `
      <div class="op-stage">
        <div class="op-light"></div>
        <div class="jbox">
          <div class="jbox-base">
            <i class="f front"></i><i class="f back"></i><i class="f left"></i><i class="f right"></i><i class="f inside"></i>
          </div>
          <div class="jbox-lid">
            <i class="f top"></i><i class="f front"></i><i class="f left"></i><i class="f right"></i><i class="f under"></i>
          </div>
          <span class="jbox-clasp"></span>
        </div>
        <div class="op-gem" data-jewel3d="diamond"></div>
      </div>
      <p class="op-caption">金玉良缘 · 珍藏每一刻光芒</p>`,
    gate: `
      <div class="gate gate-left"><span class="knocker"></span></div>
      <div class="gate gate-right"><span class="knocker"></span></div>
      <div class="gate-beam"></div>
      <div class="gate-seal">${seal}</div>`,
    ink: `
      <canvas class="ink-blot"></canvas>
      <svg class="ink-svg" viewBox="0 0 800 400" aria-hidden="true">
        <defs>
          <filter id="inkSpread" x="-50%" y="-50%" width="200%" height="200%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="3"/><feDisplacementMap in="SourceGraphic" scale="40"/><feGaussianBlur stdDeviation="6"/></filter>
          <filter id="inkBleed"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="28"/><feGaussianBlur stdDeviation="1.2"/></filter>
        </defs>
        ${["金", "玉", "良", "缘"].map((ch, i) => {
          // 每个字两层：先描出笔画轮廓，再用一团不规则的墨从字中心慢慢晕开填满
          const x = 190 + i * 140;
          return `
          <mask id="inkMask${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="400">
            <g filter="url(#inkSpread)">
              <circle cx="${x}" cy="195" r="0" fill="#fff">
                <animate class="ink-anim" attributeName="r" from="0" to="120" dur="2s" begin="indefinite" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".15 .7 .3 1" data-delay="${i * 380 + 1000}"/>
              </circle>
            </g>
          </mask>
          <text class="ink-fill" x="${x}" y="245" mask="url(#inkMask${i})" filter="url(#inkSoft${i})">${ch}</text>
          <filter id="inkSoft${i}" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3">
              <animate class="ink-anim" attributeName="stdDeviation" from="3" to="0" dur="2s" begin="indefinite" fill="freeze" data-delay="${i * 380 + 1000}"/>
            </feGaussianBlur>
          </filter>
          <text class="ink-char" x="${x}" y="245" style="--i:${i}">${ch}</text>`;
        }).join("")}
      </svg>
      <div class="ink-seal">${seal}</div>
      <div class="ink-wash"></div>`,
    scroll: `
      <div class="scroll-mount scroll-left"><span class="roller"></span></div>
      <div class="scroll-mount scroll-right"><span class="roller"></span></div>
      <div class="scroll-tag">金玉良缘</div>`,
  };

  const op = document.createElement("div");
  op.className = `opening op-${variant}`;
  op.setAttribute("aria-hidden", "true");
  op.innerHTML = TEMPLATES[variant] + `<button class="op-skip" type="button">跳过 ›</button>`;
  document.body.prepend(op);
  document.body.style.overflow = "hidden";

  let done = false;
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  function finish(fade = true) {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    root.classList.remove("intro-playing");
    document.body.style.overflow = "";
    const hg = document.querySelector(".hero-gem");
    if (hg) hg.style.opacity = "";
    if (fade) {
      op.classList.add("op-out");
      setTimeout(() => op.remove(), 700);
    } else op.remove();
  }
  op.querySelector(".op-skip").addEventListener("click", () => finish());

  const step = (cls) => op.classList.add(cls);

  if (variant === "box") {
    const heroGem = document.querySelector(".hero-gem");
    if (heroGem) heroGem.style.opacity = "0";
    at(100, () => step("s1")); // 盒子出现
    at(900, () => step("s2")); // 盒盖掀开、金光透出
    at(1700, () => step("s3")); // 钻石升起
    at(2900, () => {
      // 钻石飞向首页右侧的月洞门
      step("s4");
      const gem = op.querySelector(".op-gem");
      const from = gem.getBoundingClientRect();
      const to = heroGem ? heroGem.getBoundingClientRect() : from;
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const k = to.width / from.width;
      gem.animate([{ transform: "translate(0,0) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${k})` }], { duration: 900, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" });
      root.classList.remove("intro-playing");
    });
    at(3800, () => {
      if (heroGem) heroGem.style.opacity = "";
      finish(false);
    });
  } else if (variant === "gate") {
    at(100, () => step("s1")); // 印章盖上
    at(1300, () => step("s2")); // 门缝透光
    at(1700, () => { step("s3"); root.classList.remove("intro-playing"); }); // 开门
    at(3400, () => finish(false));
  } else if (variant === "ink") {
    const blot = inkBlot(op.querySelector(".ink-blot"));
    at(100, () => blot.spread(4300)); // 墨团晕开，一直扩散到「缘」字晕完
    at(100, () => step("s1")); // 墨滴晕开
    // 「缘」的墨色晕完（最后一个晕染动画结束）就立刻收起墨团、盖上印章，然后整页化开
    let sealed = false;
    const seal = () => {
      if (sealed) return;
      sealed = true;
      blot.fadeOut(600);
      step("s3");
      at(900, () => { step("s4"); root.classList.remove("intro-playing"); });
      at(1900, () => finish(false));
    };
    at(700, () => {
      step("s2"); // 逐字书写，墨色随后慢慢晕开填满
      const anims = [...op.querySelectorAll(".ink-anim")];
      anims.forEach((a) => at(+a.dataset.delay, () => a.beginElement && a.beginElement()));
      anims[anims.length - 1].addEventListener("endEvent", seal);
      at(4140 + 150, seal); // 保底：个别浏览器不触发 endEvent 时也按时盖印
    });
  } else if (variant === "scroll") {
    at(100, () => step("s1")); // 卷轴落下
    at(1000, () => { step("s2"); root.classList.remove("intro-playing"); }); // 向两侧展开
    at(2900, () => finish(true));
  }
  // 墨滴落在宣纸上：先算出每个像素被墨“渗到”的时间（离中心越远越晚，再叠加噪声形成不规则的毛边和墨丝），
  // 每帧只按时间阈值着色，不做滤镜重算，所以晕开过程连续顺滑。边缘略深，模拟墨在纸上推进时的水线。
  function inkBlot(canvas) {
    const W = 360, H = 270;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(W, H);
    const N = 64, grid = new Float32Array(N * N);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < grid.length; i++) grid[i] = rnd();
    const sm = (t) => t * t * (3 - 2 * t);
    const noise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const g = (a, b) => grid[((b & (N - 1)) * N) + (a & (N - 1))];
      const a = g(xi, yi) + (g(xi + 1, yi) - g(xi, yi)) * xf;
      const b = g(xi, yi + 1) + (g(xi + 1, yi + 1) - g(xi, yi + 1)) * xf;
      return a + (b - a) * yf;
    };
    const fbm = (x, y) => noise(x, y) * 0.5 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.2;
    const arrive = new Float32Array(W * H), dens = new Float32Array(W * H);
    const cx = W / 2, cy = H / 2, R = H * 0.46;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx = (x - cx) / R, dy = (y - cy) / R * 1.15, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        // 角度噪声决定墨往哪个方向渗得更远（墨丝），位置噪声让边缘毛糙
        const fingers = fbm(Math.cos(th) * 3.4 + 9, Math.sin(th) * 3.4 + 9);
        const rough = fbm(x * 0.06, y * 0.06);
        arrive[y * W + x] = r / (0.45 + fingers * 0.95) + (rough - 0.5) * 0.22;
        dens[y * W + x] = 0.3 + (1 - Math.min(r, 1)) * 0.22 + (fbm(x * 0.03 + 3, y * 0.03) - 0.5) * 0.34;
      }
    }
    let raf = 0, t0 = 0, dur = 1, fade = 1, fadeT0 = 0, fadeDur = 1;
    function draw(now) {
      const u = Math.min(1, (now - t0) / dur);
      const reach = 1.25 * (1 - Math.pow(1 - u, 2.6)); // 先快后慢，越晕越慢
      if (fadeT0) fade = Math.max(0, 1 - (now - fadeT0) / fadeDur);
      const d = img.data;
      for (let i = 0, j = 0; i < arrive.length; i++, j += 4) {
        const f = reach - arrive[i];
        let a = 0;
        if (f > 0) {
          const edge = Math.min(1, f / 0.06);
          a = dens[i] * edge + 0.3 * Math.exp(-f / 0.07) * edge; // 推进中的边缘更深
        }
        d[j] = 29; d[j + 1] = 25; d[j + 2] = 21;
        d[j + 3] = Math.max(0, Math.min(255, a * 255 * fade));
      }
      ctx.putImageData(img, 0, 0);
      if ((u < 1 || fadeT0) && fade > 0) raf = requestAnimationFrame(draw);
    }
    return {
      spread(ms) { dur = ms; t0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); },
      fadeOut(ms) { fadeDur = ms; fadeT0 = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); },
    };
  }
})();
