var renderer = null,
    scene = null,
    camera = null,
    mesh = null;
var loader;
var porta
    ;


window.onload = function init() {
    // Create the Three.js renderer
    renderer = new THREE.WebGLRenderer();
    // Set the viewport 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#AAAAAA");
    document.body.appendChild(renderer.domElement);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    //Luzes
    var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(50,50,50)
    scene.add(directionalLight);
    var helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    scene.add( helper );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 70, 200);
    scene.add(camera);


    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    //Chao
    var geometry = new THREE.BoxGeometry(100, 1, 150);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var chao = new THREE.Mesh(geometry, material);
    scene.add(chao);
    chao.position.set(50, 0, 75)

    //Parede direita
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshBasicMaterial({ color: 0x4271f4 });
    var paredeDireita = new THREE.Mesh(geometry, material);
    scene.add(paredeDireita);
    paredeDireita.position.set(100, 25, 75)

    //Parede esquerda
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshBasicMaterial({ color: 0x4271f4 });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    scene.add(paredeEsquerda);
    paredeEsquerda.position.set(0, 25, 75)

    //Parede fundo
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x4271f4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(50, 25, 0)

    //Parede perto
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x4271f4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(50, 25, 150)
    
    //Parede meio
     var geometry = new THREE.BoxGeometry(70, 50, 1);
     var material = new THREE.MeshBasicMaterial({ color: 0x93b2ff});
     var paredeMeioD = new THREE.Mesh(geometry, material);
     scene.add(paredeMeioD);
     paredeMeioD.position.set(35, 25, 50)

     var geometry = new THREE.BoxGeometry(12.5, 50, 1);
     var material = new THREE.MeshBasicMaterial({ color: 0x93b2ff});
     var paredeMeioE = new THREE.Mesh(geometry, material);
     scene.add(paredeMeioE);
     paredeMeioE.position.set(94, 25, 50)

     var geometry = new THREE.BoxGeometry(18, 20, 1);
     var material = new THREE.MeshBasicMaterial({ color: 0x93b2ff});
     var paredeMeioP = new THREE.Mesh(geometry, material);
     scene.add(paredeMeioP);
     paredeMeioP.position.set(79, 40, 50)

    
    // instantiate a loader
    //PORTAAAAAAAAAAAAAAAAA
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/porta.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/porta.obj', function (object) {// load a geometry resource
            porta = object;
            porta.rotation.x = Math.PI/2
            porta.scale.set(1.7,1.7,1.7)
            porta.position.set(78.5, 18, 44)
            scene.add(porta);
        });
    });

    //ARMARIOOOOOOOOOOOOOO
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('models/armario.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/armario.obj', function (object) {// load a geometry resource
            armario = object;
            armario.scale.set(0.1,0.1,0.1)
            scene.add(armario);
        });
    });

    //animate()


}

/*
document.onkeypress = function handleKeyPress(event) {
    //Get unshifted key character
    var key = event.keyCode;

    console.log(key)

    switch (key) {
        case 38:
            direcao = "cima"
            rotX += 0.05
            break;
        case 39:
            direcao = "direita"
            rotY += 0.05
            break;
        case 37:
            direcao = "esquerda"
            rotY -= 0.05
            break;
        case 40:
            direcao = "baixo"
            rotX -= 0.05
            break;
    }
}

function animate() {
    if (direcao == "cima") {
        mesh.rotation.x += rotX
    }
    else if (direcao == "direita") {
        mesh.rotation.y += rotY
    }
    else if (direcao == "esquerda") {
        mesh.rotation.y += rotY
    }
    else if (direcao == "baixo") {
        mesh.rotation.x += rotX
    }
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate)
}*/