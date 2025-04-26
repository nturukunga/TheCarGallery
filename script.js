const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    depth: true
});
renderer.sortObjects = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('model-container').appendChild(renderer.domElement);

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading: ' + url + ' (' + itemsLoaded + '/' + itemsTotal + ')');
    const progressElement = document.querySelector('.loading-progress');
    if (progressElement) {
        const progressPercent = Math.round((itemsLoaded / itemsTotal) * 100);
        progressElement.textContent = progressPercent + '%';
        console.log('Loading progress: ' + progressPercent + '%');
    }
};

loadingManager.onLoad = function() {
    console.log('Loading complete!');
    document.getElementById('loading-screen').style.display = 'none';
};

loadingManager.onError = function(url) {
    console.error('Error loading ' + url);
    alert('Error loading ' + url + '. Please try again later.');
    document.getElementById('loading-screen').style.display = 'none';
};

// Add global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error caught by window.onerror:', message, 'Source:', source, 'Line:', lineno, 'Column:', colno, 'Error object:', error);
    alert('An error occurred: ' + message);
    document.getElementById('loading-screen').style.display = 'none';
    return true;
};

const setupLighting = () => {
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5); // Increased intensity
    keyLight.position.set(-5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2); // Increased intensity
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00aaff, 0.8); // Increased intensity
    rimLight.position.set(5, 3, -5);
    scene.add(rimLight);

    const groundLight = new THREE.PointLight(0xff8800, 1.2); // Increased intensity
    groundLight.position.set(0, -0.5, 0);
    scene.add(groundLight);

    const headlight = new THREE.SpotLight(0xffffff, 1.8); // Increased intensity
    headlight.position.set(0, 0.5, 3);
    headlight.angle = Math.PI/6;
    headlight.penumbra = 0.5;
    scene.add(headlight);

    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.8);
    overheadLight.position.set(0, 10, 0);
    overheadLight.castShadow = true;
    scene.add(overheadLight);


    const frontLight = new THREE.SpotLight(0xffffff, 1.5);
    frontLight.position.set(0, 2, 6);
    frontLight.angle = Math.PI/4;
    frontLight.penumbra = 0.5;
    scene.add(frontLight);

    const flickerLight = new THREE.PointLight(0xffaa77, 1.5);
    flickerLight.position.set(0, 3, 0);
    scene.add(flickerLight);

    setInterval(() => {
        flickerLight.intensity = Math.random() * 0.5 + 1.2; 
    }, 100);


    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    scene.add(ambientLight);

    return { 
        keyLight, 
        fillLight, 
        rimLight, 
        groundLight, 
        headlight, 
        flickerLight, 
        overheadLight, 
        frontLight,
        ambientLight 
    };
};

const lights = setupLighting();

const carCatalog = {
    'murcielago': {
        model: 'models/2010_lamborghini_murcielago_lp_670-4_sv.glb',
        scale: 0.7,
        position: [0, 0, 0], 
        yOffset: 0,
        specs: {
            engine: "6.5L V12 Engine<br>670 HP @ 8000 RPM<br>487 lb-ft Torque",
            performance: "0-60 mph: 3.2s<br>Top Speed: 342 km/h<br>Weight: 1665 kg",
            dimensions: "Length: 4.7m<br>Width: 2.1m<br>Height: 1.1m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'carrera': {
        model: 'models/porsche_carrera_gt_concept_2000_replica.glb',
        scale: 0.9, 
        position: [0, 0, 0],
        yOffset: 0,
        useStandardFloor: true,
        specs: {
            engine: "5.7L V10 Engine<br>612 HP @ 8000 RPM<br>435 lb-ft Torque",
            performance: "0-60 mph: 3.5s<br>Top Speed: 330 km/h<br>Weight: 1380 kg",
            dimensions: "Length: 4.6m<br>Width: 1.9m<br>Height: 1.17m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'demon': {
        model: 'models/dodge_demon_hpe1200.glb',
        scale: 0.3, 
        position: [0, 0, 0],
        yOffset: 3, 
        rotationY: 0, 
        rotationX: -0.2, 
        specs: {
            engine: "6.2L HEMI V8 Supercharged<br>1200 HP @ 6500 RPM<br>1050 lb-ft Torque",
            performance: "0-60 mph: 2.3s<br>Top Speed: 320 km/h<br>Weight: 1900 kg",
            dimensions: "Length: 5.0m<br>Width: 1.97m<br>Height: 1.45m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'agera': {
        model: 'models/2011_koenigsegg_agera.glb',
        scale: 2.0, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "5.0L Twin-Turbo V8<br>1140 HP @ 7100 RPM<br>1000 lb-ft Torque",
            performance: "0-60 mph: 2.8s<br>Top Speed: 418 km/h<br>Weight: 1435 kg",
            dimensions: "Length: 4.29m<br>Width: 1.99m<br>Height: 1.12m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'cedric': {
        model: 'models/nissan_cedric.glb',
        scale: 2.9, 
        position: [0, 0, 0],
        yOffset: -0.5, 
        specs: {
            engine: "3.0L Inline-6<br>280 HP @ 6000 RPM<br>294 lb-ft Torque",
            performance: "0-60 mph: 6.5s<br>Top Speed: 240 km/h<br>Weight: 1550 kg",
            dimensions: "Length: 4.8m<br>Width: 1.78m<br>Height: 1.41m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'huayra': {
        model: 'models/pagani_huayra_r_gt2_2022.glb',
        scale: 0.7, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "6.0L Twin-Turbo V12<br>850 HP @ 8250 RPM<br>750 lb-ft Torque",
            performance: "0-60 mph: 2.6s<br>Top Speed: 380 km/h<br>Weight: 1280 kg",
            dimensions: "Length: 4.7m<br>Width: 2.03m<br>Height: 1.16m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'mclaren': {
        model: 'models/2017_mclaren_720s_lb.glb',
        scale: 6.0, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "4.0L Twin-Turbo V8<br>720 HP @ 7500 RPM<br>568 lb-ft Torque",
            performance: "0-60 mph: 2.7s<br>Top Speed: 341 km/h<br>Weight: 1419 kg",
            dimensions: "Length: 4.54m<br>Width: 1.93m<br>Height: 1.19m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'jaguar': {
        model: 'models/jaguar_c-x75_concept_2013.glb',
        scale: 5.0, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "1.6L Turbo + Electric Motors<br>778 HP Combined<br>700 lb-ft Torque",
            performance: "0-60 mph: 2.8s<br>Top Speed: 330 km/h<br>Weight: 1600 kg",
            dimensions: "Length: 4.63m<br>Width: 2.02m<br>Height: 1.04m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
   
    'slr': {
        model: 'models/2009_mercedes-benz_slr_mclaren_722s_roadster.glb',
        scale: 5.0, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "5.4L Supercharged V8<br>650 HP @ 6500 RPM<br>605 lb-ft Torque",
            performance: "0-60 mph: 3.5s<br>Top Speed: 335 km/h<br>Weight: 1760 kg",
            dimensions: "Length: 4.66m<br>Width: 1.91m<br>Height: 1.26m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'vengeance': {
        model: 'models/2024_rezvani_vengeance.glb',
        scale: 1.0,
        position: [0, 0, 0],
        yOffset: -0.5, 
        specs: {
            engine: "6.2L Supercharged V8<br>682 HP @ 6000 RPM<br>653 lb-ft Torque",
            performance: "0-60 mph: 4.5s<br>Top Speed: 260 km/h<br>Weight: 2720 kg",
            dimensions: "Length: 5.12m<br>Width: 2.03m<br>Height: 1.97m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'vulcan': {
        model: 'models/aston_martin_vulcan.glb',
        scale: 1.5,
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "7.0L V12<br>820 HP @ 7750 RPM<br>575 lb-ft Torque",
            performance: "0-60 mph: 2.9s<br>Top Speed: 360 km/h<br>Weight: 1360 kg",
            dimensions: "Length: 4.80m<br>Width: 2.03m<br>Height: 1.18m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'cosmo': {
        model: 'models/mazda_cosmo_1967.glb',
        scale: 1.5,
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "0.98L Twin-Rotor<br>110 HP @ 7000 RPM<br>96 lb-ft Torque",
            performance: "0-60 mph: 8.7s<br>Top Speed: 185 km/h<br>Weight: 1070 kg",
            dimensions: "Length: 4.14m<br>Width: 1.68m<br>Height: 1.32m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'amg_one': {
        model: 'models/mercedes_amg_one.glb',
        scale: 1.2,
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "1.6L V6 Hybrid + Electric Motors<br>1063 HP Combined<br>884 lb-ft Torque",
            performance: "0-60 mph: 2.9s<br>Top Speed: 352 km/h<br>Weight: 1695 kg",
            dimensions: "Length: 4.56m<br>Width: 2.01m<br>Height: 1.12m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    },
    'reventon': {
        model: 'models/2010_lamborghini_reventon_roadster.glb',
        scale: 3.0, 
        position: [0, 0, 0],
        yOffset: 0,
        specs: {
            engine: "6.5L V12<br>650 HP @ 8000 RPM<br>487 lb-ft Torque",
            performance: "0-60 mph: 3.4s<br>Top Speed: 330 km/h<br>Weight: 1690 kg",
            dimensions: "Length: 4.70m<br>Width: 2.06m<br>Height: 1.14m"
        },
        polaroids: ['images/FAP.png', 'images/engine shot.jpg', 'images/IS.png']
    }
};

let currentCarModel = null;
let currentCar = 'carrera'; 
let currentEnvironment = null;
let currentShowroom = null;
let wireframeVisible = true;
let particlesVisible = true;
let defaultGrid = null;
let detailedGrid = null;
let standardFloor = null;

function createStandardFloor() {
    if (standardFloor) {
        scene.remove(standardFloor);
    }
    
    standardFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({
            color: 0x303030,
            roughness: 0.8,
            metalness: 0.2,
        })
    );
    standardFloor.rotation.x = -Math.PI/2;
    standardFloor.position.y = -0.01;
    standardFloor.receiveShadow = true;
    scene.add(standardFloor);
    
    return standardFloor;
}

function createGrids() {
    defaultGrid = new THREE.GridHelper(100, 20);
    defaultGrid.material.transparent = true;
    defaultGrid.material.opacity = 0.5;
    defaultGrid.renderOrder = 1;
    defaultGrid.material.depthTest = false;
    defaultGrid.position.y = 0;
    
    detailedGrid = new THREE.GridHelper(100, 100);
    detailedGrid.material.transparent = true;
    detailedGrid.material.opacity = 0.3;
    detailedGrid.renderOrder = 1;
    detailedGrid.material.depthTest = false;
    detailedGrid.visible = false;
    detailedGrid.position.y = 0;
    
    scene.add(defaultGrid);
    scene.add(detailedGrid);
    
    createStandardFloor();
}

function updateGrids() {
    if (wireframeVisible) {
        detailedGrid.visible = true;
    } else {
        detailedGrid.visible = false;
    }
}

function loadCarModel(modelKey) {
    document.getElementById('loading-screen').style.display = 'flex';
    const modelNameElement = document.querySelector('.loading-model-name');
    if (modelNameElement) {
        modelNameElement.textContent = 'Loading: ' + modelKey;
    }
    console.log('Loading car model: ' + modelKey);
    
    if (currentCarModel) {
        scene.remove(currentCarModel);
    }
    
    const carInfo = carCatalog[modelKey];
    if (!carInfo) {
        console.error('Car model not found:', modelKey);
        document.getElementById('loading-screen').style.display = 'none';
        return;
    }
    
    if (carInfo.useStandardFloor || modelKey === 'carrera') {
        if (standardFloor) scene.remove(standardFloor);
        createStandardFloor();
    }
    
    const engineSpec = document.querySelector('#spec-cards .spec-card:nth-child(2) p');
    const performanceSpec = document.querySelector('#spec-cards .spec-card:nth-child(3) p');
    const dimensionsSpec = document.querySelector('#spec-cards .spec-card:nth-child(4) p');
    
    if (engineSpec) engineSpec.innerHTML = carInfo.specs.engine;
    if (performanceSpec) performanceSpec.innerHTML = carInfo.specs.performance;
    if (dimensionsSpec) dimensionsSpec.innerHTML = carInfo.specs.dimensions;
    
    const polaroids = document.querySelectorAll('#left-polaroids .polaroid img');
    carInfo.polaroids.forEach((src, index) => {
        if (polaroids[index]) {
            polaroids[index].src = src;
        }
    });
    
    const loader = new THREE.GLTFLoader(loadingManager);
    
    console.log('Attempting to load: ' + carInfo.model);
    
    const loadTimeout = setTimeout(() => {
        console.error('Loading timeout for model: ' + carInfo.model);
        document.getElementById('loading-screen').style.display = 'none';
        alert('Loading timed out. Please try again or choose another model.');
    }, 30000); 
    
    loader.load(carInfo.model, 
    (gltf) => {
        clearTimeout(loadTimeout);
        const model = gltf.scene;
        
        model.scale.set(carInfo.scale, carInfo.scale, carInfo.scale);
        
        model.position.set(
            carInfo.position[0], 
            carInfo.position[1] + (carInfo.yOffset || 0), 
            carInfo.position[2]
        );
        
        if (carInfo.rotationY !== undefined) {
            model.rotation.y = carInfo.rotationY;
        }
        
        if (carInfo.rotationX !== undefined) {
            model.rotation.x = carInfo.rotationX;
        }
        
        const box = new THREE.Box3().setFromObject(model);
        const height = box.max.y - box.min.y;
        const lowestPoint = box.min.y;
        

        if (modelKey === 'demon') {
            model.position.y = carInfo.yOffset;
        } else if (modelKey === 'cedric') {
            model.position.y = carInfo.yOffset;
        } else if (modelKey !== 'mclaren') {
            model.position.y -= lowestPoint;
        }
        
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.metalness = 0.7;
                    child.material.roughness = 0.3;
                    child.material.envMapIntensity = 1.2;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                
                const wireframe = new THREE.LineSegments(
                    new THREE.EdgesGeometry(child.geometry),
                    new THREE.LineBasicMaterial({ 
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.6,
                        depthTest: true
                    })
                );
                wireframe.visible = wireframeVisible;
                child.add(wireframe);
            }
        });
        
        currentCarModel = model;
        scene.add(model);
        
        adjustCameraForCar(model);
        
        console.log('Model loaded successfully: ' + carInfo.model);
    }, 
    (xhr) => {
        if (xhr.lengthComputable) {
            const progressElement = document.querySelector('.loading-progress');
            if (progressElement) {
                const progressPercent = Math.round((xhr.loaded / xhr.total) * 100);
                progressElement.textContent = progressPercent + '%';
                console.log('Model loading progress: ' + progressPercent + '%');
            }
        } else {
            console.log('Loading progress not computable');
        }
    },
    (error) => {
        clearTimeout(loadTimeout);
        console.error('Error loading model:', error);
        document.getElementById('loading-screen').style.display = 'none';
        alert('Error loading model: ' + carInfo.model + '. Please try another car.');
    });
}

function adjustCameraForCar(carModel) {
    const box = new THREE.Box3().setFromObject(carModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    
    camera.position.set(center.x + cameraZ * 0.5, center.y + cameraZ * 0.1, center.z + cameraZ * 0.7);
    controls.target.set(center.x, center.y, center.z);
    controls.update();
}

const environments = {
    grid: () => {
        if (currentShowroom) {
            scene.remove(currentShowroom);
            currentShowroom = null;
        }
        
        if (!standardFloor) {
            createStandardFloor();
        }
        
        return null;
    },
    
    walls: () => {
        if (currentShowroom) {
            scene.remove(currentShowroom);
            currentShowroom = null;
        }
        
        const walls = new THREE.Group();
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x202030,
            metalness: 0.8,
            roughness: 0.5
        });
        
        ['front', 'back', 'left', 'right'].forEach((side, i) => {
            const wall = new THREE.Mesh(
                new THREE.BoxGeometry(120, 20, 1), 
                wallMaterial
            );
            wall.castShadow = true;
            wall.receiveShadow = true;
            wall.position.set(
                side === 'left' ? -60 : side === 'right' ? 60 : 0, 
                0,
                side === 'front' ? -60 : side === 'back' ? 60 : 0  
            );
            if(side === 'left' || side === 'right') wall.rotation.y = Math.PI/2;
            walls.add(wall);
        });
        
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(120, 120), 
            new THREE.MeshStandardMaterial({ 
                color: 0x101020,
                metalness: 0.5,
                roughness: 0.7
            })
        );
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -0.01; 
        floor.receiveShadow = true;
        walls.add(floor);
        
        scene.add(walls);
        return walls;
    },
    
    outdoor: () => {
        if (currentShowroom) {
            scene.remove(currentShowroom);
            currentShowroom = null;
        }
        
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.MeshStandardMaterial({ 
                color: 0x303030,
                roughness: 0.8
            })
        );
        floor.rotation.x = -Math.PI/2;
        floor.position.y = -0.01; // Slightly below the grid
        floor.receiveShadow = true;
        scene.add(floor);
        return floor;
    },
    
    // 3D showroom models
    showroom1: () => {
        return loadShowroomModel('showrooms/whiteroom 1.glb');
    },

    // Additional showrooms
    batcave: () => {
        return loadShowroomModel('showrooms/batcave.glb');
    },

    photoshoot: () => {
        return loadShowroomModel('showrooms/photoshoot.glb');
    }
};

// Function to load 3D showroom model
function loadShowroomModel(path) {
    return new Promise((resolve) => {
        const loader = new THREE.GLTFLoader(loadingManager);
        loader.load(path, (gltf) => {
            const showroom = gltf.scene;
            
            showroom.scale.set(5.0, 5.0, 5.0); 
            showroom.position.set(0, 0, 0);
            
            showroom.traverse((child) => {
                if (child.isMesh) {
                    if (child.material) {
                        if (child.material.color && (child.material.color.r > 0.8 && child.material.color.g > 0.8 && child.material.color.b > 0.8)) {
                            child.material.color.setRGB(0.7, 0.75, 0.85); 
                        }
                        
                        child.material.metalness = Math.min(child.material.metalness || 0, 0.5) + 0.2;
                        child.material.roughness = Math.max(child.material.roughness || 0, 0.3);
                        
                        // Add subtle ambient occlusion if not present
                        if (!child.material.aoMap) {
                            child.material.aoMapIntensity = 0.7;
                        }
                        
                        // Enhanced shadows and subtle emissive for edge detection
                        child.material.emissive = new THREE.Color(0x111122);
                        child.material.emissiveIntensity = 0.1;
                    }
                    
                    // Enable shadows
                    child.receiveShadow = true;
                    child.castShadow = true;
                    
                    if (wireframeVisible) {
                        const wireframe = new THREE.LineSegments(
                            new THREE.EdgesGeometry(child.geometry),
                            new THREE.LineBasicMaterial({ 
                                color: 0x00ffff,
                                transparent: true,
                                opacity: 0.3
                            })
                        );
                        wireframe.visible = wireframeVisible;
                        child.add(wireframe);
                    }
                }
            });
            
            scene.add(showroom);
            resolve(showroom);
        });
    });
}

function createParticleSystem() {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(2000 * 3);
    for(let i = 0; i < 6000; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x444444,
        transparent: true,
        opacity: 0.5,
        depthTest: false 
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.position.z = -5;
    scene.add(particleSystem);
    
    return particleSystem;
}

const particleSystem = createParticleSystem();

const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(3, 1, 4);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 30; 

// UI interactivity and timeout
let uiTimeout;
const uiElements = document.querySelectorAll('.polaroid, .spec-card');

controls.addEventListener('start', () => {
    uiElements.forEach(el => el.style.opacity = '0');
});

controls.addEventListener('end', () => {
    uiElements.forEach(el => el.style.opacity = '1');
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
        uiElements.forEach(el => el.style.opacity = '0.5');
    }, 3000);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (currentCarModel && !controls.enabled) {
        currentCarModel.rotation.y += 0.005;
    }
    
    if (particleSystem && particlesVisible) {
        particleSystem.rotation.y += 0.0005;
    }
    
    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', () => {
    createGrids();
    
    initUIControls();
    
    loadCarModel(currentCar);
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});

function initUIControls() {
    const carSelector = document.getElementById('car-selector');
    while (carSelector.firstChild) {
        carSelector.removeChild(carSelector.firstChild);
    }
    
    Object.keys(carCatalog).forEach(carKey => {
        const option = document.createElement('option');
        option.value = carKey;
        option.textContent = carKey.charAt(0).toUpperCase() + carKey.slice(1);
        carSelector.appendChild(option);
    });
    
    carSelector.addEventListener('change', (e) => {
        currentCar = e.target.value;
        loadCarModel(currentCar);
    });
    
    const roomSelect = document.getElementById('room-select');
    while (roomSelect.firstChild) {
        roomSelect.removeChild(roomSelect.firstChild);
    }
    
    const environmentOptions = {
        'grid': 'Basic Grid',
        'walls': 'Cyber Garage',
        'outdoor': 'Outdoor',
        'showroom1': 'White Room',
        'batcave': 'Batcave',
        'photoshoot': 'Photo Studio'
    };
    
    Object.entries(environmentOptions).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        roomSelect.appendChild(option);
    });
    
    roomSelect.addEventListener('change', async (e) => {
        const selectedEnv = e.target.value;
        
        if (currentEnvironment) {
            scene.remove(currentEnvironment);
            currentEnvironment = null;
        }
        
        if (currentShowroom) {
            scene.remove(currentShowroom);
            currentShowroom = null;
        }
        
        if (['showroom1', 'batcave', 'photoshoot'].includes(selectedEnv)) {
            currentShowroom = await environments[selectedEnv]();
            currentEnvironment = null;
        } else {
            currentEnvironment = environments[selectedEnv]();
        }
    });
    
    const wireframeButton = document.getElementById('wireframe-toggle');
    wireframeButton.innerHTML = '🌀 WIREFRAME ON';
    wireframeButton.addEventListener('click', () => {
        wireframeVisible = !wireframeVisible;
        scene.traverse(child => {
            if (child.isLineSegments) child.visible = wireframeVisible;
        });
        updateGrids();
        
        wireframeButton.textContent = wireframeVisible ? '🌀 WIREFRAME ON' : '🚫 WIREFRAME OFF';
    });
    
    const dustToggle = document.getElementById('dust-toggle');
    dustToggle.addEventListener('click', () => {
        particlesVisible = !particlesVisible;
        particleSystem.visible = particlesVisible;
        dustToggle.textContent = particlesVisible ? '🌌 DUST ON' : '🚫 DUST OFF';
    });
    
    const menuToggle = document.getElementById('menu-toggle');
    menuToggle.addEventListener('click', () => {
        const polaroids = document.getElementById('left-polaroids');
        polaroids.classList.toggle('active');
        
        if (polaroids.classList.contains('active')) {
            localStorage.setItem('polaroidsActive', 'true');
        } else {
            localStorage.setItem('polaroidsActive', 'false');
        }
    });
    
    const zoomSlider = document.getElementById('zoom-slider');
    zoomSlider.addEventListener('input', (e) => {
        const zoomValue = e.target.value;
        
        const direction = new THREE.Vector3();
        direction.subVectors(camera.position, controls.target);
        
        const currentDistance = direction.length();
        
        direction.normalize();
        
        const newDistance = 20 - (zoomValue / 100) * 15;
        
        camera.position.copy(controls.target).add(direction.multiplyScalar(newDistance));
        
        controls.update();
    });
    
    const music = document.getElementById('ambient-sound');
    if (music) {
        music.volume = 0.3;
        
        let musicStarted = false;    
        const startMusic = () => {
            if(!musicStarted) {
                music.play()
                    .then(() => musicStarted = true)
                    .catch(err => console.log('Music error:', err));
            }
        };
        
        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);
        
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if(music.paused) {
                    music.play();
                    musicToggle.textContent = '🔊 MUSIC ON';
                } else {
                    music.pause();
                    musicToggle.textContent = '🔇 MUSIC OFF';
                }
            });
        }
    }
    
    document.addEventListener('keydown', (e) => {
        if(e.ctrlKey && e.key === '+') {
            camera.fov *= 0.9;
            camera.updateProjectionMatrix();
            e.preventDefault();
        }
        if(e.ctrlKey && e.key === '-') {
            camera.fov *= 1.1;
            camera.updateProjectionMatrix();
            e.preventDefault();
        }
        
        if(e.key.toLowerCase() === 'm') {
            const musicBtn = document.getElementById('music-toggle');
            if (musicBtn) musicBtn.click();
        }
        
        if(e.key === ' ') {
            const envSelect = document.getElementById('room-select');
            const currentIndex = Array.from(envSelect.options).findIndex(opt => opt.selected);
            const nextIndex = (currentIndex + 1) % envSelect.options.length;
            envSelect.selectedIndex = nextIndex;
            envSelect.dispatchEvent(new Event('change'));
            e.preventDefault();
        }
        
        if(e.ctrlKey && e.key.toLowerCase() === 'w') {
            const wireframeBtn = document.getElementById('wireframe-toggle');
            wireframeBtn.click();
            e.preventDefault();
        }
    });
    
    const moveSpeed = 0.2;
    document.addEventListener('keydown', (e) => {
        const direction = new THREE.Vector3();
        
        switch(e.key.toLowerCase()) {
            case 'w': direction.z = -1; break;
            case 's': direction.z = 1; break;
            case 'a': direction.x = -1; break;
            case 'd': direction.x = 1; break;
        }
        
        if (direction.length() > 0) {
            camera.position.add(direction.multiplyScalar(moveSpeed));
            controls.target.add(direction.multiplyScalar(moveSpeed));
            controls.update();
        }
    });
} 