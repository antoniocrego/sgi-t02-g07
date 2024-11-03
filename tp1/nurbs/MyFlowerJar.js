import * as THREE from 'three';

class MyFlowerJar{

    constructor(nurbsBuilder){
        this.nurbsBuilder = nurbsBuilder;
        this.flowerJar1 = null;
        this.flowerJar2 = null;
        this.flowerJarGroup = new THREE.Group();
        this.initTexture();
        this.build();
    }

    initTexture(){
        const texture = new THREE.TextureLoader().load("textures/jar.avif");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 2);
        this.material = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", shininess: 50, map:  texture, side: THREE.DoubleSide});
    }

    build(){
        const controlPoints = [
            [ [ -0.05, -1.5, 0, 1 ],
                [-0.75, -1.5, 0, 1 ],
                [0, 0.5, 0, 1],
                [-0.25, 2, 0, 1]],
            [ [ -0.025, -1.5, 0, 1 ],
                [ -0.5, -1.5, 1, 1 ],
                [-0.1, 0.5, 0, 1],
                [-0.25, 2, 0.35, 1]],
            [ [0.025, -1.5, 0, 1 ],
                [0.5, -1.5, 1, 1 ],
                [0.1, 0.5, 0, 1],
                [0.25, 2, 0.35, 1]],
            [ [ 0.05, -1.5, 0, 1 ],
                [ 0.75, -1.5, 0, 1 ],
                [0, 0.5, 0, 1],
                [0.25, 2, 0, 1]],
        ];

        const degree1 = 3;
        const degree2 = 3;
        const samples1 = 20;
        const samples2 = 20;

        this.flowerJar1 = new THREE.Mesh(this.nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2), this.material);
        this.flowerJar2 = new THREE.Mesh(this.nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2), this.material);
        this.flowerJar2.rotation.y = Math.PI;
        this.flowerJar1.castShadow = true;
        this.flowerJar1.receiveShadow = true;
        this.flowerJar2.castShadow = true;
        this.flowerJar2.receiveShadow = true;

        this.flowerJarGroup.add(this.flowerJar1);
        this.flowerJarGroup.add(this.flowerJar2);
    }


}

export { MyFlowerJar };