import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
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
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)

        console.log("globals:")
        const colors = data.options.background
        this.app.scene.background = new THREE.Color(...colors)
        const ambient = data.options.ambient
        this.app.scene.add(new THREE.AmbientLight(new THREE.Color(...ambient)))

        console.log("fog:")
        const fogColors = data.fog.color
        const fogNear = data.fog.near
        const fogFar = data.fog.far
        this.app.scene.fog = new THREE.Fog(new THREE.Color(...fogColors), fogNear, fogFar)

        console.log("textures:")
        const textures = {}
        for (var key in data.textures) {
            let texture = data.textures[key]
            textures[key] = new THREE.TextureLoader().load(texture.file)
            this.output(texture, 1)
        }

        console.log("materials:")
        const materials = {}
        for (var key in data.materials) {
            let material = data.materials[key]

            let color = material.color !== undefined ? new THREE.Color(...material.color) : new THREE.Color(0,0,0)
            let emissive = material.emissive !== undefined ? new THREE.Color(...material.emissive) : new THREE.Color(0,0,0)
            let specular = material.specular !== undefined ? new THREE.Color(...material.specular) : new THREE.Color(0,0,0)
            let shininess = material.shininess !== undefined ? material.shininess : 30
            let texLengthS = material.texture !== undefined ? material.texlength_s : 1
            let texLengthT = material.texture !== undefined ? material.texlength_t : 1
            let textureRef = material.textureref !== undefined ? material.textureref : null
            if (textureRef !== null) textures[textureRef].repeat.set(texLengthS, texLengthT)
            
            materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess});
            if (textureRef !== null){
                console.log("textureRef: " + textureRef)
                materials[key].map = textures[textureRef]
            }

            this.output(material, 1)
        }

        console.log("cameras:")
        const aspectRatio = window.innerWidth / window.innerHeight
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            if (key == "initial"){
                this.app.setActiveCamera(key)
                continue;
            }
            let cam = null;
            if (camera.type === "perspective") {
                cam = new THREE.PerspectiveCamera(camera.angle, aspectRatio, camera.near, camera.far)
            }
            else if (camera.type === "orthogonal") {
                cam = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            }
            cam.position.set(new THREE.Vector3(...camera.location))
            cam.lookAt(new THREE.Vector3(...camera.target))
            this.app.cameras[key] = cam
            this.output(camera, 1)
        }


        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    update() {
        
    }
}

export { MyContents };
