class StellarBody {
    constructor(name, radius, type, color, rotation, tags, skew, texture = null){
        this.name = name;
        this.type = type;
        this.radius = radius;
        this.skew = skew
        this.color = color;
        this.texture = texture;
        this.rotation = rotation;
        this.tags = tags;
        this.mesh = null;
        this.orbit = null;
        this.atmosphere = null;
    };

    addMesh(mesh){
        this.mesh = mesh;
    };

    addOrbit(orbit){
        this.orbit = orbit;
    };

    addAtmosphere(atmosphere){
        this.atmosphere = atmosphere;
    };
}

class Planet extends StellarBody {
    constructor(data){
        super(
            data.name, 
            data.radius, 
            data.type, 
            data.color, 
            data.rotation, 
            data.tags,
            data.skew
            );
        
        this.orbitRotation = data.orbitRotation;
        this.orbitRadius = data.orbitRadius;
        this.orbitSkew = data.orbitSkew;
        this.satelites = data.satelites;
        this.ring = data.ring;
    }
}

class Star extends StellarBody{
    constructor(data){
        super(
            data.name, 
            data.radius, 
            data.type, 
            data.color, 
            data.rotation, 
            data.tags,
            data.skew
            );
    }
}
   
class Ring {
    constructor(radius, width, texture = null){
        this.radius = radius;
        this.width = width;
        this.texture = texture;
    }
}
class SolarSystem {
    constructor(name = ''){
        this.name = name
        this.star = null;
        this.planets = [];
    }
}

export { Planet, Star, SolarSystem, Ring };