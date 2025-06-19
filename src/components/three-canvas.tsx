
"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// Cube constants
const CUBE_SIZE = 0.6;
const CUBE_SPACING = 2.0;
const CUBE_INITIAL_Y = 0;
const CUBE_SCROLL_FACTOR = 0.003;

// Particle Sphere constants
const NUM_PARTICLES = 7000; // Increased for a denser sphere
const PARTICLE_SPHERE_BASE_RADIUS = 2.5; // Base radius of the sphere
const MIN_SPHERE_SCALE = 0.1; // Scale at the very top/bottom of the page
const MAX_SPHERE_SCALE = 1.2; // Max scale in the middle of the page
const PARTICLE_COLOR = 0xBF00FF; // Reverted to Electric Purple
const PARTICLE_OPACITY = 0.7;

// Camera constants
const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2; // How much the camera zooms in
const CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR = 1.0; // Scroll past 1 viewport height to activate zoom

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);
  
  const pointsRef = useRef<THREE.Points | null>(null); // For particle sphere
  const scrollRef = useRef(0); // Normalized scroll position (0 to 1)

  // Ref to store the scroll Y value at which camera zoom/particle sphere effects activate
  const cameraZoomActivationThresholdRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (!mountRef.current) return;

    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;
    
    // Update normalized scroll position
    scrollRef.current = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    
    // Update cube positions based on scroll
    if (cube1Ref.current && cube2Ref.current) {
      cube1Ref.current.position.y = CUBE_INITIAL_Y - scrollY * CUBE_SCROLL_FACTOR;
      cube2Ref.current.position.y = CUBE_INITIAL_Y + scrollY * CUBE_SCROLL_FACTOR * 0.8; // Slightly different scroll for parallax
    }

    // Update the threshold for camera zoom (e.g., after one full viewport scroll)
    cameraZoomActivationThresholdRef.current = winHeight * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
  }, []);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;
    sceneRef.current = new THREE.Scene();
    clockRef.current = new THREE.Clock();

    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current.position.z = CAMERA_INITIAL_Z;

    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // Cube 1
    const geometry1 = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, roughness: 0.5, metalness: 0.1 });
    cube1Ref.current = new THREE.Mesh(geometry1, material1);
    cube1Ref.current.position.x = -CUBE_SPACING / 2;
    cube1Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube1Ref.current);

    // Cube 2
    const geometry2 = new THREE.BoxGeometry(CUBE_SIZE * 0.8, CUBE_SIZE * 0.8, CUBE_SIZE * 0.8); // Slightly smaller
    const material2 = new THREE.MeshStandardMaterial({ color: 0x4D4DFF, roughness: 0.5, metalness: 0.1 });
    cube2Ref.current = new THREE.Mesh(geometry2, material2);
    cube2Ref.current.position.x = CUBE_SPACING / 2;
    cube2Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube2Ref.current);

    // Particle Sphere
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NUM_PARTICLES * 3);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Create points on the surface of a sphere
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;

      positions[i * 3] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = PARTICLE_SPHERE_BASE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: PARTICLE_COLOR,
      size: 0.025, // Small particle size
      transparent: true,
      opacity: PARTICLE_OPACITY,
      blending: THREE.AdditiveBlending, // For a glowing effect
      sizeAttenuation: true,
    });
    pointsRef.current = new THREE.Points(particleGeometry, particleMaterial);
    pointsRef.current.visible = true; // Always visible, scale driven by scroll
    sceneRef.current.add(pointsRef.current);
    
    // Initial scroll handler call to set positions
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!clockRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      const elapsedTime = clockRef.current.getDelta();
      const totalElapsedTime = clockRef.current.getElapsedTime();

      // Cube animations
      if (cube1Ref.current) {
        cube1Ref.current.rotation.x += elapsedTime * 0.1;
        cube1Ref.current.rotation.y += elapsedTime * 0.15;
      }
      if (cube2Ref.current) {
        cube2Ref.current.rotation.x -= elapsedTime * 0.12;
        cube2Ref.current.rotation.y -= elapsedTime * 0.08;
      }

      // Particle Sphere animation
      if (pointsRef.current) {
        // Scroll-driven scale: tiny at top/bottom, expanded in middle
        const normalizedScroll = scrollRef.current; // 0 at top, 1 at bottom
        let scaleFactor;
        if (normalizedScroll < 0.5) {
          // From MIN_SPHERE_SCALE to MAX_SPHERE_SCALE as scroll goes from 0 to 0.5
          scaleFactor = normalizedScroll * 2;
        } else {
          // From MAX_SPHERE_SCALE back to MIN_SPHERE_SCALE as scroll goes from 0.5 to 1
          scaleFactor = 1 - (normalizedScroll - 0.5) * 2;
        }
        // Clamp scaleFactor between 0 and 1 before applying to range
        scaleFactor = Math.max(0, Math.min(1, scaleFactor)); 
        
        const currentScale = MIN_SPHERE_SCALE + (MAX_SPHERE_SCALE - MIN_SPHERE_SCALE) * scaleFactor;
        
        // Continuous rotation
        pointsRef.current.rotation.y += elapsedTime * 0.05; 
        pointsRef.current.rotation.x += elapsedTime * 0.02;

        // Subtle pulsing effect based on total time, modulated by currentScale
        const pulse = (1 + Math.sin(totalElapsedTime * 1.0) * 0.03) * currentScale;
        pointsRef.current.scale.set(pulse, pulse, pulse);

        pointsRef.current.visible = true; // Ensure it's always visible
      }

      // Camera Zoom based on scroll (activates after a threshold)
      if (window.scrollY > cameraZoomActivationThresholdRef.current) {
          const scrollAfterActivation = Math.max(0, window.scrollY - cameraZoomActivationThresholdRef.current);
          // Define a range over which the zoom occurs, e.g., another viewport height
          const zoomScrollRange = window.innerHeight * 1.5; 
          const normalizedZoomScroll = Math.min(scrollAfterActivation / zoomScrollRange, 1); // 0 to 1
          cameraRef.current.position.z = CAMERA_INITIAL_Z - (normalizedZoomScroll * CAMERA_ZOOM_FACTOR);
      } else {
         // Reset camera Z if scrolled back above threshold, but only if it changed
         if (cameraRef.current.position.z !== CAMERA_INITIAL_Z) {
            cameraRef.current.position.z = CAMERA_INITIAL_Z;
            // cameraRef.current.lookAt(sceneRef.current.position); // Reset lookAt only if it changed context
          }
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        // Recalculate zoom activation threshold on resize
        cameraZoomActivationThresholdRef.current = window.innerHeight * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
        handleScroll(); // Re-evaluate scroll-dependent states
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      // Dispose of geometries and materials
      if (sceneRef.current) {
        if (cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if (cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
        if (pointsRef.current) sceneRef.current.remove(pointsRef.current);
      }

      cube1Ref.current?.geometry?.dispose();
      if (cube1Ref.current?.material) {
        (cube1Ref.current.material as THREE.Material).dispose();
      }
      cube2Ref.current?.geometry?.dispose();
      if (cube2Ref.current?.material) {
        (cube2Ref.current.material as THREE.Material).dispose();
      }
      pointsRef.current?.geometry?.dispose();
      if (pointsRef.current?.material) {
        (pointsRef.current.material as THREE.Material).dispose();
      }
      
      rendererRef.current?.dispose();
      // Check if domElement is still part of the mount before removing
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      // Nullify refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      clockRef.current = null;
      cube1Ref.current = null;
      cube2Ref.current = null;
      pointsRef.current = null;
    };
  }, [handleScroll]); // Added handleScroll to dependency array

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-80 pointer-events-none" />;
};

export default ThreeCanvas;
