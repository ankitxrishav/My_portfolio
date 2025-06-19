
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NUM_PARTICLES = 7000; 
const PARTICLE_SPHERE_RADIUS = 2.5;
const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2; // How much camera zooms in relative to scroll

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  
  const pointsRef = useRef<THREE.Points | null>(null);
  const particlesActiveRef = useRef(false);
  const scrollActivationThresholdRef = useRef(0); 

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
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // Particle Sphere
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NUM_PARTICLES * 3);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES); // Distributes points more evenly than random
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;

      positions[i * 3] = PARTICLE_SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = PARTICLE_SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = PARTICLE_SPHERE_RADIUS * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xBF00FF, // Accent color
      size: 0.025,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending, // Brighter where particles overlap
      sizeAttenuation: true, // Particles further away appear smaller
    });

    pointsRef.current = new THREE.Points(particleGeometry, particleMaterial);
    pointsRef.current.visible = false; // Initially hidden
    sceneRef.current.add(pointsRef.current);

    // Scroll handling
    scrollActivationThresholdRef.current = window.innerHeight * 1.0; // Activate after 1 page scroll

    const handleScroll = () => {
      if (window.scrollY > scrollActivationThresholdRef.current) {
        particlesActiveRef.current = true;
      } else {
        particlesActiveRef.current = false;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!clockRef.current || !pointsRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      const elapsedTime = clockRef.current.getDelta(); // Use getDelta for smoother animation updates
      const totalElapsedTime = clockRef.current.getElapsedTime();


      if (particlesActiveRef.current) {
        pointsRef.current.visible = true;
        
        // Rotation
        pointsRef.current.rotation.y += elapsedTime * 0.1;
        pointsRef.current.rotation.x += elapsedTime * 0.05;

        // Pulsing scale
        const pulseScale = 1 + Math.sin(totalElapsedTime * 1.5) * 0.05;
        pointsRef.current.scale.set(pulseScale, pulseScale, pulseScale);

        // Camera Zoom based on scroll after activation
        const scrollAfterActivation = Math.max(0, window.scrollY - scrollActivationThresholdRef.current);
        // Normalize scroll depth for zoom (e.g., over a range of 2 viewport heights)
        const zoomScrollRange = window.innerHeight * 2; 
        const normalizedZoomScroll = Math.min(scrollAfterActivation / zoomScrollRange, 1);
        cameraRef.current.position.z = CAMERA_INITIAL_Z - (normalizedZoomScroll * CAMERA_ZOOM_FACTOR);
        cameraRef.current.lookAt(sceneRef.current.position);


      } else {
        pointsRef.current.visible = false;
        // Reset scale and camera if not active
        pointsRef.current.scale.set(1, 1, 1);
        if (cameraRef.current.position.z !== CAMERA_INITIAL_Z) {
          cameraRef.current.position.z = CAMERA_INITIAL_Z;
          cameraRef.current.lookAt(sceneRef.current.position);
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
        scrollActivationThresholdRef.current = window.innerHeight * 1.0; 
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      
      if (sceneRef.current) {
        if (pointsRef.current) sceneRef.current.remove(pointsRef.current);
      }

      pointsRef.current?.geometry?.dispose();
      if (pointsRef.current?.material) {
        if (Array.isArray(pointsRef.current.material)) {
          pointsRef.current.material.forEach(m => m.dispose());
        } else {
          pointsRef.current.material.dispose();
        }
      }
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      // Nullify refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      clockRef.current = null;
      pointsRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-80 pointer-events-none" />;
};

export default ThreeCanvas;
