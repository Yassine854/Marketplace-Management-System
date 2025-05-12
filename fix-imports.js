const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Paths to fix
const pathsToFix = [
  { from: "@/clientsprisma/getLogs", to: "@/clients/prisma/getLogs" },
  { from: "@/servicesauth", to: "@/services/auth" },
];

// Function to recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }),
  );
  return files.flat();
}

// Function to fix imports in a file
async function fixImportsInFile(filePath) {
  // Only process TypeScript and JavaScript files
  if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) {
    return false;
  }

  try {
    const content = await readFile(filePath, "utf8");
    let newContent = content;
    let changed = false;

    // Replace each path
    for (const { from, to } of pathsToFix) {
      if (newContent.includes(from)) {
        newContent = newContent.replace(new RegExp(from, "g"), to);
        changed = true;
      }
    }

    // If changes were made, write the file
    if (changed) {
      await writeFile(filePath, newContent, "utf8");
      console.log(`Fixed imports in ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Get all files in the src directory
    const files = await getFiles("./src");

    // Fix imports in each file
    let fixedCount = 0;
    for (const file of files) {
      const fixed = await fixImportsInFile(file);
      if (fixed) {
        fixedCount++;
      }
    }

    console.log(`Fixed imports in ${fixedCount} files.`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
