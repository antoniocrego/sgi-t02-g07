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
        const videoFolder = this.datgui.addFolder('Video Textures');
        videoFolder.add(this.contents, 'pauseVideo').name("Pause All").onChange(() => { this.contents.updateVideos() });
        videoFolder.add(this.contents, 'muteVideo').name("Mute All").onChange(() => { this.contents.updateVideos() });
        videoFolder.add(this.contents, 'loopVideo').name("Loop All").onChange(() => { this.contents.updateVideos() });
        videoFolder.open()
        this.datgui.add(this.contents, 'lightHelper').name("Toggle Light Helpers").onChange(() => { this.contents.toggleLightHelpers() });
    }

    /**
     * Add camera gui
     */
    addCameraGUI(){
        this.datgui.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active Camera");
    }
}

export { MyGuiInterface };