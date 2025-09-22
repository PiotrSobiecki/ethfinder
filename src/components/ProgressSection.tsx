"use client";

import { Square, Clock, Target, Search } from "lucide-react";
import { ProgressStats } from "@/types";

interface ProgressSectionProps {
  progress: ProgressStats;
  onStop: () => void;
}

export default function ProgressSection({
  progress,
  onStop,
}: ProgressSectionProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const percentage =
    progress.total > 0 ? (progress.found / progress.total) * 100 : 0;

  return (
    <div className="p-8 border-b border-gray-200 bg-gray-50 animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>Generation Progress</span>
          </h3>
          <button
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Found</p>
                  <p className="text-xl font-bold text-gray-800">
                    {progress.found}/{progress.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Checked</p>
                  <p className="text-xl font-bold text-gray-800">
                    {progress.checked.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Elapsed Time</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatTime(progress.elapsedTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">
                  High-Performance Generation
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Advanced background optimization: Using MessageChannel and
                  adaptive batches ({(20000).toLocaleString()} addresses) to
                  bypass browser throttling when minimized. Detects window state
                  for optimal performance. The more specific your requirements,
                  the longer it may take to find matching addresses.
                </p>
                {progress.elapsedTime > 0 && progress.checked > 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    Speed: ~
                    {Math.round(
                      progress.checked / progress.elapsedTime
                    ).toLocaleString()}{" "}
                    addresses/second
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
