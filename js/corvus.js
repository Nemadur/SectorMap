var corvus = {
    systems: [
        {
            position: {x:0, y:0, z:0},
            name: 'test',
            star: {name: 'sun', radius: 5, color: 0xffff00, rotation: 0.001, type: 'star' },
            planets: [
                {name: 'earth', radius: 1, color: 0x0000ff, rotation: 0.005, orbitRotation: 0.005 ,orbitRadius: 10, orbitSkew: 0, skew: 0.15, tags: ['earthlike', 'test'], satelite:[
                    { name: 'moon', radius: 0.3, color: 0xcccccc, rotation: 0.01, orbitRotation: 0.01, orbitRadius: 2, orbitSkew: 0.3, skew: 0, tags: ['test'], satelite: [] }
                ]}]
        }
    ]
}

export { corvus };