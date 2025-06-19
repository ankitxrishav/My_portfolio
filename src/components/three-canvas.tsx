
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NUM_SPHERES = 3; // Reduced number of spheres
const SPHERE_RADIUS_MIN = 0.3; // Increased min radius for larger spheres
const SPHERE_RADIUS_MAX = 0.6; // Increased max radius for larger spheres
const SPHERE_SPEED_MIN = 0.03; // Increased min speed
const SPHERE_SPEED_MAX = 0.05; // Increased max speed

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

  const sphereRefs = useRef<THREE.Mesh[]>([]);
  const sphereData = useRef<{speed: number, initialY: number, initialZ: number}[]>([]); // Removed direction

  const lastScrollYRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);

  const spheresActiveRef = useRef(false);
  const scrollActivationThresholdRef = useRef(0); // Renamed for clarity


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
    
    clockRef.current = new THREE.Clock(); 

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Cubes
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    material1Ref.current = new THREE.MeshStandardMaterial({ 
      color: 0xD8BFD8, 
      metalness: 0.2,
      roughness: 0.6,
      emissive: 0xD8BFD8,
      emissiveIntensity: 0.05,
    });
    const cube1 = new THREE.Mesh(cubeGeometry, material1Ref.current);
    cube1.position.set(-2, 0, 0); 
    scene.add(cube1);
    cube1Ref.current = cube1;

    material2Ref.current = new THREE.MeshStandardMaterial({
      color: 0xB0C4DE, 
      metalness: 0.3,
      roughness: 0.5,
      emissive: 0xB0C4DE,
      emissiveIntensity: 0.05,
    });
    const cube2 = new THREE.Mesh(cubeGeometry, material2Ref.current);
    cube2.position.set(2, 0, -1); 
    scene.add(cube2);
    cube2Ref.current = cube2;

    // Spheres
    const sphereColors = [0xBF00FF, 0x8A2BE2, 0xADD8E6, 0xD8BFD8, 0xB0C4DE]; 
    const xBounds = 7; // For positioning and wrapping
    for (let i = 0; i < NUM_SPHERES; i++) {
      const radius = Math.random() * (SPHERE_RADIUS_MAX - SPHERE_RADIUS_MIN) + SPHERE_RADIUS_MIN;
      const geometry = new THREE.SphereGeometry(radius, 24, 24); // Increased segments for smoother large spheres
      const material = new THREE.MeshStandardMaterial({
        color: sphereColors[Math.floor(Math.random() * sphereColors.length)],
        metalness: 0.1,
        roughness: 0.7,
        emissive: 0x111111,
        emissiveIntensity: 0.1,
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      const initialY = (Math.random() - 0.5) * 8; 
      const initialZ = (Math.random() * -3) - 2; // Position them a bit further back
      sphere.position.set(
        -xBounds - Math.random() * 5, // Start off-screen to the left
        initialY,
        initialZ 
      );
      sphere.visible = false; // Initially invisible
      
      scene.add(sphere);
      sphereRefs.current.push(sphere);
      sphereData.current.push({
        speed: Math.random() * (SPHERE_SPEED_MAX - SPHERE_SPEED_MIN) + SPHERE_SPEED_MIN,
        initialY: initialY,
        initialZ: initialZ
      });
    }
    
    lastScrollYRef.current = window.scrollY;

    // Scroll handling for spheres activation
    scrollActivationThresholdRef.current = window.innerHeight * 1.5; // Activate spheres after 1.5x viewport height scrolled

    const handleScrollForSpheres = () => {
      if (window.scrollY > scrollActivationThresholdRef.current) {
        spheresActiveRef.current = true;
      } else {
        spheresActiveRef.current = false;
      }
    };
    window.addEventListener('scroll', handleScrollForSpheres, { passive: true });
    handleScrollForSpheres(); // Initial check

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current?.getDelta() || 0;

      // Cube Animations
      if (cube1Ref.current && cube2Ref.current && material1Ref.current && material2Ref.current) {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollYRef.current;
        const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
        const scrollProgress = maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0;

        cube1Ref.current.rotation.x += 0.03 * delta;
        cube1Ref.current.rotation.y += 0.05 * delta;
        cube2Ref.current.rotation.x -= 0.02 * delta;
        cube2Ref.current.rotation.y -= 0.04 * delta;

        const scrollRotationAmount = scrollDelta * 0.0025; 
        cube1Ref.current.rotation.y += scrollRotationAmount;
        cube1Ref.current.rotation.x += scrollRotationAmount * 0.5;
        cube2Ref.current.rotation.y -= scrollRotationAmount; 
        cube2Ref.current.rotation.z -= scrollRotationAmount * 0.5;

        const baseScale = 0.8;
        const scaleFactor = 1.5; 
        const scale1 = baseScale + scrollProgress * scaleFactor;
        const scale2 = baseScale + (1 - scrollProgress) * scaleFactor * 0.8; 
        cube1Ref.current.scale.set(scale1, scale1, scale1);
        cube2Ref.current.scale.set(Math.max(0.1, scale2), Math.max(0.1, scale2), Math.max(0.1, scale2));

        const driftRangeX = 3; 
        const driftRangeY = 2; 
        cube1Ref.current.position.x = -2 + scrollProgress * driftRangeX;
        cube1Ref.current.position.y = 0 + scrollProgress * driftRangeY;
        cube2Ref.current.position.x = 2 - scrollProgress * driftRangeX;
        cube2Ref.current.position.y = 0 - scrollProgress * driftRangeY * 0.7;

        const emissiveIntensity = 0.05 + scrollProgress * 0.35;
        material1Ref.current.emissiveIntensity = emissiveIntensity;
        material2Ref.current.emissiveIntensity = emissiveIntensity;
        
        lastScrollYRef.current = currentScrollY;
      }

      // Sphere Animations
      if (spheresActiveRef.current) {
        sphereRefs.current.forEach((sphere, i) => {
          sphere.visible = true;
          const data = sphereData.current[i];
          sphere.position.x += data.speed * delta * 60; // Move left to right
          sphere.position.y = data.initialY; 
          sphere.position.z = data.initialZ;

          // Horizontal wrapping (left to right)
          if (sphere.position.x > xBounds + SPHERE_RADIUS_MAX * 2) { // Give some buffer before reset
            sphere.position.x = -xBounds - SPHERE_RADIUS_MAX * 2 - Math.random() * 3; // Reset off-screen left
            // Optionally, could randomize Y and Z again here if desired for more variation on re-entry
            // sphere.position.y = (Math.random() - 0.5) * 8;
            // data.initialY = sphere.position.y;
          }
        });
      } else {
        sphereRefs.current.forEach((sphere, i) => {
          sphere.visible = false; // Hide spheres if not active
          // Optional: Reset their X position when they become inactive so they always "emerge" from left
          // sphere.position.x = -xBounds - SPHERE_RADIUS_MAX * 2 - Math.random() * 3;
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
        // Update threshold on resize as well, as viewport height might change
        scrollActivationThresholdRef.current = window.innerHeight * 1.5;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScrollForSpheres);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (sceneRef.current) {
        if(cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if(cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
        sphereRefs.current.forEach(sphere => sceneRef.current?.remove(sphere));
      }

      cube1Ref.current?.geometry?.dispose();
      material1Ref.current?.dispose();
      cube2Ref.current?.geometry?.dispose();
      material2Ref.current?.dispose();
      
      sphereRefs.current.forEach(sphere => {
        sphere.geometry.dispose();
        if (Array.isArray(sphere.material)) {
            sphere.material.forEach(m => m.dispose());
        } else {
            sphere.material.dispose();
        }
      });
      sphereRefs.current = [];
      sphereData.current = [];
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      clockRef.current = null; 
    };
  }, []);


  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-70 pointer-events-none" />;
};

export default ThreeCanvas;

    