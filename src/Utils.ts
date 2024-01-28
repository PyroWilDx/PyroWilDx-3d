import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene } from './Scene';
import './style.css';

export class Utils {

    private constructor() {}

    public static readonly clock: THREE.Clock = new THREE.Clock();

    public static readonly normalizeDtFactor = 8.0;
    public static lastTime: number = Utils.getTime();
    public static dt: number = 0;

    public static readonly rayCaster: THREE.Raycaster = new THREE.Raycaster();
    
    public static readonly textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    public static readonly gltfLoader: GLTFLoader = new GLTFLoader();

    public static isMouseDown: boolean = false;
    public static lastMousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    public static mousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    public static mouseWheel: boolean = false;
    public static scrolled: boolean = false;
    public static keyMap: { [key: string]: boolean } = {};
    
    static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    static getRandomVector3Spread(value: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = new THREE.Vector3();
        randomVec.x = THREE.MathUtils.randFloatSpread(value);
        randomVec.y = THREE.MathUtils.randFloatSpread(value);
        randomVec.z = THREE.MathUtils.randFloatSpread(value);
        return randomVec;
    }

    static getRandomVector3SpreadMin(value: number, min: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = this.getRandomVector3Spread(value);
        if (randomVec.x >= 0 && randomVec.x < min) randomVec.x = min;
        else if (randomVec.x < 0 && randomVec.x > -min) randomVec.x = -min;
        if (randomVec.y >= 0 && randomVec.y < min) randomVec.y = min;
        else if (randomVec.y < 0 && randomVec.y > -min) randomVec.y = -min;
        if (randomVec.z >= 0 && randomVec.z < min) randomVec.z = min;
        else if (randomVec.z < 0 && randomVec.z > -min) randomVec.z = -min;
        return randomVec;
    }

    static getRandomVector3(start: number, end: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = new THREE.Vector3();
        randomVec.x = THREE.MathUtils.randFloat(start, end);
        randomVec.y = THREE.MathUtils.randFloat(start, end);
        randomVec.z = THREE.MathUtils.randFloat(start, end);
        return randomVec;
    }

    static getRandomVector3OneEl(start: number, end: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = new THREE.Vector3();
        let rd = THREE.MathUtils.randFloat(0, 1);
        if (rd < 0.33) {
            randomVec.x = THREE.MathUtils.randFloat(start, end);
        } else if (rd < 0.67) {
            randomVec.y = THREE.MathUtils.randFloat(start, end);
        } else {
            randomVec.z = THREE.MathUtils.randFloat(start, end);
        }
        return randomVec;
    }

    static areVector3AlmostEqual(v1: THREE.Vector3, v2: THREE.Vector3,
            epsilon: number = 0.1): boolean {
        return (Math.abs(v1.x - v2.x) < epsilon &&
                Math.abs(v1.y - v2.y) < epsilon &&
                Math.abs(v1.z - v2.z) < epsilon);
    }

    static getElapsedTime(): number {
        return Utils.clock.getElapsedTime();
    }

    static getTime(): number {
        return new Date().getTime();
    }

    static updateDt(): void {
        let currTime = Utils.getTime();
        Utils.dt = currTime - Utils.lastTime;
        Utils.dt /= Utils.normalizeDtFactor;
        Utils.lastTime = currTime;
    }

    static updateMousePosition(event: MouseEvent): void {
        Utils.lastMousePosition.copy(Utils.mousePosition);
        Utils.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        Utils.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    static getMouseScreenPosition(): THREE.Vector2 {
        let resPos = new THREE.Vector2();
        resPos.x = ((this.mousePosition.x + 1) / 2) * window.innerWidth;
        resPos.y = ((this.mousePosition.y + 1) / 2) * window.innerHeight;
        return resPos;
    }

    static updateKeyMap(key: string, value: boolean): void {
        Utils.keyMap[key] = value;
        if (key >= 'a' && key <= 'z') {
            Utils.keyMap[key.toUpperCase()] = value;
        } else if (key >= 'A' && key <= 'Z') {
            Utils.keyMap[key.toLowerCase()] = value;
        }
    }

    static isKeyPressed(key: string): boolean {
        return Utils.keyMap[key];
    }

    static setEmissiveMesh(mesh: THREE.Mesh,
            emissiveColor: THREE.ColorRepresentation) {
        // @ts-ignore
        mesh.material.emissive.set(emissiveColor);
    }

    static removeEmissiveMesh(mesh: THREE.Mesh): void {
        // @ts-ignore
        mesh.material.emissive.set("black");
    }

    static setEmissiveGLTF(gltfModel: THREE.Group<THREE.Object3DEventMap>,
            intensityValue: number): void {
        gltfModel.traverse((object: THREE.Object3D<THREE.Object3DEventMap>) => {
            // @ts-ignore
            if (object.isMesh) {
                // @ts-ignore
                let material = object.material;
                if (material.emissive) {
                    material.emissiveIntensity = intensityValue;
                }
            }
        })
    }

    static appendSectionHTML(srcId: string, dstId: string): void {
        let srcContent = document.getElementById(srcId);
        if (srcContent != null) {
            let dstContent = document.getElementById(dstId);
            if (dstContent) {
                while (srcContent.firstChild) {
                    dstContent.appendChild(srcContent.firstChild);
                }
            }
        }
    }

    static getElementRect(elId: string): DOMRect {
        const el = document.getElementById(elId);
        if (el != null) {
            return el.getBoundingClientRect();
        }
        return new DOMRect(0, 0, 0, 0);
    }

    static getElementRectInvisible(elId: string, elParentId: string): DOMRect {
        const el = document.getElementById(elId);
        const elParent = document.getElementById(elParentId);

        if (el != null && elParent != null) {
            elParent.style.visibility = "hidden";
            elParent.style.display = "";

            let resRect = Utils.getElementRect(elId);

            elParent.style.display = "none";
            elParent.style.visibility = "visible";

            return resRect;
        }
        return new DOMRect(0, 0, 0, 0);
    }

    static getElementMiddle(rect: DOMRect): THREE.Vector2 {
        let middlePos = new THREE.Vector2;
        middlePos.x = rect.x + rect.width / 2;
        middlePos.y = window.innerHeight - rect.y - rect.height / 2;
        return middlePos;
    }

    static getScrollbarWidth(): number {
        let outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        // @ts-ignore
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);

        let inner = document.createElement('div');
        outer.appendChild(inner);

        let scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

        // @ts-ignore
        outer.parentNode.removeChild(outer);
      
        return (1.1 * scrollbarWidth / window.innerWidth) * 2
      
    }

    static implementsRayCastable(obj: THREE.Object3D): boolean {
        return (
            'onRayCast' in obj && typeof obj.onRayCast === 'function' &&
            'onRayCastLeave' in obj && typeof obj.onRayCastLeave === 'function'
        );
    }

    static implementsClickable(obj: THREE.Object3D): boolean {
        return (
            'onClick' in obj && typeof obj.onClick === 'function'
        );
    }

    static getObjectScreenPosition(obj: THREE.Object3D): THREE.Vector2 {
        let pos3D = new THREE.Vector3().copy(obj.position).project(Scene.getCamera());

        let pos2D = new THREE.Vector2(pos3D.x, pos3D.y);
        pos2D.x = ((pos2D.x + 1) / 2) * window.innerWidth;
        pos2D.y = ((pos2D.y + 1) / 2) * window.innerHeight;

        return pos2D;
    }

    static getObjectScreenPositionOnCameraPos(obj: THREE.Object3D, cameraPos: THREE.Vector3): THREE.Vector2 {
        let lastCameraPos = Scene.getCamera().position.clone();

        Scene.setCameraPosition(cameraPos);
        Scene.renderScene();
        let pos2D = Utils.getObjectScreenPosition(obj);

        Scene.setCameraPosition(lastCameraPos);
        return pos2D;
    }

    static getObjectBehindPosition(frontObj: THREE.Object3D, 
            distance: number, customRotation: THREE.Euler | null = null): THREE.Vector3 {
        let rot = frontObj.rotation.clone();

        if (customRotation != null) frontObj.rotation.copy(customRotation);

        let resPosition = new THREE.Vector3();
        frontObj.getWorldPosition(resPosition);
        
        const offset = new THREE.Vector3(0, 0, -distance);
        offset.applyQuaternion(frontObj.getWorldQuaternion(new THREE.Quaternion()));
    
        resPosition.add(offset);

        if (customRotation != null) frontObj.rotation.copy(rot);

        return resPosition;
    }

    static positionObjectBehind(frontObj: THREE.Object3D, behindObj: THREE.Object3D,
            distance: number, customRotation: THREE.Euler | null = null) {
        if (customRotation != null) behindObj.rotation.copy(customRotation);
        else behindObj.rotation.copy(frontObj.rotation);

        behindObj.position.copy(Utils.getObjectBehindPosition(frontObj, distance, customRotation));
    }
}
