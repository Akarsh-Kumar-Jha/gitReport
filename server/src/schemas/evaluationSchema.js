import * as z from "zod";

export const evaluationSchema = z.object({
  strengths: z.array(
    z.object({
      area: z.string(),
      observation: z.string(),
    })
  ),

  issues: z.array(
    z.object({
      severity: z.enum(["high", "medium", "low"]),
      area: z.string(),
      issue: z.string(),
      evidence: z.array(z.string()),
    })
  ),

  recommendations: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      recommendation: z.string(),
    })
  ),

  overall_assessment: z.string(),
});
