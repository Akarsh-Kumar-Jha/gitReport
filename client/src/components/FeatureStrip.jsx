import React from "react";
import { Zap, Globe, Sparkles } from "lucide-react";

export const FeatureStrip = () => {
  const features = [
    {
      icon: Zap,
      title: "FAST ANALYSIS",
      description: "Results in seconds"
    },
    {
      icon: Globe,
      title: "PUBLIC REPOS",
      description: "Public repo data only"
    },
    {
      icon: Sparkles,
      title: "AI INSIGHTS",
      description: "Deep technical analysis"
    }
  ];

  return (
    <div className="w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-3">
      {features.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} className="bg-[#FFFFFF] border-brutal p-2 sm:p-2.5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-2 shadow-brutal-sm">
            <div className="bg-[#C8FF00] p-1 sm:p-1.5 border border-[#0A0A0A] shrink-0">
              <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0A0A0A] stroke-[2.5]" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A] truncate">
                {item.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-[#5F5F5F] font-medium leading-tight mt-0.5 hidden xs:block">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
