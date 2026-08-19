import * as z from "zod";

export const finalReportSchema = z.object({
  repository: z.object({
    owner: z.string(),
    name: z.string(),
  }),

  executive_summary: z.string(),

  architecture: z.object({
    overview: z.string(),
    style: z.string(),
    major_modules: z.array(z.string()),
    key_observations: z.array(z.string()),
  }),

  implementation: z.object({
    technologies: z.array(z.string()),
    important_components: z.array(z.string()),
    key_implementation_details: z.array(z.string()),
  }),

  findings: z
    .array(
      z.object({
        severity: z.enum(["high", "medium", "low"]),
        category: z.enum([
          "architecture",
          "code_quality",
          "dependencies",
          "reliability",
          "security",
          "maintainability",
          "performance",
        ]),
        finding: z.string(),
        evidence: z.array(z.string()),
        recommendation: z.string(),
      })
    )
    .max(7),

  recommendations: z
    .array(
      z.object({
        priority: z.enum(["high", "medium", "low"]),
        recommendation: z.string(),
      })
    )
    .max(7),

  overall_assessment: z.string(),
});
