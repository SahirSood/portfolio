// App.jsx — Single‑file React portfolio (clean, dark‑mode, Netlify‑friendly)
// TailwindCSS is used for styling. You can paste this into a Vite React project as src/App.jsx.
// Replace the placeholder PROFILE_IMG with your actual image URL or import.

import { useEffect, useMemo, useState } from "react";
import { Github, Linkedin, Mail, Moon, Sun, ExternalLink, Calendar, MapPin, BadgeCheck } from "lucide-react";

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
const PROFILE_IMG = "../1_Sahir Sood_Spring 2024_Boating in Demark  Canals.JPEG"; 
const HOT_LINKS = [
  { label: "sahirsood@gmail.com", href: "mailto:sahirsood@gmail.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/SahirSood", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahir-sood/", icon: Linkedin },
];

const PROJECTS = [
  {
    title: "Spotify Playlist Generator",
    img: "../spotifyProjectImage.png",
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
    img: "../tripmate-logo.png",
    description: "A travel planning app that helps users organize trips, share itineraries, and discover new destinations.",
    date: "Oct – Dec 2023",
    stack: ["Ruby", "Rails", "PostgreSQL", "WebSocets"],
    repo: "https://github.com/your-github/heart-regression"
  },
  {
    title: "Financial Fast Feed",
    img: "../fff.jpg",
    description: "Built login and bookmark system enabling users to save and revisit articles from the personalized news feed.",
    date: "Jan-Apr 2025",
    stack: ["React", "Postman", "Node.JS", "Flask", "RESTful APIs"],
    repo: "https://github.com/SahirSood/financial-fast-feed"
  },
    {
    title: "Sensor Movement Data Analysis",
    img: "../km,eans.png",
    description: "Developed ML models using smartphone sensor data to detect human activities.",
    date: "Feb-Mar 2025",
    stack: ["Python", "Pandas", "Matplotlib", "Scokit-learn"],
    repo: ""
  },
  {
    title: "Apocolypse Rerising",
    img: "../img-zmb.jpg",
    description: "A 2D zombie survival game with wave-based enemies and power-ups.",
    date: "Dec 2022",
    stack: ["Python", "Pygame"],
    repo: "https://github.com/SahirSood/Apocalypse-Rerising/commits/main/"
  },
  {
    title: "Fall Hackathon Project - Endless Scroller",
    img: "../No_Image_Available.jpg",
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
    logo: "../mothertongue_logo.jpg",
  },
  {
    company: "Kapali Developments",
    role: "Contract Software Developer",
    timeframe: "Jan – Apr 2025",
    summary:
      "Developed a comprehensive React dashboard connected to Firestore for real-time financial tracking and transparency across multiple properties and investment projects. Designed robust SQL schemas to effectively model complex financial relationships including rental income, mortgage payments, and partner equity contributions. Built a scalable backend using Node.js and Firebase Functions that automates monthly reporting processes and calculates equity splits between partners. Created a user-friendly interface that allows stakeholders to track investments, expenses, and determine who owes what across various projects and partnerships.",
    tags: ["Firestore", "React", "JavaScript", "Node.js", "Firebase Functions", "SQL"],
    logo: "../KApa.png",
  },

  {
    company: "Kapali Developments",
    role: "Part-time Assistant",
    timeframe: "July 2022 – September 2024",
    summary:
      "Increased client engagement by 20% through social media optimization, driving new leads for the business. Streamlined financial reporting using Excel, improving accounting accuracy and reducing reporting time by 30%. Redesigned the company website and business cards, elevating branding and enhancing client engagement. Managed on-site operations and coordinated with contractors, ensuring projects met deadlines while strengthening communication and problem-solving skills.",
    tags: ["Excel", "Social Media", "Web Design", "Project Management", "Client Relations"],
    logo: "../KApa.png",
  },
  {
    company: "PedalHeads",
    role: "Camp Counselor",
    timeframe: "June – August 2021",
    summary:
      "Taught bike riding skills to young children while enforcing safety protocols to build confidence. Administered first aid and independently managed injuries, ensuring camper safety and well-being. Resolved camper behavioral challenges through creative problem-solving, maintaining a positive environment for 25+ children and earning parent praise. Engaged proactively with parents to address concerns and maintain clear communication, fostering trust and positive feedback from families and management.",
    tags: ["Leadership", "First Aid", "Communication", "Problem Solving", "Child Safety"],
    logo: "../images.jpg",
  },
];

// -----------------------------
// UI PRIMITIVES
// -----------------------------
function Container({ children }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">{children}</div>
  );
}

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`py-14 sm:py-16 ${className}`}>
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
// HEADER + NAV
// -----------------------------
function Header({ active, onNavigate }) {
  const { theme, setTheme } = useTheme();
  const links = [
    { key: "home", label: "home" },
    { key: "projects", label: "projects" },
    { key: "experience", label: "experience" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
      <Container>
        <div className="flex items-center justify-between py-5">
          <button 
            onClick={() => onNavigate('home')}
            className="text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-purple-600 dark:text-white dark:hover:text-purple-400 cursor-pointer"
          >
            Sahir Sood
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            {links.map(l => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`rounded-xl px-4 py-2.5 text-sm capitalize transition-all duration-200 hover:scale-105 ${active === l.key ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
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
// HOME
// -----------------------------
function Home({ onNavigate }) {
  return (
    <>
      <Section id="hero" className="pt-12 sm:pt-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30 dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-white p-10 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-800/80 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 dark:shadow-slate-900/50">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left: intro */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Hi! I'm <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-extrabold">Sahir Sood</span>
              </h1>
              <p className="mt-3 text-xl text-slate-600 dark:text-slate-300">
                4th Year Computer Science Student @ SFU
              </p>

              {/* Hot links */}
              <div className="mt-8 flex flex-wrap gap-4">
                {HOT_LINKS.map(({ label, href, icon: Icon }) => {
                  let buttonClass = "group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg";
                  
                  if (label === "sahirsood@gmail.com") {
                    buttonClass += " bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700";
                  } else if (label === "GitHub") {
                    buttonClass += " bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black";
                  } else if (label === "LinkedIn") {
                    buttonClass += " bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800";
                  } else {
                    buttonClass += " border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";
                  }
                  
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClass}
                    >
                      <Icon size={16} className="opacity-90" />
                      {label}
                    </a>
                  );
                })}
              </div>

              {/* About me content moved here */}
              <div className="mt-10">
                <p className="max-w-3xl text-slate-700 leading-relaxed dark:text-slate-300">
                  An Intro to CS elective completely shifted my path. What started as curiosity quickly turned into a real passion for 
                  <span className="font-bold text-slate-900 dark:text-white"> solving problems</span>, 
                  which led me to transfer into the joint CS and Business program at SFU.
                </p>
                <p className="mt-5 max-w-3xl text-slate-700 leading-relaxed dark:text-slate-300">
                  Since then I've built projects that tested both my technical skills and my ability to collaborate. I enjoy 
                  <span className="font-bold text-slate-900 dark:text-white"> backend systems and data-driven development</span>, 
                  but what stands out most to me is how much 
                  <span className="font-bold text-slate-900 dark:text-white"> teamwork and adaptability </span> 
                  shape the success of a project.
                </p>
                <p className="mt-5 max-w-3xl text-slate-700 leading-relaxed dark:text-slate-300">
                  Outside of coding I keep balance through 
                  <span className="font-bold text-slate-900 dark:text-white"> basketball, travel, and exploring the outdoors</span>. 
                  These experiences keep me grounded and help me bring a genuine perspective into the work I do.
                </p>
              </div>
            </div>

            {/* Right: photo */}
            <div className="order-first md:order-none">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-20 blur-lg"></div>
                <img
                  src={PROFILE_IMG}
                  alt="Sahir portrait"
                  className="relative mx-auto aspect-square max-w-sm rounded-2xl object-cover shadow-2xl ring-1 ring-slate-200 transition-transform duration-300 hover:scale-105 dark:ring-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Navigation Cards */}
      <Section id="navigation" className="pt-4 pb-8">
        <div className="flex justify-center">
          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl w-full">
            <button
              onClick={() => onNavigate('experience')}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-white p-8 shadow-xl shadow-slate-200/60 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:border-purple-300/60 hover:shadow-2xl hover:shadow-purple-200/40 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 dark:shadow-slate-900/60 dark:hover:border-purple-600/40 dark:hover:shadow-purple-900/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-pink-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-6 mb-4">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30"></div>
                  <img 
                    src="../mothertongue_logo.jpg" 
                    alt="Work Experience" 
                    className="relative h-16 w-16 rounded-xl bg-white object-contain p-2 ring-2 ring-slate-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:ring-purple-300 dark:ring-slate-700 dark:group-hover:ring-purple-600"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">Experience</h3>
                  <div className="mt-1 h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-24"></div>
                </div>
              </div>
              <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore my professional journey from startups to established companies, including development roles and leadership positions.
              </p>
              <div className="absolute bottom-4 right-4 opacity-30 transition-opacity duration-300 group-hover:opacity-60">
                <ExternalLink size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('projects')}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-white p-8 shadow-xl shadow-slate-200/60 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:border-blue-300/60 hover:shadow-2xl hover:shadow-blue-200/40 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 dark:shadow-slate-900/60 dark:hover:border-blue-600/40 dark:hover:shadow-blue-900/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-cyan-400/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-6 mb-4">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30"></div>
                  <img 
                    src="../km,eans.png" 
                    alt="Projects" 
                    className="relative h-16 w-16 rounded-xl bg-white object-contain p-2 ring-2 ring-slate-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:ring-blue-300 dark:ring-slate-700 dark:group-hover:ring-blue-600"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">Projects</h3>
                  <div className="mt-1 h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-24"></div>
                </div>
              </div>
              <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Discover my technical projects spanning web development, mobile apps, machine learning, and game development.
              </p>
              <div className="absolute bottom-4 right-4 opacity-30 transition-opacity duration-300 group-hover:opacity-60">
                <ExternalLink size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}

// -----------------------------
// PROJECTS — grid of cards (click -> GitHub)
// -----------------------------
function ProjectCard({ p }) {
  return (
    <a
      href={p.repo}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-300/50 dark:border-slate-800/80 dark:from-slate-900 dark:to-slate-900/50 dark:shadow-slate-900/50"
    >
      <div className="relative overflow-hidden">
        <img src={p.img} alt="" className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">{p.title}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={14} /> {p.date}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">{p.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {p.stack.map((t) => (
            <Tech key={t} label={t} />
          ))}
        </div>
      </div>
    </a>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Clickable cards — open the GitHub repo.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>
    </Section>
  );
}

// -----------------------------
// EXPERIENCE — stacked cards like screenshot
// -----------------------------
function ExperienceCard({ e }) {
  return (
    <div className="group flex flex-col gap-6 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50/50 to-white p-8 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/50 dark:border-slate-800/80 dark:from-slate-900/50 dark:to-slate-900 dark:shadow-slate-900/50">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20"></div>
          <img src={e.logo} alt="logo" className="relative h-20 w-20 rounded-xl bg-white object-contain p-2 ring-1 ring-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:ring-slate-800" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">{e.company}</h3>
          <div className="text-base font-medium text-slate-600 dark:text-slate-300">{e.role}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{e.timeframe}</div>
        </div>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">{e.summary}</p>
      <div className="flex flex-wrap gap-2">
        {e.tags.map((t) => (
          <Tech key={t} label={t} />
        ))}
      </div>
    </div>
  );
}

function Experience() {
  return (
    <Section id="experience">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h2>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>
      <div className="flex flex-col gap-8">
        {EXPERIENCE.map((e) => (
          <ExperienceCard key={e.company} e={e} />
        ))}
      </div>
    </Section>
  );
}

// -----------------------------
// FOOTER
// -----------------------------
function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <Container>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div>© {new Date().getFullYear()} Sahir Sood. All rights reserved.</div>
            <a 
              href="https://github.com/SahirSood/portfolio" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 px-3 py-1 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Github size={14} />
              View Source
            </a>
          </div>
          <div className="flex gap-3">
            {HOT_LINKS.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

// -----------------------------
// APP (simple client-side router by state)
// -----------------------------
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <Header active={page} onNavigate={setPage} />
      {page === "home" && <Home onNavigate={setPage} />}
      {page === "projects" && <Projects />}
      {page === "experience" && <Experience />}
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
