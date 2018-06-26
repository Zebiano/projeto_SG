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

// Gets random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '0x';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Debug function (basically a function to test things...)
function debug() {
    // Nothing to test, yay :D
}