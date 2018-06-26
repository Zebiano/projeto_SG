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