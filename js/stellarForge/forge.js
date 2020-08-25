import {StarSystem} from './StarSystem.js';
import {StellarBody} from './StellarBody.js';
import {Star} from './Star.js';
import {Planet} from './Planet.js';
import {Ring} from './Ring.js';

var stellarObjects = [];
var atmospheres = [];
let system = new THREE.Object3D();
let systemData = null;

class ResourceTracker {
    constructor() {
      this.resources = new Set();
    }
    track(resource) {
      if (resource.dispose) {
        this.resources.add(resource);
      }
      return resource;
    }
    untrack(resource) {
      this.resources.delete(resource);
    }
    dispose() {
      for (const resource of this.resources) {
        resource.dispose();
      }
      this.resources.clear();
    }
}

const resTracker = new ResourceTracker();
const track = resTracker.track.bind(resTracker);
const loader = new THREE.TextureLoader();

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
    var sphereGeometry = track(new THREE.SphereGeometry( data.radius, planes, planes ));
    var texture, sphereMaterial;

    let textureDir = '';

    if (type != 'star') {
        textureDir = `materials/${systemData.name.toLowerCase()}/${data.texture}.png`;
        sphereMaterial = track(new THREE.MeshPhongMaterial({
                map: track(loader.load(textureDir)), 
                wireframe: false, 
                flatShading: false
            }));
    
    } else {
        textureDir = `materials/${data.texture}.png`;
        sphereMaterial = track(new THREE.MeshBasicMaterial({
            map: track(loader.load(textureDir)), 
            wireframe: false, 
            flatShading: false
        }));
    }

    var sphere = track(new THREE.Mesh( sphereGeometry, sphereMaterial ));

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

    if (data.atmosphere) {
        atmospheres.push({radius: data.radius, color: data.atmosphere.color, object: sphere})
        if (data.atmosphere.clouds) {
            sphere.add(createClouds(data))
        }    
    }

    var sprite = drawNameSprite(data.name, data.radius);
    sphere.add(sprite);

    return sphere;
}

function drawNameSprite(name = '', radius) {

    var text = name;
    var PIXEL_RATIO = (function() {
      var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
      return dpr / bsr;
    })();

    var createRetinaCanvas = function(w, h, ratio) {
      if (!ratio) {
        ratio = PIXEL_RATIO;
      }
      var can = document.createElement("canvas");
      can.width = w * ratio;
      can.height = h * ratio;
      can.style.width = w + "px";
      can.style.height = h + "px";
      can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
      return can;
    };

    function calcSize(text) {
        var bitmap = createRetinaCanvas(1024, 1024);
        var ctx = bitmap.getContext("2d", { antialias: true });
        ctx.font = "100px aAtmospheric";
        var metrics = ctx.measureText( text );
        
        return metrics.width
    }

    var width = calcSize(text);
    var bitmap = createRetinaCanvas(width, width);
    var ctx = bitmap.getContext("2d", { antialias: true });
    ctx.font = "100px aAtmospheric";

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText( text, width/2, width/2);

    var texture = track(new THREE.Texture(bitmap));
    texture.needsUpdate = true;
    var spriteMaterial = track(new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      alphaTest: 0.1,
      sizeAttenuation: false,
      transparent: true,
      depthTest: false
    }));

    var sprite = track(new THREE.Sprite(spriteMaterial));
    sprite.scale.set(0.2, 0.2, 1);
    sprite.position.set(0, radius+0.1, 0);
    sprite.renderOrder = 100;

    return sprite
}

function createRing(data) {

    var radius = data.radius + data.width/2;

    var geometry = track(new THREE.TorusGeometry( radius, data.width/2 , 2, 30 ));
    var material = track(new THREE.MeshBasicMaterial({ 
        map: track(loader.load('materials/ring.png')), 
        transparent: true 
    }));
    var torus = track(new THREE.Mesh( geometry, material ));
    torus.rotation.x = Math.PI/2

    return torus
}

function createOrbit(data) {
    
    var orbit = track(new THREE.Object3D());
    let orbitPath = track(new THREE.EllipseCurve(
        0,  0,            // ax, aY
        data.orbitRadius, data.orbitRadius,           // xRadius, yRadius
        -0.3, 0.6*Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0.3                 // aRotation
      ));
    let points = orbitPath.getPoints( 50 );
    let orbitGeometry = track(new THREE.BufferGeometry().setFromPoints( points ));
    let material = track(new THREE.LineBasicMaterial( { color : 0xffffff } ));

    let orbitLine = track(new THREE.Line( orbitGeometry, material ));
    orbitLine.rotation.x = Math.PI/2;

    orbit.add(orbitLine);

    orbit.rotation.x = data.orbitSkew
    return orbit;
}

function createClouds(data) {
        
    var planes = 25;
    var sphereGeometry = track(new THREE.SphereGeometry( data.radius+0.01, planes, planes ));

    let textureDir = `materials/${systemData.name.toLowerCase()}/${data.texture}_clouds.png`;
    let sphereMaterial = track(new THREE.MeshPhongMaterial({
        map: track(loader.load(textureDir)), 
        wireframe: false, 
        flatShading: false, 
        transparent: true
    }));

    var clouds = track(new THREE.Mesh( sphereGeometry, sphereMaterial ));

    return clouds;
}

var stellarForge = function(planetarySystem) {
        
    stellarObjects = [];
    atmospheres = [];

    systemData = planetarySystem.system;
    system.position.copy(planetarySystem.position);

    let star = createSphere( systemData.star, systemData.star.type );
    
    systemData.star.addMesh(star);

    system.add(star);

    for (const key in systemData.planets) {
        let planet = systemData.planets[key];
            
        createSatelite(planet, system);
    }

    // 
    // 
    // add Light to the scene
    var light = track(new THREE.AmbientLight( 0x606060 )); // soft white light
    var starLight = track(new THREE.PointLight( planetarySystem.light, 1.2 ));
    
    system.add( light );
    system.add( starLight );

    return system;
};

export {resTracker, stellarForge, stellarObjects as stellarForgeObjects, atmospheres as stellarForgeAtmospheres, StarSystem, StellarBody, Star, Planet, Ring};