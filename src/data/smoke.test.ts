import { describe, expect, it } from "vitest";

// Trivial smoke test proving the Vitest harness runs headlessly.
// Future data-layer tests live alongside this file in src/data/.
describe("test harness", () => {
  it("runs and evaluates a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });
});
