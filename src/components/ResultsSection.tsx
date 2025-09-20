"use client";

import { useState } from "react";
import { Download, Copy, CheckCircle, Wallet, Key } from "lucide-react";
import { GeneratedAddress } from "@/types";

interface ResultsSectionProps {
  results: GeneratedAddress[];
  onDownload: () => void;
  outputMode: "screen" | "file";
}

export default function ResultsSection({
  results,
  onDownload,
  outputMode,
}: ResultsSectionProps) {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (results.length === 0) return null;

  return (
    <div className="p-8 animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <span>Generated Addresses</span>
            <span className="text-lg text-gray-500">({results.length})</span>
          </h3>
          <button
            onClick={onDownload}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span>Address {result.index}</span>
                </div>

                <div className="space-y-3">
                  {/* Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ethereum Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm break-all text-gray-900">
                        {result.address}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            result.address,
                            `address-${result.index}`
                          )
                        }
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          copiedItems.has(`address-${result.index}`)
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {copiedItems.has(`address-${result.index}`) ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Private Key */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Key className="w-4 h-4" />
                      <span>Private Key</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3 font-mono text-sm break-all text-gray-900">
                        {result.privateKey}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            result.privateKey,
                            `private-${result.index}`
                          )
                        }
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          copiedItems.has(`private-${result.index}`)
                            ? "bg-green-500 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {copiedItems.has(`private-${result.index}`) ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-red-600 flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>Keep this private key secret and secure!</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {outputMode === "file" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">
                  Auto-Download Enabled
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Results will be automatically downloaded as a text file when
                  generation completes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
