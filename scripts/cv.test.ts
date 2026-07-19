import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertCurrentCv, inspectCvBaseline, renderCv, TYPST_VERSION } from "./cv";

const testDirectory = mkdtempSync(join(tmpdir(), "professional-record-cv-test-"));
afterAll(() => rmSync(testDirectory, { recursive: true }));

describe("verified CV build", () => {
  it("uses one machine-readable Typst version source", () => {
    const workflow = readFileSync(
      join(process.cwd(), ".github/workflows/deploy.yml"),
      "utf8"
    );
    const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");

    expect(workflow).toContain("typst-versions-file: cv/typst-versions.json");
    expect(workflow).not.toContain("typst-version:");
    expect(readme).not.toContain(TYPST_VERSION);
  });

  it("renders deterministic bytes with the pinned Typst version", () => {
    const versionSource = JSON.parse(
      readFileSync(join(process.cwd(), "cv/typst-versions.json"), "utf8")
    );
    expect(TYPST_VERSION).toBe(versionSource.typst.version);
    const first = join(testDirectory, "first.pdf");
    const second = join(testDirectory, "second.pdf");

    renderCv(first);
    renderCv(second);

    expect(readFileSync(first)).toEqual(readFileSync(second));
  });

  it("preserves the approved experience text and two-page rendered layout", () => {
    const output = join(testDirectory, "baseline.pdf");
    renderCv(output);

    expect(inspectCvBaseline(output)).toEqual({
      pages: 2,
      pageSize: "A4",
      renderedPages: 2
    });
  });

  it("rejects a stale committed PDF", () => {
    const stale = join(testDirectory, "stale.pdf");
    writeFileSync(stale, "not the generated CV");

    expect(() => assertCurrentCv(stale)).toThrow(/stale/i);
  });
});
