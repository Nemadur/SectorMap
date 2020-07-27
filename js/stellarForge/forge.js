import {StarSystem} from './StarSystem.js';
import {StellarBody} from './StellarBody.js';
import {Star} from './Star.js';
import {Planet} from './Planet.js';
import {Ring} from './Ring.js';

var stellarObjects = [];
let system = new THREE.Object3D();

function createSatelite(planet, system, anchor = 0 ) {
    
    let orbit = createOrbit(planet);
    let satelite = createSphere(planet);

    planet.addMesh(satelite);
    planet.addOrbit(orbit);

    orbit.add(satelite);

    if (anchor) {
        orbit.position.set(anchor,0,0);
    }

    for (const index in planet.satelites) {
        const element = planet.satelites[index];
            
        createSatelite(element, orbit, planet.orbitRadius);
    }

    stellarObjects.push( [orbit, planet.orbitRotation] );

    system.add(orbit);
}

function createSphere(data, type = 'satelite') {
    
    var planes = 25;

    var sphereGeometry = new THREE.SphereGeometry( data.radius, planes, planes );

    if (type != 'satelite') {
        var texture = new THREE.TextureLoader().load('materials/star.jpg');
        var sphereMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
        
    } else {
        var sphereMaterial = new THREE.MeshPhongMaterial( {color: data.color, wireframe: false, flatShading: false} );
    }

    var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

    if (type == 'satelite') {
        sphere.position.set(data.orbitRadius,0,0);
    }

    if (data.skew) {
        sphere.rotation.x = data.skew;
    }

    stellarObjects.push( [sphere, data.rotation, data.name] );

    if (data.ring) {
        sphere.add(createRing(data.ring) )
    }
    
    var myText = new SpriteText(data.name);
    myText.fontFace = 'aAtmospheric'
    myText.scale.set(data.radius,data.radius/3,0)
    myText.center.set(0,0);
    myText.position.set(0,data.radius+0.1,0);
    sphere.add(myText);

    return sphere;
}

function createRing(data) {

    var radius = data.radius + data.width/2;

    var geometry = new THREE.TorusGeometry( radius, data.width/2 , 2, 30 );
    var texture = new THREE.TextureLoader().load('materials/ring.png');
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
    var torus = new THREE.Mesh( geometry, material );
    torus.rotation.x = Math.PI/2

    return torus
}

function createOrbit(data) {
    
    var orbit = new THREE.Object3D();
    let orbitPath = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        data.orbitRadius, data.orbitRadius,           // xRadius, yRadius
        -0.3, 0.6*Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0.3                 // aRotation
      );
    let points = orbitPath.getPoints( 50 );
    let orbitGeometry = new THREE.BufferGeometry().setFromPoints( points );
    let material = new THREE.LineBasicMaterial( { color : 0xffffff } );

    let orbitLine = new THREE.Line( orbitGeometry, material );
    orbitLine.rotation.x = Math.PI/2;

    orbit.add(orbitLine);

    orbit.rotation.x = data.orbitSkew
    return orbit;
}

var stellarForge = function(planetarySystem) {
        
    let data = planetarySystem.system;
    // data.position

    system.position.copy(planetarySystem.position);

    let star = createSphere( data.star, data.star.type );
    
    data.star.addMesh(star);

    system.add(star);

    for (const key in data.planets) {
        let planet = data.planets[key];
            
        createSatelite(planet, system);

    }

    return system;
};

export {stellarForge, stellarObjects as stellarForgeObjects};