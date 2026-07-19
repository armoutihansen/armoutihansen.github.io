import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { professionalRecord } from "../src/data/professional-record.ts";

export const TYPST_VERSION = "0.15.1";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const source = "cv/cv.typ";
const fontPath = "cv/fonts";
const committedPdf = join(repositoryRoot, "static/CV_JAH.pdf");

function assertTypstVersion(): void {
  const result = spawnSync("typst", ["--version"], { encoding: "utf8" });
  if (result.error) {
    throw new Error(`Typst ${TYPST_VERSION} is required: ${result.error.message}`);
  }
  const actual = result.stdout.trim();
  if (
    result.status !== 0 ||
    !new RegExp(`^typst ${TYPST_VERSION.replaceAll(".", "\\.")}(?:\\s|$)`).test(actual)
  ) {
    throw new Error(`Typst ${TYPST_VERSION} is required; found ${actual || "unknown"}`);
  }
}

export function renderCv(output: string): void {
  // Importing this value parses the same strict record interface Astro consumes.
  void professionalRecord;
  assertTypstVersion();

  const result = spawnSync(
    "typst",
    ["compile", "--root", repositoryRoot, "--font-path", fontPath, source, output],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: { ...process.env, SOURCE_DATE_EPOCH: "0" }
    }
  );
  if (result.status !== 0) {
    throw new Error(`Typst compilation failed:\n${result.stderr || result.stdout}`);
  }
}

export function assertCurrentCv(expected = committedPdf): void {
  if (!existsSync(expected)) {
    throw new Error(`Committed CV PDF is missing: ${expected}`);
  }
  const directory = mkdtempSync(join(tmpdir(), "professional-record-cv-"));
  try {
    const generated = join(directory, "CV_JAH.pdf");
    renderCv(generated);
    if (!readFileSync(generated).equals(readFileSync(expected))) {
      throw new Error(
        "Committed CV PDF is stale. Run `npm run cv:build` and commit static/CV_JAH.pdf."
      );
    }
  } finally {
    rmSync(directory, { recursive: true });
  }
}

function writeCurrentCv(): void {
  const directory = mkdtempSync(join(tmpdir(), "professional-record-cv-"));
  try {
    const generated = join(directory, "CV_JAH.pdf");
    renderCv(generated);
    copyFileSync(generated, committedPdf);
  } finally {
    rmSync(directory, { recursive: true });
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  try {
    if (process.argv.includes("--write")) {
      writeCurrentCv();
      console.log(`Wrote deterministic CV with Typst ${TYPST_VERSION}.`);
    } else {
      assertCurrentCv();
      console.log(`Verified deterministic CV with Typst ${TYPST_VERSION}.`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
