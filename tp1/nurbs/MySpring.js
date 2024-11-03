import * as THREE from 'three';

class MySpring {
    constructor(loops, compression) {
        this.spring = new THREE.Group();
        this.loops = loops;
        this.compression = compression;
        this.material = new THREE.LineBasicMaterial({ color: "#000000" })
        this.material = new THREE.MeshPhongMaterial({ color: "#00ff00", shininess: 50, specular: "#ffffff" });
        this.definePoints();
        this.build();
    }

    definePoints(){
        this.points = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 1/2, this.compression),
            new THREE.Vector3(-1/2, 1, this.compression*2),
            new THREE.Vector3(0, 1, this.compression*3)
        ];
    }

    build() {
        for (let i = 0; i < this.loops; i++) {
            let curve = new THREE.CubicBezierCurve3(...this.points);
            let mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.1, 16, false), this.material);
            mesh.rotateZ(-i * Math.PI / 2);
            mesh.translateZ(i * this.compression * 3);
            mesh.castShadow = true;
            mesh.receiveShadow = true
            this.spring.add(mesh);
        }
    }
}

export { MySpring };