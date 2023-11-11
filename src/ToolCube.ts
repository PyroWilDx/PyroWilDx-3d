import * as THREE from 'three';
import { AnimatableInterface } from './AnimatableInterface';
import { ClickableInterface } from './ClickableInterface';
import { CustomAnimation } from './CustomAnimation';
import { RayCastableInterface } from './RayCastableInterface';
import { RotatingObject } from "./RotatingObject";
import { Scene } from './Scene';
import { Utils } from "./Utils";

export class ToolCube extends RotatingObject implements RayCastableInterface, AnimatableInterface,
        ClickableInterface {
    public static readonly cubeSize: number = 10;

    public beingAnimated: boolean;
    public currentAnimation: any;

    private light: THREE.PointLight;
    private link: string;

    constructor(imgPath: string) {
        let cubeTexture = Utils.textureLoader.load(imgPath);

        super(new THREE.BoxGeometry(ToolCube.cubeSize, 
                    ToolCube.cubeSize, ToolCube.cubeSize), 
            new THREE.MeshStandardMaterial({
                map: cubeTexture,
                side: THREE.FrontSide,
                emissiveIntensity: 2,
                emissiveMap: cubeTexture
            }),
            Utils.getRandomVector3Spread(0.004)
        );

        this.beingAnimated = false;
        this.currentAnimation = null;

        this.light = new THREE.PointLight(0xFFFFFF, 400);
        Scene.addEntity(this.light);

        this.link = "";
        this.initLink(imgPath);
    }

    initLink(imgPath: string) {
        if (!imgPath.includes("Icon")) return;

        if (imgPath.includes("C++")) this.link = "https://isocpp.org/";
        else if (imgPath.includes("Java")) this.link = "https://www.java.com/fr/";
        else if (imgPath.includes("SDL2")) this.link = "https://www.libsdl.org/";
        else if (imgPath.includes("Boost")) this.link = "https://www.boost.org/";
        else if (imgPath.includes("CLion")) this.link = "https://www.jetbrains.com/fr-fr/clion/";
        else if (imgPath.includes("AndroidStudio")) this.link = "https://developer.android.com/studio";
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
        let openedTab = window.open(this.link, "_blank");
        if (openedTab) {
            openedTab.blur();
            window.focus();
        }
        this.onRayCastLeave();
    }

    addSelf(): void {
        Scene.addEntity(this);
        Scene.addEntity(this.light);
        CustomAnimation.popInAnimation(this, 800, true);
    }

    removeSelf(): void {
        Scene.removeEntity(this);
        Scene.removeEntity(this.light);
    }

    setPosition(position: THREE.Vector3, left: boolean): void {
        this.position.copy(position);
        this.light.position.copy(this.position);
        if (left) this.light.position.x += ToolCube.cubeSize;
        else this.light.position.x -= ToolCube.cubeSize;
        this.light.position.z += ToolCube.cubeSize * 1.2;
    }

}
