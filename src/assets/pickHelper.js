import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js";

import { cameraConst } from "./constants";

const { near, far } = cameraConst;

class PickHelper {
  constructor(objects) {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
    this.objects = objects;
    this.infoElem = document.querySelector("#info");
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
    const intersectedObjects = this.raycaster.intersectObjects(this.objects);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      const intersection = intersectedObjects[0];

      this.infoElem.textContent = `
distance : ${intersection.distance.toFixed(2)}
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

export default PickHelper;
