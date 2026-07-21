import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  ContactRound,
  Copy,
  FileText,
  Folder,
  FolderKanban,
  Gamepad2,
  Github,
  GraduationCap,
  Grid3X3,
  Linkedin,
  Mail,
  Map,
  MapPin,
  Mic,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import pavedLogo from "./assets/Paved.png";
import rbcLogo from "./assets/RBC.jpg";
import { PERSONAL_IMAGES, SITE_CONFIG, pageForPath, routeForPageId, routePathForPage } from "./seo/siteConfig.js";

const PROFILE_IMG = SITE_CONFIG.profileImage;
const PROFILE_IMG_ALT = SITE_CONFIG.profileImageAlt;
const TILE_SIZE = 256;

const HOT_LINKS = [
  { label: "Email", detail: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}`, icon: Mail },
  { label: "GitHub", detail: "github.com/SahirSood", href: SITE_CONFIG.githubUrl, icon: Github },
  { label: "LinkedIn", detail: "linkedin.com/in/sahir-sood", href: SITE_CONFIG.linkedinUrl, icon: Linkedin },
];

const SKILLS = {
  Languages: ["Python", "JavaScript", "TypeScript", "Java", "Ruby", "Kotlin", "SQL", "HTML/CSS"],
  Frameworks: ["React", "React Native", "Node.js", "Rails", "Flask", "Firebase", "Android", "Angular"],
  Tools: ["AWS", "Docker", "PostgreSQL", "Git", "GitHub", "Postman", "Kubernetes", "Jira"],
};

const PROJECTS = [
  {
    title: "AI Trading Arena",
    eyebrow: "Market Simulation Platform - Ongoing",
    img: "/img/no-img.jpg",
    imgWidth: 453,
    imgHeight: 340,
    description:
      "Full-stack capital markets simulation where Claude and OpenAI trading agents compete inside a custom C++ limit order book.",
    stack: ["C++17", "Python", "FastAPI", "React", "SQLAlchemy", "PostgreSQL", "WebSockets", "OpenAI", "Claude"],
    repo: "",
    type: "Featured AI + Finance",
    signal:
      "Native matching engine, bot orchestration, SEC/RAG evidence, portfolio and PnL tracking, and a live React dashboard.",
    action: "ai-trading-arena",
    featured: true,
    featuredLabel: "Featured project",
  },
  {
    title: "UniVerse",
    eyebrow: "Campus app - 2025",
    img: "/img/no-img.jpg",
    imgWidth: 453,
    imgHeight: 340,
    description:
      "Real-time campus app for shared rides, errands, and micro-tasks with GPS, GeoJSON room detection, and zone-based communication.",
    stack: ["React Native", "Node.js", "Firebase Auth", "Socket.IO", "TypeScript", "GeoJSON"],
    repo: "https://github.com/SahirSood/UniVerse",
    type: "Mobile",
    signal: "Realtime mobile systems, live location, and student workflow constraints.",
  },
  {
    title: "Spotify Playlist Generator",
    eyebrow: "Mar 2025 - Present",
    img: "/img/spotify-project.png",
    imgWidth: 1024,
    imgHeight: 768,
    description:
      "A real-time playlist generator that creates personalized Spotify playlists from mood and preferences using an AI-backed workflow.",
    stack: ["Python", "React", "Node.js", "AWS", "OpenAI API", "GitHub Actions"],
    repo: "https://github.com/SahirSood/Spotify-Playlist-Generator",
    type: "AI",
    signal: "API orchestration, AI product thinking, deployment, and a music-first user flow.",
  },
  {
    title: "BeerIQ",
    eyebrow: "Oct - Dec 2024",
    img: "/img/no-img.jpg",
    imgWidth: 453,
    imgHeight: 340,
    description:
      "A social review platform for discovering breweries, rating drinks, and sharing recommendations with friends.",
    stack: ["Kotlin", "Firebase", "Android Studio", "Google Maps API", "Python"],
    repo: "https://github.com/SahirSood/BeerIQ/tree/main",
    type: "Mobile",
    signal: "Android product work with maps, Firebase data, and social review mechanics.",
  },
  {
    title: "TripMate",
    eyebrow: "Oct - Dec 2023",
    img: "/img/tripmate-logo.png",
    imgWidth: 1262,
    imgHeight: 311,
    description:
      "A travel planning app that helps users organize trips, share itineraries, and discover new destinations.",
    stack: ["Ruby", "Rails", "PostgreSQL", "WebSockets"],
    repo: "",
    type: "Web",
    signal: "Backend-heavy app structure with collaborative planning features.",
  },
  {
    title: "Financial Fast Feed",
    eyebrow: "Jan - Apr 2025",
    img: "/img/fff.jpg",
    imgWidth: 492,
    imgHeight: 108,
    description:
      "Login and bookmark flows for a personalized financial news feed so users can save, revisit, and manage articles.",
    stack: ["React", "Postman", "Node.js", "Flask", "RESTful APIs"],
    repo: "https://github.com/SahirSood/financial-fast-feed",
    type: "Web",
    signal: "Authentication, saved-state product flows, and team API integration.",
  },
  {
    title: "Sensor Movement Data Analysis",
    eyebrow: "Feb - Mar 2025",
    img: "/img/kmeans.png",
    imgWidth: 744,
    imgHeight: 524,
    description:
      "ML models using smartphone sensor data to detect and classify human activities with clear analysis and visualization.",
    stack: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
    repo: "",
    type: "Data",
    signal: "Data cleaning, model training, visualization, and evaluation.",
  },
  {
    title: "Apocalypse Rerising",
    eyebrow: "Dec 2022",
    img: "/img/img-zmb.jpg",
    imgWidth: 225,
    imgHeight: 225,
    description: "A 2D survival game with wave-based enemies, power-ups, and arcade progression.",
    stack: ["Python", "Pygame"],
    repo: "https://github.com/SahirSood/Apocalypse-Rerising/commits/main/",
    type: "Game",
    signal: "Early game-loop thinking, collision logic, progression, and player feedback.",
  },
  // {
  //   title: "Fall Hackathon - Endless Scroller",
  //   eyebrow: "Fall 2022",
  //   img: "/img/no-img.jpg",
  //   description: "An endless 2D scroller with score-based obstacles, power-ups, and hackathon build pace.",
  //   stack: ["Java", "Spring Boot", "Angular", "Docker", "Kubernetes", "PostgreSQL"],
  //   repo: "https://github.com/SahirSood/FallHackathonProject",
  //   type: "Game",
  //   signal: "Ambitious stack exposure and fast team delivery under hackathon pressure.",
  // },
];

const PROJECT_DETAILS = {
  "ai-trading-arena": {
    title: "AI Trading Arena",
    eyebrow: "Featured project",
    status: "Ongoing",
    timeframe: "Ongoing",
    category: "AI + finance systems",
    description:
      "A full-stack capital markets simulation where Claude and OpenAI trading agents compete inside a custom C++ limit order book.",
    overview: [
      "AI Trading Arena is a market simulation platform where trading agents read market prices, finance news, and optional SEC filing evidence before producing structured trade decisions.",
      "The system connects a native C++ matching engine, Python simulation scheduler, FastAPI backend, SQLAlchemy persistence, WebSocket live events, and a React dashboard so model behavior can be compared across identical trading personas.",
    ],
    technologies: ["C++17", "Python", "FastAPI", "React", "SQLAlchemy", "PostgreSQL", "WebSockets", "OpenAI", "Claude", "SEC EDGAR", "RAG"],
    highlights: [
      { label: "Core engine", value: "C++ order book" },
      { label: "Agents", value: "Claude vs OpenAI" },
      { label: "Live layer", value: "FastAPI + WebSockets" },
    ],
    featuredTitle: "Why it stands out",
    featured:
      "This project brings together market structure, systems programming, AI agents, backend orchestration, evidence retrieval, and a live product dashboard. It is not just an AI wrapper; the agents have to operate inside a simulated market with fills, portfolios, PnL, and recorded reasoning.",
    sections: [
      {
        title: "Problem",
        body: "Most AI finance demos stop at generating a recommendation. This project asks a harder question: what happens when multiple model-backed trading agents make decisions repeatedly inside the same simulated market, with a real order book, portfolio state, and decision logs?",
      },
      {
        title: "My role",
        body: "I built the native matching engine, Python simulation scheduler, bot personalities, FastAPI backend, SQLAlchemy persistence layer, SEC/RAG ingestion pipeline, and React dashboard. I also designed the strict JSON decision format used to log actions, reasoning, confidence, evidence, fills, and portfolio snapshots.",
      },
      {
        title: "Market engine",
        body: "The core finance engine is a custom C++ central limit order book with buy and sell books, limit and market orders, price-time priority matching, FIFO ordering within price levels, order cancellation, top-of-book snapshots, depth snapshots, spread and mid-price calculation, and trade logs exposed to Python through pybind11.",
      },
      {
        title: "AI layer",
        body: "Five bot personalities are duplicated across Claude and OpenAI providers: BearBot, DegenBot, AnalystBot, ContrarianBot, and MacroBot. They consume market, news, portfolio, and optional evidence context, then return structured decisions that the scheduler can submit into the engine or convert to HOLD when calls fail.",
      },
      {
        title: "Evidence layer",
        body: "The RAG layer ingests SEC EDGAR filings, stores documents and chunks, supports embeddings with optional FAISS ranking, and falls back to cosine or keyword retrieval when needed. Retrieved evidence can be injected into prompts and persisted with decision logs.",
      },
      {
        title: "Dashboard",
        body: "The React frontend shows the live arena, bot summaries, reasoning details, order book depth, trade history, sandbox controls, PnL, rankings, and live decision or heartbeat events streamed over WebSockets.",
      },
      {
        title: "Roadmap",
        body: "Next phases include deterministic risk controls before non-HOLD orders, an MCP-backed bot decision path, historical replay with an as-of clock, retrieval quality evaluation, evidence citation scoring, and model comparison on identical replay inputs.",
      },
    ],
    personal:
      "This is the project that best connects my computing science and finance interests: low-level market mechanics, backend systems, AI behavior, and product presentation all have to work together.",
  },
};

const EXPERIENCE = [
  {
    id: "rbc",
    company: "RBC",
    role: "Full Stack Developer",
    timeframe: "May 2026 - Dec 2026",
    status: "Current",
    team: "Global Functions Technology under ASEDA",
    logo: rbcLogo,
    logoWidth: 200,
    logoHeight: 200,
    summary:
      "I work on Functions Assist, RBC's internal AI platform for building specialized tools for departments across the organization. My work is primarily frontend-focused, with backend debugging and integration work when needed.",
    tags: ["Python", "React", "JavaScript", "AI Platform", "Internal Tools"],
    priority: true,
  },
  {
    id: "redbrick-paved",
    company: "RedBrick (Paved)",
    role: "Software Developer",
    timeframe: "Jan 2026 - Apr 2026",
    industry: "Ad-tech",
    logo: pavedLogo,
    logoWidth: 1000,
    logoHeight: 1000,
    summary:
      "At RedBrick, I worked on Paved, an ad-tech platform used by publishers and advertisers to manage newsletter advertising. It was my first experience contributing to an established production codebase.",
    tags: ["Ruby", "Python", "JavaScript", "TypeScript", "GitHub Actions", "Ad-Tech", "CI/CD"],
    priority: true,
  },
  {
    id: "mothertongue",
    company: "MotherTongue",
    role: "Lead Developer",
    timeframe: "May - Aug 2025",
    logo: "/img/mothertongue-logo.jpg",
    logoWidth: 722,
    logoHeight: 668,
    summary:
      "MotherTongue is an AI-powered writing coach designed to help people improve how they communicate, not simply correct individual sentences. I helped build the MVP from the ground up.",
    tags: ["React", "JavaScript", "OpenAI API", "JMeter", "Selenium", "Chrome API", "Node.js", "Firestore"],
    priority: true,
  },
  {
    company: "Kapali Developments",
    role: "Contract Software Developer",
    timeframe: "Jan - Apr 2025",
    logo: "/img/kapali.png",
    logoWidth: 704,
    logoHeight: 553,
    summary:
      "Built a React and Firestore financial dashboard for property and investment tracking, with backend automation for reporting and equity splits.",
    tags: ["Firestore", "React", "JavaScript", "Node.js", "Firebase Functions", "SQL"],
  },
  {
    company: "Kapali Developments",
    role: "Part-time Assistant",
    timeframe: "Jul 2022 - Sep 2024",
    logo: "/img/kapali.png",
    logoWidth: 704,
    logoHeight: 553,
    summary:
      "Improved social media engagement, streamlined financial reporting in Excel, and helped redesign brand touchpoints.",
    tags: ["Excel", "Social Media", "Web Design", "Project Management"],
  },
  {
    company: "PedalHeads",
    role: "Camp Counselor",
    timeframe: "Jun - Aug 2021",
    logo: "/img/pedalheads.jpg",
    logoWidth: 225,
    logoHeight: 225,
    summary:
      "Taught children bike riding skills, handled first aid, and kept groups safe and confident through clear communication and creative problem solving.",
    tags: ["Leadership", "First Aid", "Communication", "Problem Solving"],
  },
];

const EXPERIENCE_DETAILS = {
  rbc: {
    id: "rbc",
    title: "Full Stack Developer",
    company: "RBC",
    dates: "May 2026 to December 2026",
    status: "Current",
    team: "Global Functions Technology under ASEDA",
    logo: rbcLogo,
    technologies: ["Python", "React", "JavaScript"],
    overview: [
      "I work on Functions Assist, RBC's internal AI platform for building specialized tools for departments across the organization. Teams such as HR and Finance bring us problems involving documents, policies, internal information, or complex workflows, and we help turn those needs into focused AI applications.",
      "My work has primarily been frontend-focused, with additional backend debugging and integration work. I have contributed to tools that make large collections of internal information easier to search, understand, filter, and explore.",
    ],
    featuredTitle: "ARC Lineage",
    featured:
      "I built the full user interface for a lineage and document-exploration experience. Users can visually explore documents, understand where information came from, view relationships and authorship, and narrow large result sets through search and filtering. I also helped with backend debugging and integration issues when needed.",
    sections: [
      {
        title: "Problem",
        body: "Internal policies and documents can be difficult to navigate when information is spread across large collections and connected through relationships that are not immediately visible. The goal was to make this information easier to search, understand, and trace back to its source.",
      },
      {
        title: "My role",
        body: "I owned the frontend implementation for the document and lineage exploration experience. I translated product requirements and evolving designs into a usable React interface, built the search and filtering interactions, and worked with backend developers to debug integration issues. I also had to make practical product decisions about how filtering, search timing, loading behavior, and the visualization should feel when users were working with large result sets.",
      },
      {
        title: "Technical decisions",
        body: "I focused on keeping the interface responsive and understandable as users searched, filtered, and moved through connected information. This included deciding how search input should be handled, when filtered results should update, how state should be represented in the UI, and how backend responses should be transformed into a clear visual experience.",
      },
      {
        title: "Hard part",
        body: "The hardest part was building against requirements that continued to evolve while coordinating with people working across different components, teams, and locations. The UI had to remain intuitive even though the underlying information and relationships were complex.",
      },
      {
        title: "Result",
        body: "I shipped the complete UI for the explorer experience, including document visualization, authorship and source context, search, and filtering. The result was a much faster and more approachable way to move through connected information than manually searching through documents one at a time.",
      },
      {
        title: "What I learned",
        body: "This role has taught me how product development works inside a large engineering organization. I have become more comfortable collaborating in person, communicating across countries and time zones, debugging work across the frontend and backend boundary, and turning an initially broad business request into something people can actually use.",
      },
    ],
    personal:
      "What I enjoy most about this work is that every internal team brings a different kind of problem. It has pushed me to think beyond simply building screens and to understand what information people actually need, how they expect to find it, and what makes an AI product useful in practice.",
  },
  "redbrick-paved": {
    id: "redbrick-paved",
    title: "Software Developer",
    company: "RedBrick, working on Paved",
    dates: "January 2026 to April 2026",
    status: "Completed co-op",
    industry: "Ad-tech",
    logo: pavedLogo,
    technologies: ["Ruby", "Python", "JavaScript", "TypeScript", "GitHub Actions", "CI/CD"],
    overview: [
      "At RedBrick, I worked on Paved, an ad-tech platform used by publishers and advertisers to manage newsletter advertising. It was my first experience contributing to an established production codebase where reliability, testing, code review, and understanding existing systems mattered just as much as writing new code.",
      "My work crossed backend development, validation, testing, caching, and internal product improvements. I learned how seemingly small changes can affect campaign workflows, publisher data, dynamic links, and the reliability of a larger platform.",
    ],
    featuredTitle: "Production codebase work",
    featured:
      "I contributed production code across the Paved codebase, worked through bugs and feature requests, participated in code review and daily team workflows, and improved automated testing around important application behavior.",
    sections: [
      {
        title: "Problem",
        body: "Paved processes campaign data, publisher information, newsletter content, and dynamic links across a mature product. Features need to behave correctly across many possible inputs, while regressions can affect real advertising workflows.",
      },
      {
        title: "My role",
        body: "I contributed production code across the Paved codebase, worked through bugs and feature requests, participated in code review and daily team workflows, and improved automated testing around important application behavior. One of my larger testing contributions increased coverage for the relevant area from approximately 15% to 93% through render-focused tests. I also worked on validating dynamic URL parameters and contributed to backend systems involving application data and caching.",
      },
      {
        title: "Technical decisions",
        body: "Much of the work required understanding how existing code behaved before changing it. I had to decide where validation belonged, which edge cases needed explicit coverage, and how to make changes without breaking existing campaign or publishing workflows. I also gained experience with caching, CI/CD checks, test reliability, and working inside an established development process rather than building an isolated project from scratch.",
      },
      {
        title: "Hard part",
        body: "The hardest part was learning a large unfamiliar system quickly enough to make safe changes. A task that looked small on the surface could touch data models, rendering behavior, dynamic parameters, tests, or downstream campaign logic.",
      },
      {
        title: "Result",
        body: "I shipped production changes, substantially improved test coverage in an area of the application, strengthened validation for dynamic inputs, and left parts of the codebase safer to modify in the future.",
      },
      {
        title: "What I learned",
        body: "RedBrick taught me how professional software teams protect production systems. I became more disciplined about reading unfamiliar code, testing edge cases, communicating through reviews, responding to feedback, and considering the downstream consequences of a change.",
      },
    ],
    personal:
      "What stood out to me was how different real product development felt from school projects. The goal was not simply to make something work once. It had to fit the existing system, pass review, remain maintainable, and continue working for people who already depended on it.",
  },
  mothertongue: {
    id: "mothertongue",
    title: "Lead Developer",
    company: "MotherTongue",
    dates: "May 2025 to August 2025",
    status: "MVP build",
    logo: "/img/mothertongue-logo.jpg",
    logoWidth: 722,
    logoHeight: 668,
    technologies: ["React", "JavaScript", "Node.js", "OpenAI API", "Chrome APIs", "Firestore", "JMeter", "Selenium"],
    overview: [
      "MotherTongue is an AI-powered writing coach designed to help people improve how they communicate, not simply correct individual sentences. The product analyzes writing for areas such as clarity, grammar, tone, conciseness, and structure, then turns those patterns into personalized feedback and learning.",
      "I helped build the product from the ground up, with a focus on the backend, AI integrations, browser-extension architecture, data storage, and the systems connecting the analysis experience to the React interface.",
    ],
    featuredTitle: "Product story",
    featured:
      "The idea came from seeing that writing tools often fix the sentence in front of the user without helping them understand their recurring habits. MotherTongue is intended to identify those patterns over time and provide feedback, lessons, and quizzes that help users become stronger writers independently.",
    sections: [
      {
        title: "Problem",
        body: "Traditional grammar tools are useful for immediate corrections, but they can make users dependent on suggestions. We wanted to explore a different approach: identify recurring weaknesses, explain them clearly, and help users improve through personalized practice.",
      },
      {
        title: "My role",
        body: "I helped build the MVP end to end and took primary responsibility for backend services and technical integrations. This included connecting the application to OpenAI models, building the Node.js service layer, storing user progress in Firestore, supporting the Chrome extension, and connecting the analysis pipeline to the frontend experience. I also helped coordinate product development, worked through ambiguous requirements, and onboarded another developer to contribute to the frontend.",
      },
      {
        title: "Technical decisions",
        body: "A major design challenge was deciding what belonged in the browser extension, what belonged in the backend, and how much writing context should be analyzed at once. The system needed enough context to produce useful feedback without creating unnecessary model calls, delays, or cost. The implementation used structured analysis categories, Firestore for user state and progress, Chrome extension APIs, a Node.js backend, OpenAI integration for feedback, and testing with JMeter and Selenium.",
      },
      {
        title: "Hard part",
        body: "The hardest part was turning a broad idea into a coherent product. Writing quality is subjective, AI responses are not always consistent, and the browser environment creates its own limitations. I had to work through product ambiguity, model-output structure, state management, extension behavior, and integration issues at the same time.",
      },
      {
        title: "Result",
        body: "We produced a functional MVP that could capture writing, analyze it across multiple categories, return sentence-level feedback, and store user progress for future learning experiences.",
      },
      {
        title: "What I learned",
        body: "MotherTongue taught me how different it is to build a product when there is no existing roadmap. I learned to break an unclear vision into smaller technical systems, make tradeoffs with limited time, communicate work to another developer, and think about whether a feature is genuinely useful rather than merely technically impressive.",
      },
    ],
    personal:
      "This is one of the projects I care about most because it combines engineering with a real human problem. It pushed me to think like a developer, product owner, and user at the same time.",
  },
};

const EDUCATION = [
  {
    school: "Simon Fraser University",
    program: "Computing Science + Finance",
    timeframe: "Vancouver, BC",
    detail:
      "Studying Computing Science with a finance focus lets me connect technical problem solving with the systems that move money, risk, and decisions through real organizations.",
    extra:
      "The mix helps me approach software as more than code: I want to understand the user, the financial process, and the system behind the product.",
    highlights: ["Systems and APIs", "Data structures", "Financial markets", "Risk and investment"],
  },
  {
    school: "University of Leeds",
    program: "International Exchange Semester",
    timeframe: "Spring 2024 - Leeds, United Kingdom",
    area: "Finance",
    detail:
      "Exchange pushed me into a setting where I had to build a life independently, meet people from different backgrounds, and navigate unfamiliar situations.",
    extra:
      "Living in Leeds made me more independent, more confident, and better at communicating with people whose habits and perspectives were different from mine.",
    highlights: ["Finance exchange", "Independence", "Cross-cultural teams", "Travel perspective"],
  },
];

const EDUCATION_CARDS = [
  {
    title: "Computing Science",
    body: "Areas studied include data structures, algorithms, databases, web systems, APIs, software design, lower-level programming, data science, computer vision, multimedia systems, and project-based development.",
  },
  {
    title: "Finance",
    body: "Areas studied include international finance, capital markets, real-estate investment, financial analysis, risk, institutions, currencies, and how financial decisions move through organizations.",
  },
  {
    title: "Learning through projects",
    body: "Many of my courses have involved group projects where the technical work was only part of the challenge. I learned how to divide ambiguous work, communicate across different strengths, manage deadlines, resolve disagreements, and bring separate contributions into one finished product.",
  },
];

const STUDY_ABROAD_CARDS = [
  {
    title: "Independence",
    body: "I arrived without an existing support system and had to handle daily life, travel, unfamiliar environments, and unexpected problems on my own. That experience made me much more comfortable entering situations where I do not already know the answer.",
  },
  {
    title: "People",
    body: "The most meaningful part of the semester was the friendships I formed. Some of my closest friends are now from France, Spain, Mexico, South America, Australia, and other parts of the world.",
  },
  {
    title: "Perspective",
    body: "Travelling and meeting people outside my usual environment gave me a more compassionate and less siloed view of the world. I became better at adapting how I communicate instead of expecting everyone to think or work the same way I do.",
  },
  {
    title: "Memorable part",
    body: "The places were unforgettable, but the people defined the experience. Travelling together, learning one another's cultures, and building friendships in such a short period made the semester feel like much more than school abroad.",
  },
];

const EXTRACURRICULARS = [
  // {
  //   title: "Hackathons",
  //   detail:
  //     "I enjoy hackathons because they compress an entire product cycle into a single day. A team has to understand the prompt, choose an idea that is ambitious but realistic, divide the work, build under pressure, and prepare something worth demonstrating before time runs out.",
  //   points: [
  //     "I have participated in hackathons such as nwHacks, StormHacks, and Hack the Mountain.",
  //     "Teams were generally around four people, and I worked as a developer.",
  //     "Most projects were built within approximately one day, demonstrated at the end, and shaped by useful feedback.",
  //     "One project I am especially proud of is UniVerse, a campus-focused application designed around helping students coordinate shared rides, errands, and small tasks.",
  //     "The time pressure is what makes hackathons enjoyable for me. There is no room to overthink every decision. You have to communicate clearly, control the scope, solve the next problem, and keep moving until there is something real to show.",
  //   ],
  //   color: "bg-blue-50 text-blue-700 border-blue-100",
  // },
  {
    title: "Basketball",
    detail:
      "I have played basketball for most of my life, especially pickup basketball. I enjoy showing up at different parks and gyms, finding the best available competition, and playing with people I may never have met before that day.",
    points: [
      "What I like about pickup is that every game is different. Some players move the ball, some want to control every possession, some communicate constantly, and some barely speak.",
      "You have to understand the personalities on your team quickly and figure out how to contribute.",
      "Basketball is also one of my favourite ways to release energy. I enjoy the competition, the pressure of having the ball when a possession matters, and the feeling that my effort and decision-making are directly in my control.",
    ],
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    title: "Snowboarding",
    detail:
      "Snowboarding is its own reset for me. It is physical, technical, and completely absorbing in a way that feels different from hiking or team sports.",
    points: [
      "I like the mix of speed, control, and progression. Small improvements in balance or edge control are immediately noticeable.",
      "A good day on the mountain forces me to stay present because the conditions, terrain, and visibility keep changing.",
      "It also connects naturally to living near Vancouver, where getting outside in the winter can be just as energizing as summer hikes or beach days.",
    ],
    color: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    title: "Travel",
    detail:
      "Travel is one of the biggest influences on how I see people and the world. I enjoy going beyond the main attractions, talking to locals, eating regional food, walking through neighbourhoods, and seeing what everyday life feels like somewhere unfamiliar.",
    points: [
      "Studying abroad gave me the opportunity to travel extensively, but the most meaningful part was learning to adapt to people and environments that worked differently from what I knew.",
      "Prague, Morocco and the Sahara, Italy, and a spontaneous football game in Florence are some of the memories that shaped how I think about travel.",
      "Travel has made me more independent, more curious, and much better at communicating across different personalities and cultures.",
    ],
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    title: "Outdoors",
    detail:
      "I spend a lot of my free time hiking, biking, paddleboarding, going to the beach, cliff jumping, and playing basketball outside. Much of school and software development happens in front of a screen, so being outside gives me a complete change of pace.",
    points: [
      "I enjoy both the scenery and the challenge. A long hike forces me to remain present, work through fatigue, and spend an entire day away from notifications, schoolwork, and technology.",
      "Panorama Ridge is one of my favourite hikes and one of the outdoor accomplishments I am most proud of.",
      "The route was roughly 30 kilometres and exhausting, but the final view made the full day of effort worth it.",
    ],
    color: "bg-lime-50 text-lime-700 border-lime-100",
  },
];

const TRAVEL_PLACES = [
  {
    country: "United Kingdom",
    code: "UK",
    places: [
      { name: "Leeds", lat: 53.8008, lng: -1.5491, note: "My home during exchange and the place where I met some of my favourite people. Leeds became much more than the city where I studied." },
      { name: "London", lat: 51.5072, lng: -0.1276, note: "Seeing London in person felt surreal. One of my favourite memories was exploring its food markets and trying completely different things in one place." },
      { name: "Edinburgh", lat: 55.9533, lng: -3.1883, note: "A beautiful and atmospheric city. Hiking Arthur's Seat at night was memorable, even though parts of it felt much sketchier than expected." },
      { name: "York", lat: 53.959, lng: -1.0815, note: "York felt like walking through a Harry Potter setting. Visiting it with much of my exchange group made the day especially memorable." },
      { name: "Manchester", lat: 53.4808, lng: -2.2426, note: "Watching both Manchester City and Manchester United play was an unbelievable experience. The atmosphere was unlike anything I had experienced at a North American sporting event." },
      { name: "Knaresborough", lat: 54.0091, lng: -1.4685, note: "A small, historic town that felt almost unreal because of how old and picturesque everything looked." },
      { name: "Birmingham", lat: 52.4862, lng: -1.8904, note: "Birmingham felt unexpectedly familiar and comfortable. It gave me a different view of England outside the destinations that dominate most travel itineraries." },
    ],
  },
  {
    country: "France",
    code: "FR",
    places: [
      { name: "Paris", lat: 48.8566, lng: 2.3522, note: "Paris already felt larger than life, and seeing Kanye West perform there made the trip even more surreal." },
      { name: "Lyon", lat: 45.764, lng: 4.8357, note: "I met a group of people through the hostel and had one of the best nights of the trip with them. I am still connected with some of those people today." },
      { name: "Nice", lat: 43.7102, lng: 7.262, note: "Nice was peaceful, bright, and one of the most naturally beautiful stops of the exchange." },
    ],
  },
  {
    country: "Monaco",
    code: "MC",
    places: [
      { name: "Monaco", lat: 43.7384, lng: 7.4246, note: "Monaco was surreal to see in person. The scale of wealth and the environment changed how I thought about goals, lifestyle, and different versions of success." },
    ],
  },
  {
    country: "Italy",
    code: "IT",
    places: [
      { name: "Rome", lat: 41.9028, lng: 12.4964, note: "Rome makes history feel physical. Walking beside structures that have existed for around two thousand years, including the Colosseum, was difficult to comprehend. Being there on Easter Sunday and seeing the Pope was also a unique cultural experience, even though I am not Catholic." },
      { name: "Florence", lat: 43.7696, lng: 11.2558, note: "Florence was beautiful, but my favourite memory was the spontaneous football game with a local kid. It made the city feel personal rather than simply historic." },
      { name: "Pisa", lat: 43.7228, lng: 10.4017, note: "Pisa was a quick and memorable stop centred largely around finally seeing the famous leaning tower in person." },
      { name: "Venice", lat: 45.4408, lng: 12.3155, note: "Venice was unlike anywhere else I visited. Getting lost in its narrow routes and eventually working out how to return became part of the fun." },
    ],
  },
  {
    country: "Spain",
    code: "ES",
    places: [
      { name: "Barcelona", lat: 41.3874, lng: 2.1686, note: "Barcelona felt unexpectedly familiar in certain ways and reminded me of parts of India. It was colourful, energetic, and unlike the other European cities I visited." },
      { name: "Madrid", lat: 40.4168, lng: -3.7038, note: "Madrid reminded me of London in its size and city energy. The trip had a couple of very difficult mornings, but I still left appreciating the city and Spain overall." },
    ],
  },
  {
    country: "Portugal",
    code: "PT",
    note: "I travelled through Portugal alone, which made the trip especially important for my confidence and independence.",
    places: [
      { name: "Porto", lat: 41.1579, lng: -8.6291, note: "Porto felt compact, historic, and easy to explore alone. Visiting its unusually ornate McDonald's location was a funny and memorable stop." },
      { name: "Lisbon", lat: 38.7223, lng: -9.1393, note: "Lisbon had some of my favourite food, views, music, and overall energy of the entire exchange. Music seemed to appear everywhere, and the city always felt alive." },
      { name: "Sintra", lat: 38.8029, lng: -9.3817, note: "Sintra felt completely different from Lisbon despite being so close. Its scenery and architecture made it feel like a separate world within the same solo trip." },
    ],
  },
  { country: "Czech Republic", code: "CZ", places: [{ name: "Prague", lat: 50.0755, lng: 14.4378, note: "Prague combined remarkable architecture with the energy of a much more modern party city. Visiting with my closest exchange friends at the end of the year made it especially meaningful." }] },
  { country: "Denmark", code: "DK", places: [{ name: "Copenhagen", lat: 55.6761, lng: 12.5683, note: "Copenhagen stood out because it felt like a city where daily life would genuinely be comfortable. It was beautiful, organized, lively, and far easier to imagine living in than many places that were primarily exciting to visit." }] },
  { country: "Ireland", code: "IE", places: [{ name: "Dublin", lat: 53.3498, lng: -6.2603, note: "Dublin was centred around local pubs, live atmosphere, and finally visiting the Guinness Storehouse as someone who genuinely enjoys Guinness." }] },
  {
    country: "Morocco",
    code: "MA",
    places: [
      { name: "Morocco", lat: 31.7917, lng: -7.0926, note: "Morocco had some of the best food of my travels and gave me a completely different perspective from Western Europe. The markets, streets, hospitality, and pace of life made the trip feel genuinely new." },
      { name: "Sahara Desert", lat: 30.5595, lng: -4.876, note: "Seeing the Sahara was astounding. The scale, silence, landscape, and night sky made it one of the most unforgettable environments I have ever experienced." },
    ],
  },
  {
    country: "Canada",
    code: "CA",
    places: [
      { name: "Vancouver", lat: 49.2827, lng: -123.1207, note: "Home base and the standard I naturally compare other cities against. It combines city life, mountains, water, and access to the outdoors in a way that is difficult to replace." },
      { name: "Victoria", lat: 48.4284, lng: -123.3656, note: "A familiar getaway that I have visited frequently. It is slower and more relaxed than Vancouver while still feeling close to home." },
      { name: "Tofino", lat: 49.153, lng: -125.9066, note: "A west-coast destination known for its ocean scenery and slower pace." },
      { name: "Kelowna", lat: 49.888, lng: -119.496, note: "A regular British Columbia getaway associated with warm weather, lakes, and time away from the city." },
      { name: "Kamloops", lat: 50.6745, lng: -120.3273, note: "A very different side of British Columbia, with a drier landscape and a more open, interior feel." },
      { name: "Osoyoos", lat: 49.0323, lng: -119.4682, note: "One of the warmest-feeling parts of British Columbia and a place that feels dramatically different from the coast." },
      { name: "Calgary", lat: 51.0447, lng: -114.0719, note: "A major western Canadian city and a useful starting point for exploring Alberta and the Rockies." },
      { name: "Edmonton", lat: 53.5461, lng: -113.4938, note: "A northern prairie city that gave me another view of life outside British Columbia." },
      { name: "Banff", lat: 51.1784, lng: -115.5708, note: "One of the most striking mountain environments I have visited, surrounded by scenery that rarely looks real in photographs." },
      { name: "Jasper", lat: 52.8737, lng: -118.0814, note: "A quieter and more spread-out Rocky Mountain experience, with the landscape being the main reason to be there." },
      { name: "Saskatoon", lat: 52.1579, lng: -106.6702, note: "A chance to experience the Canadian Prairies and a city with a very different scale and landscape from Vancouver." },
    ],
  },
  {
    country: "United States",
    code: "US",
    places: [
      { name: "Seattle", lat: 47.6062, lng: -122.3321, note: "Seattle feels like Vancouver's close relative. The weather, landscape, culture, and proximity make it feel familiar while still being distinctly American." },
      { name: "Portland", lat: 45.5152, lng: -122.6784, note: "Portland offered a different Pacific Northwest atmosphere, with a strong local identity and sports culture." },
      { name: "Los Angeles", lat: 34.0522, lng: -118.2437, note: "Los Angeles felt enormous and spread out, but the Mexican food was one of the clearest highlights." },
      { name: "San Diego", lat: 32.7157, lng: -117.1611, note: "San Diego may be the most naturally beautiful American city I have visited. The coastline, weather, and overall pace stood out immediately." },
      { name: "Miami", lat: 25.7617, lng: -80.1918, note: "Miami was energetic, excessive, and a lot of fun to experience on a budget. It felt completely different from the Pacific Northwest." },
      { name: "New York City", lat: 40.7128, lng: -74.006, note: "New York is my favourite American city and the place I most hope to work for a period of my career. I love its pace, density, ambition, food, and the feeling that something is always happening." },
      { name: "New Jersey", lat: 40.0583, lng: -74.4057, note: "New Jersey is personally meaningful because I have family there, even though I do not remember every visit clearly." },
    ],
  },
  { country: "Hong Kong SAR", code: "HK", places: [{ name: "Hong Kong", lat: 22.3193, lng: 114.1694, note: "I visited when I was young, so my memories are limited. It remains one of the places I would like to experience again with an adult perspective." }] },
  { country: "Macau SAR", code: "MO", places: [{ name: "Macau", lat: 22.1987, lng: 113.5439, note: "I also visited Macau when I was young. One of the clearest impressions I retained was how expensive and extravagant parts of it felt." }] },
  {
    country: "India",
    code: "IN",
    places: [
      { name: "Punjab", lat: 31.1471, lng: 75.3412, note: "Punjab feels like home because of my family and cultural connection to the region. It is different from travelling somewhere as an outsider because the food, language, people, and traditions are personally familiar." },
      { name: "New Delhi", lat: 28.6139, lng: 77.209, note: "New Delhi showed me the scale, history, intensity, and complexity of India's capital." },
    ],
  },
  {
    country: "Mexico",
    code: "MX",
    places: [
      { name: "Mexico City", lat: 19.4326, lng: -99.1332, note: "Food, museums, and city scale." },
      { name: "Puebla", lat: 19.0414, lng: -98.2063, note: "Color, food, and a slower day trip." },
    ],
  },
];

const TRAVEL_INTRO = [
  "Travel is one of the biggest influences on how I see people and the world. I enjoy going beyond the main attractions, talking to locals, eating regional food, walking through neighbourhoods, and seeing what everyday life feels like somewhere unfamiliar.",
  "Studying abroad gave me the opportunity to travel extensively, but the most meaningful part was learning to adapt to people and environments that worked differently from what I knew. It made me more independent, more curious, and much better at communicating across different personalities and cultures.",
];

const TRAVEL_HIGHLIGHTS = [
  {
    title: "Prague",
    body: "I visited Prague near the end of my exchange with some of my closest friends from the year. The food, architecture, energy, and the people I shared it with made it one of my favourite trips.",
  },
  {
    title: "Morocco and the Sahara",
    body: "Morocco gave me one of the most different cultural experiences of my travels. The food, especially tagine, was unforgettable, and seeing the Sahara in person was almost impossible to process.",
  },
  {
    title: "Italy",
    body: "Italy had been one of my dream destinations. Having enough time to wander, speak with people, eat slowly, and experience several very different cities made it feel less like checking off attractions and more like briefly living there.",
  },
  {
    title: "Favourite local interaction",
    body: "One of my favourite travel memories happened after leaving a restaurant in Florence. We saw a kid playing football near his home and ended up joining him for close to two hours. He spoke six languages and had an incredible personality. It was a small, unplanned experience, but it captured what I enjoy most about travelling.",
  },
];

const PROFILES = [
  {
    id: "recruiter",
    name: "Recruiter",
    owner: "Hiring team",
    avatar: "R",
    accent: "#4285f4",
    bg: "bg-blue-500",
    icon: BriefcaseBusiness,
    message: "Experience, projects, resume, and contact in the shortest path.",
    startQuery: "Why should we interview Sahir?",
  },
  {
    id: "builder",
    name: "Builder",
    owner: "Engineering peer",
    avatar: "B",
    accent: "#34a853",
    bg: "bg-emerald-500",
    icon: Code2,
    message: "Technical decisions, stacks, case studies, and product systems.",
    startQuery: "Show me Sahir's strongest engineering work",
  },
  {
    id: "explorer",
    name: "Explorer",
    owner: "Creative visitor",
    avatar: "E",
    accent: "#fbbc04",
    bg: "bg-amber-400",
    icon: Compass,
    message: "Travel map, personal story, projects, and the Snake game.",
    startQuery: "What makes this portfolio personal?",
  },
  {
    id: "sahir",
    name: "Sahir Sood",
    owner: "About profile",
    avatar: "photo",
    accent: "#ea4335",
    bg: "bg-red-500",
    icon: UserRound,
    message: "A personal about page with education, map, and extracurriculars.",
    startQuery: "Tell me about Sahir",
  },
];

const QUESTION_BANK = [
  "Why should we interview Sahir?",
  "Show me Sahir's strongest engineering work",
  "What experience does Sahir have?",
  "Which projects prove full-stack ability?",
  "What is Sahir like outside code?",
  "How can I contact Sahir?",
];

const ANSWERS = {
  "why should we interview sahir":
    "Sahir combines practical software experience, product sense, and a broad build history: current full stack work at RBC, RedBrick/Paved production software work, MotherTongue MVP leadership, and projects across AI, finance, web, mobile, backend, data, and games.",
  "show me sahir's strongest engineering work":
    "Start with AI Trading Arena for AI + finance systems work, MotherTongue for AI + Chrome extension architecture, RedBrick/Paved for production engineering, and UniVerse for realtime mobile systems.",
  "what experience does sahir have":
    "Sahir is currently a Full Stack Developer at RBC, previously worked as a Software Developer at RedBrick/Paved, built the MotherTongue MVP as lead developer, and has contract dashboard experience with Kapali Developments.",
  "which projects prove full-stack ability":
    "AI Trading Arena, UniVerse, Spotify Playlist Generator, Financial Fast Feed, and TripMate show full-stack range across AI agents, native systems, market simulation, mobile, auth flows, backend services, databases, and realtime features.",
  "what is sahir like outside code":
    "Sahir is a Vancouver-based CS + Finance student who likes basketball, snowboarding, travel, the outdoors, and building projects with a mix of curiosity and competitiveness.",
  "how can i contact sahir":
    "Email Sahir at sahirsood@gmail.com, or open the Contact page to copy the email, launch a prefilled message, and find GitHub or LinkedIn.",
};

const BOOKMARKS = [
  { label: "Education", icon: GraduationCap, action: "education" },
  { label: "Resume", icon: FileText, action: "resume" },
  { label: "Experience", icon: BriefcaseBusiness, action: "experience" },
  { label: "Projects", icon: FolderKanban, action: "projects" },
  { label: "Skills", icon: Code2, action: "skills" },
  { label: "Map", icon: Map, action: "map" },
  { label: "Snake", icon: Gamepad2, action: "snake" },
  { label: "GitHub", icon: Github, href: "https://github.com/SahirSood" },
  { label: "Contact", icon: Mail, action: "contact" },
];

const SHORTCUTS = [
  { label: "Experience", icon: BriefcaseBusiness, color: "bg-blue-500", action: "experience" },
  { label: "Projects", icon: FolderKanban, color: "bg-amber-400", action: "projects" },
  { label: "Resume", icon: FileText, color: "bg-emerald-500", action: "resume" },
  { label: "Education", icon: GraduationCap, color: "bg-red-500", action: "education" },
  { label: "Skills", icon: Code2, color: "bg-violet-500", action: "skills" },
  { label: "About", icon: UserRound, color: "bg-cyan-500", action: "profile" },
  { label: "Map", icon: Map, color: "bg-lime-500", action: "map" },
  { label: "Snake", icon: Gamepad2, color: "bg-green-600", action: "snake" },
  { label: "Contact", icon: Mail, color: "bg-rose-500", action: "contact" },
];

const FAVORITES = [
  { label: "Account", icon: UserRound, color: "text-sky-600", action: "profile" },
  { label: "Contact", icon: Mail, color: "text-red-500", action: "contact" },
  { label: "Search", icon: Search, color: "text-blue-500", action: "home" },
  { label: "Resume", icon: FileText, color: "text-emerald-500", action: "resume" },
  { label: "Skills", icon: Code2, color: "text-green-600", action: "skills" },
  { label: "Experience", icon: BriefcaseBusiness, color: "text-blue-600", action: "experience" },
  { label: "Projects", icon: FolderKanban, color: "text-amber-600", action: "projects" },
  { label: "Education", icon: GraduationCap, color: "text-violet-600", action: "education" },
  { label: "Map", icon: Map, color: "text-emerald-600", action: "map" },
  { label: "Snake", icon: Gamepad2, color: "text-lime-600", action: "snake" },
  { label: "MotherTongue", icon: Sparkles, color: "text-purple-600", action: "mothertongue" },
  { label: "Paved", icon: ShieldCheck, color: "text-neutral-700", action: "paved" },
];

const RECENT_TABS = [
  {
    title: "RBC full stack developer",
    source: "experience.sahirsood.com",
    visited: "primary hiring signal",
    action: "rbc",
    icon: BriefcaseBusiness,
  },
  {
    title: "MotherTongue Chrome extension and AI writing feedback",
    source: "projects.sahirsood.com",
    visited: "MVP build",
    action: "mothertongue",
    icon: Sparkles,
  },
  {
    title: "Where Sahir has been",
    source: "maps.sahirsood.com",
    visited: "travel notes",
    action: "map",
    icon: Map,
  },
  {
    title: "Google-style Snake",
    source: "games.sahirsood.com",
    visited: "playable easter egg",
    action: "snake",
    icon: Gamepad2,
  },
];

const SNAKE_CONFIG = {
  size: 15,
  baseSpeed: 130,
  tokens: ["API", "RBC", "SFU", "JS", "SQL", "AI", "YVR"],
};

const SKILL_LANES = [
  {
    title: "Most recruiter-relevant",
    summary: "React, Node.js, Python, TypeScript, SQL, GitHub Actions",
    detail: "The stack I would expect to use fastest on full-stack/product teams.",
    tone: "blue",
  },
  {
    title: "Backend and data",
    summary: "Rails, Flask, Firebase, PostgreSQL, REST APIs, automation",
    detail: "Useful for dashboards, auth flows, reporting, API work, and service glue.",
    tone: "green",
  },
  {
    title: "Mobile and product",
    summary: "React Native, Kotlin, Android, Maps, WebSockets, UI flows",
    detail: "Used across UniVerse, BeerIQ, and travel/product-style projects.",
    tone: "neutral",
  },
  {
    title: "AI and testing",
    summary: "OpenAI API, Python analysis, JMeter, Selenium, GitHub Actions",
    detail: "Useful for MotherTongue-style AI tools and reliability-minded workflows.",
    tone: "blue",
  },
];

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function routeForPage(page) {
  return routePathForPage(page);
}

function pageFromHash(hash) {
  const route = String(hash || "")
    .replace(/^#\/?/, "")
    .split("?")[0];
  if (!route) return "home";
  if (route === "paved") return "redbrick-paved";
  if (route === "experience/rbc") return "rbc";
  if (route === "experience/redbrick-paved") return "redbrick-paved";
  if (route === "experience/mothertongue") return "mothertongue";
  if (route === "profile" || route === "about") return "profile";
  return pageForPath(`/${route}`);
}

function pageFromLocation() {
  if (window.location.hash.startsWith("#")) return pageFromHash(window.location.hash);
  return pageForPath(window.location.pathname);
}

function initialSearchQuery(fallback) {
  return new URLSearchParams(window.location.search).get("q") ?? fallback ?? "";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function wrapValue(value, max) {
  if (!max) return value;
  return ((value % max) + max) % max;
}

function projectLatLng(lat, lng, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((clamp(lat, -85.0511, 85.0511) * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function unprojectPoint(x, y, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const normalizedX = wrapValue(x, scale);
  const lng = (normalizedX / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

function nearestWrappedLeft(projectedX, viewportLeft, viewportWidth, worldSize) {
  if (!viewportWidth || !worldSize) return projectedX - viewportLeft;
  const viewportCenter = viewportLeft + viewportWidth / 2;
  const wrappedX = projectedX + Math.round((viewportCenter - projectedX) / worldSize) * worldSize;
  return wrappedX - viewportLeft;
}

function getCountryCenter(country) {
  const count = country.places.length || 1;
  const totals = country.places.reduce(
    (sum, place) => ({
      lat: sum.lat + place.lat,
      lng: sum.lng + place.lng,
    }),
    { lat: 0, lng: 0 },
  );

  return { lat: totals.lat / count, lng: totals.lng / count };
}

function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 720, height: 430 });

  useEffect(() => {
    if (!ref.current) return undefined;
    const update = () => {
      const rect = ref.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

function ProfilePicker({ onChoose }) {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="flex min-h-screen flex-col overflow-hidden border border-neutral-300 bg-white shadow-2xl">
        <div className="flex h-9 items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-400 text-[10px] font-black text-white">
              S
            </span>
            <span>Sahir Chrome</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-700">
            <span className="h-px w-3 bg-neutral-700" />
            <span className="size-3 border border-neutral-700" />
            <X size={16} />
          </div>
        </div>

        <section className="relative grid flex-1 place-items-center overflow-hidden px-5 py-10">
          <DecorativeShapes />
          <div className="relative z-10 w-full max-w-4xl text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-emerald-500 to-yellow-400 text-xl font-black text-white shadow-lg">
              S
            </div>
            <h1 className="mt-7 text-3xl font-normal tracking-tight text-neutral-900 md:text-4xl">
              Sahir Sood - Full-Stack Developer
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              Portfolio of Sahir Sood, an SFU Computing Science and Finance student building practical software across
              web, mobile, AI, backend systems, data analysis, and finance-focused products.
            </p>
            <nav aria-label="Primary portfolio sections" className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
              {[
                ["Experience", routeForPage("experience")],
                ["Projects", routeForPage("projects")],
                ["About", routeForPage("profile")],
                ["Contact", routeForPage("contact")],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-full border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {label}
                </a>
              ))}
            </nav>
            <p className="mt-8 text-sm font-medium text-neutral-500">
              Or choose a browser profile for a tailored route through the portfolio.
            </p>

            <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onChoose(profile)}
                  className="group relative rounded-lg bg-[#f8fafd] px-5 py-6 text-center transition hover:-translate-y-1 hover:bg-[#f1f5fb] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <MoreVertical className="absolute right-3 top-3 text-neutral-500" size={18} />
                  <div
                    className={classNames(
                      "mx-auto grid size-20 place-items-center overflow-hidden rounded-full text-4xl font-medium text-white shadow-sm",
                      profile.bg,
                    )}
                  >
                    {profile.avatar === "photo" ? (
                      <img src={PROFILE_IMG} alt={PROFILE_IMG_ALT} width={1200} height={1200} className="size-full object-cover" />
                    ) : (
                      profile.avatar
                    )}
                  </div>
                  <p className="mt-5 text-sm font-medium text-neutral-900">{profile.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">{profile.owner}</p>
                  <p className="mt-4 hidden text-xs leading-5 text-neutral-500 group-hover:block">{profile.message}</p>
                </button>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-sm">
              <button
                type="button"
                onClick={() =>
                  onChoose({
                    id: "guest",
                    name: "Guest",
                    owner: "Quick visit",
                    avatar: "G",
                    accent: "#5f6368",
                    bg: "bg-neutral-500",
                    icon: ContactRound,
                    message: "A short path to contact, links, and headline info.",
                    startQuery: "How can I contact Sahir?",
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-5 py-2.5 font-medium text-blue-700 transition hover:bg-blue-50"
              >
                <UserRound size={17} />
                Guest mode
              </button>
              <label className="inline-flex items-center gap-2 text-neutral-600">
                <input type="checkbox" defaultChecked className="size-4 accent-blue-600" />
                Show on startup
              </label>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DecorativeShapes() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <span className="absolute left-[-18px] top-[28%] h-12 w-28 rounded-full bg-blue-500/90" />
      <span className="absolute right-[-20px] top-[18%] h-16 w-28 rounded-l-2xl bg-yellow-400" />
      <span className="absolute left-[13%] top-[18%] h-6 w-6 rounded bg-neutral-200" />
      <span className="absolute left-[3%] top-[43%] size-7 rounded-full bg-neutral-200" />
      <span className="absolute right-[4%] top-[44%] size-6 rounded-lg bg-neutral-200" />
      <span className="absolute right-[4%] top-[36%] h-7 w-14 rounded-full bg-green-500" />
      <span className="absolute right-[14%] top-[13%] h-0 w-0 border-y-[14px] border-r-[24px] border-y-transparent border-r-neutral-200" />
      <span className="absolute left-[5%] top-[10%] h-6 w-12 bg-red-400 [clip-path:polygon(0_0,70%_0,100%_50%,70%_100%,0_100%,18%_50%)]" />
    </div>
  );
}

function BrowserPortfolio({ profile, onSwitchProfile }) {
  const [page, setPage] = useState(() => {
    const routed = pageFromLocation();
    return routed === "home" && profile.id === "sahir" ? "profile" : routed;
  });
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [query, setQuery] = useState(() => initialSearchQuery(profile.startQuery));
  const [searchTerm, setSearchTerm] = useState(() => initialSearchQuery(profile.startQuery));
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const address = useMemo(() => {
    if (page === "search") return `https://www.google.com/search?q=${encodeURIComponent(searchTerm || query || "Sahir Sood")}`;
    if (page === "not-found") return `${SITE_CONFIG.siteUrl}${window.location.pathname}`;
    const path = page === "home" ? "/newtab" : routeForPage(page);
    return `${SITE_CONFIG.siteUrl}${path}?profile=${profile.id}`;
  }, [page, profile.id, query, searchTerm]);

  const runSearch = useCallback(
    (value) => {
      const next = String(value || query || "Sahir Sood").trim();
      setQuery(next);
      setSearchTerm(next);
      setPage("search");
      setFavoritesOpen(false);
      window.history.pushState(null, "", `${routeForPage("search")}?q=${encodeURIComponent(next)}`);
    },
    [query],
  );

  const navigate = (action) => {
    if (action === "ask") {
      runSearch("Why should we interview Sahir?");
      return;
    }
    const next = action === "paved" ? "redbrick-paved" : action;
    setPage(next);
    setFavoritesOpen(false);
    window.history.pushState(null, "", routeForPage(next));
  };

  const submitSearch = (event) => {
    event.preventDefault();
    runSearch(query);
  };

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0 });
  }, [page, searchTerm]);

  useEffect(() => {
    if (page === "not-found") {
      document.title = "Page Not Found | Sahir Sood";
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          "content",
          "The page you requested could not be found. Return to Sahir Sood's software developer portfolio, experience, projects, resume, or contact page.",
        );
      return;
    }
    const route = routeForPageId(page);
    document.title = route.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", route.description);
  }, [page]);

  useEffect(() => {
    const handleRouteChange = () => {
      setPage(pageFromLocation());
    };
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("hashchange", handleRouteChange);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sahirsood@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  const isGoogleSurface = ["home", "search", "experience", "projects"].includes(page);

  return (
    <main className="min-h-screen bg-[#dfe3ea] text-[#202124]">
      <div className="mx-auto flex min-h-screen max-w-[1920px] flex-col overflow-hidden bg-white shadow-2xl">
        <ChromeFrame
          profile={profile}
          page={page}
          address={address}
          onNavigate={navigate}
          onSwitchProfile={onSwitchProfile}
          onToggleFavorites={() => setFavoritesOpen((value) => !value)}
        />

        <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
          {page === "home" && <HeaderLinks profile={profile} onNavigate={navigate} onToggleFavorites={() => setFavoritesOpen((value) => !value)} />}
          <div ref={contentRef} className={classNames("flex-1 overflow-y-auto", isGoogleSurface ? "bg-white" : "bg-[#f8fafc]")}>
            {page === "home" && (
              <NewTabPage query={query} setQuery={setQuery} submitSearch={submitSearch} onNavigate={navigate} onSearch={runSearch} />
            )}
            {page === "search" && <SearchResultsPage query={searchTerm} onNavigate={navigate} />}
            {page === "profile" && <ProfilePage onNavigate={navigate} />}
            {page === "education" && <EducationPage />}
            {page === "experience" && <ExperiencePage onNavigate={navigate} />}
            {page === "projects" && <ProjectsPage onNavigate={navigate} />}
            {page === "ai-trading-arena" && <ProjectSpotlightPage kind="ai-trading-arena" onNavigate={navigate} />}
            {page === "skills" && <SkillsPage />}
            {page === "resume" && <ResumePage onNavigate={navigate} />}
            {page === "contact" && <ContactPage copied={copied} onCopy={copyEmail} />}
            {page === "map" && <MapPage />}
            {page === "snake" && <SnakePage />}
            {page === "rbc" && <SpotlightPage kind="rbc" />}
            {page === "redbrick-paved" && <SpotlightPage kind="redbrick-paved" />}
            {page === "mothertongue" && <SpotlightPage kind="mothertongue" />}
            {page === "not-found" && <NotFoundPage onNavigate={navigate} />}
          </div>

          {favoritesOpen && <FavoritesPanel onNavigate={navigate} onClose={() => setFavoritesOpen(false)} />}
        </div>
      </div>
    </main>
  );
}

function ChromeFrame({ profile, page, address, onNavigate, onSwitchProfile, onToggleFavorites }) {
  const PageIcon = page === "contact" ? Mail : page === "snake" ? Gamepad2 : page === "map" ? Map : Search;
  const goBack = () => window.history.back();
  const goForward = () => window.history.forward();
  const refreshPage = () => window.location.reload();

  return (
    <header className="select-none border-b border-[#d7dce3] bg-[#edf2fa]">
      <div className="flex h-10 items-end gap-1 px-2 pt-2">
        <div
          className="flex h-8 min-w-0 max-w-[180px] items-center gap-2 rounded-t-xl bg-white px-2 text-sm shadow-sm sm:max-w-[270px] sm:px-4"
          aria-current="page"
        >
          <PageIcon size={16} className="shrink-0 text-blue-600" />
          <span className="truncate">{page === "home" ? "New Tab" : titleCase(page)}</span>
          <X size={14} aria-hidden="true" className="text-neutral-500" />
        </div>
        <button type="button" onClick={() => onNavigate("home")} className="hidden size-8 place-items-center rounded-full text-neutral-600 hover:bg-black/5 sm:grid" aria-label="Open new portfolio tab">
          <Plus size={18} />
        </button>
        <div className="ml-auto flex h-8 items-center gap-4 px-3 text-neutral-700">
          <span className="h-px w-3 bg-neutral-700" />
          <span className="size-3 border border-neutral-700" />
          <X size={16} />
        </div>
      </div>

      <div className="flex items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3">
        <button type="button" onClick={goBack} className="grid size-8 place-items-center rounded-full text-neutral-500 hover:bg-black/5" aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <button type="button" onClick={goForward} className="hidden size-8 place-items-center rounded-full text-neutral-500 hover:bg-black/5 sm:grid" aria-label="Go forward">
          <ArrowRight size={18} />
        </button>
        <button
          type="button"
          onClick={refreshPage}
          className="grid size-8 place-items-center rounded-full text-neutral-600 hover:bg-black/5"
          aria-label="Refresh current page"
        >
          <RefreshCw size={16} />
        </button>
        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-transparent bg-white px-3 shadow-sm focus-within:border-blue-500 sm:h-10 sm:px-4">
          <Search size={17} className="shrink-0 text-blue-600" />
          <span className="truncate text-xs text-neutral-700 sm:text-sm">{address}</span>
          <Star size={17} className="ml-auto hidden shrink-0 text-neutral-500 sm:block" />
        </div>
        <button type="button" onClick={() => onNavigate("ask")} className="hidden rounded-full border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-blue-50 sm:inline-flex">
          AI Mode
        </button>
        <a
          href={routeForPage("profile")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("profile");
          }}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm hover:bg-blue-50 sm:h-9 sm:w-auto sm:gap-2 sm:px-3 sm:text-sm sm:font-medium"
          aria-label="Open About page"
        >
          <UserRound size={17} />
          <span className="hidden sm:inline">About</span>
        </a>
        <button type="button" onClick={onToggleFavorites} className="grid size-9 place-items-center rounded-full hover:bg-black/5" aria-label="Open portfolio shortcuts">
          <Grid3X3 size={19} />
        </button>
        <button
          type="button"
          onClick={onSwitchProfile}
          className="grid size-9 place-items-center overflow-hidden rounded-full border-2"
          style={{ borderColor: profile.accent }}
          aria-label="Switch profile"
        >
          {profile.avatar === "photo" ? (
            <img src={PROFILE_IMG} alt={PROFILE_IMG_ALT} width={1200} height={1200} className="size-full object-cover" />
          ) : (
            <span className={classNames("grid size-full place-items-center text-sm font-semibold text-white", profile.bg)}>
              {profile.avatar}
            </span>
          )}
        </button>
        <MoreVertical size={19} aria-hidden="true" className="text-neutral-600" />
      </div>

      <nav className="flex h-9 items-center gap-1 overflow-x-auto border-t border-[#d7dce3] bg-white px-3 text-sm">
        {BOOKMARKS.map((bookmark) => {
          const Icon = bookmark.icon;
          if (bookmark.href) {
            return (
              <a
                key={bookmark.label}
                href={bookmark.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded px-2 py-1.5 text-neutral-700 hover:bg-neutral-100"
              >
                <Icon size={16} />
                {bookmark.label}
              </a>
            );
          }
          return (
            <a
              key={bookmark.label}
              href={routeForPage(bookmark.action)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(bookmark.action);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded px-2 py-1.5 text-neutral-700 hover:bg-neutral-100"
            >
              <Icon size={16} />
              {bookmark.label}
            </a>
          );
        })}
        <span className="ml-auto hidden shrink-0 items-center gap-2 border-l border-neutral-200 pl-3 text-neutral-700 lg:inline-flex">
          <Folder size={16} />
          All Bookmarks
        </span>
      </nav>
    </header>
  );
}

function HeaderLinks({ profile, onNavigate, onToggleFavorites }) {
  return (
    <div className="flex items-center justify-end gap-5 px-6 py-4 text-sm">
      <a
        href={routeForPage("contact")}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("contact");
        }}
        className="text-neutral-700 hover:underline"
      >
        Contact
      </a>
      <a
        href={routeForPage("projects")}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("projects");
        }}
        className="text-neutral-700 hover:underline"
      >
        Projects
      </a>
      <button type="button" onClick={onToggleFavorites} className="grid size-10 place-items-center rounded-full hover:bg-neutral-100" aria-label="Open portfolio shortcuts">
        <Grid3X3 size={21} />
      </button>
      <a
        href={routeForPage("profile")}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("profile");
        }}
        className="grid size-10 place-items-center overflow-hidden rounded-full border-2"
        style={{ borderColor: profile.accent }}
        aria-label="Open About page"
      >
        {profile.avatar === "photo" ? (
          <img src={PROFILE_IMG} alt={PROFILE_IMG_ALT} width={1200} height={1200} className="size-full object-cover" />
        ) : (
          <span className={classNames("grid size-full place-items-center text-sm font-semibold text-white", profile.bg)}>
            {profile.avatar}
          </span>
        )}
      </a>
    </div>
  );
}

function NewTabPage({ query, setQuery, submitSearch, onNavigate, onSearch }) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-138px)] w-full max-w-5xl flex-col items-center px-5 pb-12 pt-14">
      <SahirLogo />
      <p className="mt-4 max-w-2xl text-center text-base leading-7 text-neutral-600">
        Sahir Sood is a full-stack software developer building practical web, mobile, AI, backend, and finance-focused software.
      </p>

      <form
        onSubmit={submitSearch}
        className="mt-9 flex h-14 w-full max-w-3xl items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 shadow-[0_2px_8px_rgba(60,64,67,0.18)] transition focus-within:border-transparent focus-within:shadow-[0_2px_12px_rgba(60,64,67,0.24)]"
      >
        <Plus size={22} aria-hidden="true" className="shrink-0 text-neutral-700" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
          placeholder="Ask Sahir"
          aria-label="Ask about Sahir's portfolio"
        />
        <Mic size={20} aria-hidden="true" className="shrink-0 text-neutral-600" />
        <button type="submit" className="shrink-0 rounded-full bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-200 sm:px-4">
          <span className="sm:hidden">Go</span>
          <span className="hidden sm:inline">AI Mode</span>
        </button>
      </form>

      <div className="mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
        {QUESTION_BANK.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSearch(question)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="mt-8 grid w-full max-w-3xl grid-cols-3 gap-y-6 sm:grid-cols-5 md:grid-cols-9">
        {SHORTCUTS.map((shortcut) => (
          <ShortcutButton key={shortcut.label} shortcut={shortcut} onNavigate={onNavigate} />
        ))}
      </div>

      <ContinueTabs onNavigate={onNavigate} />
    </section>
  );
}

function SahirLogo() {
  const letters = [
    ["S", "text-blue-500"],
    ["a", "text-red-500"],
    ["h", "text-yellow-500"],
    ["i", "text-blue-500"],
    ["r", "text-emerald-500"],
  ];
  return (
    <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl" aria-label="Sahir Sood - Full-Stack Developer">
      {letters.map(([letter, color]) => (
        <span key={letter} className={color}>
          {letter}
        </span>
      ))}
    </h1>
  );
}

function ShortcutButton({ shortcut, onNavigate }) {
  const Icon = shortcut.icon;
  return (
    <a
      href={routeForPage(shortcut.action)}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(shortcut.action);
      }}
      className="group flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition hover:bg-neutral-100"
    >
      <span className={classNames("grid size-12 place-items-center rounded-full text-white shadow-sm", shortcut.color)}>
        <Icon size={22} />
      </span>
      <span className="max-w-20 truncate text-xs text-neutral-800">{shortcut.label}</span>
    </a>
  );
}

function ContinueTabs({ onNavigate }) {
  return (
    <section className="mt-12 w-full max-w-3xl rounded-3xl bg-[#f1f3f4] p-3 shadow-sm">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-medium text-neutral-800">Continue with these tabs</h2>
        <MoreVertical size={18} className="text-neutral-600" />
      </div>
      <div className="space-y-2 rounded-2xl bg-white p-2">
        {RECENT_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <a
              key={tab.title}
              href={routeForPage(tab.action)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(tab.action);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-neutral-50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <Icon size={19} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-neutral-900">{tab.title}</span>
                <span className="block truncate text-xs text-neutral-500">
                  {tab.source} - {tab.visited}
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function FavoritesPanel({ onNavigate, onClose }) {
  return (
    <aside className="absolute right-4 top-4 z-40 w-[min(92vw,380px)] overflow-hidden rounded-[2rem] border border-blue-100 bg-[#eef4ff] p-2 shadow-2xl">
      <div className="rounded-[1.6rem] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-800">Your favorites</h2>
          <div className="flex items-center gap-2">
            <span className="grid size-11 place-items-center rounded-full bg-blue-100 text-neutral-700" title="Portfolio shortcuts">
              <Settings size={19} aria-hidden="true" />
            </span>
            <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-neutral-100" aria-label="Close portfolio shortcuts">
              <X size={17} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {FAVORITES.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={routeForPage(item.action)}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.action);
                }}
                className="group grid justify-items-center gap-2 rounded-2xl p-2 transition hover:bg-blue-50"
              >
                <span className={classNames("grid size-12 place-items-center rounded-2xl bg-neutral-50", item.color)}>
                  <Icon size={26} />
                </span>
                <span className="max-w-24 truncate text-sm text-neutral-800">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function SearchResultsPage({ query, onNavigate }) {
  const answer = getAnswer(query);
  const results = getSearchResults(query);

  return (
    <GoogleResultsShell query={query} heading="Portfolio Search Results">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,760px)_360px]">
        <div>
          <AiOverview title="AI Overview" body={answer} />
          <div className="mt-8 space-y-8">
            {results.map((result) => (
              <SearchResult key={result.title} result={result} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <KnowledgePanel onNavigate={onNavigate} />
      </section>
    </GoogleResultsShell>
  );
}

function ExperiencePage({ onNavigate }) {
  const results = EXPERIENCE.map((item) => ({
    title: `${item.role} - ${item.company}`,
    url: `${item.id ?? slugify(item.company)}.experience.sahirsood.com`,
    source: item.timeframe,
    description: item.summary,
    tags: item.tags,
    image: item.logo,
    imageAlt: `${item.company} logo`,
    imageWidth: item.logoWidth,
    imageHeight: item.logoHeight,
    action: item.id && EXPERIENCE_DETAILS[item.id] ? item.id : undefined,
  }));

  return (
    <GoogleResultsShell query="experience" heading="Software Development Experience">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,780px)_340px]">
        <div>
          <AiOverview
            title="AI Overview"
            body="Sahir's experience signal is practical and current: full stack work at RBC, RedBrick/Paved production engineering, MotherTongue MVP work, and contract full-stack dashboard work."
          />
          <div className="mt-8 space-y-8">
            {results.map((result) => (
              <SearchResult key={result.title} result={result} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <SideCard title="Experience highlights">
          <Metric label="Priority roles" value="3" />
          <Metric label="Product domains" value="Ad-tech, AI, finance" />
          <Metric label="Working style" value="Practical, team-first" />
        </SideCard>
      </section>
    </GoogleResultsShell>
  );
}

function ProjectsPage({ onNavigate }) {
  const results = PROJECTS.map((project) => ({
    title: project.title,
    url: project.repo || `projects.sahirsood.com${project.action ? routeForPage(project.action) : `/${slugify(project.title)}`}`,
    source: `${project.type} - ${project.eyebrow}`,
    description: `${project.description} ${project.signal}`,
    tags: project.stack,
    image: project.img,
    imageAlt: `${project.title} project thumbnail`,
    imageWidth: project.imgWidth,
    imageHeight: project.imgHeight,
    href: project.repo,
    action: project.action,
    featured: project.featured,
    featuredLabel: project.featuredLabel,
  }));
  const featuredProject = PROJECTS.find((project) => project.featured);

  return (
    <GoogleResultsShell query="projects" heading="Selected Software and AI Projects">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,780px)_340px]">
        <div>
          <AiOverview
            title="AI Overview"
            body="Sahir's strongest current project is AI Trading Arena, a full-stack AI and capital markets simulation with a C++ matching engine, Python/FastAPI backend, SEC/RAG evidence, WebSocket events, and a React dashboard. The broader project history adds realtime mobile apps, AI music workflows, financial web features, Android maps, Rails planning tools, ML analysis, and early game builds."
          />
          <div className="mt-8 space-y-8">
            {results.map((result) => (
              <SearchResult key={result.title} result={result} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <SideCard title="Featured project">
          {featuredProject && (
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Trophy size={16} />
                <span>{featuredProject.featuredLabel}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-neutral-950">{featuredProject.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                AI agents, market microstructure, RAG evidence, and a live dashboard in one ongoing full-stack build.
              </p>
              <a
                href={routeForPage("ai-trading-arena")}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate?.("ai-trading-arena");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View case study
                <ChevronRight size={16} />
              </a>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Metric label="Core engine" value="C++ order book" />
                <Metric label="Live layer" value="FastAPI + WS" />
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {["AI + Finance", "Full-stack", "Systems", "Backend", "Realtime", "RAG"].map((item) => (
              <Chip key={item} tone="blue">
                {item}
              </Chip>
            ))}
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200">
            {PROJECTS.slice(0, 4).map((project) => (
              <div key={project.title} className="flex items-center gap-3 border-b border-neutral-100 p-3 last:border-b-0">
                <img
                  src={project.img}
                  alt={`${project.title} project thumbnail`}
                  width={project.imgWidth}
                  height={project.imgHeight}
                  loading="lazy"
                  className="size-11 rounded-lg object-cover"
                />
                <span className="text-sm font-medium">{project.title}</span>
              </div>
            ))}
          </div>
        </SideCard>
      </section>
    </GoogleResultsShell>
  );
}

function GoogleResultsShell({ query, heading, children }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-0 sm:px-5">
      <div className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 py-4 backdrop-blur">
        <div className="flex items-center gap-3 sm:gap-5">
          <SahirMiniLogo />
          <div className="flex h-11 min-w-0 max-w-3xl flex-1 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 shadow-sm sm:h-12 sm:gap-3 sm:px-5">
            <span className="min-w-0 flex-1 truncate text-sm sm:text-base">{query}</span>
            <X size={18} className="text-neutral-500" />
            <span className="h-6 w-px bg-neutral-200" />
            <Mic size={18} className="text-neutral-600" />
            <Search size={19} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-3 flex gap-5 overflow-x-auto pl-0 text-sm text-neutral-600 sm:pl-24">
          {["All", "Experience", "Projects", "Skills", "Contact"].map((tab, index) => (
            <span key={tab} className={classNames(index === 0 && "border-b-2 border-blue-600 pb-2 text-blue-600")}>
              {tab}
            </span>
          ))}
        </div>
      </div>
      <div className="pt-8">
        <h1 className="mb-6 text-2xl font-normal tracking-tight text-neutral-900 md:text-3xl">{heading}</h1>
        {children}
      </div>
    </section>
  );
}

function SahirMiniLogo() {
  return (
    <div className="hidden text-3xl font-semibold tracking-tight sm:block">
      <span className="text-blue-500">S</span>
      <span className="text-red-500">a</span>
      <span className="text-yellow-500">h</span>
      <span className="text-blue-500">i</span>
      <span className="text-emerald-500">r</span>
    </div>
  );
}

function AiOverview({ title, body }) {
  return (
    <article className="rounded-[1.75rem] border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
          <Sparkles size={19} />
        </span>
        <div>
          <p className="font-semibold text-blue-950">{title}</p>
          <p className="mt-3 leading-7 text-neutral-700">{body}</p>
        </div>
      </div>
    </article>
  );
}

function SearchResult({ result, onNavigate }) {
  const content = (
    <>
      <div className="flex items-start gap-4">
        {result.image && (
          <img
            src={result.image}
            alt={result.imageAlt ?? ""}
            width={result.imageWidth}
            height={result.imageHeight}
            loading="lazy"
            className="mt-1 size-12 shrink-0 rounded-xl border border-neutral-200 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-neutral-700">{result.url}</p>
              <h2 className="mt-1 text-xl font-normal leading-7 text-[#1a0dab]">{result.title}</h2>
            </div>
            <MoreVertical size={18} className="shrink-0 text-neutral-500" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {result.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                <Trophy size={13} />
                {result.featuredLabel ?? "Featured"}
              </span>
            )}
            <p className="text-sm text-neutral-500">{result.source}</p>
          </div>
          <p className="mt-2 leading-7 text-neutral-700">{result.description}</p>
          {result.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.tags.slice(0, 8).map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (result.href) {
    return (
      <a
        href={result.href}
        target="_blank"
        rel="noreferrer"
        className={classNames(
          "block rounded-2xl p-2 transition hover:bg-neutral-50",
          result.featured && "border border-blue-100 bg-gradient-to-br from-white via-blue-50/45 to-emerald-50/60 shadow-sm",
        )}
      >
        {content}
      </a>
    );
  }

  if (result.action && onNavigate) {
    return (
      <a
        href={routeForPage(result.action)}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(result.action);
        }}
        className={classNames(
          "block w-full rounded-2xl p-2 text-left transition hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          result.featured && "border border-blue-100 bg-gradient-to-br from-white via-blue-50/45 to-emerald-50/60 shadow-sm",
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      className={classNames(
        "rounded-2xl p-2",
        result.featured && "border border-blue-100 bg-gradient-to-br from-white via-blue-50/45 to-emerald-50/60 shadow-sm",
      )}
    >
      {content}
    </article>
  );
}

function KnowledgePanel({ onNavigate }) {
  return (
    <aside className="rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <img src={PROFILE_IMG} alt={PROFILE_IMG_ALT} width={1200} height={1200} className="size-20 rounded-full object-cover shadow-sm" />
        <div>
          <h2 className="text-2xl font-semibold">Sahir Sood</h2>
          <p className="text-neutral-600">Software Developer</p>
        </div>
      </div>
      <p className="mt-5 leading-7 text-neutral-700">
        SFU CS + Finance student in Vancouver building practical software across web, mobile, AI, backend, and data.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={routeForPage("resume")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("resume");
          }}
          className="rounded-2xl bg-neutral-100 p-3 text-left text-sm font-medium hover:bg-blue-50"
        >
          Resume
        </a>
        <a
          href={routeForPage("contact")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("contact");
          }}
          className="rounded-2xl bg-neutral-100 p-3 text-left text-sm font-medium hover:bg-blue-50"
        >
          Contact
        </a>
        <a
          href={routeForPage("map")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("map");
          }}
          className="rounded-2xl bg-neutral-100 p-3 text-left text-sm font-medium hover:bg-blue-50"
        >
          Map
        </a>
        <a
          href={routeForPage("snake")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("snake");
          }}
          className="rounded-2xl bg-neutral-100 p-3 text-left text-sm font-medium hover:bg-blue-50"
        >
          Snake
        </a>
      </div>
    </aside>
  );
}

function SideCard({ title, children }) {
  return (
    <aside className="h-fit rounded-[1.75rem] border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </aside>
  );
}

function Metric({ label, value }) {
  return (
    <div className="border-b border-neutral-100 py-3 last:border-b-0">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function InfoCard({ title, body }) {
  return (
    <div className="h-full rounded-2xl bg-neutral-50 p-4">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
    </div>
  );
}

function firstSentence(value) {
  const text = String(value || "").trim();
  const match = text.match(/^.*?[.!?](\s|$)/);
  return match ? match[0].trim() : text;
}

function ProfilePage({ onNavigate }) {
  return (
    <PageShell eyebrow="Account" title="Sahir Sood" description="Software developer, SFU CS + Finance student, study-abroad explorer, and practical full-stack builder.">
      <section className="grid items-stretch gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <img src={PROFILE_IMG} alt={PROFILE_IMG_ALT} width={1200} height={1200} className="mx-auto size-44 rounded-full object-cover shadow-lg" />
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold">Sahir Sood</h2>
            <p className="mt-2 text-neutral-600">Software Developer</p>
            <p className="mt-1 text-sm text-neutral-500">Vancouver, BC</p>
          </div>
          <div className="mt-6 grid gap-2">
            {HOT_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3 text-sm transition hover:bg-neutral-50"
                >
                  <Icon size={18} />
                  <span className="min-w-0 truncate">{link.detail}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">About me</h3>
            <div className="mt-4 space-y-4 leading-7 text-neutral-700">
              <p>
                An Intro to CS elective shifted my path from curiosity into a serious love for solving problems. That led
                me into SFU's CS and Finance path.
              </p>
              <p>
                I like backend systems, data-driven development, and projects where teamwork and adaptability matter as
                much as technical execution.
              </p>
              <p>
                Outside code, I keep balance through basketball, snowboarding, travel, study abroad memories, and getting outdoors.
              </p>
            </div>
          </div>
          <PersonalImageGallery compact />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Current", "RBC"],
              ["Education", "SFU CS + Finance"],
              ["Study abroad", "Leeds, United Kingdom"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{label}</p>
                <p className="mt-3 font-medium text-neutral-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid items-stretch gap-5 xl:grid-cols-[1fr_0.9fr]">
            <MiniMapCard onNavigate={onNavigate} />
            <ExtraCurricularCard />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function PersonalImageGallery({ compact = false }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Personal notes</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            A few places that make the portfolio feel more like me beyond the resume.
          </p>
        </div>
        {!compact && <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Travel + outdoors</span>}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {PERSONAL_IMAGES.map((image) => (
          <figure key={image.id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <figcaption className="p-3">
              <p className="text-sm font-semibold text-neutral-900">{image.title}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">{image.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function MiniMapCard({ onNavigate }) {
  const featured = [
    { name: "Vancouver", lat: 49.2827, lng: -123.1207 },
    { name: "Leeds", lat: 53.8008, lng: -1.5491 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "New Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  ];
  const zoom = 1;
  const [previewRef, previewSize] = useElementSize();
  const size = { width: previewSize.width || 520, height: previewSize.height || 288 };
  const centerPx = projectLatLng(25, 0, zoom);
  const worldSize = TILE_SIZE * 2 ** zoom;
  const viewportLeft = centerPx.x - size.width / 2;
  const viewportTop = centerPx.y - size.height / 2;
  const tileCount = 2 ** zoom;
  const tiles = [];

  for (let x = Math.floor(viewportLeft / TILE_SIZE); x <= Math.floor((viewportLeft + size.width) / TILE_SIZE); x += 1) {
    for (let y = Math.floor(viewportTop / TILE_SIZE); y <= Math.floor((viewportTop + size.height) / TILE_SIZE); y += 1) {
      if (y >= 0 && y < tileCount) {
        const wrappedX = wrapValue(x, tileCount);
        tiles.push({
          key: `preview-${zoom}-${x}-${y}`,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - viewportLeft,
          top: y * TILE_SIZE - viewportTop,
        });
      }
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div ref={previewRef} className="relative h-56 overflow-hidden bg-[#cfe8f7] sm:h-72">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable="false"
            className="absolute max-w-none select-none"
            style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-white/10" />
        {featured.map((place) => {
          const projected = projectLatLng(place.lat, place.lng, zoom);
          const left = nearestWrappedLeft(projected.x, viewportLeft, size.width, worldSize);
          const top = projected.y - viewportTop;
          const visible = left > -64 && left < size.width + 64 && top > -40 && top < size.height + 40;
          if (!visible) return null;

          return (
            <span
              key={place.name}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-medium shadow"
              style={{ left, top }}
            >
              <span className="size-2 rounded-full bg-blue-600" />
              {place.name}
            </span>
          );
        })}
        <span className="absolute bottom-3 left-3 z-10 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow">
          OpenStreetMap
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold">Where I have been</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600">A quick personal map preview. The full version uses real OpenStreetMap tiles and clickable notes.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Metric label="Countries/regions" value={TRAVEL_PLACES.length} />
          <Metric label="Logged places" value={TRAVEL_PLACES.reduce((total, country) => total + country.places.length, 0)} />
        </div>
        <a
          href={routeForPage("map")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("map");
          }}
          className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Open map
          <ChevronRight size={16} />
        </a>
      </div>
    </div>
  );
}

function ExtraCurricularCard() {
  const [active, setActive] = useState(EXTRACURRICULARS[0]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">Extracurriculars</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {EXTRACURRICULARS.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActive(item)}
            className={classNames(
              "rounded-2xl border p-3 text-left text-sm font-medium transition",
              active.title === item.title ? item.color : "border-neutral-100 bg-neutral-50 text-neutral-700 hover:bg-blue-50",
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className={classNames("mt-4 rounded-2xl border p-4", active.color)}>
        <p className="font-semibold">{active.title}</p>
        <p className="mt-2 text-sm leading-6">{active.detail}</p>
      </div>
      <div className="mt-4 flex-1 rounded-2xl bg-neutral-50 p-4">
        <ul className="space-y-3">
          {active.points.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-6 text-neutral-700">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>
              {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function EducationPage() {
  return (
    <PageShell eyebrow="Education" title="Education and study abroad" description="The academic and personal context behind Sahir's software path.">
      <div className="grid gap-5 lg:grid-cols-2">
        {EDUCATION.map((item) => (
          <article key={item.school} className="h-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{item.timeframe}</p>
            <h2 className="mt-3 text-2xl font-semibold">{item.school}</h2>
            <p className="mt-1 text-blue-700">{item.program}</p>
            {item.area && <p className="mt-1 text-sm text-neutral-500">Area of study: {item.area}</p>}
            <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">
              <p>{item.detail}</p>
              <p>{item.extra}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {item.highlights.map((highlight) => (
                <span key={highlight} className="rounded-2xl bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700">
                  {highlight}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Coursework and learning style</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {EDUCATION_CARDS.map((card) => (
            <InfoCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">University of Leeds exchange</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {STUDY_ABROAD_CARDS.map((card) => (
            <InfoCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function SkillsPage() {
  return (
    <PageShell eyebrow="Technical index" title="Technical Skills" description="A scannable view of the tools Sahir can reach for across product, backend, mobile, and data work.">
      <section className="grid gap-4 lg:grid-cols-4">
        {SKILL_LANES.map((lane) => (
          <article key={lane.title} className="h-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <Chip tone={lane.tone}>{lane.title}</Chip>
            <h2 className="mt-4 text-lg font-semibold leading-7">{lane.summary}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{lane.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-xl font-semibold">Technical index</h2>
            <p className="mt-1 text-sm text-neutral-500">Grouped for fast scanning, not just a giant tag pile.</p>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600">
            {Object.values(SKILLS).flat().length} tools
          </span>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {Object.entries(SKILLS).map(([group, skills]) => (
            <section key={group}>
              <h3 className="font-semibold">{group}</h3>
              <div className="mt-3 grid gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-3 py-2 text-sm">
                    <span>{skill}</span>
                    <span className="text-xs text-neutral-400">{group === "Languages" ? "code" : group === "Frameworks" ? "build" : "ship"}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function ResumePage({ onNavigate }) {
  return (
    <PageShell eyebrow="Resume" title="Sahir Sood - resume" description="A real resume-style page, formatted for scanning inside the browser theme.">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_320px]">
        <section className="h-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <h2 className="text-3xl font-semibold">Sahir Sood</h2>
              <p className="mt-2 text-neutral-600">Software Developer - SFU CS + Finance - Vancouver, BC</p>
              <p className="mt-1 text-sm text-neutral-500">sahirsood@gmail.com - github.com/SahirSood - linkedin.com/in/sahir-sood</p>
            </div>
            <a href="mailto:sahirsood@gmail.com?subject=Resume%20PDF%20request" className="rounded-full bg-blue-600 px-5 py-3 font-medium text-white">
              Request PDF
            </a>
          </div>
          <div className="mt-6 space-y-7">
            <ResumeBlock title="Summary">
              Full-stack software developer with practical experience across ad-tech, AI writing tools, financial dashboards, mobile apps, web systems, and data analysis.
            </ResumeBlock>
            <ResumeBlock title="Education">
              Simon Fraser University - Computing Science + Finance. Study abroad experience in Leeds, United Kingdom.
            </ResumeBlock>
            <ResumeBlock title="Experience">
              Current Full Stack Developer at RBC. Software Developer at RedBrick/Paved. Lead Developer for the MotherTongue MVP. Contract Software Developer at Kapali Developments.
            </ResumeBlock>
            <ResumeBlock title="Projects">
              UniVerse, Spotify Playlist Generator, Financial Fast Feed, BeerIQ, TripMate, Sensor Movement Data Analysis, and Apocalypse Rerising.
            </ResumeBlock>
            <ResumeBlock title="Skills">
              Python, JavaScript, TypeScript, Java, Ruby, Kotlin, SQL, React, React Native, Node.js, Rails, Flask, Firebase, AWS, Docker, PostgreSQL, GitHub Actions.
            </ResumeBlock>
          </div>
        </section>
        <aside className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="font-semibold">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <a
              href={routeForPage("experience")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate("experience");
              }}
              className="rounded-2xl bg-white p-4 text-left shadow-sm hover:bg-blue-50"
            >
              View experience
            </a>
            <a
              href={routeForPage("projects")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate("projects");
              }}
              className="rounded-2xl bg-white p-4 text-left shadow-sm hover:bg-blue-50"
            >
              View projects
            </a>
            <a
              href={routeForPage("contact")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate("contact");
              }}
              className="rounded-2xl bg-white p-4 text-left shadow-sm hover:bg-blue-50"
            >
              Contact Sahir
            </a>
          </div>
          <div className="mt-6 flex-1 rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-600 shadow-sm">
            Best scanned alongside the experience and project pages; those routes include the richer context behind the resume bullets.
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function ContactPage({ copied, onCopy }) {
  const mailto = "mailto:sahirsood@gmail.com?subject=Portfolio%20Follow-up&body=Hi%20Sahir%2C%0A%0AI%20found%20your%20portfolio%20and%20wanted%20to%20connect.%0A%0A";
  const gmailCompose =
    "https://mail.google.com/mail/?view=cm&fs=1&to=sahirsood@gmail.com&su=Portfolio%20Follow-up&body=Hi%20Sahir%2C%0A%0AI%20found%20your%20portfolio%20and%20wanted%20to%20connect.%0A%0A";
  const openMail = () => {
    window.location.href = mailto;
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="Contact Sahir Sood"
      description="I am always interested in meeting people working on thoughtful software, AI products, financial technology, or problems where the technical and business sides genuinely overlap."
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-full rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <button type="button" onClick={openMail} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white">
            <Send size={17} />
            Open email app
          </button>
          <a
            href={gmailCompose}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-blue-200 px-4 py-3 font-medium text-blue-700 hover:bg-blue-50"
          >
            <Mail size={17} />
            Open web compose
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-3 font-medium text-neutral-800 hover:bg-neutral-50"
          >
            {copied ? <CheckCircle2 size={17} className="text-emerald-600" /> : <Copy size={17} />}
            {copied ? "Email copied" : "Copy email"}
          </button>
          <div className="mt-5 space-y-2">
            {HOT_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3 text-sm hover:bg-blue-50"
                >
                  <Icon size={17} />
                  <span className="min-w-0 truncate">{link.detail}</span>
                </a>
              );
            })}
          </div>
        </aside>
        <section className="h-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">What I am interested in</h2>
              <p className="mt-2 text-neutral-600">
                I like conversations where I can understand the product and users, not only the job title.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">Available for conversations</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["Best-fit roles", "Backend, full-stack, platform, internal tools, AI-enabled apps, and financial technology."],
              ["What to mention", "What you are building, the problem your team is solving, and why my experience may fit."],
              ["What I like", "Teams where I can understand the product, the users, and the reason the system exists."],
              ["Response note", "Email is easiest for opportunities, project conversations, or coffee chats. LinkedIn works too."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-2 leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function MapPage() {
  const allStops = TRAVEL_PLACES.flatMap((country) =>
    country.places.map((place) => ({ ...place, country: country.country, code: country.code })),
  );
  const [selectedCountry, setSelectedCountry] = useState(TRAVEL_PLACES[0]);
  const [selected, setSelected] = useState({ ...TRAVEL_PLACES[0].places[0], country: TRAVEL_PLACES[0].country, code: TRAVEL_PLACES[0].code });
  const [zoom, setZoom] = useState(1);
  const [mapRef, mapSize] = useElementSize();
  const [centerPx, setCenterPx] = useState(() => projectLatLng(28, 0, 1));
  const dragRef = useRef(null);
  const worldSize = TILE_SIZE * 2 ** zoom;
  const viewportLeft = centerPx.x - mapSize.width / 2;
  const viewportTop = centerPx.y - mapSize.height / 2;

  const focusPlace = (place, country = selectedCountry, preferredZoom = Math.min(5, Math.max(zoom + 1, 3))) => {
    const nextZoom = clamp(preferredZoom, 1, 5);
    const next = { ...place, country: country.country, code: country.code };
    setSelected(next);
    setSelectedCountry(country);
    setZoom(nextZoom);
    setCenterPx(projectLatLng(place.lat, place.lng, nextZoom));
  };

  const focusCountry = (country) => {
    const firstPlace = country.places[0];
    const center = getCountryCenter(country);
    const targetZoom = country.places.length > 4 ? 2 : 4;
    const nextZoom = clamp(Math.max(zoom + 1, targetZoom), 1, 5);
    setSelected({ ...firstPlace, country: country.country, code: country.code });
    setSelectedCountry(country);
    setZoom(nextZoom);
    setCenterPx(projectLatLng(center.lat, center.lng, nextZoom));
  };

  const recenter = (place, country = selectedCountry) => {
    focusPlace(place, country);
  };

  const selectCountry = (country) => {
    focusCountry(country);
  };

  const changeZoom = (nextZoom) => {
    const clampedZoom = clamp(nextZoom, 1, 5);
    const center = unprojectPoint(centerPx.x, centerPx.y, zoom);
    setZoom(clampedZoom);
    setCenterPx(projectLatLng(center.lat, center.lng, clampedZoom));
  };

  const handleMapPointerDown = (event) => {
    dragRef.current = { x: event.clientX, y: event.clientY, center: centerPx };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleMapPointerMove = (event) => {
    if (!dragRef.current) return;
    event.preventDefault();
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    setCenterPx({
      x: dragRef.current.center.x - dx,
      y: clamp(dragRef.current.center.y - dy, 0, worldSize),
    });
  };

  const handleMapPointerUp = () => {
    dragRef.current = null;
  };

  const startTileX = Math.floor(viewportLeft / TILE_SIZE);
  const endTileX = Math.floor((viewportLeft + mapSize.width) / TILE_SIZE);
  const startTileY = Math.floor(viewportTop / TILE_SIZE);
  const endTileY = Math.floor((viewportTop + mapSize.height) / TILE_SIZE);
  const tileCount = 2 ** zoom;
  const tiles = [];
  for (let x = startTileX; x <= endTileX; x += 1) {
    for (let y = startTileY; y <= endTileY; y += 1) {
      if (y >= 0 && y < tileCount) {
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        tiles.push({
          key: `${zoom}-${x}-${y}`,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - viewportLeft,
          top: y * TILE_SIZE - viewportTop,
        });
      }
    }
  }

  return (
    <PageShell eyebrow="Maps" title="Where I have been" description="A real OpenStreetMap-style travel page with clickable places and personal notes.">
      <section className="mb-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Why travel matters to me</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">{TRAVEL_INTRO[0]}</p>
          <details className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            <summary className="cursor-pointer font-medium text-neutral-900">Study abroad context</summary>
            <p className="mt-3">{TRAVEL_INTRO[1]}</p>
          </details>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {TRAVEL_HIGHLIGHTS.map((highlight) => (
            <div key={highlight.title} className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{highlight.body}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="mb-6">
        <PersonalImageGallery />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section
          ref={mapRef}
          className="relative h-[360px] overflow-hidden rounded-3xl border border-neutral-200 bg-[#cfe8f7] shadow-sm touch-none cursor-grab active:cursor-grabbing sm:h-[460px] md:h-[560px]"
          onPointerDown={handleMapPointerDown}
          onPointerMove={handleMapPointerMove}
          onPointerUp={handleMapPointerUp}
          onPointerCancel={handleMapPointerUp}
          onLostPointerCapture={handleMapPointerUp}
        >
          <div className="absolute bottom-4 right-5 z-20 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-neutral-600 shadow">
            places + notes
          </div>
          {tiles.map((tile) => (
            <img
              key={tile.key}
              src={tile.url}
              alt=""
              draggable="false"
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
              }}
              className="absolute max-w-none select-none"
              style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
          <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-lg" onPointerDown={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => changeZoom(zoom + 1)} className="grid size-10 place-items-center text-xl font-semibold hover:bg-neutral-100">
              +
            </button>
            <button type="button" onClick={() => changeZoom(zoom - 1)} className="grid size-10 place-items-center border-t border-neutral-200 text-xl font-semibold hover:bg-neutral-100">
              -
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const canada = TRAVEL_PLACES.find((country) => country.country === "Canada") ?? selectedCountry;
              const vancouver = canada.places.find((stop) => stop.name === "Vancouver") ?? canada.places[0];
              recenter(vancouver, canada);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute left-4 top-4 z-20 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg hover:bg-blue-50"
          >
            Vancouver
          </button>
          {allStops.map((stop) => {
            const projected = projectLatLng(stop.lat, stop.lng, zoom);
            const left = nearestWrappedLeft(projected.x, viewportLeft, mapSize.width, worldSize);
            const top = projected.y - viewportTop;
            const visible = left > -80 && left < mapSize.width + 80 && top > -80 && top < mapSize.height + 80;
            const active = selected.name === stop.name && selected.country === stop.country;
            const country = TRAVEL_PLACES.find((item) => item.country === stop.country) ?? selectedCountry;
            if (!visible) return null;
            return (
              <button
                key={`${stop.country}-${stop.name}`}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  recenter(stop, country);
                }}
                className={classNames("group absolute z-10 -translate-x-1/2 -translate-y-full transition", active ? "scale-110" : "hover:scale-110")}
                style={{ left, top }}
                aria-label={`Show ${stop.name}`}
              >
                <span className={classNames("relative grid size-8 place-items-center rounded-full border-2 shadow-lg", active ? "border-white bg-red-500 text-white" : "border-white bg-blue-600 text-white")}>
                  <MapPin size={17} fill="currentColor" />
                </span>
                <span className={classNames("absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-medium shadow-lg transition", active ? "border-neutral-900 bg-neutral-950 text-white opacity-100" : "border-white/20 bg-white text-neutral-800 opacity-0 group-hover:opacity-100")}>
                  {stop.name}
                </span>
              </button>
            );
          })}
          <div className="absolute bottom-4 left-4 z-20 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow">
            OpenStreetMap contributors
          </div>
          <div className="absolute bottom-4 left-1/2 z-20 max-h-44 w-[min(92%,520px)] -translate-x-1/2 overflow-y-auto rounded-2xl bg-white/95 p-3 shadow-lg">
            <p className="text-sm font-semibold">{selected.name}</p>
            <p className="mt-1 text-xs leading-5 text-neutral-600">{selected.note}</p>
          </div>
        </section>

        <aside className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Selected stop</p>
          <h2 className="mt-2 text-2xl font-semibold">{selected.name}</h2>
          <p className="mt-1 text-neutral-500">
            {selected.country} - {selected.code}
          </p>
          <p className="mt-4 leading-7 text-neutral-700">{selected.note}</p>
          {selectedCountry.note && (
            <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
              <p className="font-semibold">Country note</p>
              <p className="mt-2">{selectedCountry.note}</p>
            </div>
          )}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Countries/regions" value={TRAVEL_PLACES.length} />
            <Metric label="Logged places" value={allStops.length} />
          </div>

          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Countries</p>
            <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto pr-1">
              {TRAVEL_PLACES.map((country) => (
                <button
                  key={country.country}
                  type="button"
                  onClick={() => selectCountry(country)}
                  className={classNames(
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    selectedCountry.country === country.country
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50",
                  )}
                >
                  {country.code} {country.places.length}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-neutral-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
              {selectedCountry.country} places
            </p>
            <div className="grid max-h-56 gap-1 overflow-y-auto pr-1">
              {selectedCountry.places.map((place) => (
                <button
                  key={place.name}
                  type="button"
                  onClick={() => recenter(place, selectedCountry)}
                  className={classNames(
                    "rounded-xl px-3 py-2 text-left text-sm transition",
                    selected.name === place.name && selected.country === selectedCountry.country
                      ? "bg-blue-50 text-blue-700"
                      : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  {place.name}
                </button>
              ))}
            </div>
          </div>

          <details className="mt-5 rounded-2xl bg-neutral-50 p-4">
            <summary className="cursor-pointer text-sm font-medium">Show full country list</summary>
            <div className="mt-4 max-h-56 space-y-4 overflow-y-auto pr-1">
            {TRAVEL_PLACES.map((country) => (
              <div key={country.country}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{country.country}</p>
                <div className="grid gap-1">
                  {country.places.map((place) => {
                    return (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => recenter(place, country)}
                        className={classNames(
                          "rounded-xl px-3 py-2 text-left text-sm transition",
                          selected.name === place.name && selected.country === country.country
                            ? "bg-blue-50 text-blue-700"
                            : "text-neutral-700 hover:bg-neutral-50",
                        )}
                      >
                        {place.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            </div>
          </details>
        </aside>
      </div>
    </PageShell>
  );
}

function SnakePage() {
  return (
    <PageShell eyebrow="Snake" title="Google-style Snake" description="A compact playable easter egg. Use arrow keys or WASD.">
      <GoogleSnakeGame />
    </PageShell>
  );
}

function NotFoundPage({ onNavigate }) {
  const links = [
    ["Home", "home"],
    ["Experience", "experience"],
    ["Projects", "projects"],
    ["Contact", "contact"],
  ];

  return (
    <PageShell
      eyebrow="404"
      title="Page Not Found"
      description="This URL does not match a public portfolio route. Try one of Sahir Sood's main software developer portfolio pages."
    >
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Try a Portfolio Section</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map(([label, pageId]) => (
            <a
              key={pageId}
              href={routeForPage(pageId)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(pageId);
              }}
              className="rounded-full border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function GoogleSnakeGame() {
  const center = Math.floor(SNAKE_CONFIG.size / 2);
  const [snake, setSnake] = useState([{ x: center, y: center }]);
  const [food, setFood] = useState({ x: 4, y: 5, token: SNAKE_CONFIG.tokens[0] });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const directionRef = useRef(direction);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("sahirSnakeHighScore") || 0));
  const level = Math.floor(score / 5) + 1;
  const speed = Math.max(74, SNAKE_CONFIG.baseSpeed - (level - 1) * 8);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const placeFood = useCallback((body) => {
    const emptyCells = [];
    for (let x = 0; x < SNAKE_CONFIG.size; x += 1) {
      for (let y = 0; y < SNAKE_CONFIG.size; y += 1) {
        if (!body.some((part) => part.x === x && part.y === y)) emptyCells.push({ x, y });
      }
    }
    const next = emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? { x: 0, y: 0 };
    return { ...next, token: SNAKE_CONFIG.tokens[Math.floor(Math.random() * SNAKE_CONFIG.tokens.length)] };
  }, []);

  const reset = useCallback(() => {
    setSnake([{ x: center, y: center }]);
    setFood({ x: 4, y: 5, token: SNAKE_CONFIG.tokens[0] });
    setDirection({ x: 1, y: 0 });
    setRunning(false);
    setGameOver(false);
    setScore(0);
  }, [center]);

  const setMove = useCallback(
    (next) => {
      if (gameOver) return;
      setDirection((current) => (current.x + next.x === 0 && current.y + next.y === 0 ? current : next));
      setRunning(true);
    },
    [gameOver],
  );

  useEffect(() => {
    const handleKey = (event) => {
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      };
      const next = keyMap[event.key];
      if (!next) return;
      event.preventDefault();
      setMove(next);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setMove]);

  useEffect(() => {
    if (!running || gameOver) return undefined;
    const interval = window.setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const nextHead = {
          x: (head.x + directionRef.current.x + SNAKE_CONFIG.size) % SNAKE_CONFIG.size,
          y: (head.y + directionRef.current.y + SNAKE_CONFIG.size) % SNAKE_CONFIG.size,
        };
        const ate = nextHead.x === food.x && nextHead.y === food.y;
        const collisionBody = ate ? current : current.slice(0, -1);
        const hitSelf = collisionBody.some((part) => part.x === nextHead.x && part.y === nextHead.y);

        if (hitSelf) {
          setRunning(false);
          setGameOver(true);
          return current;
        }

        const nextSnake = ate ? [nextHead, ...current] : [nextHead, ...current.slice(0, -1)];
        if (ate) {
          setScore((value) => {
            const nextScore = value + 1;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem("sahirSnakeHighScore", String(nextScore));
            }
            return nextScore;
          });
          setFood(placeFood(nextSnake));
        }
        return nextSnake;
      });
    }, speed);
    return () => window.clearInterval(interval);
  }, [food, gameOver, highScore, placeFood, running, speed]);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,480px)_260px]">
      <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-neutral-900">
          <div>
            <p className="text-sm font-medium text-[#4b7f2d]">Score {score} - Best {highScore} - Level {level}</p>
            <h2 className="text-xl font-semibold">Snake</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              disabled={gameOver}
              className="grid size-10 place-items-center rounded-2xl bg-[#e8f5d4] text-[#4b7f2d] shadow-sm disabled:opacity-50"
            >
              {running ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button type="button" onClick={reset} className="grid size-10 place-items-center rounded-2xl bg-neutral-100 text-neutral-700 shadow-sm hover:bg-neutral-200">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
        <div className="relative mx-auto aspect-square max-w-[430px] overflow-hidden rounded-[1.35rem] border-[8px] border-[#4f8b30] bg-[#aad751] p-1 shadow-xl">
          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#4b7f2d] shadow">
            fruit: {food.token}
          </div>
          <div className="relative grid size-full" style={{ gridTemplateColumns: `repeat(${SNAKE_CONFIG.size}, minmax(0, 1fr))` }}>
            {Array.from({ length: SNAKE_CONFIG.size * SNAKE_CONFIG.size }).map((_, index) => {
              const x = index % SNAKE_CONFIG.size;
              const y = Math.floor(index / SNAKE_CONFIG.size);
              const snakePart = snake.findIndex((part) => part.x === x && part.y === y);
              const isHead = snakePart === 0;
              const isFood = food.x === x && food.y === y;
              return (
                <div key={`${x}-${y}`} className={classNames("grid aspect-square place-items-center", (x + y) % 2 === 0 ? "bg-[#aad751]" : "bg-[#a2d149]")}>
                  {snakePart >= 0 && (
                    <span
                      className={classNames(
                        "grid size-full place-items-center shadow-sm",
                        isHead ? "rounded-[35%] bg-[#4674e9] text-white" : "rounded-[32%] bg-[#4f7ff0]",
                      )}
                    >
                      {isHead && <span className="size-2 rounded-full bg-white" />}
                    </span>
                  )}
                  {isFood && (
                    <span className="relative grid h-4/5 w-4/5 place-items-center rounded-full bg-[#e7471d] text-[9px] font-black text-white shadow-md">
                      <span className="absolute -right-0.5 -top-1 h-2 w-3 rotate-[-25deg] rounded-full bg-[#4b7f2d]" />
                      <span className="relative">{food.token.slice(0, 2)}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {!running && !gameOver && (
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 p-3 text-center text-sm font-semibold text-[#4b7f2d] shadow">
              Press play or use WASD / arrow keys.
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 p-3 text-center text-sm font-semibold text-red-600 shadow">
              Game over. Reset and beat {highScore}.
            </div>
          )}
        </div>
      </section>
      <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Trophy size={18} className="text-amber-500" />
          Controls
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <span />
          <button type="button" onClick={() => setMove({ x: 0, y: -1 })} className="rounded-xl bg-neutral-100 py-3 font-semibold hover:bg-blue-50">
            W
          </button>
          <span />
          <button type="button" onClick={() => setMove({ x: -1, y: 0 })} className="rounded-xl bg-neutral-100 py-3 font-semibold hover:bg-blue-50">
            A
          </button>
          <button type="button" onClick={() => setMove({ x: 0, y: 1 })} className="rounded-xl bg-neutral-100 py-3 font-semibold hover:bg-blue-50">
            S
          </button>
          <button type="button" onClick={() => setMove({ x: 1, y: 0 })} className="rounded-xl bg-neutral-100 py-3 font-semibold hover:bg-blue-50">
            D
          </button>
        </div>
        <p className="mt-5 leading-7 text-neutral-600">
          Edges wrap like the familiar browser game. Every five fruits speeds things up. Only hitting yourself ends the run.
        </p>
      </aside>
    </div>
  );
}

function SpotlightPage({ kind }) {
  const detail = EXPERIENCE_DETAILS[kind] ?? EXPERIENCE_DETAILS["redbrick-paved"];
  const glance = ["Problem", "My role", "Result"]
    .map((title) => detail.sections.find((section) => section.title === title))
    .filter(Boolean);

  return (
    <PageShell
      eyebrow="Experience detail"
      title={`${detail.title} at ${detail.company}`}
      description={detail.overview[0]}
    >
      <article className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:grid-cols-[180px_1fr]">
        <div className="grid min-h-36 place-items-center rounded-3xl bg-neutral-50">
          <img
            src={detail.logo}
            alt={`${detail.company} logo`}
            width={detail.logoWidth}
            height={detail.logoHeight}
            loading="lazy"
            className="max-h-24 max-w-32 object-contain"
          />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <Chip tone="blue">{detail.dates}</Chip>
            <Chip tone={detail.status === "Current" ? "green" : "neutral"}>{detail.status}</Chip>
            {detail.team && <Chip>{detail.team}</Chip>}
            {detail.industry && <Chip>{detail.industry}</Chip>}
          </div>
          <h2 className="mt-4 text-3xl font-semibold">{detail.company}</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">{detail.overview[0]}</p>
          {detail.overview[1] && (
            <details className="mt-4 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
              <summary className="cursor-pointer font-medium text-neutral-900">More role context</summary>
              <p className="mt-3">{detail.overview[1]}</p>
            </details>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {detail.technologies.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {glance.map((section) => (
          <article key={section.title} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{section.title}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{firstSentence(section.body)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Featured work</p>
            <h3 className="mt-2 text-2xl font-semibold">{detail.featuredTitle}</h3>
            <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">{detail.featured}</p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Details</h3>
            <div className="mt-4 divide-y divide-neutral-100">
              {detail.sections.map((section) => (
                <details key={section.title} className="group py-3" open={section.title === "My role"}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-neutral-900">
                    <span>{section.title}</span>
                    <ChevronRight size={18} className="shrink-0 text-neutral-400 transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{section.body}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-neutral-200 bg-neutral-50 p-5 lg:sticky lg:top-6">
          <h3 className="font-semibold">Quick scan</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
            <Metric label="Dates" value={detail.dates} />
            <Metric label="Status" value={detail.status} />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Stack</p>
            <div className="flex flex-wrap gap-2">
              {detail.technologies.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-700 shadow-sm">
            <p className="font-semibold text-neutral-900">Personal note</p>
            <p className="mt-2">{detail.personal}</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function ProjectSpotlightPage({ kind, onNavigate }) {
  const detail = PROJECT_DETAILS[kind] ?? PROJECT_DETAILS["ai-trading-arena"];
  const glance = detail.sections.filter((section) => ["Problem", "My role", "Market engine"].includes(section.title));

  return (
    <PageShell eyebrow={detail.eyebrow} title={detail.title} description={detail.description}>
      <article className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap gap-2">
              <Chip tone="blue">{detail.category}</Chip>
              <Chip tone="green">{detail.status}</Chip>
              <Chip>{detail.timeframe}</Chip>
            </div>
            <h2 className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Claude and OpenAI trading agents competing inside a custom market.
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">
              {detail.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {detail.technologies.slice(0, 9).map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
          <div className="border-t border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
              <Trophy size={17} />
              Featured build
            </div>
            <div className="mt-5 grid gap-3">
              {detail.highlights.map((item) => (
                <Metric key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
            <a
              href={routeForPage("projects")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate?.("projects");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to projects
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {glance.map((section) => (
          <article key={section.title} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{section.title}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{firstSentence(section.body)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Featured work</p>
            <h3 className="mt-2 text-2xl font-semibold">{detail.featuredTitle}</h3>
            <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">{detail.featured}</p>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold">Case study</h3>
            <div className="mt-4 divide-y divide-neutral-100">
              {detail.sections.map((section) => (
                <details key={section.title} className="group py-3" open={["My role", "Market engine"].includes(section.title)}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-neutral-900">
                    <span>{section.title}</span>
                    <ChevronRight size={18} className="shrink-0 text-neutral-400 transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{section.body}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-neutral-200 bg-neutral-50 p-5 lg:sticky lg:top-6">
          <h3 className="font-semibold">System scan</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-1">
            <Metric label="Status" value={detail.status} />
            <Metric label="Category" value={detail.category} />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Stack</p>
            <div className="flex flex-wrap gap-2">
              {detail.technologies.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-6 text-neutral-700 shadow-sm">
            <p className="font-semibold text-neutral-900">Personal note</p>
            <p className="mt-2">{detail.personal}</p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function PageShell({ eyebrow, title, description, children }) {
  return (
    <section className="mx-auto min-h-[calc(100vh-100px)] w-full max-w-6xl px-4 pb-10 pt-5 sm:px-5 sm:pt-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ResumeBlock({ title, children }) {
  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{title}</h3>
      <p className="mt-2 leading-7 text-neutral-700">{children}</p>
    </section>
  );
}

function Chip({ children, tone = "neutral" }) {
  return (
    <span
      className={classNames(
        "inline-flex rounded-full border px-3 py-1 text-sm",
        tone === "blue" && "border-blue-200 bg-blue-50 text-blue-700",
        tone === "green" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "neutral" && "border-neutral-200 bg-neutral-50 text-neutral-700",
      )}
    >
      {children}
    </span>
  );
}

function getAnswer(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (!normalized) return ANSWERS["why should we interview sahir"];
  if (ANSWERS[normalized]) return ANSWERS[normalized];
  if (normalized.includes("contact") || normalized.includes("email")) return ANSWERS["how can i contact sahir"];
  if (normalized.includes("experience") || normalized.includes("work")) return ANSWERS["what experience does sahir have"];
  if (normalized.includes("project") || normalized.includes("full-stack")) return ANSWERS["which projects prove full-stack ability"];
  if (normalized.includes("outside") || normalized.includes("personal") || normalized.includes("travel")) return ANSWERS["what is sahir like outside code"];
  if (normalized.includes("skill") || normalized.includes("stack")) {
    return "Sahir's stack includes Python, JavaScript, TypeScript, Java, Ruby, Kotlin, SQL, React, React Native, Node.js, Rails, Flask, Firebase, AWS, Docker, PostgreSQL, and GitHub Actions.";
  }
  return "Sahir is a full-stack software developer with practical product experience, strong team signals, and projects that show web, mobile, AI, backend, data, and game-development range.";
}

function getSearchResults(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.includes("contact") || normalized.includes("email")) {
    return [
      {
        title: "Contact Sahir Sood",
        url: "contact.sahirsood.com",
        source: "Best direct path",
        description: "Email Sahir at sahirsood@gmail.com or open the Contact page for email, GitHub, LinkedIn, and a prefilled message.",
        tags: ["Email", "GitHub", "LinkedIn"],
        action: "contact",
      },
      ...baseResults(),
    ];
  }
  if (normalized.includes("experience") || normalized.includes("work")) {
    return [
      {
        title: "Experience - Sahir Sood",
        url: "experience.sahirsood.com",
        source: "Work history",
        description: "Current RBC full stack developer, RedBrick/Paved software developer, MotherTongue MVP lead developer, and Kapali contract software developer.",
        tags: ["RBC", "Paved", "MotherTongue", "Kapali"],
        action: "experience",
      },
      ...baseResults(),
    ];
  }
  if (normalized.includes("project") || normalized.includes("engineering")) {
    return [
      {
        title: "Projects - Sahir Sood",
        url: "projects.sahirsood.com",
        source: "Case studies and repos",
        description: "AI Trading Arena, UniVerse, Spotify Playlist Generator, Financial Fast Feed, BeerIQ, TripMate, Sensor Movement Data Analysis, and game builds.",
        tags: ["C++", "FastAPI", "React", "AI", "Finance", "Python"],
        action: "projects",
      },
      ...baseResults(),
    ];
  }
  return baseResults();
}

function baseResults() {
  return [
    {
      title: "Resume - Sahir Sood",
      url: "resume.sahirsood.com",
      source: "Resume",
      description: "A recruiter-scannable resume with summary, education, experience, projects, and technical skills.",
      tags: ["Resume", "Education", "Experience"],
      action: "resume",
    },
    {
      title: "Projects - Sahir Sood",
      url: "projects.sahirsood.com",
      source: "Portfolio",
      description: "Full project list covering AI trading agents, market simulation, mobile apps, AI tools, financial web features, Android maps, data analysis, and games.",
      tags: ["Projects", "Repos", "Case studies"],
      action: "projects",
    },
    {
      title: "Map and personal notes",
      url: "maps.sahirsood.com",
      source: "Personal",
      description: "OpenStreetMap-style travel map with all logged places and clickable memory notes.",
      tags: ["Travel", "Study abroad", "Vancouver"],
      action: "map",
    },
    {
      title: "Google-style Snake",
      url: "games.sahirsood.com/snake",
      source: "Easter egg",
      description: "Playable Snake game in the familiar green board style, with portfolio-themed pickups.",
      tags: ["Game", "Interactive", "Fun"],
      action: "snake",
    },
  ];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleCase(value) {
  if (value === "rbc") return "RBC";
  if (value === "redbrick-paved") return "RedBrick / Paved";
  if (value === "mothertongue") return "MotherTongue";
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function App() {
  const [profile, setProfile] = useState(() => {
    if (pageFromLocation() === "home") return null;
    return PROFILES[0];
  });

  if (!profile) return <ProfilePicker onChoose={setProfile} />;

  return <BrowserPortfolio profile={profile} onSwitchProfile={() => setProfile(null)} />;
}
