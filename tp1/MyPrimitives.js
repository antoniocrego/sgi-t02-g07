import * as THREE from 'three';

class MyPrimitives {
    /**
     * Constructs the object
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
    }

    /**
     * builds a parallelepiped mesh with material assigned
     */
    buildParallelepiped(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, sizeX, sizeY, sizeZ, material) {
        let parallelepiped = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        let parallelepipedMesh = new THREE.Mesh( parallelepiped, material );

        parallelepipedMesh.position.x = positionX;
        parallelepipedMesh.position.y = positionY+sizeY/2;
        parallelepipedMesh.position.z = positionZ;

        parallelepipedMesh.rotation.x = rotationX;
        parallelepipedMesh.rotation.y = rotationY;
        parallelepipedMesh.rotation.z = rotationZ;

        this.app.scene.add( parallelepipedMesh );

        return parallelepipedMesh;
    }

    /**
     * builds a plane mesh with material assigned
     */
    buildPlane(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, sizeX, sizeY, material) {
        let plane = new THREE.PlaneGeometry(sizeX, sizeY);
        let planeMesh = new THREE.Mesh( plane, material);

        planeMesh.position.x = positionX;
        planeMesh.position.y = positionY;
        planeMesh.position.z = positionZ;

        planeMesh.rotation.x = rotationX;
        planeMesh.rotation.y = rotationY;
        planeMesh.rotation.z = rotationZ;

        this.app.scene.add( planeMesh );

        return planeMesh;
    }

    /**
     * builds a cylinder mesh with material assigned
     */

    buildCylinder(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, material) {
        let cylinder = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        let cylinderMesh = new THREE.Mesh( cylinder, material);

        cylinderMesh.position.x = positionX;
        cylinderMesh.position.y = positionY+height/2;
        cylinderMesh.position.z = positionZ;

        cylinderMesh.rotation.x = rotationX;
        cylinderMesh.rotation.y = rotationY;
        cylinderMesh.rotation.z = rotationZ;

        this.app.scene.add( cylinderMesh );
        return cylinderMesh;
    }

    buildCylinderCovers(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, radius, height, thetaStart, thetaLength, material) {
        let cylinderCover1 = this.buildPlane(positionX+(radius/2)*Math.sin(rotationY+thetaStart), positionY+height/2, positionZ+(radius/2)*Math.cos(rotationY+thetaStart), rotationX, rotationY-Math.PI/2+thetaStart, rotationZ, radius, height, material);
        let cylinderCover2 = this.buildPlane(positionX+(radius/2)*Math.sin(rotationY+thetaStart+thetaLength), positionY+height/2, positionZ+(radius/2)*Math.cos(rotationY+thetaStart+thetaLength), rotationX, rotationY+Math.PI/2+thetaStart+thetaLength, rotationZ, radius, height, material);
        return [cylinderCover1, cylinderCover2];
    }
}

export { MyPrimitives };