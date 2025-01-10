import * as THREE from "three";

class MyObstacle {

    constructor(app, position) {
        this.app = app
        const geometry = new THREE.CylinderGeometry( 0.2, 0.4, 0.6, 10 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x000cff} ); 
        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.set(...position);

        this.app.scene.add(cylinder);

        // Bounding box
        this.boxhelper = new THREE.BoxHelper(cylinder, 0xffff00);
        this.bbox = new THREE.Box3();
        this.bbox.setFromObject(this.boxhelper);
        this.app.scene.add(this.boxhelper)
    }


}

export{ MyObstacle };