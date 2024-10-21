import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';

class MyCake{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeMesh = null;
        this.cakeCover1 = null;
        this.cakeCover2 = null;
        this.cakeGroup = new THREE.Group();
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.candle1 = null;
        this.buildCake();
    }

    buildCake(){
        this.cakeMesh = this.primitives.buildCylinder(0, 0, 0, 0, 0, 0, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI-2*Math.PI/10, this.tableMaterial, false);
        let covers = this.primitives.buildCylinderCovers(0, 0, 0, 0, 0, 0, 1.25, 0.8, 0, 2*Math.PI-2*Math.PI/10, this.tableMaterial, false);
        this.cakeCover1 = covers[0];
        this.cakeCover2 = covers[1];
        this.cakeGroup.add(this.cakeMesh);
        this.cakeGroup.add(this.cakeCover1);
        this.cakeGroup.add(this.cakeCover2);

        this.candle1 = new MyCandle(this.primitives);
        this.candle1.candleGroup.position.y = 0.8;
        this.cakeGroup.add(this.candle1.candleGroup);
    }
}

export { MyCake };