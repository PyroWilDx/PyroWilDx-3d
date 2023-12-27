import * as THREE from 'three';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class CameraLerp {
    private lerpSpeed: number;
    private rotateSpeed: number;

    private lookAtObject: boolean;

    private camera: THREE.PerspectiveCamera;
    private finalPosition: THREE.Vector3;
    private lookPosition: THREE.Vector3 | null;
    private lookQuaternion: THREE.Quaternion | null;
    private lookObject: ObjectLookedInterface | null;
    
    private distEpsilon: number;
    private rotEpsilon: number;

    private maxDist: number;

    constructor(camera: THREE.PerspectiveCamera,
            finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface | null) {
        // this.lerpSpeed = 0.026;
        this.lerpSpeed = 0.036;
        this.rotateSpeed = 0.08;

        this.lookAtObject = true;
        
        this.camera = camera;
        this.finalPosition = finalPosition;
        this.lookPosition = null;
        this.lookQuaternion = null;
        this.lookObject = lookObject;
        
        // this.distEpsilon = 1;
        this.distEpsilon = 1.2;
        // this.rotEpsilon = 0.002;
        this.rotEpsilon = 0.012;

        this.maxDist = 0;

        if (this.lookObject != null) this.lookObject.onLookStart(this);
    } 

    updateFrame() {
        if (this.camera.position.distanceTo(this.finalPosition) > this.maxDist) {
            this.camera.position.lerp(this.finalPosition, this.lerpSpeed * Utils.dt);
        }

        let cmpQuaternion: THREE.Quaternion;
        if (this.lookQuaternion != null) {
            this.camera.quaternion.slerp(this.lookQuaternion, this.rotateSpeed * Utils.dt);
            cmpQuaternion = this.lookQuaternion;
        } else {
            let tmpCam = this.camera.clone();
            
            if (this.lookAtObject) {
                let lookAtPos = new THREE.Vector3(0, 0, 0);
                if (this.lookPosition != null) lookAtPos = this.lookPosition;
                else if (this.lookObject != null) lookAtPos = this.lookObject.getObjectPosition();
                tmpCam.lookAt(lookAtPos);
            }
            this.camera.quaternion.slerp(tmpCam.quaternion, this.rotateSpeed * Utils.dt);
            cmpQuaternion = tmpCam.quaternion;
        }

        if (this.lookObject != null) this.lookObject.onLookProgress(this);

        if (this.camera.position.distanceTo(this.finalPosition) < this.distEpsilon &&
                Math.abs(this.camera.quaternion.dot(cmpQuaternion)) > 1 - this.rotEpsilon) {
            if (this.lookObject != null) this.lookObject.onLookEnd();
            Scene.removeCameraLerp();
        }
    }

    setSpeeds(lerpSpeed: number, rotateSpeed: number): void {
        if (lerpSpeed >= 0) this.lerpSpeed = lerpSpeed;
        if (rotateSpeed >= 0) this.rotateSpeed = rotateSpeed;
    }

    multiplySpeeds(factor: number): void {
        this.lerpSpeed *= factor;
        this.rotateSpeed *= factor;
    }

    setLookAtObject(lookAtObject: boolean): void {
        this.lookAtObject = lookAtObject;
    }

    setEpsilons(distEpsilon: number, rotEpsilon: number): void {
        this.distEpsilon = distEpsilon;
        this.rotEpsilon = rotEpsilon;
    }

    setFinalPosition(finalPosition: THREE.Vector3): void {
        this.finalPosition = finalPosition;
    }

    setLookPosition(lookPosition: THREE.Vector3 | null): void {
        this.lookPosition = lookPosition;
    }

    setLookQuaternion(lookQuaternion: THREE.Quaternion | null): void {
        this.lookQuaternion = lookQuaternion;
    }

    setMaxDist(maxDist: number): void {
        this.maxDist = maxDist;
    }

    getLookObject(): ObjectLookedInterface | null {
        return this.lookObject;
    }

    getMaxDist(): number {
        return this.maxDist;
    }

}
