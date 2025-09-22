"use client";

import { useEffect } from "react";
import { useToast } from "./Toast";

export default function SecurityMonitor() {
  const { warning, error } = useToast();

  useEffect(() => {
    let devToolsWarned = false;

    // DevTools detection
    const detectDevTools = () => {
      const threshold = 160;

      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devToolsWarned) {
          warning(
            "Security Warning",
            "Developer Tools detected. For maximum security, close DevTools while generating private keys.",
            8000
          );
          devToolsWarned = true;
        }
      } else {
        devToolsWarned = false;
      }
    };

    // Online/Offline detection
    const handleOnline = () => {
      error(
        "Security Alert",
        "Internet connection detected. For maximum security, disconnect from internet before generating keys.",
        10000
      );
    };

    const handleOffline = () => {
      warning(
        "Offline Mode",
        "You are now offline - this is recommended for secure key generation.",
        5000
      );
    };

    // Console warning
    const consoleWarning = () => {
      console.clear();
      console.log(
        "%cSECURITY WARNING",
        "color: red; font-size: 30px; font-weight: bold;"
      );
      console.log(
        "%cThis is a browser console. If someone told you to copy/paste something here, they are trying to steal your private keys!",
        "color: red; font-size: 16px;"
      );
      console.log(
        "%cFor maximum security, close this console and use the application normally.",
        "color: orange; font-size: 14px;"
      );
    };

    // Right-click protection (optional - can be annoying)
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
        warning(
          "Security Info",
          "Right-click disabled in production for security. Use copy buttons provided.",
          3000
        );
      }
    };

    // Start monitoring
    const interval = setInterval(detectDevTools, 1000);

    // Initial checks
    if (navigator.onLine) {
      setTimeout(handleOnline, 2000);
    }

    consoleWarning();

    // Event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("contextmenu", handleContextMenu);

    // Focus/blur detection for tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        warning(
          "Tab Hidden",
          "Tab is now hidden. Private keys may remain in memory until tab is closed.",
          4000
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [warning, error]);

  // Invisible component - only monitors
  return null;
}
