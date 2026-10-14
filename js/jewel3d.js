// 3D 旋转珠宝（Three.js 渲染）：钻石、翡翠手镯、金戒指、银手镯
// 用法：<div data-jewel3d="diamond|jade|gold|silver"></div>
function mountJewel3D(host) {
  if (!host || !window.THREE || host.classList.contains("is-3d")) return;
  const kind = host.dataset.jewel3d || "diamond";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    return; // 不支持 WebGL 时保留静态 SVG 钻石
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  host.appendChild(renderer.domElement);
  host.classList.add("is-3d");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.45, 5.4);
  camera.lookAt(0, 0, 0);

  /* ---------- 钻石几何：台面 + 冠部 + 腰棱 + 亭部 ---------- */
  function brilliantGeometry() {
  function ring(n, r, y, offset = 0) {
    return Array.from({ length: n }, (_, i) => {
      const a = ((i + offset) / n) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });
  }
  const N = 16;
  const table = ring(8, 0.56, 0.42);
  const star = ring(8, 0.82, 0.3, 0.5);
  const girdleTop = ring(N, 1, 0.04);
  const girdleBot = ring(N, 1, -0.04);
  const pavMid = ring(8, 0.5, -0.6, 0.5);
  const tableCenter = new THREE.Vector3(0, 0.42, 0);
  const culet = new THREE.Vector3(0, -1.22, 0);

  const pos = [];
  const tri = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let i = 0; i < 8; i++) {
    const t0 = table[i], t1 = table[(i + 1) % 8];
    const s = star[i];
    const g0 = girdleTop[2 * i], g1 = girdleTop[2 * i + 1], g2 = girdleTop[(2 * i + 2) % N];
    tri(tableCenter, t1, t0); // 台面
    tri(t0, t1, s); // 星刻面
    tri(t0, s, g0); // 风筝面
    tri(s, g1, g0);
    tri(s, t1, g2);
    tri(s, g2, g1);
    // 亭部
    const b0 = girdleBot[2 * i], b1 = girdleBot[2 * i + 1], b2 = girdleBot[(2 * i + 2) % N];
    const p = pavMid[i];
    tri(b0, b1, p);
    tri(b1, b2, p);
    tri(b0, p, culet);
    tri(p, b2, culet);
  }
  for (let j = 0; j < N; j++) {
    // 腰棱
    const a = girdleTop[j], b = girdleTop[(j + 1) % N], c = girdleBot[j], d = girdleBot[(j + 1) % N];
    tri(a, b, c);
    tri(b, d, c);
  }
  // 统一朝外的法线
  for (let k = 0; k < pos.length; k += 9) {
    const A = new THREE.Vector3(pos[k], pos[k + 1], pos[k + 2]);
    const B = new THREE.Vector3(pos[k + 3], pos[k + 4], pos[k + 5]);
    const C = new THREE.Vector3(pos[k + 6], pos[k + 7], pos[k + 8]);
    const n = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3().subVectors(C, A));
    const centroid = A.clone().add(B).add(C).divideScalar(3);
    if (n.dot(centroid) < 0) {
      for (let m = 0; m < 3; m++) [pos[k + 3 + m], pos[k + 6 + m]] = [pos[k + 6 + m], pos[k + 3 + m]];
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
  }

  /* ---------- 环境贴图：明暗交错的“珠宝柜灯光”，让切面闪烁 ---------- */
  function envFace(seed) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, "#8a8f99");
    bg.addColorStop(0.5, "#3a3d44");
    bg.addColorStop(1, "#0d0e12");
    g.fillStyle = bg;
    g.fillRect(0, 0, 256, 256);
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 10; i++) {
      const x = rnd() * 256, y = rnd() * 256, r = 20 + rnd() * 70;
      const warm = rnd() < 0.25;
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, warm ? "rgba(255,226,160,1)" : "rgba(255,255,255,1)");
      grd.addColorStop(0.35, warm ? "rgba(233,190,110,.6)" : "rgba(220,235,255,.55)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
    }
    // 柔光灯条
    g.fillStyle = "rgba(255,255,255,.85)";
    g.fillRect(rnd() * 200, rnd() * 200, 40 + rnd() * 60, 6);
    return c;
  }
  const env = new THREE.CubeTexture([1, 2, 3, 4, 5, 6].map((n) => envFace(n * 97)));
  env.encoding = THREE.sRGBEncoding;
  env.needsUpdate = true;
  scene.environment = env;

  const diamond = new THREE.Group();
  const geo = brilliantGeometry();
  const stone = (scale = 1) => {
    const g = new THREE.Group();
    g.add(
      new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.04, envMap: env, envMapIntensity: 2.2, flatShading: true })),
      // 色散“火彩”：按切面朝向叠加彩虹色，旋转时不断变化
      new THREE.Mesh(geo, new THREE.MeshNormalMaterial({ flatShading: true, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false })),
      // 棱线
      new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }))
    );
    g.scale.setScalar(scale);
    return g;
  };
  const metal = (color, roughness) => new THREE.MeshStandardMaterial({ color, metalness: 1, roughness, envMap: env, envMapIntensity: 1.6 });

  let baseTilt = 0.4;
  if (kind === "jade") {
    // 翡翠手镯：通透绿色，带内部光晕
    const bangle = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.26, 48, 160),
      new THREE.MeshPhysicalMaterial({ color: 0x2f9e5f, emissive: 0x0d3d22, emissiveIntensity: 0.6, metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMap: env, envMapIntensity: 1.3, transparent: true, opacity: 0.93 })
    );
    diamond.add(bangle);
    baseTilt = 1.0;
  } else if (kind === "gold") {
    // 足金戒指：戒圈 + 主钻
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.13, 40, 160), metal(0xf5c451, 0.16));
    const gem = stone(0.42);
    gem.position.y = 1.18;
    const setting = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 0.22, 24), metal(0xf5c451, 0.2));
    setting.position.y = 1.05;
    diamond.add(band, setting, gem);
    diamond.scale.setScalar(0.95);
    diamond.position.y = -0.15;
    baseTilt = 0.15;
  } else if (kind === "silver") {
    // 纯银开口手镯：两端各有一颗银珠
    const arc = Math.PI * 1.7;
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.11, 32, 160, arc), metal(0xe9eef3, 0.12));
    cuff.rotation.z = (Math.PI * 2 - arc) / 2 + Math.PI / 2;
    const ball = (a) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.19, 32, 24), metal(0xe9eef3, 0.08));
      const ang = a + cuff.rotation.z;
      m.position.set(Math.cos(ang) * 1.05, Math.sin(ang) * 1.05, 0);
      return m;
    };
    diamond.add(cuff, ball(0), ball(arc));
    baseTilt = 0.9;
  } else {
    diamond.add(stone(1));
  }
  diamond.rotation.x = baseTilt;
  scene.add(diamond);

  // 环绕的彩色点光源，制造跳动的高光
  const lights = [0xffffff, 0xfff1c9, 0xc4e4ff].map((color, i) => {
    const l = new THREE.PointLight(color, 2.2, 12);
    scene.add(l);
    return { l, phase: (i / 3) * Math.PI * 2 };
  });
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // 鼠标影响倾角
  let targetTilt = baseTilt, targetLean = 0;
  const hero = host.closest(".hero, .cat-hero");
  if (hero) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      targetTilt = baseTilt + ((e.clientY - r.top) / r.height - 0.5) * 0.5;
      targetLean = ((e.clientX - r.left) / r.width - 0.5) * 0.4;
    });
    hero.addEventListener("pointerleave", () => { targetTilt = baseTilt; targetLean = 0; });
  }

  // 只在横幅可见时渲染，节省电量
  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(host);
  }

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    if (visible) {
      diamond.rotation.y = t * 0.6;
      diamond.rotation.x += (targetTilt - diamond.rotation.x) * 0.05;
      diamond.rotation.z += (targetLean - diamond.rotation.z) * 0.05;
      diamond.position.y = (kind === "gold" ? -0.15 : 0) + Math.sin(t * 1.2) * 0.08;
      lights.forEach(({ l, phase }) => {
        const a = t * 0.9 + phase;
        l.position.set(Math.cos(a) * 3, 1.5 + Math.sin(a * 1.3) * 1.2, Math.sin(a) * 3);
      });
      renderer.render(scene, camera);
    }
    if (!reduceMotion) requestAnimationFrame(tick);
  }
  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-jewel3d]").forEach(mountJewel3D);
});
