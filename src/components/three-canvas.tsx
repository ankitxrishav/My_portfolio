
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CUBE_SIZE = 0.6;
const CUBE_SPACING = 2.0;
const CUBE_INITIAL_Y = 0;
const CUBE_SCROLL_FACTOR = 0.003;

const NUM_PARTICLES = 7000; // Increased for a denser sphere
const PARTICLE_SPHERE_RADIUS = 2.5; // Radius of the sphere on which particles are placed
const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2; // How much camera zooms in relative to scroll

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
  const particlesActiveRef = useRef(false);
  const scrollActivationThresholdRef = useRef(0); // For particle sphere activation

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
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Softer ambient light
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Main light source
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);

    // Cube 1 (Purple)
    const geometry1 = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, roughness: 0.5, metalness: 0.1 }); // Brighter Purple
    cube1Ref.current = new THREE.Mesh(geometry1, material1);
    cube1Ref.current.position.x = -CUBE_SPACING / 2;
    cube1Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube1Ref.current);

    // Cube 2 (Blue-ish Accent)
    const geometry2 = new THREE.BoxGeometry(CUBE_SIZE * 0.8, CUBE_SIZE * 0.8, CUBE_SIZE * 0.8); // Slightly smaller
    const material2 = new THREE.MeshStandardMaterial({ color: 0x4D4DFF, roughness: 0.5, metalness: 0.1 }); // Complementary Blue
    cube2Ref.current = new THREE.Mesh(geometry2, material2);
    cube2Ref.current.position.x = CUBE_SPACING / 2;
    cube2Ref.current.position.y = CUBE_INITIAL_Y;
    sceneRef.current.add(cube2Ref.current);

    // Particle Sphere
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(NUM_PARTICLES * 3);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      // Distribute points more evenly using Fibonacci sphere algorithm (Golden Spiral)
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES); // inclination
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi; // azimuth

      positions[i * 3] = PARTICLE_SPHERE_RADIUS * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = PARTICLE_SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = PARTICLE_SPHERE_RADIUS * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xBF00FF, // Accent color
      size: 0.025,
      transparent: true,
      opacity: 0.7, // Reduced opacity
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

      // Cube scroll animation
      if (cube1Ref.current && cube2Ref.current) {
        const scrollY = window.scrollY;
        cube1Ref.current.position.y = CUBE_INITIAL_Y - scrollY * CUBE_SCROLL_FACTOR;
        cube2Ref.current.position.y = CUBE_INITIAL_Y + scrollY * CUBE_SCROLL_FACTOR * 0.8; // Different scroll speed
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!clockRef.current || !cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      const elapsedTime = clockRef.current.getDelta(); // Use getDelta for smoother animation updates
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
        if (particlesActiveRef.current) {
          pointsRef.current.visible = true;
          
          // Rotation
          pointsRef.current.rotation.y += elapsedTime * 0.1;
          pointsRef.current.rotation.x += elapsedTime * 0.05;

          // Pulsing scale
          const pulseScale = 1 + Math.sin(totalElapsedTime * 1.5) * 0.05; // Subtle pulse
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
            // Smoothly return camera to initial position if desired, or snap
            cameraRef.current.position.z = CAMERA_INITIAL_Z;
            cameraRef.current.lookAt(sceneRef.current.position);
          }
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
        if (cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if (cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
        if (pointsRef.current) sceneRef.current.remove(pointsRef.current);
      }

      cube1Ref.current?.geometry?.dispose();
      if (cube1Ref.current?.material) {
        if (Array.isArray(cube1Ref.current.material)) {
          cube1Ref.current.material.forEach(m => m.dispose());
        } else {
          (cube1Ref.current.material as THREE.Material).dispose();
        }
      }
      cube2Ref.current?.geometry?.dispose();
      if (cube2Ref.current?.material) {
         if (Array.isArray(cube2Ref.current.material)) {
          cube2Ref.current.material.forEach(m => m.dispose());
        } else {
          (cube2Ref.current.material as THREE.Material).dispose();
        }
      }
      pointsRef.current?.geometry?.dispose();
      if (pointsRef.current?.material) {
        if (Array.isArray(pointsRef.current.material)) {
          pointsRef.current.material.forEach(m => m.dispose());
        } else {
          (pointsRef.current.material as THREE.Material).dispose();
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
      cube1Ref.current = null;
      cube2Ref.current = null;
      pointsRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-80 pointer-events-none" />;
};

export default ThreeCanvas;
