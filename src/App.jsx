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
  { label: "Email", href: "mailto:ssa434@sfu.ca.com", icon: Mail },
  { label: "GitHub", href: "https://github.com/SahirSood", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sahir-sood/", icon: Linkedin },
];

const PROJECTS = [
  {
    title: "DuoASL — 1st Place @ nwHacks 2024",
    img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800&auto=format&fit=crop&q=60",
    description: "Real‑time ASL gesture learning using a computer‑vision neural network.",
    date: "Jan 2024",
    stack: ["Next.js", "Flask", "TensorFlow", "MediaPipe", "Auth0", "OpenCV"],
    repo: "https://github.com/your-github/duoasl"
  },
  {
    title: "Ensemble",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60",
    description: "Share music reviews with friends and view listening analytics.",
    date: "Jan 2023 – Sep 2023",
    stack: ["React", "Express", "Node", "MongoDB", "Spotify API", "TypeScript"],
    repo: "https://github.com/your-github/ensemble"
  },
  {
    title: "Collabr (Spring Boot chat)",
    img: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=60",
    description: "Live chat & sketching app; containerized with Docker and deployed.",
    date: "Jan 2023 – May 2023",
    stack: ["Java", "Spring Boot", "Angular", "Docker", "Kubernetes", "PostgreSQL"],
    repo: "https://github.com/your-github/collabr"
  },
  {
    title: "Heart‑Disease Regression",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=60",
    description: "Forward selection & classification to find biggest risk factors.",
    date: "Oct 2023 – Dec 2023",
    stack: ["R", "Statistics", "Classification"],
    repo: "https://github.com/your-github/heart-regression"
  },
];

const EXPERIENCE = [
  {
    company: "SAP",
    role: "Software Engineer Intern",
    timeframe: "May 2024 – Present",
    summary:
      "Streamlined compliance processes, improved frontend design, and automated license dependency management.",
    tags: ["Angular", "Groovy", "Spring Boot", "Kubernetes", "Jenkins", "CI/CD"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
  },
  {
    company: "Korotu Technology",
    role: "Software Engineer Intern",
    timeframe: "Jan 2023 – Sep 2023",
    summary:
      "Built a web app for land trusts, improved biomass calculations, and reduced server load times.",
    tags: ["React", "Django", "GeoPandas", "Microsoft Azure", "Nginx"],
    logo: "https://images.unsplash.com/photo-1527097609759-53f6b3b6b4d6?w=256&auto=format&fit=crop&q=60",
  },
  {
    company: "UBC Unmanned Aerial Systems",
    role: "Software Team Lead",
    timeframe: "Jan 2023 – Present",
    summary:
      "Led software for drone competitions and optimized server environments using Docker.",
    tags: ["Python", "Docker", "Confluence", "Trello", "Amazon EC2"],
    logo: "https://images.unsplash.com/photo-1524602830207-88b0f57dcb72?w=256&auto=format&fit=crop&q=60",
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
    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Sahir Sood</div>
          <div className="flex items-center gap-2 sm:gap-3">
            {links.map(l => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`rounded-lg px-3 py-2 text-sm capitalize transition hover:bg-slate-100 dark:hover:bg-slate-800 ${active === l.key ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
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
function Home() {
  return (
    <>
      <Section id="hero" className="pt-10 sm:pt-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left: intro */}
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Hi! I'm <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-bold">Sahir Sood</span>
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
                4th Year Computer Science Student @ SFU
              </p>

              {/* Hot links */}
              <div className="mt-6 flex flex-wrap gap-3">
                {HOT_LINKS.map(({ label, href, icon: Icon }) => {
                  let buttonClass = "group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";
                  
                  if (label === "ssa434@sfu.ca") {
                    buttonClass += " bg-red-500 text-white hover:bg-red-600";
                  } else if (label === "GitHub") {
                    buttonClass += " bg-gray-900 text-white hover:bg-gray-800";
                  } else if (label === "LinkedIn") {
                    buttonClass += " bg-blue-600 text-white hover:bg-blue-700";
                  } else {
                    buttonClass += " border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
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
              <div className="mt-8">
                <p className="max-w-3xl text-slate-700 dark:text-slate-300">
                  An Intro to CS elective completely shifted my path. What started as curiosity quickly turned into a real passion for 
                  <span className="font-bold"> solving problems</span>, 
                  which led me to transfer into the joint CS and Business program at SFU.
                </p>
                <p className="mt-4 max-w-3xl text-slate-700 dark:text-slate-300">
                  Since then I've built projects that tested both my technical skills and my ability to collaborate. I enjoy 
                  <span className="font-bold"> backend systems and data-driven development</span>, 
                  but what stands out most to me is how much 
                  <span className="font-bold"> teamwork and adaptability</span> 
                  shape the success of a project.
                </p>
                <p className="mt-4 max-w-3xl text-slate-700 dark:text-slate-300">
                  Outside of coding I keep balance through 
                  <span className="font-bold"> basketball, travel, and exploring the outdoors</span>. 
                  These experiences keep me grounded and help me bring a genuine perspective into the work I do.
                </p>
              </div>
            </div>

            {/* Right: photo */}
            <div className="order-first md:order-none">
              <img
                src={PROFILE_IMG}
                alt="Sahir portrait"
                className="mx-auto aspect-square max-w-sm rounded-2xl object-cover shadow-xl ring-1 ring-slate-200 dark:ring-slate-800"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Navigation Cards */}
      <Section id="navigation" className="pt-0">
        <div className="flex justify-center">
          <div className="grid gap-8 sm:grid-cols-2 max-w-2xl">
            <button
              onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center text-center transition hover:-translate-y-1"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" 
                  alt="mothertongue_logo" 
                  className="h-16 w-auto mx-auto object-contain"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Work Experience</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Learn more about my work experience.
                </p>
              </div>
            </button>
            
            <button
              onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
              className="group flex flex-col items-center text-center transition hover:-translate-y-1"
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" 
                  alt="SAP Logo" 
                  className="h-16 w-auto mx-auto object-contain"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Work Experience</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Learn more about the projects I have been apart of.
                </p>
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
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <img src={p.img} alt="" className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">{p.title}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={14} /> {p.date}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{p.description}</p>
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
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Projects</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Clickable cards — open the GitHub repo.</p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <img src={e.logo} alt="logo" className="h-16 w-16 rounded-xl bg-white object-contain p-2 ring-1 ring-slate-200 dark:ring-slate-800" />
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{e.company}</h3>
          <div className="text-sm text-slate-600 dark:text-slate-300">{e.role}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{e.timeframe}</div>
        </div>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300">{e.summary}</p>
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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Experience</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Clean cards with tech badges and summaries.</p>
      </div>
      <div className="flex flex-col gap-6">
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
      {page === "home" && <Home />}
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
