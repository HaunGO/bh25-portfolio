import Matter from 'matter-js';

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  frictionAir: number;
  restitution: number;
  density: number;
}

export interface CursorPhysics {
  engine: Matter.Engine;
  world: Matter.World;
  render?: Matter.Render;
  cursorBody?: Matter.Body;
  particles: Matter.Body[];
  attractors: Matter.Body[];
  elementBodies: Map<HTMLElement, Matter.Body>;
}

export const defaultPhysicsConfig: PhysicsConfig = {
  gravity: 0.1,
  friction: 0.001,
  frictionAir: 0.01,
  restitution: 0.8,
  density: 0.001
};

export class CursorPhysicsEngine {
  private config: PhysicsConfig;
  public physics: CursorPhysics; // Make public for access
  private isInitialized = false;
  private maxParticles = 50; // Limit particles for performance
  private lastCleanup = 0;

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = { ...defaultPhysicsConfig, ...config };
    this.physics = {
      engine: Matter.Engine.create(),
      world: Matter.World.create({}),
      particles: [],
      attractors: [],
      elementBodies: new Map()
    };
  }

  initialize(canvas?: HTMLCanvasElement): void {
    if (this.isInitialized) return;

    // Configure engine
    this.physics.engine.world = this.physics.world;
    this.physics.engine.world.gravity = { x: 0, y: this.config.gravity, scale: 0.001 };

    // Create cursor body (invisible, follows mouse)
    this.physics.cursorBody = Matter.Bodies.circle(0, 0, 20, {
      isStatic: true,
      isSensor: true,
      render: { visible: false }
    });

    console.log('🎯 Created cursor body with ID:', this.physics.cursorBody.id);
    Matter.World.add(this.physics.world, this.physics.cursorBody);
    console.log('✅ Cursor body added to world');

    // Create renderer if canvas provided
    if (canvas) {
      this.physics.render = Matter.Render.create({
        canvas,
        engine: this.physics.engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          wireframes: false,
          background: 'transparent',
          showVelocity: false,
          showCollisions: false,
          showAngleIndicator: false,
          showStats: false
        }
      });
    }

    this.isInitialized = true;
  }

  updateCursorPosition(x: number, y: number): void {
    if (this.physics.cursorBody) {
      Matter.Body.setPosition(this.physics.cursorBody, { x, y });
    } else {
      console.log('❌ No cursor body available for position update');
    }
  }

  createParticle(x: number, y: number, options: Partial<Matter.IBodyDefinition> = {}): Matter.Body {
    // Clean up old particles if we have too many
    if (this.physics.particles.length >= this.maxParticles) {
      this.cleanupOldParticles();
    }

    const particle = Matter.Bodies.circle(x, y, 3, {
      restitution: this.config.restitution,
      friction: this.config.friction,
      frictionAir: this.config.frictionAir,
      density: this.config.density,
      render: {
        fillStyle: '#3b82f6',
        strokeStyle: '#1d4ed8',
        lineWidth: 1
      },
      ...options
    });

    Matter.World.add(this.physics.world, particle);
    this.physics.particles.push(particle);

    // Remove particle after 3 seconds
    setTimeout(() => {
      this.removeParticle(particle);
    }, 3000);

    return particle;
  }

  // Clean up old particles for performance
  private cleanupOldParticles(): void {
    const now = Date.now();
    if (now - this.lastCleanup < 1000) return; // Only cleanup once per second

    // Remove particles that are far from cursor
    if (this.physics.cursorBody) {
      const cursorPos = this.physics.cursorBody.position;
      const maxDistance = 500; // Remove particles that are too far away

      this.physics.particles.forEach(particle => {
        const distance = Matter.Vector.magnitude(
          Matter.Vector.sub(particle.position, cursorPos)
        );

        if (distance > maxDistance) {
          this.removeParticle(particle);
        }
      });
    }

    this.lastCleanup = now;
  }

  createAttractor(x: number, y: number, strength: number = 0.01): Matter.Body {
    const attractor = Matter.Bodies.circle(x, y, 50, {
      isStatic: true,
      isSensor: true,
      render: { visible: false }
    });

    Matter.World.add(this.physics.world, attractor);
    this.physics.attractors.push(attractor);

    return attractor;
  }

  removeParticle(particle: Matter.Body): void {
    Matter.World.remove(this.physics.world, particle);
    const index = this.physics.particles.indexOf(particle);
    if (index > -1) {
      this.physics.particles.splice(index, 1);
    }
  }

  removeAttractor(attractor: Matter.Body): void {
    Matter.World.remove(this.physics.world, attractor);
    const index = this.physics.attractors.indexOf(attractor);
    if (index > -1) {
      this.physics.attractors.splice(index, 1);
    }
  }

  // Apply magnetic force to particles near cursor
  applyMagneticForce(): void {
    if (!this.physics.cursorBody) return;

    const cursorPos = this.physics.cursorBody.position;
    const magneticRange = 100;

    // Only apply to particles that are close enough to avoid unnecessary calculations
    this.physics.particles.forEach(particle => {
      const distance = Matter.Vector.magnitude(
        Matter.Vector.sub(particle.position, cursorPos)
      );

      if (distance < magneticRange && distance > 5) { // Avoid applying force when too close
        const force = Matter.Vector.sub(cursorPos, particle.position);
        const normalizedForce = Matter.Vector.normalise(force);
        const strength = (magneticRange - distance) / magneticRange * 0.01;
        
        Matter.Body.applyForce(particle, particle.position, {
          x: normalizedForce.x * strength,
          y: normalizedForce.y * strength
        });
      }
    });
  }

  // Create explosion effect
  createExplosion(x: number, y: number, intensity: number = 5): void {
    for (let i = 0; i < intensity; i++) {
      const angle = (Math.PI * 2 * i) / intensity;
      const velocity = {
        x: Math.cos(angle) * 0.02,
        y: Math.sin(angle) * 0.02
      };

      this.createParticle(x, y, {
        velocity,
        render: {
          fillStyle: '#ef4444',
          strokeStyle: '#dc2626'
        }
      });
    }
  }

  // Create ripple effect
  createRipple(x: number, y: number, radius: number = 50): void {
    const particles = 12;
    for (let i = 0; i < particles; i++) {
      const angle = (Math.PI * 2 * i) / particles;
      const startX = x + Math.cos(angle) * radius;
      const startY = y + Math.sin(angle) * radius;
      
      this.createParticle(startX, startY, {
        velocity: {
          x: Math.cos(angle) * 0.01,
          y: Math.sin(angle) * 0.01
        },
        render: {
          fillStyle: '#8b5cf6',
          strokeStyle: '#7c3aed'
        }
      });
    }
  }

  start(): void {
    if (!this.isInitialized) return;
    
    // Use the new Runner API instead of deprecated Engine.run
    Matter.Runner.run(this.physics.engine);
    
    if (this.physics.render) {
      Matter.Render.run(this.physics.render);
    }
  }

  stop(): void {
    if (this.physics.render) {
      Matter.Render.stop(this.physics.render);
    }
    
    // Clear the engine instead of using non-existent Runner.stop
    Matter.Engine.clear(this.physics.engine);
  }

  getEngine(): Matter.Engine {
    return this.physics.engine;
  }

  getWorld(): Matter.World {
    return this.physics.world;
  }

  getParticles(): Matter.Body[] {
    return this.physics.particles;
  }

  getElementBodies(): Map<HTMLElement, Matter.Body> {
    return this.physics.elementBodies;
  }

  // Test method to verify physics engine is running
  testPhysics(): void {
    console.log('🧪 Physics engine test:', {
      isInitialized: this.isInitialized,
      engineRunning: this.physics.engine.enabled,
      worldBodies: this.physics.world.bodies.length,
      elementBodies: this.physics.elementBodies.size,
      particles: this.physics.particles.length
    });
    
    // Create a test collision
    if (this.physics.cursorBody) {
      const testBody = Matter.Bodies.rectangle(200, 200, 50, 50, {
        isStatic: true,
        isSensor: true,
        render: { visible: false }
      });
      
      // Add element reference
      (testBody as any).element = { tagName: 'TEST', className: 'test-element' };
      
      Matter.World.add(this.physics.world, testBody);
      
      // Move cursor to test collision
      Matter.Body.setPosition(this.physics.cursorBody, { x: 200, y: 200 });
      
      console.log('🧪 Test collision setup complete');
    }
  }

  // Create Matter.js body for DOM element
  createElementBody(element: HTMLElement): Matter.Body | null {
    const rect = element.getBoundingClientRect();
    console.log('📐 Element rect:', {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top
    });
    
    if (rect.width === 0 || rect.height === 0) {
      console.log('❌ Element has zero dimensions, skipping body creation');
      return null;
    }

    const body = Matter.Bodies.rectangle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      rect.width,
      rect.height,
      {
        isStatic: true,
        isSensor: true,
        render: { visible: false }
      }
    );

    console.log('🔧 Created body with ID:', body.id);

    // Store reference to the element
    (body as any).element = element;
    Matter.World.add(this.physics.world, body);
    this.physics.elementBodies.set(element, body);
    
    console.log('✅ Body added to world, total element bodies:', this.physics.elementBodies.size);
    return body;
  }

  // Remove element body
  removeElementBody(element: HTMLElement): void {
    const body = this.physics.elementBodies.get(element);
    if (body) {
      Matter.World.remove(this.physics.world, body);
      this.physics.elementBodies.delete(element);
    }
  }

  // Set up collision detection
  setupCollisionDetection(onCollision: (element: HTMLElement) => void): void {
    console.log('🔧 Setting up collision detection...');
    
    // Use both collisionStart and collisionActive for better detection
    Matter.Events.on(this.physics.engine, 'collisionStart', (event) => {
      console.log('💥 Collision START event detected, pairs:', event.pairs.length);
      this.handleCollisionEvent(event, onCollision);
    });
    
    Matter.Events.on(this.physics.engine, 'collisionActive', (event) => {
      console.log('💥 Collision ACTIVE event detected, pairs:', event.pairs.length);
      this.handleCollisionEvent(event, onCollision);
    });
    
    console.log('✅ Collision detection setup complete');
  }
  
  private handleCollisionEvent(event: any, onCollision: (element: HTMLElement) => void): void {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;
      
      console.log('🔍 Checking collision between:', {
        bodyA: bodyA.id,
        bodyB: bodyB.id,
        cursorBody: this.physics.cursorBody?.id
      });
      
      // Check if cursor is involved in collision
      if (bodyA === this.physics.cursorBody || bodyB === this.physics.cursorBody) {
        const otherBody = bodyA === this.physics.cursorBody ? bodyB : bodyA;
        
        console.log('🎯 Cursor collision detected with body:', otherBody.id);
        
        // Check if the other body has an element reference
        if ((otherBody as any).element) {
          const element = (otherBody as any).element as HTMLElement;
          console.log('✅ Element found, calling collision handler');
          onCollision(element);
        } else {
          console.log('❌ No element reference found on body');
        }
      }
    }
  }

  cleanup(): void {
    this.stop();
    this.physics.particles.forEach(particle => this.removeParticle(particle));
    this.physics.attractors.forEach(attractor => this.removeAttractor(attractor));
    this.physics.elementBodies.forEach((body, element) => this.removeElementBody(element));
  }
}

// Utility functions for common physics effects
export const createCursorTrail = (physics: CursorPhysicsEngine, x: number, y: number): void => {
  physics.createParticle(x, y, {
    render: {
      fillStyle: '#06b6d4',
      strokeStyle: '#0891b2'
    }
  });
};

export const createClickEffect = (physics: CursorPhysicsEngine, x: number, y: number): void => {
  physics.createExplosion(x, y, 8);
  physics.createRipple(x, y, 30);
};

export const createHoverEffect = (physics: CursorPhysicsEngine, x: number, y: number): void => {
  physics.createParticle(x, y, {
    render: {
      fillStyle: '#10b981',
      strokeStyle: '#059669'
    }
  });
};