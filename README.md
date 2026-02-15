1. Importação de Ferramentas

import * as THREE from '[https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js](https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js)';
import { GLTFLoader } from '[https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/GLTFLoader.js](https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/GLTFLoader.js)';


Linha 1: Puxa a biblioteca principal (Three.js), que é o motor que cria o mundo 3D.

Linha 2: Puxa uma ferramenta específica para conseguir ler arquivos de modelos 3D (o .glb).

2. Variáveis Globais (As Caixas de Memória)

let moeda, girando = false;
const txt = document.getElementById('texto');


moeda: Uma caixa vazia onde vamos guardar o modelo 3D depois de carregar.

girando: Um interruptor (verdadeiro/falso). Começa desligado porque a moeda está parada.

txt: Um atalho para o título no HTML, para conseguirmos mudar o texto de "Pronto" para "Cara".

3. Configuração do Universo

const cena = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
cam.position.z = 7;


cena: Cria o espaço vazio (o vácuo).

cam: Cria a câmera. O 50 é o ângulo de visão, e o resto serve para não distorcer a imagem.

cam.position.z = 7: Afasta a câmera para trás. Se for 0, você fica dentro da moeda.

4. O Pintor (Renderizador)

const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
render.setSize(window.innerWidth, window.innerHeight);
render.setClearColor(0x000000, 0);
document.getElementById('container-3d').appendChild(render.domElement);


render: O motor que desenha os pixels. antialias remove os serrilhados e alpha permite a transparência.

setSize: Faz o desenho ocupar a tela toda.

setClearColor: Garante que o fundo do 3D seja invisível (transparência total).

appendChild: Pega o desenho e coloca dentro daquela "div" que criamos no HTML.

5. As Luzes

const luz1 = new THREE.AmbientLight(0xffffff, 1.2);
const luz2 = new THREE.DirectionalLight(0xffffff, 1.5);
luz2.position.set(5, 5, 5);
cena.add(luz1, luz2);


luz1: Luz que vem de todos os lados (clareia as sombras).

luz2: Luz como o sol (cria brilhos e reflexos no metal).

cena.add: Coloca as luzes dentro do mundo.

6. Carregando a Moeda

new GLTFLoader().load('moeda.glb', (gltf) => {
    moeda = gltf.scene;
    cena.add(moeda);
    // ... cálculos de escala e centralização ...
});


load: Vai buscar o arquivo.

moeda = gltf.scene: Guarda o modelo na nossa variável.

Box3 / getSize: O código mede a moeda para saber se ela é gigante ou minúscula e ajusta para um tamanho padrão.

position.sub(centro): Move a moeda para que o meio dela seja exatamente o centro do giro.

7. A Lógica de Jogar

window.jogar = () => {
    if (!moeda || girando) return; // Se não carregou ou já está girando, ignora o clique.
    girando = true;
    const cara = Math.random() < 0.5; // O dado: 50% de chance para cada lado.
    const res = cara ? "CARA" : "COROA";
    const inicio = moeda.rotation.x; // De onde a moeda está começando a girar.


Math.PI * 2 * 10: Significa 10 voltas completas (cada volta é 2 PI).

fim: O destino final. Se for CARA, termina em um ângulo reto. Se for COROA, termina com meia volta a mais (180 graus ou PI).

8. A Animação (O Movimento)

function anim(now) {
    const t = Math.min((now - start) / ms, 1); // Calcula o tempo de 0 a 1.
    const e = 1 - Math.pow(1 - t, 4); // Suaviza o movimento (começa rápido e freia).
    moeda.rotation.x = inicio + ((fim - inicio) * e); // Roda a moeda.
    moeda.position.y = Math.sin(t * Math.PI) * 2; // Faz a moeda subir e descer (pulo).


requestAnimationFrame: Pede para o navegador desenhar o próximo quadro da animação o mais rápido possível.

9. O Loop Eterno

function loop() {
    requestAnimationFrame(loop);
    if (!girando) render.render(cena, cam);
}


Este loop fica rodando o tempo todo para garantir que, mesmo parada, a moeda continue aparecendo na tela.
