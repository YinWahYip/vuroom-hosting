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
guiContainer.style.top = '57.5px'; // Add a bit of margin from the top

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Bed Group
const bedGroup = new THREE.Group();

const gltfLoader = new GLTFLoader()
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()




//List of Textures for background
const backgroundTextures = {
    'Black': textureLoader.load('/Background/pure-black-background.jpg'),
    'Nova2': textureLoader.load('/Background/Nova2.jpg'),
    'Augustin': textureLoader.load('/Background/Augustin.jpg'),
    'Christmas Market': textureLoader.load('/Background/ChristmasMarket.jpg'),
    'Kennedy': textureLoader.load('/Background/Kennedy.jpg'),
}


//Default Texture Background:
scene.background = backgroundTextures['Grid'];

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

//Overall Room
gltfLoader.load(
    '/Model/Double_Room/double_room.glb',
    (gltf) => {
        const room = gltf.scene;
        room.scale.set(1, 1, 1); // Adjust scale if necessary
        room.position.set(0, 0, 0); // Adjust position if necessary
        scene.add(room); // Add the loaded model to the scene
        console.log('Model loaded successfully');
    },
    undefined, // onProgress can be omitted

)
// NOT CURRENTLY WORKING
gui
    .addColor(parameters, 'StarColors') // Updated the property name
    .onChange(() => {
        material.color.set(parameters.StarColors) // Updated the property reference
        particlesMaterial.color.set(parameters.StarColors) // Updated the property reference
    })

//Mattress 
gltfLoader.load(
    '/Model/Double_Room/DoubleMatt.glb',
    (gltf) => {
        const bedMattress = gltf.scene;
        bedMattress.scale.set(1, 1, 1); // Adjust scale if necessary
        bedMattress.position.set(0, .1, 0); // Adjust position if necessary (place it on top of the bed frame)
        bedGroup.add(bedMattress)
        console.log('Bed Mattress model loaded successfully');
        gui.add(bedMattress.position, 'y', -.5, 0, 0.01).name('Mattress Height');
    },
)
gltfLoader.load(
    '/Model/Double_Room/DoubleBedFrame.glb', // Path to BedFrame model
    (gltf) => {
        const bedFrame = gltf.scene;
        bedFrame.scale.set(1, 1.2, 1); // Adjust scale if necessary
        bedFrame.position.set(0, -.25, 0); // Adjust position if necessary
        bedGroup.add(bedFrame)
        console.log('Bed Frame model loaded successfully');

    },
)


// gui.add(bedGroup.position, 'x', -5, 5, 0.01).name('Bed X Position'); // Adjust X position
// gui.add(bedGroup.position, 'z', -5, 5, 0.01).name('Bed Z Position');
scene.add(bedGroup)


/**
 * Plane
 */
// const planeGeometry = new THREE.PlaneGeometry(20, 20); // Create a plane of width 5 and height 5
// const planeMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); // Basic white material
// const plane = new THREE.Mesh(planeGeometry, planeMaterial); // Create the mesh by combining geometry and material
// plane.rotation.x = Math.PI * -0.5; // Rotate the plane to be horizontal (lying flat)
// scene.add(plane); // Add the plane to the scene


// Ambient Light

// Create and position the directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Intensity of 1
directionalLight.position.set(1, 3, 1.5); // Adjust as needed for your scene
scene.add(directionalLight);

const targetPosition = new THREE.Vector3(1, 1, 1);

// Make the light look at the specified position
directionalLight.lookAt(targetPosition);

scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // White light with low intensity (0.2)
scene.add(ambientLight);

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5, 5, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Lil-GUI background controls

const backgroundOptions = {
    background: 'Black' // Default background name
};

// Function to update background
const updateBackground = (selectedBackground) => {
    scene.background = backgroundTextures[selectedBackground];
}

// Add dropdown control to lil-gui for background selection
gui.add(backgroundOptions, 'background', Object.keys(backgroundTextures))
    .name('Choose Background').onChange((value) => {
        updateBackground(value); // Update background on selection change
        console.log('It has been changed')
    }
    );



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
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

