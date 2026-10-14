'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export interface ThreeSceneConfig {
  antialias?: boolean;
  alpha?: boolean;
  pixelRatioLimit?: number;
  cameraFov?: number;
  cameraNear?: number;
  cameraFar?: number;
  cameraPosition?: [number, number, number];
}

export interface ThreeSceneResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  frameId: React.MutableRefObject<number | null>;
}

const defaultConfig: ThreeSceneConfig = {
  antialias: true,
  alpha: true,
  pixelRatioLimit: 2,
  cameraFov: 75,
  cameraNear: 0.1,
  cameraFar: 1000,
  cameraPosition: [0, 0, 5],
};

export function useThreeScene(
  onInit?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void,
  onAnimate?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, delta: number) => void,
  config: ThreeSceneConfig = {}
): ThreeSceneResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameId = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);

  const mergedConfig = { ...defaultConfig, ...config };

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mergedConfig.pixelRatioLimit!));
  }, [mergedConfig.pixelRatioLimit]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      mergedConfig.cameraFov,
      container.clientWidth / container.clientHeight,
      mergedConfig.cameraNear,
      mergedConfig.cameraFar
    );
    camera.position.set(...(mergedConfig.cameraPosition as [number, number, number]));
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: mergedConfig.antialias,
      alpha: mergedConfig.alpha,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mergedConfig.pixelRatioLimit!));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.width = '100%';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Initialize clock for delta time
    clockRef.current = new THREE.Clock();

    // Add canvas to container
    container.appendChild(renderer.domElement);

    // Call user's init function
    onInit?.(scene, camera, renderer);

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      const delta = clockRef.current?.getDelta() ?? 0;
      onAnimate?.(scene, camera, renderer, delta);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize from both viewport and container changes.
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }

      // Dispose of all objects in the scene
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });

      renderer.dispose();

      // Remove canvas from DOM
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onInit, onAnimate, handleResize, mergedConfig.cameraFov, mergedConfig.cameraNear, mergedConfig.cameraFar, mergedConfig.cameraPosition, mergedConfig.antialias, mergedConfig.alpha, mergedConfig.pixelRatioLimit]);

  return {
    containerRef,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    frameId,
  };
}

export default useThreeScene;
