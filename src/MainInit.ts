import * as THREE from 'three';
import { CameraFollowObject } from './CameraFollowObject';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class MainInit {

    private static readonly curvePoints: number[] = [
        600, 200, 300,
        460, 200, 160,
        400, 100, 60,
        300, 100, -160,
        400, 60, -400,
        340, 60, -510,
        130, 200, -560,
        -100, 200, -300,
        -200, 260, 0,
        400, 200, 560,
        780, 200, 480,
        600, 200, 300,
    ];
    
    // private static readonly curvePoints: number[] = [];

    public static readonly ls: number = 1400;
    public static readonly lss: number = MainInit.ls + 1;

    private static t: THREE.Vector3[] = [];
    private static n: THREE.Vector3[] = [];
    private static b: THREE.Vector3[] = [];

    private static points: THREE.Vector3[];

    public static target: CameraFollowObject = new CameraFollowObject();

    static initRoad() {
        // let n = 64;
        // let r = 200;
        // for (let i = 0; i < n; i++) {
        //     let theta = (2 * Math.PI * i) / n;
        //     let x = r * Math.cos(theta);
        //     let z = r * Math.sin(theta);
        //     let y = 0;
        //     if (i < n / 2) y = i;
        //     else y = n - i;
        //     MainInit.curvePoints.push(x, y, z);
        // }
        // MainInit.curvePoints.push(MainInit.curvePoints[0],
        //     MainInit.curvePoints[1], MainInit.curvePoints[2]);
        
        const pts = [];    
        for (let i = 0; i < MainInit.curvePoints.length; i += 3) {
            pts.push(new THREE.Vector3(MainInit.curvePoints[i], 
                MainInit.curvePoints[i + 1], MainInit.curvePoints[i + 2]));
        }
        
        const ws = 5;
        const wss = ws + 1;
        
        const curve = new THREE.CatmullRomCurve3(pts);
        MainInit.points = curve.getPoints(MainInit.ls);
        const len = curve.getLength();
        const lenList = curve.getLengths (MainInit.ls);
        
        const faceCount = MainInit.ls * ws * 2;
        const vertexCount = MainInit.lss * wss;
        
        const indices = new Uint32Array(faceCount * 3);
        const vertices = new Float32Array(vertexCount * 3);
        const uvs = new Float32Array(vertexCount * 2);
        
        const g = new THREE.BufferGeometry();
        g.setIndex(new THREE.BufferAttribute(indices, 1));	
        g.setAttribute('position', new THREE.BufferAttribute(vertices, 3 ));
        g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        
        let idxCount = 0;
        let a, b1, c1, c2;
        
        for (let j = 0; j < MainInit.ls; j ++) {
            for (let i = 0; i < ws; i ++) {
                a =  wss * j + i;
                b1 = wss * (j + 1) + i;
                c1 = wss * (j + 1) + i + 1;
                c2 = wss * j + i + 1;
                
                indices[idxCount] = a;
                indices[idxCount + 1] = b1;
                indices[idxCount + 2] = c1; 
                
                indices[idxCount + 3] = a;
                indices[idxCount + 4] = c1;
                indices[idxCount + 5] = c2; 
                
                g.addGroup(idxCount, 6, i);
                
                idxCount += 6;
            }
        }
        
        let uvIdxCount = 0;
        for ( let j = 0; j < MainInit.lss ; j ++ ) {
            for ( let i = 0; i < wss; i ++ ) {
                uvs[uvIdxCount] = lenList[j] / len;
                uvs[uvIdxCount + 1] = i / ws;
    
                uvIdxCount += 2;
            }
        }
        
        let x, y, z;
        let posIdx = 0;
        
        let tangent;
        const normal = new THREE.Vector3();
        const binormal = new THREE.Vector3(0, 1, 0);
        
        for ( let j = 0; j < MainInit.lss; j ++ ) {
            tangent = curve.getTangent(j / MainInit.ls);
            MainInit.t.push(tangent.clone());
            
            normal.crossVectors(tangent, binormal);
            
            normal.y = 0;
            
            normal.normalize();
            MainInit.n.push(normal.clone());
            
            binormal.crossVectors(normal, tangent);
            MainInit.b.push(binormal.clone());	
            
        }
        
        const dw = [-12, -10, -1, 1, 10, 12];
        
        for ( let j = 0; j < MainInit.lss; j ++ ) {
            for ( let i = 0; i < wss; i ++ ) {
                x = MainInit.points[j].x + dw[i] * MainInit.n[j].x;
                y = MainInit.points[j].y;
                z = MainInit.points[j].z + dw[i] * MainInit.n[j].z;		 
    
                vertices[posIdx] = x;
                vertices[posIdx + 1] = y;
                vertices[posIdx + 2] = z;
    
                posIdx += 3;
            }
        }
        
        const tex = new THREE.TextureLoader().load("res/imgs/planets/Planet_Pink0.jpg");
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.set(MainInit.ls * 2, 0);
        const eIntensity = 10;

        const material = [
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                side: THREE.DoubleSide,
                emissiveIntensity: eIntensity,
                emissive: 0xFFFFFF
            }),
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                side: THREE.DoubleSide,
                emissiveIntensity: eIntensity,
                emissive: 0x111111
            }),
            new THREE.MeshStandardMaterial({
                map: tex,
                side: THREE.DoubleSide,
                emissiveIntensity: eIntensity,
                emissive: 0xFFFFFF,
                emissiveMap: tex
            }),
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                side: THREE.DoubleSide,
                emissiveIntensity: eIntensity,
                emissive: 0x111111
            }),
            new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                side: THREE.DoubleSide,
                emissiveIntensity: eIntensity,
                emissive: 0xFFFFFF
            }),
        ];
        
        const roadMesh = new THREE.Mesh(g, material);
        Scene.addEntity(roadMesh);
    }

    private static M3 = new THREE.Matrix3();
    private static M4 = new THREE.Matrix4();
    public static readonly scrollLengthAdv: number = 10;
    public static i = -MainInit.scrollLengthAdv;
    public static forward: boolean = false;
    public static doneOneRound: boolean = false;
    public static quaternionList: THREE.Quaternion[] = [];

    public static targetRoadHeight = 20;

    public static readonly barLength = 20;
    public static readonly scrollHeight = 
        window.innerHeight * (MainInit.barLength / 100);
    public static readonly htmlHeight: string = 
        (100 + MainInit.barLength * (MainInit.ls / MainInit.scrollLengthAdv - 1)) + "%";

    static moveForward(forward: boolean) {
        MainInit.forward = forward;

        let length = MainInit.scrollLengthAdv;
        if (forward) {
            MainInit.i += length;
            if (MainInit.i >= MainInit.ls) {
                if (!MainInit.doneOneRound) {
                    MainInit.i = 0;
                } else {
                    MainInit.i = MainInit.ls - 1;
                }
                MainInit.doneOneRound = true;
                // MainInit.i = 0;
            }
        } else {
            MainInit.i -= length;
            if (MainInit.i < 0) {
                // MainInit.i = MainInit.ls - length;
                MainInit.i = 0;
            }
        }

        let t = MainInit.t;
        let b = MainInit.b;
        let n = MainInit.n;

        MainInit.M3.set(
            t[MainInit.i].x, b[MainInit.i].x, n[MainInit.i].x,
            t[MainInit.i].y, b[MainInit.i].y, n[MainInit.i].y,
            t[MainInit.i].z, b[MainInit.i].z, n[MainInit.i].z
        );
        MainInit.M4.setFromMatrix3(MainInit.M3);
        MainInit.target.rotation.setFromRotationMatrix(MainInit.M4);
        MainInit.target.rotateY(-Math.PI / 2);

        let points = MainInit.points;
        MainInit.target.position.set(
            points[MainInit.i].x + 0.18 * n[MainInit.i].x,
            points[MainInit.i].y + MainInit.targetRoadHeight,
            points[MainInit.i].z + 0.18 * n[MainInit.i].z
        );

        window.scrollTo({
			top: (MainInit.i / MainInit.scrollLengthAdv) * MainInit.scrollHeight,
			behavior: 'auto'
		});
        Scene.setProgressBarProgress();

        if (!MainInit.doneOneRound) {
            let tmpCam = Scene.camera.clone();
            let finalPosition = Utils.getObjectBehindPosition(MainInit.target, -MainInit.scrollLengthAdv);
            tmpCam.position.copy(finalPosition);
            tmpCam.lookAt(MainInit.target.position);
            MainInit.quaternionList.push(tmpCam.quaternion.clone());
        }
    }
}
