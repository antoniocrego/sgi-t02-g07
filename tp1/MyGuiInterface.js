import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {        
        const otherFolder = this.datgui.addFolder('Other')
        otherFolder.add(this.contents, 'axisToggle').name("Toggle Axis").onChange( () => { this.contents.toggleAxis() } );
        otherFolder.open()

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front', 'Isometric', 'Sitting'] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // adds a folder to the gui interface for the lights
        const lightsFolder = this.datgui.addFolder('Lights')
        lightsFolder.add(this.contents, 'spotLightOn').name("Cake Spot Light Enabled").onChange( () => { this.contents.updateSpotLight() } );
        lightsFolder.add(this.contents, 'pointLightOn').name("Cande Point Light Enabled").onChange( () => { this.contents.updatePointLight() } );
        lightsFolder.add(this.contents, 'directionalLightOn').name("Window Point Light Enabled").onChange( () => { this.contents.updateDirectionalLight() } );
        lightsFolder.add(this.contents, 'ambientLightOn').name("Ambient Light Enabled").onChange( () => { this.contents.updateAmbientLight() } );
        lightsFolder.add(this.contents, 'spotLightBookOn').name("Book Spotlight Enabled").onChange( () => { this.contents.updateSpotLightBook() } );
        lightsFolder.add(this.contents, 'helpersOn').name("Helpers Enabled").onChange( () => { this.contents.updateHelpers() } );
        lightsFolder.open()
    }
}

export { MyGuiInterface };