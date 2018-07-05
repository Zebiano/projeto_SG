# Salinha Interativa
## A project made with [THREE.js](https://threejs.org/) and [Pointerlock Controls](https://threejs.org/examples/misc_controls_pointerlock.html)

We ([HugoBar](https://github.com/HugoBar) and [me](https://github.com/Zebiano)) had to create a project for academic purposes that uses THREE.js. So we came up with this idea of having a little room with most of the things we've been taught:

- PointerLock Controls
- Simple object creation and animation
- Collisions
- Drag and drop
- Projectiles and trajectories (aka bullets)
- Sounds

And our little project contains all this. Just it's not working 100% correctly all the time and we don't really have clue to why this is like that. Either way, we'll keep on trying to fix stuff until we're sick of it!

### Things that aren't working:

- Somehow drag and drop is completely broken on our project. I'm pretty sure we're missign a common/stupid mistake or so, but fact is you can't move the chairs around just yet!
- ~~Raycaster isn't accurate everytime~~
- Teleporting the player around is another issue. It's not as easy as it sounds.

# Table of Contents:
[Teste](#teste2)

# PointerLock Controls Tutorial

So, I'm currently in the process of writing every little thing that comes to my mind that might help others use PointerLock Controls in THREE.js since there's not that much info on how to use PLC on the internet. In case you are trying to create a project that has one of the above mentioned features, feel free to take a look at our code and to read through this "article"!

## Set up PointerLock Controls

Ok, the first thing you'll want to do is download or copy the [PointerLock File](https://threejs.org/examples/misc_controls_pointerlock.html) from THREE.js (`Cntrl + U` and then click on "js/controls/PointerLockControls.js") or from this repo under the libs folder, though keep in mind it might be outdated. 

#### The following next steps will explain one-by-one how to implement PLC onto your project. If you think you're good enough to do it yourself go check the `/libs/presets/pointerlockFile.html` file. It's a trimmed version of the example in the THREE.js docs which contains only the essentails of PLC and a floor. But if you aren't that sure about yourself, I got you covered! Just follow the following steps carefully and you should be good to go:

**The first thing** to do is to edit your .html file. PLC needs a blocker div in order to get access to your mouse only after you've clicked on the screen. Add this to your .html file:
```
<div id="blocker">
    <div id="instructions">
        <span style="font-size:40px">Click to play</span>
        <br /> (W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)
    </div>
</div>
```
But it's not the only thing, because you'll have to add some CSS to it as well:
```
<style>
    body {
    	width: 100%;
    	height: 100%;
        background-color: #ffffff;
    	margin: 0;
    	overflow: hidden;
    	font-family: arial;
    }

    #blocker 
    	position: absolute
    	width: 100%;
    	height: 100%
    	background-color: rgba(0, 0, 0, 0.5)
    }

    #instructions 
    	width: 100%;
    	height: 100%
    	display: -webkit-box;
    	display: -moz-box;
    	display: box
    	-webkit-box-orient: horizontal;
    	-moz-box-orient: horizontal;
    	box-orient: horizontal
    	-webkit-box-pack: center;
    	-moz-box-pack: center;
    	box-pack: center
    	-webkit-box-align: center;
    	-moz-box-align: center;
    	box-align: center
    	color: #ffffff;
    	text-align: center
    	cursor: pointer;
    }
</style>
```

**Secondly** come all the variables that PLC uses. Besides the typical `var scene, camera, renderer` variables for a THREE.js scene to work, you'll also need the following variables:

```
/* -- PointerLock Varibles -- */
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var objects = [];
var raycaster;
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
var color = new THREE.Color();
```
In **third** place, you have to check that your browser actually supports PLC. I recommend creating a function containing the following code snippet and calling it at `window.onload = function init()` in order to keep your code organized!
```
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
```

**Fourth:** Define controls and raycaster:
```
// Controls
controls = new THREE.PointerLockControls(camera);
scene.add(controls.getObject());

// Raycaster
raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
```

**Fifth:** You'll need eventListeners to be able to walk:
```
// OnKeyDown
var onKeyDown = function (event) {
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
};

// OnKeyUp
var onKeyUp = function (event) {
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
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);
```

**Sixth:** You're almost done implementing PLC. Just a last step inside the `animate()` function:
```
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
```

**Alright, cool!** If you did everything correctly and I haven't done any mistake you should now be able to load your project and walk/look around using PLC! Great progress don't you think...?

# Teste2

## General tips and tricks for PLC

Please read through these tips, it might save you a lot of trouble regarding PLC!

1. awdawd
2. awdawd

These next sections will try to teach you how to implement the following:
- Projectiles
- Collisions
- Teleportations
- Drag and Drop

Still gotta write the rest... Please be patient.
