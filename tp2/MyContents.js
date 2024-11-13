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

    visitNode(node, currentNodeID, graph, cascadedMaterial = null){
        let obj = new THREE.Group()
        if (node.type === "node"){
            let materialToBeCascaded = cascadedMaterial
            if (node.materialref !== undefined){
                console.log("got a texture", node.materialref.materialId)
                materialToBeCascaded = this.materials[node.materialref.materialId]
            }
            for (const childKey in node.children){
                const child = node.children[childKey]
                let childObj = this.visitNode(child, childKey, graph, materialToBeCascaded)
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
                // if the child has not been completely visited yet, visit it
                // find the referenced node in the graph
                const referencedObject = graph[currentNodeID]
                obj = this.visitNode(referencedObject, currentNodeID, graph, cascadedMaterial)
                this.visitedNodes[currentNodeID] = obj
            }
            obj = this.visitedNodes[currentNodeID].clone()
        }
        else if (node.type === "rectangle"){
            const length = Math.abs(node.xy2.x - node.xy1.x)
            const height = Math.abs(node.xy2.y - node.xy1.y)
            const geometry = new THREE.PlaneGeometry(length, height)
            geometry.translate((node.xy2.x + node.xy1.x) / 2, (node.xy2.y + node.xy1.y) / 2, 0)
            console.log(cascadedMaterial)
            obj = new THREE.Mesh(geometry, cascadedMaterial)
        }
        else{
            console.log("TODO!")
        }
        return obj
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

        console.log("textures:")
        const textures = {}
        for (let key in yasf.textures) {
            let texture = yasf.textures[key]
            textures[key] = new THREE.TextureLoader().load(texture.filepath)
        }

        console.log("materials:")
        for (var key in yasf.materials) {
            let material = yasf.materials[key]
            // should we worry about stuff being undefined?
            let color = material.color !== undefined ? new THREE.Color(material.color['r'], material.color['g'], material.color['b']) : new THREE.Color(0,0,0)
            let emissive = material.emissive !== undefined ? new THREE.Color(material.emissive['r'], material.emissive['g'], material.emissive['b']) : new THREE.Color(0,0,0)
            let specular = material.specular !== undefined ? new THREE.Color(material.specular['r'], material.specular['g'], material.specular['b']) : new THREE.Color(0,0,0)
            let shininess = material.shininess !== undefined ? material.shininess : 30
            let texLengthS = material.texlength_s !== undefined ? material.texlength_s : 1
            let texLengthT = material.texlength_t !== undefined ? material.texlength_t : 1
            let twoSided = material.twosided !== undefined ? material.twosided : false
            let transparent = material.transparent !== undefined ? material.transparent : false
            let opacity = material.opacity !== undefined ? material.opacity : 1
            let textureRef = material.textureref !== undefined ? material.textureref : null
            if (textureRef !== null) textures[textureRef].repeat.set(texLengthS, texLengthT)
            
            this.materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess, side: twoSided ? THREE.DoubleSide : THREE.FrontSide, transparent: transparent, opacity: opacity});
            if (textureRef !== null){
                console.log("textureRef: " + textureRef)
                this.materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess, side: twoSided ? THREE.DoubleSide : THREE.FrontSide, transparent: transparent, opacity: opacity, map: textures[textureRef]});
            }
            else{
                this.materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess, side: twoSided ? THREE.DoubleSide : THREE.FrontSide, transparent: transparent, opacity: opacity});
            }
        }

        console.log("cameras:")
        const aspectRatio = window.innerWidth / window.innerHeight
        for (var key in yasf.cameras) {
            let camera = yasf.cameras[key]
            if (key == "initial"){
                //this.app.setActiveCamera(camera)
                continue;
            }
            let cam = null;
            if (camera.type === "perspective") {
                cam = new THREE.PerspectiveCamera(camera.angle, aspectRatio, camera.near, camera.far)
            }
            else if (camera.type === "orthogonal") {
                cam = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            }
            cam.position.set(new THREE.Vector3(camera.location['x'], camera.location['y'], camera.location['z']))
            cam.lookAt(new THREE.Vector3(camera.target['x'], camera.target['y'], camera.target['z']))
            this.app.cameras[key] = cam
        }

        console.log("graph:")
        const graph = yasf.graph
        const firstNodeID = graph.rootid
        const firstNode = graph[firstNodeID]
        const scene = this.visitNode(firstNode, firstNodeID, graph)
        this.app.scene.add(scene)
        console.log(scene)
        console.log(this.visitedNodes)
    }

    update() {
    }
}

export { MyContents };
