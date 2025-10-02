import { ResumeData } from '@/types/resume';

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Brandon Haun',
    title: 'Senior Frontend Engineer & Creative Developer',
    email: 'Hello@BrandonHaun.com',
    phone: '(865) 257-9123',
    location: 'Chicago, IL (Remote)',
    website: 'https://www.BrandonHaun.com',
    linkedin: 'https://linkedin.com/in/brandonhaun',
    github: undefined,
    summary:
      '20+ years of creative web experience building accessible, high-performance UX. Skilled in translating complex creative designs into smooth, interactive, production-ready applications, with expertise in scalable component architecture, accessibility, and SEO. Exploring generative AI and agentic workflows to accelerate development, and proven contributor to Agile remote teams through collaboration, code reviews, and performance optimization.'
  },
  skills: [
    // Frontend
    { id: 'html', name: 'HTML5', category: 'frontend', proficiency: 'expert' },
    { id: 'css', name: 'CSS3', category: 'frontend', proficiency: 'expert' },
    { id: 'js', name: 'JavaScript (ES6+)', category: 'frontend', proficiency: 'expert' },
    { id: 'ts', name: 'TypeScript', category: 'frontend', proficiency: 'advanced' },
    { id: 'php', name: 'PHP', category: 'backend', proficiency: 'intermediate' },

    // Frameworks & Libraries
    { id: 'react', name: 'React', category: 'frontend', proficiency: 'expert' },
    { id: 'nextjs', name: 'Next.js', category: 'frontend', proficiency: 'advanced' },
    { id: 'angular', name: 'Angular', category: 'frontend', proficiency: 'advanced' },
    { id: 'vue', name: 'Vue.js', category: 'frontend', proficiency: 'advanced' },
    { id: 'wordpress', name: 'WordPress', category: 'backend', proficiency: 'advanced' },
    { id: 'drupal', name: 'Drupal', category: 'backend', proficiency: 'intermediate' },

    // State Management & Testing
    { id: 'redux', name: 'Redux', category: 'frontend', proficiency: 'advanced' },
    { id: 'mobx', name: 'MobX', category: 'frontend', proficiency: 'intermediate' },
    { id: 'context', name: 'Context API', category: 'frontend', proficiency: 'advanced' },
    { id: 'jest', name: 'Jest', category: 'tools', proficiency: 'advanced' },
    { id: 'rtl', name: 'React Testing Library', category: 'tools', proficiency: 'advanced' },

    // Styling & UI
    { id: 'tailwind', name: 'TailwindCSS', category: 'frontend', proficiency: 'advanced' },
    { id: 'styled-components', name: 'Styled Components', category: 'frontend', proficiency: 'advanced' },
    { id: 'bem', name: 'BEM', category: 'frontend', proficiency: 'advanced' },
    { id: 'smacss', name: 'SMACSS', category: 'frontend', proficiency: 'advanced' },

    // Build & Tooling
    { id: 'webpack', name: 'Webpack', category: 'tools', proficiency: 'advanced' },
    { id: 'vite', name: 'Vite', category: 'tools', proficiency: 'intermediate' },
    { id: 'babel', name: 'Babel', category: 'tools', proficiency: 'advanced' },
    { id: 'eslint', name: 'ESLint', category: 'tools', proficiency: 'advanced' },
    { id: 'prettier', name: 'Prettier', category: 'tools', proficiency: 'advanced' },
    { id: 'npm', name: 'npm/yarn', category: 'tools', proficiency: 'advanced' },

    // Performance & Accessibility
    { id: 'wcag', name: 'WCAG Compliance', category: 'other', proficiency: 'advanced' },
    { id: 'web-vitals', name: 'Web Vitals', category: 'other', proficiency: 'advanced' },
    { id: 'progressive', name: 'Progressive Enhancement', category: 'other', proficiency: 'advanced' },

    // Tools & Platforms
    { id: 'git', name: 'Git (GitHub, BitBucket)', category: 'tools', proficiency: 'expert' },
    { id: 'docker', name: 'Docker', category: 'tools', proficiency: 'intermediate' },
    { id: 'vscode', name: 'VS Code', category: 'tools', proficiency: 'expert' },
    { id: 'atlassian', name: 'Atlassian Suite', category: 'tools', proficiency: 'advanced' },
    { id: 'figma', name: 'Figma', category: 'design', proficiency: 'advanced' },
    { id: 'adobe', name: 'Adobe Creative Suite', category: 'design', proficiency: 'intermediate' },
    { id: 'ci', name: 'CI/CD Pipelines', category: 'tools', proficiency: 'intermediate' },

    // AI & Automation
    { id: 'copilot', name: 'GitHub Copilot', category: 'tools', proficiency: 'intermediate' },
    { id: 'cursor', name: 'Cursor', category: 'tools', proficiency: 'intermediate' },
    { id: 'genai', name: 'Generative AI', category: 'other', proficiency: 'intermediate' },
    { id: 'agentic', name: 'Agentic Workflows', category: 'other', proficiency: 'intermediate' },
    { id: 'prompt', name: 'Prompt Engineering', category: 'other', proficiency: 'intermediate' }
  ],
  experience: [
    {
      id: 'wolters',
      company: 'Wolters Kluwer Health',
      position: 'Senior Product Software Engineer',
      location: 'Chicago, IL (Remote)',
      startDate: '2023',
      endDate: '2025',
      type: 'full-time',
      description:
        'Built and maintained accessible, high-performance UIs using React and Angular. Led frontend architecture and component development with a focus on usability, maintainability, and scalability.',
      achievements: [
        'Worked within an Agile Scrum process: daily standups, sprint planning, and retrospectives',
        'Conducted and participated in code reviews to ensure code quality and team alignment',
        'Implemented performance improvements and integrated into testing workflows',
        'Explored and applied GitHub Copilot and generative AI to accelerate development and improve team productivity'
      ],
      technologies: ['React', 'Angular', 'TypeScript', 'GitHub Copilot', 'Jest']
    },
    {
      id: 'tombras',
      company: 'Tombras',
      position: 'Senior Software Engineer',
      location: 'Knoxville, TN | Atlanta, GA | New York, NY',
      startDate: '2016',
      endDate: '2023',
      type: 'full-time',
      description:
        'Developed and maintained custom WordPress themes, plugins, and Gutenberg blocks for clients as well as internal component libraries. Leveraged Vue and React to create apps and components.',
      achievements: [
        'Presented project demos, feature tutorials, and documentation to clients',
        'Built design systems for custom branded themes',
        'Delivered solutions for clients including Krusteaz, UT Medical Center, MoonPie, World Food Program, NADA, Lodge Cast Iron, My First Farmers Bank'
      ],
      technologies: ['WordPress', 'PHP', 'Vue.js', 'React', 'JavaScript', 'CSS']
    },
    {
      id: 'pagetree',
      company: 'PageTree Inc.',
      position: 'Lead Frontend Developer',
      location: 'Charleston, SC',
      startDate: '2014',
      endDate: '2016',
      type: 'full-time',
      description:
        'Spearheaded design, development, and maintenance of websites, templates, and modules with CMS integration. Developed applications using SMACSS and BEM for responsive, device-agnostic websites.',
      achievements: [
        'Championed customization and optimization of PageTree CMS as a web-based platform',
        'Delivered solutions for clients including Nitro World Games, Scott Flyrods, EP Flies'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'SMACSS', 'BEM', 'CMS']
    },
    {
      id: 'pario',
      company: 'PARIO Inc.',
      position: 'Interactive Designer & Developer',
      location: 'Atlanta, GA',
      startDate: '2005',
      endDate: '2007, 2010–2014',
      type: 'full-time',
      description:
        'Created interactive multimedia e-learning modules for the U.S. Army Comprehensive Soldier Fitness program. Enhanced UX with custom graphics, animations, audio, and video.',
      achievements: [
        'Orchestrated design and delivery of engaging training modules',
        'Reinforced training concepts with multimedia interactivity'
      ],
      technologies: ['Flash', 'ActionScript', 'HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'dnp',
      company: 'Davis Newman Payne',
      position: 'Interactive Art Director',
      location: 'Knoxville, TN',
      startDate: '2008',
      endDate: '2010',
      type: 'full-time',
      description:
        'Created style guides and project standards for client websites and ads. Developed and maintained digital assets.',
      achievements: [
        'Served clients including The Great Smoky Mountains National Park, Boston Whaler, Food City, and Bush’s Baked Beans'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Adobe Creative Suite']
    },
    {
      id: 'macquarium',
      company: 'MacQuarium',
      position: 'Frontend Developer',
      location: 'Atlanta, GA',
      startDate: '2007',
      endDate: '2008',
      type: 'full-time',
      description:
        'Developed and maintained websites adhering to strict web standards, project style guides, and wireframes.',
      achievements: [
        'Collaborated with clients including UPS, The Home Depot, and Emory College of Arts'
      ],
      technologies: ['HTML', 'CSS', 'JavaScript']
    }
  ],
  education: [
    {
      id: 'ai',
      institution: 'The Art Institute of Atlanta',
      degree: 'Associates of Fine Arts',
      field: 'Interactive Media Development',
      location: 'Atlanta, GA',
      startDate: '2005',
      endDate: '2005',
      achievements: ['Graduated with Best Portfolio in Show']
    },
    {
      id: 'psu',
      institution: 'Pellissippi State & East Tennessee State University',
      degree: 'Coursework',
      field: 'General Studies',
      location: 'Tennessee',
      startDate: '2000',
      endDate: '2003'
    }
  ],
  projects: [],
  certifications: []
};