import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Home = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Posicionar la cámara
        camera.position.set(0, 5, 20);

        // Añadir luces a la escena
        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Luz ambiental con mayor intensidad
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional
        directionalLight1.position.set(5, 10, 7.5);
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional adicional
        directionalLight2.position.set(-5, -10, -7.5);
        scene.add(directionalLight2);

        const pointLight = new THREE.PointLight(0xffffff, 1); // Luz puntual cerca del satélite
        pointLight.position.set(0, 5, 10);
        scene.add(pointLight);

        // Cargar el modelo GLB del satélite
        const loader = new GLTFLoader();
        loader.load('/textures/space_satellite.glb', (gltf) => {
            const satellite = gltf.scene;
            satellite.position.set(0, 0, 0); // Posición centrada
            satellite.scale.set(3, 3, 3); // Ajustar la escala del modelo 
            scene.add(satellite);
        }, undefined, (error) => {
            console.error('Error loading the model', error);
        });

        // Cargar el fondo
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('/textures/space_px.jpeg', (texture) => {
            scene.background = texture;
        });

        // Agregar controles OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
        };
    }, []);

    const handleLookClick = () => {
        // Lógica para la animación impresionante
        console.log('Mirar');
        navigate('/solar-system');
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="home-container">
            <canvas ref={canvasRef}></canvas>
            <div className="button-container">
                <button className="space-button" onClick={handleLookClick}>Mirar</button>
                <button className="space-button" onClick={handleBackClick}>Volver</button>
            </div>
        </div>
    );
};

export default Home;