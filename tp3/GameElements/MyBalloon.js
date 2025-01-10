import * as THREE from "three";


class MyBalloon {
    constructor(app,position,color,layer) {
        this.app = app;
        this.startPosition = position;
        this.balloonColor = color;
        this.layer = layer;
        this.lod = new THREE.LOD();
        this.group1 = new THREE.Group();
        this.wind_speed = 1;
        this.winds = [
            {  // Layer 0
                minHeight: 0,
                direction: new THREE.Vector3(0, 0, 0)
            },
            {  // Layer 1
                minHeight: 1,
                direction: new THREE.Vector3(1, 0, 0)
            },
            {  // Layer 2
                minHeight: 2,
                direction: new THREE.Vector3(-1, 0, 0)
            },
            {  // Layer 3
                minHeight: 3,
                direction: new THREE.Vector3(0, 0, 1)
            },
            {  // Layer 4
                minHeight: 4,
                direction: new THREE.Vector3(0, 0, -1)
            }
        ]
    }

    
    init() {
        // Detailed representation
        let geometryA = new THREE.SphereGeometry(1);
        let materialA = new THREE.MeshPhongMaterial({color: this.balloonColor});
        this.sphereA = new THREE.Mesh( geometryA, materialA );
        this.sphereA.position.set( 0, 2.5, 0 );
        this.sphereA.layers.enable(this.layer)

        let geometryB = new THREE.BoxGeometry(1,1,1);
        let materialB = new THREE.MeshPhongMaterial({color: this.balloonColor});
        this.cubeB = new THREE.Mesh( geometryB, materialB );
        this.cubeB.position.set( 0, 1, 0 );
        this.cubeB.layers.enable(this.layer)

        const group = new THREE.Group();
        group.add(this.sphereA);
        group.add(this.cubeB);

        this.lod.addLevel(group, 10)

        this.lod.position.x = this.startPosition.x
        this.lod.position.z = this.startPosition.z
        
        // Simplified representation
        
        let geometryC = new THREE.CircleGeometry(1);
        let materialC = new THREE.MeshPhongMaterial({color: this.balloonColor})
        this.plane2 = new THREE.Mesh( geometryC, materialC );
        this.plane2.position.set( 0, 2.5, 0);

        let geometryD = new THREE.PlaneGeometry(1,1)
        let materialD = new THREE.MeshPhongMaterial({color: this.balloonColor})
        this.plane = new THREE.Mesh(geometryD, materialD)
        this.plane.position.set(0, 1, 0)

        this.group1.add(this.plane2);
        this.group1.add(this.plane);
        
        this.lod.addLevel(this.group1, 25)

        // shadow

        let geometryE = new THREE.CircleGeometry(0.4,10);
        let materialE = new THREE.MeshPhongMaterial({color: 0x000000})
        this.shadowE = new THREE.Mesh( geometryE, materialE );
        this.shadowE.rotation.set(-Math.PI/2,0,0);
        this.shadowE.position.set(0,0.11,0);

        // Bounding box
        this.boxhelper = new THREE.BoxHelper(this.lod, 0x0000ff);
        this.bbox = new THREE.Box3();
        this.bbox.setFromObject(this.boxhelper);

        this.app.scene.add(this.lod)
        this.app.scene.add(this.shadowE)
        this.app.scene.add(this.boxhelper)

        
    }

    updateColor(newColor) {
        this.sphereA.material.color.setHex(newColor);
        this.cubeB.material.color.setHex(newColor);
        this.plane2.material.color.setHex(newColor);
        this.plane.material.color.setHex(newColor);
    }

    update() {
        if (this.lod.getCurrentLevel() == 1)
            this.group1.lookAt(this.app.activeCamera.position)

        for (let i = this.winds.length - 1; i >= 0; i--) {
            const wind_layer = this.winds[i];

            if (this.lod.position.y < wind_layer.minHeight) {
                continue;
            }
            
            this.lod.position.x += wind_layer.direction.x * this.wind_speed / 100;
            this.lod.position.z += wind_layer.direction.z * this.wind_speed / 100;
            break;
        }

        let shadowRadius = 0
        if(this.lod.position.y > -0.5) {
            shadowRadius = 1 / Math.max(1, Math.min(4, this.lod.position.y));
        }

        this.shadowE.scale.set(shadowRadius, shadowRadius, 1);
        this.shadowE.position.set(this.lod.position.x,0.11,this.lod.position.z)
    
        this.boxhelper.update();
        this.bbox.setFromObject(this.boxhelper);
    }

    behavior() {
        // Add key listeners
        document.addEventListener("keypress", 
            (event) => {
                switch(event.key) {
                    case "w": case "W": this.lod.position.y += 1; break;
                    case "s": case "S": this.lod.position.y -= 1; break;
                }
            }, false);
    }
}

export {MyBalloon};