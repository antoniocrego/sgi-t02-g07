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
import { MyNewspaper } from './nurbs/MyNewspaper.js';
import { MyChair } from './otherFurniture/MyChair.js';
import { MyDoor } from './otherFurniture/MyDoor.js';
import { MyLittleTable } from './otherFurniture/MyLittleTable.js';
import { MyBook } from './otherFurniture/MyBook.js';
import { MyBeetle } from './nurbs/MyBeetle.js';
import { MySpring } from './nurbs/MySpring.js';
import { MyPartyHat } from './otherFurniture/MyPartyHat.js';

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
        this.axisToggle = true

        // primitive builders
        this.primitives = new MyPrimitives(this.app)
        this.nurbBuilder = new MyNurbsBuilder()

        this.wallTexture = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.wallTexture.wrapT = THREE.RepeatWrapping;
        this.wallTexture.repeat.set(1, 1);
        this.wallMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTexture});

        this.wallTextureBottom = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTextureBottom.wrapS = THREE.RepeatWrapping;
        this.wallTextureBottom.wrapT = THREE.RepeatWrapping;
        this.wallTextureBottom.repeat.set(1, 844/1500 * 10/20);
        this.wallMaterialBottom = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTextureBottom});

        this.wallTextureTop = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTextureTop.wrapS = THREE.RepeatWrapping;
        this.wallTextureTop.wrapT = THREE.RepeatWrapping;
        this.wallTextureTop.repeat.set(1, 844/1500 * 10/20);
        this.wallTextureTop.offset.y = 844/1500 * 7.5/10;
        this.wallMaterialTop = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTextureTop});

        this.wallTextureLeft = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTextureLeft.wrapS = THREE.RepeatWrapping;
        this.wallTextureLeft.wrapT = THREE.RepeatWrapping;
        this.wallTextureLeft.repeat.set(844/1500, 844/1500 * 10/20);
        this.wallTextureLeft.offset.y = 844/1500 * 2.5/10;
        this.wallMaterialLeft = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTextureLeft});

        this.wallTextureRight = new THREE.TextureLoader().load("textures/wall.jpg");
        this.wallTextureRight.wrapS = THREE.RepeatWrapping;
        this.wallTextureRight.wrapT = THREE.RepeatWrapping;
        this.wallTextureRight.repeat.set(1, 844/1500 * 10/20);
        this.wallTextureRight.offset.y = 844/1500 * 2.5/10;
        this.wallTextureRight.offset.x = 1500/844 * 15/20;
        this.wallMaterialRight = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.wallTextureRight});

        this.floorTexture = new THREE.TextureLoader().load("textures/floor.webp");
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorTexture.repeat.set(1, 1);
        this.floorMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", shininess: 50, map:  this.floorTexture});

        this.ceilingTexture = new THREE.TextureLoader().load("textures/ceiling.jpg");
        this.ceilingTexture.wrapS = THREE.RepeatWrapping;
        this.ceilingTexture.wrapT = THREE.RepeatWrapping;
        this.ceilingTexture.repeat.set(2, 2);
        this.ceilingMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff", map:  this.ceilingTexture});

        // light related attributes
        this.spotLightOn = true;
        this.directionalLightOn = true;
        this.pointLightOn = true;
        this.ambientLightOn = true;
        this.spotLightBookOn = true;
        this.helpersOn = false;

        this.spotLight = null;
        this.directionalLight = null;
        this.pointLight = null;
        this.ambientLight = null;
        this.spotLightBook = null;

        this.pointLightHelper = null;
        this.directionalLightHelper = null;
        this.spotLightHelper = null;
        this.spotLightHelperBook = null;
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

        // add a spotlight for book
        this.spotLightBook = new THREE.SpotLight( 0xffffff, 100, 10, Math.PI/8, 0.8);
        this.spotLightBook.castShadow = true;
        this.spotLightBook.shadow.mapSize.width = 1024;
        this.spotLightBook.shadow.mapSize.height = 1024;
        this.spotLightBook.shadow.camera.near = 0.1;
        this.spotLightBook.shadow.camera.far = 30;
        this.spotLightBook.position.set( 8, 10, -8 );
        this.spotLightBook.target.position.set( 8, 0, -8 );
        this.app.scene.add( this.spotLightBook );

        this.spotLightHelperBook = new THREE.SpotLightHelper( this.spotLightBook );
        this.app.scene.add( this.spotLightHelperBook );
        this.spotLightHelperBook.visible = false;

        // add a directional light
        /*
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
        */
        this.directionalLight = new THREE.PointLight( 0xffffff, 0.3, 0, 0 );
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 30;
        this.directionalLight.position.set( 13, 7, 0);
        this.app.scene.add( this.directionalLight );

        this.directionalLightHelper = new THREE.PointLightHelper( this.directionalLight, 0.1 );
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
        //this.primitives.buildPlane(10,5,0,0,-Math.PI/2,0,20,10, this.wallMaterial); // front wall
        this.primitives.buildPlane(10,1.25,0,0,-Math.PI/2,0,20,2.5, this.wallMaterialBottom); // front wall bottom
        this.primitives.buildPlane(10,8.75,0,0,-Math.PI/2,0,20,2.5, this.wallMaterialTop); // front wall top
        this.primitives.buildPlane(10,5,-7.5,0,-Math.PI/2,0,5,5, this.wallMaterialLeft); // front wall left
        this.primitives.buildPlane(10,5,7.5,0,-Math.PI/2,0,5,5, this.wallMaterialRight); // front wall right
        this.primitives.buildPlane(-10,5,0,0,Math.PI/2,0,20,10, this.wallMaterial); // back wall

        this.primitives.buildPlane(0,10,0,Math.PI/2,0,0,20,20, this.ceilingMaterial); // ceiling

        this.table = new MyTable(this.primitives, this.nurbBuilder);

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

        this.painting2 = new MyPainting(this.primitives, 'textures/william.jpeg')
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

        this.newspaper = new MyNewspaper(this.nurbBuilder);
        this.newspaper.newspaperGroup.rotateX(Math.PI/2);
        this.newspaper.newspaperGroup.position.set(1.5, 3, -1);
        this.app.scene.add(this.newspaper.newspaperGroup);

        this.beetle = new MyBeetle(0.25);
        this.beetlePainting = new MyPainting(this.primitives, 'textures/wood.jpg')
        this.beetlePainting.paintingGroup.add(this.beetle.beetle);
        this.beetlePainting.paintingGroup.position.x = -9.99;
        this.beetlePainting.paintingGroup.position.y = 4;
        this.beetlePainting.paintingGroup.position.z = 0;
        this.beetlePainting.paintingGroup.rotation.y = Math.PI/2;
        this.beetlePainting.paintingGroup.scale.set(4, 1.5, 1);
        this.app.scene.add(this.beetlePainting.paintingGroup);

        this.chair1 = new MyChair(this.primitives);
        this.chair1.chairGroup.position.set(4.5, 0, 2.5);
        this.chair1.chairGroup.rotateY(Math.PI/2);
        this.app.scene.add(this.chair1.chairGroup);

        this.chair2 = new MyChair(this.primitives);
        this.chair2.chairGroup.position.set(4, 0, -2.5);
        this.chair2.chairGroup.rotateY(Math.PI/2 + Math.PI/8);
        this.app.scene.add(this.chair2.chairGroup);

        this.chair3 = new MyChair(this.primitives);
        this.chair3.chairGroup.position.set(-4, 0.95, 2.5);
        this.chair3.chairGroup.rotateY(-Math.PI/2);
        this.chair3.chairGroup.rotateX(Math.PI/2);
        this.app.scene.add(this.chair3.chairGroup);

        this.chair4 = new MyChair(this.primitives);
        this.chair4.chairGroup.rotateY(-Math.PI/2);
        this.chair4.chairGroup.rotateX(-Math.PI/6);
        this.chair4.chairGroup.position.set(-4.1, 0.4, -2.5);
        this.app.scene.add(this.chair4.chairGroup);

        this.door = new MyDoor(this.primitives);
        this.door.doorGroup.position.set(0, 0, 9.8);
        this.app.scene.add(this.door.doorGroup);

        this.littleTable = new MyLittleTable(this.primitives);
        this.littleTable.tableGroup.position.set(8.2, 0, -8);
        this.littleTable.tableGroup.scale.set(1.5, 1.5, 1.5);
        this.app.scene.add(this.littleTable.tableGroup);

        this.flowerJar = new MyFlowerJar(this.nurbBuilder);
        this.flowerJar.flowerJarGroup.position.set(9, 3.3, -9);
        this.flowerJar.flowerJarGroup.scale.set(0.5, 0.5, 0.5);
        this.app.scene.add(this.flowerJar.flowerJarGroup);

        this.book = new MyBook(this.primitives);
        this.book.bookGroup.position.set(8, 2.57, -8);
        this.app.scene.add(this.book.bookGroup);

        this.spring = new MySpring(30, 0.03);
        this.spring.spring.scale.set(0.25, 0.25, 0.25);
        this.spring.spring.rotateY(Math.PI/4);
        this.spring.spring.position.set(8.8, 2.82, -7.5);
        this.app.scene.add(this.spring.spring);

        this.partyHat = new MyPartyHat(this.primitives);
        this.partyHat.hat.position.set(8, 3.49, -8);
        this.app.scene.add(this.partyHat.hat);

        this.partyHatFloor = new MyPartyHat(this.primitives);
        this.partyHatFloor.hat.rotateY(Math.PI/4);
        this.partyHatFloor.hat.rotateX(Math.PI/2 + Math.PI/10);
        this.partyHatFloor.hat.position.set(-3, 0.15, 7);
        this.app.scene.add(this.partyHatFloor.hat);
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
     * toggles the book light
     */
    updateSpotLightBook() {
        this.spotLightBook.visible = this.spotLightBookOn
    }

    /**
     * toggles the helpers
     */
    updateHelpers() {
        this.pointLightHelper.visible = this.helpersOn
        this.directionalLightHelper.visible = this.helpersOn
        this.spotLightHelper.visible = this.helpersOn
        this.spotLightHelperBook.visible = this.helpersOn
    }

    /**
     * turn axis on and off
     */
    toggleAxis() {
        this.axis.visible = !this.axis.visible
    }
}

export { MyContents };