import * as THREE from 'three';
import { AnimatableInterface } from "./AnimatableInterface";
import { ClickableInterface } from "./ClickableInterface";
import { CustomAnimation } from "./CustomAnimation";
import { RayCastableInterface } from "./RayCastableInterface";
import { RotatingObject } from "./RotatingObject";
import { Utils } from './Utils';

export class DecorationCube extends RotatingObject implements RayCastableInterface, AnimatableInterface,
        ClickableInterface {
    private static readonly decelerationFactor: number = 0.0072;
    private static readonly minAcceleration: number = 0.0042;

    public beingAnimated: boolean;
    public currentAnimation: any;
    public onCompleteF: Function | null;

    private acceleration: THREE.Vector3;

    constructor(geometry: THREE.BufferGeometry, 
        material: THREE.Material | THREE.Material[],
        rSpeed: THREE.Vector3, minSpeed: number = 0) {
        super(geometry, material, rSpeed, minSpeed);

        this.beingAnimated = false;
        this.currentAnimation = null;
        this.onCompleteF = null;

        this.acceleration = new THREE.Vector3(0, 0, 0);
    }

    getObject(): THREE.Object3D {
        return this;
    }

    onRayCast(): boolean {
        let success = CustomAnimation.focusBigAnimation(this, 200, true);
        if (success) document.body.style.cursor = "pointer";
        return success;
    }

    onRayCastLeave(): void {
        CustomAnimation.focusBigAnimation(this, 200, false, true);
        document.body.style.cursor = "auto";
    }

    onClick(): void {
        this.acceleration = Utils.getRandomVector3OneEl(0.26, 0.46);
    }

    rotate(): void {
        if (this.acceleration.x > 0) {
            this.rotation.x += this.acceleration.x * Utils.dt;
            this.acceleration.x -= this.acceleration.x * DecorationCube.decelerationFactor * Utils.dt;
            if (this.acceleration.x < DecorationCube.minAcceleration) this.acceleration.x = 0;
        } else if (this.acceleration.y > 0) {
            this.rotation.y += this.acceleration.y * Utils.dt;
            this.acceleration.y -= this.acceleration.y * DecorationCube.decelerationFactor * Utils.dt;
            if (this.acceleration.y < DecorationCube.minAcceleration) this.acceleration.y = 0;
        } else if (this.acceleration.z > 0) {
            this.rotation.z += this.acceleration.z * Utils.dt;
            this.acceleration.z -= this.acceleration.z * DecorationCube.decelerationFactor * Utils.dt;
            if (this.acceleration.z < DecorationCube.minAcceleration) this.acceleration.z = 0;
        } else {
            super.rotate();
        }
    }

}