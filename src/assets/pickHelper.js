import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

import { cameraConst } from "./constants";

const { near, far } = cameraConst;

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
    this.infoElem = document.querySelector("#info");
  }
  pick({ pickPosition, scene, camera, time, objects, objects1, objects2, objects3, objects4, objects5, objects6}) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    // cast a ray through the frustum
    this.raycaster.setFromCamera(pickPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(objects);
    const intersectedObjects1 = this.raycaster.intersectObjects(objects1);
    const intersectedObjects2 = this.raycaster.intersectObjects(objects2);
    const intersectedObjects3 = this.raycaster.intersectObjects(objects3);
    const intersectedObjects4 = this.raycaster.intersectObjects(objects4);
    const intersectedObjects5 = this.raycaster.intersectObjects(objects5);
    const intersectedObjects6 = this.raycaster.intersectObjects(objects6);

    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects[0];
      this.infoElem.textContent = `
Hueso Frontal`;
    }


    if (intersectedObjects1.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects1[0];
      this.infoElem.textContent = `
Hueso Nasal`;
    }


    if (intersectedObjects2.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects2[0];
      this.infoElem.textContent = `
Mandíbula`;
    }

    if (intersectedObjects3.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects3[0];
      this.infoElem.textContent = `
Hueso Cigomático`;
    }

    if (intersectedObjects4.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects4[0];
      this.infoElem.textContent = `
Hueso Occipital`;
    }

    if (intersectedObjects5.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects5[0];
      this.infoElem.textContent = `
Hueso Temporal`;
    }


    if (intersectedObjects6.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects6[0];
      this.infoElem.textContent = `
Hueso Parietal`;
    }


  }
}

export default PickHelper;
