import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");
const scriptsDir = path.join(__dirname);

function writeWindowsLauncher() {
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

  writeWindowsLauncher();
  console.log("Copied preview.bat into out/");
}

main();
