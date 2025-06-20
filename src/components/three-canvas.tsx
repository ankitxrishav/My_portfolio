
"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// Cube constants
const CUBE_SIZE = 0.6;
const CUBE_SPACING = 2.0;
const CUBE_INITIAL_Y = 0; 
const CUBE_SCROLL_FACTOR = 0.003; // May need adjustment for horizontal sensitivity

// Particle Sphere constants
const NUM_PARTICLES = 7000;
const PARTICLE_SPHERE_BASE_RADIUS = 2.5;
const MIN_SPHERE_SCALE = 0.1;
const MAX_SPHERE_SCALE = 1.2;
const PARTICLE_COLOR = 0xBF00FF;
const PARTICLE_OPACITY = 0.7;

// Camera constants
const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2;
// Threshold factor relative to viewport width for horizontal scroll
const CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR = 1.0; 

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);
  
  const pointsRef = useRef<THREE.Points | null>(null);
  const scrollRef = useRef(0); // Normalized scroll position (0 to 1) for horizontal scroll
  const cameraZoomActivationThresholdRef = useRef(0);
  const scrollContainerRef = useRef<HTMLElement | null>(null); // Ref for the .horizontal-scroll-container

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const scrollX = scrollContainerRef.current.scrollLeft;
    const scrollWidth = scrollContainerRef.current.scrollWidth;
    const clientWidth = scrollContainerRef.current.clientWidth; // Viewport width of the container
    const maxScroll = scrollWidth - clientWidth;
    
    scrollRef.current = maxScroll > 0 ? Math.min(1, Math.max(0, scrollX / maxScroll)) : 0;
    
    // Adjust cube positions based on horizontal scroll
    // Keep Y movement for now, driven by horizontal scroll (can be changed to X if preferred)
    if (cube1Ref.current && cube2Ref.current) {
      cube1Ref.current.position.y = CUBE_INITIAL_Y - scrollX * CUBE_SCROLL_FACTOR;
      cube2Ref.current.position.y = CUBE_INITIAL_Y + scrollX * CUBE_SCROLL_FACTOR * 0.8;
    }

    // Update the threshold for camera zoom based on clientWidth (viewport width)
    cameraZoomActivationThresholdRef.current = clientWidth * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
  }, []);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    // Attempt to find the scroll container after component mounts
    scrollContainerRef.current = document.querySelector('.horizontal-scroll-container');

    const currentMount = mountRef.current;
    sceneRef.current = new THREE.Scene();
    clockRef.current = new THREE.Clock();

    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current.position.z = CAMERA_INITIAL_Z;

    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    const geometry1 = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, roughness: 0.5, metalness: 0.1 });
    cube1Ref.current = new THREE.Mesh(geometry1, material1);
    cube1Ref.current.position.x = -CUBE_SPACING / 2;
    cube1Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube1Ref.current);

    const geometry2 = new THREE.BoxGeometry(CUBE_SIZE * 0.8, CUBE_SIZE * 0.8, CUBE_SIZE * 0.8);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x4D4DFF, roughness: 0.5, metalness: 0.1 });
    cube2Ref.current = new THREE.Mesh(geometry2, material2);
    cube2Ref.current.position.x = CUBE_SPACING / 2;
    cube2Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube2Ref.current);

    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NUM_PARTICLES * 3);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;
      positions[i * 3] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = PARTICLE_SPHERE_BASE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: PARTICLE_COLOR,
      size: 0.025,
      transparent: true,
      opacity: PARTICLE_OPACITY,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    pointsRef.current = new THREE.Points(particleGeometry, particleMaterial);
    pointsRef.current.visible = true;
    sceneRef.current.add(pointsRef.current);
    
    // Add scroll listener to the specific container if found
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }
    handleScroll(); // Call once to set initial state

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!clockRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      const elapsedTime = clockRef.current.getDelta();
      const totalElapsedTime = clockRef.current.getElapsedTime();

      if (cube1Ref.current) {
        cube1Ref.current.rotation.x += elapsedTime * 0.1;
        cube1Ref.current.rotation.y += elapsedTime * 0.15;
      }
      if (cube2Ref.current) {
        cube2Ref.current.rotation.x -= elapsedTime * 0.12;
        cube2Ref.current.rotation.y -= elapsedTime * 0.08;
      }

      if (pointsRef.current) {
        const normalizedScroll = scrollRef.current; // This is now horizontal scroll
        let scaleFactor;
        if (normalizedScroll < 0.5) {
          scaleFactor = normalizedScroll * 2;
        } else {
          scaleFactor = 1 - (normalizedScroll - 0.5) * 2;
        }
        scaleFactor = Math.max(0, Math.min(1, scaleFactor)); 
        const currentScale = MIN_SPHERE_SCALE + (MAX_SPHERE_SCALE - MIN_SPHERE_SCALE) * scaleFactor;
        
        pointsRef.current.rotation.y += elapsedTime * 0.05; 
        pointsRef.current.rotation.x += elapsedTime * 0.02;
        const pulse = (1 + Math.sin(totalElapsedTime * 1.0) * 0.03) * currentScale;
        pointsRef.current.scale.set(pulse, pulse, pulse);
        pointsRef.current.visible = true;
      }

      // Camera Zoom based on horizontal scroll
      if (scrollContainerRef.current && scrollContainerRef.current.scrollLeft > cameraZoomActivationThresholdRef.current) {
          const scrollAfterActivation = Math.max(0, scrollContainerRef.current.scrollLeft - cameraZoomActivationThresholdRef.current);
          const zoomScrollRange = scrollContainerRef.current.clientWidth * 1.5; // Zoom over 1.5 viewport widths
          const normalizedZoomScroll = Math.min(scrollAfterActivation / zoomScrollRange, 1);
          cameraRef.current.position.z = CAMERA_INITIAL_Z - (normalizedZoomScroll * CAMERA_ZOOM_FACTOR);
      } else {
         if (cameraRef.current.position.z !== CAMERA_INITIAL_Z) {
            cameraRef.current.position.z = CAMERA_INITIAL_Z;
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
        // Recalculate zoom activation threshold on resize, using scroll container's clientWidth
        if (scrollContainerRef.current) {
          cameraZoomActivationThresholdRef.current = scrollContainerRef.current.clientWidth * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
        }
        handleScroll(); 
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (sceneRef.current) {
        if (cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if (cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
        if (pointsRef.current) sceneRef.current.remove(pointsRef.current);
      }
      cube1Ref.current?.geometry?.dispose();
      if (cube1Ref.current?.material) { (cube1Ref.current.material as THREE.Material).dispose(); }
      cube2Ref.current?.geometry?.dispose();
      if (cube2Ref.current?.material) { (cube2Ref.current.material as THREE.Material).dispose(); }
      pointsRef.current?.geometry?.dispose();
      if (pointsRef.current?.material) { (pointsRef.current.material as THREE.Material).dispose(); }
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      clockRef.current = null;
      cube1Ref.current = null;
      cube2Ref.current = null;
      pointsRef.current = null;
      // scrollContainerRef.current = null; // No need to nullify if it's just a reference to a DOM element managed elsewhere
    };
  }, [handleScroll]); // Added handleScroll to dependency array

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-80 pointer-events-none" />;
};

export default ThreeCanvas;
