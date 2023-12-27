// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { AnimatableInterface } from './AnimatableInterface';

export class CustomAnimation {

    private static animGen(animatable: AnimatableInterface, anim: any,
            onCompleteFunction: Function | null = null) {
        let f: Function;
        if (onCompleteFunction != null) {
            f = () => {
                onCompleteFunction();
                animatable.beingAnimated = false
            }
        } else {
            f = () => { 
                animatable.beingAnimated = false; 
            }
        }
        anim.onComplete(f);

        if (animatable.currentAnimation != null && animatable.beingAnimated) {
            if (animatable.onCompleteF != null) animatable.onCompleteF();
            animatable.currentAnimation.stop();
        }

        anim.start();

        animatable.beingAnimated = true;
        animatable.currentAnimation = anim;
        animatable.onCompleteF = f;
    }

    static popInAnimation(animatable: AnimatableInterface, duration: number,
            force: boolean = false): boolean {
        if (animatable.beingAnimated && !force) return false;

        let object = animatable.getObject();

        object.scale.set(0.1, 0.1, 0.1);

        const targetScale = new THREE.Vector3(1.0, 1.0, 1.0);

        let anim = new TWEEN.Tween(object.scale)
            .to(targetScale, duration)
            .easing(TWEEN.Easing.Elastic.Out);

        this.animGen(animatable, anim);

        return true;
    }

    static popOutAnimation(animatable: AnimatableInterface, duration: number,
            onCompleteFunction: Function | null = null, force: boolean = false): boolean {
        if (animatable.beingAnimated && !force) return false;
    
        let object = animatable.getObject();

        const targetScale = new THREE.Vector3(0, 0, 0);

        let anim = new TWEEN.Tween(object.scale)
            .to(targetScale, duration);

        this.animGen(animatable, anim, onCompleteFunction);
    
        return true;
    }

    static focusBigAnimation(animatable: AnimatableInterface, duration: number,
            focused: boolean, force: boolean = false): boolean {
        if (animatable.beingAnimated && !force) return false;
        
        let object = animatable.getObject();

        let targetScaleValue = 1.16;
        if (!focused) targetScaleValue = 1.0;

        let targetScale = new THREE.Vector3(targetScaleValue, targetScaleValue, targetScaleValue);
    
        let anim = new TWEEN.Tween(object.scale)
            .to(targetScale, duration)
            .easing(TWEEN.Easing.Quadratic.Out);

        this.animGen(animatable, anim);

        return true;
    }

}