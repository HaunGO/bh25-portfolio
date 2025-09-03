import * as THREE from 'three';

// Performance monitoring
export class PerformanceMonitor {
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.clock = new THREE.Clock();
  }

  update() {
    this.frameCount++;
    const currentTime = this.clock.getElapsedTime();
    
    if (currentTime - this.lastTime >= 1) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Performance warning
      if (this.fps < 30) {
        console.warn('Low FPS detected:', this.fps);
      }
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

// Common 3D scene setup
export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  performanceMonitor: PerformanceMonitor;

  constructor(container: HTMLElement) {
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    // Renderer setup with performance optimizations
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Performance monitoring
    this.performanceMonitor = new PerformanceMonitor(this.renderer);
    
    // Add to container
    container.appendChild(this.renderer.domElement);
    
    // Handle resize
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize() {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Add ambient lighting
  addAmbientLight(intensity: number = 0.4): THREE.AmbientLight {
    const light = new THREE.AmbientLight(0xffffff, intensity);
    this.scene.add(light);
    return light;
  }

  // Add directional lighting with shadows
  addDirectionalLight(
    intensity: number = 0.8,
    position: [number, number, number] = [5, 5, 5]
  ): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(...position);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    this.scene.add(light);
    return light;
  }

  // Add point lighting
  addPointLight(
    intensity: number = 1,
    position: [number, number, number] = [0, 5, 0],
    color: number = 0xffffff
  ): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity);
    light.position.set(...position);
    this.scene.add(light);
    return light;
  }

  // Render loop
  render() {
    this.performanceMonitor.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Cleanup
  dispose() {
    this.renderer.dispose();
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}

// Utility functions for common 3D objects
export const createCube = (size: number = 1, color: number = 0x00ff00): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshLambertMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

export const createSphere = (radius: number = 0.5, color: number = 0x0000ff): THREE.Mesh => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

export const createPlane = (width: number = 10, height: number = 10, color: number = 0x808080): THREE.Mesh => {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshLambertMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

// Animation utilities
export const animateRotation = (
  object: THREE.Object3D,
  speed: number = 0.01
): (() => void) => {
  const animate = () => {
    object.rotation.x += speed;
    object.rotation.y += speed;
    requestAnimationFrame(animate);
  };
  
  animate();
  
  // Return cleanup function
  return () => {
    // Stop animation if needed
  };
};

export default SceneManager;
