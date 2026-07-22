import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { PERSONAL_IMAGES, SEO_ROUTES, SITE_CONFIG, absoluteUrl, normalizeSiteUrl } from "../src/seo/siteConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const loadedEnv = loadEnv(process.env.NODE_ENV || "production", projectRoot, "");
Object.assign(process.env, loadedEnv);
const distDir = path.resolve(__dirname, "..", "dist");
const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || SITE_CONFIG.siteUrl || SITE_CONFIG.inferredSiteUrl);

const failures = [];

function fail(message) {
  failures.push(message);
}

function outputPathForRoute(route) {
  if (route.path === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.path.replace(/^\/+/, ""), "index.html");
}

function canonicalUrl(route) {
  return absoluteUrl(route.path, siteUrl);
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function imageSitemapEntriesForRoute(route) {
  const images = [];
  if (["home", "profile"].includes(route.id)) {
    images.push(SITE_CONFIG.profileImage);
  }
  if (["home", "profile", "map"].includes(route.id)) {
    images.push(...PERSONAL_IMAGES.map((image) => image.src));
  }

  return [...new Set(images)].map((src) => absoluteUrl(src, siteUrl));
}

function decodeHtml(value) {
  return String(value ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function getMeta(html, selectorName) {
  const pattern = new RegExp(`<meta\\s+name=["']${selectorName}["']\\s+content=["']([^"']+)["']`, "i");
  return html.match(pattern)?.[1];
}

function getCanonical(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

const seenTitles = new Map();
const seenDescriptions = new Map();

for (const route of SEO_ROUTES) {
  const filePath = outputPathForRoute(route);
  if (!(await exists(filePath))) {
    fail(`Missing prerendered file for ${route.path}: ${filePath}`);
    continue;
  }

  const html = await readFile(filePath, "utf8");
  const title = decodeHtml(getTitle(html));
  const description = decodeHtml(getMeta(html, "description"));
  const robots = getMeta(html, "robots");
  const canonical = getCanonical(html);
  const h1Count = countMatches(html, /<h1[\s>]/gi);
  const jsonLdBlocks = extractJsonLd(html);

  if (title !== route.title) fail(`${route.path} has unexpected title: ${title}`);
  if (description !== route.description) fail(`${route.path} has unexpected meta description`);
  if (canonical !== canonicalUrl(route)) fail(`${route.path} has unexpected canonical: ${canonical}`);
  if (!robots) fail(`${route.path} is missing robots meta`);
  if (h1Count !== 1) fail(`${route.path} should have exactly one static h1, found ${h1Count}`);
  if (!html.includes(route.h1) && !html.includes(route.h1.replace("&", "&amp;"))) {
    fail(`${route.path} static HTML does not include route h1`);
  }
  if (!html.includes("og:title") || !html.includes("twitter:card")) fail(`${route.path} is missing social metadata`);
  if (!jsonLdBlocks.length) fail(`${route.path} is missing JSON-LD`);

  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block);
    } catch (error) {
      fail(`${route.path} has invalid JSON-LD: ${error.message}`);
    }
  }

  if (route.sitemap !== false && !(route.robots || "").includes("noindex")) {
    if (seenTitles.has(title)) fail(`Duplicate title for ${route.path} and ${seenTitles.get(title)}: ${title}`);
    if (seenDescriptions.has(description)) {
      fail(`Duplicate description for ${route.path} and ${seenDescriptions.get(description)}`);
    }
    seenTitles.set(title, route.path);
    seenDescriptions.set(description, route.path);
  }
}

const homeHtml = await readFile(path.join(distDir, "index.html"), "utf8");
for (const required of [
  "Sahir Sood",
  "Full-Stack Developer",
  "RBC",
  "RedBrick",
  "MotherTongue",
  "Selected Software and AI Projects",
  "ProfilePage",
  "Person",
]) {
  if (!homeHtml.includes(required)) fail(`Homepage generated HTML is missing required text: ${required}`);
}

const robotsPath = path.join(distDir, "robots.txt");
const sitemapPath = path.join(distDir, "sitemap.xml");
if (!(await exists(robotsPath))) fail("Missing dist/robots.txt");
if (!(await exists(sitemapPath))) fail("Missing dist/sitemap.xml");

if (await exists(robotsPath)) {
  const robots = await readFile(robotsPath, "utf8");
  if (!robots.includes(`Sitemap: ${absoluteUrl("/sitemap.xml", siteUrl)}`)) fail("robots.txt does not point to sitemap.xml");
  if (/Disallow:\s*\//i.test(robots)) fail("robots.txt appears to block the public site");
}

if (await exists(sitemapPath)) {
  const sitemap = await readFile(sitemapPath, "utf8");
  if (!sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    fail("sitemap.xml is missing the Google image sitemap namespace");
  }
  for (const route of SEO_ROUTES) {
    const shouldInclude = route.sitemap !== false && !(route.robots || "").includes("noindex");
    const included = sitemap.includes(`<loc>${canonicalUrl(route)}</loc>`);
    if (shouldInclude && !included) fail(`sitemap.xml is missing ${route.path}`);
    if (!shouldInclude && included) fail(`sitemap.xml includes non-indexable route ${route.path}`);

    if (shouldInclude) {
      for (const imageUrl of imageSitemapEntriesForRoute(route)) {
        if (!sitemap.includes(`<image:loc>${imageUrl}</image:loc>`)) {
          fail(`sitemap.xml is missing image entry ${imageUrl} for ${route.path}`);
        }
      }
    }
  }
}

const notFoundPath = path.join(distDir, "404.html");
if (!(await exists(notFoundPath))) fail("Missing dist/404.html");
if (await exists(notFoundPath)) {
  const notFound = await readFile(notFoundPath, "utf8");
  if (!getMeta(notFound, "robots")?.includes("noindex")) fail("404.html is not marked noindex");
}

if (failures.length) {
  console.error("SEO check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`SEO check passed for ${SEO_ROUTES.length} generated route(s), robots.txt, sitemap.xml, and 404.html.`);
