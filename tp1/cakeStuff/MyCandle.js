import * as THREE from 'three';

class MyCandle{

    constructor(primitives){
        this.primitives = primitives;
        this.candleMesh = null;
        this.flameMeshUpper = null;
        this.flameMeshLower = null;
        this.candleGroup = new THREE.Group();
        this.initTextures();
        this.buildCandle();
    }

    initTextures(){
        this.candleTexture = new THREE.TextureLoader().load("textures/wax.jpg");
        this.candleTexture.wrapS = THREE.RepeatWrapping;
        this.candleTexture.wrapT = THREE.RepeatWrapping;
        this.candleTexture.repeat.set(1, 1);
        this.candleMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#000000", shininess: 10, map:  this.candleTexture});

        this.flameMaterial = new THREE.MeshLambertMaterial({ color: "#e25822" });
    }

    buildCandle(){
        this.candleMesh = this.primitives.buildCylinder(0, 0, 0, 0, 0, 0, 0.03, 0.03, 0.4, 30, 5, false, 0, 2*Math.PI, this.candleMaterial);
        this.flameMeshUpper = this.primitives.buildCylinder(0, 0.5, 0, 0, 0, 0, 0, 0.05, 0.1, 30, 5, false, 0, 2*Math.PI, this.flameMaterial);
        this.flameMeshLower = this.primitives.buildCylinder(0, 0.4, 0, 0, 0, 0, 0.05, 0, 0.1, 30, 5, false, 0, 2*Math.PI, this.flameMaterial);
        this.flameMeshLower.castShadow = false;
        this.flameMeshLower.receiveShadow = false;
        this.flameMeshUpper.castShadow = false;
        this.flameMeshUpper.receiveShadow = false;


        this.candleGroup.add(this.candleMesh);
        this.candleGroup.add(this.flameMeshUpper);
        this.candleGroup.add(this.flameMeshLower);
    }
}

export { MyCandle };