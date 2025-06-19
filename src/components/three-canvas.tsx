
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRefs = useRef<THREE.Group[]>([]); // Changed to store multiple models
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
    camera.position.z = 7; // Adjusted camera position for wider view of multiple models
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Adjusted light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.0); // Adjusted light
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7); // Adjusted light
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const createFallbackModels = () => {
      const numFallbackModels = 5;
      const localModels: THREE.Group[] = [];
      for (let i = 0; i < numFallbackModels; i++) {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // Smaller fallback cubes
        const material = new THREE.MeshStandardMaterial({
          color: 0xBF00FF,
          metalness: 0.5,
          roughness: 0.5,
        });
        const fallbackCube = new THREE.Mesh(geometry, material) as unknown as THREE.Group; // Cast for simplicity
        fallbackCube.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8 - 3
        );
        fallbackCube.userData = {
          rotationSpeedY: 0.001 + Math.random() * 0.002,
          rotationSpeedX: 0.0005 + Math.random() * 0.001,
          bobSpeed: 0.0001 + Math.random() * 0.0002,
          bobOffset: Math.random() * Math.PI * 2,
        };
        scene.add(fallbackCube);
        localModels.push(fallbackCube);
      }
      modelRefs.current = localModels;
    };

    const loader = new GLTFLoader();
    loader.load(
      '/models/floating-model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;
        const numClones = 5; // Number of additional models
        const localModels: THREE.Group[] = [];

        // Main model (can be slightly different or just the first clone)
        const mainModel = loadedModel.clone();
        mainModel.scale.set(1.2, 1.2, 1.2); // Original scale, or slightly larger central piece
        mainModel.position.set(0, -0.5, 0); 
         mainModel.userData = {
          rotationSpeedY: 0.002,
          rotationSpeedX: 0.001,
          bobSpeed: 0.00015,
          bobOffset: Math.random() * Math.PI * 2,
        };
        scene.add(mainModel);
        localModels.push(mainModel);


        for (let i = 0; i < numClones; i++) {
          const clone = loadedModel.clone();
          clone.scale.set(0.4 + Math.random() * 0.4, 0.4 + Math.random() * 0.4, 0.4 + Math.random() * 0.4); // Random small scales
          clone.position.set(
            (Math.random() - 0.5) * 15, // Spread them out more
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10 - 5 // Position them around Z-axis
          );
          clone.userData = { // Store custom data for animation
            rotationSpeedY: 0.0005 + Math.random() * 0.0015,
            rotationSpeedX: 0.0002 + Math.random() * 0.0008,
            bobSpeed: 0.00005 + Math.random() * 0.0001, // Slower bobbing for background
            bobOffset: Math.random() * Math.PI * 2,
          };
          scene.add(clone);
          localModels.push(clone);
        }
        modelRefs.current = localModels;
      },
      undefined,
      (error) => {
        console.error('An error happened loading the GLB model:', error);
        createFallbackModels(); // Create fallback cubes if GLB fails
      }
    );

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const time = Date.now();
      
      if (modelRefs.current && modelRefs.current.length > 0) {
        modelRefs.current.forEach((model, index) => {
          if (model && model.userData) {
            model.rotation.y += model.userData.rotationSpeedY || 0.001;
            
            const scrollFactor = scrollYRef.current * 0.0002;
            model.rotation.x = (model.userData.baseRotationX || 0) + scrollFactor + (model.userData.rotationSpeedX || 0.0005) * Math.sin(time * 0.0005 + index);
            
            // Bobbing effect
            model.position.y = (model.userData.basePositionY || model.position.y) + Math.sin(time * (model.userData.bobSpeed || 0.0001) + model.userData.bobOffset) * 0.2;
          }
        });
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
    handleResize(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement?.parentNode === mountRef.current) {
         mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      
      modelRefs.current.forEach(model => {
        scene.remove(model);
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
              object.geometry?.dispose();
              if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
              } else {
                  object.material?.dispose();
              }
          }
        });
      });
      modelRefs.current = [];
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-60 pointer-events-none" />;
};

export default ThreeCanvas;
