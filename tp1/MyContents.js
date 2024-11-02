import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyPrimitives } from './MyPrimitives.js';
import { MyTable } from './MyTable.js';
import { MyCake } from './cakeStuff/MyCake.js';
import { MyCakeSlice } from './cakeStuff/MyCakeSlice.js';
import { MyPainting } from './paintings/MyPainting.js';
import { MyWindow } from './windowStuff/MyWindow.js';
import { MyFlowerJar } from './nurbs/MyFlowerJar.js';
import { MyNurbsBuilder } from './nurbs/MyNurbsBuilder.js';

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

        // primitive builders
        this.primitives = new MyPrimitives(this.app)
        this.nurbBuilder = new MyNurbsBuilder()

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
        this.floorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", shininess: 50, map:  this.floorTexture});

        // light related attributes
        this.spotLightOn = true;
        this.directionalLightOn = true;
        this.pointLightOn = true;
        this.ambientLightOn = true;
        this.helpersOn = false;

        this.spotLight = null;
        this.directionalLight = null;
        this.pointLight = null;
        this.ambientLight = null;

        this.pointLightHelper = null;
        this.directionalLightHelper = null;
        this.spotLightHelper = null;
        this.ambientLightHelper = null;
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

        // add a this.spotLight
        this.spotLight = new THREE.SpotLight( 0xffffff, 100, 10, Math.PI/8, 0.8);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 0.1;
        this.spotLight.shadow.camera.far = 30;
        this.spotLight.position.set( 0, 10, 0 );
        this.app.scene.add( this.spotLight );

        this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        this.app.scene.add( this.spotLightHelper );
        this.spotLightHelper.visible = false;

        // add a directional light
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 100;
        this.directionalLight.shadow.camera.left = -5;
        this.directionalLight.shadow.camera.right = 5;
        this.directionalLight.shadow.camera.top = 2.5;
        this.directionalLight.shadow.camera.bottom = -2.5;
        this.directionalLight.position.set( 9.7, 5.5, 0 );
        this.directionalLight.target.position.set( -10, 0, 0 );
        this.app.scene.add( this.directionalLight );

        this.directionalLightHelper = new THREE.DirectionalLightHelper( this.directionalLight );
        this.app.scene.add( this.directionalLightHelper );
        this.directionalLightHelper.visible = false;

        // add candle light
        this.pointLight = new THREE.PointLight( 0xffaa00, 1, 0, 2 );
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = 1024;
        this.pointLight.shadow.mapSize.height = 1024;
        this.pointLight.shadow.camera.near = 0.1;
        this.pointLight.shadow.camera.far = 5;
        this.pointLight.position.set( -0.4, 4.2, -0.5 );
        this.app.scene.add( this.pointLight );

        this.pointLightHelper = new THREE.PointLightHelper( this.pointLight, 0.1 );
        this.app.scene.add( this.pointLightHelper );
        this.pointLightHelper.visible = false;

        // add an ambient light
        this.ambientLight = new THREE.AmbientLight( 0x555555 , 1);
        this.app.scene.add( this.ambientLight );

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

        this.flowerJar = new MyFlowerJar(this.nurbBuilder)
        this.app.scene.add(this.flowerJar.flowerJarGroup);
    }
    

    /**
     * toggles the spot light
     */
    updateSpotLight() {
        this.spotLight.visible = this.spotLightOn
    }

    /**
     * toggles the directional light
     */
    updateDirectionalLight() {
        this.directionalLight.visible = this.directionalLightOn
    }

    /**
     * toggles the point light
     */
    updatePointLight() {
        this.pointLight.visible = this.pointLightOn
    }

    /**
     * toggles the ambient light
     */
    updateAmbientLight() {
        this.ambientLight.visible = this.ambientLightOn
    }

    /**
     * toggles the helpers
     */
    updateHelpers() {
        this.pointLightHelper.visible = this.helpersOn
        this.directionalLightHelper.visible = this.helpersOn
        this.spotLightHelper.visible = this.helpersOn
        this.ambientLightHelper.visible = this.helpersOn
    }
}

export { MyContents };