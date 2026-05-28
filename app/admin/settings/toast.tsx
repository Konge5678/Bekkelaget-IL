"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  message?: string | null;
  type?: "success" | "error" | "info" | "warning" | null;
};

export function AdminSettingsToast({ message, type }: Props) {
  useEffect(() => {
    if (!message) return;

    const t = type ?? "success";
    if (t === "error") toast.error(message);
    else if (t === "info") toast.info(message);
    else if (t === "warning") toast.warning(message);
    else toast.success(message);
  }, [message, type]);

  return null;
}

