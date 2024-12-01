class YASFValidator {
    constructor() {
    }

    static validateGlobals(yasf) {
        console.log("globals:");
        if (yasf.globals === undefined){
            console.error(new Error("YASF Structure Error: 'globals' block not defined"));
            return false;
        }

        let validated = true;

        if (yasf.globals.background === undefined){
            console.error(new Error("YASF Structure Error: 'background' entry of 'globals' block not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(yasf.globals.background);

        if (yasf.globals.ambient === undefined){
            console.error(new Error("YASF Structure Error: 'ambient' entry of 'globals' block not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(yasf.globals.ambient);

        console.log("fog:");
        if (yasf.globals.fog === undefined){
            console.error(new Error("YASF Structure Error: 'fog' entry of 'globals' block not defined"));
            validated = false;
        }
        else{
            if (yasf.globals.fog.color === undefined){
                console.error(new Error("YASF Structure Error: 'color' entry of 'fog' block not defined"));
                validated = false;
            }
            else validated &&= this.validateColors(yasf.globals.fog.color);
            if (yasf.globals.fog.near === undefined){
                console.error(new Error("YASF Structure Error: 'near' entry of 'fog' block not defined"));
                validated = false
            }
            if (yasf.globals.fog.far === undefined){
                console.error(new Error("YASF Structure Error: 'far' entry of 'fog' block not defined"));
                validated = false
            }
        }

        console.log("skybox:");
        if (yasf.globals.skybox === undefined){
            console.error(new Error("YASF Structure Error: 'skybox' entry of 'globals' block not defined"));
            validated = false;
        }
        else{
            if (yasf.globals.skybox.size === undefined){
                console.error(new Error("YASF Structure Error: 'size' entry of 'skybox' block not defined"));
                validated = false;
            }
            else validated &&= this.validateXYZ(yasf.globals.skybox.size, "size");
            if (yasf.globals.skybox.center === undefined){
                console.error(new Error("YASF Structure Error: 'center' entry of 'skybox' block not defined"));
                validated = false;
            }
            else validated &&= this.validateXYZ(yasf.globals.skybox.center, "center");
            if (yasf.globals.skybox.emissive === undefined){
                console.error(new Error("YASF Structure Error: 'emissive' entry of 'skybox' block not defined"));
                validated = false;
            }
            else validated &&= this.validateColors(yasf.globals.skybox.emissive);
            if (yasf.globals.skybox.intensity === undefined){
                console.error(new Error("YASF Structure Error: 'intensity' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.front === undefined){
                console.error(new Error("YASF Structure Error: 'front' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.back === undefined){
                console.error(new Error("YASF Structure Error: 'back' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.left === undefined){
                console.error(new Error("YASF Structure Error: 'left' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.right === undefined){
                console.error(new Error("YASF Structure Error: 'right' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.up === undefined){
                console.error(new Error("YASF Structure Error: 'up' entry of 'skybox' block not defined"));
                validated = false;
            }
            if (yasf.globals.skybox.down=== undefined){
                console.error(new Error("YASF Structure Error: 'down' entry of 'skybox' block not defined"));
                validated = false;
            }
        }

        return validated;
    }

    static validateMaterial(yasf, materialName, material) {
        let validated = true;
        console.log("\t"+ materialName + ":");

        if (material.color === undefined){
            console.error(new Error("YASF Structure Error: 'color' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(material.color);

        if (material.specular === undefined){
            console.error(new Error("YASF Structure Error: 'specular' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(material.specular);

        if (material.shininess === undefined){
            console.error(new Error("YASF Structure Error: 'shininess' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }

        if (material.emissive === undefined){
            console.error(new Error("YASF Structure Error: 'emissive' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(material.emissive);

        if (material.transparent === undefined){
            console.error(new Error("YASF Structure Error: 'transparent' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }

        if (material.opacity === undefined){
            console.error(new Error("YASF Structure Error: 'opacity' entry of '"+ materialName +"' material not defined"));
            validated = false;
        }

        if (material.textureref !== undefined){
            if (yasf.textures[material.textureref] === undefined){
                console.error(new Error("YASF Structure Error: 'textureref' entry of '"+ materialName +"' refers to a non-existent texture"));
                validated = false;
            }
        }
        else material.textureref = null;

        if (material.bumpref !== undefined){
            if (yasf.textures[material.bumpref] === undefined){
                console.error(new Error("YASF Structure Error: 'bumpmap' entry of '"+ materialName +"' refers to a non-existent texture"));
                validated = false;
            }
        }
        else material.bumpref = null;

        if (material.specularref !== undefined){
            if (yasf.textures[material.specularref] === undefined){
                console.error(new Error("YASF Structure Error: 'specularref' entry of '"+ materialName +"' refers to a non-existent texture"));
                validated = false;
            }
        }
        else material.specularref = null;

        if (material.wireframe === undefined) material.wireframe = false;
        if (material.shading === undefined) material.shading = false;
        if (material.texlength_s === undefined) material.texlength_s = 1;
        if (material.texlength_t === undefined) material.texlength_t = 1;
        if (material.twosided === undefined) material.twosided = false;
        if (material.bumpscale === undefined) material.bumpscale = 1;

        return validated;
    }

    static validateCamera(cameraName, camera){
        console.log("\t"+ cameraName + ":");

        if (camera.type === undefined){
            console.error(new Error("YASF Structure Error: 'type' entry of '"+ cameraName +"' camera not defined"));
            return false;
        }

        let validated = true;

        if (camera.location === undefined){
            console.error(new Error("YASF Structure Error: 'location' entry of '"+ cameraName +"' camera not defined"));
            validated = false;
        }
        else validated &&= this.validateXYZ(camera.location, "location");

        if (camera.target === undefined){
            console.error(new Error("YASF Structure Error: 'target' entry of '"+ cameraName +"' camera not defined"));
            validated = false;
        }
        else validated &&= this.validateXYZ(camera.target, "target");

        if (camera.near === undefined){
            console.error(new Error("YASF Structure Error: 'near' entry of '"+ cameraName +"' camera not defined"));
            validated = false;
        }

        if (camera.far === undefined){
            console.error(new Error("YASF Structure Error: 'far' entry of '"+ cameraName +"' camera not defined"));
            validated = false;
        }

        if (camera.type === "perspective"){
            if (camera.angle === undefined){
                console.error(new Error("YASF Structure Error: 'angle' entry of '"+ cameraName +"' camera not defined"));
                validated = false;
            }
        }
        else if (camera.type === "orthogonal"){
            if (camera.left === undefined){
                console.error(new Error("YASF Structure Error: 'left' entry of '"+ cameraName +"' camera not defined"));
                validated = false;
            }
            if (camera.right === undefined){
                console.error(new Error("YASF Structure Error: 'right' entry of '"+ cameraName +"' camera not defined"));
                validated = false;
            }
            if (camera.top === undefined){
                console.error(new Error("YASF Structure Error: 'top' entry of '"+ cameraName +"' camera not defined"));
                validated = false;
            }
            if (camera.bottom === undefined){
                console.error(new Error("YASF Structure Error: 'bottom' entry of '"+ cameraName +"' camera not defined"));
                validated = false;
            }
        }
        else{
            console.error(new Error("YASF Structure Error: Unknown 'type' " + camera.type +" of '"+ cameraName +"' camera"));
            validated = false;
        }

        return validated;
    }

    static validateTransform(transform){
        let validated = true;

        if (transform.type === undefined){
            console.error(new Error("YASF Graph Error: Transform 'type' not defined"))
            validated = false;
        }
        else if (transform.type !== "translate" && transform.type !== "rotate" && transform.type !== "scale"){
            console.error(new Error("YASF Graph Error: Transform 'type' must be one of 'translate', 'rotate', or 'scale'"))
            validated = false;
        }

        if (transform.amount === undefined){
            console.error(new Error("YASF Graph Error: Transform 'amount' not defined"))
            validated = false;
        }
        else validated &&= this.validateXYZ(transform.amount, "amount");

        return validated;
    }

    static validatePrimitive(primitiveID, primitive){
        console.log("\t\t" + primitiveID + ":");
        let validated = true;

        switch (primitive.type){
            case "rectangle":
                if (primitive.xy1 === undefined){
                    console.error(new Error("YASF Graph Error: 'xy1' entry of 'rectangle' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXY(primitive.xy1, "xy1");
                if (primitive.xy2 === undefined){
                    console.error(new Error("YASF Graph Error: 'xy2' entry of 'rectangle' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXY(primitive.xy2, "xy2");

                if (primitive.parts_x === undefined) primitive.parts_x = 1;
                if (primitive.parts_y === undefined) primitive.parts_y = 1;

                break;
            case "triangle":
                if (primitive.xyz1 === undefined){
                    console.error(new Error("YASF Graph Error: 'xyz1' entry of 'triangle' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXYZ(primitive.xyz1, "xyz1");

                if (primitive.xyz2 === undefined){
                    console.error(new Error("YASF Graph Error: 'xyz2' entry of 'triangle' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXYZ(primitive.xyz2, "xyz2");

                if (primitive.xyz3 === undefined){
                    console.error(new Error("YASF Graph Error: 'xyz3' entry of 'triangle' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXYZ(primitive.xyz3, "xyz3");

                break;
            case "box":
                if (primitive.xyz1 === undefined){
                    console.error(new Error("YASF Graph Error: 'xyz1' entry of 'box' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXYZ(primitive.xyz1, "xyz1");

                if (primitive.xyz2 === undefined){
                    console.error(new Error("YASF Graph Error: 'xyz2' entry of 'box' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateXYZ(primitive.xyz2, "xyz2");

                if (primitive.parts_x === undefined) primitive.parts_x = 1;
                if (primitive.parts_y === undefined) primitive.parts_y = 1;
                if (primitive.parts_z === undefined) primitive.parts_z = 1;

                break;
            case "cylinder":
                if (primitive.base === undefined){
                    console.error(new Error("YASF Graph Error: 'base' entry of 'cylinder' primitive not defined"))
                    validated = false;
                }

                if (primitive.top === undefined){
                    console.error(new Error("YASF Graph Error: 'top' entry of 'cylinder' primitive not defined"))
                    validated = false;
                }

                if (primitive.height === undefined){
                    console.error(new Error("YASF Graph Error: 'height' entry of 'cylinder' primitive not defined"))
                    validated = false;
                }

                if (primitive.slices === undefined){
                    console.error(new Error("YASF Graph Error: 'slices' entry of 'cylinder' primitive not defined"))
                    validated = false;
                }

                if (primitive.stacks === undefined){
                    console.error(new Error("YASF Graph Error: 'stacks' entry of 'cylinder' primitive not defined"))
                    validated = false;
                }

                if (primitive.capsclose === undefined) primitive.capsclose = true;
                if (primitive.thetastart === undefined) primitive.thetastart = 0;
                if (primitive.thetalength === undefined) primitive.thetalength = 360;
                
                break;
            case "sphere":
                if (primitive.radius === undefined){
                    console.error(new Error("YASF Graph Error: 'radius' entry of 'sphere' primitive not defined"))
                    validated = false;
                }
                if (primitive.slices === undefined){
                    console.error(new Error("YASF Graph Error: 'slices' entry of 'sphere' primitive not defined"))
                    validated = false;
                }
                if (primitive.stacks === undefined){
                    console.error(new Error("YASF Graph Error: 'stacks' entry of 'sphere' primitive not defined"))
                    validated = false;
                }

                if (primitive.thetastart === undefined) primitive.thetastart = 0;
                if (primitive.thetalength === undefined) primitive.thetalength = 180;
                if (primitive.phistart === undefined) primitive.phistart = 0;
                if (primitive.philength === undefined) primitive.philength = 360;

                break;
            case "nurbs":
                if (primitive.degree_u === undefined){
                    console.error(new Error("YASF Graph Error: 'degree_u' entry of 'nurbs' primitive not defined"))
                    validated = false;
                }

                if (primitive.degree_v === undefined){
                    console.error(new Error("YASF Graph Error: 'degree_v' entry of 'nurbs' primitive not defined"))
                    validated = false;
                }

                if (primitive.parts_u === undefined){
                    console.error(new Error("YASF Graph Error: 'parts_u' entry of 'nurbs' primitive not defined"))
                    validated = false;
                }

                if (primitive.parts_v === undefined){
                    console.error(new Error("YASF Graph Error: 'parts_v' entry of 'nurbs' primitive not defined"))
                    validated = false;
                }

                if (primitive.controlpoints === undefined){
                    console.error(new Error("YASF Graph Error: 'controlpoints' entry of 'nurbs' primitive not defined"))
                    validated = false;
                }
                else{
                    if (primitive.controlpoints.length !== (primitive.degree_u + 1) * (primitive.degree_v + 1)){
                        console.error(new Error("YASF Graph Error: 'controlpoints' entry of 'nurbs' primitive does not correspond to the degree of the surface"))
                        validated = false;
                    }
                    else{
                        for (let i = 0; i < primitive.controlpoints.length; i++){
                            validated &&= this.validateXYZ(primitive.controlpoints[i], "controlpoints[" + i + "]");
                        }
                    }
                }

                break;
            case "polygon":
                if (primitive.radius === undefined){
                    console.error(new Error("YASF Graph Error: 'radius' entry of 'polygon' primitive not defined"))
                    validated = false;
                }

                if (primitive.stacks === undefined){
                    console.error(new Error("YASF Graph Error: 'stacks' entry of 'polygon' primitive not defined"))
                    validated = false;
                }

                if (primitive.slices === undefined){
                    console.error(new Error("YASF Graph Error: 'slices' entry of 'polygon' primitive not defined"))
                    validated = false;
                }

                if (primitive.color_c == undefined){
                    console.error(new Error("YASF Graph Error: 'color_c' entry of 'polygon' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateColors(primitive.color_c);

                if (primitive.color_p == undefined){
                    console.error(new Error("YASF Graph Error: 'color_p' entry of 'polygon' primitive not defined"))
                    validated = false;
                }
                else validated &&= this.validateColors(primitive.color_p);

                break;
        }

        return validated;
    }

    static validateLight(lightName, light){
        console.log("\t\t" + lightName + ":");

        let validated = true;

        if (light.position === undefined){
            console.error(new Error("YASF Structure Error: 'position' entry of '"+ lightName +"' light not defined"));
            validated = false;
        }
        else validated &&= this.validateXYZ(light.position, "position");

        if (light.color === undefined){
            console.error(new Error("YASF Structure Error: 'color' entry of '"+ lightName +"' light not defined"));
            validated = false;
        }
        else validated &&= this.validateColors(light.color);

        if (light.intensity === undefined) light.intensity = 1;
        if (light.enabled === undefined) light.enabled = true;
        if (light.castshadow === undefined) light.castshadow = false;
        if (light.shadowfar === undefined) light.shadowfar = 500;
        if (light.shadowmapsize === undefined) light.shadowmapsize = 512;

        if (light.type === "directionallight"){
            if (light.shadowleft === undefined) light.shadowleft = -5;
            if (light.shadowright === undefined) light.shadowright = 5;
            if (light.shadowtop === undefined) light.shadowtop = 5;
            if (light.shadowbottom === undefined) light.shadowbottom = -5;
        }
        else{
            if (light.decay === undefined) light.decay = 2;
            if (light.distance === undefined) light.distance = 1000;
            if (light.type === "spotlight"){
                if (light.target === undefined){
                    console.error(new Error("YASF Structure Error: 'target' entry of '"+ lightName +"' light not defined"));
                    validated = false;
                }
                else validated &&= this.validateXYZ(light.target, "target");

                if (light.angle === undefined){
                    console.error(new Error("YASF Structure Error: 'angle' entry of '"+ lightName +"' light not defined"));
                    validated = false;
                }

                if (light.penumbra === undefined) light.penumbra = 1;
            }
        }

        return validated;
    }

    static validateColors(colorObject){
        if (colorObject.r === undefined || colorObject.g === undefined || colorObject.b === undefined){
            console.error(new Error("YASF Structure Error: 'r', 'g', or 'b' entry of 'color' block not defined"));
            return false;
        }
        return true;
    }

    static validateXYZ(xyzObject, name){
        if (xyzObject.x === undefined || xyzObject.y === undefined || xyzObject.z === undefined){
            console.error(new Error("YASF Structure Error: 'x', 'y', or 'z' entry of '"+ name +"' block not defined"));
            return false;
        }
        return true;
    }

    static validateXY(xyObject, name){
        if (xyObject.x === undefined || xyObject.y === undefined){
            console.error(new Error("YASF Structure Error: 'x' or 'y' entry of '"+ name +"' block not defined"));
            return false;
        }
        return true;
    }
}

export { YASFValidator };