import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyPrimitives } from './MyPrimitives.js';
import { MyTable } from './MyTable.js';
import { MyCake } from './cakeStuff/MyCake.js';
import { MyCakeSlice } from './cakeStuff/MyCakeSlice.js';
import { MyPainting } from './paintings/MyPainting.js';
import { MyWindow } from './windowStuff/MyWindow.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,5,0)
        this.primitives = new MyPrimitives(this.app)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess })

        this.wallTexture = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallTexture.repeat.set(1, 1);
        this.wallMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTexture});

        this.floorTexture = new THREE.TextureLoader().load("textures/floor.webp");
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(1, 1);
        this.floorMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.floorTexture});
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
        this.boxMesh.castShadow = true;
        this.boxMesh.receiveShadow = true;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        /*
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );
        */

        // add a spotlight
        const spotLight = new THREE.SpotLight( 0xffffff, 100, 10, Math.PI/8, 0.8);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = 30;
        spotLight.position.set( 0, 10, 0 );
        this.app.scene.add( spotLight );

        const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        this.app.scene.add( spotLightHelper );

        // add a directional light
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 2.5;
        directionalLight.shadow.camera.bottom = -2.5;
        directionalLight.position.set( 9.7, 5.5, 0 );
        directionalLight.target.position.set( -10, 0, 0 );
        this.app.scene.add( directionalLight );

        const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
        this.app.scene.add( directionalLightHelper );

        // add candle light
        const candleLight = new THREE.PointLight( 0xffaa00, 1, 0, 2 );
        candleLight.castShadow = true;
        candleLight.shadow.mapSize.width = 1024;
        candleLight.shadow.mapSize.height = 1024;
        candleLight.shadow.camera.near = 0.1;
        candleLight.shadow.camera.far = 5;
        candleLight.position.set( -0.4, 4.2, -0.5 );
        this.app.scene.add( candleLight );

        const candleLightHelper = new THREE.PointLightHelper( candleLight, 0.1 );
        this.app.scene.add( candleLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        

        this.primitives.buildPlane(0,0,0,-Math.PI/2,0,0,20,20, this.floorMaterial); // floor

        this.primitives.buildPlane(0,5,10,0,Math.PI,0,20,10, this.wallMaterial); // left wall
        this.primitives.buildPlane(0,5,-10,0,0,0,20,10, this.wallMaterial); // right wall
        this.primitives.buildPlane(10,5,0,0,-Math.PI/2,0,20,10, this.wallMaterial); // front wall
        this.primitives.buildPlane(-10,5,0,0,Math.PI/2,0,20,10, this.wallMaterial); // back wall

        this.table = new MyTable(this.primitives)

        this.cake = new MyCake(this.primitives)
        this.cake.cakeGroup.position.x = -0.4;
        this.cake.cakeGroup.position.y = 2.9;
        this.cake.cakeGroup.position.z = -0.5;
        this.app.scene.add(this.cake.cakeGroup)

        this.cakeSlice = new MyCakeSlice(this.primitives)
        this.cakeSlice.sliceGroup.rotation.z = Math.PI/2;
        this.cakeSlice.sliceGroup.position.x = 0.8;
        this.cakeSlice.sliceGroup.position.y = 2.9;
        this.cakeSlice.sliceGroup.position.z = 1.4;
        this.app.scene.add(this.cakeSlice.sliceGroup);

        this.painting1 = new MyPainting(this.primitives, 'textures/antonio.jpg')
        this.painting1.paintingGroup.position.x = -2.5;
        this.painting1.paintingGroup.position.y = 6;
        this.painting1.paintingGroup.position.z = -9.99;
        this.app.scene.add(this.painting1.paintingGroup);

        this.painting2 = new MyPainting(this.primitives, 'textures/antonio.jpg')
        this.painting2.paintingGroup.position.x = 2.5;
        this.painting2.paintingGroup.position.y = 6;
        this.painting2.paintingGroup.position.z = -9.99;
        this.app.scene.add(this.painting2.paintingGroup);

        this.window = new MyWindow(this.primitives)
        this.window.windowGroup.position.x = 9.75;
        this.window.windowGroup.position.y = 5;
        this.window.windowGroup.position.z = 0;
        this.window.windowGroup.rotation.y = Math.PI/2;
        this.app.scene.add(this.window.windowGroup);
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };