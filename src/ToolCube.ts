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
    public static readonly cubeSize: number = 11;

    public beingAnimated: boolean;
    public currentAnimation: any;
    public onCompleteF: Function | null;

    // private light: THREE.PointLight;
    private link: string;

    constructor(imgPath: string) {
        let cubeTexture = Utils.textureLoader.load(imgPath);

        super(new THREE.BoxGeometry(ToolCube.cubeSize, 
                    ToolCube.cubeSize, ToolCube.cubeSize), 
            new THREE.MeshBasicMaterial({
                map: cubeTexture,
                side: THREE.FrontSide,
                // emissiveIntensity: 2,
                // emissiveMap: cubeTexture
            }),
            Utils.getRandomVector3Spread(0.004),
            0.001
        );

        this.beingAnimated = false;
        this.currentAnimation = null;
        this.onCompleteF = null;

        // this.light = new THREE.PointLight(0xFFFFFF, 400);
        // Scene.addEntity(this.light);

        this.link = "";
        this.initLink(imgPath);
    }

    initLink(imgPath: string) {
        if (!imgPath.includes("Icon")) return;

        if (imgPath.includes("CLanguage")) this.link = "https://www.open-std.org/jtc1/sc22/wg14/";
        else if (imgPath.includes("C++")) this.link = "https://isocpp.org/";
        else if (imgPath.includes("Java")) this.link = "https://www.java.com/";
        else if (imgPath.includes("Python")) this.link = "https://www.python.org/";
        else if (imgPath.includes("UnrealEngine")) this.link = "https://www.unrealengine.com/";
        else if (imgPath.includes("SDL2")) this.link = "https://www.libsdl.org/";
        else if (imgPath.includes("OpenCV")) this.link = "https://opencv.org/";
        else if (imgPath.includes("AVX2")) this.link = "https://www.intel.com/content/www/us/en/docs/intrinsics-guide/index.html#techs=AVX_ALL";
        else if (imgPath.includes("PyGame")) this.link = "https://www.pygame.org/";
        else if (imgPath.includes("CLion")) this.link = "https://www.jetbrains.com/clion/";
        else if (imgPath.includes("AndroidStudio")) this.link = "https://developer.android.com/studio";
        else if (imgPath.includes("VisualStudio")) this.link = "https://visualstudio.microsoft.com/";
        else if (imgPath.includes("VSCode")) this.link = "https://code.visualstudio.com/";
        else if (imgPath.includes("Pyzo")) this.link = "https://pyzo.org/";
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
        // this.light.intensity = 400;
        // Scene.addEntity(this.light);
        CustomAnimation.popInAnimation(this, 800, true);
    }

    removeSelf(): void {
        Scene.removeEntity(this);
        // this.light.intensity = 0;
        // Scene.removeEntity(this.light);
    }

    setPosition(position: THREE.Vector3, left: boolean): void {
        this.position.copy(position);
        // this.light.position.copy(this.position);
        if (Scene.currentMenu == 0 && !left) {
            this.position.x -= 5.6;
            // this.light.position.x -= 5.6;
        }
        // if (Scene.currentMenu == 0) {
        //     if (left) this.light.position.x += ToolCube.cubeSize;
        //     else this.light.position.x -= ToolCube.cubeSize;
        //     this.light.position.z += ToolCube.cubeSize * 1.2;
        // }
        // if (Scene.currentMenu == 1) {
        //     if (left) this.light.position.x += ToolCube.cubeSize;
        //     else this.light.position.x -= ToolCube.cubeSize;
        //     this.light.position.y += ToolCube.cubeSize * 1.2;
        // }
    }

}
