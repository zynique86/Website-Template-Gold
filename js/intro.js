// 首页开场动画（四个方案，供挑选）：
//   index.html#box    锦盒开启：盒盖掀开，钻石升起并飞入首页的月洞门
//   index.html#gate   朱门开启：印章盖上，朱红大门向两侧推开
//   index.html#ink    水墨书写：墨滴晕开，毛笔写出“金玉良缘”，墨色化开
//   index.html#scroll 卷轴展开：卷轴从中间向两侧展开，露出首页
(() => {
  const VARIANTS = ["box", "gate", "ink", "scroll"];
  const variant = location.hash.slice(1);
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
      <svg class="ink-svg" viewBox="0 0 800 400" aria-hidden="true">
        <defs>
          <filter id="inkBleed"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="28"/><feGaussianBlur stdDeviation="1.2"/></filter>
        </defs>
        <circle class="ink-drop" cx="400" cy="200" r="60" filter="url(#inkBleed)"/>
        ${["金", "玉", "良", "缘"].map((ch, i) => `<text class="ink-char" x="${190 + i * 140}" y="245" style="--i:${i}">${ch}</text>`).join("")}
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
    at(100, () => step("s1")); // 墨滴晕开
    at(700, () => step("s2")); // 逐字书写
    at(2600, () => step("s3")); // 盖印
    at(3300, () => { step("s4"); root.classList.remove("intro-playing"); }); // 墨色化开
    at(4300, () => finish(false));
  } else if (variant === "scroll") {
    at(100, () => step("s1")); // 卷轴落下
    at(1000, () => { step("s2"); root.classList.remove("intro-playing"); }); // 向两侧展开
    at(2900, () => finish(true));
  }
})();
