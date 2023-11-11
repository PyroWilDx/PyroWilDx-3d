// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { LoadingScreen } from './LoadingScreen.ts';
import { MainInit } from './MainInit.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';
import './style.css';

// Inits
Scene.initScene();

// World Building
let galaxy: Galaxy = Scene.galaxy;
galaxy.addStars(400, "res/3d/MarioStar/scene.gltf");

const menuFlagAddY = -400;

let kqPlanet = new Planet("res/imgs/Sun.jpg", 40,
	new THREE.Vector3(0, -100, -200), 10, "red");
kqPlanet.addRing(2, 10, null, 0x00BFFF);
kqPlanet.addRing(2, 10, null, 0xDC143C);
let kqFlag = new Flag(106.6670, 60, 
	null, "res/vids/Keqing.mp4",
	1, 120, 0xFFFFFF, "ProjectKeqing", 0, 0,
	null,
	"res/imgs/Icon_C++.png",
	"res/imgs/Icon_SDL2.png",
	"res/imgs/Icon_CLion.png",
	"res/imgs/Icon_Boost.png");
kqPlanet.setFlag(kqFlag);
galaxy.addPlanet(kqPlanet);
let kqMenuFlag = kqFlag.cloneForMenu();
kqMenuFlag.position.set(0, Galaxy.getGalaxyModelViewY() + menuFlagAddY, 0);
kqMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(kqMenuFlag);
LoadingScreen.updateCount();

let oregairuPlanet = new Planet("res/imgs/Sun.jpg", 20,
	new THREE.Vector3(-120, -100, -400), 10, "red");
oregairuPlanet.addRing(1, 6, null, 0xFFFFFF);
let oregairuFlag = new Flag(90, 60,
	null, "res/vids/Oregairu.mp4",
	1, 120, 0xFFFFFF, "ProjectOregairu", 0, 0,
	null,
	"res/imgs/Icon_Java.png",
	"res/imgs/Icon_AndroidStudio.png");
oregairuPlanet.setFlag(oregairuFlag);
galaxy.addPlanet(oregairuPlanet);
let oregairuMenuFlag = oregairuFlag.cloneForMenu();
oregairuMenuFlag.position.set(-200, Galaxy.getGalaxyModelViewY() + menuFlagAddY, 0);
oregairuMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(oregairuMenuFlag);
LoadingScreen.updateCount();

Utils.gltfLoader.load("res/3d/RobotUFO/scene.gltf", ( gltf ) => {
	galaxy.setPlayer(new Player(gltf.scene, 0.01));
	LoadingScreen.updateCount();
});

MainInit.initRoad();
LoadingScreen.updateCount();

Utils.gltfLoader.load("res/3d/Galaxy/scene.gltf", ( gltf ) => {
	let galaxyModel = gltf.scene;
	let scale = Galaxy.galaxyModelScale;
	galaxyModel.scale.set(scale, scale, scale);
	galaxyModel.position.set(0, Galaxy.galaxyModelY, 0);
	galaxy.setGalaxyModel(galaxyModel);
	LoadingScreen.updateCount();
});

// Event Listeners
window.addEventListener('resize', () => {
	Scene.updateRenderSize();
});

window.addEventListener('mousedown', (event) => {
	if (event.button === 0) {
		if (Utils.mousePosition.x > 1 - Utils.getScrollbarWidth()) return;

		Utils.isMouseDown = true;

		galaxy.updateCurrentHoldObj();
		
		if (event.target instanceof HTMLElement) {
			let id = event.target.id;
			if (!galaxy.rayCastObjects(true, true, true) && 
					id === Scene.projBgContainerId) {
				Scene.rmDisplayHold = true;
			}
		}
	}
});
  
window.addEventListener('mouseup', (event) => {
	if (event.button === 0 ) {
		if (Utils.mousePosition.x > 1 - ((Utils.getScrollbarWidth() / window.innerWidth) * 2)) return;

		galaxy.checkObjOnMouseUp();

		Utils.isMouseDown = false;

		if (event.target instanceof HTMLElement) {
			let id = event.target.id;
			if (Scene.rmDisplayHold && 
					!galaxy.rayCastObjects(true, true, true) &&
					id === Scene.projBgContainerId) {
				Scene.removeProjectDisplayer();
			}
		}
		Scene.rmDisplayHold = false;
	}
});

window.addEventListener('mousemove', (event) => {
	Utils.updateMousePosition(event);
});

window.addEventListener("wheel", (event) => {
	Utils.mouseWheel = true;

	if (Scene.currentMenu == 0 && Scene.cameraFollowingObj) {
		let forward = event.deltaY >= 0;
		MainInit.moveForward(forward);

		event.preventDefault();
	}
}, {passive: false});

window.addEventListener("scroll", (event) => {
	if (Utils.mouseWheel) return;

	if (Scene.currentMenu == 0 && Scene.cameraFollowingObj) {
		event.preventDefault();


		const currentScrollHeight = document.documentElement.scrollTop;
		let i = (currentScrollHeight / MainInit.scrollHeight) * MainInit.scrollLengthAdv;
		i = Math.round(i / MainInit.scrollLengthAdv) * MainInit.scrollLengthAdv;
		if (i > 0) {
			MainInit.i = i - MainInit.scrollLengthAdv;
			MainInit.moveForward(true);
		} else {
			MainInit.i = i + MainInit.scrollLengthAdv;
			MainInit.moveForward(false);
		}
	}
}, {passive: false});

window.addEventListener("keydown", function(event) {
	let key = event.key;
	Utils.updateKeyMap(key, true);

	if (key == "Escape") {
		Scene.removeProjectDisplayer();
	}
});

window.addEventListener("keyup", function(event) {
	let key = event.key;
	Utils.updateKeyMap(key, false);
});

let menuRoad = document.getElementById("menuRoad");
let menuOverview = document.getElementById("menuOverview");
let menuAbout = document.getElementById("menuAbout");

if (menuRoad != null && menuOverview != null && menuAbout != null) {
	menuRoad.style.opacity = "1";

	menuRoad.addEventListener("click", function () {
		if (Scene.currentMenu == 0) return;
		Scene.setCurrentMenu(0);

		document.documentElement.style.height = MainInit.htmlHeight;
        window.scrollTo({
			top: (MainInit.i / MainInit.scrollLengthAdv) * MainInit.scrollHeight,
			behavior: 'auto'
		});

		let cameraLerp = Scene.setCameraLerp(MainInit.target.position, MainInit.target);
		cameraLerp.setFinalPosition(new THREE.Vector3(0, 0, 0));
		cameraLerp.setLookQuaternion(new THREE.Quaternion().setFromEuler(
			new THREE.Euler(-Math.PI / 2, 0, 0)));
		cameraLerp.setMaxDist(-1);
	});

	menuOverview.addEventListener("click", function () {
		if (Scene.currentMenu == 1) return;
		Scene.setCurrentMenu(1);

		document.documentElement.style.height = "100%";
        window.scrollTo(0, 0);
		document.documentElement.style.overflowY = 'scroll';

		let galaxyModelPosition = galaxy.getGalaxyModelPosition();
		let finalPosition = new THREE.Vector3(galaxyModelPosition.x, 
			Galaxy.getGalaxyModelViewY(),
			galaxyModelPosition.z);
		let cameraLerp = Scene.setCameraLerp(finalPosition, null);
		cameraLerp.setLookQuaternion(new THREE.Quaternion().setFromEuler(
			new THREE.Euler(-Math.PI / 2, 0, 0)));
		cameraLerp.setEpsilons(0, 0);
	});

	menuAbout.addEventListener("click", function () {
		if (Scene.currentMenu == 2) return;
		Scene.setCurrentMenu(2);

		document.documentElement.style.height = "100%";
        window.scrollTo(0, 0);
		document.documentElement.style.overflowY = 'scroll';
	});
}

// Main Loop
function animate() {
	requestAnimationFrame(animate);

	Utils.updateDt();

	TWEEN.update();

	galaxy.updateFrame();

	Scene.updateFrame();

	Utils.mouseWheel = false;
}

while (!MainInit.doneOneRound) {
	MainInit.moveForward(true);
}
LoadingScreen.updateCount();

while (LoadingScreen.currCount < LoadingScreen.maxCount) {
	LoadingScreen.updateLoadingScreen();

	await Utils.sleep(20);
}

let loadingScreen = document.getElementById("loadingScreen");
let bg = document.getElementById("bg");
let socialIcons = document.getElementById("socialIcons");
let menu = document.getElementById("menu");
if (loadingScreen != null && bg != null &&
		socialIcons != null && menu != null) {
	loadingScreen.style.display = "none";
	bg.style.display = "";
	socialIcons.style.display = "";
	menu.style.display = "";
	document.documentElement.style.height = MainInit.htmlHeight;
	window.scrollTo(0, 0);
}

animate();
