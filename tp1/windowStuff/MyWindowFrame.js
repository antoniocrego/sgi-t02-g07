import * as THREE from 'three';

class MyWindowFrame{

    constructor(primitives, interiorHeight, interiorWidth, interiorDepth){
        this.primitives = primitives;
        this.windowFrameTop = null;
        this.windowFrameBottom = null;
        this.windowFrameLeft = null;
        this.windowFrameRight = null;
        this.windowFrameGroup = new THREE.Group();

        this.interiorHeight = interiorHeight;
        this.interiorWidth = interiorWidth;
        this.interiorDepth = interiorDepth;

        this.initMaterials();
        this.buildWindowFrame();
    }

    initMaterials(){
        this.windowFrameTexture = new THREE.TextureLoader().load("./textures/wood.jpg");
        this.windowFrameTexture.wrapS = THREE.RepeatWrapping;
        this.windowFrameTexture.wrapT = THREE.RepeatWrapping;
        this.windowFrameTexture.repeat.set(1, 1);
        this.windowFrameMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#000000", emissive: "#000000", shininess: 100, map:  this.windowFrameTexture});
    }

    buildWindowFrame(){
        const windowFrameTopHeight = this.interiorHeight * 0.02;
        const windowFrameBottomHeight = this.interiorHeight * 0.02;
        const windowFrameSideWidth = this.interiorWidth * 0.02;

        this.windowFrameTop = this.primitives.buildParallelepiped(0, 0, 0, 0, 0, 0, this.interiorWidth, windowFrameTopHeight, this.interiorDepth, this.windowFrameMaterial, false);
        this.windowFrameTop.position.set(0, this.interiorHeight / 2 - windowFrameTopHeight / 2, 0);

        this.windowFrameBottom = this.primitives.buildParallelepiped(0, 0, 0, 0, 0, 0, this.interiorWidth, windowFrameBottomHeight, this.interiorDepth, this.windowFrameMaterial, false);
        this.windowFrameBottom.position.set(0, -this.interiorHeight / 2 + windowFrameBottomHeight / 2, 0);

        this.windowFrameLeft = this.primitives.buildParallelepiped(0, 0, 0, 0, 0, 0, windowFrameSideWidth, this.interiorHeight - windowFrameTopHeight - windowFrameBottomHeight, this.interiorDepth, this.windowFrameMaterial, false);
        this.windowFrameLeft.position.set(-this.interiorWidth / 2 + windowFrameSideWidth / 2, 0, 0);

        this.windowFrameRight = this.primitives.buildParallelepiped(0, 0, 0, 0, 0, 0, windowFrameSideWidth, this.interiorHeight - windowFrameTopHeight - windowFrameBottomHeight, this.interiorDepth, this.windowFrameMaterial, false);
        this.windowFrameRight.position.set(this.interiorWidth / 2 - windowFrameSideWidth / 2, 0, 0);

        this.windowFrameGroup.add(this.windowFrameBottom);
        this.windowFrameGroup.add(this.windowFrameLeft);
        this.windowFrameGroup.add(this.windowFrameRight);
        this.windowFrameGroup.add(this.windowFrameTop);
    }
}

export { MyWindowFrame };