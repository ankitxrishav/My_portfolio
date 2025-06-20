
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Added for potential debugging, not active control

export default function CustomCursor() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetModelPositionRef = useRef(new THREE.Vector3());
  const isInitializedRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    mousePositionRef.current = { x: event.clientX, y: event.clientY };
  }, [isVisible]);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined' || isInitializedRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    sceneRef.current = new THREE.Scene();

    // Camera
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current.position.z = 1; // Camera is relatively close

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(rendererRef.current.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Softer ambient
    sceneRef.current.add(ambientLight);

    pointLightRef.current = new THREE.PointLight(0xffffff, 0.8, 100); // Point light to cast highlights
    pointLightRef.current.position.set(0, 0, 0.5); // Initial position, will follow cursor
    sceneRef.current.add(pointLightRef.current);

    // 3D Model (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(0.1, 0.03, 100, 16); // Smaller, sleeker
    const material = new THREE.MeshStandardMaterial({
      color: 0xBF00FF, // Accent Purple
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0xBF00FF,
      emissiveIntensity: 0.25,
    });
    modelRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(modelRef.current);
    modelRef.current.visible = false; // Initially hidden until first mouse move

    isInitializedRef.current = true;

    // Mouse move listener
    document.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none'; // Ensure system cursor is hidden

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !modelRef.current || !pointLightRef.current) return;

      if (isVisible && !modelRef.current.visible) {
        modelRef.current.visible = true; // Show model on first interaction
      }
      
      if (modelRef.current.visible) {
        // Convert mouse screen coordinates to 3D world space
        const vec = new THREE.Vector3();
        const pos = new THREE.Vector3();
        
        vec.set(
          (mousePositionRef.current.x / window.innerWidth) * 2 - 1,
          -(mousePositionRef.current.y / window.innerHeight) * 2 + 1,
          0.5 // A point in front of the camera
        );
        
        vec.unproject(cameraRef.current); // Unproject from camera's view
        
        vec.sub(cameraRef.current.position).normalize();
        const distance = -cameraRef.current.position.z / vec.z; // Distance to Z=0 plane
        pos.copy(cameraRef.current.position).add(vec.multiplyScalar(distance));
        
        targetModelPositionRef.current.copy(pos);

        // Smoothly interpolate model position (lerp)
        modelRef.current.position.lerp(targetModelPositionRef.current, 0.2);

        // Update light position to follow model
        pointLightRef.current.position.copy(modelRef.current.position);
        pointLightRef.current.position.z += 0.3; // Slightly in front of the model

        // Subtle rotation
        modelRef.current.rotation.x += 0.005;
        modelRef.current.rotation.y += 0.007;
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      modelRef.current?.geometry?.dispose();
      if (modelRef.current?.material) {
        if (Array.isArray(modelRef.current.material)) {
          modelRef.current.material.forEach(m => m.dispose());
        } else {
          (modelRef.current.material as THREE.Material).dispose();
        }
      }
      rendererRef.current?.dispose();
      if (currentMount && rendererRef.current?.domElement?.parentNode === currentMount) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      modelRef.current = null;
      pointLightRef.current = null;
      isInitializedRef.current = false;
      document.body.style.cursor = ''; // Restore system cursor on cleanup
    };
  }, [handleMouseMove, isVisible]); // isVisible is a dependency for initial model visibility

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}

