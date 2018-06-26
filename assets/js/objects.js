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

// Creates a Plane inside the movel
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

// Creates Earth inside the movel
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

// Creates Earths clouds inside the movel
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

// Creates the button to teleport to the Shooting Range
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

// Creates the button to return to the main room
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

// Creates a traget
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