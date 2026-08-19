import React from "react";
import { Cpu, Code2, Wrench } from "lucide-react";

export const ImplementationSection = ({ implementation }) => {
  if (!implementation) return null;

  const { technologies, important_components, key_implementation_details } = implementation;

  return (
    <section className="bg-[#FFFFFF] border-brutal-lg p-4 sm:p-8 shadow-brutal-lg space-y-6 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase">
          <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5">03</span>
          <span>IMPLEMENTATION</span>
        </div>
        <Cpu className="w-4 h-4 text-[#0A0A0A]" />
      </div>

      <h3 className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight text-[#0A0A0A]">
        TECHNICAL IMPLEMENTATION
      </h3>

      {/* Technologies Grid */}
      {technologies && technologies.length > 0 && (
        <div className="space-y-3 min-w-0">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#0A0A0A]" />
            <span>TECHNOLOGIES & STACK ({technologies.length})</span>
          </h4>

          <div className="flex flex-wrap gap-2 sm:gap-2.5 min-w-0">
            {technologies.map((tech, idx) => (
              <div key={idx} className="bg-[#0A0A0A] text-[#F5F3EC] border-brutal px-2.5 py-1.5 font-mono text-xs flex items-center gap-2 shadow-brutal-sm max-w-full min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#C8FF00] shrink-0"></span>
                <span className="font-bold text-[#C8FF00] break-all">
                  {typeof tech === 'string' ? tech : tech.name}
                </span>
                {typeof tech === 'object' && tech.purpose && (
                  <span className="text-[#999] text-[11px] border-l border-[#444] pl-2 break-all">
                    {tech.purpose}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Components */}
      {important_components && important_components.length > 0 && (
        <div className="space-y-3 pt-2 min-w-0">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#0A0A0A]" />
            <span>IMPORTANT COMPONENTS ({important_components.length})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-0">
            {important_components.map((comp, idx) => {
              const compName = typeof comp === 'string' ? comp : comp.name;
              const compPurpose = typeof comp === 'object' ? comp.purpose : '';
              return (
                <div key={idx} className="bg-[#F5F3EC] border-brutal p-3 sm:p-3.5 space-y-1 shadow-brutal-sm min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="bg-[#0A0A0A] text-[#C8FF00] font-mono text-[10px] font-bold px-1.5 py-0.5 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#0A0A0A] min-w-0 break-all leading-tight">
                      {compName}
                    </span>
                  </div>
                  {compPurpose && (
                    <p className="text-xs text-[#5F5F5F] font-medium leading-relaxed pt-1 break-words">
                      {compPurpose}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Implementation Details */}
      {key_implementation_details && key_implementation_details.length > 0 && (
        <div className="space-y-3 pt-2 min-w-0">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
            KEY IMPLEMENTATION DETAILS & PATTERNS
          </h4>

          <div className="space-y-2 min-w-0">
            {key_implementation_details.map((detail, idx) => (
              <div key={idx} className="bg-[#FFFFFF] border-brutal p-3 sm:p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-[#0A0A0A] min-w-0">
                <span className="bg-[#0A0A0A] text-[#F5F3EC] font-mono text-[10px] font-bold px-1.5 py-0.5 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed min-w-0 break-words">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
