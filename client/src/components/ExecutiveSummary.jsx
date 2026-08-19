import React from "react";
import { FileText } from "lucide-react";

export const ExecutiveSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <section className="bg-[#FFFFFF] border-brutal-lg p-6 sm:p-8 shadow-brutal-lg space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
          <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5">01</span>
          <span>EXECUTIVE SUMMARY</span>
        </div>
        <FileText className="w-4 h-4 text-[#0A0A0A]" />
      </div>

      <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A]">
        EXECUTIVE SUMMARY
      </h3>

      <div className="bg-[#F5F3EC] border-brutal p-5 text-base sm:text-lg leading-relaxed text-[#0A0A0A] font-sans font-medium">
        {summary}
      </div>
    </section>
  );
};
