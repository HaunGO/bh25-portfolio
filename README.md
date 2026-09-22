# BH25 Creative Portfolio

A modern, interactive portfolio website showcasing advanced frontend development skills with motion graphics, 3D elements, and interactive storytelling.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, TailwindCSS v3
- **Advanced Animations**: GSAP-powered motion graphics and interactions
- **3D Elements**: Three.js integration for immersive experiences
- **Performance Optimized**: Lighthouse score > 90, Core Web Vitals optimization
- **Accessibility First**: WCAG AA compliance, keyboard navigation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **SEO Optimized**: Meta tags, structured data, performance metrics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v3 with custom design system
- **Animations**: GSAP (GreenSock Animation Platform)
- **3D Graphics**: Three.js for WebGL content
- **Deployment**: Vercel with custom domain
- **Performance**: Built-in Next.js optimizations

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   └── sections/       # Page-specific sections
├── lib/                # Third-party library configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bh25-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- **`npm run dev`** - Start development server with Turbopack
- **`npm run build`** - Build for production with Turbopack
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint for code quality
- **`npm run lint:fix`** - Fix ESLint issues automatically
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting
- **`npm run type-check`** - Run TypeScript type checking
- **`npm run clean`** - Clean build artifacts
- **`npm run analyze`** - Analyze bundle size

## 🎨 Design System

### Color Palette

- **Primary**: Blue tones for brand identity
- **Accent**: Purple tones for creative elements
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success, warning, and error colors

### Typography

- **Display**: Geist Sans for headings
- **Body**: Geist Sans for body text
- **Mono**: Geist Mono for code snippets

### Animations

- **Fade In**: Smooth opacity transitions
- **Slide Up**: Vertical reveal animations
- **Scale In**: Growth animations with bounce
- **Stagger**: Sequential element animations
- **Parallax**: Scroll-triggered effects

## 🔧 Configuration Files

- **`tailwind.config.ts`** - TailwindCSS configuration with custom theme
- **`.prettierrc`** - Prettier code formatting rules
- **`tsconfig.json`** - TypeScript compiler options
- **`next.config.ts`** - Next.js configuration
- **`postcss.config.mjs`** - PostCSS configuration

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column, simplified animations)
- **Tablet**: 640px - 1024px (two columns, moderate animations)
- **Desktop**: 1024px+ (multi-column, full animation suite)
- **Large**: 1280px+ (enhanced 3D, advanced interactions)

## ♿ Accessibility Features

- **WCAG AA Compliance**: Meeting accessibility standards
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Focus Management**: Visible focus indicators

## 🚀 Performance Features

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Bundle Optimization**: Code splitting and lazy loading
- **Image Optimization**: WebP format, responsive images
- **Animation Performance**: 60fps target, GPU acceleration
- **Performance Monitoring**: Built-in metrics tracking

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📊 Development Workflow

This project follows **BMAD** (Analyst → **PM** → Architect → Scrum Master → Dev → Tester).

- **PM / living spec:** `docs/PRD.md`
- **Scrum Master / status & backlog:** `docs/Backlog.md`
- **Agent prompts:** `docs/00_PM.md` … `docs/05_Tester.md`

Architecture (`docs/Architecture.md`) is flagged stale where it still assumes a site nav and contact form. Implement from the PRD and backlog, not those sections.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS framework
- **GSAP** for powerful animation capabilities
- **Three.js** for 3D graphics and WebGL support

## 📞 Contact

- **Portfolio**: [Your Portfolio URL]
- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]

---

**Built with ❤️ using Next.js, TypeScript, and TailwindCSS**
