import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { CascadedSettings } from './CascadedSettings.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
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
     * This function builds a light object based on the given light node
     * @param {*} light the light node
     * @returns the light object
    */
    buildLight(light){
        let obj = null
        const color = new THREE.Color(light.color.r, light.color.g, light.color.b)
        const intensity = light.intensity !== undefined ? light.intensity : 1
        const distance = light.distance !== undefined ? light.distance : 1000
        let helper = null
        switch(light.type){
            case "pointlight":
                obj = new THREE.PointLight(color, intensity, distance, light.decay !== undefined ? light.decay : 2)
                helper = new THREE.PointLightHelper(obj, 1)
                break;
            case "directionallight":
                obj = new THREE.DirectionalLight(color, intensity)
                obj.shadow.camera.left = light.shadowleft !== undefined ? light.left : -5
                obj.shadow.camera.right = light.shadowright !== undefined ? light.right : 5
                obj.shadow.camera.top = light.shadowtop !== undefined ? light.top : 5
                obj.shadow.camera.bottom = light.shadowbottom !== undefined ? light.bottom : -5
                helper = new THREE.DirectionalLightHelper(obj, 1)
                break;
            case "spotlight":
                const angle = light.angle
                const penumbra = light.penumbra !== undefined ? light.penumbra : 1
                const decay = light.decay !== undefined ? light.decay : 2
                obj = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay)
                obj.target.position.set(light.target.x, light.target.y, light.target.z)
                helper = new THREE.SpotLightHelper(obj, 1)
                break;
        }
        obj.visible = light.enabled
        obj.castShadow = light.castshadow !== undefined ? light.castshadow : false
        obj.shadow.mapSize.width = light.shadowmapsize !== undefined ? light.shadowmapsize : 512
        obj.shadow.mapSize.height = light.shadowmapsize !== undefined ? light.shadowmapsize : 512
        obj.shadow.camera.far = light.shadowfar !== undefined ? light.shadowfar : 500
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
        switch(primitive.type){
            case "rectangle":
                const length = Math.abs(primitive.xy2.x - primitive.xy1.x)
                const height = Math.abs(primitive.xy2.y - primitive.xy1.y)
                const partsX = primitive.parts_x !== undefined ? primitive.parts_x : 1
                const partsY = primitive.parts_y !== undefined ? primitive.parts_y : 1
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
                const boxPartsX = primitive.parts_x !== undefined ? primitive.parts_x : 1
                const boxPartsY = primitive.parts_y !== undefined ? primitive.parts_y : 1
                const boxPartsZ = primitive.parts_z !== undefined ? primitive.parts_z : 1
                geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, boxPartsX, boxPartsY, boxPartsZ)
                break;
            case "cylinder":
                const cylinderOpenEnded = primitive.capsclose !== undefined ? !primitive.capsclose : false
                const cylinderThetaStart = primitive.thetastart !== undefined ? primitive.thetastart * Math.PI / 180 : 0
                const cylinderThetaLength = primitive.thetalength !== undefined ? primitive.thetalength * Math.PI / 180: 2 * Math.PI
                geometry = new THREE.CylinderGeometry(primitive.top, primitive.base, primitive.height, primitive.slices, primitive.stacks, cylinderOpenEnded, cylinderThetaStart, cylinderThetaLength)
                break;
            case "sphere":
                const spherePhiStart = primitive.phistart !== undefined ? primitive.phistart * Math.PI / 180 : 0
                const spherePhiLength = primitive.philength !== undefined ? primitive.philength * Math.PI / 180 : 2*Math.PI
                const sphereThetaStart = primitive.thetastart !== undefined ? primitive.thetastart * Math.PI / 180 : 0
                const sphereThetaLength = primitive.thetalength !== undefined ? primitive.thetalength * Math.PI / 180 : Math.PI
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
            console.error(new Error("TYPE ERROR: Node type not defined"))
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
                let lodObj = this.visitNode(graph[lodNode.nodeId], graph, cascadedSettings)
                lod.addLevel(lodObj, lodNode.mindist)
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
            console.error(new Error("UNSUPPORTED TYPE ERROR: Node type "+node.type+" not recognized"))
        }
        return obj
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //TODO:
        // ask professor why .target does nothing

        const yasf = data.yasf

        const globals = yasf.globals

        console.log("globals:")
        const colors = globals.background
        this.app.scene.background = new THREE.Color(colors['r'], colors['g'], colors['b'])
        const ambient = globals.ambient
        this.app.scene.add(new THREE.AmbientLight(new THREE.Color(ambient['r'], ambient['g'], ambient['b'])))

        console.log("fog:")
        const fogColors = globals.fog.color
        const fog = new THREE.Fog(new THREE.Color(fogColors['r'], fogColors['g'], fogColors['b']), globals.fog.near, globals.fog.far)
        this.app.scene.fog = fog

        console.log("skybox:")
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

        console.log("textures:")
        const textures = {}
        for (let key in yasf.textures) {
            let texture = yasf.textures[key]
            if (!texture.isVideo){
                let tex = new THREE.TextureLoader().load(texture.filepath);
                let err = 0;
                tex.generateMipmaps = false;
                for (let i=0; i<=7; i++){
                    let mipKey = 'mipmap' + i;
                    let mipmap = texture[mipKey];
                    if (mipmap === undefined){
                        err = 1;
                        continue;
                    }
                    else if (err === 1){
                        console.error(new Error("Expected mipmap " + (i-1) + " to be defined for texture "+key+"."))
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
                        console.error(new Error("Failed to load mipmap "+i+" for texture "+key+"."))
                    });
                    tex.needsUpdate = true;
                }
                textures[key] = tex;
            }
            else{
                let videoHTML = document.createElement('video')
                videoHTML.src = texture.filepath
                textures[key] = new THREE.VideoTexture(videoHTML)
                this.videoTextures[key] = videoHTML
            }
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
            let shading = material.shading !== undefined ? material.shading : false
            let wireframe = material.wireframe !== undefined ? material.wireframe : false
            let bumpref = material.bumpref !== undefined ? material.bumpref : null
            if (bumpref !== null) textures[bumpref].repeat.set(texLengthS, texLengthT)
            let bumpscale = material.bumpscale !== undefined ? material.bumpscale : 1.0
            let specularref = material.specularref !== undefined ? material.specularref : null
            if (specularref !== null) textures[specularref].repeat.set(texLengthS, texLengthT)
            let textureRef = material.textureref !== undefined ? material.textureref : null
            if (textureRef !== null) textures[textureRef].repeat.set(texLengthS, texLengthT)
            
            this.materials[key] = new THREE.MeshPhongMaterial({color: color, emissive: emissive, specular: specular, shininess: shininess, side: twoSided ? THREE.DoubleSide : THREE.FrontSide, transparent: transparent, opacity: opacity, wireframe: wireframe, bumpScale: bumpscale, flatShading: shading});
            if (textureRef !== null){
                this.materials[key].map = textures[textureRef]
                if (textures[textureRef] instanceof THREE.VideoTexture){
                    this.videoTextures[key] = this.videoTextures[textureRef]
                    delete this.videoTextures[textureRef]
                }
            }
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
        this.app.gui.addCameraGUI()

        console.log("graph:")
        const graph = yasf.graph
        const firstNodeID = graph.rootid
        const firstNode = graph[firstNodeID]
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