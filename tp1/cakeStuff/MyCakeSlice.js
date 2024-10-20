import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';

class MyCakeSlice{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeSliceMesh = null;
        this.cakeSliceCover1 = null;
        this.cakeSliceCover2 = null;
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildCakeSlice();
    }

    buildCakeSlice(){
        this.cakeSliceMesh = this.primitives.buildCylinder(0.4, 2.9, 1.5, 0, 0, Math.PI/2, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI/10, this.tableMaterial);
        this.cakeSliceCover1, this.cakeSliceCover2 = this.primitives.buildCylinderCovers(0.4, 2.9, 1.5, 0, 0, Math.PI/2, 1.25, 0.8, 0, 2*Math.PI/10, this.tableMaterial);
    }
}

export { MyCakeSlice };