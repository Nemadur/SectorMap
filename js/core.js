
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

    camera.position.z = 20;

    var update = function(){
        sun.rotation.y += 0.001;
        earth.rotation.y += 0.005;
        moon.rotation.y += 0.01;

        earthOrbit.rotation.y += 0.01;
        moonOrbit.rotation.y += 0.1;
    };

    var render = function () {
        renderer.render(scene, camera);
    };

    var loop = function () {
        requestAnimationFrame( loop );

        update();
        render();

    }

    loop();

}
