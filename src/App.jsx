// App.jsx — Single‑file React portfolio (clean, dark‑mode, Netlify‑friendly)
// TailwindCSS is used for styling. You can paste this into a Vite React project as src/App.jsx.
// Replace the placeholder PROFILE_IMG with your actual image URL or import.

import { useEffect, useMemo, useState, useRef } from "react";
import { Github, Linkedin, Mail, Moon, Sun, ExternalLink, Calendar, MapPin, BadgeCheck, ChevronDown } from "lucide-react";

// -----------------------------
// SCROLL ANIMATIONS & EFFECTS
// -----------------------------
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return scrollY;
}

function useIntersectionObserver() {
  const [visibleElements, setVisibleElements] = useState(new Set());
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '-50px' }
    );
    
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return visibleElements;
}
// -----------------------------
// THEME (dark mode with localStorage)
// -----------------------------
function useTheme() {
  const [theme, setTheme] = useState(() => (
    typeof window !== "undefined" && localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? "dark"
        : "light"
  ));

  useEffect(() => {
    if (!document?.documentElement) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

// -----------------------------
// DATA — edit these to your real info
// -----------------------------
const PROFILE_IMG = "/img/sahir-headshot.JPEG"; 
const HOT_LINKS = [
  { label: "sahirsood@gmail.com", href: "mailto:sahirsood@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/SahirSood", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahir-sood/", icon: Linkedin },
];

const PROJECTS = [
  {
    title: "Spotify Playlist Generator",
    img: "/img/spotify-project.png",
    description: "A Real Time Playlist Generator that creates personalized Spotify playlists based on user mood and preferences.",
    date: "Mar 2025 - Present",
    stack: ["Python", "React", "Node.JS", "AWS", "OpenAI API", "GitHub Actions"],
    repo: "https://github.com/SahirSood/Spotify-Playlist-Generator"
  },
  {
    title: "BeerIQ",
    img: "https://thumbs.dreamstime.com/b/cartoon-style-illustration-pint-glass-filled-golden-beer-topped-frothy-white-head-slightly-overflows-365646594.jpg",
    description: "A Beer Based Social Media Platform that allows users to share reviews, rate beers, and discover new breweries",
    date: "Oct – Dec 2024",
    stack: ["Kotlin", "Firebase", "Android Studio", "Google Maps API", "Python"],
    repo: "https://github.com/SahirSood/BeerIQ/tree/main"
  },
  {
    title: "TripMate",
    img: "/img/tripmate-logo.png",
    description: "A travel planning app that helps users organize trips, share itineraries, and discover new destinations.",
    date: "Oct – Dec 2023",
    stack: ["Ruby", "Rails", "PostgreSQL", "WebSocets"],
    repo: "https://github.com/your-github/heart-regression"
  },
  {
    title: "Financial Fast Feed",
    img: "/img/fff.jpg",
    description: "Built login and bookmark system enabling users to save and revisit articles from the personalized news feed.",
    date: "Jan-Apr 2025",
    stack: ["React", "Postman", "Node.JS", "Flask", "RESTful APIs"],
    repo: "https://github.com/SahirSood/financial-fast-feed"
  },
    {
    title: "Sensor Movement Data Analysis",
    img: "/img/kmeans.png",
    description: "Developed ML models using smartphone sensor data to detect human activities.",
    date: "Feb-Mar 2025",
    stack: ["Python", "Pandas", "Matplotlib", "Scokit-learn"],
    repo: ""
  },
  {
    title: "Apocolypse Rerising",
    img: "/img/img-zmb.jpg",
    description: "A 2D zombie survival game with wave-based enemies and power-ups.",
    date: "Dec 2022",
    stack: ["Python", "Pygame"],
    repo: "https://github.com/SahirSood/Apocalypse-Rerising/commits/main/"
  },
  {
    title: "Fall Hackathon Project - Endless Scroller",
    img: "/img/no-img.jpg",
    description: "An endless 2D scroller with score based obstacles and power-ups.",
    date: "Fall 2022",
    stack: ["Java", "Spring Boot", "Angular", "Docker", "Kubernetes", "PostgreSQL"],
    repo: "https://github.com/SahirSood/FallHackathonProject"
  },
];

const EXPERIENCE = [
  {
    company: "MotherTongue",
    role: "Lead Developer - Startup",
    timeframe: "May 2025 – Present",
    summary:
      "Developed a comprehensive Chrome extension for writing feedback that provides sentence-level analysis and adaptive learning capabilities. Built a responsive React UI and integrated Chrome Extension APIs to enable real-time writing analysis directly in users' browsers. Connected OpenAI API through a custom Node.js backend using specialized prompts and rule layers to deliver targeted writing suggestions. Implemented a sophisticated scoring system powered by Firestore that maps user writing patterns to adaptive course modules, creating a personalized learning experience.",
    tags: ["React", "JavaScript", "ChatGPT API", "JMeter", "Selenium", "GitHub Actions", "Chrome API", "Node.js", "Firestore"],
    logo: "/img/mothertongue-logo.jpg",
  },
  {
    company: "Kapali Developments",
    role: "Contract Software Developer",
    timeframe: "Jan – Apr 2025",
    summary:
      "Developed a comprehensive React dashboard connected to Firestore for real-time financial tracking and transparency across multiple properties and investment projects. Designed robust SQL schemas to effectively model complex financial relationships including rental income, mortgage payments, and partner equity contributions. Built a scalable backend using Node.js and Firebase Functions that automates monthly reporting processes and calculates equity splits between partners. Created a user-friendly interface that allows stakeholders to track investments, expenses, and determine who owes what across various projects and partnerships.",
    tags: ["Firestore", "React", "JavaScript", "Node.js", "Firebase Functions", "SQL"],
    logo: "/img/kapali.png",
  },

  {
    company: "Kapali Developments",
    role: "Part-time Assistant",
    timeframe: "July 2022 – September 2024",
    summary:
      "Increased client engagement by 20% through social media optimization, driving new leads for the business. Streamlined financial reporting using Excel, improving accounting accuracy and reducing reporting time by 30%. Redesigned the company website and business cards, elevating branding and enhancing client engagement. Managed on-site operations and coordinated with contractors, ensuring projects met deadlines while strengthening communication and problem-solving skills.",
    tags: ["Excel", "Social Media", "Web Design", "Project Management", "Client Relations"],
    logo: "/img/kapali.png",
  },
  {
    company: "PedalHeads",
    role: "Camp Counselor",
    timeframe: "June – August 2021",
    summary:
      "Taught bike riding skills to young children while enforcing safety protocols to build confidence. Administered first aid and independently managed injuries, ensuring camper safety and well-being. Resolved camper behavioral challenges through creative problem-solving, maintaining a positive environment for 25+ children and earning parent praise. Engaged proactively with parents to address concerns and maintain clear communication, fostering trust and positive feedback from families and management.",
    tags: ["Leadership", "First Aid", "Communication", "Problem Solving", "Child Safety"],
    logo: "/img/pedalheads.jpg",
  },
];

// -----------------------------
// UI PRIMITIVES
// -----------------------------
function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 lg:px-8 ${className}`}>{children}</div>
  );
}

function Section({ id, children, className = "", animate = true }) {
  return (
    <section 
      id={id} 
      data-animate={animate}
      className={`min-h-screen flex items-center justify-center py-20 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full border border-emerald-300/40 bg-emerald-50/60 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
      {children}
    </span>
  );
}

function Tech({ label }) {
  return (
    <span className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:shadow-sm dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
      {label}
    </span>
  );
}

// -----------------------------
// HEADER + NAV (Fixed & Floating)
// -----------------------------
function Header() {
  const { theme, setTheme } = useTheme();
  const scrollY = useScrollAnimation();
  
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const links = [
    { key: "home", label: "Home" },
    { key: "projects", label: "Projects" },
    { key: "experience", label: "Experience" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrollY > 50 
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:bg-slate-950/80 dark:border-slate-800/50' 
        : 'bg-transparent'
    }`}>
      <Container>
        <div className="flex flex-wrap items-center justify-between py-4 md:py-6 gap-2 md:gap-0">
          <button 
            onClick={() => scrollToSection('home')}
            className={`text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ${
              scrollY > 50 
                ? 'text-slate-900 dark:text-white' 
                : 'text-slate-900 dark:text-white drop-shadow-lg'
            } hover:scale-105`}
            style={{minWidth: 0, overflowWrap: 'break-word'}}
          >
            <span className={scrollY > 50 ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white drop-shadow-lg'}>
              Sahir Sood
            </span>
          </button>
          <div className="flex flex-wrap items-center gap-1 w-full md:w-auto justify-center md:justify-end">
            {links.map(link => (
              <button
                key={link.key}
                onClick={() => scrollToSection(link.key)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  scrollY > 50
                    ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    : 'text-slate-700 hover:bg-slate-100/50 dark:text-white/90 dark:hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`ml-2 p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-105 ${
                scrollY > 50
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  : 'bg-slate-100/80 text-slate-700 dark:bg-white/10 dark:text-white backdrop-blur-sm'
              }`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

// -----------------------------
// HERO SECTION (Professional & Clean)
// -----------------------------
function HeroSection() {
  const scrollY = useScrollAnimation();
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has('home');
  
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section 
      id="home" 
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/50 dark:to-slate-950 min-h-screen"
    >
      {/* Animated Background - More Subtle */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />
        <div className="absolute top-1/4 right-1/4 w-60 h-60 md:w-96 md:h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-80 md:h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Text Content */}
            <div className={`text-slate-900 dark:text-white space-y-6 md:space-y-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight whitespace-nowrap max-w-full overflow-x-auto">
                  Hi! I'm{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Sahir Sood
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 md:mt-6 text-slate-600 dark:text-slate-200 font-light">
                  4th Year Computer Science Student @ SFU
                </p>
              </div>

              {/* Contact Links - Colorful & Eye-catching */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                {HOT_LINKS.map(({ label, href, icon: Icon }, index) => {
                  const colors = [
                    'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25',
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25',
                    'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg shadow-pink-500/25'
                  ];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-xs md:text-sm ${colors[index]}`}
                    >
                      <Icon size={16} className="md:!hidden" />
                      <Icon size={18} className="hidden md:inline group-hover:scale-110 transition-transform" />
                      <span className="font-medium truncate max-w-[120px] md:max-w-none">
                        {label}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* About Section - Left Aligned & Clean */}
              <div className="space-y-4 md:space-y-6 text-slate-700 dark:text-slate-100 leading-relaxed max-w-lg text-sm sm:text-base md:text-lg">
                <p>
                  An Intro to CS elective completely shifted my path. What started as curiosity quickly turned into a real passion for 
                  <span className="font-medium"> solving problems</span>, 
                  which led me to transfer into the joint CS and Business program at SFU.
                </p>
                <p>
                  Since then I've built projects that tested both my technical skills and my ability to collaborate. I enjoy 
                  <span className="font-medium"> backend systems and data-driven development</span>, 
                  but what stands out most to me is how much 
                  <span className="font-medium"> teamwork and adaptability </span> 
                  shape the success of a project.
                </p>
                <p>
                  Outside of coding I keep balance through 
                  <span className="font-medium"> basketball, travel, and exploring the outdoors</span>. 
                  These experiences keep me grounded and help me bring a genuine perspective into the work I do.
                </p>
              </div>

              {/* Scroll Indicator */}
              <button 
                onClick={scrollToProjects}
                className="group flex items-center gap-2 md:gap-3 text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors mt-6 md:mt-8 text-xs md:text-sm"
              >
                <span className="font-medium">Explore My Work</span>
                <ChevronDown size={18} className="md:hidden" />
                <ChevronDown size={20} className="hidden md:inline group-hover:translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Right: Profile Image - Centered & Prominent */}
            <div className={`flex justify-center lg:justify-end transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}>
              <div className="relative">
                {/* Gradient Background Ring */}
                <div className="absolute -inset-6 md:-inset-12 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-2xl md:blur-3xl animate-pulse" 
                     style={{ animationDuration: '4s' }} />
                {/* Outer Ring */}
                <div className="absolute -inset-3 md:-inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full opacity-20 blur-sm" />
                {/* Main Image */}
                <div className="relative">
                  <img
                    src={PROFILE_IMG}
                    alt="Sahir Sood"
                    className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-full border-4 border-white/10 shadow-2xl hover:scale-105 transition-all duration-500 hover:border-white/20"
                    style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Section>
  );
}

// -----------------------------
// PROJECTS SECTION (Animated Grid)
// -----------------------------
function ProjectCard({ p, index }) {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has('projects');
  
  return (
    <a
      href={p.repo}
      target="_blank"
      rel="noreferrer"
      className={`group block transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:-translate-y-2">
        {/* Image with overlay */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={p.img} 
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink size={20} className="text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {p.title}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar size={14} /> {p.date}
            </span>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {p.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {p.stack.map((tech, i) => (
              <Tech key={tech} label={tech} />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

function ProjectsSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has('projects');
  
  return (
    <Section 
      id="projects" 
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900"
    >
      <div className="w-full">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A showcase of my technical work spanning various domains and technologies
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} p={project} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}

// -----------------------------
// EXPERIENCE SECTION (Timeline Style)
// -----------------------------
function ExperienceCard({ e, index, isLast }) {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has('experience');
  
  return (
    <div className={`relative transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
    }`}
    style={{ transitionDelay: `${index * 200}ms` }}>
      
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-24 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-30" />
      )}
      
      {/* Timeline dot */}
      <div className="absolute left-4 top-8 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg" />
      
      {/* Content card */}
      <div className="ml-16 group">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]">
          
          <div className="p-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src={e.logo} 
                  alt={`${e.company} logo`}
                  className="relative w-16 h-16 object-contain rounded-xl bg-white dark:bg-slate-800 p-2 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {e.company}
                </h3>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {e.role}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar size={14} /> {e.timeframe}
                </p>
              </div>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              {e.summary}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {e.tags.map((tag) => (
                <Tech key={tag} label={tag} />
              ))}
            </div>
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function ExperienceSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has('experience');
  
  return (
    <Section 
      id="experience" 
      className="bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-purple-950/20 dark:via-slate-900 dark:to-pink-950/20"
    >
      <div className="w-full">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Professional{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            My journey through various roles in technology and development
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto space-y-12">
          {EXPERIENCE.map((exp, index) => (
            <ExperienceCard 
              key={`${exp.company}-${exp.role}`} 
              e={exp} 
              index={index}
              isLast={index === EXPERIENCE.length - 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

// -----------------------------
// FOOTER (Elegant & Minimal)
// -----------------------------
function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20">
      <Container>
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-3xl font-bold mb-4">
              Let's{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Connect
              </span>
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Always excited to discuss new opportunities and collaborate on interesting projects.
            </p>
          </div>
          
          <div className="flex justify-center gap-8">
            {HOT_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <Icon size={24} className="group-hover:scale-110 transition-transform text-slate-300 group-hover:text-white" />
                <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                  {label}
                </span>
              </a>
            ))}
          </div>
          
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400">
                © {new Date().getFullYear()} Sahir Sood. Crafted with passion.
              </p>
              <a 
                href="https://github.com/SahirSood/portfolio" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors hover:text-purple-400"
              >
                <Github size={16} />
                View Source
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// -----------------------------
// MAIN APP (Single Page Scroll Experience)
// -----------------------------
export default function App() {
  useEffect(() => {
    // Smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}

// -----------------------------
// QUICK START (Vite + Tailwind + Netlify)
// 1) npm create vite@latest sahir-portfolio -- --template react
// 2) cd sahir-portfolio && npm i && npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
// 3) tailwind.config.js:  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],  theme: { extend: {} },  plugins: []
// 4) src/index.css: @tailwind base; @tailwind components; @tailwind utilities;
// 5) Replace src/App.jsx with this file. Update links, images, and data.
// 6) Netlify deploy: push to GitHub, then "New site from Git" → build command: npm run build → publish dir: dist
//    Optional for client routing: create public/_redirects with line:  /*  /index.html  200
