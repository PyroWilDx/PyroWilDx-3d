import * as THREE from 'three';
import { ClickableInterface } from './ClickableInterface.ts';
import { Flag } from './Flag.ts';
import { LoadingScreen } from './LoadingScreen.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { RayCastableInterface } from './RayCastableInterface.ts';
import { Scene } from './Scene.ts';
import { Star } from './Star.ts';
import { Utils } from './Utils.ts';

export class Galaxy {
    public static readonly galaxyModelY = 4000;
    public static readonly galaxyModelScale = 2000;

    private radius: number;

    private galaxyModel: THREE.Group<THREE.Object3DEventMap> | null;
    private menuFlags: Flag[];

    private allStars: Star[];
    private allPlanets: Planet[];
    private player: Player | null;

    private lastRayCastTime: number;

    private currHoldObj: ClickableInterface | null;
    private currObj: ClickableInterface | null;

    private rayCastedObjects: RayCastableInterface[];

    constructor(radius: number) {
        this.radius = radius;

        this.galaxyModel = null;
        this.menuFlags = [];

        this.allStars = [];
        this.allPlanets = [];
        this.player = null;

        this.lastRayCastTime = 0;

        this.currHoldObj = null;
        this.currObj = null;
    
        this.rayCastedObjects = [];
    }

    addBackgroundImg(backgroundPath: string) {
        let backgroundMesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 160, 160),
            new THREE.MeshStandardMaterial({ 
                map: Utils.textureLoader.load(backgroundPath),
                side: THREE.BackSide
              })
        );
        Scene.addEntity(backgroundMesh);
    }

    static getGalaxyModelViewY(): number {
        return Galaxy.galaxyModelY + Galaxy.galaxyModelScale + 1600;
    }

    setGalaxyModel(galaxyModel: THREE.Group<THREE.Object3DEventMap>): void {
        this.galaxyModel = galaxyModel;
        Scene.addEntity(galaxyModel);
    }

    getGalaxyModelPosition(): THREE.Vector3 {
        if (this.galaxyModel != null) return this.galaxyModel.position.clone();
        return new THREE.Vector3(0, 0, 0);
    }

    getGalaxyModelScale(): number {
        if (this.galaxyModel != null) return this.galaxyModel.scale.x;
        return 0;
    }

    addMenuFlag(flag: Flag): void {
        this.menuFlags.push(flag);
    }

    addStars(nStars: number, modelPath: string): void {
        Utils.gltfLoader.load(modelPath, ( gltf ) => {
            let baseStarModel = gltf.scene;
            Utils.setEmissiveGLTF(baseStarModel, 52);
            for (let i = 0; i < nStars; i++) {
                let currStar: Star = new Star(baseStarModel.clone(),
                    THREE.MathUtils.randFloat(0.004, 0.02),
                    THREE.MathUtils.randFloat(0.0001, 0.001),
                    Utils.getRandomVector3Spread(this.radius / 1.2));

                    this.allStars.push(currStar);
            }
            LoadingScreen.updateCount();
        });
    }

    addPlanet(planet: Planet) {
        this.allPlanets.push(planet);
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    getPlayer(): Player | null {
        return this.player;
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

    updateFrame(): void {
        this.rayCast();
        
        if (Scene.currentMenu == 0) {
            for (const currStar of this.allStars) {
                currStar.updateFrame();
            }
            for (const currPlanet of this.allPlanets) {
                currPlanet.updateFrame();
            }
            if (this.player != null) this.player.updateFrame();
        }

        if (Scene.currentMenu == 1) {
            if (this.galaxyModel != null) {
                this.galaxyModel.rotateY(0.001 * Utils.dt);

                for (const currFlag of this.menuFlags) {
                    currFlag.updateVideo();
                }
            }
        }
    }
    
}
