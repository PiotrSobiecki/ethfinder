"use client";

import { useState } from "react";
import {
  Calculator,
  Clock,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  calculateAddressProbability,
  getPatternExamples,
} from "@/utils/probabilityCalculator";

interface ProbabilityEstimateProps {
  prefix: string;
  suffix: string;
  count: number;
  ignoreCase: boolean;
}

export default function ProbabilityEstimate({
  prefix,
  suffix,
  count,
  ignoreCase,
}: ProbabilityEstimateProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show if no pattern specified
  if (!prefix && !suffix) {
    return null;
  }

  const estimate = calculateAddressProbability(
    prefix,
    suffix,
    count,
    ignoreCase
  );
  const examples = getPatternExamples(prefix, suffix);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Very Easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Hard":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Very Hard":
        return "text-red-600 bg-red-50 border-red-200";
      case "Extremely Hard":
        return "text-red-800 bg-red-100 border-red-300";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
        type="button"
      >
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">
            Pattern Probability Estimate
          </h3>
          <span className="text-sm text-blue-700">
            ({count} addr{count > 1 ? "s" : ""}: {estimate.difficulty} -{" "}
            {estimate.estimatedTime})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-slide-up">
          <div className="h-px bg-blue-200"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Probability
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                1 in {estimate.expectedAttempts.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                ({(estimate.probability * 100).toExponential(2)}%)
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Est. Time
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {estimate.estimatedTime}
              </p>
              <p className="text-xs text-gray-500">@ ~1,500 addr/sec</p>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Difficulty
                </span>
              </div>
              <span
                className={`inline-block px-2 py-1 rounded text-sm font-medium border ${getDifficultyColor(
                  estimate.difficulty
                )}`}
              >
                {estimate.difficulty}
              </span>
            </div>
          </div>

          {examples.length > 0 && (
            <div className="bg-white rounded-lg p-3 border">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Example addresses:
              </p>
              <div className="space-y-1">
                {examples.map((example, index) => (
                  <p
                    key={index}
                    className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded"
                  >
                    {example}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-blue-700">
            <p>
              💡 <strong>Tip:</strong> Shorter patterns are found much faster.
              Each additional character makes it ~{ignoreCase ? "16" : "22"}x
              harder to find (
              {ignoreCase ? "case-insensitive" : "case-sensitive"})!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
