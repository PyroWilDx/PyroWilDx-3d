import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from "./Scene";
import { Utils } from "./Utils";

export class Player extends THREE.Group<THREE.Object3DEventMap> implements ObjectLookedInterface {
    private static readonly cameraFollowFactor: number = 0.8;
    private static readonly addCameraHeight: number = 12;

    private playerSpeed: THREE.Vector3;
    private playerLight: THREE.PointLight;

    private playerLocked: boolean;

    private realY: number;

    private box: THREE.Box3;

    constructor(playerModel: THREE.Group<THREE.Object3DEventMap> | null, scale: number) {
        super();

        if (playerModel != null) this.add(playerModel);
        this.position.set(0, 0, 0);
        this.scale.set(scale, scale, scale);

        Utils.setEmissiveGLTF(this, 200);
        Scene.addEntity(this);

        this.playerSpeed = new THREE.Vector3(1.0, 1.0, 1.0);

        this.playerLight = new THREE.PointLight(0xFFFFFF,
            6000, 0, 1.6);
        Scene.addEntity(this.playerLight);

        this.playerLocked = true;

        this.realY = 0;

        this.box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        this.box.setFromObject(this);
    }

    getObjectPosition(): THREE.Vector3 {
        return this.position;
    }

    onLookStart(cameraLerp: CameraLerp): void {
        cameraLerp;
        this.playerLocked = false;
    }

    onLookProgress(cameraLerp: CameraLerp): void {
        cameraLerp.setFinalPosition(this.getCameraPosition());
        cameraLerp.setLookPosition(this.getLookPosition());
    }

    onLookEnd(): void {
        this.playerLocked = true;
    }

    onLookInterruption(): void {
        this.playerLocked = true;
    }

    getCameraPosition(): THREE.Vector3 {
        let resPosition = Utils.getObjectBehindPosition(this, -20);
        // resPosition.y = this.realY + Player.addCameraHeight;
        resPosition.y += Player.addCameraHeight;
        return resPosition;
    }

    getLookPosition(): THREE.Vector3 {
        let resPosition = this.position.clone();
        return resPosition;
    }

    addPositionX(x: number): void {
        if (!this.playerLocked) {
            this.position.x += x;
            Scene.addCameraPosition(x * Player.cameraFollowFactor, 0, 0);
        }
    }

    addPositionY(y: number): void {
        if (!this.playerLocked) {
            this.position.y += y;
            this.realY += y;
            Scene.addCameraPosition(0, y * Player.cameraFollowFactor, 0);
        }
    }

    addPositionZ(z: number): void {
        if (!this.playerLocked) {
            this.position.z += z;
            Scene.addCameraPosition(0, 0, z * Player.cameraFollowFactor);
        }
    }

    updateFrame(): void {
        this.rotation.y += 0.01;

        // let lastPosition = this.position.clone();
        // let lastRealY = this.realY;

        if (!this.playerLocked) {
            let forward = Utils.isKeyPressed('z') || Utils.isKeyPressed('Z');
            let backward = Utils.isKeyPressed('s') || Utils.isKeyPressed('S');
            let right = Utils.isKeyPressed('d') || Utils.isKeyPressed('D');
            let left = Utils.isKeyPressed('q') || Utils.isKeyPressed('Q');
            let up = Utils.isKeyPressed(" ");
            let down = Utils.isKeyPressed("Shift");

            if (forward) this.addPositionZ(-this.playerSpeed.z * Utils.dt);
            if (backward) this.addPositionZ(this.playerSpeed.z * Utils.dt);
            if (right) this.addPositionX(this.playerSpeed.x * Utils.dt);
            if (left) this.addPositionX(-this.playerSpeed.x * Utils.dt);
            if (up) this.addPositionY(this.playerSpeed.y * Utils.dt);
            if (down) this.addPositionY(-this.playerSpeed.y * Utils.dt);

            let truePos = this.position.clone();
            this.position.set(this.position.x, this.realY, this.position.z);
            this.box.setFromObject(this);
            this.position.copy(truePos);

            // if (forward || backward || right || left || up || down) {
            //     if (Scene.galaxy.playerCollidesPlanet()) {
            //         this.position.copy(lastPosition);
            //         this.realY = lastRealY;
            //     }
            // }
        }

        this.position.y = this.realY + 4 * Math.sin(Utils.getElapsedTime());
        
        this.playerLight.position.copy(this.position);
    }

    getBox(): THREE.Box3 {
        return this.box;
    }

}