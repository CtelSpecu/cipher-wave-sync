import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { createFhevmInstance } from "./index";
import type { FhevmInstance } from "./index";

interface UseFhevmOptions {
  chainId: number;
  gatewayUrl?: string;
}

export const useFhevm = (options: UseFhevmOptions) => {
  const { chainId, gatewayUrl } = options;
  const publicClient = usePublicClient();

  const [instance, setInstance] = useState<FhevmInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<string>("idle");

  const initInstance = useCallback(async () => {
    if (!publicClient || !chainId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const abortController = new AbortController();

    try {
      // Global kill-switch via env (default disabled for dev unless explicitly enabled)
      const enableFhevm = (import.meta as any).env?.VITE_ENABLE_FHEVM === 'true';
      const isLocalNetwork = chainId === 31337 || chainId === 1337;
      if (!enableFhevm || isLocalNetwork) {
        // Skip SDK init on local networks or when disabled; app can still function in demo mode
        setInstance(null);
        setStatus("ready");
        return;
      }

      // Get provider from wagmi
      const provider = publicClient.transport;

      const fhevmInstance = await createFhevmInstance({
        provider: provider.url || "http://localhost:8545",
        chainId,
        gatewayUrl, // let internal defaults handle testnets; avoid forcing localhost
        signal: abortController.signal,
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
      });

      setInstance(fhevmInstance);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to initialize FHEVM:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }

    return () => {
      abortController.abort();
    };
  }, [publicClient, chainId, gatewayUrl]);

  useEffect(() => {
    initInstance();
  }, [initInstance]);

  return {
    instance,
    isLoading,
    error,
    status,
    reinit: initInstance,
  };
};
