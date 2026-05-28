"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  message?: string | null;
  type?: "success" | "error" | "info" | "warning" | null;
};

export function AdminEventsToast({ message, type }: Props) {
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message) return;

    const t = type ?? "success";
    const key = `${t}:${message}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    if (t === "error") toast.error(message);
    else if (t === "info") toast.info(message);
    else if (t === "warning") toast.warning(message);
    else toast.success(message);
  }, [message, type]);

  return null;
}

