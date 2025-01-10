import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTrack } from "./GameElements/MyTrack.js";
import { MyBalloon } from "./GameElements/MyBalloon.js";
import { MyPowerUp } from "./GameElements/MyPowerUp.js";
import { MyRoute } from "./GameElements/MyRoute.js";
import { MyReader } from "./GameElements/MyReader.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.axis = null;

    // Game elements
    const reader = new MyReader(app);

    this.track = new MyTrack(app, reader.myroute);
    this.balloon = new MyBalloon(app, new THREE.Vector3(0, 2, 0), "#00ff00", 0);
    this.powerups = reader.buildPowerUps();
    this.obstacle = reader.buildObstacles();
    this.powerupsBBoxes = [];
    this.powerups.forEach(element => this.powerupsBBoxes.push(element.bbox));
    this.obstacleBBoxes = [];
    this.obstacle.forEach(element => this.obstacleBBoxes.push(element.bbox));

    this.raycaster = new THREE.Raycaster()
    this.raycaster.near = 1
    this.raycaster.far = 20
    this.raycaster.layers.enableAll()
    this.raycaster.layers.set(1)

    this.pointer = new THREE.Vector2()
    this.intersectedObj = null
    this.pickingColor = "0x00ff00"

    document.addEventListener(
      // "pointermove",
      // "mousemove",
      "pointerdown",
      // list of events: https://developer.mozilla.org/en-US/docs/Web/API/Element
      this.onPointerMove.bind(this)
    ); 
    
  }

  /**
   * initializes the contents
   */

  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    this.track.buildCurve();
    this.balloon.init();
    this.balloon.behavior();
    this.buildPlane();

    this.colorList = ["#ff3636","#1adbbe","#e81ac6"]
    this.buildBalloonColumn(0);

  }

  buildBalloonColumn(layer, posz) {
    for (let i = 0; i < 3; i++) {
        let balloon = new MyBalloon(this.app, new THREE.Vector3(0, 2, -7 -3*i), this.colorList[i], 1);
        balloon.init();
    }
  }

  buildPlane() {
    let plane = new THREE.PlaneGeometry(5, 10);
    this.planeMesh = new THREE.Mesh(plane, this.planeMaterial);
    this.planeMesh.name = "myplane"
    this.planeMesh.rotation.x = -Math.PI / 2;
    this.planeMesh.position.x = 0;
    this.planeMesh.position.y = 0;
    this.planeMesh.position.z = -10;
    this.app.scene.add(this.planeMesh);   // plane is not in any layer
  }

  onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    //of the screen is the origin
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

    //2. set the picking ray from the camera position and mouse coordinates
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

    //3. compute intersections
    var intersects = this.raycaster.intersectObjects(this.app.scene.children);

    this.pickingHelper(intersects)

    this.transverseRaycastProperties(intersects)
    

  }

  pickingHelper(intersects) {
    if (intersects.length > 0) {
        const obj = intersects[0].object
        this.balloon.updateColor(obj.material.color.getHex())
        this.changeColorOfFirstPickedObj(obj)
    } else {
        this.restoreColorOfFirstPickedObj()
    }
  }


  /**
   * Print to console information about the intersected objects
   */
  transverseRaycastProperties(intersects) {
      for (var i = 0; i < intersects.length; i++) {

          console.log(intersects[i]);

          /*
          An intersection has the following properties :
              - object : intersected object (THREE.Mesh)
              - distance : distance from camera to intersection (number)
              - face : intersected face (THREE.Face3)
              - faceIndex : intersected face index (number)
              - point : intersection point (THREE.Vector3)
              - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
      }
  }

  changeColorOfFirstPickedObj(obj) {
    if (this.lastPickedObj != obj) {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = obj;
        this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
        this.lastPickedObj.material.color.setHex(this.pickingColor);
    }
  }

  /*
  * Restore the original color of the intersected object
  *
  */
  restoreColorOfFirstPickedObj() {
      if (this.lastPickedObj)
          this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
      this.lastPickedObj = null;
  }

  checkCollisions() {
    // Check powerup collision
    for(const bbox of this.powerupsBBoxes) {
      if (bbox.intersectsBox(this.balloon.bbox))
        console.log("powerup collision")
    }

    for(const bbox of this.obstacleBBoxes) {
      if (bbox.intersectsBox(this.balloon.bbox))
        console.log("obstacle collision")
    }
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    this.balloon.update();
    this.balloon.shadowE.position.y = 0.11 * this.track.width;
    this.checkCollisions();
  }
}

export { MyContents };
