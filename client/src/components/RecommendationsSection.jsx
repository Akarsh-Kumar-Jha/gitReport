import React from "react";
import { CheckSquare } from "lucide-react";

export const RecommendationsSection = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  const getPriorityStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") {
      return "bg-[#0A0A0A] text-[#FF4D4D] border border-[#FF4D4D]";
    } else if (p === "medium") {
      return "bg-[#0A0A0A] text-[#FFCC00] border border-[#FFCC00]";
    }
    return "bg-[#0A0A0A] text-[#C8FF00] border border-[#C8FF00]";
  };

  return (
    <section className="bg-[#FFFFFF] border-brutal-lg p-6 sm:p-8 shadow-brutal-lg space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
          <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5">05</span>
          <span>RECOMMENDATIONS</span>
        </div>
        <CheckSquare className="w-4 h-4 text-[#0A0A0A]" />
      </div>

      <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A]">
        ACTIONABLE RECOMMENDATIONS
      </h3>

      <div className="space-y-3">
        {recommendations.map((item, idx) => {
          const recText = typeof item === 'string' ? item : item.recommendation;
          const priority = typeof item === 'object' ? item.priority : 'MEDIUM';

          return (
            <div key={idx} className="bg-[#F5F3EC] border-brutal p-4 flex items-start gap-4 shadow-brutal-sm">
              <span className="bg-[#0A0A0A] text-[#C8FF00] font-mono font-bold text-sm px-2.5 py-1 shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${getPriorityStyle(priority)}`}>
                    {priority} PRIORITY
                  </span>
                </div>
                <p className="font-sans text-sm sm:text-base font-semibold text-[#0A0A0A] pt-0.5">
                  {recText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
