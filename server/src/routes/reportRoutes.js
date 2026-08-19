import { Router } from "express";

export const createReportRouter = (graph) => {
  const router = Router();

  /**
   * GET /health
   * Health check endpoint to verify service availability.
   */
  router.get("/health", (req, res) => {
    res.status(200).json({
      status: "UP",
      service: "GitHub Repository Report Generator",
      timestamp: new Date().toISOString()
    });
  });

  /**
   * POST /api/report
   * Triggers the LangGraph workflow to generate a report for the specified GitHub repository.
   * Body parameters:
   *   - repo_url (or input_url): String - GitHub repository URL
   */
  router.post("/api/report", async (req, res) => {
    try {
      const url = req.body.repo_url || req.body.input_url;

      if (!url || typeof url !== "string" || !url.trim()) {
        return res.status(400).json({
          success: false,
          error: "Missing required parameter 'repo_url' or 'input_url' in request body."
        });
      }

      console.log(`\n[API Request] Generating report for repository: ${url}`);

      const result = await graph.invoke({
        input_url: url.trim(),
      });

      // Enrich report object with key metadata from final graph state
      const enrichedReport = {
        ...result.report,
        repository: {
          owner: result.owner || result.report?.repository?.owner || "",
          name: result.repo || result.report?.repository?.name || ""
        },
        analyzed_files_count: result.filtered_files?.length || 0,
        analyzed_files: result.filtered_files || []
      };

      return res.status(200).json({
        success: true,
        report: enrichedReport
      });
    } catch (error) {
      console.error("[API Error] Failed to generate report:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "An internal server error occurred while generating the report."
      });
    }
  });

  return router;
};
