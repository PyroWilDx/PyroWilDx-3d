import * as THREE from 'three';
// @ts-ignore
import flagGlowFragmentShader from './../res/shaders/flagGlowFragment.glsl';
// @ts-ignore
import flagGlowVertexShader from './../res/shaders/flagGlowVertex.glsl';
import { CameraLerp } from './CameraLerp';
import { ClickableInterface } from './ClickableInterface';
import { CustomAnimation } from './CustomAnimation';
import { Galaxy } from './Galaxy';
import { MainInit } from './MainInit';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { ProjectDisplayerInterface } from './ProjectDisplayerInterface';
import { RayCastableInterface } from './RayCastableInterface';
import { Scene } from './Scene';
import { ToolCube } from './ToolCube';
import { Utils } from './Utils';

export class Flag extends THREE.Mesh implements RayCastableInterface, ObjectLookedInterface, 
        ProjectDisplayerInterface, ClickableInterface {
    public static readonly flagLerpDistance: number = 40;

    private static titleHolder: Flag | null = null;

    private flagVidTexture: THREE.VideoTexture | null;

    private flagW: number;
    private flagH: number;  
    private flagImgPath: string | null;
    private flagVidPath: string | null;

    private flagStickRadius: number;
    private flagStickH: number;
    private flagStickColor: number;
    private flagStickMesh: THREE.Mesh;

    private flagGlowLight: THREE.PointLight;
    private flagGlowMesh: THREE.Mesh;

    private flagProjectSectionId: string;
    private toolIconCubeImgs: string[];
    private toolCubes: ToolCube[];

    private xZoomShift: number;
    private yZoomShift: number;

    private centeredText: HTMLElement | null;

    private halfFlagW: number;
    private AX1: number;
    private DX1: number;
    private AX2: number;
    private DX2: number;
    private AY1: number;
    private DY1: number;
    private AY2: number;
    private DY2: number;

    constructor(flagW: number, flagH: number,
            flagImgPath: string | null, flagVidPath: string | null,
            flagStickRadius: number, flagStickH: number, flagStickColor: number,
            projSectionId: string, xZoomShift: number, yZoomShift: number,
            toolIconCubeImgsList: string[] | null, ...toolIconCubeImgs: string[]) {

        let flagTexture: THREE.Texture | THREE.VideoTexture;
        if (flagImgPath != null) {
            flagTexture = Utils.textureLoader.load(flagImgPath);
        } else {
            const vid = document.createElement("video");
            if (flagVidPath != null) vid.src = flagVidPath;
            vid.autoplay = true;
            vid.loop = true;

            flagTexture = new THREE.VideoTexture(vid);
            flagTexture.minFilter = THREE.LinearFilter;
            flagTexture.magFilter = THREE.LinearFilter;
        }

        super(new THREE.PlaneGeometry(flagW, flagH, 32, 32),
            new THREE.MeshBasicMaterial({
                map: flagTexture,
                side: THREE.DoubleSide,
                transparent: true
                // emissiveIntensity: 0.46,
                // emissiveMap: flagTexture
            })
        );
        Scene.addEntity(this);

        if (flagTexture instanceof THREE.VideoTexture) this.flagVidTexture = flagTexture;
        else this.flagVidTexture = null;

        this.flagW = flagW;
        this.flagH = flagH;
        this.flagImgPath = flagImgPath;
        this.flagVidPath = flagVidPath;

        this.flagStickRadius = flagStickRadius;
        this.flagStickH = flagStickH;
        this.flagStickColor = flagStickColor;
        this.flagStickMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(flagStickRadius, flagStickRadius,
                flagStickH, 8, 8),
            new THREE.MeshBasicMaterial({
                color: flagStickColor,
                side: THREE.FrontSide
            })
        )
        Scene.scene.add(this.flagStickMesh);

        this.flagGlowLight = new THREE.PointLight(0xFFFFFF, 1000);

        this.flagGlowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.flagW, this.flagH, 1, 1),
            new THREE.ShaderMaterial({
                vertexShader: flagGlowVertexShader,
                fragmentShader: flagGlowFragmentShader,
                side: THREE.DoubleSide
            })
        );
        const glowScale = 1.12;
        this.flagGlowMesh.scale.set(glowScale, glowScale, glowScale);

        this.flagProjectSectionId = projSectionId;
        let realList = (toolIconCubeImgsList != null) ? toolIconCubeImgsList : toolIconCubeImgs;
        this.toolIconCubeImgs = realList;
        this.toolCubes = [];
        for (const imgPath of realList) {
            let toolCube = new ToolCube(imgPath);
            this.toolCubes.push(toolCube);
        }

        this.xZoomShift = xZoomShift;
        this.yZoomShift = yZoomShift;

        this.centeredText = null;

        this.halfFlagW = this.flagW / 2;

        let ratio = (this.flagW / 10 + this.flagH / 6) / 2;
        this.AX1 = 0.52 * ratio;
        this.DX1 = 2 / ratio;
        this.AX2 = 0.26 * ratio;
        this.DX2 = 3.02 / ratio;
        this.AY1 = 0.1 * ratio;
        this.DY1 = 2 / ratio;
        this.AY2 = 0.042 * ratio;
        this.DY2 = 3.02 / ratio;
    }

    onRayCast(): boolean {
        let success = true;
        if (!(Scene.currentMenu == 1 && Scene.isDisplayingProject())) {
            this.glowEffect(true);
        } else {
            return false;
        }

        if (Scene.currentMenu == 1) {
            if (!Scene.isDisplayingProject()) {
                let projectOverviewText = document.getElementById("projectOverviewText");
                let projectOverviewTitle = document.getElementById("projectOverviewTitle");
                let projectOverviewYear = document.getElementById("projectOverviewYear");
                this.centeredText = projectOverviewText;
                if (projectOverviewText != null && projectOverviewTitle != null &&
                        projectOverviewYear != null) {
                    projectOverviewText.style.opacity = "1";
                    let titleEl = document.getElementById(this.flagProjectSectionId + "Title");
                    let yearEl = document.getElementById(this.flagProjectSectionId + "Year");
                    if (titleEl != null && yearEl != null) {
                        projectOverviewTitle.textContent = titleEl.textContent;
                        projectOverviewYear.textContent = yearEl.textContent;
                    }
                }
                Flag.titleHolder = this;
                // @ts-ignore
                this.material.opacity = 0.4;
            }
        }

        return success;
    }

    onRayCastLeave(): void {
        if (Scene.currentMenu == 0) {
            this.glowEffect(false);
        }

        if (Scene.currentMenu == 1) {
            // @ts-ignore
            this.material.opacity = 1;

            if (Flag.titleHolder == this && this.centeredText != null) {
                this.glowEffect(false);
                this.centeredText.style.opacity = "";
                this.centeredText.style.transform = "";
            } else {
                this.glowEffect(false, false, false);
            }
        }
    }

    getObjectPosition(): THREE.Vector3 {
        return this.position;
    }

    onLookStart(_cameraLerp: CameraLerp): void {
        this.glowEffect(true);
    }

    onLookProgress(_cameraLerp: CameraLerp): void {

    }

    onLookEnd(): void {
        this.displayProject();
    }

    onLookInterruption(): void {
        this.glowEffect(false, true);
    }

    displayProject(): void {
        let projectSection = document.getElementById(this.flagProjectSectionId);
        if (projectSection != null) {
            Scene.setProjectDisplayer(this, projectSection);
            
            let currCubePosition = this.position.clone();
            let addX = 85.1;
            let addY = -1.4 * ToolCube.cubeSize / Scene.getScreenSizeRatio();
            let addZ = 0;
            currCubePosition.x -= addX;
            currCubePosition.y -= addY * (this.toolCubes.length / 2.) + 6;
            if (Scene.currentMenu == 1) {
                addZ = addY;
                addY = 0;
                currCubePosition.x = 0;
                currCubePosition.x -= addX;
                currCubePosition.y = Galaxy.getGalaxyModelViewY();
                currCubePosition.y -= Math.min(this.flagW, this.flagH) / Scene.getScreenSizeRatio();
                currCubePosition.z = MainInit.meanZ;
                currCubePosition.z += addZ * (this.toolCubes.length / 2.) + 6;
            }
            for (let i = 0; i < this.toolCubes.length; i++) {
                this.toolCubes[i].setPosition(currCubePosition, i % 2 == 0);

                if (i % 2 == 1) currCubePosition.x -= 2 * addX;
                else currCubePosition.x += 2 * addX;

                if (Scene.currentMenu == 0) currCubePosition.y += addY;
                if (Scene.currentMenu == 1) currCubePosition.z -= addZ;
            }

            for (const toolCube of this.toolCubes) {
                toolCube.addSelf();
            }

            this.glowEffect(false, true);

            // this.visible = false;
            // this.flagStickMesh.visible = false;
        }
    }

    updateFrameDisplayer(): void {
        for (const toolCube of this.toolCubes) {
            toolCube.rotate();
        }
    }

    onProjectHideDisplay(): void {
        this.glowEffect(false);
        // this.visible = true;
        // this.flagStickMesh.visible = true;

        for (const toolCube of this.toolCubes) {
            CustomAnimation.popOutAnimation(toolCube, 200,
                () => { toolCube.removeSelf(); }, true);
        }
    }

    glowEffect(start: boolean, force: boolean = false, rmPointer: boolean = true): void {
        if (start) {
            if (Scene.getCameraLerpObject() != this &&
                    Scene.getProjectDisplayer() != this) {
                // Utils.setEmissiveMesh(this.flagStickMesh, this.flagStickColor);
                // Utils.setEmissiveMesh(this, "white");
                // Scene.addEntity(this.flagGlowLight);
                Scene.addEntity(this.flagGlowMesh);
                document.body.style.cursor = "pointer";
            }
        } else {
            if (force || (Scene.getCameraLerpObject() != this &&
                    Scene.getProjectDisplayer() != this)) {
                // Utils.removeEmissiveMesh(this.flagStickMesh);
                // Utils.removeEmissiveMesh(this);
                // Scene.removeEntity(this.flagGlowLight);
                Scene.removeEntity(this.flagGlowMesh);
                if (rmPointer) {
                    document.body.style.cursor = "auto";
                }
            }
        }
    }

    setPositionFromDown(position: THREE.Vector3): void {
        let flagPosition = position.clone();
        let flagStickPosition = position.clone();
        flagPosition.y += this.flagStickH - this.flagH / 2;
        flagPosition.x += this.flagW / 2 + this.flagStickRadius;
        flagStickPosition.y += this.flagStickH / 2;
        this.position.copy(flagPosition);
        this.flagStickMesh.position.copy(flagStickPosition);
        this.flagGlowLight.position.copy(flagPosition);
        this.flagGlowMesh.position.copy(flagPosition);
    }

    getYZoomShiftRatioed(): number {
        return this.yZoomShift - this.yZoomShift * Scene.getScreenWidthRatio() 
                                + this.yZoomShift * Scene.getScreenHeightRatio();
    }

    onClick(): void {
        if (Scene.isDisplayingProject()) return;
        
        if (Scene.getCameraLerpObject() != this &&
                Scene.getProjectDisplayer() != this) {
            Scene.removeProjectDisplayer();

            if (Scene.currentMenu == 0) {
                let finalPosition = this.position.clone();
                let lookPosition = finalPosition.clone();
                let addZ = Math.min(this.flagW, this.flagH) / Scene.getScreenSizeRatio();
                if (this.rotation.y != 0) addZ = -addZ;
                finalPosition.z += addZ;

                finalPosition.x += this.xZoomShift;
                lookPosition.x += this.xZoomShift;
                finalPosition.y += this.getYZoomShiftRatioed();
                lookPosition.y += this.getYZoomShiftRatioed();

                let cameraLerp = Scene.setCameraLerp(finalPosition, this);
                cameraLerp.setLookPosition(lookPosition);
            }

            if (Scene.currentMenu == 1) {
                if (this.centeredText != null) {
                    this.centeredText.style.opacity = "";
                    this.centeredText.style.transform = "";
                }
                this.displayProject();
            }

        }
    }

    hideSelf(): void {
        Scene.removeEntity(this);
        Scene.removeEntity(this.flagStickMesh);
    }

    showSelf(): void {
        Scene.addEntity(this);
        Scene.addEntity(this.flagStickMesh);
    }

    updateFrame(): void {
        if (Scene.camera.position.distanceTo(this.position) < 600) {
            let vPositions = this.geometry.attributes.position;

            for (let i = 0; i < vPositions.count; i++) {
                const x = vPositions.getX(i);
                const y = vPositions.getY(i);
                const t = Utils.getElapsedTime();

                const waveX1 = this.AX1 * Math.sin(x * this.DX1 + t * 3.02);
                const waveX2 = this.AX2 * Math.sin(x * this.DX2 + t * 2);
                const waveY1 = this.AY1 * Math.sin(y * this.DY1 + t * 0.52);
                const waveY2 = this.AY2 * Math.sin(y * this.DY2 + t * 0.36);
                const ig = (x + this.halfFlagW) / this.flagW;
                
                let setI = (this.rotation.y == 0) ? i : vPositions.count - i - 1;
                vPositions.setZ(setI, (waveX1 + waveX2 + waveY1 + waveY2) * ig);
            }

            this.geometry.attributes.position.needsUpdate = true;
        }

        this.updateVideo();
    }

    updateVideo() {
        if (this.flagVidTexture != null) {
            this.flagVidTexture.needsUpdate = true;
        }
    }

    cloneForMenu(): Flag {
        return new Flag(
            this.flagW, this.flagH,
            this.flagImgPath, this.flagVidPath,
            0, 0, this.flagStickColor,
            this.flagProjectSectionId, this.xZoomShift, this.yZoomShift,
            this.toolIconCubeImgs
        );
    }
}
