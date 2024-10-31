import * as THREE from 'three';
import { MyWindowFrame } from './MyWindowFrame.js';

class MyWindow{

    constructor(primitives){
        this.primitives = primitives;
        this.windowMesh = null;
        this.windowFrame = null;
        this.innerWindowFrame1 = null;
        this.innerWindowFrame2 = null;
        this.windowGroup = new THREE.Group();
        this.initMaterials();
        this.buildWindow();
    }

    initMaterials(){
        this.windowTexture = new THREE.TextureLoader().load("textures/window.webp");
        this.windowTexture.wrapS = THREE.RepeatWrapping;
        this.windowTexture.wrapT = THREE.RepeatWrapping;
        this.windowTexture.repeat.set(1800/1200 * 5/10, 1);
        this.windowMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 1000, map:  this.windowTexture});
    }

    buildWindow(){
        this.windowFrame = new MyWindowFrame(this.primitives, 5, 10, 0.5);

        this.windowMesh = this.primitives.buildPlane(0, 0, 0.2, 0, Math.PI, 0, 10, 5, this.windowMaterial, false);

        this.innerWindowFrameMesh1 = new MyWindowFrame(this.primitives, 4.8, 4.8, 0.2);

        this.innerWindowFrameMesh2 = new MyWindowFrame(this.primitives, 4.8, 4.8, 0.2);

        this.innerWindowFrameMesh1.windowFrameGroup.position.set(2.4, 0, 0.1);
        this.innerWindowFrameMesh2.windowFrameGroup.position.set(-2.4, 0, -0.1);

        this.windowGroup.add(this.innerWindowFrameMesh1.windowFrameGroup);
        this.windowGroup.add(this.innerWindowFrameMesh2.windowFrameGroup);
        this.windowGroup.add(this.windowMesh);
        this.windowGroup.add(this.windowFrame.windowFrameGroup);

    }
}

export { MyWindow};