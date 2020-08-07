import {StellarBody} from './StellarBody.js';

class Star extends StellarBody{
    constructor(data){
        super(
            data.name, 
            data.radius, 
            data.type, 
            data.color, 
            data.rotation, 
            data.tags,
            data.skew,
            data.texture,
            data.atmosphere
            );
    }
}

export {Star};