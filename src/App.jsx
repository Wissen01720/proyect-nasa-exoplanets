import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import * as THREE from 'three';
import './index.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import process from 'process';

const Home = () => {
    return (
        <div>
            <h1>Bienvenido a la Exploración de Exoplanetas</h1>
            <p>Por favor, inicie sesión para desbloquear el menú de navegación.</p>
            <Link to="/telescope">Ver a través del telescopio</Link>
        </div>
    );
};

const Telescope = () => {
    const canvasRef = useRef(null);  // Crear referencia para el canvas

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.minDistance = 10;
        controls.maxDistance = 2000;

        const loader = new THREE.TextureLoader();
        loader.load(process.env.PUBLIC_URL + '/textures/8k_stars_milky_way.jpg', function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
        });

        const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(process.env.PUBLIC_URL + '/textures/8k_sun.jpg')
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        const planetData = [
            { name: 'Mercury', radius: 2, orbitRadius: 50, speed: 0.01, texture: process.env.PUBLIC_URL + '/textures/8k_mercury.jpg' },
            { name: 'Venus', radius: 3, orbitRadius: 70, speed: 0.008, texture: process.env.PUBLIC_URL + '/textures/4k_venus_atmosphere.jpg' },
            { name: 'Earth', radius: 3.5, orbitRadius: 100, speed: 0.007, texture: process.env.PUBLIC_URL + '/textures/8k_earth_daymap.jpg' },
            { name: 'Mars', radius: 2.5, orbitRadius: 150, speed: 0.006, texture: process.env.PUBLIC_URL + '/textures/8k_mars.jpg' },
            { name: 'Jupiter', radius: 6, orbitRadius: 200, speed: 0.005, texture: process.env.PUBLIC_URL + '/textures/8k_jupiter.jpg' },
            { name: 'Saturn', radius: 5, orbitRadius: 300, speed: 0.004, texture: process.env.PUBLIC_URL + '/textures/8k_saturn.jpg' },
            { name: 'Uranus', radius: 4, orbitRadius: 400, speed: 0.003, texture: process.env.PUBLIC_URL + '/textures/2k_uranus.jpg' },
            { name: 'Neptune', radius: 4, orbitRadius: 500, speed: 0.002, texture: process.env.PUBLIC_URL + '/textures/2k_neptune.jpg' }
        ];

        const planetOrbits = [];

        function createPlanet(data) {
            const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(data.texture)
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);

            const orbit = {
                mesh: planet,
                angle: Math.random() * Math.PI * 2,
                radius: data.orbitRadius,
                speed: data.speed
            };

            planet.position.set(
                orbit.radius * Math.cos(orbit.angle),
                0,
                orbit.radius * Math.sin(orbit.angle)
            );

            planetOrbits.push(orbit);
            scene.add(planet);
            return orbit;
        }

        planetData.forEach(data => {
            createPlanet(data);
        });

        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(ambientLight);

        camera.position.set(0, 50, 2000);
        camera.lookAt(scene.position);

        const animate = function () {
            requestAnimationFrame(animate);
            scene.rotation.y += 0.001;

            planetOrbits.forEach(orbit => {
                orbit.angle += orbit.speed;
                orbit.mesh.position.set(
                    orbit.radius * Math.cos(orbit.angle),
                    0,
                    orbit.radius * Math.sin(orbit.angle)
                );
            });

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resizing event listener
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);  // Cleanup listener on unmount
        };
    }, []);

    return (
        <div>
            <Link to="/">Volver</Link>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

const Exoplanets = () => (
    <div>
        <h1>Exoplanetas</h1>
        <p>Información sobre exoplanetas.</p>
    </div>
);

const About = () => (
    <div>
        <h1>Acerca de</h1>
        <p>Información sobre el proyecto.</p>
    </div>
);

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    {isLoggedIn && <li><Link to="/exoplanets">Exoplanetas</Link></li>}
                    {isLoggedIn && <li><Link to="/about">Acerca de</Link></li>}
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/telescope" element={<Telescope />} />
                <Route path="/exoplanets" element={isLoggedIn ? <Exoplanets /> : <Navigate to="/" />} />
                <Route path="/about" element={isLoggedIn ? <About /> : <Navigate to="/" />} />
            </Routes>
            {!isLoggedIn && <button onClick={handleLogin}>Iniciar Sesión</button>}
        </Router>
    );
};

export default App;