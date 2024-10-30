import * as THREE from 'three';

class MyCakeSlice{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeSliceMesh = null;
        this.cakeSliceCover1 = null;
        this.cakeSliceCover2 = null;
        this.sliceGroup = new THREE.Group();
        this.initTextures();
        this.buildCakeSlice();
    }

    initTextures(){
        this.cakeTexture = new THREE.TextureLoader().load("textures/cake.avif");
        this.cakeTexture.wrapS = THREE.RepeatWrapping;
        this.cakeTexture.wrapT = THREE.RepeatWrapping;
        this.cakeTexture.repeat.set(3, 2);
        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20, map:  this.cakeTexture});

        this.sideCakeTexture = new THREE.TextureLoader().load("textures/cake.avif");
        this.sideCakeTexture.wrapS = THREE.RepeatWrapping;
        this.sideCakeTexture.wrapT = THREE.RepeatWrapping;
        this.sideCakeTexture.repeat.set(1, 1);
        this.sideCakeMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20, map:  this.sideCakeTexture});

        this.cakeInteriorTexture = new THREE.TextureLoader().load("textures/cakeInterior.webp");
        this.cakeInteriorTexture.wrapS = THREE.RepeatWrapping;
        this.cakeInteriorTexture.wrapT = THREE.RepeatWrapping;
        this.cakeInteriorTexture.repeat.set(1, 1);
        this.cakeInteriorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20, map:  this.cakeInteriorTexture});
    }

    buildCakeSlice(){
        this.cakeSliceMesh = this.primitives.buildCylinder(0, 0, 0, 0, 0, 0, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI/10, [this.sideCakeMaterial, this.cakeMaterial, this.cakeMaterial], false);
        let cakeArray = this.primitives.buildCylinderCovers(0, 0, 0, 0, 0, 0, 1.25, 0.8, 0, 2*Math.PI/10, this.cakeInteriorMaterial, false);
        this.cakeSliceCover1 = cakeArray[0];
        this.cakeSliceCover2 = cakeArray[1];
        this.sliceGroup.add(this.cakeSliceMesh);
        this.sliceGroup.add(this.cakeSliceCover1);
        this.sliceGroup.add(this.cakeSliceCover2);
    }
}

export { MyCakeSlice };