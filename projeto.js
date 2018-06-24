// Variables
var renderer, scene, raycaster, objLoader, camera, controls, mouse, offset, listener, crosshair;
var cadeira, cadeira2, cadeira3, cadeira4, botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, movel, quadroLuz, tv, botaoShootingRange;
var mesh;
var teleportX, teleportY, teleportZ, projetilDir;
var selectedObject, ambientLight;
// var porta2Mexer = false
var soma = 0.01

// Objeto Pai com todos os objetos
var papi = new THREE.Object3D();

// Arrays
var arrayColisoes = [];
var arrayProjeteis = [];

// Boolean Variables
var moveProjetil = false;
var hasCollided = false;
var teleportPlayer = false;
var shootingAllowed = false;

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

// CONFIG
var playerSpeed = 14; // Mais alto = Mais devagar!
var projetilSpeed = 5;
//teleport(0, 0, 0); // If needed to spawn player somewhere else, uncomment and change values (x, y, z)

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Camera
    //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.set(50, 70, 200);
    //camera.position.set(40, 40, 75);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.y = 20;
    scene.add(camera);

    // create an AudioListener and add it to the camera
    listener = new THREE.AudioListener();
    camera.add(listener);

    // Create Crosshair
    createCrosshair();

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
    createChao(true);
    createParedeEsquerda(true);
    createParedeDireita(true);
    createParedeFundo(true);
    createParedePerto(true);

    // Objects
    createMesa(true);
    createTv(true);
    createSofa(true);
    createMovel(true);
    createCadeiras(true);
    createQuadroLuz(true);
    createBotaoShootingRange(true);

    // Planes to move things around
    createPathCadeiras();

    // Creates the shooting range
    createShootingRange();

    // Adicionar papi a cena
    papi.position.y = -20;
    papi.name = "papi";
    scene.add(papi);

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
    // PointerLockControls
    if (controlsEnabled === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        // Colisoes
        var dir = controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z)).clone();
        raycaster.ray.direction.copy(dir);

        var intersections = raycaster.intersectObjects(arrayColisoes);

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        // Move in X and Z axis
        velocity.x -= velocity.x * playerSpeed * delta;
        velocity.z -= velocity.z * playerSpeed * delta;

        // Move in Y Axis (Jump)
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveLeft) - Number(moveRight);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        } else {
            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);
        }

        // Teleport player to desired location
        if (teleportPlayer == true) {
            // First go to (0, 0, 0). Tho it depends on which direction the player is facing, so be careful...!
            controls.getObject().translateX(- controls.getObject().position.x);
            controls.getObject().translateY(- controls.getObject().position.y);
            controls.getObject().translateZ(- controls.getObject().position.z);

            // Then move in direction of desired values
            controls.getObject().translateX(teleportX);
            controls.getObject().translateY(teleportY);
            controls.getObject().translateZ(teleportZ);

            teleportPlayer = false;
        }

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;
        }

        prevTime = time;
    }

    // Colisoes
    var position = controls.getObject().position;
    //collisionDetection(position);

    // Animacao do Movel
    if (movel) {
        //console.log(movel.portaParada)
        if (!movel.portaParada) {
            movel.children[3].rotation.y -= soma
            if (movel.children[3].rotation.y <= - Math.PI / 2) {
                movel.portaParada = true; ///??????????????????????????????????????
            }
        }
    }

    // Animacoes de luzes
    if (ambientLight) {
        if (ambientLight.raveMode) {
            var color = parseInt(getRandomColor())
            console.log(color)
            ambientLight.color.set(color)

            // // create a global audio source
            // var sound = new THREE.Audio(listener);

            // // load a sound and set it as the Audio object's buffer
            // var audioLoader = new THREE.AudioLoader();
            // audioLoader.load('audio/darude.ogg', function (buffer) {
            //     sound.setBuffer(buffer);
            //     sound.setLoop(true);
            //     sound.play();
            // });
        }
    }

    // Shoot projetil
    if (moveProjetil == true) {
        if (arrayProjeteis.length > 0) {
            arrayProjeteis[0].position.x += projetilDir.x * projetilSpeed;
            arrayProjeteis[0].position.y += projetilDir.y * projetilSpeed;
            arrayProjeteis[0].position.z += projetilDir.z * projetilSpeed;
        }
    }

    // Atualizar quantidade de balas
    // TODO

    // Self made colisoes que nao acabamos... 
    /*if (arrayColisoes.length > 0) {
        var BBox = new THREE.Box3().setFromObject(sphereTest);
        //console.log(arrayColisoes[0]);
        var BBox2 = new THREE.Box3().setFromObject(arrayColisoes[0]);
        hasCollided = BBox.intersectsBox(BBox2);
        if (hasCollided) {
            console.log(hasCollided);
        }

        for (var i = 0; i < arrayColisoes.length; i++) {
            hasCollided = BBox.intersectsBox(new THREE.Box3().setFromObject(arrayColisoes[i]));
            if (hasCollided == true) {
                console.log("It has collided with: " + arrayColisoes[i]);
                hasCollided == false;
                break;
            }
        }
    }*/

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}

// Teleport function (which is not really teleport, cuz it just moves the player in the desired direction for the chosen amount...)
function teleport(x, y, z) {
    teleportPlayer = true;
    teleportX = x;
    teleportY = y;
    teleportZ = z;
}

// Create Crosshair
function createCrosshair() {
    var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

    // crosshair size
    var x = 0.015, y = 0.015;

    var geometry = new THREE.Geometry();

    // crosshair
    geometry.vertices.push(new THREE.Vector3(0, y, 0));
    geometry.vertices.push(new THREE.Vector3(0, -y, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

    crosshair = new THREE.Line(geometry, material);

    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;
    crosshair.position.z = -1;
    crosshair.name = "Crosshair";

    camera.add(crosshair);
}

// Gets random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
    //scene.add(ambientLight);
    papi.add(ambientLight);

    // DirectionalLight
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(15.7, 124.9, 64.7);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.top = 100;

    var helper2 = new THREE.CameraHelper(directionalLight.shadow.camera);
    //scene.add(helper2);
    papi.add(helper2);
    var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    //scene.add(helper);
    papi.add(helper);

    //scene.add(directionalLight);
    papi.add(directionalLight);
}

// Create Chao
function createChao(helper) {
    var chaoGEO = new THREE.BoxGeometry(100, 1, 150);
    var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
    var material = new THREE.MeshPhongMaterial({ map: texture });
    var chao = new THREE.Mesh(chaoGEO, material);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    chao.receiveShadow = true;
    texture.repeat.set(10, 10);
    //scene.add(chao);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(chao, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(chao);
}

// Create Parede Esquerda
function createParedeEsquerda(helper) {
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeEsquerda = new THREE.Mesh(geometry, material);
    paredeEsquerda.position.set(-50, 25, 0);
    paredeEsquerda.name = "paredeX-50";
    //scene.add(paredeEsquerda);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(paredeEsquerda, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(paredeEsquerda);
    arrayColisoes.push(paredeEsquerda);
}

// Create Parede Direita
function createParedeDireita(helper) {
    var geometry = new THREE.BoxGeometry(1, 50, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeDireita = new THREE.Mesh(geometry, material);
    paredeDireita.position.set(50, 25, 0);
    paredeDireita.name = "paredeX50";
    //scene.add(paredeDireita);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(paredeDireita, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(paredeDireita);
    arrayColisoes.push(paredeDireita);
}

// Create Parede Fundo
function createParedeFundo(helper) {
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    paredeFundo.position.set(0, 25, -75);
    paredeFundo.name = "paredeZ-75";
    //scene.add(paredeFundo);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(paredeFundo, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(paredeFundo);
    arrayColisoes.push(paredeFundo);
}

// Create Parede Perto
function createParedePerto(helper) {
    var geometry = new THREE.BoxGeometry(100, 50, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
    var paredeFundo = new THREE.Mesh(geometry, material);
    paredeFundo.position.set(0, 25, 75);
    paredeFundo.name = "paredeZ75";
    //scene.add(paredeFundo);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(paredeFundo, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(paredeFundo);
    arrayColisoes.push(paredeFundo);
}

// Create ShootingRange
function createShootingRange() {
    var shootingRange = new THREE.Object3D();

    // Floor/Walls/Ceiling
    createChao(true);
    createParedeEsquerda(true);
    createParedeDireita(true);
    createParedeFundo(true);
    createParedePerto(true);

    shootingRange.position.set(0, 0, -200);
    papi.add(shootingRange);

    // Create Chao
    function createChao(helper) {
        var chaoGEO = new THREE.BoxGeometry(100, 1, 150);
        var texture = new THREE.TextureLoader().load('img/chaosala.jpg');
        var material = new THREE.MeshPhongMaterial({ map: texture });
        var chao = new THREE.Mesh(chaoGEO, material);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        chao.receiveShadow = true;
        texture.repeat.set(10, 10);
        //scene.add(chao);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(chao, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        shootingRange.add(chao);
    }

    // Create Parede Esquerda
    function createParedeEsquerda(helper) {
        var geometry = new THREE.BoxGeometry(1, 50, 150);
        var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
        var paredeEsquerda = new THREE.Mesh(geometry, material);
        paredeEsquerda.position.set(-50, 25, 0);
        paredeEsquerda.name = "paredeX-50";
        //scene.add(paredeEsquerda);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(paredeEsquerda, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        shootingRange.add(paredeEsquerda);
        arrayColisoes.push(paredeEsquerda);
    }

    // Create Parede Direita
    function createParedeDireita(helper) {
        var geometry = new THREE.BoxGeometry(1, 50, 150);
        var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
        var paredeDireita = new THREE.Mesh(geometry, material);
        paredeDireita.position.set(50, 25, 0);
        paredeDireita.name = "paredeX50";
        //scene.add(paredeDireita);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(paredeDireita, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        shootingRange.add(paredeDireita);
        arrayColisoes.push(paredeDireita);
    }

    // Create Parede Fundo
    function createParedeFundo(helper) {
        var geometry = new THREE.BoxGeometry(100, 50, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
        var paredeFundo = new THREE.Mesh(geometry, material);
        paredeFundo.position.set(0, 25, -75);
        paredeFundo.name = "paredeZ-75";
        //scene.add(paredeFundo);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(paredeFundo, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        shootingRange.add(paredeFundo);
        arrayColisoes.push(paredeFundo);
    }

    // Create Parede Perto
    function createParedePerto(helper) {
        var geometry = new THREE.BoxGeometry(100, 50, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xfffdf4 });
        var paredeFundo = new THREE.Mesh(geometry, material);
        paredeFundo.position.set(0, 25, 75);
        paredeFundo.name = "paredeZ75";
        //scene.add(paredeFundo);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(paredeFundo, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        shootingRange.add(paredeFundo);
        arrayColisoes.push(paredeFundo);
    }
}

// Create Mesa
function createMesa(helper) {
    var texture = new THREE.TextureLoader().load('img/mesa.png');
    materialMesa = new THREE.MeshPhongMaterial({ map: texture });
    objLoader.load('models/mesa.obj', function (object) {
        mesa = object;
        for (var i = 0; i < mesa.children.length; i++) {
            mesa.children[i].material = materialMesa;
            mesa.children[i].receiveShadow = true;
            mesa.children[i].castShadow = true;
        }
        mesa.scale.set(0.15, 0.15, 0.15);
        // mesa.position.set(35, 0, 55);
        mesa.position.set(35 - 50, 0, 55 - 75);

        //scene.add(mesa);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(object, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        papi.add(mesa);
        arrayColisoes.push(mesa);
    });
}

// Create Tv
function createTv(helper) {
    var tvMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    objLoader.load('models/televisao.obj', function (object) {
        tv = object;
        for (var i = 0; i < tv.children.length; i++) {
            tv.children[i].material = tvMaterial;
            tv.children[i].receiveShadow = true;
            tv.children[i].castShadow = true;
        }
        tv.rotation.y = - Math.PI / 2;
        tv.scale.set(0.4, 0.4, 0.4);
        tv.position.set(48, 20, -55);
        //scene.add(tv);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(object, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        papi.add(tv);
        arrayColisoes.push(tv);
    });
}

// Create Sofa
function createSofa(helper) {
    var textureSofa = new THREE.TextureLoader().load('img/sofa.jpg');
    var materialSofa = new THREE.MeshPhongMaterial({ map: textureSofa });
    objLoader.load('models/sofa.obj', function (object) {
        sofa = object;
        sofa.scale.set(20, 20, 20)
        for (var i = 0; i < sofa.children.length; i++) {
            sofa.children[i].material = materialSofa;
            sofa.children[i].receiveShadow = true;
            sofa.children[i].castShadow = true;
        }
        //scene.add(sofa);
        sofa.position.set(-15, 0, -40);
        sofa.rotation.y = Math.PI / 2;

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(object, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        papi.add(sofa);
        arrayColisoes.push(sofa);
    });
}

// Create Movel
function createMovel(helper) {
    var textureMovel = new THREE.TextureLoader().load('img/mesa.png');
    var materialMovel = new THREE.MeshPhongMaterial({ map: textureMovel });
    objLoader.load('models/armario.obj', function (object) {
        movel = object;
        movel.scale.set(0.02, 0.02, 0.02)
        for (var i = 0; i < movel.children.length; i++) {
            movel.children[i].material = materialMovel;
            movel.children[i].receiveShadow = true;
            movel.children[i].castShadow = true;
        }
        movel.position.set(45, 7, -40);
        movel.rotation.y = - Math.PI / 2;
        movel.portaParada = true;
        var axesHelper = new THREE.AxesHelper(10);
        movel.add(axesHelper);
        //scene.add(movel);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(object, 0xffff00);
            //scene.add(boxHelper);
            papi.add(boxHelper);
        }

        papi.add(movel);
        arrayColisoes.push(movel);
    });
}

// Create Cadeiras
function createCadeiras(helper) {
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
            cadeira.children[i].receiveShadow = true;
            cadeira.children[i].castShadow = true;
        }
        //scene.add(cadeira);

        // Cadeira 2
        cadeira2 = cadeira.clone();
        // cadeira2.position.set(50, 0, 102);
        cadeira2.position.set(0, 0, 102 - 75);
        //scene.add(cadeira2);

        // Cadeira 3
        cadeira3 = cadeira.clone();
        // cadeira3.position.set(40, 0, 95);
        cadeira3.position.set(-10, 0, 20);
        cadeira3.rotation.y = 3 * Math.PI / 2;
        //scene.add(cadeira3);

        // Cadeira 4
        cadeira4 = cadeira3.clone();
        // cadeira4.position.set(40, 0, 110);
        cadeira4.position.set(-10, 0, 110 - 75);
        //scene.add(cadeira4);

        // BoxHelper
        if (helper == true) {
            var boxHelper = new THREE.BoxHelper(object, 0xffff00);
            var boxHelper2 = new THREE.BoxHelper(cadeira2, 0xffff00);
            var boxHelper3 = new THREE.BoxHelper(cadeira3, 0xffff00);
            var boxHelper4 = new THREE.BoxHelper(cadeira4, 0xffff00);

            /*
            scene.add(boxHelper);
            scene.add(boxHelper2);
            scene.add(boxHelper3);
            scene.add(boxHelper4);
            */

            papi.add(boxHelper);
            papi.add(boxHelper2);
            papi.add(boxHelper3);
            papi.add(boxHelper4);
        }

        papi.add(cadeira);
        papi.add(cadeira2);
        papi.add(cadeira3);
        papi.add(cadeira4);
    });
}

// Create Quadro da Luz
function createQuadroLuz(helper) {
    var geometry = new THREE.BoxGeometry(0.5, 12, 21);
    var quadroMaterial = new THREE.MeshBasicMaterial({ color: 0xa0a0a0 });
    quadroLuz = new THREE.Mesh(geometry, quadroMaterial);
    quadroLuz.position.set(49.5, 25, 30);

    // Botao 1
    var geometry = new THREE.BoxGeometry(1, 3, 3);
    var botao1Material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
    //quadroLuz.position.y = 30;
    //scene.add(quadroLuz);
    papi.add(quadroLuz);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(quadroLuz, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }
}

function createBotaoShootingRange(helper) {
    // Botao ShootingRange
    var geometry = new THREE.BoxGeometry(1, 3, 3);
    var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    botaoShootingRange = new THREE.Mesh(geometry, material);
    botaoShootingRange.position.set(20, 30, -74);
    botaoShootingRange.rotation.y = degreesToRadians(90);
    botaoShootingRange.name = "botaoShootingRange"

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(botaoShootingRange, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(botaoShootingRange);
}

// Creates all the projectiles
function createProjetil(nProjeteis) {
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    projetil = new THREE.Mesh(geometry, material);

    // BoxHelper
    var boxHelper = new THREE.BoxHelper(projetil, 0xffff00);
    projetil.add(boxHelper);

    for (var i = 0; i < nProjeteis; i++) {
        arrayProjeteis.push(projetil);
    }
}

// Creates Plano para mexer as cadeiras em cima dele
function createPathCadeiras(helper) {
    plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshBasicMaterial({
            opacity: 0.0,
            transparent: true,
            visible: false
        }));
    plane.rotation.x = -Math.PI / 2;
    plane.name = "PathCadeiras";
    //scene.add(plane);
    papi.add(plane);

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(plane, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }
}

// Event: OnMouseDown
function onMouseDown(event) {
    var mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1, //x
        - (event.clientY / window.innerHeight) * 2 + 1); //y

    var raycaster = new THREE.Raycaster();
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    //Intersects das cadeiras
    // search for intersections
    var intersects = raycaster.intersectObjects(cadeira.children);
    if (intersects.length > 0) {
        //console.log(intersects)
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
        //console.log(intersects2)

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
        //console.log(intersects3)

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
        //console.log(intersects4)

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

    // Intersects dos botoes
    // search for intersections
    var intersectsBtn = raycaster.intersectObjects([botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, botaoShootingRange]);
    if (intersectsBtn.length > 0) {
        //console.log(intersectsBtn)

        for (var i = 0; i < intersectsBtn.length; i++) {
            if (intersectsBtn[i].object.name == "botao1") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xffffff)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao2") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x4B0082)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x0000FF)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x4B0082)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao4") {
                ambientLight.raveMode = true
            }
            else if (intersectsBtn[i].object.name == "botao5") {
                if (ambientLight.intensity == 0.7) {
                    ambientLight.intensity = 0
                }
                else if (ambientLight.intensity == 0) {
                    ambientLight.intensity = 0.7
                }
            }
            else if (intersectsBtn[i].object.name == "botao6") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xFF0000)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao7") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xFF7F00)
                console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao8") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xFFFF00)
                console.log(ambientLight.color)
            } else if (intersectsBtn[i].object.name == "botaoShootingRange") {
                console.log("Teleporting to shooting range...");
                teleport(0, 0, -150);
                shootingAllowed = true;
                // Cria 6 projeteis
                createProjetil(6);
            }
        }
    }

    // Intersects do movel
    var intersectsMovel = raycaster.intersectObjects(movel.children);
    if (intersectsMovel.length > 0) {
        console.log(movel);

        if (intersectsMovel[0].object.name == "porta2") {
            // porta2Mexer = true
            movel.portaParada = false;
            //animate();
            console.log("asoiudg");
        }
    }

    // Intersects da tv
    var intersectsTv = raycaster.intersectObjects(tv.children);
    if (intersectsTv.length > 0) {
        console.log("Toquei na tv pa!");
    }

    // ShootingRange
    if (shootingAllowed == true) {
        // Retirar uma bala
        arrayProjeteis.splice(-1, 1);

        // Fui eu que criei este codigo, mas ja nao me lembro o que e que faz... Tem a haver com as direcoes e posicoes das balas
        if (arrayProjeteis.length > 0) {
            arrayProjeteis[0].position.set(controls.getObject().position.x, controls.getObject().position.y + 20, controls.getObject().position.z);
            papi.add(arrayProjeteis[0]);
            projetilDir = controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z));
            moveProjetil = true;
        }
    }
}

// Event: onKeyDown
function onKeyDown(event) {
    // When holding shift, player runs
    if (event.keyCode == 16) {
        playerSpeed = 5;
    }
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
        case 82: // r
            // Cria 6 projeteis
            createProjetil(6);
            break;
    }
}

// Event: onKeyUp
function onKeyUp(event) {
    if (event.keyCode == 16) {
        playerSpeed = 14;
    }
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

// Function that returns the given degrees in radians
function degreesToRadians(degrees) {
    var radians = degrees * Math.PI / 180;
    return radians;
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