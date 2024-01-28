// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { LoadingScreen } from './LoadingScreen.ts';
import { MainInit } from './MainInit.ts';
import { Planet } from './Planet.ts';
import { RotatingObject } from './RotatingObject.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';
import './style.css';

let loaded = false;

// Inits
Scene.initScene();

// World Building
let galaxy: Galaxy = Scene.galaxy;
galaxy.addStars(156, "res/3d/MarioStar/scene.gltf", 1);

const menuFlagAddY = -200;

let kqPosition = new THREE.Vector3(-130, 52, 1600);
let robotsPVZPosition = new THREE.Vector3(-130, 0, 1400);
let badApplePosition = new THREE.Vector3(-116, -30, 1200);
let oregairuPosition = new THREE.Vector3(-100, -100, 1000);
let bleachPosition = new THREE.Vector3(-130, -62, 800);
let glPosition = new THREE.Vector3(-130, -146, 600);
let igPosition = new THREE.Vector3(-120, -146, 400);
let fftPosition = new THREE.Vector3(-130, -122, 200);

let xMenu = Galaxy.xMenuFlag;
let kqMenuPosition = new THREE.Vector3(-xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, -100 + MainInit.meanZ);
let robotsPVZMenuPosition = new THREE.Vector3(-xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, -32 + MainInit.meanZ);
let badAppleMenuPosition = new THREE.Vector3(-xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, 36 + MainInit.meanZ)
let oregairuMenuPosition = new THREE.Vector3(-xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, 136 + MainInit.meanZ);
let bleachMenuPosition = new THREE.Vector3(-xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, 236 + MainInit.meanZ);
let glMenuPosition = new THREE.Vector3(xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, -100 + MainInit.meanZ);
let igMenuPosition = new THREE.Vector3(xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, -32 + MainInit.meanZ);
let fftMenuPosition = new THREE.Vector3(xMenu,
	Galaxy.getGalaxyModelViewY() + menuFlagAddY, 36 + MainInit.meanZ);

let kqPlanet = new Planet("res/imgs/planets/Planet_Fiery.png", 40,
	kqPosition, 0.6, "red");
kqPlanet.addRing(2, 8, "res/imgs/rings/Blue.jpg", null, 0.6, "cyan");
kqPlanet.addRing(10, 10, "res/imgs/rings/Green.png", null, 6, 0x79B23F);
let kqFlag = new Flag(106, 60,
	null, "res/vids/Keqing.mp4",
	1, 106, 0xFFFFFF, "ProjectKeqing", 0, 0,
	null,
	"res/imgs/icons/Icon_C++.png",
	"res/imgs/icons/Icon_SDL2.png",
	"res/imgs/icons/Icon_CLion.png");
// kqFlag.rotateY(Math.PI);
kqPlanet.setFlag(kqFlag);
galaxy.addPlanet(kqPlanet);
let kqMenuFlag = kqFlag.cloneForMenu();
kqMenuFlag.position.copy(kqMenuPosition);
kqMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(kqMenuFlag);
LoadingScreen.updateCount();

let robotsPVZPlanet = new Planet("res/imgs/planets/Planet_Grass0.jpg", 26,
	robotsPVZPosition, 6, "green");
robotsPVZPlanet.addRing(2, 8, "res/imgs/rings/Orange.jpg", null, 2, "orange");
let robotsPVZFlag = new Flag(100, 60,
	"res/imgs/WIP.jpg", null,
	1, 100, 0xFFFFFF, "ProjectRobotsPVZ", 0, 0,
	null,
	"res/imgs/icons/Icon_C++.png",
	"res/imgs/icons/Icon_UnrealEngine.jpg",
	"res/imgs/icons/Icon_VisualStudio.png");
robotsPVZPlanet.setFlag(robotsPVZFlag);
galaxy.addPlanet(robotsPVZPlanet);
let robotsPVZMenuFlag = robotsPVZFlag.cloneForMenu();
robotsPVZMenuFlag.position.copy(robotsPVZMenuPosition);
robotsPVZMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(robotsPVZMenuFlag);
LoadingScreen.updateCount();

let badApplePlanet = new Planet("res/imgs/planets/Planet_Frozen.jpg", 36,
	badApplePosition, 0.4, "cyan");
badApplePlanet.addRing(2, 8, "res/imgs/rings/Green.png", null, 6, 0x79B23F);
badApplePlanet.addRing(10, 10, "res/imgs/rings/Red.png", null, 2, "red");
let badAppleFlag = new Flag(80, 60,
	"res/imgs/BadApple.png", null,
	1, 110, 0xFFFFFF, "ProjectBadApple", 0, 0,
	null,
	"res/imgs/icons/Icon_C++.png",
	"res/imgs/icons/Icon_OpenCV.png",
	"res/imgs/icons/Icon_CLion.png");
badApplePlanet.setFlag(badAppleFlag);
galaxy.addPlanet(badApplePlanet);
let badAppleMenuFlag = badAppleFlag.cloneForMenu();
badAppleMenuFlag.position.copy(badAppleMenuPosition);
badAppleMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(badAppleMenuFlag);
LoadingScreen.updateCount();

let oregairuPlanet = new Planet("res/imgs/planets/Planet_Lava.jpg", 30,
	oregairuPosition, 0.4, "red");
oregairuPlanet.addRing(2, 8, "res/imgs/rings/Blue.jpg", null, 0.6, "cyan");
let oregairuFlag = new Flag(60, 124,
	null, "res/vids/Oregairu.mp4",
	1, 160, 0xFFFFFF, "ProjectOregairu", 0, 0,
	null,
	"res/imgs/icons/Icon_Java.png",
	"res/imgs/icons/Icon_AndroidStudio.png");
oregairuPlanet.setFlag(oregairuFlag);
galaxy.addPlanet(oregairuPlanet);
let oregairuMenuFlag = oregairuFlag.cloneForMenu();
oregairuMenuFlag.position.copy(oregairuMenuPosition);
oregairuMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(oregairuMenuFlag);
LoadingScreen.updateCount();

let bleachPlanet = new Planet("res/imgs/planets/Planet_Purple0.png", 26,
	bleachPosition, 1, "purple");
bleachPlanet.addRing(2, 8, "res/imgs/rings/Green.png", null, 6, 0x79B23F);
let bleachFlag = new Flag(112, 60,
	null, "res/vids/Bleach.mp4",
	1, 100, 0xFFFFFF, "ProjectBleach", 0, 0,
	null,
	"res/imgs/icons/Icon_Python.png",
	"res/imgs/icons/Icon_PyGame.png",
	"res/imgs/icons/Icon_Pyzo.png");
bleachPlanet.setFlag(bleachFlag);
galaxy.addPlanet(bleachPlanet);
let bleachMenuFlag = bleachFlag.cloneForMenu();
bleachMenuFlag.position.copy(bleachMenuPosition);
bleachMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(bleachMenuFlag);
LoadingScreen.updateCount();

let glPlanet = new Planet("res/imgs/planets/Planet_Sun.jpg", 36,
	glPosition, 0.8, "orange");
glPlanet.addRing(2, 8, "res/imgs/rings/Red.png", null, 2, "red");
glPlanet.addRing(10, 10, "res/imgs/rings/Blue.jpg", null, 0.6, "cyan");
let glFlag = new Flag(100, 60,
	"res/imgs/WIP.jpg", null,
	1, 110, 0xFFFFFF, "ProjectENSIMAG_GL", 0, 0,
	null);
glPlanet.setFlag(glFlag);
galaxy.addPlanet(glPlanet);
let glMenuFlag = glFlag.cloneForMenu();
glMenuFlag.position.copy(glMenuPosition);
glMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(glMenuFlag);
LoadingScreen.updateCount();

let igPlanet = new Planet("res/imgs/planets/Planet_Yellow.png", 32,
	igPosition, 0.6, "yellow");
igPlanet.addRing(2, 10, "res/imgs/rings/Pink.png", null, 2, 0xFF4E87);
let igFlag = new Flag(80, 60,
	"res/imgs/IGPuzzle.png", null,
	1, 100, 0xFFFFFF, "ProjectENSIMAG_IG", 0, 0,
	null,
	"res/imgs/icons/Icon_CLanguage.png",
	"res/imgs/icons/Icon_CLion.png");
igPlanet.setFlag(igFlag);
galaxy.addPlanet(igPlanet);
let igMenuFlag = igFlag.cloneForMenu();
igMenuFlag.position.copy(igMenuPosition);
igMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(igMenuFlag);
LoadingScreen.updateCount();

let fftPlanet = new Planet("res/imgs/planets/Planet_Pink0.jpg", 30,
	fftPosition, 0.6, "pink");
fftPlanet.addRing(2, 8, "res/imgs/rings/Green.png", null, 6, 0x79B23F);
let fftFlag = new Flag(106, 60,
	"res/imgs/FFT.jpg", null,
	1, 100, 0xFFFFFF, "ProjectUPMC_FFT", 0, 0,
	null,
	"res/imgs/icons/Icon_CLanguage.png",
	"res/imgs/icons/Icon_AVX2.png",
	"res/imgs/icons/Icon_VSCode.png");
fftPlanet.setFlag(fftFlag);
galaxy.addPlanet(fftPlanet);
let fftMenuFlag = fftFlag.cloneForMenu();
fftMenuFlag.position.copy(fftMenuPosition);
fftMenuFlag.rotateX(-Math.PI / 2);
galaxy.addMenuFlag(fftMenuFlag);
LoadingScreen.updateCount();

let tmpTex: THREE.Texture;
let tmpObj: RotatingObject;

import { DecorationCube } from './DecorationCube.ts'; // Je vais devenir fou

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioStar.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(40, 40, 40, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioCoin.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(40, 40, 40, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioSurprise.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(62, 62, 62, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioCloud.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(56, 56, 56, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioCloudPink.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(66, 66, 66, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioPow.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(72, 72, 72, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioM.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(62, 62, 62, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioBrick.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(56, 56, 56, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioEvent.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(62, 62, 62, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioBrickPink.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(66, 66, 66, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioStrength.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(62, 62, 62, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioSound.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(68, 68, 68, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

tmpTex = Utils.textureLoader.load("res/imgs/maps/MarioStone.png");
tmpObj = new DecorationCube(
	new THREE.BoxGeometry(72, 72, 72, 1, 1, 1),
	new THREE.MeshBasicMaterial({
		map: tmpTex,
		side: THREE.FrontSide
	}),
	Utils.getRandomVector3Spread(0.006),
	0.001
);
galaxy.addOtherObjectMoving(tmpObj); // OK

LoadingScreen.updateCount();

MainInit.initRoad();
LoadingScreen.updateCount();

// Event Listeners
window.addEventListener("focus", () => { 
    Utils.dt = 0;
}, false);

window.addEventListener('resize', () => {
	Scene.updateRenderSize();
}, false);

window.addEventListener('mousedown', (event) => {
	if (Scene.askRotating) return;

	if (!loaded) return;

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

let clickSound = new Audio("res/sfx/Click.mp3");
clickSound.volume = 0.6;

window.addEventListener('mouseup', (event) => {
	if (Scene.askRotating) return;

	if (!loaded) return;

	if (event.button === 0) {
		let targetElement = document.elementFromPoint(event.clientX, event.clientY);
		let wasPointer = false;
		if (targetElement != null) {
			let cursorStyle = window.getComputedStyle(targetElement).cursor;
			wasPointer = (cursorStyle == "pointer");
		}

		if (wasPointer && Scene.isPlayingSound && !Scene.equalizerDown) {
			clickSound.currentTime = 0;
			clickSound.play()
		}

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
	if (Scene.askRotating) return;
	
	if (!loaded) return;
	
	Utils.updateMousePosition(event);
});

window.addEventListener("wheel", (event) => {
	if (Scene.askRotating) {
		event.preventDefault();
		return;
	}

	if (!loaded) {
		event.preventDefault();
		return;
	}

	Utils.mouseWheel = true;

	if (Scene.currentMenu == 0 && !Scene.isDisplayingProject() &&
			!(Scene.aboutSectionTargetOpacity == 1)) {
		event.preventDefault();
	}

	if (Scene.currentMenu == 0 && Scene.cameraFollowingObj &&
			!(Scene.aboutSectionTargetOpacity == 1)) {
		let forward = event.deltaY >= 0;
		MainInit.moveForward(forward);

		if (!Utils.scrolled && MainInit.i != 0) {
			let scrollToExplore = document.getElementById("scrollToExplore");
			if (scrollToExplore != null) {
				Scene.scrollToExploreFadeOut();
			}
			Utils.scrolled = true;
		}
	}

	if (Scene.currentMenu == 1 && !Scene.isDisplayingProject() &&
		!(Scene.aboutSectionTargetOpacity == 1)) {
		if (event.deltaY < 0) {
			galaxy.zShiftMenuFlags(Galaxy.zShiftScrollLength);
		} else {
			galaxy.zShiftMenuFlags(-Galaxy.zShiftScrollLength);
		}
	}

}, {passive: false});

window.addEventListener("scroll", (event) => {
	if (Scene.askRotating) {
		event.preventDefault();
		return;
	}

	if (!loaded) {
		event.preventDefault();
		return;
	}

	if (Utils.mouseWheel) return;

	if (Scene.currentMenu == 0 && !Scene.isDisplayingProject() &&
			!(Scene.aboutSectionTargetOpacity == 1)) {
		event.preventDefault();
	}

	if (Scene.currentMenu == 0 && Scene.cameraFollowingObj &&
			!(Scene.aboutSectionTargetOpacity == 1)) {
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

		if (!Utils.scrolled && MainInit.i != 0) {
			let scrollToExplore = document.getElementById("scrollToExplore");
			if (scrollToExplore != null) {
				Scene.scrollToExploreFadeOut();
			}
			Utils.scrolled = true;
		}
	}
}, {passive: false});

let closeButton = document.getElementById("closeButton");
if (closeButton != null) {
	closeButton.addEventListener("click", () => {
		Scene.removeProjectDisplayer();
	});
}

window.addEventListener("keydown", (event) => {
	if (Scene.askRotating) return;

	let key = event.key;
	// Utils.updateKeyMap(key, true);

	if (key == "Escape") {
		if (Scene.isCameraLerping() && !Scene.cameraFollowingObj) {
			Scene.removeCameraLerp();
		}
		Scene.removeProjectDisplayer();
	}
});

// window.addEventListener("keyup", (event) => {
// 	let key = event.key;
// 	Utils.updateKeyMap(key, false);
// });

document.documentElement.style.overflowY = 'scroll';

let menuRoad = document.getElementById("menuRoad");
let menuOverview = document.getElementById("menuOverview");
let menuAbout = document.getElementById("menuAbout");

if (menuRoad != null && menuOverview != null && menuAbout != null) {
	menuRoad.style.opacity = "1";

	menuRoad.addEventListener("click", () => {
		if (Scene.currentMenu == 0) return;
		Scene.setCurrentMenu(0);

		Scene.camera.fov = 60;
		Scene.camera.updateProjectionMatrix();
		
		if (!Utils.scrolled) Scene.showScrollToExplore(true);

		Galaxy.showButtonUpDown(false);

		document.documentElement.style.height = MainInit.htmlHeight;
        window.scrollTo({
			top: (MainInit.i / MainInit.scrollLengthAdv) * MainInit.scrollHeight,
			behavior: 'auto'
		});
		Scene.showProgressBar();

		let cameraLerp = Scene.setCameraLerp(MainInit.target.position, MainInit.target);
		cameraLerp.setFinalPosition(new THREE.Vector3(0, 0, 0));
		cameraLerp.setLookQuaternion(new THREE.Quaternion().setFromEuler(
			new THREE.Euler(-Math.PI / 2, 0, 0)));
		cameraLerp.setMaxDist(-1);

		galaxy.showPlanetFlags();
	});

	menuOverview.addEventListener("click", () => {
		if (Scene.currentMenu == 1) return;
		Scene.setCurrentMenu(1);

		Scene.camera.fov = 80;
		Scene.camera.updateProjectionMatrix();

		if (!Utils.scrolled) Scene.showScrollToExplore(false);

		Galaxy.showButtonUpDown(true);

		document.documentElement.style.height = "100%";
        window.scrollTo(0, 0);
		Scene.hideProgressBar();

		let galaxyModelPosition = galaxy.getGalaxyModelPosition();
		let finalPosition = new THREE.Vector3(galaxyModelPosition.x, 
			Galaxy.getGalaxyModelViewY(),
			galaxyModelPosition.z);
		let cameraLerp = Scene.setCameraLerp(finalPosition, null);
		cameraLerp.setLookQuaternion(new THREE.Quaternion().setFromEuler(
			new THREE.Euler(-Math.PI / 2, 0, 0)));
		cameraLerp.setEpsilons(0, 0);

		galaxy.hidePlanetFlags();
	});

	menuAbout.addEventListener("mouseover", () => {
		if ((Scene.currentMenu == 0 && 
				!Scene.isDisplayingProject() &&
				(!Scene.isCameraLerping() || Scene.cameraFollowingObj) &&
				Scene.aboutSection != null) ||
			(Scene.currentMenu == 1 &&
				!Scene.isDisplayingProject() &&
				Scene.aboutSection != null)) {
			Scene.aboutSection.style.position = "absolute";
			Scene.aboutSection.style.top = "8px";
			Scene.aboutSectionTargetOpacity = 1;
			document.documentElement.style.height = "100%";
            window.scrollTo(0, 0);
		}

		if (Scene.currentMenu == 1 && !Scene.isDisplayingProject()) {
			Galaxy.showButtonUpDown(false);
		}
	});

	menuAbout.addEventListener("mouseout", () => {
		if (Scene.aboutSection != null) {
			let top = -window.scrollY + 8;
			Scene.aboutSection.style.position = "fixed";
			Scene.aboutSection.style.top = top + "px";
		}
		Scene.aboutSectionTargetOpacity = 0;
		if (!Scene.isDisplayingProject() && Scene.currentMenu == 0) {
			document.documentElement.style.height = MainInit.htmlHeight;
			window.scrollTo({
				top: (MainInit.i / MainInit.scrollLengthAdv) * MainInit.scrollHeight,
				behavior: 'auto'
			});
		}

		if (Scene.currentMenu == 1) {
			Galaxy.showButtonUpDown(true);
		}
	});

	menuAbout.addEventListener("click", () => {
		if (Scene.aboutSectionTargetOpacity == 1) return;
		 
		Scene.removeProjectDisplayer(false);
		if (Scene.isCameraLerping() && !Scene.cameraFollowingObj && Scene.currentMenu != 1) {
			Scene.removeCameraLerp();
		}
		if (Scene.aboutSection != null) {
			Scene.aboutSection.style.position = "absolute";
			Scene.aboutSection.style.top = "8px";
			Scene.aboutSectionTargetOpacity = 1;
			document.documentElement.style.height = "100%";
			window.scrollTo(0, 0);
		}

		if (Scene.currentMenu == 1) {
			Galaxy.showButtonUpDown(false);
		}
	});
}

if (Galaxy.buttonUp != null && Galaxy.buttonDown != null) {
	Galaxy.buttonUp.addEventListener("click", () => {
		galaxy.zShiftMenuFlags(Galaxy.zShiftScrollLength);
	});

	Galaxy.buttonDown.addEventListener("click", () => {
		galaxy.zShiftMenuFlags(-Galaxy.zShiftScrollLength);
	});
}

// Main Loop
function animate() {
	requestAnimationFrame(animate);

	Utils.updateDt();

	TWEEN.update();

	if (!Scene.askRotating) {
		galaxy.updateFrame();
		Scene.updateFrame();
	}

	Utils.mouseWheel = false;
}

while (!MainInit.doneOneRound) {
	MainInit.moveForward(true);
}
LoadingScreen.updateCount();

while (LoadingScreen.currCount < LoadingScreen.maxCount) {
	LoadingScreen.updateLoadingScreen();

	await Utils.sleep(0);
}

let loadingScreen = document.getElementById("loadingScreen");
let bg = document.getElementById("bg");
let scrollToExplore = document.getElementById("scrollToExplore");
let socialIcons = document.getElementById("socialIcons");
let menu = document.getElementById("menu");
if (loadingScreen != null && bg != null && scrollToExplore != null &&
		socialIcons != null && menu != null) {
	bg.style.display = "";
	scrollToExplore.style.display = "";
	socialIcons.style.display = "";
	menu.style.display = "";
	for (LoadingScreen.preLoadCount = 0;
			LoadingScreen.preLoadCount < LoadingScreen.preLoadMaxCount;
			LoadingScreen.preLoadCount++) {
		Utils.updateDt();
		galaxy.updateFrame();
		Scene.updateFrame();
		LoadingScreen.updateLoadingScreen();
		await Utils.sleep(0);
	}
	galaxy.showPlanetFlags();
	Scene.camera.position.set(0, 2000, 1800);
	loadingScreen.style.display = "none";
	document.documentElement.style.height = MainInit.htmlHeight;
	window.scrollTo(0, 0);
}

Scene.updateRenderSize();

let music = new Audio("res/sfx/Music.mp3");
music.volume = 0.142;
music.loop = true;

window.addEventListener("click", () => {
	if (!Scene.firstClick) {
		Scene.isPlayingSound = true;
		music.play();
	}
	Scene.firstClick = true;
}, false);

let soundEqualizer = document.getElementById("soundEqualizer");
if (soundEqualizer != null) {
	soundEqualizer.addEventListener("mousedown", () => {
		Scene.equalizerDown = true;
	});
	soundEqualizer.addEventListener("click", () => {
		Scene.equalizerDown = false;
		Scene.isPlayingSound = !Scene.isPlayingSound;
		if (Scene.isPlayingSound) music.play();
		else {
			music.pause();
			Scene.muteSoundEqualizer();
		}
	});
}

loaded = true;

animate();
