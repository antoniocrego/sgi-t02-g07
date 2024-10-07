import * as THREE from 'three';

class MyTable{

    constructor(primitives){
        this.primitives = primitives;
        this.tableMesh = null;
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ff0000", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
    }

    buildTable(){
        this.primitives.buildParallelepiped(0, 3, 0, 0, 0, 0, 7, 0.3, 10, this.tableMaterial); // table top
    }
}

export { MyTable };