import * as THREE from 'three';

class MyPainting{

    constructor(primitives, picture){
        this.primitives = primitives;

        this.paintingMesh = null;
        this.paintingFrameBackMesh = null;
        this.paintingCylinder1 = null;
        this.paintingCylinder2 = null;
        this.paintingCylinder3 = null;
        this.paintingCylinder4 = null;

        this.paintingGroup = new THREE.Group();
        this.picture = new THREE.TextureLoader().load(picture);
        this.material = new THREE.MeshPhongMaterial({ color: "#ffffff", 
        specular: "#000000", emissive: "#000000", shininess: 90, map: this.picture });
        this.woodTexture = new THREE.TextureLoader().load("textures/wood.jpg");
        this.woodTexture.wrapS = THREE.RepeatWrapping;
        this.woodTexture.wrapT = THREE.RepeatWrapping;
        this.woodTexture.repeat.set(1, 1);
        this.frameMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.woodTexture});
        this.buildPainting();
    }

    buildPainting(){
        this.paintingFrameBackMesh = this.primitives.buildParallelepiped(0, 0, 0, 0, 0, 0, 1.75, 2.625, 0.1, this.frameMaterial, false);

        this.paintingCylinder1 = this.primitives.buildCylinder(0, 0, 0, 0, -Math.PI/2, 0, 0.05, 0.05, 2.625, 32, 1, false, 0, Math.PI, this.frameMaterial, false);
        this.paintingCylinder2 = this.primitives.buildCylinder(0, 0, 0, 0, -Math.PI/2, 0, 0.05, 0.05, 2.625, 32, 1, false, 0, Math.PI, this.frameMaterial, false);
        this.paintingCylinder3 = this.primitives.buildCylinder(0, 0, 0, Math.PI/2, 0, Math.PI/2, 0.05, 0.05, 1.6, 32, 1, false, 0, Math.PI, this.frameMaterial, false);
        this.paintingCylinder4 = this.primitives.buildCylinder(0, 0, 0, Math.PI/2, 0, Math.PI/2, 0.05, 0.05, 1.6, 32, 1, false, 0, Math.PI, this.frameMaterial, false);

        this.paintingCylinder1.position.set(-0.825, 1.3125, 0.05);
        this.paintingCylinder2.position.set(0.825, 1.3125, 0.05);
        this.paintingCylinder3.position.set(0, 0.05, 0.05);
        this.paintingCylinder4.position.set(0, 2.575, 0.05);

        this.paintingMesh = this.primitives.buildPlane(0, 1.3125, 0.06, 0, 0, 0, 1.75, 2.625, this.material, false);
        
        this.paintingGroup.add(this.paintingFrameBackMesh);
        this.paintingGroup.add(this.paintingCylinder1);
        this.paintingGroup.add(this.paintingCylinder2);
        this.paintingGroup.add(this.paintingCylinder3);
        this.paintingGroup.add(this.paintingCylinder4);
        this.paintingGroup.add(this.paintingMesh);
    }
}

export { MyPainting };