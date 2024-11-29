class CascadedSettings{
    constructor(material=null, castshadow=false, receiveshadow=false){
        this.material = material
        this.castshadow = null
        this.receiveshadow = null

        this.propagatedCastShadow = castshadow
        this.propagatedReceiveShadow = receiveshadow
        
        this.materialHasBeenChanged = false
    }
    // queremos passar o baseCastShadow e receiveshadow para os filhos, vai ser sempre a ultimate truth
    isCompletelyDifferent(){ // material is set by a parent, and cast shadow and receive shadow are the same as the base propagation
        return this.materialHasBeenChanged && ((this.castshadow && this.receiveshadow) || (this.propagatedCastShadow === this.castshadow && this.propagatedReceiveShadow === this.receiveshadow))
    }
    checkForNewSettings(node, materialList, videoMaterialList){
        if (node.materialref !== undefined){
            this.materialHasBeenChanged = true
            this.material = materialList[node.materialref.materialId]
            try{
                if (this.material.map !== undefined && this.material.map !== null && this.material.map.isVideoTexture){
                    videoMaterialList.push(node.materialref.materialId)
                }
            }
            catch(e){
            }
        }
        if (node.castshadows !== undefined && node.castshadows === true){
            this.propagatedCastShadow = true
        }
        if (node.receiveshadows !== undefined && node.receiveshadows === true){
            this.propagatedReceiveShadow = true
        }
    }
    checkForNewSettingsTHREE(node){
        if (node.material !== undefined && node.material !== null){
            this.materialHasBeenChanged = true
            this.material = node.material
        }
        if (node.castShadow !== undefined && node.castShadow !== null){
            this.castshadow = node.castShadow
        }
        if (node.receiveShadow !== undefined && node.receiveShadow !== null){
            this.receiveshadow = node.receiveShadow
        }
    }
    copyWithSanityCheck(){
        let copy = this.copy()
        copy.materialHasBeenChanged = this.materialHasBeenChanged
        copy.castshadow = this.castshadow
        copy.receiveshadow = this.receiveshadow
        return copy
    }
    copy(){
        return new CascadedSettings(this.material, this.propagatedCastShadow, this.propagatedReceiveShadow)
    }
}

export { CascadedSettings };