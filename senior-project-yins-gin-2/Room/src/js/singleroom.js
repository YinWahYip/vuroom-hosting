import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'
import { AsyncDeflate } from 'three/examples/jsm/libs/fflate.module.js'

/**
 * Base
 */
// Debug
const gui = new GUI()
// Move the lil-gui panel to the right side of the screen
const guiContainer = document.querySelector('.lil-gui');
guiContainer.style.position = 'absolute';
guiContainer.style.right = '0'; // Align it to the right side


// Canvas and Mouse Interaction
const canvas = document.querySelector('canvas.webgl');

// Scene, Bed Group, and Loaders
const scene = new THREE.Scene();
const bedGroup = new THREE.Group();

const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader();

const xMin = -0.4, xMax = 0.60, zMin = -3.9, zMax = 4;

// const backgroundTextures = {
//     'Black': textureLoader.load('/Background/pure-black-background.jpg'),
//     'Nova2': textureLoader.load('/Background/Nova2.jpg'),
//     'Augustin': textureLoader.load('/Background/Augustin.jpg'),
//     'Christmas Market': textureLoader.load('/Background/ChristmasMarket.jpg'),
//     'Kennedy': textureLoader.load('/Background/Kennedy.jpg'),
// }
// scene.background = backgroundTextures['Black'];

// const backgroundOptions = {
//     background: 'Grid' // Default background name
// };

// // Function to update background
// const updateBackground = (selectedBackground) => {
//     scene.background = backgroundTextures[selectedBackground];
// }

// // Add dropdown control to lil-gui for background selection
// gui.add(backgroundOptions, 'background', Object.keys(backgroundTextures))
//     .name('Choose Background').onChange((value) => {
//         updateBackground(value);
//     }
//     );

const objectsDistance = 7

const parameters = {
    StarColors: '#ffeded' // Renamed from materialColor to starColors
}
const particlesCount = 300
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 6 //change 6 based on sections
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.05
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


function centerMesh(mesh) {
    // Create a bounding box for the mesh
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    // Calculate the center of the bounding box
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Reposition the mesh so its center is at the origin
    mesh.position.sub(center);

    // Update the matrix to apply the changes
    mesh.updateMatrixWorld();
    // console.log('centered:', center);
}

//Overall Room
gltfLoader.load(
    '/Model/singleglb/SingleRoom.glb',
    (gltf) => {
        const room = gltf.scene;
        room.scale.set(1, 1, 1); // Adjust scale if necessary
        room.position.set(0, 0, 0); // Adjust position if necessary
        scene.add(room); // Add the loaded model to the scene
        console.log('Model loaded successfully');
    },
)
gltfLoader.load(
    '/Model/singleglb/drawer.glb',
    (gltf) => {
        const drawer = gltf.scene;
        scene.add(drawer); // Add the loaded model to the scene
        drawer.scale.y *= 0.9
        const drawerFolder = gui.addFolder('Drawer');

        // Add position controls
        const drawerPosition = drawer.position;
        drawerFolder.add(drawerPosition, 'x', 0, 3.5).name('Drawer Position X');
        drawerFolder.add(drawerPosition, 'z', -7, 1.185).name('Drawer Position Z');
    },

)

gltfLoader.load(
    '/Model/singleglb/DeskChair.glb',
    (gltf) => {
        const deskAndChair = gltf.scene;
        scene.add(deskAndChair); // Add the loaded model to the scene

        console.log('Desk and Chair model loaded successfully');

        // Create a GUI folder for deskAndChair
        const deskAndChairFolder = gui.addFolder('Desk and Chair');

        // Add position controls
        const deskAndChairPosition = deskAndChair.position;
        deskAndChairFolder.add(deskAndChairPosition, 'x', 0, 3.28).name('Desk Chair Position X');
        deskAndChairFolder.add(deskAndChairPosition, 'z', -3.9, 4).name('Desk Chair Position Z');

    }
);

gltfLoader.load(
    '/Model/singleglb/BedMattress.glb',
    (gltf) => {
        const bedMattress = gltf.scene;
        bedMattress.scale.set(1, 1, 1);
        bedMattress.position.set(0 - 0.9, 0.1, 0);
        centerMesh(bedMattress);
        bedGroup.add(bedMattress);
        console.log('Bed Mattress model loaded successfully');
        gui.add(bedMattress.position, 'y', -1.54, -0.9, 0.01).name('Mattress Height');
    }
);


gltfLoader.load(
    '/Model/singleglb/BedFrame.glb', // Path to BedFrame model
    (gltf) => {
        const bedFrame = gltf.scene;
        bedFrame.scale.set(1, 1.2, 1); // Adjust scale if necessary
        bedFrame.position.set(0, -0.25, 0); // Adjust position if necessary
        centerMesh(bedFrame); // Center the bed frame
        bedGroup.add(bedFrame);
        console.log('Bed Frame model loaded successfully');
    }
);

// const objectsDistance = 7;

// // Load and store the models
// const loadedMeshes = [];
// const meshPaths = [
//     '/Model/singleglb/drawer.glb',
//     '/Model/singleglb/DeskChair.glb'
// ];

// meshPaths.forEach((path, index) => {
//     gltfLoader.load(
//         path,
//         (gltf) => {
//             const mesh = gltf.scene;
//             loadedMeshes.push(mesh);

//             // If all meshes are loaded, create particles
//             if (loadedMeshes.length === meshPaths.length) {
//                 createRandomParticles();
//             }
//         }
//     );
// });

// function createRandomParticles() {
//     const particleCount = 50; // Number of particle instances
//     for (let i = 0; i < particleCount; i++) {
//         // Pick a random mesh from the loaded meshes
//         const randomMeshIndex = Math.floor(Math.random() * loadedMeshes.length);
//         const randomMesh = loadedMeshes[randomMeshIndex].clone();

//         // Randomize position
//         randomMesh.position.set(
//             (Math.random() - 0.5) * 20, // X
//             objectsDistance * 0.5 - Math.random() * objectsDistance * 6, // Y
//             (Math.random() - 0.5) * 20 // Z
//         );

//         // Optional: Randomize scale
//         const randomScale = Math.random() * 0.5 + 0.5; // Scale between 0.5 and 1
//         randomMesh.scale.set(randomScale, randomScale, randomScale);

//         // Optional: Randomize rotation
//         randomMesh.rotation.set(
//             Math.random() * Math.PI, // Random X rotation
//             Math.random() * Math.PI, // Random Y rotation
//             Math.random() * Math.PI // Random Z rotation
//         );

//         // Add to scene
//         scene.add(randomMesh);
//     }
// }


// Adjust X position with hard limits
gui.add(bedGroup.position, 'x', xMin, xMax, 0.01)
    .name('Bed X Position')
    .onChange(value => {
        bedGroup.position.x = Math.max(xMin, Math.min(value, xMax));
    });

// Adjust Z position with hard limits
gui.add(bedGroup.position, 'z', zMin, zMax, 0.01)
    .name('Bed Z Position')
    .onChange(value => {
        bedGroup.position.z = Math.max(zMin, Math.min(value, zMax));
    });

bedGroup.position.set(xMin, 1.1, zMin)
scene.add(bedGroup);
gui.add(bedGroup.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Bed Rotate Y');


const brightLight = new THREE.DirectionalLight(0xffffff, 3); // Brighter intensity
brightLight.position.set(1, 5, 0); // Set a new position for the light
scene.add(brightLight);

// Add a weak ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // White light with low intensity
scene.add(ambientLight);

// Optional: Add a helper to visualize the direction of the light
// const directionalLightHelper = new THREE.DirectionalLightHelper(brightLight, 2);
// scene.add(directionalLightHelper);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(5, 5, 5);
scene.add(camera);

// Initialize OrbitControls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;





/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    orbitControls.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

