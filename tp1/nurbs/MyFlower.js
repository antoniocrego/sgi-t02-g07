import * as THREE from 'three';
import {MyPetal} from './MyPetal.js';

class MyFlower {
    constructor(nurbsBuilder) {
        this.nurbsBuilder = nurbsBuilder;
        this.center = null;
        this.petals = new Array();
        this.petalCount = 5;
        this.flowerStem = null;
        this.flowerGroup = new THREE.Group();
        this.initTextures();
        this.build();
    }

    initTextures() {
        const texture = new THREE.TextureLoader().load("textures/receptacle.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  texture});

        const flowerStemTexture = new THREE.TextureLoader().load("textures/stem.jpg");
        flowerStemTexture.wrapS = THREE.RepeatWrapping;
        flowerStemTexture.wrapT = THREE.RepeatWrapping;
        flowerStemTexture.repeat.set(1, 1);
        this.flowerStemMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  flowerStemTexture});
    }

    build() {
        const angleIncrement = (Math.PI + Math.PI/2) / this.petalCount;
        this.center = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), this.material);
        this.center.rotateY(-Math.PI/2);
        this.center.castShadow = true;
        this.center.receiveShadow = true;

        for (let i = 0; i < this.petalCount; i++) {
            const angle = i * angleIncrement;
            const petal = new MyPetal(this.nurbsBuilder);
            petal.petal.translateY(0.3);
            petal.petal.rotateZ(-Math.PI/2);
            petal.petal.rotateZ(angle);
            petal.petal.position.x = 0.5 * Math.cos(angle);
            petal.petal.position.y = 0.5 * Math.sin(angle);
            this.petals.push(petal);
            this.flowerGroup.add(petal.petal);
        }

        this.flowerGroup.rotateX(-Math.PI/10);
        this.flowerGroup.add(this.center);

        let flowerStemPoints = [
        ];

        for (let i = 0; i < 6; i++) {
            flowerStemPoints.push(new THREE.Vector3(Math.sin(i*Math.PI/2)*0.1, i, Math.sin(i) * 0.1));
        }

        let flowerStemCurve = new THREE.CubicBezierCurve3(
            flowerStemPoints[0], flowerStemPoints[1], flowerStemPoints[2], flowerStemPoints[3], flowerStemPoints[4], flowerStemPoints[5], flowerStemPoints[6]
        );
        let flowerStemGeometry = new THREE.TubeGeometry(flowerStemCurve, 64, 0.05, 20, false);
        this.flowerStem = new THREE.Mesh(flowerStemGeometry, this.flowerStemMaterial);
        this.flowerStem.castShadow = true;
        this.flowerStem.receiveShadow = true;

        this.flowerStem.translateY(-3);
        this.flowerStem.translateX(0.1);

        this.flowerGroup.add(this.flowerStem);
    }
}

export { MyFlower };