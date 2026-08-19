import * as z from "zod";

export const filter_schema = z.object({
  filtered_files: z
    .array(z.string())
    .max(15)
    .describe(
      "Select at most 15 files that provide the most useful understanding of the repository."
    ),
});
