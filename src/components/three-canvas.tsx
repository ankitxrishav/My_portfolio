
"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const CUBE_SIZE = 0.6;
const CUBE_SPACING = 2.0;
const CUBE_INITIAL_Y = 0;
const CUBE_SCROLL_FACTOR = 0.003;

const NUM_PARTICLES = 7000;
const PARTICLE_SPHERE_BASE_RADIUS = 2.5;
const MIN_SPHERE_SCALE = 0.1;
const MAX_SPHERE_SCALE = 1.2;
const PARTICLE_COLOR = 0xBF00FF;
const PARTICLE_OPACITY = 0.7;

const CAMERA_INITIAL_Z = 5;
const CAMERA_ZOOM_FACTOR = 2;
const CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR = 0.5;

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);
  
  const pointsRefA = useRef<THREE.Points | null>(null);
  const pointsRefR = useRef<THREE.Points | null>(null);
  
  const scrollYRef = useRef(0);
  const cameraZoomActivationThresholdRef = useRef(0);

  const handleScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    
    if (cube1Ref.current && cube2Ref.current) {
      cube1Ref.current.position.y = CUBE_INITIAL_Y - scrollYRef.current * CUBE_SCROLL_FACTOR;
      cube2Ref.current.position.y = CUBE_INITIAL_Y + scrollYRef.current * CUBE_SCROLL_FACTOR * 0.8;
    }
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

    const createTextTexture = (text: string, color: string, fontSize: number): THREE.CanvasTexture | null => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;
      const size = fontSize * 1.5;
      canvas.width = size;
      canvas.height = size;
      context.font = `bold ${fontSize}px Arial`;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, size / 2, size / 2 + fontSize * 0.05);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const textureColor = `#${new THREE.Color(PARTICLE_COLOR).getHexString()}`;
    const textureA = createTextTexture('A', textureColor, 128);
    const textureR = createTextTexture('R', textureColor, 128);

    const createParticleSystem = (numParticles: number, texture: THREE.Texture | null) => {
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numParticles * 3);
      for (let i = 0; i < numParticles; i++) {
        const phi = Math.acos(-1 + (2 * i) / numParticles);
        const theta = Math.sqrt(numParticles * Math.PI) * phi;
        positions[i * 3] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(theta) * Math.sin(phi);
        positions[i * 3 + 1] = PARTICLE_SPHERE_BASE_RADIUS * Math.sin(theta) * Math.sin(phi);
        positions[i * 3 + 2] = PARTICLE_SPHERE_BASE_RADIUS * Math.cos(phi);
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
          map: texture,
          size: 0.35,
          transparent: true,
          opacity: PARTICLE_OPACITY,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
          depthWrite: false,
      });
      
      const points = new THREE.Points(particleGeometry, particleMaterial);
      points.visible = true;
      return points;
    }

    const numParticlesA = Math.floor(NUM_PARTICLES / 2);
    const numParticlesR = NUM_PARTICLES - numParticlesA;
    
    if (textureA) {
      pointsRefA.current = createParticleSystem(numParticlesA, textureA);
      sceneRef.current.add(pointsRefA.current);
    }
    if (textureR) {
      pointsRefR.current = createParticleSystem(numParticlesR, textureR);
      sceneRef.current.add(pointsRefR.current);
    }
    
    cameraZoomActivationThresholdRef.current = window.innerHeight * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

      const scroll = scrollYRef.current;
      const pageHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const normalizedScroll = pageHeight > 0 ? Math.min(1, Math.max(0, scroll / pageHeight)) : 0;
      
      let scaleFactor;
      if (normalizedScroll < 0.5) {
        scaleFactor = normalizedScroll * 2;
      } else {
        scaleFactor = 1 - (normalizedScroll - 0.5) * 2;
      }
      scaleFactor = Math.max(0, Math.min(1, scaleFactor));
      
      const currentScale = MIN_SPHERE_SCALE + (MAX_SPHERE_SCALE - MIN_SPHERE_SCALE) * scaleFactor;
      const pulse = (1 + Math.sin(totalElapsedTime * 1.0) * 0.03) * currentScale;

      if (pointsRefA.current) {
        pointsRefA.current.rotation.y += elapsedTime * 0.05;
        pointsRefA.current.rotation.x += elapsedTime * 0.02;
        pointsRefA.current.scale.set(pulse, pulse, pulse);
        pointsRefA.current.visible = true;
      }
      
      if (pointsRefR.current) {
        pointsRefR.current.rotation.y -= elapsedTime * 0.04;
        pointsRefR.current.rotation.x += elapsedTime * 0.025;
        pointsRefR.current.scale.set(pulse, pulse, pulse);
        pointsRefR.current.visible = true;
      }


      if (scrollYRef.current > cameraZoomActivationThresholdRef.current) {
          const scrollAfterActivation = Math.max(0, scrollYRef.current - cameraZoomActivationThresholdRef.current);
          const zoomScrollRange = window.innerHeight * 1.5;
          const normalizedZoomScroll = Math.min(scrollAfterActivation / zoomScrollRange, 1);
          cameraRef.current.position.z = CAMERA_INITIAL_Z - (normalizedZoomScroll * CAMERA_ZOOM_FACTOR);
      } else {
         if (cameraRef.current.position.z !== CAMERA_INITIAL_Z) {
            cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, CAMERA_INITIAL_Z, 0.1);
            if (Math.abs(cameraRef.current.position.z - CAMERA_INITIAL_Z) < 0.01) {
              cameraRef.current.position.z = CAMERA_INITIAL_Z;
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
        cameraZoomActivationThresholdRef.current = window.innerHeight * CAMERA_ZOOM_ACTIVATION_SCROLL_THRESHOLD_FACTOR;
        handleScroll();
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
        if (cube1Ref.current) sceneRef.current.remove(cube1Ref.current);
        if (cube2Ref.current) sceneRef.current.remove(cube2Ref.current);
        if (pointsRefA.current) sceneRef.current.remove(pointsRefA.current);
        if (pointsRefR.current) sceneRef.current.remove(pointsRefR.current);
      }
      cube1Ref.current?.geometry?.dispose();
      if (cube1Ref.current?.material) { (cube1Ref.current.material as THREE.Material).dispose(); }
      cube2Ref.current?.geometry?.dispose();
      if (cube2Ref.current?.material) { (cube2Ref.current.material as THREE.Material).dispose(); }
      
      pointsRefA.current?.geometry?.dispose();
      if (pointsRefA.current?.material) {
        const material = pointsRefA.current.material as THREE.PointsMaterial;
        material.map?.dispose();
        material.dispose();
      }

      pointsRefR.current?.geometry?.dispose();
      if (pointsRefR.current?.material) {
        const material = pointsRefR.current.material as THREE.PointsMaterial;
        material.map?.dispose();
        material.dispose();
      }
      
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
      pointsRefA.current = null;
      pointsRefR.current = null;
    };
  }, [handleScroll]);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-80 pointer-events-none" />;
};

export default ThreeCanvas;
