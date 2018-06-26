# Salinha Interativa
## A project made with [THREE.js](https://threejs.org/) and [Pointerlock Controls](https://threejs.org/examples/misc_controls_pointerlock.html)

We ([HugoBar](https://github.com/HugoBar) and [me](https://github.com/Zebiano)) had to create a project for academic purposes that uses THREE.js. So we came up with this idea of having a little room with most of the things we've been taught:

- PointerLock Controls
- Simple object creation and animation
- Collisions
- Drag and drop
- Projectiles and trajectories (aka bullets)

And our little project contains all this. Just it's not working 100% correctly all the time and we don't really have clue to why this is like that. Either way, we'll keep on trying to fix stuff until we're sick of it!

### Things that aren't working:

- Im trying out githubs own "not working"-type of project page... Let's see how that goes.

# Important info: (Sort of a PointerLock Controls tutorial)

So, I'm currently in the process of writing every little thing that comes to my mind that might help others use PointerLock Controls in THREE.js since there's not that much info on how to use PLC on the internet. In case you are trying to create a project that has one of the above mentioned features, feel free to take a look at our code and to read through this "article"!

## Set up PointerLock Controls

Ok, the first thing you'll want to do is downlaod or copy the [PointerLock File](https://threejs.org/examples/misc_controls_pointerlock.html) from THREE.js (`Cntrl + U` and then click on "js/controls/PointerLockControls.js") or from this repo under the libs folder, though keep in mind it might be outdated. 

The following next steps will explain one-by-one how to implement PLC onto your project. If you think you're good enough to do it yourself go check the `/libs/presets/pointerlockFile.html` file. It's a trimmed version of the example in the THREE.js docs which contains only the essentails of PLC and a floor.

But if you aren't that sure about yourself, I got you covered! Just follow the following steps carefully and you should be good to go:

1. The first thing to do is to edit your .html file. PLC needs a blocker div in order to get access to your mouse only after you've clicked on the screen. Add this to your .html file:
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
2. Next up are all teh variables and animate() function and such. Still gotta write the rest... Be Patient.