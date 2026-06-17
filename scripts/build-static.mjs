import { execSync } from "node:child_process";

process.env.STATIC_EXPORT = "true";

const filePreview = process.argv.includes("--file");

execSync("next build", { stdio: "inherit", env: process.env });

if (filePreview) {
  execSync("node scripts/fix-file-preview.mjs", { stdio: "inherit" });
}

execSync("node scripts/copy-preview-launcher.mjs", { stdio: "inherit" });
