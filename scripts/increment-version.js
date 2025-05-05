const fs = require("fs");
const path = require("path");

// Read the version file
const versionPath = path.join(__dirname, "..", "version.json");
const versionFile = require(versionPath);

// Split version into components
const [major, minor, patch] = versionFile.version.split(".").map(Number);

// Increment patch version
versionFile.version = `${major}.${minor}.${patch + 1}`;

// Write back to file
fs.writeFileSync(versionPath, JSON.stringify(versionFile, null, 2));

// Update version in Sidebar.tsx
const sidebarPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "Sidebar.tsx"
);
let sidebarContent = fs.readFileSync(sidebarPath, "utf8");

// Replace version in both English and Arabic strings
sidebarContent = sidebarContent.replace(
  /UDST Tools v\d+\.\d+\.\d+/g,
  `UDST Tools v${versionFile.version}`
);
sidebarContent = sidebarContent.replace(
  /أدوات UDST الإصدار \d+\.\d+\.\d+/g,
  `أدوات UDST الإصدار ${versionFile.version}`
);
sidebarContent = sidebarContent.replace(
  /v\d+\.\d+\.\d+/g,
  `v${versionFile.version}`
);

fs.writeFileSync(sidebarPath, sidebarContent);

// Log the new version
console.log(`Version updated to ${versionFile.version}`);
