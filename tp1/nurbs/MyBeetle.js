import * as THREE from 'three';

class MyBeetle {
    constructor(scale) {
        this.material = new THREE.LineBasicMaterial({ color: "#000000" });
        this.beetle = new THREE.Group();
        this.scale = scale;
        this.definePoints();
        this.build();
    }

    definePoints(){
        this.halfCirclePoints = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 4/3, 0),
            new THREE.Vector3(1, 4/3, 0),
            new THREE.Vector3(1, 0, 0)
        ];

        this.quarterCirclePoints = [
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(-1, 1/2, 0),
            new THREE.Vector3(-1/2, 1, 0),
            new THREE.Vector3(0, 1, 0)
        ];
    }

    build() {
        let halfCircle1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CubicBezierCurve3(...this.halfCirclePoints).getPoints(20)), this.material);
        halfCircle1.scale.set(3,3,1);
        let halfCircle2 = halfCircle1.clone();
        halfCircle2.translateX(3+4+3);

        let quarterCircle1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CubicBezierCurve3(...this.quarterCirclePoints).getPoints(20)), this.material);
        let quarterCircle2 = quarterCircle1.clone();
        let quarterCircle3 = quarterCircle1.clone();

        quarterCircle1.scale.set(8,8,1);
        quarterCircle1.translateX(5);

        quarterCircle2.translateX(5);
        quarterCircle2.translateY(4);
        quarterCircle2.rotateZ(-Math.PI/2);
        quarterCircle2.scale.set(4,4,1);

        quarterCircle3.translateX(9);
        quarterCircle3.rotateZ(-Math.PI/2);
        quarterCircle3.scale.set(4,4,1);

        this.beetle.add(quarterCircle1);
        this.beetle.add(quarterCircle2);
        this.beetle.add(quarterCircle3);
        this.beetle.add(halfCircle1);
        this.beetle.add(halfCircle2);
    }
}

export { MyBeetle };