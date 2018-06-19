var renderer = null,
    scene = null,
    camera = null,
    mesh = null;
var loader;
var porta;
var cadeira, cadeira2, cadeira3, cadeira4;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var selectedObject;

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
    // camera.position.set(50, 70, 200);
    camera.position.set(40, 40, 75);
    scene.add(camera);

    // controls = new THREE.OrbitControls(camera);
    // controls.addEventListener('change', function () { renderer.render(scene, camera); });

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    //CASA DE BANHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    //Chao
    var wcchaoGEO = new THREE.BoxGeometry(100, 1, 150);
    var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var wcchao = new THREE.Mesh(wcchaoGEO, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    //wcchao.position.set(50, 0, 75)
    scene.add(wcchao);

    //Parede esquerda
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshBasicMaterial({ color: 0xefe5bd });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    scene.add(paredeEsquerda);
    //paredeEsquerda.position.set(0, 25, 75)
    paredeEsquerda.position.set(-50, 25, 0)

    //Parede direita
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var paredeDireita = new THREE.Mesh(geometry, material);
    scene.add(paredeDireita);
    //paredeDireita.position.set(100, 25, 75)
    paredeDireita.position.set(50, 25, 0)

    //Parede fundo
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    // paredeFundo.position.set(50, 25, 0)
    paredeFundo.position.set(0, 25, -75)


    //Parede perto
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    // paredeFundo.position.set(50, 25, 150)
    paredeFundo.position.set(0, 25, 75)

    loader = new THREE.OBJLoader();

    /*
    
        RESUMIDAMENTE: 
        1. A PROF ACHA QUE TAO CORRUMPIDOS OS FICHEIROS .PNG E POR CAUSA DISSO DA LOAD MAL
        2. DIZ PARA NAO USARMOS UMA PORTA TAO COMPLICADA... NORMALMENTE OS OBJETOS NAO DAO LOAD DIREITO NO 3JS. O FIUZA TAVA A TENTAR IMPORTAR O CARRO E FALTAMLHE IMENSAS "SIDES" DO CARRO TMB
        3. PELOS VISTOS E O REAL NO-GO TERMOS POR EXEMPLO NA CASA DE BANHO AS TEXTURAS DAS PAREDES OUT OF SYNC... ELA NAO GOSTOU NADA
        4. TAL COMO TMB NAO GOSTOU COM AS TEXTURA DAS PAREDES DA SALA E GOZOU COM ISSO AHAH :(
        OU SEJA, PROCURAR MODELOS MAIS BASICOS AUMENTA AS PROBABILIDADES DE O 3JS FUNCIONAR BEM. ESTE PROJETO VAI TER QUE TER COISAS SIMPLES.
    
    */

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

    //MESAAAAAAAAAAAAA
    var texture = new THREE.TextureLoader().load('img/mesa.png');
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var objLoader = new THREE.OBJLoader();
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader.load('models/mesa.obj', function (object) {// load a geometry resource
        mesa = object;
        for (var i = 0; i < mesa.children.length; i++) {
            mesa.children[i].material = material
        }
        mesa.scale.set(0.15, 0.15, 0.15)
        // mesa.position.set(35, 0, 55)
        mesa.position.set(35-50, 0, 55-75)
        scene.add(mesa);
        renderer.render(scene, camera);
    });

    var textureSofa = new THREE.TextureLoader().load('img/sofa.jpg');
    var materialSofa = new THREE.MeshBasicMaterial({ map: textureSofa });
    var objLoader2 = new THREE.OBJLoader();
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader2.load('models/sofa.obj', function (object) {// load a geometry resource
        sofa = object;
        sofa.scale.set(20, 20, 20)
        for (var i = 0; i < sofa.children.length; i++) {
            sofa.children[i].material = materialSofa
        }
        scene.add(sofa);
        sofa.position.set(-50,0,-75)
        renderer.render(scene, camera);
    });

    //CADEIRAAAAAAAAA
    var texture2 = new THREE.TextureLoader().load('img/cadeira.jpg');
    var material2 = new THREE.MeshBasicMaterial({ map: texture2 });
    objLoader.load('models/cadeira.obj', function (object) {// load a geometry resource
        cadeira = object;
        cadeira.scale.set(0.02, 0.02, 0.02)
        // cadeira.position.set(50, 0, 87)
        cadeira.position.set(0, 0, 87-75)
        cadeira.rotation.y = Math.PI / 2
        for (var i = 0; i < cadeira.children.length; i++) {
            cadeira.children[i].material = material2
        }
        scene.add(cadeira);

        cadeira2 = cadeira.clone()
        // cadeira2.position.set(50, 0, 102)
        cadeira2.position.set(0, 0, 102-75)
        scene.add(cadeira2)

        cadeira3 = cadeira.clone()
        // cadeira3.position.set(40, 0, 95)
        cadeira3.position.set(-10, 0, 25)
        cadeira3.rotation.y = 3 * Math.PI / 2
        scene.add(cadeira3)

        cadeira4 = cadeira3.clone()
        // cadeira4.position.set(40, 0, 110)
        cadeira4.position.set(-10, 0, 110-75)
        scene.add(cadeira4)
        renderer.render(scene, camera);

    });


    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        }));
        plane.rotation.x = -Math.PI / 2
    scene.add(plane);

    renderer.render(scene, camera);
}




window.addEventListener("mousedown", onMouseDown)
function onMouseDown(event) {

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // search for intersections
    var intersects = raycaster.intersectObjects(cadeira.children);
    if (intersects.length > 0) {
        console.log(intersects)
        // controls.enabled = false;
        
        // gets intersect object (global variable)
        selectedObject = cadeira;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset (global variable)
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
        console.log(offset)
    }
    var intersects2 = raycaster.intersectObjects(cadeira2.children);
    if (intersects2.length > 0) {
        console.log(intersects2)

        // controls.enabled = false;
        // gets intersect object (global variable)
        selectedObject = cadeira2;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset (global variable)
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
    }

    var intersects3 = raycaster.intersectObjects(cadeira3.children);
    if (intersects3.length > 0) {
        console.log(intersects3)

        // controls.enabled = false;
        // gets intersect object (global variable)
        selectedObject = cadeira3;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset (global variable)
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
    }

    var intersects4 = raycaster.intersectObjects(cadeira4.children);
    if (intersects4.length > 0) {
        console.log(intersects3)

        // controls.enabled = false;
        // gets intersect object (global variable)
        selectedObject = cadeira4;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset (global variable)
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
    }
}

window.addEventListener("mousemove", onMouseMove)
function onMouseMove(event) {
    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    if (selectedObject) {
        //drag an object around if we've already clicked on one
        var intersects = raycaster.intersectObject(plane);
        // selectedObject.position.copy(intersects[0].point.sub(offset));
        selectedObject.position.x = intersects[0].point.sub(offset).x;

        console.log(selectedObject.position)

        renderer.render(scene, camera);
        
    }
    // else {//reposition the plane ?
    //     var intersects = raycaster.intersectObjects(objects);
    //     if (intersects.length > 0)
    //         plane.position.copy(intersects[0].object.position);
    // }
}

window.addEventListener("mouseup", onMouseUp)
function onMouseUp(event) {
    selectedObject = null;
    // controls.enabled = true;
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