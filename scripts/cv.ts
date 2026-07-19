import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  statSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { professionalRecord } from "../src/data/professional-record.ts";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const source = "cv/cv.typ";
const fontPath = "cv/fonts";
const committedPdf = join(repositoryRoot, "static/CV_JAH.pdf");
const versionSource = JSON.parse(
  readFileSync(join(repositoryRoot, "cv/typst-versions.json"), "utf8")
) as { typst?: { version?: unknown } };
if (typeof versionSource.typst?.version !== "string") {
  throw new Error("cv/typst-versions.json must define typst.version");
}
export const TYPST_VERSION = versionSource.typst.version;

interface CvBaseline {
  pages: number;
  pageSize: string;
  experiencePage: number;
  page1LastEntry: string;
  page2FirstEntry: string;
  experienceText: string[];
}

const cvBaseline = JSON.parse(
  readFileSync(join(repositoryRoot, "cv/cv-baseline.json"), "utf8")
) as CvBaseline;

function commandOutput(command: string, args: string[]): string {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.error) {
    throw new Error(`${command} is required for CV verification: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${command} failed:\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

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

export function inspectCvBaseline(pdf: string): {
  pages: number;
  pageSize: string;
  renderedPages: number;
} {
  const info = commandOutput("pdfinfo", [pdf]);
  const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1]);
  const pageSize = info.match(/^Page size:.*\(([^)]+)\)$/m)?.[1] ?? "unknown";
  if (pages !== cvBaseline.pages || pageSize !== cvBaseline.pageSize) {
    throw new Error(
      `CV layout drifted: expected ${cvBaseline.pages} ${cvBaseline.pageSize} pages, found ${pages} ${pageSize}`
    );
  }

  const extractedPages = commandOutput("pdftotext", ["-layout", pdf, "-"])
    .split("\f")
    .map(normalized)
    .filter(Boolean);
  if (extractedPages.length !== cvBaseline.pages) {
    throw new Error(
      `CV text extraction found ${extractedPages.length} pages; expected ${cvBaseline.pages}`
    );
  }

  const experiencePage = extractedPages[cvBaseline.experiencePage - 1];
  let position = 0;
  for (const expected of cvBaseline.experienceText.map(normalized)) {
    const next = experiencePage.indexOf(expected, position);
    if (next < 0) {
      throw new Error(`CV experience baseline drifted at: ${expected}`);
    }
    position = next + expected.length;
  }
  if (!extractedPages[0].includes(cvBaseline.page1LastEntry)) {
    throw new Error(`CV page 1 no longer contains: ${cvBaseline.page1LastEntry}`);
  }
  if (!extractedPages[1].includes(cvBaseline.page2FirstEntry)) {
    throw new Error(`CV page 2 no longer starts with: ${cvBaseline.page2FirstEntry}`);
  }

  const renderDirectory = mkdtempSync(join(tmpdir(), "professional-record-cv-render-"));
  let renderedPages = 0;
  try {
    commandOutput("pdftoppm", ["-png", "-r", "72", pdf, join(renderDirectory, "page")]);
    const rendered = readdirSync(renderDirectory).filter((file) => file.endsWith(".png"));
    renderedPages = rendered.filter(
      (file) => statSync(join(renderDirectory, file)).size > 0
    ).length;
  } finally {
    rmSync(renderDirectory, { recursive: true });
  }
  if (renderedPages !== cvBaseline.pages) {
    throw new Error(
      `CV render produced ${renderedPages} non-empty pages; expected ${cvBaseline.pages}`
    );
  }

  return { pages, pageSize, renderedPages };
}

export function assertCurrentCv(expected = committedPdf): void {
  if (!existsSync(expected)) {
    throw new Error(`Committed CV PDF is missing: ${expected}`);
  }
  const directory = mkdtempSync(join(tmpdir(), "professional-record-cv-"));
  try {
    const generated = join(directory, "CV_JAH.pdf");
    renderCv(generated);
    inspectCvBaseline(generated);
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
    inspectCvBaseline(generated);
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
