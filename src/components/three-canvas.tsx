
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null); // Single model reference
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // Adjusted for a single prominent model
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Slightly increased intensity
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100); // Increased intensity
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-5, 5, 5);
    scene.add(directionalLight);
    

    const createFallbackModel = () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1); // A single, larger cube
      const material = new THREE.MeshStandardMaterial({ 
        color: 0xBF00FF, // Electric purple
        metalness: 0.5,
        roughness: 0.5,
      });
      const cube = new THREE.Mesh(geometry, material) as unknown as THREE.Group;
      cube.position.set(0, 0, 0); // Centered
      cube.userData = {
        baseRotationX: 0,
        baseRotationY: 0,
        rotationSpeedY: 0.001,
        rotationSpeedX: 0.0005,
        scrollIntensity: 0.0003,
      };
      scene.add(cube);
      modelRef.current = cube;
    };

    const loader = new GLTFLoader();
    loader.load(
      '/models/floating-model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed for your model
        loadedModel.position.set(0, 0, 0);   // Center the model
        
        // Traverse and ensure materials are suitable for lighting
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // You might want to adjust material properties here if needed
            // For example, ensuring castShadow and receiveShadow are set
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              // mesh.material.metalness = Math.max(0.1, mesh.material.metalness);
              // mesh.material.roughness = Math.min(0.9, mesh.material.roughness);
            }
          }
        });

        loadedModel.userData = {
          baseRotationX: loadedModel.rotation.x,
          baseRotationY: loadedModel.rotation.y,
          rotationSpeedY: 0.001, // Slower base rotation
          rotationSpeedX: 0.0005,
          scrollIntensity: 0.0003, // How much scroll affects rotation
        };
        scene.add(loadedModel);
        modelRef.current = loadedModel;
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error('An error happened loading the GLB model (using fallback):', error);
        createFallbackModel(); // Create fallback if GLB fails
      }
    );

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      if (modelRef.current && modelRef.current.userData) {
        const model = modelRef.current;
        model.rotation.y += model.userData.rotationSpeedY || 0.001;
        
        // Scroll-based rotation for a bit more interactivity
        const scrollRotation = scrollYRef.current * (model.userData.scrollIntensity || 0.0003);
        model.rotation.x = (model.userData.baseRotationX || 0) + scrollRotation;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
              object.geometry?.dispose();
              if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
              } else {
                  object.material?.dispose();
              }
          }
        });
      }
      modelRef.current = null;
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null; // Help GC
      cameraRef.current = null; // Help GC
      rendererRef.current = null; // Help GC
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-60 pointer-events-none" />;
};

export default ThreeCanvas;
