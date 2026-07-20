import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { SEO_ROUTES, SITE_CONFIG, absoluteUrl, normalizeSiteUrl } from "../src/seo/siteConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const loadedEnv = loadEnv(process.env.NODE_ENV || "production", projectRoot, "");
Object.assign(process.env, loadedEnv);
const distDir = path.resolve(__dirname, "..", "dist");
const templatePath = path.join(distDir, "index.html");

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || SITE_CONFIG.siteUrl || SITE_CONFIG.inferredSiteUrl);

const notFoundRoute = {
  id: "not-found",
  path: "/404",
  title: "Page Not Found | Sahir Sood",
  description:
    "The page you requested could not be found. Return to Sahir Sood's software developer portfolio, experience, projects, resume, or contact page.",
  h1: "Page Not Found",
  eyebrow: "404",
  robots: "noindex,follow",
  sitemap: false,
  sections: [
    {
      heading: "Try a Portfolio Section",
      paragraphs: [
        "This URL does not match a public portfolio route. Use the links below to visit Sahir Sood's main software developer portfolio pages.",
      ],
    },
  ],
  links: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function escapeXml(value) {
  return escapeHtml(value);
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
}

function replaceManagedBlock(template, blockName, content) {
  const pattern = new RegExp(`<!-- ${blockName}_START -->[\\s\\S]*?<!-- ${blockName}_END -->`);
  if (!pattern.test(template)) {
    throw new Error(`Missing ${blockName} block in ${templatePath}`);
  }
  return template.replace(pattern, `<!-- ${blockName}_START -->\n${content}\n    <!-- ${blockName}_END -->`);
}

function canonicalUrl(route) {
  return absoluteUrl(route.path === "/404" ? "/404.html" : route.path, siteUrl);
}

function imageUrl(route) {
  return absoluteUrl(route.image || SITE_CONFIG.socialImage || SITE_CONFIG.profileImage, siteUrl);
}

function personImageUrl() {
  return absoluteUrl(SITE_CONFIG.profileImage, siteUrl);
}

function verificationTags() {
  const tags = [];
  if (process.env.VITE_GOOGLE_SITE_VERIFICATION) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeAttr(process.env.VITE_GOOGLE_SITE_VERIFICATION)}" />`,
    );
  }
  if (process.env.VITE_BING_SITE_VERIFICATION) {
    tags.push(`<meta name="msvalidate.01" content="${escapeAttr(process.env.VITE_BING_SITE_VERIFICATION)}" />`);
  }
  return tags;
}

function profileJsonLd(route) {
  const rootUrl = absoluteUrl("/", siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${rootUrl}#profile-page`,
    url: canonicalUrl(route),
    name: route.title,
    description: route.description,
    mainEntity: {
      "@type": "Person",
      "@id": `${rootUrl}#person`,
      name: SITE_CONFIG.displayName,
      url: rootUrl,
      image: personImageUrl(),
      jobTitle: SITE_CONFIG.jobTitle,
      description: SITE_CONFIG.description,
      email: `mailto:${SITE_CONFIG.email}`,
      sameAs: [SITE_CONFIG.githubUrl, SITE_CONFIG.linkedinUrl],
      alumniOf: SITE_CONFIG.alumniOf.map((name) => ({
        "@type": "CollegeOrUniversity",
        name,
      })),
      worksFor: SITE_CONFIG.worksFor.map((name) => ({
        "@type": "Organization",
        name,
      })),
      knowsAbout: SITE_CONFIG.knowsAbout,
    },
  };
}

function webPageJsonLd(route) {
  const rootUrl = absoluteUrl("/", siteUrl);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl(route)}#webpage`,
    url: canonicalUrl(route),
    name: route.title,
    description: route.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${rootUrl}#website`,
      name: "Sahir Sood Portfolio",
      url: rootUrl,
    },
    about: {
      "@id": `${rootUrl}#person`,
      name: SITE_CONFIG.displayName,
    },
  };
}

function headForRoute(route) {
  const canonical = canonicalUrl(route);
  const image = imageUrl(route);
  const robots = route.robots || "index,follow";
  const ogType = route.id === "home" ? "profile" : "website";
  const ld = route.id === "home" ? profileJsonLd(route) : webPageJsonLd(route);
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeAttr(route.description)}" />`,
    `<meta name="robots" content="${escapeAttr(robots)}" />`,
    `<meta name="theme-color" content="${escapeAttr(SITE_CONFIG.themeColor)}" />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<link rel="icon" href="${escapeAttr(SITE_CONFIG.icon48)}" sizes="48x48" type="image/png" />`,
    `<link rel="apple-touch-icon" href="${escapeAttr(SITE_CONFIG.icon192)}" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    `<meta property="og:type" content="${escapeAttr(ogType)}" />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(SITE_CONFIG.profileImageAlt)}" />`,
    `<meta property="og:image:width" content="${escapeAttr(SITE_CONFIG.socialImageWidth || 1200)}" />`,
    `<meta property="og:image:height" content="${escapeAttr(SITE_CONFIG.socialImageHeight || 630)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttr(SITE_CONFIG.profileImageAlt)}" />`,
    ...verificationTags(),
    jsonLdScript(ld),
    staticFallbackStyle(),
  ];

  return tags.map((tag) => `    ${tag}`).join("\n");
}

function staticFallbackStyle() {
  return `<style>
      .js #seo-static-content { display: none; }
      #seo-static-content {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #202124;
        background: #ffffff;
      }
      #seo-static-content main {
        width: min(1120px, calc(100% - 32px));
        margin: 0 auto;
        padding: 48px 0;
      }
      #seo-static-content h1 {
        max-width: 760px;
        margin: 0;
        font-size: clamp(2.25rem, 6vw, 4.5rem);
        line-height: 1.04;
        letter-spacing: 0;
      }
      #seo-static-content h2 {
        margin: 40px 0 12px;
        font-size: 1.5rem;
      }
      #seo-static-content p,
      #seo-static-content li {
        max-width: 820px;
        font-size: 1rem;
        line-height: 1.75;
        color: #3f4752;
      }
      #seo-static-content a { color: #1a0dab; }
      #seo-static-content nav {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }
      #seo-static-content img {
        width: 96px;
        height: 96px;
        border-radius: 9999px;
        object-fit: cover;
        margin-bottom: 20px;
      }
    </style>`;
}

function linkForRoute(link) {
  const href = link.external ? link.href : absoluteUrl(link.href, siteUrl).replace(siteUrl, "");
  const target = link.external || /^https?:\/\//i.test(link.href) ? ' target="_blank" rel="noreferrer"' : "";
  return `<a href="${escapeAttr(href)}"${target}>${escapeHtml(link.label)}</a>`;
}

function sectionMarkup(section) {
  const paragraphs = section.paragraphs?.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n") ?? "";
  const list =
    section.list && section.list.length
      ? `<ul>\n${section.list.map((item) => `          <li>${escapeHtml(item)}</li>`).join("\n")}\n        </ul>`
      : "";

  return `      <section>
        <h2>${escapeHtml(section.heading)}</h2>
        ${paragraphs}
        ${list}
      </section>`;
}

function bodyForRoute(route) {
  const links = route.links?.length ? `<nav aria-label="Related portfolio links">${route.links.map(linkForRoute).join("\n          ")}</nav>` : "";
  const portrait =
    route.id === "home" || route.id === "profile"
      ? `<img src="${escapeAttr(SITE_CONFIG.profileImage)}" alt="${escapeAttr(SITE_CONFIG.profileImageAlt)}" width="1200" height="1200" loading="eager" />`
      : "";
  return `<main>
        <p>${escapeHtml(route.eyebrow || "Portfolio")}</p>
        ${portrait}
        <h1>${escapeHtml(route.h1)}</h1>
        <p>${escapeHtml(route.description)}</p>
        ${links}
${route.sections.map(sectionMarkup).join("\n")}
      </main>`;
}

function outputPathForRoute(route) {
  if (route.path === "/") return path.join(distDir, "index.html");
  if (route.path === "/404") return path.join(distDir, "404.html");
  return path.join(distDir, route.path.replace(/^\/+/, ""), "index.html");
}

function extensionlessOutputPathForRoute(route) {
  if (route.path === "/" || route.path === "/404") return null;
  return path.join(distDir, `${route.path.replace(/^\/+/, "")}.html`);
}

async function writeRoute(template, route) {
  const htmlWithHead = replaceManagedBlock(template, "SEO_HEAD", headForRoute(route));
  const html = replaceManagedBlock(htmlWithHead, "SEO_BODY", bodyForRoute(route));
  const outputPath = outputPathForRoute(route);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);

  const extensionlessPath = extensionlessOutputPathForRoute(route);
  if (extensionlessPath) {
    await mkdir(path.dirname(extensionlessPath), { recursive: true });
    await writeFile(extensionlessPath, html);
  }
}

async function writeRobots() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml", siteUrl)}
`;
  await writeFile(path.join(distDir, "robots.txt"), robots);
}

async function writeSitemap() {
  const urls = SEO_ROUTES.filter((route) => route.sitemap !== false && !(route.robots || "").includes("noindex"))
    .map((route) => {
      const lastmod = route.lastmod ? `\n    <lastmod>${escapeXml(route.lastmod)}</lastmod>` : "";
      const changefreq = route.changefreq ? `\n    <changefreq>${escapeXml(route.changefreq)}</changefreq>` : "";
      const priority = route.priority ? `\n    <priority>${escapeXml(route.priority)}</priority>` : "";
      return `  <url>
    <loc>${escapeXml(canonicalUrl(route))}</loc>${lastmod}${changefreq}${priority}
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
}

const template = await readFile(templatePath, "utf8");

for (const route of SEO_ROUTES) {
  await writeRoute(template, route);
}

await writeRoute(template, notFoundRoute);
await writeRobots();
await writeSitemap();

console.log(`Prerendered ${SEO_ROUTES.length} route(s), robots.txt, sitemap.xml, and 404.html for ${siteUrl}`);
