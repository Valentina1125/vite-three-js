// Three.js - Load .OBJ and .MTL file - Windmill2
// from https://threejsfundamentals.org/threejs/threejs-load-obj-materials-windmill2.html

import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js";

import PickHelper from "./pickHelper";
import { cameraConst } from "./constants";
import { rand, randomColor } from "./random";

export default function load({ mtlURL, objURL }) {
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
  const pickHelper = new PickHelper();
  clearPickPosition();
  const objects = [];
  const objects1 = [];
  const objects2 = [];
  const objects3 = [];
  const objects4 = [];
  const objects5 = [];
  const objects6 = [];
  

  {
    loadPlane();
    loadHemisphereLight();
    loadDirectionalLight();
    renderObject();
    renderCube();
    requestAnimationFrame(render);
  }

  function loadHemisphereLight() {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  function renderCube() {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);


    const material = new THREE.MeshPhongMaterial({
      
      color: 'hsl(126, 63%, 50%)',
      
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // or group.add(meshobj);
    objects.push(cube);
    cube.position.set(0, -9, 25);
    cube.scale.set(2, 2, 2);

   
    const cube1 = new THREE.Mesh(geometry, material);
    scene.add(cube1); // or group.add(meshobj);
    objects1.push(cube1);
    cube1.position.set(0, -13.5, 16);
    cube1.scale.set(2, 2, 2);

    const cube2 = new THREE.Mesh(geometry, material);
    scene.add(cube2); // or group.add(meshobj);
    objects2.push(cube2);
    cube2.position.set(0, -15, 2);
    cube2.scale.set(2, 2, 2);

    const cube3 = new THREE.Mesh(geometry, material);
    scene.add(cube3); // or group.add(meshobj);
    objects3.push(cube3);
    cube3.position.set(-8, -9, 11);
    cube3.scale.set(2, 2, 2);
    
    const cube4 = new THREE.Mesh(geometry, material);
    scene.add(cube4); // or group.add(meshobj);
    objects4.push(cube4);
    cube4.position.set(0, 13.5, 10);
    cube4.scale.set(2, 2, 2);

    const cube5 = new THREE.Mesh(geometry, material);
    scene.add(cube5); // or group.add(meshobj);
    objects5.push(cube5);
    cube5.position.set(9, 1, 13);
    cube5.scale.set(2, 2, 2);

    const cube6 = new THREE.Mesh(geometry, material);
    scene.add(cube6); // or group.add(meshobj);
    objects6.push(cube6);
    cube6.position.set(8.5, 8, 17);
    cube6.scale.set(2, 2, 2);
    
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
      });
    });
  }
  function loadPlane() {
    const planeSize = 200;
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejsfundamentals.org/threejs/resources/images/checker.png"
    );

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

    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    // planeMesh.rotation.x = Math.PI * -0.5;

    //scene.add(planeMesh);
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

    pickHelper.pick({pickPosition, scene, camera,time, objects, objects1, objects2, objects3, objects4, objects5, objects6} );
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
