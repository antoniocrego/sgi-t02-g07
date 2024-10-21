import * as THREE from 'three';

class MyCakeSlice{

    constructor(primitives){
        this.primitives = primitives;
        this.cakeSliceMesh = null;
        this.cakeSliceCover1 = null;
        this.cakeSliceCover2 = null;
        this.sliceGroup = new THREE.Group();
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ffff00", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildCakeSlice();
    }

    buildCakeSlice(){
        this.cakeSliceMesh = this.primitives.buildCylinder(0, 0, 0, 0, 0, 0, 1.25, 1.25, 0.8, 30, 5, false, 0, 2*Math.PI/10, this.tableMaterial, false);
        let cakeArray = this.primitives.buildCylinderCovers(0, 0, 0, 0, 0, 0, 1.25, 0.8, 0, 2*Math.PI/10, this.tableMaterial, false);
        this.cakeSliceCover1 = cakeArray[0];
        this.cakeSliceCover2 = cakeArray[1];
        this.sliceGroup.add(this.cakeSliceMesh);
        this.sliceGroup.add(this.cakeSliceCover1);
        this.sliceGroup.add(this.cakeSliceCover2);
    }
}

export { MyCakeSlice };