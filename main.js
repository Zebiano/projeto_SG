// THREE.js variables
var renderer, scene, raycaster, objLoader, camera, controls, mouse, offset, listener, sound;

// Object Variables
var cadeira, cadeira2, cadeira3, cadeira4, botao1, botao2, botao3, botao4, botao5, botao6, botao7, botao8, movel, quadroLuz, tv, botaoShootingRange, botaoSala, alvo, crosshair, selectedObject, ambientLight, plane, meshPropeller, meshEarth, meshClouds, teleportX, teleportY, teleportZ, projetilDir;

// Object that has all the objects of the scene in it
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

// Default Values - Don't mess around with these please...
var soma = 1.5;
var playerSpeed = 14; // Higher value = Slower speed!

// CONFIG - Change if needed, tho recommened is to use the built-in config. Press F while inside the scene.
var projetilSpeed = 3;
var configPlayerSpeed = 14; // Higher value = Slower speed!
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.add(listener);
    scene.add(camera);

    // PointerLockControls
    addPointerLockControls();
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // Create Crosshair
    createCrosshair();

    // Lights
    createLights();

    // Floor/Walls/Ceiling - Set to true if you want to see BoxHelpers
    createChao(false);
    createParedeEsquerda(false);
    createParedeDireita(false);
    createParedeFundo(false);
    createParedePerto(false);

    // Objects - Set to true if you want to see BoxHelpers
    createMesa(false);
    createTv(false);
    createSofa(false);
    createMovel(false);
    createCadeiras(false);
    createQuadroLuz(false);
    createBotaoShootingRange(false);
    createBotaoSala(false);
    createAlvo(false);
    createShootingRange();
    createPlane();
    createEarth();
    createClouds();

    // Planes to move things around
    createPathCadeiras();

    // Add papi to the scene
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

        // Collisions
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