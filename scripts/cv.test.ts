import { afterAll, describe, expect, it } from "vitest";
import {
  appendFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertCurrentCv, inspectCvBaseline, renderCv, TYPST_VERSION } from "./cv";

const testDirectory = mkdtempSync(join(tmpdir(), "professional-record-cv-test-"));
const brokenEducationSource = `cv/.education-selection-test-${process.pid}.typ`;
const brokenTeachingSource = `cv/.teaching-selection-test-${process.pid}.typ`;
const duplicateTeachingSource = `cv/.teaching-duplicate-test-${process.pid}.typ`;
const brokenSkillSource = `cv/.skill-selection-test-${process.pid}.typ`;
const duplicateSkillSource = `cv/.skill-duplicate-test-${process.pid}.typ`;
const brokenLanguageSource = `cv/.language-selection-test-${process.pid}.typ`;
const duplicateLanguageSource = `cv/.language-duplicate-test-${process.pid}.typ`;
const brokenPublicationSource = `cv/.publication-selection-test-${process.pid}.typ`;
const duplicatePublicationSource = `cv/.publication-duplicate-test-${process.pid}.typ`;
const brokenProjectSource = `cv/.project-selection-test-${process.pid}.typ`;
const duplicateProjectSource = `cv/.project-duplicate-test-${process.pid}.typ`;
const brokenProjectToolSource = `cv/.project-tool-test-${process.pid}.typ`;
const duplicateProjectToolSource = `cv/.project-tool-duplicate-test-${process.pid}.typ`;
afterAll(() => {
  rmSync(testDirectory, { recursive: true });
  rmSync(join(process.cwd(), brokenEducationSource), { force: true });
  rmSync(join(process.cwd(), brokenTeachingSource), { force: true });
  rmSync(join(process.cwd(), duplicateTeachingSource), { force: true });
  rmSync(join(process.cwd(), brokenSkillSource), { force: true });
  rmSync(join(process.cwd(), duplicateSkillSource), { force: true });
  rmSync(join(process.cwd(), brokenLanguageSource), { force: true });
  rmSync(join(process.cwd(), duplicateLanguageSource), { force: true });
  rmSync(join(process.cwd(), brokenPublicationSource), { force: true });
  rmSync(join(process.cwd(), duplicatePublicationSource), { force: true });
  rmSync(join(process.cwd(), brokenProjectSource), { force: true });
  rmSync(join(process.cwd(), duplicateProjectSource), { force: true });
  rmSync(join(process.cwd(), brokenProjectToolSource), { force: true });
  rmSync(join(process.cwd(), duplicateProjectToolSource), { force: true });
});

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

  it("preserves the approved record text and two-page rendered layout", () => {
    const output = join(testDirectory, "baseline.pdf");
    renderCv(output);

    expect(inspectCvBaseline(output)).toEqual({
      pages: 2,
      pageSize: "A4",
      renderedPages: 2
    });
  });

  it("rejects byte drift from the immutable approved PDF", () => {
    const modified = join(testDirectory, "byte-drift.pdf");
    renderCv(modified);
    appendFileSync(modified, "\n");

    expect(() => inspectCvBaseline(modified)).toThrow(/approved PDF SHA-256/);
  });

  it("rejects a stale committed PDF", () => {
    const stale = join(testDirectory, "stale.pdf");
    writeFileSync(stale, "not the generated CV");

    expect(() => assertCurrentCv(stale)).toThrow(/stale/i);
  });

  it("rejects an unknown selected education identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      '"cologne-economics-phd",',
      '"unknown-education",'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenEducationSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "broken-education.pdf"), brokenEducationSource)
    ).toThrow(/Unknown Professional record education id: unknown-education/);
  });

  it("rejects an unknown selected teaching identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      '"current-topics-microeconomics",',
      '"unknown-teaching-course",'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenTeachingSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "broken-teaching.pdf"), brokenTeachingSource)
    ).toThrow(
      /Unknown Professional record teaching course id: unknown-teaching-course/
    );
  });

  it("rejects duplicate selected teaching identifiers", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      'id: "applied-microeconomics-management-research-module"',
      'id: "current-topics-microeconomics"'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicateTeachingSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "duplicate-teaching.pdf"), duplicateTeachingSource)
    ).toThrow(
      /Duplicate CV teaching selection id/
    );
  });

  it("rejects an unknown selected skill identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      'ids: ("python", "r", "sql", "stata", "typescript")',
      'ids: ("unknown-skill", "r", "sql", "stata", "typescript")'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenSkillSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "broken-skill.pdf"), brokenSkillSource)
    ).toThrow(/Unknown Professional record skill id: unknown-skill/);
  });

  it("rejects duplicate selected skill identifiers", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace('"r",', '"python",');
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicateSkillSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "duplicate-skill.pdf"), duplicateSkillSource)
    ).toThrow(/Duplicate CV skill selection id/);
  });

  it("rejects an unknown selected spoken-language identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace('"english",', '"unknown-language",');
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenLanguageSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "broken-language.pdf"), brokenLanguageSource)
    ).toThrow(/Unknown Professional record spoken language id: unknown-language/);
  });

  it("rejects duplicate selected spoken-language identifiers", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace('"german",', '"english",');
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicateLanguageSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "duplicate-language.pdf"), duplicateLanguageSource)
    ).toThrow(/Duplicate CV spoken-language selection id/);
  });

  it("selects publications by stable identifier without owning factual strings", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    expect(source).toContain('"efficiency-wages-motivated-agents"');
    expect(source).not.toContain("Efficiency Wages with Motivated Agents");
    expect(source).not.toContain("J. Armouti-Hansen");
  });

  it("rejects an unknown selected publication identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      '"efficiency-wages-motivated-agents",',
      '"unknown-publication",'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenPublicationSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "broken-publication.pdf"), brokenPublicationSource)
    ).toThrow(/Unknown Professional record publication id: unknown-publication/);
  });

  it("rejects duplicate selected publication identifiers", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace(
      '"managing-anticipation-reference-dependent-choice",',
      '"efficiency-wages-motivated-agents",'
    );
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicatePublicationSource), broken);

    expect(() =>
      renderCv(join(testDirectory, "duplicate-publication.pdf"), duplicatePublicationSource)
    ).toThrow(/Duplicate CV publication selection id/);
  });

  it("selects projects by stable identifier without owning record facts", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    expect(source).toContain('id: "citibike-demand-risk-net-flow"');
    expect(source).toContain('id: "rag-search-engine"');
    expect(source).not.toContain('tag: "Operational analysis"');
    expect(source).not.toContain('title: "RAG Search Engine"');
  });

  it("rejects unknown and duplicate selected project identifiers", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const unknown = source.replace(
      'id: "citibike-demand-risk-net-flow"',
      'id: "unknown-project"'
    );
    expect(unknown).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenProjectSource), unknown);
    expect(() =>
      renderCv(join(testDirectory, "broken-project.pdf"), brokenProjectSource)
    ).toThrow(/Unknown Professional record selected work id: unknown-project/);

    const duplicate = source.replace(
      'id: "informativeness-frequency-report-scoring-rules"',
      'id: "citibike-demand-risk-net-flow"'
    );
    expect(duplicate).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicateProjectSource), duplicate);
    expect(() =>
      renderCv(join(testDirectory, "duplicate-project.pdf"), duplicateProjectSource)
    ).toThrow(/Duplicate CV selected work id/);
  });

  it("rejects an unknown selected project tool identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace('"pandas", "geopandas"', '"unknown-tool", "geopandas"');
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), brokenProjectToolSource), broken);
    expect(() =>
      renderCv(join(testDirectory, "broken-project-tool.pdf"), brokenProjectToolSource)
    ).toThrow(/Unknown selected work tool id: unknown-tool/);
  });

  it("rejects a duplicate selected project tool identifier", () => {
    const source = readFileSync(join(process.cwd(), "cv/cv.typ"), "utf8");
    const broken = source.replace('"python", "pandas", "geopandas"', '"python", "python", "geopandas"');
    expect(broken).not.toBe(source);
    writeFileSync(join(process.cwd(), duplicateProjectToolSource), broken);
    expect(() =>
      renderCv(join(testDirectory, "duplicate-project-tool.pdf"), duplicateProjectToolSource)
    ).toThrow(/Duplicate CV selected work tool id/);
  });
});
