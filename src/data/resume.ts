import { ResumeData } from '@/types/resume';

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Brandon H',
    title: 'Senior Frontend / Creative Developer',
    email: 'brandon@example.com',
    location: 'San Francisco, CA',
    website: 'https://bh25.dev',
    linkedin: 'https://linkedin.com/in/brandonh',
    github: 'https://github.com/brandonh',
    summary: 'Creative developer passionate about building beautiful, interactive experiences that combine artistic vision with technical excellence. Specializing in modern web technologies, motion graphics, and 3D web experiences.'
  },
  skills: [
    // Frontend
    { id: 'react', name: 'React', category: 'frontend', proficiency: 'expert', years: 5, description: 'Building complex, performant user interfaces with hooks, context, and modern patterns' },
    { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 'expert', years: 4, description: 'Full-stack React framework with SSR, SSG, and API routes' },
    { id: 'typescript', name: 'TypeScript', category: 'frontend', proficiency: 'advanced', years: 4, description: 'Type-safe JavaScript development with advanced patterns' },
    { id: 'tailwind', name: 'TailwindCSS', category: 'frontend', proficiency: 'expert', years: 3, description: 'Utility-first CSS framework for rapid UI development' },
    { id: 'gsap', name: 'GSAP', category: 'frontend', proficiency: 'advanced', years: 3, description: 'Professional-grade animations and motion graphics' },
    { id: 'threejs', name: 'Three.js', category: 'frontend', proficiency: 'intermediate', years: 2, description: '3D graphics and WebGL experiences' },
    
    // Backend
    { id: 'nodejs', name: 'Node.js', category: 'backend', proficiency: 'intermediate', years: 2, description: 'Server-side JavaScript development' },
    { id: 'express', name: 'Express', category: 'backend', proficiency: 'intermediate', years: 2, description: 'Web application framework for Node.js' },
    
    // Design
    { id: 'figma', name: 'Figma', category: 'design', proficiency: 'advanced', years: 3, description: 'UI/UX design and prototyping' },
    { id: 'adobe', name: 'Adobe Creative Suite', category: 'design', proficiency: 'intermediate', years: 2, description: 'Photoshop, Illustrator, After Effects' },
    
    // Tools
    { id: 'git', name: 'Git', category: 'tools', proficiency: 'advanced', years: 5, description: 'Version control and collaboration' },
    { id: 'vercel', name: 'Vercel', category: 'tools', proficiency: 'advanced', years: 3, description: 'Deployment and hosting platform' },
    { id: 'webpack', name: 'Webpack', category: 'tools', proficiency: 'intermediate', years: 2, description: 'Module bundling and build optimization' }
  ],
  experience: [
    {
      id: 'current',
      company: 'Creative Studio',
      position: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      type: 'full-time',
      description: 'Lead frontend development for high-profile client projects, specializing in interactive web experiences and motion graphics.',
      achievements: [
        'Built 15+ interactive portfolio websites with custom animations',
        'Improved site performance by 40% through optimization techniques',
        'Mentored 3 junior developers on modern React patterns',
        'Led technical architecture decisions for complex client projects'
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'GSAP', 'Three.js', 'TailwindCSS']
    },
    {
      id: 'previous',
      company: 'Digital Agency',
      position: 'Frontend Developer',
      location: 'Remote',
      startDate: '2020',
      endDate: '2022',
      type: 'full-time',
      description: 'Developed responsive web applications and interactive experiences for diverse client portfolio.',
      achievements: [
        'Delivered 20+ client projects on time and within budget',
        'Implemented accessibility best practices across all projects',
        'Collaborated with design team to create pixel-perfect implementations',
        'Optimized build processes reducing deployment time by 50%'
      ],
      technologies: ['React', 'Vue.js', 'JavaScript', 'SCSS', 'Webpack', 'Git']
    },
    {
      id: 'freelance',
      company: 'Various Clients',
      position: 'Freelance Developer',
      location: 'Remote',
      startDate: '2019',
      endDate: '2020',
      type: 'freelance',
      description: 'Provided frontend development services for small businesses and startups.',
      achievements: [
        'Built custom WordPress themes and plugins',
        'Created responsive websites for local businesses',
        'Established long-term client relationships',
        'Developed expertise in multiple frameworks'
      ],
      technologies: ['WordPress', 'PHP', 'JavaScript', 'CSS', 'jQuery']
    }
  ],
  education: [
    {
      id: 'university',
      institution: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.8',
      relevantCoursework: [
        'Data Structures and Algorithms',
        'Web Development',
        'Human-Computer Interaction',
        'Software Engineering',
        'Computer Graphics'
      ],
      achievements: [
        'Dean\'s List for 3 consecutive semesters',
        'President of Web Development Club',
        'Completed senior capstone project on interactive web experiences'
      ]
    }
  ],
  projects: [
    {
      id: 'portfolio',
      name: 'Interactive Portfolio Website',
      description: 'Modern portfolio website with advanced animations, 3D elements, and smooth transitions built with Next.js and GSAP.',
      technologies: ['Next.js', 'TypeScript', 'GSAP', 'Three.js', 'TailwindCSS'],
      url: 'https://bh25.dev',
      github: 'https://github.com/brandonh/portfolio',
      featured: true
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with custom animations, payment integration, and admin dashboard.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
      featured: true
    },
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      description: 'Real-time data visualization dashboard with interactive charts and responsive design.',
      technologies: ['Vue.js', 'D3.js', 'WebSocket', 'SCSS'],
      featured: false
    }
  ],
  certifications: [
    'AWS Certified Cloud Practitioner',
    'Google Analytics Certified',
    'Accessibility Fundamentals (WCAG 2.1)'
  ]
};
