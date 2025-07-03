import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { Lensflare, LensflareElement } from "jsm/objects/Lensflare.js";

import backgroundAudio from "./audioManager.js";
import loadingManager from "./loadingScreen.js";
import getHue from "./utils/getHue.js";
import getStars from "./utils/getStars.js";

const audio = backgroundAudio;
const volume = {
  current: 1,
  max: 1,
  min: 0.25,
};

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const fov = 75;
const far = 1000;
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  far
);
camera.position.z = 3;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2.5;
controls.maxDistance = 25;

const loader = new THREE.TextureLoader(loadingManager);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const earthGeo = new THREE.IcosahedronGeometry(1.0, 64);
const earthMat = new THREE.MeshStandardMaterial({
  map: loader.load("assets/textures/day-map.jpg"),
});
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshStandardMaterial({
  map: loader.load("assets/textures/lights-map.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(earthGeo, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0.75,
  map: loader.load("assets/textures/clouds-map.jpg"),
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(earthGeo, cloudsMat);
cloudsMesh.receiveShadow = true;
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const blueHueMat = getHue();
const blueHueMesh = new THREE.Mesh(earthGeo, blueHueMat);
blueHueMesh.scale.setScalar(1.003);
earthGroup.add(blueHueMesh);

const moonGroup = new THREE.Group();
scene.add(moonGroup);

const moonMat = new THREE.MeshStandardMaterial({
  map: loader.load("assets/textures/moon-map.jpg"),
  bumpMap: loader.load("assets/textures/moon-bump-map.jpg"),
  bumpScale: 3,
  side: THREE.DoubleSide,
});
const moonMesh = new THREE.Mesh(earthGeo, moonMat);
moonMesh.castShadow = true;
moonMesh.receiveShadow = true;
moonMesh.scale.setScalar(0.27);
moonMesh.position.set(2, 0, 0);
moonGroup.add(moonMesh);

const sunGroup = new THREE.Group();
sunGroup.position.set(-550, 100, 375);
scene.add(sunGroup);

const sunMat = new THREE.MeshStandardMaterial({
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 3,
  emissiveMap: loader.load("assets/textures/sun-map.jpg"),
});
const sunGeo = new THREE.IcosahedronGeometry(17, 64);
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.set(-50, 50, 90);
sunGroup.add(sunMesh);

const lensflare = new Lensflare();
const lensflareTexture = loader.load("assets/textures/lensflare.png");
lensflare.addElement(new LensflareElement(lensflareTexture, 750, 0));
sunGroup.add(lensflare);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 8192;
sunLight.shadow.mapSize.height = 8192;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 1000;
sunLight.shadow.bias = -0.0001;
sunLight.position.copy(sunMesh.position);
sunLight.target = earthMesh;
sunLight.updateMatrixWorld();
sunGroup.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.025);
scene.add(ambientLight);

let mousedown = false;
let earthRotationSpeed = {
  current: 0.000125,
  max: 0.000125,
};
let cloudRotationSpeed = {
  current: 0.000175,
  max: 0.000175,
};
let moonRotationSpeed = {
  current: 0.000035,
  max: 0.000035,
};

const fps = 60;
const frameInterval = 1000 / fps;

let lastTime = 0;
let timeToNewFrame = 0;
function animate(timestamp) {
  requestAnimationFrame(animate);
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  timeToNewFrame += delta;

  if (timeToNewFrame >= frameInterval) render(delta);
}

function pause() {
  volume.current = THREE.MathUtils.lerp(volume.current, volume.min, 0.025);

  earthRotationSpeed.current = THREE.MathUtils.lerp(
    earthRotationSpeed.current,
    0,
    0.027
  );

  cloudRotationSpeed.current = THREE.MathUtils.lerp(
    cloudRotationSpeed.current,
    0,
    0.0325
  );

  moonRotationSpeed.current = THREE.MathUtils.lerp(
    moonRotationSpeed.current,
    0,
    0.02
  );
}

function resume() {
  if (earthRotationSpeed.current <= earthRotationSpeed.max) {
    earthRotationSpeed.current = THREE.MathUtils.lerp(
      earthRotationSpeed.current,
      earthRotationSpeed.max,
      0.033
    );

    cloudRotationSpeed.current = THREE.MathUtils.lerp(
      cloudRotationSpeed.current,
      cloudRotationSpeed.max,
      0.04
    );
  }

  if (moonRotationSpeed.current <= moonRotationSpeed.max)
    moonRotationSpeed.current = THREE.MathUtils.lerp(
      moonRotationSpeed.current,
      moonRotationSpeed.max,
      0.0275
    );

  if (volume.current <= volume.max)
    volume.current = THREE.MathUtils.lerp(volume.current, volume.max, 0.025);
}

function rotateGlobe(delta) {
  earthMesh.rotation.y += delta * earthRotationSpeed.current;
  lightsMesh.rotation.y += delta * earthRotationSpeed.current;
  cloudsMesh.rotation.y += delta * cloudRotationSpeed.current;
  blueHueMesh.rotation.y += delta * cloudRotationSpeed.current;
}

function revolveMoon(delta) {
  moonGroup.rotation.y += delta * moonRotationSpeed.current;
}

function animateSun(delta) {
  if (mousedown) return;

  sunMesh.rotation.x += 0.000035 * delta;
  sunMesh.rotation.y += 0.000025 * delta;
  sunMesh.rotation.z += 0.000015 * delta;
}

function render(delta) {
  renderer.render(scene, camera);
  controls.update();

  if (mousedown) pause();
  else resume();

  rotateGlobe(delta);
  revolveMoon(delta);
  animateSun(delta);
  audio.volume = volume.current;

  timeToNewFrame -= frameInterval;
}

function init() {
  getStars(scene, 1000, { min: 600, max: 700 });
  animate(0);
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

window.addEventListener("mousedown", () => (mousedown = true));
window.addEventListener("touchstart", () => (mousedown = true));

window.addEventListener("mouseup", () => (mousedown = false));
window.addEventListener("touchend", () => (mousedown = false));

init();
