import React from "react";
import { Target, ExternalLink } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full bg-[#0A0A0A] text-[#F5F3EC] border-b-4 border-[#0A0A0A] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-40">
      {/* Left branding & Portfolio link */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#C8FF00] text-[#0A0A0A] p-1 border border-[#F5F3EC] shrink-0">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base sm:text-lg tracking-wider leading-none text-[#F5F3EC]">
              REPOLENS
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-[#C8FF00] uppercase mt-0.5 hidden xs:block">
              AI-POWERED REPOSITORY ANALYZER
            </span>
          </div>
        </div>

        {/* High-visibility Portfolio Badge in NavBar */}
        <a
          href="https://www.akarshjha.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C8FF00] hover:bg-[#b8eb00] text-[#0A0A0A] font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border border-[#0A0A0A] inline-flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-brutal-sm"
          title="Visit Akarsh's Portfolio (https://www.akarshjha.dev/)"
        >
          <span>BY AKARSH</span>
          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
        </a>
      </div>

      {/* Right status metadata */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <div className="hidden md:flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse"></span>
          <span className="text-[#F5F3EC] text-[10px] tracking-wider uppercase">PUBLIC REPO ANALYSIS</span>
        </div>

        <div className="bg-[#1A1A1A] text-[#C8FF00] font-bold px-2 py-0.5 border border-[#333] text-[11px] sm:text-xs shrink-0">
          v1.0
        </div>
      </div>
    </header>
  );
};
