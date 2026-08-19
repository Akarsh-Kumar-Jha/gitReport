import React from "react";
import { AlertOctagon, FileCode, CheckCircle } from "lucide-react";

export const FindingsSection = ({ findings }) => {
  if (!findings || findings.length === 0) return null;

  const getSeverityBadge = (severity) => {
    const sev = (severity || "").toLowerCase();
    if (sev === "high") {
      return "bg-[#0A0A0A] text-[#FF4D4D] border-2 border-[#FF4D4D]";
    } else if (sev === "medium") {
      return "bg-[#0A0A0A] text-[#FFCC00] border-2 border-[#FFCC00]";
    }
    return "bg-[#0A0A0A] text-[#C8FF00] border-2 border-[#C8FF00]";
  };

  return (
    <section className="bg-[#FFFFFF] border-brutal-lg p-4 sm:p-8 shadow-brutal-lg space-y-6 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
          <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5">04</span>
          <span>EVALUATION / FINDINGS</span>
        </div>
        <AlertOctagon className="w-4 h-4 text-[#0A0A0A]" />
      </div>

      <h3 className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A]">
        TECHNICAL FINDINGS ({findings.length})
      </h3>

      <div className="space-y-4 min-w-0">
        {findings.map((item, idx) => {
          const { severity, category, finding, evidence, recommendation } = item;

          return (
            <div key={idx} className="bg-[#F5F3EC] border-brutal p-4 sm:p-5 space-y-3.5 shadow-brutal-sm min-w-0 overflow-hidden">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0A0A0A]/20 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-mono font-bold text-xs px-2.5 py-0.5 uppercase tracking-wider ${getSeverityBadge(severity)}`}>
                    {severity} SEVERITY
                  </span>
                  {category && (
                    <span className="bg-[#0A0A0A] text-[#F5F3EC] font-mono text-[11px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {category}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-[#5F5F5F] font-bold">
                  FINDING #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Finding Title/Description */}
              <div className="min-w-0">
                <h4 className="font-sans font-bold text-sm sm:text-base text-[#0A0A0A] leading-snug break-words">
                  {finding}
                </h4>
              </div>

              {/* Evidence File Paths */}
              {evidence && evidence.length > 0 && (
                <div className="bg-[#0A0A0A] text-[#F5F3EC] p-3 border border-[#0A0A0A] space-y-1.5 font-mono text-xs min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[#C8FF00] font-bold text-[10px] tracking-wider uppercase">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span>FILE EVIDENCE</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 min-w-0">
                    {evidence.map((path, pIdx) => (
                      <span key={pIdx} className="bg-[#1A1A1A] border border-[#333] text-[#C8FF00] px-2 py-0.5 font-mono text-xs break-all max-w-full">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Recommendation */}
              {recommendation && (
                <div className="bg-[#FFFFFF] border-brutal p-3 flex items-start gap-2 text-xs font-sans min-w-0">
                  <CheckCircle className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-[#0A0A0A] uppercase tracking-wider block text-[10px]">
                      RECOMMENDED ACTION
                    </span>
                    <p className="text-[#0A0A0A] font-medium mt-0.5 break-words">{recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
