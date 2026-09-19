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

type GenerationSummary = NonNullable<EthereumGeneratorState["summary"]>;

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Poza hookiem celowo: podsumowanie jest przekazywane argumentem, a nie
// czytane ze stanu. Auto-pobieranie startuje tuz po setState, wiec odczyt
// state.summary trafialby jeszcze na wartosc z poprzedniego przebiegu.
function buildResultsFile(
  results: GeneratedAddress[],
  summary?: GenerationSummary
): string {
  let content = "Ethereum Address Generator - Results\n";
  content += "====================================\n\n";

  if (summary) {
    // Generacja ponizej sekundy daje totalTime = 0; bez tego warunku predkosc
    // wychodzila jako Infinity.
    const speed =
      summary.totalTime > 0
        ? `${Math.round(
            summary.totalChecked / summary.totalTime
          ).toLocaleString()} addresses/second`
        : "n/a (under 1s)";

    content += "GENERATION SUMMARY\n";
    content += "------------------\n";
    content += `Search Criteria: ${summary.searchCriteria}\n`;
    content += `Addresses Found: ${results.length}\n`;
    content += `Total Addresses Scanned: ${summary.totalChecked.toLocaleString()}\n`;
    content += `Total Time: ${formatDuration(summary.totalTime)}\n`;
    content += `Speed: ${speed}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    content += "RESULTS\n";
    content += "-------\n";
  }

  results.forEach((result) => {
    if (result && result.address && result.privateKey) {
      content += `Address ${result.index}: ${result.address}\n`;
      content += `Private Key ${result.index}: ${result.privateKey}\n\n`;
    }
  });

  return content;
}

function triggerDownload(content: string): void {
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

  // Security: Validate crypto.getRandomValues quality
  const validateSecureRandom = useCallback(() => {
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw new Error("Secure random number generator not available");
    }

    // Test randomness quality
    const test1 = new Uint8Array(32);
    const test2 = new Uint8Array(32);
    crypto.getRandomValues(test1);
    crypto.getRandomValues(test2);

    // Check if arrays are different (basic test)
    const identical = test1.every((val, i) => val === test2[i]);
    if (identical) {
      throw new Error("Random number generator appears compromised");
    }

    return true;
  }, []);

  // Sprzatanie po zakonczeniu generacji.
  //
  // Zakres jest ograniczony i warto to wiedziec: klucze prywatne zyja tu jako
  // stringi w state.results, bo UI musi je pokazac, a stringow w JavaScripcie
  // nie da sie nadpisac - znikaja dopiero, gdy zbierze je GC. Realnie mozna
  // wyzerowac tylko bufor bajtow, z ktorego powstaje klucz, i to dzieje sie
  // przy kazdej iteracji petli (privateKeyBytes.fill(0)). Ta funkcja czysci
  // juz tylko liczniki czasu.
  const secureCleanup = useCallback(() => {
    // stopTimeRef zostaje - jest potrzebny do policzenia koncowego czasu.
    startTimeRef.current = 0;
  }, []);

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

      // Security: Validate secure random before starting
      try {
        validateSecureRandom();
      } catch (error) {
        if (toast) {
          toast.error(
            "Security Error",
            "Secure random number generator not available or compromised. Cannot proceed safely.",
            10000
          );
        }
        return;
      }

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
          // Stop ma dzialac od razu. Bez tego warunku flaga byla sprawdzana
          // dopiero miedzy batchami, czyli po 20 000 kolejnych kluczach.
          if (shouldStopRef.current) break;

          try {
            // Ultra-fast inline generation with native crypto
            const privateKeyBytes = new Uint8Array(32);
            crypto.getRandomValues(privateKeyBytes);

            const privateKeyHex = Array.from(privateKeyBytes)
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");

            // Bufor jest juz niepotrzebny - zerujemy go, zeby material klucza
            // nie zostawal w pamieci dluzej, niz musi.
            privateKeyBytes.fill(0);

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
      // Create search criteria description
      const searchCriteria = `${
        config.prefix ? `Prefix: "${config.prefix}"` : ""
      }${config.prefix && config.suffix ? ", " : ""}${
        config.suffix ? `Suffix: "${config.suffix}"` : ""
      }${config.ignoreCase ? " (case-insensitive)" : " (case-sensitive)"}`;

      const summary: GenerationSummary = {
        totalChecked: checked,
        totalTime: finalElapsedTime,
        searchCriteria,
      };

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
        summary,
      }));

      // Auto-download if file mode. Podsumowanie idzie z lokalnej zmiennej,
      // bo setState powyzej jeszcze sie nie przeliczyl.
      if (config.outputMode === "file" && results.length > 0) {
        triggerDownload(buildResultsFile(results, summary));

        if (toast) {
          toast.success(
            "Download completed!",
            `Successfully downloaded ${results.length} address${
              results.length > 1 ? "es" : ""
            } to file.`
          );
        }
      }

      // Show informative message about results
      if (results.length === 0) {
        if (toast) {
          const action = shouldStopRef.current ? "stopped" : "completed";
          toast.warning(
            `Generation ${action}`,
            `No addresses found matching the criteria after scanning ${checked.toLocaleString()} addresses in ${formatDuration(
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
            `Found ${found} out of ${countNum} requested addresses after scanning ${checked.toLocaleString()} addresses in ${formatDuration(
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
            } after scanning ${checked.toLocaleString()} addresses in ${formatDuration(
              finalElapsedTime
            )}.`,
            5000
          );
        }
      }

      // Security: Clean sensitive data from memory after completion
      secureCleanup();
    },
    [
      state.isGenerating,
      updateProgress,
      toast,
      validateSecureRandom,
      secureCleanup,
    ]
  );

  const stopGeneration = useCallback(() => {
    shouldStopRef.current = true;

    // Calculate elapsed time immediately and ensure minimum 1s
    const currentTime = Date.now();
    if (startTimeRef.current > 0) {
      const elapsedSeconds = Math.floor(
        (currentTime - startTimeRef.current) / 1000
      );
      // Ensure minimum 1 second for user feedback
      stopTimeRef.current = Math.max(elapsedSeconds, 1);
    } else {
      stopTimeRef.current = 1; // Fallback
    }

    // Adresy znalezione do tej pory zostaja na ekranie. Wczesniej ta funkcja
    // kasowala results, ale petla generujaca wpisywala je z powrotem zaraz po
    // wyjsciu - netto klucze znikaly i pojawialy sie ponownie. Skoro trafienie
    // na wzorzec potrafi trwac godziny, czyszczenie wyniku przy Stopie byloby
    // po prostu utrata danych.
    setState((prev) => ({ ...prev, shouldStop: true }));

    // Tu zatrzymujemy tylko licznik czasu. Reszte stanu (isGenerating,
    // podsumowanie) domyka petla, ktora przerwie sie przy najblizszej
    // iteracji, bo sprawdza shouldStopRef za kazdym obrotem.
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Bez parametrow: funkcja idzie prosto w onClick, wiec kazdy argument
  // opcjonalny dostalby event myszy zamiast wynikow.
  const downloadResults = useCallback(() => {
    const resultsToDownload = state.results ?? [];

    if (resultsToDownload.length === 0) {
      if (toast) {
        toast.error("Download failed", "No valid results to download!");
      }
      return;
    }

    const content = buildResultsFile(resultsToDownload, state.summary);

    triggerDownload(content);

    // Show success message
    if (toast) {
      toast.success(
        "Download completed!",
        `Successfully downloaded ${resultsToDownload.length} address${
          resultsToDownload.length > 1 ? "es" : ""
        } to file.`
      );
    }
  }, [state.results, state.summary, toast]);

  return {
    isGenerating: state.isGenerating,
    results: state.results,
    progress: state.progress,
    startGeneration,
    stopGeneration,
    downloadResults,
  };
}
