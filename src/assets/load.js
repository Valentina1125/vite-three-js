// Three.js - Load .OBJ and .MTL file - Windmill2
// from https://threejsfundamentals.org/threejs/threejs-load-obj-materials-windmill2.html

import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js";

import PickHelper from "./pickHelper";
import { cameraConst } from "./constants";

export default function load({ textureURL, mtlURL, objURL }) {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });

  const { fov, aspect, near, far } = cameraConst;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  const pickPosition = { x: 0, y: 0 };

  {
    loadHemisphereLight();
    loadDirectionalLight();
    renderObject();
    renderCube();
    clearPickPosition();
    requestAnimationFrame(render);
    addEventListeners();
  }

  function loadHemisphereLight() {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + (max - min) * Math.random();
  }
  function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
  }

  function renderCube() {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const objects = [];

    const numObjects1 = 10;
    for (let i = 0; i < numObjects1; ++i) {
      const material1 = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });

      const cube1 = new THREE.Mesh(geometry, material1);
      scene.add(cube1); // or group.add(meshobj);
      objects.push(cube1);
      cube1.position.set(rand(-2, 2), rand(-2, 2), rand(-2, 2));
      cube1.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube1.scale.set(2000, 2000, 2000);
      //cube1.scale.set(rand(30, 6), rand(3, 6), rand(3, 6));
    }
    const pickHelper = new PickHelper(objects);
    pickHelper.pick(pickPosition, scene, camera);
  }

  function loadDirectionalLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  function renderObject() {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlURL, (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load(objURL, (root) => {
        scene.add(root);

        // compute the box that contains all the stuff
        // from root and below

        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();

        // load textures
        Array.isArray(textureURL)
          ? textureURL.forEach((url) => loadTexture(url))
          : loadTexture(textureURL);
      });
    });
  }
  function loadTexture(url) {
    const planeSize = 4000;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(url);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 200;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    //scene.add(mesh);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.01; // convert to seconds;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.clientWidth) * 2 - 1;
    pickPosition.y = (pos.y / canvas.clientHeight) * -2 + 1; // note we flip Y
  }

  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function addEventListeners() {
    window.addEventListener("mousemove", setPickPosition);
    window.addEventListener("mouseout", clearPickPosition);
    window.addEventListener("mouseleave", clearPickPosition);

    window.addEventListener(
      "touchstart",
      (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
      },
      { passive: false }
    );

    window.addEventListener("touchmove", (event) => {
      setPickPosition(event.touches[0]);
    });

    window.addEventListener("touchend", clearPickPosition);
  }
}
