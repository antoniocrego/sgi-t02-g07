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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // adds features for spotlight
        const spotlightFolder = this.datgui.addFolder('Spotlight')
        spotlightFolder.addColor( this.contents, 'color' ).name("color").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'intensity', 0, 40).name("intensity (cd)").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'distance', 0, 20).name("distance").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'angle', 0, 90).name("angle").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'penumbra', 0, 1).name("penumbra").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'decay', 0, 20).name("decay").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'cameraX', -20, 20).name("x coord").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'cameraY', -20, 20).name("y coord").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'targetX', -20, 20).name("target x").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.add(this.contents, 'targetY', -20, 20).name("target y").onChange( () => { this.contents.updateSpotlight() } );
        spotlightFolder.open()
    }
}

export { MyGuiInterface };