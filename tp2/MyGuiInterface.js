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
        lightFolder.add(this.contents, 'lightHelper').name("Toggle Light Helpers").onChange(() => { this.contents.toggleLightHelpers() });
        for (const index in this.contents.lightIDs){
            const light = this.contents.lightIDs[index]
            const name = "Light " + index + " - " + light.name + " - " + light.type
            lightFolder.add(light, 'visible').name(name).onChange((value) => { light.visible = value; });
        }
        lightFolder.open()
    }
}

export { MyGuiInterface };