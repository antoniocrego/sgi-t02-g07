import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

class MyContents  {

    constructor(app) {
        this.app = app;
        this.axis = null;

        // Variables to hold the curves
        this.polyline = null;
        this.quadraticBezierCurve = null;
        this.cubicBezierCurve = null;
        this.catmullCurve = null;

        // Number of samples for curves
        this.numberOfSamples = 6;
    }

    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        // Hull material
        this.hullMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });

        this.recompute();
    }

    // Deletes and recreates all curves
    recompute() {
        if (this.polyline !== null) this.app.scene.remove(this.polyline);
        if (this.quadraticBezierCurve !== null) this.app.scene.remove(this.quadraticBezierCurve);
        if (this.cubicBezierCurve !== null) this.app.scene.remove(this.cubicBezierCurve);
        if (this.catmullCurve !== null) this.app.scene.remove(this.catmullCurve);

        this.initPolyline();
        this.initQuadraticBezierCurve();
        this.initCubicBezierCurve();
        this.initCatmullRomCurve();
    }

    // Polyline initialization
    initPolyline() {
        let points = [
            new THREE.Vector3(-0.6, -0.6, 0.0),
            new THREE.Vector3(0.6, -0.6, 0.0),
            new THREE.Vector3(0.6, 0.6, 0.0),
            new THREE.Vector3(-0.6, 0.6, 0.0),
            new THREE.Vector3(-0.8, 0.8, 0.2) // Fifth point for polyline
        ];

        let position = new THREE.Vector3(-4, 4, 0);
        this.drawHull(position, points);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.polyline = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
        this.polyline.position.set(position.x, position.y, position.z);
        this.app.scene.add(this.polyline);
    }

    // Quadratic Bézier Curve initialization
    initQuadraticBezierCurve() {
        let points = [
            new THREE.Vector3(-0.6, -0.6, 0.0),  // Start
            new THREE.Vector3(0, 0.6, 0.0),      // Control
            new THREE.Vector3(0.6, -0.6, 0.0)    // End
        ];

        let position = new THREE.Vector3(-2, 4, 0);
        this.drawHull(position, points);

        let curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
        let sampledPoints = curve.getPoints(this.numberOfSamples);
        this.quadraticBezierCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(sampledPoints),
            new THREE.LineBasicMaterial({ color: 0x00ff00 })
        );
        this.quadraticBezierCurve.position.set(position.x, position.y, position.z);
        this.app.scene.add(this.quadraticBezierCurve);
    }

    // Cubic Bézier Curve initialization
    initCubicBezierCurve() {
        let points = [
            new THREE.Vector3(-0.6, -0.6, 0.0), // Start
            new THREE.Vector3(-0.6, 0.6, 0.0),  // Control 1
            new THREE.Vector3(0.6, -0.6, 0.0),  // Control 2
            new THREE.Vector3(0.6, 0.6, 0.0)    // End
        ];

        let position = new THREE.Vector3(-4, 0, 0);
        this.drawHull(position, points);

        let curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);
        let sampledPoints = curve.getPoints(this.numberOfSamples);
        this.cubicBezierCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(sampledPoints),
            new THREE.LineBasicMaterial({ color: 0xff00ff })
        );
        this.cubicBezierCurve.position.set(position.x, position.y, position.z);
        this.app.scene.add(this.cubicBezierCurve);
    }

    // Catmull-Rom Curve initialization
    initCatmullRomCurve() {
        let points = [
            new THREE.Vector3(-0.6, 0, 0),
            new THREE.Vector3(-0.3, 0.6, 0.3),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.3, -0.6, 0.3),
            new THREE.Vector3(0.6, 0, 0),
            new THREE.Vector3(0.9, 0.6, 0.3),
            new THREE.Vector3(1.2, 0, 0)
        ];

        let position = new THREE.Vector3(0, 0, 0);
        this.drawHull(position, points);

        let curve = new THREE.CatmullRomCurve3(points);
        let sampledPoints = curve.getPoints(12);
        this.catmullCurve = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(sampledPoints),
            new THREE.LineBasicMaterial({ color: 0xffff00 })
        );
        this.catmullCurve.position.set(position.x, position.y, position.z);
        this.app.scene.add(this.catmullCurve);
    }

    // Draw convex hull lines
    drawHull(position, points) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let line = new THREE.Line(geometry, this.hullMaterial);
        line.position.set(position.x, position.y, position.z);
        this.app.scene.add(line);
    }

    update() {}
}

export { MyContents };
