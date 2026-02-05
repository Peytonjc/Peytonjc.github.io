import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdcefd8, 18, 54);

const camera = new THREE.PerspectiveCamera(36, canvas.clientWidth / canvas.clientHeight, 0.1, 120);
camera.position.set(0, 15.5, 16);

scene.add(new THREE.AmbientLight(0xf3f6ff, 0.55));

const hemi = new THREE.HemisphereLight(0xbee8ff, 0x8f7456, 0.78);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff1d6, 1.08);
sun.position.set(13, 22, 4);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -24;
sun.shadow.camera.right = 24;
sun.shadow.camera.top = 24;
sun.shadow.camera.bottom = -24;
scene.add(sun);

const terrain = new THREE.Group();
scene.add(terrain);

const grassTexture = makeGrassTexture();
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(14, 14);

const grass = new THREE.Mesh(
  new THREE.CircleGeometry(26, 90),
  new THREE.MeshToonMaterial({ color: 0x78bb50, map: grassTexture }),
);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
terrain.add(grass);

const cliffRing = new THREE.Mesh(
  new THREE.TorusGeometry(23.5, 2.15, 16, 80),
  new THREE.MeshToonMaterial({ color: 0x8b5d3b }),
);
cliffRing.rotation.x = Math.PI / 2;
cliffRing.position.y = -1.2;
terrain.add(cliffRing);

const path = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 14),
  new THREE.MeshToonMaterial({ map: makePathTexture(), transparent: true }),
);
path.rotation.x = -Math.PI / 2;
path.position.y = 0.04;
terrain.add(path);

const plaza = new THREE.Mesh(
  new THREE.CircleGeometry(4.4, 42),
  new THREE.MeshToonMaterial({ map: makeStoneTexture(), color: 0xc0c8b7 }),
);
plaza.rotation.x = -Math.PI / 2;
plaza.position.set(6.7, 0.05, -3.6);
terrain.add(plaza);

const pond = new THREE.Mesh(
  new THREE.CircleGeometry(4.2, 46),
  new THREE.MeshToonMaterial({ color: 0x56bfd6 }),
);
pond.rotation.x = -Math.PI / 2;
pond.position.set(-6.2, 0.03, -5.3);
terrain.add(pond);

const shore = new THREE.Mesh(
  new THREE.RingGeometry(4.1, 4.6, 46),
  new THREE.MeshToonMaterial({ color: 0xead59e }),
);
shore.rotation.x = -Math.PI / 2;
shore.position.copy(pond.position).add(new THREE.Vector3(0, 0.01, 0));
terrain.add(shore);

const skyPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 40),
  new THREE.MeshBasicMaterial({ color: 0xc8efff }),
);
skyPlane.position.set(0, 18, -30);
scene.add(skyPlane);

for (let i = 0; i < 26; i += 1) {
  const theta = (Math.PI * 2 * i) / 26;
  const radius = 14.4 + Math.sin(i * 1.7) * 2.2;
  createAcTree(Math.cos(theta) * radius, Math.sin(theta) * radius, 0.88 + (i % 4) * 0.07);
}

for (let i = 0; i < 18; i += 1) {
  const flower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.15, 6),
    new THREE.MeshToonMaterial({ color: [0xffe590, 0xff9cc8, 0xc6d8ff, 0xfff3c2][i % 4] }),
  );
  const r = 7 + (i % 5) * 0.52;
  const t = i * 0.82;
  flower.position.set(Math.cos(t) * r, 0.08, Math.sin(t) * r);
  flower.castShadow = true;
  terrain.add(flower);
}

createHouse(-10.4, 0, 5.6);

const player = createPlayer();
scene.add(player.group);
player.group.position.set(0, 0, 0.4);

const keys = new Set();
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
    event.preventDefault();
  }
  keys.add(key);
});
window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));

let walkTime = 0;
let last = performance.now();

function animate(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  const moveX = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
  const moveZ = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);

  const input = new THREE.Vector3(moveX, 0, moveZ);
  if (input.lengthSq() > 0) {
    input.normalize();
    player.group.position.addScaledVector(input, dt * 3.25);
    player.group.position.clamp(new THREE.Vector3(-13.8, 0, -13.8), new THREE.Vector3(13.8, 0, 13.8));

    const targetYaw = Math.atan2(input.x, input.z);
    player.group.rotation.y = rotateToward(player.group.rotation.y, targetYaw, dt * 11);

    walkTime += dt * 9.2;
    const stride = Math.sin(walkTime) * 0.32;
    player.leftLeg.rotation.x = stride;
    player.rightLeg.rotation.x = -stride;
    player.leftArm.rotation.x = -stride * 0.7;
    player.rightArm.rotation.x = stride * 0.7;
    player.group.position.y = Math.sin(walkTime * 2) * 0.06;
  } else {
    player.leftLeg.rotation.x *= 0.7;
    player.rightLeg.rotation.x *= 0.7;
    player.leftArm.rotation.x *= 0.7;
    player.rightArm.rotation.x *= 0.7;
    player.group.position.y *= 0.68;
  }

  const camTarget = player.group.position.clone().add(new THREE.Vector3(0, 15.5, 16));
  camera.position.lerp(camTarget, 0.09);
  camera.lookAt(player.group.position.x, 1.8, player.group.position.z - 2.4);

  pond.material.color.offsetHSL(0, 0, Math.sin(now * 0.0026) * 0.001);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function createAcTree(x, z, scale) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34 * scale, 0.42 * scale, 2.8 * scale, 7),
    new THREE.MeshToonMaterial({ map: makeBarkTexture(), color: 0x8b5f40 }),
  );
  trunk.position.y = 1.4 * scale;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  const leafMain = new THREE.Mesh(
    new THREE.DodecahedronGeometry(1.45 * scale, 0),
    new THREE.MeshToonMaterial({ color: 0x5ea247 }),
  );
  leafMain.position.y = 3.25 * scale;
  leafMain.castShadow = true;
  tree.add(leafMain);

  const leafA = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.95 * scale, 0),
    new THREE.MeshToonMaterial({ color: 0x6caf50 }),
  );
  leafA.position.set(-0.95 * scale, 2.95 * scale, 0.28 * scale);
  leafA.castShadow = true;
  tree.add(leafA);

  const leafB = leafA.clone();
  leafB.position.x *= -1;
  leafB.position.z *= -1;
  tree.add(leafB);

  const fruit = new THREE.Mesh(
    new THREE.SphereGeometry(0.2 * scale, 8, 8),
    new THREE.MeshToonMaterial({ color: 0xd32f2f }),
  );
  fruit.position.set(0.62 * scale, 3.05 * scale, 0.8 * scale);
  fruit.castShadow = true;
  tree.add(fruit);

  tree.position.set(x, 0, z);
  terrain.add(tree);
}

function createHouse(x, y, z) {
  const house = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 2.2, 2.4),
    new THREE.MeshToonMaterial({ color: 0xc78247 }),
  );
  body.position.y = 1.1;
  body.castShadow = true;
  body.receiveShadow = true;
  house.add(body);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(2.15, 1.8, 4),
    new THREE.MeshToonMaterial({ color: 0x7c3328 }),
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 2.85;
  roof.castShadow = true;
  house.add(roof);

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 1.25),
    new THREE.MeshToonMaterial({ color: 0x4b2f1c }),
  );
  door.position.set(0, 0.84, 1.22);
  house.add(door);

  const window = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.52),
    new THREE.MeshToonMaterial({ color: 0x9fd6f2 }),
  );
  window.position.set(-0.78, 1.2, 1.22);
  house.add(window);

  house.position.set(x, y, z);
  terrain.add(house);
}

function createPlayer() {
  const group = new THREE.Group();

  const skin = new THREE.MeshToonMaterial({ color: 0xf1c4a1 });
  const shirt = new THREE.MeshToonMaterial({ color: 0x4f76dd });
  const shorts = new THREE.MeshToonMaterial({ color: 0x6f4b35 });
  const hair = new THREE.MeshToonMaterial({ color: 0x6e4b2d });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.1, 0.72), shirt);
  torso.position.y = 1.35;
  torso.castShadow = true;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 14), skin);
  head.scale.set(1.18, 1.02, 1.12);
  head.position.y = 2.43;
  head.castShadow = true;
  group.add(head);

  const hairCap = new THREE.Mesh(new THREE.ConeGeometry(0.79, 0.86, 7), hair);
  hairCap.position.y = 2.93;
  hairCap.rotation.y = Math.PI / 7;
  hairCap.castShadow = true;
  group.add(hairCap);

  const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), skin);
  leftEar.position.set(0.76, 2.42, 0.08);
  const rightEar = leftEar.clone();
  rightEar.position.x *= -1;
  group.add(leftEar, rightEar);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.28, 3), new THREE.MeshToonMaterial({ color: 0xd78f4e }));
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 2.3, 0.76);
  group.add(nose);

  const leftEye = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.22), new THREE.MeshBasicMaterial({ color: 0x25222d }));
  leftEye.position.set(0.25, 2.48, 0.77);
  const rightEye = leftEye.clone();
  rightEye.position.x = -0.25;
  group.add(leftEye, rightEye);

  const blushA = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.08), new THREE.MeshBasicMaterial({ color: 0xdf7f6f }));
  blushA.position.set(0.36, 2.22, 0.77);
  const blushB = blushA.clone();
  blushB.position.x = -0.36;
  group.add(blushA, blushB);

  const leftArm = limb(0.54, 1.4, 0.95, skin, 0.14);
  const rightArm = limb(-0.54, 1.4, 0.95, skin, 0.14);
  const leftLeg = limb(0.23, 0.54, 0.98, shorts, 0.15);
  const rightLeg = limb(-0.23, 0.54, 0.98, shorts, 0.15);
  group.add(leftArm, rightArm, leftLeg, rightLeg);

  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.46), new THREE.MeshToonMaterial({ color: 0x3d2e22 }));
  leftShoe.position.set(0.23, 0.07, 0.16);
  const rightShoe = leftShoe.clone();
  rightShoe.position.x = -0.23;
  group.add(leftShoe, rightShoe);

  return { group, leftArm, rightArm, leftLeg, rightLeg };
}

function limb(x, y, len, material, radius) {
  const part = new THREE.Mesh(new THREE.CapsuleGeometry(radius, len, 4, 9), material);
  part.position.set(x, y, 0);
  part.castShadow = true;
  return part;
}

function rotateToward(current, target, rate) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * Math.min(rate, 1);
}

function makeGrassTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d");

  g.fillStyle = "#6eb64a";
  g.fillRect(0, 0, 64, 64);

  for (let y = 0; y < 64; y += 8) {
    for (let x = 0; x < 64; x += 8) {
      g.fillStyle = (x + y) % 16 === 0 ? "#63a944" : "#7bc45a";
      g.beginPath();
      g.arc(x + 4, y + 4, 3.1, 0, Math.PI * 2);
      g.fill();
    }
  }

  return new THREE.CanvasTexture(c);
}

function makePathTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");

  g.clearRect(0, 0, 512, 512);
  g.strokeStyle = "#b89365";
  g.lineWidth = 80;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(35, 240);
  g.bezierCurveTo(170, 150, 350, 330, 470, 250);
  g.stroke();

  g.strokeStyle = "#ad8559";
  g.lineWidth = 42;
  g.beginPath();
  g.moveTo(65, 260);
  g.bezierCurveTo(160, 190, 345, 300, 445, 250);
  g.stroke();

  return new THREE.CanvasTexture(c);
}

function makeStoneTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d");

  g.fillStyle = "#bfc7b5";
  g.fillRect(0, 0, 256, 256);

  g.strokeStyle = "#93a18e";
  g.lineWidth = 5;
  for (let y = 0; y < 256; y += 34) {
    for (let x = 0; x < 256; x += 42) {
      g.beginPath();
      g.moveTo(x + 3, y + 14);
      g.lineTo(x + 15, y + 4);
      g.lineTo(x + 31, y + 7);
      g.lineTo(x + 37, y + 19);
      g.lineTo(x + 24, y + 30);
      g.lineTo(x + 8, y + 28);
      g.closePath();
      g.stroke();
    }
  }

  return new THREE.CanvasTexture(c);
}

function makeBarkTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");

  g.fillStyle = "#8a5d3e";
  g.fillRect(0, 0, 128, 128);

  g.fillStyle = "#6f4327";
  for (let i = 0; i < 12; i += 1) {
    g.beginPath();
    g.ellipse(12 + i * 10, 18 + (i % 5) * 22, 5, 9, 0.5, 0, Math.PI * 2);
    g.fill();
  }

  return new THREE.CanvasTexture(c);
}

window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
