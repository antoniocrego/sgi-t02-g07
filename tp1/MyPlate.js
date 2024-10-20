import * as THREE from 'three';

class MyPlate{

    constructor(primitives){
        this.primitives = primitives;
        this.plateMesh = null;
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildPlate();
    }

    buildPlate(){
        this.plateMesh = this.primitives.buildCylinder(0, 2.75, 0, 0, 0, 0, 2, 1, 0.2, 30, 5, false, 0, 2*Math.PI, this.tableMaterial);
    }
}

export { MyPlate };