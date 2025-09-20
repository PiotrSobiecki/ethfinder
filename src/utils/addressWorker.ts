// Web Worker for address generation
import { ethers } from "ethers";

export interface WorkerMessage {
  type: "generate" | "stop";
  payload?: {
    batchSize: number;
    prefix: string;
    suffix: string;
  };
}

export interface WorkerResponse {
  type: "batch" | "complete" | "error";
  payload: {
    addresses?: Array<{
      address: string;
      privateKey: string;
    }>;
    checked?: number;
    error?: string;
  };
}

// Main worker function
self.onmessage = function (e: MessageEvent<WorkerMessage>) {
  const { type, payload } = e.data;

  if (type === "generate" && payload) {
    const { batchSize, prefix, suffix } = payload;

    try {
      const batch = [];

      for (let i = 0; i < batchSize; i++) {
        // Generate random wallet
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const privateKey = wallet.privateKey.slice(2);

        // Check pattern
        const addressLower = address.toLowerCase();
        const prefixCheck =
          !prefix || addressLower.startsWith("0x" + prefix.toLowerCase());
        const suffixCheck =
          !suffix || addressLower.endsWith(suffix.toLowerCase());

        if (prefixCheck && suffixCheck) {
          batch.push({ address, privateKey });
        }
      }

      // Send batch result
      const response: WorkerResponse = {
        type: "batch",
        payload: {
          addresses: batch,
          checked: batchSize,
        },
      };

      self.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        type: "error",
        payload: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };

      self.postMessage(response);
    }
  }
};

export {};
