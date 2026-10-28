import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = './src';
const EXTENSIONS = ['.jsx', '.js', '.tsx', '.ts', '.html'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        results = results.concat(walk(fullPath));
      }
    } else if (EXTENSIONS.some((ext) => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk(SRC_DIR);
const issues = [];

// Audit rules
files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // 1. Missing rel="noopener" on target="_blank"
    if (line.includes('target="_blank"') && !line.includes('rel="noopener') && !content.slice(Math.max(0, content.indexOf(line) - 100), content.indexOf(line) + 200).includes('rel=')) {
      issues.push({
        file,
        line: lineNum,
        rule: 'a11y/no-unsafe-target-blank',
        message: 'Links with target="_blank" must include rel="noopener noreferrer"',
      });
    }

    // 2. Deprecated HTML tags
    const deprecatedTags = ['<center', '<font', '<marquee', '<blink', '<big', '<strike'];
    deprecatedTags.forEach((tag) => {
      if (line.toLowerCase().includes(tag)) {
        issues.push({
          file,
          line: lineNum,
          rule: 'html/no-deprecated-tags',
          message: `Deprecated HTML tag "${tag.slice(1)}" used`,
        });
      }
    });

    // 3. Known arbitrary Tailwind utilities with canonical replacements
    const arbitraryPatterns = [
      { pattern: /\bz-\[1000\]\b/, replacement: 'z-1000' },
      { pattern: /\bz-\[999\]\b/, replacement: 'z-999' },
      { pattern: /\bz-\[998\]\b/, replacement: 'z-998' },
      { pattern: /\bmin-h-\[44px\]\b/, replacement: 'min-h-11' },
      { pattern: /\bmin-w-\[44px\]\b/, replacement: 'min-w-11' },
      { pattern: /\brounded-\[16px\]\b/, replacement: 'rounded-2xl' },
      { pattern: /\brounded-\[24px\]\b/, replacement: 'rounded-3xl' },
      { pattern: /\bbreak-words\b/, replacement: 'wrap-break-word' },
    ];

    arbitraryPatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(line)) {
        issues.push({
          file,
          line: lineNum,
          rule: 'tailwind/suggestCanonicalClasses',
          message: `Arbitrary utility can be written canonically as "${replacement}"`,
        });
      }
    });

    // 4. CSS Conflicts (e.g. duplicate utility with !)
    if (line.includes('rounded-full') && line.includes('rounded-full!')) {
      issues.push({
        file,
        line: lineNum,
        rule: 'tailwind/cssConflict',
        message: `'rounded-full' applies the same properties as 'rounded-full!'`,
      });
    }
  });

  // 5. <img> tags without alt attribute
  const imgMatches = content.match(/<img[^>]*>/g) || [];
  imgMatches.forEach((img) => {
    if (!img.includes('alt=')) {
      issues.push({
        file,
        line: 1,
        rule: 'a11y/img-has-alt',
        message: 'Image element must have an alt prop',
      });
    }
  });
});

// Group and output results
console.log('--- ClinGene Source Linter (src/ only) ---');
if (issues.length === 0) {
  console.log('✓ All source files in src/ passed linting with 0 errors and 0 warnings!');
  process.exit(0);
} else {
  console.log(`Found ${issues.length} issue(s) across source files:\n`);
  const grouped = {};
  issues.forEach((i) => {
    grouped[i.rule] = (grouped[i.rule] || 0) + 1;
    console.log(`  ${i.file}:${i.line} [${i.rule}] ${i.message}`);
  });
  console.log('\nSummary by Rule:');
  console.table(grouped);
  process.exit(1);
}

