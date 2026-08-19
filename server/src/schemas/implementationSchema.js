import * as z from "zod";

export const implementationSchema = z.object({
  technologies: z.array(
    z.object({
      name: z.string(),
      purpose: z.string(),
    })
  ),

  important_components: z.array(
    z.object({
      name: z.string(),
      purpose: z.string(),
      files: z.array(z.string()),
    })
  ),

  implementation_details: z.array(z.string()),

  data_flow: z.array(z.string()),
});
