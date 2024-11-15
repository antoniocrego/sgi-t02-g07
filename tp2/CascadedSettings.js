class CascadedSettings{
    constructor(material=null, castshadow=false, receiveshadow=false){
        this.material = material
        this.castshadow = castshadow
        this.receiveshadow = receiveshadow
        
        this.materialHasBeenChanged = false
        this.castShadowHasBeenChanged = false
        this.receiveShadowHasBeenChanged = false
    }
    isCompletelyDifferent(){
        const castShadowIsDifferentOrFalse = this.castShadowHasBeenChanged || this.castshadow === false
        const receiveShadowIsDifferentOrFalse = this.receiveShadowHasBeenChanged || this.receiveshadow === false
        return this.materialHasBeenChanged && castShadowIsDifferentOrFalse && receiveShadowIsDifferentOrFalse
    }
    checkForNewSettings(node, materialList){
        if (node.materialref !== undefined){
            this.materialHasBeenChanged = true
            this.material = materialList[node.materialref.materialId]
        }
        if (node.castshadows !== undefined){
            this.castShadowHasBeenChanged = true
            this.castshadow = node.castshadows
        }
        if (node.receiveshadows !== undefined){
            this.receiveShadowHasBeenChanged = true
            this.receiveshadow = node.receiveshadows
        }
    }
    checkForNewSettingsTHREE(node){
        if (node.material !== undefined && node.material !== null){
            this.materialHasBeenChanged = true
            this.material = node.material
        }
        if (node.castShadow !== undefined && node.castShadow !== null){
            this.castShadowHasBeenChanged = true
            this.castshadow = node.castShadow
        }
        if (node.receiveShadow !== undefined && node.receiveShadow !== null){
            this.receiveShadowHasBeenChanged = true
            this.receiveshadow = node.receiveShadow
        }
    }
    copyWithSanityCheck(){
        let copy = this.copy()
        copy.materialHasBeenChanged = this.materialHasBeenChanged
        copy.castShadowHasBeenChanged = this.castShadowHasBeenChanged
        copy.receiveShadowHasBeenChanged = this.receiveShadowHasBeenChanged
        return copy
    }
    copy(){
        return new CascadedSettings(this.material, this.castshadow, this.receiveshadow)
    }
}

export { CascadedSettings };