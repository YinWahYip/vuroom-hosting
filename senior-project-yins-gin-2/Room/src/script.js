import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Debug
 */
const gui = new GUI()
const gltfLoader = new GLTFLoader()

const parameters = {
    StarColors: '#ffeded' // Renamed from materialColor to starColors
}
gui.hide();
gui
    .addColor(parameters, 'StarColors') // Updated the property name
    .onChange(() => {
        material.color.set(parameters.StarColors) // Updated the property reference
        particlesMaterial.color.set(parameters.StarColors) // Updated the property reference
    })
parameters.backgroundColor = '#1e1a20'; // Default background color

gui.addColor(parameters, 'backgroundColor').onChange(() => {
    scene.background = new THREE.Color(parameters.backgroundColor);
});

const guiElement = document.querySelector('.lil-gui');

// Function to toggle the visibility of the GUI
function toggleGUI() {
    if (guiElement) {
        if (guiElement.style.display === 'none') {
            guiElement.style.display = 'block';
        } else {
            guiElement.style.display = 'none';
        }
    }
}

// Add event listener to listen for the 'H' key press
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'h') {
        toggleGUI();
    }
});



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter


// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Objects
const objectsDistance = 7
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
const sectionMeshes = [];
gltfLoader.load(
    '/Model/singleglb/full_single.glb', //please please make sure to upload glb files properly 
    (gltf) => {
        const singleRoom = gltf.scene;
        singleRoom.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
        singleRoom.position.set(0, - objectsDistance * 1, 0); // Adjust position if necessary
        scene.add(singleRoom); // Add the loaded model to the scene
        sectionMeshes.push(singleRoom);
        console.log("Added successfully")
    },
    undefined, // onProgress can be omitted

)

gltfLoader.load(
    '/Model/Double_Room/double_room.glb',
    (gltf) => {
        const doubleRoom = gltf.scene;
        doubleRoom.scale.set(0.5, 0.5, 0.5); // Adjust scale if necessary
        doubleRoom.position.set(0, - objectsDistance * 2, 0); // Adjust position if necessary
        scene.add(doubleRoom); // Add the loaded model to the scene
        sectionMeshes.push(doubleRoom);
        console.log("Added double successfully")
    },
    undefined, // onProgress can be omitted

)

const loadedMeshes = [];
const meshPaths = [
    '/Model/singleglb/drawer.glb',
    '/Model/singleglb/chair.glb'
];

// Load all meshes
meshPaths.forEach((path) => {
    gltfLoader.load(path, (gltf) => {
        const mesh = gltf.scene;
        loadedMeshes.push(mesh);

        // Once all meshes are loaded, create particles
        if (loadedMeshes.length === meshPaths.length) {
            createParticleMeshes();
        }
    });
});

/**
 * Create Floating Particle Meshes
 */
const particleMeshes = []; // Array to store the particle meshes
const particleCount = 200; // Number of particle meshes
const particleScale = 0.1; // Scale for the particle meshes

function createParticleMeshes() {
    for (let i = 0; i < particleCount; i++) {
        // Select a random mesh from the loaded meshes
        const randomMesh = loadedMeshes[Math.floor(Math.random() * loadedMeshes.length)].clone();

        // Set random position
        randomMesh.position.set(
            (Math.random() - 0.5) * 20, // X-position
            (Math.random() - 0.5) * objectsDistance * 6, // Y-position
            (Math.random() - 0.5) * 20 // Z-position
        );

        // Scale down the particle
        randomMesh.scale.set(particleScale, particleScale, particleScale);

        // Add the particle to the scene and store it in the array
        scene.add(randomMesh);
        particleMeshes.push(randomMesh);
    }
}



mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

// scene.add(mesh1, mesh2, mesh3)





/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Ambient light for general illumination
scene.add(ambientLight);


/**
 * Particles
 */
// Geometry
const particlesCount = 650
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

const texts = [
    "Welcome to VUROOM - Your Virtual Gateway to your up and coming home away from home!",
    "Did you know that it stood for VIRTUAL UNIVERSITY ROOM!",
    "OK. To be perfectly honest, there's probably a million better ways to see what the residence hall will look like, such as blue key or tiktok",
    "But hey - you know what they don't have that VUROOM does? You can actually interact with the room (to a very limited degree) and move furniture around",
    "You can adjust the stars colors of the website! <span style='color: #ff5555; font-weight: bold;'> Press H</span> and select a color you like!"
];


let currentIndex = 0;
const descriptionElement = document.getElementById('description-text');
const nextButton = document.getElementById('next-button');
let autoUpdateInterval;
const updateIntervalTime = 5000;
// Function to update the text with smooth animation
function updateText() {
    // Fade out the current text
    gsap.to('#description-text', {
        opacity: 0,
        duration: 0.5, // Duration for fade-out
        onComplete: () => {
            // Update the text content
            currentIndex = (currentIndex + 1) % texts.length; // Use modulo to loop back to the start
            descriptionElement.innerHTML = texts[currentIndex];

            // Fade in the new text
            gsap.fromTo('#description-text',
                {
                    opacity: 0, // Start as transparent
                    y: 50 // Start from below
                },
                {
                    opacity: 1, // End as fully visible
                    y: 0, // End at normal position
                    duration: 1 // Duration for fade-in
                }
            );
        }
    });
}

// Function to reset the auto-update interval
function resetAutoUpdate() {
    clearInterval(autoUpdateInterval); // Clear the existing interval
    autoUpdateInterval = setInterval(updateText, updateIntervalTime); // Restart the interval
}

// Event listener for the next button
nextButton.addEventListener('click', () => {
    clearInterval(autoUpdateInterval); // Stop auto-updating
    updateText(); // Trigger text update once
    resetAutoUpdate(); // Restart the auto-update timer
});

// Start the initial auto-update interval
resetAutoUpdate();

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
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

// window.addEventListener('scroll', () => {
//     scrollY = window.scrollY
//     const newSection = Math.round(scrollY / sizes.height)

//     if (newSection != currentSection) {
//         currentSection = newSection

//         gsap.to(
//             sectionMeshes[currentSection].rotation,
//             {
//                 duration: 1.5,
//                 ease: 'power2.inOut',
//                 x: '+=6',
//                 y: '+=3',
//                 z: '+=1.5'
//             }
//         )
//     }
// })
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);

    if (newSection != currentSection) {
        currentSection = newSection;

        if (sectionMeshes[currentSection]) {
            gsap.to(
                sectionMeshes[currentSection].rotation,
                {
                    duration: 3,
                    ease: 'power2.inOut',
                    x: '+=1',
                    y: '+=1',
                    z: '+=1'
                }
            );
        }
    }
});
/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectsDistance;

    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

    // Animate section meshes (floating effect)
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1; // Rotate gently
        mesh.rotation.y += deltaTime * 0.12; // Rotate gently
    }

    // Animate floating particle meshes
    for (const particle of particleMeshes) {
        particle.position.y += Math.sin(elapsedTime * 0.5) * 0.005;
        particle.position.x += Math.sin(elapsedTime * 0.3) * 0.0099999;
        particle.rotation.x += deltaTime * 0.1; // Optional: gentle rotation
        particle.rotation.y += deltaTime; // Optional: gentle rotation
    }


    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
// // Place button listener here, after everything else
// document.getElementById('single-room-btn').addEventListener('click', (event) => {
//     event.preventDefault();
//     window.location.href = './js/rooms/single-room.html'; // Navigate to single-room.html
// });

// document.getElementById('double-room-btn').addEventListener('click', (event) => {
//     event.preventDefault();
//     window.location.href = './js/rooms/double-room.html'; // Navigate to double-room.html
// });
