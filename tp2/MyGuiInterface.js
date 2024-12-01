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
        this.app.gui = this
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
        this.datgui.add(this.contents, 'wireframeMode').name("Display Wireframes").onChange(() => { this.contents.setWireframes() });
        this.datgui.add(this.contents, 'axisToggle').name("Toggle Axis").onChange(() => { this.contents.toggleAxis() });
        const videoFolder = this.datgui.addFolder('Video Textures');
        videoFolder.add(this.contents, 'pauseVideo').name("Pause All").onChange(() => { this.contents.updateVideos() });
        videoFolder.add(this.contents, 'muteVideo').name("Mute All").onChange(() => { this.contents.updateVideos() });
        videoFolder.add(this.contents, 'loopVideo').name("Loop All").onChange(() => { this.contents.updateVideos() });
        videoFolder.open()
    }

    /**
     * Add camera gui
     */
    addCameraGUI(){
        this.datgui.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active Camera");
    }

    /**
     * Add lights gui
     */
    addLightsGUI(){
        const lightFolder = this.datgui.addFolder('Lights');
        for (const index in this.contents.lightIDs){
            const light = this.contents.lightIDs[index]
            const localFolder = lightFolder.addFolder(light.name)
            const lightHelper = this.contents.lightHelpers[index]
            localFolder.add(lightHelper, 'visible').name("Helper").onChange((value) => { lightHelper.visible = value; });
            localFolder.add(light, 'visible').name("Enabled").onChange((value) => { light.visible = value; });
            localFolder.add(light, 'intensity', 0, 50).name("Intensity").onChange((value) => { light.intensity = value; });
            localFolder.addColor(light, 'color').name("Color").onChange((value) => { light.color.set(value); });
            if (light.type === "SpotLight"){
                localFolder.add(light, 'angle', 0, 90).name("Angle").onChange((value) => { light.angle = value*Math.PI/180; });
                localFolder.add(light, 'penumbra', 0, 1).name("Penumbra").onChange((value) => { light.penumbra = value; });
                localFolder.add(light, 'decay', 0, 50).name("Decay").onChange((value) => { light.decay = value; });
                localFolder.add(light, 'distance', 0, 1000).name("Distance").onChange((value) => { light.distance = value; });
            }
            else if (light.type === "PointLight"){
                localFolder.add(light, 'decay', 0, 50).name("Decay").onChange((value) => { light.decay = value; });
                localFolder.add(light, 'distance', 0, 1000).name("Distance").onChange((value) => { light.distance = value; });
            }
            localFolder.close()
        }
        lightFolder.open()
    }
}

export { MyGuiInterface };