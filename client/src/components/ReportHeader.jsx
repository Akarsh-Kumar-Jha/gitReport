import React from "react";
import { RefreshCw, Download, FileText, CheckCircle2, GitFork, FileCode } from "lucide-react";

export const ReportHeader = ({ report, onReset }) => {
  const repositoryName = report?.repository ? `${report.repository.owner}/${report.repository.name}` : "Repository";

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `codescope_report_${report?.repository?.name || 'analysis'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#0A0A0A] text-[#F5F3EC] border-brutal-lg shadow-brutal-lg p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#333] pb-4 sm:pb-6">
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 text-[#C8FF00] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5" />
            <span>CODESCOPE TECHNICAL REPORT</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-3xl md:text-4xl uppercase tracking-tight text-[#F5F3EC] mt-1 break-all">
            {repositoryName}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="bg-[#C8FF00] hover:bg-[#b8eb00] text-[#0A0A0A] font-mono font-bold text-xs uppercase px-3 py-2 border-brutal hover-brutal flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RUN NEW ANALYSIS</span>
          </button>
          
          <button
            type="button"
            onClick={handleDownload}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F5F3EC] font-mono font-bold text-xs uppercase px-3 py-2 border border-[#444] hover-brutal flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span>DOWNLOAD JSON</span>
          </button>
        </div>
      </div>

      {/* Metadata Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-[#141414] border border-[#333] p-3">
          <span className="text-[#5F5F5F] uppercase block font-bold text-[10px] tracking-wider">ANALYZED FILES</span>
          <span className="text-lg sm:text-xl font-bold text-[#F5F3EC] mt-0.5 block">{report?.analyzed_files_count || report?.analyzed_files?.length || 15} FILES</span>
        </div>

        <div className="bg-[#141414] border border-[#333] p-3">
          <span className="text-[#5F5F5F] uppercase block font-bold text-[10px] tracking-wider">REPOSITORY</span>
          <div className="flex items-center gap-1.5 text-[#C8FF00] font-bold mt-0.5 text-xs sm:text-sm truncate">
            <GitFork className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{repositoryName}</span>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#333] p-3">
          <span className="text-[#5F5F5F] uppercase block font-bold text-[10px] tracking-wider">ANALYSIS STATUS</span>
          <div className="flex items-center gap-1.5 text-[#C8FF00] font-bold mt-0.5 text-xs sm:text-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Analyzed Source Files List */}
      {report?.analyzed_files && report.analyzed_files.length > 0 && (
        <div className="bg-[#141414] border border-[#333] p-3.5 space-y-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#C8FF00] font-bold text-[10px] tracking-wider uppercase">
            <FileCode className="w-3.5 h-3.5" />
            <span>ANALYZED SOURCE FILES ({report.analyzed_files.length})</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {report.analyzed_files.map((fileName, idx) => (
              <span key={idx} className="bg-[#1F1F1F] text-[#C8FF00] border border-[#444] px-2.5 py-1 font-mono text-[11px] font-medium">
                {fileName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
