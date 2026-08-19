import * as z from "zod";

export const architectureSchema = z.object({
  overview: z.string(),

  style: z.string(),

  components: z.array(
    z.object({
      name: z.string(),
      responsibility: z.string(),
      files: z.array(z.string()),
    })
  ),

  flow: z.array(z.string()),

  observations: z.array(z.string()),
});
