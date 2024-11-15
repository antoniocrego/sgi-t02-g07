import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { CascadedSettings } from './CascadedSettings.js';
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

        this.materials = {}
        this.visitedNodes = {}
        this.sceneGraph = new THREE.Group()

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

    /**
     * This function propagates a settings to a node and all its children, it is worth noting that this function is made for clones
     * @param {*} node the node upon which we are going to propagate a set of settings
     * @param {CascadedSettings} settings the settings to be propagated
     * @returns 
     */
    propagateSettings(node, settings){
        settings.checkForNewSettingsTHREE(node)
        if (settings.isCompletelyDifferent()){
            // every setting from this point on is already set by either the parent or default values
            // this because this code is run on clones, so at some point the parent will have overwritten the initial settings completely, and these have already been propagated
            // thus we no longer need to run this function on the children
            return
        }
        if (node instanceof THREE.Mesh){
            node.material = settings.material !== null ? settings.material : node.material
            node.castShadow = settings.castshadow
            node.receiveShadow = settings.receiveshadow
        }
        else{
            for (let i = 0; i < node.children.length; i++){
                this.propagateSettings(node.children[i], settings.copyWithSanityCheck()) // the class's sanity check values are kept so we can know when propagation is no longer worth it
            }
        }
    }

    visitNode(node, currentNodeID, graph, cascadedSettings){
        let obj = new THREE.Group()
        if (node.type === "node"){
            cascadedSettings.checkForNewSettings(node, this.materials)
            for (const childKey in node.children){
                const child = node.children[childKey]
                let childObj = this.visitNode(child, childKey, graph, cascadedSettings.copy())
                obj.add(childObj)
            }
            if (node.transforms !== undefined){
                for (let i = 0; i < node.transforms.length; i++){
                    const transform = node.transforms[i]
                    if (transform.type === "translate"){
                        obj.translateX(transform.amount.x)
                        obj.translateY(transform.amount.y)
                        obj.translateZ(transform.amount.z)
                    }
                    else if (transform.type === "rotate"){
                        obj.rotateX(transform.amount.x * Math.PI / 180)
                        obj.rotateY(transform.amount.y * Math.PI / 180)
                        obj.rotateZ(transform.amount.z * Math.PI / 180)
                    }
                    else if (transform.type === "scale"){
                        obj.scale.set(transform.amount.x, transform.amount.y, transform.amount.z)
                    }
                }
            }
        }
        else if (node.type === "noderef"){
            if (this.visitedNodes[currentNodeID] === undefined){
                // if the child's reference has not been completely visited yet, visit it
                // find the referenced node in the graph
                const referencedObject = graph[currentNodeID]
                obj = this.visitNode(referencedObject, currentNodeID, graph, new CascadedSettings()) // first time visiting a node, we should have 100% fresh settings so the stored version is not tainted by 'the first ancestor to call this node'
                this.visitedNodes[currentNodeID] = obj // we could clone here, but since we're going to clone again right after the result is about the same
            }
            // the child has already been created
            // we're going to clone it, but we need to propagate the current settings
            obj = this.visitedNodes[currentNodeID].clone()
            this.propagateSettings(obj, cascadedSettings.copy()) // not the first time visiting a node, just give it the current settings so it can propagate
            // TODO: ask if we should store a version that is 'untainted' and force a propagation to always occur, or if we should store a version that is 'tainted' and not propagate on the creation of the node
        }
        else if (node.type === "rectangle"){
            const length = Math.abs(node.xy2.x - node.xy1.x)
            const height = Math.abs(node.xy2.y - node.xy1.y)
            const geometry = new THREE.PlaneGeometry(length, height)
            geometry.translate((node.xy2.x + node.xy1.x) / 2, (node.xy2.y + node.xy1.y) / 2, 0)
            obj = new THREE.Mesh(geometry, cascadedSettings.material)
            obj.castShadow = cascadedSettings.castshadow
            obj.receiveShadow = cascadedSettings.receiveshadow
        }
        else if (node.type === "pointlight"){
            const color = new THREE.Color(node.color.r, node.color.g, node.color.b)
            let light = new THREE.PointLight(color, node.intensity, node.distance, node.decay)
            light.castShadow = node.castshadow
            light.position.set(node.position.x, node.position.y, node.position.z)
            light.visible = node.enabled
            obj.add(light)
            let lightHelper = new THREE.PointLightHelper(light, 1)
            lightHelper.visible = node.enabled
            obj.add(lightHelper)
        }
        else{
            console.log("TODO!")
        }
        return obj
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //TODO:
        // skybox
        // ask professor why .target does nothing
        // mipmaps for textures?
        // missing values errors for every non-optional?


        const yasf = data.yasf

        console.log("globals:")
        const colors = yasf.globals.background
        this.app.scene.background = new THREE.Color(colors['r'], colors['g'], colors['b'])
        const ambient = yasf.globals.ambient
        this.app.scene.add(new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b'])))

        console.log("fog:")
        const fogColors = yasf.fog.color
        const fog = new THREE.Fog(new THREE.Color(fogColors['r'], fogColors['g'], fogColors['b']), yasf.fog.near, yasf.fog.far)
        this.app.scene.fog = fog

        console.log("textures:")
        const textures = {}
        for (let key in yasf.textures) {
            let texture = yasf.textures[key]
            textures[key] = new THREE.TextureLoader().load(texture.filepath)
        }

        console.log("materials:")
        for (var key in yasf.materials) {
            let material = yasf.materials[key]

            let color = material.color !== undefined ? new THREE.Color(material.color['r'], material.color['g'], material.color['b']) : console.error(new Error("Material "+key+" color not defined"))
            let emissive = material.emissive !== undefined ? new THREE.Color(material.emissive['r'], material.emissive['g'], material.emissive['b']) : console.error(new Error("Material "+key+" emissive not defined"))
            let specular = material.specular !== undefined ? new THREE.Color(material.specular['r'], material.specular['g'], material.specular['b']) : console.error(new Error("Material "+key+" specular not defined"))
            let shininess = material.shininess !== undefined ? material.shininess : console.error(new Error("Material "+key+" shininess not defined"))
            let texLengthS = material.texlength_s !== undefined ? material.texlength_s : 1
            let texLengthT = material.texlength_t !== undefined ? material.texlength_t : 1
            let twoSided = material.twosided !== undefined ? material.twosided : false
            let transparent = material.transparent !== undefined ? material.transparent : console.error(new Error("Material "+key+" transparency not defined"))
            let opacity = material.opacity !== undefined ? material.opacity : console.error(new Error("Material "+key+" opacity not defined"))
            // need to do shading
            /*
            let shading = material.shading !== undefined ? material.shading : false
            shading = shading ? THREE.FlatShading : THREE.SmoothShading
            */
            let wireframe = material.wireframe !== undefined ? material.wireframe : false
            let bumpref = material.bumpref !== undefined ? material.bumpref : null
            if (bumpref !== null) textures[bumpref].repeat.set(texLengthS, texLengthT)
            let bumpscale = material.bumpscale !== undefined ? material.bumpscale : 1.0
            let specularref = material.specularref !== undefined ? material.specularref : null
            if (specularref !== null) textures[specularref].repeat.set(texLengthS, texLengthT)
            let textureRef = material.textureref !== undefined ? material.textureref : null
            if (textureRef !== null) textures[textureRef].repeat.set(texLengthS, texLengthT)
            
            this.materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess, side: twoSided ? THREE.DoubleSide : THREE.FrontSide, transparent: transparent, opacity: opacity, wireframe: wireframe, bumpScale: bumpscale});
            if (textureRef !== null) this.materials[key].map = textures[textureRef]
            if (bumpref !== null) this.materials[key].bumpMap = textures[bumpref]
            if (specularref !== null) this.materials[key].specularMap = textures[specularref]
        }

        console.log("cameras:")
        const aspectRatio = window.innerWidth / window.innerHeight
        for (var key in yasf.cameras) {
            let camera = yasf.cameras[key]
            if (key === "initial"){                
                continue;
            }
            let cam = null;
            if (camera.type === "perspective") {
                cam = new THREE.PerspectiveCamera(camera.angle, aspectRatio, camera.near, camera.far)
            }
            else if (camera.type === "orthogonal") {
                cam = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            }
            cam.position.set(camera.location.x, camera.location.y, camera.location.z)
            cam.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z)
        )
            this.app.cameras[key] = cam
        }
        this.app.setActiveCamera(yasf.cameras.initial)

        console.log("graph:")
        const graph = yasf.graph
        const firstNodeID = graph.rootid
        const firstNode = graph[firstNodeID]
        let cascadedSettings = new CascadedSettings()
        const scene = this.visitNode(firstNode, firstNodeID, graph, cascadedSettings)
        this.app.scene.add(scene)
        console.log(scene)
        console.log(this.visitedNodes)
    }

    update() {
    }
}

export { MyContents };