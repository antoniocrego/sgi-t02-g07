import * as THREE from "three";

class MyRoute {
    
    static path = [
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(10, 0, 10),
        new THREE.Vector3(0, 0, 20),
        new THREE.Vector3(-10, 0, 30),
        new THREE.Vector3(-20, 0, 20),
        new THREE.Vector3(-10, 0, 10),
    ];

    static powerUpPoints = [
        new THREE.Vector3(10, 2, 10),
        new THREE.Vector3(3, 2, 0),
        new THREE.Vector3(0, 2, 20),
        new THREE.Vector3(20, 1.5, 20),
        new THREE.Vector3(5, 0.3, 25),
    ];
    
    static obstaclePoints = [
        new THREE.Vector3(6, 0.5, 6),
        new THREE.Vector3(14, 2, 14),
        new THREE.Vector3(16, 1, 26),
        new THREE.Vector3(-5, 0.3, 8),
    ];
}

export { MyRoute };
