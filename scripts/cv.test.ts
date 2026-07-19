import { afterAll, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertCurrentCv, renderCv, TYPST_VERSION } from "./cv";

const testDirectory = mkdtempSync(join(tmpdir(), "professional-record-cv-test-"));
afterAll(() => rmSync(testDirectory, { recursive: true }));

describe("verified CV build", () => {
  it("renders deterministic bytes with the pinned Typst version", () => {
    expect(TYPST_VERSION).toBe("0.15.1");
    const first = join(testDirectory, "first.pdf");
    const second = join(testDirectory, "second.pdf");

    renderCv(first);
    renderCv(second);

    expect(readFileSync(first)).toEqual(readFileSync(second));
  });

  it("rejects a stale committed PDF", () => {
    const stale = join(testDirectory, "stale.pdf");
    writeFileSync(stale, "not the generated CV");

    expect(() => assertCurrentCv(stale)).toThrow(/stale/i);
  });
});
