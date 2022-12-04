// Three.js - Load .OBJ and .MTL file - Windmill2
// from https://threejsfundamentals.org/threejs/threejs-load-obj-materials-windmill2.html

import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import * as Three1 from "https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js";

export default function load({ textureURL, mtlURL, objURL }) {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  let objects = [];

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
  const infoElem = document.querySelector("#info");

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  {
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
      });
    });
  }

  {
    if (Array.isArray(textureURL))
      textureURL.forEach((url) => loadTexture(url));
    else loadTexture(textureURL);
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

  {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const numObjects1 = 1;
    for (let i = 0; i < numObjects1; ++i) {
      const material1 = new THREE.MeshPhongMaterial({
        color: randomColor(),
      });

      for (i = 0; i < numObjects1; i++) {
        const cube1 = new THREE.Mesh(geometry, material1);
        cube1.rotation.x = Math.PI;
        cube1.position.set(
          -2.8218419551849365,
          -4.300922989845276,
          2625.3948974609375
        );
        cube1.scale.set(3000, 3000, 3000);
        scene.add(cube1); // or group.add(meshobj);
        objects.push(cube1);

        //cube1.position.set(rand(-2000, 2000), rand(-2000, 2000), rand(-2000, 2000));
        //cube1.rotation.set(rand(Math.PI), rand(Math.PI), 0);

        //cube1.scale.set(rand(30, 6), rand(3, 6), rand(3, 6));
      }
    }
  }

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
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

  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(objects);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        const intersection = intersectedObjects[0];

        infoElem.textContent = `distance : ${intersection.distance.toFixed(2)}
z depth  : ${((intersection.distance - near) / (far - near)).toFixed(3)}
local pos: ${intersection.point.x.toFixed(2)}, ${intersection.point.y.toFixed(
          2
        )}, ${intersection.point.z.toFixed(2)}
local uv : ${intersection.uv.x.toFixed(2)}, ${intersection.uv.y.toFixed(2)}`;
        this.pickedObject = intersection.object;
        // save its color
        this.pickedObjectSavedColor =
          this.pickedObject.material.emissive.getHex();
        // set its emissive color to flashing red/yellow
        this.pickedObject.material.emissive.setHex(
          (time * 8) % 2 > 1 ? 0xffff00 : 0xff0000
        );
      }
    }
  }

  const pickPosition = { x: 0, y: 0 };
  const pickHelper = new PickHelper();
  clearPickPosition();

  function render(time) {
    time *= 0.01; // convert to seconds;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

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
