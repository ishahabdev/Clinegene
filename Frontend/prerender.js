import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { seoRoutes, BASE_URL, serviceSlugs, legacyServiceSlugs } from "./src/data/seoData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  console.log("🚀 Starting ClinGene Build-Time Prerendering (SSG)...");

  const templatePath = path.resolve(__dirname, "dist/index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run 'vite build' first.");
  }
  const template = fs.readFileSync(templatePath, "utf-8");

  // Load the built SSR bundle
  const ssrBundlePath = path.resolve(__dirname, "dist-ssr/entry-server.js");
  if (!fs.existsSync(ssrBundlePath)) {
    throw new Error("dist-ssr/entry-server.js not found. Run 'vite build --ssr' first.");
  }

  const { render } = await import(pathToFileURL(ssrBundlePath).href);

  // Derive service routes directly from serviceSlugs and legacyServiceSlugs
  const dynamicServiceRoutes = [
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...legacyServiceSlugs.map((slug) => `/services/${slug}`),
  ];

  const routeSet = new Set([...Object.keys(seoRoutes), ...dynamicServiceRoutes]);
  const routes = Array.from(routeSet);
  console.log(`📄 Prerendering ${routes.length} public routes...`);

  for (const route of routes) {
    const seo = seoRoutes[route] || seoRoutes["/"];
    const { html: appHtml } = render(route);

    // 1. Inject rendered HTML inside #root
    let pageHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // 2. Inject Page Title
    if (seo.title) {
      pageHtml = pageHtml.replace(
        /<title>.*?<\/title>/i,
        `<title>${seo.title}</title>`
      );
    }

    // 3. Inject Meta Description
    if (seo.description) {
      pageHtml = pageHtml.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${seo.description.replace(/"/g, '&quot;')}" />`
      );
    }

    // 3b. Inject Robots (noindex for 404 or specified routes)
    if (seo.robots || route === "404") {
      pageHtml = pageHtml.replace(
        /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
        `<meta name="robots" content="${seo.robots || 'noindex, follow'}" />`
      );
    }

    // 4. Inject Canonical URL
    const canonicalUrl = seo.canonical || (route === "404" ? `${BASE_URL}/404` : `${BASE_URL}${route}`);
    pageHtml = pageHtml.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // 5. Inject Open Graph and Twitter tags
    const ogTitle = seo.title || "ClinGene";
    const ogDesc = seo.description || "";
    const ogType = seo.ogType || "website";

    pageHtml = pageHtml
      .replace(
        /<meta\s+property="og:site_name"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:site_name" content="ClinGene" />`
      )
      .replace(
        /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:description" content="${ogDesc.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:url" content="${canonicalUrl}" />`
      )
      .replace(
        /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:type" content="${ogType}" />`
      )
      .replace(
        /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />`
      )
      .replace(
        /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:description" content="${ogDesc.replace(/"/g, '&quot;')}" />`
      );

    // 6. Inject Structured Data (JSON-LD)
    if (seo.schema && seo.schema.length > 0) {
      const jsonLdScripts = seo.schema
        .map((s) => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`)
        .join("\n");
      pageHtml = pageHtml.replace("</head>", `${jsonLdScripts}\n  </head>`);
    }

    // 7. Write to dist/ directory
    let outputPath;
    if (route === "/") {
      outputPath = path.resolve(__dirname, "dist/index.html");
    } else if (route === "404") {
      outputPath = path.resolve(__dirname, "dist/404.html");
    } else {
      const cleanRoute = route.replace(/^\/|\/$/g, "");
      const routeDir = path.resolve(__dirname, "dist", cleanRoute);
      fs.mkdirSync(routeDir, { recursive: true });
      outputPath = path.join(routeDir, "index.html");
    }

    fs.writeFileSync(outputPath, pageHtml, "utf-8");
    console.log(`  ✓ ${route} -> ${path.relative(__dirname, outputPath)} (${(pageHtml.length / 1024).toFixed(1)} KB)`);
  }

  // ── 8. Generate Sitemap.xml ──
  console.log("🗺️  Generating sitemap.xml...");
  const today = new Date().toISOString().split("T")[0];
  const sitemapUrls = routes
    .filter((r) => r !== "404")
    .map((r) => {
      const loc = r === "/" ? `${BASE_URL}/` : `${BASE_URL}${r}`;
      const priority = r === "/" ? "1.0" : r.startsWith("/services/") ? "0.8" : "0.7";
      const changefreq = r === "/" ? "daily" : "weekly";
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

  fs.writeFileSync(path.resolve(__dirname, "dist/sitemap.xml"), sitemapContent, "utf-8");
  fs.writeFileSync(path.resolve(__dirname, "public/sitemap.xml"), sitemapContent, "utf-8");
  console.log("  ✓ dist/sitemap.xml & public/sitemap.xml generated");

  // ── 9. Generate Robots.txt ──
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.resolve(__dirname, "dist/robots.txt"), robotsContent, "utf-8");
  fs.writeFileSync(path.resolve(__dirname, "public/robots.txt"), robotsContent, "utf-8");
  console.log("  ✓ dist/robots.txt & public/robots.txt updated");

  // Clean up temporary dist-ssr directory
  try {
    fs.rmSync(path.resolve(__dirname, "dist-ssr"), { recursive: true, force: true });
  } catch (e) {
    // ignore
  }

  console.log("🎉 ClinGene SSG Prerender Complete!");
}

prerender().catch((err) => {
  console.error("Prerender error:", err);
  process.exit(1);
});

