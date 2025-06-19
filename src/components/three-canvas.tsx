
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Removed useScrollSection import

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);
  const material1Ref = useRef<THREE.MeshStandardMaterial | null>(null);
  const material2Ref = useRef<THREE.MeshStandardMaterial | null>(null);

  const lastScrollYRef = useRef(0);
  const clockRef = useRef(new THREE.Clock());

  // Removed activeSection from useScrollSection

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Slightly brighter ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    material1Ref.current = new THREE.MeshStandardMaterial({ 
      color: 0xBF00FF, // Accent color
      metalness: 0.3,
      roughness: 0.5,
      emissive: 0xBF00FF, // Start with emissive color
      emissiveIntensity: 0.1,
    });
    const cube1 = new THREE.Mesh(cubeGeometry, material1Ref.current);
    cube1.position.set(-2, 0, 0); // Initial positions
    scene.add(cube1);
    cube1Ref.current = cube1;

    material2Ref.current = new THREE.MeshStandardMaterial({
      color: 0x4B0082, // Primary color
      metalness: 0.4,
      roughness: 0.6,
      emissive: 0x4B0082, // Start with emissive color
      emissiveIntensity: 0.1,
    });
    const cube2 = new THREE.Mesh(cubeGeometry, material2Ref.current);
    cube2.position.set(2, 0, -1); // Initial positions
    scene.add(cube2);
    cube2Ref.current = cube2;
    
    lastScrollYRef.current = window.scrollY;
    clockRef.current = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      // const elapsedTime = clockRef.current.getElapsedTime(); // Use if needed for non-scroll anims

      if (cube1Ref.current && cube2Ref.current && material1Ref.current && material2Ref.current) {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;

        // --- Animations based on scroll ---
        const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const scrollProgress = maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0;

        // 1. Rotation on Scroll (momentum-based)
        const rotationAmount = scrollDelta * 0.005; // Adjust factor for speed
        cube1Ref.current.rotation.y += rotationAmount;
        cube1Ref.current.rotation.x += rotationAmount * 0.5;
        cube2Ref.current.rotation.y -= rotationAmount; // Counter-clockwise
        cube2Ref.current.rotation.z -= rotationAmount * 0.5;

        // 2. Depth Parallax Movement (scaling)
        const baseScale = 0.8;
        const scaleFactor = 1.5; // How much it scales up/down
        const scale1 = baseScale + scrollProgress * scaleFactor;
        const scale2 = baseScale + (1 - scrollProgress) * scaleFactor * 0.8; // Cube 2 starts larger and shrinks
        
        cube1Ref.current.scale.set(scale1, scale1, scale1);
        cube2Ref.current.scale.set(Math.max(0.1, scale2), Math.max(0.1, scale2), Math.max(0.1, scale2)); // Min scale for cube2

        // 3. Axis Drift
        const driftRangeX = 3; // Max drift in X units
        const driftRangeY = 2; // Max drift in Y units
        
        // Cube 1 drifts from left-center towards right-top
        cube1Ref.current.position.x = -2 + scrollProgress * driftRangeX;
        cube1Ref.current.position.y = 0 + scrollProgress * driftRangeY;
        
        // Cube 2 drifts from right-center towards left-bottom
        cube2Ref.current.position.x = 2 - scrollProgress * driftRangeX;
        cube2Ref.current.position.y = 0 - scrollProgress * driftRangeY * 0.7;

        // 3. Color Shift (emissive glow change)
        const emissiveIntensity = 0.1 + scrollProgress * 0.6; // Glow increases with scroll
        material1Ref.current.emissiveIntensity = emissiveIntensity;
        material2Ref.current.emissiveIntensity = emissiveIntensity;
        
        lastScrollYRef.current = currentScrollY;
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
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (sceneRef.current) {
        if(cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if(cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
      }
      cube1Ref.current?.geometry?.dispose();
      material1Ref.current?.dispose();
      cube2Ref.current?.geometry?.dispose();
      material2Ref.current?.dispose();
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, []);


  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-70 pointer-events-none" />;
};

export default ThreeCanvas;
