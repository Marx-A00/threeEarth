import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3.5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const orbitCtrl = new OrbitControls(camera, renderer.domElement);
orbitCtrl.enableDamping = true;

const textureLoader = new THREE.TextureLoader();

const starSprite = textureLoader.load('./src/circle.png')
const colorMap = textureLoader.load("./src/00_earthmap1k.jpg");

const globeGroup = new THREE.Group();
scene.add(globeGroup)
const geo = new THREE.BoxGeometry(1,1,1);
const mat = new THREE.MeshBasicMaterial({ color: 0x202020, wireframe: true, });
const cube = new THREE.Mesh(geo,mat);
globeGroup.add(cube);

const detail = 60;
const pointsGeo = new THREE.BoxGeometry(1, 1, 1, detail, detail, detail);
const pointsMat = new THREE.PointsMaterial({
  // color: 0x00ffff,
  size: 0.04,
  map: colorMap,
});
const points = new THREE.Points(pointsGeo, pointsMat);
globeGroup.add(points);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 3);
scene.add(hemiLight);

const stars = getStarfield({ numStars:4500, sprite: starSprite });
scene.add(stars);

function animate() {
    renderer.render(scene, camera);
    // globeGroup.rotation.x += 0.01;
    globeGroup.rotation.y += 0.002;

  requestAnimationFrame(animate);
  orbitCtrl.update();
};
animate();

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// https://discourse.threejs.org/t/earth-point-vertex-elevation/62689
