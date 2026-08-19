import React, { useState, useEffect } from "react";
import { Github, Play, Loader2, AlertTriangle, ArrowRight, Cpu, X } from "lucide-react";

export const RepositoryInput = ({ inputRef, onSubmit, isLoading, error }) => {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [modalContent, setModalContent] = useState(null);

  // Auto-trigger error modal when backend API error is returned
  useEffect(() => {
    if (error) {
      const parsed = parseApiError(error);
      setModalContent(parsed);
    }
  }, [error]);

  const parseApiError = (rawError) => {
    if (!rawError) return null;
    const str = String(rawError);

    // Rate Limit / Quota Exceeded Interceptor
    if (
      str.includes("Rate limit") ||
      str.includes("rate_limit") ||
      str.includes("429") ||
      str.includes("quota") ||
      str.includes("free-models") ||
      str.includes("limit_source") ||
      str.includes("daily reset")
    ) {
      return {
        title: "AI MODEL RATE LIMIT EXCEEDED",
        message: "The free AI model tier daily request limit has been reached for code analysis.",
        suggestion: "RepoLens utilizes free AI models which share daily rate limits. Please wait a few minutes and try running the analysis again, or try analyzing another repository."
      };
    }

    // 404 Not Found
    if (str.includes("404") || str.includes("Not Found")) {
      return {
        title: "REPOSITORY NOT FOUND (404)",
        message: "The requested GitHub repository does not exist or is set to private.",
        suggestion: "Please check for typos in the repository owner or name, and verify that the repository is set to public on GitHub."
      };
    }

    // Backend Offline
    if (str.includes("connect") || str.includes("3000") || str.includes("Network Error") || str.includes("backend") || str.includes("onrender.com")) {
      return {
        title: "BACKEND SERVER OFFLINE",
        message: "Unable to reach RepoLens backend server at https://gitreport-backend.onrender.com.",
        suggestion: "The deployed Render backend server may be waking up from sleep mode (Render free instances spin down after inactivity). Please try again in 30 seconds."
      };
    }

    // GitHub Auth Error
    if (str.includes("GITHUB_TOKEN") || str.includes("401") || str.includes("Unauthorized")) {
      return {
        title: "GITHUB AUTHENTICATION FAILED",
        message: "GitHub API authentication error occurred.",
        suggestion: "Please verify that your GITHUB_TOKEN environment variable is properly configured in server/.env."
      };
    }

    return {
      title: "ANALYSIS FAILED",
      message: str,
      suggestion: "Please check the repository URL and try running the analysis again."
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setModalContent({
        title: "REPOSITORY URL REQUIRED",
        message: "Please enter a public GitHub repository URL before running analysis.",
        suggestion: "Example: https://github.com/expressjs/express"
      });
      return;
    }

    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
    if (!githubRegex.test(trimmed)) {
      setModalContent({
        title: "INVALID GITHUB REPOSITORY URL",
        message: "The entered URL does not follow the standard public GitHub repository format.",
        suggestion: "Expected format: https://github.com/owner/repository"
      });
      return;
    }

    setValidationError("");
    onSubmit(trimmed);
  };

  const handleExampleClick = (exampleUrl) => {
    setUrl(exampleUrl);
    setValidationError("");
    onSubmit(exampleUrl);
  };

  return (
    <>
      {/* Neo-Brutalist User-Friendly Error Modal Popup */}
      {modalContent && (
        <div className="fixed inset-0 bg-[#0A0A0A]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#F5F3EC] border-brutal-lg shadow-brutal-lg max-w-lg w-full p-6 text-center space-y-4 relative animate-in fade-in zoom-in duration-150">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setModalContent(null)}
              className="absolute top-3 right-3 bg-[#0A0A0A] text-[#F5F3EC] hover:text-[#C8FF00] p-1 border border-[#0A0A0A]"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="inline-flex bg-[#0A0A0A] text-[#C8FF00] p-3 border border-[#0A0A0A] shadow-brutal-sm">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-[#0A0A0A] uppercase tracking-tight">
                {modalContent.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#0A0A0A] font-medium leading-relaxed">
                {modalContent.message}
              </p>
            </div>

            {modalContent.suggestion && (
              <div className="bg-[#0A0A0A] text-[#F5F3EC] border border-[#0A0A0A] p-3 font-mono text-xs text-left space-y-1">
                <span className="text-[#C8FF00] text-[10px] block font-bold tracking-wider uppercase">HOW TO RESOLVE</span>
                <p className="text-gray-300 font-medium text-xs leading-normal">{modalContent.suggestion}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalContent(null);
                  if (inputRef && inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                className="w-full bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#C8FF00] font-display font-black text-xs uppercase tracking-wider py-3 border-brutal hover-brutal shadow-brutal-sm flex items-center justify-center gap-2"
              >
                <span>GOT IT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Component */}
      <div className="w-full max-w-3xl bg-[#F5F3EC] border-brutal-lg shadow-brutal-lg p-4 sm:p-6 space-y-3.5">
        {/* Label */}
        <div className="flex items-center justify-between">
          <label htmlFor="repo-url" className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2">
            <span className="bg-[#0A0A0A] text-[#C8FF00] px-2 py-0.5 font-bold text-xs sm:text-sm">1</span>
            <span>ENTER PUBLIC REPOSITORY URL</span>
          </label>
          <span className="hidden sm:inline-block font-mono text-xs text-[#5F5F5F] font-semibold">NO LOGIN REQUIRED</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Input field */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0A0A0A]">
                <Github className="w-5 h-5 stroke-[2.5]" />
              </div>
              <input
                ref={inputRef}
                id="repo-url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (validationError) setValidationError("");
                }}
                placeholder="https://github.com/owner/repository"
                disabled={isLoading}
                className="w-full bg-[#FFFFFF] border-brutal-lg pl-11 pr-3 py-3 text-sm sm:text-base font-mono font-bold text-[#0A0A0A] placeholder-[#999999] focus:outline-none focus:ring-4 focus:ring-[#C8FF00] focus:border-[#0A0A0A] disabled:opacity-60 shadow-inner"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#C8FF00] font-display font-black text-xs sm:text-sm tracking-wider uppercase px-6 py-3 border-brutal-lg hover-brutal flex items-center justify-center gap-2.5 disabled:opacity-75 disabled:cursor-not-allowed whitespace-nowrap shadow-brutal-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>ANALYZING (1-2 MINS)...</span>
                </>
              ) : (
                <>
                  <span>RUN ANALYSIS</span>
                  <Play className="w-4 h-4 fill-[#C8FF00]" />
                </>
              )}
            </button>
          </div>

          {/* Loading Progress State Banner */}
          {isLoading && (
            <div className="bg-[#0A0A0A] text-[#F5F3EC] border-l-4 border-[#C8FF00] p-3.5 text-xs font-mono flex items-center justify-between gap-3 shadow-brutal-sm">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-[#C8FF00] animate-spin stroke-[2.5] shrink-0" />
                <div>
                  <p className="font-bold text-[#C8FF00] uppercase text-xs flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>ANALYZING REPOSITORY STRUCTURE</span>
                  </p>
                  <p className="text-gray-300 text-xs mt-0.5 font-medium">Free AI models are synthesizing your report. This process usually takes 1-2 minutes...</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-[#141414] border border-[#333] px-2.5 py-1 text-[11px] text-[#C8FF00] font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-ping"></span>
                <span>PROCESSING (~1-2m)</span>
              </div>
            </div>
          )}

          {/* Quick Example Presets */}
          <div className="pt-1 flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1 max-w-full">
            <span className="text-[#5F5F5F] uppercase tracking-wider text-xs font-bold shrink-0">Try Example:</span>
            {[
              { label: "WriteNow-supabase", url: "https://github.com/Akarsh-Kumar-Jha/WriteNow-supabase" },
              { label: "langGraph", url: "https://github.com/Akarsh-Kumar-Jha/langGraph" },
              { label: "expressjs", url: "https://github.com/expressjs/express" }
            ].map((sample) => (
              <button
                key={sample.label}
                type="button"
                disabled={isLoading}
                onClick={() => handleExampleClick(sample.url)}
                className="bg-[#FFFFFF] hover:bg-[#C8FF00] hover:text-[#0A0A0A] text-[#0A0A0A] border-brutal px-2.5 py-1 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-brutal-sm"
              >
                <span>{sample.label}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            ))}
          </div>
        </form>
      </div>
    </>
  );
};
