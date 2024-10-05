import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Habilitar controles de órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Habilitar amortiguación (inercia)
        controls.dampingFactor = 0.25;
        controls.enableZoom = true; // Habilitar zoom con la rueda del ratón

        // Crear el fondo del espacio exterior
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            '/textures/space_px.jpeg',
        ]);
        scene.background = texture;

        // Crear el sol con textura
        const sunGeometry = new THREE.SphereGeometry(1, 16, 16); // Geometría simplificada
        const sunTextureLoader = new THREE.TextureLoader().load('/textures/2k_sun.jpg');
        const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTextureLoader });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Crear los planetas con texturas
        const planets = [];
        const planetData = [
            { size: 0.2, texture: '/textures/2k_mercury.jpg', distanceX: 3, distanceZ: 2, speed: 0.02, angle: 0, moons: [] },
            { size: 0.3, texture: '/textures/2k_venus_surface.jpg', distanceX: 5, distanceZ: 3, speed: 0.015, angle: 45, moons: [] },
            { size: 0.4, texture: '/textures/2k_earth_daymap.jpg', distanceX: 7, distanceZ: 4, speed: 0.01, angle: 90, moons: [{ size: 0.05, distance: 0.5 }] },
            { size: 0.5, texture: '/textures/2k_mars.jpg', distanceX: 9, distanceZ: 5, speed: 0.008, angle: 135, moons: [{ size: 0.05, distance: 0.5 }, { size: 0.03, distance: 0.7 }] },
            { size: 0.6, texture: '/textures/2k_jupiter.jpg', distanceX: 12, distanceZ: 6, speed: 0.005, angle: 180, moons: [{ size: 0.1, distance: 1 }, { size: 0.08, distance: 1.2 }] },
            { size: 0.7, texture: '/textures/2k_saturn.jpg', distanceX: 15, distanceZ: 7, speed: 0.004, angle: 225, moons: [{ size: 0.1, distance: 1 }, { size: 0.08, distance: 1.2 }] },
            { size: 0.8, texture: '/textures/2k_uranus.jpg', distanceX: 18, distanceZ: 8, speed: 0.003, angle: 270, moons: [{ size: 0.05, distance: 0.5 }] },
            { size: 0.9, texture: '/textures/2k_neptune.jpg', distanceX: 21, distanceZ: 9, speed: 0.002, angle: 315, moons: [{ size: 0.05, distance: 0.5 }] },
        ];

        planetData.forEach(data => {
            const geometry = new THREE.SphereGeometry(data.size, 16, 16); // Geometría simplificada
            const texture = new THREE.TextureLoader().load(data.texture);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const planet = new THREE.Mesh(geometry, material);
            planet.position.x = data.distanceX;
            planet.position.z = data.distanceZ;
            scene.add(planet);

            // Agregar lunas
            const moons = [];
            data.moons.forEach(moonData => {
                const moonGeometry = new THREE.SphereGeometry(moonData.size, 16, 16); // Geometría simplificada
                const moonTextureLoader = new THREE.TextureLoader().load('/textures/4k_eris_fictional.jpg');
                const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTextureLoader });
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                moon.position.x = moonData.distance;
                planet.add(moon);
                moons.push({ mesh: moon, distance: moonData.distance, angle: 0 });
            });

            planets.push({ mesh: planet, distanceX: data.distanceX, distanceZ: data.distanceZ, speed: data.speed, angle: data.angle, moons });

            // Agregar anillos de órbita elípticos
            const curve = new THREE.EllipseCurve(
                0, 0,            // ax, aY
                data.distanceX, data.distanceZ,           // xRadius, yRadius
                0, 2 * Math.PI,  // aStartAngle, aEndAngle
                false,            // aClockwise
                0                 // aRotation
            );

            const points = curve.getPoints(50);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);
        });

        // Agregar anillos a Saturno
        const saturn = planets.find(planet => planet.mesh.material.map && planet.mesh.material.map.image && planet.mesh.material.map.image.src.includes('saturn'));
        if (saturn) {
            const ringGeometry = new THREE.RingGeometry(0.8, 1.2, 32); // Geometría simplificada
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            saturn.mesh.add(ring);
        }

        // Agregar anillos a Júpiter
        const jupiter = planets.find(planet => planet.mesh.material.map && planet.mesh.material.map.image && planet.mesh.material.map.image.src.includes('jupiter'));
        if (jupiter) {
            const ringGeometry = new THREE.RingGeometry(0.7, 1.2, 32); // Geometría simplificada
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            jupiter.mesh.add(ring);
        }

        camera.position.z = 30;

        const animate = () => {
            requestAnimationFrame(animate);
            planets.forEach(planet => {
                planet.angle += planet.speed;
                planet.mesh.position.x = planet.distanceX * Math.cos(planet.angle);
                planet.mesh.position.z = planet.distanceZ * Math.sin(planet.angle);

                // Animar lunas
                planet.moons.forEach(moon => {
                    moon.angle += 0.05;
                    moon.mesh.position.x = moon.distance * Math.cos(moon.angle);
                    moon.mesh.position.z = moon.distance * Math.sin(moon.angle);
                });
            });
            controls.update(); // Actualizar controles de órbita
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="solar-system-container">
            <canvas ref={canvasRef}></canvas>
            <button className="space-button back-button" onClick={handleBackClick}>Volver</button>
        </div>
    );
};

export default SolarSystem;
