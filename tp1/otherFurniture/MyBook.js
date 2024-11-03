import * as THREE from 'three';

class MyBook{

    constructor(primitives){
        this.primitives = primitives;

        this.interior = null;
        this.topCover = null;
        this.bottomCover = null;
        this.spine = null;

        this.bookGroup = new THREE.Group();

        this.initTextures();
        this.build();
    }

    initTextures(){
        this.coverTexture = new THREE.TextureLoader().load("textures/cover.jpg");
        this.coverTexture.wrapS = THREE.RepeatWrapping;
        this.coverTexture.wrapT = THREE.RepeatWrapping;
        this.coverTexture.repeat.set(1, 1);
        this.coverMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.coverTexture});

        this.pagesTexture = new THREE.TextureLoader().load("textures/pages.jpg");
        this.pagesTexture.wrapS = THREE.RepeatWrapping;
        this.pagesTexture.wrapT = THREE.RepeatWrapping;
        this.pagesTexture.repeat.set(1, 1);
        this.pagesMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.pagesTexture});
    }

    build(){
        this.buildInterior();
        this.buildCovers();
        this.buildSpine();
        this.bookGroup.scale.set(1, 0.4, 1);
    }

    buildInterior(){
        this.interior = this.primitives.buildParallelepiped(0,0,0,0,0,0,1, 0.85, 1, this.pagesMaterial);
        this.interior.position.set(0, 0.5, 0);
        this.bookGroup.add(this.interior);
    }

    buildCovers(){
        this.topCover = this.primitives.buildParallelepiped(0,0,0,0,0,0,1, 0.1, 1, this.coverMaterial);
        this.topCover.position.set(0, 1, 0);
        this.bookGroup.add(this.topCover);

        this.bottomCover = this.topCover.clone();
        this.bottomCover.position.set(0, 0, 0);
        this.bookGroup.add(this.bottomCover);
    }

    buildSpine(){
        this.spine = this.primitives.buildCylinder(0,0,0,0,0,0,0.56,0.56,1,10, 10, false, Math.PI, Math.PI, this.coverMaterial, false);
        this.spine.rotateX(Math.PI/2);
        this.spine.scale.set(0.2, 1, 1);
        this.spine.position.set(-0.49, 0.5, 0);
        this.bookGroup.add(this.spine);
    }

}

export { MyBook };