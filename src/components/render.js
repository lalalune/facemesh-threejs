
import * as THREE from 'three';
import { OBJLoader } from './OBJLoader';
import * as facemesh from '@tensorflow-models/facemesh';
import * as tf from '@tensorflow/tfjs-core';

const $ = window.$;
var model;
var marks = [];
const landmarksLength = 468;

var faceObj;
var triangle;
var bg;
var points = [];
var cube;
var video;
let renderer;
let camera;
var container;
let scene;
let videoSprite;

export function IntializeThreejs() {
    video = document.getElementById('facemesh-video');

    container = document.getElementById('threejsContainer');
    camera = new THREE.PerspectiveCamera(50, video.videoWidth / video.videoHeight, 1, 5000);

    camera.position.z = video.videoHeight;
    camera.position.x = -video.videoWidth / 2;
    camera.position.y = -video.videoHeight / 2;

    bg = new THREE.Texture(video);

    bg.minFilter = THREE.LinearFilter;

    videoSprite = new THREE.Sprite(new THREE.MeshBasicMaterial({
        map: bg,
        depthWrite: false,
        side: THREE.DoubleSide
    }));
    scene = new THREE.Scene();


     // Create lights
     const ambientLight = new THREE.AmbientLight(0x101030);
     scene.add(ambientLight);

     const directionalLight = new THREE.DirectionalLight(0xffeedd);
     directionalLight.position.set(0, 0, 1);
     scene.add(directionalLight);


    scene.add(videoSprite);
    videoSprite.center.set(0.5, 0.5);
    videoSprite.scale.set(-video.videoWidth, video.videoHeight, 1);
    videoSprite.position.copy(camera.position);
    videoSprite.position.z = 0;

    var geometry = new THREE.BoxGeometry(2, 2, 2);

    const triGeo = new THREE.Geometry();
    triGeo.vertices.push(new THREE.Vector3(1, 0, 0));
    triGeo.vertices.push(new THREE.Vector3(-1, 0, 0));
    triGeo.vertices.push(new THREE.Vector3(0, 0, 1));

    triGeo.faces.push(new THREE.Face3(0, 1, 2));

    triangle = new THREE.Mesh(triGeo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    triangle.visible = false;
    scene.add(triangle);

    cube = new THREE.Object3D();
    scene.add(cube);

    new OBJLoader().load('facemesh.obj', obj => {
        obj.traverse(child => {
            if (child instanceof THREE.Mesh) {
                faceObj = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({ side: THREE.FrontSide, color: "blue" }));
                scene.add(faceObj);
            }
        });
    })

    for (let index = 0; index < landmarksLength; index++) {
        const element = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        marks.push(element);
    }

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    if (window.innerWidth > window.innerHeight)
        renderer.setSize(window.innerWidth, window.innerWidth * video.videoHeight / video.videoWidth);
    else
        renderer.setSize(window.innerHeight * video.videoWidth / video.videoHeight, window.innerHeight);
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    animate();
}


function onWindowResize() {

    camera.aspect = video.videoWidth / video.videoHeight;
    camera.updateProjectionMatrix();

    if (window.innerWidth > window.innerHeight)
        renderer.setSize(window.innerWidth, window.innerWidth * video.videoHeight / video.videoWidth);
    else
        renderer.setSize(window.innerHeight * video.videoWidth / video.videoHeight, window.innerHeight);

}

function animate() {
    bg.needsUpdate = true;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

export async function IntializeEngine() {
    await tf.setBackend('webgl');
    model = await facemesh.load({ maxFaces: 1 });
    renderPrediction();
}

async function renderPrediction() {

    const predictions = await model.estimateFaces(video);

    if (predictions.length > 0) {
        $('.loadingscreen').fadeOut();

        faceObj.visible = true;
        cube.visible = true;
        for (let i = 0; i < predictions.length; i++) {
            const keypoints = predictions[i].scaledMesh;

            points = keypoints;

            const v2 = new THREE.Vector3(-keypoints[7][0], -keypoints[7][1], -keypoints[7][2]);
            const v1 = new THREE.Vector3(-keypoints[175][0], -keypoints[175][1], -keypoints[175][2])
            const v3 = new THREE.Vector3(-keypoints[263][0], -keypoints[263][1], -keypoints[263][2])


            const x = v1.x + v2.x + v3.x;
            const y = v1.y + v2.y + v3.y;
            const z = v1.z + v2.z + v3.z;

            triangle.geometry.vertices[0].copy(v1);
            triangle.geometry.vertices[1].copy(v2);
            triangle.geometry.vertices[2].copy(v3);
            triangle.geometry.verticesNeedUpdate = true;
            triangle.geometry.computeFaceNormals();

            const normal = triangle.geometry.faces[0].normal.clone();

            normal.transformDirection(triangle.matrixWorld);
            normal.add(new THREE.Vector3(x / 3, y / 3, z / 3));
            cube.position.set(x / 3, y / 3, z / 3);
            cube.lookAt(normal);

            const p1 = new THREE.Vector3(-points[10][0], -points[10][1], -points[10][2]);
            const p2 = new THREE.Vector3(-points[175][0], -points[175][1], -points[175][2]);

            const scale = p1.distanceTo(p2) / 163.4;

            cube.scale.set(scale, scale, scale);

            // Log facial keypoints.
            for (let i = 0; i < keypoints.length; i++) {
                const [x, y, z] = keypoints[i];
                // marks[i].position.set(-x, -y, -z/16);

                if (faceObj) {
                    faceObj.geometry.vertices[i].set(-x, -y, -z / 30);
                    faceObj.geometry.verticesNeedUpdate = true;

                }


            }

        }
    }
    else {
        faceObj.visible = false;
        cube.visible = false;

    }
    requestAnimationFrame(renderPrediction);

}
// CREATES REFERENCE FACE MESH
