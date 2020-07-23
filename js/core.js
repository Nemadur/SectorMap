
$(document).ready(core_init);
window.semantic_init = core_init;

function core_init() {
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

    
    var geometrySun = new THREE.SphereGeometry( 5, 32, 32 );
    var geometryEarth = new THREE.SphereGeometry( 1, 10, 10 );
    var geometryMoon = new THREE.SphereGeometry( 0.3, 10, 10 );
    var materialSun = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
    var materialEarth = new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe: true} );
    var materialMoon = new THREE.MeshBasicMaterial( {color: 0xcccccc, wireframe: true} );

    var earthOrbit = new THREE.Object3D();
    var moonOrbit = new THREE.Object3D();

    var sun = new THREE.Mesh( geometrySun, materialSun );
    var earth = new THREE.Mesh( geometryEarth, materialEarth );
    var moon = new THREE.Mesh( geometryMoon, materialMoon );
    
    sun.position.set(0,0,0);

    scene.add( sun );
    scene.add( earthOrbit );
    earthOrbit.add(earth);
    earthOrbit.add(moonOrbit);
    moonOrbit.add(moon);

    earth.position.set(10,0,0);
    moonOrbit.position.set(10,0,0);
    moon.position.set(2,0,0);

    moonOrbit.rotation.x = 0.3;
    earth.rotation.x = 0.15;
    camera.position.z = 20;

    // orbits visualization
    var earthPath = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        10, 10,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0.3                 // aRotation
      );
    var moonPath = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        2, 2,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0.3                 // aRotation
      );
      
    var pointsE = earthPath.getPoints( 50 );
    var pointsM = moonPath.getPoints( 50 );

    var geometryE = new THREE.BufferGeometry().setFromPoints( pointsE );
    var geometryM = new THREE.BufferGeometry().setFromPoints( pointsM );

    var material = new THREE.LineBasicMaterial( { color : 0xffffff } );
    
    // Create the final object to add to the scene
    var ellipseE = new THREE.Line( geometryE, material );
    var ellipseM = new THREE.Line( geometryM, material );
    
    ellipseE.rotation.x = Math.PI/2;
    ellipseM.rotation.x = Math.PI/2;

    scene.add(ellipseE);
    earth.add(ellipseM);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    
    function onMouseMove( event ) {
    
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
    
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }
    
    window.addEventListener( 'mousemove', onMouseMove, false );

    var update = function(){
        sun.rotation.y += 0.001;
        earth.rotation.y += 0.005;
        moon.rotation.y += 0.01;

        earthOrbit.rotation.y += 0.005;
        moonOrbit.rotation.y += 0.01;
    };

    function render() {
    
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );
    
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( scene.children, true );
    
        sun.material.color.set(0xffff00);
        earth.material.color.set(0x0000ff);
        moon.material.color.set(0xcccccc);

        for (const objects of intersects) {

            if (objects.object.type != 'Mesh') {
                continue
            }
            objects.object.material.color.set( 0x00ff00 );
            break;

        }

        renderer.render( scene, camera );
    
    }

    var loop = function () {
        requestAnimationFrame( loop );

        update();
        render();

    }

    loop();

}
