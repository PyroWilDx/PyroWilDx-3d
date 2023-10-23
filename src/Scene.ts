import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CameraLerp } from './CameraLerp';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Utils } from './Utils';

export class Scene {
    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    public static globalLight: THREE.AmbientLight;

    public static effectComposer: EffectComposer;

    public static cameraLerp: CameraLerp | null;

    static initScene(): void {
        Scene.scene = new THREE.Scene();

        Scene.camera  = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight,
            0.1, Utils.worldRadius * 2);
        Scene.camera.position.setZ(30);

        Scene.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg')!,
            antialias: true,
            logarithmicDepthBuffer: true
        });
        Scene.renderer.setPixelRatio(window.devicePixelRatio);
        Scene.renderer.setSize(window.innerWidth, window.innerHeight);
        Scene.renderer.render(Scene.scene, Scene.camera);

        Scene.globalLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
        Scene.addEntity(Scene.globalLight);

        let renderPass = new RenderPass(Scene.scene, Scene.camera);
        this.effectComposer = new EffectComposer(this.renderer);
        this.effectComposer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.16,
            1,
            1
        );
        Scene.composerAddPass(bloomPass);

        this.cameraLerp = null;
    }

    static addEntity(entity: THREE.Object3D): void {
        this.scene.add(entity);
    };

    static removeEntity(entity: THREE.Object3D): void {
        this.scene.remove(entity);
    }

    static composerAddPass(pass: UnrealBloomPass): void {
        this.effectComposer.addPass(pass);
    }

    static renderScene(): void {
        this.effectComposer.render();
    }

    static setCameraPosition(position: THREE.Vector3): void {
        this.camera.position.copy(position);
    }

    static setCameraRotation(rotation: THREE.Vector3): void {
        this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    static addCameraRotation(addRotation: THREE.Vector3): void {
        let cameraRotation = this.camera.rotation;
        let finalRotation = addRotation.clone();
        finalRotation.x += cameraRotation.x;
        finalRotation.y += cameraRotation.y;
        finalRotation.z += cameraRotation.z;

        Scene.setCameraRotation(finalRotation);
    }

    static addCameraLerp(finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface): void {
        this.cameraLerp = new CameraLerp(this.camera,
            finalPosition, lookObject);
    }

    static removeCameraLerp(): void {
        this.cameraLerp = null;
    }

    static updateFrame(): void {
        if (this.cameraLerp != null) {
            this.cameraLerp.updateFrame();
        }
        Scene.renderScene();
    }

}