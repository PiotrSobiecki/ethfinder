"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressSection from "@/components/ProgressSection";
import ResultsSection from "@/components/ResultsSection";
import { ToastContainer, useToast } from "@/components/Toast";
import { GeneratedAddress, GenerationConfig, ProgressStats } from "@/types";
import { useEthereumGenerator } from "@/hooks/useEthereumGenerator";

export default function Home() {
  const [config, setConfig] = useState<GenerationConfig>({
    prefix: "",
    suffix: "",
    count: 1,
    outputMode: "screen",
    ignoreCase: false,
  });

  const { toasts, removeToast, success, error, info, warning } = useToast();

  const {
    isGenerating,
    results,
    progress,
    startGeneration,
    stopGeneration,
    downloadResults,
  } = useEthereumGenerator({ success, error, info, warning });

  const handleStartGeneration = (newConfig: GenerationConfig) => {
    setConfig(newConfig);
    startGeneration(newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <Header />

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <GeneratorForm
              onStartGeneration={handleStartGeneration}
              isGenerating={isGenerating}
            />

            {isGenerating && (
              <ProgressSection progress={progress} onStop={stopGeneration} />
            )}

            {results.length > 0 && (
              <ResultsSection
                results={results}
                onDownload={downloadResults}
                outputMode={config.outputMode}
              />
            )}
          </div>
        </div>

        {/* Toast container at bottom */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </main>

      <Footer />
    </div>
  );
}
