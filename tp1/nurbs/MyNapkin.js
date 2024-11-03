import * as THREE from 'three';

class MyNapkin{

    constructor(nurbsBuilder){
        this.nurbsBuilder = nurbsBuilder;
        this.napkin = null;
        this.initTexture();
        this.build();
    }

    initTexture(){
        const texture = new THREE.TextureLoader().load("textures/napkin.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  texture, side: THREE.DoubleSide});
    }

    build(){
        const controlPoints = [
            [ [ -1, -1, 0, 1 ],
                [-1, -0.5, 0, 1 ],
                [-0.6, 0, 0, 1],
                [-1, 0.5, 0, 1],
                [-0.8, 0.9, 0, 1]],
            [ [ -0.5, -1, 0, 1 ],
                [-0.5, -0.5, 0, 1 ],
                [1, -0.2, 0, 1],
                [-0.5, 0.5, 0, 1],
                [-0.5, 1, 0, 1]],
            [ [ 0, -0.6, 0, 1 ],
                [ 0, -0.5, 0, 1 ],
                [0, 0, 3, 1],
                [0, 0.5, -0.8, 1],
                [0, 1, 0, 1]],
            [ [0.5, -1, 0, 1 ],
                [0.5, -0.5, 0, 1 ],
                [0.3, 1, -0.5, 1],
                [0.5, 0.5, 0, 1],
                [0.5, 1, 0, 1]],
            [ [1, -1, -0.05, 1 ],
                [1, -0.5, 0, 1 ],
                [1, 0, 0, 1],
                [1, 0.5, 0, 1],
                [0.5, 0.5, 0, 1] ]
        ];
        
        

        const degree1 = 4;
        const degree2 = 4;
        const samples1 = 8;
        const samples2 = 8;

        this.napkin= new THREE.Mesh(this.nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2), this.material);

        this.napkin.rotateX(-Math.PI/2);
        this.napkin.rotateZ(Math.random() * Math.PI * 2);
    }


}

export { MyNapkin };