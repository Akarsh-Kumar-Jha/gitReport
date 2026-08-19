import React, { useState, useRef } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { RepositoryInput } from "./components/RepositoryInput.jsx";
import { FeatureStrip } from "./components/FeatureStrip.jsx";
import { Report } from "./components/Report.jsx";
import { generateReport } from "./services/api.js";
import { CheckCircle2, ArrowDown } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const reportSectionRef = useRef(null);
  const inputRef = useRef(null);

  const handleAnalyze = async (repoUrl) => {
    setLoading(true);
    setError("");
    setSuccessNotice(false);

    try {
      const data = await generateReport(repoUrl);

      if (data && data.success && data.report) {
        setReport(data.report);
        setSuccessNotice(true);

        // Smooth transition scroll after brief DOM paint
        setTimeout(() => {
          reportSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);

        // Auto hide success notice after 5s
        setTimeout(() => {
          setSuccessNotice(false);
        }, 5000);
      } else {
        throw new Error(data?.error || "Backend returned an unsuccessful status.");
      }
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to analyze repository. Ensure the backend server is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError("");
    setSuccessNotice(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#0A0A0A] flex flex-col relative">
      {/* Success Floating Transition Notice */}
      {successNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0A] text-[#C8FF00] border-brutal-lg shadow-brutal-lg px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-top-6 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C8FF00] stroke-[2.5]" />
          <span>REPORT SYNTHESIZED — TRANSITIONING TO REPORT...</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}

      {/* 1. Header */}
      <Header />

      {/* 2. SECTION 1 — LANDING / ANALYZER */}
      <section className="w-full min-h-[calc(100vh-55px)] flex flex-col justify-center items-center gap-6 sm:gap-8 px-4 sm:px-6 py-6 max-w-6xl mx-auto shrink-0">
        <Hero />
        <RepositoryInput inputRef={inputRef} onSubmit={handleAnalyze} isLoading={loading} error={error} />
        <FeatureStrip />
      </section>

      {/* 3. SECTION 2 — GENERATED REPORT */}
      {report && (
        <div ref={reportSectionRef} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex justify-center">
          <Report report={report} onReset={handleReset} />
        </div>
      )}

      {/* Footer */}
      {report && (
        <footer className="w-full border-t-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EC] py-4 px-4 text-center font-mono text-xs mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#C8FF00]">CODESCOPE</span>
              <span className="text-[#5F5F5F]">|</span>
              <span className="text-gray-400">AI REPOSITORY ANALYZER</span>
            </div>
            <p className="text-gray-500">
              TECHNICAL MAGAZINE × FINANCIAL REPORT × NEO-BRUTALIST DEVELOPER TOOL
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
