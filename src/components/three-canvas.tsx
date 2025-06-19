
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
const PARTICLE_SPHERE_BASE_RADIUS = 2.5; // Base radius for particle placement
const MIN_SPHERE_SCALE = 0.1; // Scale when "tiny"
const MAX_SPHERE_SCALE = 1.2; // Scale when "expanded"
const PARTICLE_COLOR = 0xBF00FF; // Theme accent color (Electric Purple)
const PARTICLE_OPACITY = 0.7;

// Camera constants
const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2; // How much the camera zooms in relation to the particle sphere
const CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR = 1.0; // Activate camera zoom after 1 page scroll

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  // Cube refs
  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);
  
  // Particle sphere refs
  const pointsRef = useRef<THREE.Points | null>(null);
  const scrollRef = useRef(0); // For normalized scroll position (0 to 1)

  // Scroll threshold for camera zoom specific to particle sphere
  const cameraZoomActivationThresholdRef = useRef(0);


  const handleScroll = useCallback(() => {
    if (!mountRef.current) return;

    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;
    
    scrollRef.current = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
    
    // Cube scroll animation
    if (cube1Ref.current && cube2Ref.current) {
      cube1Ref.current.position.y = CUBE_INITIAL_Y - scrollY * CUBE_SCROLL_FACTOR;
      cube2Ref.current.position.y = CUBE_INITIAL_Y + scrollY * CUBE_SCROLL_FACTOR * 0.8; // Slightly different factor for parallax
    }

    // Set the threshold after which camera zoom relative to particle sphere starts
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
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient light
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // Cube 1 (Purple)
    const geometry1 = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, roughness: 0.5, metalness: 0.1 });
    cube1Ref.current = new THREE.Mesh(geometry1, material1);
    cube1Ref.current.position.x = -CUBE_SPACING / 2;
    cube1Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube1Ref.current);

    // Cube 2 (Blue-ish Accent)
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
      // Create particles on the surface of a sphere
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;

      positions[i * 3] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = PARTICLE_SPHERE_BASE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: PARTICLE_COLOR,
      size: 0.025, // Adjust size for desired dot appearance
      transparent: true,
      opacity: PARTICLE_OPACITY,
      blending: THREE.AdditiveBlending, // For a glowing effect
      sizeAttenuation: true,
    });

    pointsRef.current = new THREE.Points(particleGeometry, particleMaterial);
    pointsRef.current.visible = true; // Always visible
    sceneRef.current.add(pointsRef.current);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set positions and scrollRef

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

      // Particle sphere animations
      if (pointsRef.current) {
        // Scroll-driven scale animation: tiny -> expanded -> tiny
        const normalizedScroll = scrollRef.current; // 0 (top) to 1 (bottom)
        let scaleFactor;
        if (normalizedScroll < 0.5) {
          // From 0 to 0.5 scroll, scale goes from MIN_SPHERE_SCALE to MAX_SPHERE_SCALE
          scaleFactor = normalizedScroll * 2; // Ramps from 0 to 1 as scroll goes from 0 to 0.5
        } else {
          // From 0.5 to 1 scroll, scale goes from MAX_SPHERE_SCALE to MIN_SPHERE_SCALE
          scaleFactor = 1 - (normalizedScroll - 0.5) * 2; // Ramps from 1 to 0 as scroll goes from 0.5 to 1
        }
        scaleFactor = Math.max(0, Math.min(1, scaleFactor)); // Clamp between 0 and 1
        
        const currentScale = MIN_SPHERE_SCALE + (MAX_SPHERE_SCALE - MIN_SPHERE_SCALE) * scaleFactor;
        pointsRef.current.scale.set(currentScale, currentScale, currentScale);

        // Continuous rotation
        pointsRef.current.rotation.y += elapsedTime * 0.05; // Slow rotation
        pointsRef.current.rotation.x += elapsedTime * 0.02;

        // Subtle pulsing effect based on overall time, more noticeable when sphere is larger
        const pulse = (1 + Math.sin(totalElapsedTime * 1.0) * 0.03) * currentScale; // Pulse amplitude depends on currentScale
        pointsRef.current.scale.set(pulse, pulse, pulse);
      }

      // Camera Zoom based on scroll AFTER activation threshold (relative to particle sphere or scene center)
      if (window.scrollY > cameraZoomActivationThresholdRef.current) {
          // How far scrolled past the activation point
          const scrollAfterActivation = Math.max(0, window.scrollY - cameraZoomActivationThresholdRef.current);
          // Define a range over which the zoom effect occurs (e.g., next 1.5 viewport heights)
          const zoomScrollRange = window.innerHeight * 1.5; 
          // Normalize this scroll progress from 0 to 1
          const normalizedZoomScroll = Math.min(scrollAfterActivation / zoomScrollRange, 1);
          
          // Apply zoom: initial Z - (progress * zoom_factor)
          cameraRef.current.position.z = CAMERA_INITIAL_Z - (normalizedZoomScroll * CAMERA_ZOOM_FACTOR);
          // Optionally, make camera look at the particle sphere if it exists, or scene center
          if (pointsRef.current) {
            // cameraRef.current.lookAt(pointsRef.current.position); // Look at particle sphere
          } else {
            cameraRef.current.lookAt(sceneRef.current.position); // Look at scene center
          }
      } else {
         // Reset camera Z position if scrolled back above threshold, only if it changed
         if (cameraRef.current.position.z !== CAMERA_INITIAL_Z) {
            cameraRef.current.position.z = CAMERA_INITIAL_Z;
            cameraRef.current.lookAt(sceneRef.current.position); // Reset lookAt as well
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
        // Recalculate camera zoom activation threshold on resize
        cameraZoomActivationThresholdRef.current = window.innerHeight * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
        handleScroll(); // Recalculate scroll-dependent values
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set size and thresholds

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
      // Ensure DOM element is removed if it was appended
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

    