import {StarSystem, Planet, Star, Ring} from "../js/stellarForge/forge.js";

class PlanetarySystem{
    constructor(position = new THREE.Vector3(0,0,0) ){
        this.system = new StarSystem('Thozetis');
        this.system.star = new Star({
            name: 'Thozetis', 
            radius: 8, 
            color: 0xff2222, 
            rotation: 0.001, 
            type: 'star',
            texture: 'redGiant',
            atmosphere: {color: 0xff0000} 
        });
        this.system.planets = this.getPlanets();
        this.position = position;
        this.light = 0xff6666;
        this.description = 'System Thozetis jest radioaktywnym zapomnianym przez świat miejscem.';
        this.mapCoordinates = '0 2 2';
    }

    getPlanets() {
        
        return [
            new Planet({
                name: 'Thozetis I', 
                radius: 0.2, 
                color: 0xA06153, 
                rotation: 0.001, 
                orbitRotation: 0.009,
                orbitRadius: 12, 
                orbitSkew: 0.4, 
                skew: 0.1, 
                tags: ['barren', 'volcanic', 'radioactive'], 
                satelite:[],
                texture: "thozetis_1"
            }),
            new Planet({
                name: 'Thozetis II', 
                radius: 0.3, 
                color: 0xA06153, 
                rotation: 0.01, 
                orbitRotation: 0.008,
                orbitRadius: 14, 
                orbitSkew: -0.03, 
                skew: -0.1, 
                tags: ['barren', 'volcanic', 'radioactive'], 
                satelite:[],
                texture: "thozetis_2"
            }),
            new Planet({
                name: 'Thozetis III', 
                radius: 1.2, 
                color: 0x0000ff, 
                rotation: 0.005, 
                orbitRotation: 0.005, 
                orbitRadius: 25, 
                orbitSkew: 0, 
                skew: 0.15, 
                texture: 'thozetis_3',
                atmosphere: {color: 0xccffcc, clouds: true}, 
                tags: ['oceanic', 'invasive', 'radioactive'], 
                satelites: [
                    new Planet({ 
                        name: 'Thozetis III A',
                        radius: 0.1, 
                        color: 0xcccccc, 
                        rotation: 0.01, 
                        orbitRotation: 0.01, 
                        orbitRadius: 3, 
                        orbitSkew: 0.3, 
                        skew: 0, 
                        tags: ['test'], 
                        texture: 'thozetis_3a',
                        satelite: [] 
                    }),
                    new Planet({ 
                        name: 'Thozetis III B',
                        radius: 0.15, 
                        color: 0xcccccc, 
                        rotation: 0.01, 
                        orbitRotation: 0.015, 
                        orbitRadius: 4.5, 
                        orbitSkew: 0.3, 
                        skew: 0, 
                        tags: ['test'], 
                        texture: 'thozetis_3b',
                        satelite: [] 
                    }),
                    new Planet({ 
                        name: 'Thozetis III C',
                        radius: 0.17, 
                        color: 0xcccccc, 
                        rotation: 0.01, 
                        orbitRotation: 0.02, 
                        orbitRadius: 6, 
                        orbitSkew: 0, 
                        skew: 1, 
                        tags: ['test'], 
                        texture: 'thozetis_3c',
                        satelite: [] 
                    })
                ]
            })
        ]
    }
}

export { PlanetarySystem };