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

    html = html.replace("<!-- inject:navbar -->", navbar);
    html = html.replace("<!-- inject:contact-drawer -->", contactDrawer);

    ensureDir(outputDir);
    fs.writeFileSync(outputPath, html);

    console.log(`Built: ${relativePath}`);
  });
}

buildHtmlFiles(srcDir);