"use client";

import { useState } from "react";
import { Play, Settings, AlertCircle, Check } from "lucide-react";
import { GenerationConfig } from "@/types";
import ProbabilityEstimate from "./ProbabilityEstimate";
import { validateHexInput } from "@/utils/hexValidation";

interface GeneratorFormProps {
  onStartGeneration: (config: GenerationConfig) => void;
  isGenerating: boolean;
}

export default function GeneratorForm({
  onStartGeneration,
  isGenerating,
}: GeneratorFormProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    prefix: "",
    suffix: "",
    count: 1,
    outputMode: "screen",
    ignoreCase: false,
  });

  const [errors, setErrors] = useState<{
    prefix?: string;
    suffix?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja hex
    const prefixError = validateHexInput(config.prefix, "Prefix");
    const suffixError = validateHexInput(config.suffix, "Suffix");

    if (prefixError || suffixError) {
      setErrors({
        prefix: prefixError || undefined,
        suffix: suffixError || undefined,
      });
      return;
    }

    if (config.count < 1 || config.count > 1000) {
      alert("Number of addresses must be between 1 and 1000");
      return;
    }

    // Wyczyść błędy
    setErrors({});
    onStartGeneration(config);
  };

  const handleInputChange = (
    field: keyof GenerationConfig,
    value: string | number | boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Walidacja na żywo dla prefix i suffix
    if (field === "prefix" || field === "suffix") {
      const error = validateHexInput(
        value as string,
        field === "prefix" ? "Prefix" : "Suffix"
      );
      setErrors((prev) => ({
        ...prev,
        [field]: error || undefined,
      }));
    }
  };

  return (
    <div className="p-8 border-b border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Generation Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="prefix"
              className="block text-sm font-medium text-gray-700"
            >
              Prefix after "0x" (optional)
            </label>
            <input
              type="text"
              id="prefix"
              value={config.prefix}
              onChange={(e) => handleInputChange("prefix", e.target.value)}
              placeholder="e.g. abc123"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900 bg-white ${
                errors.prefix
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              disabled={isGenerating}
            />
            {errors.prefix ? (
              <div className="flex items-start space-x-2 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">{errors.prefix}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                Hexadecimal characters only (0-9, a-f, A-F) - Case sensitive!
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="suffix"
              className="block text-sm font-medium text-gray-700"
            >
              Address suffix (optional)
            </label>
            <input
              type="text"
              id="suffix"
              value={config.suffix}
              onChange={(e) => handleInputChange("suffix", e.target.value)}
              placeholder="e.g. def456"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900 bg-white ${
                errors.suffix
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              disabled={isGenerating}
            />
            {errors.suffix ? (
              <div className="flex items-start space-x-2 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">{errors.suffix}</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                Hexadecimal characters only (0-9, a-f, A-F) - Case sensitive!
              </p>
            )}
          </div>
        </div>

        {/* Case sensitivity option */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex items-center h-5">
              <input
                id="ignoreCase"
                type="checkbox"
                checked={config.ignoreCase}
                onChange={(e) =>
                  handleInputChange("ignoreCase", e.target.checked)
                }
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                disabled={isGenerating}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="ignoreCase"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Ignore case sensitivity
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {(() => {
                  const example = config.prefix || config.suffix || "C0FFEE";
                  const mixedCase = example
                    .split("")
                    .map((char, i) =>
                      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
                    )
                    .join("");

                  return config.ignoreCase
                    ? `✓ Will find "${mixedCase}" when searching for "${example}" (more matches, faster search)`
                    : `✗ Will only find exact case "${example}" (fewer matches, longer search)`;
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700"
            >
              Number of addresses to generate
            </label>
            <input
              type="number"
              id="count"
              min="1"
              max="1000"
              value={config.count}
              onChange={(e) =>
                handleInputChange("count", parseInt(e.target.value) || 1)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900 bg-white"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="outputMode"
              className="block text-sm font-medium text-gray-700"
            >
              Display method
            </label>
            <select
              id="outputMode"
              value={config.outputMode}
              onChange={(e) =>
                handleInputChange(
                  "outputMode",
                  e.target.value as "screen" | "file"
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900 bg-white"
              disabled={isGenerating}
            >
              <option value="screen">Display on screen</option>
              <option value="file">Download as file</option>
            </select>
          </div>
        </div>

        <ProbabilityEstimate
          prefix={config.prefix}
          suffix={config.suffix}
          count={config.count}
          ignoreCase={config.ignoreCase}
        />

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
        >
          <Play className="w-5 h-5" />
          <span>{isGenerating ? "Generating..." : "Start Generation"}</span>
        </button>
      </form>
    </div>
  );
}
