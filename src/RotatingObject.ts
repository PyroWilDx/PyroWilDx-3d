import * as THREE from 'three';
import { Utils } from './Utils';

export class RotatingObject extends THREE.Mesh {

    private rSpeed: THREE.Vector3;
    private mSpeed: THREE.Vector3;

    constructor(geometry: THREE.BufferGeometry, 
            material: THREE.Material | THREE.Material[],
            rSpeed: THREE.Vector3, minSpeed: number = 0) {
        super(geometry, material);
        this.rSpeed = rSpeed;
        if (this.rSpeed.x < minSpeed) rSpeed.x = minSpeed;
        if (this.rSpeed.y < minSpeed) rSpeed.y = minSpeed;
        if (this.rSpeed.z < minSpeed) rSpeed.z = minSpeed;
        
        if (rSpeed.x != 0 && rSpeed.y != 0 && rSpeed.z != 0) {
            let rRot = Utils.getRandomVector3(0, 2 * Math.PI);
            this.rotation.set(rRot.x, rRot.y, rRot.z);
        }

        this.mSpeed = new THREE.Vector3(0, 0, 0);
    }

    setMoveSpeed(mSpeed: THREE.Vector3): void {
        this.mSpeed = mSpeed;
    }

    oppMX(): void {
        this.mSpeed.x = -this.mSpeed.x;
    }

    oppMY(): void {
        this.mSpeed.y = -this.mSpeed.y;
    }

    oppMZ(): void {
        this.mSpeed.z = -this.mSpeed.z;
    }

    rotate(): void {
        this.rotation.x += this.rSpeed.x * Utils.dt;
        this.rotation.y += this.rSpeed.y * Utils.dt;
        this.rotation.z += this.rSpeed.z * Utils.dt;
    }

    move(): void {
        this.position.x += this.mSpeed.x * Utils.dt;
        this.position.y += this.mSpeed.y * Utils.dt;
        this.position.z += this.mSpeed.z * Utils.dt;
    }

}
