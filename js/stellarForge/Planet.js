import {StellarBody} from './StellarBody.js'

class Planet extends StellarBody {
    constructor(data){
        super(
            data.name, 
            data.radius, 
            data.type, 
            data.color, 
            data.rotation, 
            data.tags,
            data.skew,
            data.texture
            );
        
        this.orbitRotation = data.orbitRotation;
        this.orbitRadius = data.orbitRadius;
        this.orbitSkew = data.orbitSkew;
        this.satelites = data.satelites;
        this.ring = data.ring;
    }
}

export {Planet};