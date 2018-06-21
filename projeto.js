// Variables
var renderer, scene, raycaster, objLoader, camera, controls, mouse, offset;
var cadeira, cadeira2, cadeira3, cadeira4, botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, movel, quadroLuz;
var mesh;
var selectedObject, ambientLight;
var porta2Mexer = false
var soma = 0.01

// PointerLock Variables
var objects = [];
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();

// Onload
window.onload = function init() {
    // New
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    objLoader = new THREE.OBJLoader();
    mouse = new THREE.Vector2();
    offset = new THREE.Vector3();

    // Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#AAAAAA");
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Camera
    //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.set(50, 70, 200);
    //camera.position.set(40, 40, 75);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    scene.add(camera);

    // Orbit Controls
    // controls = new THREE.OrbitControls(camera);
    // controls.addEventListener('change', function () { renderer.render(scene, camera); });

    // PointerLockControls
    addPointerLockControls();
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // Lights
    createLights();

    // Floor/Walls/Ceiling
    createChao();
    createParedeEsquerda();
    createParedeDireita();
    createParedeFundo();
    createParedePerto();

    // Objects
    createMesa();
    createTv();
    createSofa();
    createMovel();
    createCadeiras();
    createQuadroLuz();

    // Planes to move things around
    createPathCadeiras();

    // Event Listeners
    window.addEventListener("click", onClick);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);

    // Animate
    animate()
}

// Animate
function animate() {
    //console.log("animate")
    if (porta2Mexer) {
        movel.children[3].rotation.y -= soma
        if (movel.children[3].rotation.y = - Math.PI / 2) {
            window.cancelAnimationFrame(animate);
        }
    }

    // PointerLockControls
    if (controlsEnabled === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects(objects);

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;
        }

        prevTime = time;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}

// Add PointerLock Controls
function addPointerLockControls() {
    var blocker = document.getElementById('blocker');
    var instructions = document.getElementById('instructions');

    // PointerLock Things to do
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        var element = document.body;

        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
                blocker.style.display = 'none';
            } else {
                controls.enabled = false;
                blocker.style.display = 'block';
                instructions.style.display = '';
            }
        };

        var pointerlockerror = function (event) {
            instructions.style.display = '';
        };

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();
        }, false);
    } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
    }
}

// Create Lights
function createLights() {
    // AmbientLight
    ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    // DirectionalLight
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(15.7, 124.9, 64.7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(helper);
}

// Create Chao
function createChao() {
    var chaoGEO = new THREE.BoxGeometry(100, 1, 150);
    var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var chao = new THREE.Mesh(chaoGEO, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    chao.receiveShadow = true;
    texture.repeat.set(10, 10);
    scene.add(chao);
}

// Create Parede Esquerda
function createParedeEsquerda() {
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    paredeEsquerda.position.set(-50, 25, 0);
    scene.add(paredeEsquerda);
}

// Create Parede Direita
function createParedeDireita() {
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeDireita = new THREE.Mesh(geometry, material);
    paredeDireita.position.set(50, 25, 0);
    scene.add(paredeDireita);
}

// Create Parede Fundo
function createParedeFundo() {
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    paredeFundo.position.set(0, 25, -75);
    scene.add(paredeFundo);
}

// Create Parede Perto
function createParedePerto() {
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    paredeFundo.position.set(0, 25, 75);
    scene.add(paredeFundo);
}

// Create Mesa
function createMesa() {
    var texture = new THREE.TextureLoader().load('img/mesa.png');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    objLoader.load('models/mesa.obj', function (object) {
        mesa = object;
        for (var i = 0; i < mesa.children.length; i++) {
            mesa.children[i].material = material;
        }
        mesa.scale.set(0.15, 0.15, 0.15);
        // mesa.position.set(35, 0, 55);
        mesa.position.set(35 - 50, 0, 55 - 75);
        mesa.receiveShadow = true;
        mesa.castShadow = true;
        scene.add(mesa);
    });
}

// Create Tv
function createTv() {
    var tvMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    objLoader.load('models/televisao.obj', function (object) {
        tv = object;
        for (var i = 0; i < tv.children.length; i++) {
            tv.children[i].material = tvMaterial;
        }
        tv.rotation.y = - Math.PI / 2;
        tv.scale.set(0.4, 0.4, 0.4);
        tv.position.set(48, 20, -55);
        scene.add(tv);
    });
}

// Create Sofa
function createSofa() {
    var textureSofa = new THREE.TextureLoader().load('img/sofa.jpg');
    var materialSofa = new THREE.MeshPhongMaterial({ map: textureSofa });
    objLoader.load('models/sofa.obj', function (object) {
        sofa = object;
        sofa.scale.set(20, 20, 20)
        for (var i = 0; i < sofa.children.length; i++) {
            sofa.children[i].material = materialSofa;
        }
        scene.add(sofa);
        sofa.position.set(-15, 0, -40);
        sofa.rotation.y = Math.PI / 2;
    });
}

// Create Movel
function createMovel() {
    var textureMovel = new THREE.TextureLoader().load('img/mesa.png');
    var materialMovel = new THREE.MeshPhongMaterial({ map: textureMovel });
    objLoader.load('models/movel.obj', function (object) {
        movel = object;
        movel.scale.set(0.02, 0.02, 0.02)
        for (var i = 0; i < movel.children.length; i++) {
            movel.children[i].material = materialMovel;
        }
        movel.position.set(45, 7, -40);
        movel.rotation.y = - Math.PI / 2;
        scene.add(movel);
    });
}

// Create Cadeiras
function createCadeiras() {
    var texture2 = new THREE.TextureLoader().load('img/cadeira.jpg');
    var material2 = new THREE.MeshPhongMaterial({ map: texture2 });
    objLoader.load('models/cadeira.obj', function (object) {
        cadeira = object;
        // Cadeira 1
        cadeira.scale.set(0.02, 0.02, 0.02);
        // cadeira.position.set(50, 0, 87);
        cadeira.position.set(0, 0, 87 - 75);
        cadeira.rotation.y = Math.PI / 2;
        for (var i = 0; i < cadeira.children.length; i++) {
            cadeira.children[i].material = material2;
        }
        scene.add(cadeira);

        // Cadeira 2
        cadeira2 = cadeira.clone();
        // cadeira2.position.set(50, 0, 102);
        cadeira2.position.set(0, 0, 102 - 75);
        scene.add(cadeira2);

        // Cadeira 3
        cadeira3 = cadeira.clone();
        // cadeira3.position.set(40, 0, 95);
        cadeira3.position.set(-10, 0, 20);
        cadeira3.rotation.y = 3 * Math.PI / 2;
        scene.add(cadeira3);

        // Cadeira 4
        cadeira4 = cadeira3.clone();
        // cadeira4.position.set(40, 0, 110);
        cadeira4.position.set(-10, 0, 110 - 75);
        scene.add(cadeira4);
    });
}

// Create Quadro da Luz
function createQuadroLuz() {
    var geometry = new THREE.BoxGeometry(0.5, 12, 21);
    var quadroMaterial = new THREE.MeshBasicMaterial({ color: 0xa0a0a0 });
    quadroLuz = new THREE.Mesh(geometry, quadroMaterial);
    quadroLuz.position.set(49.5, 25, 30);

    // Botao 1
    var geometry = new THREE.BoxGeometry(1, 3, 3);
    var botao1Material = new THREE.MeshBasicMaterial({ color: 0x9400D3 });
    botao1 = new THREE.Mesh(geometry, botao1Material);
    botao1.position.set(0, -2.5, -7.5)
    botao1.name = "botao1"
    quadroLuz.add(botao1);

    // Botao 1
    var botao2Material = new THREE.MeshBasicMaterial({ color: 0x4B0082 });
    botao2 = new THREE.Mesh(geometry, botao2Material);
    botao2.position.set(0, -2.5, -2.5)
    botao2.name = "botao2"
    quadroLuz.add(botao2);

    // Botao 1
    var botao3Material = new THREE.MeshBasicMaterial({ color: 0x0000FF });
    botao3 = new THREE.Mesh(geometry, botao3Material);
    botao3.position.set(0, -2.5, 2.5)
    botao3.name = "botao3"
    quadroLuz.add(botao3);

    // Botao 1
    var botao4Material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    botao4 = new THREE.Mesh(geometry, botao4Material);
    botao4.position.set(0, -2.5, 7.5)
    botao4.name = "botao4"
    quadroLuz.add(botao4);

    // Botao 1
    var botaoLuz = new THREE.TextureLoader().load('img/lighton.jpg');
    var luzinha = new THREE.MeshBasicMaterial({ map: botaoLuz });
    botao5 = new THREE.Mesh(geometry, luzinha);
    botao5.position.set(0, 2.5, -7.5)
    botao5.name = "botao5"
    quadroLuz.add(botao5);

    // Botao 1
    var botao6Material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    botao6 = new THREE.Mesh(geometry, botao6Material);
    botao6.position.set(0, 2.5, -2.5)
    botao6.name = "botao6"
    quadroLuz.add(botao6);

    // Botao 1
    var botao7Material = new THREE.MeshBasicMaterial({ color: 0xFF7F00 });
    botao7 = new THREE.Mesh(geometry, botao7Material);
    botao7.position.set(0, 2.5, 2.5)
    botao7.name = "botao7"
    quadroLuz.add(botao7);

    // Botao 1
    var botao8Material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    botao8 = new THREE.Mesh(geometry, botao8Material);
    botao8.position.set(0, 2.5, 7.5)
    botao8.name = "botao8"
    quadroLuz.add(botao8);

    // Adicionar quadroLuz a scene
    scene.add(quadroLuz);
}

function createPathCadeiras() {
    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        }));
    plane.rotation.x = -Math.PI / 2;
    plane.name = "PathCadeiras";
    scene.add(plane);
}

// Event: OnMouseDown
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
    console.log(intersects);
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

// Event: OnMouseMove
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

// Event: OnMouseUp
function onMouseUp(event) {
    selectedObject = null;

}

// Event: OnClick
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

// Event: onKeyDown
function onKeyDown(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;
        case 37: // left
        case 65: // a
            moveLeft = true; break;
        case 40: // down
        case 83: // s
            moveBackward = true;
            break;
        case 39: // right
        case 68: // d
            moveRight = true;
            break;
        case 32: // space
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
    }
}

// Event: onKeyUp
function onKeyUp(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;
        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
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