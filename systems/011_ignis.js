import {StarSystem, Planet, Star, Ring} from "../js/stellarForge/forge.js";

class PlanetarySystem{
    constructor(position = new THREE.Vector3(0,0,0) ){
        this.system = new StarSystem('Ignis');
        this.system.star = new Star({
            name: 'Ignis', 
            radius: 6, 
            color: 0xffff00, 
            rotation: 0.001, 
            type: 'star',
            texture: 'star',
            atmosphere: {color: 0xffcccc} 
        });
        this.system.planets = this.getPlanets();
        this.position = position;
        this.light = 0xff6666;
        this.description = 'Brak danych';
        this.mapCoordinates = '0 1 1';
        this.alerts = [
            {icon: 'icon', title: 'title', msg: 'test msg'}
        ];

    }

    // 
    // TAGS: Rising Hegemon, Cyclical Doom
    // 
    // Enemy: Demagogue claiming the apocalypse is a myth - Official bent on glorious success
    // Friends: Offworlder Studying the cycles (Neotemezeryta)
    // Complications: Pre-tech Promethean Technology
    // Things: Lost Archives (of doom)
    // Places: Starport crowded with panicked refugees, struggling under the flow of new ships
    // 
    // Atmos: Inert
    // Temp: Hot
    // Bio: Microbial
    // Pop: Hundreds of Millions
    // Tech: TL4+ Pre-tech

    getPlanets() {
        
        return [
            new Planet({
                name: 'Ignis I', 
                radius: 0.2, 
                color: 0xA06153, 
                rotation: 0.001, 
                orbitRotation: 0.015,
                orbitRadius: 12, 
                orbitSkew: 0.4, 
                skew: 0.1, 
                tags: ['barren', 'volcanic', 'radioactive'], 
                satelite:[],
                texture: "ignis_1"
            }),
            new Planet({
                name: 'Ignis II', 
                radius: 1, 
                rotation: 0.02, 
                orbitRotation: 0.01,
                orbitRadius: 20, 
                orbitSkew: +0.03, 
                skew: -0.18, 
                atmosphere: {color: 0xaacccc, clouds: true},
                tags: ['Rising Hegemon', 'Cyclical Doom', 'radioactive'], 
                satelite:[],
                texture: "ignis_2"
            }),
            new Planet({
                name: 'Ignis III', 
                radius: 1.4, 
                rotation: 0.02, 
                orbitRotation: 0.006,
                orbitRadius: 43, 
                orbitSkew: 0, 
                skew: 0.1, 
                tags: ['barren'], 
                satelite:[],
                texture: "ignis_3"
            })
        ]
    }
}

export { PlanetarySystem as ignis };