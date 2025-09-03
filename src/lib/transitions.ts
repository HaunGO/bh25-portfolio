import gsap from 'gsap';

export interface TransitionConfig {
  duration: number;
  ease: string;
  stagger?: number;
  delay?: number;
}

export interface TransitionElements {
  main: HTMLElement;
  title?: HTMLElement;
  content?: HTMLElement;
  background?: HTMLElement;
}

// Predefined transition effects
export const transitions = {
  // Simple fade transition
  fade: {
    in: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline({ delay: config.delay || 0 });
      
      tl.set(elements.main, { opacity: 0, y: 20 })
        .to(elements.main, {
          opacity: 1,
          y: 0,
          duration: config.duration,
          ease: config.ease
        });
      
      return tl;
    },
    out: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline();
      
      tl.to(elements.main, {
        opacity: 0,
        y: -20,
        duration: config.duration,
        ease: config.ease
      });
      
      return tl;
    }
  },

  // Slide transition with content stagger
  slide: {
    in: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline({ delay: config.delay || 0 });
      
      // Set initial states
      tl.set(elements.main, { opacity: 0, x: -50 })
        .set(elements.title, { opacity: 0, y: 30 })
        .set(elements.content, { opacity: 0, y: 20 });
      
      // Animate in sequence
      tl.to(elements.main, {
        opacity: 1,
        x: 0,
        duration: config.duration,
        ease: config.ease
      })
      .to(elements.title, {
        opacity: 1,
        y: 0,
        duration: config.duration * 0.8,
        ease: config.ease
      }, '-=0.2')
      .to(elements.content, {
        opacity: 1,
        y: 0,
        duration: config.duration * 0.8,
        ease: config.ease,
        stagger: config.stagger || 0.1
      }, '-=0.3');
      
      return tl;
    },
    out: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline();
      
      tl.to([elements.title, elements.content], {
        opacity: 0,
        y: -20,
        duration: config.duration * 0.6,
        ease: config.ease,
        stagger: 0.05
      })
      .to(elements.main, {
        opacity: 0,
        x: 50,
        duration: config.duration,
        ease: config.ease
      }, '-=0.2');
      
      return tl;
    }
  },

  // Scale transition with background effect
  scale: {
    in: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline({ delay: config.delay || 0 });
      
      tl.set(elements.main, { opacity: 0, scale: 0.95 })
        .set(elements.background, { opacity: 0, scale: 1.1 });
      
      tl.to(elements.background, {
        opacity: 1,
        scale: 1,
        duration: config.duration * 1.2,
        ease: config.ease
      })
      .to(elements.main, {
        opacity: 1,
        scale: 1,
        duration: config.duration,
        ease: config.ease
      }, '-=0.3');
      
      return tl;
    },
    out: (elements: TransitionElements, config: TransitionConfig) => {
      const tl = gsap.timeline();
      
      tl.to(elements.main, {
        opacity: 0,
        scale: 1.05,
        duration: config.duration,
        ease: config.ease
      })
      .to(elements.background, {
        opacity: 0,
        scale: 0.9,
        duration: config.duration * 0.8,
        ease: config.ease
      }, '-=0.2');
      
      return tl;
    }
  }
};

// Helper function to create custom transitions
export function createCustomTransition(
  inAnimation: (elements: TransitionElements, config: TransitionConfig) => gsap.core.Timeline,
  outAnimation: (elements: TransitionElements, config: TransitionConfig) => gsap.core.Timeline
) {
  return {
    in: inAnimation,
    out: outAnimation
  };
}

// Default transition configuration
export const defaultConfig: TransitionConfig = {
  duration: 0.4,
  ease: 'power2.out',
  stagger: 0.1,
  delay: 0.1
};
