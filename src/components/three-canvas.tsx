
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRefs = useRef<THREE.Group[]>([]);
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
    camera.position.z = 7;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);
    
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.7);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const createFallbackModels = () => {
      const numFallbackModels = 5;
      const localModels: THREE.Group[] = [];
      const geometries = [
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.ConeGeometry(0.2, 0.4, 16)
      ];
      for (let i = 0; i < numFallbackModels; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`), // Random vibrant color
          metalness: 0.3 + Math.random() * 0.4,
          roughness: 0.2 + Math.random() * 0.5,
        });
        const fallbackShape = new THREE.Mesh(geometry, material) as unknown as THREE.Group;
        fallbackShape.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8 - 3 
        );
        fallbackShape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        fallbackShape.userData = {
          baseRotationX: fallbackShape.rotation.x,
          basePositionY: fallbackShape.position.y,
          rotationSpeedY: 0.001 + Math.random() * 0.002,
          rotationSpeedX: 0.0005 + Math.random() * 0.001,
          bobSpeed: 0.0001 + Math.random() * 0.0002,
          bobOffset: Math.random() * Math.PI * 2,
        };
        scene.add(fallbackShape);
        localModels.push(fallbackShape);
      }
      modelRefs.current = localModels;
    };

    const loader = new GLTFLoader();
    loader.load(
      '/models/floating-model.glb',
      (gltf) => {
        const loadedModel = gltf.scene;
        const numClones = 5; 
        const localModels: THREE.Group[] = [];

        // Main model - slightly larger or central
        const mainModel = loadedModel.clone();
        mainModel.scale.set(1, 1, 1); 
        mainModel.position.set(0, 0, 0); 
        mainModel.userData = {
          baseRotationX: mainModel.rotation.x,
          basePositionY: mainModel.position.y,
          rotationSpeedY: 0.0015,
          rotationSpeedX: 0.0008,
          bobSpeed: 0.00012,
          bobOffset: Math.random() * Math.PI * 2,
        };
        scene.add(mainModel);
        localModels.push(mainModel);

        // Cloned smaller models
        for (let i = 0; i < numClones; i++) {
          const clone = loadedModel.clone();
          const scale = 0.3 + Math.random() * 0.4;
          clone.scale.set(scale, scale, scale);
          clone.position.set(
            (Math.random() - 0.5) * 15, 
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10 - 4 
          );
          clone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          clone.userData = {
            baseRotationX: clone.rotation.x,
            basePositionY: clone.position.y,
            rotationSpeedY: 0.0005 + Math.random() * 0.0015,
            rotationSpeedX: 0.0002 + Math.random() * 0.0008,
            bobSpeed: 0.00005 + Math.random() * 0.0001, 
            bobOffset: Math.random() * Math.PI * 2,
          };
          scene.add(clone);
          localModels.push(clone);
        }
        modelRefs.current = localModels;
      },
      undefined,
      (error) => {
        console.error('An error happened loading the GLB model (using fallback):', error);
        createFallbackModels();
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
            
            model.position.y = (model.userData.basePositionY || model.position.y) + Math.sin(time * (model.userData.bobSpeed || 0.0001) + model.userData.bobOffset) * 0.15;
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
      
      modelRefs.current.forEach(model => {
        if (sceneRef.current) sceneRef.current.remove(model);
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
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-60 pointer-events-none" />;
};

export default ThreeCanvas;
