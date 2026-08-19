import React from "react";
import { Compass } from "lucide-react";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center gap-2 sm:gap-2.5 max-w-3xl px-2">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#C8FF00] text-[#0A0A0A] border-brutal px-2.5 py-1 text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase">
        <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>ANALYZE ANY PUBLIC REPOSITORY</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter text-[#0A0A0A] uppercase leading-[0.95]">
        UNDERSTAND <br />
        <span className="bg-[#0A0A0A] text-[#F5F3EC] px-2 py-0.5 inline-block my-1 shadow-brutal-sm">
          ANY CODEBASE.
        </span> <br />
        IN MINUTES.
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-base text-[#5F5F5F] font-sans font-medium max-w-md sm:max-w-lg leading-normal sm:leading-relaxed">
        CodeScope analyzes the structure, architecture, implementation, and quality of any public GitHub repository and delivers actionable insights in 1–2 minutes.
      </p>
    </div>
  );
};
