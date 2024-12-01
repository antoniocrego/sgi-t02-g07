import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { CascadedSettings } from './CascadedSettings.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { YASFValidator } from './YASFValidator.js';
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

        // video stuff
        this.usedVideos = new Array()
        this.videoTextures = {}
        this.pauseVideo = false
        this.muteVideo = true
        this.loopVideo = true

        this.wireframeMode = false

        this.primitives = ["rectangle", "triangle", "box", "cylinder", "sphere", "nurbs", "polygon"]
        this.lights = ["pointlight", "directionallight", "spotlight"]

        this.lightIDs = []
        this.lightHelpers = []
        this.lightHelper = true

        this.axisToggle = true

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
     * This function toggles the light visibility
     */
    toggleLight(light) {
        if (light.visible === undefined) light.visible = light.enabled
        light.visible = !light.visible
    }

    /**
     * This function toggles the axis visibility
     */
    toggleAxis() { 
        this.axis.visible = !this.axis.visible
    }

    /**
     * This function updates the video textures based on the current settings
    */
    updateVideos(){
        for (let i = 0; i < this.usedVideos.length; i++){
            const key = this.usedVideos[i]
            const video = this.videoTextures[key]
            this.pauseVideo ? video.pause() : video.play()
            video.muted = this.muteVideo
            video.loop = this.loopVideo
        }
    }

    /**
     * This function updates all materials to the current GUI wireframe flag
     */
    setWireframes(){
        for (const materialKey in this.materials){
            let material = this.materials[materialKey]
            material.wireframe = this.wireframeMode
        }
    }

    /**
     * This function enables or disables the helper objects for the lights
     */
    toggleLightHelpers(){
        for (let i = 0; i < this.lightHelpers.length; i++){
            this.lightHelpers[i].visible = !this.lightHelpers[i].visible
        }
    }

    /**
     * This function loads the 'global' block settings
     * @param {*} yasf the yasf object
     * @returns true if the globals were loaded successfully, false otherwise
     */
    loadGlobals(yasf){
        if (YASFValidator.validateGlobals(yasf) === false) return false;
        const globals = yasf.globals

        const colors = globals.background
        this.app.scene.background = new THREE.Color(colors['r'], colors['g'], colors['b'])
        const ambient = globals.ambient
        this.app.scene.add(new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b'])))

        const fogColors = globals.fog.color
        const fog = new THREE.Fog(new THREE.Color(fogColors['r'], fogColors['g'], fogColors['b']), globals.fog.near, globals.fog.far)
        this.app.scene.fog = fog

        const skybox = globals.skybox
        let box = new THREE.BoxGeometry(skybox.size.x, skybox.size.y, skybox.size.z)
        let materials = []
        const emissive = new THREE.Color(skybox.emissive.r, skybox.emissive.g, skybox.emissive.b)
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.front), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.back), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.up), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.down), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.left), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        materials.push(new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(skybox.right), side: THREE.BackSide, emissive: emissive, emissiveIntensity: skybox.intensity}))
        let sky = new THREE.Mesh(box, materials)
        sky.position.set(skybox.center.x, skybox.center.y, skybox.center.z)
        this.app.scene.add(sky)

        return true;
    }

    /**
     * This function loads the cameras from the yasf object
     * @param {*} yasf the yasf object
     * @returns true if the cameras were loaded successfully, false otherwise
     */
    buildCameras(yasf){
        if (yasf.cameras === undefined){
            console.error(new Error("YASF Structure Error: 'cameras' block not defined"));
            return false;
        }
        const aspectRatio = window.innerWidth / window.innerHeight
        let validated = true;
        for (var key in yasf.cameras) {
            let camera = yasf.cameras[key]
            if (key === "initial"){                
                continue;
            }
            validated &&= YASFValidator.validateCamera(key, camera)
            if (validated === false) continue;
            let cam = null;
            if (camera.type === "perspective") {
                cam = new THREE.PerspectiveCamera(camera.angle, aspectRatio, camera.near, camera.far)
            }
            else if (camera.type === "orthogonal") {
                cam = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            }
            cam.position.set(camera.location.x, camera.location.y, camera.location.z)
            cam.lookAt(new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z))
            this.app.cameras[key] = cam
        }
        if (yasf.cameras.initial === undefined){
            console.error(new Error("YASF Structure Error: 'initial' camera not defined"));
            return false;
        }
        if (validated === true){
            this.app.setActiveCamera(yasf.cameras.initial)
            this.app.gui.addCameraGUI()
        }
        return validated;
    }

    /**
     * This function loads the textures from the yasf object
     * @param {*} yasf the yasf object
     * @returns the textures object or null if an error occurred
     */
    buildTextures(yasf){
        const textures = {}
        let totalErr = 0;
        if (yasf.textures === undefined){
            console.error(new Error("YASF Structure Error: 'textures' block not defined"));
            return null;
        }
        for (let key in yasf.textures) {
            let texture = yasf.textures[key]
            if (texture.filepath === undefined){
                console.error(new Error("YASF Structure Error: Texture "+key+" 'filepath' entry not defined"));
                totalErr+=1;
                continue;
            }
            if (!texture.isVideo){
                let tex = new THREE.TextureLoader().load(texture.filepath);
                let err = 0;
                let ranOnce = false;
                tex.generateMipmaps = false;
                for (let i=0; i<=7; i++){
                    ranOnce = true;
                    let mipKey = 'mipmap' + i;
                    let mipmap = texture[mipKey];
                    if (mipmap === undefined){
                        err = 1;
                        continue;
                    }
                    else if (err === 1){
                        console.error(new Error("YASF Structure Error: Expected mipmap " + (i-1) + " to be defined for texture "+key+"."))
                        totalErr+=1;
                    }
                    new THREE.TextureLoader().load(mipmap, function(mipmapTex){
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        ctx.scale(1,1);

                        const img = mipmapTex.image;
                        canvas.width = img.width;
                        canvas.height = img.height;

                        ctx.drawImage(img, 0, 0)

                        tex.mipmaps[i] = canvas;
                    }, undefined, function(err){
                        console.error(new Error("Mipmap Error: Failed to load mipmap "+i+" for texture "+key+"."));
                        // i don't think this is a fatal error, so we're going to continue
                    });
                    tex.needsUpdate = true;
                }
                if (!ranOnce) texture.generateMipmaps = true; // automatic mipmaps when there are none
                textures[key] = tex;
            }
            else{
                let videoHTML = document.createElement('video')
                videoHTML.src = texture.filepath
                textures[key] = new THREE.VideoTexture(videoHTML)
                this.videoTextures[key] = videoHTML
            }
        }
        if (totalErr > 0) return null;
        return textures
    }

    /**
     * This function builds the materials from the yasf object
     * @param {*} yasf the yasf object
     * @returns false if an error occurred, true otherwise
     */
    buildMaterials(yasf, textures){
        if (yasf.materials === undefined){
            console.error(new Error("YASF Structure Error: 'materials' block not defined"));
            return false;
        }
        let validated = true;
        for (var key in yasf.materials) {
            let material = yasf.materials[key]
            validated &= YASFValidator.validateMaterial(yasf, key, material)
            if (validated === false) continue;

            let color = new THREE.Color(material.color['r'], material.color['g'], material.color['b']);
            let emissive = new THREE.Color(material.emissive['r'], material.emissive['g'], material.emissive['b'])
            let specular = new THREE.Color(material.specular['r'], material.specular['g'], material.specular['b'])
            let twoSided = material.twosided === true ? THREE.DoubleSide : THREE.FrontSide
        
            let localMaterial = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: material.shininess, side: twoSided, transparent: material.transparent, opacity: material.opacity, wireframe: material.wireframe, bumpScale: material.bumpscale, flatShading: material.shading});
            
            let textureRef = material.textureref === "null" ? null : material.textureref
            if (textureRef !== null){
                let texCopy = textures[textureRef] // this one probably can't be a clone so we can later reference all of the occurences of this texture to tinker with the video
                texCopy.repeat.set(material.texlength_s, material.texlength_t)
                localMaterial.map = texCopy
                if (textures[textureRef] instanceof THREE.VideoTexture){
                    this.videoTextures[key] = this.videoTextures[textureRef]
                    delete this.videoTextures[textureRef]
                }
            }

            let bumpref = material.bumpref === "null" ? null : material.bumpref
            if (bumpref !== null){
                let texCopy = textures[bumpref].clone()
                texCopy.repeat.set(material.texlength_s, material.texlength_t)
                localMaterial.bumpMap = textures[bumpref]
            }

            let specularref = material.specularref === "null" ? null : material.specularref
            if (specularref !== null){
                let texCopy = textures[specularref].clone()
                texCopy.repeat.set(material.texlength_s, material.texlength_t)
                localMaterial.specularMap = textures[specularref]
            }

            this.materials[key] = localMaterial
        }
        return validated;
    }

    /**
     * This function builds a light object based on the given light node
     * @param {*} light the light node
     * @returns the light object
    */
    buildLight(light){
        let obj = null
        if (YASFValidator.validateLight(light) === false) return null;
        const color = new THREE.Color(light.color.r, light.color.g, light.color.b)
        let helper = null
        switch(light.type){
            case "pointlight":
                obj = new THREE.PointLight(color, light.intensity, light.distance, light.decay)
                helper = new THREE.PointLightHelper(obj, 1)
                break;
            case "directionallight":
                obj = new THREE.DirectionalLight(color, light.intensity)
                obj.shadow.camera.left = light.shadowleft
                obj.shadow.camera.right = light.shadowright
                obj.shadow.camera.top = light.shadowtop
                obj.shadow.camera.bottom = light.shadowbottom
                helper = new THREE.DirectionalLightHelper(obj, 1)
                break;
            case "spotlight":
                const angle = light.angle * Math.PI / 180
                obj = new THREE.SpotLight(color, light.intensity, light.distance, angle, light.penumbra, light.decay)
                obj.target.position.set(light.target.x, light.target.y, light.target.z)
                helper = new THREE.SpotLightHelper(obj, 1)
                break;
        }
        obj.visible = light.enabled
        obj.castShadow = light.castshadow
        obj.shadow.mapSize.width = light.shadowmapsize
        obj.shadow.mapSize.height = light.shadowmapsize
        obj.shadow.camera.far = light.shadowfar
        obj.position.set(light.position.x, light.position.y, light.position.z)
        this.lightIDs.push(light)
        this.lightHelpers.push(helper)
        this.app.scene.add(helper)
        return obj;
    }

    /**
     * This function builds a primitive THREE.JS object based on the given primitive node
     * @param {*} primitive the primitive node
     * @param {CascadedSettings} cascadedSettings the settings to be applied to the primitive from the parent, if any
     * @returns the primitive object
     */
    buildPrimitive(primitive, cascadedSettings){
        let obj = null
        let geometry = null
        let material = cascadedSettings.material !== null ? cascadedSettings.material : null;
        if (YASFValidator.validatePrimitive(primitive) === false) return null;
        switch(primitive.type){
            case "rectangle":
                const length = Math.abs(primitive.xy2.x - primitive.xy1.x)
                const height = Math.abs(primitive.xy2.y - primitive.xy1.y)
                const partsX = primitive.parts_x
                const partsY = primitive.parts_y
                geometry = new THREE.PlaneGeometry(length, height, partsX, partsY)
                geometry.translate((primitive.xy2.x + primitive.xy1.x) / 2, (primitive.xy2.y + primitive.xy1.y) / 2, 0)
                break;
            case "triangle":
                const verticeArray = new Float32Array([
                    primitive.xyz1.x, primitive.xyz1.y, primitive.xyz1.z,
                    primitive.xyz2.x, primitive.xyz2.y, primitive.xyz2.z,
                    primitive.xyz3.x, primitive.xyz3.y, primitive.xyz3.z
                ]);
                geometry = new THREE.BufferGeometry()
                geometry.setAttribute('position', new THREE.BufferAttribute(verticeArray, 3))
                geometry.computeVertexNormals()

                const uvArray = new Float32Array([
                    0, 0,
                    1, 0,
                    0, 1
                ]);
                geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2))

                break;
            case "box":
                const boxWidth = Math.abs(primitive.xyz2.x - primitive.xyz1.x)
                const boxHeight = Math.abs(primitive.xyz2.y - primitive.xyz1.y)
                const boxDepth = Math.abs(primitive.xyz2.z - primitive.xyz1.z)
                const boxPartsX = primitive.parts_x
                const boxPartsY = primitive.parts_y
                const boxPartsZ = primitive.parts_z
                geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, boxPartsX, boxPartsY, boxPartsZ)
                break;
            case "cylinder":
                const cylinderOpenEnded = primitive.capsclose
                const cylinderThetaStart = primitive.thetastart * Math.PI / 180
                const cylinderThetaLength = primitive.thetalength * Math.PI / 180
                geometry = new THREE.CylinderGeometry(primitive.top, primitive.base, primitive.height, primitive.slices, primitive.stacks, cylinderOpenEnded, cylinderThetaStart, cylinderThetaLength)
                break;
            case "sphere":
                const spherePhiStart = primitive.phistart * Math.PI / 180
                const spherePhiLength = primitive.philength * Math.PI / 180
                const sphereThetaStart = primitive.thetastart * Math.PI / 180
                const sphereThetaLength = primitive.thetalength * Math.PI / 180
                geometry = new THREE.SphereGeometry(primitive.radius, primitive.slices, primitive.stacks, spherePhiStart, spherePhiLength, sphereThetaStart, sphereThetaLength)
                break;
            case "nurbs":
                const controlPoints = []
                for (let i = 0; i < primitive.degree_u + 1; i++){
                    let row = []
                    for (let j = 0; j < primitive.degree_v + 1; j++){
                        const point = primitive.controlpoints[i * (primitive.degree_v + 1) + j]
                        row.push([point.x, point.y, point.z, 1])
                    }
                    controlPoints.push(row)
                }
                geometry = MyNurbsBuilder.build(controlPoints, primitive.degree_u, primitive.degree_v, primitive.parts_u, primitive.parts_v);
                break;
            case "polygon":
                geometry = new THREE.BufferGeometry();
                const positions = [];
                const colors = [];
                const indices = [];

                const centerColor = new THREE.Color(primitive.color_c.r, primitive.color_c.g, primitive.color_c.b);
                const edgeColor = new THREE.Color(primitive.color_p.r, primitive.color_p.g, primitive.color_p.b);

                const stacks = primitive.stacks;
                const slices = primitive.slices;
                const radius = primitive.radius;

                // Calculate vertices and colors
                for (let i = 0; i <= stacks; i++) {
                const stackRatio = i / stacks;
                const currentRadius = radius * stackRatio;

                    for (let j = 0; j <= slices; j++) {
                        const angle = (j / slices) * Math.PI * 2;
                        const x = currentRadius * Math.cos(angle);
                        const y = currentRadius * Math.sin(angle);

                        // Position
                        positions.push(x, y, 0);

                        // Color interpolation
                        const color = centerColor.clone().lerp(edgeColor, stackRatio);
                        colors.push(color.r, color.g, color.b);
                    }
                }

                // Generate indices for each quadrilateral (as two triangles)
                for (let i = 0; i < stacks; i++) {
                    for (let j = 0; j < slices; j++) {
                    const first = i * (slices + 1) + j;
                    const second = first + slices + 1;
                
                    // First triangle of the quadrilateral
                    indices.push(first, second, first + 1);
                
                    // Second triangle of the quadrilateral
                    indices.push(second, second + 1, first + 1);
                    }
                }

                // Assign positions and colors to geometry
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();

                // Material with vertex colors
                material = new THREE.MeshLambertMaterial({ vertexColors: true });
                break;
        }
        // inherited settings
        obj = new THREE.Mesh(geometry, material)
        obj.castShadow = cascadedSettings.propagatedCastShadow
        obj.receiveShadow = cascadedSettings.propagatedReceiveShadow
        return obj
    }

    /**
     * This function propagates settings to a node and all its children, it is worth noting that this function is made for clones
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
            if (!(node.castShadow !== undefined && node.castShadow === true)){
                node.castShadow = settings.propagatedCastShadow
            }
            if (!(node.receiveShadow !== undefined && node.receiveShadow === true)){
                node.receiveShadow = settings.propagatedReceiveShadow
            }
        }
        else{
            for (let i = 0; i < node.children.length; i++){
                this.propagateSettings(node.children[i], settings.copyWithSanityCheck()) // the class's sanity check values are kept so we can know when propagation is no longer worth it
            }
        }
    }

    /**
     * This function visits a node in the scene graph and builds the corresponding THREE.JS object, it automatically visits a node's children, causing a recursive descent in the scene graph
     * @param {*} node the node to be visited
     * @param {*} graph the scene graph
     * @param {CascadedSettings} cascadedSettings the settings to be applied to the node and its children
     * @returns the THREE.JS object corresponding to the node
     */
    visitNode(node, graph, cascadedSettings){
        let obj = new THREE.Group()
        if (node.type === undefined){
            console.error(new Error("YASF Graph Error: Node 'type' not defined"))
        }
        if (node.type === "node"){
            cascadedSettings.checkForNewSettings(node, this.materials, this.usedVideos)
            for (const childKey in node.children){
                const child = node.children[childKey]
                if (childKey === "nodesList" || childKey === "lodsList"){
                    for (const ref in child){
                        const refKey = child[ref]
                        if (this.visitedNodes[refKey] === undefined){
                            // if the child's reference has not been completely visited yet, visit it
                            // find the referenced node in the graph
                            const referencedObject = graph[refKey]
                            if (referencedObject === undefined){
                                console.error(new Error("YASF Graph Error: Referenced node "+refKey+" not found in graph"))
                                continue;
                            }
                            this.visitedNodes[refKey] = this.visitNode(referencedObject, graph, new CascadedSettings()) // first time visiting a node, we should have 100% fresh settings so the stored version is not tainted by 'the first ancestor to call this node'
                        }
                        // the child has already been created
                        // we're going to clone it, but we need to propagate the current settings
                        let referenceCopy = this.visitedNodes[refKey].clone()
                        this.propagateSettings(referenceCopy, cascadedSettings.copy()) // not the first time visiting a node, just give it the current settings so it can propagate
                        obj.add(referenceCopy)
                    }
                }
                else{
                    let childObj = this.visitNode(child, graph, cascadedSettings.copy())
                    obj.add(childObj)
                }
            }
            if (node.transforms !== undefined){
                for (let i = 0; i < node.transforms.length; i++){
                    const transform = node.transforms[i]
                    if (YASFValidator.validateTransform(transform) === false) continue;
                    if (transform.type === "translate"){
                        obj.position.set(transform.amount.x + obj.position.x, transform.amount.y + obj.position.y, transform.amount.z + obj.position.z)
                    }
                    else if (transform.type === "rotate"){
                        obj.rotation.set(transform.amount.x * Math.PI / 180 + obj.rotation.x, transform.amount.y * Math.PI / 180 + obj.rotation.y, transform.amount.z * Math.PI / 180 + obj.rotation.z)
                    }
                    else if (transform.type === "scale"){
                        obj.scale.set(transform.amount.x * obj.scale.x, transform.amount.y * obj.scale.y, transform.amount.z * obj.scale.z)
                    }
                }
            }
        }
        else if (node.type === "lod"){
            let lod = new THREE.LOD()
            for (const lodKey in node.lodNodes){
                const lodNode = node.lodNodes[lodKey]
                const refKey = lodNode.nodeId
                // it is very likely lods are one time use things, but just in case we're going to do the clone optimization here as well
                if (this.visitedNodes[refKey] === undefined){
                    const referencedObject = graph[refKey]
                    if (referencedObject === undefined){
                        console.error(new Error("YASF Graph Error: Referenced node "+refKey+" not found in graph"))
                        continue;
                    }
                    this.visitedNodes[refKey] = this.visitNode(referencedObject, graph, new CascadedSettings())
                }
                let referenceCopy = this.visitedNodes[refKey].clone()
                this.propagateSettings(referenceCopy, cascadedSettings.copy())
                lod.addLevel(referenceCopy, lodNode.mindist)
            }
            obj = lod
        }
        else if (this.primitives.includes(node.type)){
            obj = this.buildPrimitive(node, cascadedSettings)
        }
        else if (this.lights.includes(node.type)){
            obj = this.buildLight(node)
        }
        else{
            console.error(new Error("UNSUPPORTED TYPE ERROR: Node 'type' "+node.type+" not recognized"))
        }
        return obj
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //TODO:
        // ask professor why .target does nothing

        let yasf = data.yasf
        if (yasf === undefined){
            console.error(new Error("YASF Structure Error: 'yasf' block not defined"));
            return;
        }

        if (this.loadGlobals(yasf) === false) return;

        console.log("textures:")
        const textures = this.buildTextures(yasf)
        if (textures === null) return;

        console.log("materials:")
        if (this.buildMaterials(yasf, textures) === false) return;

        console.log("cameras:")
        if (this.buildCameras(yasf) === false) return;

        console.log("graph:")
        const graph = yasf.graph
        const firstNodeID = graph.rootid
        if (firstNodeID === undefined){
            console.error(new Error("YASF Structure Error: 'rootid' not defined in 'graph' block"));
            return;
        }
        const firstNode = graph[firstNodeID]
        if (firstNode === undefined){
            console.error(new Error("YASF Structure Error: Specified root node "+firstNodeID+" not defined in 'graph' block"));
            return;
        }
        let cascadedSettings = new CascadedSettings()
        const scene = this.visitNode(firstNode, graph, cascadedSettings)
        this.updateVideos()
        this.app.gui.addLightsGUI()
        this.app.scene.add(scene)
        console.log(scene)
    }

    update() {
    }
}

export { MyContents };