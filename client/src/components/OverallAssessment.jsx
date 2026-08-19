import React from "react";
import { Award, CheckCircle2 } from "lucide-react";

export const OverallAssessment = ({ assessment }) => {
  if (!assessment) return null;

  return (
    <section className="bg-[#0A0A0A] text-[#F5F3EC] border-brutal-lg p-6 sm:p-8 shadow-brutal-lg space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#333] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#C8FF00] uppercase">
          <span className="bg-[#C8FF00] text-[#0A0A0A] px-2 py-0.5 font-bold">06</span>
          <span>OVERALL ASSESSMENT</span>
        </div>
        <Award className="w-4 h-4 text-[#C8FF00]" />
      </div>

      <h3 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#F5F3EC]">
        FINAL OVERALL ASSESSMENT
      </h3>

      <div className="bg-[#141414] border border-[#333] p-6 text-base sm:text-lg leading-relaxed text-[#F5F3EC] font-sans font-medium space-y-4">
        <div className="flex items-center gap-2 text-[#C8FF00] font-mono text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>SYNTHESIZED EVALUATION CONCLUSION</span>
        </div>
        <p className="text-[#E0E0E0]">{assessment}</p>
      </div>
    </section>
  );
};
