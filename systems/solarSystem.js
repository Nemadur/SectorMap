import {SolarSystem, Planet, Star, Ring} from "../js/corvus.js";

class PlanetarySystem{
    constructor(position = new THREE.Vector3(0,0,0) ){
        this.system = new SolarSystem('Solar');
        this.system.star = new Star({
            name: 'sun', 
            radius: 4, 
            color: 0xffff00, 
            rotation: 0.001, 
            type: 'star' 
        });
        this.system.planets = this.getPlanets();
        this.position = position;
    }

    getPlanets() {
        
        return [
            new Planet({
                name: 'mercury', 
                radius: 0.2, 
                color: 0xA06153, 
                rotation: 0.0001, 
                orbitRotation: 0.02,
                orbitRadius: 6, 
                orbitSkew: 0, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite:[]
            }),
            new Planet({
                name: 'venus',
                radius: 1,
                color: 0x5A3DA1,
                rotation: 0,
                orbitRotation: 0.003, 
                orbitRadius: 8, 
                orbitSkew: 0, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite: []
            }),
            new Planet({
                name: 'earth', 
                radius: 1, 
                color: 0x0000ff, 
                rotation: 0.005, 
                orbitRotation: 0.005, 
                orbitRadius: 12, 
                orbitSkew: 0, 
                skew: 0.15, 
                tags: ['earthlike', 'test'], 
                satelites: [
                    new Planet({ 
                        name: 'moon',
                        radius: 0.3, 
                        color: 0xcccccc, 
                        rotation: 0.01, 
                        orbitRotation: 0.01, 
                        orbitRadius: 2, 
                        orbitSkew: 0.3, 
                        skew: 0, 
                        tags: ['test'], 
                        satelite: [] 
                    })
                ]
            }),
            new Planet({
                name: 'mars',
                radius: 1.1,
                color: 0xff0000,
                rotation: 0.01,
                orbitRotation: 0.004, 
                orbitRadius: 19, 
                orbitSkew: 0, 
                skew: 0.07, 
                tags: ['earthlike', 'test'], 
                satelite: []
            }),
            new Planet({
                name: 'jupiter',
                radius: 3,
                color: 0xC49A24,
                rotation: 0.004,
                orbitRotation: 0.002, 
                orbitRadius: 30, 
                orbitSkew: 0, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite: []
            }),
            new Planet({
                name: 'Saturn',
                radius: 2.2,
                color: 0xeeea21,
                rotation: 0.01,
                orbitRotation: 0.0017, 
                orbitRadius: 40, 
                orbitSkew: 0.1, 
                skew: 0.5, 
                tags: ['earthlike', 'test'], 
                satelite: [],
                ring: new Ring(3, 4, 'ring.png')
            }),
            new Planet({
                name: 'Uran',
                radius: 1.3,
                color: 0x263CAC,
                rotation: 0.01,
                orbitRotation: 0.01, 
                orbitRadius: 55, 
                orbitSkew: 0, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite: []
            }),
            new Planet({
                name: 'Neptune',
                radius: 1.1,
                color: 0x263Cee,
                rotation: 0.01,
                orbitRotation: 0.0008, 
                orbitRadius: 80, 
                orbitSkew: 0.1, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite: [],
                ring: new Ring(1.3, 0.2, 'ring.png')
            }),
            new Planet({
                name: 'Pluto',
                radius: 0.6,
                color: 0xeeeeee,
                rotation: 0.01,
                orbitRotation: 0.0005, 
                orbitRadius: 100, 
                orbitSkew: 0.4, 
                skew: 0, 
                tags: ['earthlike', 'test'], 
                satelite: []
            })
        ]
    }
}

export { PlanetarySystem };