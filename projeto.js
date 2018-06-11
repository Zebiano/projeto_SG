var renderer = null,
    scene = null,
    camera = null,
    mesh = null;
var loader;
var porta;

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
    directionalLight.position.set(50, 50, 50)
    scene.add(directionalLight);
    var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(helper);

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 70, 200);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    //CASA DE BANHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    //Chao
    var wcchaoGEO = new THREE.BoxGeometry(100, 1, 50);
    var texture = new THREE.TextureLoader().load('img/wcfloor.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var wcchao = new THREE.Mesh(wcchaoGEO, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(7, 4);
    wcchao.position.set(50, 0, 25)
    scene.add(wcchao);

    //Parede esquerda
    var geometry = new THREE.BoxGeometry(1, 50, 50);
    var texture = new THREE.TextureLoader().load('img/wc.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    scene.add(paredeEsquerda);
    paredeEsquerda.position.set(0, 25, 25)

    //Parede direita
    var geometry = new THREE.BoxGeometry(1, 50, 50);
    var texture = new THREE.TextureLoader().load('img/wc2.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var paredeDireita = new THREE.Mesh(geometry, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    scene.add(paredeDireita);
    paredeDireita.position.set(100, 25, 25)

    //Parede fundo
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(50, 25, 0)

    //Parede meio
    var geometry = new THREE.BoxGeometry(70, 50, 1);
    var paredeMeioD = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioD);
    paredeMeioD.position.set(35, 25, 50)

    var geometry = new THREE.BoxGeometry(12.5, 50, 1);
    var paredeMeioE = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioE);
    paredeMeioE.position.set(94, 25, 50)

    var geometry = new THREE.BoxGeometry(18, 20, 1);
    var paredeMeioP = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioP);
    paredeMeioP.position.set(79, 40, 50)

    //SALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    //Chao
    var salachaoGeo = new THREE.BoxGeometry(100, 1, 100);
    var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var salachao = new THREE.Mesh(salachaoGeo, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 7);
    salachao.position.set(50, 0, 100)
    scene.add(salachao);

    //Parede meio
    var geometry = new THREE.BoxGeometry(70, 50, 1);
    var texture = new THREE.TextureLoader().load('img/sala.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var paredeMeioD = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioD);
    paredeMeioD.position.set(35, 25, 50.5)

    var geometry = new THREE.BoxGeometry(12.5, 50, 1);
    var paredeMeioE = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioE);
    paredeMeioE.position.set(94, 25, 50.5)

    var geometry = new THREE.BoxGeometry(18, 20, 1);
    var paredeMeioP = new THREE.Mesh(geometry, material);
    scene.add(paredeMeioP);
    paredeMeioP.position.set(79, 40, 50.5)

    //Parede perto
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(50, 25, 150)

    //Parede esquerda
    var geometry = new THREE.BoxGeometry(1, 50, 100);
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    scene.add(paredeEsquerda);
    paredeEsquerda.position.set(0, 25, 100)

    //Parede direita
    var geometry = new THREE.BoxGeometry(1, 50, 100);
    var paredeDireita = new THREE.Mesh(geometry, material);
    scene.add(paredeDireita);
    paredeDireita.position.set(100, 25, 100)

    loader = new THREE.OBJLoader();

/*

    RESUMIDAMENTE: 
    1. A PROF ACHA QUE TAO CORRUMPIDOS OS FICHEIROS .PNG E POR CAUSA DISSO DA LOAD MAL
    2. DIZ PARA NAO USARMOS UMA PORTA TAO COMPLICADA... NORMALMENTE OS OBJETOS NAO DAO LOAD DIREITO NO 3JS. O FIUZA TAVA A TENTAR IMPORTAR O CARRO E FALTAMLHE IMENSAS "SIDES" DO CARRO TMB
    3. PELOS VISTOS E O REAL NO-GO TERMOS POR EXEMPLO NA CASA DE BANHO AS TEXTURAS DAS PAREDES OUT OF SYNC... ELA NAO GOSTOU NADA
    4. TAL COMO TMB NAO GOSTOU COM AS TEXTURA DAS PAREDES DA SALA E GOZOU COM ISSO AHAH :(
    OU SEJA, PROCURAR MODELOS MAIS BASICOS AUMENTA AS PROBABILIDADES DE O 3JS FUNCIONAR BEM. ESTE PROJETO VAI TER QUE TER COISAS SIMPLES.

*/

    // tentativa 1
    /*loader.load("models/porta.obj", function (porta) {
        // Add the loaded object to the scene
        porta.rotation.x = Math.PI / 2
        porta.scale.set(1.7, 1.7, 1.7)
        porta.position.set(78.5, 18, 44)

        // upload image for texture
        var textObj = new THREE.TextureLoader().load('models/porta.png');
        // Go through all children of the loaded object and search for a Mesh
        porta.traverse(function (child) {
            // This allow us to check if the children is an instance of the Mesh constructor
            if (child instanceof THREE.Mesh) {
                child.material.map = textObj;
            }
        });

        scene.add(porta);
        renderer.render(scene, camera);
    });*/

    
    // tentativa 2
    // PORTAAAAAAAAAAAAAAAAA
    /*var mtlLoader = new THREE.MTLLoader(); // instantiate a loader
    mtlLoader.load('models/porta.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/porta.obj', function (object) {// load a geometry resource
            porta = object;
            porta.rotation.x = Math.PI / 2
            porta.scale.set(1.7, 1.7, 1.7)
            porta.position.set(78.5, 18, 44);


             // upload image for texture
            var textPorta = new THREE.TextureLoader().load('models/porta.png');
            porta.children[0].material.map = textPorta;
            porta.children[1].material.map = textPorta;
            var textVidro = new THREE.TextureLoader().load('models/v.jpg');
            porta.children[2].material.map = textVidro;

            scene.add(porta);
        });
    });*/





    //ARMARIOOOOOOOOOOOOOO
    /*var mtlLoader = new THREE.MTLLoader(); // instantiate a loader
    mtlLoader.load('models/armario.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/armario.obj', function (object) {// load a geometry resource
            armario = object;
            armario.rotation.y = -Math.PI / 2
            armario.scale.set(0.021, 0.021, 0.021)
            armario.position.set(95, 0, 105)
            scene.add(armario);
        });
    });*/

    //SANITAAAAAAAA
    /*var objLoader = new THREE.OBJLoader(); // instantiate a loader
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader.load('models/Toilet.obj', function (object) {// load a geometry resource
        sanita = object;
        sanita.scale.set(0.15, 0.15, 0.15)
        sanita.position.set(80, 9, 7)
        scene.add(sanita);

        //animate()
    });*/

    //BANHEIRAAAAAA
    /*var objLoader = new THREE.OBJLoader(); // instantiate a loader
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader.load('models/bathtube.obj', function (object) {// load a geometry resource
        banheira = object;
        banheira.rotation.x = -Math.PI / 2
        banheira.rotation.z = -Math.PI / 2
        banheira.position.set(42, 9.5, 25)
        banheira.scale.set(0.17, 0.17, 0.17)
        scene.add(banheira);
    });*/

    //LAVATORIOOOOOOO
    /*var objLoader = new THREE.OBJLoader(); // instantiate a loader
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader.load('models/Sink.obj', function (object) {// load a geometry resource
        sink = object;
        sink.scale.set(0.5, 0.5, 0.5)
        sink.position.set(55, 9.5, 5)
        scene.add(sink);
        //animate()
    });*/

    //MESAAAAAAAAAAAAA
    /*var mtlLoader = new THREE.MTLLoader(); // instantiate a loader
    mtlLoader.load('models/mesa.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/mesa.obj', function (object) {// load a geometry resource
            mesa = object;
            mesa.scale.set(0.15, 0.15, 0.15)
            mesa.position.set(35, 0, 55)
            scene.add(mesa);
        });
    });*/

    //CADEIRAAAAAAAAA
    /*var mtlLoader = new THREE.MTLLoader(); // instantiate a loader
    mtlLoader.load('models/cadeira.mtl', function (materials) {
        materials.preload(); // load a material’s resource
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        //objLoader.setPath("http://threejs.org/examples/obj/walt/");
        objLoader.load('models/cadeira.obj', function (object) {// load a geometry resource
            cadeira = object;
            cadeira.scale.set(0.02, 0.02, 0.02)
            cadeira.position.set(50, 0, 87)
            cadeira.rotation.y = Math.PI / 2
            scene.add(cadeira);
        });
    });*/
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