
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const scrollYRef = useRef(0);
  const cubesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
    pointLight.position.set(0, 0, 10); // Positioned to light the front of the cubes
    scene.add(pointLight);
    
    cubesRef.current = []; 
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Cube 1: Scales up, drifts one way
    const material1 = new THREE.MeshStandardMaterial({ 
      color: 0xBF00FF, // Electric purple (accent)
      metalness: 0.3,
      roughness: 0.5,
    });
    const cube1 = new THREE.Mesh(cubeGeometry, material1);
    cube1.position.set(-1.5, 0.5, 0);
    cube1.userData = {
      baseScale: 0.8,
      baseX: -1.5,
      baseY: 0.5,
      rotationSpeedY: 0.005,
      scaleScrollFactor: 0.0003, // Scales up
      driftXScrollFactor: 0.0002,
      driftYScrollFactor: -0.00015,
    };
    scene.add(cube1);
    cubesRef.current.push(cube1);

    // Cube 2: Scales down, drifts another way
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x4B0082, // Deep Indigo (primary)
      metalness: 0.4,
      roughness: 0.6,
    });
    const cube2 = new THREE.Mesh(cubeGeometry, material2);
    cube2.position.set(1.5, -0.5, -1); // Slightly further back
    cube2.userData = {
      baseScale: 1.0,
      baseX: 1.5,
      baseY: -0.5,
      rotationSpeedX: 0.003,
      rotationSpeedY: 0.002,
      scaleScrollFactor: -0.00025, // Scales down
      minScale: 0.2, // Minimum scale
      driftXScrollFactor: -0.00015,
      driftYScrollFactor: 0.0002,
    };
    scene.add(cube2);
    cubesRef.current.push(cube2);

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const scrollEffect = scrollYRef.current;
      
      cubesRef.current.forEach((cube) => {
        const { userData } = cube;

        // Base rotation
        if (userData.rotationSpeedX) cube.rotation.x += userData.rotationSpeedX;
        if (userData.rotationSpeedY) cube.rotation.y += userData.rotationSpeedY;
        
        // Scroll-based scaling (Depth Parallax)
        let newScale = userData.baseScale + scrollEffect * userData.scaleScrollFactor;
        if (userData.minScale !== undefined) {
          newScale = Math.max(userData.minScale, newScale);
        }
        newScale = Math.max(0.01, newScale); // Ensure scale is always positive
        cube.scale.set(newScale, newScale, newScale);

        // Scroll-based axis drift
        cube.position.x = userData.baseX + scrollEffect * userData.driftXScrollFactor;
        cube.position.y = userData.baseY + scrollEffect * userData.driftYScrollFactor;
      });

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
    handleResize(); // Call once to set initial size

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (sceneRef.current) {
        cubesRef.current.forEach(cube => {
          sceneRef.current?.remove(cube);
          cube.geometry?.dispose();
          if (Array.isArray(cube.material)) {
            cube.material.forEach(material => material.dispose());
          } else {
            cube.material?.dispose();
          }
        });
      }
      cubesRef.current = [];
      
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
