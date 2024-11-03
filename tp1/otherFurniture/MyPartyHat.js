import * as THREE from 'three';

class MyPartyHat{
    constructor(primitives) {
        this.primitives = primitives
        this.hat = null;
        this.texture = new THREE.TextureLoader().load("textures/partyHat.png");
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1, 1);
        this.material = new THREE.MeshPhongMaterial({ color: "#ffffff", shininess: 50, specular: "#ffffff", map: this.texture, side: THREE.DoubleSide });
        this.build();
    }

    build() {
        this.hat = this.primitives.buildCylinder(0,0,0,0,0,0,0,0.3,1,16,16,true,0,2*Math.PI,this.material,false);
        this.hat.position.set(0, 0, 0);
    }
}

export { MyPartyHat };