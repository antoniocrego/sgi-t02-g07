import * as THREE from 'three';
import { MyNapkin } from '././nurbs/MyNapkin.js';

class MyPlate{

    constructor(primitives, nurbsBuilder=null){
        this.primitives = primitives;
        this.nurbsBuilder = nurbsBuilder;
        this.plateMesh = null;
        this.initMaterials();
        this.buildPlate();
    }

    initMaterials(){
        this.plateTexture = new THREE.TextureLoader().load("textures/plate.avif");
        this.plateTexture.wrapS = THREE.RepeatWrapping;
        this.plateTexture.wrapT = THREE.RepeatWrapping;
        this.plateTexture.repeat.set(3, 2);
        this.plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 20, map:  this.plateTexture});
    }

    buildPlate(){
        this.plateMesh = this.primitives.buildCylinder(0, 2.75, 0, 0, 0, 0, 2, 1, 0.2, 30, 5, false, 0, 2*Math.PI, this.plateMaterial);
        if(this.nurbsBuilder!=null){
            this.napkin = new MyNapkin(this.nurbsBuilder);
            this.napkin.napkin.position.set(0, 0.15, 0);
            this.plateMesh.add(this.napkin.napkin);
        }
    }
}

export { MyPlate };