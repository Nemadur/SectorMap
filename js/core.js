import { RGBELoader } from './RGBELoader.js';
import * as systems from '../systems/systemCentral.js';
import { stellarForge, stellarForgeObjects, stellarForgeAtmospheres } from './stellarForge/forge.js';

var temp = new THREE.Vector3;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);

let stellarObjects = [];
let atmospheres = [];
let selectedObject = null;
let focusObject = null;
let system = null;
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.OrbitControls( camera, renderer.domElement);

function core_init() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement );

    // resize handler
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);

        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    });

    window.addEventListener('dblclick', function () {
        
        if (selectedObject) {
            var positions = selectedObject.position
            controls.target.set(positions.x, positions.y, positions.z);
            camera.lookAt(positions.x, positions.y, positions.z)
        }
        focusObject = selectedObject;

    });

    // 
    // 
    // stellarForge
    loadSystem();
    camera.position.set(0,10,20);
    camera.lookAt(0,0,0);

    // 
    // 
    // UI 
    document.getElementById('system-name').innerHTML = system.system.name;
    document.getElementById('description').innerHTML = system.description;

    // 
    // 
    // Random placement
    stellarObjects.forEach(ob => {
        ob[0].rotation.y +=Math.random() * (Math.PI*2);
    })

    // 
    // 
    // Target sprite
    var spriteMap = new THREE.TextureLoader().load( "./materials/target.svg" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, depthTest: false } );
    var sprite = new THREE.Sprite( spriteMaterial );

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    
    function onMouseMove( event ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }
    
    window.addEventListener( 'mousemove', onMouseMove, false );


    // 
    // 
    // HDR Map
    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .load( 'materials/space_low.hdr', function ( texture ) {
        var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();
    } );

    // 
    // 
    // U P D A T E
    let clock = new THREE.Clock();
    let delta = 0;
    // 30 fps
    let interval = 1 / 30;
    let scalar = -0.1;
    let scalarStep = 0.01
    let speedFactor = 0.3;

    var update = function(){

        for (let atm = 0; atm < atmospheres.length; atm++) {
            const atmosphere = atmospheres[atm];
            let vector3 = new THREE.Vector3();
            atmosphere.object.getWorldPosition(vector3);
            atmosphere.glow.position.copy(vector3);
            atmosphere.glow.material.uniforms.viewVector.value = 
                new THREE.Vector3().subVectors( camera.position, atmosphere.glow.position );
        }

        for (let index = 0; index < stellarObjects.length; index++) {
            const body = stellarObjects[index];
            body[0].rotation.y +=body[1] * speedFactor
        }

        if (scalar > 0.1) {
            scalarStep = -0.01;
        }
        if (scalar < -0.1) {
            scalarStep = 0.01;
        }

        scalar += scalarStep

        sprite.scale.x += scalar;
        sprite.scale.y += scalar;
    };

    function render() {
    
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
    
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( scene.children, true );
        var intercetFlag = false;

        for (const objects of intersects) {

            if (objects.object.type != 'Mesh' || !objects.object.children.length ) {
                continue
            }

            intercetFlag = true;

            if (!selectedObject || selectedObject.uuid != objects.object.uuid) {

                selectedObject = objects.object;

                var scale = objects.object.geometry.boundingSphere.radius * 2 +2;
                sprite.scale.set(scale,scale,0)
                scalar = -0.1;
                scalarStep = 0.01
                selectedObject.add(sprite);
            }

            break;
        }

        if (!intercetFlag && selectedObject) {
            selectedObject.remove(sprite);
            selectedObject = null
        }

        if (focusObject) {

            temp.setFromMatrixPosition(focusObject.matrixWorld);

            let radius = focusObject.geometry.boundingSphere.radius * 1.3;
            temp.y += radius+2;
            temp.x += radius+2;
            temp.z += radius+2;
            var v3 = new THREE.Vector3();
            camera.position.lerp(temp, 0.2);
            camera.lookAt( focusObject.getWorldPosition(v3) );
            
        }

        renderer.render( scene, camera );
    
    }

    var loop = function () {
        requestAnimationFrame( loop );
        delta += clock.getDelta();
        if (delta >= interval) {
            
            update();
            render();

            delta = delta % interval;
        }
    }

    loop();
}

window.onload = core_init();

function abortChild(object) {

    while (object.children.length > 0) {

        let parent = object.children[0];
        while (parent.children.length > 0) {
            abortChild(parent.children[0]);
            object.remove(object.children[0])
        }
        
    }
    
}

function clearCosmos() {
    if (scene.children[0]) {
        // abortChild(scene.children[0]);
    }
    while(scene.children.length > 0){ 
        scene.children[0].dispose;
        scene.remove(scene.children[0]); 
    }

    stellarObjects = [];
    atmospheres = [];
    selectedObject = null;
    focusObject = null;
}

function loadSystem(systemName) {

    clearCosmos();
    debugger

    let targetSystem = systems.Thozetis;

    system = new targetSystem(new THREE.Vector3(0, 0,0));
    scene.add(stellarForge(system));
    stellarObjects = stellarForgeObjects;
    atmospheres = stellarForgeAtmospheres;

    createAtmosphere();
}

function createAtmosphere() {
    for (let index = 0; index < atmospheres.length; index++) {
        const atmos = atmospheres[index];
        
        var atmGeom = new THREE.SphereGeometry(atmos.radius, 32, 16);
        var atmMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: 
            { 
                "c":   { type: "f", value: 0.4 },
                "p":   { type: "f", value: 3 },
                glowColor: { type: "c", value: new THREE.Color(atmos.color) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        var glow = new THREE.Mesh( atmGeom.clone(), atmMaterial.clone() );
        glow.position.set(0,0,0)
        glow.scale.multiplyScalar(1.2);
        atmospheres[index].glow = glow;

        scene.add( glow );
    }
}

let changeBtn = document.getElementById('changeBtn');

changeBtn.onclick = function test(params) {
    loadSystem('neoThozetis');
};