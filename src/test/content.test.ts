import { describe, expect, it } from "vitest";
import { pages } from "../content/pages";

describe("decision-support content", () => {
  it("keeps each guide useful, explicit and evidence-linked", () => {
    for (const page of pages) {
      expect(page.decision.summary.length).toBeGreaterThan(120);
      expect(page.decision.checks).toHaveLength(3);
      expect(page.decision.action.length).toBeGreaterThan(80);
      expect(page.sections.length).toBeGreaterThanOrEqual(3);
      expect(page.sources.length).toBeGreaterThanOrEqual(3);
      expect(page.sources.every((source) => source.context.length > 60)).toBe(true);
      expect(
        page.sources.every((source) => {
          const host = new URL(source.url).hostname;
          return host === "www.hse.gov.uk" || host === "training.hse.gov.uk" || host === "www.legislation.gov.uk";
        }),
      ).toBe(true);
    }
  });

  it("uses unique public routes and source URLs within each guide", () => {
    expect(new Set(pages.map((page) => page.path)).size).toBe(pages.length);
    for (const page of pages) {
      expect(new Set(page.sources.map((source) => source.url)).size).toBe(page.sources.length);
    }
  });
});
