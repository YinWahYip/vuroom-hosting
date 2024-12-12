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

const sectionMeshes = [];



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
    "Information is power. What decisions you make begin here. Change your freshman year.",
    "The next few minutes is going to be life changing",
    "See what students have to say about the dorms that they're living in!",
    "There are plenty of options that can fit your needs",
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
            descriptionElement.textContent = texts[currentIndex];

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

// Single Room Reviews
const reviews = [
    "The single room was perfect for studying and privacy!",
    "Quiet and cozy, just what I needed after a long day!",
    "Loved the layout, felt like my own little space.",
    "I could focus on my work without any distractions!",
    "Having my own room was a game-changer for productivity."
];

// Double Room Reviews
const doubleReviews = [
    "I met my closest friend who helped me through the toughest of times!",
    "It was small, but it was enough",
    "My roommate was totally awesome. Can't deny that South is GOATED",
    "Don't expect to do work in your room - consider the library",
    "I got to meet so many people, and made a lot of friends"
];

// Review indices
let singleReviewIndex = 0;
let doubleReviewIndex = 0;

// DOM Elements
const singleReviewElement = document.querySelector('.review-slide:nth-of-type(1) #review-text');
const doubleReviewElement = document.querySelector('.review-slide:nth-of-type(2) #review-text');
const singleReviewNextButton = document.querySelector('.review-slide:nth-of-type(1) .next-button');
const doubleReviewNextButton = document.querySelector('.review-slide:nth-of-type(2) .next-button');

// Function to update single reviews
function updateSingleReviewText() {
    gsap.to(singleReviewElement, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            // Update text and index
            singleReviewIndex = (singleReviewIndex + 1) % reviews.length;
            singleReviewElement.textContent = reviews[singleReviewIndex];
            gsap.fromTo(
                singleReviewElement,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 }
            );
        }
    });
}

// Function to update double reviews
function updateDoubleReviewText() {
    gsap.to(doubleReviewElement, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            // Update text and index
            doubleReviewIndex = (doubleReviewIndex + 1) % doubleReviews.length;
            doubleReviewElement.textContent = doubleReviews[doubleReviewIndex];
            gsap.fromTo(
                doubleReviewElement,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1 }
            );
        }
    });
}

// Event Listeners
singleReviewNextButton.addEventListener('click', updateSingleReviewText);
doubleReviewNextButton.addEventListener('click', updateDoubleReviewText);




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


parameters.backgroundColor = '#1e1a20'; // Default background color

gui.addColor(parameters, 'backgroundColor').onChange(() => {
    scene.background = new THREE.Color(parameters.backgroundColor);
});

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
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

