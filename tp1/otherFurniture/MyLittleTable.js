import * as THREE from 'three';

class MyLittleTable{

    constructor(primitives){
        this.primitives = primitives;

        this.leg1 = null;
        this.leg2 = null;
        this.leg3 = null;
        this.leg4 = null;

        this.seat = null;
        this.seatBeam1 = null;
        this.seatBeam2 = null;
        this.seatBeam3 = null;
        this.seatBeam4 = null;

        this.backColumn1 = null;
        this.backColumn2 = null;

        this.tableGroup = new THREE.Group();

        this.initTextures();
        this.build();
    }

    initTextures(){
        this.woodTexture = new THREE.TextureLoader().load("textures/wood.jpg");
        this.woodTexture.wrapS = THREE.RepeatWrapping;
        this.woodTexture.wrapT = THREE.RepeatWrapping;
        this.woodTexture.repeat.set(1, 1);
        this.woodMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.woodTexture});
    }

    build(){
        this.buildLegs();
        this.buildSeat();
    }

    buildLegs(){
        this.leg1 = this.primitives.buildCylinder(0,0,0,0,0,0,0.1, 0.1, 1.5, 10, 10, false, 0, 2*Math.PI, this.woodMaterial);
        this.leg1.position.set(-0.8, 0.75, -0.8);
        this.tableGroup.add(this.leg1);

        this.leg2 = this.leg1.clone();
        this.leg2.position.set(0.8, 0.75, -0.8);
        this.tableGroup.add(this.leg2);

        this.leg3 = this.leg1.clone();
        this.leg3.position.set(-0.8, 0.75, 0.8);
        this.tableGroup.add(this.leg3);

        this.leg4 = this.leg1.clone();
        this.leg4.position.set(0.8, 0.75, 0.8);
        this.tableGroup.add(this.leg4);
    }

    buildSeat(){
        
        this.seat = this.primitives.buildParallelepiped(0, 1.5, 0, 0, 0, 0, 1.6+0.3, 0.2, 1.6+0.3, this.woodMaterial, false);
        this.tableGroup.add(this.seat);
        
        this.seatBeam1 = this.primitives.buildParallelepiped(0,0,0,0,0,0,0.05, 0.3, 1.6, this.woodMaterial, false);
        this.seatBeam1.position.set(0, 1.5-0.15, -0.8); 
        this.seatBeam1.rotateY(Math.PI/2);
        this.tableGroup.add(this.seatBeam1);

        this.seatBeam2 = this.seatBeam1.clone();
        this.seatBeam2.position.set(0.8, 1.5-0.15, 0);
        this.seatBeam2.rotateY(Math.PI/2);
        this.tableGroup.add(this.seatBeam2);

        this.seatBeam3 = this.seatBeam1.clone();
        this.seatBeam3.position.set(-0.8, 1.5-0.15, 0);
        this.seatBeam3.rotateY(Math.PI/2);
        this.tableGroup.add(this.seatBeam3);

        this.seatBeam4 = this.seatBeam1.clone();
        this.seatBeam4.position.set(0, 1.5-0.15, 0.8);
        this.tableGroup.add(this.seatBeam4);
        
    }
}

export { MyLittleTable };