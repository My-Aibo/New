"use client";

import { AlertTriangle, XCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type AlertVariant = "error" | "warning" | "success" | "info";

interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Reusable alert component for displaying error, warning, info, and success messages
 */
export function Alert({
  title,
  message,
  variant = "info",
  className,
  dismissible = false,
  onDismiss
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const variantStyles: Record<AlertVariant, string> = {
    error: "bg-red-50 text-red-900 border-red-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
  };

  const variantIcon = {
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex items-start gap-3",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0">
        {variantIcon[variant]}
      </div>
      <div className="flex-1">
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>
      {dismissible && (
        <button
          type="button"
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
