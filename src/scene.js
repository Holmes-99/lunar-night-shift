// 3D low-poly diorama of the Atacama test base, built only from code (no model files).
// The UI drives it with setTime, playDay, setDust, setPlants, setWater, setDrilling.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const COLORS = {
  sand: 0xd9a066,
  sandDark: 0xc2864f,
  rock: 0x9c5a3c,
  rockDark: 0x6e3b28,
  snow: 0xf4f1ec,
  white: 0xeef2f5,
  panel: 0x1f3a6b,
  dirty: 0x8a6a45,
  glass: 0xbfe6ff,
  leaf: 0x4caf50,
  wilt: 0x8d6e3f,
  water: 0x3aa0ff,
  orange: 0xff7a2f,
  metal: 0x9aa4ad
};

const SKY_DAY = new THREE.Color(0x8fd0ff);
const SKY_DUSK = new THREE.Color(0xff9d6b);
const SKY_NIGHT = new THREE.Color(0x0b1030);

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, metalness: 0, ...extra });
}

function dune(x, z) {
  return Math.sin(x * 0.55) * 0.25 + Math.cos(z * 0.45 + 1.3) * 0.22 + Math.sin((x + z) * 0.9) * 0.08;
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function createScene(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = SKY_DAY.clone();
  scene.fog = new THREE.Fog(SKY_DAY.clone(), 30, 70);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(15, 11, 17);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 12;
  controls.maxDistance = 34;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;

  // Lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb07a4a, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -13; sc.right = 13; sc.top = 13; sc.bottom = -13; sc.near = 1; sc.far = 60;
  scene.add(sun);
  scene.add(sun.target);
  const moonLight = new THREE.DirectionalLight(0x8fa8ff, 0);
  scene.add(moonLight);

  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe08a, fog: false }));
  const moonBall = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 12), new THREE.MeshBasicMaterial({ color: 0xe8eefc, fog: false }));
  scene.add(sunBall, moonBall);

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 700; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(80);
    if (v.y < 2) v.y = Math.abs(v.y) + 2;
    starPos.push(v.x, v.y, v.z);
  }
  starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0, fog: false });
  scene.add(new THREE.Points(starGeo, starMat));

  // Floating island: dune surface + rock underside
  const world = new THREE.Group();
  scene.add(world);
  const R = 10;
  const ground = new THREE.PlaneGeometry(2 * R + 2, 2 * R + 2, 56, 56);
  ground.rotateX(-Math.PI / 2);
  const gp = ground.attributes.position;
  const gcol = [];
  const cSand = new THREE.Color(COLORS.sand);
  const cSandD = new THREE.Color(COLORS.sandDark);
  for (let i = 0; i < gp.count; i++) {
    let x = gp.getX(i);
    let z = gp.getZ(i);
    const r = Math.hypot(x, z);
    let y;
    if (r > R) {
      x = (x / r) * R;
      z = (z / r) * R;
      y = -0.3;
    } else {
      y = dune(x, z) * smoothstep(2.5, 7, r) + 0.05;
    }
    gp.setXYZ(i, x, y, z);
    const c = cSand.clone().lerp(cSandD, Math.min(0.6, Math.max(0, y * 0.9 + 0.15)));
    gcol.push(c.r, c.g, c.b);
  }
  ground.setAttribute("color", new THREE.Float32BufferAttribute(gcol, 3));
  ground.computeVertexNormals();
  const groundMesh = new THREE.Mesh(ground, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1 }));
  groundMesh.receiveShadow = true;
  world.add(groundMesh);

  const under = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.55, 3.2, 28, 3), mat(COLORS.rock));
  under.position.y = -1.9;
  world.add(under);
  const under2 = new THREE.Mesh(new THREE.ConeGeometry(R * 0.55, 3, 20), mat(COLORS.rockDark));
  under2.rotation.x = Math.PI;
  under2.position.y = -4.9;
  world.add(under2);

  // Volcanoes in the back, like the snowy peaks near the Atacama
  function volcano(x, z, h, r) {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 9), mat(COLORS.rock));
    cone.position.y = h / 2 - 0.3;
    cone.castShadow = true;
    const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.32, h * 0.3, 9), mat(COLORS.snow));
    cap.position.y = h - 0.3 - h * 0.15 + 0.02;
    g.add(cone, cap);
    g.position.set(x, 0, z);
    world.add(g);
  }
  volcano(-5.5, -6.5, 5.5, 2.6);
  volcano(-1.5, -8, 4.2, 2.1);
  volcano(3.2, -7.4, 3.4, 1.8);

  // Rocks
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 5.5;
    const s = 0.12 + Math.random() * 0.35;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat(i % 2 ? COLORS.rock : COLORS.rockDark));
    rock.position.set(Math.cos(a) * r, dune(Math.cos(a) * r, Math.sin(a) * r) * smoothstep(2.5, 7, r) + s * 0.4, Math.sin(a) * r);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    world.add(rock);
  }

  // Main habitat with glowing windows
  const windows = [];
  const hab = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.6, 20), mat(COLORS.white));
  body.position.y = 0.8;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(COLORS.white));
  dome.position.y = 1.6;
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.52, 0.18, 20), mat(COLORS.orange));
  stripe.position.y = 0.35;
  hab.add(body, dome, stripe);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.05), new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0xffc46b, emissiveIntensity: 0 }));
    w.position.set(Math.sin(a) * 1.5, 1.05, Math.cos(a) * 1.5);
    w.rotation.y = a;
    windows.push(w);
    hab.add(w);
  }
  hab.traverse((o) => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
  world.add(hab);

  // Lab module (horizontal) + tunnel
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 2.4, 16), mat(COLORS.white));
  lab.rotation.z = Math.PI / 2;
  lab.position.set(3.1, 0.72, 0.6);
  lab.castShadow = true;
  const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 10), mat(COLORS.metal));
  tunnel.rotation.z = Math.PI / 2;
  tunnel.position.set(1.65, 0.6, 0.45);
  world.add(lab, tunnel);
  for (let i = 0; i < 3; i++) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.05), new THREE.MeshStandardMaterial({ color: 0x223344, emissive: 0xffc46b, emissiveIntensity: 0 }));
    w.position.set(2.4 + i * 0.6, 0.85, 1.3);
    windows.push(w);
    world.add(w);
  }

  // Greenhouse dome with plants
  const gh = new THREE.Group();
  gh.position.set(-3.2, 0.05, 1.4);
  const ghBase = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.5, 0.25, 20), mat(COLORS.metal));
  ghBase.position.y = 0.12;
  const ghDome = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: COLORS.glass, transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.1, emissive: 0xff66cc, emissiveIntensity: 0 })
  );
  ghDome.position.y = 0.25;
  gh.add(ghBase, ghDome);
  const plants = [];
  const leafMat = mat(COLORS.leaf);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const r = i === 0 ? 0 : 0.75;
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), leafMat);
    p.position.set(Math.cos(a) * r, 0.4, Math.sin(a) * r);
    p.scale.setScalar(0.4);
    plants.push(p);
    gh.add(p);
  }
  world.add(gh);

  // Water tank (glass with water level inside)
  const tank = new THREE.Group();
  tank.position.set(0.3, 0, 3.7);
  const tankGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xdff3ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
  tankGlass.position.y = 0.85;
  const tankTop = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.12, 16), mat(COLORS.metal));
  tankTop.position.y = 1.7;
  const tankBottom = tankTop.clone();
  tankBottom.position.y = 0.06;
  const waterMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), new THREE.MeshStandardMaterial({ color: COLORS.water, transparent: true, opacity: 0.85, emissive: 0x0a3a7a, emissiveIntensity: 0.3 }));
  tank.add(tankGlass, tankTop, tankBottom, waterMesh);
  world.add(tank);
  let waterLevel = 0.6;
  let waterShown = 0.6;

  // Solar array that follows the sun
  const panels = [];
  const panelMat = new THREE.MeshStandardMaterial({ color: COLORS.panel, roughness: 0.35, metalness: 0.4, flatShading: true });
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group();
    g.position.set(3 + (i % 2) * 1.7, 0, -2.2 - Math.floor(i / 2) * 1.5);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), mat(COLORS.metal));
    post.position.y = 0.4;
    const pivot = new THREE.Group();
    pivot.position.y = 0.85;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 1), panelMat);
    panel.castShadow = true;
    pivot.add(panel);
    g.add(post, pivot);
    panels.push(pivot);
    world.add(g);
  }

  // Drill rig
  const drill = new THREE.Group();
  drill.position.set(-5, 0, -2.6);
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 5), mat(COLORS.orange));
    const a = (i / 3) * Math.PI * 2;
    leg.position.set(Math.cos(a) * 0.45, 1.1, Math.sin(a) * 0.45);
    leg.lookAt(0, 2.6, 0);
    leg.rotateX(Math.PI / 2);
    drill.add(leg);
  }
  const bit = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, 1.6, 6), mat(COLORS.metal, { metalness: 0.6 }));
  bit.position.y = 0.9;
  const motor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.4), mat(COLORS.white));
  motor.position.y = 1.9;
  drill.add(bit, motor);
  drill.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  world.add(drill);
  let drilling = false;

  // Antenna dish
  const ant = new THREE.Group();
  ant.position.set(1.2, 0, -3.3);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6), mat(COLORS.metal));
  mast.position.y = 0.8;
  const dishPivot = new THREE.Group();
  dishPivot.position.y = 1.65;
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 8, 0, Math.PI * 2, 0, Math.PI / 3.2), mat(COLORS.white, { side: THREE.DoubleSide }));
  dish.rotation.x = -Math.PI / 2.4;
  dishPivot.add(dish);
  ant.add(mast, dishPivot);
  world.add(ant);

  // Rover driving around the base
  const rover = new THREE.Group();
  const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.6), mat(COLORS.white));
  rBody.position.y = 0.35;
  const rTop = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.3), mat(COLORS.orange));
  rTop.position.set(0.25, 0.6, 0);
  rover.add(rBody, rTop);
  const wheels = [];
  for (let i = 0; i < 6; i++) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 10), mat(0x333333));
    w.rotation.x = Math.PI / 2;
    w.position.set(-0.35 + (i % 3) * 0.35, 0.13, i < 3 ? 0.35 : -0.35);
    wheels.push(w);
    rover.add(w);
  }
  rover.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  world.add(rover);

  // Crew: three little figures walking between modules
  const crewColors = [0xff7a2f, 0x2fa8ff, 0xffd23f];
  const crew = crewColors.map((c, i) => {
    const g = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.3, 4, 8), mat(c));
    torso.position.y = 0.42;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), mat(0xf1c9a5));
    head.position.y = 0.82;
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xffffff));
    hat.position.y = 0.85;
    g.add(torso, head, hat);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    world.add(g);
    return { g, phase: i * 2.1, path: [[-1.8, 2.2], [-3.2, 3.2], [2.4, 2.2], [-4.2, -1.2], [2.6, -1], [0.8, 2.6]].slice(i, i + 4) };
  });

  // Dust particles
  const dustCount = 900;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 24;
    dustPos[i * 3 + 1] = Math.random() * 5;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xd8a86a, size: 0.12, transparent: true, opacity: 0 });
  scene.add(new THREE.Points(dustGeo, dustMat));
  let dustTarget = 0;
  let panelDirt = 0;
  let panelDirtTarget = 0;

  // Plants state
  let plantGrowth = 0;
  let plantHealth = 1;
  const cLeaf = new THREE.Color(COLORS.leaf);
  const cWilt = new THREE.Color(COLORS.wilt);

  // Time of day: 0 midnight, 0.25 sunrise, 0.5 noon, 0.75 sunset
  let time = 0.4;
  let dayAnim = null;
  let celebrate = 0;

  function applyTime(tm) {
    const a = (tm - 0.25) * Math.PI * 2;
    const h = Math.sin(a);
    const sunPos = new THREE.Vector3(Math.cos(a) * 26, h * 22, -8);
    sun.position.copy(sunPos);
    sunBall.position.copy(sunPos.clone().multiplyScalar(1.6));
    moonBall.position.copy(sunPos.clone().multiplyScalar(-1.5).setZ(-10));
    const day = smoothstep(-0.12, 0.25, h);
    const night = 1 - smoothstep(-0.25, 0.05, h);
    const dusk = Math.max(0, 1 - Math.abs(h) / 0.3) * (1 - night * 0.6);
    const sky = SKY_NIGHT.clone().lerp(SKY_DAY, day).lerp(SKY_DUSK, dusk * 0.7);
    if (dustTarget > 0) sky.lerp(new THREE.Color(0xd9b48a), 0.35 * dustMat.opacity / 0.8);
    scene.background.copy(sky);
    scene.fog.color.copy(sky);
    sun.intensity = 2.6 * day;
    sun.color.set(0xfff1d6).lerp(new THREE.Color(0xff8a4a), dusk);
    hemi.intensity = 0.25 + 0.75 * day;
    moonLight.intensity = 0.5 * night;
    moonLight.position.copy(moonBall.position);
    starMat.opacity = night;
    sunBall.visible = h > -0.15;
    moonBall.visible = night > 0.1;
    for (const w of windows) w.material.emissiveIntensity = 1.8 * night;
    ghDome.material.emissiveIntensity = plantHealth > 0.3 ? 0.35 * night : 0;
    for (const p of panels) p.rotation.x = Math.max(-0.9, Math.min(0.9, -Math.cos(a) * 0.9));
  }

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  function loop() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const el = clock.elapsedTime;

    if (dayAnim) {
      dayAnim.t = (performance.now() - dayAnim.start) / (dayAnim.duration * 1000);
      time = dayAnim.from + dayAnim.t * (dayAnim.to - dayAnim.from);
      if (dayAnim.t >= 1) {
        time = dayAnim.to % 1;
        const done = dayAnim.done;
        dayAnim = null;
        done && done();
      }
    }
    applyTime(time);

    // rover drives in a loop around the base
    const ra = el * 0.18;
    const rr = 6.6;
    const rx = Math.cos(ra) * rr;
    const rz = Math.sin(ra) * rr * 0.85;
    rover.position.set(rx, dune(rx, rz) * smoothstep(2.5, 7, Math.hypot(rx, rz)) + 0.02, rz);
    rover.rotation.y = -ra - Math.PI / 2 + 0.15;
    for (const w of wheels) w.rotation.y += dt * 4;

    // crew walk between waypoints with a little bounce
    for (const c of crew) {
      const seg = (el * 0.12 + c.phase) % c.path.length;
      const i = Math.floor(seg);
      const f = seg - i;
      const a = c.path[i];
      const b = c.path[(i + 1) % c.path.length];
      const x = a[0] + (b[0] - a[0]) * f;
      const z = a[1] + (b[1] - a[1]) * f;
      c.g.position.set(x, Math.abs(Math.sin(el * 7 + c.phase)) * 0.06 + 0.05, z);
      c.g.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
    }

    dishPivot.rotation.y = Math.sin(el * 0.3) * 1.2;

    if (drilling) {
      bit.rotation.y += dt * 18;
      motor.position.y = 1.9 + Math.sin(el * 40) * 0.015;
    }

    // dust drifting in the wind
    dustMat.opacity += (dustTarget - dustMat.opacity) * Math.min(1, dt * 1.5);
    if (dustMat.opacity > 0.01) {
      const arr = dustGeo.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        arr[i * 3] += dt * (3 + (i % 5));
        arr[i * 3 + 1] += Math.sin(el * 2 + i) * dt * 0.3;
        if (arr[i * 3] > 12) arr[i * 3] = -12;
      }
      dustGeo.attributes.position.needsUpdate = true;
    }
    panelDirt += (panelDirtTarget - panelDirt) * Math.min(1, dt * 1.2);
    panelMat.color.set(COLORS.panel).lerp(new THREE.Color(COLORS.dirty), panelDirt);

    // water level eases to its target
    waterShown += (waterLevel - waterShown) * Math.min(1, dt * 2);
    const wl = Math.max(0.02, waterShown);
    waterMesh.scale.y = wl * 1.45;
    waterMesh.position.y = 0.12 + (wl * 1.45) / 2;

    // plants sway and grow
    plantsGrowEase();
    plants.forEach((p, i) => {
      p.rotation.z = Math.sin(el * 1.5 + i) * 0.12 * plantHealth;
    });

    if (celebrate > 0) {
      celebrate -= dt;
      hab.position.y = Math.abs(Math.sin(celebrate * 12)) * 0.15;
    } else {
      hab.position.y = 0;
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  let plantShown = 0;
  function plantsGrowEase() {
    plantShown += (plantGrowth - plantShown) * 0.03;
    const color = cWilt.clone().lerp(cLeaf, plantHealth);
    plants.forEach((p, i) => {
      const s = 0.7 + plantShown * (2.2 + (i % 3) * 0.3);
      p.scale.set(s, s * (0.6 + 0.4 * plantHealth), s);
      p.material.color.copy(color);
    });
  }

  loop();

  return {
    // Animate one full day: sunrise, noon, sunset, night, next sunrise.
    playDay(duration, done) {
      controls.autoRotateSpeed = 1.2;
      dayAnim = { from: 0.22, to: 1.22, t: 0, start: performance.now(), duration, done: () => { controls.autoRotateSpeed = 0.35; time = 0.31; done && done(); } };
    },
    setTime(v) { time = v; },
    setDust(on) { dustTarget = on ? 0.8 : 0; },
    setPanelsDirty(v) { panelDirtTarget = v; },
    setPlants(growth01, health01) { plantGrowth = growth01; plantHealth = health01; },
    setWater(level01) { waterLevel = level01; },
    setDrilling(on) { drilling = on; },
    celebrate() { celebrate = 1.2; },
    focus(on) { controls.autoRotate = on; }
  };
}
