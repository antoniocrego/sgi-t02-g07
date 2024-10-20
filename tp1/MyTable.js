import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';

class MyTable{

    constructor(primitives){
        this.primitives = primitives;

        this.tableTopMesh = null;
        this.tableLeg1Mesh = null;
        this.tableLeg2Mesh = null;
        this.tableLeg3Mesh = null;
        this.tableLeg4Mesh = null;

        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#ff0000", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        this.buildTable();

        this.plate1 = null;
        this.plate2 = null;
        this.plate3 = null;
        this.plate4 = null;
        this.plate5 = null;
        this.buildPlates();

        this.plateStack = new Array(5);
        this.buildPlateStack();

        this.cakePlate = null;
        this.buildCakePlate();
    }

    buildTable(){
        this.tableTopMesh = this.primitives.buildParallelepiped(0, 2.5, 0, 0, 0, 0, 7, 0.3, 10, this.tableMaterial); // table top
        this.tableLeg1Mesh = this.primitives.buildCylinder(3, 0, 4.5, 0, 0, 0, 0.2, 0.2, 2.5, 20, 10, false, 0, 2*Math.PI, this.tableMaterial); // table leg 1
        this.tableLeg2Mesh = this.primitives.buildCylinder(-3, 0, 4.5, 0, 0, 0, 0.2, 0.2, 2.5, 20, 10, false, 0, 2*Math.PI, this.tableMaterial); // table leg 2
        this.tableLeg3Mesh = this.primitives.buildCylinder(3, 0, -4.5, 0, 0, 0, 0.2, 0.2, 2.5, 20, 10, false, 0, 2*Math.PI, this.tableMaterial); // table leg 3
        this.tableLeg4Mesh = this.primitives.buildCylinder(-3, 0, -4.5, 0, 0, 0, 0.2, 0.2, 2.5, 20, 10, false, 0, 2*Math.PI, this.tableMaterial); // table leg 4
    }

    buildPlates(){
        this.plate1 = new MyPlate(this.primitives);
        this.plate1.plateMesh.translateX(2.5);
        this.plate1.plateMesh.translateZ(2.5);
        this.plate1.plateMesh.scale.set(0.5, 0.5, 0.5);

        this.plate2 = new MyPlate(this.primitives);
        this.plate2.plateMesh.translateX(-2.5);
        this.plate2.plateMesh.translateZ(2.5);
        this.plate2.plateMesh.scale.set(0.5, 0.5, 0.5);

        this.plate3 = new MyPlate(this.primitives);
        this.plate3.plateMesh.translateX(2.5);
        this.plate3.plateMesh.translateZ(-2.5);
        this.plate3.plateMesh.scale.set(0.5, 0.5, 0.5);

        this.plate4 = new MyPlate(this.primitives);
        this.plate4.plateMesh.translateX(-2.5);
        this.plate4.plateMesh.translateZ(-2.5);
        this.plate4.plateMesh.scale.set(0.5, 0.5, 0.5);

        this.plate5 = new MyPlate(this.primitives);
        this.plate5.plateMesh.translateX(0.4);
        this.plate5.plateMesh.translateZ(2);
        this.plate5.plateMesh.scale.set(0.5, 0.5, 0.5);
    }

    buildPlateStack(){
        for (let i = 0; i < 5; i++){
            this.plateStack[i] = new MyPlate(this.primitives);
            this.plateStack[i].plateMesh.scale.set(0.5, 0.5, 0.5);
            this.plateStack[i].plateMesh.translateY(i*0.1);
            this.plateStack[i].plateMesh.translateZ(-3.1);
        }
    }

    buildCakePlate(){
        this.cakePlate = new MyPlate(this.primitives);
        this.cakePlate.plateMesh.translateX(-0.4);
        this.cakePlate.plateMesh.translateZ(-0.5);
        this.cakePlate.plateMesh.scale.set(0.75, 0.75, 0.75);
    }
}

export { MyTable };