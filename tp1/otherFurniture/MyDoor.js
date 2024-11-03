import * as THREE from 'three';

class MyDoor{

    constructor(primitives){
        this.primitives = primitives;

        this.leftFrame = null;
        this.rightFrame = null;
        this.topFrame = null;

        this.door = null;

        this.knob = null;
        this.knobStick = null;

        this.doorGroup = new THREE.Group();

        this.initTextures();
        this.build();
    }

    initTextures(){
        this.woodTexture = new THREE.TextureLoader().load("textures/wood.jpg");
        this.woodTexture.wrapS = THREE.RepeatWrapping;
        this.woodTexture.wrapT = THREE.RepeatWrapping;
        this.woodTexture.repeat.set(1, 1);
        this.woodMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.woodTexture});

        this.metalTexture = new THREE.TextureLoader().load("textures/metal.avif");
        this.metalTexture.wrapS = THREE.RepeatWrapping;
        this.metalTexture.wrapT = THREE.RepeatWrapping;
        this.metalTexture.repeat.set(1, 1);
        this.metalMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", shininess: 80, map:  this.metalTexture});
    }

    build(){
        this.buildFrame();
        this.buildDoor();
        this.buildKnob();
    }

    buildFrame(){
        this.leftFrame = this.primitives.buildParallelepiped(0,0,0,0,0,0,0.4, 8, 0.4, this.woodMaterial);
        this.leftFrame.position.set(-2.5, 4, 0);
        this.doorGroup.add(this.leftFrame);

        this.rightFrame = this.leftFrame.clone();
        this.rightFrame.position.set(2.5, 4, 0);
        this.doorGroup.add(this.rightFrame);

        this.topFrame = this.primitives.buildParallelepiped(0,0,0,0,0,0,4.6, 0.4, 0.4, this.woodMaterial);
        this.topFrame.position.set(0, 7.8, 0);
        this.doorGroup.add(this.topFrame);
    }

    buildDoor(){
        this.door = this.primitives.buildParallelepiped(0,0,0,0,0,0,5, 8, 0.1, this.woodMaterial);
        this.door.position.set(0, 4, 0.05);
        this.doorGroup.add(this.door);
    }

    buildKnob(){
        this.knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), this.metalMaterial);
        this.knob.position.set(-1.8, 4.5, -0.3);
        this.doorGroup.add(this.knob);

        this.knobStick = this.primitives.buildCylinder(0,0,0,0,0,0,0.05, 0.05, 0.5, 10, 10, false, 0, 2*Math.PI, this.metalMaterial);
        this.knobStick.rotateX(Math.PI/2);
        this.knobStick.position.set(-1.8, 4.5, -0.2);
        this.doorGroup.add(this.knobStick);
    }

}

export { MyDoor };