"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--cream)",
          "--normal-text": "var(--brown)",
          "--normal-description": "var(--brown)",
          "--normal-border": "oklch(from var(--brown) l c h / 18%)",
          "--success-bg": "var(--cream)",
          "--success-text": "var(--brown)",
          "--success-description": "var(--brown)",
          "--success-border": "var(--tan)",
          "--info-bg": "var(--cream)",
          "--info-text": "var(--brown)",
          "--info-description": "var(--brown)",
          "--info-border": "var(--till)",
          "--warning-bg": "var(--sand)",
          "--warning-text": "var(--brown)",
          "--warning-description": "var(--brown)",
          "--warning-border": "var(--khaki)",
          "--error-bg": "var(--cream)",
          "--error-text": "var(--destructive)",
          "--error-description": "var(--brown)",
          "--error-border": "var(--destructive)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border shadow-2xl shadow-brown/15 font-googlesansflex",
          title: "text-sm font-semibold",
          description: "text-sm text-brown! opacity-100!",
          actionButton: "bg-brown text-cream",
          cancelButton: "bg-tan text-brown",
          closeButton: "bg-cream text-brown border-brown/20",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
