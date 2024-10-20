import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';

class MyCake{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeMesh = null;
        this.cakeCover1 = null;
        this.cakeCover2 = null;
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildCake();

        this.candle1 = new MyCandle(this.primitives);
    }

    buildCake(){
        this.cakeMesh = this.primitives.buildCylinder(-0.4, 2.9, -0.5, 0, 0, 0, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI-2*Math.PI/10, this.tableMaterial);
        this.cakeCover1, this.cakeCover2 = this.primitives.buildCylinderCovers(-0.4, 2.9, -0.5, 0, 0, 0, 1.25, 0.8, 0, 2*Math.PI-2*Math.PI/10, this.tableMaterial);
    }
}

export { MyCake };