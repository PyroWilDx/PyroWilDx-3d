import * as THREE from 'three';
import { Utils } from './Utils';

export class RotatingObject extends THREE.Mesh {

    private rSpeed: THREE.Vector3;

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
    }

    rotate(): void {
        this.rotation.x += this.rSpeed.x * Utils.dt;
        this.rotation.y += this.rSpeed.y * Utils.dt;
        this.rotation.z += this.rSpeed.z * Utils.dt;
    }

}