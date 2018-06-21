var renderer = null,
    scene = null,
    camera = null,
    mesh = null;
var loader;
var porta;
var cadeira, cadeira2, cadeira3, cadeira4, botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, movel;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var selectedObject;
var ambientLight;
var porta2Mexer = false
var soma = 0.01

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
    ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // soft white light
    scene.add(ambientLight);
    ambientLight.castShadow = true

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(15.7, 124.9, 64.7)
    directionalLight.castShadow = true
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

    

    //CASA DE BANHOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    //Chao
    var chaoGEO = new THREE.BoxGeometry(100, 1, 150);
    var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var chao = new THREE.Mesh(chaoGEO, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    chao.receiveShadow = true
    texture.repeat.set(10, 10);
    scene.add(chao);
    

    //Parede esquerda
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    scene.add(paredeEsquerda);
    paredeEsquerda.position.set(-50, 25, 0)

    //Parede direita
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var paredeDireita = new THREE.Mesh(geometry, material);
    scene.add(paredeDireita);
    paredeDireita.position.set(50, 25, 0)

    //Parede fundo
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(0, 25, -75)


    //Parede perto
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var paredeFundo = new THREE.Mesh(geometry, material);
    scene.add(paredeFundo);
    paredeFundo.position.set(0, 25, 75)


    //MESAAAAAAAAAAAAA
    var texture = new THREE.TextureLoader().load('img/mesa.png');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var objLoader = new THREE.OBJLoader();
    objLoader.load('models/mesa.obj', function (object) {// load a geometry resource
        mesa = object;
        for (var i = 0; i < mesa.children.length; i++) {
            mesa.children[i].material = material
        }
        mesa.scale.set(0.15, 0.15, 0.15)
        // mesa.position.set(35, 0, 55)
        mesa.position.set(35 - 50, 0, 55 - 75)
        mesa.receiveShadow = true    
        mesa.castShadow = true        
        scene.add(mesa);
        renderer.render(scene, camera);
    });

    //TVVVVVVVVVVVVVVVVVV
    var tvMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var objLoader = new THREE.OBJLoader();
    objLoader.load('models/televisao.obj', function (object) {// load a geometry resource
        tv = object;
        for (var i = 0; i < tv.children.length; i++) {
            tv.children[i].material = tvMaterial
        }
        tv.rotation.y = - Math.PI / 2
        tv.scale.set(0.4, 0.4, 0.4)
        tv.position.set(48, 20, -55)
        scene.add(tv);
        renderer.render(scene, camera);
    });

    //SOFAAAAAAAAAAAAAAA
    var textureSofa = new THREE.TextureLoader().load('img/sofa.jpg');
    var materialSofa = new THREE.MeshPhongMaterial({ map: textureSofa });
    var objLoader2 = new THREE.OBJLoader();
    objLoader2.load('models/sofa.obj', function (object) {// load a geometry resource
        sofa = object;
        sofa.scale.set(20, 20, 20)
        for (var i = 0; i < sofa.children.length; i++) {
            sofa.children[i].material = materialSofa
        }
        scene.add(sofa);
        sofa.position.set(-15, 0, -40)
        sofa.rotation.y = Math.PI / 2
        renderer.render(scene, camera);
    });

    //MOVEEEEEEEEEL
    var textureMovel = new THREE.TextureLoader().load('img/mesa.png');
    var materialMovel = new THREE.MeshPhongMaterial({ map: textureMovel });
    var objLoader3 = new THREE.OBJLoader();
    //objLoader.setPath("http://threejs.org/examples/obj/walt/");
    objLoader3.load('models/movel.obj', function (object) {// load a geometry resource
        movel = object;
        movel.scale.set(0.02, 0.02, 0.02)
        for (var i = 0; i < movel.children.length; i++) {
            movel.children[i].material = materialMovel
        }
        movel.position.set(45, 7, -40)
        movel.rotation.y = - Math.PI / 2
        scene.add(movel);
        renderer.render(scene, camera);
    });

    //CADEIRAAAAAAAAA
    var texture2 = new THREE.TextureLoader().load('img/cadeira.jpg');
    var material2 = new THREE.MeshPhongMaterial({ map: texture2 });
    objLoader.load('models/cadeira.obj', function (object) {// load a geometry resource
        cadeira = object;
        cadeira.scale.set(0.02, 0.02, 0.02)
        // cadeira.position.set(50, 0, 87)
        cadeira.position.set(0, 0, 87 - 75)
        cadeira.rotation.y = Math.PI / 2
        for (var i = 0; i < cadeira.children.length; i++) {
            cadeira.children[i].material = material2
        }
        scene.add(cadeira);

        cadeira2 = cadeira.clone()
        // cadeira2.position.set(50, 0, 102)
        cadeira2.position.set(0, 0, 102 - 75)
        scene.add(cadeira2)

        cadeira3 = cadeira.clone()
        // cadeira3.position.set(40, 0, 95)
        cadeira3.position.set(-10, 0, 20)
        cadeira3.rotation.y = 3 * Math.PI / 2
        scene.add(cadeira3)

        cadeira4 = cadeira3.clone()
        // cadeira4.position.set(40, 0, 110)
        cadeira4.position.set(-10, 0, 110 - 75)
        scene.add(cadeira4)
        renderer.render(scene, camera);

    });

    //Quadro de luz
    var geometry = new THREE.BoxGeometry(0.5, 12, 21);
    var quadroMaterial = new THREE.MeshBasicMaterial({ color: 0xa0a0a0 });
    var quadro = new THREE.Mesh(geometry, quadroMaterial);

    quadro.position.set(49.5, 25, 30)

    //botoes
    var geometry = new THREE.BoxGeometry(1, 3, 3);
    var botao1Material = new THREE.MeshBasicMaterial({ color: 0x9400D3 });
    botao1 = new THREE.Mesh(geometry, botao1Material);
    botao1.position.set(0, -2.5, -7.5)
    botao1.name = "botao1"
    quadro.add(botao1);

    var botao2Material = new THREE.MeshBasicMaterial({ color: 0x4B0082 });
    botao2 = new THREE.Mesh(geometry, botao2Material);
    botao2.position.set(0, -2.5, -2.5)
    botao2.name = "botao2"
    quadro.add(botao2);

    var botao3Material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
    botao3 = new THREE.Mesh(geometry, botao3Material);
    botao3.position.set(0, -2.5, 2.5)
    botao3.name = "botao3"
    quadro.add(botao3);

    var botao4Material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    botao4 = new THREE.Mesh(geometry, botao4Material);
    botao4.position.set(0, -2.5, 7.5)
    botao4.name = "botao4"
    quadro.add(botao4);

    var botaoLuz = new THREE.TextureLoader().load('img/lighton.jpg');
    var luzinha = new THREE.MeshBasicMaterial({ map: botaoLuz });
    botao5 = new THREE.Mesh(geometry, luzinha);
    botao5.position.set(0, 2.5, -7.5)
    botao5.name = "botao5"
    quadro.add(botao5);

    var botao6Material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    botao6 = new THREE.Mesh(geometry, botao6Material);
    botao6.position.set(0, 2.5, -2.5)
    botao6.name = "botao6"
    quadro.add(botao6);

    var botao7Material = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
    botao7 = new THREE.Mesh(geometry, botao7Material);
    botao7.position.set(0, 2.5, 2.5)
    botao7.name = "botao7"
    quadro.add(botao7);

    var botao8Material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    botao8 = new THREE.Mesh(geometry, botao8Material);
    botao8.position.set(0, 2.5, 7.5)
    botao8.name = "botao8"
    quadro.add(botao8);


    scene.add(quadro);

    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        }));
    plane.rotation.x = -Math.PI / 2
    scene.add(plane);

    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("click", onClick)


    renderer.render(scene, camera);
    animate()
}

function onMouseDown(event) {

    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);


    //Intersects das cadeira
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

    // search for intersections
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

    // search for intersections
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

    // search for intersections
    var intersects4 = raycaster.intersectObjects(cadeira4.children);
    if (intersects4.length > 0) {
        console.log(intersects4)

        // controls.enabled = false;
        // gets intersect object (global variable)
        selectedObject = cadeira4;
        // gets intersection with the helper plane
        var intersectsPlane = raycaster.intersectObject(plane);
        // calculates the offset (global variable)
        offset.copy(intersectsPlane[0].point).sub(selectedObject.position);
    }

}

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
}

function onMouseUp(event) {
    selectedObject = null;

}

function onClick(event) {
    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //Intersects dos botoes
    // search for intersections
    var intersectsBtn = raycaster.intersectObjects([botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8]);
    if (intersectsBtn.length > 0) {
        console.log(intersectsBtn)

        for (var i = 0; i < intersectsBtn.length; i++) {
            if (intersectsBtn[i].object.name == "botao1") {
                ambientLight.color.set(0x9400D3)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao2") {
                ambientLight.color.set(0x4B0082)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.color.set(0x0000FF)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.color.set(0x4B0082)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao4") {
                ambientLight.color.set(0x00FF00)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao5") {


            }
            else if (intersectsBtn[i].object.name == "botao6") {
                ambientLight.color.set(0xFF0000)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao7") {
                ambientLight.color.set(0xFF7F00)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao8") {
                ambientLight.color.set(0xFFFF00)
                console.log(ambientLight.color)
            }
        }

    }

    // search for intersections
    var intersectsMovel = raycaster.intersectObjects(movel.children);
    if (intersectsMovel.length > 0) {
        console.log(movel)

        if (intersectsMovel[0].object.name == "porta2") {
            porta2Mexer = true
            animate();
            console.log("asoiudg")

        }
    }
}

function animate() {

    console.log("animate")
    if (porta2Mexer) {
        movel.children[3].rotation.y -= soma
        if (movel.children[3].rotation.y = - Math.PI / 2) {
            window.cancelAnimationFrame(animate);
        }
    }



    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
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