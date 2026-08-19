import React from "react";
import { Layers, Box, CheckSquare } from "lucide-react";

export const ArchitectureSection = ({ architecture }) => {
  if (!architecture) return null;

  const { overview, style, major_modules, key_observations } = architecture;

  return (
    <section className="bg-[#FFFFFF] border-brutal-lg p-4 sm:p-8 shadow-brutal-lg space-y-6 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
          <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5">02</span>
          <span>ARCHITECTURE</span>
        </div>
        <Layers className="w-4 h-4 text-[#0A0A0A]" />
      </div>

      <h3 className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A]">
        SYSTEM ARCHITECTURE
      </h3>

      {/* Style & Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        {/* Style Banner */}
        <div className="bg-[#0A0A0A] text-[#F5F3EC] border-brutal p-4 sm:p-5 flex flex-col justify-between shadow-brutal-sm min-w-0">
          <div>
            <span className="font-mono text-[10px] text-[#C8FF00] uppercase font-bold tracking-wider">
              ARCHITECTURAL STYLE
            </span>
            <p className="font-display font-bold text-lg sm:text-xl uppercase mt-2 text-[#C8FF00] break-words">
              {style || "Modular Architecture"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#333] text-xs font-mono text-[#5F5F5F]">
            PATTERN TYPE IDENTIFIED
          </div>
        </div>

        {/* Overview Description */}
        <div className="md:col-span-2 bg-[#F5F3EC] border-brutal p-4 sm:p-5 flex flex-col justify-center min-w-0">
          <span className="font-mono text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-2">
            ARCHITECTURE OVERVIEW
          </span>
          <p className="text-xs sm:text-base text-[#0A0A0A] leading-relaxed break-words">
            {overview}
          </p>
        </div>
      </div>

      {/* Major Modules - Numbered Editorial List */}
      {major_modules && major_modules.length > 0 && (
        <div className="space-y-3 pt-2 min-w-0">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
            <Box className="w-4 h-4 text-[#0A0A0A]" />
            <span>MAJOR MODULES ({major_modules.length})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-0">
            {major_modules.map((moduleName, idx) => (
              <div key={idx} className="bg-[#FFFFFF] border-brutal p-3 sm:p-3.5 flex items-start gap-2.5 shadow-brutal-sm min-w-0 overflow-hidden">
                <span className="bg-[#0A0A0A] text-[#C8FF00] font-mono font-bold text-xs px-2 py-0.5 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs font-bold text-[#0A0A0A] min-w-0 break-all leading-tight">
                  {moduleName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Observations */}
      {key_observations && key_observations.length > 0 && (
        <div className="space-y-3 pt-2 min-w-0">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#0A0A0A]" />
            <span>KEY OBSERVATIONS</span>
          </h4>

          <div className="space-y-2 min-w-0">
            {key_observations.map((obs, idx) => (
              <div key={idx} className="bg-[#F5F3EC] border-brutal p-3 sm:p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-[#0A0A0A] min-w-0">
                <span className="text-[#0A0A0A] font-bold font-mono shrink-0 mt-0.5">✦</span>
                <p className="leading-snug min-w-0 break-words">{obs}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
