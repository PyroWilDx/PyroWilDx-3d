import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { MainInit } from './MainInit';
import { ObjectLookedInterface } from "./ObjectLookedInterface";
import { Scene } from './Scene';
import { Utils } from './Utils';

export class CameraFollowObject extends THREE.Mesh implements ObjectLookedInterface {

    getObjectPosition(): THREE.Vector3 {
        return this.position;
    }

    getMouseRotatedQuaternion(quaternion: THREE.Quaternion): THREE.Quaternion {
        let mousePosition = Utils.mousePosition;
        let rotationQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(mousePosition.y / 6, -mousePosition.x / 6, 0));
        let resQuaternion = quaternion.clone().multiply(rotationQuaternion);
        return resQuaternion;
    }

    setCameraLerpParams(cameraLerp: CameraLerp): void {
        let finalPosition = Utils.getObjectBehindPosition(this, -MainInit.scrollLengthAdv);
        cameraLerp.setFinalPosition(finalPosition);
        let i = Math.floor(MainInit.i / MainInit.scrollLengthAdv);
        cameraLerp.setLookQuaternion(this.getMouseRotatedQuaternion(MainInit.quaternionList[i]));
    }

    onLookStart(cameraLerp: CameraLerp): void {
        Scene.cameraFollowingObj = true;
        cameraLerp.multiplySpeeds(1.2);
        cameraLerp.setEpsilons(0, 0);
        cameraLerp.setMaxDist(0.02);

        this.setCameraLerpParams(cameraLerp);
    }

    onLookProgress(cameraLerp: CameraLerp): void {
        if (cameraLerp.getMaxDist() == -1) {
            // if (Scene.camera.position.y < 1.10 * Scene.galaxy.getGalaxyModelPosition().y) {
                Scene.removeCameraLerp();
            // }
        } else {
            this.setCameraLerpParams(cameraLerp);
            if (Scene.progressInfoText != null) {
                if (Scene.camera.position.z < MainInit.academicStartZ) {
                    Scene.progressInfoText.textContent = "Academic Projects";
                } else {
                    Scene.progressInfoText.textContent = "Personal Projects";
                }
            }
        }
    }

    onLookEnd(): void {
        Scene.cameraFollowingObj = false;
    }

    onLookInterruption(): void {
        Scene.cameraFollowingObj = false;
    }

}
