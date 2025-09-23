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

    const countNum =
      typeof config.count === "number"
        ? config.count
        : parseInt(config.count.toString());
    if (isNaN(countNum) || countNum < 1 || countNum > 1000) {
      alert("Number of addresses must be between 1 and 1000");
      return;
    }

    // Wyczyść błędy
    setErrors({});
    // Ensure count is a number when submitting
    const finalConfig = {
      ...config,
      count: countNum,
    };
    onStartGeneration(finalConfig);
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

        {/* Case sensitivity option - conditional rendering */}
        {(() => {
          // Check if prefix/suffix contains only digits (0-9)
          const pattern = (config.prefix + config.suffix).toLowerCase();
          const hasOnlyDigits = pattern.length > 0 && /^[0-9]*$/.test(pattern);
          const hasLetters = pattern.length > 0 && /[a-f]/.test(pattern);

          if (hasOnlyDigits) {
            // Show info that case sensitivity doesn't apply to digits
            return (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">💡</div>
                  <div className="text-sm text-blue-800">
                    <strong>Numbers only detected:</strong> Case sensitivity
                    doesn't apply to digits (0-9)
                  </div>
                </div>
              </div>
            );
          } else if (hasLetters || pattern.length === 0) {
            // Show case sensitivity option for letters or empty pattern
            return (
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
                        const example =
                          config.prefix || config.suffix || "C0FFEE";
                        const mixedCase = example
                          .split("")
                          .map((char, i) =>
                            i % 2 === 0
                              ? char.toLowerCase()
                              : char.toUpperCase()
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
            );
          }
          return null;
        })()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700"
            >
              Number of addresses to generate
            </label>
            <div className="relative">
              <input
                type="text"
                id="count"
                value={config.count}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string during typing
                  if (value === "") {
                    handleInputChange("count", "");
                    return;
                  }
                  // Only allow numbers
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 1000) {
                    handleInputChange("count", numValue);
                  }
                }}
                onBlur={() => {
                  // If empty or invalid, set to 1
                  const currentCount =
                    typeof config.count === "number"
                      ? config.count
                      : parseInt(config.count.toString());
                  if (
                    config.count === "" ||
                    isNaN(currentCount) ||
                    currentCount < 1
                  ) {
                    handleInputChange("count", 1);
                  }
                }}
                className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 text-gray-900 bg-white"
                disabled={isGenerating}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1-1000"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    const currentCount =
                      typeof config.count === "number" ? config.count : 1;
                    const newValue = Math.min(currentCount + 1, 1000);
                    handleInputChange("count", newValue);
                  }}
                  disabled={
                    isGenerating ||
                    (typeof config.count === "number"
                      ? config.count
                      : parseInt(config.count.toString()) || 1) >= 1000
                  }
                  className="w-4 h-3 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Zwiększ liczbę"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentCount =
                      typeof config.count === "number" ? config.count : 1;
                    const newValue = Math.max(currentCount - 1, 1);
                    handleInputChange("count", newValue);
                  }}
                  disabled={
                    isGenerating ||
                    (typeof config.count === "number"
                      ? config.count
                      : parseInt(config.count.toString()) || 1) <= 1
                  }
                  className="w-4 h-3 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  aria-label="Zmniejsz liczbę"
                >
                  ▼
                </button>
              </div>
            </div>
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
          count={
            typeof config.count === "number"
              ? config.count
              : parseInt(config.count.toString()) || 1
          }
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
