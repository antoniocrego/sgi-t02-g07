import * as THREE from 'three';

class MyNewspaper{

    constructor(nurbsBuilder){
        this.nurbsBuilder = nurbsBuilder;
        this.newspaper = null;
        this.newspaperBottom = null;
        this.newspaperTop = null;
        this.newspaperGroup = new THREE.Group();
        this.initTexture();
        this.build();
    }

    initTexture(){
        const texture = new THREE.TextureLoader().load("textures/newspaper.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.material = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  texture});

        const textureBottom = new THREE.TextureLoader().load("textures/roll.png");
        textureBottom.wrapS = THREE.RepeatWrapping;
        textureBottom.wrapT = THREE.RepeatWrapping;
        textureBottom.repeat.set(1, 1);
        this.materialBottom = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  textureBottom});
    }

    build(){
        const controlPoints = [
            [ [ -0.1, 0, 0, 1 ],
                [-0.1, 1, 0, 1 ],
                [-0.1, 2, 0, 1]],
            [ [ 0, 0, 0.5, 1 ],
                [0, 1, 0.2, 1 ],
                [0, 2, 0.5, 1]],
            [ [ 1, 0, 0, 1 ],
                [ 0.5, 1, 0, 1 ],
                [1, 2, 0, 1]],
            [ [0, 0, -0.5, 1 ],
                [0, 1, -0.2, 1 ],
                [0, 2, -0.5, 1]],
            [ [-0.1, 0, 0, 1 ],
                [-0.1, 1, 0, 1 ],
                [-0.1, 2, 0, 1] ]
        ];
        
        

        const degree1 = 4;
        const degree2 = 2;
        const samples1 = 20;
        const samples2 = 20;

        this.newspaper = new THREE.Mesh(this.nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2), this.material);
        this.newspaper.castShadow = true;
        this.newspaper.receiveShadow = true;

        const controlPointsBottom = [
            [ [ -0.1, 0, 0, 1 ], [0,0,0,1]],
            [ [ 0, 0, 0.5, 1 ],[0,0,0,1]],
            [ [ 1, 0, 0, 1 ],[0,0,0,1]],
            [ [0, 0, -0.5, 1 ],[0,0,0,1]],
            [ [-0.1, 0, 0, 1 ],[0,0,0,1] ]
        ];

        const degree1Bottom = 4;
        const degree2Bottom = 1;

        this.newspaperBottom = new THREE.Mesh(this.nurbsBuilder.build(controlPointsBottom, degree1Bottom, degree2Bottom, samples1, samples2), this.materialBottom);
        this.newspaperBottom.rotateZ(Math.PI);
        this.newspaperBottom.rotateY(Math.PI);
        this.newspaperBottom.receiveShadow = true;

        const controlPointsTop = [
            [ [ -0.1, 2, 0, 1 ], [0,2,0,1]],
            [ [ 0, 2, 0.5, 1 ],[0,2,0,1]],
            [ [ 1, 2, 0, 1 ],[0,2,0,1]],
            [ [0, 2, -0.5, 1 ],[0,2,0,1]],
            [ [-0.1, 2, 0, 1 ],[0,2,0,1] ]
        ];

        const degree1Top = 4;
        const degree2Top = 1;

        this.newspaperTop = new THREE.Mesh(this.nurbsBuilder.build(controlPointsTop, degree1Top, degree2Top, samples1, samples2), this.materialBottom);
        this.newspaperTop.receiveShadow = true;

        this.newspaperGroup.add(this.newspaper);
        this.newspaperGroup.add(this.newspaperBottom);
        this.newspaperGroup.add(this.newspaperTop);

    }


}

export { MyNewspaper };