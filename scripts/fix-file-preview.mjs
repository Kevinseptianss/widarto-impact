import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");

const FILE_PREVIEW_SCRIPT = `<script>(function(){if(location.protocol!=="file:")return;document.addEventListener("click",function(e){var a=e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href");if(!h||h[0]==="#"||/^(https?:|mailto:|tel:)/i.test(h))return;if(/\\.html($|[?#])/i.test(h)){e.preventDefault();e.stopImmediatePropagation();location.assign(a.href)}},!0)})();</script>`;

const TURBOPACK_PREFIX_PATCH =
  'let t=function(){try{var e=document.querySelector(\'script[src*="_next/static"]\');if(!e)return"./_next/";var r=e.getAttribute("src")||"";var n=r.indexOf("_next/");return n<0?"./_next/":r.slice(0,n+6)}catch(e){return"./_next/"}}(),';

function getRelativePrefix(relativeFilePath) {
  const dir = path.dirname(relativeFilePath);
  if (dir === ".") return "./";
  const depth = dir.split(path.sep).length;
  return "../".repeat(depth);
}

function routePathToHtml(routePath) {
  if (!routePath) return "index.html";
  const clean = routePath.replace(/\/$/, "");
  return `${clean}.html`;
}

function fixAbsolutePath(value, prefix) {
  if (!value.startsWith("/")) return value;
  if (value.startsWith("//")) return value;
  return `${prefix}${value.slice(1)}`;
}

function isInternalPageHref(pathValue) {
  if (pathValue.startsWith("_next/")) return false;
  if (pathValue.startsWith("logo/")) return false;
  if (/\.(css|js|mjs|map|woff2?|ttf|otf|svg|png|jpe?g|gif|avif|ico|webp|txt|xml|json)$/i.test(pathValue)) {
    return false;
  }
  return true;
}

function fixAttributePath(attr, pathValue, prefix) {
  if (attr === "href" && isInternalPageHref(pathValue)) {
    return `${prefix}${routePathToHtml(pathValue)}`;
  }
  return `${prefix}${pathValue}`;
}

function fixHtmlContent(html, prefix) {
  let result = html;

  result = result.replace(
    /\b(href|src|content|action)=["']\/(?!\/)([^"']*)["']/g,
    (match, attr, pathValue) => {
      const fixed = fixAttributePath(attr, pathValue, prefix);
      return `${attr}="${fixed}"`;
    },
  );

  if (!result.includes("location.protocol!=='file:'")) {
    result = result.replace(/<body([^>]*)>/, `<body$1>${FILE_PREVIEW_SCRIPT}`);
  }

  return result;
}

function patchTurbopackRuntime(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (!content.includes('let t="/_next/"')) return false;
  content = content.replace('let t="/_next/",', TURBOPACK_PREFIX_PATCH);
  fs.writeFileSync(filePath, content);
  return true;
}

function walkHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function patchJsFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchJsFiles(fullPath);
    } else if (entry.name.endsWith(".js")) {
      patchTurbopackRuntime(fullPath);
    }
  }
}

function writeWindowsLauncher() {
  const scriptsDir = path.join(__dirname);
  const previewOutBat = fs.readFileSync(
    path.join(scriptsDir, "preview-out.bat"),
    "utf8",
  );
  const previewPs1 = fs.readFileSync(
    path.join(scriptsDir, "preview-server.ps1"),
    "utf8",
  );

  fs.writeFileSync(path.join(outDir, "preview.bat"), previewOutBat);
  fs.writeFileSync(path.join(outDir, "preview-server.ps1"), previewPs1);
  fs.writeFileSync(
    path.join(outDir, "OPEN WEBSITE.bat"),
    `@echo off\r\ncd /d "%~dp0"\r\ncall preview.bat\r\n`,
  );
}

function main() {
  if (!fs.existsSync(outDir)) {
    console.error("out/ folder not found. Run next build first.");
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(outDir);
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(outDir, filePath);
    const prefix = getRelativePrefix(relativePath);
    const html = fs.readFileSync(filePath, "utf8");
    const fixed = fixHtmlContent(html, prefix);
    fs.writeFileSync(filePath, fixed);
    console.log(`Fixed paths: ${relativePath}`);
  }

  const nextDir = path.join(outDir, "_next");
  if (fs.existsSync(nextDir)) {
    patchJsFiles(nextDir);
    console.log("Patched Next.js runtime for file:// preview");
  }

  writeWindowsLauncher();
  console.log("Created preview.bat in out/ (no Node.js needed)");
}

main();
