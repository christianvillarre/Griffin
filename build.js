const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const srcDir = path.join(rootDir, "src");
const partialsDir = path.join(rootDir, "partials");

const navbar = fs.readFileSync(
  path.join(partialsDir, "navbar.html"),
  "utf8"
);

const contactDrawer = fs.readFileSync(
  path.join(partialsDir, "contact-drawer.html"),
  "utf8"
);

const navbarCss = fs.readFileSync(path.join(rootDir, "navbar.css"), "utf8")
  .replace(/[ \t]+(?=\r?$)/gm, "");
const fontCss = fs.readFileSync(path.join(rootDir, "zalando-font.css"), "utf8");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildHtmlFiles(currentDir) {
  const files = fs.readdirSync(currentDir);

  files.forEach(file => {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      buildHtmlFiles(fullPath);
      return;
    }

    if (!file.endsWith(".html")) return;

    const relativePath = path.relative(srcDir, fullPath);
    const outputPath = path.join(rootDir, relativePath);
    const outputDir = path.dirname(outputPath);

    let html = fs.readFileSync(fullPath, "utf8");

    if (relativePath === "index.html") {
      html = html.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">',
        `<style>${fontCss}</style>`
      );
      html = html.replace(
        '<link rel="stylesheet" href="/navbar.css" />',
        `<style>${navbarCss}</style>`
      );
    }

    html = html.replace("<!-- inject:navbar -->", navbar);
    html = html.replace("<!-- inject:contact-drawer -->", contactDrawer);

    ensureDir(outputDir);
    fs.writeFileSync(outputPath, html);

    console.log(`Built: ${relativePath}`);
  });
}

buildHtmlFiles(srcDir);
