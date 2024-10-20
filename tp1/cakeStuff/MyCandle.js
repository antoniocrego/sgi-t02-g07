import * as THREE from 'three';

class MyCandle{

    constructor(primitives){
        this.primitives = primitives;
        this.candleMesh = null;
        this.flameMeshUpper = null;
        this.flameMeshLower = null;
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildCandle();
    }

    buildCandle(){
        this.candleMesh = this.primitives.buildCylinder(-0.4, 3.7, -0.5, 0, 0, 0, 0.03, 0.03, 0.4, 30, 5, false, 0, 2*Math.PI, this.tableMaterial);
        this.flameMeshUpper = this.primitives.buildCylinder(-0.4, 4.2, -0.5, 0, 0, 0, 0, 0.05, 0.1, 30, 5, false, 0, 2*Math.PI, this.tableMaterial);
        this.flameMeshLower = this.primitives.buildCylinder(-0.4, 4.1, -0.5, 0, 0, 0, 0.05, 0, 0.1, 30, 5, false, 0, 2*Math.PI, this.tableMaterial);
    }
}

export { MyCandle };