import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const markdownLinkPattern = /!?\[[^\]]*\]\(([^)\n]+)\)/g;

// Markdown files git would track — committed or new, minus anything `.gitignore`
// excludes (dependencies, build output, local reference checkouts).
function findMarkdownFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "*.md"],
    { cwd: projectRoot, encoding: "utf8" },
  );

  return output
    .split("\0")
    .filter(Boolean)
    .map((file) => path.join(projectRoot, file))
    .filter((file) => existsSync(file));
}

function destinationFrom(rawDestination) {
  const value = rawDestination.trim();

  if (value.startsWith("<")) {
    const closingBracket = value.indexOf(">");
    return closingBracket === -1 ? value : value.slice(1, closingBracket);
  }

  return value.split(/\s+/, 1)[0];
}

function isRelativeFileLink(destination) {
  return (
    destination.length > 0 &&
    !destination.startsWith("#") &&
    !destination.startsWith("/") &&
    !destination.startsWith("//") &&
    !/^[a-z][a-z\d+.-]*:/i.test(destination)
  );
}

function sourceLine(content, offset) {
  return content.slice(0, offset).split("\n").length;
}

const markdownFiles = findMarkdownFiles().sort();
const failures = [];

for (const markdownFile of markdownFiles) {
  const content = await readFile(markdownFile, "utf8");

  for (const match of content.matchAll(markdownLinkPattern)) {
    const destination = destinationFrom(match[1]);
    if (!isRelativeFileLink(destination)) continue;

    const pathWithoutFragment = destination.split("#", 1)[0].split("?", 1)[0];
    let decodedPath;

    try {
      decodedPath = decodeURIComponent(pathWithoutFragment);
    } catch {
      failures.push({
        file: markdownFile,
        line: sourceLine(content, match.index),
        destination,
        reason: "invalid URL encoding",
      });
      continue;
    }

    const resolvedPath = path.resolve(path.dirname(markdownFile), decodedPath);
    if (!existsSync(resolvedPath)) {
      failures.push({
        file: markdownFile,
        line: sourceLine(content, match.index),
        destination,
        reason: "target does not exist",
      });
    }
  }
}

if (failures.length > 0) {
  console.error("Documentation link validation failed:");
  for (const failure of failures) {
    console.error(
      `- ${path.relative(projectRoot, failure.file)}:${failure.line} ${failure.destination} (${failure.reason})`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(`Documentation links valid in ${markdownFiles.length} Markdown files.`);
}
