import { describe, expect, it } from "vitest";
import github from "./github.json";

describe("GitHub activity snapshot", () => {
  it("contains activity data without duplicating professional-link facts", () => {
    expect(github).not.toHaveProperty("url");
    expect(github).not.toHaveProperty("user");
  });
});
