import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/demo/demo.json");
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
    }

    /**
     * Called when the scene JSON file load is completed
     * @param {Object} data with the entire scene object
     */
    onSceneLoaded(data) {
        console.info("YASF loaded.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    printYASF(data, indent = '') {
        for (let key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                console.log(`${indent}${key}:`);
                this.printYASF(data[key], indent + '\t');
            } else {
                console.log(`${indent}${key}: ${data[key]}`);
            }
        }
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        const yasf = data.yasf

        console.log("globals:")
        const colors = yasf.globals.background
        this.app.scene.background = new THREE.Color(colors['r'], colors['g'], colors['b'])
        const ambient = yasf.globals.background
        this.app.scene.add(new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b'])))

        console.log("fog:")
        const fogColors = yasf.fog.color
        const fog = new THREE.Fog(new THREE.Color(fogColors['r'], fogColors['g'], fogColors['b']), yasf.fog.near, yasf.fog.far)
        this.app.scene.fog = fog
    }

    update() {
    }
}

export { MyContents };
