'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThreeScene } from '@/hooks/useThreeScene';

interface Hero3DProps {
  className?: string;
}

interface FloatingShape {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  floatSpeed: number;
  floatAmplitude: number;
  phase: number;
}

const COLORS = {
  primary: 0x6366f1,    // Indigo
  secondary: 0x8b5cf6,  // Violet
  accent: 0x06b6d4,     // Cyan
  warm: 0xf59e0b,       // Amber
  rose: 0xf43f5e,       // Rose
};

export default function Hero3D({ className = '' }: Hero3DProps) {
  const shapesRef = useRef<FloatingShape[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const createFloatingShapes = useCallback((scene: THREE.Scene) => {
    const shapes: FloatingShape[] = [];
    const colorValues = Object.values(COLORS);

    // Create various geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.TetrahedronGeometry(0.45, 0),
      new THREE.TorusGeometry(0.3, 0.12, 16, 32),
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.ConeGeometry(0.3, 0.6, 8),
      new THREE.DodecahedronGeometry(0.35, 0),
      new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8),
    ];

    const shapeCount = 15;

    for (let i = 0; i < shapeCount; i++) {
      const geometry = geometries[i % geometries.length];
      const color = colorValues[i % colorValues.length];

      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
        envMapIntensity: 1,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Position shapes in a spread pattern
      const angle = (i / shapeCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 4;
      const z = Math.sin(angle) * radius * 0.5 + (Math.random() - 0.5) * 2 - 2;

      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      shapes.push({
        mesh,
        originalPosition: mesh.position.clone(),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatAmplitude: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    return shapes;
  }, []);

  const onInit = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // Set camera position
      camera.position.set(0, 0, 6);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      // Add point lights for color accents
      const pointLight1 = new THREE.PointLight(COLORS.primary, 1, 10);
      pointLight1.position.set(-3, 2, 2);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(COLORS.accent, 1, 10);
      pointLight2.position.set(3, -2, 2);
      scene.add(pointLight2);

      // Create floating shapes
      shapesRef.current = createFloatingShapes(scene);

      // Add subtle fog for depth
      scene.fog = new THREE.Fog(0x000000, 8, 20);

      setIsLoaded(true);
    },
    [createFloatingShapes]
  );

  const onAnimate = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, delta: number) => {
      timeRef.current += delta;

      // Smooth mouse following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      // Animate floating shapes
      shapesRef.current.forEach((shape) => {
        // Rotation
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;

        // Floating motion
        const floatOffset = Math.sin(timeRef.current * shape.floatSpeed + shape.phase) * shape.floatAmplitude;
        shape.mesh.position.y = shape.originalPosition.y + floatOffset;

        // Subtle horizontal drift
        const driftX = Math.sin(timeRef.current * 0.3 + shape.phase) * 0.1;
        shape.mesh.position.x = shape.originalPosition.x + driftX;

        // React to mouse movement
        const mouseInfluence = 0.3;
        shape.mesh.position.x += mouseRef.current.x * mouseInfluence * (shape.originalPosition.z + 3) * 0.1;
        shape.mesh.position.y += mouseRef.current.y * mouseInfluence * (shape.originalPosition.z + 3) * 0.1;
      });

      // Subtle camera movement based on mouse
      camera.position.x = mouseRef.current.x * 0.5;
      camera.position.y = mouseRef.current.y * 0.3;
      camera.lookAt(0, 0, 0);
    },
    []
  );

  const { containerRef } = useThreeScene(onInit, onAnimate, {
    cameraFov: 60,
    cameraPosition: [0, 0, 6],
  });

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`relative w-full h-screen ${className}`}>
      <div
        ref={containerRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ touchAction: 'none' }}
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center z-10 pointer-events-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
            Welcome
          </h1>
          <p className="text-xl md:text-2xl text-white/80 drop-shadow-md">
            Interactive 3D Experience
          </p>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
