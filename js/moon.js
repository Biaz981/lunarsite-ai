// ============================================================
// LunarSite AI - 3D Moon Engine
// ============================================================

let scene, camera, renderer, controls, moon, moonMaterial;

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000004);

    camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 2000);
    camera.position.set(0, 3, 14);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 30;
    controls.enablePan = false;

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(10, 4, 8);
    scene.add(sun);

    createStars();
    createMoon();
}

function createStars() {
    const geo = new THREE.BufferGeometry();
    const count = 8000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
        const r = 300 + Math.random() * 400;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(Math.random() * 2 - 1);
        pos[i]     = r * Math.sin(p) * Math.cos(t);
        pos[i + 1] = r * Math.sin(p) * Math.sin(t);
        pos[i + 2] = r * Math.cos(p);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.85 })));
}

function createMoon() {
    const geo = new THREE.SphereGeometry(5, 128, 128);
    const loader = new THREE.TextureLoader();
    const colorMap = loader.load('textures/moon_color.jpg',
        undefined, undefined, () => console.warn('moon_color.jpg missing'));
    const dispMap = loader.load('textures/moon_displacement.jpg',
        undefined, undefined, () => console.warn('moon_displacement.jpg missing'));

    moonMaterial = new THREE.MeshStandardMaterial({
        map: colorMap, displacementMap: dispMap,
        displacementScale: 0.06, roughness: 0.95, metalness: 0.0
    });

    moon = new THREE.Mesh(geo, moonMaterial);
    moon.rotation.y = Math.PI;
    scene.add(moon);

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(5.15, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0x4a9eff, transparent: true, opacity: 0.04, side: THREE.BackSide
        })
    );
    scene.add(glow);
}

function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
         radius * Math.cos(phi),
         radius * Math.sin(phi) * Math.sin(theta)
    );
}