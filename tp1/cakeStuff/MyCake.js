import * as THREE from 'three';
import { MyCandle } from './MyCandle.js';

class MyCake{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeMesh = null;
        this.cakeCover1 = null;
        this.cakeCover2 = null;
        this.cakeGroup = new THREE.Group();
        this.candle1 = null;
        this.initTextures();
        this.buildCake();
    }

    initTextures(){
        this.cakeTexture = new THREE.TextureLoader().load("textures/cake.avif");
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeTexture.repeat.set(2, 2);
        this.cakeMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.cakeTexture});

        this.sideCakeTexture = new THREE.TextureLoader().load("textures/cake.avif");
        this.sideCakeTexture.wrapS = THREE.RepeatWrapping;
        this.sideCakeTexture.wrapT = THREE.RepeatWrapping;
        this.sideCakeTexture.repeat.set(5, 1);
        this.sideCakeMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.sideCakeTexture});

        this.cakeInteriorTexture = new THREE.TextureLoader().load("textures/cakeInterior.webp");
        this.cakeInteriorTexture.wrapS = THREE.RepeatWrapping;
        this.cakeInteriorTexture.wrapT = THREE.RepeatWrapping;
        this.cakeInteriorTexture.repeat.set(1, 1);
        this.cakeInteriorMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.cakeInteriorTexture});
    }

    buildCake(){
        this.cakeMesh = this.primitives.buildCylinder(0, 0, 0, 0, 0, 0, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI-2*Math.PI/10, [this.sideCakeMaterial, this.cakeMaterial, this.cakeMaterial], false);
        let covers = this.primitives.buildCylinderCovers(0, 0, 0, 0, 0, 0, 1.25, 0.8, 0, 2*Math.PI-2*Math.PI/10, this.cakeInteriorMaterial, false);
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