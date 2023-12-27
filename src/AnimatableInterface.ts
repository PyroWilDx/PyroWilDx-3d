import * as THREE from 'three';

export interface AnimatableInterface {
    beingAnimated: boolean;
    currentAnimation: any;
    onCompleteF: Function | null;
    getObject(): THREE.Object3D;
}
