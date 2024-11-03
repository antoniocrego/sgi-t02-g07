import * as THREE from 'three';

class MyPetal{

    constructor(nurbsBuilder){
        this.nurbsBuilder = nurbsBuilder;
        this.petal = null;
        this.initTexture();
        this.build();
    }

    initTexture(){
        const texture = new THREE.TextureLoader().load("textures/petal.webp");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  texture, side: THREE.DoubleSide});
    }

    build(){
        const controlPoints = [
            [ [ -0.3, 0, 0, 1 ],
                [-0.25, 1, 0, 1 ],
                [-0.02, 1, -0.5, 1]],
            [ [ -0.1, -0.4, 0.3, 1 ],
                [0, 0.5, 0.3, 1 ],
                [-0.01, 1, -0.5, 1]],
            [ [ 0, -0.5, 0, 1 ],
                [ 0, 0.5, -0.5, 1 ],
                [0, 1, -0.5, 1]],
            [ [0.1, -0.4, 0.3, 1 ],
                [0, 0.5, 0.3, 1 ],
                [0.01, 1, -0.5, 1]],
            [ [0.3, 0, 0, 1 ],
                [0.25, 1, 0, 1 ],
                [0.02, 1, -0.5, 1]],
        ];
        

        const degree1 = 4;
        const degree2 = 2;
        const samples1 = 20;
        const samples2 = 20;

        this.petal = new THREE.Mesh(this.nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2), this.material);
    }


}

export { MyPetal };