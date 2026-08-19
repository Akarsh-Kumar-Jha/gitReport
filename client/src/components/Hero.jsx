import React from "react";
import { Compass } from "lucide-react";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2 max-w-3xl px-2">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#C8FF00] text-[#0A0A0A] border-brutal px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase">
        <Compass className="w-3 h-3 stroke-[2.5]" />
        <span>ANALYZE ANY PUBLIC REPOSITORY</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter text-[#0A0A0A] uppercase leading-[0.95]">
        UNDERSTAND <br />
        <span className="bg-[#0A0A0A] text-[#F5F3EC] px-2 py-0.5 inline-block my-0.5 shadow-brutal-sm">
          ANY CODEBASE.
        </span> <br />
        IN MINUTES.
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#5F5F5F] font-sans font-medium max-w-md sm:max-w-lg leading-tight sm:leading-normal">
        RepoLens analyzes the structure, architecture, implementation, and quality of any public GitHub repository and delivers actionable insights in 1–2 minutes.
      </p>
    </div>
  );
};
