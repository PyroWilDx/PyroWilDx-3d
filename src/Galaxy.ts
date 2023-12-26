import * as THREE from 'three';
import { ClickableInterface } from './ClickableInterface.ts';
import { Flag } from './Flag.ts';
import { LoadingScreen } from './LoadingScreen.ts';
import { MainInit } from './MainInit.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { RayCastableInterface } from './RayCastableInterface.ts';
import { RotatingObject } from './RotatingObject.ts';
import { Scene } from './Scene.ts';
import { Star } from './Star.ts';
import { Utils } from './Utils.ts';

export class Galaxy {
    public static readonly galaxyModelY = 900;
    public static readonly galaxyModelScale = 200;

    private radius: number;

    // private galaxyModel: THREE.Group<THREE.Object3DEventMap> | null;
    private galaxyModel: THREE.Mesh | null;
    private menuFlags: Flag[];

    private allStars: Star[];
    private allPlanets: Planet[];
    private player: Player | null;

    private otherObjects: RotatingObject[];

    private lastRayCastTime: number;

    private currHoldObj: ClickableInterface | null;
    private currObj: ClickableInterface | null;

    private rayCastedObjects: RayCastableInterface[];

    private currMenuFlagZShifts: number;

    public static readonly zShiftScrollLength: number = 20; 
    public static readonly buttonUp: HTMLElement | null = document.getElementById("buttonUp");
    public static readonly buttonDown: HTMLElement | null = document.getElementById("buttonDown");

    constructor(radius: number) {
        this.radius = radius;

        this.galaxyModel = null;
        this.menuFlags = [];

        this.allStars = [];
        this.allPlanets = [];
        this.player = null;

        this.otherObjects = [];

        this.lastRayCastTime = 0;

        this.currHoldObj = null;
        this.currObj = null;
    
        this.rayCastedObjects = [];
    
        this.currMenuFlagZShifts = 0;
    }

    addBackgroundImg(backgroundPath: string) {
        let backgroundMesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 64, 64),
            new THREE.MeshBasicMaterial({ 
                map: Utils.textureLoader.load(backgroundPath),
                side: THREE.BackSide
              })
        );
        Scene.addEntity(backgroundMesh);
    }

    static getGalaxyModelViewY(): number {
        return Galaxy.galaxyModelY + Galaxy.galaxyModelScale + 0;
    }

    static showButtonUpDown(show: boolean) {
        if (Galaxy.buttonUp != null && Galaxy.buttonDown != null) {
            if (show) {
                Galaxy.buttonUp.style.display = "";
                Galaxy.buttonDown.style.display = "";
                Galaxy.buttonUp.style.opacity = "0";
                Galaxy.buttonDown.style.opacity = "0";
            } else {
                Galaxy.buttonUp.style.display = "none";
                Galaxy.buttonDown.style.display = "none";
            }
        }
    }

    // setGalaxyModel(galaxyModel: THREE.Group<THREE.Object3DEventMap>): void {
    //     this.galaxyModel = galaxyModel;
    //     this.showGalaxyModel();
    // }

    setGalaxyModel(galaxyModel: THREE.Mesh): void {
        this.galaxyModel = galaxyModel;
        this.showGalaxyModel();
    }

    hideGalaxyModel(): void {
        if (this.galaxyModel != null) Scene.removeEntity(this.galaxyModel);
    }

    showGalaxyModel(): void {
        if (this.galaxyModel != null) Scene.addEntity(this.galaxyModel);
    }

    getGalaxyModelPosition(): THREE.Vector3 {
        if (this.galaxyModel != null) return this.galaxyModel.position.clone();
        return new THREE.Vector3(0, 0, MainInit.meanZ);
    }

    getGalaxyModelScale(): number {
        if (this.galaxyModel != null) return this.galaxyModel.scale.x;
        return 0;
    }

    addMenuFlag(flag: Flag): void {
        this.menuFlags.push(flag);
    }

    addStars(nStars: number, modelPath: string, scale: number): void {
        Utils.gltfLoader.load(modelPath, ( gltf ) => {
            let baseStarModel = gltf.scene;
            Utils.setEmissiveGLTF(baseStarModel, 52);
            for (let i = 0; i < nStars; i++) {
                let currStar = new Star(baseStarModel.clone(),
                    THREE.MathUtils.randFloat(0.004, 0.02),
                    THREE.MathUtils.randFloat(0.0001, 0.001),
                    Utils.getRandomVector3Spread(this.radius / 1.2));
                currStar.scale.set(scale, scale, scale);
                this.allStars.push(currStar);
            }
            LoadingScreen.updateCount();
        });
    }

    addPlanet(planet: Planet):void {
        this.allPlanets.push(planet);
    }

    setPlayer(player: Player): void {
        this.player = player;
    }

    getPlayer(): Player | null {
        return this.player;
    }

    addOtherObject(obj: RotatingObject): void {
        this.otherObjects.push(obj);
        Scene.addEntity(obj);
    }

    updateCurrentHoldObj(): void {
        this.rayCastObjects(true);
        this.currHoldObj = this.currObj;
    }

    rayCastObjects(justFindFirstClickable: boolean = false, 
            justFindFirstObject: boolean = false,
            ignoreFlags: boolean = false): boolean {
        Utils.rayCaster.setFromCamera(Utils.mousePosition, Scene.camera);
        const intersected = Utils.rayCaster.intersectObjects(Scene.getChildren());

        let foundClickable = false;
        const currCastedObjects: RayCastableInterface[] = []

        for (let i = 0; i < intersected.length; i++) {
            const obj = intersected[i].object;

            if (Utils.implementsRayCastable(obj)) {
                if (justFindFirstObject) {
                    if (ignoreFlags && obj instanceof Flag) return false;
                    return true;
                }

                if (Utils.implementsClickable(obj)) {
                    if (foundClickable) continue;
                    // @ts-ignore
                    this.currObj = obj as ClickableInterface;
                    foundClickable = true;

                    if (justFindFirstClickable) return true;
                }

                // @ts-ignore
                const castedObj = obj as RayCastableInterface;
                let rayCastOK = true;
                if (!this.rayCastedObjects.includes(castedObj)) {
                    rayCastOK = castedObj.onRayCast();
                }
                if (rayCastOK) currCastedObjects.push(castedObj);

            }
        }

        if (!foundClickable) this.currObj = null;

        if (justFindFirstClickable) return false;

        for (const lastCastedObj of this.rayCastedObjects) {
            if (!currCastedObjects.includes(lastCastedObj)) {
                lastCastedObj.onRayCastLeave();
            }
        }

        this.rayCastedObjects = currCastedObjects;

        return (this.rayCastedObjects.length != 0);
    }

    rayCast(): void {
        let currTime = Utils.getTime();
        if (currTime - this.lastRayCastTime < 20) return;

        this.rayCastObjects();

        this.lastRayCastTime = currTime;
    }

    checkObjOnMouseUp(): void {
        if (this.currHoldObj != null) {
            if (this.rayCastObjects(true) && this.currHoldObj == this.currObj) {
                this.currHoldObj.onClick();
            }
        }
    }

    playerCollidesPlanet(): boolean {
        if (this.player == null) return false;

        for (const currPlanet of this.allPlanets) {
            if (this.player.getBox().intersectsSphere(currPlanet.getSphere())) {
                return true;
            }
        }

        return false;
    }

    zShiftMenuFlags(zShift: number): void {
        if (this.currMenuFlagZShifts + zShift <= -160) return;
        if (this.currMenuFlagZShifts + zShift >= 20) return;

        for (const currFlag of this.menuFlags) {
            currFlag.position.z += zShift;
        }
        this.currMenuFlagZShifts += zShift;
    }

    hidePlanetFlags(): void {
        for (const currPlanet of this.allPlanets) {
            currPlanet.hideFlag();
        }
        for (const currMenuFlag of this.menuFlags) {
            Scene.addEntity(currMenuFlag);
        }
    }

    showPlanetFlags(): void {
        for (const currPlanet of this.allPlanets) {
            currPlanet.showFlag();
        }
        for (const currMenuFlag of this.menuFlags) {
            Scene.removeEntity(currMenuFlag);
        }
    }

    updateFrame(): void {
        this.rayCast();
        
        // if (Scene.currentMenu == 0) {
            for (const currStar of this.allStars) {
                currStar.updateFrame();
            }
            for (const currPlanet of this.allPlanets) {
                currPlanet.updateFrame();
            }
            if (this.player != null) this.player.updateFrame();

            for (const currObj of this.otherObjects) {
                currObj.rotate();
            }
        // }

        if (Scene.currentMenu == 1) {
            if (this.galaxyModel != null) {
                this.galaxyModel.rotateZ(0.002 * Utils.dt);

                for (const currFlag of this.menuFlags) {
                    currFlag.updateVideo();
                }
            }

            if (Galaxy.buttonUp != null && Galaxy.buttonDown != null) {
                let max = 200.;
                let curr = Scene.camera.position.y - (Galaxy.getGalaxyModelViewY() - max);
                if (curr < 0) curr = 0;
                let opacity = curr / max;
                Galaxy.buttonUp.style.opacity = opacity.toString();
                Galaxy.buttonDown.style.opacity = opacity.toString();
            }
        }
    }
    
}
