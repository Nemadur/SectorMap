import { RGBELoader } from './RGBELoader.js';
import { PlanetarySystem } from '../systems/solarSystem.js';
import { stellarForge, stellarForgeObjects } from './stellarForge/forge.js';

$(document).ready(core_init);

let stellarObjects = [];
let selectedObject = null;
var temp = new THREE.Vector3;
let focusObject = null;

function core_init() {
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    var renderer = new THREE.WebGLRenderer();
    var controls = new THREE.OrbitControls( camera, renderer.domElement);

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
    scene.add(stellarForge(new PlanetarySystem(new THREE.Vector3(0, 0,0))));
    stellarObjects = stellarForgeObjects;
    camera.position.set(0,10,20);
    camera.lookAt(0,0,0);


    // 
    // 
    // add Light to the scene
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    var starLight = new THREE.PointLight( 0xffffff, 1 );
    
    scene.add( light );
    scene.add( starLight );


    // 
    // 
    // Random placement
    stellarObjects.forEach(ob => {
        ob[0].rotation.y +=Math.random() * (Math.PI*2);
    })


    // 
    // 
    // GLOW
    var sphereGeom = new THREE.SphereGeometry(4, 32, 16);
	var customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: 
            { 
                "c":   { type: "f", value: 0.4 },
                "p":   { type: "f", value: 3 },
                glowColor: { type: "c", value: new THREE.Color(0xffff00) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }   );
            
    var moonGlow = new THREE.Mesh( sphereGeom.clone(), customMaterial.clone() );
    moonGlow.position.set(0,0,0)
    moonGlow.scale.multiplyScalar(1.2);
    scene.add( moonGlow );

    var sphereGeom = new THREE.SphereGeometry(1, 25, 16);
	var customMaterial = new THREE.ShaderMaterial( 
        {
            uniforms: 
            { 
                "c":   { type: "f", value: 0.4 },
                "p":   { type: "f", value: 3 },
                glowColor: { type: "c", value: new THREE.Color(0xa0a0ff) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        }   );
            
    var earthGlow = new THREE.Mesh( sphereGeom.clone(), customMaterial.clone() );
    earthGlow.position.set(0,0,0)
    earthGlow.scale.multiplyScalar(1.2);
    scene.add( earthGlow );


    // 
    // 
    // Target sprite
    var spriteMap = new THREE.TextureLoader().load( "./materials/target.svg" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
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

    var update = function(){

        for (let index = 0; index < stellarObjects.length; index++) {
            const body = stellarObjects[index];
            body[0].rotation.y +=body[1]
        }

        if (scalar > 0.1) {
            scalarStep = -0.01;
        }
        if (scalar < -0.1) {
            scalarStep = 0.01;
        }

        moonGlow.material.uniforms.viewVector.value = 
        new THREE.Vector3().subVectors( camera.position, moonGlow.position );
        
        var v3 = new THREE.Vector3();
        stellarObjects[5][0].getWorldPosition(v3)
        earthGlow.position.copy( v3) ;
        earthGlow.material.uniforms.viewVector.value = 
        new THREE.Vector3().subVectors( camera.position, earthGlow.position );


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

            if (objects.object.type != 'Mesh') {
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