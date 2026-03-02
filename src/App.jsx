// App.jsx — Single‑file React portfolio
import { useEffect, useState } from "react";
import {
  Github, Linkedin, Mail, Moon, Sun, ExternalLink,
  Calendar, ChevronDown, Menu, X, Send,
} from "lucide-react";

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
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
      { threshold: 0.1, rootMargin: "-40px" }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return visibleElements;
}

function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  useEffect(() => {
    if (!document?.documentElement) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

// Typewriter cycling animation
function useTypewriter(words, typeSpeed = 75, deleteSpeed = 35, pauseTime = 1800) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);
  const word = words[wordIdx % words.length];

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, pauseTime);
      return () => clearTimeout(t);
    }
    if (!deleting) {
      if (charIdx >= word.length) { setPaused(true); return; }
      const t = setTimeout(() => setCharIdx(c => c + 1), typeSpeed);
      return () => clearTimeout(t);
    } else {
      if (charIdx <= 0) {
        setDeleting(false);
        setWordIdx(i => (i + 1) % words.length);
        return;
      }
      const t = setTimeout(() => setCharIdx(c => c - 1), deleteSpeed);
      return () => clearTimeout(t);
    }
  }, [charIdx, deleting, paused, word, typeSpeed, deleteSpeed, pauseTime]);

  return word.slice(0, charIdx);
}

// Tracks which nav section is currently in view
const NAV_SECTION_IDS = ["home", "skills", "projects", "experience", "contact"];

function useActiveSection() {
  const [activeId, setActiveId] = useState("home");
  useEffect(() => {
    const update = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let current = "home";
      for (const id of NAV_SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return activeId;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PROFILE_IMG = "/img/sahir-headshot.JPEG";
const HOT_LINKS = [
  { label: "sahirsood@gmail.com", href: "mailto:sahirsood@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/SahirSood", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahir-sood/", icon: Linkedin },
];

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const SKILLS = {
  Languages: [
    { label: "Python",      icon: "python/python-original" },
    { label: "JavaScript",  icon: "javascript/javascript-original" },
    { label: "TypeScript",  icon: "typescript/typescript-original" },
    { label: "Java",        icon: "java/java-original" },
    { label: "Ruby",        icon: "ruby/ruby-original" },
    { label: "Kotlin",      icon: "kotlin/kotlin-original" },
    { label: "SQL",         icon: "mysql/mysql-original" },
    { label: "HTML/CSS",    icon: "html5/html5-original" },
  ],
  Frameworks: [
    { label: "React",        icon: "react/react-original" },
    { label: "React Native", icon: "react/react-original" },
    { label: "Node.js",      icon: "nodejs/nodejs-original" },
    { label: "Rails",        icon: "rails/rails-original-wordmark" },
    { label: "Flask",        icon: "flask/flask-original" },
    { label: "Firebase",     icon: "firebase/firebase-plain" },
    { label: "Android",      icon: "android/android-plain" },
    { label: "Angular",      icon: "angularjs/angularjs-original" },
  ],
  Tools: [
    { label: "AWS",         icon: "amazonwebservices/amazonwebservices-plain-wordmark" },
    { label: "Docker",      icon: "docker/docker-original" },
    { label: "PostgreSQL",  icon: "postgresql/postgresql-original" },
    { label: "Git",         icon: "git/git-original" },
    { label: "GitHub",      icon: "github/github-original" },
    { label: "Postman",     icon: "postman/postman-original" },
    { label: "Kubernetes",  icon: "kubernetes/kubernetes-plain" },
    { label: "Jira",        icon: "jira/jira-original" },
  ],
};

const PROJECTS = [
  {
    title: "UniVerse - StormHacks 2025",
    img: "/img/universe.png",
    description: "Built UniVerse, a real-time campus app for shared rides, errands, and micro-tasks (campus gig economy). Integrated phone GPS with GeoJSON mapping for auto room detection and zone-based communication. Developed a Node.js + Socket.IO backend for sub-250 ms real-time broadcast routing and user matching.",
    date: "StormHacks 2025",
    stack: ["React Native", "Node.js", "Firebase Auth", "Socket.IO", "TypeScript", "GeoJSON"],
    repo: "https://github.com/SahirSood/UniVerse",
  },
  {
    title: "Spotify Playlist Generator",
    img: "/img/spotify-project.png",
    description: "A real-time playlist generator that creates personalized Spotify playlists based on user mood and preferences using AI.",
    date: "Mar 2025 – Present",
    stack: ["Python", "React", "Node.js", "AWS", "OpenAI API", "GitHub Actions"],
    repo: "https://github.com/SahirSood/Spotify-Playlist-Generator",
  },
  {
    title: "BeerIQ",
    img: "https://thumbs.dreamstime.com/b/cartoon-style-illustration-pint-glass-filled-golden-beer-topped-frothy-white-head-slightly-overflows-365646594.jpg",
    description: "A beer-based social media platform that allows users to share reviews, rate beers, and discover new breweries.",
    date: "Oct – Dec 2024",
    stack: ["Kotlin", "Firebase", "Android Studio", "Google Maps API", "Python"],
    repo: "https://github.com/SahirSood/BeerIQ/tree/main",
  },
  {
    title: "TripMate",
    img: "/img/tripmate-logo.png",
    description: "A travel planning app that helps users organize trips, share itineraries, and discover new destinations.",
    date: "Oct – Dec 2023",
    stack: ["Ruby", "Rails", "PostgreSQL", "WebSockets"],
    repo: "",
  },
  {
    title: "Financial Fast Feed",
    img: "/img/fff.jpg",
    description: "Built a login and bookmark system enabling users to save and revisit articles from a personalized financial news feed.",
    date: "Jan – Apr 2025",
    stack: ["React", "Postman", "Node.js", "Flask", "RESTful APIs"],
    repo: "https://github.com/SahirSood/financial-fast-feed",
  },
  {
    title: "Sensor Movement Data Analysis",
    img: "/img/kmeans.png",
    description: "Developed ML models using smartphone sensor data to detect and classify human activities with high accuracy.",
    date: "Feb – Mar 2025",
    stack: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
    repo: "",
  },
  {
    title: "Apocalypse Rerising",
    img: "/img/img-zmb.jpg",
    description: "A 2D zombie survival game with wave-based enemies and power-ups.",
    date: "Dec 2022",
    stack: ["Python", "Pygame"],
    repo: "https://github.com/SahirSood/Apocalypse-Rerising/commits/main/",
  },
  {
    title: "Fall Hackathon – Endless Scroller",
    img: "/img/no-img.jpg",
    description: "An endless 2D scroller with score-based obstacles and power-ups.",
    date: "Fall 2022",
    stack: ["Java", "Spring Boot", "Angular", "Docker", "Kubernetes", "PostgreSQL"],
    repo: "https://github.com/SahirSood/FallHackathonProject",
  },
];

const EXPERIENCE = [
  {
    company: "RedBrick (Paved)",
    role: "Software Developer",
    timeframe: "Jan – Apr 2026",
    summary:
      "Software Developer at RedBrick (Paved) — an ad-tech platform serving 3K+ publishers and 253M+ subscribers including Uber and NYT. Contributing to a focused 4-month feature project from design to production within agile development cycles. Working across backend and CI/CD with Ruby, Python, JavaScript, TypeScript, and GitHub Actions.",
    tags: ["Ruby", "Python", "JavaScript", "TypeScript", "GitHub Actions", "Ad-Tech", "CI/CD"],
    logo: "/img/redbrick.png",
  },
  /* RBC_ENTRY — uncomment and fill in, then add /img/rbc.png to public/img/
  {
    company: "RBC",
    role: "Software Developer",
    timeframe: "TODO: add dates",
    summary: "TODO: add summary of your work at RBC",
    tags: ["TODO"],
    logo: "/img/rbc.png",
  },
  */
  {
    company: "MotherTongue",
    role: "Lead Developer – Startup",
    timeframe: "May 2025 – Present",
    summary:
      "Developed a comprehensive Chrome extension for writing feedback that provides sentence-level analysis and adaptive learning capabilities. Built a responsive React UI and integrated Chrome Extension APIs to enable real-time writing analysis directly in users' browsers. Connected OpenAI API through a custom Node.js backend to deliver targeted writing suggestions. Implemented a scoring system powered by Firestore that maps writing patterns to adaptive course modules.",
    tags: ["React", "JavaScript", "ChatGPT API", "JMeter", "Selenium", "GitHub Actions", "Chrome API", "Node.js", "Firestore"],
    logo: "/img/mothertongue-logo.jpg",
  },
  {
    company: "Kapali Developments",
    role: "Contract Software Developer",
    timeframe: "Jan – Apr 2025",
    summary:
      "Developed a comprehensive React dashboard connected to Firestore for real-time financial tracking across multiple properties and investment projects. Designed SQL schemas to model complex financial relationships including rental income, mortgage payments, and partner equity contributions. Built a scalable backend using Node.js and Firebase Functions that automates monthly reporting and calculates equity splits between partners.",
    tags: ["Firestore", "React", "JavaScript", "Node.js", "Firebase Functions", "SQL"],
    logo: "/img/kapali.png",
  },
  {
    company: "Kapali Developments",
    role: "Part-time Assistant",
    timeframe: "July 2022 – September 2024",
    summary:
      "Increased client engagement by 20% through social media optimization, driving new leads for the business. Streamlined financial reporting using Excel, improving accounting accuracy and reducing reporting time by 30%. Redesigned the company website and business cards, elevating branding and enhancing client engagement.",
    tags: ["Excel", "Social Media", "Web Design", "Project Management", "Client Relations"],
    logo: "/img/kapali.png",
  },
  {
    company: "PedalHeads",
    role: "Camp Counselor",
    timeframe: "June – August 2021",
    summary:
      "Taught bike riding skills to young children while enforcing safety protocols to build confidence. Administered first aid and independently managed injuries, ensuring camper safety. Resolved behavioral challenges through creative problem-solving, maintaining a positive environment for 25+ children.",
    tags: ["Leadership", "First Aid", "Communication", "Problem Solving"],
    logo: "/img/pedalheads.jpg",
  },
];

// ─────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────
function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Section({ id, children, className = "", animate = true }) {
  return (
    <section
      id={id}
      data-animate={animate}
      className={`flex items-center justify-center py-16 sm:py-24 ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

function Tech({ label }) {
  return (
    <span className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all duration-200 hover:scale-105 hover:shadow-sm dark:from-slate-700 dark:to-slate-800 dark:text-slate-300">
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { key: "home",       label: "Home" },
  { key: "skills",     label: "Skills" },
  { key: "projects",   label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "contact",    label: "Contact" },
];

function Header() {
  const { theme, setTheme } = useTheme();
  const scrollY = useScrollAnimation();
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const scrolled = scrollY > 50;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 dark:bg-slate-950/80 dark:border-slate-800/50"
          : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-4 sm:py-5">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white hover:scale-105 transition-transform"
          >
            Sahir Sood
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeSection === link.key
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                    : scrolled
                    ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-100/50 dark:text-white/90 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`ml-2 p-2.5 rounded-full transition-all duration-300 hover:scale-105 ${
                scrolled
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-slate-100/80 text-slate-700 dark:bg-white/10 dark:text-white"
              }`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:scale-105 transition-transform"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2.5 rounded-full bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:scale-105 transition-transform"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50`}
      >
        <Container>
          <div className="py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.key}
                onClick={() => scrollTo(link.key)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === link.key
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </Container>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────
const TYPEWRITER_WORDS = [
  "Software Developer @ RedBrick",
  "CS Student @ SFU",
  "Full-Stack Builder",
  "Problem Solver",
];

function HeroSection() {
  const scrollY = useScrollAnimation();
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("home");
  const typedText = useTypewriter(TYPEWRITER_WORDS);

  return (
    <section
      id="home"
      data-animate="true"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/50 dark:to-slate-950 min-h-screen flex items-center pt-20"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Profile image — shows first on mobile */}
          <div
            className={`flex justify-center lg:order-2 transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative">
              <div
                className="absolute -inset-10 sm:-inset-12 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDuration: "4s" }}
              />
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full opacity-20 blur-sm" />
              <img
                src={PROFILE_IMG}
                alt="Sahir Sood"
                className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 object-cover rounded-full border-4 border-white/10 shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
              />
            </div>
          </div>

          {/* Text content */}
          <div
            className={`lg:order-1 text-slate-900 dark:text-white space-y-6 sm:space-y-8 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                Hi! I&apos;m{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Sahir Sood
                </span>
              </h1>
              {/* Typewriter subtitle */}
              <p className="text-lg sm:text-xl lg:text-2xl mt-4 text-slate-600 dark:text-slate-200 font-light min-h-[2rem] sm:min-h-[2.5rem]">
                {typedText}
                <span className="animate-pulse text-purple-500 font-thin ml-0.5">|</span>
              </p>
            </div>

            {/* Contact links */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {HOT_LINKS.map(({ label, href, icon: Icon }, index) => {
                const colors = [
                  "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-500/25",
                  "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25",
                  "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-500/25",
                ];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-white shadow-lg bg-gradient-to-r transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${colors[index]}`}
                  >
                    <Icon size={15} className="group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{label}</span>
                  </a>
                );
              })}
            </div>

            {/* About bio */}
            <div className="space-y-4 text-slate-700 dark:text-slate-100 leading-relaxed">
              <p className="text-base sm:text-lg">
                An Intro to CS elective completely shifted my path. What started as curiosity
                quickly turned into a real passion for{" "}
                <span className="font-medium">solving problems</span>, which led me to transfer
                into the joint CS and Business program at SFU.
              </p>
              <p className="text-base sm:text-lg">
                Since then I&apos;ve built projects that tested both my technical skills and my
                ability to collaborate. I enjoy{" "}
                <span className="font-medium">backend systems and data-driven development</span>,
                but what stands out most is how much{" "}
                <span className="font-medium">teamwork and adaptability</span> shape the success
                of a project.
              </p>
              <p className="text-base sm:text-lg">
                Outside of coding I keep balance through{" "}
                <span className="font-medium">basketball, travel, and exploring the outdoors</span>.
              </p>
            </div>

            <button
              onClick={() => document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">Explore My Work</span>
              <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────
// SKILLS SECTION
// ─────────────────────────────────────────────
function SkillIcon({ skill }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:scale-110 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-700 transition-all duration-200 cursor-default group">
      {!errored ? (
        <img
          src={`${DEVICON}/${skill.icon}.svg`}
          alt={skill.label}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
          {skill.label.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
        {skill.label}
      </span>
    </div>
  );
}

function SkillsSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("skills");
  const [activeTab, setActiveTab] = useState("Languages");
  const tabs = Object.keys(SKILLS);

  return (
    <Section
      id="skills"
      className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Heading */}
        <div
          className={`text-center mb-10 sm:mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-3">
            Technical{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
            Technologies I work with
          </p>
        </div>

        {/* Tab buttons */}
        <div
          className={`flex justify-center gap-2 sm:gap-3 mb-8 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-105"
                  : "border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-105"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="rounded-3xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 p-5 sm:p-8 shadow-xl">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
              {SKILLS[activeTab].map(skill => (
                <SkillIcon key={skill.label} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────
function ProjectCard({ p, index }) {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("projects");

  const inner = (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
      <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
        <img
          src={p.img}
          alt={p.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {p.repo && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink size={20} className="text-white" />
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
            {p.title}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0 mt-0.5">
            <Calendar size={11} /> {p.date}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
          {p.description}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {p.stack.map(tech => <Tech key={tech} label={tech} />)}
        </div>
      </div>
    </div>
  );

  const classes = `group block transition-all duration-700 ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`;
  const delay = { transitionDelay: `${index * 100}ms` };

  return p.repo ? (
    <a href={p.repo} target="_blank" rel="noreferrer" className={classes} style={delay}>
      {inner}
    </a>
  ) : (
    <div className={classes} style={delay}>{inner}</div>
  );
}

function ProjectsSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("projects");

  return (
    <Section
      id="projects"
      className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900"
    >
      <div className="w-full">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A showcase of my technical work spanning various domains and technologies
          </p>
        </div>
        <div className="grid gap-5 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} p={project} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// EXPERIENCE SECTION
// ─────────────────────────────────────────────
function ExperienceCard({ e, index, isLast }) {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("experience");

  return (
    <div
      className={`relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {!isLast && (
        <div className="absolute left-[11px] sm:left-[15px] top-20 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-30" />
      )}
      <div className="absolute left-[6px] sm:left-[10px] top-7 sm:top-8 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg" />

      <div className="ml-9 sm:ml-14 group">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
          <div className="p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-5">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={e.logo}
                  alt={`${e.company} logo`}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl bg-white dark:bg-slate-800 p-2 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {e.company}
                </h3>
                <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {e.role}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Calendar size={13} /> {e.timeframe}
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
              {e.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {e.tags.map(tag => <Tech key={tag} label={tag} />)}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function ExperienceSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("experience");

  return (
    <Section
      id="experience"
      className="bg-gradient-to-br from-purple-50 via-slate-50 to-pink-50 dark:from-purple-950/20 dark:via-slate-900 dark:to-pink-950/20"
    >
      <div className="w-full">
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Professional{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            My journey through various roles in technology and development
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto space-y-10 sm:space-y-12">
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

// ─────────────────────────────────────────────
// CONTACT SECTION
// ─────────────────────────────────────────────
function ContactSection() {
  const visibleElements = useIntersectionObserver();
  const isVisible = visibleElements.has("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:sahirsood@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <Section
      id="contact"
      className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20"
    >
      <div
        className={`w-full max-w-2xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
            Get In{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
            Always excited to discuss new opportunities and interesting projects.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <Container>
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {HOT_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1 min-w-[80px]"
              >
                <Icon size={22} className="group-hover:scale-110 transition-transform text-slate-300 group-hover:text-white" />
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
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

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
