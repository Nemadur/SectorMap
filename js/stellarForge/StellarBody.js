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

export { StellarBody };