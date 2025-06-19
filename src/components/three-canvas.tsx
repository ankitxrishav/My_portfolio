
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
    camera.position.z = 7; // Adjusted for multiple cubes
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 150);
    pointLight.position.set(5, 5, 10);
    scene.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-5, 5, 5);
    scene.add(directionalLight);
    
    // Create three cubes
    cubesRef.current = []; // Clear previous cubes if any

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Cube 1: Main accent color, rotates on Y and scroll
    const material1 = new THREE.MeshStandardMaterial({ 
      color: 0xBF00FF, // Electric purple
      metalness: 0.4,
      roughness: 0.6,
    });
    const cube1 = new THREE.Mesh(cubeGeometry, material1);
    cube1.position.set(-2.5, 0, 0);
    cube1.userData = {
      rotationSpeedX: 0.0005,
      rotationSpeedY: 0.001,
      scrollIntensity: 0.0003,
      baseRotationX: 0,
      baseRotationY: 0,
    };
    scene.add(cube1);
    cubesRef.current.push(cube1);

    // Cube 2: Different color, rotates on X & Z, different scroll reaction
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x4B0082, // Indigo
      metalness: 0.3,
      roughness: 0.7,
      wireframe: false,
    });
    const cube2 = new THREE.Mesh(cubeGeometry, material2);
    cube2.position.set(2.5, 0, -1);
    cube2.scale.set(0.8, 0.8, 0.8);
    cube2.userData = {
      rotationSpeedX: 0.0015,
      rotationSpeedZ: 0.0008,
      scrollIntensity: 0.0001, // Slower scroll reaction for rotation
      bobSpeed: 0.002,
      bobRange: 0.2,
      baseY: cube2.position.y,
      baseRotationX: 0.1,
      baseRotationZ: 0.2,
    };
    scene.add(cube2);
    cubesRef.current.push(cube2);

    // Cube 3: Wireframe, different color, bobs and rotates, different scroll reaction
    const material3 = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const cube3 = new THREE.Mesh(cubeGeometry, material3);
    cube3.position.set(0, 1.5, -2);
    cube3.scale.set(0.6, 0.6, 0.6);
    cube3.userData = {
      rotationSpeedY: -0.0012, // Rotates opposite direction
      scrollIntensityScale: 0.00005, // Scroll affects scale
      baseScale: 0.6,
      baseRotationY: 0,
    };
    scene.add(cube3);
    cubesRef.current.push(cube3);


    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    let time = 0;
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      time += 0.01;
      
      cubesRef.current.forEach((cube, index) => {
        const { userData } = cube;
        const scrollEffect = scrollYRef.current;

        if (index === 0) { // Cube 1
          cube.rotation.y += userData.rotationSpeedY || 0;
          cube.rotation.x = (userData.baseRotationX || 0) + scrollEffect * (userData.scrollIntensity || 0);
        } else if (index === 1) { // Cube 2
          cube.rotation.x += userData.rotationSpeedX || 0;
          cube.rotation.z += userData.rotationSpeedZ || 0;
          cube.position.y = (userData.baseY || 0) + Math.sin(time * (userData.bobSpeed || 1) * (index + 1) * 2) * (userData.bobRange || 0.1);
          cube.rotation.x = (userData.baseRotationX || 0) + scrollEffect * (userData.scrollIntensity || 0);
        } else if (index === 2) { // Cube 3
          cube.rotation.y += userData.rotationSpeedY || 0;
          const newScale = Math.max(0.2, (userData.baseScale || 0.6) + scrollEffect * (userData.scrollIntensityScale || 0));
          cube.scale.set(newScale, newScale, newScale);
        }
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
    handleResize();

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
