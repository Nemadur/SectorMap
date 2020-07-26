import { RGBELoader } from './RGBELoader.js';
import { corvus } from './corvus.js';

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

    scene.add(createSystem(corvus.systems[0]));
    stellarObjects.forEach(ob => {
        ob[0].rotation.y +=Math.random() * (Math.PI*2);
    })



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




    //
    //
    //
    // stellarForge
    function createSystem(data) {
        
        let system = new THREE.Object3D();
        system.position.set(
            data.position.x,
            data.position.y,
            data.position.z
        );

        let star = createSphere( data.star, data.star.type );
        
        system.add(star);

        for (const key in data.planets) {
            let planet = data.planets[key];
                
            createSatelite(planet, system);

        }

        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        var light1 = new THREE.PointLight( 0xffffff, 1 );
        
        scene.add( light );
        scene.add( light1 );

        return system;
    }

    function createSatelite(data, system, anchor = 0 ) {
        
        let orbit = createOrbit(data);
        let satelite = createSphere(data);

        orbit.add(satelite);

        if (anchor) {
            orbit.position.set(anchor,0,0);
        }

        for (const index in data.satelite) {
            const element = data.satelite[index];
                
            createSatelite(element, orbit, data.orbitRadius);
        }

        stellarObjects.push( [orbit, data.orbitRotation] );

        system.add(orbit);
    }

    function createSphere(data, type = 'satelite') {
        
        // var planes = type=='satelite' ? 20 : 40;
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

        stellarObjects.push( [sphere, data.rotation] );

        if (data.ring) {
            sphere.add(createRing(data.ring) )
        }

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
    
    camera.position.set(0,10,20);
    camera.lookAt(0,0,0);

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

    let scalar = -0.1;
    let scalarStep = 0.01



    let clock = new THREE.Clock();
    let delta = 0;
    // 30 fps
    let interval = 1 / 30;

    var update = function(){

        stellarObjects.forEach(ob => {
            ob[0].rotation.y +=ob[1]
        })

        if (scalar > 0.1) {
            scalarStep = -0.01;
        }
        if (scalar < -0.1) {
            scalarStep = 0.01;
        }

        moonGlow.material.uniforms.viewVector.value = 
        new THREE.Vector3().subVectors( camera.position, moonGlow.position );
        
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