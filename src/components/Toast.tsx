"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto close
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIconStyles = () => {
    switch (toast.type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 w-full md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-4xl
        transition-all duration-300 ease-in-out z-50
        ${
          isVisible && !isLeaving
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }
      `}
    >
      <div
        className={`
          border-l-4 p-4 shadow-lg w-full
          ${getToastStyles()}
        `}
      >
        <div className="flex items-start max-w-4xl mx-auto">
          <div className={`flex-shrink-0 ${getIconStyles()}`}>{getIcon()}</div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold">{toast.title}</h3>
            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-4xl z-50 pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(-${index * 10}px)`,
              zIndex: 50 - index,
            }}
          >
            <Toast toast={toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    type: ToastMessage["type"],
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (title: string, message: string, duration?: number) =>
    showToast("success", title, message, duration);

  const error = (title: string, message: string, duration?: number) =>
    showToast("error", title, message, duration);

  const info = (title: string, message: string, duration?: number) =>
    showToast("info", title, message, duration);

  const warning = (title: string, message: string, duration?: number) =>
    showToast("warning", title, message, duration);

  return {
    toasts,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
