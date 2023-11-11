import * as THREE from 'three';

export interface AnimatableInterface {
    beingAnimated: boolean;
    currentAnimation: any;
    getObject(): THREE.Object3D;
}
