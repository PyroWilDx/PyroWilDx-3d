import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { RotatingObject } from './RotatingObject.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';

export class Planet extends RotatingObject {

    private radius: number;
    private rings: RotatingObject[];
    private flag: Flag | null;

    public sphere: THREE.Sphere;

    constructor(imgPath: string, radius: number,
            position: THREE.Vector3, emissiveIntensity: number = 0,
            emissiveColor: THREE.ColorRepresentation = 0x0) {

        // let nVerticles = Math.max(32, radius / 4);
        // nVerticles = Math.min(64, nVerticles);
        let planetTexture = Utils.textureLoader.load(imgPath);

        super(new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshStandardMaterial({
                map: planetTexture,
                side: THREE.FrontSide,
                emissiveIntensity: emissiveIntensity,
                emissive: emissiveColor,
                emissiveMap: planetTexture
            }),
            Utils.getRandomVector3Spread(0.0036),
            0.001
        );
        this.position.copy(position);
        Scene.addEntity(this);

        this.radius = radius;

        this.rings = [];
        this.flag = null;

        this.sphere = new THREE.Sphere(this.position, this.radius);
    }

    addRing(start: number, length: number, texturePath: string | null,
                colorV: number | null,  emissiveIntensity: number,
                emissiveColor: THREE.ColorRepresentation = 0x0): void {
        let tStart = start + this.radius;

        // let nVerticles = Math.max(64, (tStart + length) / 4);
        // nVerticles = Math.min(160, nVerticles);
        let rSpeed = Utils.getRandomVector3Spread(0.004);
        let ringMesh: RotatingObject | null = null;
        if (colorV != null) {
            ringMesh = new RotatingObject(
                new THREE.RingGeometry(tStart, tStart + length, 64),
                new THREE.MeshStandardMaterial({
                    color: colorV,
                    side: THREE.DoubleSide,
                    emissiveIntensity: emissiveIntensity,
                    emissive: colorV,
                }),
                rSpeed,
                0.001
            ); 
        }
        if (texturePath != null) {
            let ringTexture = Utils.textureLoader.load(texturePath);
            ringMesh = new RotatingObject(
                new THREE.RingGeometry(tStart, tStart + length, 64),
                new THREE.MeshStandardMaterial({
                    map: ringTexture,
                    side: THREE.DoubleSide,
                    emissiveIntensity: emissiveIntensity,
                    emissive: emissiveColor,
                    emissiveMap: ringTexture
                }),
                rSpeed,
                0.001
            );
        }

        if (ringMesh != null) {
            this.getWorldPosition(ringMesh.position);
            Scene.addEntity(ringMesh);
            this.rings.push(ringMesh);
        }
    }
    
    hideFlag(): void {
        if (this.flag != null) {
            this.flag.hideSelf();
        }
    }

    showFlag(): void {
        if (this.flag != null) {
            this.flag.showSelf();
        }
    }

    updateFrame(): void {
        this.rotate();
    
        for (const currRingMesh of this.rings) {
            currRingMesh.rotate();
        }

        if (this.flag != null) {
            this.flag.updateFrame();
        }
    }

    setFlag(flag: Flag): void {
        this.flag = flag;
        let flagPosition = this.position.clone();
        flagPosition.y += this.radius - 10;
        this.flag.setPositionFromDown(flagPosition);
    }

    getFlag(): Flag | null {
        return this.flag;
    }

    getSphere(): THREE.Sphere {
        return this.sphere;
    }

}
