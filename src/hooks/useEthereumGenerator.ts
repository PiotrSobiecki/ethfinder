"use client";

import { useState, useRef, useCallback } from "react";
import { ethers } from "ethers";
import {
  GeneratedAddress,
  GenerationConfig,
  ProgressStats,
  EthereumGeneratorState,
} from "@/types";

interface ToastFunctions {
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
}

export function useEthereumGenerator(toast?: ToastFunctions) {
  const [state, setState] = useState<EthereumGeneratorState>({
    isGenerating: false,
    shouldStop: false,
    results: [],
    progress: {
      found: 0,
      total: 0,
      checked: 0,
      elapsedTime: 0,
      isComplete: false,
    },
    summary: undefined,
  });

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const shouldStopRef = useRef<boolean>(false);
  const stopTimeRef = useRef<number>(0);

  const generateEthereumAddress = useCallback((): GeneratedAddress | null => {
    try {
      // Use native crypto for much faster generation
      const privateKeyBytes = new Uint8Array(32);
      crypto.getRandomValues(privateKeyBytes);

      // Convert to hex string
      const privateKeyHex = Array.from(privateKeyBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Create wallet from private key for address derivation
      const wallet = new ethers.Wallet("0x" + privateKeyHex);

      return {
        index: 0, // Will be set later
        address: wallet.address,
        privateKey: privateKeyHex,
      };
    } catch (error) {
      console.error("Address generation error:", error);
      return null;
    }
  }, []);

  const checkAddressPattern = useCallback(
    (address: string, prefix: string, suffix: string): boolean => {
      const prefixCheck = !prefix || address.startsWith("0x" + prefix);
      const suffixCheck = !suffix || address.endsWith(suffix);
      return prefixCheck && suffixCheck;
    },
    []
  );

  const updateProgress = useCallback(
    (found: number, total: number, checked: number) => {
      const elapsedTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      setState((prev) => ({
        ...prev,
        progress: {
          found,
          total,
          checked,
          elapsedTime,
          isComplete: false,
        },
      }));
    },
    []
  );

  const startGeneration = useCallback(
    async (config: GenerationConfig) => {
      if (state.isGenerating) return;

      // Ensure count is a number
      const countNum =
        typeof config.count === "number"
          ? config.count
          : parseInt(config.count.toString()) || 1;

      // Reset state and refs
      shouldStopRef.current = false;
      stopTimeRef.current = 0;
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        shouldStop: false,
        results: [],
        progress: {
          found: 0,
          total: countNum,
          checked: 0,
          elapsedTime: 0,
          isComplete: false,
        },
      }));

      startTimeRef.current = Date.now();
      const results: GeneratedAddress[] = [];
      let found = 0;
      let checked = 0;
      const maxAttempts = 1000000000; // Higher attempt limit (1B)

      // Update progress every second
      intervalRef.current = setInterval(() => {
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setState((prev) => ({
          ...prev,
          progress: {
            ...prev.progress,
            elapsedTime,
          },
        }));
      }, 1000);

      // Larger batches for better background performance
      const batchSize = 20000; // Bigger batches, less yielding

      while (found < countNum && checked < maxAttempts) {
        // Check if should stop
        if (shouldStopRef.current) break;

        // Process batch with inline generation for maximum speed
        for (
          let i = 0;
          i < batchSize && found < countNum && checked < maxAttempts;
          i++
        ) {
          try {
            // Ultra-fast inline generation with native crypto
            const privateKeyBytes = new Uint8Array(32);
            crypto.getRandomValues(privateKeyBytes);

            const privateKeyHex = Array.from(privateKeyBytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");

            // Use ethers only for address derivation (still fastest option)
            const wallet = new ethers.Wallet("0x" + privateKeyHex);
            const address = wallet.address;
            const privateKey = privateKeyHex;

            checked++;

            // Pattern check with case sensitivity option
            let prefixCheck: boolean;
            let suffixCheck: boolean;

            if (config.ignoreCase) {
              // Case-insensitive matching
              const addressLower = address.toLowerCase();
              prefixCheck =
                !config.prefix ||
                addressLower.startsWith("0x" + config.prefix.toLowerCase());
              suffixCheck =
                !config.suffix ||
                addressLower.endsWith(config.suffix.toLowerCase());
            } else {
              // Case-sensitive matching (exact)
              prefixCheck =
                !config.prefix || address.startsWith("0x" + config.prefix);
              suffixCheck = !config.suffix || address.endsWith(config.suffix);
            }

            if (prefixCheck && suffixCheck) {
              found++;
              results.push({
                index: found,
                address,
                privateKey,
              });

              // Update results immediately but with performance optimization
              console.log("Updating state with results:", results);
              setState((prev) => ({
                ...prev,
                results: [...results],
              }));

              // Break early if we found enough
              if (found >= countNum) break;
            }

            // Update progress less frequently and yield control to UI
            if (checked % 1000 === 0) {
              setState((prev) => ({
                ...prev,
                progress: {
                  found,
                  total: countNum,
                  checked,
                  elapsedTime: Math.floor(
                    (Date.now() - startTimeRef.current) / 1000
                  ),
                  isComplete: false,
                },
              }));

              // Always yield for UI updates, but use MessageChannel for better background performance
              await new Promise((resolve) => {
                const channel = new MessageChannel();
                channel.port2.onmessage = () => resolve(undefined);
                channel.port1.postMessage(null);
              });
            }
          } catch (error) {
            console.error("Address generation error:", error);
          }
        }

        // Update UI and yield control to browser between batches
        setState((prev) => ({
          ...prev,
          results: [...results],
        }));

        updateProgress(found, countNum, checked);

        // Use MessageChannel between batches - better for background
        await new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port2.onmessage = () => resolve(undefined);
          channel.port1.postMessage(null);
        });
      }

      // Calculate final elapsed time BEFORE clearing anything
      const finalElapsedTime = shouldStopRef.current
        ? stopTimeRef.current // Already calculated in stopGeneration
        : Math.floor((Date.now() - startTimeRef.current) / 1000);
      const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
      };

      // Create search criteria description
      const searchCriteria = `${
        config.prefix ? `Prefix: "${config.prefix}"` : ""
      }${config.prefix && config.suffix ? ", " : ""}${
        config.suffix ? `Suffix: "${config.suffix}"` : ""
      }${config.ignoreCase ? " (case-insensitive)" : " (case-sensitive)"}`;

      // Clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Complete generation
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        progress: {
          ...prev.progress,
          isComplete: true,
        },
        summary: {
          totalChecked: checked,
          totalTime: finalElapsedTime,
          searchCriteria: searchCriteria,
        },
      }));

      // Auto-download if file mode
      if (config.outputMode === "file" && results.length > 0) {
        downloadResults(results);
      }

      // Show informative message about results
      if (results.length === 0) {
        if (toast) {
          const action = shouldStopRef.current ? "stopped" : "completed";
          toast.warning(
            `Generation ${action}`,
            `No addresses found matching the criteria after scanning ${checked.toLocaleString()} addresses in ${formatTime(
              finalElapsedTime
            )}.`,
            8000
          );
        }
      } else if (found < countNum) {
        if (toast) {
          const action = shouldStopRef.current ? "stopped" : "completed";
          toast.info(
            `Generation ${action}`,
            `Found ${found} out of ${countNum} requested addresses after scanning ${checked.toLocaleString()} addresses in ${formatTime(
              finalElapsedTime
            )}.`,
            6000
          );
        }
      } else {
        if (toast) {
          toast.success(
            "Generation completed!",
            `Successfully found ${found} address${
              found > 1 ? "es" : ""
            } after scanning ${checked.toLocaleString()} addresses in ${formatTime(
              finalElapsedTime
            )}.`,
            5000
          );
        }
      }
    },
    [
      state.isGenerating,
      generateEthereumAddress,
      checkAddressPattern,
      updateProgress,
      toast,
    ]
  );

  const stopGeneration = useCallback(() => {
    shouldStopRef.current = true;

    // Save both start and stop time for accurate calculation
    const currentTime = Date.now();
    if (startTimeRef.current > 0) {
      // Calculate and store the elapsed time
      stopTimeRef.current = Math.floor(
        (currentTime - startTimeRef.current) / 1000
      );
    }

    setState((prev) => ({
      ...prev,
      shouldStop: true,
      isGenerating: false,
      results: [], // clear results
      progress: {
        found: 0,
        total: 0,
        checked: 0,
        elapsedTime: 0,
        isComplete: false,
      },
      summary: undefined, // clear summary
    }));

    // Clear timer and reset time reference
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    startTimeRef.current = 0;
  }, []);

  const downloadResults = useCallback(
    (results?: GeneratedAddress[]) => {
      console.log("Download called with:", results);
      console.log("State results:", state.results);

      // Bezpieczne kopiowanie wyników
      let resultsToDownload: GeneratedAddress[] = [];

      if (results && Array.isArray(results)) {
        resultsToDownload = [...results];
      } else if (state.results && Array.isArray(state.results)) {
        resultsToDownload = [...state.results];
      }

      console.log("Results to download:", resultsToDownload);
      console.log("Is array?", Array.isArray(resultsToDownload));
      console.log("Length:", resultsToDownload.length);

      if (!Array.isArray(resultsToDownload) || resultsToDownload.length === 0) {
        if (toast) {
          toast.error("Download failed", "No valid results to download!");
        }
        console.error("resultsToDownload is not an array:", resultsToDownload);
        return;
      }

      let content = "Ethereum Address Generator - Results\n";
      content += "====================================\n\n";

      // Add summary if available
      if (state.summary) {
        const formatTime = (seconds: number) => {
          if (seconds < 60) return `${seconds}s`;
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}m ${secs}s`;
        };

        content += "GENERATION SUMMARY\n";
        content += "------------------\n";
        content += `Search Criteria: ${state.summary.searchCriteria}\n`;
        content += `Addresses Found: ${resultsToDownload.length}\n`;
        content += `Total Addresses Scanned: ${state.summary.totalChecked.toLocaleString()}\n`;
        content += `Total Time: ${formatTime(state.summary.totalTime)}\n`;
        content += `Speed: ${Math.round(
          state.summary.totalChecked / state.summary.totalTime
        ).toLocaleString()} addresses/second\n`;
        content += `Generated: ${new Date().toLocaleString()}\n\n`;
        content += "RESULTS\n";
        content += "-------\n";
      }

      resultsToDownload.forEach((result) => {
        if (result && result.address && result.privateKey) {
          content += `Address ${result.index}: ${result.address}\n`;
          content += `Private Key ${result.index}: ${result.privateKey}\n\n`;
        }
      });

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ethereum_addresses_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Show success message
      if (toast) {
        toast.success(
          "Download completed!",
          `Successfully downloaded ${resultsToDownload.length} address${
            resultsToDownload.length > 1 ? "es" : ""
          } to file.`
        );
      }
    },
    [state.results, toast]
  );

  return {
    isGenerating: state.isGenerating,
    results: state.results,
    progress: state.progress,
    startGeneration,
    stopGeneration,
    downloadResults,
  };
}
