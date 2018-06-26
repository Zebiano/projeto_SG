// Variables
var renderer, scene, raycaster, objLoader, camera, controls, mouse, offset, listener, sound, crosshair;
var cadeira, cadeira2, cadeira3, cadeira4, botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, movel, quadroLuz, tv, botaoShootingRange, botaoSala, alvo;
var teleportX, teleportY, teleportZ, projetilDir;
var selectedObject, ambientLight;
var plane, meshPropeller;
var meshEarth, meshClouds;
// var porta2Mexer = false
var soma = 1.5;
var playerSpeed = 14; // Mais alto = Mais devagar!

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
var isCrouched = false;
var isSitting = false;
var showConfig = false;

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
var configPlayerSpeed = 14; // Mais alto = Mais devagar!
var projetilSpeed = 3;
var enableJump = false;
var teleportToShootingRange = false;
var nProjeteis = 6;
var muteAll = false;
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
    listener = new THREE.AudioListener();
    sound = new THREE.Audio(listener);

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
    camera.add(listener);
    //camera.position.y = 20;
    scene.add(camera);

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
    createChao(false);
    createParedeEsquerda(false);
    createParedeDireita(false);
    createParedeFundo(false);
    createParedePerto(false);

    // Objects
    createMesa(false);
    createTv(false);
    createSofa(false);
    createMovel(false);
    createCadeiras(false);
    createQuadroLuz(false);
    createBotaoShootingRange(false);
    createBotaoSala(false);
    createAlvo(false);

    // Planes to move things around
    createPathCadeiras();

    // Creates the shooting range
    createShootingRange();

    // Hmmmmm
    createPlane();
    createEarth();
    createClouds();

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

    // Jquery to handle Text
    if (playerSpeed == 5) {
        $("#infoCrouch").html("Running");
    } else if (isCrouched == true) {
        $("#infoCrouch").html("Crouching");
    } else {
        $("#infoCrouch").html("Standing");
    }
    // Sound icon
    if (muteAll == true) {
        $("#soundConfig").html('<a onclick="hm"><i class="fas fa-volume-off"></i></a>');
    } else {
        $("#soundConfig").html('<a onclick="hm"><i class="fas fa-volume-up"></i></a>');
    }

    // Plane proppeller
    meshPropeller.rotation.x += 0.5;

    // Earth and clouds
    meshEarth.rotation.y += 0.001;
    meshClouds.rotation.y += 0.0012;

    // Bullets
    if (shootingAllowed == true) {
        if (arrayProjeteis.length - 1 >= 0) {
            $("#infoBullets").html(arrayProjeteis.length - 1);
        } else {
            $("#infoBullets").html("Reload to fire more! Hit key 'R'");
        }
    } else {
        $("#infoBullets").html("");
    }

    // Colisoes
    var position = controls.getObject().position;
    //collisionDetection(position);

    // Animacao do Movel
    if (movel) {
        //console.log("animate porta parada = " + movel.porta1Parada)
        if (!movel.porta1Parada && !movel.porta1Aberta) {
            movel.children[0].position.x += soma
            //console.log(movel.porta1Parada)
        }
        else if (!movel.porta1Parada && movel.porta1Aberta) {
            movel.children[0].position.x -= soma
            //console.log(movel.porta1Parada)
        }

        if (movel.children[0].position.x >= 450) {
            movel.porta1Parada = true
            movel.porta1Aberta = true
        }
        else if (movel.children[0].position.x <= 0) {
            movel.porta1Parada = true
            movel.porta1Aberta = false
        }

        if (!movel.porta2Parada && !movel.porta2Aberta) {
            movel.children[1].position.x -= soma
            //console.log(movel.porta2Parada)
        }
        else if (!movel.porta2Parada && movel.porta2Aberta) {
            movel.children[1].position.x += soma
            //console.log(movel.porta2Parada)
        }

        if (movel.children[1].position.x <= -300) {
            movel.porta2Parada = true
            movel.porta2Aberta = true
        }
        else if (movel.children[1].position.x >= 0) {
            movel.porta2Parada = true
            movel.porta2Aberta = false
        }
    }

    // Animacoes de luzes
    if (ambientLight) {
        if (ambientLight.raveMode) {
            var color = parseInt(getRandomColor())
            //console.log(color)
            ambientLight.color.set(color);
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

    // Colisoes com os alvos
    if (arrayProjeteis.length > 0) {
        var BBox = new THREE.Box3().setFromObject(alvo);
        var BBox2 = new THREE.Box3().setFromObject(arrayProjeteis[0]);
        hasCollided = BBox.intersectsBox(BBox2);
        if (hasCollided) {
            //console.log(hasCollided);
            papi.remove(scene.getObjectByName("alvo"));
            createAlvo();
        }
    }

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

// Da return a "direcao" que o utilizador esta a olhar
function getPlayerDirection() {
    var dir = controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z));
    console.log(dir);

    /*
    temos 8 quadrados a nossa volta:
    1. frente cima esquerda
    2. frente cima direita
    3. frente baixo esquerda
    4. frente baixo direita
    5. tras cima esquerda
    6. tras cima direita
    7. tras baixo esquerda
    8. tras baixo direita

    1. Y positivo, resto negativo
    2. X e Y positivo, resto negativo
    3. Tudo negativo!
    4. X positivo, resto negativo
    5. Y e Z positivo, resto negativo
    6. Tudo positivo
    7. Z positivo, resto negativo
    8. X e Z positivo, resto negativo
    */

    if (dir.x > 0 && dir.y > 0 && dir.z > 0) {
        console.log("Tudo positivo!");
        return "ppp";
    } else if (dir.x < 0 && dir.y < 0 && dir.z < 0) {
        console.log("Tudo negativo!");
        return "nnn";
    } else if (dir.x > 0 && dir.y < 0 && dir.z < 0) {
        console.log("X positivo, resto negativo");
        return "pnn";
    } else if (dir.x > 0 && dir.y > 0 && dir.z < 0) {
        console.log("X e Y positivo, resto negativo");
        return "ppn";
    } else if (dir.x < 0 && dir.y > 0 && dir.z < 0) {
        console.log("Y positivo, resto negativo");
        return "npn";
    } else if (dir.x < 0 && dir.y > 0 && dir.z > 0) {
        console.log("Y e Z positivo, resto negativo");
        return "npp";
    } else if (dir.x < 0 && dir.y < 0 && dir.z > 0) {
        console.log("Z positivo, resto negativo");
        return "nnp";
    } else if (dir.x > 0 && dir.y < 0 && dir.z > 0) {
        console.log("X e Z positivo, resto negativo");
        return "pnp";
    } else {
        console.log("Tas a olhar pra onde paaa?! Deves acharte espertinho/a em por valores certinhos para me enganares...");
        return "nope";
    }
}

// Create Crosshair
function createCrosshair() {
    // crosshair size
    var x = 0.015, y = 0.015;

    // Crosshair
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, y, 0));
    geometry.vertices.push(new THREE.Vector3(0, -y, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-x, 0, 0));
    var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });
    crosshair = new THREE.Line(geometry, material);

    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1; // Min é 0.23 e max 1.77
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1; // Min é 0.23 e max 1.77

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

    // Teleport to shootingRange
    if (teleportToShootingRange == true) {
        teleport(45, 0, -200);
    }

    // Floor/Walls/Ceiling
    createChao(true);
    createParedeEsquerda(true);
    createParedeDireita(true);
    createParedeFundo(true);
    createParedePerto(true);

    shootingRange.position.set(0, 0, -200);
    shootingRange.rotation.y = degreesToRadians(90);
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
    objLoader.load('models/movel.obj', function (object) {
        movel = object;
        movel.scale.set(0.02, 0.02, 0.02)
        for (var i = 0; i < movel.children.length; i++) {
            movel.children[i].material = materialMovel;
            movel.children[i].receiveShadow = true;
            movel.children[i].castShadow = true;
        }
        movel.position.set(45, 0, -38);
        movel.rotation.y = - Math.PI / 2;
        movel.porta1Parada = true;
        movel.porta1Aberta = false
        movel.porta2Parada = true;
        movel.porta2Aberta = false
        var axesHelper = new THREE.AxesHelper(10);
        movel.add(axesHelper);
        //console.log(movel)

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
    var botaoRave = new THREE.TextureLoader().load('img/ravemode.jpg');
    var ravemode = new THREE.MeshBasicMaterial({ map: botaoRave });
    botao4 = new THREE.Mesh(geometry, ravemode);
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

function createBotaoSala(helper) {
    // Botao Sala
    var geometry = new THREE.BoxGeometry(1, 3, 3);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    botaoSala = new THREE.Mesh(geometry, material);
    botaoSala.position.set(50, 30, -249);
    botaoSala.rotation.y = degreesToRadians(90);
    botaoSala.name = "botaoSala"

    // BoxHelper
    if (helper == true) {
        var boxHelper = new THREE.BoxHelper(botaoSala, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);
    }

    papi.add(botaoSala);
}

// Creates all the projectiles
function createProjetil() {
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    projetil = new THREE.Mesh(geometry, material);
    projetil.name = "Projetil";

    // BoxHelper
    var boxHelper = new THREE.BoxHelper(projetil, 0xffff00);
    projetil.add(boxHelper);

    for (var i = 0; i < nProjeteis; i++) {
        arrayProjeteis.push(projetil);
    }
    arrayProjeteis.push(projetil);
}

// Create Parede Perto
function createAlvo(helper) {
    var geometry = new THREE.BoxGeometry(5, 5, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    alvo = new THREE.Mesh(geometry, material);
    alvo.rotation.y = degreesToRadians(90);
    var x = Math.floor(Math.random() * ((-30) - (-60) + 1) + (-60));
    var y = Math.floor(Math.random() * (40 - 10 + 1) + 10);
    var z = Math.floor(Math.random() * ((-230) - (-170) + 1) + (-170));
    alvo.position.set(x, y, z);
    alvo.name = "alvo";
    //scene.add(paredeFundo);

    //Math.floor(Math.random() * (max - min + 1) + min);

    // BoxHelper
    if (helper == true) {
        /*var boxHelper = new THREE.BoxHelper(alvo, 0xffff00);
        //scene.add(boxHelper);
        papi.add(boxHelper);*/
    }

    papi.add(alvo);
}

// Creates Plano para mexer as cadeiras em cima dele
function createPathCadeiras(helper) {
    plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 10, 10),
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
    //raycaster.setFromCamera(mouse, camera);
    raycaster.set(controls.getObject().position, controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z)));

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
        //console.log(offset);
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
    //raycaster.setFromCamera(mouse, camera);
    raycaster.set(controls.getObject().position, controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z)));

    if (selectedObject) {
        //drag an object around if we've already clicked on one
        var intersects = raycaster.intersectObject(plane);
        // selectedObject.position.copy(intersects[0].point.sub(offset));
        selectedObject.position.x = intersects[0].point.sub(offset).x;

        //console.log(selectedObject.position)

        renderer.render(scene, camera);
    }
}

function createPlane() {
    // create an empty container
    plane = new THREE.Object3D();

    // scale it down
    plane.scale.set(0.02, 0.02, 0.02);
    // push it up
    //plane.position.y = 10;
    plane.position.set(44, 8, -30);
    plane.rotation.y = degreesToRadians(90);

    // 1. Geometria
    var geoCockpit = new THREE.BoxGeometry(60, 50, 50);
    var geoEngine = new THREE.BoxGeometry(20, 50, 50);
    var geoTail = new THREE.BoxGeometry(15, 20, 5);
    var geoWing = new THREE.BoxGeometry(40, 8, 150);
    var geoPropeller = new THREE.BoxGeometry(20, 10, 10);
    var geoBlade = new THREE.BoxGeometry(1, 100, 20);
    // 2. Material
    var materialPlaneCockpit = new THREE.MeshPhongMaterial({
        color: 0xf25346,
        wireframe: false
    });
    var materialPlaneEngine = new THREE.MeshPhongMaterial({
        color: 0xd8d0d1,
        wireframe: false
    });
    var materialPlaneTail = new THREE.MeshPhongMaterial({
        color: 0xf25346,
        wireframe: false
    });
    var materialPlaneWing = new THREE.MeshPhongMaterial({
        color: 0xf25346,
        wireframe: false
    });
    var materialPlanePropeller = new THREE.MeshPhongMaterial({
        color: 0x59332e,
        wireframe: false
    });
    var materialPlaneBlade = new THREE.MeshPhongMaterial({
        color: 0x23190f,
        wireframe: false
    });
    // 3. Malha
    meshCockpit = new THREE.Mesh(geoCockpit, materialPlaneCockpit);
    var meshEngine = new THREE.Mesh(geoEngine, materialPlaneEngine);
    var meshTail = new THREE.Mesh(geoTail, materialPlaneTail);
    var meshWing = new THREE.Mesh(geoWing, materialPlaneWing);
    meshPropeller = new THREE.Mesh(geoPropeller, materialPlanePropeller);
    var meshBlade = new THREE.Mesh(geoBlade, materialPlaneBlade);
    // 4. Adicionar malha ao aviao
    plane.add(meshCockpit);
    plane.add(meshEngine);
    plane.add(meshTail);
    plane.add(meshWing);
    plane.add(meshPropeller);
    meshPropeller.add(meshBlade);
    // 5. Mudar posicoes
    meshCockpit.geometry.vertices[5].y -= 5;
    meshCockpit.geometry.vertices[5].y += 5;
    meshEngine.position.x = 40;
    meshTail.position.x = -30; meshTail.position.y = 25;
    meshPropeller.position.x = 50;
    meshBlade.position.x = 10;
    // Adicionar Shadows
    meshCockpit.receiveShadow = true;
    meshEngine.receiveShadow = true;
    meshTail.receiveShadow = true;
    meshWing.receiveShadow = true;
    meshPropeller.receiveShadow = true;
    meshBlade.receiveShadow = true;

    meshCockpit.castShadow = true;
    meshEngine.castShadow = true;
    meshTail.castShadow = true;
    meshWing.castShadow = true;
    meshPropeller.castShadow = true;
    meshBlade.castShadow = true;

    //console.log("Plane created")
    papi.add(plane);

    //directionalLight.target = plane;
}

function createEarth() {
    // 1. Geometria
    var geoEarth = new THREE.SphereGeometry(1, 32, 32);
    // 2. Texture
    var textEarth = new THREE.TextureLoader().load('img/no_clouds_4k.jpg');
    var bumpEarth = new THREE.TextureLoader().load('img/elev_bump_4k.jpg');
    // 3. Material
    var matEarth = new THREE.MeshPhongMaterial({
        map: textEarth,
        bumpMap: bumpEarth
    });
    // 4. Mesh
    meshEarth = new THREE.Mesh(geoEarth, matEarth);
    // 5. Adicionar mesh a cena
    papi.add(meshEarth);
    // 6. Mudar atributos
    matEarth.bumpScale = 0.01;
    //meshEarth.position.y = 20;
    meshEarth.position.set(44, 8, -45);
}

function createClouds() {
    // 1. Geometria
    var geoClouds = new THREE.SphereGeometry(1.01, 32, 32);
    // 2. Texture
    var textClouds = new THREE.TextureLoader().load('img/fair_clouds_4k.png');
    // 3. Material
    var matClouds = new THREE.MeshPhongMaterial({
        map: textClouds,
        transparent: true
    })
    // 4. Mesh
    meshClouds = new THREE.Mesh(geoClouds, matClouds);
    // 5. Add mesh to scene
    papi.add(meshClouds);
    // 6. Edit atributes
    //meshClouds.position.y = 20;
    meshClouds.position.set(44, 8, -45);
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
    //raycaster.setFromCamera(mouse, camera);
    raycaster.set(controls.getObject().position, controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z)));

    // Intersects dos botoes
    // search for intersections
    var intersectsBtn = raycaster.intersectObjects([botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, botaoShootingRange, botaoSala]);
    if (intersectsBtn.length > 0) {
        //console.log(intersectsBtn)

        for (var i = 0; i < intersectsBtn.length; i++) {
            if (intersectsBtn[i].object.name == "botao1") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xffffff)
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao2") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x4B0082)
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x0000FF)
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao3") {
                ambientLight.raveMode = false
                ambientLight.color.set(0x4B0082)
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao4") {
                ambientLight.raveMode = true;

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
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao7") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xFF7F00)
                //console.log(ambientLight.color)
            }
            else if (intersectsBtn[i].object.name == "botao8") {
                ambientLight.raveMode = false
                ambientLight.color.set(0xFFFF00)
                //console.log(ambientLight.color)
            } else if (intersectsBtn[i].object.name == "botaoShootingRange") {
                console.log("Teleporting to shooting range...");
                playSound("audio/teleportSR.mp3", false)
                teleport(45, 0, -200);
                shootingAllowed = true;
                // Cria 6 projeteis
                arrayProjeteis = [];
                createProjetil();
                //papi.remove(scene.getObjectByName("Projetil"));
            } else if (intersectsBtn[i].object.name == "botaoSala") {
                console.log("Teleporting back");
                playSound("audio/teleportHome.mp3", false)
                teleport(0, 0, 0);
                shootingAllowed = false;
                arrayProjeteis = [];
            }
        }

        if (ambientLight.raveMode == true) {
            playSound("audio/darude.ogg", true);
        } else {
            sound.pause();
        }
    }

    // Intersects do movel
    var intersectsMovel = raycaster.intersectObjects(movel.children);
    if (intersectsMovel.length > 0) {
        console.log(intersectsMovel[0].object.name);
        if (intersectsMovel[0].object.name == "porta1") {
            // porta2Mexer = true
            movel.porta1Parada = false;

            //animate();
            console.log("porta parada: " + movel.porta1Parada);
        }
        if (intersectsMovel[0].object.name == "porta2") {
            // porta2Mexer = true
            movel.porta2Parada = false;

            //animate();
            console.log("porta2 parada: " + movel.porta1Parada);
        }
    }

    // Intersects da tv
    var intersectsTv = raycaster.intersectObjects(tv.children);
    if (intersectsTv.length > 0) {
        //console.log("Toquei na tv pa!");
        playSound("audio/tv.mp3", false);
    }

    // ShootingRange
    if (shootingAllowed == true) {
        // Retirar uma bala
        //arrayProjeteis.splice(-1, 1);
        //arrayProjeteis.shift();
        arrayProjeteis = arrayProjeteis.slice(1);
        //console.log(arrayProjeteis.length);

        // Fui eu que criei este codigo, mas ja nao me lembro o que e que faz... Tem a haver com as direcoes e posicoes das balas
        if (arrayProjeteis.length > 0) {
            playSound("audio/pew.mp3", false);
            arrayProjeteis[0].position.set(controls.getObject().position.x, controls.getObject().position.y + 20, controls.getObject().position.z);
            papi.add(arrayProjeteis[0]);
            projetilDir = controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z));
            moveProjetil = true;
        } else {
            playSound("audio/outOfAmmo.mp3", false);
        }
    }
}

// Event: onKeyDown
function onKeyDown(event) {
    //console.log(event.keyCode);
    // When holding shift, player runs
    if (event.keyCode == 16) {
        playerSpeed = 5; // Mais alto = Mais devagar!
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
            if (enableJump) {
                if (canJump === true) velocity.y += 350;
                canJump = false;
            }
            break;
        case 82: // r
            if (shootingAllowed == true) {
                playSound("audio/reload.mp3", false);
                // Cria 6 projeteis
                arrayProjeteis = [];
                createProjetil();
                //console.log(scene.getObjectByName("Projetil"));
                papi.remove(scene.getObjectByName("Projetil"));
            }
            break;
        case 67: // c
            if (isCrouched == false) {
                papi.position.y = -5;
                isCrouched = true;
            } else {
                papi.position.y = -20;
                isCrouched = false;
            }
            break;
        case 69: // e
            if (isSitting == false) {
                var mouse = new THREE.Vector2(
                    (event.clientX / window.innerWidth) * 2 - 1, //x
                    - (event.clientY / window.innerHeight) * 2 + 1); //y

                var raycaster = new THREE.Raycaster();
                // update the picking ray with the camera and mouse position
                //raycaster.setFromCamera(mouse, camera);
                raycaster.set(controls.getObject().position, controls.getDirection(new THREE.Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z)));

                //Intersects das cadeiras
                var intersects = raycaster.intersectObjects(cadeira.children);
                if (intersects.length > 0) {
                    var dir = getPlayerDirection();
                    if (dir == "nnp" || dir == "nnn") {
                        isSitting = true;
                        console.log("Sat down!");

                        // Change scene so it looks like were sitting
                        //console.log(cadeira.position);
                        //teleport(cadeira.position.x, 0, cadeira.position.z);
                        //papi.position.set(-controls.getObject().position.x, -15, -controls.getObject().position.z);
                    } else {
                        console.log("No sitting today! You have to face the chair please.");
                    }
                }
            } else {
                console.log("Stood Up!");
                isSitting = false;
            }
            break;
        case 81: // q
            console.log("Debugging key");
            debug();
            break;
        case 72: // h
            $("#info").hide();
            $("#infoHelp").show();
            $("#infoHelp").html("<p>Use WASD to move, SHIFT to run, C to crouch, SPACE to jump (if enabled), M to mute sounds and F to change the config.</p><p>Also, there's buttons around that you can click with your mouse. Try them out!</p>");
            break;
        case 70: // f
            showConfig = true;

            $("#info").hide();
            $("#infoHelp").show();
            $("#infoHelp").html("<p>Press the equivalent number on your keyboard to change config values</p><p>1. Player Speed</p><p>2. Bullet Speed</p><p>3. Enable/Disable Jump</p><p>4. Stop all sounds (NOT mute. To mute press M)</p><p>5. Number of bullets</p>");
            break;
        case 77: // m
            if (muteAll == true) {
                sound.play();
                muteAll = false;
            } else {
                sound.pause();
                muteAll = true;
            }
            break;
        case 49: // 1
            configPlayerSpeed = prompt("New playerSpeed value:", configPlayerSpeed);
            createNotification("Updated playerSpeed to " + configPlayerSpeed + "!");
            break;
        case 50: // 2
            projetilSpeed = prompt("New bulletSpeed value:", projetilSpeed);
            createNotification("Updated bulletSpeed to " + projetilSpeed + "!");
            break;
        case 51: // 3
            if (enableJump == false) {
                enableJump = true;
                createNotification("Jumping is now enabled!");
            } else {
                enableJump = false;
                createNotification("Jumping is now disabled!");
            }
            break;
        case 52: // 4
            stopSound();
            createNotification("Stopped all sounds!");
            break;
        case 53: // 5
            nProjeteis = prompt("New number of Bullets value:", nProjeteis);
            createNotification("Updated number of Bullets to " + nProjeteis + "!");
            break;
    }
}

// Event: onKeyUp
function onKeyUp(event) {
    if (event.keyCode == 16) {
        playerSpeed = configPlayerSpeed;
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
        case 72: // h
            $("#infoHelp").hide();
            $("#info").show();
            break;
        case 70: // f
            showConfig = false;

            $("#infoHelp").hide();
            $("#info").show();
            break;
    }
}

// Function that returns the given degrees in radians
function degreesToRadians(degrees) {
    var radians = degrees * Math.PI / 180;
    return radians;
}

// creates a notification
function createNotification(result) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(result);
        setTimeout(function () {
            notification.close();
        }, 3000);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(result);
                setTimeout(function () {
                    notification.close();
                }, 3000);
            }
        });
    }
}

// Play a sound
function playSound(src, loop) {
    if (sound.isPlaying == true) {
        stopSound();
    }
    if (muteAll == false) {
        //console.log(loop);
        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load(src, function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.play();
        });
        console.log("Started Sound: " + src);
    } else {
        console.log("Can't start sound because muteAll is set to true");
    }
}

// Stop all sounds playing
function stopSound() {
    sound.stop();
}

// Debug function (basically a function to test things...)
function debug() {
    // Nothing to test, yay :D
}