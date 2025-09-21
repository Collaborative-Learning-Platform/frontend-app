#!/usr/bin/env node

/**
 * Requirements.txt compatible installer for npm
 * Reads from requirements.txt and installs packages
 * Run with: node install-from-requirements.js
 */

import fs from "fs";
const { execSync } = await import("child_process");

console.log("Installing dependencies from requirements.txt...\n");

try {
  // Read requirements.txt
  const content = fs.readFileSync("requirements.txt", "utf8");
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  // Split into production and dev dependencies using marker
  const devMarker = lines.findIndex((line) =>
    line.startsWith("### DEV DEPENDENCIES")
  );
  const prodDeps = devMarker === -1 ? lines : lines.slice(0, devMarker);
  const devDeps = devMarker === -1 ? [] : lines.slice(devMarker + 1);

  if (prodDeps.length > 0) {
    console.log("Installing production dependencies...");
    console.log("Packages:", prodDeps.join(", "));
    execSync(`npm install ${prodDeps.join(" ")}`, { stdio: "inherit" });
  }

  if (devDeps.length > 0) {
    console.log("\nInstalling development dependencies...");
    console.log("Packages:", devDeps.join(", "));
    execSync(`npm install -D ${devDeps.join(" ")}`, { stdio: "inherit" });
  }

  console.log(
    "\n✅ All dependencies from requirements.txt installed successfully!"
  );
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("❌ requirements.txt file not found!");
    console.log("Make sure requirements.txt is in the current directory.");
  } else {
    console.error("❌ Installation failed:", error.message);
  }
  process.exit(1);
}
