import React from "react";
import { ReportHeader } from "./ReportHeader.jsx";
import { ExecutiveSummary } from "./ExecutiveSummary.jsx";
import { ArchitectureSection } from "./ArchitectureSection.jsx";
import { ImplementationSection } from "./ImplementationSection.jsx";
import { FindingsSection } from "./FindingsSection.jsx";
import { RecommendationsSection } from "./RecommendationsSection.jsx";
import { OverallAssessment } from "./OverallAssessment.jsx";

export const Report = ({ report, onReset }) => {
  if (!report) return null;

  return (
    <div id="report-section" className="w-full max-w-4xl space-y-8 pt-8 border-t-4 border-[#0A0A0A] mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* 00 - Report Header */}
      <ReportHeader report={report} onReset={onReset} />

      {/* 01 - Executive Summary */}
      <ExecutiveSummary summary={report.executive_summary} />

      {/* 02 - Architecture */}
      <ArchitectureSection architecture={report.architecture} />

      {/* 03 - Implementation */}
      <ImplementationSection implementation={report.implementation} />

      {/* 04 - Evaluation / Findings */}
      <FindingsSection findings={report.findings} />

      {/* 05 - Recommendations */}
      <RecommendationsSection recommendations={report.recommendations} />

      {/* 06 - Overall Assessment */}
      <OverallAssessment assessment={report.overall_assessment} />
    </div>
  );
};
