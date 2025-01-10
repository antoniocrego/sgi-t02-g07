import * as THREE from "three";
import { MyRoute } from "./MyRoute.js";
import { MyPowerUp } from "./MyPowerUp.js";
import { MyObstacle } from "./MyObstacle.js";

class MyReader {

    constructor(app) {
        this.app = app
        this.myroute = new THREE.CatmullRomCurve3(MyRoute.path);
    }

    buildPowerUps() {
        const points = MyRoute.powerUpPoints;
        const powerups = [];

        for(const point of points) {
            powerups.push(new MyPowerUp(this.app, point));
        }

        return powerups;
    }

    buildObstacles() {
        const obs = MyRoute.obstaclePoints;
        const obstacles = [];

        for(const point of obs) {
            obstacles.push(new MyObstacle(this.app, point));
        }

        return obstacles;
    }
}

export{ MyReader };