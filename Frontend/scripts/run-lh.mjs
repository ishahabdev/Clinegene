import { execSync } from "node:child_process";
import fs from "node:fs";

const pages = [
  { path: "", name: "home" },
  { path: "about", name: "about" },
  { path: "team", name: "team" },
  { path: "contact", name: "contact" }
];

console.log("Starting Lighthouse verification run...");

for (const p of pages) {
  const url = `http://localhost:4173/${p.path}`;
  const outFile = `lh-final-${p.name}.json`;
  console.log(`Auditing ${url}...`);
  execSync(
    `npx lighthouse ${url} --preset=desktop --chrome-flags="--headless --no-sandbox --disable-gpu" --output=json --output-path=${outFile} --only-categories=performance,accessibility,best-practices,seo`,
    { stdio: "ignore" }
  );
  const report = JSON.parse(fs.readFileSync(outFile, "utf-8"));
  console.log(`\n=== ${p.name.toUpperCase()} (/${p.path}) ===`);
  for (const cat in report.categories) {
    console.log(`  ${cat}: ${Math.round(report.categories[cat].score * 100)}`);
  }
}
