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
    buildParallelepiped(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, sizeX, sizeY, sizeZ, material, autoPlace=true) {
        let parallelepiped = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
        let parallelepipedMesh = new THREE.Mesh( parallelepiped, material );

        parallelepipedMesh.rotateX(rotationX);
        parallelepipedMesh.rotateY(rotationY);
        parallelepipedMesh.rotateZ(rotationZ);
        parallelepipedMesh.translateX(positionX);
        parallelepipedMesh.translateY(positionY+sizeY/2);
        parallelepipedMesh.translateZ(positionZ);
        parallelepipedMesh.castShadow = true;
        parallelepipedMesh.receiveShadow = true;

        if(autoPlace) this.app.scene.add( parallelepipedMesh );

        return parallelepipedMesh;
    }

    /**
     * builds a plane mesh with material assigned
     */
    buildPlane(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, sizeX, sizeY, material, autoPlace=true) {
        let plane = new THREE.PlaneGeometry(sizeX, sizeY);
        let planeMesh = new THREE.Mesh( plane, material);

        planeMesh.position.x = positionX;
        planeMesh.position.y = positionY;
        planeMesh.position.z = positionZ;

        planeMesh.rotation.x = rotationX;
        planeMesh.rotation.y = rotationY;
        planeMesh.rotation.z = rotationZ;

        planeMesh.castShadow = true;
        planeMesh.receiveShadow = true;

        if (autoPlace) this.app.scene.add( planeMesh );

        return planeMesh;
    }

    /**
     * builds a cylinder mesh with material assigned
     */

    buildCylinder(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength, material, autoPlace=true) {
        let cylinder = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
        let cylinderMesh = new THREE.Mesh( cylinder, material);

        cylinderMesh.rotateX(rotationX);
        cylinderMesh.rotateY(rotationY);
        cylinderMesh.rotateZ(rotationZ);

        cylinderMesh.translateX(positionX);
        cylinderMesh.translateY(positionY+height/2);
        cylinderMesh.translateZ(positionZ);

        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;

        if(autoPlace) this.app.scene.add( cylinderMesh );
        return cylinderMesh;
    }

    buildCylinderCovers(positionX, positionY, positionZ, rotationX, rotationY, rotationZ, radius, height, thetaStart, thetaLength, material, autoPlace=true) {
        let cylinderCover1 = this.buildPlane(positionX+(radius/2)*Math.sin(rotationY+thetaStart), positionY+height/2, positionZ+(radius/2)*Math.cos(rotationY+thetaStart), rotationX, rotationY-Math.PI/2+thetaStart, rotationZ, radius, height, material, autoPlace);
        let cylinderCover2 = this.buildPlane(positionX+(radius/2)*Math.sin(rotationY+thetaStart+thetaLength), positionY+height/2, positionZ+(radius/2)*Math.cos(rotationY+thetaStart+thetaLength), rotationX, rotationY+Math.PI/2+thetaStart+thetaLength, rotationZ, radius, height, material, autoPlace);
        return [cylinderCover1, cylinderCover2];
    }
}

export { MyPrimitives };