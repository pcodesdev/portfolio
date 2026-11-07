import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = ["."];
const SIGNATURES = [
  ["private-key material", /-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----/],
  ["GitHub access token", /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{40,}\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
];
const violations = [];

function scanDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (fs.statSync(absolutePath).isDirectory()) {
      if (!["node_modules", ".git", ".ssh"].includes(entry.name)) {
        scanDirectory(absolutePath);
      }
      continue;
    }
    const file = fs.readFileSync(absolutePath);
    if (file.length > 10 * 1024 * 1024 || file.includes(0)) continue;
    const content = file.toString("utf8");
    SIGNATURES.forEach(([label, pattern]) => {
      if (pattern.test(content)) {
        violations.push({ file: path.relative(ROOT, absolutePath), label });
      }
    });
  }
}

ROOTS.forEach((relativePath) => {
  const absolutePath = path.join(ROOT, relativePath);
  if (fs.existsSync(absolutePath)) scanDirectory(absolutePath);
});

if (violations.length) {
  violations.forEach(({ file, label }) => console.error(`Credential signature detected in ${file}: ${label}`));
  process.exitCode = 1;
} else {
  console.log("No common private-key or access-token signatures found in repository text or generated build files.");
}
