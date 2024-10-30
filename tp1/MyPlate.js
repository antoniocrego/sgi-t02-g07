import * as THREE from 'three';

class MyPlate{

    constructor(primitives){
        this.primitives = primitives;
        this.plateMesh = null;
        this.initMaterials();
        this.buildPlate();
    }

    initMaterials(){
        this.plateTexture = new THREE.TextureLoader().load("textures/plate.avif");
        this.plateTexture.wrapS = THREE.RepeatWrapping;
        this.plateTexture.wrapT = THREE.RepeatWrapping;
        this.plateTexture.repeat.set(3, 2);
        this.plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 20, map:  this.plateTexture});
    }

    buildPlate(){
        this.plateMesh = this.primitives.buildCylinder(0, 2.75, 0, 0, 0, 0, 2, 1, 0.2, 30, 5, false, 0, 2*Math.PI, this.plateMaterial);
    }
}

export { MyPlate };