const env = import.meta.env ?? {};

export function normalizeSiteUrl(value) {
  return String(value || "https://sahir.dev").replace(/\/+$/, "");
}

export const SITE_CONFIG = {
  name: "Sahir Sood",
  displayName: "Sahir Sood",
  shortName: "Sahir",
  headline: "Full-Stack Developer & Software Engineer",
  jobTitle: "Full Stack Developer",
  location: "Vancouver, BC",
  email: "sahirsood@gmail.com",
  siteUrl: normalizeSiteUrl(env.VITE_SITE_URL),
  inferredSiteUrl: "https://sahir.dev",
  description:
    "Portfolio of Sahir Sood, a full-stack software developer building AI, web, mobile, systems, and finance-focused projects with React, Python, JavaScript, and C++.",
  profileImage: "/img/sahir-headshot.JPEG",
  profileImageAlt: "Portrait of Sahir Sood",
  themeColor: "#4285f4",
  githubUrl: "https://github.com/SahirSood",
  linkedinUrl: "https://www.linkedin.com/in/sahir-sood/",
  knowsAbout: [
    "Full-stack software development",
    "React",
    "React Native",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "Ruby on Rails",
    "Firebase",
    "AI applications",
    "Financial technology",
    "Market simulation",
    "C++ systems",
    "Mobile applications",
    "Data analysis",
  ],
  alumniOf: ["Simon Fraser University", "University of Leeds"],
  worksFor: ["RBC"],
};

export const ROUTE_PATHS = {
  home: "/",
  search: "/search",
  profile: "/about",
  education: "/education",
  experience: "/experience",
  projects: "/projects",
  "ai-trading-arena": "/projects/ai-trading-arena",
  skills: "/skills",
  resume: "/resume",
  contact: "/contact",
  map: "/map",
  snake: "/snake",
  rbc: "/experience/rbc",
  "redbrick-paved": "/experience/redbrick-paved",
  paved: "/experience/redbrick-paved",
  mothertongue: "/experience/mothertongue",
};

const ROUTE_ALIASES = {
  "/profile": "profile",
  "/newtab": "home",
  "/experience/paved": "redbrick-paved",
};

export const SEO_ROUTES = [
  {
    id: "home",
    path: ROUTE_PATHS.home,
    title: "Sahir Sood | Full-Stack Developer & Software Engineer",
    description: SITE_CONFIG.description,
    h1: "Sahir Sood - Full-Stack Developer & Software Engineer",
    eyebrow: "Portfolio",
    priority: "1.0",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "About Sahir Sood",
        paragraphs: [
          "Sahir Sood is a Vancouver-based software developer and Simon Fraser University Computing Science and Finance student. His portfolio covers full-stack development, AI-enabled products, mobile applications, backend systems, data analysis, and finance-focused software.",
          "He has practical experience at RBC, RedBrick/Paved, MotherTongue, and Kapali Developments, with projects that span React, React Native, Node.js, Python, C++, FastAPI, Ruby on Rails, Firebase, PostgreSQL, Kotlin, and modern JavaScript.",
        ],
      },
      {
        heading: "Software Development Experience",
        list: [
          "Full Stack Developer at RBC, working on an internal AI platform and frontend-heavy tools for document search, filtering, lineage, and exploration.",
          "Software Developer at RedBrick on Paved, contributing to production ad-tech systems, validation, tests, caching, and internal product improvements.",
          "Lead Developer for MotherTongue, an AI-powered writing coach MVP with React, Node.js, OpenAI API integration, Chrome extension support, and Firestore.",
          "Contract Software Developer for Kapali Developments, building a React and Firestore dashboard with reporting and backend automation.",
        ],
      },
      {
        heading: "Selected Software and AI Projects",
        list: [
          "AI Trading Arena - an ongoing full-stack market simulation platform where Claude and OpenAI trading agents compete through a custom C++ limit order book, Python/FastAPI backend, SEC/RAG evidence layer, WebSocket events, and React dashboard.",
          "UniVerse - a React Native campus app for shared rides, errands, micro-tasks, GPS workflows, and zone-based communication.",
          "Spotify Playlist Generator - an AI-backed playlist workflow using Python, React, Node.js, AWS, and the OpenAI API.",
          "Financial Fast Feed - login and bookmark flows for a personalized financial news feed built with React, Node.js, Flask, and REST APIs.",
          "BeerIQ, TripMate, Sensor Movement Data Analysis, and Apocalypse Rerising show additional mobile, Rails, data science, and game-development range.",
        ],
      },
    ],
    links: [
      { label: "About Sahir", href: ROUTE_PATHS.profile },
      { label: "Experience", href: ROUTE_PATHS.experience },
      { label: "Projects", href: ROUTE_PATHS.projects },
      { label: "AI Trading Arena project", href: ROUTE_PATHS["ai-trading-arena"] },
      { label: "Contact", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "profile",
    path: ROUTE_PATHS.profile,
    title: "About Sahir Sood | Software Developer in Vancouver",
    description:
      "Learn about Sahir Sood, a Vancouver software developer and SFU CS and Finance student building full-stack, AI, mobile, and data projects.",
    h1: "About Sahir Sood",
    eyebrow: "About",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Profile",
        paragraphs: [
          "Sahir Sood is a software developer studying Computing Science and Finance at Simon Fraser University. His work connects practical product engineering with an interest in financial systems, AI tools, backend systems, mobile apps, and data-driven development.",
          "His experience includes current full-stack work at RBC, production software development at RedBrick/Paved, lead development for the MotherTongue MVP, and contract dashboard work for Kapali Developments.",
        ],
      },
      {
        heading: "Public Profiles",
        list: ["GitHub: github.com/SahirSood", "LinkedIn: linkedin.com/in/sahir-sood", "Email: sahirsood@gmail.com"],
      },
    ],
    links: [
      { label: "View Sahir's experience", href: ROUTE_PATHS.experience },
      { label: "View Sahir's projects", href: ROUTE_PATHS.projects },
      { label: "Contact Sahir", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "experience",
    path: ROUTE_PATHS.experience,
    title: "Software Development Experience | Sahir Sood",
    description:
      "Sahir Sood's software experience includes full-stack work at RBC, RedBrick/Paved, MotherTongue, and Kapali Developments.",
    h1: "Software Development Experience",
    eyebrow: "Experience",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Experience Highlights",
        list: [
          "RBC - Full Stack Developer on Functions Assist, an internal AI platform for building specialized tools across the organization.",
          "RedBrick/Paved - Software Developer contributing production code, validation, tests, caching, and product improvements for a newsletter advertising platform.",
          "MotherTongue - Lead Developer for an AI-powered writing coach MVP with backend services, AI integration, Chrome extension support, and Firestore.",
          "Kapali Developments - Contract Software Developer building a React and Firestore financial dashboard with automation for reporting and equity splits.",
        ],
      },
    ],
    links: [
      { label: "RBC experience detail", href: ROUTE_PATHS.rbc },
      { label: "RedBrick and Paved experience detail", href: ROUTE_PATHS["redbrick-paved"] },
      { label: "MotherTongue experience detail", href: ROUTE_PATHS.mothertongue },
      { label: "Projects", href: ROUTE_PATHS.projects },
    ],
  },
  {
    id: "rbc",
    path: ROUTE_PATHS.rbc,
    title: "RBC Full Stack Developer Experience | Sahir Sood",
    description:
      "Sahir Sood works at RBC on Functions Assist, an internal AI platform, with frontend implementation, search, filtering, and integration work.",
    h1: "Full Stack Developer at RBC",
    eyebrow: "Experience Detail",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Functions Assist and ARC Lineage",
        paragraphs: [
          "At RBC, Sahir Sood works on Functions Assist, an internal AI platform for building specialized tools for departments across the organization. His work is primarily frontend-focused, with backend debugging and integration work when needed.",
          "For ARC Lineage, he built the full user interface for a lineage and document-exploration experience. Users can visually explore documents, understand source context, view relationships and authorship, and narrow large result sets through search and filtering.",
        ],
      },
      {
        heading: "What the work involved",
        list: [
          "React frontend implementation for document visualization and exploration.",
          "Search, filtering, state representation, loading behavior, and product interaction decisions.",
          "Collaboration across frontend and backend boundaries while requirements evolved.",
        ],
      },
    ],
    links: [
      { label: "Back to experience", href: ROUTE_PATHS.experience },
      { label: "Contact Sahir", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "redbrick-paved",
    path: ROUTE_PATHS["redbrick-paved"],
    title: "RedBrick and Paved Software Developer Experience | Sahir Sood",
    description:
      "Sahir Sood contributed production software at RedBrick on Paved, working with Ruby, Python, JavaScript, TypeScript, tests, and CI/CD.",
    h1: "Software Developer at RedBrick and Paved",
    eyebrow: "Experience Detail",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Production Engineering",
        paragraphs: [
          "At RedBrick, Sahir Sood worked on Paved, an ad-tech platform used by publishers and advertisers to manage newsletter advertising. It was his first experience contributing to an established production codebase.",
          "His work crossed backend development, validation, testing, caching, internal product improvements, and team code-review workflows.",
        ],
      },
      {
        heading: "Technical Focus",
        list: [
          "Ruby, Python, JavaScript, TypeScript, GitHub Actions, and CI/CD.",
          "Validation for dynamic URL parameters and backend systems involving application data and caching.",
          "Automated testing improvements around important application behavior.",
        ],
      },
    ],
    links: [
      { label: "Back to experience", href: ROUTE_PATHS.experience },
      { label: "Projects", href: ROUTE_PATHS.projects },
    ],
  },
  {
    id: "mothertongue",
    path: ROUTE_PATHS.mothertongue,
    title: "MotherTongue AI Writing Coach Experience | Sahir Sood",
    description:
      "Sahir Sood helped build MotherTongue, an AI writing coach MVP using React, Node.js, OpenAI API, Chrome APIs, Firestore, JMeter, and Selenium.",
    h1: "Lead Developer for MotherTongue",
    eyebrow: "Experience Detail",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "AI Product MVP",
        paragraphs: [
          "MotherTongue is an AI-powered writing coach designed to help people improve how they communicate, not simply correct individual sentences. Sahir Sood helped build the MVP from the ground up.",
          "He focused on backend services, AI integrations, browser-extension architecture, data storage, and connecting the analysis experience to the React interface.",
        ],
      },
      {
        heading: "Technical Focus",
        list: [
          "React, JavaScript, Node.js, OpenAI API, Chrome APIs, Firestore, JMeter, and Selenium.",
          "Structured writing analysis across clarity, grammar, tone, conciseness, and organization.",
          "Product tradeoffs around context size, model calls, response structure, latency, and user usefulness.",
        ],
      },
    ],
    links: [
      { label: "Back to experience", href: ROUTE_PATHS.experience },
      { label: "Contact Sahir", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "projects",
    path: ROUTE_PATHS.projects,
    title: "Software, AI, Mobile and Data Projects | Sahir Sood",
    description:
      "Explore Sahir Sood's projects across AI trading agents, C++ market simulation, React Native, AI playlists, financial news, Kotlin Android, Rails, Python data analysis, and Pygame.",
    h1: "Selected Software and AI Projects",
    eyebrow: "Projects",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Project Portfolio",
        list: [
          "AI Trading Arena - C++17, Python, FastAPI, React, SQLAlchemy, PostgreSQL, WebSockets, OpenAI, Claude, and SEC/RAG retrieval for an ongoing full-stack capital markets simulation platform.",
          "UniVerse - React Native, Node.js, Firebase Auth, Socket.IO, TypeScript, and GeoJSON for a real-time campus app.",
          "Spotify Playlist Generator - Python, React, Node.js, AWS, OpenAI API, and GitHub Actions for AI-backed playlist creation.",
          "BeerIQ - Kotlin, Firebase, Android Studio, Google Maps API, and Python for social brewery and drink discovery.",
          "TripMate - Ruby, Rails, PostgreSQL, and WebSockets for collaborative travel planning.",
          "Financial Fast Feed - React, Node.js, Flask, Postman, and REST APIs for login and bookmark flows in a financial news feed.",
          "Sensor Movement Data Analysis - Python, Pandas, Matplotlib, and Scikit-learn for activity classification from smartphone sensors.",
          "Apocalypse Rerising - Python and Pygame for a 2D survival game with waves, power-ups, and arcade progression.",
        ],
      },
    ],
    links: [
      { label: "AI Trading Arena case study", href: ROUTE_PATHS["ai-trading-arena"] },
      { label: "GitHub profile", href: SITE_CONFIG.githubUrl, external: true },
      { label: "Experience", href: ROUTE_PATHS.experience },
      { label: "Contact", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "ai-trading-arena",
    path: ROUTE_PATHS["ai-trading-arena"],
    title: "AI Trading Arena Market Simulation Project | Sahir Sood",
    description:
      "AI Trading Arena is Sahir Sood's ongoing full-stack market simulation platform with Claude and OpenAI trading agents, a C++ limit order book, FastAPI, SQLAlchemy, SEC/RAG evidence, WebSockets, and React.",
    h1: "AI Trading Arena",
    eyebrow: "Featured Project",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Project Overview",
        paragraphs: [
          "AI Trading Arena is a full-stack capital markets simulation where Claude and OpenAI-powered trading bots compete against each other in a simulated stock market.",
          "Each bot reads market prices, financial news, and optional SEC filing evidence, makes a structured trade decision, submits orders into a custom C++ limit order book, and logs its reasoning, fills, portfolio state, and PnL.",
        ],
      },
      {
        heading: "Technical Scope",
        list: [
          "Custom C++17 central limit order book with limit orders, market orders, price-time priority, FIFO price levels, order cancellation, depth snapshots, spread and mid-price calculation, and trade logs.",
          "Python simulation scheduler and FastAPI backend with SQLAlchemy persistence, PostgreSQL for live data, SQLite for tests or sandbox mode, and WebSocket live event streams.",
          "Claude and OpenAI bot competition across BearBot, DegenBot, AnalystBot, ContrarianBot, and MacroBot personalities.",
          "SEC EDGAR ingestion, document chunking, optional OpenAI embeddings, RAG retrieval, evidence guardrails, and persisted evidence citations.",
          "React dashboard for arena summaries, bot reasoning, order book depth, trade history, sandbox controls, rankings, portfolio state, and PnL.",
        ],
      },
      {
        heading: "Roadmap",
        list: [
          "Deterministic risk controls before every non-HOLD order.",
          "MCP tools for market snapshots, portfolio state, evidence retrieval, and risk checks.",
          "Historical replay with an as-of clock, retrieval evaluation, evidence citation scoring, and model comparison on identical replay inputs.",
        ],
      },
    ],
    links: [
      { label: "Back to projects", href: ROUTE_PATHS.projects },
      { label: "Experience", href: ROUTE_PATHS.experience },
      { label: "Contact Sahir", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "skills",
    path: ROUTE_PATHS.skills,
    title: "Technical Skills | Sahir Sood",
    description:
      "Sahir Sood's technical skills include Python, JavaScript, TypeScript, Java, Ruby, Kotlin, SQL, React, React Native, Node.js, Rails, Flask, Firebase, AWS, Docker, and PostgreSQL.",
    h1: "Technical Skills",
    eyebrow: "Skills",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Languages",
        list: ["Python", "JavaScript", "TypeScript", "Java", "Ruby", "Kotlin", "SQL", "HTML/CSS"],
      },
      {
        heading: "Frameworks and Platforms",
        list: ["React", "React Native", "Node.js", "Rails", "Flask", "Firebase", "Android", "Angular"],
      },
      {
        heading: "Tools",
        list: ["AWS", "Docker", "PostgreSQL", "Git", "GitHub", "Postman", "Kubernetes", "Jira"],
      },
    ],
    links: [
      { label: "Projects using these skills", href: ROUTE_PATHS.projects },
      { label: "Resume", href: ROUTE_PATHS.resume },
    ],
  },
  {
    id: "education",
    path: ROUTE_PATHS.education,
    title: "Education, SFU Computing Science and Finance | Sahir Sood",
    description:
      "Sahir Sood studies Computing Science and Finance at Simon Fraser University and completed an international exchange semester at the University of Leeds.",
    h1: "Education and Study Abroad",
    eyebrow: "Education",
    priority: "0.7",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Simon Fraser University",
        paragraphs: [
          "Sahir Sood studies Computing Science with a finance focus at Simon Fraser University in Vancouver, connecting technical problem solving with financial systems, institutions, risk, and investment decisions.",
        ],
      },
      {
        heading: "University of Leeds",
        paragraphs: [
          "During a Spring 2024 international exchange semester at the University of Leeds, Sahir studied finance while building independence, communication skills, and a broader perspective through travel and cross-cultural friendships.",
        ],
      },
    ],
    links: [
      { label: "Resume", href: ROUTE_PATHS.resume },
      { label: "About Sahir", href: ROUTE_PATHS.profile },
    ],
  },
  {
    id: "resume",
    path: ROUTE_PATHS.resume,
    title: "Resume | Sahir Sood Software Developer",
    description:
      "A recruiter-scannable resume for Sahir Sood covering software experience, education, selected projects, technical skills, GitHub, LinkedIn, and contact details.",
    h1: "Sahir Sood Resume",
    eyebrow: "Resume",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Summary",
        paragraphs: [
          "Full-stack software developer with practical experience across ad-tech, AI writing tools, financial dashboards, mobile apps, web systems, and data analysis.",
        ],
      },
      {
        heading: "Resume Highlights",
        list: [
          "Education: Simon Fraser University - Computing Science and Finance.",
          "Experience: RBC, RedBrick/Paved, MotherTongue, and Kapali Developments.",
          "Projects: UniVerse, Spotify Playlist Generator, Financial Fast Feed, BeerIQ, TripMate, Sensor Movement Data Analysis, and Apocalypse Rerising.",
          "Skills: Python, JavaScript, TypeScript, Java, Ruby, Kotlin, SQL, React, React Native, Node.js, Rails, Flask, Firebase, AWS, Docker, PostgreSQL, and GitHub Actions.",
        ],
      },
    ],
    links: [
      { label: "Contact Sahir", href: ROUTE_PATHS.contact },
      { label: "View experience", href: ROUTE_PATHS.experience },
      { label: "View projects", href: ROUTE_PATHS.projects },
    ],
  },
  {
    id: "contact",
    path: ROUTE_PATHS.contact,
    title: "Contact Sahir Sood | Software Developer",
    description:
      "Contact Sahir Sood by email, GitHub, or LinkedIn for software development, AI product, fintech, full-stack, backend, and project conversations.",
    h1: "Contact Sahir Sood",
    eyebrow: "Contact",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Contact Details",
        list: ["Email: sahirsood@gmail.com", "GitHub: github.com/SahirSood", "LinkedIn: linkedin.com/in/sahir-sood"],
      },
      {
        heading: "Best-fit Conversations",
        paragraphs: [
          "Sahir is interested in backend and full-stack software development, platform and product engineering, internal developer tools, AI-enabled applications, and technology within capital markets or financial services.",
        ],
      },
    ],
    links: [
      { label: "Email Sahir", href: `mailto:${SITE_CONFIG.email}`, external: true },
      { label: "GitHub", href: SITE_CONFIG.githubUrl, external: true },
      { label: "LinkedIn", href: SITE_CONFIG.linkedinUrl, external: true },
    ],
  },
  {
    id: "map",
    path: ROUTE_PATHS.map,
    title: "Travel Map and Personal Notes | Sahir Sood",
    description:
      "Sahir Sood's travel map shares study abroad context, personal notes, and places that shaped his independence, communication, and perspective.",
    h1: "Travel Map and Personal Notes",
    eyebrow: "Map",
    priority: "0.4",
    changefreq: "yearly",
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Why Travel Matters",
        paragraphs: [
          "Travel and study abroad shaped how Sahir Sood sees people, communication, independence, and unfamiliar environments. The map page is personal context, not a replacement for the software portfolio.",
        ],
      },
    ],
    links: [
      { label: "About Sahir", href: ROUTE_PATHS.profile },
      { label: "Experience", href: ROUTE_PATHS.experience },
    ],
  },
  {
    id: "search",
    path: ROUTE_PATHS.search,
    title: "Portfolio Search | Sahir Sood",
    description:
      "Search-style portfolio view for Sahir Sood with guided links to experience, projects, skills, resume, and contact information.",
    h1: "Portfolio Search",
    eyebrow: "Search",
    robots: "noindex,follow",
    sitemap: false,
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Portfolio Navigation",
        paragraphs: [
          "This search-style route helps visitors navigate Sahir Sood's experience, projects, skills, resume, and contact pages. Canonical portfolio pages are linked below.",
        ],
      },
    ],
    links: [
      { label: "Experience", href: ROUTE_PATHS.experience },
      { label: "Projects", href: ROUTE_PATHS.projects },
      { label: "Contact", href: ROUTE_PATHS.contact },
    ],
  },
  {
    id: "snake",
    path: ROUTE_PATHS.snake,
    title: "Snake Game Easter Egg | Sahir Sood",
    description:
      "A playable Google-style Snake easter egg inside Sahir Sood's portfolio. This interactive page is available for visitors but not intended as a search landing page.",
    h1: "Snake Game Easter Egg",
    eyebrow: "Game",
    robots: "noindex,follow",
    sitemap: false,
    lastmod: "2026-07-13",
    sections: [
      {
        heading: "Interactive Easter Egg",
        paragraphs: [
          "This page contains a compact playable Snake game built into the portfolio experience. The main search landing pages are Sahir's about, experience, projects, resume, and contact pages.",
        ],
      },
    ],
    links: [
      { label: "Projects", href: ROUTE_PATHS.projects },
      { label: "Home", href: ROUTE_PATHS.home },
    ],
  },
];

export function routePathForPage(page) {
  return ROUTE_PATHS[page] ?? `/${String(page || "").replace(/^\/+/, "")}`;
}

export function routeForPageId(page) {
  const normalizedPage = page === "paved" ? "redbrick-paved" : page;
  return SEO_ROUTES.find((route) => route.id === normalizedPage) ?? SEO_ROUTES[0];
}

export function pageForPath(pathname) {
  const normalizedPath = normalizePath(pathname);
  if (ROUTE_ALIASES[normalizedPath]) return ROUTE_ALIASES[normalizedPath];
  const route = SEO_ROUTES.find((item) => normalizePath(item.path) === normalizedPath);
  return route?.id ?? "not-found";
}

export function normalizePath(pathname) {
  const path = String(pathname || "/").split("?")[0].split("#")[0].replace(/\/+$/, "");
  return path ? (path.startsWith("/") ? path : `/${path}`) : "/";
}

export function absoluteUrl(path, siteUrl = SITE_CONFIG.siteUrl) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteUrl(siteUrl)}${normalizedPath}`;
}
