
"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group>();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Store scrollY in a ref to avoid re-running useEffect on scroll
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent background

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // Adjusted camera position slightly
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Improve sharpness on high DPI screens
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Slightly increased ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2); // Slightly increased point light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Add a hemisphere light for softer, more natural lighting for GLB models
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);


    const loader = new GLTFLoader();
    loader.load(
      '/models/floating-model.glb', // User needs to place their model here
      (gltf) => {
        const loadedModel = gltf.scene;
        loadedModel.scale.set(1.5, 1.5, 1.5); // Adjust scale as needed
        loadedModel.position.y = -0.5; // Adjust position as needed
        scene.add(loadedModel);
        modelRef.current = loadedModel;
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error('An error happened loading the GLB model:', error);
        // Fallback to a simple cube if model loading fails
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({
          color: 0xBF00FF, // Electric Purple
          metalness: 0.5,
          roughness: 0.5,
        });
        const fallbackCube = new THREE.Mesh(geometry, material);
        scene.add(fallbackCube);
        modelRef.current = fallbackCube;
      }
    );

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.003; // Slower base rotation
        
        // Scroll-based animation
        const scrollFactor = 1 + scrollYRef.current / 500;
        modelRef.current.rotation.x = 0.2 + scrollYRef.current * 0.0005; // Tilt based on scroll
        modelRef.current.rotation.y += 0.001 * scrollFactor * 0.5; // Additional yaw based on scroll
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

    handleResize(); // Initial call to set size

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
      // Dispose geometries and materials if they were created directly (e.g., fallback cube)
      if (modelRef.current && !(modelRef.current.children.length > 0 && modelRef.current.children[0].type === "Group")) { // crude check for non-gltf
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
      modelRef.current = undefined;
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-60 pointer-events-none" />;
};

export default ThreeCanvas;
