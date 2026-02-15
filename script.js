import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';

let moeda, girando = false;
const txt = document.getElementById('texto');

const cena = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
cam.position.z = 7;

const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
render.setSize(window.innerWidth, window.innerHeight);
render.setClearColor(0x000000, 0);
document.getElementById('container-3d').appendChild(render.domElement);

const luz1 = new THREE.AmbientLight(0xffffff, 1.2);
const luz2 = new THREE.DirectionalLight(0xffffff, 1.5);
luz2.position.set(5, 5, 5);
cena.add(luz1, luz2);

new GLTFLoader().load('moeda.glb', (gltf) => {
    moeda = gltf.scene;
    cena.add(moeda);

    const box = new THREE.Box3().setFromObject(moeda);
    const tam = box.getSize(new THREE.Vector3());
    const max = Math.max(tam.x, tam.y, tam.z);

    if (max > 0) {
        const esc = 2.2 / max;
        moeda.scale.set(esc, esc, esc);
    }

    const centro = new THREE.Box3().setFromObject(moeda).getCenter(new THREE.Vector3());
    moeda.position.sub(centro);
    moeda.rotation.set(0, 0, 0);

    if (txt) txt.innerText = "Pronto";
});

window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    render.setSize(window.innerWidth, window.innerHeight);
});

window.jogar = () => {
    if (!moeda || girando) return;

    girando = true;
    txt.innerText = "Sorteando...";

    const cara = Math.random() < 0.5;
    const res = cara ? "CARA" : "COROA";
    const inicio = moeda.rotation.x;
    const base = Math.round(inicio / (Math.PI * 2)) * (Math.PI * 2);
    const fim = base + (Math.PI * 2 * 10) + (cara ? Math.PI * 2 : Math.PI);

    const ms = 2000;
    const start = performance.now();

    function anim(now) {
        const t = Math.min((now - start) / ms, 1);
        const e = 1 - Math.pow(1 - t, 4);

        moeda.rotation.x = inicio + ((fim - inicio) * e);
        moeda.position.y = Math.sin(t * Math.PI) * 2;
        moeda.rotation.y = moeda.rotation.z = 0;

        render.render(cena, cam);

        if (t < 1) {
            requestAnimationFrame(anim);
        } else {
            girando = false;
            txt.innerText = res;
            moeda.rotation.x = fim;
            moeda.position.y = 0;
        }
    }
    requestAnimationFrame(anim);
};

function loop() {
    requestAnimationFrame(loop);
    if (!girando) render.render(cena, cam);
}
loop();