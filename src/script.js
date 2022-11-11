import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as lil from 'lil-gui';

// DEBUG

const gui = new lil.GUI({ width: 300 });
gui.hide();

// Press the h key to show or hide controls
window.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// DEBUG
// Has to be an object to pass it to the gui
const parameters = {
  spin: function () {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

// Parameters: object to modify, object property, minimum, maximum, step, name
gui.add(mesh.position, 'y', -3, 3, 0.01).name('Elevation');
// gui.add(mesh.position, 'y').min(-3).max(3).step(0.01); Same thing

// Mesh is the object, visible the property
// Booleans
gui.add(mesh, 'visible').name('Display');
gui.add(material, 'wireframe').name('Wireframe');
gui.addColor(material, 'color').name('Color');

// Function as parameter
gui.add(parameters, 'spin');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
