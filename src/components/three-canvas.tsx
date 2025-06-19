
"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useScrollSection, type ActiveSection } from '@/context/ScrollSectionContext';

const ThreeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const cube1Ref = useRef<THREE.Mesh | null>(null);
  const cube2Ref = useRef<THREE.Mesh | null>(null);

  const { activeSection } = useScrollSection();
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    if (!mountRef.current) return;

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    
    // Cube 1
    const material1 = new THREE.MeshStandardMaterial({ 
      color: 0xBF00FF, // Accent color
      metalness: 0.3,
      roughness: 0.5,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });
    const cube1 = new THREE.Mesh(cubeGeometry, material1);
    cube1.position.set(-1.5, 0.5, 0);
    scene.add(cube1);
    cube1Ref.current = cube1;

    // Cube 2
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x4B0082, // Primary color
      metalness: 0.4,
      roughness: 0.6,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });
    const cube2 = new THREE.Mesh(cubeGeometry, material2);
    cube2.position.set(1.5, -0.5, -1);
    scene.add(cube2);
    cube2Ref.current = cube2;
    
    clockRef.current = new THREE.Clock();

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime();

      if (cube1Ref.current && cube2Ref.current && material1 && material2) {
        // Default state (can be used for 'journey', 'contact', or if no specific state)
        let targetScale1 = 1.0;
        let targetScale2 = 1.0;
        let targetOpacity1 = 1.0;
        let targetOpacity2 = 1.0;
        let rotSpeedX1 = 0.002;
        let rotSpeedY1 = 0.003;
        let rotSpeedX2 = 0.003;
        let rotSpeedY2 = 0.002;
        let floatAmplitude1 = 0;
        let floatAmplitude2 = 0;
        let emissiveIntensity1 = 0;
        let emissiveIntensity2 = 0;
        const basePosY1 = 0.5;
        const basePosY2 = -0.5;


        switch (activeSection) {
          case 'home': // Idle + Glow
            rotSpeedX1 = 0.001;
            rotSpeedY1 = 0.001;
            rotSpeedX2 = 0.001;
            rotSpeedY2 = 0.001;
            emissiveIntensity1 = 0.5;
            emissiveIntensity2 = 0.4;
            material1.emissive.setHex(0xBF00FF);
            material2.emissive.setHex(0x4B0082);
            break;
          case 'about': // Rotate and Float
            rotSpeedX1 = 0.005;
            rotSpeedY1 = 0.007;
            rotSpeedX2 = 0.007;
            rotSpeedY2 = 0.005;
            floatAmplitude1 = 0.2;
            floatAmplitude2 = 0.25;
            break;
          case 'projects': // Collapse / Morph (scale down, spin, fade)
            targetScale1 = 0.1;
            targetScale2 = 0.1;
            targetOpacity1 = 0.1;
            targetOpacity2 = 0.1;
            rotSpeedX1 = 0.05; // Faster spin
            rotSpeedY1 = 0.06;
            rotSpeedX2 = 0.06;
            rotSpeedY2 = 0.05;
            break;
          default: // Default state for journey, contact, or null
            // Uses the initial default values
            break;
        }

        // Apply animations smoothly (Lerp)
        cube1Ref.current.rotation.x += rotSpeedX1;
        cube1Ref.current.rotation.y += rotSpeedY1;
        cube1Ref.current.position.y = basePosY1 + Math.sin(elapsedTime * 2 + 1) * floatAmplitude1;
        
        cube2Ref.current.rotation.x += rotSpeedX2;
        cube2Ref.current.rotation.y += rotSpeedY2;
        cube2Ref.current.position.y = basePosY2 + Math.cos(elapsedTime * 2.5) * floatAmplitude2;

        cube1Ref.current.scale.lerp(new THREE.Vector3(targetScale1, targetScale1, targetScale1), 0.05);
        cube2Ref.current.scale.lerp(new THREE.Vector3(targetScale2, targetScale2, targetScale2), 0.05);
        
        material1.opacity = THREE.MathUtils.lerp(material1.opacity, targetOpacity1, 0.05);
        material2.opacity = THREE.MathUtils.lerp(material2.opacity, targetOpacity2, 0.05);
        material1.transparent = material1.opacity < 1.0;
        material2.transparent = material2.opacity < 1.0;
        
        material1.emissiveIntensity = THREE.MathUtils.lerp(material1.emissiveIntensity, emissiveIntensity1, 0.1);
        material2.emissiveIntensity = THREE.MathUtils.lerp(material2.emissiveIntensity, emissiveIntensity2, 0.1);

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
      
      scene.remove(cube1Ref.current!);
      scene.remove(cube2Ref.current!);
      cube1Ref.current?.geometry?.dispose();
      (cube1Ref.current?.material as THREE.Material)?.dispose();
      cube2Ref.current?.geometry?.dispose();
      (cube2Ref.current?.material as THREE.Material)?.dispose();
      
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
         currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ActiveSection dependency removed to avoid re-creating scene, animation loop handles state changes.

  // Re-run animation logic when activeSection changes
  useEffect(() => {
    // This effect doesn't re-initialize the scene,
    // but ensures the animation loop considers the new activeSection.
    // The animation loop itself will pick up the new activeSection value.
  }, [activeSection]);


  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-70 pointer-events-none" />;
};

export default ThreeCanvas;
